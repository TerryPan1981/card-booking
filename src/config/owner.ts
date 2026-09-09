/**
 * 👤 這個系統是誰的 —— 從這裡改，只改這一個檔
 *
 * 名片頁、預約表單、通知信、日曆邀請 全都讀這裡。
 *
 * ⚠️ 這個檔會進 Git。手機與 Email 填進去等於公開在網路上
 *    （名片本來就是要給人看的，但你如果不想被爬蟲收割，
 *      可以改成讀環境變數：process.env.OWNER_PHONE 之類）。
 *
 * ──────────────────────────────────────────────────────────
 * 已由阿睿拍板（2026-09-09）：
 *   ・加盟店名稱用「板橋特區」（依 1150907 面紙印刷稿），不改。
 *   ・LINE 用 LINE ID「dilterry」，不是電話號碼。
 * ──────────────────────────────────────────────────────────
 */

export const OWNER = {
  /** 你的名字（正式全名，出現在通知信署名與日曆邀請） */
  name: "潘睿豐",
  /** 慣用稱呼（客戶怎麼叫你，出現在文案裡：「阿睿會與您聯繫」） */
  alias: "阿睿",
  /** 頭銜 */
  title: "台灣房屋 板橋特區特許加盟店 襄理",
  /** 手機（顯示用，含分隔線） */
  phone: "0953-357-220",
  /** 手機（純數字，撥號連結用） */
  phoneRaw: "0953357220",
  /** LINE ID（加好友連結用，不是電話號碼） */
  lineId: "dilterry",
  /** 聯絡信箱（客戶回信會到這裡）※ 對外用 yahoo 這組，不是登入用的 gmail */
  email: "a10210601@yahoo.com.tw",
  /** 公司地址（「公司面談」這個選項會顯示它） */
  address: "新北市板橋區華江一路 508 號",
  /** 公司／品牌名 */
  company: "台灣房屋 板橋特區特許加盟店",
  /** 大頭照放 public/card/ 底下 */
  photoUrl: "/card/owner.jpg",
  /** 一句話介紹自己 */
  slogan:
    "入行前做了 12 年室內設計與工程，所以我看房子是市場跟工程兩層一起看。專營板橋江翠北側重劃區。",
} as const;

/** 社群連結 —— 用不到的留空字串，畫面會自動不顯示 */
export const SOCIAL = {
  line: `https://line.me/R/ti/p/~${OWNER.lineId}`,
  fb: "", // TODO 阿睿：把「房仲好鄰居－阿睿」粉專網址貼進來
  yt: "",
  ig: "",
} as const;

/** LINE 加好友 QR 圖（放 public/card/ 底下）。null = 不顯示 QR 區 */
export const LINE_QR: string | null = "/card/line-qr.png";

/** 網站網址（通知信裡的連結、Open Graph 用） */
export const SITE_URL = process.env.APPOINTMENT_BASE_URL || "http://localhost:3000";
