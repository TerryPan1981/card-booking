# 上線步驟（潘睿豐 房仲好鄰居－阿睿）

> 這份是「照著做就會活」的清單。每一步做完都有可以驗證的東西，不要跳步。

---

## 先搞懂一件事：為什麼不能放 GitHub Pages

| | 像什麼 | 放得下嗎 |
|---|---|---|
| 個人官網 | 貼在店頭櫥窗的海報，貼上去就有得看 | ✅ GitHub Pages |
| 這套預約系統 | 有人在顧的櫃檯＋一本客戶登記簿，要有人接、要有地方寫 | ❌ 要 Vercel |

GitHub Pages 只是一面櫥窗牆。預約系統要收客戶填的表、要寫進 TiDB 那本登記簿，
所以得另外租一個能營業的店面 —— Vercel，免費方案就夠。

---

## Step 1　把程式碼放上 GitHub

本機已經 commit 好了。你在自己的終端機跑一次登入：

```
gh auth login
```

選 `GitHub.com` → `HTTPS` → `Login with a web browser`，照著做完。

登入之後告訴 Claude，剩下的推送 Claude 可以代跑。

---

## Step 2　在 Vercel 建專案

1. 到 <https://vercel.com/> 用 **GitHub 帳號**登入（不用另外註冊）
2. `Add New...` → `Project` → 選 `card-booking` 這個 repo（Vercel 專案名為 `terry-booking`） → `Import`
3. **先不要按 Deploy**，先展開 `Environment Variables`，把下面四個貼進去

| Name | Value |
|---|---|
| `DATABASE_URL` | 你的 TiDB 連線字串（`mysql://...?sslaccept=strict`） |
| `APPOINTMENT_BASE_URL` | 先填 `http://localhost:3000`，第一次部署完再改 |
| `APPOINTMENT_TOKEN_SECRET` | `e7f40d102345905b201c3cc83663970cfa654f1f0a1af5e441f18a8dee194abf` |
| `APPOINTMENT_ADMIN_EMAIL` | `a10210601@yahoo.com.tw` |

> 💡 **連線字串直接貼在 Vercel 這裡就好。**
> 你本機 `.env.local` 那個壞掉的第一行，不影響上線，只影響你在自己電腦上測試。

4. 按 `Deploy`，等 2～3 分鐘

---

## Step 3　回填正式網址

部署完 Vercel 會給你一個網址，長得像 `https://card-booking-xxxx.vercel.app`。

回到 `Settings` → `Environment Variables`，把 `APPOINTMENT_BASE_URL` 改成那個網址，
然後 `Deployments` → 最新那筆 → `⋯` → `Redeploy`。

**這一步不能跳。** 這個值是「確認信裡的連結要指去哪裡」，
填錯的話客戶收到的改期／取消連結會指回 localhost，等於死連結。

---

## Step 4　驗收（自己點一遍）

| 網址 | 應該看到 |
|---|---|
| `/card` | 你的電子名片，照片、頭銜、加 LINE 按鈕 |
| `/card/booking` | 預約表單，能一路選到時段 |
| `/admin/appointments` | 應該顯示「權限不足」（正常，見下方） |

**送一筆測試預約**，然後去 TiDB 後台看 `appointment` 表有沒有那筆資料。
有 = 整條路通了。

---

## Step 5　把預約網址接到官網

告訴 Claude 你的 Vercel 網址，Claude 會把它填進
`潘睿豐房仲網站/script.js` 的 `BOOKING_URL`，
官網預約區塊的「線上預約看屋」按鈕就會自動出現。

---

## 之後才要處理的（先上線沒關係）

### 後台登入
`/admin/appointments` 現在會擋所有人（包含你自己）。這是**故意的**，
程式在沒設白名單時一律不放行，不是漏洞。

要讓自己進得去，得再設 `AUTH_GOOGLE_ID`／`AUTH_GOOGLE_SECRET`／`ADMIN_EMAILS`，
那需要去 Google Cloud 申請一組 OAuth 憑證。在那之前，
預約資料你可以直接在 TiDB 後台看。

### 防機器人（Turnstile）
`TURNSTILE_SECRET_KEY` 沒設 = 沒有防護。剛上線流量小沒差，
但只要網址開始有人分享，就會開始收到灌爆的假預約。
到 Cloudflare 申請 Turnstile（免費）拿兩把 key 補上。

### 通知信與 LINE 推播
**目前刻意全部關閉。** 沒設 `RESEND_API_KEY` = 不會寄任何信，
沒設 LINE channel = 不會發任何訊息。
要開之前先想清楚：客戶會收到署名你的信，那是對外發送。

---

## 出事時看哪裡

| 症狀 | 多半是 |
|---|---|
| 選時段轉圈圈 / 說「暫時不開放」 | `DATABASE_URL` 錯或 TiDB 睡著了 |
| 確認信連結指回 localhost | `APPOINTMENT_BASE_URL` 忘了改 |
| 後台顯示「權限不足」 | 正常，還沒設 `AUTH_*` |
| 頁面整個掛掉 | 去 Vercel 的 `Logs` 看紅字 |

---

## 實際部署資訊（2026-09-10）

| 項目 | 值 |
|---|---|
| GitHub repo | `TerryPan1981/card-booking` |
| Vercel 專案 | `terry-booking`（Team: terry，Hobby 免費方案） |
| 資料庫 | TiDB Cloud Starter，Instance `Terry`，Tokyo，database `test` |

Vercel 只會在 `main` 分支收到新 commit 時才重新部署。
手動想重跑：Vercel → Deployments → 最新那筆 → `⋯` → `Redeploy`。

### 密碼輪替紀錄
- 2026-09-10：TiDB 密碼已輪替一次，Vercel 的 `DATABASE_URL` 同步更新。
  `APPOINTMENT_BASE_URL` 同時由 `http://localhost:3000` 改為 `https://terry-booking.vercel.app`。
  ⚠️ 改完環境變數一定要重新部署（推 commit 到 main，或 Deployments → `⋯` → Redeploy），否則不會生效。
