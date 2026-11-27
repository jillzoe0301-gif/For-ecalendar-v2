import { createClient } from "npm:@supabase/supabase-js@2.46.1";
import * as webpush from "jsr:@negrel/webpush@0.5.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json; charset=utf-8",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const PUBLISHABLE_KEYS = JSON.parse(Deno.env.get("SUPABASE_PUBLISHABLE_KEYS") || "{}");
const SECRET_KEYS = JSON.parse(Deno.env.get("SUPABASE_SECRET_KEYS") || "{}");
const SUPABASE_ANON_KEY = PUBLISHABLE_KEYS.default || Deno.env.get("SUPABASE_ANON_KEY") || "";
const SUPABASE_SERVICE_ROLE_KEY = SECRET_KEYS.default || Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const VAPID_CONTACT = Deno.env.get("VAPID_CONTACT") || "https://github.com/jillzoe0301-gif/For-ecalendar-v2";

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: corsHeaders });
}

function getServiceClient() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Supabase server credentials are not configured.");
  }
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function getUserClient(token: string) {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error("Supabase client credentials are not configured.");
  }
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

async function getVapidConfig() {
  const raw = Deno.env.get("VAPID_KEYS_JSON");
  if (!raw) {
    const error = new Error("VAPID_KEYS_JSON is not configured.");
    (error as Error & { code?: string }).code = "PUSH_VAPID_NOT_CONFIGURED";
    throw error;
  }
  const exported = JSON.parse(raw);
  const vapidKeys = await webpush.importVapidKeys(exported, { extractable: false });
  const publicKey = await webpush.exportApplicationServerKey(vapidKeys);
  const applicationServer = await webpush.ApplicationServer.new({
    contactInformation: VAPID_CONTACT,
    vapidKeys,
  });
  return { publicKey, applicationServer };
}

async function getAuthenticatedContext(req: Request) {
  const authorization = req.headers.get("Authorization") || "";
  const token = authorization.replace(/^Bearer\s+/i, "").trim();
  if (!token) throw new Error("Missing bearer token.");

  const userClient = getUserClient(token);
  const { data, error } = await userClient.auth.getUser(token);
  if (error || !data?.user) throw new Error("Invalid or expired session.");

  const service = getServiceClient();
  const { data: profile, error: profileError } = await service
    .from("profiles")
    .select("profile_id, staff_id, name, role, status, deleted_at")
    .eq("profile_id", data.user.id)
    .maybeSingle();

  if (profileError) throw profileError;
  if (!profile || profile.deleted_at || ["停用", "離職", "已刪除"].includes(String(profile.status || ""))) {
    throw new Error("This FOR-e account is inactive.");
  }

  return { user: data.user, profile, userClient, service };
}

function validateEndpoint(endpoint: string) {
  let parsed: URL;
  try {
    parsed = new URL(endpoint);
  } catch {
    throw new Error("Invalid push endpoint.");
  }
  const host = parsed.hostname.toLowerCase();
  const allowed =
    host === "fcm.googleapis.com" ||
    host.endsWith(".push.apple.com") ||
    host.endsWith(".mozilla.com") ||
    host.endsWith(".notify.windows.com");
  if (parsed.protocol !== "https:" || !allowed) {
    throw new Error("Unsupported push endpoint host.");
  }
  return parsed.toString();
}

function validSubscription(value: any) {
  if (!value || typeof value !== "object") return false;
  if (typeof value.endpoint !== "string" || !value.keys) return false;
  if (typeof value.keys.p256dh !== "string" || typeof value.keys.auth !== "string") return false;
  return value.endpoint.length <= 4096 && value.keys.p256dh.length <= 256 && value.keys.auth.length <= 256;
}

async function sendToSubscription(applicationServer: InstanceType<typeof webpush.ApplicationServer>, row: any, payload: Record<string, unknown>) {
  const subscription = {
    endpoint: row.endpoint,
    keys: { p256dh: row.p256dh, auth: row.auth },
  };
  const subscriber = applicationServer.subscribe(subscription);
  await subscriber.pushTextMessage(JSON.stringify(payload), { ttl: 3600 });
}

function safeNotificationText(value: unknown, max = 100) {
 return String(value || "").replace(/[A-Z][0-9]{8,9}/gi,"[證件已隱藏]").replace(/\b\d{8,}\b/g,"[號碼已隱藏]").replace(/\s+/g," ").trim().slice(0,max);
}
async function handleRequest(req: Request) {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed." }, 405);

  let context;
  try {
    context = await getAuthenticatedContext(req);
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : String(error) }, 401);
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid JSON body." }, 400);
  }

  const action = String(body?.action || "");
  const { user, profile, service, userClient } = context;

  try {
    if (action === "public-key") {
      const { publicKey } = await getVapidConfig();
      return json({ publicKey });
    }

    if (action === "status") {
      const endpoint = String(body?.endpoint || "");
      if (!endpoint) return json({ subscribed: false, permissionManagedByBrowser: true });
      const { data, error } = await service
        .from("push_subscriptions")
        .select("is_enabled, notify_new_schedule, notify_schedule_updated, notify_schedule_cancelled, notify_escape, notify_transfer, notify_verification, notify_return, notify_meeting, device_label, last_seen_at")
        .eq("profile_id", user.id)
        .eq("endpoint", endpoint)
        .maybeSingle();
      if (error) throw error;
      return json({ subscribed: Boolean(data?.is_enabled), settings: data || null });
    }

    if (action === "subscribe") {
      const subscription = body?.subscription;
      if (!validSubscription(subscription)) return json({ error: "Invalid PushSubscription payload." }, 400);
      const endpoint = validateEndpoint(subscription.endpoint);
      const deviceLabel = String(body?.deviceLabel || "").slice(0, 160);
      const { error } = await service.from("push_subscriptions").upsert({
        profile_id: user.id,
        endpoint,
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
        device_label: deviceLabel || null,
        is_enabled: true,
        last_seen_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }, { onConflict: "endpoint" });
      if (error) throw error;
      return json({ ok: true, subscribed: true });
    }

    if (action === "unsubscribe") {
      const endpoint = validateEndpoint(String(body?.endpoint || ""));
      const { error } = await service.from("push_subscriptions")
        .delete()
        .eq("profile_id", user.id)
        .eq("endpoint", endpoint);
      if (error) throw error;
      return json({ ok: true, subscribed: false });
    }

    if (action === "update-settings") {
      const endpoint = validateEndpoint(String(body?.endpoint || ""));
      const settings = body?.settings || {};
      const allowedKeys = ["notify_new_schedule", "notify_schedule_updated", "notify_schedule_cancelled", "notify_escape", "notify_transfer", "notify_verification", "notify_return", "notify_meeting"];
      const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
      for (const key of allowedKeys) {
        if (typeof settings[key] === "boolean") patch[key] = settings[key];
      }
      const { data, error } = await service.from("push_subscriptions")
        .update(patch)
        .eq("profile_id", user.id)
        .eq("endpoint", endpoint)
        .select("push_subscription_id")
        .maybeSingle();
      if (error) throw error;
      if (!data) return json({ error: "Subscription not found for this device." }, 404);
      return json({ ok: true });
    }

    if (action === "test") {
      const endpoint = validateEndpoint(String(body?.endpoint || ""));
      const { data: row, error } = await service.from("push_subscriptions")
        .select("endpoint, p256dh, auth, is_enabled")
        .eq("profile_id", user.id)
        .eq("endpoint", endpoint)
        .maybeSingle();
      if (error) throw error;
      if (!row?.is_enabled) return json({ error: "This device is not subscribed." }, 404);

      const { applicationServer } = await getVapidConfig();
      try {
        await sendToSubscription(applicationServer, row, {
          title: "FOR-e｜推播測試",
          body: "推播設定成功！此裝置已可接收 FOR-e 重要行程通知。",
          url: "/",
          tag: "for-e-push-test",
        });
      } catch (error) {
        if (typeof (error as any)?.isGone === "function" && (error as any).isGone()) {
          await service.from("push_subscriptions").delete().eq("endpoint", endpoint);
        }
        throw error;
      }
      return json({ ok: true, sent: 1 });
    }

    if (action === "notify-schedule") {
      const scheduleId = String(body?.scheduleId || "");
      const eventType = String(body?.eventType || "");
      if (!scheduleId || !["created", "updated", "cancelled"].includes(eventType)) {
        return json({ error: "Invalid schedule notification request." }, 400);
      }

      const { data: schedule, error: scheduleError } = await service
        .from("schedules")
        .select("schedule_id, creator_profile_id, creator_staff_id, start_date, start_time, end_time, title, deleted_at, is_cancelled")
        .eq("schedule_id", scheduleId)
        .maybeSingle();
      if (scheduleError) throw scheduleError;
      if (!schedule || schedule.deleted_at) return json({ error: "Schedule not found." }, 404);

      const { data: assignees, error: assigneeError } = await service
        .from("schedule_assignees")
        .select("staff_id, assignee_type")
        .eq("schedule_id", scheduleId)
        .is("deleted_at", null);
      if (assigneeError) throw assigneeError;

      // Require existing application write authorization, then a server-recorded change
      // made by this authenticated actor. Client input cannot manufacture events.
      const { data: canWrite, error: permissionError } = await userClient.rpc("for_e_can_write_schedule_by_id", { target_schedule_id: scheduleId });
      if (permissionError || canWrite !== true) return json({ error: "Schedule notification not authorized." }, 403);
      const { data: recorded, error: eventError } = await service.from("push_schedule_events")
        .select("event_id, actor_profile_id, event_type, occurred_at, claimed_at")
        .eq("schedule_id", scheduleId)
        .order("occurred_at", { ascending: false })
        .order("event_id", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (eventError) throw eventError;
      if (!recorded || recorded.actor_profile_id !== user.id || recorded.event_type !== eventType ||
          recorded.claimed_at || Date.now() - Date.parse(recorded.occurred_at) > 5 * 60 * 1000 ||
          (eventType === "cancelled") !== Boolean(schedule.is_cancelled)) {
        return json({ ok: true, sent: 0, skipped: "no-current-unclaimed-event" });
      }

      // Atomic claim: only one request can acquire this row, even across instances.
      const { data: claim, error: claimError } = await service.from("push_schedule_events")
        .update({ claimed_at: new Date().toISOString() })
        .eq("event_id", recorded.event_id).is("claimed_at", null)
        .select("event_id").maybeSingle();
      if (claimError) throw claimError;
      if (!claim) return json({ ok: true, sent: 0, skipped: "already-claimed" });

      const staffIds = [...new Set((assignees || [])
        .filter((item: any) => ["executor", "follow_up", "admin_notice"].includes(String(item.assignee_type || "executor")))
        .map((item: any) => String(item.staff_id || ""))
        .filter(Boolean))];
      if (!staffIds.length) return json({ ok: true, sent: 0, skipped: 0 });

      const { data: recipientProfiles, error: recipientError } = await service
        .from("profiles")
        .select("profile_id, staff_id, status, deleted_at")
        .in("staff_id", staffIds)
        .is("deleted_at", null);
      if (recipientError) throw recipientError;

      const recipientIds = [...new Set((recipientProfiles || [])
        .filter((item: any) => item.profile_id !== user.id && !["停用", "離職", "已刪除"].includes(String(item.status || "")))
        .map((item: any) => String(item.profile_id)))];
      if (!recipientIds.length) return json({ ok: true, sent: 0, skipped: 0 });

      const preferenceColumn = eventType === "created"
        ? "notify_new_schedule"
        : eventType === "updated"
          ? "notify_schedule_updated"
          : "notify_schedule_cancelled";

      const { data: subscriptions, error: subscriptionError } = await service
        .from("push_subscriptions")
        .select("endpoint, p256dh, auth, profile_id, notify_new_schedule, notify_schedule_updated, notify_schedule_cancelled")
        .in("profile_id", recipientIds)
        .eq("is_enabled", true);
      if (subscriptionError) throw subscriptionError;

      const eligible = (subscriptions || []).filter((row: any) => row[preferenceColumn] !== false);
      if (!eligible.length) return json({ ok: true, sent: 0, skipped: recipientIds.length });

      const { applicationServer } = await getVapidConfig();
      const dateText = schedule.start_date || "";
      const title = eventType === "created"
        ? "FOR-e｜新行程指派"
        : eventType === "updated"
          ? "FOR-e｜行程已更新"
          : "FOR-e｜行程已取消";
      const bodyText = eventType === "created"
        ? "您有一筆新的行程指派，請開啟 FOR-e 查看。"
        : eventType === "updated"
          ? "您被指派的行程內容已有調整，請開啟 FOR-e 查看。"
          : "您被指派的行程已取消，請開啟 FOR-e 確認。";
      const payload = {
        title,
        body: [safeNotificationText(schedule.title, 100) || bodyText, [dateText, schedule.start_time?.slice(0,5), schedule.end_time ? "–"+schedule.end_time.slice(0,5) : ""].filter(Boolean).join(" ")].filter(Boolean).join("\n"),
        url: "/",
        tag: `for-e-event-${recorded.event_id}`,
        data: { scheduleId },
      };

      let sent = 0;
      let failed = 0;
      let removed = 0;
      const results = await Promise.all((eligible as any[]).map(async row => {
        try {
          await sendToSubscription(applicationServer, row, payload);
          sent += 1;
        } catch (error) {
          if (typeof (error as any)?.isGone === "function" && (error as any).isGone()) {
            const { error: deleteError } = await service.from("push_subscriptions").delete().eq("endpoint", row.endpoint);
            if (!deleteError) removed += 1;
          } else {
            failed += 1;
            console.warn("FOR-e push delivery failed");
          }
        }
      }));
      return json({ ok: true, sent, failed, removed, skipped: recipientIds.length - eligible.length });
    }

    return json({ error: "Unknown action." }, 400);
  } catch (error) {
    const code = (error as any)?.code || "";
    const status = code === "PUSH_VAPID_NOT_CONFIGURED" ? 503 : 500;
    console.error("for-e-push error:", code || "internal_error");
    return json({
      error: status === 503 ? "Push service is not configured." : "Push service request failed.",
      code,
    }, status);
  }
}

Deno.serve(handleRequest);
