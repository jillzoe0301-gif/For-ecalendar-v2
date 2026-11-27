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
  let stage="read";
  try {
  const raw = Deno.env.get("VAPID_KEYS_JSON");
  if (!raw) {
    const error = new Error("VAPID_KEYS_JSON is not configured.");
    (error as Error & { code?: string }).code = "PUSH_VAPID_NOT_CONFIGURED";
    throw error;
  }
  stage="parse";
  // Normalize dotenv quoting and escaped JSON without exposing its contents.
  let exported: any;
  const trimmed=raw.trim();
  const candidates=[trimmed];
  if ((trimmed.startsWith('"')&&trimmed.endsWith('"'))||(trimmed.startsWith("'")&&trimmed.endsWith("'"))) candidates.push(trimmed.slice(1,-1));
  for(const value of [...candidates]) if(value.includes('\\\"'))candidates.push(value.replaceAll('\\\"','"'));
  for(const candidate of candidates){
    try { let value=JSON.parse(candidate); if(typeof value==="string")value=JSON.parse(value); if(value?.publicKey&&value?.privateKey){exported=value;break;} } catch (_) {}
  }
  if (!exported?.publicKey || !exported?.privateKey) throw new Error("Invalid VAPID key format.");
  // Web Push needs to export the public point; keep the signing key non-extractable.
  stage="import";
  const algorithm = { name: "ECDSA", namedCurve: "P-256" };
  const vapidKeys = {
    publicKey: await crypto.subtle.importKey("jwk", exported.publicKey, algorithm, true, ["verify"]),
    privateKey: await crypto.subtle.importKey("jwk", exported.privateKey, algorithm, false, ["sign"]),
  };
  stage="export";
  const publicKey = await webpush.exportApplicationServerKey(vapidKeys);
  stage="server";
  const applicationServer = await webpush.ApplicationServer.new({
    contactInformation: VAPID_CONTACT,
    vapidKeys,
  });
  return { publicKey, applicationServer };
 } catch (_) { throw Object.assign(new Error("VAPID initialization failed"), {code:"VAPID_"+stage}); }
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
async function handleDigest(req: Request) {
 if(req.method!=="POST")return json({error:"Method not allowed"},405);
 const token=req.headers.get("x-for-e-scheduler")||"";
 if(token.length<40||token.length>128)return json({error:"Unauthorized"},401);
 try{
  const service=getServiceClient();
  const {data:authorized,error:authError}=await service.rpc("for_e_push_digest_authorized",{p_token:token});
  if(authError||authorized!==true)return json({error:"Unauthorized"},401);
  const diagnostic=await req.json().catch(()=>({}));
  if(diagnostic.action==="health"){try{await getVapidConfig();return json({ok:true,stage:"ready"});}catch(e){return json({ok:false,stage:(e as any).code||"unknown"},503);}}
  const parts=new Intl.DateTimeFormat("en-CA",{timeZone:"Asia/Taipei",year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).formatToParts(new Date());
  const part=(type:string)=>parts.find(x=>x.type===type)?.value||"";
  const day=part("year")+"-"+part("month")+"-"+part("day");
  if(part("hour")!=="08"||Number(part("minute"))<30||Number(part("minute"))>40)return json({ok:true,skipped:"outside-window"});
  const {data:items,error}=await service.rpc("for_e_push_digest_items");
  if(error)throw error;
  const grouped=new Map<string,any[]>();
  for(const item of items||[]){const key=String(item.subscription_id); if(!grouped.has(key))grouped.set(key,[]); grouped.get(key)!.push(item);}
  if(!grouped.size)return json({ok:true,sent:0});
  const {applicationServer}=await getVapidConfig();
  const labels:Record<string,string>={escape:"逃跑追蹤",transfer:"轉出追蹤",verification:"驗證提醒",return:"返台確認"};
  let sent=0,failed=0;
  for(const [id,entries] of grouped){
    const {data:sub,error:subError}=await service.from("push_subscriptions").select("endpoint,p256dh,auth,is_enabled,profile_id,device_label").eq("push_subscription_id",id).maybeSingle();
    if(subError)throw subError;
    if(!sub?.is_enabled||sub.profile_id!==entries[0].profile_id)continue;
    // Scheduled digest is for mobile devices only.
    if(!/Apple|Android/i.test(String(sub.device_label||"")))continue;
    const counts:Record<string,number>={};
    const meetings=entries.filter(x=>x.kind==="meeting").sort((a,b)=>String(a.start_time||"").localeCompare(String(b.start_time||"")));
    for(const entry of entries){if(labels[entry.kind])counts[entry.kind]=(counts[entry.kind]||0)+1;}
    const lines=Object.entries(counts).map(([kind,count])=>labels[kind]+" "+count+" 筆");
    if(meetings.length){lines.push("今日會議 "+meetings.length+" 場");for(const m of meetings.slice(0,4))lines.push([safeNotificationText(m.title,55)||"會議",m.start_time?.slice(0,5),m.end_time?"–"+m.end_time.slice(0,5):"",safeNotificationText(m.location,30)].filter(Boolean).join(" "));if(meetings.length>4)lines.push("另有 "+(meetings.length-4)+" 場，請開啟 FOR-e 查看");}
    if(!lines.length)continue;
    const {data:claim,error:claimError}=await service.from("push_daily_claims").upsert({subscription_id:id,reminder_day:day},{onConflict:"subscription_id,reminder_day",ignoreDuplicates:true}).select("subscription_id").maybeSingle();
    if(claimError)throw claimError;
    if(!claim)continue;
    try{validateEndpoint(sub.endpoint);await sendToSubscription(applicationServer,sub,{title:"FOR-e｜今日工作與會議提醒",body:lines.join("\n"),url:"/",tag:"for-e-daily-"+day});sent++;}
    catch(err){failed++;if(typeof (err as any)?.isGone==="function"&&(err as any).isGone())await service.from("push_subscriptions").delete().eq("push_subscription_id",id);}
  }
  return json({ok:true,sent,failed});
 }catch(_){console.error("FOR-e daily digest failed");return json({error:"Digest failed"},500);}
}
Deno.serve(handleDigest);
