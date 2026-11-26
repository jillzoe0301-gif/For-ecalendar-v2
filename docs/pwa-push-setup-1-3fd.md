# FOR-e Calendar V2｜PWA 推播通知 1-3fd

## 已建置
- Supabase Edge Function：`for-e-push`（JWT 驗證開啟）
- Supabase table：`public.push_subscriptions`
- RLS 已啟用；anon / authenticated 沒有直接讀寫權限；僅 service_role 可存取
- Service Worker 接收 push 並立即顯示通知；點擊通知會開啟 FOR-e
- 前端「通知設定」可啟用、測試、關閉此裝置推播及調整事件偏好
- 新增、修改、取消行程成功後呼叫 Edge Function 通知執行者
- 推播只包含通用文字與日期，不把客戶名稱、工人資料或行程內容放在鎖定畫面通知

## 一次性 VAPID 金鑰設定（必須完成）
Edge Function 已部署，但尚未設定 VAPID 私鑰，所以現在還不能真正送出推播。

在 Codespaces Terminal 執行：

```bash
cd /workspaces/For-ecalendar-v2
node scripts/generate-push-vapid.mjs
supabase secrets set --project-ref mpieaxgmbihmvgofluwz --env-file .env.push
```

若 Supabase CLI 要求登入，先執行 `supabase login`。Secrets 設定完成後，Edge Function 會直接讀取新 secrets，不需要重新部署 function。

**重要：**
- `.env.push` 含 VAPID 私鑰，已被 Git 忽略；不要提交、上傳或貼到聊天。
- VAPID 金鑰只產生一次並長期使用。不要每次部署重新產生，否則已訂閱裝置需重新訂閱。
- VAPID_CONTACT 是推播服務聯絡 URI，目前使用 FOR-e GitHub 專案網址。

## 使用方式
1. 部署前端 1-3fd 後，登入 FOR-e。
2. 點上方「通知設定」。
3. 點「啟用此裝置推播」，允許瀏覽器通知。
4. 點「傳送測試」，確認手機通知中心收到測試通知。
5. 勾選需要的通知類型，設定會自動儲存。

## iPhone 注意事項
- iOS / iPadOS 16.4 以上。
- 必須先透過 Safari「加入主畫面」安裝 PWA，再從主畫面的 FOR-e 圖示開啟。
- 必須由使用者點擊「啟用此裝置推播」後才會詢問通知權限。

## 第一批推播事件
- 新行程指派
- 行程修改
- 行程取消

目前不包含定時提醒、每日摘要、LINE 通知或服務紀錄單到期通知；避免第一階段過度打擾。後續可依需求增加個人安靜時段與通知類別。

## 安全
- 不將 Supabase secret key 或 VAPID 私鑰放入前端。
- 訂閱 endpoint / p256dh / auth 只由 Edge Function service_role 存取。
- Edge Function 驗證登入 JWT，並檢查建立者、執行者或管理角色後才可觸發行程推播。
- 無效的 404 / 410 推播 endpoint 會自動清除。
- 本次沒有修改 schedules、schedule_assignees，也沒有重建既有行程。
