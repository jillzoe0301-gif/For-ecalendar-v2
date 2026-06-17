import { createClient } from '@supabase/supabase-js'
import './style.css'

/* FOR-e V002-1K-1-3 START - build repair */
/* Repair: restore valid src/main.js top-level syntax after failed Vercel build. */
/* FOR-e V002-1K-1-3 END - build repair */

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || ''
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || ''
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
const SYSTEM_VERSION = 'V002-1P-75'

const pages = [
  { key: 'personalSchedule', label: '個人行程表', mobileLabel: '個人', roles: 'ALL', mobile: true },
  { key: 'personalTodo', label: '個人一般待辦', mobileLabel: '待辦', roles: 'ALL', mobile: true },
  { key: 'assignedTracking', label: '我指派的事項追蹤', mobileLabel: '指派', roles: 'ALL', mobile: true },
  { key: 'scheduleOverview', label: '行程總覽', mobileLabel: '行程', roles: 'ALL', mobile: true },
  { key: 'fieldSchedule', label: '外務行程', mobileLabel: '外務', roles: ['管理員', '主管', '行政 / 海外', '外務 / 宿管人員 / 會計'], mobile: true },
  { key: 'fieldDetail', label: '外務明細', mobileLabel: '明細', roles: ['管理員', '行政 / 海外'], mobile: false },
  { key: 'meetingRoom', label: '會議室預約', mobileLabel: '會議室', roles: ['管理員', '主管', '行政 / 海外', '外務 / 宿管人員 / 會計', '一般職員'], mobile: true },
  { key: 'incident', label: '異況追蹤', mobileLabel: '異況', roles: ['管理員', '主管', '行政 / 海外'], mobile: true },
  { key: 'search', label: '行程搜尋', mobileLabel: '搜尋', roles: ['管理員', '主管', '行政 / 海外'], mobile: false },
  { key: 'stats', label: '統計報表', mobileLabel: '統計', roles: ['管理員', '主管'], mobile: false },
  { key: 'serviceRecord', label: '服務紀錄單', mobileLabel: '紀錄', roles: ['管理員', '主管'], mobile: false },
  { key: 'recordSubmit', label: '紀錄單繳交', mobileLabel: '繳交', roles: ['翻譯'], mobile: true },
  { key: 'line', label: 'LINE 通知', mobileLabel: 'LINE', roles: ['管理員', '主管', '行政 / 海外', '翻譯', '外務 / 宿管人員 / 會計'], mobile: true },
  { key: 'color', label: '顏色設定', mobileLabel: '顏色', roles: ['管理員', '主管', '行政 / 海外', '翻譯', '外務 / 宿管人員 / 會計', '一般職員'], mobile: false },
  { key: 'options', label: '選項管理', mobileLabel: '選項', roles: ['管理員', '主管'], mobile: false },
  { key: 'audit', label: '異動紀錄', mobileLabel: '紀錄', roles: ['管理員', '主管', '行政 / 海外', '外務 / 宿管人員 / 會計'], mobile: false },
  { key: 'users', label: '人員 / 帳號', mobileLabel: '帳號', roles: ['管理員', '主管', '行政 / 海外', '翻譯', '外務 / 宿管人員 / 會計', '一般職員'], mobile: false },
  { key: 'health', label: '系統檢查', mobileLabel: '檢查', roles: ['管理員', '主管'], mobile: false }
]

const pageIconMap = {
  personalSchedule: '📅',
  personalTodo: '✅',
  assignedTracking: '📌',
  scheduleOverview: '🗓️',
  fieldSchedule: '🚗',
  fieldDetail: '📋',
  meetingRoom: '🏢',
  incident: '⚠️',
  search: '🔎',
  stats: '📊',
  serviceRecord: '📝',
  recordSubmit: '📤',
  line: '💬',
  color: '🎨',
  options: '⚙️',
  audit: '🧾',
  users: '👤',
  health: '🩺'
}

const pageImageIconMap = {
  personalSchedule: '/icons/nav/calendar-check.png',
  personalTodo: '/icons/nav/checklist.png',
  assignedTracking: '/icons/nav/assigned-document.png',
  scheduleOverview: '/icons/nav/grid.png',
  fieldSchedule: '/icons/nav/car.png',
  fieldDetail: '/icons/nav/field-detail-document.png',
  meetingRoom: '/icons/nav/calendar-clock.png',
  incident: '/icons/nav/alert-circle.png',
  search: '/icons/nav/search.png',
  stats: '/icons/nav/chart.png',
  serviceRecord: '/icons/nav/hand-heart.png',
  recordSubmit: '/icons/nav/hand-leaf.png',
  line: '/icons/nav/line.png',
  color: '/icons/nav/palette.png',
  options: '/icons/nav/settings.png',
  audit: '/icons/nav/note.png',
  users: '/icons/nav/user-frame.png',
  health: '/icons/nav/system-health.png'
}

function renderPageIcon(key) {
  const imagePath = pageImageIconMap[key]
  if (imagePath) {
    return `<img class="nav-icon-img" src="${imagePath}" alt="">`
  }
  return pageIconMap[key] || '•'
}

const formCategories = ['服務行程', '一般記事', '待辦事項', '請假 / 會議 / 活動 / 外訓', '證件交付']
const serviceScheduleTypes = [
  '面談', '上線 / 教育訓練', '定期 / 開會', '送工', '銀行', '醫療',
  '車禍處理', '結薪', '收送簽文件', '逃跑通知', '轉出追蹤',
  '住變資訊', '驗證提醒', '返台提醒', '宿舍', '其他'
]
const scheduleContentTemplates = [
  { type: '面談', content: '面談對象：\n面談原因：\n處理內容：\n後續追蹤：' },
  { type: '上線 / 教育訓練', content: '上線 / 教育訓練內容：\n參與人員：\n注意事項：' },
  { type: '定期 / 開會', content: '會議主題：\n參與人員：\n會議重點：\n待辦事項：' },
  { type: '送工', content: '送工人員：\n雇主 / 地點：\n送工狀況：\n需追蹤事項：' },
  { type: '銀行', content: '辦理項目：\n銀行名稱：\n辦理結果：\n需補件 / 追蹤：' },
  { type: '醫療', content: '就醫原因：\n醫院 / 診所：\n診療結果：\n下次回診：' },
  { type: '車禍處理', content: '事故狀況：\n處理進度：\n聯絡對象：\n後續追蹤：' },
  { type: '結薪', content: '結薪對象：\n結薪期間：\n結薪狀況：\n備註：' },
  { type: '收送簽文件', content: '文件項目：\n收 / 送件對象：\n處理結果：\n下次追蹤：' },
  { type: '逃跑通知', content: '逃跑狀況：\n通知對象：\n處理進度：\n下次追蹤：' },
  { type: '轉出追蹤', content: '轉出原因：\n轉出進度：\n聯絡對象：\n下次追蹤：' },
  { type: '住變資訊', content: '住變地址：\n搬遷狀況：\n租約 / 文件：\n下次追蹤：' },
  { type: '驗證提醒', content: '驗證項目：\n預計驗證日：\n需準備文件：\n下次追蹤：' },
  { type: '返台提醒', content: '返台人員：\n返台日期：\n班機資訊：\n需處理事項：' },
  { type: '宿舍', content: '宿舍地點：\n處理事項：\n處理結果：\n後續追蹤：' },
  { type: '其他', content: '辦理內容：\n處理結果：\n後續追蹤：' }
]
const todoItems = ['送件', '補件', '登記', '回覆', '追蹤', '重要事項!', '繳費']
const leaveMeetingTypes = ['請假', '返鄉', '會議', '外訓', '部門活動', '公司活動']
const meetingRoomOptions = ['第一會議室', '第二會議室', '大會議室', '小會議室']
const carOptions = [
  '不使用',
  'RDG-7626｜賴黃娟 113/12/09開始用',
  'RFB-6952｜吳氏何江 114/03/03開始使用',
  'RFB-6953｜阮氏芳 114/08/29開始用',
  'RFB-8733｜廖明珮 114/9/22開始使用',
  'RFE-0681｜賴育賢 112/12/18開始用',
  'RFE-0682｜黃氏玄莊 115/03/02開始用',
  'RFF-3563｜王愛珠',
  'RFL-0797｜黃思涵',
  'RFL-1780｜范武薔薇',
  'RFL-3935｜武俊平 114/02/11開始用',
  'RFL-3950｜范紅筠 113/09/23開始用',
  'RFL-5712｜暫時無人用 114/08/29開始用',
  'RFL-6162｜卓晶晶 115/05/25開始用',
  'RFS-7217｜陳恩文 114/09/12開始使用',
  'RFT-3072｜施明金 115/05/25開始使用',
  'RGE-6736｜鄧玉荀 115/05/26開始用'
]
const documentOptions = ['護照', '居留證', '健保卡', '印章', '其他']
const deliveryDocumentItems = ['護照', '居留證', '健保卡', '印章', '文件', '其他']
const fieldPurposeOptions = ['送件', '申請', '登記', '送審', '領件', '認證', '繳費', '外務日', '其他']
const fieldSpecialReminderOptions = ['必送件', '無法更換人員', '急件']
const incidentTypeOptions = ['逃跑', '轉出', '車禍', '醫療異況', '雇主反映', '工人反映', '宿舍異況', '文件異常', '其他']
const incidentUrgencyOptions = ['一般', '重要', '緊急', '立即處理']
const fieldLocationOptions = [{"name": "內湖_印辦", "address": "台北市內湖區瑞光路550號2樓"}, {"name": "內湖_菲辦", "address": "台北市內湖區洲子街55-57號2樓"}, {"name": "台北_越辦(領件只能下午)", "address": "臺北市中山區松江路101號2樓"}, {"name": "台北_越南換護照", "address": "臺北市中山區松江路65號2，3樓"}, {"name": "台北_泰辦", "address": "台北市大安區信義路三段151號 10 樓"}, {"name": "台北_勞動部", "address": "臺北市中正區中華路1段39號10樓"}, {"name": "桃園移民署", "address": "桃園市桃園區縣府路106號1樓"}, {"name": "中壢就業中心", "address": "桃園市中壢區新興路182號"}, {"name": "桃園就業中心", "address": "桃園市桃園區縣府路59號"}, {"name": "中和就業中心", "address": "新北市中和區景安路118號"}, {"name": "板橋就業中心", "address": "新北市板橋區漢生東路163號"}, {"name": "三重就業中心(不同仲介要不同天)", "address": "新北市三重區重新路四段12號"}, {"name": "新竹就業中心", "address": "新竹市光華東街56號"}, {"name": "竹北就業中心", "address": "新竹縣竹北市光明九路7-3號"}, {"name": "宜蘭羅東就業中心", "address": "宜蘭縣羅東鎮東榮路二段91號"}, {"name": "苗栗就業中心", "address": "苗栗市中山路558號"}, {"name": "新北移民署", "address": "新北市中和區民安街135號"}, {"name": "竹北移民署", "address": "新竹縣竹北市三民路133號1樓"}, {"name": "基隆移民署", "address": "基隆市中正區義一路18號11樓A棟"}, {"name": "新竹移民署", "address": "新竹市北區中華路三段12號1樓"}]
const weekdays = [
  ['MO', '週一'], ['TU', '週二'], ['WE', '週三'], ['TH', '週四'],
  ['FR', '週五'], ['SA', '週六'], ['SU', '週日']
]

const holidayMaps = {
  2026: {
    tw: {
      '2026-01-01': ['元旦'],
      '2026-02-16': ['除夕'],
      '2026-02-17': ['春節'],
      '2026-02-18': ['春節'],
      '2026-02-19': ['春節'],
      '2026-02-20': ['春節'],
      '2026-02-27': ['和平紀念日補假'],
      '2026-02-28': ['和平紀念日'],
      '2026-04-03': ['兒童節補假'],
      '2026-04-04': ['兒童節'],
      '2026-04-05': ['清明節'],
      '2026-04-06': ['清明節補假'],
      '2026-05-01': ['勞動節'],
      '2026-06-19': ['端午節'],
      '2026-09-25': ['中秋節'],
      '2026-09-28': ['教師節'],
      '2026-10-10': ['國慶日'],
      '2026-10-25': ['臺灣光復節'],
      '2026-10-26': ['臺灣光復節補假']
    },
    th: {
      '2026-01-01': ['泰國：元旦'],
      '2026-04-13': ['泰國：宋干節'],
      '2026-04-14': ['泰國：宋干節'],
      '2026-04-15': ['泰國：宋干節'],
      '2026-05-01': ['泰國：勞動節'],
      '2026-07-28': ['泰國：國王誕辰'],
      '2026-08-12': ['泰國：母親節'],
      '2026-10-13': ['泰國：蒲美蓬紀念日'],
      '2026-10-23': ['泰國：朱拉隆功紀念日'],
      '2026-12-05': ['泰國：父親節'],
      '2026-12-10': ['泰國：憲法日']
    },
    vn: {
      '2026-01-01': ['越南：元旦'],
      '2026-02-16': ['越南：春節'],
      '2026-02-17': ['越南：春節'],
      '2026-02-18': ['越南：春節'],
      '2026-02-19': ['越南：春節'],
      '2026-02-20': ['越南：春節'],
      '2026-04-30': ['越南：統一日'],
      '2026-05-01': ['越南：勞動節'],
      '2026-09-02': ['越南：國慶日']
    },
    ph: {
      '2026-01-01': ['菲律賓：元旦'],
      '2026-04-09': ['菲律賓：勇士節'],
      '2026-05-01': ['菲律賓：勞動節'],
      '2026-06-12': ['菲律賓：獨立日'],
      '2026-08-31': ['菲律賓：國家英雄日'],
      '2026-11-30': ['菲律賓：博尼法西奧日'],
      '2026-12-25': ['菲律賓：聖誕節'],
      '2026-12-30': ['菲律賓：黎剎日']
    },
    id: {
      '2026-01-01': ['印尼：元旦'],
      '2026-02-16': ['印尼：農曆新年'],
      '2026-03-19': ['印尼：開齋節'],
      '2026-03-20': ['印尼：開齋節'],
      '2026-05-01': ['印尼：勞動節'],
      '2026-05-27': ['印尼：古爾邦節'],
      '2026-08-17': ['印尼：獨立日'],
      '2026-12-25': ['印尼：聖誕節']
    }
  }
}

function getHolidayData(dateKey) {
  const year = Number(dateKey.slice(0, 4))
  const yearMap = holidayMaps[year] || {}
  const tw = yearMap.tw?.[dateKey] || []
  const overseas = [
    ...(yearMap.th?.[dateKey] || []),
    ...(yearMap.vn?.[dateKey] || []),
    ...(yearMap.ph?.[dateKey] || []),
    ...(yearMap.id?.[dateKey] || [])
  ]
  return { tw, overseas }
}

function isTaiwanHoliday(date) {
  const dateKey = toDateKey(date)
  const day = date.getDay()
  return day === 0 || day === 6 || getHolidayData(dateKey).tw.length > 0
}

function renderHolidayLabels(dateKey) {
  const holiday = getHolidayData(dateKey)
  const all = [
    ...holiday.tw.map(name => `<span class="holiday-label tw">${escapeHtml(name)}</span>`),
    ...holiday.overseas.map(name => `<span class="holiday-label overseas">${escapeHtml(name)}</span>`)
  ]
  return all.length ? `<div class="holiday-labels">${all.join('')}</div>` : ''
}



const reminderScheduleTypes = [
  '逃跑通知',
  '轉出追蹤',
  '住變資訊',
  '返台提醒',
  '驗證提醒',
  '追蹤提醒事項',
  '追蹤事項',
  '提醒事項',
  '待確認',
  '待通知',
  '下次追蹤',
  '住變提醒',
  '轉出通知',
  '返鄉提醒'
]

function isReminderSchedule(row) {
  if (!row) return false

  const text = [
    row.schedule_type,
    row.category,
    row.sub_type,
    row.title,
    row.description,
    row.sub_type_note
  ].filter(Boolean).join('｜')

  if (reminderScheduleTypes.some(type => text.includes(type))) return true

  const reminderKeywords = [
    '逃跑',
    '轉出',
    '住變',
    '返台',
    '驗證',
    '待確認',
    '待通知',
    '提醒事項',
    '追蹤提醒',
    '追蹤事項',
    '下次追蹤',
    '最後工作日',
    '聘僱終止日',
    '離境',
    '回診',
    '補件',
    '送件異常'
  ]

  return reminderKeywords.some(keyword => text.includes(keyword))
}

function isOverdueSchedule(row) {
  if (!row || !row.start_date) return false
  if (isNoCompletionControlSchedule(row)) return false
  return row.start_date < todayString() && row.status !== '已完成' && row.status !== '取消'
}

function isTodaySchedule(row) {
  return row?.start_date === todayString()
}

function getPersonalReminderRows() {
  return schedules
    .filter(row => isActivePersonalSchedule(row))
    .filter(row => isMine(row))
    .filter(row => isReminderSchedule(row))
    .filter(row => isTodaySchedule(row) || isOverdueSchedule(row))
    .sort((a, b) => {
      const aOverdue = isOverdueSchedule(a)
      const bOverdue = isOverdueSchedule(b)
      if (aOverdue !== bOverdue) return aOverdue ? -1 : 1
      return String(a.start_date || '').localeCompare(String(b.start_date || ''))
    })
}

function renderPersonalReminderArea() {
  const rows = getPersonalReminderRows()

  return `
    <section class="personal-reminder-area">
      <div class="reminder-area-title">
        <img src="/icons/reminder-notice.png" alt="提醒">
        <div>
          <strong>待確認 / 待通知提醒</strong>
          <span>逃跑、轉出、住變、返台、驗證與追蹤提醒事項</span>
        </div>
      </div>

      <div class="reminder-card-list">
        ${rows.length ? rows.map(row => {
          const overdue = isOverdueSchedule(row)
          return `
            <button type="button" class="reminder-alert-card ${overdue ? 'is-overdue' : 'is-today'}" data-view-schedule="${row.schedule_id}">
              <div class="reminder-alert-main">
                <div class="reminder-alert-title">${escapeHtml(row.schedule_type || row.category)}｜${escapeHtml(row.title || '-')}</div>
                <div class="reminder-alert-meta">
                  ${escapeHtml(row.start_date || '-')}｜${escapeHtml(formatTime(row))}｜${escapeHtml(getAssigneeNames(row))}
                </div>
                ${row.customer_name || row.location_name ? `<div class="reminder-alert-meta">${escapeHtml(row.customer_name || '')}${row.customer_name && row.location_name ? '｜' : ''}${escapeHtml(row.location_name || '')}</div>` : ''}
              </div>
              ${overdue ? `<div class="reminder-overdue-text">超過時間了!!!</div>` : `<div class="reminder-today-text">今日需處理</div>`}
            </button>
          `
        }).join('') : '<div class="reminder-empty-state">目前沒有待確認 / 待通知提醒。</div>'}
      </div>
    </section>
  `
}

let currentProfile = null
let currentPage = 'personalSchedule'
let schedules = []
let staffList = []
let allStaffList = []
let userProfileList = []
let userProfilesError = ''
let loadingSchedules = false
let schedulesError = ''
let saving = false
let appSettings = {}
let appSettingsError = ''
let overviewWeekOffset = 0
let overviewFilters = {
  departments: [],
  staffIds: [],
  sortBy: 'display_order',
  sortDir: 'asc'
}
let fieldWeekOffset = 0
let fieldScheduleFilters = {
  departments: [],
  staffIds: [],
  sortBy: 'display_order',
  sortDir: 'asc'
}
let meetingWeekOffset = 0
let fieldDetailFilters = {
  staffId: '全部',
  location: '',
  purpose: '全部',
  status: '全部',
  startDate: '',
  endDate: ''
}
let incidentFilters = {
  staffId: '全部',
  status: '全部',
  keyword: ''
}
let searchFilters = {
  keyword: '',
  status: '全部',
  category: '全部',
  staffId: '全部',
  startDate: '',
  endDate: ''
}

let auditLogs = []
let auditLoading = false
let auditError = ''
let auditFilters = {
  keyword: '',
  actionType: '全部',
  sourceType: '全部',
  department: '全部',
  staffId: '全部',
  startDate: '',
  endDate: ''
}

let lineNotifyState = {
  type: '今日行程',
  target: '自己'
}

let serviceRecords = []
let serviceRecordsLoading = false
let serviceRecordsError = ''
let statsFilters = {
  period: '當月',
  startDate: '',
  endDate: '',
  department: '全部',
  staffId: '全部',
  category: '全部'
}

let serviceRecordFilters = {
  status: '全部',
  staffId: '全部',
  department: '全部',
  scheduleType: '全部',
  keyword: '',
  startDate: '',
  endDate: ''
}

let userAccountFilters = {
  keyword: '',
  department: '全部',
  role: '全部',
  fieldStaff: '全部'
}


const userManageDefaultDepartments = ['總經理室', '財務稽核', '營管處', '營運二部', '業務處', '人才發展', '管顧事業']
const userManageDefaultPositions = ['協理', '執行長', '總經理', '副總經理', '副理', '組長', '海外行政', 'PT']
const userManageRemovedPositions = ['管理員', '主管', '行政/海外', '行政 / 海外', '外務/宿管人員/會計', '外務 / 宿管人員 / 會計']

function normalizePositionLabel(value = '') {
  return String(value || '').replaceAll(' ', '').trim()
}

function isRemovedUserManagePosition(position = '') {
  const normalized = normalizePositionLabel(position)
  return userManageRemovedPositions.some(item => normalizePositionLabel(item) === normalized)
}


function getManagedUserDepartmentOptions() {
  return getManagedListOption('userManageDepartments', userManageDefaultDepartments)
}

function getManagedUserPositionOptions() {
  return getManagedListOption('userManagePositions', userManageDefaultPositions)
    .filter(position => !isRemovedUserManagePosition(position))
}



/* FOR-e V002-1P-14 START - shared app settings */
/*
  V002-1P-14｜系統設定共用化
  - 顏色設定改支援 Supabase app_settings 共用
  - 外務人員勾選改支援 Supabase app_settings 共用
  - SQL 未執行時仍保留 localStorage 後備，不中斷系統
*/

const sharedSettingKeys = ['schedule_colors', 'field_staff_settings', 'managed_options']

function readLocalJsonSetting(key) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : {}
  } catch (err) {
    console.warn('本機設定讀取失敗', key, err)
    return {}
  }
}

function getDefaultScheduleColorMap() {
  return Object.fromEntries(getScheduleColorDefinitions().map(item => [item.key, item.defaultColor]))
}

function normalizeSettingValue(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {}
  return value
}

async function loadAppSettings() {
  appSettingsError = ''

  const { data, error } = await supabase
    .from('app_settings')
    .select('setting_key, setting_value')
    .in('setting_key', sharedSettingKeys)

  if (error) {
    console.warn('app_settings 尚未啟用，暫用本機設定。', error.message)
    appSettings = {}
    appSettingsError = error.message
    return
  }

  appSettings = Object.fromEntries((data || []).map(row => [
    row.setting_key,
    normalizeSettingValue(row.setting_value)
  ]))

  const localColors = readLocalJsonSetting(scheduleColorStorageKey)
  if (!appSettings.schedule_colors && Object.keys(localColors).length) {
    appSettings.schedule_colors = localColors
    saveAppSetting('schedule_colors', localColors)
  }

  const localFieldStaff = readLocalJsonSetting(fieldStaffSettingsStorageKey)
  if (!appSettings.field_staff_settings && Object.keys(localFieldStaff).length) {
    appSettings.field_staff_settings = localFieldStaff
    saveAppSetting('field_staff_settings', localFieldStaff)
  }

  const localManagedOptions = readLocalJsonSetting(managedOptionsStorageKey)
  if (!appSettings.managed_options && Object.keys(localManagedOptions).length) {
    appSettings.managed_options = localManagedOptions
    saveAppSetting('managed_options', localManagedOptions)
  }
}

async function saveAppSetting(settingKey, settingValue) {
  appSettings[settingKey] = normalizeSettingValue(settingValue)

  try {
    const { data: userData } = await supabase.auth.getUser()
    const payload = {
      setting_key: settingKey,
      setting_value: appSettings[settingKey],
      updated_at: new Date().toISOString()
    }

    if (userData?.user?.id) {
      payload.updated_by = userData.user.id
    }

    const { error } = await supabase
      .from('app_settings')
      .upsert(payload, { onConflict: 'setting_key' })

    if (error) {
      console.warn('app_settings 儲存失敗，已保留本機設定。', error.message)
      appSettingsError = error.message
    } else {
      appSettingsError = ''
    }
  } catch (err) {
    console.warn('app_settings 儲存發生錯誤，已保留本機設定。', err)
    appSettingsError = err.message || String(err)
  }
}

function hasSharedSetting(key) {
  return Boolean(appSettings && Object.prototype.hasOwnProperty.call(appSettings, key))
}

function renderAppSettingSyncNotice() {
  if (!appSettingsError) {
    return `<div class="notice">系統設定已支援共用；若有調整，其他人重新整理後會同步看到。</div>`
  }

  return `<div class="notice">目前尚未啟用共用設定資料表，系統會先使用本機暫存。要讓全公司同步，請先執行 V002-1P-14 的 Supabase SQL。</div>`
}
/* FOR-e V002-1P-14 END - shared app settings */



function getRoleName() {
  return currentProfile?.role || '未登入'
}

const rolePermissionMatrix = {
  '管理員': {
    label: '管理員',
    manageAllSchedules: true,
    createServiceSchedule: true,
    createPersonalSchedule: true,
    createFieldSchedule: true,
    createMeetingRoom: true,
    createIncident: true,
    assignAllStaff: true,
    manageUsers: true,
    manageOptions: true,
    manageColor: true,
    exportData: true,
    viewStats: true,
    viewServiceRecords: true,
    submitServiceRecord: true,
    viewAudit: true,
    lineNotifyAll: true
  },
  '主管': {
    label: '主管',
    manageAllSchedules: true,
    createServiceSchedule: true,
    createPersonalSchedule: true,
    createFieldSchedule: true,
    createMeetingRoom: true,
    createIncident: true,
    assignAllStaff: true,
    manageUsers: false,
    manageOptions: true,
    manageColor: true,
    exportData: true,
    viewStats: true,
    viewServiceRecords: true,
    submitServiceRecord: false,
    viewAudit: true,
    lineNotifyAll: true
  },
  '行政 / 海外': {
    label: '行政 / 海外',
    manageAllSchedules: true,
    createServiceSchedule: true,
    createPersonalSchedule: true,
    createFieldSchedule: true,
    createMeetingRoom: true,
    createIncident: true,
    assignAllStaff: true,
    manageUsers: false,
    manageOptions: false,
    manageColor: true,
    exportData: true,
    viewStats: false,
    viewServiceRecords: false,
    submitServiceRecord: false,
    viewAudit: true,
    lineNotifyAll: false
  },
  '翻譯': {
    label: '翻譯',
    manageAllSchedules: false,
    createServiceSchedule: false,
    createPersonalSchedule: true,
    createFieldSchedule: false,
    createMeetingRoom: false,
    createIncident: false,
    assignAllStaff: false,
    manageUsers: false,
    manageOptions: false,
    manageColor: true,
    exportData: false,
    viewStats: false,
    viewServiceRecords: false,
    submitServiceRecord: true,
    viewAudit: false,
    lineNotifyAll: false
  },
  '外務 / 宿管人員 / 會計': {
    label: '外務 / 宿管人員 / 會計',
    manageAllSchedules: false,
    createServiceSchedule: false,
    createPersonalSchedule: true,
    createFieldSchedule: false,
    createMeetingRoom: true,
    createIncident: false,
    assignAllStaff: false,
    manageUsers: false,
    manageOptions: false,
    manageColor: false,
    exportData: false,
    viewStats: false,
    viewServiceRecords: false,
    submitServiceRecord: false,
    viewAudit: true,
    lineNotifyAll: false
  },
  '一般職員': {
    label: '一般職員',
    manageAllSchedules: false,
    createServiceSchedule: false,
    createPersonalSchedule: true,
    createFieldSchedule: false,
    createMeetingRoom: true,
    createIncident: false,
    assignAllStaff: false,
    manageUsers: false,
    manageOptions: false,
    manageColor: false,
    exportData: false,
    viewStats: false,
    viewServiceRecords: false,
    submitServiceRecord: false,
    viewAudit: false,
    lineNotifyAll: false
  }
}

function getRolePermissions(role = getRoleName()) {
  return rolePermissionMatrix[role] || rolePermissionMatrix['一般職員']
}

function hasRolePermission(permissionName) {
  return Boolean(getRolePermissions()[permissionName])
}

function canSeePage(page, role) {
  return page.roles === 'ALL' || page.roles.includes(role)
}

function isPowerRole() {
  return hasRolePermission('manageAllSchedules')
}

function isAdminRole() {
  return getRoleName() === '管理員'
}

function canManageAllSchedules() {
  return hasRolePermission('manageAllSchedules')
}

function canCreatePersonalSchedule() {
  return hasRolePermission('createPersonalSchedule')
}

function canCreateServiceSchedule() {
  return hasRolePermission('createServiceSchedule')
}

function canCreateFieldSchedule() {
  return hasRolePermission('createFieldSchedule')
}

function canCreateMeetingRoomSchedule() {
  return hasRolePermission('createMeetingRoom')
}

function canCreateIncidentSchedule() {
  return hasRolePermission('createIncident')
}

function canAssignAllStaff() {
  return hasRolePermission('assignAllStaff')
}

function canManageUsers() {
  return hasRolePermission('manageUsers')
}


function isSupervisorRole() {
  return getRoleName() === '主管'
}

function canViewAllUserAccounts() {
  return canManageUsers() || isSupervisorRole()
}

function canToggleUserFieldStaff() {
  return canManageUsers() || isSupervisorRole()
}

function isStaffDeleted(staff) {
  return Boolean(staff?.deleted_at)
}

function getStaffDisplayStatus(staff) {
  if (isStaffDeleted(staff)) return '已刪除'
  return staff?.status || '啟用'
}

function getStaffStatusClass(staff) {
  if (isStaffDeleted(staff)) return 'is-deleted'
  if (staff?.status === '停用') return 'is-disabled'
  return ''
}

function isCurrentProfileStaff(staff) {
  if (!currentProfile || !staff) return false
  if (currentProfile.staff_id && staff.staff_id === currentProfile.staff_id) return true
  if (currentProfile.email && getStaffLoginEmail(staff) === currentProfile.email) return true
  if (currentProfile.name && staff.name === currentProfile.name) return true
  return false
}

function canViewUserAccountRow(staff) {
  if (canViewAllUserAccounts()) return true
  return isCurrentProfileStaff(staff)
}

function getUserAccountVisibleRows(rows) {
  return (rows || []).filter(staff => !isStaffDeleted(staff)).filter(canViewUserAccountRow)
}

function canEditUserProfile(staff) {
  return canManageUsers()
}

function canResetUserPassword(staff) {
  return canManageUsers() && Boolean(getStaffLoginEmail(staff))
}

function canCreateUserLogin(staff) {
  return canManageUsers() && staff?.staff_id && !getStaffLoginEmail(staff) && !isStaffDeleted(staff)
}

function canRebindUserLogin(staff) {
  return canManageUsers() && staff?.staff_id && Boolean(getStaffLoginEmail(staff)) && !isStaffDeleted(staff)
}

function canDeleteUserProfile(staff) {
  return canManageUsers() && staff?.staff_id && staff.staff_id !== currentProfile?.staff_id && !isStaffDeleted(staff)
}

function canActivateUserProfile(staff) {
  return canManageUsers() && staff?.staff_id && staff.staff_id !== currentProfile?.staff_id && getStaffDisplayStatus(staff) === '停用'
}


function canManageOptions() {
  return hasRolePermission('manageOptions')
}

function canManageColorSettings() {
  return hasRolePermission('manageColor')
}

function canExportData() {
  return hasRolePermission('exportData')
}

function canLineNotifyAll() {
  return hasRolePermission('lineNotifyAll')
}

function getAssignableStaffRows() {
  if (canAssignAllStaff()) return staffList
  const myStaffId = currentProfile?.staff_id
  return staffList.filter(staff => staff.staff_id === myStaffId)
}

function canCreateForCurrentPage() {
  if (currentPage === 'personalSchedule' || currentPage === 'personalTodo') return canCreatePersonalSchedule()
  if (currentPage === 'scheduleOverview') return canCreateServiceSchedule()
  if (currentPage === 'fieldSchedule') return canCreateFieldSchedule()
  if (currentPage === 'meetingRoom') return canCreateMeetingRoomSchedule()
  return false
}

function canCreateScheduleCategory(category) {
  if (category === '服務行程') return canCreateServiceSchedule()
  return canCreatePersonalSchedule()
}

function canManageFieldResult(row) {
  if (!row || row.status === '取消') return false
  return canCreateFieldSchedule() || isAssignedToMe(row)
}

function canManageIncidentAction(row = null) {
  if (canCreateIncidentSchedule()) return true
  if (!row) return false
  return row.creator_staff_id === currentProfile?.staff_id
}

function denyPermission(message = '你的角色沒有此操作權限。') {
  alert(message)
  return false
}

function getRolePermissionNotice() {
  const role = getRoleName()
  if (canManageAllSchedules()) return `目前角色：${role}｜可管理全部行程與指派事項。`
  return `目前角色：${role}｜僅可管理自己建立或被指派的事項。`
}

function canModifySchedule(row) {
  if (!currentProfile || !row) return false
  if (canManageAllSchedules()) return true
  return row.creator_staff_id === currentProfile.staff_id
}

function canCompleteSchedule(row) {
  if (!currentProfile || !row) return false
  if (isNoCompletionControlSchedule(row)) return false
  if (row.status === '已完成' || row.status === '取消') return false
  if (canManageAllSchedules()) return true
  return row.creator_staff_id === currentProfile.staff_id || isAssignedToMe(row)
}

function canCancelSchedule(row) {
  if (!currentProfile || !row) return false
  if (row.status === '取消') return false
  if (canManageAllSchedules()) return true
  return row.creator_staff_id === currentProfile.staff_id
}




function todayString() {
  return new Date().toISOString().slice(0, 10)
}

function isDeletedSchedule(row) {
  if (!row) return true
  const statusText = String(row.status || '').trim()
  return Boolean(
    row.deleted_at ||
    row.deletedAt ||
    row.removed_at ||
    row.is_deleted === true ||
    row.deleted === true ||
    statusText === '已刪除' ||
    statusText === '刪除' ||
    statusText.toLowerCase() === 'deleted'
  )
}

function isCancelledSchedule(row) {
  if (!row) return false
  const statusText = String(row.status || '').trim()
  return Boolean(
    statusText === '取消' ||
    row.is_cancelled === true ||
    row.cancelled_at ||
    row.cancelledAt
  )
}

function isVisibleSchedule(row) {
  return row && !isDeletedSchedule(row) && !isCancelledSchedule(row)
}

function isSearchableSchedule(row) {
  return isVisibleSchedule(row)
}

function isActiveServiceRecord(record) {
  if (!record) return false
  if (record.deleted_at || record.deletedAt || record.is_deleted === true || record.deleted === true) return false

  if (record.schedule_id) {
    const schedule = getServiceRecordSchedule(record)
    if (!schedule) return false
    if (!isVisibleSchedule(schedule)) return false
  }

  return true
}


function isNoCompletionControlSchedule(row) {
  if (!row) return false

  if (row.category === '請假 / 會議 / 活動 / 外訓') return true

  const noCompletionTypes = [
    '請假',
    '返鄉',
    '會議',
    '外訓',
    '活動',
    '部門活動',
    '公司活動',
    '教育訓練'
  ]

  if (row.category !== '會議室預約' && noCompletionTypes.includes(row.schedule_type)) return true
  if (row.category !== '會議室預約' && noCompletionTypes.includes(row.sub_type)) return true

  return false
}

function getScheduleStatusLabel(row) {
  if (isNoCompletionControlSchedule(row)) return '行事曆顯示'
  return row?.status || '未完成'
}


function isActivePersonalSchedule(row) {
  return isVisibleSchedule(row) && row.status !== '已完成' && row.is_completed !== true
}

function isMine(row) {
  const myStaffId = currentProfile?.staff_id
  if (!myStaffId) return false
  if (row.creator_staff_id === myStaffId) return true
  return (row.schedule_assignees || []).some(item => item.staff_id === myStaffId && !item.deleted_at)
}

function isAssignedToMe(row) {
  const myStaffId = currentProfile?.staff_id
  if (!myStaffId) return false
  return (row.schedule_assignees || []).some(item => item.staff_id === myStaffId && !item.deleted_at)
}










function formatDate(value) {
  return value || '-'
}

function parseTimeForEdit(value, fallbackHour = '09', fallbackMinute = '00') {
  if (!value) return { hour: fallbackHour, minute: fallbackMinute }
  const text = String(value)
  return {
    hour: text.slice(0, 2) || fallbackHour,
    minute: text.slice(3, 5) || fallbackMinute
  }
}

function formatTime(row) {
  const start = row.start_time ? row.start_time.slice(0, 5) : ''
  const end = row.end_time ? row.end_time.slice(0, 5) : ''
  if (['上午', '下午'].includes(row.time_type) && start && end) return `${row.time_type} ${start}-${end}`
  if (['上午', '下午'].includes(row.time_type) && start) return `${row.time_type} ${start}`
  return row.time_type || '不指定'
}

function getAssigneeIds(row) {
  return (row.schedule_assignees || [])
    .filter(item => !item.deleted_at)
    .map(item => item.staff_id)
}

function getAssigneeNames(row) {
  const names = (row.schedule_assignees || [])
    .filter(item => !item.deleted_at)
    .map(item => item.staff_name)
  return names.length ? names.join('、') : '-'
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

function getFirstTwoLines(text) {
  const raw = String(text || '').trim()
  if (!raw) return ''
  return raw.split(/\r?\n/).slice(0, 2).join('\n')
}

function parseNoteTokens(row) {
  const text = `${row.sub_type_note || ''}｜${row.description || ''}`
  return text
    .split('｜')
    .map(item => item.trim())
    .filter(Boolean)
}

function getNoteValue(row, label) {
  const items = parseNoteTokens(row)
  const found = items.find(item => item.startsWith(label + '：'))
  return found ? found.slice(label.length + 1) : ''
}

function removeNoteLabels(noteText, labels) {
  const items = String(noteText || '').split('｜').map(item => item.trim()).filter(Boolean)
  return items.filter(item => !labels.some(label => item.startsWith(label + '：'))).join('｜')
}

function getReminderTokens(row) {
  const type = row.schedule_type || ''
  const noteItems = parseNoteTokens(row)
  const reminderTypes = ['返台提醒', '逃跑通知', '轉出追蹤', '住變資訊', '驗證提醒']
  const tokens = []

  noteItems.forEach(item => {
    if (
      item.includes('抵台') ||
      item.includes('逃跑') ||
      item.includes('轉出') ||
      item.includes('聘僱終止日') ||
      item.includes('住變') ||
      item.includes('驗證') ||
      item.includes('最後工作日') ||
      item.includes('離境') ||
      item.includes('下次回診') ||
      item.includes('證件')
    ) {
      tokens.push(item)
    }
  })

  if (reminderTypes.includes(type) && !tokens.some(item => item.includes(type))) {
    tokens.unshift(type)
  }

  return [...new Set(tokens)].slice(0, 6)
}

function renderBrandLogo(kind = 'horizontal') {
  let src = '/brand/for-e-logo-horizontal.png'
  if (kind === 'icon') src = '/brand/for-e-icon.png'
  if (kind === 'square') src = '/brand/for-e-logo-square.png'
  return `<img class="brand-logo-img ${kind === 'icon' ? 'icon-logo' : ''} ${kind === 'square' ? 'square-logo' : ''}" src="${src}" alt="FOR-e">`
}

function renderLogin() {
  document.querySelector('#app').innerHTML = `
    <section class="login-page">
      <div class="login-card">
        <div class="login-brand">${renderBrandLogo('square')}</div>
        <h1>共享排程系統</h1>
        <p>V002-1E-4｜卡片、證件、提醒與品牌 LOGO</p>

        <label for="email">Email / 帳號</label>
        <input id="email" type="email" placeholder="請輸入 Email" autocomplete="email" />

        <label for="password">密碼</label>
        <input id="password" type="password" placeholder="請輸入密碼" autocomplete="current-password" />

        <button id="loginBtn">登入</button>
        <div id="errorText" class="error"></div>

        <div class="login-note">
          請使用公司提供的帳號密碼登入 FOR-e 共享排程系統。
        </div>
      </div>
    </section>
  `

  document.querySelector('#loginBtn').addEventListener('click', login)
  document.querySelector('#password').addEventListener('keydown', event => {
    if (event.key === 'Enter') login()
  })
}

async function login() {
  const email = document.querySelector('#email').value.trim()
  const password = document.querySelector('#password').value
  const errorText = document.querySelector('#errorText')
  errorText.textContent = ''

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    errorText.textContent = '尚未設定 Supabase 環境變數。'
    return
  }

  if (!email || !password) {
    errorText.textContent = '請輸入 Email 與密碼。'
    return
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) {
    errorText.textContent = `登入失敗：${error.message}`
    return
  }

  await loadProfile()
}


function normalizeProfileStaffId(profile) {
  return profile?.staff_id || profile?.staffId || profile?.staff_uuid || ''
}

async function findStaffForProfile(profile) {
  const staffId = normalizeProfileStaffId(profile)

  if (staffId) {
    const { data, error } = await supabase
      .from('staff')
      .select('staff_id, name, department_id, department_name, position, role, status, deleted_at, display_order')
      .eq('staff_id', staffId)
      .maybeSingle()

    if (!error && data) return data
  }

  if (profile?.name) {
    const { data, error } = await supabase
      .from('staff')
      .select('staff_id, name, department_id, department_name, position, role, status, deleted_at, display_order')
      .eq('name', profile.name)
      .is('deleted_at', null)
      .order('display_order', { ascending: true })
      .limit(1)
      .maybeSingle()

    if (!error && data) return data
  }

  return null
}

function mergeProfileWithStaffRole(profile, staff) {
  if (!profile || !staff) return profile

  return {
    ...profile,
    staff_id: staff.staff_id || profile.staff_id,
    name: staff.name || profile.name,
    department_id: staff.department_id || profile.department_id,
    department_name: staff.department_name || profile.department_name,
    position: staff.position || profile.position,
    position_name: staff.position || profile.position_name || profile.position,
    role: staff.role || profile.role,
    status: staff.status || profile.status
  }
}

function getProfileUpdatePayloadForStaff(profile, staffPayload) {
  const profileKeys = new Set(Object.keys(profile || currentProfile || {}))
  const pairs = {
    name: staffPayload.name,
    department_id: staffPayload.department_id,
    department_name: staffPayload.department_name,
    position: staffPayload.position,
    position_name: staffPayload.position,
    role: staffPayload.role,
    status: staffPayload.status,
    staff_id: staffPayload.staff_id
  }

  return Object.fromEntries(
    Object.entries(pairs)
      .filter(([key, value]) => profileKeys.has(key) && value !== undefined)
  )
}

async function syncProfileRoleFromStaff(staffId, staffPayload) {
  if (!staffId || !staffPayload) return

  try {
    const profile = userProfileList.find(item => normalizeProfileStaffId(item) === staffId)
      || userProfileList.find(item => item.name && item.name === staffPayload.name)
      || null

    const payload = getProfileUpdatePayloadForStaff(profile, { ...staffPayload, staff_id: staffId })
    if (!Object.keys(payload).length) return

    if (profile?.email) {
      const { error } = await supabase
        .from('profiles')
        .update(payload)
        .eq('email', profile.email)

      if (!error) return
    }

    if (profile && normalizeProfileStaffId(profile)) {
      const { error } = await supabase
        .from('profiles')
        .update(payload)
        .eq('staff_id', staffId)

      if (!error) return
    }
  } catch (err) {
    console.warn('profiles 角色同步失敗，登入時仍會依 staff 修正角色。', err)
  }
}

function applyCurrentProfileStaffRole(staffPayload) {
  if (!currentProfile || !staffPayload) return
  if (currentProfile.staff_id && currentProfile.staff_id !== staffPayload.staff_id) return

  currentProfile = {
    ...currentProfile,
    staff_id: staffPayload.staff_id || currentProfile.staff_id,
    name: staffPayload.name || currentProfile.name,
    department_id: staffPayload.department_id || currentProfile.department_id,
    department_name: staffPayload.department_name || currentProfile.department_name,
    position: staffPayload.position || currentProfile.position,
    position_name: staffPayload.position || currentProfile.position_name || currentProfile.position,
    role: staffPayload.role || currentProfile.role,
    status: staffPayload.status || currentProfile.status
  }
}


async function loadProfile() {
  const { data: userData } = await supabase.auth.getUser()

  if (!userData.user) {
    renderLogin()
    return
  }

  const { data: profile, error } = await supabase.rpc('get_my_profile').single()

  if (error || !profile) {
    await supabase.auth.signOut()
    renderLogin()
    alert('找不到 profiles，請確認 Supabase 帳號與 profiles 是否正確。')
    return
  }

  const staffForProfile = await findStaffForProfile(profile)
  const mergedProfile = mergeProfileWithStaffRole(profile, staffForProfile)

  if (mergedProfile.status !== '啟用') {
    await supabase.auth.signOut()
    renderLogin()
    alert('此帳號已停用，請聯繫管理員。')
    return
  }

  currentProfile = mergedProfile
  loadOverviewFiltersPreference()
  loadFieldScheduleFiltersPreference()
  currentPage = 'personalSchedule'
  await refreshData()
  renderApp()
  maybeOpenLoginDailyReminder()
}

async function refreshData() {
  await Promise.all([loadAppSettings(), loadStaff(), loadUserProfiles(), loadSchedules(), loadAuditLogs(), loadServiceRecords()])
}


async function loadUserProfiles() {
  userProfilesError = ''

  const { data, error } = await supabase
    .from('profiles')
    .select('*')

  if (error) {
    console.warn('profiles 讀取失敗，登入帳號欄位會以可取得資料為主。', error.message)
    userProfileList = []
    userProfilesError = error.message
    return
  }

  userProfileList = data || []
}

function getProfileStaffId(profile) {
  return profile?.staff_id || profile?.staffId || profile?.staff_uuid || ''
}

function isActiveLoginProfile(profile) {
  return !profile?.status || profile.status === '啟用'
}

function getStaffProfile(staff) {
  if (!staff) return null

  const staffId = normalizeStaffId(staff.staff_id)
  if (!staffId) return null

  const linkedProfiles = userProfileList.filter(profile => normalizeStaffId(getProfileStaffId(profile)) === staffId)
  const activeLinkedProfile = linkedProfiles.find(isActiveLoginProfile)
  if (activeLinkedProfile) return activeLinkedProfile
  if (linkedProfiles.length) return linkedProfiles[0]

  return userProfileList.find(profile => {
    return !normalizeStaffId(getProfileStaffId(profile))
      && isActiveLoginProfile(profile)
      && profile.name
      && profile.name === staff.name
  }) || null
}

function getStaffLoginEmail(staff) {
  const profile = getStaffProfile(staff)
  return profile?.email || staff?.email || ''
}

function getStaffLoginStatus(staff) {
  return getStaffLoginEmail(staff) ? '已綁定' : '未綁定'
}

function getStaffLoginStatusClass(staff) {
  return getStaffLoginEmail(staff) ? 'is-bound' : 'is-unbound'
}

async function sendPasswordResetEmail(email) {
  openAdminPasswordResetModal(email, '')
}


function getOwnPasswordEmail(staff = null) {
  if (staff && !isCurrentProfileStaff(staff)) return ''
  return getStaffLoginEmail(staff) || currentProfile?.email || ''
}

function canChangeOwnPassword(staff = null) {
  return Boolean(getOwnPasswordEmail(staff))
}

function openOwnPasswordModal(email = currentProfile?.email || '') {
  const loginEmail = email || currentProfile?.email || ''

  if (!loginEmail) {
    alert('目前帳號沒有 Email，無法修改密碼。')
    return
  }

  const modal = document.createElement('div')
  modal.className = 'modal-backdrop'
  modal.innerHTML = `
    <div class="modal-panel own-password-modal">
      <div class="modal-header">
        <h3>修改我的密碼</h3>
        <button class="icon-btn" id="closeOwnPasswordBtn" type="button">×</button>
      </div>

      <form id="ownPasswordForm" class="form-grid">
        <div class="span-2 login-create-user-card">
          <strong>${escapeHtml(currentProfile?.name || '我的帳號')}</strong>
          <span>${escapeHtml(loginEmail)}</span>
        </div>

        <label>
          新密碼
          <input name="password" type="password" required minlength="6" placeholder="請輸入至少 6 碼">
        </label>

        <label>
          再次確認新密碼
          <input name="confirmPassword" type="password" required minlength="6" placeholder="再次輸入新密碼">
        </label>

        <div class="notice span-2">
          所有角色都可以修改自己的登入密碼。新密碼至少 6 碼，且不可與舊密碼相同。
        </div>

        <div class="modal-actions span-2">
          <button type="button" class="secondary-btn" id="cancelOwnPasswordBtn">取消</button>
          <button type="submit" class="primary-btn">更新密碼</button>
        </div>
      </form>
    </div>
  `

  document.body.appendChild(modal)

  document.querySelector('#closeOwnPasswordBtn').addEventListener('click', () => modal.remove())
  document.querySelector('#cancelOwnPasswordBtn').addEventListener('click', () => modal.remove())
  document.querySelector('#ownPasswordForm').addEventListener('submit', event => updateOwnPassword(event, modal))
}

async function updateOwnPassword(event, modal) {
  event.preventDefault()
  if (saving) return
  saving = true

  try {
    const form = new FormData(event.target)
    const password = String(form.get('password') || '').trim()
    const confirmPassword = String(form.get('confirmPassword') || '').trim()

    if (password.length < 6) {
      alert('新密碼至少需要 6 碼。')
      return
    }

    if (password !== confirmPassword) {
      alert('兩次輸入的新密碼不一致。')
      return
    }

    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      const message = String(error.message || '')
      if (message.includes('different from the old password')) {
        alert('更新失敗：新密碼不能與舊密碼相同，請換一組 6 碼以上密碼。')
      } else {
        alert(`更新失敗：${message}`)
      }
      return
    }

    modal.remove()
    alert('密碼已更新，請下次登入使用新密碼。')
  } finally {
    saving = false
  }
}


function openAdminPasswordResetModal(email = '', staffName = '') {
  if (!canManageUsers()) {
    alert('只有管理員可以重設登入密碼。')
    return
  }

  if (!email) {
    alert('此人員尚未綁定登入 Email，無法重設密碼。')
    return
  }

  const tempPassword = generateTemporaryPassword()
  const modal = document.createElement('div')
  modal.className = 'modal-backdrop'
  modal.innerHTML = `
    <div class="modal-panel admin-reset-password-modal">
      <div class="modal-header">
        <h3>重設登入密碼</h3>
        <button class="icon-btn" id="closeAdminResetPasswordBtn" type="button">×</button>
      </div>

      <form id="adminResetPasswordForm" class="form-grid">
        <div class="span-2 login-create-user-card">
          <strong>${escapeHtml(staffName || email)}</strong>
          <span>${escapeHtml(email)}</span>
        </div>

        <label class="span-2">
          新臨時密碼
          <input name="password" type="text" required minlength="6" value="${escapeHtml(tempPassword)}">
        </label>

        <div class="notice span-2">
          這個重設會直接把該帳號密碼改成上方臨時密碼，不再寄送 Email，因此不會受 email rate limit 限制。
        </div>

        <div class="modal-actions span-2">
          <button type="button" class="secondary-btn" id="cancelAdminResetPasswordBtn">取消</button>
          <button type="submit" class="primary-btn">直接重設密碼</button>
        </div>
      </form>
    </div>
  `

  document.body.appendChild(modal)
  document.querySelector('#closeAdminResetPasswordBtn').addEventListener('click', () => modal.remove())
  document.querySelector('#cancelAdminResetPasswordBtn').addEventListener('click', () => modal.remove())
  document.querySelector('#adminResetPasswordForm').addEventListener('submit', event => resetLoginPasswordDirectly(event, modal, email))
}

async function resetLoginPasswordDirectly(event, modal, email) {
  event.preventDefault()
  if (saving) return
  saving = true

  try {
    const form = new FormData(event.target)
    const password = String(form.get('password') || '').trim()

    if (password.length < 6) {
      alert('臨時密碼 至少 6 碼，請至少輸入 6 碼。')
      return
    }

    const { data: sessionData } = await supabase.auth.getSession()
    const accessToken = sessionData?.session?.access_token

    if (!accessToken) {
      alert('登入狀態已失效，請重新登入。')
      return
    }

    const response = await fetch(`${SUPABASE_URL}/functions/v1/admin-create-user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        action: 'reset_password',
        email,
        password,
        frontend_version: 'V002-1P-33'
      })
    })

    const result = await response.json().catch(() => ({}))

    if (!response.ok) {
      throw new Error(result.error || '重設密碼失敗')
    }

    modal.remove()
    alert(`密碼已重設為：${password}\n請提供給使用者登入後自行更改。`)
  } catch (err) {
    console.error(err)
    alert(err.message || '重設密碼失敗。')
  } finally {
    saving = false
  }
}


async function updateProfilesBeforeStaffDelete(staffId = '') {
  const normalizedStaffId = normalizeStaffId(staffId)
  if (!normalizedStaffId) return

  const primaryPayload = {
    staff_id: null,
    status: '停用'
  }

  const { error } = await supabase
    .from('profiles')
    .update(primaryPayload)
    .eq('staff_id', normalizedStaffId)

  if (!error) return

  console.warn('profiles 解除 staff_id / 停用失敗，改用僅解除 staff_id 重試。', error)

  const { error: staffOnlyError } = await supabase
    .from('profiles')
    .update({ staff_id: null })
    .eq('staff_id', normalizedStaffId)

  if (staffOnlyError) {
    console.error(staffOnlyError)
    throw new Error('解除登入帳號與人員綁定失敗：' + staffOnlyError.message)
  }
}

function isForeignKeyStaffDeleteError(error) {
  const message = String(error?.message || error || '')
  return message.includes('foreign key constraint') || message.includes('violates foreign key') || message.includes('profiles_staff_id_fkey')
}


async function deleteStaffUser(staffId = '', staffName = '') {
  if (!canManageUsers()) {
    alert('只有管理員可以刪除人員。')
    return
  }

  if (!staffId) {
    alert('找不到人員資料。')
    return
  }

  if (staffId === currentProfile?.staff_id) {
    alert('不能刪除目前登入中的自己。')
    return
  }

  const staff = getUserManageRows().find(item => item.staff_id === staffId)
  const loginEmail = getStaffLoginEmail(staff)
  const name = staffName || staff?.name || '此人員'

  const confirmed = confirm(
    `確定要永久刪除「${name}」嗎？\n\n` +
    `刪除前系統會先解除此人員與登入帳號的綁定，避免 profiles_staff_id_fkey 擋住刪除。\n` +
    `刪除後此人員不會再出現在人員 / 帳號頁。\n\n` +
    `如果只是暫時不用，請按「修改」把狀態改為「停用」，停用人員會繼續留在人員名單上。` +
    `${loginEmail ? '\n\n原綁定帳號會保留，但會解除人員綁定並停用。' : ''}`
  )
  if (!confirmed) return

  if (saving) return
  saving = true

  try {
    await updateProfilesBeforeStaffDelete(staffId)

    const settings = getFieldStaffSettings()
    if (Object.prototype.hasOwnProperty.call(settings, staffId)) {
      delete settings[staffId]
      await saveFieldStaffSettings(settings)
    }

    const { error } = await supabase
      .from('staff')
      .delete()
      .eq('staff_id', staffId)

    if (error) {
      console.error(error)

      if (isForeignKeyStaffDeleteError(error)) {
        alert(
          '永久刪除人員失敗：此人員仍被其他資料表引用。\n\n' +
          '目前已先解除 profiles.staff_id 綁定，但還可能有行程、紀錄單或異動紀錄引用此人員。\n' +
          '如果這位人員已有歷史資料，建議改用「停用」。\n\n' +
          '原始錯誤：' + error.message
        )
      } else {
        alert(
          '永久刪除人員失敗：' + error.message +
          '\n\n若此人員已有歷史資料導致資料庫不允許刪除，請改用「修改」把狀態設為「停用」。'
        )
      }
      return
    }

    await refreshData()
    renderApp()
    alert('人員已永久刪除，不會再出現在人員名單。原登入帳號已解除人員綁定。')
  } catch (err) {
    console.error(err)
    alert(err.message || '永久刪除人員失敗。')
  } finally {
    saving = false
  }
}

async function activateStaffUser(staffId = '', staffName = '') {
  if (!canManageUsers()) {
    alert('只有管理員可以啟用人員。')
    return
  }

  if (!staffId) {
    alert('找不到人員資料。')
    return
  }

  const staff = getUserManageRows().find(item => item.staff_id === staffId)
  const loginEmail = getStaffLoginEmail(staff)
  const name = staffName || staff?.name || '此人員'

  if (!confirm(`確定要啟用「${name}」嗎？`)) return

  if (saving) return
  saving = true

  try {
    const { error } = await supabase
      .from('staff')
      .update({
        status: '啟用',
        deleted_at: null
      })
      .eq('staff_id', staffId)

    if (error) {
      console.error(error)
      alert('啟用人員失敗：' + error.message)
      return
    }

    if (loginEmail) {
      await supabase
        .from('profiles')
        .update({ status: '啟用' })
        .eq('email', loginEmail)
    }

    await refreshData()
    renderApp()
    alert('人員已啟用。')
  } finally {
    saving = false
  }
}


function generateTemporaryPassword() {
  return String(Math.floor(100000 + Math.random() * 900000))
}

function openLoginAccountModal(staffId = '') {
  if (!canManageUsers()) {
    alert('只有管理員可以建立登入帳號。')
    return
  }

  const normalizedStaffId = normalizeStaffId(staffId)
  const staff = getUserManageRows().find(item => normalizeStaffId(item.staff_id) === normalizedStaffId)
  if (!staff) {
    alert('找不到人員資料。')
    return
  }

  const existingEmail = getStaffLoginEmail(staff)
  if (existingEmail) {
    alert('此人員已經綁定登入帳號，可使用重設密碼功能。')
    return
  }

  const modal = document.createElement('div')
  modal.className = 'modal-backdrop'
  modal.innerHTML = `
    <div class="modal-panel login-account-modal">
      <div class="modal-header">
        <h3>建立登入帳號</h3>
        <button class="icon-btn" id="closeLoginAccountModalBtn" type="button">×</button>
      </div>

      <form id="loginAccountForm" class="form-grid">
        <div class="span-2 login-create-user-card">
          <strong>${escapeHtml(staff.name || '-')}</strong>
          <span>${escapeHtml(staff.department_name || '-')}｜${escapeHtml(staff.position || '-')}｜${escapeHtml(staff.role || '-')}</span>
        </div>

        <label class="span-2">
          登入 Email
          <input name="email" type="email" required placeholder="例如：user@company.com">
        </label>

        <label>
          臨時密碼
          <input name="password" type="text" required minlength="6" value="${escapeHtml(generateTemporaryPassword())}">
        </label>

        <label class="login-password-tip">
          說明
          <div>臨時密碼 至少 6 碼；建立後請讓使用者登入並自行更改密碼，也可以之後使用「重設」寄送重設密碼信。</div>
        </label>

        <div class="notice span-2">
          建立登入帳號會透過 Supabase Edge Function 執行。請先部署 admin-create-user function，且不要把 service_role key 放到前端。
        </div>

        <div class="modal-actions span-2">
          <button type="button" class="secondary-btn" id="cancelLoginAccountModalBtn">取消</button>
          <button type="submit" class="primary-btn">建立登入帳號</button>
        </div>
      </form>
    </div>
  `

  document.body.appendChild(modal)

  document.querySelector('#closeLoginAccountModalBtn').addEventListener('click', () => modal.remove())
  document.querySelector('#cancelLoginAccountModalBtn').addEventListener('click', () => modal.remove())
  document.querySelector('#loginAccountForm').addEventListener('submit', event => createLoginAccountForStaff(event, modal, normalizeStaffId(staff.staff_id)))
}

async function createLoginAccountForStaff(event, modal, staffId) {
  event.preventDefault()
  if (saving) return
  saving = true

  try {
    const normalizedStaffId = normalizeStaffId(staffId)
    const staff = getUserManageRows().find(item => normalizeStaffId(item.staff_id) === normalizedStaffId)

    if (!normalizedStaffId || !staff) {
      alert('找不到人員資料，請先重新整理人員 / 帳號頁，再重新點「建立」。')
      return
    }

    const form = new FormData(event.target)
    const email = String(form.get('email') || '').trim()
    const password = String(form.get('password') || '').trim()

    if (!email) {
      alert('請輸入登入 Email。')
      return
    }

    if (password.length < 6) {
      alert('臨時密碼 至少 6 碼，請至少輸入 6 碼。')
      return
    }

    const { data: sessionData } = await supabase.auth.getSession()
    const accessToken = sessionData?.session?.access_token

    if (!accessToken) {
      alert('登入狀態已失效，請重新登入。')
      return
    }

    const response = await fetch(`${SUPABASE_URL}/functions/v1/admin-create-user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        staff_id: normalizedStaffId,
        staff_snapshot: getStaffSnapshotForFunction(staff),
        frontend_version: 'V002-1P-32',
        email,
        password
      })
    })

    const result = await response.json().catch(() => ({}))

    if (!response.ok) {
      const detail = [
        result.error || '建立登入帳號失敗',
        result.staff_id ? `staff_id：${result.staff_id}` : '',
        result.hint ? `提示：${result.hint}` : '',
        result.code ? `錯誤代碼：${result.code}` : ''
      ].filter(Boolean).join('\n')
      throw new Error(detail)
    }

    modal.remove()
    await refreshData()
    renderApp()
    alert('登入帳號已建立。')
  } catch (err) {
    console.error(err)
    alert(err.message || '建立登入帳號失敗。請確認 Edge Function 是否已部署。')
  } finally {
    saving = false
  }
}


function findProfileByEmail(email = '') {
  const target = String(email || '').trim().toLowerCase()
  if (!target) return null
  return userProfileList.find(profile => String(profile.email || '').trim().toLowerCase() === target) || null
}

function getStaffById(staffId = '') {
  const normalizedStaffId = normalizeStaffId(staffId)
  if (!normalizedStaffId) return null
  return getUserManageRows().find(item => normalizeStaffId(item.staff_id) === normalizedStaffId) || null
}

function openRebindLoginAccountModal(staffId = '') {
  if (!canManageUsers()) {
    alert('只有管理員可以重新綁定登入帳號。')
    return
  }

  const staff = getStaffById(staffId)
  if (!staff) {
    alert('找不到人員資料。')
    return
  }

  const currentEmail = getStaffLoginEmail(staff)
  const modal = document.createElement('div')
  modal.className = 'modal-backdrop'
  modal.innerHTML = `
    <div class="modal-panel login-account-modal">
      <div class="modal-header">
        <h3>重新綁定登入帳號</h3>
        <button class="icon-btn" id="closeRebindLoginAccountModalBtn" type="button">×</button>
      </div>

      <form id="rebindLoginAccountForm" class="form-grid">
        <div class="span-2 login-create-user-card">
          <strong>${escapeHtml(staff.name || '-')}</strong>
          <span>${escapeHtml(staff.department_name || '-')}｜${escapeHtml(staff.position || '-')}｜${escapeHtml(staff.role || '-')}</span>
        </div>

        <label class="span-2">
          要綁定的登入 Email
          <input name="email" type="email" required value="${escapeHtml(currentEmail)}" placeholder="例如：user@company.com">
        </label>

        <div class="notice span-2">
          重新綁定只會調整 profiles 與人員的對應關係，不會建立新的 Supabase Auth 帳號。若輸入的 Email 尚未有登入帳號，請先使用「綁定」建立帳號。
        </div>

        <div class="modal-actions span-2">
          <button type="button" class="secondary-btn" id="cancelRebindLoginAccountModalBtn">取消</button>
          <button type="submit" class="primary-btn">確認重新綁定</button>
        </div>
      </form>
    </div>
  `

  document.body.appendChild(modal)

  document.querySelector('#closeRebindLoginAccountModalBtn').addEventListener('click', () => modal.remove())
  document.querySelector('#cancelRebindLoginAccountModalBtn').addEventListener('click', () => modal.remove())
  document.querySelector('#rebindLoginAccountForm').addEventListener('submit', event => rebindLoginAccountForStaff(event, modal, normalizeStaffId(staff.staff_id), currentEmail))
}

async function unbindOldProfilesFromStaff(staffId = '', keepEmail = '') {
  const normalizedStaffId = normalizeStaffId(staffId)
  const keep = String(keepEmail || '').trim().toLowerCase()
  if (!normalizedStaffId) return

  const oldProfiles = userProfileList.filter(profile => {
    const email = String(profile.email || '').trim().toLowerCase()
    return normalizeStaffId(getProfileStaffId(profile)) === normalizedStaffId && email && email !== keep
  })

  for (const profile of oldProfiles) {
    const payload = {}
    if (Object.prototype.hasOwnProperty.call(profile, 'staff_id')) payload.staff_id = null
    if (Object.prototype.hasOwnProperty.call(profile, 'status')) payload.status = '停用'

    if (!Object.keys(payload).length) continue

    const { error } = await supabase
      .from('profiles')
      .update(payload)
      .eq('email', profile.email)

    if (error && Object.prototype.hasOwnProperty.call(profile, 'status')) {
      await supabase
        .from('profiles')
        .update({ status: '停用' })
        .eq('email', profile.email)
    }
  }
}

async function rebindLoginAccountForStaff(event, modal, staffId = '', oldEmail = '') {
  event.preventDefault()
  if (saving) return
  saving = true

  try {
    const staff = getStaffById(staffId)
    if (!staff) {
      alert('找不到人員資料，請重新整理後再試。')
      return
    }

    const form = new FormData(event.target)
    const email = String(form.get('email') || '').trim()
    if (!email) {
      alert('請輸入要綁定的登入 Email。')
      return
    }

    const targetProfile = findProfileByEmail(email)
    if (!targetProfile?.email) {
      alert('找不到這個登入帳號。請先確認 Email 是否正確，或先用「綁定」建立登入帳號。')
      return
    }

    const targetBoundStaffId = normalizeStaffId(getProfileStaffId(targetProfile))
    const normalizedStaffId = normalizeStaffId(staffId)
    const currentEmail = String(oldEmail || getStaffLoginEmail(staff) || '').trim().toLowerCase()
    const targetEmail = String(targetProfile.email || email).trim().toLowerCase()

    if (targetBoundStaffId === normalizedStaffId && currentEmail === targetEmail) {
      alert('這個帳號目前已經綁定在此人員，不需要重新綁定。')
      return
    }

    if (targetBoundStaffId && targetBoundStaffId !== normalizedStaffId) {
      const oldStaff = getStaffById(targetBoundStaffId)
      const oldStaffName = oldStaff?.name || targetBoundStaffId
      if (!confirm(`此 Email 目前綁定在「${oldStaffName}」。\n\n確定要改綁到「${staff.name || '-'}」嗎？\n原本的人員會變成未綁定登入帳號。`)) {
        return
      }
    } else if (!confirm(`確定要把登入 Email「${targetProfile.email || email}」重新綁定到「${staff.name || '-'}」嗎？`)) {
      return
    }

    await unbindOldProfilesFromStaff(normalizedStaffId, targetProfile.email || email)

    const payload = getProfileUpdatePayloadForStaff(targetProfile, {
      ...getStaffSnapshotForFunction(staff),
      staff_id: normalizedStaffId,
      status: staff.status || '啟用'
    })

    if (Object.prototype.hasOwnProperty.call(targetProfile, 'staff_id')) {
      payload.staff_id = normalizedStaffId
    }
    if (Object.prototype.hasOwnProperty.call(targetProfile, 'status')) {
      payload.status = staff.status || '啟用'
    }

    if (!Object.keys(payload).length) {
      alert('這個 profiles 資料缺少可更新欄位，無法重新綁定。')
      return
    }

    const { error } = await supabase
      .from('profiles')
      .update(payload)
      .eq('email', targetProfile.email || email)

    if (error) {
      console.error(error)
      alert('重新綁定失敗：' + error.message)
      return
    }

    modal.remove()
    await refreshData()
    renderApp()
    alert('登入帳號已重新綁定。')
  } finally {
    saving = false
  }
}



async function checkLoginFunctionStatus() {
  if (!canManageUsers()) {
    alert('只有管理員可以檢查帳號建立功能。')
    return
  }

  try {
    const { data: sessionData } = await supabase.auth.getSession()
    const accessToken = sessionData?.session?.access_token

    if (!accessToken) {
      alert('登入狀態已失效，請重新登入。')
      return
    }

    const response = await fetch(`${SUPABASE_URL}/functions/v1/admin-create-user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        dry_run: true
      })
    })

    const result = await response.json().catch(() => ({}))

    if (!response.ok) {
      throw new Error(result.error || `HTTP ${response.status}`)
    }

    alert('帳號建立功能檢查成功：Edge Function 已部署，權限也正常。')
  } catch (err) {
    console.error(err)
    alert(`帳號建立功能尚未完成：${err.message || err}\n\n請確認：\n1. admin-create-user Edge Function 已部署\n2. SUPABASE_SERVICE_ROLE_KEY 已設定\n3. 目前登入者是管理員`)
  }
}



async function loadStaff() {
  const { data, error } = await supabase
    .from('staff')
    .select('staff_id, name, department_id, department_name, position, role, status, deleted_at, display_order')
    .order('display_order', { ascending: true })

  if (error) {
    console.error(error)
    staffList = []
    allStaffList = []
    return
  }

  allStaffList = data || []
  staffList = allStaffList.filter(staff => !staff.deleted_at && (staff.status || '啟用') === '啟用')
}

async function loadSchedules() {
  loadingSchedules = true
  schedulesError = ''

  const { data, error } = await supabase
    .from('schedules')
    .select('*, schedule_assignees(*)')
    .is('deleted_at', null)
    .order('start_date', { ascending: true })
    .order('start_time', { ascending: true })

  if (error) {
    console.error(error)
    schedules = []
    schedulesError = error.message
  } else {
    schedules = data || []
  }

  loadingSchedules = false
}


async function loadAuditLogs() {
  auditLoading = true
  auditError = ''

  const { data, error } = await supabase
    .from('audit_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(300)

  if (error) {
    console.error(error)
    auditLogs = []
    auditError = error.message
  } else {
    auditLogs = data || []
  }

  auditLoading = false
}


async function loadServiceRecords() {
  serviceRecordsLoading = true
  serviceRecordsError = ''

  const { data, error } = await supabase
    .from('service_records')
    .select('*')
    .order('schedule_date', { ascending: false })
    .limit(500)

  if (error) {
    console.error(error)
    serviceRecords = []
    serviceRecordsError = error.message
  } else {
    serviceRecords = data || []
  }

  serviceRecordsLoading = false
}

function renderApp() {
  const visiblePages = pages.filter(page => canSeePage(page, currentProfile.role))
  const isMobileViewport = window.matchMedia('(max-width: 768px)').matches
  if (!visiblePages.some(page => page.key === currentPage)) currentPage = 'personalSchedule'
  if (isMobileViewport && visiblePages.some(page => page.key === currentPage && page.mobile === false)) currentPage = 'personalSchedule'
  const mobilePages = visiblePages.filter(page => page.mobile && page.key !== 'users')

  document.querySelector('#app').innerHTML = `
    <section class="layout">
      <aside class="sidebar">
        <div class="brand">
          <div class="brand-logo-wrap">${renderBrandLogo('horizontal')}</div>
          <div class="brand-subtitle">共享排程系統</div>
        </div>

        <nav class="desktop-menu">
          ${visiblePages.map(page => `
            <button class="menu-btn ${page.key === currentPage ? 'active' : ''}" data-page="${page.key}">
              <span class="menu-icon" aria-hidden="true">${renderPageIcon(page.key)}</span>
              <span class="menu-label">${page.label}</span>
            </button>
          `).join('')}
        </nav>
      </aside>

      <main class="main">
        <header class="mobile-header">
          ${renderBrandLogo('horizontal')}
        </header>

        <header class="topbar">
          <div>
            <h2>${getPageTitle()}</h2>
            <p>
              ${currentProfile.name || currentProfile.email}
              ｜${currentProfile.role}
              ｜${currentProfile.department_name || '-'}
              ｜${currentProfile.position_name || currentProfile.position || '-'}
            </p>
          </div>
          <button class="logout-btn" id="logoutBtn">登出</button>
        </header>

        <section class="content-card">
          ${renderPageContent()}
        </section>
      </main>

      <nav class="mobile-nav">
        ${mobilePages.map(page => `
          <button class="${page.key === currentPage ? 'active' : ''}" data-page="${page.key}">
            <span class="mobile-menu-icon" aria-hidden="true">${renderPageIcon(page.key)}</span>
            <span class="mobile-menu-label">${page.mobileLabel}</span>
          </button>
        `).join('')}
      </nav>
    </section>
  `

  document.querySelectorAll('[data-page]').forEach(btn => {
    btn.addEventListener('click', () => {
      currentPage = btn.dataset.page
      renderApp()
    })
  })

  document.querySelector('#logoutBtn').addEventListener('click', logout)

  injectExportCsvButton()

  const exportCsvBtn = document.querySelector('#exportCsvBtn')
  if (exportCsvBtn) {
    exportCsvBtn.addEventListener('click', () => openExportCsvModal())
  }

  const refreshBtn = document.querySelector('#refreshBtn')
  if (refreshBtn) {
    refreshBtn.addEventListener('click', async () => {
      await refreshData()
      renderApp()
    })
  }

  const resetSearchBtn = document.querySelector('#resetSearchBtn')
  if (resetSearchBtn) {
    resetSearchBtn.addEventListener('click', () => {
      searchFilters = {
        keyword: '',
        status: '全部',
        category: '全部',
        staffId: '全部',
        startDate: '',
        endDate: ''
      }
      renderApp()
    })
  }

  const searchForm = document.querySelector('#searchForm')
  if (searchForm) {
    searchForm.addEventListener('submit', event => {
      event.preventDefault()
      const form = new FormData(event.target)
      searchFilters = {
        keyword: form.get('keyword') || '',
        status: form.get('status') || '全部',
        category: form.get('category') || '全部',
        staffId: form.get('staffId') || '全部',
        startDate: form.get('startDate') || '',
        endDate: form.get('endDate') || ''
      }
      renderApp()
    })
  }

  const resetAuditBtn = document.querySelector('#resetAuditBtn')
  if (resetAuditBtn) {
    resetAuditBtn.addEventListener('click', () => {
      auditFilters = {
        keyword: '',
        actionType: '全部',
        sourceType: '全部',
        department: '全部',
        staffId: '全部',
        startDate: '',
        endDate: ''
      }
      renderApp()
    })
  }

  const auditForm = document.querySelector('#auditForm')
  if (auditForm) {
    auditForm.addEventListener('submit', event => {
      event.preventDefault()
      const form = new FormData(event.target)
      auditFilters = {
        keyword: form.get('keyword') || '',
        actionType: form.get('actionType') || '全部',
        sourceType: form.get('sourceType') || '全部',
        department: form.get('department') || '全部',
        staffId: form.get('staffId') || '全部',
        startDate: form.get('startDate') || '',
        endDate: form.get('endDate') || ''
      }
      renderApp()
    })
  }

  
  document.querySelectorAll('[data-view-audit-index]').forEach(btn => {
    btn.addEventListener('click', () => openAuditDetailModal(Number(btn.dataset.viewAuditIndex)))
  })

  const resetServiceRecordFilterBtn = document.querySelector('#resetServiceRecordFilterBtn')
  if (resetServiceRecordFilterBtn) {
    resetServiceRecordFilterBtn.addEventListener('click', () => {
      serviceRecordFilters = {
        status: '全部',
        staffId: '全部',
        department: '全部',
        scheduleType: '全部',
        keyword: '',
        startDate: '',
        endDate: ''
      }
      renderApp()
    })
  }

  const serviceRecordFilterForm = document.querySelector('#serviceRecordFilterForm')
  if (serviceRecordFilterForm) {
    serviceRecordFilterForm.addEventListener('submit', event => {
      event.preventDefault()
      const form = new FormData(event.target)
      serviceRecordFilters = {
        status: form.get('status') || '全部',
        staffId: form.get('staffId') || '全部',
        department: form.get('department') || '全部',
        scheduleType: form.get('scheduleType') || '全部',
        keyword: form.get('keyword') || '',
        startDate: form.get('startDate') || '',
        endDate: form.get('endDate') || ''
      }
      renderApp()
    })
  }

  const overviewFilterForm = document.querySelector('#overviewFilterForm')
  if (overviewFilterForm) {
    overviewFilterForm.addEventListener('submit', event => {
      event.preventDefault()
      const form = new FormData(event.target)
      overviewFilters = normalizeOverviewFilters({
        departments: form.getAll('departments'),
        staffIds: form.getAll('staffIds'),
        sortBy: form.get('sortBy') || 'display_order',
        sortDir: form.get('sortDir') || 'asc'
      })
      saveOverviewFiltersPreference()
      renderApp()
    })
  }

  const resetOverviewFilterBtn = document.querySelector('#resetOverviewFilterBtn')
  if (resetOverviewFilterBtn) {
    resetOverviewFilterBtn.addEventListener('click', () => {
      overviewFilters = normalizeOverviewFilters()
      saveOverviewFiltersPreference()
      renderApp()
    })
  }

  const prevWeekBtn = document.querySelector('#prevWeekBtn')
  if (prevWeekBtn) {
    prevWeekBtn.addEventListener('click', () => {
      overviewWeekOffset -= 1
      renderApp()
    })
  }

  const thisWeekBtn = document.querySelector('#thisWeekBtn')
  if (thisWeekBtn) {
    thisWeekBtn.addEventListener('click', () => {
      overviewWeekOffset = 0
      renderApp()
    })
  }

  const nextWeekBtn = document.querySelector('#nextWeekBtn')
  if (nextWeekBtn) {
    nextWeekBtn.addEventListener('click', () => {
      overviewWeekOffset += 1
      renderApp()
    })
  }

  document.querySelectorAll('.week-day-cell').forEach(cell => {
    cell.addEventListener('dblclick', () => { if (canCreateServiceSchedule()) openScheduleModal(); else denyPermission('你的角色不能在行程總覽新增服務行程，請到個人行程表新增自己的事項。') })
  })


  const fieldScheduleFilterForm = document.querySelector('#fieldScheduleFilterForm')
  if (fieldScheduleFilterForm) {
    fieldScheduleFilterForm.addEventListener('submit', event => {
      event.preventDefault()
      const form = new FormData(event.target)
      fieldScheduleFilters = normalizeFieldScheduleFilters({
        departments: form.getAll('fieldDepartments'),
        staffIds: form.getAll('fieldStaffIds'),
        sortBy: form.get('fieldSortBy') || 'display_order',
        sortDir: form.get('fieldSortDir') || 'asc'
      })
      saveFieldScheduleFiltersPreference()
      renderApp()
    })
  }

  const resetFieldScheduleFilterBtn = document.querySelector('#resetFieldScheduleFilterBtn')
  if (resetFieldScheduleFilterBtn) {
    resetFieldScheduleFilterBtn.addEventListener('click', () => {
      fieldScheduleFilters = normalizeFieldScheduleFilters()
      saveFieldScheduleFiltersPreference()
      renderApp()
    })
  }

  const fieldPrevWeekBtn = document.querySelector('#fieldPrevWeekBtn')
  if (fieldPrevWeekBtn) {
    fieldPrevWeekBtn.addEventListener('click', () => {
      fieldWeekOffset -= 1
      renderApp()
    })
  }

  const fieldThisWeekBtn = document.querySelector('#fieldThisWeekBtn')
  if (fieldThisWeekBtn) {
    fieldThisWeekBtn.addEventListener('click', () => {
      fieldWeekOffset = 0
      renderApp()
    })
  }

  const fieldNextWeekBtn = document.querySelector('#fieldNextWeekBtn')
  if (fieldNextWeekBtn) {
    fieldNextWeekBtn.addEventListener('click', () => {
      fieldWeekOffset += 1
      renderApp()
    })
  }

  document.querySelectorAll('.field-week-day-cell').forEach(cell => {
    cell.addEventListener('dblclick', () => {
      if (!canCreateFieldSchedule()) return denyPermission('你的角色沒有新增外務行程權限。')
      openFieldScheduleModal({
        date: cell.dataset.fieldDate || '',
        staffId: cell.dataset.staffId || ''
      })
    })
  })


  const meetingPrevWeekBtn = document.querySelector('#meetingPrevWeekBtn')
  if (meetingPrevWeekBtn) {
    meetingPrevWeekBtn.addEventListener('click', () => {
      meetingWeekOffset -= 1
      renderApp()
    })
  }

  const meetingThisWeekBtn = document.querySelector('#meetingThisWeekBtn')
  if (meetingThisWeekBtn) {
    meetingThisWeekBtn.addEventListener('click', () => {
      meetingWeekOffset = 0
      renderApp()
    })
  }

  const meetingNextWeekBtn = document.querySelector('#meetingNextWeekBtn')
  if (meetingNextWeekBtn) {
    meetingNextWeekBtn.addEventListener('click', () => {
      meetingWeekOffset += 1
      renderApp()
    })
  }

  document.querySelectorAll('.meeting-week-day-cell').forEach(cell => {
    cell.addEventListener('dblclick', () => {
      if (!canCreateMeetingRoomSchedule()) return denyPermission('你的角色沒有新增會議室預約權限。')
      openMeetingRoomModal({
        date: cell.dataset.meetingDate || '',
        room: cell.dataset.meetingRoom || ''
      })
    })
  })


  const addIncidentBtn = document.querySelector('#addIncidentBtn')
  if (addIncidentBtn) {
    addIncidentBtn.addEventListener('click', () => {
      if (!canCreateIncidentSchedule()) return denyPermission('你的角色沒有新增異況權限。')
      openIncidentModal()
    })
  }

  const incidentFilterForm = document.querySelector('#incidentFilterForm')
  if (incidentFilterForm) {
    incidentFilterForm.addEventListener('submit', event => {
      event.preventDefault()
      const form = new FormData(event.target)
      incidentFilters = {
        staffId: form.get('staffId') || '全部',
        status: form.get('status') || '全部',
        keyword: form.get('keyword') || ''
      }
      renderApp()
    })
  }

  const resetIncidentFilterBtn = document.querySelector('#resetIncidentFilterBtn')
  if (resetIncidentFilterBtn) {
    resetIncidentFilterBtn.addEventListener('click', () => {
      incidentFilters = {
        staffId: '全部',
        status: '全部',
        keyword: ''
      }
      renderApp()
    })
  }

  document.querySelectorAll('[data-incident-next]').forEach(btn => {
    btn.addEventListener('click', () => {
      openIncidentNextTrackingModal(btn.dataset.incidentNext)
    })
  })

  bindIncidentTrackingEditButtons(document)

  document.querySelectorAll('[data-incident-complete]').forEach(btn => {
    btn.addEventListener('click', async () => {
      await completeSchedule(btn.dataset.incidentComplete)
    })
  })


  const statsFilterForm = document.querySelector('#statsFilterForm')
  if (statsFilterForm) {
    statsFilterForm.addEventListener('submit', event => {
      event.preventDefault()
      const form = new FormData(event.target)
      statsFilters = {
        period: form.get('period') || '當月',
        startDate: form.get('startDate') || '',
        endDate: form.get('endDate') || '',
        department: form.get('department') || '全部',
        staffId: form.get('staffId') || '全部',
        category: form.get('category') || '全部'
      }
      renderApp()
    })
  }

  const resetStatsFilterBtn = document.querySelector('#resetStatsFilterBtn')
  if (resetStatsFilterBtn) {
    resetStatsFilterBtn.addEventListener('click', () => {
      statsFilters = {
        period: '當月',
        startDate: '',
        endDate: '',
        department: '全部',
        staffId: '全部',
        category: '全部'
      }
      renderApp()
    })
  }


  const optionManagementForm = document.querySelector('#optionManagementForm')
  if (optionManagementForm) {
    initOptionLineEditors(optionManagementForm)
    initScheduleTemplateEditors(optionManagementForm)
    optionManagementForm.addEventListener('submit', async event => {
      event.preventDefault()
      syncOptionLineEditors(event.target)
      syncScheduleTemplateEditors(event.target)
      const form = new FormData(event.target)
      const nextOptions = {
        userManageDepartments: parseOptionLines(form.get('userManageDepartments')),
        userManagePositions: parseOptionLines(form.get('userManagePositions')).filter(position => !isRemovedUserManagePosition(position)),
        serviceScheduleTypes: parseOptionLines(form.get('serviceScheduleTypes')),
        scheduleContentTemplates: parseTemplateLines(form.get('scheduleContentTemplates')),
        todoItems: parseOptionLines(form.get('todoItems')),
        leaveMeetingTypes: parseOptionLines(form.get('leaveMeetingTypes')),
        carOptions: parseOptionLines(form.get('carOptions')),
        fieldPurposeOptions: parseOptionLines(form.get('fieldPurposeOptions')),
        fieldSpecialReminderOptions: parseOptionLines(form.get('fieldSpecialReminderOptions')),
        incidentTypeOptions: parseOptionLines(form.get('incidentTypeOptions')),
        incidentUrgencyOptions: parseOptionLines(form.get('incidentUrgencyOptions')),
        meetingRoomOptions: parseOptionLines(form.get('meetingRoomOptions')),
        fieldLocationOptions: parseLocationLines(form.get('fieldLocationOptions'))
      }

      await saveManagedOptions(nextOptions)
      alert('選項已儲存。')
      renderApp()
    })
  }

  const resetOptionManagementBtn = document.querySelector('#resetOptionManagementBtn')
  if (resetOptionManagementBtn) {
    resetOptionManagementBtn.addEventListener('click', async () => {
      if (!confirm('確定要還原選項管理為系統預設值嗎？')) return
      await resetManagedOptions()
      renderApp()
    })
  }

  const usersFilterForm = document.querySelector('#usersFilterForm')
  if (usersFilterForm) {
    usersFilterForm.addEventListener('submit', event => {
      event.preventDefault()
      const form = new FormData(event.target)
      userAccountFilters = {
        keyword: form.get('keyword') || '',
        department: form.get('department') || '全部',
        role: form.get('role') || '全部',
        fieldStaff: form.get('fieldStaff') || '全部'
      }
      renderApp()
    })
  }

  const resetUsersFilterBtn = document.querySelector('#resetUsersFilterBtn')
  if (resetUsersFilterBtn) {
    resetUsersFilterBtn.addEventListener('click', () => {
      userAccountFilters = {
        keyword: '',
        department: '全部',
        role: '全部',
        fieldStaff: '全部'
      }
      renderApp()
    })
  }

  document.querySelectorAll('[data-field-staff-toggle]').forEach(input => {
    input.addEventListener('change', async () => {
      await setStaffFieldWorker(input.dataset.fieldStaffToggle, input.checked)
      renderApp()
    })
  })

  const lineNotifyForm = document.querySelector('#lineNotifyForm')
  if (lineNotifyForm) {
    lineNotifyForm.addEventListener('submit', event => {
      event.preventDefault()
      const form = new FormData(event.target)
      lineNotifyState = {
        type: form.get('type') || '今日行程',
        target: form.get('target') || '自己'
      }
      renderApp()
    })
  }

  const copyLineMessageBtn = document.querySelector('#copyLineMessageBtn')
  if (copyLineMessageBtn) {
    copyLineMessageBtn.addEventListener('click', async () => {
      const text = document.querySelector('#lineMessageText')?.value || ''
      if (!text.trim()) {
        alert('目前沒有可複製的 LINE 訊息。')
        return
      }

      try {
        await navigator.clipboard.writeText(text)
        alert('LINE 訊息已複製。')
      } catch (err) {
        console.error(err)
        alert('無法自動複製，請手動選取文字複製。')
      }
    })
  }

  const openLineShareBtn = document.querySelector('#openLineShareBtn')
  if (openLineShareBtn) {
    openLineShareBtn.addEventListener('click', () => {
      const text = document.querySelector('#lineMessageText')?.value || ''
      if (!text.trim()) {
        alert('目前沒有可分享的 LINE 訊息。')
        return
      }
      window.open(`https://line.me/R/share?text=${encodeURIComponent(text)}`, '_blank')
    })
  }

  document.querySelectorAll('[data-create-login-staff]').forEach(btn => {
    btn.addEventListener('click', () => openLoginAccountModal(btn.dataset.createLoginStaff))
  })

  document.querySelectorAll('[data-rebind-login-staff]').forEach(btn => {
    btn.addEventListener('click', () => openRebindLoginAccountModal(btn.dataset.rebindLoginStaff))
  })

  document.querySelectorAll('[data-reset-password-email]').forEach(btn => {
    btn.addEventListener('click', () => openAdminPasswordResetModal(btn.dataset.resetPasswordEmail, btn.dataset.resetPasswordName || ''))
  })

  document.querySelectorAll('[data-delete-user]').forEach(btn => {
    btn.addEventListener('click', () => deleteStaffUser(btn.dataset.deleteUser, btn.dataset.deleteUserName || ''))
  })

  document.querySelectorAll('[data-activate-user]').forEach(btn => {
    btn.addEventListener('click', () => activateStaffUser(btn.dataset.activateUser, btn.dataset.activateUserName || ''))
  })

  const runHealthDryRunBtn = document.querySelector('#runHealthDryRunBtn')
  if (runHealthDryRunBtn) {
    runHealthDryRunBtn.addEventListener('click', () => runHealthDryRunCheck())
  }

  const copyHealthReportBtn = document.querySelector('#copyHealthReportBtn')
  if (copyHealthReportBtn) {
    copyHealthReportBtn.addEventListener('click', () => copySystemHealthReport())
  }

  const clearUiMemoryBtn = document.querySelector('#clearUiMemoryBtn')
  if (clearUiMemoryBtn) {
    clearUiMemoryBtn.addEventListener('click', () => clearMyUiMemory())
  }

  document.querySelectorAll('[data-launch-test-item]').forEach(input => {
    input.addEventListener('change', () => toggleLaunchTestItem(input.dataset.launchTestItem, input.checked))
  })

  const clearLaunchTestBtn = document.querySelector('#clearLaunchTestBtn')
  if (clearLaunchTestBtn) {
    clearLaunchTestBtn.addEventListener('click', () => clearLaunchTestProgress())
  }

  const copyLaunchTestBtn = document.querySelector('#copyLaunchTestBtn')
  if (copyLaunchTestBtn) {
    copyLaunchTestBtn.addEventListener('click', () => copyLaunchTestReport())
  }

  const copyLaunchReadinessBtn = document.querySelector('#copyLaunchReadinessBtn')
  if (copyLaunchReadinessBtn) {
    copyLaunchReadinessBtn.addEventListener('click', () => copyLaunchReadinessReport())
  }

  document.querySelectorAll('[data-backup-export]').forEach(btn => {
    btn.addEventListener('click', () => exportLaunchBackup(btn.dataset.backupExport))
  })

  document.querySelectorAll('[data-role-test-complete]').forEach(btn => {
    btn.addEventListener('click', () => toggleRoleTestComplete(btn.dataset.roleTestComplete))
  })

  document.querySelectorAll('[data-copy-role-test]').forEach(btn => {
    btn.addEventListener('click', () => copyRoleTestChecklist(btn.dataset.copyRoleTest))
  })

  const clearRoleTestBtn = document.querySelector('#clearRoleTestBtn')
  if (clearRoleTestBtn) {
    clearRoleTestBtn.addEventListener('click', () => clearRoleTestProgress())
  }

  const copyFinalAcceptanceBtn = document.querySelector('#copyFinalAcceptanceBtn')
  if (copyFinalAcceptanceBtn) {
    copyFinalAcceptanceBtn.addEventListener('click', () => copyFinalAcceptanceReport())
  }

  const checkLoginFunctionBtn = document.querySelector('#checkLoginFunctionBtn')
  if (checkLoginFunctionBtn) {
    checkLoginFunctionBtn.addEventListener('click', () => checkLoginFunctionStatus())
  }

  const changeMyPasswordBtn = document.querySelector('#changeMyPasswordBtn')
  if (changeMyPasswordBtn) {
    changeMyPasswordBtn.addEventListener('click', () => openOwnPasswordModal())
  }

  document.querySelectorAll('[data-change-own-password]').forEach(btn => {
    btn.addEventListener('click', () => openOwnPasswordModal(btn.dataset.changeOwnPassword || currentProfile?.email || ''))
  })

  const addUserAccountBtn = document.querySelector('#addUserAccountBtn')
  if (addUserAccountBtn) {
    addUserAccountBtn.addEventListener('click', () => openUserAccountModal())
  }

  document.querySelectorAll('[data-edit-user]').forEach(btn => {
    btn.addEventListener('click', () => openUserAccountModal(btn.dataset.editUser))
  })

  const colorSettingsForm = document.querySelector('#colorSettingsForm')
  if (colorSettingsForm) {
    colorSettingsForm.addEventListener('submit', async event => {
      event.preventDefault()
      const form = new FormData(event.target)
      const nextColors = {}
      getScheduleColorDefinitions().forEach(item => {
        nextColors[item.key] = form.get(`color_${item.key}`) || item.defaultColor
      })
      await saveScheduleColorSettings(nextColors)
      alert('顏色設定已儲存。')
      renderApp()
    })
  }

  const resetColorSettingsBtn = document.querySelector('#resetColorSettingsBtn')
  if (resetColorSettingsBtn) {
    resetColorSettingsBtn.addEventListener('click', async () => {
      if (!confirm('確定要還原行程顏色預設值嗎？')) return
      await resetScheduleColorSettings()
      renderApp()
    })
  }

  const addBtn = document.querySelector('#addScheduleBtn')
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      if (!canCreateForCurrentPage()) return denyPermission()
      if (currentPage === 'fieldSchedule') openFieldScheduleModal()
      else if (currentPage === 'meetingRoom') openMeetingRoomModal()
      else openScheduleModal()
    })
  }

  document.querySelectorAll('[data-view-schedule]').forEach(btn => {
    btn.addEventListener('click', () => openScheduleDetail(btn.dataset.viewSchedule))
  })

  document.querySelectorAll('[data-record-schedule]').forEach(btn => {
    btn.addEventListener('click', () => openServiceRecordModal(btn.dataset.recordSchedule))
  })


  const resetFieldDetailFilterBtn = document.querySelector('#resetFieldDetailFilterBtn')
  if (resetFieldDetailFilterBtn) {
    resetFieldDetailFilterBtn.addEventListener('click', () => {
      fieldDetailFilters = {
        staffId: '全部',
        location: '',
        purpose: '全部',
        status: '全部',
        startDate: '',
        endDate: ''
      }
      renderApp()
    })
  }

  const fieldDetailFilterForm = document.querySelector('#fieldDetailFilterForm')
  if (fieldDetailFilterForm) {
    fieldDetailFilterForm.addEventListener('submit', event => {
      event.preventDefault()
      const form = new FormData(event.target)
      fieldDetailFilters = {
        staffId: form.get('staffId') || '全部',
        location: form.get('location') || '',
        purpose: form.get('purpose') || '全部',
        status: form.get('status') || '全部',
        startDate: form.get('startDate') || '',
        endDate: form.get('endDate') || ''
      }
      renderApp()
    })
  }

  document.querySelectorAll('[data-field-complete]').forEach(btn => {
    btn.addEventListener('click', async () => {
      await completeSchedule(btn.dataset.fieldComplete)
    })
  })

  document.querySelectorAll('[data-field-cancel]').forEach(btn => {
    btn.addEventListener('click', () => {
      openCancelModal(btn.dataset.fieldCancel)
    })
  })
}

function getPageTitle() {
  const page = pages.find(item => item.key === currentPage)
  return page ? page.label : '個人行程表'
}


function normalizeText(value) {
  return String(value || '').toLowerCase().trim()
}

function matchesSearchFilters(row) {
  const keyword = normalizeText(searchFilters.keyword)
  const status = searchFilters.status
  const category = searchFilters.category
  const staffId = searchFilters.staffId
  const startDate = searchFilters.startDate
  const endDate = searchFilters.endDate

  if (status !== '全部' && row.status !== status) return false
  if (category !== '全部' && row.category !== category) return false

  if (staffId !== '全部') {
    const assigned = (row.schedule_assignees || []).some(item => item.staff_id === staffId && !item.deleted_at)
    if (!assigned) return false
  }

  if (startDate && row.start_date < startDate) return false
  if (endDate && row.start_date > endDate) return false

  if (keyword) {
    const haystack = normalizeText([
      row.title,
      row.description,
      row.category,
      row.schedule_type,
      row.sub_type,
      row.sub_type_note,
      row.customer_name,
      row.location_name,
      row.address,
      getAssigneeNames(row)
    ].join(' '))
    if (!haystack.includes(keyword)) return false
  }

  return true
}

function getSearchResults() {
  return schedules
    .filter(isSearchableSchedule)
    .filter(row => matchesSearchFilters(row))
}

function buildOptionList(items, selected) {
  return items.map(item => `<option value="${item}" ${item === selected ? 'selected' : ''}>${item}</option>`).join('')
}

function buildStaffSearchOptions() {
  return `<option value="全部" ${searchFilters.staffId === '全部' ? 'selected' : ''}>全部人員</option>` +
    staffList.map(staff => `<option value="${staff.staff_id}" ${searchFilters.staffId === staff.staff_id ? 'selected' : ''}>${staff.name}｜${staff.department_name}</option>`).join('')
}


function renderSearchResultList(rows, emptyText) {
  if (!rows.length) return `<div class="empty-state">${emptyText}</div>`

  return `
    <div class="search-result-list">
      ${rows.map(row => `
        <div class="search-result-row ${row.status === '已完成' ? 'is-completed' : ''} ${row.status === '取消' ? 'is-cancelled' : ''}">
          <div class="search-result-date">
            <strong>${escapeHtml(row.start_date || '-')}</strong>
            <span>${escapeHtml(formatTime(row))}</span>
          </div>

          <div class="search-result-main">
            <div class="search-result-title">${escapeHtml(row.schedule_type || row.category)}｜${escapeHtml(row.title || '-')}</div>
            <div class="search-result-meta">
              ${escapeHtml(row.status || '-')}｜${escapeHtml(getAssigneeNames(row))}
              ${row.customer_name ? '｜' + escapeHtml(row.customer_name) : ''}
              ${row.location_name ? '｜' + escapeHtml(row.location_name) : ''}${row.sub_type ? '｜附加：' + escapeHtml(row.sub_type) : ''}
            </div>
          </div>

          <div class="search-result-action">
            <button class="small-secondary-btn" data-view-schedule="${row.schedule_id}">查看</button>
          </div>
        </div>
      `).join('')}
    </div>
  `
}

function renderSearchPage() {
  const results = getSearchResults()
  const statusOptions = buildOptionList(['全部', '未完成', '已完成'], searchFilters.status)
  const categoryOptions = buildOptionList(['全部', ...new Set([...formCategories, '外務行程', '異況追蹤', '會議室預約'])], searchFilters.category)

  return `
    <div class="page-toolbar">
      <div>
        <h3>行程搜尋</h3>
        <p class="muted">搜尋已完成與未完成行程；已刪除 / 已取消行程不顯示。</p>
      </div>
      <div class="toolbar-actions">
        <button class="secondary-btn" id="resetSearchBtn">清除條件</button>
        <button class="secondary-btn" id="refreshBtn">重新整理</button>
      </div>
    </div>

    ${renderReadStatus()}

    <form id="searchForm" class="search-panel search-panel-simple">
      <label class="search-keyword">
        關鍵字
        <input name="keyword" value="${escapeHtml(searchFilters.keyword)}" placeholder="搜尋標題、客戶、地點、備註、人員">
      </label>

      <div class="search-row">
        <label>
          狀態
          <select name="status">${statusOptions}</select>
        </label>

        <label>
          類別
          <select name="category">${categoryOptions}</select>
        </label>

        <label>
          執行者
          <select name="staffId">${buildStaffSearchOptions()}</select>
        </label>
      </div>

      <div class="search-row date-range-row">
        <label>
          起日
          <input name="startDate" type="date" value="${searchFilters.startDate}">
        </label>

        <span class="date-range-separator">至</span>

        <label>
          迄日
          <input name="endDate" type="date" value="${searchFilters.endDate}">
        </label>

        <button type="submit" class="primary-btn">搜尋</button>
      </div>
    </form>

    <div class="summary-grid search-summary">
      <div class="summary-card">
        <strong>${results.length}</strong>
        <span>搜尋結果</span>
      </div>
      <div class="summary-card">
        <strong>${results.filter(row => row.status === '已完成').length}</strong>
        <span>已完成</span>
      </div>
      <div class="summary-card">
        <strong>${results.filter(row => row.status !== '已完成').length}</strong>
        <span>未完成</span>
      </div>
    </div>

    ${renderSearchResultList(results, '沒有符合條件的行程。')}
  `
}



function getAuditFilteredRows() {
  return auditLogs.filter(row => matchesAuditFilters(row))
}

function getAuditSourceTypes() {
  const types = [...new Set(auditLogs.map(row => row.source_type).filter(Boolean))]
  return ['全部', ...types]
}

function getAuditSourceTypeOptions() {
  return getAuditSourceTypes().map(item => `<option value="${escapeHtml(item)}" ${auditFilters.sourceType === item ? 'selected' : ''}>${escapeHtml(item)}</option>`).join('')
}

function getAuditDepartmentOptions() {
  const sourceRows = typeof allStaffList !== 'undefined' && allStaffList.length ? allStaffList : staffList
  const names = ['全部', ...new Set(sourceRows.map(staff => staff.department_name).filter(Boolean))]
  return names.map(name => `<option value="${escapeHtml(name)}" ${auditFilters.department === name ? 'selected' : ''}>${escapeHtml(name)}</option>`).join('')
}

function getAuditStaffOptions() {
  const sourceRows = typeof allStaffList !== 'undefined' && allStaffList.length ? allStaffList : staffList
  return `<option value="全部" ${auditFilters.staffId === '全部' ? 'selected' : ''}>全部人員</option>` +
    sourceRows.map(staff => `<option value="${escapeHtml(staff.staff_id)}" ${auditFilters.staffId === staff.staff_id ? 'selected' : ''}>${escapeHtml(staff.name)}｜${escapeHtml(staff.department_name || '')}</option>`).join('')
}

function getAuditRelatedSchedule(row) {
  if (!row?.source_id) return null
  if (row.source_type === 'schedule' || row.source_type === 'service_record') {
    return schedules.find(item => item.schedule_id === row.source_id) || null
  }
  return null
}

function getAuditRowStaffIds(row) {
  const ids = new Set()

  if (row?.operated_by_staff_id) ids.add(row.operated_by_staff_id)

  const schedule = getAuditRelatedSchedule(row)
  if (schedule) {
    if (schedule.creator_staff_id) ids.add(schedule.creator_staff_id)
    getAssigneeIds(schedule).forEach(id => ids.add(id))
  }

  return [...ids].filter(Boolean)
}

function getAuditRowDepartmentNames(row) {
  const names = new Set()
  getAuditRowStaffIds(row).forEach(staffId => {
    const staff = (typeof allStaffList !== 'undefined' && allStaffList.length ? allStaffList : staffList).find(item => item.staff_id === staffId)
    if (staff?.department_name) names.add(staff.department_name)
  })

  const schedule = getAuditRelatedSchedule(row)
  if (schedule?.department_name) names.add(schedule.department_name)

  return [...names].filter(Boolean)
}

function renderAuditSummary(results) {
  return `
    <div class="summary-grid search-summary audit-summary-grid">
      <div class="summary-card">
        <strong>${results.length}</strong>
        <span>異動筆數</span>
      </div>
      <div class="summary-card">
        <strong>${results.filter(row => row.action_type === '新增').length}</strong>
        <span>新增</span>
      </div>
      <div class="summary-card">
        <strong>${results.filter(row => String(row.action_type || '').includes('修改')).length}</strong>
        <span>修改類</span>
      </div>
      <div class="summary-card">
        <strong>${results.filter(row => row.action_type === '取消').length}</strong>
        <span>取消</span>
      </div>
      <div class="summary-card">
        <strong>${results.filter(row => row.source_type === 'schedule').length}</strong>
        <span>行程異動</span>
      </div>
    </div>
  `
}

function openAuditDetailModal(index) {
  const rows = getAuditFilteredRows()
  const row = rows[index]
  if (!row) return

  const schedule = getAuditRelatedSchedule(row)

  const modal = document.createElement('div')
  modal.className = 'modal-backdrop'
  modal.innerHTML = `
    <div class="modal-panel detail-panel audit-detail-panel">
      <div class="modal-header">
        <h3>異動紀錄明細</h3>
        <button class="icon-btn" id="closeAuditDetailBtn" type="button">×</button>
      </div>

      <div class="detail-grid">
        <div><span>異動時間</span><strong>${escapeHtml(formatDateTime(row.created_at))}</strong></div>
        <div><span>動作類型</span><strong>${escapeHtml(row.action_type || '-')}</strong></div>
        <div><span>操作人</span><strong>${escapeHtml(row.operated_by_name || '-')}</strong></div>
        <div><span>來源類型</span><strong>${escapeHtml(row.source_type || '-')}</strong></div>
        <div class="span-2"><span>來源 ID</span><strong>${escapeHtml(row.source_id || '-')}</strong></div>
        <div class="span-2"><span>異動對象</span><strong>${escapeHtml(getAuditSourceLabel(row))}</strong></div>
        <div class="span-2"><span>備註</span><strong>${escapeHtml(row.note || '-')}</strong></div>
        ${schedule ? `
          <div><span>行程日期</span><strong>${escapeHtml(schedule.start_date || '-')}</strong></div>
          <div><span>行程時間</span><strong>${escapeHtml(formatTime(schedule))}</strong></div>
          <div><span>行程類型</span><strong>${escapeHtml(schedule.schedule_type || schedule.category || '-')}</strong></div>
          <div><span>狀態</span><strong>${escapeHtml(getScheduleStatusLabel(schedule))}</strong></div>
          <div class="span-2"><span>執行者</span><strong>${escapeHtml(getAssigneeNames(schedule) || '-')}</strong></div>
          <div class="span-2"><span>行程內容</span><strong>${escapeHtml(schedule.title || '-')}</strong></div>
        ` : ''}
      </div>

      <div class="modal-actions">
        <button type="button" class="secondary-btn" id="closeAuditDetailBtn2">關閉</button>
        ${schedule ? `<button type="button" class="primary-btn" id="openAuditSourceScheduleBtn">查看原行程</button>` : ''}
      </div>
    </div>
  `

  document.body.appendChild(modal)
  document.querySelector('#closeAuditDetailBtn').addEventListener('click', () => modal.remove())
  document.querySelector('#closeAuditDetailBtn2').addEventListener('click', () => modal.remove())

  const openScheduleBtn = document.querySelector('#openAuditSourceScheduleBtn')
  if (openScheduleBtn && schedule) {
    openScheduleBtn.addEventListener('click', () => {
      modal.remove()
      openScheduleDetail(schedule.schedule_id)
    })
  }
}


function matchesAuditFilters(row) {
  const keyword = normalizeText(auditFilters.keyword)
  const actionType = auditFilters.actionType
  const sourceType = auditFilters.sourceType || '全部'
  const department = auditFilters.department || '全部'
  const staffId = auditFilters.staffId || '全部'
  const startDate = auditFilters.startDate
  const endDate = auditFilters.endDate
  const createdDate = row.created_at ? row.created_at.slice(0, 10) : ''

  if (actionType !== '全部' && row.action_type !== actionType) return false
  if (sourceType !== '全部' && row.source_type !== sourceType) return false
  if (startDate && createdDate < startDate) return false
  if (endDate && createdDate > endDate) return false

  if (department !== '全部' && !getAuditRowDepartmentNames(row).includes(department)) return false
  if (staffId !== '全部' && !getAuditRowStaffIds(row).includes(staffId)) return false

  if (keyword) {
    const haystack = normalizeText([
      row.operated_by_name,
      row.action_type,
      row.source_type,
      row.note,
      row.source_id,
      getAuditSourceLabel(row),
      getAuditRowDepartmentNames(row).join(' ')
    ].join(' '))
    if (!haystack.includes(keyword)) return false
  }

  return true
}

function formatDateTime(value) {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })
}

function getAuditActionTypes() {
  const types = [...new Set(auditLogs.map(row => row.action_type).filter(Boolean))]
  return ['全部', ...types]
}

function renderAuditPage() {
  const results = getAuditFilteredRows()
  const actionOptions = getAuditActionTypes().map(item => `<option value="${escapeHtml(item)}" ${auditFilters.actionType === item ? 'selected' : ''}>${escapeHtml(item)}</option>`).join('')

  return `
    <div class="page-toolbar">
      <div>
        <h3>異動紀錄</h3>
        <p class="muted">查詢新增、修改、完成、取消、紀錄單、回診與執行者異動紀錄。</p>
      </div>
      <div class="toolbar-actions">
        <button class="secondary-btn" id="resetAuditBtn">清除條件</button>
        <button class="secondary-btn" id="refreshBtn">重新整理</button>
      </div>
    </div>

    ${auditLoading ? '<div class="notice">正在讀取異動紀錄...</div>' : ''}
    ${auditError ? `<div class="error-card">讀取異動紀錄失敗：${escapeHtml(auditError)}</div>` : ''}

    <form id="auditForm" class="search-panel search-panel-simple audit-filter-panel">
      <label class="search-keyword">
        關鍵字
        <input name="keyword" value="${escapeHtml(auditFilters.keyword)}" placeholder="搜尋操作人、動作、備註、異動行程">
      </label>

      <div class="search-row audit-filter-row">
        <label>
          動作類型
          <select name="actionType">${actionOptions}</select>
        </label>

        <label>
          來源類型
          <select name="sourceType">${getAuditSourceTypeOptions()}</select>
        </label>

        <label>
          部門
          <select name="department">${getAuditDepartmentOptions()}</select>
        </label>

        <label>
          人員
          <select name="staffId">${getAuditStaffOptions()}</select>
        </label>
      </div>

      <div class="search-row date-range-row audit-date-row">
        <label>
          起日
          <input name="startDate" type="date" value="${auditFilters.startDate}">
        </label>

        <span class="date-range-separator">至</span>

        <label>
          迄日
          <input name="endDate" type="date" value="${auditFilters.endDate}">
        </label>

        <button type="submit" class="primary-btn">搜尋</button>
      </div>
    </form>

    ${renderAuditSummary(results)}
    ${renderAuditList(results)}
  `
}


function getAuditSourceLabel(row) {
  if (!row) return '-'

  if (row.source_type === 'schedule' && row.source_id) {
    const schedule = schedules.find(item => item.schedule_id === row.source_id)
    if (schedule) {
      const type = schedule.schedule_type || schedule.category || '行程'
      const title = schedule.title || '-'
      const date = schedule.start_date || '-'
      const status = schedule.status || '-'
      return `${type}｜${title}｜${date}｜${status}`
    }
  }

  if (row.source_type === 'service_record' && row.source_id) {
    const schedule = schedules.find(item => item.schedule_id === row.source_id)
    if (schedule) {
      return `服務紀錄單｜${schedule.schedule_type || schedule.category || '行程'}｜${schedule.title || '-'}｜${schedule.start_date || '-'}`
    }
  }

  return `${row.source_type || '-'}｜${row.source_id || '-'}`
}


function renderAuditList(rows) {
  if (!rows.length) return `<div class="empty-state">沒有符合條件的異動紀錄。</div>`

  return `
    <div class="audit-list audit-list-detail">
      ${rows.map((row, index) => `
        <div class="audit-row">
          <div class="audit-time">${escapeHtml(formatDateTime(row.created_at))}</div>
          <div class="audit-main">
            <div class="audit-title">
              <span class="audit-action">${escapeHtml(row.action_type || '-')}</span>
              <strong>${escapeHtml(row.operated_by_name || '-')}</strong>
              <em>${escapeHtml(row.source_type || '-')}</em>
            </div>
            <div class="audit-note">${escapeHtml(row.note || '-')}</div>
            <div class="audit-meta audit-source"><span>異動行程：</span>${escapeHtml(getAuditSourceLabel(row))}</div>
          </div>
          <div class="audit-actions">
            <button type="button" class="small-secondary-btn" data-view-audit-index="${index}">查看</button>
          </div>
        </div>
      `).join('')}
    </div>
  `
}



/* FOR-e V002-1I-1 START - field schedule weekly calendar */
/*
  V002-1I-1｜外務行程週曆骨架
  只做畫面骨架與既有資料顯示，不改 Supabase、不改 SQL、不改新增 / 修改 / 儲存主流程。
*/


/* FOR-e V002-1K-1-4 START - schedule mode display helpers */
function getDateFromKey(dateKey) {
  const [year, month, day] = String(dateKey || '').split('-').map(Number)
  if (!year || !month || !day) return null
  return new Date(year, month - 1, day)
}

function getWeekdayValueFromDateKey(dateKey) {
  const date = getDateFromKey(dateKey)
  if (!date) return ''
  return ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'][date.getDay()]
}

function getWeekdayLabelFromDateKey(dateKey) {
  const value = getWeekdayValueFromDateKey(dateKey)
  return weekdays.find(([weekdayValue]) => weekdayValue === value)?.[1] || ''
}

function getScheduleModeFromNote(row) {
  const note = String(row?.sub_type_note || '')
  const match = note.match(/行程模式：([^｜；]+)/)
  return match ? match[1].trim() : '單日'
}

function getRepeatWeekdayValuesFromNote(row) {
  const note = String(row?.sub_type_note || '')
  const match = note.match(/重複星期：([^｜]+)/)
  const labelText = match ? match[1] : ''
  const values = weekdays
    .filter(([, label]) => labelText.includes(label))
    .map(([value]) => value)

  if (values.length) return values

  const startWeekday = getWeekdayValueFromDateKey(row?.start_date)
  return startWeekday ? [startWeekday] : []
}

function scheduleMatchesDateByMode(row, dateKey) {
  if (!row?.start_date || !dateKey) return false

  const startDate = row.start_date
  const mode = getScheduleModeFromNote(row)
  const endDate = mode === '單日'
    ? startDate
    : ((row.end_date && row.end_date >= startDate) ? row.end_date : startDate)

  if (dateKey < startDate || dateKey > endDate) return false

  if (mode === '連續日期') return true

  if (mode === '每週重複') {
    const repeatWeekdays = getRepeatWeekdayValuesFromNote(row)
    const weekdayValue = getWeekdayValueFromDateKey(dateKey)
    return repeatWeekdays.includes(weekdayValue)
  }

  if (mode === '每月重複') {
    const note = String(row.sub_type_note || '')
    const match = note.match(/每月\s*(\d{1,2})\s*號/)
    const monthlyDay = match ? Number(match[1]) : Number(startDate.slice(8, 10))
    return Number(dateKey.slice(8, 10)) === monthlyDay
  }

  return dateKey === startDate
}

function getScheduleDatesFromForm(form) {
  const startDate = form.get('start_date') || todayString()
  const endDate = getScheduleModeEndDate(form)
  const mode = form.get('repeat_mode') || '單日'
  const dates = []
  let current = getDateFromKey(startDate)
  const end = getDateFromKey(endDate)
  if (!current || !end || current > end) return [startDate]

  const selectedWeekdays = form.getAll('repeat_weekdays').filter(Boolean)
  const defaultWeekday = getWeekdayValueFromDateKey(startDate)
  const weekdayValues = new Set(selectedWeekdays.length ? selectedWeekdays : [defaultWeekday])
  const monthlyDay = Number(form.get('monthly_day') || startDate.slice(8, 10))

  while (current <= end) {
    const key = toDateKey(current)
    if (mode === '單日') {
      if (key === startDate) dates.push(key)
    } else if (mode === '連續日期') {
      dates.push(key)
    } else if (mode === '每週重複') {
      const weekdayValue = getWeekdayValueFromDateKey(key)
      if (weekdayValues.has(weekdayValue)) dates.push(key)
    } else if (mode === '每月重複') {
      if (Number(key.slice(8, 10)) === monthlyDay) dates.push(key)
    }
    current = addDays(current, 1)
  }

  return dates.length ? dates : [startDate]
}
/* FOR-e V002-1K-1-4 END - schedule mode display helpers */

const fieldStaffSettingsStorageKey = 'for-e-field-staff-settings-v002'

function getFieldStaffSettings() {
  const remoteSettings = hasSharedSetting('field_staff_settings')
    ? normalizeSettingValue(appSettings.field_staff_settings)
    : null

  if (remoteSettings) return remoteSettings

  return readLocalJsonSetting(fieldStaffSettingsStorageKey)
}

function saveFieldStaffSettings(settings) {
  const nextSettings = normalizeSettingValue(settings)
  appSettings.field_staff_settings = nextSettings
  localStorage.setItem(fieldStaffSettingsStorageKey, JSON.stringify(nextSettings))
  return saveAppSetting('field_staff_settings', nextSettings)
}

function isDefaultFieldStaff(staff) {
  const text = [staff.role, staff.position, staff.position_name, staff.department_name]
    .filter(Boolean)
    .join('｜')
  return text.includes('外務') || text.includes('宿管')
}

function isStaffFieldWorker(staff) {
  if (!staff?.staff_id) return false
  const settings = getFieldStaffSettings()
  if (Object.prototype.hasOwnProperty.call(settings, staff.staff_id)) {
    return settings[staff.staff_id] === true
  }
  return isDefaultFieldStaff(staff)
}

function setStaffFieldWorker(staffId, checked) {
  const settings = getFieldStaffSettings()
  settings[staffId] = checked === true
  return saveFieldStaffSettings(settings)
}

const fieldScheduleFiltersStorageKey = 'for-e-field-schedule-filters-v002'

function getFieldFilterStorageKey() {
  const owner = currentProfile?.staff_id || currentProfile?.email || 'guest'
  return `${fieldScheduleFiltersStorageKey}-${owner}`
}

function normalizeFieldScheduleFilters(value = {}) {
  const sortBy = ['display_order', 'department', 'name'].includes(value.sortBy) ? value.sortBy : 'display_order'
  const sortDir = value.sortDir === 'desc' ? 'desc' : 'asc'
  return {
    departments: normalizeOverviewFilterList(value.departments || value.department),
    staffIds: normalizeOverviewFilterList(value.staffIds || value.staffId),
    sortBy,
    sortDir
  }
}

function loadFieldScheduleFiltersPreference() {
  try {
    const raw = localStorage.getItem(getFieldFilterStorageKey())
    fieldScheduleFilters = normalizeFieldScheduleFilters(raw ? JSON.parse(raw) : fieldScheduleFilters)
  } catch (err) {
    console.warn('外務行程篩選讀取失敗', err)
    fieldScheduleFilters = normalizeFieldScheduleFilters()
  }
}

function saveFieldScheduleFiltersPreference() {
  try {
    localStorage.setItem(getFieldFilterStorageKey(), JSON.stringify(normalizeFieldScheduleFilters(fieldScheduleFilters)))
  } catch (err) {
    console.warn('外務行程篩選儲存失敗', err)
  }
}

function getFieldBaseStaffRows() {
  const settings = getFieldStaffSettings()
  const fieldRows = staffList.filter(isStaffFieldWorker)

  if (fieldRows.length) return fieldRows
  return staffList
}

function isFieldDepartmentSelected(name) {
  return normalizeOverviewFilterList(fieldScheduleFilters.departments).includes(name)
}

function isFieldStaffSelected(staffId) {
  return normalizeOverviewFilterList(fieldScheduleFilters.staffIds).includes(staffId)
}

function getFieldFilterCountText() {
  const departments = normalizeOverviewFilterList(fieldScheduleFilters.departments)
  const staffIds = normalizeOverviewFilterList(fieldScheduleFilters.staffIds)

  if (!departments.length && !staffIds.length) return '全部'
  const parts = []
  if (departments.length) parts.push(`部門 ${departments.length}`)
  if (staffIds.length) parts.push(`人員 ${staffIds.length}`)
  return parts.join('｜')
}


function getFieldDepartmentSelectedText() {
  const departments = normalizeOverviewFilterList(fieldScheduleFilters.departments)
  return departments.length ? `${departments.length} 項` : '全部'
}

function getFieldStaffSelectedText() {
  const staffIds = normalizeOverviewFilterList(fieldScheduleFilters.staffIds)
  return staffIds.length ? `${staffIds.length} 項` : '全部'
}

function getFieldFilterSummary() {
  const departments = normalizeOverviewFilterList(fieldScheduleFilters.departments)
  const staffIds = normalizeOverviewFilterList(fieldScheduleFilters.staffIds)
  const staffNames = staffIds
    .map(staffId => staffList.find(staff => staff.staff_id === staffId)?.name)
    .filter(Boolean)

  const deptText = departments.length ? departments.join('、') : '全部部門'
  const staffText = staffNames.length ? staffNames.join('、') : '全部外務人員'
  return `${deptText}｜${staffText}`
}

function getFieldDepartmentCheckboxes() {
  const rows = getFieldBaseStaffRows()
  const names = [...new Set(rows.map(staff => staff.department_name).filter(Boolean))]
  if (!names.length) return `<div class="compact-check-empty">沒有部門資料</div>`
  return names.map(name => renderCompactCheckOption(name, name, isFieldDepartmentSelected(name), 'fieldDepartments')).join('')
}

function getFieldStaffCheckboxes() {
  let rows = getFieldBaseStaffRows()
  const selectedDepartments = normalizeOverviewFilterList(fieldScheduleFilters.departments)

  if (selectedDepartments.length) {
    rows = rows.filter(staff => selectedDepartments.includes(staff.department_name))
  }

  if (!rows.length) return `<div class="compact-check-empty">沒有可選外務人員</div>`
  return rows.map(staff => renderCompactCheckOption(`${staff.name}｜${staff.department_name || ''}`, staff.staff_id, isFieldStaffSelected(staff.staff_id), 'fieldStaffIds')).join('')
}

function getFieldStaffRows() {
  let rows = getFieldBaseStaffRows()
  const selectedDepartments = normalizeOverviewFilterList(fieldScheduleFilters.departments)
  const selectedStaffIds = normalizeOverviewFilterList(fieldScheduleFilters.staffIds)

  if (selectedDepartments.length) {
    rows = rows.filter(staff => selectedDepartments.includes(staff.department_name))
  }

  if (selectedStaffIds.length) {
    rows = rows.filter(staff => selectedStaffIds.includes(staff.staff_id))
  }

  return sortStaffRowsByFilter(rows, fieldScheduleFilters)
}

function isFieldScheduleRow(row) {
  if (!row) return false

  const text = [row.category, row.schedule_type, row.sub_type, row.title, row.sub_type_note]
    .filter(Boolean)
    .join('｜')

  return (
    text.includes('外務') ||
    row.category === '外務行程' ||
    row.schedule_type === '外務行程' ||
    row.schedule_type === '外務'
  )
}

function getFieldSchedulesForStaffDate(staffId, dateKey) {
  return schedules.filter(row => {
    if (!isVisibleSchedule(row)) return false
    if (!isFieldScheduleRow(row)) return false
    if (!scheduleMatchesDateByMode(row, dateKey)) return false

    return (row.schedule_assignees || []).some(item => {
      return item.staff_id === staffId && !item.deleted_at
    })
  })
}

function renderFieldScheduleCard(row) {
  const contentPreview = getFirstTwoLines(row.description)

  return `
    <button type="button" class="field-week-schedule-card ${row.status === '已完成' ? 'is-completed' : ''}" style="${getScheduleColorInlineStyle(row)}" data-view-schedule="${row.schedule_id}">
      <span class="field-week-card-time">${escapeHtml(formatTime(row))}</span>
      <strong>${escapeHtml(row.schedule_type || row.category || '外務')}｜${escapeHtml(row.title || '-')}</strong>
      ${renderFieldSpecialReminderBadges(row)}
      ${renderFieldResultBadge(row)}
      <span class="field-week-card-preview">指派者：${escapeHtml(row.creator_name || '-')}</span>
      ${contentPreview ? `<span class="field-week-card-preview">${escapeHtml(contentPreview).replaceAll('\n', ' / ')}</span>` : ''}
    </button>
  `
}

function renderFieldScheduleCalendar() {
  const weekDates = getWeekDates(fieldWeekOffset)
  const staffRows = getFieldStaffRows()
  const todayKey = todayString()

  return `
    <div class="page-toolbar">
      <div>
        <h3>外務行程</h3>
        <p class="muted">外務人員 × 週一～週日｜${getWeekLabel(weekDates)}</p>
      </div>
      <div class="toolbar-actions">
        <button class="secondary-btn" id="fieldPrevWeekBtn">上一週</button>
        <button class="secondary-btn" id="fieldThisWeekBtn">本週</button>
        <button class="secondary-btn" id="fieldNextWeekBtn">下一週</button>
        ${canCreateFieldSchedule() ? '<button class="primary-btn" id="addScheduleBtn">新增外務</button>' : ''}
        <button class="secondary-btn" id="refreshBtn">重新整理</button>
      </div>
    </div>

    ${renderReadStatus()}

    <form id="fieldScheduleFilterForm" class="overview-filter-panel overview-filter-panel-compact field-filter-panel-compact">
      <div class="overview-filter-compact-row">
        <details class="compact-multi-select compact-filter-control">
          <summary>部門｜${escapeHtml(getFieldDepartmentSelectedText())}</summary>
          <div class="compact-check-panel">
            ${getFieldDepartmentCheckboxes()}
          </div>
        </details>

        <details class="compact-multi-select compact-filter-control">
          <summary>外務人員｜${escapeHtml(getFieldStaffSelectedText())}</summary>
          <div class="compact-check-panel">
            ${getFieldStaffCheckboxes()}
          </div>
        </details>

        <label class="compact-sort-select compact-filter-control">
          <span class="compact-field-label">排序</span>
          <select name="fieldSortBy">
            ${getStaffSortOptions(fieldScheduleFilters.sortBy)}
          </select>
        </label>

        <label class="compact-sort-select compact-filter-control">
          <span class="compact-field-label">順序</span>
          <select name="fieldSortDir">
            ${getStaffSortDirOptions(fieldScheduleFilters.sortDir)}
          </select>
        </label>

        <button type="submit" class="primary-btn">套用並記住</button>
        <button type="button" class="secondary-btn" id="resetFieldScheduleFilterBtn">全部</button>
      </div>

      <div class="overview-filter-summary compact-summary">
        目前：${escapeHtml(getFieldFilterSummary())}
      </div>
    </form>

    <div class="field-week-scroll">
      <table class="field-week-table">
        <thead>
          <tr>
            <th class="field-staff-col">外務人員</th>
            ${weekDates.map(date => {
              const key = toDateKey(date)
              const weekName = ['週日', '週一', '週二', '週三', '週四', '週五', '週六'][date.getDay()]
              return `<th class="${key === todayKey ? 'is-today' : ''} ${isTaiwanHoliday(date) ? 'is-holiday' : ''}">
                <span>${weekName}</span>
                <strong>${key.slice(5)}</strong>
                ${renderHolidayLabels(key)}
              </th>`
            }).join('')}
          </tr>
        </thead>
        <tbody>
          ${staffRows.map(staff => `
            <tr>
              <th class="field-staff-name-cell">
                <strong>${escapeHtml(staff.name)}</strong>
                <span>${escapeHtml(staff.department_name || '')}</span>
              </th>
              ${weekDates.map(date => {
                const key = toDateKey(date)
                const dayRows = getFieldSchedulesForStaffDate(staff.staff_id, key)
                return `<td class="field-week-day-cell ${key === todayKey ? 'is-today' : ''} ${isTaiwanHoliday(date) ? 'is-holiday' : ''}" data-field-date="${key}" data-staff-id="${staff.staff_id}">
                  ${dayRows.length ? dayRows.map(renderFieldScheduleCard).join('') : '<span class="field-week-empty">—</span>'}
                </td>`
              }).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    ${!staffRows.length ? '<div class="empty-state">目前沒有可顯示的外務人員。</div>' : ''}
  `
}
/* FOR-e V002-1I-1 END - field schedule weekly calendar */



/* FOR-e V002-1J START - field detail page */
/*
  V002-1J｜外務明細
  只使用既有 schedules / schedule_assignees 資料，不改 SQL、不改 Supabase 結構。
*/

function getFieldDetailStaffOptionsHtml() {
  return `<option value="全部" ${fieldDetailFilters.staffId === '全部' ? 'selected' : ''}>全部人員</option>` +
    getFieldStaffRows().map(staff => `
      <option value="${staff.staff_id}" ${fieldDetailFilters.staffId === staff.staff_id ? 'selected' : ''}>${staff.name}｜${staff.department_name || ''}</option>
    `).join('')
}

function getFieldDetailPurposeOptionsHtml() {
  const purposes = ['全部', ...(typeof fieldPurposeOptions !== 'undefined' ? fieldPurposeOptions : [])]
  return [...new Set(purposes)].map(item => `
    <option value="${item}" ${fieldDetailFilters.purpose === item ? 'selected' : ''}>${item}</option>
  `).join('')
}

function getFieldDetailStatusOptionsHtml() {
  return ['全部', '未完成', '已完成', '取消'].map(item => `
    <option value="${item}" ${fieldDetailFilters.status === item ? 'selected' : ''}>${item}</option>
  `).join('')
}

function getFieldDetailRows() {
  return schedules
    .filter(row => isFieldScheduleRow(row))
    .filter(row => {
      if (fieldDetailFilters.status !== '全部' && row.status !== fieldDetailFilters.status) return false
      if (fieldDetailFilters.startDate && row.start_date < fieldDetailFilters.startDate) return false
      if (fieldDetailFilters.endDate && row.start_date > fieldDetailFilters.endDate) return false

      if (fieldDetailFilters.staffId !== '全部') {
        const assigned = (row.schedule_assignees || []).some(item => item.staff_id === fieldDetailFilters.staffId && !item.deleted_at)
        if (!assigned) return false
      }

      if (fieldDetailFilters.purpose !== '全部') {
        const purposeText = row.sub_type || getFieldNoteValue(row, '外務目的') || ''
        if (purposeText !== fieldDetailFilters.purpose) return false
      }

      if (fieldDetailFilters.location) {
        const keyword = String(fieldDetailFilters.location || '').trim().toLowerCase()
        const haystack = [
          row.location_name,
          row.address,
          row.title,
          row.description,
          row.sub_type_note
        ].filter(Boolean).join(' ').toLowerCase()
        if (!haystack.includes(keyword)) return false
      }

      return true
    })
    .sort((a, b) => {
      if (String(a.start_date || '') !== String(b.start_date || '')) {
        return String(b.start_date || '').localeCompare(String(a.start_date || ''))
      }
      return String(a.start_time || '').localeCompare(String(b.start_time || ''))
    })
}

function renderFieldDetailPage() {
  const rows = getFieldDetailRows()
  const activeRows = rows.filter(row => row.status !== '已完成' && row.status !== '取消')
  const completedRows = rows.filter(row => row.status === '已完成')
  const resultRows = rows.filter(row => getFieldResultFromRow(row))

  return `
    <div class="page-toolbar">
      <div>
        <h3>外務明細</h3>
        <p class="muted">外務清單｜可依日期、人員、地點、目的與狀態篩選。</p>
      </div>
      <div class="toolbar-actions">
        <button class="secondary-btn" id="resetFieldDetailFilterBtn">清除條件</button>
        <button class="primary-btn" id="addScheduleBtn">新增外務</button>
        <button class="secondary-btn" id="refreshBtn">重新整理</button>
      </div>
    </div>

    ${renderReadStatus()}

    <form id="fieldDetailFilterForm" class="field-detail-filter">
      <label>
        起日
        <input name="startDate" type="date" value="${fieldDetailFilters.startDate}">
      </label>

      <label>
        迄日
        <input name="endDate" type="date" value="${fieldDetailFilters.endDate}">
      </label>

      <label>
        外務人員
        <select name="staffId">${getFieldDetailStaffOptionsHtml()}</select>
      </label>

      <label>
        目的
        <select name="purpose">${getFieldDetailPurposeOptionsHtml()}</select>
      </label>

      <label>
        狀態
        <select name="status">${getFieldDetailStatusOptionsHtml()}</select>
      </label>

      <label class="field-detail-location-filter">
        地點 / 地址 / 內容
        <input name="location" value="${escapeHtml(fieldDetailFilters.location)}" placeholder="可搜尋地點、地址或內容">
      </label>

      <button type="submit" class="primary-btn">篩選</button>
    </form>

    <div class="summary-grid field-detail-summary">
      <div class="summary-card">
        <strong>${rows.length}</strong>
        <span>外務筆數</span>
      </div>
      <div class="summary-card">
        <strong>${activeRows.length}</strong>
        <span>未完成</span>
      </div>
      <div class="summary-card">
        <strong>${completedRows.length}</strong>
        <span>已完成</span>
      </div>
      <div class="summary-card">
        <strong>${resultRows.length}</strong>
        <span>補件 / 異常</span>
      </div>
    </div>

    ${renderFieldDetailList(rows)}
  `
}

function renderFieldDetailList(rows) {
  if (!rows.length) {
    return `<div class="empty-state">目前沒有符合條件的外務明細。</div>`
  }

  return `
    <div class="field-detail-list">
      ${rows.map(row => {
        const result = getFieldResultFromRow(row)
        const specialReminders = getFieldSpecialRemindersFromRow(row)
        return `
          <div class="field-detail-row ${row.status === '已完成' ? 'is-completed' : ''} ${result ? 'has-result' : ''}">
            <div class="field-detail-date">
              <strong>${escapeHtml(row.start_date || '-')}</strong>
              <span>${escapeHtml(formatTime(row))}</span>
            </div>

            <div class="field-detail-main">
              <div class="field-detail-title">${escapeHtml(row.sub_type || row.schedule_type || '外務')}｜${escapeHtml(row.title || '-')}</div>
              <div class="field-detail-meta">
                外務人員：${escapeHtml(getAssigneeNames(row))}
                ｜指派者：${escapeHtml(row.creator_name || '-')}
              </div>
              <div class="field-detail-meta">
                地點：${escapeHtml(row.location_name || '-')}
                ${row.address ? '｜地址：' + escapeHtml(row.address) : ''}
              </div>
              ${row.description ? `<div class="field-detail-content"><span>內容：</span>${escapeHtml(getFirstTwoLines(row.description)).replaceAll('\n', '<br>')}</div>` : ''}
              ${specialReminders.length ? `<div class="field-detail-badges">${specialReminders.map(item => `<span class="field-special-badge">${renderFieldSpecialReminderIcon(item)} ${escapeHtml(getFieldSpecialReminderDisplay(item))}</span>`).join('')}</div>` : ''}
              ${result ? `<div class="field-detail-result">${renderFieldResultReminder(row)}</div>` : ''}
            </div>

            <div class="field-detail-status">
              <span class="status-pill">${escapeHtml(getScheduleStatusLabel(row))}</span>
              <button class="small-secondary-btn" data-view-schedule="${row.schedule_id}">查看</button>
            </div>
          </div>
        `
      }).join('')}
    </div>
  `
}
/* FOR-e V002-1J END - field detail page */



/* FOR-e V002-1K-1 START - meeting room weekly calendar */
function isMeetingRoomSchedule(row) {
  if (!row) return false
  const text = [row.category, row.schedule_type, row.sub_type, row.title, row.location_name, row.sub_type_note].filter(Boolean).join('｜')
  return row.category === '會議室預約' || row.schedule_type === '會議室預約' || text.includes('會議室預約') || getManagedListOption('meetingRoomOptions', meetingRoomOptions).includes(row.location_name)
}

function getMeetingSchedulesForRoomDate(room, dateKey) {
  return schedules
    .filter(row => isVisibleSchedule(row))
    .filter(row => isMeetingRoomSchedule(row))
    .filter(row => scheduleMatchesDateByMode(row, dateKey))
    .filter(row => row.location_name === room || row.sub_type === room)
    .sort((a, b) => String(a.start_time || '').localeCompare(String(b.start_time || '')))
}

function renderMeetingRoomCard(row) {
  return `
    <button type="button" class="meeting-room-card ${row.status === '已完成' ? 'is-completed' : ''}" style="${getScheduleColorInlineStyle(row)}" data-view-schedule="${row.schedule_id}">
      <span class="meeting-room-time">${escapeHtml(formatTime(row))}</span>
      <strong>${escapeHtml(row.title || '-')}</strong>
      <span class="meeting-room-meta">預約人：${escapeHtml(getAssigneeNames(row) || row.creator_name || '-')}</span>
      ${row.description ? `<span class="meeting-room-preview">${escapeHtml(getFirstTwoLines(row.description)).replaceAll('\n', ' / ')}</span>` : ''}
    </button>
  `
}

function renderMeetingRoomCalendar() {
  const weekDates = getWeekDates(meetingWeekOffset)
  const todayKey = todayString()

  return `
    <div class="page-toolbar">
      <div>
        <h3>會議室預約</h3>
        <p class="muted">會議室 × 週一～週日｜${getWeekLabel(weekDates)}</p>
      </div>
      <div class="toolbar-actions">
        <button class="secondary-btn" id="meetingPrevWeekBtn">上一週</button>
        <button class="secondary-btn" id="meetingThisWeekBtn">本週</button>
        <button class="secondary-btn" id="meetingNextWeekBtn">下一週</button>
        ${canCreateMeetingRoomSchedule() ? '<button class="primary-btn" id="addScheduleBtn">新增預約</button>' : ''}
        <button class="secondary-btn" id="refreshBtn">重新整理</button>
      </div>
    </div>

    ${renderReadStatus()}

    <div class="meeting-week-scroll">
      <table class="meeting-week-table">
        <thead>
          <tr>
            <th class="meeting-room-col">會議室</th>
            ${weekDates.map(date => {
              const key = toDateKey(date)
              const weekName = ['週日', '週一', '週二', '週三', '週四', '週五', '週六'][date.getDay()]
              return `<th class="${key === todayKey ? 'is-today' : ''} ${isTaiwanHoliday(date) ? 'is-holiday' : ''}">
                <span>${weekName}</span>
                <strong>${key.slice(5)}</strong>
                ${renderHolidayLabels(key)}
              </th>`
            }).join('')}
          </tr>
        </thead>
        <tbody>
          ${getManagedListOption('meetingRoomOptions', meetingRoomOptions).map(room => `
            <tr>
              <th class="meeting-room-name-cell"><strong>${escapeHtml(room)}</strong></th>
              ${weekDates.map(date => {
                const key = toDateKey(date)
                const dayRows = getMeetingSchedulesForRoomDate(room, key)
                return `<td class="meeting-week-day-cell ${key === todayKey ? 'is-today' : ''} ${isTaiwanHoliday(date) ? 'is-holiday' : ''}" data-meeting-date="${key}" data-meeting-room="${escapeHtml(room)}">
                  ${dayRows.length ? dayRows.map(renderMeetingRoomCard).join('') : '<span class="meeting-week-empty">—</span>'}
                </td>`
              }).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `
}

function meetingRoomOptionsHtml(selectedRoom = '') {
  return getManagedListOption('meetingRoomOptions', meetingRoomOptions).map(room => `<option value="${room}" ${room === selectedRoom ? 'selected' : ''}>${room}</option>`).join('')
}

function getMeetingTimeValue(form, prefix) {
  const hour = form.get(`${prefix}_hour`) || '00'
  const minute = form.get(`${prefix}_minute`) || '00'
  return `${hour}:${minute}:00`
}

function getMeetingTimeMinutes(value) {
  const [hour, minute] = String(value || '00:00:00').split(':').map(Number)
  return hour * 60 + minute
}

function hasMeetingRoomConflict(room, date, startTime, endTime) {
  const start = getMeetingTimeMinutes(startTime)
  const end = getMeetingTimeMinutes(endTime)

  return schedules
    .filter(row => isVisibleSchedule(row))
    .filter(row => isMeetingRoomSchedule(row))
    .filter(row => scheduleMatchesDateByMode(row, date))
    .filter(row => row.location_name === room)
    .some(row => {
      const rowStart = getMeetingTimeMinutes(row.start_time || '00:00:00')
      const rowEnd = getMeetingTimeMinutes(row.end_time || row.start_time || '23:59:00')
      return start < rowEnd && end > rowStart
    })
}

function openMeetingRoomModal(defaults = {}) {
  if (!canCreateMeetingRoomSchedule()) return denyPermission('你的角色沒有新增會議室預約權限。')
  const defaultDate = defaults.date || todayString()
  const roomOptions = getManagedListOption('meetingRoomOptions', meetingRoomOptions)
  const defaultRoom = defaults.room || roomOptions[0] || ''

  const modal = document.createElement('div')
  modal.className = 'modal-backdrop'
  modal.innerHTML = `
    <div class="modal-panel">
      <div class="modal-header">
        <h3>新增會議室預約</h3>
        <button class="icon-btn" id="closeMeetingModalBtn" type="button">×</button>
      </div>

      <form id="meetingRoomForm" class="form-grid">
        <label>
          會議室
          <select name="room" required>${meetingRoomOptionsHtml(defaultRoom)}</select>
        </label>

        ${scheduleModeFieldsHtml('meeting', defaultDate)}

        <label>
          開始時間
          <div class="compact-time-row">
            <select name="start_hour">${hourOptionsHtml('09')}</select>
            <select name="start_minute">${minuteOptionsHtml('00')}</select>
          </div>
        </label>

        <label>
          結束時間
          <div class="compact-time-row">
            <select name="end_hour">${hourOptionsHtml('10')}</select>
            <select name="end_minute">${minuteOptionsHtml('00')}</select>
          </div>
        </label>

        <label class="span-2">
          會議名稱
          <input name="title" required placeholder="請輸入會議名稱">
        </label>

        <label>
          部門
          <select name="department" id="meetingDepartmentSelect">
            ${departmentOptionsHtml(currentProfile?.department_name || '')}
          </select>
        </label>

        <label>
          預約人
          <select name="reserver_staff_id" id="meetingReserverSelect">
            ${staffOptionsSelectHtml(currentProfile?.staff_id || '')}
          </select>
        </label>

        <label class="span-2">
          內容 / 備註
          <textarea name="description" rows="3" placeholder="會議內容或備註"></textarea>
        </label>

        <div class="modal-actions span-2">
          <button type="button" class="secondary-btn" id="cancelMeetingModalBtn">取消</button>
          <button type="submit" class="primary-btn">儲存預約</button>
        </div>
      </form>
    </div>
  `

  document.body.appendChild(modal)

  const meetingRepeatModeSelect = document.querySelector('#meetingRepeatModeSelect')
  if (meetingRepeatModeSelect) {
    meetingRepeatModeSelect.addEventListener('change', () => refreshScheduleModeBlocks('meeting'))
    refreshScheduleModeBlocks('meeting')
  }

  const meetingReserverSelect = document.querySelector('#meetingReserverSelect')
  const meetingDepartmentSelect = document.querySelector('#meetingDepartmentSelect')
  if (meetingReserverSelect && meetingDepartmentSelect) {
    meetingReserverSelect.addEventListener('change', () => {
      const option = meetingReserverSelect.selectedOptions?.[0]
      if (option?.dataset?.department) meetingDepartmentSelect.value = option.dataset.department
    })
  }

  document.querySelector('#closeMeetingModalBtn').addEventListener('click', () => modal.remove())
  document.querySelector('#cancelMeetingModalBtn').addEventListener('click', () => modal.remove())
  document.querySelector('#meetingRoomForm').addEventListener('submit', event => saveMeetingRoomSchedule(event, modal))
}

async function saveMeetingRoomSchedule(event, modal) {
  event.preventDefault()
  if (saving) return
  saving = true

  if (!canCreateMeetingRoomSchedule()) { alert('你的角色沒有新增會議室預約權限。'); saving = false; return }

  try {
    const form = new FormData(event.target)
    const room = form.get('room')
    const date = form.get('start_date')
    const reserverStaffId = form.get('reserver_staff_id') || currentProfile.staff_id
    const reserverStaff = staffList.find(staff => staff.staff_id === reserverStaffId) || {
      staff_id: currentProfile.staff_id,
      name: currentProfile.name || currentProfile.email,
      department_id: currentProfile.department_id,
      department_name: form.get('department') || currentProfile.department_name,
      position: currentProfile.position_name || currentProfile.position
    }
    const startTime = getMeetingTimeValue(form, 'start')
    const endTime = getMeetingTimeValue(form, 'end')

    if (getMeetingTimeMinutes(endTime) <= getMeetingTimeMinutes(startTime)) {
      alert('結束時間必須晚於開始時間。')
      saving = false
      return
    }

    const meetingDates = getScheduleDatesFromForm(form)
    const conflictDate = meetingDates.find(dateKey => hasMeetingRoomConflict(room, dateKey, startTime, endTime))
    if (conflictDate) {
      alert(`此會議室在 ${conflictDate} 該時段已有預約，請更換時間或會議室。`)
      saving = false
      return
    }

    const payload = {
      creator_profile_id: currentProfile.profile_id,
      creator_staff_id: currentProfile.staff_id,
      creator_name: currentProfile.name || currentProfile.email,
      department_id: reserverStaff.department_id || currentProfile.department_id,
      department_name: form.get('department') || reserverStaff.department_name || currentProfile.department_name,
      category: '會議室預約',
      schedule_type: '會議室預約',
      sub_type: room,
      sub_type_note: [
        buildRepeatNote(form),
        form.get('department') ? `部門：${form.get('department')}` : '',
        reserverStaff.name ? `預約人：${reserverStaff.name}` : ''
      ].filter(Boolean).join('｜'),
      title: form.get('title'),
      description: form.get('description') || null,
      start_date: date,
      end_date: getScheduleModeEndDate(form),
      time_type: Number(startTime.slice(0, 2)) < 12 ? '上午' : '下午',
      start_time: startTime,
      end_time: endTime,
      customer_name: null,
      location_name: room,
      address: null,
      car_no: null,
      status: '未完成',
      need_service_record: form.get('need_service_record') === 'on',
      service_record_submitted: form.get('service_record_submitted') === 'on',
      service_record_submitted_date: form.get('service_record_submitted') === 'on' ? (form.get('service_record_submitted_date') || todayString()) : null
    }

    const { data: schedule, error: scheduleError } = await supabase
      .from('schedules')
      .insert(payload)
      .select()
      .single()

    if (scheduleError) {
      alert('新增會議室預約失敗：' + scheduleError.message)
      saving = false
      return
    }

    const { error: assigneeError } = await supabase.from('schedule_assignees').insert([{
      schedule_id: schedule.schedule_id,
      staff_id: reserverStaff.staff_id,
      staff_name: reserverStaff.name || currentProfile.email,
      department_id: reserverStaff.department_id || currentProfile.department_id,
      department_name: reserverStaff.department_name || form.get('department') || currentProfile.department_name,
      position: reserverStaff.position || currentProfile.position_name || currentProfile.position,
      assignee_type: 'executor'
    }])

    if (assigneeError) {
      alert('會議室預約已建立，但同步個人行程失敗：' + assigneeError.message)
      saving = false
      return
    }

    await supabase.from('audit_logs').insert({
      operated_by_profile_id: currentProfile.profile_id,
      operated_by_staff_id: currentProfile.staff_id,
      operated_by_name: currentProfile.name || currentProfile.email,
      action_type: '新增',
      source_type: 'schedule',
      source_id: schedule.schedule_id,
      note: 'V002-1K-1 新增會議室預約'
    })

    modal.remove()
    await refreshData()
    saving = false
    renderApp()
  } catch (err) {
    alert('新增會議室預約失敗：' + (err?.message || err))
    saving = false
  }
}
/* FOR-e V002-1K-1 END - meeting room weekly calendar */



/* FOR-e V002-1L-1 START - incident tracking */
/*
  V002-1L-1｜異況追蹤
  使用既有 schedules / schedule_assignees，不改 SQL、不新增 Supabase 表。
*/

function isIncidentSchedule(row) {
  if (!row) return false
  const text = [row.category, row.schedule_type, row.sub_type, row.title, row.sub_type_note]
    .filter(Boolean)
    .join('｜')
  return row.category === '異況追蹤' || row.schedule_type === '異況' || text.includes('異況類型：')
}

function isIncidentTrackingTask(row) {
  const note = String(row?.sub_type_note || '')
  return note.includes('來源異況：') || note.includes('追蹤項目：')
}

function incidentTrackingTargetChecksHtml(selectedIds = [], inputName = 'incident_tracking_target') {
  const selected = new Set(selectedIds || [])
  return staffList.map(staff => `
    <label class="check-row">
      <input type="checkbox" name="${inputName}" value="${staff.staff_id}" ${selected.has(staff.staff_id) ? 'checked' : ''}>
      <span>${staff.name}｜${staff.department_name || ''}｜${staff.position || ''}</span>
    </label>
  `).join('')
}

async function createIncidentTrackingSchedule(parentRow, trackingTitle, trackingContent, followDate, followTime, targetIds, sourceNote = '') {
  const selectedStaff = staffList.filter(staff => targetIds.includes(staff.staff_id))
  if (!selectedStaff.length) {
    throw new Error('請至少選擇一位執行對象。')
  }

  const firstStaff = selectedStaff[0]
  const targetNames = selectedStaff.map(staff => staff.name).join('、')
  const payload = {
    creator_profile_id: currentProfile.profile_id,
    creator_staff_id: currentProfile.staff_id,
    creator_name: currentProfile.name || currentProfile.email,
    department_id: firstStaff.department_id || parentRow.department_id || currentProfile.department_id,
    department_name: firstStaff.department_name || parentRow.department_name || currentProfile.department_name,
    category: '異況追蹤',
    schedule_type: '異況',
    sub_type: trackingTitle,
    sub_type_note: [
      `來源異況：${parentRow.schedule_id}`,
      `追蹤項目：${trackingTitle}`,
      parentRow.sub_type ? `異況類型：${parentRow.sub_type}` : '',
      parentRow.customer_name ? `客戶 / 工人：${parentRow.customer_name}` : '',
      `執行對象：${targetNames}`,
      sourceNote
    ].filter(Boolean).join('｜'),
    title: `${trackingTitle}｜${parentRow.title || parentRow.customer_name || '異況追蹤'}`,
    description: trackingContent || null,
    start_date: followDate,
    end_date: followDate,
    time_type: getFieldTimeTypeFromValue(followTime),
    start_time: getFieldDbTimeValue(followTime),
    end_time: null,
    customer_name: parentRow.customer_name || null,
    location_name: null,
    address: null,
    car_no: null,
    status: '未完成',
    need_service_record: !!parentRow.need_service_record,
    service_record_submitted: false,
    service_record_submitted_date: null
  }

  const { data: schedule, error: scheduleError } = await supabase
    .from('schedules')
    .insert(payload)
    .select()
    .single()

  if (scheduleError) {
    throw scheduleError
  }

  const assigneeRows = selectedStaff.map(staff => ({
    schedule_id: schedule.schedule_id,
    staff_id: staff.staff_id,
    staff_name: staff.name,
    department_id: staff.department_id,
    department_name: staff.department_name,
    position: staff.position,
    assignee_type: 'executor'
  }))

  const { error: assigneeError } = await supabase
    .from('schedule_assignees')
    .insert(assigneeRows)

  if (assigneeError) {
    throw assigneeError
  }

  await supabase.from('audit_logs').insert({
    operated_by_profile_id: currentProfile.profile_id,
    operated_by_staff_id: currentProfile.staff_id,
    operated_by_name: currentProfile.name || currentProfile.email,
    action_type: '新增追蹤行程',
    source_type: 'schedule',
    source_id: schedule.schedule_id,
    note: `V002-1L-5 ${trackingTitle}上行程｜執行對象：${targetNames}`
  })

  return schedule
}

function incidentStaffOptionsHtml(selectedStaffId = '全部') {
  return `<option value="全部" ${selectedStaffId === '全部' ? 'selected' : ''}>全部人員</option>` +
    staffList.map(staff => `
      <option value="${staff.staff_id}" ${selectedStaffId === staff.staff_id ? 'selected' : ''}>${staff.name}｜${staff.department_name || ''}</option>
    `).join('')
}

function incidentResponsibleOptionsHtml(selectedStaffId = '') {
  const defaultId = selectedStaffId || currentProfile?.staff_id || ''
  return staffList.map(staff => `
    <option value="${staff.staff_id}" ${defaultId === staff.staff_id ? 'selected' : ''}>${staff.name}｜${staff.department_name || ''}</option>
  `).join('')
}

function incidentAssistantChecksHtml(selectedIds = [], inputName = 'incident_assistant') {
  const selected = new Set(selectedIds || [])
  return staffList.map(staff => `
    <label class="check-row">
      <input type="checkbox" name="${inputName}" value="${staff.staff_id}" ${selected.has(staff.staff_id) ? 'checked' : ''}>
      <span>${staff.name}｜${staff.department_name || ''}｜${staff.position || ''}</span>
    </label>
  `).join('')
}

function incidentTypeOptionsHtml(selectedValue = '') {
  return getManagedListOption('incidentTypeOptions', incidentTypeOptions).map(item => `<option value="${item}" ${item === selectedValue ? 'selected' : ''}>${item}</option>`).join('')
}

function incidentUrgencyOptionsHtml(selectedValue = '') {
  const selected = selectedValue || '一般'
  return getManagedListOption('incidentUrgencyOptions', incidentUrgencyOptions)
    .map(item => `<option value="${item}" ${item === selected ? 'selected' : ''}>${item}</option>`)
    .join('')
}

function getIncidentUrgencyFromRow(row) {
  const note = String(row?.sub_type_note || '')
  const match = note.match(/緊急程度：([^｜]+)/)
  return match ? match[1].trim() : '一般'
}

function renderIncidentUrgencyBadge(row) {
  const urgency = getIncidentUrgencyFromRow(row)
  if (!urgency || urgency === '一般') {
    return `<span class="incident-urgency-badge is-normal">一般</span>`
  }
  const urgentClass = ['緊急', '立即處理'].includes(urgency) ? 'is-urgent' : 'is-important'
  return `<span class="incident-urgency-badge ${urgentClass}">${escapeHtml(urgency)}</span>`
}


function chineseTrackingNumber(number) {
  const map = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十']
  return map[number] || String(number)
}

function getIncidentTrackingEntries(row) {
  const raw = String(row?.description || '').trim()
  if (!raw) return []

  if (!/^第.+次追蹤/.test(raw)) {
    return [{
      title: '第一次追蹤',
      body: raw
    }]
  }

  const chunks = raw
    .split(/\n(?=第(?:一|二|三|四|五|六|七|八|九|十|十一|十二|十三|十四|十五|十六|十七|十八|十九|二十|\d+)次追蹤)/g)
    .map(item => item.trim())
    .filter(Boolean)

  return chunks.map(chunk => {
    const lines = chunk.split('\n')
    return {
      title: lines.shift() || '追蹤紀錄',
      body: lines.join('\n').trim()
    }
  })
}

function buildIncidentTrackingEntry(index, dateText, timeText, content) {
  const timeLabel = timeText && timeText !== '不指定' ? ` ${timeText}` : ''
  return `第${chineseTrackingNumber(index)}次追蹤（${dateText}${timeLabel}）\n${String(content || '').trim()}`
}

function appendIncidentTrackingEntry(row, dateText, timeText, content) {
  const current = String(row?.description || '').trim()
  const count = getIncidentTrackingEntries(row).length
  const nextEntry = buildIncidentTrackingEntry(count + 1, dateText, timeText, content)

  if (!current) return nextEntry
  if (!/^第.+次追蹤/.test(current)) {
    return `${buildIncidentTrackingEntry(1, getFieldNoteValue(row, '發生日期') || row.start_date || todayString(), '', current)}\n${nextEntry}`
  }

  return `${current}\n${nextEntry}`
}

function renderIncidentTrackingHistory(row, editable = false) {
  const entries = getIncidentTrackingEntries(row)
  if (!entries.length) return ''

  return `
    <div class="incident-history-panel">
      <div class="incident-history-title">追蹤紀錄</div>
      ${entries.map((entry, index) => `
        <div class="incident-history-item">
          <div class="incident-history-item-head">
            <strong>${escapeHtml(entry.title)}</strong>
            ${editable ? `<button type="button" class="small-secondary-btn incident-tracking-edit-btn" data-incident-tracking-edit="${row.schedule_id}" data-tracking-index="${index}">修改</button>` : ''}
          </div>
          ${entry.body ? `<p>${escapeHtml(entry.body).replaceAll('\n', '<br>')}</p>` : ''}
        </div>
      `).join('')}
    </div>
  `
}

function buildIncidentNoteParts(form, incidentType, customerName, responsibleStaff, assistantNames, nextTime) {
  return [
    `異況類型：${incidentType}`,
    `緊急程度：${form.get('incident_urgency') || '一般'}`,
    `發生日期：${form.get('incident_date')}`,
    customerName ? `客戶 / 工人：${customerName}` : '',
    `下次追蹤：${form.get('next_follow_date')}${nextTime ? ' ' + nextTime : ''}`,
    `負責人：${responsibleStaff.name || ''}`,
    assistantNames.length ? `協助人員：${assistantNames.join('、')}` : '',
    form.get('need_service_record') === 'on' ? '服務紀錄單：需要' : '服務紀錄單：不需要',
    form.get('service_record_submitted') === 'on' ? `服務紀錄單狀態：已繳交${form.get('service_record_submitted_date') ? '｜繳交日期：' + form.get('service_record_submitted_date') : ''}` : ''
  ].filter(Boolean)
}

function incidentServiceRecordFieldsHtml(row = null) {
  const need = row ? !!row.need_service_record : true
  const submitted = row ? !!row.service_record_submitted : false
  const submittedDate = row?.service_record_submitted_date || ''

  return `
    <div class="span-2 incident-service-record-box">
      <div class="field-title">服務紀錄單</div>
      <div class="inline-check-list">
        <label class="inline-check">
          <input type="checkbox" name="need_service_record" ${need ? 'checked' : ''}>
          需要服務紀錄單
        </label>
        <label class="inline-check">
          <input type="checkbox" name="service_record_submitted" ${submitted ? 'checked' : ''}>
          已繳交
        </label>
      </div>
      <label>
        繳交日期
        <input name="service_record_submitted_date" type="date" value="${submittedDate}">
      </label>
    </div>
  `
}

function getIncidentRows() {
  return schedules
    .filter(row => isVisibleSchedule(row))
    .filter(row => isIncidentSchedule(row))
    .filter(row => !isIncidentTrackingTask(row))
    .filter(row => {
      if (incidentFilters.status !== '全部' && row.status !== incidentFilters.status) return false

      if (incidentFilters.staffId !== '全部') {
        const assigned = (row.schedule_assignees || []).some(item => item.staff_id === incidentFilters.staffId && !item.deleted_at)
        if (!assigned) return false
      }

      const keyword = String(incidentFilters.keyword || '').trim().toLowerCase()
      if (keyword) {
        const haystack = [
          row.title,
          row.customer_name,
          row.description,
          row.sub_type,
          row.sub_type_note,
          getAssigneeNames(row),
          row.creator_name
        ].filter(Boolean).join(' ').toLowerCase()
        if (!haystack.includes(keyword)) return false
      }

      return true
    })
    .sort((a, b) => {
      const activeA = a.status === '已完成' ? 1 : 0
      const activeB = b.status === '已完成' ? 1 : 0
      if (activeA !== activeB) return activeA - activeB
      return String(a.start_date || '').localeCompare(String(b.start_date || ''))
    })
}

function renderIncidentTrackingPage() {
  const rows = getIncidentRows()
  const activeRows = rows.filter(row => row.status !== '已完成' && row.status !== '取消')
  const completedRows = rows.filter(row => row.status === '已完成')
  const overdueRows = activeRows.filter(row => row.start_date && row.start_date < todayString())

  return `
    <div class="page-toolbar">
      <div>
        <h3>異況追蹤</h3>
        <p class="muted">異況案件、負責人、協助人員與下次追蹤日期。</p>
      </div>
      <div class="toolbar-actions">
        <button class="secondary-btn" id="resetIncidentFilterBtn">清除條件</button>
        ${canCreateIncidentSchedule() ? '<button class="primary-btn" id="addIncidentBtn">新增異況</button>' : ''}
        <button class="secondary-btn" id="refreshBtn">重新整理</button>
      </div>
    </div>

    ${renderReadStatus()}

    <form id="incidentFilterForm" class="incident-filter">
      <label>
        負責 / 協助人員
        <select name="staffId">${incidentStaffOptionsHtml(incidentFilters.staffId)}</select>
      </label>

      <label>
        狀態
        <select name="status">
          ${['全部', '未完成', '已完成'].map(item => `<option value="${item}" ${incidentFilters.status === item ? 'selected' : ''}>${item}</option>`).join('')}
        </select>
      </label>

      <label class="incident-keyword-filter">
        關鍵字
        <input name="keyword" value="${escapeHtml(incidentFilters.keyword)}" placeholder="可搜尋類型、客戶、內容、人員">
      </label>

      <button type="submit" class="primary-btn">篩選</button>
    </form>

    <div class="summary-grid incident-summary-grid">
      <div class="summary-card">
        <strong>${rows.length}</strong>
        <span>異況筆數</span>
      </div>
      <div class="summary-card">
        <strong>${activeRows.length}</strong>
        <span>未完成</span>
      </div>
      <div class="summary-card">
        <strong>${overdueRows.length}</strong>
        <span>逾期追蹤</span>
      </div>
      <div class="summary-card">
        <strong>${completedRows.length}</strong>
        <span>已完成</span>
      </div>
    </div>

    ${renderIncidentList(rows)}
  `
}

function renderIncidentList(rows) {
  if (!rows.length) {
    return `<div class="empty-state">目前沒有符合條件的異況追蹤。</div>`
  }

  return `
    <div class="incident-list">
      ${rows.map(row => {
        const isOverdue = row.status !== '已完成' && row.start_date && row.start_date < todayString()
        return `
          <div class="incident-row ${row.status === '已完成' ? 'is-completed' : ''} ${isOverdue ? 'is-overdue' : ''}">
            <div class="incident-date">
              <span>下次追蹤</span>
              <strong>${escapeHtml(row.start_date || '-')}</strong>
              <small>${escapeHtml(formatTime(row))}</small>
            </div>

            <div class="incident-main">
              <div class="incident-title">${escapeHtml(row.sub_type || '異況')}｜${escapeHtml(row.title || '-')} ${renderIncidentUrgencyBadge(row)}</div>
              <div class="incident-meta">
                負責 / 協助：${escapeHtml(getAssigneeNames(row))}
                ｜建立者：${escapeHtml(row.creator_name || '-')}
              </div>
              <div class="incident-meta">
                客戶 / 工人：${escapeHtml(row.customer_name || '-')}
              </div>
              ${renderIncidentTrackingHistory(row)}
              ${row.need_service_record ? `<div class="incident-sr-badge">服務紀錄單：${row.service_record_submitted_date ? '已繳交 ' + escapeHtml(row.service_record_submitted_date) : '需繳交'}</div>` : ''}
              ${row.sub_type_note ? `<div class="incident-note">${escapeHtml(row.sub_type_note)}</div>` : ''}
            </div>

            <div class="incident-actions">
              <span class="status-pill">${isOverdue ? '逾期' : escapeHtml(row.status || '未完成')}</span>
              <button class="small-secondary-btn" data-view-schedule="${row.schedule_id}">查看</button>
              ${row.status !== '已完成' && row.status !== '取消' ? `<button class="small-btn incident-next-btn" data-incident-next="${row.schedule_id}">下次追蹤</button>` : ''}
              ${canCompleteSchedule(row) ? `<button class="small-btn" data-incident-complete="${row.schedule_id}">已完成</button>` : ''}
            </div>
          </div>
        `
      }).join('')}
    </div>
  `
}




function bindIncidentTrackingEditButtons(root = document) {
  root.querySelectorAll('[data-incident-tracking-edit]').forEach(btn => {
    btn.addEventListener('click', event => {
      event.preventDefault()
      event.stopPropagation()
      openIncidentTrackingEditModal(btn.dataset.incidentTrackingEdit, Number(btn.dataset.trackingIndex))
    })
  })
}

function rebuildIncidentDescription(entries) {
  return entries
    .map(entry => {
      const title = String(entry.title || '').trim()
      const body = String(entry.body || '').trim()
      return body ? `${title}\n${body}` : title
    })
    .filter(Boolean)
    .join('\n')
}

function openIncidentTrackingEditModal(scheduleId, trackingIndex) {
  const row = schedules.find(item => item.schedule_id === scheduleId)
  if (!row) return

  if (!canModifySchedule(row)) {
    alert('您沒有權限修改此追蹤項目。')
    return
  }

  const entries = getIncidentTrackingEntries(row)
  const entry = entries[trackingIndex]
  if (!entry) {
    alert('找不到追蹤項目。')
    return
  }

  const modal = document.createElement('div')
  modal.className = 'modal-backdrop'
  modal.innerHTML = `
    <div class="modal-panel">
      <div class="modal-header">
        <h3>修改追蹤項目</h3>
        <button class="icon-btn" id="closeIncidentTrackingEditBtn" type="button">×</button>
      </div>

      <form id="incidentTrackingEditForm" class="form-grid">
        <label class="span-2">
          追蹤標題
          <input name="tracking_title" required value="${escapeHtml(entry.title || '')}">
        </label>

        <label class="span-2">
          追蹤內容
          <textarea name="tracking_body" rows="5" required>${escapeHtml(entry.body || '')}</textarea>
        </label>

        <div class="modal-actions span-2">
          <button type="button" class="secondary-btn" id="cancelIncidentTrackingEditBtn">取消</button>
          <button type="submit" class="primary-btn">儲存修改</button>
        </div>
      </form>
    </div>
  `

  document.body.appendChild(modal)
  document.querySelector('#closeIncidentTrackingEditBtn').addEventListener('click', () => modal.remove())
  document.querySelector('#cancelIncidentTrackingEditBtn').addEventListener('click', () => modal.remove())
  document.querySelector('#incidentTrackingEditForm').addEventListener('submit', event => saveIncidentTrackingEdit(event, modal, row, trackingIndex))
}

async function saveIncidentTrackingEdit(event, modal, row, trackingIndex) {
  event.preventDefault()
  if (saving) return
  saving = true

  try {
    const form = new FormData(event.target)
    const entries = getIncidentTrackingEntries(row)
    const current = entries[trackingIndex]
    if (!current) {
      alert('找不到追蹤項目。')
      saving = false
      return
    }

    entries[trackingIndex] = {
      title: form.get('tracking_title') || current.title,
      body: form.get('tracking_body') || ''
    }

    const { error } = await supabase
      .from('schedules')
      .update({
        description: rebuildIncidentDescription(entries)
      })
      .eq('schedule_id', row.schedule_id)

    if (error) {
      alert('修改追蹤項目失敗：' + error.message)
      saving = false
      return
    }

    await supabase.from('audit_logs').insert({
      operated_by_profile_id: currentProfile.profile_id,
      operated_by_staff_id: currentProfile.staff_id,
      operated_by_name: currentProfile.name || currentProfile.email,
      action_type: '修改追蹤',
      source_type: 'schedule',
      source_id: row.schedule_id,
      note: `V002-1L-4 修改追蹤項目：${form.get('tracking_title') || current.title}`
    })

    modal.remove()
    await refreshData()
    saving = false
    renderApp()
  } catch (err) {
    alert('修改追蹤項目失敗：' + (err?.message || err))
    saving = false
  }
}


function openIncidentNextTrackingModal(scheduleId) {
  const row = schedules.find(item => item.schedule_id === scheduleId)
  if (!row) return

  const nextIndex = getIncidentTrackingEntries(row).length + 1

  const modal = document.createElement('div')
  modal.className = 'modal-backdrop'
  modal.innerHTML = `
    <div class="modal-panel">
      <div class="modal-header">
        <h3>新增第${chineseTrackingNumber(nextIndex)}次追蹤</h3>
        <button class="icon-btn" id="closeIncidentNextModalBtn" type="button">×</button>
      </div>

      <form id="incidentNextTrackingForm" class="form-grid">
        <div class="span-2 incident-next-context">
          <strong>${escapeHtml(row.title || '異況追蹤')}</strong>
          <span>目前下次追蹤：${escapeHtml(row.start_date || '-')}｜${escapeHtml(formatTime(row))}</span>
        </div>

        <label>
          下次追蹤日期
          <input name="next_follow_date" type="date" required value="${row.start_date || todayString()}">
        </label>

        <label class="span-2">
          下次追蹤時間
          ${fieldTimeSelectHtml('incident_follow_next', row.start_time ? parseTimeForEdit(row.start_time, '', '00').hour : '', row.start_time ? parseTimeForEdit(row.start_time, '', '00').minute : '00', row.time_type || '不指定')}
        </label>

        <div class="span-2 incident-tracking-target-box">
          <div class="field-title">執行對象（可複選）</div>
          <div class="checkbox-list incident-tracking-target-list">
            ${incidentTrackingTargetChecksHtml(getAssigneeIds(row))}
          </div>
          <p class="field-hint">儲存後會自動建立一筆追蹤行程，並同步到所選執行對象的個人行程表。</p>
        </div>

        <label class="span-2">
          第${chineseTrackingNumber(nextIndex)}次追蹤內容
          <textarea name="tracking_content" rows="4" required placeholder="請輸入本次追蹤內容、處理狀況或待辦事項"></textarea>
        </label>

        <div class="modal-actions span-2">
          <button type="button" class="secondary-btn" id="cancelIncidentNextModalBtn">取消</button>
          <button type="submit" class="primary-btn">儲存追蹤</button>
        </div>
      </form>
    </div>
  `

  document.body.appendChild(modal)
  document.querySelector('#closeIncidentNextModalBtn').addEventListener('click', () => modal.remove())
  document.querySelector('#cancelIncidentNextModalBtn').addEventListener('click', () => modal.remove())
  document.querySelector('#incidentNextTrackingForm').addEventListener('submit', event => saveIncidentNextTracking(event, modal, row))
}

async function saveIncidentNextTracking(event, modal, row) {
  event.preventDefault()
  if (saving) return
  saving = true

  try {
    const form = new FormData(event.target)
    const nextTime = getFieldSingleTimeValue(form, 'incident_follow_next')
    const nextFollowDate = form.get('next_follow_date')
    const trackingContent = String(form.get('tracking_content') || '').trim()
    const targetIds = [...document.querySelectorAll('input[name="incident_tracking_target"]:checked')].map(input => input.value)

    if (!trackingContent) {
      alert('請輸入追蹤內容。')
      saving = false
      return
    }

    if (!targetIds.length) {
      alert('請至少選擇一位執行對象。')
      saving = false
      return
    }

    const nextIndex = getIncidentTrackingEntries(row).length + 1
    const trackingTitle = `第${chineseTrackingNumber(nextIndex)}次追蹤`
    const targetNames = staffList.filter(staff => targetIds.includes(staff.staff_id)).map(staff => staff.name).join('、')
    const nextDescription = appendIncidentTrackingEntry(row, todayString(), '', `${trackingContent}\n執行對象：${targetNames}`)
    const currentNote = String(row.sub_type_note || '')
    const noteParts = currentNote.split('｜').map(item => item.trim()).filter(Boolean)
    const cleanedNoteParts = noteParts.filter(item => !item.startsWith('下次追蹤：') && !item.startsWith('下次執行對象：'))
    cleanedNoteParts.push(`下次追蹤：${nextFollowDate}${nextTime ? ' ' + nextTime : ''}`)
    cleanedNoteParts.push(`下次執行對象：${targetNames}`)

    const { error } = await supabase
      .from('schedules')
      .update({
        description: nextDescription,
        start_date: nextFollowDate,
        end_date: nextFollowDate,
        time_type: getFieldTimeTypeFromForm(form, 'incident_follow_next'),
        start_time: getFieldDbTimeValue(nextTime),
        end_time: null,
        sub_type_note: cleanedNoteParts.join('｜'),
        status: '未完成'
      })
      .eq('schedule_id', row.schedule_id)

    if (error) {
      alert('新增下次追蹤失敗：' + error.message)
      saving = false
      return
    }

    await createIncidentTrackingSchedule(row, trackingTitle, trackingContent, nextFollowDate, nextTime, targetIds, `母案件下次追蹤：${nextFollowDate}${nextTime ? ' ' + nextTime : ''}`)

    await supabase.from('audit_logs').insert({
      operated_by_profile_id: currentProfile.profile_id,
      operated_by_staff_id: currentProfile.staff_id,
      operated_by_name: currentProfile.name || currentProfile.email,
      action_type: '新增追蹤',
      source_type: 'schedule',
      source_id: row.schedule_id,
      note: `V002-1L-5 新增下次追蹤並上行程：${nextFollowDate}${nextTime ? ' ' + nextTime : ''}`
    })

    modal.remove()
    await refreshData()
    saving = false
    renderApp()
  } catch (err) {
    alert('新增下次追蹤失敗：' + (err?.message || err))
    saving = false
  }
}


function openEditIncidentModal(scheduleId) {
  const row = schedules.find(item => item.schedule_id === scheduleId)
  if (!row) return

  if (!canModifySchedule(row)) {
    alert('您沒有權限修改此異況。')
    return
  }

  const selectedIds = getAssigneeIds(row)
  const responsibleId = selectedIds[0] || currentProfile?.staff_id || ''
  const assistantIds = selectedIds.filter(id => id !== responsibleId)
  const nextStart = parseTimeForEdit(row.start_time, '', '00')
  const incidentType = row.sub_type || getFieldNoteValue(row, '異況類型') || '其他'
  const incidentUrgency = getIncidentUrgencyFromRow(row)
  const incidentDate = getFieldNoteValue(row, '發生日期') || row.start_date || todayString()

  const modal = document.createElement('div')
  modal.className = 'modal-backdrop'
  modal.innerHTML = `
    <div class="modal-panel">
      <div class="modal-header">
        <h3>修改異況追蹤</h3>
        <button class="icon-btn" id="closeEditIncidentModalBtn" type="button">×</button>
      </div>

      <form id="editIncidentForm" class="form-grid">
        <label>
          異況類型
          <select name="incident_type">${incidentTypeOptionsHtml(incidentType)}</select>
        </label>

        <label>
          緊急程度
          <select name="incident_urgency">${incidentUrgencyOptionsHtml(incidentUrgency)}</select>
        </label>

        <label>
          發生日期
          <input name="incident_date" type="date" value="${incidentDate}" required>
        </label>

        <label class="span-2">
          客戶 / 工人
          <input name="customer_name" value="${escapeHtml(row.customer_name || getFieldNoteValue(row, '客戶 / 工人') || '')}">
        </label>

        <label>
          負責人
          <select name="responsible_staff_id">${incidentResponsibleOptionsHtml(responsibleId)}</select>
        </label>

        <label>
          下次追蹤日期
          <input name="next_follow_date" type="date" required value="${row.start_date || todayString()}">
        </label>

        <label class="span-2">
          下次追蹤時間
          ${fieldTimeSelectHtml('edit_incident_next', row.start_time ? nextStart.hour : '', row.start_time ? nextStart.minute : '00', row.time_type || '不指定')}
        </label>

        <div class="span-2">
          <div class="field-title">協助人員（可複選）</div>
          <div class="checkbox-list incident-assistant-list">
            ${incidentAssistantChecksHtml(assistantIds, 'edit_incident_assistant')}
          </div>
        </div>

        ${renderIncidentTrackingHistory(row, true)}

        <label class="span-2">
          新增追蹤內容
          <textarea name="new_tracking_content" rows="4" placeholder="輸入後會新增為第${chineseTrackingNumber(getIncidentTrackingEntries(row).length + 1)}次追蹤；若只是調整下次追蹤日期，可先空白。"></textarea>
        </label>

        ${incidentServiceRecordFieldsHtml(row)}

        <div class="modal-actions span-2">
          <button type="button" class="secondary-btn" id="cancelEditIncidentModalBtn">取消</button>
          <button type="submit" class="primary-btn">儲存異況修改</button>
        </div>
      </form>
    </div>
  `

  document.body.appendChild(modal)
  bindIncidentTrackingEditButtons(modal)
  document.querySelector('#closeEditIncidentModalBtn').addEventListener('click', () => modal.remove())
  document.querySelector('#cancelEditIncidentModalBtn').addEventListener('click', () => modal.remove())
  document.querySelector('#editIncidentForm').addEventListener('submit', event => saveEditedIncident(event, modal, row))
}

async function saveEditedIncident(event, modal, originalRow) {
  event.preventDefault()
  if (saving) return
  saving = true

  try {
    const form = new FormData(event.target)
    const responsibleId = form.get('responsible_staff_id')
    const assistantIds = [...document.querySelectorAll('input[name="edit_incident_assistant"]:checked')].map(input => input.value)
    const selectedIds = [...new Set([responsibleId, ...assistantIds].filter(Boolean))]
    const selectedStaff = staffList.filter(staff => selectedIds.includes(staff.staff_id))
    const responsibleStaff = staffList.find(staff => staff.staff_id === responsibleId) || selectedStaff[0] || currentProfile

    if (!selectedStaff.length) {
      alert('請至少選擇一位負責人。')
      saving = false
      return
    }

    const incidentType = form.get('incident_type') || '其他'
    const customerName = form.get('customer_name') || ''
    const nextTime = getFieldSingleTimeValue(form, 'edit_incident_next')
    const assistantNames = selectedStaff
      .filter(staff => assistantIds.includes(staff.staff_id))
      .map(staff => staff.name)
    const newTrackingContent = String(form.get('new_tracking_content') || '').trim()
    const nextDescription = newTrackingContent
      ? appendIncidentTrackingEntry(originalRow, todayString(), '', newTrackingContent)
      : originalRow.description

    const payload = {
      department_id: responsibleStaff.department_id || currentProfile.department_id,
      department_name: responsibleStaff.department_name || currentProfile.department_name,
      category: '異況追蹤',
      schedule_type: '異況',
      sub_type: incidentType,
      sub_type_note: buildIncidentNoteParts(form, incidentType, customerName, responsibleStaff, assistantNames, nextTime).join('｜'),
      title: `${incidentType}${customerName ? '｜' + customerName : '｜異況追蹤'}`,
      description: nextDescription || null,
      start_date: form.get('next_follow_date'),
      end_date: form.get('next_follow_date'),
      time_type: getFieldTimeTypeFromForm(form, 'edit_incident_next'),
      start_time: getFieldDbTimeValue(nextTime),
      end_time: null,
      customer_name: customerName || null,
      need_service_record: form.get('need_service_record') === 'on',
      service_record_submitted: form.get('service_record_submitted') === 'on',
      service_record_submitted_date: form.get('service_record_submitted') === 'on' ? (form.get('service_record_submitted_date') || todayString()) : null
    }

    const { error } = await supabase
      .from('schedules')
      .update(payload)
      .eq('schedule_id', originalRow.schedule_id)

    if (error) {
      alert('修改異況失敗：' + error.message)
      saving = false
      return
    }

    const { error: assigneeError } = await supabase.rpc('update_schedule_assignees', {
      target_schedule_id: originalRow.schedule_id,
      staff_ids_value: selectedIds
    })

    if (assigneeError) {
      alert('異況已修改，但負責 / 協助人員同步失敗：' + assigneeError.message)
      saving = false
      return
    }

    await supabase.from('audit_logs').insert({
      operated_by_profile_id: currentProfile.profile_id,
      operated_by_staff_id: currentProfile.staff_id,
      operated_by_name: currentProfile.name || currentProfile.email,
      action_type: '修改',
      source_type: 'schedule',
      source_id: originalRow.schedule_id,
      note: 'V002-1L-2 修改異況追蹤'
    })

    modal.remove()
    await refreshData()
    saving = false
    renderApp()
  } catch (err) {
    alert('修改異況失敗：' + (err?.message || err))
    saving = false
  }
}


function openIncidentModal() {
  if (!canCreateIncidentSchedule()) return denyPermission('你的角色沒有新增異況權限。')

  const modal = document.createElement('div')
  modal.className = 'modal-backdrop'
  modal.innerHTML = `
    <div class="modal-panel">
      <div class="modal-header">
        <h3>新增異況</h3>
        <button class="icon-btn" id="closeIncidentModalBtn" type="button">×</button>
      </div>

      <form id="incidentForm" class="form-grid">
        <label>
          異況類型
          <select name="incident_type">${incidentTypeOptionsHtml()}</select>
        </label>

        <label>
          緊急程度
          <select name="incident_urgency">${incidentUrgencyOptionsHtml('一般')}</select>
        </label>

        <label>
          發生日期
          <input name="incident_date" type="date" value="${todayString()}" required>
        </label>

        <label class="span-2">
          客戶 / 工人
          <input name="customer_name" placeholder="例如：雇主名稱、工人姓名、案件名稱">
        </label>

        <label>
          負責人
          <select name="responsible_staff_id">${incidentResponsibleOptionsHtml()}</select>
        </label>

        <label>
          下次追蹤日期
          <input name="next_follow_date" type="date" required value="${todayString()}">
        </label>

        <label class="span-2">
          下次追蹤時間
          ${fieldTimeSelectHtml('incident_next')}
        </label>

        <div class="span-2">
          <div class="field-title">協助人員（可複選）</div>
          <div class="checkbox-list incident-assistant-list">
            ${incidentAssistantChecksHtml()}
          </div>
        </div>

        <label class="span-2">
          第一次追蹤 / 處理內容
          <textarea name="description" rows="4" required placeholder="請輸入第一次追蹤、處理內容或目前狀況"></textarea>
        </label>

        ${incidentServiceRecordFieldsHtml()}

        <div class="modal-actions span-2">
          <button type="button" class="secondary-btn" id="cancelIncidentModalBtn">取消</button>
          <button type="submit" class="primary-btn">儲存異況</button>
        </div>
      </form>
    </div>
  `

  document.body.appendChild(modal)
  document.querySelector('#closeIncidentModalBtn').addEventListener('click', () => modal.remove())
  document.querySelector('#cancelIncidentModalBtn').addEventListener('click', () => modal.remove())
  document.querySelector('#incidentForm').addEventListener('submit', event => saveIncident(event, modal))
}

async function saveIncident(event, modal) {
  event.preventDefault()
  if (saving) return
  saving = true

  if (!canCreateIncidentSchedule()) { alert('你的角色沒有新增異況權限。'); saving = false; return }

  try {
    const form = new FormData(event.target)
    const responsibleId = form.get('responsible_staff_id')
    const assistantIds = [...document.querySelectorAll('input[name="incident_assistant"]:checked')].map(input => input.value)
    const selectedIds = [...new Set([responsibleId, ...assistantIds].filter(Boolean))]
    const selectedStaff = staffList.filter(staff => selectedIds.includes(staff.staff_id))
    const responsibleStaff = staffList.find(staff => staff.staff_id === responsibleId) || selectedStaff[0] || currentProfile

    if (!selectedStaff.length) {
      alert('請至少選擇一位負責人。')
      saving = false
      return
    }

    const incidentType = form.get('incident_type') || '其他'
    const customerName = form.get('customer_name') || ''
    const nextTime = getFieldSingleTimeValue(form, 'incident_next')
    const assistantNames = selectedStaff
      .filter(staff => assistantIds.includes(staff.staff_id))
      .map(staff => staff.name)
    const firstTracking = buildIncidentTrackingEntry(1, form.get('incident_date'), '', form.get('description'))

    const payload = {
      creator_profile_id: currentProfile.profile_id,
      creator_staff_id: currentProfile.staff_id,
      creator_name: currentProfile.name || currentProfile.email,
      department_id: responsibleStaff.department_id || currentProfile.department_id,
      department_name: responsibleStaff.department_name || currentProfile.department_name,
      category: '異況追蹤',
      schedule_type: '異況',
      sub_type: incidentType,
      sub_type_note: buildIncidentNoteParts(form, incidentType, customerName, responsibleStaff, assistantNames, nextTime).join('｜'),
      title: `${incidentType}${customerName ? '｜' + customerName : '｜異況追蹤'}`,
      description: form.get('description') || null,
      start_date: form.get('next_follow_date'),
      end_date: form.get('next_follow_date'),
      time_type: getFieldTimeTypeFromForm(form, 'incident_next'),
      start_time: getFieldDbTimeValue(nextTime),
      end_time: null,
      customer_name: customerName || null,
      location_name: null,
      address: null,
      car_no: null,
      status: '未完成',
      need_service_record: form.get('need_service_record') === 'on',
      service_record_submitted: form.get('service_record_submitted') === 'on',
      service_record_submitted_date: form.get('service_record_submitted') === 'on' ? (form.get('service_record_submitted_date') || todayString()) : null
    }

    const { data: schedule, error: scheduleError } = await supabase
      .from('schedules')
      .insert(payload)
      .select()
      .single()

    if (scheduleError) {
      alert('新增異況失敗：' + scheduleError.message)
      saving = false
      return
    }

    const assigneeRows = selectedStaff.map(staff => ({
      schedule_id: schedule.schedule_id,
      staff_id: staff.staff_id,
      staff_name: staff.name,
      department_id: staff.department_id,
      department_name: staff.department_name,
      position: staff.position,
      // schedule_assignees.assignee_type 目前資料庫 check constraint 只允許既有 executor 類型；
      // 負責 / 協助角色改寫入 sub_type_note，不寫入 assignee_type，避免新增異況時失敗。
      assignee_type: 'executor'
    }))

    const { error: assigneeError } = await supabase.from('schedule_assignees').insert(assigneeRows)

    if (assigneeError) {
      alert('異況已建立，但負責 / 協助人員寫入失敗：' + assigneeError.message)
      saving = false
      return
    }

    try {
      await createIncidentTrackingSchedule(
        {
          ...schedule,
          sub_type: incidentType,
          customer_name: customerName || null,
          title: payload.title,
          need_service_record: payload.need_service_record,
          department_id: payload.department_id,
          department_name: payload.department_name
        },
        '第一次追蹤',
        form.get('description') || '',
        form.get('incident_date'),
        '',
        selectedIds,
        '建立異況當天行程'
      )
    } catch (trackingError) {
      console.error(trackingError)
      alert('異況已建立，但建立當天行程寫入失敗：' + (trackingError?.message || trackingError))
      saving = false
      return
    }

    await supabase.from('audit_logs').insert({
      operated_by_profile_id: currentProfile.profile_id,
      operated_by_staff_id: currentProfile.staff_id,
      operated_by_name: currentProfile.name || currentProfile.email,
      action_type: '新增',
      source_type: 'schedule',
      source_id: schedule.schedule_id,
      note: 'V002-1L-1 新增異況追蹤'
    })

    modal.remove()
    await refreshData()
    saving = false
    renderApp()
  } catch (err) {
    alert('新增異況失敗：' + (err?.message || err))
    saving = false
  }
}
/* FOR-e V002-1L-1 END - incident tracking */




/* FOR-e V002-1N-2 START - statistics dashboard clean type stats */
/*
  V002-1N-2｜統計報表簡約版
  - 會議室不列入統計
  - 依行程類型統計
  - 一部 / 二部依行程類型統計
  - 服務紀錄單同步納入統計
  - 改為簡約卡片 / 條列，不使用格線表格
*/

function getMonthFirstDay(dateText = todayString()) {
  return `${dateText.slice(0, 7)}-01`
}

function getMonthLastDay(dateText = todayString()) {
  const year = Number(dateText.slice(0, 4))
  const month = Number(dateText.slice(5, 7))
  return new Date(year, month, 0).toISOString().slice(0, 10)
}

function getStatsDateRange() {
  const today = todayString()
  if (statsFilters.period === '當月') {
    return {
      start: getMonthFirstDay(today),
      end: getMonthLastDay(today),
      label: `${today.slice(0, 7)} 當月`
    }
  }

  if (statsFilters.period === '當年') {
    return {
      start: `${today.slice(0, 4)}-01-01`,
      end: `${today.slice(0, 4)}-12-31`,
      label: `${today.slice(0, 4)} 當年`
    }
  }

  return {
    start: statsFilters.startDate || '',
    end: statsFilters.endDate || '',
    label: `${statsFilters.startDate || '不限起日'} ～ ${statsFilters.endDate || '不限迄日'}`
  }
}

function isStatsExcludedSchedule(row) {
  return typeof isMeetingRoomSchedule === 'function' && isMeetingRoomSchedule(row)
}

function getStatsScheduleType(row) {
  if (!row) return '未分類'
  return row.schedule_type || row.category || '未分類'
}

function getStatsDepartment(row) {
  return row.department_name || getAssigneeDepartmentFallback(row) || '未指定'
}

function getAssigneeDepartmentFallback(row) {
  const assignee = (row.schedule_assignees || []).find(item => !item.deleted_at && item.department_name)
  return assignee?.department_name || ''
}

function getStatsDepartmentGroup(departmentName) {
  const text = String(departmentName || '')
  if (text.includes('一部')) return '一部'
  if (text.includes('二部')) return '二部'
  return '其他'
}

function getStatsDepartmentOptions() {
  const names = schedules
    .filter(isVisibleSchedule)
    .filter(row => !isStatsExcludedSchedule(row))
    .map(getStatsDepartment)
    .filter(Boolean)

  return ['全部', ...new Set(names)]
}

function getStatsCategoryOptions() {
  const items = schedules
    .filter(isVisibleSchedule)
    .filter(row => !isStatsExcludedSchedule(row))
    .map(getStatsScheduleType)
    .filter(Boolean)

  return ['全部', ...new Set(items)]
}

function getStatsStaffOptionsHtml() {
  return `<option value="全部" ${statsFilters.staffId === '全部' ? 'selected' : ''}>全部人員</option>` +
    staffList.map(staff => `
      <option value="${staff.staff_id}" ${statsFilters.staffId === staff.staff_id ? 'selected' : ''}>${staff.name}｜${staff.department_name || ''}</option>
    `).join('')
}

function getStatsFilteredSchedules() {
  const range = getStatsDateRange()

  return schedules
    .filter(isVisibleSchedule)
    .filter(row => !isStatsExcludedSchedule(row))
    .filter(row => {
      const date = row.start_date || ''
      if (range.start && date < range.start) return false
      if (range.end && date > range.end) return false

      if (statsFilters.department !== '全部' && getStatsDepartment(row) !== statsFilters.department) return false
      if (statsFilters.category !== '全部' && getStatsScheduleType(row) !== statsFilters.category) return false

      if (statsFilters.staffId !== '全部') {
        const assigned = (row.schedule_assignees || []).some(item => item.staff_id === statsFilters.staffId && !item.deleted_at)
        if (!assigned) return false
      }

      return true
    })
}

function getStatsFilteredServiceRecords() {
  const range = getStatsDateRange()

  return serviceRecords.filter(record => {
    const date = record.schedule_date || ''
    if (range.start && date < range.start) return false
    if (range.end && date > range.end) return false

    const schedule = getServiceRecordSchedule(record)
    if (schedule && isStatsExcludedSchedule(schedule)) return false

    if (statsFilters.department !== '全部' && getServiceRecordDepartment(record) !== statsFilters.department) return false
    if (statsFilters.staffId !== '全部' && record.staff_id !== statsFilters.staffId) return false

    if (statsFilters.category !== '全部') {
      const type = schedule ? getStatsScheduleType(schedule) : getServiceRecordScheduleType(record)
      if (type !== statsFilters.category) return false
    }

    return true
  })
}

function getStatsCountBy(rows, getKey) {
  const map = new Map()
  rows.forEach(row => {
    const key = getKey(row) || '未指定'
    if (!map.has(key)) {
      map.set(key, {
        key,
        total: 0,
        completed: 0,
        unfinished: 0,
        overdue: 0,
        cancelled: 0
      })
    }

    const item = map.get(key)
    item.total += 1
    if (row.status === '已完成') item.completed += 1
    else if (row.status === '取消') item.cancelled += 1
    else item.unfinished += 1

    if (isOverdueSchedule(row)) item.overdue += 1
  })

  return [...map.values()].sort((a, b) => b.total - a.total)
}

function getServiceRecordSimpleSummary(records) {
  return {
    total: records.length,
    submitted: records.filter(row => getServiceRecordStatus(row) === '已繳交').length,
    pending: records.filter(row => getServiceRecordStatus(row) === '未繳交').length,
    overdue: records.filter(row => getServiceRecordStatus(row) === '超過2週').length
  }
}

function getServiceRecordDeptGroupSummary(records) {
  const base = {
    '一部': { key: '一部', total: 0, submitted: 0, pending: 0, overdue: 0 },
    '二部': { key: '二部', total: 0, submitted: 0, pending: 0, overdue: 0 }
  }

  records.forEach(record => {
    const group = getStatsDepartmentGroup(getServiceRecordDepartment(record))
    if (!base[group]) return

    const item = base[group]
    const status = getServiceRecordStatus(record)
    item.total += 1
    if (status === '已繳交') item.submitted += 1
    if (status === '未繳交') item.pending += 1
    if (status === '超過2週') item.overdue += 1
  })

  return [base['一部'], base['二部']]
}

function getStatsTypeByDepartmentGroups(rows) {
  const map = new Map()

  rows.forEach(row => {
    const group = getStatsDepartmentGroup(getStatsDepartment(row))
    if (!['一部', '二部'].includes(group)) return

    const type = getStatsScheduleType(row)
    const key = `${group}__${type}`

    if (!map.has(key)) {
      map.set(key, {
        group,
        type,
        total: 0,
        completed: 0,
        unfinished: 0,
        overdue: 0
      })
    }

    const item = map.get(key)
    item.total += 1
    if (row.status === '已完成') item.completed += 1
    else if (row.status !== '取消') item.unfinished += 1
    if (isOverdueSchedule(row)) item.overdue += 1
  })

  return ['一部', '二部'].map(group => ({
    group,
    rows: [...map.values()]
      .filter(item => item.group === group)
      .sort((a, b) => b.total - a.total)
  }))
}

function renderStatsFilterForm() {
  const periodOptions = ['當月', '當年', '自訂']
    .map(item => `<option value="${item}" ${statsFilters.period === item ? 'selected' : ''}>${item}</option>`)
    .join('')

  const departmentOptions = buildServiceRecordOptionList(getStatsDepartmentOptions(), statsFilters.department)
  const categoryOptions = buildServiceRecordOptionList(getStatsCategoryOptions(), statsFilters.category)

  return `
    <form id="statsFilterForm" class="stats-filter-panel clean-stats-filter">
      <label>
        期間
        <select name="period">${periodOptions}</select>
      </label>

      <label>
        起日
        <input name="startDate" type="date" value="${statsFilters.startDate}">
      </label>

      <label>
        迄日
        <input name="endDate" type="date" value="${statsFilters.endDate}">
      </label>

      <label>
        部門
        <select name="department">${departmentOptions}</select>
      </label>

      <label>
        人員
        <select name="staffId">${getStatsStaffOptionsHtml()}</select>
      </label>

      <label>
        行程類型
        <select name="category">${categoryOptions}</select>
      </label>

      <button type="submit" class="primary-btn">套用統計</button>
    </form>
  `
}

function renderStatsMetricCards(rows) {
  const completionRows = rows.filter(row => !isNoCompletionControlSchedule(row))
  const activeRows = completionRows.filter(row => row.status !== '已完成' && row.status !== '取消')
  const completedRows = completionRows.filter(row => row.status === '已完成')
  const overdueRows = rows.filter(isOverdueSchedule)

  return `
    <div class="clean-stats-metrics stats-schedule-only-metrics">
      <div class="clean-stat-card">
        <span>行程總數</span>
        <strong>${rows.length}</strong>
      </div>
      <div class="clean-stat-card">
        <span>未完成</span>
        <strong>${activeRows.length}</strong>
      </div>
      <div class="clean-stat-card">
        <span>已完成</span>
        <strong>${completedRows.length}</strong>
      </div>
      <div class="clean-stat-card ${overdueRows.length ? 'is-alert' : ''}">
        <span>逾期行程</span>
        <strong>${overdueRows.length}</strong>
      </div>
    </div>
  `
}

function renderCleanTypeList(title, subtitle, rows) {
  return `
    <section class="clean-stats-section">
      <div class="section-title-row">
        <h4>${title}</h4>
        <span>${subtitle || ''}</span>
      </div>

      ${rows.length ? `
        <div class="simple-stat-table-wrap">
          <div class="simple-stat-table">
            <div class="simple-stat-head">
              <span>行程類型</span>
              <span>總數</span>
              <span>未完成</span>
              <span>逾期</span>
              <span>已完成</span>
            </div>
            ${rows.map(row => `
              <div class="simple-stat-row ${row.overdue ? 'has-overdue' : ''}">
                <strong>${escapeHtml(row.key || row.type)}</strong>
                <span>${row.total}</span>
                <span>${row.unfinished}</span>
                <span class="${row.overdue ? 'is-alert' : ''}">${row.overdue}</span>
                <span>${row.completed}</span>
              </div>
            `).join('')}
          </div>
        </div>
      ` : '<div class="empty-state">目前沒有統計資料。</div>'}
    </section>
  `
}

function renderDepartmentTypeStats(rows) {
  const groups = getStatsTypeByDepartmentGroups(rows)

  return `
    <section class="clean-stats-section">
      <div class="section-title-row">
        <h4>一部、二部統計（行程類型）</h4>
        <span>不含會議室</span>
      </div>

      <div class="department-type-grid">
        ${groups.map(group => `
          <div class="department-type-card simple-section-card">
            <h5>${group.group}</h5>
            ${group.rows.length ? `
              <div class="simple-stat-table section-mini-table">
                <div class="simple-stat-head">
                  <span>行程類型</span>
                  <span>總數</span>
                  <span>未完成</span>
                  <span>逾期</span>
                  <span>已完成</span>
                </div>
                ${group.rows.map(row => `
                  <div class="simple-stat-row ${row.overdue ? 'has-overdue' : ''}">
                    <strong>${escapeHtml(row.type)}</strong>
                    <span>${row.total}</span>
                    <span>${row.unfinished}</span>
                    <span class="${row.overdue ? 'is-alert' : ''}">${row.overdue}</span>
                    <span>${row.completed}</span>
                  </div>
                `).join('')}
              </div>
            ` : '<p class="muted">目前沒有資料</p>'}
          </div>
        `).join('')}
      </div>
    </section>
  `
}

function renderServiceRecordStatsSection(records) {
  const summary = getServiceRecordSimpleSummary(records)
  const deptRows = getServiceRecordDeptGroupSummary(records)
  const rows = [{ key: '全部', ...summary }, ...deptRows]

  return `
    <section class="clean-stats-section service-record-clean-section">
      <div class="section-title-row">
        <h4>服務紀錄單統計</h4>
        <span>連同行程統計一起檢視</span>
      </div>

      ${rows.length ? `
        <div class="simple-stat-table-wrap">
          <div class="simple-stat-table simple-service-record-table">
            <div class="simple-stat-head">
              <span>項目</span>
              <span>需繳交總數</span>
              <span>已交</span>
              <span>未繳</span>
              <span>逾期</span>
            </div>
            ${rows.map(row => `
              <div class="simple-stat-row ${row.overdue ? 'has-overdue' : ''}">
                <strong>${escapeHtml(row.key)}</strong>
                <span>${row.total}</span>
                <span>${row.submitted}</span>
                <span>${row.pending}</span>
                <span class="${row.overdue ? 'is-alert' : ''}">${row.overdue}</span>
              </div>
            `).join('')}
          </div>
        </div>
      ` : '<div class="empty-state">目前沒有統計資料。</div>'}
    </section>
  `
}


function getStatsPersonTypeSummary(rows) {
  const map = new Map()

  rows.forEach(row => {
    const type = getStatsScheduleType(row)
    const assignees = (row.schedule_assignees || []).filter(item => !item.deleted_at)

    if (!assignees.length) {
      const key = '未指定'
      if (!map.has(key)) {
        map.set(key, {
          key,
          name: '未指定',
          department: '-',
          total: 0,
          unfinished: 0,
          overdue: 0,
          completed: 0,
          types: new Map()
        })
      }
      updateStatsPersonTypeRow(map.get(key), row, type)
      return
    }

    assignees.forEach(assignee => {
      const key = assignee.staff_id || assignee.staff_name || '未指定'
      if (!map.has(key)) {
        map.set(key, {
          key,
          name: assignee.staff_name || '-',
          department: assignee.department_name || '-',
          total: 0,
          unfinished: 0,
          overdue: 0,
          completed: 0,
          types: new Map()
        })
      }
      updateStatsPersonTypeRow(map.get(key), row, type)
    })
  })

  return [...map.values()]
    .map(item => ({
      ...item,
      typeRows: [...item.types.entries()]
        .map(([type, count]) => ({ type, count }))
        .sort((a, b) => b.count - a.count)
    }))
    .sort((a, b) => {
      if (b.total !== a.total) return b.total - a.total
      return a.name.localeCompare(b.name, 'zh-Hant')
    })
}

function updateStatsPersonTypeRow(item, row, type) {
  item.total += 1
  if (row.status === '已完成') item.completed += 1
  else if (row.status !== '取消') item.unfinished += 1
  if (isOverdueSchedule(row)) item.overdue += 1
  item.types.set(type, (item.types.get(type) || 0) + 1)
}

function renderPersonTypeStats(rows) {
  const personRows = getStatsPersonTypeSummary(rows)
  const typeKeys = [...new Set(rows.map(getStatsScheduleType).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b, 'zh-Hant'))
  const columnTemplate = `minmax(110px, 1.1fr) minmax(110px, 1fr) repeat(4, minmax(58px, 0.55fr)) repeat(${Math.max(typeKeys.length, 1)}, minmax(74px, 0.65fr))`

  return `
    <section class="clean-stats-section person-type-stats-section">
      <div class="section-title-row">
        <h4>人員統計（行程類型）</h4>
        <span>每個行程類型獨立列出，不含會議室</span>
      </div>

      ${personRows.length ? `
        <div class="person-type-list person-type-column-list">
          <div class="person-type-head person-type-column-head" style="grid-template-columns:${columnTemplate}">
            <span>人員</span>
            <span>部門</span>
            <span>總數</span>
            <span>未完成</span>
            <span>逾期</span>
            <span>已完成</span>
            ${typeKeys.map(type => `<span>${escapeHtml(type)}</span>`).join('')}
          </div>

          ${personRows.map(row => `
            <div class="person-type-row person-type-column-row ${row.overdue ? 'has-overdue' : ''}" style="grid-template-columns:${columnTemplate}">
              <strong>${escapeHtml(row.name)}</strong>
              <span>${escapeHtml(row.department)}</span>
              <b>${row.total}</b>
              <b>${row.unfinished}</b>
              <b class="${row.overdue ? 'is-alert' : ''}">${row.overdue}</b>
              <b>${row.completed}</b>
              ${typeKeys.map(type => `<b class="type-stat-number">${row.types.get(type) || 0}</b>`).join('')}
            </div>
          `).join('')}
        </div>
      ` : '<div class="empty-state">目前沒有統計資料。</div>'}
    </section>
  `
}


function renderStatsDashboard() {
  const rows = getStatsFilteredSchedules()
  const range = getStatsDateRange()
  const typeRows = getStatsCountBy(rows, getStatsScheduleType)

  return `
    <div class="page-toolbar">
      <div>
        <h3>統計報表</h3>
        <p class="muted">期間：${escapeHtml(range.label)}｜依行程類型、一部 / 二部與人員統計。</p>
      </div>
      <div class="toolbar-actions">
        <button class="secondary-btn" id="resetStatsFilterBtn">清除條件</button>
        <button class="secondary-btn" id="refreshBtn">重新整理</button>
      </div>
    </div>

    ${renderReadStatus()}
    ${renderStatsFilterForm()}
    ${renderStatsMetricCards(rows)}
    ${renderCleanTypeList('行程類型統計', '不含會議室', typeRows)}
    ${renderDepartmentTypeStats(rows)}
    ${renderPersonTypeStats(rows)}
  `
}
/* FOR-e V002-1N-2 END - statistics dashboard clean type stats */




/* FOR-e V002-1O-1 START - options management */
/*
  V002-1O-1｜選項管理
  不改 SQL。第一版先存在瀏覽器 localStorage，讓選項可立即維護。
*/

const managedOptionsStorageKey = 'for-e-managed-options-v002'

function getManagedOptions() {
  const remoteOptions = hasSharedSetting('managed_options')
    ? normalizeSettingValue(appSettings.managed_options)
    : null

  if (remoteOptions) return remoteOptions

  return readLocalJsonSetting(managedOptionsStorageKey)
}

function saveManagedOptions(value) {
  const nextOptions = normalizeSettingValue(value)
  appSettings.managed_options = nextOptions
  localStorage.setItem(managedOptionsStorageKey, JSON.stringify(nextOptions))
  return saveAppSetting('managed_options', nextOptions)
}

function resetManagedOptions() {
  const nextOptions = {}
  appSettings.managed_options = nextOptions
  localStorage.removeItem(managedOptionsStorageKey)
  return saveAppSetting('managed_options', nextOptions)
}

function getManagedListOption(key, fallback = []) {
  const options = getManagedOptions()
  const list = Array.isArray(options[key]) ? options[key] : fallback
  return [...new Set((list || []).map(item => String(item || '').trim()).filter(Boolean))]
}

function getManagedLocationOptions() {
  const options = getManagedOptions()
  const list = Array.isArray(options.fieldLocationOptions) ? options.fieldLocationOptions : fieldLocationOptions
  return (list || [])
    .map(item => ({
      name: String(item?.name || '').trim(),
      address: String(item?.address || '').trim()
    }))
    .filter(item => item.name)
}

function parseOptionLines(value) {
  return [...new Set(String(value || '')
    .split(/\n+/)
    .map(item => item.trim())
    .filter(Boolean))]
}

function parseLocationLines(value) {
  return String(value || '')
    .split(/\n+/)
    .map(line => line.trim())
    .filter(Boolean)
    .map(line => {
      const [name, ...addressParts] = line.split('｜')
      return {
        name: String(name || '').trim(),
        address: addressParts.join('｜').trim()
      }
    })
    .filter(item => item.name)
}

function optionLinesValue(key, fallback = []) {
  return getManagedListOption(key, fallback).join('\n')
}

function locationLinesValue() {
  return getManagedLocationOptions()
    .map(item => `${item.name}｜${item.address || ''}`)
    .join('\n')
}

function parseTemplateLines(value) {
  return String(value || '')
    .split(/\n+/)
    .map(line => line.trim())
    .filter(Boolean)
    .map(line => {
      const [type, ...contentParts] = line.split('｜')
      return {
        type: String(type || '').trim(),
        content: contentParts.join('｜').trim().replaceAll('\\n', '\n')
      }
    })
    .filter(item => item.type)
}

function getManagedScheduleContentTemplates() {
  const options = getManagedOptions()
  const list = Array.isArray(options.scheduleContentTemplates) ? options.scheduleContentTemplates : scheduleContentTemplates
  return (list || [])
    .map(item => ({
      type: String(item?.type || '').trim(),
      content: String(item?.content || '').trim()
    }))
    .filter(item => item.type)
}

function templateLinesValue() {
  return getManagedScheduleContentTemplates()
    .map(item => `${item.type}｜${String(item.content || '').replaceAll('\n', '\\n')}`)
    .join('\n')
}

function getScheduleTypeTemplate(type) {
  const key = String(type || '').trim()
  if (!key) return ''
  const found = getManagedScheduleContentTemplates().find(item => item.type === key)
  return found?.content || ''
}

function getCurrentFormScheduleType(form) {
  const category = form?.querySelector('[name="category"]')?.value || ''
  if (category === '服務行程') return form.querySelector('[name="schedule_type"]')?.value || ''
  if (category === '待辦事項') return form.querySelector('[name="todo_item"]')?.value || '待辦事項'
  if (category === '請假 / 會議 / 活動 / 外訓') return form.querySelector('[name="leave_meeting_type"]')?.value || ''
  if (category === '證件交付') return '證件交付'
  if (category === '一般記事') return '一般記事'
  return ''
}

function applyScheduleTypeTemplateToForm(form, force = false) {
  if (!form) return false
  const description = form.querySelector('textarea[name="description"]')
  if (!description) return false

  const scheduleType = getCurrentFormScheduleType(form)
  const template = getScheduleTypeTemplate(scheduleType)
  if (!template) return false

  if (!force && description.value.trim()) return true
  description.value = template
  description.dispatchEvent(new Event('input', { bubbles: true }))
  return true
}

function optionTextarea(label, name, value, hint = '', placeholder = '') {
  return `
    <section class="option-edit-box" data-option-editor="${name}">
      <div class="option-edit-head">
        <h4>${escapeHtml(label)}</h4>
        ${hint ? `<p>${escapeHtml(hint)}</p>` : ''}
      </div>
      <div class="option-edit-body">
        <textarea class="option-hidden-textarea" name="${name}" data-option-editor-value>${escapeHtml(value)}</textarea>
        <div class="option-line-list" data-option-line-list></div>
        <div class="option-mini-actions">
          <button type="button" class="secondary-btn option-add-line-btn" data-option-add-line>＋ 新增</button>
          ${placeholder ? `<span>${escapeHtml(placeholder)}</span>` : ''}
        </div>
      </div>
    </section>
  `
}


function scheduleTemplateEditor() {
  return `
    <section class="option-edit-box schedule-template-editor-box" data-template-editor>
      <div class="option-edit-head schedule-template-head">
        <h4>行程類型對應內容</h4>
        <p>選擇行程類型後，自動帶入下方內容。每一組都是「行程類型＋預設內容」，可新增、刪除與調整順序。</p>
      </div>

      <div class="schedule-template-help">
        <strong>怎麼填？</strong>
        <span>左邊填行程類型，例如「醫療」；右邊填新增行程時要自動帶入的內容，每一行一個欄位。</span>
      </div>

      <textarea class="option-hidden-textarea" name="scheduleContentTemplates" data-template-editor-value>${escapeHtml(templateLinesValue())}</textarea>
      <div class="schedule-template-list" data-template-row-list></div>

      <div class="schedule-template-actions">
        <button type="button" class="secondary-btn schedule-template-add-btn" data-template-add-row>＋ 新增一組行程內容</button>
        <span>範例：醫療｜就醫原因：／醫院或診所：／下次回診：</span>
      </div>
    </section>
  `
}

function createScheduleTemplateRow(item = {}) {
  const row = document.createElement('div')
  row.className = 'schedule-template-row'
  row.innerHTML = `
    <label class="schedule-template-type-field">
      <span>行程類型</span>
      <input data-template-type value="${escapeHtml(item.type || '')}" placeholder="例如：醫療">
    </label>

    <label class="schedule-template-content-field">
      <span>預設帶入內容</span>
      <textarea data-template-content rows="6" placeholder="例如：&#10;就醫原因：&#10;醫院 / 診所：&#10;診療結果：&#10;下次回診：">${escapeHtml(item.content || '')}</textarea>
    </label>

    <div class="schedule-template-row-actions">
      <button type="button" class="small-secondary-btn" data-template-move-up title="上移" aria-label="上移">↑</button>
      <button type="button" class="small-secondary-btn" data-template-move-down title="下移" aria-label="下移">↓</button>
      <button type="button" class="danger-btn" data-template-remove-row title="刪除" aria-label="刪除">×</button>
    </div>
  `
  return row
}

function syncScheduleTemplateEditor(editor) {
  if (!editor) return
  const textarea = editor.querySelector('[data-template-editor-value]')
  const rows = [...editor.querySelectorAll('.schedule-template-row')]
    .map(row => {
      const type = row.querySelector('[data-template-type]')?.value.trim() || ''
      const content = row.querySelector('[data-template-content]')?.value.trim() || ''
      return { type, content }
    })
    .filter(item => item.type)

  if (textarea) {
    textarea.value = rows
      .map(item => `${item.type}｜${String(item.content || '').replaceAll('\n', '\\n')}`)
      .join('\n')
  }
}

function syncScheduleTemplateEditors(root = document) {
  root.querySelectorAll('[data-template-editor]').forEach(syncScheduleTemplateEditor)
}

function initScheduleTemplateEditors(root = document) {
  root.querySelectorAll('[data-template-editor]').forEach(editor => {
    if (editor.dataset.templateEditorReady === 'true') return
    editor.dataset.templateEditorReady = 'true'

    const textarea = editor.querySelector('[data-template-editor-value]')
    const list = editor.querySelector('[data-template-row-list]')
    const addBtn = editor.querySelector('[data-template-add-row]')
    if (!textarea || !list || !addBtn) return

    const rows = parseTemplateLines(textarea.value)
    const initialRows = rows.length ? rows : [{ type: '', content: '' }]
    initialRows.forEach(item => list.appendChild(createScheduleTemplateRow(item)))

    addBtn.addEventListener('click', () => {
      const row = createScheduleTemplateRow({ type: '', content: '' })
      list.appendChild(row)
      const input = row.querySelector('[data-template-type]')
      if (input) input.focus()
      syncScheduleTemplateEditor(editor)
    })

    list.addEventListener('click', event => {
      const moveUpBtn = event.target.closest('[data-template-move-up]')
      const moveDownBtn = event.target.closest('[data-template-move-down]')
      const removeBtn = event.target.closest('[data-template-remove-row]')
      const actionBtn = moveUpBtn || moveDownBtn || removeBtn
      if (!actionBtn) return

      const row = actionBtn.closest('.schedule-template-row')
      if (!row) return

      if (moveUpBtn && row.previousElementSibling) {
        list.insertBefore(row, row.previousElementSibling)
        syncScheduleTemplateEditor(editor)
        return
      }

      if (moveDownBtn && row.nextElementSibling) {
        list.insertBefore(row.nextElementSibling, row)
        syncScheduleTemplateEditor(editor)
        return
      }

      if (removeBtn) {
        row.remove()
        if (!list.querySelector('.schedule-template-row')) {
          list.appendChild(createScheduleTemplateRow({ type: '', content: '' }))
        }
        syncScheduleTemplateEditor(editor)
      }
    })

    list.addEventListener('input', () => syncScheduleTemplateEditor(editor))
    syncScheduleTemplateEditor(editor)
  })
}


function createOptionLineRow(value = '') {
  const row = document.createElement('div')
  row.className = 'option-line-row'
  row.innerHTML = `
    <input data-option-line-input value="${escapeHtml(value)}" placeholder="請輸入選項內容">
    <button type="button" class="small-secondary-btn option-line-move-btn" data-option-move-up title="上移" aria-label="上移">↑</button>
    <button type="button" class="small-secondary-btn option-line-move-btn" data-option-move-down title="下移" aria-label="下移">↓</button>
    <button type="button" class="danger-btn option-line-remove-btn" data-option-remove-line title="刪除" aria-label="刪除">×</button>
  `
  return row
}

function syncOptionLineEditor(editor) {
  if (!editor) return
  const textarea = editor.querySelector('[data-option-editor-value]')
  const values = [...editor.querySelectorAll('[data-option-line-input]')]
    .map(input => input.value.trim())
    .filter(Boolean)
  if (textarea) textarea.value = values.join('\n')
}

function syncOptionLineEditors(root = document) {
  root.querySelectorAll('[data-option-editor]').forEach(syncOptionLineEditor)
}

function initOptionLineEditors(root = document) {
  root.querySelectorAll('[data-option-editor]').forEach(editor => {
    if (editor.dataset.optionEditorReady === 'true') return
    editor.dataset.optionEditorReady = 'true'

    const textarea = editor.querySelector('[data-option-editor-value]')
    const list = editor.querySelector('[data-option-line-list]')
    const addBtn = editor.querySelector('[data-option-add-line]')
    if (!textarea || !list || !addBtn) return

    const values = String(textarea.value || '').split('\n').map(item => item.trim()).filter(Boolean)
    const initialRows = values.length ? values : ['']
    initialRows.forEach(value => list.appendChild(createOptionLineRow(value)))

    addBtn.addEventListener('click', () => {
      const row = createOptionLineRow('')
      list.appendChild(row)
      const input = row.querySelector('[data-option-line-input]')
      if (input) input.focus()
      syncOptionLineEditor(editor)
    })

    list.addEventListener('click', event => {
      const moveUpBtn = event.target.closest('[data-option-move-up]')
      const moveDownBtn = event.target.closest('[data-option-move-down]')
      const removeBtn = event.target.closest('[data-option-remove-line]')
      const actionBtn = moveUpBtn || moveDownBtn || removeBtn
      if (!actionBtn) return

      const row = actionBtn.closest('.option-line-row')
      if (!row) return

      if (moveUpBtn && row.previousElementSibling) {
        list.insertBefore(row, row.previousElementSibling)
        syncOptionLineEditor(editor)
        return
      }

      if (moveDownBtn && row.nextElementSibling) {
        list.insertBefore(row.nextElementSibling, row)
        syncOptionLineEditor(editor)
        return
      }

      if (removeBtn) {
        row.remove()
        if (!list.querySelector('.option-line-row')) {
          list.appendChild(createOptionLineRow(''))
        }
        syncOptionLineEditor(editor)
      }
    })

    list.addEventListener('input', () => syncOptionLineEditor(editor))
    syncOptionLineEditor(editor)
  })
}

function renderOptionsPage() {
  const canEdit = canManageOptions()

  return `
    <div class="page-toolbar">
      <div>
        <h3>選項管理</h3>
        <p class="muted">每個選項一行，可新增、刪除與調整順序；修改後按「儲存變更」。</p>
      </div>
      <div class="toolbar-actions">
        <button type="submit" form="optionManagementForm" class="primary-btn" ${canEdit ? '' : 'disabled'}>儲存變更</button>
        <button class="secondary-btn" id="resetOptionManagementBtn" ${canEdit ? '' : 'disabled'}>還原預設</button>
        <button class="secondary-btn" id="refreshBtn">重新整理</button>
      </div>
    </div>

    ${!canEdit ? '<div class="notice">目前只有管理員可以調整選項。</div>' : ''}
    ${renderAppSettingSyncNotice()}
    <div class="notice option-page-notice">可直接修改、新增、刪除或調整順序；儲存後會同步到共用設定。</div>

    <form id="optionManagementForm" class="option-management-form">
      <section class="option-group-card">
        <div class="option-group-head">
          <h4>人員 / 帳號相關</h4>
          <p>管理新增 / 修改人員時使用的部門與職務選項；可新增、刪除，並用上移 / 下移調整順序。</p>
        </div>
        <div class="option-group-body">
          ${optionTextarea('部門選項', 'userManageDepartments', optionLinesValue('userManageDepartments', userManageDefaultDepartments), '每行一個部門，順序會套用在人員新增 / 修改下拉選單', '例如：營運二部')}
          ${optionTextarea('職務選項', 'userManagePositions', optionLinesValue('userManagePositions', userManageDefaultPositions), '每行一個職務，請勿填角色權限；管理員 / 主管等請放在角色欄位', '例如：副理')}
        </div>
      </section>

      <section class="option-group-card">
        <div class="option-group-head">
          <h4>行程表單相關</h4>
          <p>管理服務行程、待辦事項與一般行程會用到的選項。</p>
        </div>
        <div class="option-group-body">
          ${optionTextarea('服務行程類型', 'serviceScheduleTypes', optionLinesValue('serviceScheduleTypes', serviceScheduleTypes), '可新增或修改服務行程類型', '例如：醫療')}
          ${scheduleTemplateEditor()}
          ${optionTextarea('待辦項目', 'todoItems', optionLinesValue('todoItems', todoItems), '每行一個待辦項目', '例如：送件')}
          ${optionTextarea('請假 / 會議 / 活動 / 外訓類別細項', 'leaveMeetingTypes', optionLinesValue('leaveMeetingTypes', leaveMeetingTypes), '每行一個類別細項', '例如：請假')}
          ${optionTextarea('公務車資訊', 'carOptions', optionLinesValue('carOptions', carOptions), '每行一台車；建議格式：車號｜使用者 / 開始日期', '例如：RDG-7626｜賴黃娟 113/12/09開始用')}
        </div>
      </section>

      <section class="option-group-card">
        <div class="option-group-head">
          <h4>外務 / 會議室 / 異況</h4>
          <p>管理外務與會議室、異況追蹤會使用到的選項。</p>
        </div>
        <div class="option-group-body">
          ${optionTextarea('外務目的', 'fieldPurposeOptions', optionLinesValue('fieldPurposeOptions', fieldPurposeOptions), '用於外務新增 / 修改', '例如：送件')}
          ${optionTextarea('外務特殊提醒', 'fieldSpecialReminderOptions', optionLinesValue('fieldSpecialReminderOptions', fieldSpecialReminderOptions), '每行一個特殊提醒', '例如：急件')}
          ${optionTextarea('外務地點與地址', 'fieldLocationOptions', locationLinesValue(), '格式：地點名稱｜地址', '例如：內湖_印辦｜台北市內湖區瑞光路550號2樓')}
          ${optionTextarea('異況類型', 'incidentTypeOptions', optionLinesValue('incidentTypeOptions', incidentTypeOptions), '每行一個異況類型', '例如：醫療異況')}
          ${optionTextarea('異況緊急程度', 'incidentUrgencyOptions', optionLinesValue('incidentUrgencyOptions', incidentUrgencyOptions), '每行一個緊急程度，可新增或修改', '例如：緊急')}
          ${optionTextarea('會議室', 'meetingRoomOptions', optionLinesValue('meetingRoomOptions', meetingRoomOptions), '每行一個會議室名稱', '例如：第一會議室')}
        </div>
      </section>

      <div class="option-form-actions">
        <div class="option-action-tip">修改完直接按「儲存變更」即可生效。</div>
        <button type="submit" class="primary-btn" ${canEdit ? '' : 'disabled'}>儲存變更</button>
      </div>
    </form>
  `
}
/* FOR-e V002-1O-1 END - options management */



/* FOR-e V002-1P-6 START - color settings page */
/*
  V002-1P-6｜顏色設定頁
  - 顏色設定正式頁面
  - 依類型設定行程卡片底色
  - 套用於個人行程、行程總覽、外務週曆、會議室卡片
  - 不改 SQL，先使用 localStorage
*/

const scheduleColorStorageKey = 'for-e-schedule-color-settings-v002'

function getScheduleColorDefinitions() {
  return [
    { key: '服務行程', label: '服務行程', defaultColor: '#ffffff' },
    { key: '一般記事', label: '一般記事', defaultColor: '#AEE2FF' },
    { key: '待辦事項', label: '待辦事項', defaultColor: '#CCD3CA' },
    { key: '請假 / 會議 / 活動 / 外訓', label: '請假 / 會議 / 活動 / 外訓', defaultColor: '#B5BAFF' },
    { key: '證件交付', label: '證件交付', defaultColor: '#EED3D9' },
    { key: '外務行程', label: '外務行程', defaultColor: '#FFDBB6' },
    { key: '異況追蹤', label: '異況追蹤', defaultColor: '#FF6A1C' },
    { key: '會議室預約', label: '會議室預約', defaultColor: '#DFD3C3' },
    { key: '追蹤事項', label: '追蹤事項', defaultColor: '#FFF57E' },
    { key: '提醒事項', label: '提醒事項', defaultColor: '#FF8383' }
  ]
}

function getScheduleColorSettings() {
  try {
    const localSaved = readLocalJsonSetting(scheduleColorStorageKey)
    const remoteSaved = hasSharedSetting('schedule_colors')
      ? normalizeSettingValue(appSettings.schedule_colors)
      : null

    const saved = remoteSaved || localSaved

    if (saved['提醒事項'] === '#EED3D9') {
      saved['提醒事項'] = '#FF8383'
      localStorage.setItem(scheduleColorStorageKey, JSON.stringify(saved))
      if (remoteSaved) saveAppSetting('schedule_colors', saved)
    }

    return {
      ...getDefaultScheduleColorMap(),
      ...saved
    }
  } catch (err) {
    console.warn('顏色設定讀取失敗', err)
    return getDefaultScheduleColorMap()
  }
}

function saveScheduleColorSettings(value) {
  const nextSettings = normalizeSettingValue(value)
  appSettings.schedule_colors = nextSettings
  localStorage.setItem(scheduleColorStorageKey, JSON.stringify(nextSettings))
  return saveAppSetting('schedule_colors', nextSettings)
}

function resetScheduleColorSettings() {
  const defaults = getDefaultScheduleColorMap()
  appSettings.schedule_colors = defaults
  localStorage.removeItem(scheduleColorStorageKey)
  return saveAppSetting('schedule_colors', defaults)
}

function getScheduleColorKey(row) {
  if (!row) return '服務行程'
  if (typeof isMeetingRoomSchedule === 'function' && isMeetingRoomSchedule(row)) return '會議室預約'
  if (typeof isFieldScheduleRow === 'function' && isFieldScheduleRow(row)) return '外務行程'
  if (typeof isIncidentSchedule === 'function' && isIncidentSchedule(row)) return '異況追蹤'

  const note = String(row.sub_type_note || '')
  if (note.includes('追蹤') || row.schedule_type === '追蹤事項') return '追蹤事項'
  if (String(row.schedule_type || '').includes('提醒')) return '提醒事項'

  return row.category || row.schedule_type || '服務行程'
}

function getScheduleColor(row) {
  const settings = getScheduleColorSettings()
  const key = getScheduleColorKey(row)
  return settings[key] || '#ffffff'
}

function getReadableTextColor(backgroundColor) {
  const hex = String(backgroundColor || '').replace('#', '')
  if (hex.length !== 6) return '#111827'
  const r = parseInt(hex.slice(0, 2), 16)
  const g = parseInt(hex.slice(2, 4), 16)
  const b = parseInt(hex.slice(4, 6), 16)
  const yiq = (r * 299 + g * 587 + b * 114) / 1000
  return yiq >= 145 ? '#111827' : '#ffffff'
}

function getScheduleColorInlineStyle(row) {
  const colorKey = getScheduleColorKey(row)
  const accentColor = colorKey === '會議室預約' ? '#DFD3C3' : getScheduleColor(row)
  return `background:#ffffff;border:2px solid ${accentColor};--schedule-accent:${accentColor};`
}

function renderColorPreviewCard(item, color) {
  const previewColor = item.key === '會議室預約' ? '#DFD3C3' : color
  return `
    <div class="color-preview-card" style="background:#ffffff;border:2px solid ${previewColor};--schedule-accent:${previewColor};">
      <strong>${escapeHtml(item.label)}</strong>
      <span>白底＋外框色</span>
    </div>
  `
}


/* FOR-e V002-1P-9 START - line notification page */
/*
  V002-1P-9｜LINE 通知頁
  - 產生今日行程、逾期任務、待確認 / 待通知、外務、會議室 LINE 文字
  - 支援複製與 LINE 分享
  - 不改 SQL、不串 LINE Notify API
*/

function getLineNotifyTypeOptions() {
  const types = ['今日行程', '任務逾期', '待確認 / 待通知', '今日外務', '今日會議室']
  return types.map(type => `<option value="${escapeHtml(type)}" ${lineNotifyState.type === type ? 'selected' : ''}>${escapeHtml(type)}</option>`).join('')
}

function getLineNotifyTargetOptions() {
  const options = [
    { value: '自己', label: `自己｜${currentProfile?.name || currentProfile?.email || ''}` }
  ]

  if (canLineNotifyAll()) {
    options.push({ value: '全部', label: '全部人員' })

    staffList
      .filter(staff => staff.status !== '停用')
      .forEach(staff => {
        options.push({
          value: `staff:${staff.staff_id}`,
          label: `${staff.name}｜${staff.department_name || ''}`
        })
      })
  }

  return options.map(item => `
    <option value="${escapeHtml(item.value)}" ${lineNotifyState.target === item.value ? 'selected' : ''}>${escapeHtml(item.label)}</option>
  `).join('')
}

function isLineNotifyTargetStaff(row, staffId) {
  if (!row || !staffId) return false
  const assigneeIds = getAssigneeIds(row)
  return assigneeIds.includes(staffId) || row.creator_staff_id === staffId
}

function getLineNotifyTargetStaffId() {
  const target = lineNotifyState.target || '自己'
  if (target === '自己') return currentProfile?.staff_id || ''
  if (target.startsWith('staff:')) return target.replace('staff:', '')
  return ''
}

function getLineNotifyTargetText() {
  const target = lineNotifyState.target || '自己'
  if (target === '全部') return '全部人員'
  if (target === '自己') return currentProfile?.name || currentProfile?.email || '自己'

  if (target.startsWith('staff:')) {
    const staffId = target.replace('staff:', '')
    const staff = staffList.find(item => item.staff_id === staffId) || (typeof allStaffList !== 'undefined' ? allStaffList.find(item => item.staff_id === staffId) : null)
    return staff ? `${staff.name}｜${staff.department_name || ''}` : '指定人員'
  }

  return '自己'
}

function getLineNotifyBaseRows() {
  let rows = schedules.filter(isVisibleSchedule).filter(row => row.status !== '取消')
  const target = lineNotifyState.target || '自己'

  if (!canLineNotifyAll()) {
    return rows.filter(isMine)
  }

  if (target === '全部') return rows

  const targetStaffId = getLineNotifyTargetStaffId()
  return targetStaffId ? rows.filter(row => isLineNotifyTargetStaff(row, targetStaffId)) : rows.filter(isMine)
}

function getLineNotifyRows() {
  const today = todayString()
  const rows = getLineNotifyBaseRows()

  if (lineNotifyState.type === '今日行程') {
    return rows
      .filter(row => scheduleMatchesDateByMode(row, today))
      .sort((a, b) => String(formatTime(a)).localeCompare(String(formatTime(b))))
  }

  if (lineNotifyState.type === '任務逾期') {
    return rows
      .filter(row => isOverdueSchedule(row))
      .sort((a, b) => String(a.start_date || '').localeCompare(String(b.start_date || '')))
  }

  if (lineNotifyState.type === '待確認 / 待通知') {
    return rows
      .filter(row => isReminderSchedule(row))
      .filter(row => row.status !== '已完成')
      .sort((a, b) => String(a.start_date || '').localeCompare(String(b.start_date || '')))
  }

  if (lineNotifyState.type === '今日外務') {
    return rows
      .filter(row => isFieldScheduleRow(row))
      .filter(row => scheduleMatchesDateByMode(row, today))
      .sort((a, b) => String(formatTime(a)).localeCompare(String(formatTime(b))))
  }

  if (lineNotifyState.type === '今日會議室') {
    return rows
      .filter(row => isMeetingRoomSchedule(row))
      .filter(row => scheduleMatchesDateByMode(row, today))
      .sort((a, b) => String(formatTime(a)).localeCompare(String(formatTime(b))))
  }

  return []
}

function formatLineScheduleItem(row, index) {
  const parts = [
    `${index + 1}. ${row.start_date || '-'} ${formatTime(row)}`,
    `${row.schedule_type || row.category || '行程'}｜${row.title || '-'}`,
    `執行者：${getAssigneeNames(row) || '-'}`,
    row.customer_name ? `客戶 / 區域：${row.customer_name}` : '',
    row.location_name ? `地點：${row.location_name}` : '',
    `狀態：${getScheduleStatusLabel(row)}`
  ].filter(Boolean)

  return parts.join('\n')
}

function buildLineNotifyMessage(rows) {
  const today = todayString()
  const targetText = getLineNotifyTargetText()
  const title = `FOR-e｜${lineNotifyState.type}通知`
  const subtitle = `${today}｜對象：${targetText}`

  if (!rows.length) {
    return `${title}\n${subtitle}\n\n目前沒有需要通知的資料。`
  }

  return [
    title,
    subtitle,
    `共 ${rows.length} 筆`,
    '',
    rows.map(formatLineScheduleItem).join('\n\n')
  ].join('\n')
}

function renderLineNotifySummary(rows) {
  const overdueCount = rows.filter(isOverdueSchedule).length
  const today = todayString()
  const todayCount = rows.filter(row => scheduleMatchesDateByMode(row, today)).length

  return `
    <div class="summary-grid line-summary-grid">
      <div class="summary-card">
        <strong>${rows.length}</strong>
        <span>通知筆數</span>
      </div>
      <div class="summary-card">
        <strong>${todayCount}</strong>
        <span>今日行程</span>
      </div>
      <div class="summary-card ${overdueCount ? 'is-alert' : ''}">
        <strong>${overdueCount}</strong>
        <span>逾期</span>
      </div>
    </div>
  `
}

function renderLineNotificationPage() {
  const rows = getLineNotifyRows()
  const message = buildLineNotifyMessage(rows)

  return `
    <div class="page-toolbar">
      <div>
        <h3>LINE 通知</h3>
        <p class="muted">先產生可複製的 LINE 文字。正式自動推播可在下一階段串 Webhook / LINE Messaging API。</p>
      </div>
      <div class="toolbar-actions">
        <button class="secondary-btn" id="refreshBtn">重新整理</button>
      </div>
    </div>

    <div class="notice">
      目前是「手動產生訊息」版本：確認內容後可複製貼到 LINE，或用 LINE 分享開啟。
    </div>

    <form id="lineNotifyForm" class="line-notify-panel">
      <label>
        通知類型
        <select name="type">${getLineNotifyTypeOptions()}</select>
      </label>

      <label>
        通知對象
        <select name="target">${getLineNotifyTargetOptions()}</select>
      </label>

      <button type="submit" class="primary-btn">產生訊息</button>
    </form>

    ${renderLineNotifySummary(rows)}

    <section class="line-message-card">
      <div class="line-message-head">
        <div>
          <strong>LINE 訊息內容</strong>
          <span>可直接複製貼到 LINE 群組或個人聊天室</span>
        </div>
        <div class="line-message-actions">
          <button type="button" class="secondary-btn" id="copyLineMessageBtn">複製文字</button>
          <button type="button" class="primary-btn" id="openLineShareBtn">LINE 分享</button>
        </div>
      </div>

      <textarea id="lineMessageText" readonly>${escapeHtml(message)}</textarea>
    </section>

    <section class="line-preview-list">
      <div class="section-title-row">
        <h4>通知資料預覽</h4>
        <span>${rows.length} 筆</span>
      </div>
      ${renderScheduleList(rows, '目前沒有符合條件的通知資料。', true)}
    </section>
  `
}


function renderColorSettingsPage() {
  const canEdit = canManageColorSettings()
  const settings = getScheduleColorSettings()

  return `
    <div class="page-toolbar">
      <div>
        <h3>顏色設定</h3>
        <p class="muted">行程卡片背景維持白色，顏色用外框標示。設定會優先同步到 Supabase 共用設定。</p>
      </div>
      <div class="toolbar-actions">
        <button type="submit" form="colorSettingsForm" class="primary-btn" ${canEdit ? '' : 'disabled'}>儲存顏色</button>
        <button class="secondary-btn" id="resetColorSettingsBtn" ${canEdit ? '' : 'disabled'}>還原預設</button>
        <button class="secondary-btn" id="refreshBtn">重新整理</button>
      </div>
    </div>

    ${!canEdit ? '<div class="notice">目前只有管理員、主管、行政可以調整顏色。</div>' : ''}
    ${renderAppSettingSyncNotice()}
    <div class="notice">目前設定的是卡片外框色，會套用在個人行程表、行程總覽、外務行程與會議室預約。</div>

    <form id="colorSettingsForm" class="color-settings-grid color-settings-grid-clean">
      <div class="color-settings-header">
        <span>行程類型</span>
        <span>顏色</span>
        <span>色碼</span>
        <span>預覽</span>
      </div>

      ${getScheduleColorDefinitions().map(item => {
        const color = settings[item.key] || item.defaultColor
        return `
          <section class="color-setting-row color-setting-row-clean">
            <div class="color-item-name">${escapeHtml(item.label)}</div>
            <label class="color-picker-cell" title="${escapeHtml(item.label)}">
              <input type="color" name="color_${item.key}" value="${escapeHtml(color)}" ${canEdit ? '' : 'disabled'}>
            </label>
            <input class="color-code-input" value="${escapeHtml(color)}" readonly>
            ${renderColorPreviewCard(item, color)}
          </section>
        `
      }).join('')}
    </form>
  `
}



/* FOR-e V002-1P-11 START - common csv export */
/*
  V002-1P-11｜共通匯出 CSV
  - 依目前頁面匯出目前篩選 / 目前週次的資料
  - 不改 SQL
*/

const exportablePageKeys = new Set([
  'personalSchedule',
  'personalTodo',
  'assignedTracking',
  'scheduleOverview',
  'fieldSchedule',
  'fieldDetail',
  'meetingRoom',
  'incident',
  'search',
  'stats',
  'serviceRecord',
  'recordSubmit',
  'audit',
  'users',
  'line'
])

function canExportCurrentPage() {
  if (!exportablePageKeys.has(currentPage)) return false
  if (currentPage === 'users') return currentProfile?.role === '管理員'
  return true
}

function injectExportCsvButton() {
  if (!canExportCurrentPage()) return
  if (window.matchMedia && window.matchMedia('(max-width: 768px)').matches) return

  const toolbar = document.querySelector('.content-card .page-toolbar .toolbar-actions')
  if (!toolbar || document.querySelector('#exportCsvBtn')) return

  const button = document.createElement('button')
  button.type = 'button'
  button.id = 'exportCsvBtn'
  button.className = 'secondary-btn export-csv-btn'
  button.textContent = '匯出CSV'

  const refreshBtn = toolbar.querySelector('#refreshBtn')
  if (refreshBtn) toolbar.insertBefore(button, refreshBtn)
  else toolbar.appendChild(button)
}

function csvSafe(value) {
  const text = value === null || value === undefined ? '' : String(value)
  return `"${text.replaceAll('"', '""').replace(/\r?\n/g, ' ')}"`
}

function downloadCsv(filename, columns, rows) {
  const header = columns.map(col => csvSafe(col.header)).join(',')
  const body = rows.map(row => columns.map(col => csvSafe(typeof col.value === 'function' ? col.value(row) : row[col.value])).join(',')).join('\n')
  const csv = '\ufeff' + [header, body].filter(Boolean).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

function uniqueScheduleRows(rows) {
  const map = new Map()
  rows.forEach(row => {
    if (row?.schedule_id && !map.has(row.schedule_id)) map.set(row.schedule_id, row)
  })
  return [...map.values()]
}

function getCurrentWeekScheduleOverviewRows() {
  const weekDates = getWeekDates(overviewWeekOffset)
  const rows = []
  getOverviewStaffRows().forEach(staff => {
    weekDates.forEach(date => {
      rows.push(...getSchedulesForStaffDate(staff.staff_id, toDateKey(date)))
    })
  })
  return uniqueScheduleRows(rows)
}

function getCurrentFieldWeekExportRows() {
  const weekDates = getWeekDates(fieldWeekOffset)
  const rows = []
  getFieldStaffRows().forEach(staff => {
    weekDates.forEach(date => {
      rows.push(...getFieldSchedulesForStaffDate(staff.staff_id, toDateKey(date)))
    })
  })
  return uniqueScheduleRows(rows)
}

function getCurrentMeetingWeekExportRows() {
  const weekDates = getWeekDates(meetingWeekOffset)
  const rows = []
  getManagedListOption('meetingRoomOptions', meetingRoomOptions).forEach(room => {
    weekDates.forEach(date => {
      rows.push(...getMeetingSchedulesForRoomDate(room, toDateKey(date)))
    })
  })
  return uniqueScheduleRows(rows)
}

function getExportSchedulesForCurrentPage() {
  const todoCategories = ['一般記事', '待辦事項', '請假 / 會議 / 活動 / 外訓', '證件交付']

  if (currentPage === 'personalSchedule') {
    return schedules.filter(row => isActivePersonalSchedule(row) && isMine(row))
  }

  if (currentPage === 'personalTodo') {
    return schedules.filter(row => isActivePersonalSchedule(row) && isMine(row) && todoCategories.includes(row.category))
  }

  if (currentPage === 'assignedTracking') return getAssignedTrackingRows()
  if (currentPage === 'scheduleOverview') return getCurrentWeekScheduleOverviewRows()
  if (currentPage === 'fieldSchedule') return getCurrentFieldWeekExportRows()
  if (currentPage === 'fieldDetail') return getFieldDetailRows()
  if (currentPage === 'meetingRoom') return getCurrentMeetingWeekExportRows()
  if (currentPage === 'incident') return getIncidentRows()
  if (currentPage === 'search') return getSearchResults()
  if (currentPage === 'stats') return getStatsFilteredSchedules()
  if (currentPage === 'line') return getLineNotifyRows()

  return []
}

function getScheduleCsvColumns() {
  return [
    { header: '日期', value: row => row.start_date || '' },
    { header: '結束日期', value: row => row.end_date || row.start_date || '' },
    { header: '時間', value: row => formatTime(row) },
    { header: '類別', value: row => row.category || '' },
    { header: '行程類型', value: row => row.schedule_type || '' },
    { header: '附加 / 細項', value: row => row.sub_type || '' },
    { header: '標題 / 辦理內容', value: row => row.title || '' },
    { header: '內容', value: row => row.description || '' },
    { header: '區域 / 客戶', value: row => row.customer_name || '' },
    { header: '地點', value: row => row.location_name || '' },
    { header: '地址', value: row => row.address || '' },
    { header: '執行者', value: row => getAssigneeNames(row) },
    { header: '指派者', value: row => row.creator_name || '' },
    { header: '狀態', value: row => getScheduleStatusLabel(row) },
    { header: '服務紀錄單', value: row => row.need_service_record ? (row.service_record_submitted_date ? `已繳交 ${row.service_record_submitted_date}` : '未繳交') : '不需繳交' },
    { header: '備註 / 提醒', value: row => row.sub_type_note || '' }
  ]
}

function getServiceRecordCsvRows() {
  return serviceRecords.filter(record => matchesServiceRecordFilters(record, currentPage === 'recordSubmit'))
}

function getServiceRecordCsvColumns() {
  return [
    { header: '行程日期', value: record => record.schedule_date || '' },
    { header: '狀態', value: record => getServiceRecordStatus(record) },
    { header: '行程類型', value: record => getServiceRecordScheduleType(record) },
    { header: '標題', value: record => getServiceRecordTitle(record) },
    { header: '執行者', value: record => getServiceRecordExecutor(record) },
    { header: '繳交人', value: record => record.staff_name || '' },
    { header: '部門', value: record => getServiceRecordDepartment(record) },
    { header: '地點', value: record => getServiceRecordLocation(record) },
    { header: '繳交日期', value: record => record.submitted_date || '' }
  ]
}

function getAuditCsvRows() {
  return auditLogs.filter(row => matchesAuditFilters(row))
}

function getAuditCsvColumns() {
  return [
    { header: '時間', value: row => formatDateTime(row.created_at) },
    { header: '動作類型', value: row => row.action_type || '' },
    { header: '操作人', value: row => row.operated_by_name || '' },
    { header: '來源類型', value: row => row.source_type || '' },
    { header: '異動行程', value: row => getAuditSourceLabel(row) },
    { header: '備註', value: row => row.note || '' }
  ]
}

function getUserCsvRows() {
  const sourceRows = typeof allStaffList !== 'undefined' && allStaffList.length ? allStaffList : staffList
  return sourceRows.filter(staff => !isStaffDeleted(staff)).filter(matchesUserAccountFilters)
}

function getUserCsvColumns() {
  return [
    { header: '人員名稱', value: row => row.name || '' },
    { header: '部門', value: row => row.department_name || '' },
    { header: '職務', value: row => row.position || '' },
    { header: '角色', value: row => row.role || '' },
    { header: '登入帳號', value: row => getStaffLoginEmail(row) || '' },
    { header: '帳號狀態', value: row => getStaffLoginStatus(row) },
    { header: '是否外務人員', value: row => isStaffFieldWorker(row) ? '是' : '否' },
    { header: '狀態', value: row => getStaffDisplayStatus(row) },
    { header: '顯示順序', value: row => row.display_order || '' }
  ]
}

function getExportPageLabel() {
  return getPageTitle().replace(/[\\/:*?"<>|]/g, '')
}


function getExportYearOptions() {
  const years = new Set()
  schedules.forEach(row => {
    const value = String(row.start_date || row.schedule_date || row.created_at || '')
    if (/^\d{4}/.test(value)) years.add(value.slice(0, 4))
  })
  serviceRecords.forEach(row => {
    const value = String(row.schedule_date || row.submitted_date || row.created_at || '')
    if (/^\d{4}/.test(value)) years.add(value.slice(0, 4))
  })
  auditLogs.forEach(row => {
    const value = String(row.created_at || '')
    if (/^\d{4}/.test(value)) years.add(value.slice(0, 4))
  })

  const currentYear = todayString().slice(0, 4)
  years.add(currentYear)

  return `<option value="">全部年份</option>` + [...years].sort((a, b) => b.localeCompare(a)).map(year => `
    <option value="${year}">${year}</option>
  `).join('')
}

function getExportMonthOptions() {
  return `<option value="">全部月份</option>` + Array.from({ length: 12 }, (_, index) => {
    const value = String(index + 1).padStart(2, '0')
    return `<option value="${value}">${value} 月</option>`
  }).join('')
}

function getExportDayOptions() {
  return `<option value="">全部日期</option>` + Array.from({ length: 31 }, (_, index) => {
    const value = String(index + 1).padStart(2, '0')
    return `<option value="${value}">${value} 日</option>`
  }).join('')
}

function getExportDepartmentOptions() {
  const sourceRows = typeof allStaffList !== 'undefined' && allStaffList.length ? allStaffList : staffList
  const names = [...new Set(sourceRows.map(staff => staff.department_name).filter(Boolean))]
  return `<option value="">全部部門</option>` + names.map(name => `
    <option value="${escapeHtml(name)}">${escapeHtml(name)}</option>
  `).join('')
}

function getExportStaffOptions() {
  const sourceRows = typeof allStaffList !== 'undefined' && allStaffList.length ? allStaffList : staffList
  return `<option value="">全部人員</option>` + sourceRows.map(staff => `
    <option value="${escapeHtml(staff.staff_id)}">${escapeHtml(staff.name)}｜${escapeHtml(staff.department_name || '')}</option>
  `).join('')
}

function openExportCsvModal() {
  if (window.matchMedia && window.matchMedia('(max-width: 768px)').matches) return

  const modal = document.createElement('div')
  modal.className = 'modal-backdrop'
  modal.innerHTML = `
    <div class="modal-panel export-csv-modal">
      <div class="modal-header">
        <h3>匯出 CSV</h3>
        <button class="icon-btn" id="closeExportCsvModalBtn" type="button">×</button>
      </div>

      <form id="exportCsvForm" class="export-csv-form">
        <div class="export-filter-section">
          <strong>日期條件</strong>
          <div class="export-filter-grid">
            <label>
              年份
              <select name="year">${getExportYearOptions()}</select>
            </label>

            <label>
              月份
              <select name="month">${getExportMonthOptions()}</select>
            </label>

            <label>
              日期
              <select name="day">${getExportDayOptions()}</select>
            </label>
          </div>
        </div>

        <div class="export-filter-section">
          <strong>部門 / 人員</strong>
          <div class="export-filter-grid">
            <label>
              部門
              <select name="department">${getExportDepartmentOptions()}</select>
            </label>

            <label>
              人員
              <select name="staff_id">${getExportStaffOptions()}</select>
            </label>
          </div>
        </div>

        <div class="notice">
          空白代表不限制。可只選年份、年份＋月份，或完整選到年月日；部門與人員可單獨或一起篩選。
        </div>

        <div class="modal-actions">
          <button type="button" class="secondary-btn" id="cancelExportCsvModalBtn">取消</button>
          <button type="submit" class="primary-btn">匯出CSV</button>
        </div>
      </form>
    </div>
  `

  document.body.appendChild(modal)

  document.querySelector('#closeExportCsvModalBtn').addEventListener('click', () => modal.remove())
  document.querySelector('#cancelExportCsvModalBtn').addEventListener('click', () => modal.remove())
  document.querySelector('#exportCsvForm').addEventListener('submit', event => {
    event.preventDefault()
    const form = new FormData(event.target)
    const options = {
      year: form.get('year') || '',
      month: form.get('month') || '',
      day: form.get('day') || '',
      department: form.get('department') || '',
      staffId: form.get('staff_id') || ''
    }
    modal.remove()
    exportCurrentPageCsv(options)
  })
}

function getExportRowDateValue(row) {
  if (!row) return ''
  if (row.start_date) return row.start_date
  if (row.schedule_date) return row.schedule_date
  if (row.submitted_date) return row.submitted_date
  if (row.created_at) return String(row.created_at).slice(0, 10)
  return ''
}

function getExportRowStaffIds(row) {
  const ids = new Set()

  if (row?.staff_id) ids.add(row.staff_id)
  if (row?.creator_staff_id) ids.add(row.creator_staff_id)
  if (row?.operated_by_staff_id) ids.add(row.operated_by_staff_id)
  if (row?.schedule_assignees) {
    getAssigneeIds(row).forEach(id => ids.add(id))
  }

  return [...ids].filter(Boolean)
}

function getExportStaffRowById(staffId) {
  const sourceRows = typeof allStaffList !== 'undefined' && allStaffList.length ? allStaffList : staffList
  return sourceRows.find(staff => staff.staff_id === staffId)
}

function getExportRowDepartmentNames(row) {
  const names = new Set()

  if (row?.department_name) names.add(row.department_name)
  if (typeof getServiceRecordDepartment === 'function') {
    const recordDept = getServiceRecordDepartment(row)
    if (recordDept) names.add(recordDept)
  }

  getExportRowStaffIds(row).forEach(staffId => {
    const staff = getExportStaffRowById(staffId)
    if (staff?.department_name) names.add(staff.department_name)
  })

  return [...names].filter(Boolean)
}

function getExportRowStaffNames(row) {
  const names = new Set()

  if (row?.name && currentPage === 'users') names.add(row.name)
  if (row?.staff_name) names.add(row.staff_name)
  if (row?.operated_by_name) names.add(row.operated_by_name)
  if (row?.creator_name) names.add(row.creator_name)
  if (row?.schedule_assignees) {
    row.schedule_assignees
      .filter(item => !item.deleted_at)
      .map(item => item.staff_name)
      .filter(Boolean)
      .forEach(name => names.add(name))
  }

  getExportRowStaffIds(row).forEach(staffId => {
    const staff = getExportStaffRowById(staffId)
    if (staff?.name) names.add(staff.name)
  })

  return [...names].filter(Boolean)
}

function matchesExportDateFilter(row, options) {
  if (!options?.year && !options?.month && !options?.day) return true

  const value = getExportRowDateValue(row)
  if (!/^\d{4}-\d{2}-\d{2}/.test(value)) return false

  if (options.year && value.slice(0, 4) !== options.year) return false
  if (options.month && value.slice(5, 7) !== options.month) return false
  if (options.day && value.slice(8, 10) !== options.day) return false

  return true
}

function matchesExportDepartmentFilter(row, options) {
  if (!options?.department) return true
  return getExportRowDepartmentNames(row).includes(options.department)
}

function matchesExportStaffFilter(row, options) {
  if (!options?.staffId) return true
  const staffIds = getExportRowStaffIds(row)
  if (staffIds.includes(options.staffId)) return true

  const staff = getExportStaffRowById(options.staffId)
  if (!staff?.name) return false
  return getExportRowStaffNames(row).includes(staff.name)
}

function applyExportCsvFilters(rows, options) {
  if (!options) return rows

  return rows
    .filter(row => matchesExportDateFilter(row, options))
    .filter(row => matchesExportDepartmentFilter(row, options))
    .filter(row => matchesExportStaffFilter(row, options))
}

function getExportFilterFilenameSuffix(options) {
  if (!options) return todayString()

  const dateParts = [
    options.year || '全部年份',
    options.month ? `${options.month}月` : '',
    options.day ? `${options.day}日` : ''
  ].filter(Boolean)

  const scopeParts = [
    options.department || '',
    options.staffId ? (getExportStaffRowById(options.staffId)?.name || '指定人員') : ''
  ].filter(Boolean)

  return [...dateParts, ...scopeParts].join('_') || todayString()
}


function exportCurrentPageCsv(filterOptions = null) {
  let rows = []
  let columns = []
  const date = todayString()
  const pageLabel = getExportPageLabel()

  if (currentPage === 'serviceRecord' || currentPage === 'recordSubmit') {
    rows = getServiceRecordCsvRows()
    columns = getServiceRecordCsvColumns()
  } else if (currentPage === 'audit') {
    rows = getAuditCsvRows()
    columns = getAuditCsvColumns()
  } else if (currentPage === 'users') {
    rows = getUserCsvRows()
    columns = getUserCsvColumns()
  } else {
    rows = getExportSchedulesForCurrentPage()
    columns = getScheduleCsvColumns()
  }

  rows = applyExportCsvFilters(rows, filterOptions)

  if (!rows.length) {
    alert('目前沒有符合匯出條件的資料。')
    return
  }

  const suffix = getExportFilterFilenameSuffix(filterOptions)
  downloadCsv(`FOR-e_${pageLabel}_${suffix || date}.csv`, columns, rows)
}



function getLoginDailyReminderRows() {
  const today = todayString()
  const myRows = schedules.filter(row => isActivePersonalSchedule(row) && isMine(row))

  const todoCategories = ['一般記事', '待辦事項', '請假 / 會議 / 活動 / 外訓', '證件交付']

  return {
    todaySchedules: myRows
      .filter(row => scheduleMatchesDateByMode(row, today))
      .filter(row => row.status !== '已完成' && row.status !== '取消')
      .sort((a, b) => String(formatTime(a)).localeCompare(String(formatTime(b)))),

    todayTodos: myRows
      .filter(row => todoCategories.includes(row.category))
      .filter(row => scheduleMatchesDateByMode(row, today))
      .filter(row => row.status !== '已完成' && row.status !== '取消')
      .sort((a, b) => String(formatTime(a)).localeCompare(String(formatTime(b)))),

    overdueTasks: myRows
      .filter(row => isOverdueSchedule(row))
      .filter(row => !isReminderSchedule(row))
      .sort((a, b) => String(a.start_date || '').localeCompare(String(b.start_date || ''))),

    reminderRows: myRows
      .filter(row => isReminderSchedule(row))
      .filter(row => row.status !== '已完成' && row.status !== '取消')
      .sort((a, b) => String(a.start_date || '').localeCompare(String(b.start_date || '')))
  }
}

function renderLoginReminderItem(row) {
  return `
    <button type="button" class="login-reminder-item" data-login-view-schedule="${row.schedule_id}">
      <div>
        <strong>${escapeHtml(row.schedule_type || row.category)}｜${escapeHtml(row.title || '-')}</strong>
        <span>${escapeHtml(row.start_date || '-')}｜${escapeHtml(formatTime(row))}｜${escapeHtml(getAssigneeNames(row) || '-')}</span>
        ${row.customer_name || row.location_name ? `<span>${escapeHtml(row.customer_name || '')}${row.customer_name && row.location_name ? '｜' : ''}${escapeHtml(row.location_name || '')}</span>` : ''}
      </div>
      <em>${isOverdueSchedule(row) ? '逾期' : '查看'}</em>
    </button>
  `
}

function renderLoginReminderSection(title, rows, emptyText, className = '') {
  return `
    <section class="login-reminder-section ${className}">
      <div class="login-reminder-section-title">
        <strong>${escapeHtml(title)}</strong>
        <span>${rows.length} 筆</span>
      </div>
      <div class="login-reminder-list">
        ${rows.length ? rows.slice(0, 8).map(renderLoginReminderItem).join('') : `<div class="login-reminder-empty">${escapeHtml(emptyText)}</div>`}
        ${rows.length > 8 ? `<div class="login-reminder-more">尚有 ${rows.length - 8} 筆，請到對應頁面查看。</div>` : ''}
      </div>
    </section>
  `
}

function maybeOpenLoginDailyReminder() {
  if (!currentProfile?.staff_id) return

  const key = `for-e-login-reminder-${currentProfile.staff_id}-${todayString()}`
  if (sessionStorage.getItem(key) === 'shown') return

  const groups = getLoginDailyReminderRows()
  const total = groups.todaySchedules.length + groups.todayTodos.length + groups.overdueTasks.length + groups.reminderRows.length

  if (!total) {
    sessionStorage.setItem(key, 'shown')
    return
  }

  setTimeout(() => {
    sessionStorage.setItem(key, 'shown')
    openLoginDailyReminderModal(groups)
  }, 250)
}

function openLoginDailyReminderModal(groups = getLoginDailyReminderRows()) {
  const modal = document.createElement('div')
  modal.className = 'modal-backdrop login-reminder-backdrop'
  modal.innerHTML = `
    <div class="modal-panel login-reminder-modal">
      <div class="modal-header">
        <h3>今日提醒總覽</h3>
        <button class="icon-btn" id="closeLoginReminderBtn" type="button">×</button>
      </div>

      <div class="login-reminder-hello">
        <strong>${escapeHtml(currentProfile?.name || '您好')}</strong>
        <span>${todayString()}｜今日行程、待辦、逾期與待確認事項</span>
      </div>

      <div class="login-reminder-summary">
        <div><strong>${groups.todaySchedules.length}</strong><span>今日行程</span></div>
        <div><strong>${groups.todayTodos.length}</strong><span>今日待辦</span></div>
        <div class="${groups.overdueTasks.length ? 'is-danger' : ''}"><strong>${groups.overdueTasks.length}</strong><span>任務逾期</span></div>
        <div><strong>${groups.reminderRows.length}</strong><span>待確認 / 待通知</span></div>
      </div>

      <div class="login-reminder-body">
        ${renderLoginReminderSection('任務逾期通知', groups.overdueTasks, '目前沒有逾期任務。', 'is-overdue')}
        ${renderLoginReminderSection('待確認 / 待通知提醒', groups.reminderRows, '目前沒有待確認 / 待通知提醒。')}
        ${renderLoginReminderSection('今日待辦提醒', groups.todayTodos, '今天沒有一般待辦。')}
        ${renderLoginReminderSection('今日行程', groups.todaySchedules, '今天沒有待處理行程。')}
      </div>

      <div class="modal-actions">
        <button type="button" class="secondary-btn" id="closeLoginReminderBtn2">今天先關閉</button>
        <button type="button" class="primary-btn" id="goPersonalScheduleBtn">前往個人行程表</button>
      </div>
    </div>
  `

  document.body.appendChild(modal)

  const close = () => modal.remove()
  document.querySelector('#closeLoginReminderBtn').addEventListener('click', close)
  document.querySelector('#closeLoginReminderBtn2').addEventListener('click', close)

  document.querySelector('#goPersonalScheduleBtn').addEventListener('click', () => {
    modal.remove()
    currentPage = 'personalSchedule'
    renderApp()
  })

  modal.querySelectorAll('[data-login-view-schedule]').forEach(btn => {
    btn.addEventListener('click', () => {
      const scheduleId = btn.dataset.loginViewSchedule
      modal.remove()
      openScheduleDetail(scheduleId)
    })
  })
}



function getHealthStatusMeta(status) {
  if (status === 'ok') return { label: '正常', className: 'is-ok' }
  if (status === 'warn') return { label: '注意', className: 'is-warn' }
  return { label: '需處理', className: 'is-bad' }
}

function renderHealthCard(title, status, detail, note = '') {
  const meta = getHealthStatusMeta(status)
  return `
    <div class="health-card ${meta.className}">
      <div class="health-card-head">
        <strong>${escapeHtml(title)}</strong>
        <span>${meta.label}</span>
      </div>
      <p>${escapeHtml(detail)}</p>
      ${note ? `<small>${escapeHtml(note)}</small>` : ''}
    </div>
  `
}

function getHealthRows() {
  const rows = []

  rows.push({
    title: '目前版本',
    status: 'ok',
    detail: SYSTEM_VERSION,
    note: '用於確認前端是否已更新到最新版本。'
  })

  rows.push({
    title: '目前網址',
    status: window.location.hostname.includes('vercel.app') || window.location.hostname === 'localhost' ? 'ok' : 'warn',
    detail: window.location.origin,
    note: window.location.hostname === 'localhost' ? '本機網址；正式信件與重設密碼需使用 Vercel 正式網址。' : '目前瀏覽器所在網址。'
  })

  rows.push({
    title: 'Supabase 環境變數',
    status: SUPABASE_URL && SUPABASE_ANON_KEY ? 'ok' : 'bad',
    detail: SUPABASE_URL && SUPABASE_ANON_KEY ? '已設定 VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY' : '缺少 Supabase URL 或 Anon Key'
  })

  rows.push({
    title: '目前登入者',
    status: currentProfile?.staff_id ? 'ok' : 'warn',
    detail: `${currentProfile?.name || currentProfile?.email || '-'}｜${currentProfile?.role || '-'}｜${currentProfile?.department_name || '-'}`,
    note: currentProfile?.role === '管理員' ? '目前可操作全部管理功能。' : '若需帳號管理，請確認 staff / profiles 角色是否同步。'
  })

  rows.push({
    title: '人員資料 staff',
    status: staffList.length ? 'ok' : 'bad',
    detail: `啟用人員 ${staffList.length} 位｜全部人員 ${allStaffList.length || staffList.length} 位`,
    note: staffList.length ? '人員下拉、行程指派、外務人員可使用。' : '請確認 staff 表 RLS 與資料。'
  })

  rows.push({
    title: '行程資料 schedules',
    status: schedulesError ? 'bad' : 'ok',
    detail: schedulesError ? schedulesError : `已載入 ${schedules.length} 筆行程`,
    note: schedulesError ? '請確認 schedules / schedule_assignees 權限。' : '行程總覽、個人行程、外務、會議室會共用此資料。'
  })

  rows.push({
    title: '服務紀錄單',
    status: serviceRecordsError ? 'bad' : 'ok',
    detail: serviceRecordsError ? serviceRecordsError : `已載入 ${serviceRecords.length} 筆服務紀錄單資料`,
    note: serviceRecordsError ? '請確認 service_records 權限。' : '服務紀錄單頁面與繳交狀態可使用。'
  })

  rows.push({
    title: '異動紀錄',
    status: auditError ? 'bad' : 'ok',
    detail: auditError ? auditError : `已載入 ${auditLogs.length} 筆異動紀錄`,
    note: auditError ? '請確認 audit_logs 權限。' : '新增、修改、取消等紀錄可追蹤。'
  })

  rows.push({
    title: '共用設定 app_settings',
    status: appSettingsError ? 'warn' : 'ok',
    detail: appSettingsError ? `尚未完整啟用共用設定：${appSettingsError}` : '共用設定已可讀取',
    note: appSettingsError ? '可先使用本機暫存；正式上線建議執行 RLS baseline SQL。' : '顏色設定、選項管理、外務人員設定可共用。'
  })

  rows.push({
    title: '公務車資訊',
    status: getManagedListOption('carOptions', carOptions).length > 1 ? 'ok' : 'warn',
    detail: `目前可選 ${getManagedListOption('carOptions', carOptions).length} 筆公務車選項`,
    note: '可到選項管理修改公務車資訊。'
  })

  rows.push({
    title: '角色權限矩陣',
    status: typeof rolePermissionMatrix === 'object' ? 'ok' : 'bad',
    detail: typeof rolePermissionMatrix === 'object' ? '角色權限矩陣已載入' : '角色權限矩陣未載入',
    note: '管理員、主管、行政/海外、翻譯、外務/宿管/會計、一般職員會依角色控管。'
  })

  rows.push({
    title: '帳號綁定狀態',
    status: getAccountBindingStatus(),
    detail: getAccountBindingSummaryText(),
    note: '可用人員 / 帳號頁的「重綁」修正帳號與人員對應。'
  })

  rows.push({
    title: '資料完整性',
    status: getDataIntegrityStatus(),
    detail: getDataIntegritySummaryText(),
    note: '檢查行程日期、指派人員、服務紀錄單與刪除人員關聯。'
  })

  rows.push({
    title: '角色確認進度',
    status: getRoleTestStats().remaining ? 'warn' : 'ok',
    detail: `已完成 ${getRoleTestStats().done}/${getRoleTestStats().total} 個角色`,
    note: '請用各角色帳號實際登入確認可見頁面與操作權限。'
  })

  rows.push({
    title: '我的畫面記憶',
    status: 'ok',
    detail: getMyUiMemorySummary(),
    note: '行程總覽 / 外務行程的篩選記憶會存在本機瀏覽器，可用下方按鈕清除。'
  })

  return rows
}

function renderSystemHealthSummary(rows) {
  const okCount = rows.filter(row => row.status === 'ok').length
  const warnCount = rows.filter(row => row.status === 'warn').length
  const badCount = rows.filter(row => row.status === 'bad').length

  return `
    <div class="summary-grid health-summary-grid">
      <div class="summary-card">
        <strong>${rows.length}</strong>
        <span>檢查項目</span>
      </div>
      <div class="summary-card">
        <strong>${okCount}</strong>
        <span>正常</span>
      </div>
      <div class="summary-card ${warnCount ? 'is-alert' : ''}">
        <strong>${warnCount}</strong>
        <span>注意</span>
      </div>
      <div class="summary-card ${badCount ? 'is-alert' : ''}">
        <strong>${badCount}</strong>
        <span>需處理</span>
      </div>
    </div>
  `
}


function getMyUiMemoryKeys() {
  const owner = currentProfile?.staff_id || currentProfile?.email || 'guest'
  return [
    `for-e-overview-filters-v002-${owner}`,
    `for-e-field-schedule-filters-v002-${owner}`,
    `for-e-login-reminder-${owner}-${todayString()}`
  ]
}

function getMyUiMemorySummary() {
  const keys = getMyUiMemoryKeys()
  const existing = keys.filter(key => localStorage.getItem(key) || sessionStorage.getItem(key))
  return existing.length ? `目前有 ${existing.length} 筆本機畫面記憶` : '目前沒有本機畫面記憶'
}

function clearMyUiMemory() {
  if (!confirm('確定要清除你自己的行程總覽 / 外務行程篩選記憶嗎？\\n\\n這不會刪除任何行程資料。')) return

  getMyUiMemoryKeys().forEach(key => {
    localStorage.removeItem(key)
    sessionStorage.removeItem(key)
  })

  if (typeof overviewFilters !== 'undefined') {
    overviewFilters = {
      departments: [],
      staffIds: [],
      sortBy: 'display_order',
      sortDir: 'asc'
    }
  }

  if (typeof fieldScheduleFilters !== 'undefined') {
    fieldScheduleFilters = {
      departments: [],
      staffIds: [],
      sortBy: 'display_order',
      sortDir: 'asc'
    }
  }

  alert('已清除你的畫面篩選記憶。')
  renderApp()
}

function getSystemHealthReportText() {
  const rows = getHealthRows()
  return [
    'FOR-e 系統檢查報告',
    `版本：${SYSTEM_VERSION}`,
    `時間：${new Date().toLocaleString('zh-TW')}`,
    `登入者：${currentProfile?.name || currentProfile?.email || '-'}`,
    `角色：${currentProfile?.role || '-'}`,
    `上線確認進度：${getLaunchTestStats().done}/${getLaunchTestStats().total}（${getLaunchTestStats().percent}%）`,
    `上線狀態：${getLaunchReadinessState().title}`,
    `驗收狀態：${getFinalAcceptanceState().title}`,
    '',
    ...rows.map(row => {
      const meta = getHealthStatusMeta(row.status)
      return `【${meta.label}】${row.title}：${row.detail}${row.note ? `｜${row.note}` : ''}`
    })
  ].join('\\n')
}

async function copySystemHealthReport() {
  const text = getSystemHealthReportText()

  try {
    await navigator.clipboard.writeText(text)
    alert('系統檢查報告已複製。')
  } catch (err) {
    console.warn(err)
    alert(text)
  }
}


async function runHealthDryRunCheck() {
  if (!currentProfile) {
    alert('請先登入。')
    return
  }

  try {
    const { data: sessionData } = await supabase.auth.getSession()
    const accessToken = sessionData?.session?.access_token

    if (!accessToken) {
      alert('登入狀態已失效，請重新登入。')
      return
    }

    const response = await fetch(`${SUPABASE_URL}/functions/v1/admin-create-user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      },
      body: JSON.stringify({ dry_run: true })
    })

    const result = await response.json().catch(() => ({}))

    if (!response.ok) {
      throw new Error(result.error || `HTTP ${response.status}`)
    }

    alert(`帳號 Edge Function 正常。\n版本：${result.version || '-'}\n狀態：${result.message || 'ok'}`)
  } catch (err) {
    console.error(err)
    alert(`帳號 Edge Function 檢查失敗：${err.message || err}`)
  }
}


function getRolePermissionTestItems() {
  return [
    ['manageAllSchedules', '管理全部行程'],
    ['createServiceSchedule', '新增服務行程'],
    ['createFieldSchedule', '新增外務行程'],
    ['createMeetingRoom', '預約會議室'],
    ['createIncident', '新增異況'],
    ['assignAllStaff', '可指派全部人員'],
    ['manageUsers', '人員 / 帳號管理'],
    ['manageOptions', '選項管理'],
    ['manageColor', '顏色設定'],
    ['exportData', '匯出資料'],
    ['viewStats', '統計報表'],
    ['viewServiceRecords', '服務紀錄單'],
    ['submitServiceRecord', '紀錄單繳交'],
    ['viewAudit', '異動紀錄'],
    ['lineNotifyAll', 'LINE 全部通知']
  ]
}

function getRoleListForMatrix() {
  return ['管理員', '主管', '行政 / 海外', '翻譯', '外務 / 宿管人員 / 會計', '一般職員']
}

function renderPermissionMark(enabled) {
  return `<span class="permission-mark ${enabled ? 'is-yes' : 'is-no'}">${enabled ? '✓' : '—'}</span>`
}

function renderRolePermissionMatrix() {
  const items = getRolePermissionTestItems()
  const roles = getRoleListForMatrix()

  return `
    <section class="role-permission-section">
      <div class="section-title-row">
        <h4>角色權限矩陣</h4>
        <span>依角色確認可操作功能</span>
      </div>

      <div class="role-matrix-scroll">
        <table class="role-matrix-table">
          <thead>
            <tr>
              <th>功能權限</th>
              ${roles.map(role => `<th>${escapeHtml(role)}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${items.map(([key, label]) => `
              <tr>
                <th>${escapeHtml(label)}</th>
                ${roles.map(role => {
                  const permissions = getRolePermissions(role)
                  return `<td>${renderPermissionMark(Boolean(permissions[key]))}</td>`
                }).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </section>
  `
}

function renderCurrentRolePermissionSummary() {
  const role = getRoleName()
  const permissions = getRolePermissions(role)
  const items = getRolePermissionTestItems()
  const enabled = items.filter(([key]) => permissions[key]).map(([, label]) => label)
  const disabled = items.filter(([key]) => !permissions[key]).map(([, label]) => label)

  return `
    <section class="current-role-permission-box">
      <div>
        <strong>目前角色：${escapeHtml(role)}</strong>
        <span>${enabled.length} 項可用｜${disabled.length} 項不可用</span>
      </div>
      <div class="current-role-permission-tags">
        ${enabled.map(label => `<span class="role-tag is-enabled">${escapeHtml(label)}</span>`).join('')}
      </div>
    </section>
  `
}

function renderPageAccessMatrix() {
  const roles = getRoleListForMatrix()
  const visiblePages = pages.filter(page => page.key !== 'health')

  return `
    <section class="role-permission-section">
      <div class="section-title-row">
        <h4>頁面檢視權限</h4>
        <span>確認各角色可看到的頁面</span>
      </div>

      <div class="role-matrix-scroll">
        <table class="role-matrix-table page-access-matrix">
          <thead>
            <tr>
              <th>頁面</th>
              ${roles.map(role => `<th>${escapeHtml(role)}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${visiblePages.map(page => `
              <tr>
                <th>${escapeHtml(page.label)}</th>
                ${roles.map(role => `<td>${renderPermissionMark(canSeePage(page, role))}</td>`).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </section>
  `
}



function getLaunchTestStorageKey() {
  return `for-e-launch-test-progress-${SYSTEM_VERSION}`
}

function getLaunchTestGroups() {
  return [
    {
      key: 'version',
      title: '一、版本與環境確認',
      items: [
        ['version-current', '系統檢查頁顯示目前版本為最新版本'],
        ['vercel-prod', '正式 Vercel 網址可正常開啟'],
        ['supabase-ok', 'Supabase 環境變數、staff、schedules、service_records、audit_logs 皆正常'],
        ['edge-function', '帳號 Edge Function dry_run 檢查正常'],
        ['account-binding-audit', '帳號綁定檢查沒有紅色錯誤，刪除人員不出現在人員名單'],
        ['backup-export', '正式上線前已下載人員、帳號、行程、服務紀錄單、異動紀錄與共用設定備份'],
        ['data-integrity-audit', '資料完整性檢查沒有紅色錯誤'],
        ['role-test-panel', '六種角色已完成實際登入確認並標記完成'],
        ['final-acceptance-report', '正式上線驗收報告已複製留存'],
        ['system-icon', '系統檢查 ICON 使用 system-health.png，未覆蓋 checklist.png']
      ]
    },
    {
      key: 'roles',
      title: '二、角色權限確認',
      items: [
        ['admin-role', '管理員：可使用人員 / 帳號、選項管理、系統檢查、全部行程管理'],
        ['manager-role', '主管：可看選項管理，可看全部人員但只能調整外務人員'],
        ['admin-overseas-role', '行政 / 海外：可管理行程、外務、異況，但不可管理帳號與選項'],
        ['translator-role', '翻譯：可看顏色設定、紀錄單繳交與自己的行程'],
        ['field-accounting-role', '外務 / 宿管人員 / 會計：可看外務行程、會議室、異動紀錄與自己的帳號'],
        ['staff-role', '一般職員：不顯示 LINE 通知、不顯示異動紀錄，只看自己的帳號與行程']
      ]
    },
    {
      key: 'schedule',
      title: '三、行程流程確認',
      items: [
        ['personal-schedule', '新增個人一般待辦後，個人行程表正常顯示'],
        ['service-schedule', '新增服務行程後，個人行程表與行程總覽同步顯示'],
        ['medical-followup', '醫療行程下次回診日期、時間、掛號號碼、下次執行人可正常建立下一筆'],
        ['field-schedule', '新增外務行程後，外務行程表、外務明細、個人行程表同步顯示'],
        ['meeting-room', '會議室預約可新增，重複 / 連續行程顯示正常且避免衝突'],
        ['incident-tracking', '異況追蹤可新增，追蹤項目可修改並可建立下次追蹤行程']
      ]
    },
    {
      key: 'mobile',
      title: '四、手機版確認',
      items: [
        ['mobile-login', '手機登入畫面可輸入帳號密碼並正常登入'],
        ['mobile-personal', '個人行程表卡片不跑版、不被底部選單遮住'],
        ['mobile-account-hidden', '手機底部選單不顯示人員 / 帳號頁'],
        ['mobile-overview', '行程總覽週曆可左右滑動，日期欄寬度正常'],
        ['mobile-field', '外務行程表可開啟，篩選列與卡片顯示正常'],
        ['mobile-modal', '新增 / 修改行程彈窗可上下滑動，底部按鈕可點']
      ]
    },
    {
      key: 'data',
      title: '五、資料與共用設定確認',
      items: [
        ['shared-options', '選項管理跨帳號同步正常'],
        ['car-options', '公務車資訊可在選項管理修改，行程表單可正常選擇'],
        ['color-settings', '顏色設定跨頁套用正常'],
        ['csv-export', '管理角色匯出 CSV 正常，手機版不顯示匯出按鈕'],
        ['audit-log', '新增 / 修改 / 完成 / 取消等異動紀錄有留下紀錄']
      ]
    }
  ]
}

function readLaunchTestProgress() {
  try {
    return JSON.parse(localStorage.getItem(getLaunchTestStorageKey()) || '{}') || {}
  } catch (err) {
    console.warn('上線確認紀錄讀取失敗', err)
    return {}
  }
}

function saveLaunchTestProgress(progress) {
  try {
    localStorage.setItem(getLaunchTestStorageKey(), JSON.stringify(progress || {}))
  } catch (err) {
    console.warn('上線確認紀錄儲存失敗', err)
  }
}

function getLaunchTestStats() {
  const groups = getLaunchTestGroups()
  const progress = readLaunchTestProgress()
  const total = groups.reduce((sum, group) => sum + group.items.length, 0)
  const done = groups.reduce((sum, group) => {
    return sum + group.items.filter(([key]) => progress[key]).length
  }, 0)

  return {
    total,
    done,
    remaining: Math.max(total - done, 0),
    percent: total ? Math.round((done / total) * 100) : 0
  }
}

function toggleLaunchTestItem(key, checked) {
  const progress = readLaunchTestProgress()
  if (checked) {
    progress[key] = {
      done: true,
      at: new Date().toISOString(),
      by: currentProfile?.name || currentProfile?.email || ''
    }
  } else {
    delete progress[key]
  }

  saveLaunchTestProgress(progress)
  renderApp()
}

function clearLaunchTestProgress() {
  if (!confirm('確定要清除本機的上線確認勾選紀錄嗎？\\n\\n這不會刪除任何系統資料。')) return
  localStorage.removeItem(getLaunchTestStorageKey())
  renderApp()
}

function getLaunchTestReportText() {
  const groups = getLaunchTestGroups()
  const progress = readLaunchTestProgress()
  const stats = getLaunchTestStats()

  return [
    'FOR-e 正式上線前確認清單',
    `版本：${SYSTEM_VERSION}`,
    `時間：${new Date().toLocaleString('zh-TW')}`,
    `確認人員：${currentProfile?.name || currentProfile?.email || '-'}`,
    `完成：${stats.done}/${stats.total}（${stats.percent}%）`,
    `剩餘：${stats.remaining}`,
    '',
    ...groups.flatMap(group => [
      group.title,
      ...group.items.map(([key, label]) => `${progress[key] ? '☑' : '☐'} ${label}`),
      ''
    ])
  ].join('\\n')
}

async function copyLaunchTestReport() {
  const text = getLaunchTestReportText()

  try {
    await navigator.clipboard.writeText(text)
    alert('正式上線前確認清單已複製。')
  } catch (err) {
    console.warn(err)
    alert(text)
  }
}

function renderLaunchTestChecklist() {
  const groups = getLaunchTestGroups()
  const progress = readLaunchTestProgress()
  const stats = getLaunchTestStats()

  return `
    <section class="launch-test-section">
      <div class="section-title-row">
        <h4>正式上線前確認清單</h4>
        <span>完成 ${stats.done}/${stats.total}｜${stats.percent}%</span>
      </div>

      <div class="launch-progress">
        <div class="launch-progress-bar">
          <span style="width:${stats.percent}%"></span>
        </div>
        <strong>剩餘 ${stats.remaining} 項</strong>
      </div>

      <div class="launch-test-actions">
        <button type="button" class="secondary-btn" id="copyLaunchTestBtn">複製確認清單</button>
        <button type="button" class="secondary-btn" id="clearLaunchTestBtn">清除勾選紀錄</button>
      </div>

      <div class="launch-test-groups">
        ${groups.map(group => `
          <div class="launch-test-group">
            <h5>${escapeHtml(group.title)}</h5>
            <div class="launch-test-items">
              ${group.items.map(([key, label]) => `
                <label class="launch-test-item ${progress[key] ? 'is-done' : ''}">
                  <input type="checkbox" data-launch-test-item="${escapeHtml(key)}" ${progress[key] ? 'checked' : ''}>
                  <span>${escapeHtml(label)}</span>
                </label>
              `).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    </section>
  `
}



function getAccountBindingAudit() {
  const sourceStaff = allStaffList.length ? allStaffList : staffList
  const activeStaffRows = (sourceStaff || []).filter(staff => !isStaffDeleted(staff))
  const deletedStaffRows = (sourceStaff || []).filter(isStaffDeleted)
  const activeStaffIds = new Set(activeStaffRows.map(staff => normalizeStaffId(staff.staff_id)).filter(Boolean))
  const deletedStaffIds = new Set(deletedStaffRows.map(staff => normalizeStaffId(staff.staff_id)).filter(Boolean))
  const linkedProfiles = userProfileList.filter(profile => normalizeStaffId(getProfileStaffId(profile)))
  const linkedByStaffId = {}

  linkedProfiles.forEach(profile => {
    const staffId = normalizeStaffId(getProfileStaffId(profile))
    if (!staffId) return
    if (!linkedByStaffId[staffId]) linkedByStaffId[staffId] = []
    linkedByStaffId[staffId].push(profile)
  })

  const duplicateLinks = Object.entries(linkedByStaffId)
    .filter(([, profiles]) => profiles.length > 1)
    .map(([staffId, profiles]) => ({
      staffId,
      staffName: activeStaffRows.find(staff => normalizeStaffId(staff.staff_id) === staffId)?.name || staffId,
      emails: profiles.map(profile => profile.email).filter(Boolean)
    }))

  const linkedToDeletedStaff = linkedProfiles.filter(profile => deletedStaffIds.has(normalizeStaffId(getProfileStaffId(profile))))
  const linkedToMissingStaff = linkedProfiles.filter(profile => {
    const staffId = normalizeStaffId(getProfileStaffId(profile))
    return staffId && !activeStaffIds.has(staffId) && !deletedStaffIds.has(staffId)
  })

  const activeUnboundStaff = activeStaffRows.filter(staff => {
    const status = getStaffDisplayStatus(staff)
    return status !== '停用' && !getStaffLoginEmail(staff)
  })

  const activeProfilesWithoutStaffId = userProfileList.filter(profile => {
    return isActiveLoginProfile(profile) && !normalizeStaffId(getProfileStaffId(profile))
  })

  const nameFallbackRisks = activeProfilesWithoutStaffId.filter(profile => {
    return profile.name && activeStaffRows.some(staff => staff.name === profile.name && !getStaffLoginEmail(staff))
  })

  const issues = [
    ...duplicateLinks.map(item => ({
      level: 'bad',
      title: '同一人員綁定多個登入帳號',
      detail: `${item.staffName}｜${item.emails.join('、') || item.staffId}`
    })),
    ...linkedToDeletedStaff.map(profile => ({
      level: 'bad',
      title: '登入帳號仍綁到已刪除人員',
      detail: `${profile.email || '-'}｜staff_id：${normalizeStaffId(getProfileStaffId(profile))}`
    })),
    ...linkedToMissingStaff.map(profile => ({
      level: 'warn',
      title: '登入帳號綁到不存在的人員',
      detail: `${profile.email || '-'}｜staff_id：${normalizeStaffId(getProfileStaffId(profile))}`
    })),
    ...nameFallbackRisks.map(profile => ({
      level: 'warn',
      title: '可能被姓名誤判為已綁定',
      detail: `${profile.email || '-'}｜${profile.name || '-'}`
    })),
    ...activeUnboundStaff.map(staff => ({
      level: 'warn',
      title: '啟用人員尚未綁定登入帳號',
      detail: `${staff.name || '-'}｜${staff.department_name || '-'}`
    }))
  ]

  return {
    activeStaffCount: activeStaffRows.length,
    deletedStaffCount: deletedStaffRows.length,
    linkedProfileCount: linkedProfiles.length,
    duplicateLinks,
    linkedToDeletedStaff,
    linkedToMissingStaff,
    activeUnboundStaff,
    nameFallbackRisks,
    issues
  }
}

function getAccountBindingStatus() {
  const audit = getAccountBindingAudit()
  if (audit.duplicateLinks.length || audit.linkedToDeletedStaff.length) return 'bad'
  if (audit.linkedToMissingStaff.length || audit.nameFallbackRisks.length || audit.activeUnboundStaff.length) return 'warn'
  return 'ok'
}

function getAccountBindingSummaryText() {
  const audit = getAccountBindingAudit()
  const statusText = getHealthStatusMeta(getAccountBindingStatus()).label
  return `${statusText}｜有效人員 ${audit.activeStaffCount} 位｜已綁定 ${audit.linkedProfileCount} 個帳號｜需注意 ${audit.issues.length} 項`
}

function renderAccountBindingAuditPanel() {
  const audit = getAccountBindingAudit()
  const status = getAccountBindingStatus()
  const meta = getHealthStatusMeta(status)
  const visibleIssues = audit.issues.slice(0, 30)

  return `
    <section class="account-binding-section ${meta.className}">
      <div class="section-title-row">
        <h4>帳號綁定檢查</h4>
        <span>${escapeHtml(getAccountBindingSummaryText())}</span>
      </div>

      <div class="account-binding-summary-grid">
        <div>
          <strong>${audit.activeStaffCount}</strong>
          <span>有效人員</span>
        </div>
        <div>
          <strong>${audit.deletedStaffCount}</strong>
          <span>已刪除不顯示</span>
        </div>
        <div>
          <strong>${audit.linkedProfileCount}</strong>
          <span>已綁定帳號</span>
        </div>
        <div>
          <strong>${audit.issues.length}</strong>
          <span>需注意</span>
        </div>
      </div>

      ${visibleIssues.length ? `
        <div class="account-binding-issue-list">
          ${visibleIssues.map(issue => `
            <div class="account-binding-issue is-${issue.level}">
              <strong>${escapeHtml(issue.title)}</strong>
              <span>${escapeHtml(issue.detail)}</span>
            </div>
          `).join('')}
        </div>
      ` : `
        <div class="empty-state">
          <p>帳號綁定檢查正常，目前沒有發現需要處理的綁定問題。</p>
        </div>
      `}

      <div class="notice">
        若要更換登入 Email，請到「人員 / 帳號」按「重綁」。若只是暫時不用請改成「停用」；若按「刪除」，人員會永久移除且不會出現在名單。
      </div>
    </section>
  `
}

function getAccountBindingReportLines() {
  const audit = getAccountBindingAudit()
  if (!audit.issues.length) return ['帳號綁定檢查：正常']

  return [
    `帳號綁定檢查：需注意 ${audit.issues.length} 項`,
    ...audit.issues.map(issue => `- ${issue.title}：${issue.detail}`)
  ]
}



function getLaunchReadinessState() {
  const healthRows = getHealthRows()
  const healthBad = healthRows.filter(row => row.status === 'bad')
  const healthWarn = healthRows.filter(row => row.status === 'warn')
  const launchStats = getLaunchTestStats()
  const accountAudit = getAccountBindingAudit()
  const dataAudit = getDataIntegrityAudit()

  const blockers = []
  const warnings = []

  healthBad.forEach(row => blockers.push(`${row.title}：${row.detail}`))
  accountAudit.duplicateLinks.forEach(item => blockers.push(`同一人員綁定多個帳號：${item.staffName}`))
  accountAudit.linkedToDeletedStaff.forEach(profile => blockers.push(`帳號仍綁到已刪除人員：${profile.email || '-'}`))
  dataAudit.badIssues.forEach(issue => blockers.push(`資料完整性：${issue.title}｜${issue.detail}`))

  healthWarn.forEach(row => warnings.push(`${row.title}：${row.detail}`))
  accountAudit.linkedToMissingStaff.forEach(profile => warnings.push(`帳號綁到不存在的人員：${profile.email || '-'}`))
  accountAudit.nameFallbackRisks.forEach(profile => warnings.push(`姓名誤判綁定風險：${profile.email || '-'}`))
  accountAudit.activeUnboundStaff.forEach(staff => warnings.push(`啟用人員尚未綁定帳號：${staff.name || '-'}`))
  dataAudit.warnIssues.forEach(issue => warnings.push(`資料完整性：${issue.title}｜${issue.detail}`))

  if (launchStats.remaining > 0) {
    warnings.push(`正式上線前確認清單尚有 ${launchStats.remaining} 項未完成`)
  }

  if (getRoleTestStats().remaining > 0) {
    warnings.push(`角色確認尚有 ${getRoleTestStats().remaining} 個角色未完成`)
  }

  let status = 'ok'
  let title = '可以進入正式上線前最終確認'
  let message = '目前沒有紅色阻擋項目，可以依照確認清單完成最後確認。'

  if (blockers.length) {
    status = 'bad'
    title = '暫不建議正式上線'
    message = '目前仍有紅色阻擋項目，請先處理後再上線。'
  } else if (warnings.length || launchStats.remaining > 0) {
    status = 'warn'
    title = '可以進行確認，但上線前仍需完成'
    message = '目前沒有紅色阻擋項目，但仍有注意項目或確認項目未完成。'
  }

  return {
    status,
    title,
    message,
    blockers,
    warnings,
    launchStats,
    healthRows,
    accountAudit,
    dataAudit
  }
}

function renderLaunchReadinessSummary() {
  const state = getLaunchReadinessState()
  const meta = getHealthStatusMeta(state.status)
  const visibleBlockers = state.blockers.slice(0, 12)
  const visibleWarnings = state.warnings.slice(0, 16)

  return `
    <section class="launch-readiness-card ${meta.className}">
      <div class="launch-readiness-head">
        <div>
          <h4>正式上線狀態總結</h4>
          <strong>${escapeHtml(state.title)}</strong>
          <p>${escapeHtml(state.message)}</p>
        </div>
        <span>${meta.label}</span>
      </div>

      <div class="launch-readiness-metrics">
        <div>
          <strong>${state.blockers.length}</strong>
          <span>阻擋項目</span>
        </div>
        <div>
          <strong>${state.warnings.length}</strong>
          <span>注意項目</span>
        </div>
        <div>
          <strong>${state.launchStats.percent}%</strong>
          <span>確認完成</span>
        </div>
        <div>
          <strong>${state.accountAudit.issues.length}</strong>
          <span>帳號綁定注意</span>
        </div>
        <div>
          <strong>${state.dataAudit.issues.length}</strong>
          <span>資料完整性注意</span>
        </div>
        <div>
          <strong>${getRoleTestStats().percent}%</strong>
          <span>角色確認</span>
        </div>
      </div>

      ${visibleBlockers.length ? `
        <div class="launch-readiness-list is-bad">
          <h5>阻擋項目</h5>
          ${visibleBlockers.map(item => `<p>${escapeHtml(item)}</p>`).join('')}
        </div>
      ` : ''}

      ${visibleWarnings.length ? `
        <div class="launch-readiness-list is-warn">
          <h5>注意項目</h5>
          ${visibleWarnings.map(item => `<p>${escapeHtml(item)}</p>`).join('')}
        </div>
      ` : ''}

      ${!visibleBlockers.length && !visibleWarnings.length ? `
        <div class="empty-state">
          <p>目前沒有阻擋項目或注意項目。請完成實際操作確認後，即可進入正式上線確認。</p>
        </div>
      ` : ''}

      <div class="launch-readiness-actions">
        <button type="button" class="secondary-btn" id="copyLaunchReadinessBtn">複製上線狀態報告</button>
      </div>
    </section>
  `
}

function getLaunchReadinessReportText() {
  const state = getLaunchReadinessState()

  return [
    'FOR-e 正式上線狀態報告',
    `版本：${SYSTEM_VERSION}`,
    `時間：${new Date().toLocaleString('zh-TW')}`,
    `登入者：${currentProfile?.name || currentProfile?.email || '-'}`,
    `角色：${currentProfile?.role || '-'}`,
    `狀態：${getHealthStatusMeta(state.status).label}｜${state.title}`,
    `確認進度：${state.launchStats.done}/${state.launchStats.total}（${state.launchStats.percent}%）`,
    `阻擋項目：${state.blockers.length}`,
    `注意項目：${state.warnings.length}`,
    `建議備份：人員、登入帳號綁定、行程、服務紀錄單、異動紀錄、共用設定`,
    '',
    '阻擋項目：',
    ...(state.blockers.length ? state.blockers.map(item => `- ${item}`) : ['- 無']),
    '',
    '注意項目：',
    ...(state.warnings.length ? state.warnings.map(item => `- ${item}`) : ['- 無']),
    '',
    ...getAccountBindingReportLines()
  ].join('\\n')
}

async function copyLaunchReadinessReport() {
  const text = getLaunchReadinessReportText()

  try {
    await navigator.clipboard.writeText(text)
    alert('上線狀態報告已複製。')
  } catch (err) {
    console.warn(err)
    alert(text)
  }
}



function getBackupDateLabel() {
  return todayString().replaceAll('-', '')
}

function getBackupFilename(name, ext = 'csv') {
  return `FOR-e_${SYSTEM_VERSION}_${name}_${getBackupDateLabel()}.${ext}`
}

function getBackupStaffRows() {
  const rows = allStaffList.length ? allStaffList : staffList
  return (rows || []).filter(staff => !isStaffDeleted(staff))
}

function getBackupScheduleRows() {
  return uniqueScheduleRows(schedules || []).filter(isVisibleSchedule)
}

function getProfileBackupColumns() {
  return [
    { header: 'Email', value: row => row.email || '' },
    { header: '姓名', value: row => row.name || '' },
    { header: '角色', value: row => row.role || '' },
    { header: '狀態', value: row => row.status || '' },
    { header: '綁定人員ID', value: row => normalizeStaffId(getProfileStaffId(row)) || '' },
    { header: '部門', value: row => row.department_name || row.department || '' },
    { header: '職務', value: row => row.position || '' },
    { header: '建立時間', value: row => row.created_at || '' },
    { header: '更新時間', value: row => row.updated_at || '' }
  ]
}

function getAppSettingsBackupRows() {
  return Object.entries(appSettings || {}).map(([key, value]) => ({
    key,
    value: typeof value === 'string' ? value : JSON.stringify(value ?? '')
  }))
}

function getAppSettingsBackupColumns() {
  return [
    { header: '設定Key', value: row => row.key || '' },
    { header: '設定內容', value: row => row.value || '' }
  ]
}

function getAccountBindingIssueBackupRows() {
  const audit = getAccountBindingAudit()
  return audit.issues.map(issue => ({
    level: issue.level,
    title: issue.title,
    detail: issue.detail
  }))
}

function getAccountBindingIssueBackupColumns() {
  return [
    { header: '等級', value: row => row.level === 'bad' ? '需處理' : '注意' },
    { header: '項目', value: row => row.title || '' },
    { header: '內容', value: row => row.detail || '' }
  ]
}

function getLaunchBackupItems() {
  return [
    {
      key: 'all',
      title: '一鍵下載全部備份',
      description: '依序下載人員、帳號綁定、行程、服務紀錄單、異動紀錄、共用設定、帳號檢查與資料完整性。',
      count: getBackupStaffRows().length + userProfileList.length + getBackupScheduleRows().length + (serviceRecords || []).filter(isActiveServiceRecord).length + auditLogs.length + getDataIntegrityAudit().issues.length,
      primary: true
    },
    {
      key: 'staff',
      title: '人員資料',
      description: '匯出目前人員名單，已刪除人員不會出現，停用人員會保留。',
      count: getBackupStaffRows().length
    },
    {
      key: 'profiles',
      title: '登入帳號綁定',
      description: '匯出 profiles 帳號、角色、狀態與 staff_id 綁定資料。',
      count: userProfileList.length
    },
    {
      key: 'schedules',
      title: '行程資料',
      description: '匯出所有已載入行程資料。',
      count: getBackupScheduleRows().length
    },
    {
      key: 'serviceRecords',
      title: '服務紀錄單',
      description: '匯出所有已載入服務紀錄單資料。',
      count: (serviceRecords || []).filter(isActiveServiceRecord).length
    },
    {
      key: 'auditLogs',
      title: '異動紀錄',
      description: '匯出所有已載入異動紀錄。',
      count: auditLogs.length
    },
    {
      key: 'appSettings',
      title: '共用設定',
      description: '匯出顏色設定、選項管理、公務車等共用設定。',
      count: Object.keys(appSettings || {}).length
    },
    {
      key: 'accountIssues',
      title: '帳號綁定檢查',
      description: '匯出帳號綁定檢查中需要注意或處理的項目。',
      count: getAccountBindingAudit().issues.length
    },
    {
      key: 'dataIssues',
      title: '資料完整性檢查',
      description: '匯出行程、指派人員與服務紀錄單需要注意或處理的項目。',
      count: getDataIntegrityAudit().issues.length
    }
  ]
}

function exportLaunchBackup(type = '') {
  const normalizedType = String(type || '').trim()

  if (normalizedType === 'all') {
    const types = ['staff', 'profiles', 'schedules', 'serviceRecords', 'auditLogs', 'appSettings', 'accountIssues', 'dataIssues']
    types.forEach((backupType, index) => {
      setTimeout(() => exportLaunchBackup(backupType), index * 180)
    })
    return
  }

  if (normalizedType === 'staff') {
    downloadCsv(getBackupFilename('人員資料'), getUserCsvColumns(), getBackupStaffRows())
    return
  }

  if (normalizedType === 'profiles') {
    downloadCsv(getBackupFilename('登入帳號綁定'), getProfileBackupColumns(), userProfileList || [])
    return
  }

  if (normalizedType === 'schedules') {
    downloadCsv(getBackupFilename('行程資料'), getScheduleCsvColumns(), getBackupScheduleRows())
    return
  }

  if (normalizedType === 'serviceRecords') {
    downloadCsv(getBackupFilename('服務紀錄單'), getServiceRecordCsvColumns(), (serviceRecords || []).filter(isActiveServiceRecord))
    return
  }

  if (normalizedType === 'auditLogs') {
    downloadCsv(getBackupFilename('異動紀錄'), getAuditCsvColumns(), auditLogs || [])
    return
  }

  if (normalizedType === 'appSettings') {
    downloadCsv(getBackupFilename('共用設定'), getAppSettingsBackupColumns(), getAppSettingsBackupRows())
    return
  }

  if (normalizedType === 'accountIssues') {
    downloadCsv(getBackupFilename('帳號綁定檢查'), getAccountBindingIssueBackupColumns(), getAccountBindingIssueBackupRows())
    return
  }

  if (normalizedType === 'dataIssues') {
    downloadCsv(getBackupFilename('資料完整性檢查'), getDataIntegrityIssueColumns(), getDataIntegrityAudit().issues)
    return
  }

  alert('找不到要匯出的備份類型。')
}

function renderLaunchBackupExportsPanel() {
  const items = getLaunchBackupItems()

  return `
    <section class="launch-backup-section">
      <div class="section-title-row">
        <h4>正式上線前資料備份</h4>
        <span>下載 CSV 留存，不會修改資料</span>
      </div>

      <div class="launch-backup-grid">
        ${items.map(item => `
          <div class="launch-backup-card ${item.primary ? 'is-primary' : ''}">
            <div>
              <strong>${escapeHtml(item.title)}</strong>
              <p>${escapeHtml(item.description)}</p>
              <span>${Number(item.count || 0).toLocaleString('zh-TW')} 筆</span>
            </div>
            <button type="button" class="${item.primary ? 'primary-btn' : 'secondary-btn'}" data-backup-export="${escapeHtml(item.key)}">
              ${item.primary ? '下載全部' : '下載'}
            </button>
          </div>
        `).join('')}
      </div>

      <div class="notice">
        建議正式上線前先下載一份備份。若瀏覽器阻擋多檔下載，請改用單項「下載」逐一匯出。
      </div>
    </section>
  `
}



function makeDataIntegrityIssue(level, type, title, detail, refId = '') {
  return { level, type, title, detail, refId }
}

function getDataIntegrityAudit() {
  const sourceStaff = allStaffList.length ? allStaffList : staffList
  const allStaffRows = sourceStaff || []
  const activeStaffRows = allStaffRows.filter(staff => !isStaffDeleted(staff))
  const deletedStaffRows = allStaffRows.filter(isStaffDeleted)
  const allStaffIds = new Set(allStaffRows.map(staff => normalizeStaffId(staff.staff_id)).filter(Boolean))
  const activeStaffIds = new Set(activeStaffRows.map(staff => normalizeStaffId(staff.staff_id)).filter(Boolean))
  const deletedStaffIds = new Set(deletedStaffRows.map(staff => normalizeStaffId(staff.staff_id)).filter(Boolean))
  const scheduleRows = getBackupScheduleRows()
  const scheduleIds = new Set(scheduleRows.map(row => row.schedule_id).filter(Boolean))
  const issues = []

  scheduleRows.forEach(row => {
    const ref = row.schedule_id || ''
    const label = `${row.start_date || '-'}｜${row.category || '-'}｜${row.title || row.description || '-'}`

    if (!row.start_date) {
      issues.push(makeDataIntegrityIssue('bad', 'schedule', '行程缺少日期', label, ref))
    }

    if (row.end_date && row.start_date && String(row.end_date) < String(row.start_date)) {
      issues.push(makeDataIntegrityIssue('bad', 'schedule', '行程結束日期早於開始日期', label, ref))
    }

    if (!row.category) {
      issues.push(makeDataIntegrityIssue('warn', 'schedule', '行程缺少大類別', label, ref))
    }

    if (!row.title && !row.description) {
      issues.push(makeDataIntegrityIssue('warn', 'schedule', '行程缺少標題與內容', label, ref))
    }

    const assignees = (row.schedule_assignees || []).filter(item => !item.deleted_at)
    const shouldHaveAssignee = row.category !== '會議室預約' && row.category !== '請假 / 會議 / 活動 / 外訓'

    if (shouldHaveAssignee && !assignees.length && !row.creator_staff_id) {
      issues.push(makeDataIntegrityIssue('warn', 'schedule', '行程沒有執行者', label, ref))
    }

    assignees.forEach(item => {
      const staffId = normalizeStaffId(item.staff_id)
      const staffName = item.staff_name || '-'
      if (!staffId) {
        issues.push(makeDataIntegrityIssue('warn', 'schedule_assignee', '指派資料缺少人員 ID', `${label}｜${staffName}`, ref))
        return
      }

      if (deletedStaffIds.has(staffId)) {
        issues.push(makeDataIntegrityIssue('bad', 'schedule_assignee', '行程指派到已刪除人員', `${label}｜${staffName}`, ref))
        return
      }

      if (!allStaffIds.has(staffId)) {
        issues.push(makeDataIntegrityIssue('warn', 'schedule_assignee', '行程指派到不存在的人員', `${label}｜${staffName}｜${staffId}`, ref))
      }
    })
  })

  serviceRecords.forEach(record => {
    const ref = record.record_id || record.service_record_id || record.schedule_id || ''
    const label = `${record.schedule_date || '-'}｜${record.title || record.schedule_type || '-'}｜${record.staff_name || '-'}`

    if (!record.schedule_date) {
      issues.push(makeDataIntegrityIssue('warn', 'service_record', '服務紀錄單缺少行程日期', label, ref))
    }

    if (record.schedule_id && !scheduleIds.has(record.schedule_id)) {
      issues.push(makeDataIntegrityIssue('warn', 'service_record', '服務紀錄單連結不到行程', label, ref))
    }

    const staffId = normalizeStaffId(record.staff_id)
    if (staffId && !activeStaffIds.has(staffId)) {
      const level = deletedStaffIds.has(staffId) ? 'bad' : 'warn'
      issues.push(makeDataIntegrityIssue(level, 'service_record', deletedStaffIds.has(staffId) ? '服務紀錄單人員已刪除' : '服務紀錄單人員不存在', `${label}｜${staffId}`, ref))
    }
  })

  const badIssues = issues.filter(issue => issue.level === 'bad')
  const warnIssues = issues.filter(issue => issue.level === 'warn')

  return {
    scheduleCount: scheduleRows.length,
    serviceRecordCount: serviceRecords.length,
    staffCount: activeStaffRows.length,
    badIssues,
    warnIssues,
    issues
  }
}

function getDataIntegrityStatus() {
  const audit = getDataIntegrityAudit()
  if (audit.badIssues.length) return 'bad'
  if (audit.warnIssues.length) return 'warn'
  return 'ok'
}

function getDataIntegritySummaryText() {
  const audit = getDataIntegrityAudit()
  const statusText = getHealthStatusMeta(getDataIntegrityStatus()).label
  return `${statusText}｜行程 ${audit.scheduleCount} 筆｜紀錄單 ${audit.serviceRecordCount} 筆｜需處理 ${audit.badIssues.length}｜注意 ${audit.warnIssues.length}`
}

function getDataIntegrityIssueColumns() {
  return [
    { header: '等級', value: row => row.level === 'bad' ? '需處理' : '注意' },
    { header: '資料類型', value: row => row.type || '' },
    { header: '問題', value: row => row.title || '' },
    { header: '內容', value: row => row.detail || '' },
    { header: '關聯ID', value: row => row.refId || '' }
  ]
}

function renderDataIntegrityAuditPanel() {
  const audit = getDataIntegrityAudit()
  const meta = getHealthStatusMeta(getDataIntegrityStatus())
  const visibleIssues = audit.issues.slice(0, 36)

  return `
    <section class="data-integrity-section ${meta.className}">
      <div class="section-title-row">
        <h4>資料完整性檢查</h4>
        <span>${escapeHtml(getDataIntegritySummaryText())}</span>
      </div>

      <div class="data-integrity-summary-grid">
        <div>
          <strong>${audit.scheduleCount}</strong>
          <span>行程資料</span>
        </div>
        <div>
          <strong>${audit.serviceRecordCount}</strong>
          <span>服務紀錄單</span>
        </div>
        <div>
          <strong>${audit.badIssues.length}</strong>
          <span>需處理</span>
        </div>
        <div>
          <strong>${audit.warnIssues.length}</strong>
          <span>注意</span>
        </div>
      </div>

      ${visibleIssues.length ? `
        <div class="data-integrity-issue-list">
          ${visibleIssues.map(issue => `
            <div class="data-integrity-issue is-${issue.level}">
              <strong>${escapeHtml(issue.title)}</strong>
              <span>${escapeHtml(issue.detail)}</span>
            </div>
          `).join('')}
        </div>
      ` : `
        <div class="empty-state">
          <p>資料完整性檢查正常，目前沒有發現行程、指派或服務紀錄單資料異常。</p>
        </div>
      `}

      <div class="data-integrity-actions">
        <button type="button" class="secondary-btn" data-backup-export="dataIssues">下載資料完整性檢查</button>
      </div>
    </section>
  `
}

function getDataIntegrityReportLines() {
  const audit = getDataIntegrityAudit()
  if (!audit.issues.length) return ['資料完整性檢查：正常']

  return [
    `資料完整性檢查：需處理 ${audit.badIssues.length} 項｜注意 ${audit.warnIssues.length} 項`,
    ...audit.issues.map(issue => `- ${issue.level === 'bad' ? '需處理' : '注意'}｜${issue.title}：${issue.detail}`)
  ]
}



function getRoleTestStorageKey() {
  return `for-e-role-test-progress-${SYSTEM_VERSION}`
}

function getRoleTestDefinitions() {
  return [
    {
      role: '管理員',
      canSee: ['個人行程表', '個人一般待辦', '我指派的事項追蹤', '行程總覽', '外務行程', '外務明細', '會議室預約', '異況追蹤', '行程搜尋', '統計報表', '服務紀錄單', 'LINE 通知', '顏色設定', '選項管理', '異動紀錄', '人員 / 帳號', '系統檢查'],
      cannotSee: [],
      actions: ['新增 / 修改 / 完成 / 取消行程', '新增外務行程', '新增會議室預約', '新增異況', '人員新增 / 修改 / 綁定 / 重綁 / 重設 / 刪除', '選項管理可修改', '備份匯出可下載']
    },
    {
      role: '主管',
      canSee: ['個人行程表', '個人一般待辦', '我指派的事項追蹤', '行程總覽', '外務行程', '會議室預約', '異況追蹤', '行程搜尋', '統計報表', '服務紀錄單', 'LINE 通知', '顏色設定', '選項管理', '異動紀錄', '人員 / 帳號', '系統檢查'],
      cannotSee: ['外務明細'],
      actions: ['可查看全部人員', '只可調整是否外務人員', '可使用選項管理', '不可建立 / 重設 / 刪除帳號']
    },
    {
      role: '行政 / 海外',
      canSee: ['個人行程表', '個人一般待辦', '我指派的事項追蹤', '行程總覽', '外務行程', '外務明細', '會議室預約', '異況追蹤', '行程搜尋', 'LINE 通知', '顏色設定', '異動紀錄', '人員 / 帳號'],
      cannotSee: ['統計報表', '服務紀錄單', '選項管理', '系統檢查'],
      actions: ['可新增 / 修改服務行程', '可新增外務行程', '可新增異況', '不可管理帳號', '不可管理選項']
    },
    {
      role: '翻譯',
      canSee: ['個人行程表', '個人一般待辦', '我指派的事項追蹤', '行程總覽', '紀錄單繳交', 'LINE 通知', '顏色設定', '人員 / 帳號'],
      cannotSee: ['異況追蹤', '外務行程', '外務明細', '會議室預約', '行程搜尋', '統計報表', '服務紀錄單', '選項管理', '異動紀錄', '系統檢查'],
      actions: ['可查看自己的行程', '可繳交紀錄單', '可修改自己的密碼', '不可看異況追蹤']
    },
    {
      role: '外務 / 宿管人員 / 會計',
      canSee: ['個人行程表', '個人一般待辦', '我指派的事項追蹤', '行程總覽', '外務行程', '會議室預約', 'LINE 通知', '異動紀錄', '人員 / 帳號'],
      cannotSee: ['外務明細', '異況追蹤', '行程搜尋', '統計報表', '服務紀錄單', '紀錄單繳交', '顏色設定', '選項管理', '系統檢查'],
      actions: ['可看外務行程表', '可預約會議室', '只看自己的帳號資訊', '可修改自己的密碼']
    },
    {
      role: '一般職員',
      canSee: ['個人行程表', '個人一般待辦', '我指派的事項追蹤', '行程總覽', '會議室預約', '顏色設定', '人員 / 帳號'],
      cannotSee: ['LINE 通知', '異動紀錄', '外務行程', '外務明細', '異況追蹤', '行程搜尋', '統計報表', '服務紀錄單', '紀錄單繳交', '選項管理', '系統檢查'],
      actions: ['可查看自己的行程', '可新增自己的個人待辦', '可預約會議室', '只看自己的帳號資訊', '可修改自己的密碼']
    }
  ]
}

function readRoleTestProgress() {
  try {
    return JSON.parse(localStorage.getItem(getRoleTestStorageKey()) || '{}') || {}
  } catch (err) {
    console.warn('角色確認紀錄讀取失敗', err)
    return {}
  }
}

function saveRoleTestProgress(progress) {
  try {
    localStorage.setItem(getRoleTestStorageKey(), JSON.stringify(progress || {}))
  } catch (err) {
    console.warn('角色確認紀錄儲存失敗', err)
  }
}

function getRoleTestStats() {
  const definitions = getRoleTestDefinitions()
  const progress = readRoleTestProgress()
  const total = definitions.length
  const done = definitions.filter(item => progress[item.role]).length

  return {
    total,
    done,
    remaining: Math.max(total - done, 0),
    percent: total ? Math.round((done / total) * 100) : 0
  }
}

function toggleRoleTestComplete(role = '') {
  const targetRole = String(role || '').trim()
  if (!targetRole) return

  const progress = readRoleTestProgress()
  if (progress[targetRole]) {
    delete progress[targetRole]
  } else {
    progress[targetRole] = {
      done: true,
      at: new Date().toISOString(),
      by: currentProfile?.name || currentProfile?.email || ''
    }
  }

  saveRoleTestProgress(progress)
  renderApp()
}

function clearRoleTestProgress() {
  if (!confirm('確定要清除本機的角色確認完成紀錄嗎？\\n\\n這不會刪除任何系統資料。')) return
  localStorage.removeItem(getRoleTestStorageKey())
  renderApp()
}

function getRoleTestChecklistText(role = '') {
  const definition = getRoleTestDefinitions().find(item => item.role === role)
  if (!definition) return ''

  return [
    `FOR-e 角色確認清單｜${definition.role}`,
    `版本：${SYSTEM_VERSION}`,
    `時間：${new Date().toLocaleString('zh-TW')}`,
    '',
    '應該看得到：',
    ...definition.canSee.map(item => `□ ${item}`),
    '',
    '不應該看得到：',
    ...definition.cannotSee.map(item => `□ ${item}`),
    '',
    '操作確認：',
    ...definition.actions.map(item => `□ ${item}`)
  ].join('\\n')
}

async function copyRoleTestChecklist(role = '') {
  const text = getRoleTestChecklistText(role)
  if (!text) {
    alert('找不到角色確認清單。')
    return
  }

  try {
    await navigator.clipboard.writeText(text)
    alert(`${role} 角色確認清單已複製。`)
  } catch (err) {
    console.warn(err)
    alert(text)
  }
}

function getRoleTestReportLines() {
  const definitions = getRoleTestDefinitions()
  const progress = readRoleTestProgress()
  const stats = getRoleTestStats()

  return [
    `角色確認進度：${stats.done}/${stats.total}（${stats.percent}%）`,
    ...definitions.map(item => {
      const done = progress[item.role]
      return `- ${done ? '已完成' : '未完成'}｜${item.role}${done?.by ? `｜${done.by}` : ''}`
    })
  ]
}

function renderRoleTestPanel() {
  const definitions = getRoleTestDefinitions()
  const progress = readRoleTestProgress()
  const stats = getRoleTestStats()

  return `
    <section class="role-test-section">
      <div class="section-title-row">
        <h4>角色確認面板</h4>
        <span>完成 ${stats.done}/${stats.total}｜${stats.percent}%</span>
      </div>

      <div class="launch-progress">
        <div class="launch-progress-bar">
          <span style="width:${stats.percent}%"></span>
        </div>
        <strong>剩餘 ${stats.remaining} 角色</strong>
      </div>

      <div class="role-test-actions">
        <button type="button" class="secondary-btn" id="clearRoleTestBtn">清除角色確認紀錄</button>
      </div>

      <div class="role-test-grid">
        ${definitions.map(definition => {
          const done = progress[definition.role]
          return `
            <div class="role-test-card ${done ? 'is-done' : ''}">
              <div class="role-test-card-head">
                <strong>${escapeHtml(definition.role)}</strong>
                <span>${done ? '已完成' : '未確認'}</span>
              </div>

              <div class="role-test-columns">
                <div>
                  <h5>應該看得到</h5>
                  ${definition.canSee.slice(0, 9).map(item => `<p>✓ ${escapeHtml(item)}</p>`).join('')}
                  ${definition.canSee.length > 9 ? `<p>＋${definition.canSee.length - 9} 項</p>` : ''}
                </div>
                <div>
                  <h5>不應該看得到</h5>
                  ${definition.cannotSee.slice(0, 7).map(item => `<p>— ${escapeHtml(item)}</p>`).join('') || '<p>— 無</p>'}
                  ${definition.cannotSee.length > 7 ? `<p>＋${definition.cannotSee.length - 7} 項</p>` : ''}
                </div>
              </div>

              <div class="role-test-card-actions">
                <button type="button" class="secondary-btn" data-copy-role-test="${escapeHtml(definition.role)}">複製清單</button>
                <button type="button" class="${done ? 'secondary-btn' : 'primary-btn'}" data-role-test-complete="${escapeHtml(definition.role)}">${done ? '取消完成' : '標記完成'}</button>
              </div>
            </div>
          `
        }).join('')}
      </div>
    </section>
  `
}



function getCompletedModuleGroups() {
  return [
    {
      title: '核心行程',
      items: ['個人行程表', '個人一般待辦', '我指派的事項追蹤', '行程總覽', '行程搜尋']
    },
    {
      title: '外務與會議',
      items: ['外務行程', '外務明細', '公務車選項', '會議室預約', '重複 / 連續行程']
    },
    {
      title: '異況與紀錄',
      items: ['異況追蹤', '服務紀錄單', '紀錄單繳交', '資料完整性檢查']
    },
    {
      title: '管理與上線',
      items: ['人員 / 帳號', '重新綁定帳號', '選項管理', '顏色設定', '異動紀錄', 'LINE 通知', '系統檢查', '資料備份匯出']
    }
  ]
}

function getFinalAcceptanceState() {
  const readiness = getLaunchReadinessState()
  const launchStats = getLaunchTestStats()
  const roleStats = getRoleTestStats()
  const accountAudit = getAccountBindingAudit()
  const dataAudit = getDataIntegrityAudit()
  const blockers = [...readiness.blockers]
  const reminders = []

  if (launchStats.remaining > 0) reminders.push(`正式上線前確認清單尚有 ${launchStats.remaining} 項未完成`)
  if (roleStats.remaining > 0) reminders.push(`角色確認尚有 ${roleStats.remaining} 個角色未完成`)
  if (accountAudit.issues.length) reminders.push(`帳號綁定檢查仍有 ${accountAudit.issues.length} 項需確認`)
  if (dataAudit.issues.length) reminders.push(`資料完整性檢查仍有 ${dataAudit.issues.length} 項需確認`)

  let status = 'ok'
  let title = '可送主管驗收'
  let conclusion = '系統主要功能已具備正式上線條件，完成實際確認與備份後即可交付。'

  if (blockers.length) {
    status = 'bad'
    title = '尚不可送驗收'
    conclusion = '仍有紅色阻擋項目，請先修正後再提交正式驗收。'
  } else if (reminders.length) {
    status = 'warn'
    title = '可進行驗收前確認'
    conclusion = '目前沒有紅色阻擋項目，但仍有確認、備份或資料確認項目需完成。'
  }

  return {
    status,
    title,
    conclusion,
    blockers,
    reminders,
    readiness,
    launchStats,
    roleStats,
    accountAudit,
    dataAudit
  }
}

function getAcceptanceReportText() {
  const state = getFinalAcceptanceState()
  const moduleGroups = getCompletedModuleGroups()

  return [
    'FOR-e 共享排程系統｜正式上線驗收報告',
    `版本：${SYSTEM_VERSION}`,
    `正式網址：${window.location.origin}`,
    `產出時間：${new Date().toLocaleString('zh-TW')}`,
    `產出人員：${currentProfile?.name || currentProfile?.email || '-'}`,
    '',
    `驗收狀態：${getHealthStatusMeta(state.status).label}｜${state.title}`,
    `驗收結論：${state.conclusion}`,
    '',
    '一、上線前檢查結果',
    `- 確認清單完成：${state.launchStats.done}/${state.launchStats.total}（${state.launchStats.percent}%）`,
    `- 角色確認完成：${state.roleStats.done}/${state.roleStats.total}（${state.roleStats.percent}%）`,
    `- 帳號綁定問題：${state.accountAudit.issues.length} 項`,
    `- 資料完整性問題：${state.dataAudit.issues.length} 項`,
    `- 阻擋項目：${state.blockers.length} 項`,
    '',
    '二、已完成功能模組',
    ...moduleGroups.flatMap(group => [
      `【${group.title}】`,
      ...group.items.map(item => `- ${item}`)
    ]),
    '',
    '三、需處理 / 注意項目',
    ...(state.blockers.length ? state.blockers.map(item => `【阻擋】${item}`) : ['【阻擋】無']),
    ...(state.reminders.length ? state.reminders.map(item => `【提醒】${item}`) : ['【提醒】無']),
    '',
    '四、建議上線前必做',
    '- 下載正式上線前資料備份',
    '- 完成六種角色實際登入確認',
    '- 確認刪除人員不出現在人員名單，停用人員仍保留',
    '- 確認重新綁定帳號功能正常',
    '- 確認手機版新增 / 修改彈窗不遮擋',
    '',
    ...getAccountBindingReportLines(),
    '',
    ...getDataIntegrityReportLines(),
    '',
    ...getRoleTestReportLines()
  ].join('\n')
}

async function copyFinalAcceptanceReport() {
  const text = getAcceptanceReportText()

  try {
    await navigator.clipboard.writeText(text)
    alert('正式上線驗收報告已複製。')
  } catch (err) {
    console.warn(err)
    alert(text)
  }
}

function renderFinalAcceptancePanel() {
  const state = getFinalAcceptanceState()
  const meta = getHealthStatusMeta(state.status)
  const moduleGroups = getCompletedModuleGroups()

  return `
    <section class="final-acceptance-section ${meta.className}">
      <div class="final-acceptance-head">
        <div>
          <h4>正式上線驗收報告</h4>
          <strong>${escapeHtml(state.title)}</strong>
          <p>${escapeHtml(state.conclusion)}</p>
        </div>
        <span>${meta.label}</span>
      </div>

      <div class="final-acceptance-metrics">
        <div>
          <strong>${state.launchStats.percent}%</strong>
          <span>確認清單</span>
        </div>
        <div>
          <strong>${state.roleStats.percent}%</strong>
          <span>角色確認</span>
        </div>
        <div>
          <strong>${state.accountAudit.issues.length}</strong>
          <span>帳號注意</span>
        </div>
        <div>
          <strong>${state.dataAudit.issues.length}</strong>
          <span>資料注意</span>
        </div>
        <div>
          <strong>${state.blockers.length}</strong>
          <span>阻擋項目</span>
        </div>
      </div>

      <div class="final-module-grid">
        ${moduleGroups.map(group => `
          <div class="final-module-card">
            <strong>${escapeHtml(group.title)}</strong>
            ${group.items.map(item => `<span>${escapeHtml(item)}</span>`).join('')}
          </div>
        `).join('')}
      </div>

      <div class="final-acceptance-actions">
        <button type="button" class="primary-btn" id="copyFinalAcceptanceBtn">複製正式驗收報告</button>
      </div>
    </section>
  `
}


function renderSystemHealthPage() {
  const rows = getHealthRows()

  return `
    <div class="page-toolbar">
      <div>
        <h3>系統檢查</h3>
        <p class="muted">正式上線前快速檢查 Supabase、資料表、角色、共用設定與帳號功能。</p>
      </div>
      <div class="toolbar-actions health-toolbar-actions">
        <button class="primary-btn" id="runHealthDryRunBtn">檢查帳號 Edge Function</button>
        <button class="secondary-btn" id="copyHealthReportBtn">複製檢查報告</button>
        <button class="secondary-btn" id="clearUiMemoryBtn">清除我的畫面記憶</button>
        <button class="secondary-btn" id="refreshBtn">重新整理</button>
      </div>
    </div>

    <div class="notice">
      這一頁只做系統狀態檢查，不會修改資料。若出現「需處理」，請優先執行 Supabase RLS baseline 或檢查對應資料表。
    </div>

    ${renderLaunchReadinessSummary()}
    ${renderFinalAcceptancePanel()}
    ${renderLaunchBackupExportsPanel()}

    ${renderSystemHealthSummary(rows)}

    <div class="health-grid">
      ${rows.map(row => renderHealthCard(row.title, row.status, row.detail, row.note)).join('')}
    </div>

    ${renderCurrentRolePermissionSummary()}
    ${renderRolePermissionMatrix()}
    ${renderPageAccessMatrix()}
    ${renderAccountBindingAuditPanel()}
    ${renderDataIntegrityAuditPanel()}
    ${renderRoleTestPanel()}
    ${renderLaunchTestChecklist()}

    <section class="health-checklist">
      <h4>上線前建議確認順序</h4>
      <ol>
        <li>管理員登入，確認人員 / 帳號可新增、修改、綁定、重設、刪除。</li>
        <li>主管登入，確認可看全部人員但只能改外務人員。</li>
        <li>行政 / 海外登入，確認可管理行程但不可管理帳號與選項。</li>
        <li>翻譯登入，確認只看自己的行程與紀錄單繳交。</li>
        <li>外務 / 宿管 / 會計與一般職員登入，確認只看自己的帳號資訊並可修改自己密碼。</li>
        <li>確認「目前版本」為最新版本，再開始確認各角色功能。</li>
        <li>新增醫療行程，確認下次回診日期、時間、掛號號碼、下次執行人。</li>
        <li>新增外務行程，確認外務行程表、外務明細、個人行程都有同步。</li>
      </ol>
    </section>
  `
}



function renderPageContent() {
  if (currentPage === 'personalSchedule') return renderPersonalSchedule()
  if (currentPage === 'personalTodo') return renderPersonalTodo()
  if (currentPage === 'assignedTracking') return renderAssignedTrackingPage()
  if (currentPage === 'scheduleOverview') return renderScheduleOverview()
  if (currentPage === 'fieldSchedule') {
    try {
      return renderFieldScheduleCalendar()
    } catch (err) {
      console.error('外務行程表開啟失敗', err)
      return `
        <div class="page-toolbar">
          <div>
            <h3>外務行程</h3>
            <p class="muted">外務行程表載入時發生錯誤。</p>
          </div>
          <div class="toolbar-actions">
            <button class="secondary-btn" id="refreshBtn">重新整理</button>
          </div>
        </div>
        <div class="error-card">外務行程表開啟失敗：${escapeHtml(err?.message || err || '未知錯誤')}</div>
      `
    }
  }
  if (currentPage === 'fieldDetail') return renderFieldDetailPage()
  if (currentPage === 'meetingRoom') return renderMeetingRoomCalendar()
  if (currentPage === 'incident') return renderIncidentTrackingPage()
  if (currentPage === 'search') return renderSearchPage()
  if (currentPage === 'stats') return renderStatsDashboard()
  if (currentPage === 'serviceRecord') return renderServiceRecordDashboard()
  if (currentPage === 'recordSubmit') return renderRecordSubmit()
  if (currentPage === 'audit') return renderAuditPage()
  if (currentPage === 'line') return renderLineNotificationPage()
  if (currentPage === 'color') return renderColorSettingsPage()
  if (currentPage === 'options') return renderOptionsPage()
  if (currentPage === 'users') return renderUsersPage()
  if (currentPage === 'health') return renderSystemHealthPage()

  return `
    <h3>${getPageTitle()}</h3>
    <p>此頁面目前尚未開放內容，請返回其他功能頁。</p>
  `
}


/* FOR-e V002-1H-5 START - assigned task tracking */
function getAssignedTrackingRows() {
  const myStaffId = currentProfile?.staff_id
  if (!myStaffId) return []

  return schedules
    .filter(row => isVisibleSchedule(row))
    .filter(row => !isNoCompletionControlSchedule(row))
    .filter(row => row.creator_staff_id === myStaffId)
    .filter(row => {
      const assigneeIds = getAssigneeIds(row)
      return assigneeIds.some(id => id !== myStaffId)
    })
    .sort((a, b) => {
      const aOverdue = isOverdueSchedule(a) && a.status !== '已完成'
      const bOverdue = isOverdueSchedule(b) && b.status !== '已完成'
      if (aOverdue !== bOverdue) return aOverdue ? -1 : 1
      if ((a.status === '未完成') !== (b.status === '未完成')) return a.status === '未完成' ? -1 : 1
      return String(a.start_date || '').localeCompare(String(b.start_date || ''))
    })
}

function getAssignedTrackingAssignees(row) {
  const myStaffId = currentProfile?.staff_id
  return (row.schedule_assignees || [])
    .filter(item => !item.deleted_at)
    .filter(item => item.staff_id !== myStaffId)
    .map(item => item.staff_name)
    .filter(Boolean)
}

function renderAssignedTrackingPage() {
  const rows = getAssignedTrackingRows()
  const activeRows = rows.filter(row => row.status !== '已完成' && row.status !== '取消')
  const completedRows = rows.filter(row => row.status === '已完成')
  const overdueRows = rows.filter(row => isOverdueSchedule(row))

  return `
    <div class="page-toolbar">
      <div>
        <h3>我指派的事項追蹤</h3>
        <p class="muted">只追蹤我建立，並指派給他人的任務。</p>
      </div>
      <div class="toolbar-actions">
        ${canCreateServiceSchedule() ? '<button class="primary-btn" id="addScheduleBtn">新增行程</button>' : ''}
        <button class="secondary-btn" id="refreshBtn">重新整理</button>
      </div>
    </div>

    ${renderReadStatus()}

    <div class="summary-grid assigned-tracking-summary">
      <div class="summary-card">
        <strong>${rows.length}</strong>
        <span>我指派的事項</span>
      </div>
      <div class="summary-card">
        <strong>${activeRows.length}</strong>
        <span>未完成追蹤</span>
      </div>
      <div class="summary-card">
        <strong>${overdueRows.length}</strong>
        <span>已逾期</span>
      </div>
      <div class="summary-card">
        <strong>${completedRows.length}</strong>
        <span>已完成</span>
      </div>
    </div>

    ${renderAssignedTrackingList(rows)}
  `
}

function renderAssignedTrackingList(rows) {
  if (!rows.length) {
    return `<div class="empty-state">目前沒有由我建立並指派給他人的事項。</div>`
  }

  return `
    <div class="assigned-tracking-list">
      ${rows.map(row => {
        const assignees = getAssignedTrackingAssignees(row)
        const overdue = isOverdueSchedule(row)
        return `
          <div class="assigned-tracking-row ${row.status === '已完成' ? 'is-completed' : ''} ${overdue ? 'is-overdue' : ''}">
            <div class="assigned-tracking-date">
              <strong>${escapeHtml(row.start_date || '-')}</strong>
              <span>${escapeHtml(formatTime(row))}</span>
            </div>

            <div class="assigned-tracking-main">
              <div class="assigned-tracking-title">${escapeHtml(row.schedule_type || row.category)}｜${escapeHtml(row.title || '-')}</div>
              <div class="assigned-tracking-meta">
                被指派人：${escapeHtml(assignees.length ? assignees.join('、') : '-')}
                ${row.customer_name ? '｜' + escapeHtml(row.customer_name) : ''}
                ${row.location_name ? '｜' + escapeHtml(row.location_name) : ''}
              </div>
              ${overdue ? `<div class="assigned-tracking-alert">已逾期，請追蹤!!!</div>` : ''}
            </div>

            <div class="assigned-tracking-status">
              <span class="status-pill">${escapeHtml(row.status || '未完成')}</span>
              <button class="small-secondary-btn" data-view-schedule="${row.schedule_id}">查看</button>
            </div>
          </div>
        `
      }).join('')}
    </div>
  `
}
/* FOR-e V002-1H-5 END - assigned task tracking */

function renderToolbar(title) {
  const canAdd = canCreateForCurrentPage()
  return `
    <div class="page-toolbar">
      <div>
        <h3>${title}</h3>
        <p class="muted">${getRolePermissionNotice()}</p>
      </div>
      <div class="toolbar-actions">
        ${canAdd ? `<button class="primary-btn" id="addScheduleBtn">${currentPage === 'personalTodo' ? '新增一般待辦' : '新增行程'}</button>` : ''}
        <button class="secondary-btn" id="refreshBtn">重新整理</button>
      </div>
    </div>
  `
}


/* FOR-e V002-1H-4 START - service record reminder area */
function getMyPendingServiceRecordReminders() {
  const myStaffId = currentProfile?.staff_id
  if (!myStaffId) return { pending: [], overdue: [] }

  const pending = []
  const overdue = []

  serviceRecords
    .filter(record => record.staff_id === myStaffId)
    .filter(record => !(record.submitted || record.submitted_date))
    .forEach(record => {
      const status = getServiceRecordStatus(record)
      if (status === '超過2週') overdue.push(record)
      else pending.push(record)
    })

  return { pending, overdue }
}

function renderServiceRecordReminderArea() {
  const { pending, overdue } = getMyPendingServiceRecordReminders()
  if (!pending.length && !overdue.length) return ''

  return `
    <section class="service-record-reminder-area">
      ${pending.length ? `
        <div class="service-record-reminder-card is-pending">
          <img src="/icons/須繳交.png" alt="須繳交">
          <div>
            <strong>您有 ${pending.length} 筆服務紀錄單未繳交，請留意繳交期限。</strong>
            <span>未超過 14 天的紀錄單提醒</span>
          </div>
        </div>
      ` : ''}

      ${overdue.length ? `
        <div class="service-record-reminder-card is-overdue">
          <img src="/icons/超過2週.png" alt="超過2週">
          <div>
            <strong>您有 ${overdue.length} 筆服務紀錄單超過時間未繳交，請立即補交!!!</strong>
            <span>已滿或超過 14 天未繳交</span>
          </div>
        </div>
      ` : ''}
    </section>
  `
}
/* FOR-e V002-1H-4 END - service record reminder area */

function getPersonalOverdueTaskRows() {
  return schedules
    .filter(row => isActivePersonalSchedule(row))
    .filter(row => isMine(row))
    .filter(row => isOverdueSchedule(row))
    .filter(row => !isReminderSchedule(row))
    .sort((a, b) => String(a.start_date || '').localeCompare(String(b.start_date || '')))
}

function renderPersonalOverdueTaskArea() {
  const rows = getPersonalOverdueTaskRows()
  if (!rows.length) return ''

  return `
    <section class="personal-overdue-task-area">
      <div class="overdue-task-title">
        <div>
          <strong>任務逾期通知</strong>
          <span>已超過日期但尚未完成的個人任務</span>
        </div>
        <em>${rows.length} 筆</em>
      </div>

      <div class="overdue-task-list">
        ${rows.map(row => `
          <button type="button" class="overdue-task-card" data-view-schedule="${row.schedule_id}">
            <div>
              <strong>${escapeHtml(row.schedule_type || row.category)}｜${escapeHtml(row.title || '-')}</strong>
              <span>${escapeHtml(row.start_date || '-')}｜${escapeHtml(formatTime(row))}｜${escapeHtml(getAssigneeNames(row))}</span>
              ${row.customer_name || row.location_name ? `<span>${escapeHtml(row.customer_name || '')}${row.customer_name && row.location_name ? '｜' : ''}${escapeHtml(row.location_name || '')}</span>` : ''}
            </div>
            <b>超過時間了!!!</b>
          </button>
        `).join('')}
      </div>
    </section>
  `
}

function renderPersonalSchedule() {
  const myRows = schedules.filter(row => isActivePersonalSchedule(row) && isMine(row))
  const today = todayString()
  const todayRows = myRows.filter(row => scheduleMatchesDateByMode(row, today) && row.status !== '已完成' && row.status !== '取消')
  const overdueRows = getPersonalOverdueTaskRows()

  return `
    ${renderToolbar('個人行程表')}
    ${renderReadStatus()}
    ${renderServiceRecordReminderArea()}
    ${renderPersonalReminderArea()}
    ${renderPersonalOverdueTaskArea()}
    <div class="summary-grid">
      <div class="summary-card">
        <strong>${todayRows.length}</strong>
        <span>今日待處理</span>
      </div>
      <div class="summary-card">
        <strong>${overdueRows.length}</strong>
        <span>任務逾期</span>
      </div>
      <div class="summary-card">
        <strong>${myRows.length}</strong>
        <span>個人行程總數</span>
      </div>
    </div>
    ${renderScheduleList(myRows, '目前沒有個人行程。', true)}
  `
}

function renderPersonalTodoReminderNotice(todayRows, overdueRows, today) {
  return `
    <section class="personal-todo-notice ${todayRows.length ? 'has-today' : ''} ${overdueRows.length ? 'has-overdue' : ''}">
      <div class="todo-notice-header">
        <div>
          <strong>當日待辦提醒通知</strong>
          <span>${today}｜今天需處理 ${todayRows.length} 筆${overdueRows.length ? `｜另有 ${overdueRows.length} 筆逾期` : ''}</span>
        </div>
      </div>

      <div class="todo-notice-list">
        ${todayRows.length ? todayRows.map(row => `
          <button type="button" class="todo-notice-card" data-view-schedule="${row.schedule_id}">
            <div>
              <strong>${escapeHtml(formatTime(row))}｜${escapeHtml(row.schedule_type || row.category)}｜${escapeHtml(row.title || '-')}</strong>
              <span>${escapeHtml(row.customer_name || row.location_name || getAssigneeNames(row) || '個人待辦')}</span>
            </div>
            <em>查看</em>
          </button>
        `).join('') : '<div class="todo-notice-empty">今天沒有一般待辦事項。</div>'}
      </div>
    </section>
  `
}

function renderPersonalTodo() {
  const todoCategories = ['一般記事', '待辦事項', '請假 / 會議 / 活動 / 外訓', '證件交付']
  const myRows = schedules.filter(row => isActivePersonalSchedule(row) && isMine(row) && todoCategories.includes(row.category))
  const today = todayString()
  const todayRows = myRows.filter(row => scheduleMatchesDateByMode(row, today) && row.status !== '已完成' && row.status !== '取消')
  const overdueRows = myRows.filter(row => row.start_date && row.start_date < today && row.status !== '已完成' && row.status !== '取消')

  return `
    ${renderToolbar('個人一般待辦')}
    ${renderReadStatus()}
    ${renderPersonalTodoReminderNotice(todayRows, overdueRows, today)}
    ${todayRows.length ? `
      <section class="today-todo-list">
        <div class="section-title-row">
          <h4>當日待辦明細</h4>
          <span>${today}</span>
        </div>
        ${renderScheduleList(todayRows, '今天沒有待辦事項。', true)}
      </section>
    ` : ''}
    ${renderScheduleList(myRows, '目前沒有一般記事或待辦事項。', true)}
  `
}


function getMonday(date) {
  const d = new Date(date)
  const day = d.getDay()
  const diff = day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + diff)
  d.setHours(0, 0, 0, 0)
  return d
}

function addDays(date, days) {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

function toDateKey(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function getWeekDates(offset = 0) {
  const monday = getMonday(new Date())
  monday.setDate(monday.getDate() + offset * 7)
  return Array.from({ length: 7 }, (_, i) => addDays(monday, i))
}

function getWeekLabel(weekDates) {
  if (!weekDates.length) return ''
  return `${toDateKey(weekDates[0])} ～ ${toDateKey(weekDates[6])}`
}

const overviewFiltersStorageKey = 'for-e-overview-filters-v002'

function normalizeOverviewFilterList(value) {
  if (!value) return []
  const list = Array.isArray(value) ? value : [value]
  return [...new Set(list.map(item => String(item || '').trim()).filter(Boolean).filter(item => item !== '全部'))]
}

function normalizeOverviewFilters(value = {}) {
  const sortBy = ['display_order', 'department', 'name'].includes(value.sortBy) ? value.sortBy : 'display_order'
  const sortDir = value.sortDir === 'desc' ? 'desc' : 'asc'
  return {
    departments: normalizeOverviewFilterList(value.departments || value.department),
    staffIds: normalizeOverviewFilterList(value.staffIds || value.staffId),
    sortBy,
    sortDir
  }
}

function getOverviewFilterStorageKey() {
  const owner = currentProfile?.staff_id || currentProfile?.email || 'guest'
  return `${overviewFiltersStorageKey}-${owner}`
}

function loadOverviewFiltersPreference() {
  try {
    const raw = localStorage.getItem(getOverviewFilterStorageKey())
    overviewFilters = normalizeOverviewFilters(raw ? JSON.parse(raw) : overviewFilters)
  } catch (err) {
    console.warn('行程總覽篩選讀取失敗', err)
    overviewFilters = normalizeOverviewFilters()
  }
}

function saveOverviewFiltersPreference() {
  try {
    localStorage.setItem(getOverviewFilterStorageKey(), JSON.stringify(normalizeOverviewFilters(overviewFilters)))
  } catch (err) {
    console.warn('行程總覽篩選儲存失敗', err)
  }
}

function isOverviewDepartmentSelected(name) {
  return normalizeOverviewFilterList(overviewFilters.departments).includes(name)
}

function isOverviewStaffSelected(staffId) {
  return normalizeOverviewFilterList(overviewFilters.staffIds).includes(staffId)
}

function getOverviewFilterCountText() {
  const departments = normalizeOverviewFilterList(overviewFilters.departments)
  const staffIds = normalizeOverviewFilterList(overviewFilters.staffIds)

  if (!departments.length && !staffIds.length) return '全部'
  const parts = []
  if (departments.length) parts.push(`部門 ${departments.length}`)
  if (staffIds.length) parts.push(`人員 ${staffIds.length}`)
  return parts.join('｜')
}


function getCompactSelectedCountText(list, emptyText = '全部') {
  return list.length ? `${list.length} 項` : emptyText
}

function getOverviewDepartmentSelectedText() {
  return getCompactSelectedCountText(normalizeOverviewFilterList(overviewFilters.departments))
}

function getOverviewStaffSelectedText() {
  return getCompactSelectedCountText(normalizeOverviewFilterList(overviewFilters.staffIds))
}

function getOverviewFilterSummary() {
  const departments = normalizeOverviewFilterList(overviewFilters.departments)
  const staffIds = normalizeOverviewFilterList(overviewFilters.staffIds)
  const staffNames = staffIds
    .map(staffId => staffList.find(staff => staff.staff_id === staffId)?.name)
    .filter(Boolean)

  const deptText = departments.length ? departments.join('、') : '全部部門'
  const staffText = staffNames.length ? staffNames.join('、') : '全部人員'
  return `${deptText}｜${staffText}`
}

function renderCompactCheckOption(name, value, checked, inputName) {
  return `
    <label class="compact-check-option" title="${escapeHtml(name)}">
      <input type="checkbox" name="${escapeHtml(inputName)}" value="${escapeHtml(value)}" ${checked ? 'checked' : ''}>
      <span>${escapeHtml(name)}</span>
    </label>
  `
}


function getStaffSortOptions(selected = 'display_order') {
  const options = [
    ['display_order', '顯示順序'],
    ['department', '部門'],
    ['name', '姓名']
  ]
  return options.map(([value, label]) => `
    <option value="${value}" ${selected === value ? 'selected' : ''}>${label}</option>
  `).join('')
}

function getStaffSortDirOptions(selected = 'asc') {
  const options = [
    ['asc', '小到大 / A-Z'],
    ['desc', '大到小 / Z-A']
  ]
  return options.map(([value, label]) => `
    <option value="${value}" ${selected === value ? 'selected' : ''}>${label}</option>
  `).join('')
}

function sortStaffRowsByFilter(rows, filters = {}) {
  const sortBy = filters.sortBy || 'display_order'
  const sortDir = filters.sortDir === 'desc' ? -1 : 1

  return [...rows].sort((a, b) => {
    if (sortBy === 'display_order') {
      const aOrder = Number.isFinite(Number(a.display_order)) ? Number(a.display_order) : 999999
      const bOrder = Number.isFinite(Number(b.display_order)) ? Number(b.display_order) : 999999
      if (aOrder !== bOrder) return (aOrder - bOrder) * sortDir
      return String(a.name || '').localeCompare(String(b.name || ''), 'zh-Hant') * sortDir
    }

    if (sortBy === 'department') {
      const depCompare = String(a.department_name || '').localeCompare(String(b.department_name || ''), 'zh-Hant')
      if (depCompare !== 0) return depCompare * sortDir
      const orderCompare = (Number(a.display_order || 999999) - Number(b.display_order || 999999))
      if (orderCompare !== 0) return orderCompare
      return String(a.name || '').localeCompare(String(b.name || ''), 'zh-Hant')
    }

    return String(a.name || '').localeCompare(String(b.name || ''), 'zh-Hant') * sortDir
  })
}


function getOverviewDepartmentCheckboxes() {
  const rows = getOverviewBaseStaffRows()
  const names = [...new Set(rows.map(staff => staff.department_name).filter(Boolean))]
  if (!names.length) return `<div class="compact-check-empty">沒有部門資料</div>`
  return names.map(name => renderCompactCheckOption(name, name, isOverviewDepartmentSelected(name), 'departments')).join('')
}

function getOverviewStaffCheckboxes() {
  let rows = getOverviewBaseStaffRows()
  const selectedDepartments = normalizeOverviewFilterList(overviewFilters.departments)

  if (selectedDepartments.length) {
    rows = rows.filter(staff => selectedDepartments.includes(staff.department_name))
  }

  if (!rows.length) return `<div class="compact-check-empty">沒有可選人員</div>`
  return rows.map(staff => renderCompactCheckOption(`${staff.name}｜${staff.department_name || ''}`, staff.staff_id, isOverviewStaffSelected(staff.staff_id), 'staffIds')).join('')
}





function getOverviewStaffRows() {
  let rows = getOverviewBaseStaffRows()
  const selectedDepartments = normalizeOverviewFilterList(overviewFilters.departments)
  const selectedStaffIds = normalizeOverviewFilterList(overviewFilters.staffIds)

  if (selectedDepartments.length) {
    rows = rows.filter(staff => selectedDepartments.includes(staff.department_name))
  }

  if (selectedStaffIds.length) {
    rows = rows.filter(staff => selectedStaffIds.includes(staff.staff_id))
  }

  return sortStaffRowsByFilter(rows, overviewFilters)
}



function getOverviewBaseStaffRows() {
  const role = currentProfile?.role
  if (['管理員', '主管', '行政 / 海外'].includes(role)) return staffList

  const visibleStaffIds = new Set()
  schedules.forEach(row => {
    if (isMine(row)) {
      ;(row.schedule_assignees || []).forEach(item => {
        if (!item.deleted_at) visibleStaffIds.add(item.staff_id)
      })
    }
  })

  if (currentProfile?.staff_id) visibleStaffIds.add(currentProfile.staff_id)
  return staffList.filter(staff => visibleStaffIds.has(staff.staff_id))
}



function getSchedulesForStaffDate(staffId, dateKey) {
  return schedules.filter(row => {
    if (!isVisibleSchedule(row)) return false
    if (!scheduleMatchesDateByMode(row, dateKey)) return false
    return (row.schedule_assignees || []).some(item => item.staff_id === staffId && !item.deleted_at)
  })
}

function renderWeekScheduleCard(row) {
  const contentPreview = getFirstTwoLines(row.description)
  return `
    <button type="button" class="week-schedule-card ${row.status === '已完成' ? 'is-completed' : ''}" style="${getScheduleColorInlineStyle(row)}" data-view-schedule="${row.schedule_id}">
      <span class="week-card-time">${escapeHtml(formatTime(row))}</span>
      <strong>${escapeHtml(row.schedule_type || row.category)}｜${escapeHtml(row.title || '-')}</strong>
      ${contentPreview ? `<span class="week-card-preview">${escapeHtml(contentPreview).replaceAll('\n', ' / ')}</span>` : ''}
      <span class="week-card-preview">指派者：${escapeHtml(row.creator_name || '-')}</span>
      ${row.sub_type ? `<span class="week-card-extra">附加：${escapeHtml(row.sub_type)}</span>` : ''}
    </button>
  `
}


function renderScheduleOverview() {
  const weekDates = getWeekDates(overviewWeekOffset)
  const staffRows = getOverviewStaffRows()
  const todayKey = todayString()

  return `
    <div class="page-toolbar">
      <div>
        <h3>行程總覽</h3>
        <p class="muted">人員 × 週一～週日｜${getWeekLabel(weekDates)}</p>
      </div>
      <div class="toolbar-actions">
        <button class="secondary-btn" id="prevWeekBtn">上一週</button>
        <button class="secondary-btn" id="thisWeekBtn">本週</button>
        <button class="secondary-btn" id="nextWeekBtn">下一週</button>
        <button class="primary-btn" id="addScheduleBtn">新增行程</button>
        <button class="secondary-btn" id="refreshBtn">重新整理</button>
      </div>
    </div>

    ${renderReadStatus()}

    <form id="overviewFilterForm" class="overview-filter-panel overview-filter-panel-compact">
      <div class="overview-filter-compact-row">
        <details class="compact-multi-select compact-filter-control">
          <summary>部門｜${escapeHtml(getOverviewDepartmentSelectedText())}</summary>
          <div class="compact-check-panel">
            ${getOverviewDepartmentCheckboxes()}
          </div>
        </details>

        <details class="compact-multi-select compact-filter-control">
          <summary>人員｜${escapeHtml(getOverviewStaffSelectedText())}</summary>
          <div class="compact-check-panel">
            ${getOverviewStaffCheckboxes()}
          </div>
        </details>

        <label class="compact-sort-select compact-filter-control">
          <span class="compact-field-label">排序</span>
          <select name="sortBy">
            ${getStaffSortOptions(overviewFilters.sortBy)}
          </select>
        </label>

        <label class="compact-sort-select compact-filter-control">
          <span class="compact-field-label">順序</span>
          <select name="sortDir">
            ${getStaffSortDirOptions(overviewFilters.sortDir)}
          </select>
        </label>

        <button type="submit" class="primary-btn">套用並記住</button>
        <button type="button" class="secondary-btn" id="resetOverviewFilterBtn">全部</button>
      </div>

      <div class="overview-filter-summary compact-summary">
        目前：${escapeHtml(getOverviewFilterSummary())}
      </div>
    </form>

    <div class="week-overview-scroll">
      <table class="week-overview-table">
        <thead>
          <tr>
            <th class="staff-col">人員</th>
            ${weekDates.map(date => {
              const key = toDateKey(date)
              const weekName = ['週日', '週一', '週二', '週三', '週四', '週五', '週六'][date.getDay()]
              return `<th class="${key === todayKey ? 'is-today' : ''} ${isTaiwanHoliday(date) ? 'is-holiday' : ''}">
                <span>${weekName}</span>
                <strong>${key.slice(5)}</strong>
                ${renderHolidayLabels(key)}
              </th>`
            }).join('')}
          </tr>
        </thead>
        <tbody>
          ${staffRows.map(staff => `
            <tr>
              <th class="staff-name-cell">
                <strong>${escapeHtml(staff.name)}</strong>
                <span>${escapeHtml(staff.department_name || '')}</span>
              </th>
              ${weekDates.map(date => {
                const key = toDateKey(date)
                const dayRows = getSchedulesForStaffDate(staff.staff_id, key)
                return `<td class="week-day-cell ${key === todayKey ? 'is-today' : ''} ${isTaiwanHoliday(date) ? 'is-holiday' : ''}" data-week-date="${key}" data-staff-id="${staff.staff_id}">
                  ${dayRows.length ? dayRows.map(renderWeekScheduleCard).join('') : '<span class="week-empty">—</span>'}
                </td>`
              }).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    ${!staffRows.length ? '<div class="empty-state">目前沒有可顯示的人員。</div>' : ''}
  `
}


function renderReadStatus() {
  if (loadingSchedules) return `<div class="notice">正在讀取行程資料...</div>`
  if (schedulesError) return `<div class="error-card">讀取行程失敗：${schedulesError}</div>`
  return ''
}

function renderScheduleList(rows, emptyText, hideCategoryMeta = false) {
  if (!rows.length) return `<div class="empty-state">${emptyText}</div>`

  return `
    <div class="schedule-list">
      ${rows.map(row => {
        const contentPreview = getFirstTwoLines(row.description)
        const reminders = getReminderTokens(row)
        return `
          <div class="schedule-card ${row.status === '已完成' ? 'is-completed' : ''} ${row.status === '取消' ? 'is-cancelled' : ''}" style="${getScheduleColorInlineStyle(row)}">
            <div class="schedule-card-main">
              <div class="schedule-date">${formatDate(row.start_date)}${row.end_date && row.end_date !== row.start_date ? ' ～ ' + formatDate(row.end_date) : ''}｜${formatTime(row)}</div>
              <div class="schedule-title"><span class="schedule-type-prefix">${escapeHtml(row.schedule_type || row.category)}</span>｜${escapeHtml(row.title)}</div>
              ${contentPreview ? `<div class="schedule-content-preview">${escapeHtml(contentPreview).replaceAll('\n', '<br>')}</div>` : ''}
              ${hideCategoryMeta ? '' : `<div class="schedule-meta">${escapeHtml(row.category)}</div>`}
              ${row.sub_type ? `<div class="extra-schedule-chip">附加行程：${escapeHtml(row.sub_type)}</div>` : ''}
              <div class="schedule-meta">執行者：${escapeHtml(getAssigneeNames(row))}</div>
              ${row.customer_name ? `<div class="schedule-meta">區域 / 客戶：${escapeHtml(row.customer_name)}</div>` : ''}
              ${row.location_name ? `<div class="schedule-meta">地點：${escapeHtml(row.location_name)}</div>` : ''}
              ${reminders.length ? `<div class="reminder-tags">${reminders.map(item => `<span>${escapeHtml(item)}</span>`).join('')}</div>` : ''}
              ${row.need_service_record ? `<div class="service-record-hint ${row.service_record_submitted_date ? 'is-submitted' : 'is-missing'}">${row.service_record_submitted_date ? '服務紀錄單已交' : '服務紀錄單未填日期'}</div>` : ''}
            </div>
            <div class="schedule-card-actions">
              <span class="status-pill ${isNoCompletionControlSchedule(row) ? 'is-calendar-only' : ''}">${escapeHtml(getScheduleStatusLabel(row))}</span>
              <button class="small-secondary-btn" data-view-schedule="${row.schedule_id}">查看</button>\n              ${row.need_service_record ? `<button class="small-record-btn" data-record-schedule="${row.schedule_id}">紀錄單</button>` : ``}
            </div>
          </div>
        `
      }).join('')}
    </div>
  `
}


function getServiceRecordSchedule(record) {
  if (!record || !record.schedule_id) return null
  return schedules.find(row => row.schedule_id === record.schedule_id) || null
}

function getServiceRecordDepartment(record) {
  const schedule = getServiceRecordSchedule(record)
  return record.department_name || schedule?.department_name || '-'
}

function getServiceRecordScheduleType(record) {
  const schedule = getServiceRecordSchedule(record)
  return record.schedule_type || schedule?.schedule_type || schedule?.category || '-'
}

function getServiceRecordTitle(record) {
  const schedule = getServiceRecordSchedule(record)
  return record.title || schedule?.title || '-'
}

function getServiceRecordLocation(record) {
  const schedule = getServiceRecordSchedule(record)
  return record.location_name || schedule?.location_name || schedule?.customer_name || '-'
}

function getServiceRecordExecutor(record) {
  const schedule = getServiceRecordSchedule(record)
  const names = schedule ? getAssigneeNames(schedule) : ''
  return names && names !== '-' ? names : (record.staff_name || '-')
}

function getServiceRecordPeriodRows(records, period) {
  const today = todayString()
  const monthKey = today.slice(0, 7)
  const yearKey = today.slice(0, 4)

  return records.filter(isActiveServiceRecord).filter(record => {
    const dateText = String(record.schedule_date || '')
    if (period === 'month') return dateText.startsWith(monthKey)
    if (period === 'year') return dateText.startsWith(yearKey)
    return true
  })
}

function summarizeServiceRecordRows(records, getKey, getLabel) {
  const map = new Map()

  records.forEach(record => {
    const key = getKey(record)
    const label = getLabel(record)
    if (!map.has(key)) {
      map.set(key, {
        key,
        label,
        total: 0,
        pending: 0,
        overdue: 0,
        submitted: 0
      })
    }

    const item = map.get(key)
    const status = getServiceRecordStatus(record)
    item.total += 1
    if (status === '已繳交') item.submitted += 1
    if (status === '超過2週') item.overdue += 1
    if (status === '未繳交') item.pending += 1
  })

  return [...map.values()].sort((a, b) => {
    if (b.overdue !== a.overdue) return b.overdue - a.overdue
    if (b.pending !== a.pending) return b.pending - a.pending
    return b.total - a.total
  })
}

function renderServiceRecordMiniStats(row) {
  return `
    <div class="sr-mini-stats">
      <span><b>${row.total}</b>總數</span>
      <span><b>${row.pending}</b>未繳</span>
      <span class="${row.overdue ? 'is-alert' : ''}"><b>${row.overdue}</b>逾期</span>
      <span><b>${row.submitted}</b>已交</span>
    </div>
  `
}

function renderServiceRecordPersonPeriodStatus(records, period, title) {
  const rows = getServiceRecordPeriodRows(records, period)
  const summaries = summarizeServiceRecordRows(
    rows,
    record => record.staff_id || record.staff_name || '未指定',
    record => record.staff_name || '-'
  )

  return `
    <section class="sr-status-section">
      <div class="section-title-row">
        <h4>${title}</h4>
        <span>${rows.length} 筆紀錄</span>
      </div>
      ${summaries.length ? `
        <div class="sr-person-table-wrap">
          <table class="sr-person-status-table">
            <thead>
              <tr>
                <th>人員</th>
                <th>總數</th>
                <th>未繳</th>
                <th>逾期</th>
                <th>已交</th>
              </tr>
            </thead>
            <tbody>
              ${summaries.map(row => `
                <tr class="${row.overdue ? 'has-overdue' : ''}">
                  <td>${escapeHtml(row.label)}</td>
                  <td>${row.total}</td>
                  <td>${row.pending}</td>
                  <td class="${row.overdue ? 'is-alert' : ''}">${row.overdue}</td>
                  <td>${row.submitted}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      ` : '<div class="empty-state">目前沒有符合條件的繳交狀況。</div>'}
    </section>
  `
}


function renderServiceRecordPersonCombinedStatus(records) {
  const monthRows = getServiceRecordPeriodRows(records, 'month')
  const yearRows = getServiceRecordPeriodRows(records, 'year')

  const monthSummaryMap = new Map(
    summarizeServiceRecordRows(
      monthRows,
      record => record.staff_id || record.staff_name || '未指定',
      record => record.staff_name || '-'
    ).map(row => [row.key, row])
  )

  const yearSummaryRows = summarizeServiceRecordRows(
    yearRows,
    record => record.staff_id || record.staff_name || '未指定',
    record => record.staff_name || '-'
  )

  const zero = { total: 0, pending: 0, overdue: 0, submitted: 0 }

  return `
    <section class="sr-status-section sr-person-combined-section">
      <div class="section-title-row">
        <h4>個人員繳交狀況</h4>
        <span>同表顯示當月 / 當年，不再一人一格</span>
      </div>

      ${yearSummaryRows.length ? `
        <div class="sr-person-combined-wrap">
          <table class="sr-person-combined-table">
            <thead>
              <tr>
                <th rowspan="2">人員</th>
                <th colspan="4">當月</th>
                <th colspan="4">當年</th>
              </tr>
              <tr>
                <th>總數</th>
                <th>未繳</th>
                <th>逾期</th>
                <th>已交</th>
                <th>總數</th>
                <th>未繳</th>
                <th>逾期</th>
                <th>已交</th>
              </tr>
            </thead>
            <tbody>
              ${yearSummaryRows.map(yearRow => {
                const monthRow = monthSummaryMap.get(yearRow.key) || zero
                return `
                  <tr class="${yearRow.overdue || monthRow.overdue ? 'has-overdue' : ''}">
                    <td>${escapeHtml(yearRow.label)}</td>
                    <td>${monthRow.total}</td>
                    <td>${monthRow.pending}</td>
                    <td class="${monthRow.overdue ? 'is-alert' : ''}">${monthRow.overdue}</td>
                    <td>${monthRow.submitted}</td>
                    <td>${yearRow.total}</td>
                    <td>${yearRow.pending}</td>
                    <td class="${yearRow.overdue ? 'is-alert' : ''}">${yearRow.overdue}</td>
                    <td>${yearRow.submitted}</td>
                  </tr>
                `
              }).join('')}
            </tbody>
          </table>
        </div>
      ` : '<div class="empty-state">目前沒有符合條件的繳交狀況。</div>'}
    </section>
  `
}

function getDepartmentGroupName(departmentName) {
  const text = String(departmentName || '')
  if (text.includes('一部')) return '一部'
  if (text.includes('二部')) return '二部'
  return '其他'
}

function renderServiceRecordDepartmentStatus(records) {
  const monthRows = getServiceRecordPeriodRows(records, 'month')
  const yearRows = getServiceRecordPeriodRows(records, 'year')

  const buildGroupSummary = rows => {
    const result = {
      '一部': { key: '一部', label: '一部', total: 0, pending: 0, overdue: 0, submitted: 0 },
      '二部': { key: '二部', label: '二部', total: 0, pending: 0, overdue: 0, submitted: 0 }
    }

    rows.forEach(record => {
      const group = getDepartmentGroupName(getServiceRecordDepartment(record))
      if (!result[group]) return

      const item = result[group]
      const status = getServiceRecordStatus(record)
      item.total += 1
      if (status === '已繳交') item.submitted += 1
      if (status === '超過2週') item.overdue += 1
      if (status === '未繳交') item.pending += 1
    })

    return result
  }

  const monthSummary = buildGroupSummary(monthRows)
  const yearSummary = buildGroupSummary(yearRows)

  return `
    <section class="sr-status-section">
      <div class="section-title-row">
        <h4>一部、二部繳交狀況</h4>
        <span>當月 / 當年</span>
      </div>
      <div class="sr-department-grid">
        ${['一部', '二部'].map(name => `
          <div class="sr-department-card">
            <strong>${name}</strong>
            <div class="sr-department-period">
              <span>當月</span>
              ${renderServiceRecordMiniStats(monthSummary[name])}
            </div>
            <div class="sr-department-period">
              <span>當年</span>
              ${renderServiceRecordMiniStats(yearSummary[name])}
            </div>
          </div>
        `).join('')}
      </div>
    </section>
  `
}

function renderServiceRecordDetailTitle() {
  return `
    <div class="section-title-row">
      <h4>繳交明細</h4>
      <span>顯示執行者，不顯示行程內容</span>
    </div>
  `
}

function getServiceRecordDepartmentOptions() {
  return ['全部', ...new Set(serviceRecords.map(getServiceRecordDepartment).filter(item => item && item !== '-'))]
}

function getServiceRecordTypeOptions() {
  return ['全部', ...new Set(serviceRecords.map(getServiceRecordScheduleType).filter(item => item && item !== '-'))]
}

function buildServiceRecordOptionList(items, selectedValue) {
  return items.map(item => `<option value="${escapeHtml(item)}" ${selectedValue === item ? 'selected' : ''}>${escapeHtml(item)}</option>`).join('')
}

function getServiceRecordMonthlyRows(records) {
  const monthKey = todayString().slice(0, 7)
  return records.filter(isActiveServiceRecord).filter(record => String(record.schedule_date || '').startsWith(monthKey))
}

function getServiceRecordStaffSummary(records) {
  const map = new Map()

  records.forEach(record => {
    const key = record.staff_id || record.staff_name || '未指定'
    if (!map.has(key)) {
      map.set(key, {
        staffName: record.staff_name || '-',
        departmentName: getServiceRecordDepartment(record),
        total: 0,
        pending: 0,
        overdue: 0,
        submitted: 0
      })
    }

    const item = map.get(key)
    const status = getServiceRecordStatus(record)
    item.total += 1
    if (status === '已繳交') item.submitted += 1
    if (status === '超過2週') item.overdue += 1
    if (status === '未繳交') item.pending += 1
  })

  return [...map.values()].sort((a, b) => {
    if (b.overdue !== a.overdue) return b.overdue - a.overdue
    if (b.pending !== a.pending) return b.pending - a.pending
    return b.total - a.total
  })
}

function renderServiceRecordStaffSummary(records, onlyMine = false) {
  if (onlyMine) return ''

  const rows = getServiceRecordStaffSummary(records)
  if (!rows.length) return ''

  return `
    <div class="service-record-staff-summary">
      <div class="section-title-row">
        <h4>人員繳交統計</h4>
        <span>依超過2週與未繳交排序</span>
      </div>
      <div class="service-record-staff-grid">
        ${rows.map(row => `
          <div class="service-record-staff-card ${row.overdue ? 'has-overdue' : ''}">
            <strong>${escapeHtml(row.staffName)}</strong>
            <span>${escapeHtml(row.departmentName || '-')}</span>
            <div>
              <b>${row.total}</b><small>總數</small>
              <b>${row.pending}</b><small>未繳</small>
              <b>${row.overdue}</b><small>逾期</small>
              <b>${row.submitted}</b><small>已交</small>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `
}

function getServiceRecordStatus(record) {
  if (record.submitted || record.submitted_date) return '已繳交'

  const scheduleDate = record.schedule_date
  if (!scheduleDate) return '未繳交'

  const diffMs = new Date(todayString()) - new Date(scheduleDate)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffDays >= 14) return '超過2週'
  return '未繳交'
}

function getServiceRecordDays(record) {
  if (!record.schedule_date) return '-'
  const diffMs = new Date(todayString()) - new Date(record.schedule_date)
  const diffDays = Math.max(0, Math.floor(diffMs / 86400000))
  return `${diffDays} 天`
}

function matchesServiceRecordFilters(record, onlyMine = false) {
  if (!isActiveServiceRecord(record)) return false
  if (onlyMine && currentProfile?.staff_id && record.staff_id !== currentProfile.staff_id) return false

  const status = getServiceRecordStatus(record)
  if (serviceRecordFilters.status !== '全部' && status !== serviceRecordFilters.status) return false

  if (serviceRecordFilters.staffId !== '全部' && record.staff_id !== serviceRecordFilters.staffId) return false

  if ((serviceRecordFilters.department || '全部') !== '全部' && getServiceRecordDepartment(record) !== serviceRecordFilters.department) return false
  if ((serviceRecordFilters.scheduleType || '全部') !== '全部' && getServiceRecordScheduleType(record) !== serviceRecordFilters.scheduleType) return false

  const keyword = normalizeText(serviceRecordFilters.keyword)
  if (keyword) {
    const schedule = getServiceRecordSchedule(record)
    const haystack = [
      record.staff_name,
      getServiceRecordDepartment(record),
      getServiceRecordScheduleType(record),
      getServiceRecordTitle(record),
      getServiceRecordLocation(record),
      schedule?.description,
      schedule?.sub_type_note
    ].filter(Boolean).join(' ').toLowerCase()

    if (!haystack.includes(keyword)) return false
  }

  if (serviceRecordFilters.startDate && record.schedule_date < serviceRecordFilters.startDate) return false
  if (serviceRecordFilters.endDate && record.schedule_date > serviceRecordFilters.endDate) return false

  return true
}

function renderServiceRecordFilterForm(onlyMine = false) {
  const statusOptions = ['全部', '未繳交', '超過2週', '已繳交']
    .map(item => `<option value="${item}" ${serviceRecordFilters.status === item ? 'selected' : ''}>${item}</option>`)
    .join('')

  const departmentOptions = buildServiceRecordOptionList(getServiceRecordDepartmentOptions(), serviceRecordFilters.department || '全部')
  const typeOptions = buildServiceRecordOptionList(getServiceRecordTypeOptions(), serviceRecordFilters.scheduleType || '全部')

  const staffOptions = onlyMine
    ? ''
    : `<label>
        翻譯 / 人員
        <select name="staffId">
          <option value="全部" ${serviceRecordFilters.staffId === '全部' ? 'selected' : ''}>全部人員</option>
          ${staffList.map(staff => `<option value="${staff.staff_id}" ${serviceRecordFilters.staffId === staff.staff_id ? 'selected' : ''}>${staff.name}｜${staff.department_name}</option>`).join('')}
        </select>
      </label>`

  const departmentField = onlyMine
    ? ''
    : `<label>
        部門
        <select name="department">${departmentOptions}</select>
      </label>`

  return `
    <form id="serviceRecordFilterForm" class="service-record-filter service-record-filter-upgraded">
      <label>
        狀態
        <select name="status">${statusOptions}</select>
      </label>

      ${staffOptions}
      ${departmentField}

      <label>
        行程類型
        <select name="scheduleType">${typeOptions}</select>
      </label>

      <label>
        起日
        <input name="startDate" type="date" value="${serviceRecordFilters.startDate}">
      </label>

      <label>
        迄日
        <input name="endDate" type="date" value="${serviceRecordFilters.endDate}">
      </label>

      <label class="service-record-keyword-filter">
        關鍵字
        <input name="keyword" value="${escapeHtml(serviceRecordFilters.keyword || '')}" placeholder="搜尋客戶、行程、內容、人員">
      </label>

      <button type="submit" class="primary-btn">篩選</button>
    </form>
  `
}

function renderServiceRecordSummary(records) {
  const monthlyRows = getServiceRecordMonthlyRows(records)

  return `
    <div class="summary-grid service-record-summary service-record-summary-upgraded">
      <div class="summary-card">
        <strong>${records.length}</strong>
        <span>紀錄單總數</span>
      </div>
      <div class="summary-card">
        <strong>${records.filter(row => getServiceRecordStatus(row) === '未繳交').length}</strong>
        <span>未繳交</span>
      </div>
      <div class="summary-card">
        <strong>${records.filter(row => getServiceRecordStatus(row) === '超過2週').length}</strong>
        <span>超過2週</span>
      </div>
      <div class="summary-card">
        <strong>${records.filter(row => getServiceRecordStatus(row) === '已繳交').length}</strong>
        <span>已繳交</span>
      </div>
      <div class="summary-card">
        <strong>${monthlyRows.length}</strong>
        <span>本月紀錄</span>
      </div>
    </div>
  `
}

function renderServiceRecordList(records, emptyText) {
  if (!records.length) return `<div class="empty-state">${emptyText}</div>`

  return `
    <div class="service-record-list">
      ${records.map(record => {
        const schedule = getServiceRecordSchedule(record)
        const status = getServiceRecordStatus(record)
        const scheduleType = getServiceRecordScheduleType(record)
        const title = getServiceRecordTitle(record)
        const location = getServiceRecordLocation(record)

        return `
          <div class="service-record-row status-${status}">
            <div class="service-record-date">
              <strong>${escapeHtml(record.schedule_date || '-')}</strong>
              <span>${escapeHtml(getServiceRecordDays(record))}</span>
            </div>

            <div class="service-record-main">
              <div class="service-record-title">${escapeHtml(scheduleType)}｜${escapeHtml(title)}</div>
              <div class="service-record-meta">
                執行者：${escapeHtml(getServiceRecordExecutor(record))}
              </div>
              <div class="service-record-meta">
                繳交人：${escapeHtml(record.staff_name || '-')}｜${escapeHtml(getServiceRecordDepartment(record))}｜${escapeHtml(location)}
              </div>
            </div>

            <div class="service-record-status-wrap">
              <span class="record-status-pill">${escapeHtml(status)}</span>
              ${record.submitted_date ? `<span class="record-submit-date">${escapeHtml(record.submitted_date)}</span>` : ''}
            </div>

            <div class="service-record-action">
              ${record.schedule_id ? `<button class="small-record-btn" data-record-schedule="${record.schedule_id}">繳交狀況</button>` : ''}
              ${record.schedule_id ? `<button class="small-secondary-btn" data-view-schedule="${record.schedule_id}">查看</button>` : ''}
            </div>
          </div>
        `
      }).join('')}
    </div>
  `
}


function renderServiceRecordSimplePeriodTable(title, subtitle, rows, firstColumnTitle = '人員') {
  return `
    <section class="clean-stats-section service-record-period-section">
      <div class="section-title-row">
        <h4>${title}</h4>
        <span>${subtitle}</span>
      </div>
      ${rows.length ? `
        <div class="simple-stat-table-wrap service-record-period-wrap">
          <div class="simple-stat-table service-record-period-table">
            <div class="simple-stat-head">
              <span>${firstColumnTitle}</span>
              <span>總數</span>
              <span>未繳</span>
              <span>逾期</span>
              <span>已交</span>
            </div>
            ${rows.map(row => `
              <div class="simple-stat-row ${row.overdue ? 'has-overdue' : ''}">
                <strong>${escapeHtml(row.label)}</strong>
                <span>${row.total}</span>
                <span>${row.pending}</span>
                <span class="${row.overdue ? 'is-alert' : ''}">${row.overdue}</span>
                <span>${row.submitted}</span>
              </div>
            `).join('')}
          </div>
        </div>
      ` : '<div class="empty-state">目前沒有符合條件的服務紀錄單。</div>'}
    </section>
  `
}

function renderServiceRecordPersonSplitStatusV3(records) {
  const monthRows = summarizeServiceRecordRows(
    getServiceRecordPeriodRows(records, 'month'),
    record => record.staff_id || record.staff_name || '未指定',
    record => record.staff_name || '-'
  )
  const yearRows = summarizeServiceRecordRows(
    getServiceRecordPeriodRows(records, 'year'),
    record => record.staff_id || record.staff_name || '未指定',
    record => record.staff_name || '-'
  )

  return `
    ${renderServiceRecordSimplePeriodTable('當月個人員繳交狀況', '只看當月資料', monthRows, '人員')}
    ${renderServiceRecordSimplePeriodTable('當年個人員繳交狀況', '只看當年資料', yearRows, '人員')}
  `
}

function summarizeServiceRecordDepartmentGroupRows(records) {
  const base = {
    '一部': { key: '一部', label: '一部', total: 0, pending: 0, overdue: 0, submitted: 0 },
    '二部': { key: '二部', label: '二部', total: 0, pending: 0, overdue: 0, submitted: 0 }
  }

  records.forEach(record => {
    const group = getDepartmentGroupName(getServiceRecordDepartment(record))
    if (!base[group]) return
    const item = base[group]
    const status = getServiceRecordStatus(record)
    item.total += 1
    if (status === '已繳交') item.submitted += 1
    if (status === '超過2週') item.overdue += 1
    if (status === '未繳交') item.pending += 1
  })

  return [base['一部'], base['二部']]
}

function renderServiceRecordDepartmentSplitStatusV3(records) {
  const monthRows = summarizeServiceRecordDepartmentGroupRows(getServiceRecordPeriodRows(records, 'month'))
  const yearRows = summarizeServiceRecordDepartmentGroupRows(getServiceRecordPeriodRows(records, 'year'))

  return `
    ${renderServiceRecordSimplePeriodTable('當月一部、二部繳交狀況', '部門當月資料', monthRows, '部門')}
    ${renderServiceRecordSimplePeriodTable('當年一部、二部繳交狀況', '部門當年資料', yearRows, '部門')}
  `
}


function renderServiceRecordDashboard() {
  const records = serviceRecords.filter(record => matchesServiceRecordFilters(record, false))

  return `
    <div class="page-toolbar">
      <div>
        <h3>服務紀錄單</h3>
        <p class="muted">管理員 / 主管查看全部服務紀錄單繳交狀況。</p>
      </div>
      <div class="toolbar-actions">
        <button class="secondary-btn" id="resetServiceRecordFilterBtn">清除條件</button>
        <button class="secondary-btn" id="refreshBtn">重新整理</button>
      </div>
    </div>

    ${serviceRecordsLoading ? '<div class="notice">正在讀取服務紀錄單...</div>' : ''}
    ${serviceRecordsError ? `<div class="error-card">讀取服務紀錄單失敗：${escapeHtml(serviceRecordsError)}</div>` : ''}

    ${renderServiceRecordFilterForm(false)}
    ${renderServiceRecordSummary(records)}
    ${renderServiceRecordPersonSplitStatusV3(records)}
    ${renderServiceRecordDepartmentSplitStatusV3(records)}
    ${renderServiceRecordDetailTitle()}
    ${renderServiceRecordList(records, '目前沒有符合條件的服務紀錄單。')}
  `
}


function renderRecordSubmit() {
  const records = serviceRecords.filter(record => matchesServiceRecordFilters(record, true))

  return `
    <div class="page-toolbar">
      <div>
        <h3>紀錄單繳交</h3>
        <p class="muted">翻譯查看自己的服務紀錄單繳交狀況。</p>
      </div>
      <div class="toolbar-actions">
        <button class="secondary-btn" id="resetServiceRecordFilterBtn">清除條件</button>
        <button class="secondary-btn" id="refreshBtn">重新整理</button>
      </div>
    </div>

    ${serviceRecordsLoading ? '<div class="notice">正在讀取紀錄單繳交狀況...</div>' : ''}
    ${serviceRecordsError ? `<div class="error-card">讀取紀錄單失敗：${escapeHtml(serviceRecordsError)}</div>` : ''}
    ${renderServiceRecordReminderArea()}

    ${renderServiceRecordFilterForm(true)}
    ${renderServiceRecordSummary(records)}
    ${renderServiceRecordDetailTitle()}
    ${renderServiceRecordList(records, '目前沒有需要繳交的服務紀錄單。')}
  `
}

function getUserAccountDepartmentOptions() {
  const sourceRows = (allStaffList.length ? allStaffList : staffList).filter(staff => !isStaffDeleted(staff))
  const names = ['全部', ...new Set(sourceRows.map(staff => staff.department_name).filter(Boolean))]
  return names.map(name => `<option value="${escapeHtml(name)}" ${userAccountFilters.department === name ? 'selected' : ''}>${escapeHtml(name)}</option>`).join('')
}

function getUserAccountRoleOptions() {
  const sourceRows = (allStaffList.length ? allStaffList : staffList).filter(staff => !isStaffDeleted(staff))
  const roles = ['全部', ...new Set(sourceRows.map(staff => staff.role).filter(Boolean))]
  return roles.map(role => `<option value="${escapeHtml(role)}" ${userAccountFilters.role === role ? 'selected' : ''}>${escapeHtml(role)}</option>`).join('')
}

function matchesUserAccountFilters(staff) {
  if (userAccountFilters.department !== '全部' && staff.department_name !== userAccountFilters.department) return false
  if (userAccountFilters.role !== '全部' && staff.role !== userAccountFilters.role) return false

  const isFieldStaff = isStaffFieldWorker(staff)
  if (userAccountFilters.fieldStaff === '是' && !isFieldStaff) return false
  if (userAccountFilters.fieldStaff === '否' && isFieldStaff) return false

  const keyword = normalizeText(userAccountFilters.keyword)
  if (!keyword) return true

  const text = [
    staff.name,
    staff.department_name,
    staff.position,
    staff.role,
    getStaffDisplayStatus(staff),
    isFieldStaff ? '外務人員' : ''
  ].filter(Boolean).join(' ').toLowerCase()

  return text.includes(keyword)
}

function getUsersDepartmentSummary(rows) {
  const map = new Map()

  rows.forEach(staff => {
    const department = staff.department_name || '未設定部門'
    map.set(department, (map.get(department) || 0) + 1)
  })

  return [...map.entries()]
    .map(([department, count]) => ({ department, count }))
    .sort((a, b) => {
      if (a.department === '未設定部門') return 1
      if (b.department === '未設定部門') return -1
      return a.department.localeCompare(b.department, 'zh-Hant')
    })
}

function renderUsersSummary(rows) {
  const activeCount = rows.filter(staff => !isStaffDeleted(staff) && (staff.status || '啟用') === '啟用').length
  const disabledCount = rows.filter(staff => !isStaffDeleted(staff) && staff.status === '停用').length
  const fieldStaffCount = rows.filter(isStaffFieldWorker).length
  const boundAccountCount = rows.filter(staff => Boolean(getStaffLoginEmail(staff))).length
  const departmentStats = getUsersDepartmentSummary(rows)

  return `
    <div class="summary-grid users-summary-grid users-department-summary-grid">
      <div class="summary-card users-summary-total">
        <strong>${rows.length}</strong>
        <span>人員總數</span>
      </div>
      <div class="summary-card">
        <strong>${activeCount}</strong>
        <span>啟用人員</span>
      </div>
      <div class="summary-card">
        <strong>${disabledCount}</strong>
        <span>停用人員</span>
      </div>
      <div class="summary-card">
        <strong>${fieldStaffCount}</strong>
        <span>外務人員</span>
      </div>
      <div class="summary-card">
        <strong>${boundAccountCount}</strong>
        <span>已綁定帳號</span>
      </div>

      ${departmentStats.map(item => `
        <div class="summary-card users-dept-card">
          <strong>${item.count}</strong>
          <span>${escapeHtml(item.department)}</span>
        </div>
      `).join('')}
    </div>
  `
}

function renderUsersList(rows) {
  if (!rows.length) {
    return `<div class="empty-state">目前沒有符合條件的人員。</div>`
  }

  const canEditUserAccount = canManageUsers()
  const canToggleFieldStaff = canToggleUserFieldStaff()

  return `
    <div class="users-table-wrap">
      <div class="users-table users-table-field-staff users-table-account-manage users-table-login-manage users-table-permission-view">
        <div class="users-table-head">
          <span>人員名稱</span>
          <span>部門</span>
          <span>職務</span>
          <span>角色</span>
          <span>登入帳號</span>
          <span>外務</span>
          <span>狀態</span>
          <span>操作</span>
        </div>

        ${rows.map(staff => {
          const loginEmail = getStaffLoginEmail(staff)
          const ownPasswordEmail = getOwnPasswordEmail(staff)
          const selfPasswordButton = ownPasswordEmail
            ? `<button type="button" class="user-action-btn is-self-password" data-change-own-password="${escapeHtml(ownPasswordEmail)}">密碼</button>`
            : ''
          const statusText = getStaffDisplayStatus(staff)
          const canShowActions = canEditUserAccount
          const actionButtons = canShowActions
            ? `
                <button type="button" class="user-action-btn is-edit" data-edit-user="${staff.staff_id}" ${canEditUserProfile(staff) ? '' : 'disabled'}>修改</button>
                ${selfPasswordButton}
                ${canResetUserPassword(staff)
                  ? `<button type="button" class="user-action-btn is-reset" data-reset-password-email="${escapeHtml(loginEmail)}" data-reset-password-name="${escapeHtml(staff.name || '')}">重設</button>`
                  : ''
                }
                ${canRebindUserLogin(staff)
                  ? `<button type="button" class="user-action-btn is-rebind" data-rebind-login-staff="${staff.staff_id}">重綁</button>`
                  : ''
                }
                ${canCreateUserLogin(staff)
                  ? `<button type="button" class="user-action-btn is-create" data-create-login-staff="${staff.staff_id}">綁定</button>`
                  : ''
                }
                ${canActivateUserProfile(staff)
                  ? `<button type="button" class="user-action-btn is-activate" data-activate-user="${staff.staff_id}" data-activate-user-name="${escapeHtml(staff.name || '')}">啟用</button>`
                  : ''
                }
                ${canDeleteUserProfile(staff)
                  ? `<button type="button" class="user-action-btn is-delete" data-delete-user="${staff.staff_id}" data-delete-user-name="${escapeHtml(staff.name || '')}">刪除</button>`
                  : ''
                }
              `
            : `${selfPasswordButton}${selfPasswordButton ? '' : `<span class="users-action-muted">${canToggleFieldStaff ? '可調整外務' : '僅檢視'}</span>`}`

          return `
            <div class="users-table-row ${statusText === '停用' ? 'is-disabled-user' : ''} ${statusText === '已刪除' ? 'is-deleted-user' : ''}">
              <strong>${escapeHtml(staff.name || '-')}</strong>
              <span>${escapeHtml(staff.department_name || '-')}</span>
              <span>${escapeHtml(staff.position || '-')}</span>
              <span>${escapeHtml(staff.role || '-')}</span>
              <div class="login-account-cell">
                <span class="login-status-pill ${getStaffLoginStatusClass(staff)}">${getStaffLoginStatus(staff)}</span>
                ${loginEmail ? `<small>${escapeHtml(loginEmail)}</small>` : `<small>尚未建立登入帳號</small>`}
              </div>
              <label class="field-staff-toggle compact-field-toggle" title="是否為外務人員：${isStaffFieldWorker(staff) ? '是' : '否'}">
                <input type="checkbox" data-field-staff-toggle="${staff.staff_id}" ${isStaffFieldWorker(staff) ? 'checked' : ''} ${canToggleFieldStaff ? '' : 'disabled'}>
                <span class="field-staff-switch" aria-hidden="true"></span>
              </label>
              <span class="user-status-pill ${getStaffStatusClass(staff)}">${escapeHtml(statusText)}</span>
              <div class="users-action-stack users-action-stack-polished">
                ${actionButtons}
              </div>
            </div>
          `
        }).join('')}
      </div>
    </div>
  `
}

function renderUsersPage() {
  const sourceRows = allStaffList.length ? allStaffList : staffList
  const rows = getUserAccountVisibleRows(sourceRows).filter(matchesUserAccountFilters)
  const canEditUserAccount = canManageUsers()
  const canViewAllAccounts = canViewAllUserAccounts()

  return `
    <div class="page-toolbar">
      <div>
        <h3>人員 / 帳號</h3>
        <p class="muted">依角色顯示帳號資訊：管理員可全部管理；主管可看全部並調整外務；其他角色只看自己的帳號資訊。</p>
      </div>
      <div class="toolbar-actions">
        <button class="secondary-btn self-password-btn" id="changeMyPasswordBtn">修改我的密碼</button>
        ${canEditUserAccount ? '<button class="secondary-btn" id="checkLoginFunctionBtn">檢查帳號功能</button><button class="primary-btn" id="addUserAccountBtn">新增人員</button>' : ''}
        ${canViewAllAccounts ? '<button class="secondary-btn" id="resetUsersFilterBtn">清除條件</button>' : ''}
        <button class="secondary-btn" id="refreshBtn">重新整理</button>
      </div>
    </div>

    <div class="notice">
      人員 / 帳號檢視權限：管理員可全部管理；主管可檢視全部並修改「是否外務人員」；行政 / 海外、翻譯、外務 / 宿管人員 / 會計、一般職員只可查看自己的帳號資訊。所有角色都可以修改自己的密碼。管理員可用「重綁」重新綁定登入帳號；按「刪除」會永久移除人員且不再顯示在人員名單；若只是不使用，請修改狀態為「停用」，停用人員會留在人員名單上。
    </div>
    ${renderAppSettingSyncNotice()}

    ${canViewAllAccounts ? `
      <form id="usersFilterForm" class="users-filter-panel users-filter-panel-field-staff">
        <label>
          關鍵字
          <input name="keyword" value="${escapeHtml(userAccountFilters.keyword)}" placeholder="搜尋姓名、部門、職務、角色">
        </label>

        <label>
          部門
          <select name="department">${getUserAccountDepartmentOptions()}</select>
        </label>

        <label>
          角色
          <select name="role">${getUserAccountRoleOptions()}</select>
        </label>

        <label>
          是否外務人員
          <select name="fieldStaff">
            <option value="全部" ${userAccountFilters.fieldStaff === '全部' ? 'selected' : ''}>全部</option>
            <option value="是" ${userAccountFilters.fieldStaff === '是' ? 'selected' : ''}>是</option>
            <option value="否" ${userAccountFilters.fieldStaff === '否' ? 'selected' : ''}>否</option>
          </select>
        </label>

        <button type="submit" class="primary-btn">篩選</button>
      </form>
    ` : '<div class="notice user-self-only-notice">目前角色只顯示自己的帳號資訊；如需修改基本資料請洽管理員，但可以自行修改登入密碼。</div>'}

    <section class="current-user-card">
      <div>
        <span>目前登入帳號</span>
        <strong>${escapeHtml(currentProfile.name || currentProfile.email)}</strong>
      </div>
      <p>${escapeHtml(currentProfile.role || '-')}｜${escapeHtml(currentProfile.department_name || '-')}｜${escapeHtml(currentProfile.position_name || currentProfile.position || '-')}</p>
    </section>

    ${renderUsersSummary(rows)}
    ${renderUsersList(rows)}
  `
}


function getUserManageRows() {
  const rows = allStaffList.length ? allStaffList : staffList
  return (rows || []).filter(staff => !isStaffDeleted(staff))
}


function normalizeStaffId(value) {
  const text = String(value || '').trim()
  if (!text || text === 'undefined' || text === 'null') return ''
  return text
}

function getStaffSnapshotForFunction(staff) {
  if (!staff) return null
  return {
    staff_id: normalizeStaffId(staff.staff_id),
    name: staff.name || '',
    department_id: staff.department_id || null,
    department_name: staff.department_name || '',
    position: staff.position || staff.position_name || '',
    role: staff.role || '一般職員',
    status: staff.status || '啟用',
    display_order: staff.display_order || null
  }
}



function getUserManageRoleOptions(selectedRole = '') {
  const roles = ['管理員', '主管', '行政 / 海外', '翻譯', '外務 / 宿管人員 / 會計', '一般職員']
  return roles.map(role => `<option value="${escapeHtml(role)}" ${role === selectedRole ? 'selected' : ''}>${escapeHtml(role)}</option>`).join('')
}

function getUserManageDepartmentOptions(selectedDepartment = '') {
  const names = [...getManagedUserDepartmentOptions()]
  if (selectedDepartment && !names.includes(selectedDepartment)) names.unshift(selectedDepartment)

  return names.map(name => `<option value="${escapeHtml(name)}" ${name === selectedDepartment ? 'selected' : ''}>${escapeHtml(name)}</option>`).join('')
}


function getUserManagePositionOptions(selectedPosition = '') {
  const positions = [...getManagedUserPositionOptions()]
  if (selectedPosition && !positions.includes(selectedPosition) && !isRemovedUserManagePosition(selectedPosition)) {
    positions.unshift(selectedPosition)
  }

  return `<option value="">請選擇職務</option>` + positions.map(position => `
    <option value="${escapeHtml(position)}" ${position === selectedPosition ? 'selected' : ''}>${escapeHtml(position)}</option>
  `).join('')
}


function getDepartmentIdByName(name) {
  const row = getUserManageRows().find(staff => staff.department_name === name && staff.department_id)
  return row?.department_id || null
}


function makeUuidForClient() {
  if (window.crypto?.randomUUID) return window.crypto.randomUUID()
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, char => {
    const random = Math.random() * 16 | 0
    const value = char === 'x' ? random : (random & 0x3 | 0x8)
    return value.toString(16)
  })
}

function getDepartmentNameFromRow(row) {
  return row?.department_name || row?.name || row?.title || ''
}

function getDepartmentIdFromRow(row) {
  return row?.department_id || row?.id || row?.uuid || ''
}

async function findDepartmentRowByName(departmentName = '') {
  const target = String(departmentName || '').trim()
  if (!target) return null

  try {
    const { data, error } = await supabase
      .from('departments')
      .select('*')
      .limit(1000)

    if (error) {
      console.warn('departments 讀取失敗，改用人員資料推估部門 ID。', error.message)
      return null
    }

    return (data || []).find(row => getDepartmentNameFromRow(row) === target) || null
  } catch (err) {
    console.warn('departments 讀取發生錯誤。', err)
    return null
  }
}

async function tryInsertDepartment(payload) {
  try {
    const { data, error } = await supabase
      .from('departments')
      .insert(payload)
      .select('*')
      .single()

    if (error) return { data: null, error }
    return { data, error: null }
  } catch (err) {
    return { data: null, error: err }
  }
}

async function createDepartmentRow(departmentName = '') {
  const name = String(departmentName || '').trim()
  if (!name) return null

  const generatedId = makeUuidForClient()
  const payloads = [
    { department_id: generatedId, department_name: name },
    { department_id: generatedId, name },
    { id: generatedId, department_name: name },
    { id: generatedId, name },
    { department_name: name },
    { name }
  ]

  let lastError = null
  for (const payload of payloads) {
    const { data, error } = await tryInsertDepartment(payload)
    if (!error && data) return data
    lastError = error
  }

  if (lastError) {
    console.warn('新增 departments 失敗。', lastError)
  }

  return null
}

async function getOrCreateDepartmentIdByName(departmentName = '') {
  const name = String(departmentName || '').trim()
  if (!name) return ''

  const existingId = getDepartmentIdByName(name)
  if (existingId) return existingId

  if (currentProfile?.department_name === name && currentProfile?.department_id) {
    return currentProfile.department_id
  }

  const existingDepartment = await findDepartmentRowByName(name)
  const existingDepartmentId = getDepartmentIdFromRow(existingDepartment)
  if (existingDepartmentId) return existingDepartmentId

  const createdDepartment = await createDepartmentRow(name)
  const createdDepartmentId = getDepartmentIdFromRow(createdDepartment)
  if (createdDepartmentId) return createdDepartmentId

  return ''
}


function getNextStaffDisplayOrder() {
  const numbers = getUserManageRows()
    .map(staff => Number(staff.display_order || 0))
    .filter(number => Number.isFinite(number))
  return numbers.length ? Math.max(...numbers) + 10 : 10
}

function openUserAccountModal(staffId = '') {
  if (!canManageUsers()) {
    alert('只有管理員可以新增或修改人員資料。')
    return
  }

  const staff = getUserManageRows().find(item => item.staff_id === staffId)
  const isEdit = Boolean(staff)
  const selectedDepartment = staff?.department_name || currentProfile?.department_name || ''
  const loginEmail = getStaffLoginEmail(staff)
  const hasRemovedPosition = Boolean(staff?.position && isRemovedUserManagePosition(staff.position))

  const modal = document.createElement('div')
  modal.className = 'modal-backdrop'
  modal.innerHTML = `
    <div class="modal-panel user-account-modal">
      <div class="modal-header">
        <h3>${isEdit ? '修改人員資料' : '新增人員'}</h3>
        <button class="icon-btn" id="closeUserAccountModalBtn" type="button">×</button>
      </div>

      <form id="userAccountForm" class="form-grid">
        <label>
          人員姓名
          <input name="name" required value="${escapeHtml(staff?.name || '')}" placeholder="例如：蘇若儀">
        </label>

        <label>
          狀態
          <select name="status">
            <option value="啟用" ${(staff?.status || '啟用') === '啟用' ? 'selected' : ''}>啟用</option>
            <option value="停用" ${staff?.status === '停用' ? 'selected' : ''}>停用</option>
          </select>
        </label>

        <label>
          部門
          <select name="department_name" id="userDepartmentSelect">
            ${getUserManageDepartmentOptions(selectedDepartment)}
          </select>
        </label>

        <label>
          手動輸入部門
          <input name="department_custom" placeholder="若選單沒有才填寫新部門；留空使用左側選單">
        </label>

        <label>
          職務
          <select name="position">
            ${getUserManagePositionOptions(staff?.position || '')}
          </select>
        </label>

        <label>
          手動輸入職務
          <input name="position_custom" placeholder="若要新增新職務才填寫；留空使用左側選單">
        </label>

        ${hasRemovedPosition ? `
          <div class="notice span-2">
            此人員目前職務「${escapeHtml(staff.position)}」已從職務選項移除。請改選或手動輸入新的職務後再儲存。
          </div>
        ` : ''}

        <label>
          角色權限
          <select name="role" required>
            ${getUserManageRoleOptions(staff?.role || '一般職員')}
          </select>
        </label>

        <label>
          顯示順序
          <input name="display_order" type="number" value="${escapeHtml(String(staff?.display_order || getNextStaffDisplayOrder()))}" placeholder="數字越小越前面">
        </label>

        <label class="user-field-check-row">
          是否為外務人員
          <span class="field-staff-toggle compact-field-toggle large-field-toggle">
            <input type="checkbox" name="is_field_staff" ${staff ? (isStaffFieldWorker(staff) ? 'checked' : '') : ''}>
            <span class="field-staff-switch" aria-hidden="true"></span>
          </span>
        </label>

        <div class="login-account-info span-2">
          <strong>登入帳號狀態</strong>
          <span>${loginEmail ? `已綁定：${escapeHtml(loginEmail)}` : '尚未綁定登入帳號'}</span>
          <small>這裡管理人員資料；未綁定請在人員列表點「綁定」，已綁定但要更換 Email 請點「重綁」。</small>
        </div>

        <div class="modal-actions span-2">
          <button type="button" class="secondary-btn" id="cancelUserAccountModalBtn">取消</button>
          <button type="submit" class="primary-btn">${isEdit ? '儲存修改' : '新增人員'}</button>
        </div>
      </form>
    </div>
  `

  document.body.appendChild(modal)

  document.querySelector('#closeUserAccountModalBtn').addEventListener('click', () => modal.remove())
  document.querySelector('#cancelUserAccountModalBtn').addEventListener('click', () => modal.remove())
  document.querySelector('#userAccountForm').addEventListener('submit', event => saveUserAccount(event, modal, staff?.staff_id || ''))
}

async function saveUserAccount(event, modal, staffId = '') {
  event.preventDefault()
  if (saving) return
  saving = true

  if (!canManageUsers()) { alert('只有管理員可以新增或修改人員資料。'); saving = false; return }

  try {
    const form = new FormData(event.target)
    const departmentName = String(form.get('department_custom') || '').trim() || String(form.get('department_name') || '').trim()
    const position = (String(form.get('position_custom') || '').trim() || String(form.get('position') || '').trim())
    const displayOrderValue = form.get('display_order')
    const name = String(form.get('name') || '').trim()

    if (!name) {
      alert('請輸入人員姓名。')
      saving = false
      return
    }

    if (!departmentName) {
      alert('請選擇或輸入部門。')
      saving = false
      return
    }

    if (!position) {
      alert('請選擇或輸入職務。\n\n職務欄位不可空白，請先選擇正確職務後再儲存。')
      saving = false
      return
    }

    if (isRemovedUserManagePosition(position)) {
      alert('「管理員、主管、行政/海外、外務/宿管人員/會計」屬於角色權限，不可填在職務欄。\n\n請改選或輸入實際職務，例如：執行長、總經理、副總經理、副理、組長、海外行政、PT。')
      saving = false
      return
    }

    const departmentId = await getOrCreateDepartmentIdByName(departmentName)
    if (!departmentId) {
      alert(
        `新增人員失敗：部門「${departmentName}」尚未建立部門 ID。\n\n` +
        `請先在資料庫 departments 建立此部門，或改選既有部門後再新增。`
      )
      saving = false
      return
    }

    const payload = {
      name,
      department_id: departmentId,
      department_name: departmentName,
      position,
      role: form.get('role') || '一般職員',
      status: form.get('status') || '啟用'
    }

    if (displayOrderValue !== '' && displayOrderValue !== null) {
      payload.display_order = Number(displayOrderValue)
    }

    let savedStaffId = staffId

    if (staffId) {
      const { error } = await supabase
        .from('staff')
        .update(payload)
        .eq('staff_id', staffId)

      if (error) {
        console.error(error)
        alert('修改人員失敗：' + error.message)
        saving = false
        return
      }
    } else {
      const { data, error } = await supabase
        .from('staff')
        .insert(payload)
        .select('staff_id')
        .single()

      if (error) {
        console.error(error)
        alert('新增人員失敗：' + error.message)
        saving = false
        return
      }

      savedStaffId = data?.staff_id
    }

    if (savedStaffId) {
      const savedStaffPayload = { ...payload, staff_id: savedStaffId }
      await setStaffFieldWorker(savedStaffId, form.get('is_field_staff') === 'on')
      await syncProfileRoleFromStaff(savedStaffId, savedStaffPayload)
      applyCurrentProfileStaffRole(savedStaffPayload)
    }

    modal.remove()
    await refreshData()
    renderApp()
  } finally {
    saving = false
  }
}


function openScheduleDetail(scheduleId) {
  const row = schedules.find(item => item.schedule_id === scheduleId)
  if (!row) return

  const noCompletionControl = isNoCompletionControlSchedule(row)
  const permissionNote = noCompletionControl
    ? '此類行程只顯示在行事曆，不控管是否已完成。'
    : (canModifySchedule(row)
      ? '您可以管理此行程，包含修改內容與執行者。'
      : '此行程由他人指派，您只能查看與完成，不能修改、取消或刪除。')

  const modal = document.createElement('div')
  modal.className = 'modal-backdrop'
  modal.innerHTML = `
    <div class="modal-panel detail-panel">
      <div class="modal-header">
        <h3>查看行程</h3>
        <button class="icon-btn" id="closeDetailBtn" type="button">×</button>
      </div>

      <div class="detail-grid">
        <div><span>狀態</span><strong>${escapeHtml(getScheduleStatusLabel(row))}</strong></div>
        <div><span>日期</span><strong>${escapeHtml(row.start_date)}${row.end_date && row.end_date !== row.start_date ? ' ～ ' + escapeHtml(row.end_date) : ''}</strong></div>
        <div><span>時間</span><strong>${escapeHtml(formatTime(row))}</strong></div>
        <div><span>類別</span><strong>${escapeHtml(row.category)}</strong></div>
        <div><span>行程類型</span><strong>${escapeHtml(row.schedule_type || '-')}</strong></div>
        <div><span>附加 / 待辦 / 代理</span><strong>${escapeHtml(row.sub_type || '-')}</strong></div>
        <div><span>執行者</span><strong>${escapeHtml(getAssigneeNames(row))}</strong></div>
        <div><span>指派者</span><strong>${escapeHtml(row.creator_name || '-')}</strong></div>
        <div><span>公務車</span><strong>${escapeHtml(row.car_no || '-')}</strong></div>
        <div class="span-2"><span>標題 / 辦理內容</span><strong>${escapeHtml(row.title)}</strong></div>
        <div class="span-2"><span>區域 / 客戶</span><strong>${escapeHtml(row.customer_name || '-')}</strong></div>
        <div class="span-2"><span>地點</span><strong>${escapeHtml(row.location_name || '-')}</strong></div>
        <div class="span-2"><span>地址</span><strong>${escapeHtml(row.address || '-')}</strong></div>
        <div class="span-2"><span>內容</span><strong>${escapeHtml(row.description || '-')}</strong></div>
        <div class="span-2"><span>備註 / 提醒 / 證件</span><strong>${escapeHtml(row.sub_type_note || '-')}</strong></div>
        <div class="span-2"><span>服務紀錄單繳交狀況</span><strong>${row.need_service_record ? (row.service_record_submitted_date ? '已繳交：' + row.service_record_submitted_date : '需繳交，尚未繳交') : '不需繳交'}</strong></div>
      </div>

      ${isFieldScheduleRow(row) ? renderFieldResultReminder(row) : ''}
      ${isIncidentSchedule(row) ? renderIncidentTrackingHistory(row, canModifySchedule(row)) : ''}

      <div class="notice">${permissionNote}</div>

      <div class="modal-actions">
        <button type="button" class="secondary-btn" id="closeDetailBtn2">關閉</button>
        ${row.schedule_type === '醫療' && isMine(row) && row.status !== '取消' ? `<button type="button" class="secondary-btn" id="detailMedicalFollowBtn">回診資訊</button>` : ''}
        ${canModifySchedule(row) && row.status !== '取消' ? `<button type="button" class="secondary-btn" id="detailEditBtn">修改行程</button>` : ''}
        ${isIncidentSchedule(row) && row.status !== '取消' && canManageIncidentAction(row) ? `<button type="button" class="primary-btn" id="detailIncidentNextFollowBtn">新增下次追蹤</button>` : ''}
        ${canCompleteSchedule(row) ? `<button type="button" class="primary-btn" id="detailCompleteBtn">${isFieldScheduleRow(row) ? '已送件（完成）' : '已完成'}</button>` : ''}
        ${isFieldScheduleRow(row) && row.status !== '取消' && canManageFieldResult(row) ? `<button type="button" class="secondary-btn field-result-btn" id="detailNeedSupplementBtn">要補件</button>` : ''}
        ${isFieldScheduleRow(row) && row.status !== '取消' && canManageFieldResult(row) ? `<button type="button" class="secondary-btn field-result-btn" id="detailFieldAbnormalBtn">送件異常</button>` : ''}
        ${canCancelSchedule(row) ? `<button type="button" class="danger-btn" id="detailCancelBtn">取消行程</button>` : ''}
      </div>
    </div>
  `

  document.body.appendChild(modal)
  bindIncidentTrackingEditButtons(modal)
  document.querySelector('#closeDetailBtn').addEventListener('click', () => modal.remove())
  document.querySelector('#closeDetailBtn2').addEventListener('click', () => modal.remove())

  const medicalFollowBtn = document.querySelector('#detailMedicalFollowBtn')
  if (medicalFollowBtn) {
    medicalFollowBtn.addEventListener('click', () => {
      modal.remove()
      openMedicalFollowModal(scheduleId)
    })
  }

  const editBtn = document.querySelector('#detailEditBtn')
  if (editBtn) {
    editBtn.addEventListener('click', () => {
      modal.remove()
      if (isFieldScheduleRow(row)) openEditFieldScheduleModal(scheduleId)
      else if (isIncidentSchedule(row)) openEditIncidentModal(scheduleId)
      else openEditScheduleModal(scheduleId)
    })
  }

  const incidentNextFollowBtn = document.querySelector('#detailIncidentNextFollowBtn')
  if (incidentNextFollowBtn) {
    incidentNextFollowBtn.addEventListener('click', () => {
      modal.remove()
      openIncidentNextTrackingModal(scheduleId)
    })
  }

  const completeBtn = document.querySelector('#detailCompleteBtn')
  if (completeBtn) {
    completeBtn.addEventListener('click', async () => {
      modal.remove()
      await completeSchedule(scheduleId)
    })
  }

  const needSupplementBtn = document.querySelector('#detailNeedSupplementBtn')
  if (needSupplementBtn) {
    needSupplementBtn.addEventListener('click', () => {
      modal.remove()
      openFieldResultModal(scheduleId, '要補件')
    })
  }

  const fieldAbnormalBtn = document.querySelector('#detailFieldAbnormalBtn')
  if (fieldAbnormalBtn) {
    fieldAbnormalBtn.addEventListener('click', () => {
      modal.remove()
      openFieldResultModal(scheduleId, '送件異常')
    })
  }

  const cancelBtn = document.querySelector('#detailCancelBtn')
  if (cancelBtn) {
    cancelBtn.addEventListener('click', async () => {
      modal.remove()
      openCancelModal(scheduleId)
    })
  }
}

function editStaffOptionsHtml(row) {
  const selectedIds = new Set(getAssigneeIds(row))
  const rows = canAssignAllStaff() ? staffList : staffList.filter(staff => selectedIds.has(staff.staff_id) || staff.staff_id === currentProfile?.staff_id)
  return rows.map(staff => `
    <label class="check-row">
      <input type="checkbox" name="edit_executor" value="${staff.staff_id}" ${selectedIds.has(staff.staff_id) ? 'checked' : ''}>
      <span>${staff.name}｜${staff.department_name}｜${staff.position}</span>
    </label>
  `).join('')
}

function staffOptionsHtml(defaultStaffId = '') {
  const rows = getAssignableStaffRows()
  return rows.map(staff => `
    <label class="check-row">
      <input type="checkbox" name="executor" value="${staff.staff_id}" ${staff.staff_id === defaultStaffId ? 'checked' : ''}>
      <span>${staff.name}｜${staff.department_name}｜${staff.position}</span>
    </label>
  `).join('')
}

function staffSelectOptionsHtml() {
  return `<option value="">未指定</option>` + getAssignableStaffRows().map(staff => `
    <option value="${staff.staff_id}">${staff.name}｜${staff.department_name}</option>
  `).join('')
}

function hourOptionsHtml(defaultValue = '09') {
  return Array.from({ length: 24 }, (_, i) => {
    const value = String(i).padStart(2, '0')
    return `<option value="${value}" ${value === defaultValue ? 'selected' : ''}>${value}</option>`
  }).join('')
}

function minuteOptionsHtml(defaultValue = '00') {
  return Array.from({ length: 12 }, (_, i) => {
    const value = String(i * 5).padStart(2, '0')
    return `<option value="${value}" ${value === defaultValue ? 'selected' : ''}>${value}</option>`
  }).join('')
}

function getAvailableFormCategories() {
  const personalCategories = ['一般記事', '待辦事項', '請假 / 會議 / 活動 / 外訓', '證件交付']
  if (currentPage === 'personalTodo') return personalCategories
  if (!canCreateServiceSchedule()) return personalCategories
  return formCategories
}

function serviceTypeOptionsHtml(includeEmpty = false) {
  const empty = includeEmpty ? '<option value="">無</option>' : ''
  return empty + getManagedListOption('serviceScheduleTypes', serviceScheduleTypes).map(type => `<option value="${type}">${type}</option>`).join('')
}

function optionHtml(items, selectedValue = '', includeEmpty = false) {
  const empty = includeEmpty ? `<option value="">無</option>` : ''
  return empty + items.map(item => `<option value="${item}" ${item === selectedValue ? 'selected' : ''}>${item}</option>`).join('')
}


/* FOR-e V002-1H-8-1 START - edit form category sync */
function splitMultiValue(value) {
  return String(value || '')
    .split(/[、,，｜]/)
    .map(item => item.trim())
    .filter(Boolean)
}

function checkedOptionsHtml(items, selectedItems, inputName) {
  const selected = new Set(selectedItems || [])
  return items.map(item => `
    <label class="inline-check">
      <input type="checkbox" name="${inputName}" value="${item}" ${selected.has(item) ? 'checked' : ''}>
      ${item}
    </label>
  `).join('')
}
/* FOR-e V002-1H-8-1 END - edit form category sync */


function timeTypeOptionsHtml(selectedValue = '不指定') {
  return ['不指定', '上午', '下午'].map(item => `<option value="${item}" ${item === selectedValue ? 'selected' : ''}>${item}</option>`).join('')
}


function compactTimeSelectHtml(prefix, defaultHour = '09', defaultMinute = '00') {
  return `
    <div class="compact-time-row">
      <select name="${prefix}_time_type">
        <option value="不指定">不指定</option>
        <option value="上午">上午</option>
        <option value="下午">下午</option>
        <option value="指定時間">指定時間</option>
      </select>
      <select name="${prefix}_hour">${hourOptionsHtml(defaultHour)}</select>
      <select name="${prefix}_minute">${minuteOptionsHtml(defaultMinute)}</select>
    </div>
  `
}


// V002-1H-5-7-5｜特殊行程類型精準欄位控制
const compactSpecialScheduleTypes = ['逃跑通知', '轉出追蹤', '住變資訊', '驗證提醒', '返台提醒']

function isCompactSpecialScheduleType(value) {
  return compactSpecialScheduleTypes.includes(String(value || '').trim())
}

function setCompactHidden(element, hidden) {
  if (!element) return
  element.classList.toggle('compact-special-hidden', hidden)

  element.querySelectorAll('input, select, textarea').forEach(control => {
    if (hidden) {
      if (control.required) {
        control.dataset.compactSpecialWasRequired = 'true'
        control.required = false
      }
    } else if (control.dataset.compactSpecialWasRequired === 'true') {
      control.required = true
      delete control.dataset.compactSpecialWasRequired
    }
  })
}

function resetCompactHiddenValues(form) {
  if (!form) return

  const hasExtra = form.querySelector('select[name="has_extra_schedule"]')
  if (hasExtra) hasExtra.value = '否'

  const subType = form.querySelector('select[name="sub_type"]')
  if (subType) subType.value = ''

  const subTypeNote = form.querySelector('input[name="sub_type_note"]')
  if (subTypeNote) subTypeNote.value = ''

  const needRecord = form.querySelector('input[name="need_service_record"]')
  if (needRecord) needRecord.checked = false

  const submitted = form.querySelector('input[name="service_record_submitted_check"]')
  if (submitted) {
    submitted.checked = false
    submitted.disabled = true
  }

  const submittedDate = form.querySelector('input[name="service_record_submitted_date"]')
  if (submittedDate) {
    submittedDate.value = ''
    submittedDate.disabled = true
  }

  const carNo = form.querySelector('select[name="car_no"]')
  if (carNo) carNo.value = '不使用'

  const hasDocuments = form.querySelector('select[name="has_documents"]')
  if (hasDocuments) hasDocuments.value = '否'

  form.querySelectorAll('input[name="document_items"]').forEach(input => {
    input.checked = false
  })

  const documentNote = form.querySelector('input[name="document_note"]')
  if (documentNote) documentNote.value = ''
}

function applyCreateCompactSpecialFields() {
  const form = document.querySelector('#scheduleForm')
  if (!form) return

  const serviceTypeSelect = form.querySelector('#serviceTypeSelect')
  if (!serviceTypeSelect) return

  const isCompact = isCompactSpecialScheduleType(serviceTypeSelect.value)

  form.querySelectorAll('.compact-hide-for-reminder').forEach(block => {
    setCompactHidden(block, isCompact)
  })

  // 特殊類型自己的提醒欄位要保留顯示，例如逃跑三天、轉出日期、驗證日期、返台班機、住變追蹤。
  form.querySelectorAll('[data-service-extra]').forEach(block => {
    block.classList.toggle('hidden', block.dataset.serviceExtra !== serviceTypeSelect.value)
  })

  if (isCompact) {
    resetCompactHiddenValues(form)
  }
}

function applyEditCompactSpecialFields() {
  const form = document.querySelector('#editScheduleForm')
  if (!form) return

  const serviceTypeSelect = form.querySelector('select[name="schedule_type"]')
  if (!serviceTypeSelect) return

  const isCompact = isCompactSpecialScheduleType(serviceTypeSelect.value)

  form.querySelectorAll('.compact-hide-for-reminder').forEach(block => {
    setCompactHidden(block, isCompact)
  })

  if (isCompact) {
    resetCompactHiddenValues(form)
  }
}


/* FOR-e V002-1I-2 START - field schedule add form */
/*
  V002-1I-2-3｜外務行程表單時間與結果操作修正
  - 時間改成小時 + 5 分鐘選項，不需要結束時間
  - 下次領件 / 送審增加時間，小時 + 5 分鐘選項
  - 要補件 / 送件異常會寫入備註並刷新畫面
  - 外務週曆卡片顯示指派者
*/

function fieldStaffOptionsHtml(defaultStaffId = '') {
  const rows = getFieldStaffRows()
  return rows.map(staff => `
    <label class="check-row">
      <input type="checkbox" name="field_executor" value="${staff.staff_id}" ${staff.staff_id === defaultStaffId ? 'checked' : ''}>
      <span>${staff.name}｜${staff.department_name || ''}｜${staff.position || ''}</span>
    </label>
  `).join('')
}

function fieldStaffSelectOptionsHtml(selectedStaffId = '') {
  return `<option value="">未指定</option>` + getFieldStaffRows().map(staff => `
    <option value="${staff.staff_id}" ${staff.staff_id === selectedStaffId ? 'selected' : ''}>${staff.name}｜${staff.department_name || ''}</option>
  `).join('')
}

function optionHtmlForItems(items, selectedValue = '') {
  return items.map(item => `<option value="${item}" ${item === selectedValue ? 'selected' : ''}>${item}</option>`).join('')
}

function fieldLocationOptionsHtml() {
  return `<option value="">手動輸入 / 不指定</option>` + getManagedLocationOptions().map(item => `
    <option value="${escapeHtml(item.name)}" data-address="${escapeHtml(item.address)}">${escapeHtml(item.name)}</option>
  `).join('')
}

function fieldHourOptionsHtml(selectedValue = '') {
  return `<option value="" ${selectedValue === '' ? 'selected' : ''}>不指定</option>` + Array.from({ length: 24 }, (_, i) => {
    const value = String(i).padStart(2, '0')
    return `<option value="${value}" ${value === selectedValue ? 'selected' : ''}>${value}</option>`
  }).join('')
}

function fieldPeriodOptionsHtml(defaultValue = '不指定') {
  return ['不指定', '上午', '下午'].map(item => `
    <option value="${item}" ${item === defaultValue ? 'selected' : ''}>${item}</option>
  `).join('')
}

function fieldTimeSelectHtml(prefix, defaultHour = '', defaultMinute = '00', defaultPeriod = '不指定') {
  return `
    <div class="compact-time-row field-single-time-row field-ampm-time-row">
      <select name="${prefix}_period" class="field-period-select">${fieldPeriodOptionsHtml(defaultPeriod)}</select>
      <select name="${prefix}_hour">${fieldHourOptionsHtml(defaultHour)}</select>
      <select name="${prefix}_minute">${minuteOptionsHtml(defaultMinute)}</select>
    </div>
  `
}

function getFieldSingleTimeValue(form, prefix) {
  const hour = form.get(`${prefix}_hour`) || ''
  const minute = form.get(`${prefix}_minute`) || '00'
  if (!hour) return ''
  return `${hour}:${minute}`
}

function getFieldTimeTypeFromValue(timeValue) {
  if (!timeValue) return '不指定'
  return Number(String(timeValue).slice(0, 2)) < 12 ? '上午' : '下午'
}

function getFieldTimeTypeFromForm(form, prefix) {
  const period = form.get(`${prefix}_period`) || '不指定'
  const timeValue = getFieldSingleTimeValue(form, prefix)
  if (period !== '不指定') return period
  return getFieldTimeTypeFromValue(timeValue)
}

function getFieldDbTimeValue(timeValue) {
  return timeValue ? `${timeValue}:00` : null
}

function fieldSpecialReminderChecksHtml(selectedItems = [], inputName = 'field_special_reminder') {
  const selected = new Set((selectedItems || []).map(normalizeFieldSpecialReminder))
  const selectedText = [...selected].length ? [...selected].map(getFieldSpecialReminderDisplay).join('、') : '未選擇'

  return `
    <details class="field-special-dropdown" data-field-special-dropdown>
      <summary>
        <span class="field-special-dropdown-main">選擇特殊提醒</span>
        <span class="field-special-dropdown-value">${escapeHtml(selectedText)}</span>
      </summary>
      <div class="field-special-dropdown-panel">
        ${getManagedListOption('fieldSpecialReminderOptions', fieldSpecialReminderOptions).map(item => `
          <label class="inline-check field-special-check">
            <input type="checkbox" name="${inputName}" value="${item}" ${selected.has(item) ? 'checked' : ''}>
            <span>${renderFieldSpecialReminderIcon(item)} ${getFieldSpecialReminderDisplay(item)}</span>
          </label>
        `).join('')}
      </div>
    </details>
  `
}

function refreshFieldSpecialDropdownLabel(dropdown) {
  if (!dropdown) return
  const valueEl = dropdown.querySelector('.field-special-dropdown-value')
  if (!valueEl) return

  const checkedItems = [...dropdown.querySelectorAll('input[type="checkbox"]:checked')]
    .map(input => getFieldSpecialReminderDisplay(input.value))

  valueEl.textContent = checkedItems.length ? checkedItems.join('、') : '未選擇'
}

function initFieldSpecialDropdowns(root = document) {
  root.querySelectorAll('[data-field-special-dropdown]').forEach(dropdown => {
    refreshFieldSpecialDropdownLabel(dropdown)
    dropdown.addEventListener('change', () => refreshFieldSpecialDropdownLabel(dropdown))
  })
}

function getFieldStaffName(staffId) {
  const staff = staffList.find(item => item.staff_id === staffId)
  return staff ? `${staff.name}｜${staff.department_name || ''}` : ''
}

function normalizeFieldSpecialReminder(value) {
  if (value === '無法更換') return '無法更換人員'
  return value
}

function getFieldSpecialReminderIconPath(value) {
  const normalized = normalizeFieldSpecialReminder(value)
  if (normalized === '必送件') return '/icons/push-pin.png'
  if (normalized === '無法更換人員') return '/icons/padlock.png'
  if (normalized === '急件') return '/icons/siren.png'
  return '/icons/siren.png'
}

function renderFieldSpecialReminderIcon(value) {
  const normalized = normalizeFieldSpecialReminder(value)
  return `<img class="field-special-icon" src="${getFieldSpecialReminderIconPath(normalized)}" alt="${escapeHtml(normalized)}">`
}

function getFieldSpecialReminderDisplay(value) {
  return normalizeFieldSpecialReminder(value)
}

function getFieldSpecialRemindersFromRow(row) {
  const note = String(row?.sub_type_note || '')
  const match = note.match(/特殊提醒：([^｜]+)/)
  if (!match) return []
  return match[1].split('、').map(item => item.trim()).filter(Boolean)
}

function getFieldResultFromRow(row) {
  const note = String(row?.sub_type_note || '')
  const match = note.match(/外務結果：([^｜]+)/)
  return match ? match[1].trim() : ''
}

function renderFieldResultBadge(row) {
  const result = getFieldResultFromRow(row)
  if (!result) return ''
  return `<span class="field-result-badge">${escapeHtml(result)}</span>`
}

function renderFieldSpecialReminderBadges(row) {
  const reminders = getFieldSpecialRemindersFromRow(row)
  if (!reminders.length) return ''

  return `
    <span class="field-special-badges">
      ${reminders.map(item => `<span class="field-special-badge">${renderFieldSpecialReminderIcon(item)} ${escapeHtml(getFieldSpecialReminderDisplay(item))}</span>`).join('')}
    </span>
  `
}

function setFieldLocationFromSelect(selectElement) {
  const selected = selectElement?.selectedOptions?.[0]
  if (!selected) return

  const form = selectElement.closest('form') || document.querySelector('#fieldScheduleForm') || document.querySelector('#editFieldScheduleForm')
  if (!form) return

  const locationInput = form.querySelector('input[name="location_name"]')
  const addressInput = form.querySelector('input[name="address"]')

  if (selected.value && locationInput) locationInput.value = selected.value
  if (selected.dataset.address && addressInput) addressInput.value = selected.dataset.address
}

function appendFieldResultNote(noteText, result) {
  const parts = String(noteText || '').split('｜').map(item => item.trim()).filter(Boolean)
  const cleaned = parts.filter(item => !item.startsWith('外務結果：'))
  cleaned.push(`外務結果：${result}`)
  return cleaned.join('｜')
}

async function updateFieldScheduleResult(scheduleId, result, detailText = '') {
  const row = schedules.find(item => item.schedule_id === scheduleId)
  if (!row) return

  const detailLabel = result === '要補件' ? '補件項目' : '異常項目'
  let nextNote = appendFieldResultNote(row.sub_type_note, result)

  if (detailText) {
    const parts = nextNote.split('｜').map(item => item.trim()).filter(Boolean)
    const cleaned = parts.filter(item => !item.startsWith(`${detailLabel}：`))
    cleaned.push(`${detailLabel}：${detailText}`)
    nextNote = cleaned.join('｜')
  }

  const { error } = await supabase
    .from('schedules')
    .update({
      status: '未完成',
      sub_type_note: nextNote
    })
    .eq('schedule_id', scheduleId)

  if (error) {
    alert('更新外務結果失敗：' + error.message)
    return
  }

  await supabase.from('audit_logs').insert({
    operated_by_profile_id: currentProfile.profile_id,
    operated_by_staff_id: currentProfile.staff_id,
    operated_by_name: currentProfile.name || currentProfile.email,
    action_type: '外務結果',
    source_type: 'schedule',
    source_id: scheduleId,
    note: `外務結果：${result}${detailText ? '｜' + detailLabel + '：' + detailText : ''}`
  })

  await refreshData()
  renderApp()
  alert(`已標記外務結果：${result}`)
}

function openFieldResultModal(scheduleId, result) {
  const label = result === '要補件' ? '補件項目' : '異常項目'

  const modal = document.createElement('div')
  modal.className = 'modal-backdrop'
  modal.innerHTML = `
    <div class="modal-panel detail-panel">
      <div class="modal-header">
        <h3>${escapeHtml(result)}</h3>
        <button class="icon-btn" id="closeFieldResultBtn" type="button">×</button>
      </div>

      <div class="notice">請輸入${escapeHtml(label)}，儲存後會寫入外務備註，行程狀態維持未完成。</div>

      <label>
        ${escapeHtml(label)}
        <textarea id="fieldResultDetailInput" rows="4" placeholder="請輸入${escapeHtml(label)}"></textarea>
      </label>

      <div class="modal-actions">
        <button type="button" class="secondary-btn" id="cancelFieldResultBtn">取消</button>
        <button type="button" class="primary-btn" id="saveFieldResultBtn">儲存</button>
      </div>
    </div>
  `

  document.body.appendChild(modal)

  document.querySelector('#closeFieldResultBtn').addEventListener('click', () => modal.remove())
  document.querySelector('#cancelFieldResultBtn').addEventListener('click', () => modal.remove())
  document.querySelector('#saveFieldResultBtn').addEventListener('click', async () => {
    const detail = document.querySelector('#fieldResultDetailInput').value.trim()
    if (!detail) {
      alert(`請輸入${label}。`)
      return
    }

    modal.remove()
    await updateFieldScheduleResult(scheduleId, result, detail)
  })
}

function getFieldNoteValue(row, label) {
  const text = String(row?.sub_type_note || '')
  const parts = text.split('｜').map(item => item.trim()).filter(Boolean)
  const found = parts.find(item => item.startsWith(label + '：'))
  return found ? found.slice(label.length + 1) : ''
}

function renderFieldResultReminder(row) {
  const result = getFieldResultFromRow(row)
  if (!result) return ''

  const detailLabel = result === '要補件' ? '補件項目' : '異常項目'
  const detail = getFieldNoteValue(row, detailLabel)
  const resultClass = result === '送件異常' ? 'is-abnormal' : 'is-supplement'

  return `
    <div class="field-result-reminder-panel ${resultClass}">
      <div class="field-result-reminder-title">⚠️ 外務結果：${escapeHtml(result)}</div>
      ${detail ? `<div class="field-result-reminder-detail"><span>${escapeHtml(detailLabel)}：</span>${escapeHtml(detail)}</div>` : ''}
      <div class="field-result-reminder-note">此行程狀態維持未完成，請持續追蹤處理。</div>
    </div>
  `
}

function openEditFieldScheduleModal(scheduleId) {
  const row = schedules.find(item => item.schedule_id === scheduleId)
  if (!row) return

  if (!canModifySchedule(row)) {
    alert('您沒有權限修改此外務行程。')
    return
  }

  const start = parseTimeForEdit(row.start_time, '', '00')
  const selectedIds = new Set(getAssigneeIds(row))
  const purpose = row.sub_type || getFieldNoteValue(row, '外務目的') || '外務日'
  const selectedReminders = getFieldSpecialRemindersFromRow(row)
  const cashNote = getFieldNoteValue(row, '現金')
  const sealNote = getFieldNoteValue(row, '印章')
  const documentNote = getFieldNoteValue(row, '證件')
  const fieldResult = getFieldResultFromRow(row)
  const supplementDetail = getFieldNoteValue(row, '補件項目')
  const abnormalDetail = getFieldNoteValue(row, '異常項目')

  const modal = document.createElement('div')
  modal.className = 'modal-backdrop'
  modal.innerHTML = `
    <div class="modal-panel">
      <div class="modal-header">
        <h3>修改外務行程</h3>
        <button class="icon-btn" id="closeEditFieldModalBtn" type="button">×</button>
      </div>

      <form id="editFieldScheduleForm" class="form-grid">
        <div class="span-2">
          <div class="field-title">外務人員</div>
          <div class="checkbox-list">
            ${getFieldStaffRows().map(staff => `
              <label class="check-row">
                <input type="checkbox" name="edit_field_executor" value="${staff.staff_id}" ${selectedIds.has(staff.staff_id) ? 'checked' : ''}>
                <span>${staff.name}｜${staff.department_name || ''}｜${staff.position || ''}</span>
              </label>
            `).join('')}
          </div>
        </div>

        <label>
          日期
          <input name="start_date" type="date" required value="${row.start_date || todayString()}">
        </label>

        <label>
          時間
          ${fieldTimeSelectHtml('edit_field', row.start_time ? start.hour : '', row.start_time ? start.minute : '00', row.time_type || '不指定')}
        </label>

        <div class="span-2 field-location-box">
          <label>
            地點選擇
            <select name="field_location_select" id="editFieldLocationSelect">
              ${fieldLocationOptionsHtml()}
            </select>
          </label>

          <label>
            地點
            <input name="location_name" value="${escapeHtml(row.location_name || '')}" placeholder="可手動輸入地點">
          </label>

          <label class="span-2">
            地址
            <input name="address" value="${escapeHtml(row.address || '')}" placeholder="選擇地點後自動帶出，也可手動修改">
          </label>
        </div>

        <label>
          目的
          <select name="field_purpose">
            ${optionHtmlForItems(getManagedListOption('fieldPurposeOptions', fieldPurposeOptions), purpose)}
          </select>
        </label>

        <div class="field-special-box">
          <div class="field-title">特殊提醒（可複選）</div>
          <div class="inline-check-list">${fieldSpecialReminderChecksHtml(selectedReminders, 'edit_field_special_reminder')}</div>
        </div>

        <label class="span-2">
          內容
          <textarea name="description" rows="3">${escapeHtml(row.description || '')}</textarea>
        </label>

        <div class="span-2 field-items-grid">
          <label>
            現金
            <input name="cash_note" value="${escapeHtml(cashNote)}" placeholder="例如：金額 / 用途 / 無">
          </label>

          <label>
            印章
            <input name="seal_note" value="${escapeHtml(sealNote)}" placeholder="例如：公司章 / 私章 / 無">
          </label>

          <label>
            證件
            <input name="document_note" value="${escapeHtml(documentNote)}" placeholder="例如：護照 / 居留證 / 文件 / 無">
          </label>
        </div>

        ${fieldResult ? `<div class="span-2 field-result-reminder-panel ${fieldResult === '送件異常' ? 'is-abnormal' : 'is-supplement'}">
          <div class="field-result-reminder-title">⚠️ 外務結果：${escapeHtml(fieldResult)}</div>
          ${supplementDetail ? `<div class="field-result-reminder-detail"><span>補件項目：</span>${escapeHtml(supplementDetail)}</div>` : ''}
          ${abnormalDetail ? `<div class="field-result-reminder-detail"><span>異常項目：</span>${escapeHtml(abnormalDetail)}</div>` : ''}
          <div class="field-result-reminder-note">此行程狀態維持未完成，請持續追蹤處理。</div>
        </div>` : ''}

        <div class="modal-actions span-2">
          <button type="button" class="secondary-btn" id="cancelEditFieldModalBtn">取消</button>
          <button type="submit" class="primary-btn">儲存外務修改</button>
        </div>
      </form>
    </div>
  `

  document.body.appendChild(modal)
  initFieldSpecialDropdowns(modal)

  const locationSelect = document.querySelector('#editFieldLocationSelect')
  if (locationSelect) {
    locationSelect.addEventListener('change', () => setFieldLocationFromSelect(locationSelect))
  }

  document.querySelector('#closeEditFieldModalBtn').addEventListener('click', () => modal.remove())
  document.querySelector('#cancelEditFieldModalBtn').addEventListener('click', () => modal.remove())
  document.querySelector('#editFieldScheduleForm').addEventListener('submit', event => saveEditedFieldSchedule(event, modal, row))
}

async function saveEditedFieldSchedule(event, modal, originalRow) {
  event.preventDefault()
  if (saving) return
  saving = true

  try {
    const form = new FormData(event.target)
    const executorIds = [...document.querySelectorAll('input[name="edit_field_executor"]:checked')].map(input => input.value)

    if (!executorIds.length) {
      alert('請至少選擇一位外務人員。')
      saving = false
      return
    }

    const selectedStaff = staffList.filter(staff => executorIds.includes(staff.staff_id))
    const firstStaff = selectedStaff[0]
    const purpose = form.get('field_purpose') || '外務日'
    const locationName = form.get('location_name') || ''
    const address = form.get('address') || ''
    const fieldTime = getFieldSingleTimeValue(form, 'edit_field')
    const specialReminders = [...document.querySelectorAll('input[name="edit_field_special_reminder"]:checked')].map(input => input.value)
    const existingResult = getFieldResultFromRow(originalRow)
    const supplementDetail = getFieldNoteValue(originalRow, '補件項目')
    const abnormalDetail = getFieldNoteValue(originalRow, '異常項目')

    const noteParts = [
      buildRepeatNote(form),
      `外務目的：${purpose}`,
      form.get('cash_note') ? `現金：${form.get('cash_note')}` : '',
      form.get('seal_note') ? `印章：${form.get('seal_note')}` : '',
      form.get('document_note') ? `證件：${form.get('document_note')}` : '',
      specialReminders.length ? `特殊提醒：${specialReminders.join('、')}` : '',
      existingResult ? `外務結果：${existingResult}` : '',
      supplementDetail ? `補件項目：${supplementDetail}` : '',
      abnormalDetail ? `異常項目：${abnormalDetail}` : ''
    ].filter(Boolean)

    const payload = {
      department_id: firstStaff.department_id || currentProfile.department_id,
      department_name: firstStaff.department_name || currentProfile.department_name,
      category: '外務行程',
      schedule_type: '外務',
      sub_type: purpose,
      sub_type_note: noteParts.join('｜'),
      title: `${purpose}${locationName ? '｜' + locationName : '｜外務'}`,
      description: form.get('description') || null,
      start_date: form.get('start_date'),
      end_date: getScheduleModeEndDate(form),
      time_type: getFieldTimeTypeFromForm(form, 'field'),
      start_time: getFieldDbTimeValue(fieldTime),
      end_time: null,
      location_name: locationName || null,
      address: address || null
    }

    const { error } = await supabase
      .from('schedules')
      .update(payload)
      .eq('schedule_id', originalRow.schedule_id)

    if (error) {
      alert('修改外務行程失敗：' + error.message)
      saving = false
      return
    }

    const { error: assigneeError } = await supabase.rpc('update_schedule_assignees', {
      target_schedule_id: originalRow.schedule_id,
      staff_ids_value: executorIds
    })

    if (assigneeError) {
      alert('外務行程已修改，但外務人員同步失敗：' + assigneeError.message)
      saving = false
      return
    }

    await supabase.from('audit_logs').insert({
      operated_by_profile_id: currentProfile.profile_id,
      operated_by_staff_id: currentProfile.staff_id,
      operated_by_name: currentProfile.name || currentProfile.email,
      action_type: '修改',
      source_type: 'schedule',
      source_id: originalRow.schedule_id,
      note: 'V002-1I-2-4 修改外務行程'
    })

    modal.remove()
    await refreshData()
    saving = false
    renderApp()
  } catch (err) {
    console.error(err)
    alert('修改外務行程失敗：' + (err?.message || err))
    saving = false
  }
}



function fieldModeTimeFieldsHtml(defaultDate = '') {
  return `
    <div class="span-2 block-group schedule-mode-box field-mode-time-box">
      <div class="group-title">行程模式與時間</div>
      <div class="form-grid inner-grid field-mode-time-grid">
        <label>
          行程模式
          <select name="repeat_mode" id="fieldRepeatModeSelect">
            <option value="單日">單日</option>
            <option value="連續日期">連續日期</option>
            <option value="每週重複">每週重複</option>
            <option value="每月重複">每月重複</option>
          </select>
        </label>

        <label>
          開始日期
          <input name="start_date" type="date" required value="${defaultDate}">
        </label>

        <label>
          時間
          ${fieldTimeSelectHtml('field')}
        </label>

        <label class="hidden" id="fieldEndDateBlock">
          結束日期
          <input name="end_date" type="date" value="${defaultDate}">
        </label>

        <label class="hidden" id="fieldMonthlyDayBlock">
          每月幾號
          <select name="monthly_day">
            ${Array.from({ length: 31 }, (_, i) => `<option value="${i + 1}">${i + 1} 號</option>`).join('')}
          </select>
        </label>

        <div class="span-2 hidden" id="fieldWeekdayBlock">
          <div class="field-title">重複星期</div>
          <div class="inline-check-list field-repeat-weekdays">
            ${weekdays.map(([value, label]) => `<label class="inline-check"><input type="checkbox" name="repeat_weekdays" value="${value}">${label}</label>`).join('')}
          </div>
        </div>
      </div>
    </div>
  `
}

function scheduleModeFieldsHtml(prefix, defaultDate = '') {
  return `
    <div class="span-2 block-group schedule-mode-box">
      <div class="group-title">行程模式</div>
      <div class="form-grid inner-grid">
        <label>
          行程模式
          <select name="repeat_mode" id="${prefix}RepeatModeSelect">
            <option value="單日">單日</option>
            <option value="連續日期">連續日期</option>
            <option value="每週重複">每週重複</option>
            <option value="每月重複">每月重複</option>
          </select>
        </label>

        <label>
          開始日期
          <input name="start_date" type="date" required value="${defaultDate}">
        </label>

        <label class="hidden" id="${prefix}EndDateBlock">
          結束日期
          <input name="end_date" type="date" value="${defaultDate}">
        </label>

        <label class="hidden" id="${prefix}MonthlyDayBlock">
          每月幾號
          <select name="monthly_day">
            ${Array.from({ length: 31 }, (_, i) => `<option value="${i + 1}">${i + 1} 號</option>`).join('')}
          </select>
        </label>

        <div class="span-2 hidden" id="${prefix}WeekdayBlock">
          <div class="field-title">重複星期</div>
          <div class="inline-check-list">
            ${weekdays.map(([value, label]) => `<label class="inline-check"><input type="checkbox" name="repeat_weekdays" value="${value}">${label}</label>`).join('')}
          </div>
        </div>
      </div>
    </div>
  `
}

function refreshScheduleModeBlocks(prefix) {
  const modeSelect = document.querySelector(`#${prefix}RepeatModeSelect`)
  if (!modeSelect) return

  const mode = modeSelect.value
  document.querySelector(`#${prefix}EndDateBlock`)?.classList.toggle('hidden', mode === '單日')
  document.querySelector(`#${prefix}WeekdayBlock`)?.classList.toggle('hidden', mode !== '每週重複')
  document.querySelector(`#${prefix}MonthlyDayBlock`)?.classList.toggle('hidden', mode !== '每月重複')
}

function getScheduleModeEndDate(form) {
  const mode = form.get('repeat_mode') || '單日'
  if (mode === '單日') return form.get('start_date')
  return form.get('end_date') || form.get('start_date')
}

function departmentOptionsHtml(selectedDepartment = '') {
  const names = [...new Set(staffList.map(staff => staff.department_name).filter(Boolean))]
  if (selectedDepartment && !names.includes(selectedDepartment)) names.unshift(selectedDepartment)

  return names.map(name => `<option value="${escapeHtml(name)}" ${name === selectedDepartment ? 'selected' : ''}>${escapeHtml(name)}</option>`).join('')
}

function staffOptionsSelectHtml(selectedStaffId = '') {
  const rows = canAssignAllStaff() ? staffList : getAssignableStaffRows()
  return rows.map(staff => `
    <option value="${staff.staff_id}" ${staff.staff_id === selectedStaffId ? 'selected' : ''} data-department="${escapeHtml(staff.department_name || '')}">
      ${staff.name}｜${staff.department_name || ''}
    </option>
  `).join('')
}


function openFieldScheduleModal(defaults = {}) {
  if (!canCreateFieldSchedule()) return denyPermission('你的角色沒有新增外務行程權限。')
  const defaultDate = defaults.date || todayString()
  const defaultStaffId = defaults.staffId || currentProfile?.staff_id || ''

  const modal = document.createElement('div')
  modal.className = 'modal-backdrop'
  modal.innerHTML = `
    <div class="modal-panel">
      <div class="modal-header">
        <h3>新增外務行程</h3>
        <button class="icon-btn" id="closeFieldModalBtn" type="button">×</button>
      </div>

      <form id="fieldScheduleForm" class="form-grid">
        <div class="span-2">
          <div class="field-title">外務人員</div>
          <div class="checkbox-list">${fieldStaffOptionsHtml(defaultStaffId) || '<div class="empty-state">目前沒有可選外務人員。</div>'}</div>
        </div>

        ${fieldModeTimeFieldsHtml(defaultDate)}

        <div class="span-2 field-location-box">
          <label>
            地點選擇
            <select name="field_location_select" id="fieldLocationSelect">
              ${fieldLocationOptionsHtml()}
            </select>
          </label>

          <label>
            地點
            <input name="location_name" placeholder="可手動輸入地點">
          </label>

          <label class="span-2">
            地址
            <input name="address" placeholder="選擇地點後自動帶出，也可手動修改">
          </label>
        </div>

        <label>
          目的
          <select name="field_purpose">
            ${optionHtmlForItems(getManagedListOption('fieldPurposeOptions', fieldPurposeOptions))}
          </select>
        </label>

        <div class="field-special-box field-special-compact-box">
          <div class="field-title">特殊提醒</div>
          <div class="inline-check-list field-special-compact-list">${fieldSpecialReminderChecksHtml()}</div>
        </div>

        <label class="span-2">
          內容
          <textarea name="description" rows="3" placeholder="請輸入外務內容"></textarea>
        </label>

        <div class="span-2 field-items-grid">
          <label>
            現金
            <input name="cash_note" placeholder="例如：金額 / 用途 / 無">
          </label>

          <label>
            印章
            <input name="seal_note" placeholder="例如：公司章 / 私章 / 無">
          </label>

          <label>
            證件
            <input name="document_note" placeholder="例如：護照 / 居留證 / 文件 / 無">
          </label>
        </div>

        <div class="span-2 field-next-box">
          <div class="field-title">下次領件 / 送審</div>
          <div class="compact-grid">
            <label>
              下次類型
              <select name="next_action_type">
                <option value="">無</option>
                <option value="下次領件">下次領件</option>
                <option value="下次送審">下次送審</option>
              </select>
            </label>

            <label>
              下次日期
              <input name="next_action_date" type="date">
            </label>

            <label>
              下次時間
              ${fieldTimeSelectHtml('next')}
            </label>

            <label>
              下次人員
              <select name="next_staff_id">
                ${fieldStaffSelectOptionsHtml('')}
              </select>
            </label>
          </div>
          <p class="field-hint">若填寫下次類型、日期與人員，儲存後會自動建立下一筆外務行程；下次時間可不填。</p>
        </div>

        <div class="modal-actions span-2">
          <button type="button" class="secondary-btn" id="cancelFieldModalBtn">取消</button>
          <button type="submit" class="primary-btn">儲存外務</button>
        </div>
      </form>
    </div>
  `

  document.body.appendChild(modal)
  initFieldSpecialDropdowns(modal)

  const fieldRepeatModeSelect = document.querySelector('#fieldRepeatModeSelect')
  if (fieldRepeatModeSelect) {
    fieldRepeatModeSelect.addEventListener('change', () => refreshScheduleModeBlocks('field'))
    refreshScheduleModeBlocks('field')
  }

  const locationSelect = document.querySelector('#fieldLocationSelect')
  if (locationSelect) {
    locationSelect.addEventListener('change', () => setFieldLocationFromSelect(locationSelect))
  }

  document.querySelector('#closeFieldModalBtn').addEventListener('click', () => modal.remove())
  document.querySelector('#cancelFieldModalBtn').addEventListener('click', () => modal.remove())
  document.querySelector('#fieldScheduleForm').addEventListener('submit', event => saveFieldSchedule(event, modal))
}

async function saveFieldSchedule(event, modal) {
  event.preventDefault()
  if (saving) return
  saving = true

  if (!canCreateFieldSchedule()) { alert('你的角色沒有新增外務行程權限。'); saving = false; return }

  try {
    const form = new FormData(event.target)
    const executorIds = [...document.querySelectorAll('input[name="field_executor"]:checked')].map(input => input.value)

    if (!executorIds.length) {
      alert('請至少選擇一位外務人員。')
      saving = false
      return
    }

    const nextType = form.get('next_action_type') || ''
    const nextDate = form.get('next_action_date') || ''
    const nextStaffId = form.get('next_staff_id') || ''
    const nextFieldTime = getFieldSingleTimeValue(form, 'next')

    if ((nextType || nextDate || nextStaffId || nextFieldTime) && !(nextType && nextDate && nextStaffId)) {
      alert('若要建立下次領件 / 送審行程，請完整填寫下次類型、下次日期與下次人員；下次時間可不填。')
      saving = false
      return
    }

    const selectedStaff = staffList.filter(staff => executorIds.includes(staff.staff_id))
    const firstStaff = selectedStaff[0]
    const purpose = form.get('field_purpose') || '外務日'
    const locationName = form.get('location_name') || ''
    const address = form.get('address') || ''
    const fieldTime = getFieldSingleTimeValue(form, 'field')
    const title = `${purpose}${locationName ? '｜' + locationName : '｜外務'}`
    const specialReminders = [...document.querySelectorAll('input[name="field_special_reminder"]:checked')].map(input => input.value)
    const nextStaffName = getFieldStaffName(nextStaffId)

    const noteParts = [
      buildRepeatNote(form),
      `外務目的：${purpose}`,
      form.get('cash_note') ? `現金：${form.get('cash_note')}` : '',
      form.get('seal_note') ? `印章：${form.get('seal_note')}` : '',
      form.get('document_note') ? `證件：${form.get('document_note')}` : '',
      specialReminders.length ? `特殊提醒：${specialReminders.join('、')}` : '',
      nextType && nextDate ? `${nextType}：${nextDate}${nextFieldTime ? ' ' + nextFieldTime : ''}` : '',
      nextStaffName ? `下次人員：${nextStaffName}` : ''
    ].filter(Boolean)

    const payload = {
      creator_profile_id: currentProfile.profile_id,
      creator_staff_id: currentProfile.staff_id,
      creator_name: currentProfile.name || currentProfile.email,
      department_id: firstStaff.department_id || currentProfile.department_id,
      department_name: firstStaff.department_name || currentProfile.department_name,
      category: '外務行程',
      schedule_type: '外務',
      sub_type: purpose,
      sub_type_note: noteParts.join('｜'),
      title,
      description: form.get('description') || null,
      start_date: form.get('start_date'),
      end_date: getScheduleModeEndDate(form),
      time_type: getFieldTimeTypeFromForm(form, 'edit_field'),
      start_time: getFieldDbTimeValue(fieldTime),
      end_time: null,
      customer_name: null,
      location_name: locationName || null,
      address: address || null,
      car_no: null,
      status: '未完成',
      need_service_record: false,
      service_record_submitted: false,
      service_record_submitted_date: null
    }

    const { data: schedule, error: scheduleError } = await supabase
      .from('schedules')
      .insert(payload)
      .select()
      .single()

    if (scheduleError) {
      console.error(scheduleError)
      alert('新增外務行程失敗：' + scheduleError.message)
      saving = false
      return
    }

    const assigneeRows = selectedStaff.map(staff => ({
      schedule_id: schedule.schedule_id,
      staff_id: staff.staff_id,
      staff_name: staff.name,
      department_id: staff.department_id,
      department_name: staff.department_name,
      position: staff.position,
      assignee_type: 'executor'
    }))

    const { error: assigneeError } = await supabase.from('schedule_assignees').insert(assigneeRows)

    if (assigneeError) {
      console.error(assigneeError)
      alert('外務行程已建立，但外務人員寫入失敗：' + assigneeError.message)
      saving = false
      return
    }

    await supabase.from('audit_logs').insert({
      operated_by_profile_id: currentProfile.profile_id,
      operated_by_staff_id: currentProfile.staff_id,
      operated_by_name: currentProfile.name || currentProfile.email,
      action_type: '新增',
      source_type: 'schedule',
      source_id: schedule.schedule_id,
      note: 'V002-1I-2-3 新增外務行程'
    })

    if (nextType && nextDate && nextStaffId) {
      const nextStaff = staffList.find(staff => staff.staff_id === nextStaffId)
      const nextPayload = {
        ...payload,
        department_id: nextStaff?.department_id || payload.department_id,
        department_name: nextStaff?.department_name || payload.department_name,
        sub_type: nextType,
        sub_type_note: [
          `外務目的：${nextType}`,
          `來源外務：${payload.start_date}｜${purpose}`,
          locationName ? `地點：${locationName}` : '',
          address ? `地址：${address}` : ''
        ].filter(Boolean).join('｜'),
        title: `${nextType}${locationName ? '｜' + locationName : '｜外務'}`,
        description: `由 ${payload.start_date} ${purpose} 自動建立的下次外務行程。${payload.description ? '\n' + payload.description : ''}`,
        start_date: nextDate,
        end_date: nextDate,
        time_type: getFieldTimeTypeFromForm(form, 'next'),
        start_time: getFieldDbTimeValue(nextFieldTime),
        end_time: null,
        status: '未完成'
      }

      const { data: nextSchedule, error: nextError } = await supabase
        .from('schedules')
        .insert(nextPayload)
        .select()
        .single()

      if (nextError) {
        console.error(nextError)
        alert('外務行程已建立，但下次領件 / 送審行程建立失敗：' + nextError.message)
      } else {
        const { error: nextAssigneeError } = await supabase.from('schedule_assignees').insert([{
          schedule_id: nextSchedule.schedule_id,
          staff_id: nextStaff.staff_id,
          staff_name: nextStaff.name,
          department_id: nextStaff.department_id,
          department_name: nextStaff.department_name,
          position: nextStaff.position,
          assignee_type: 'executor'
        }])

        if (nextAssigneeError) {
          console.error(nextAssigneeError)
          alert('下次外務行程已建立，但下次人員寫入失敗：' + nextAssigneeError.message)
        }

        await supabase.from('audit_logs').insert({
          operated_by_profile_id: currentProfile.profile_id,
          operated_by_staff_id: currentProfile.staff_id,
          operated_by_name: currentProfile.name || currentProfile.email,
          action_type: '新增',
          source_type: 'schedule',
          source_id: nextSchedule.schedule_id,
          note: `V002-1I-2-3 自動建立${nextType}行程`
        })
      }
    }

    modal.remove()
    await refreshData()
    saving = false
    renderApp()
  } catch (err) {
    console.error(err)
    alert('新增外務行程失敗：' + (err?.message || err))
    saving = false
  }
}
/* FOR-e V002-1I-2 END - field schedule add form */


function openScheduleModal() {
  if (!canCreateForCurrentPage()) return denyPermission('你的角色沒有新增此類行程的權限。')
  const defaultStaffId = currentProfile.staff_id || ''
  const availableFormCategories = getAvailableFormCategories()
  const formCategoryOptions = availableFormCategories.map(category => `<option value="${category}">${category}</option>`).join('')
  const todoOptions = getManagedListOption('todoItems', todoItems).map(item => `<option value="${item}">${item}</option>`).join('')
  const leaveOptions = getManagedListOption('leaveMeetingTypes', leaveMeetingTypes).map(item => `<option value="${item}">${item}</option>`).join('')
  const carSelectOptions = getManagedListOption('carOptions', carOptions).map(item => `<option value="${escapeHtml(item)}">${escapeHtml(item)}</option>`).join('')
  const weekdayChecks = weekdays.map(([value, label]) => `
    <label class="inline-check"><input type="checkbox" name="repeat_weekdays" value="${value}">${label}</label>
  `).join('')
  const documentChecks = documentOptions.map(item => `
    <label class="inline-check"><input type="checkbox" name="document_items" value="${item}">${item}</label>
  `).join('')

  const deliveryDocumentChecks = deliveryDocumentItems.map(item => `
    <label class="inline-check"><input type="checkbox" name="delivery_items" value="${item}">${item}</label>
  `).join('')

  const modal = document.createElement('div')
  modal.className = 'modal-backdrop'
  modal.innerHTML = `
    <div class="modal-panel">
      <div class="modal-header">
        <h3>${currentPage === 'personalTodo' ? '新增一般待辦' : '新增行程'}</h3>
        <button class="icon-btn" id="closeModalBtn" type="button">×</button>
      </div>

      <form id="scheduleForm" class="form-grid">
        <label>
          執行狀態
          <input value="未完成" disabled>
        </label>

        <label>
          類別
          <select name="category" id="categorySelect">
            ${formCategoryOptions}
          </select>
        </label>

        <div class="span-2 block-group">
          <div class="group-title">日期與週期</div>

          <div class="form-grid inner-grid">
            <label>
              行程模式
              <select name="repeat_mode" id="repeatModeSelect">
                <option value="單日">單日</option>
                <option value="連續日期">連續日期</option>
                <option value="每週重複">每週重複</option>
                <option value="每月重複">每月重複</option>
              </select>
            </label>

            <label>
              開始日期
              <input name="start_date" type="date" required value="${todayString()}">
            </label>

            <label class="hidden" id="endDateBlock">
              結束日期
              <input name="end_date" type="date" value="${todayString()}">
            </label>

            <label class="hidden" id="monthlyDayBlock">
              每月幾號
              <select name="monthly_day">
                ${Array.from({ length: 31 }, (_, i) => `<option value="${i + 1}">${i + 1} 號</option>`).join('')}
              </select>
            </label>

            <div class="span-2 hidden" id="weekdayBlock">
              <div class="field-title">重複星期</div>
              <div class="inline-check-list">${weekdayChecks}</div>
            </div>
          </div>
        </div>

        <div class="span-2 block-group">
          <div class="group-title">時間</div>

          <div class="form-grid inner-grid">
            <label>
              時間類型
              <select name="time_type" id="timeTypeSelect">
                <option value="不指定">不指定</option>
                <option value="上午">上午</option>
                <option value="下午">下午</option>
              </select>
            </label>

            <div class="span-2 conditional-time hidden" id="timeRangeBlock">
              <div class="time-select-row">
                <label>
                  開始小時
                  <select name="start_hour">${hourOptionsHtml('09')}</select>
                </label>
                <label>
                  開始分鐘
                  <select name="start_minute">${minuteOptionsHtml('00')}</select>
                </label>
                <label>
                  結束小時
                  <select name="end_hour">${hourOptionsHtml('10')}</select>
                </label>
                <label>
                  結束分鐘
                  <select name="end_minute">${minuteOptionsHtml('00')}</select>
                </label>
              </div>
              <p class="field-hint">上午、下午、指定時間都可設定起訖時間；分鐘固定 5 分鐘為單位。</p>
            </div>
          </div>
        </div>

        <div class="span-2 form-section hidden service-grid service-top-grid" data-section="service-top">
          <label>
            行程類型
            <select name="schedule_type" id="serviceTypeSelect">
              ${serviceTypeOptionsHtml(false)}
            </select>
          </label>

          <div class="extra-schedule-box compact-hide-for-reminder">
            <label>
              是否有附加行程
              <select name="has_extra_schedule" id="hasExtraScheduleSelect">
                <option value="否">否</option>
                <option value="是">是</option>
              </select>
            </label>
            <div id="extraScheduleBlock" class="hidden">
              <label>
                附加行程
                <select name="sub_type">
                  ${serviceTypeOptionsHtml(true)}
                </select>
              </label>
              <label>
                附加行程備註
                <input name="sub_type_note" placeholder="附加行程補充說明">
              </label>
            </div>
          </div>

          <div class="span-2 service-record-box compact-hide-for-reminder">
            <div class="field-title">服務紀錄單</div>
            <label class="service-check">
              <input name="need_service_record" type="checkbox" id="needServiceRecordCheck">
              <span>需要服務紀錄單</span>
            </label>
            <label class="service-check">
              <input name="service_record_submitted_check" type="checkbox" id="serviceRecordSubmittedCheck">
              <span>已繳交</span>
            </label>
          </div>

          <label class="span-2 compact-hide-for-reminder">
            服務紀錄單繳交日期
            <input name="service_record_submitted_date" type="date">
          </label>
        </div>

        <div class="span-2 form-section hidden service-location-top" data-section="service-location">
          <label>
            區域 / 客戶名稱
            <input name="customer_name" placeholder="例如：客來喜">
          </label>

          <label>
            地點
            <input name="location_name" placeholder="例如：醫院、公司、宿舍">
          </label>

          <label class="span-2">
            地址
            <input name="address" placeholder="完整地址，可先空白">
          </label>
        </div>

        <div class="span-2 form-section" data-section="common-simple">
          <label>
            標題
            <input name="title" required placeholder="請輸入標題">
          </label>

          <label>
            內容
            <textarea name="description" rows="3" placeholder="請輸入內容；可手動輸入，也可依行程類型帶入"></textarea>
          </label>
          <div class="span-2 schedule-template-row">
            <button type="button" class="secondary-btn" id="applyScheduleTypeContentBtn">帶入對應內容</button>
            <span>依行程類型帶入預設內容；已輸入內容時，按此按鈕才會覆蓋。</span>
          </div>
        </div>

        <div class="span-2 form-section hidden" data-section="todo">
          <label>
            待辦項目
            <select name="todo_item">
              ${todoOptions}
            </select>
          </label>
          <p class="field-hint">待辦項目之後會放到「選項管理」維護。</p>
        </div>

        <div class="span-2 form-section hidden" data-section="leave-meeting">
          <label>
            類別細項
            <select name="leave_meeting_type">
              ${leaveOptions}
            </select>
          </label>

          <label>
            代理人
            <select name="proxy_staff_id" id="proxyStaffSelect">
              ${staffSelectOptionsHtml()}
            </select>
          </label>
        </div>

        <div class="span-2 form-section hidden" data-section="document-delivery">
          <div class="document-delivery-box">
            <div class="field-title">交付項目（可複選）</div>
            <div class="inline-check-list">${deliveryDocumentChecks}</div>
          </div>
        </div>

        <div class="span-2 form-section hidden service-grid" data-section="service">
          <div class="span-2 vehicle-doc-row compact-hide-for-reminder">
            <label>
              公務車
              <select name="car_no">
                ${carSelectOptions}
              </select>
            </label>

            <div class="document-section">
            <label>
              是否有證件
              <select name="has_documents" id="hasDocumentsSelect">
                <option value="否">否</option>
                <option value="是">是</option>
              </select>
            </label>

            <div id="documentOptionsBlock" class="hidden">
              <div class="field-title">證件勾選</div>
              <div class="inline-check-list">${documentChecks}</div>
              <label>
                證件 / 文件備註
                <input name="document_note" placeholder="例如：文件內容、用印說明、其他證件">
              </label>
            </div>
          </div>

          </div>

          <div class="span-2 conditional-service hidden medical-followup-inline-box" data-service-extra="醫療">
            <div class="group-title">醫療回診資訊</div>
            <div class="compact-grid">
              <label>
                下次回診日期
                <input name="medical_next_date" type="date">
              </label>
              <label>
                下次回診時間
                ${compactTimeSelectHtml('medical_next', '09', '00')}
              </label>
              <label>
                掛號號碼
                <input name="medical_register_no" placeholder="請輸入掛號號碼">
              </label>
              <label>
                下次執行人
                <select name="medical_next_staff">
                  ${staffSelectOptionsHtml()}
                </select>
              </label>
            </div>
            <p class="field-hint">此處會寫入行程備註；之後也可在查看行程頁點「回診資訊」修改。</p>
          </div>

          <div class="span-2 conditional-service hidden" data-service-extra="逃跑通知">
            <div class="group-title">逃跑通知日期</div>
            <div class="compact-grid">
              <label>逃跑第一天<input name="runaway_day1" type="date"></label>
              <label>逃跑第二天<input name="runaway_day2" type="date"></label>
              <label>逃跑第三天<input name="runaway_day3" type="date"></label>
            </div>
          </div>

          <div class="span-2 conditional-service hidden" data-service-extra="轉出追蹤">
            <div class="group-title">轉出追蹤日期</div>
            <div class="compact-grid">
              <label>聘僱終止日<input name="transfer_end_date" type="date"></label>
              <label>轉出到期日<input name="transfer_due_date" type="date"></label>
            </div>
          </div>

          <div class="span-2 conditional-service hidden" data-service-extra="返台提醒">
            <div class="group-title">返台提醒</div>
            <div class="compact-grid">
              <label>返台日<input name="return_date" type="date"></label>
              <label>返台班機<input name="return_flight" placeholder="返台班機"></label>
              <label>
                返台班機時間
                ${compactTimeSelectHtml('arrival', '09', '00')}
              </label>
            </div>
          </div>

          <div class="span-2 conditional-service hidden" data-service-extra="住變資訊">
            <div class="group-title">住變資訊</div>
            <div class="compact-grid">
              <label>
                搬家時間
                ${compactTimeSelectHtml('housing_move', '09', '00')}
              </label>
              <label class="span-2">搬家地址<input name="housing_note" placeholder="請輸入搬家地址"></label>
              <div class="span-2 notice compact-special-note">請記得追蹤租約</div>
            </div>
          </div>

          <div class="span-2 conditional-service hidden" data-service-extra="驗證提醒">
            <div class="group-title">驗證提醒</div>
            <div class="compact-grid">
              <label>結薪日<input name="verify_last_work_date" type="date"></label>
              <label>預計驗證日<input name="verify_date" type="date"></label>
              <label>預計離境日<input name="verify_leave_date" type="date"></label>
            </div>
          </div>

        </div>

        <div class="span-2">
          <div class="field-title">執行者</div>
          <div class="checkbox-list">${staffOptionsHtml(defaultStaffId) || '<div class="empty-state">目前沒有可選人員。</div>'}</div>
        </div>

        <div class="modal-actions span-2">
          <button type="button" class="secondary-btn" id="cancelModalBtn">取消</button>
          <button type="submit" class="primary-btn">儲存</button>
        </div>
      </form>
    </div>
  `

  document.body.appendChild(modal)

  const categorySelect = document.querySelector('#categorySelect')
  const timeTypeSelect = document.querySelector('#timeTypeSelect')
  const repeatModeSelect = document.querySelector('#repeatModeSelect')
  const serviceTypeSelect = document.querySelector('#serviceTypeSelect')
  const hasDocumentsSelect = document.querySelector('#hasDocumentsSelect')

  function refreshFormSections() {
    const category = categorySelect.value
    const form = document.querySelector('#scheduleForm')
    if (!form) return

    form.querySelectorAll('.form-section').forEach(section => section.classList.add('hidden'))
    form.querySelector('[data-section="common-simple"]')?.classList.remove('hidden')

    if (category === '待辦事項') form.querySelector('[data-section="todo"]')?.classList.remove('hidden')
    if (category === '請假 / 會議 / 活動 / 外訓') form.querySelector('[data-section="leave-meeting"]')?.classList.remove('hidden')
    if (category === '證件交付') form.querySelector('[data-section="document-delivery"]')?.classList.remove('hidden')
    if (category === '服務行程') {
      form.querySelector('[data-section="service-top"]')?.classList.remove('hidden')
      form.querySelector('[data-section="service-location"]')?.classList.remove('hidden')
      form.querySelector('[data-section="service"]')?.classList.remove('hidden')
    }

    applyCreateCompactSpecialFields()
  }

  function refreshTimeBlock() {
    const showTime = ['上午', '下午'].includes(timeTypeSelect.value)
    document.querySelector('#timeRangeBlock').classList.toggle('hidden', !showTime)
  }

  function refreshRepeatBlocks() {
    const mode = repeatModeSelect.value
    document.querySelector('#endDateBlock').classList.toggle('hidden', mode === '單日')
    document.querySelector('#weekdayBlock').classList.toggle('hidden', mode !== '每週重複')
    document.querySelector('#monthlyDayBlock').classList.toggle('hidden', mode !== '每月重複')
  }

  function refreshServiceExtras() {
    const selected = serviceTypeSelect.value

    document.querySelectorAll('[data-service-extra]').forEach(block => {
      block.classList.toggle('hidden', block.dataset.serviceExtra !== selected)
    })

    if (selected === '收送簽文件') {
      hasDocumentsSelect.value = '是'
    }

    refreshDocumentsBlock()
    applyCreateCompactSpecialFields()
  }

  function refreshDocumentsBlock() {
    document.querySelector('#documentOptionsBlock').classList.toggle('hidden', hasDocumentsSelect.value !== '是')
  }

  categorySelect.addEventListener('change', () => {
    refreshFormSections()
    applyScheduleTypeTemplateToForm(document.querySelector('#scheduleForm'), false)
  })

  const todoItemSelect = document.querySelector('select[name="todo_item"]')
  if (todoItemSelect) {
    todoItemSelect.addEventListener('change', () => applyScheduleTypeTemplateToForm(document.querySelector('#scheduleForm'), false))
  }

  const leaveMeetingTypeSelect = document.querySelector('select[name="leave_meeting_type"]')
  if (leaveMeetingTypeSelect) {
    leaveMeetingTypeSelect.addEventListener('change', () => applyScheduleTypeTemplateToForm(document.querySelector('#scheduleForm'), false))
  }

  timeTypeSelect.addEventListener('change', refreshTimeBlock)
  repeatModeSelect.addEventListener('change', refreshRepeatBlocks)
  serviceTypeSelect.addEventListener('change', () => {
    refreshServiceExtras()
    applyScheduleTypeTemplateToForm(document.querySelector('#scheduleForm'), false)
  })
  hasDocumentsSelect.addEventListener('change', refreshDocumentsBlock)

  const applyScheduleTypeContentBtn = document.querySelector('#applyScheduleTypeContentBtn')
  if (applyScheduleTypeContentBtn) {
    applyScheduleTypeContentBtn.addEventListener('click', () => {
      const form = document.querySelector('#scheduleForm')
      const applied = applyScheduleTypeTemplateToForm(form, true)
      if (!applied) alert('目前行程類型沒有設定對應內容，請到選項管理新增。')
    })
  }

  const hasExtraScheduleSelect = document.querySelector('#hasExtraScheduleSelect')
  const extraScheduleBlock = document.querySelector('#extraScheduleBlock')

  function refreshExtraScheduleBlock() {
    if (!hasExtraScheduleSelect || !extraScheduleBlock) return
    extraScheduleBlock.classList.toggle('hidden', hasExtraScheduleSelect.value !== '是')
  }

  if (hasExtraScheduleSelect) hasExtraScheduleSelect.addEventListener('change', refreshExtraScheduleBlock)

  const needServiceRecordCheck = document.querySelector('#needServiceRecordCheck')
  const serviceRecordSubmittedCheck = document.querySelector('#serviceRecordSubmittedCheck')
  const submittedDateInput = document.querySelector('input[name="service_record_submitted_date"]')

  function refreshServiceRecordChecks() {
    if (!needServiceRecordCheck || !serviceRecordSubmittedCheck || !submittedDateInput) return
    if (!needServiceRecordCheck.checked) {
      serviceRecordSubmittedCheck.checked = false
      submittedDateInput.value = ''
      serviceRecordSubmittedCheck.disabled = true
      submittedDateInput.disabled = true
    } else {
      serviceRecordSubmittedCheck.disabled = false
      submittedDateInput.disabled = !serviceRecordSubmittedCheck.checked
      if (serviceRecordSubmittedCheck.checked && !submittedDateInput.value) submittedDateInput.value = todayString()
      if (!serviceRecordSubmittedCheck.checked) submittedDateInput.value = ''
    }
  }

  if (needServiceRecordCheck) needServiceRecordCheck.addEventListener('change', refreshServiceRecordChecks)
  if (serviceRecordSubmittedCheck) serviceRecordSubmittedCheck.addEventListener('change', refreshServiceRecordChecks)

  refreshServiceRecordChecks()

  refreshFormSections()
  refreshTimeBlock()
  refreshRepeatBlocks()
  refreshServiceExtras()
  refreshDocumentsBlock()
  refreshExtraScheduleBlock()
  applyCreateCompactSpecialFields()

  document.querySelector('#closeModalBtn').addEventListener('click', () => modal.remove())
  document.querySelector('#cancelModalBtn').addEventListener('click', () => modal.remove())
  document.querySelector('#scheduleForm').addEventListener('submit', event => saveSchedule(event, modal))
}

function getTimeValue(form, prefix) {
  const timeType = form.get('time_type')
  if (!['上午', '下午'].includes(timeType)) return null
  const hour = form.get(`${prefix}_hour`) || '00'
  const minute = form.get(`${prefix}_minute`) || '00'
  return `${hour}:${minute}:00`
}

function getCompactTime(form, prefix) {
  const type = form.get(`${prefix}_time_type`) || '不指定'
  const hour = form.get(`${prefix}_hour`) || ''
  const minute = form.get(`${prefix}_minute`) || ''
  if (type === '不指定') return '不指定'
  return `${type} ${hour}:${minute}`
}

function getSelectedProxyName() {
  const proxySelect = document.querySelector('#proxyStaffSelect')
  if (!proxySelect || !proxySelect.value) return ''
  const option = proxySelect.options[proxySelect.selectedIndex]
  return option ? option.textContent : ''
}

function getStaffNameFromSelect(name) {
  const select = document.querySelector(`select[name="${name}"]`)
  if (!select || !select.value) return ''
  const option = select.options[select.selectedIndex]
  return option ? option.textContent : ''
}

function buildRepeatNote(form) {
  const mode = form.get('repeat_mode') || '單日'
  if (mode === '單日') return '行程模式：單日'
  if (mode === '連續日期') return '行程模式：連續日期'

  if (mode === '每週重複') {
    const selectedValues = form.getAll('repeat_weekdays').filter(Boolean)
    const defaultWeekday = getWeekdayValueFromDateKey(form.get('start_date') || todayString())
    const values = selectedValues.length ? selectedValues : [defaultWeekday]
    const days = values
      .map(value => weekdays.find(([weekdayValue]) => weekdayValue === value)?.[1] || value)
      .join('、')
    return `行程模式：每週重複；重複星期：${days || '未設定'}`
  }

  if (mode === '每月重複') return `行程模式：每月重複；每月 ${form.get('monthly_day') || Number(String(form.get('start_date') || todayString()).slice(8, 10)) || 1} 號`
  return `行程模式：${mode}`
}

function buildServiceExtraNotes(form, scheduleType) {
  const notes = []

  if (form.get('has_documents') === '是') {
    const docs = [...document.querySelectorAll('input[name="document_items"]:checked')]
      .map(input => input.value)
      .join('、')
    const docNote = form.get('document_note') || ''
    notes.push(`證件：${docs || '未勾選'}${docNote ? '；' + docNote : ''}`)
  }

  if (scheduleType === '醫療') {
    if (form.get('medical_next_date')) notes.push(`下次回診：${form.get('medical_next_date')} ${getCompactTime(form, 'medical_next')}`)
    if (getStaffNameFromSelect('medical_next_staff')) notes.push(`下次執行人：${getStaffNameFromSelect('medical_next_staff')}`)
    if (form.get('medical_register_no')) notes.push(`掛號號碼：${form.get('medical_register_no')}`)
  }

  if (scheduleType === '逃跑通知') {
    if (form.get('runaway_day1')) notes.push(`逃跑第一天：${form.get('runaway_day1')}`)
    if (form.get('runaway_day2')) notes.push(`逃跑第二天：${form.get('runaway_day2')}`)
    if (form.get('runaway_day3')) notes.push(`逃跑第三天：${form.get('runaway_day3')}`)
  }

  if (scheduleType === '轉出追蹤') {
    if (form.get('transfer_end_date')) notes.push(`聘僱聘僱終止日：${form.get('transfer_end_date')}`)
    if (form.get('transfer_due_date')) notes.push(`轉出到期日：${form.get('transfer_due_date')}`)
  }

  if (scheduleType === '返台提醒') {
    if (form.get('return_date')) notes.push(`返台日：${form.get('return_date')}`)
    if (form.get('return_flight')) notes.push(`返台班機：${form.get('return_flight')}`)
    notes.push(`返台班機時間：${getCompactTime(form, 'arrival')}`)
  }

  if (scheduleType === '住變資訊') {
    notes.push(`搬家時間：${getCompactTime(form, 'housing_move')}`)
    if (form.get('housing_note')) notes.push(`搬家地址：${form.get('housing_note')}`)
    notes.push('請記得追蹤租約')
  }

  if (scheduleType === '驗證提醒') {
    if (form.get('verify_last_work_date')) notes.push(`結薪日：${form.get('verify_last_work_date')}`)
    if (form.get('verify_date')) notes.push(`預計驗證日：${form.get('verify_date')}`)
    if (form.get('verify_leave_date')) notes.push(`預計離境日：${form.get('verify_leave_date')}`)
  }

  return notes
}


async function createMedicalFollowupScheduleFromForm(form, originalSchedule, originalPayload) {
  const nextDate = form.get('medical_next_date')
  const nextStaffId = form.get('medical_next_staff')

  if (!nextDate || !nextStaffId) return

  const nextStaff = staffList.find(staff => staff.staff_id === nextStaffId)
  if (!nextStaff) return

  const nextTimeType = form.get('medical_next_time_type') || '不指定'
  const nextHour = form.get('medical_next_hour') || '09'
  const nextMinute = form.get('medical_next_minute') || '00'
  const nextStartTime = nextTimeType === '不指定' ? null : `${nextHour}:${nextMinute}:00`
  const registerNo = form.get('medical_register_no') || ''
  const originalTitle = originalPayload.title || '醫療回診'

  const followPayload = {
    creator_profile_id: currentProfile.profile_id,
    creator_staff_id: currentProfile.staff_id,
    creator_name: currentProfile.name || currentProfile.email,
    department_id: nextStaff.department_id || currentProfile.department_id,
    department_name: nextStaff.department_name || currentProfile.department_name,
    category: '服務行程',
    schedule_type: '醫療',
    sub_type: null,
    sub_type_note: [
      '行程模式：單日',
      `原醫療行程：${originalSchedule.schedule_id}`,
      `掛號號碼：${registerNo || '未填寫'}`,
      `下次執行人：${nextStaff.name || ''}`
    ].filter(Boolean).join('｜'),
    title: `回診｜${originalTitle}`,
    description: `由醫療行程自動建立下一次回診。\n原行程：${originalTitle}`,
    start_date: nextDate,
    end_date: nextDate,
    time_type: nextTimeType,
    start_time: nextStartTime,
    end_time: null,
    customer_name: originalPayload.customer_name || null,
    location_name: originalPayload.location_name || null,
    address: originalPayload.address || null,
    car_no: null,
    status: '未完成',
    need_service_record: true,
    service_record_submitted: false,
    service_record_submitted_date: null
  }

  const { data: followSchedule, error: followError } = await supabase
    .from('schedules')
    .insert(followPayload)
    .select()
    .single()

  if (followError) {
    console.error(followError)
    alert('主行程已建立，但下次回診行程建立失敗：' + followError.message)
    return
  }

  const { error: assigneeError } = await supabase.from('schedule_assignees').insert([{
    schedule_id: followSchedule.schedule_id,
    staff_id: nextStaff.staff_id,
    staff_name: nextStaff.name,
    department_id: nextStaff.department_id,
    department_name: nextStaff.department_name,
    position: nextStaff.position,
    assignee_type: 'executor'
  }])

  if (assigneeError) {
    console.error(assigneeError)
    alert('下次回診行程已建立，但執行人寫入失敗：' + assigneeError.message)
  }

  await supabase.from('audit_logs').insert({
    operated_by_profile_id: currentProfile.profile_id,
    operated_by_staff_id: currentProfile.staff_id,
    operated_by_name: currentProfile.name || currentProfile.email,
    action_type: '新增',
    source_type: 'schedule',
    source_id: followSchedule.schedule_id,
    note: `自動建立下次回診｜原行程 ${originalSchedule.schedule_id}`
  })
}




function openMedicalFollowModal(scheduleId) {
  const row = schedules.find(item => item.schedule_id === scheduleId)
  if (!row) return

  if (!isMine(row)) {
    alert('只有行程建立者或被指派人員可以填寫回診資訊。')
    return
  }

  const currentDate = getNoteValue(row, '下次回診').split(' ')[0] || ''
  const currentTimeText = getNoteValue(row, '下次回診').split(' ').slice(1).join(' ')
  const currentRegisterNo = getNoteValue(row, '掛號號碼')
  const currentStaffText = getNoteValue(row, '下次執行人') || getNoteValue(row, '下次執行者')

  const modal = document.createElement('div')
  modal.className = 'modal-backdrop'
  modal.innerHTML = `
    <div class="modal-panel detail-panel">
      <div class="modal-header">
        <h3>醫療回診資訊</h3>
        <button class="icon-btn" id="closeMedicalFollowBtn" type="button">×</button>
      </div>

      <div class="notice">
        回診資訊在「查看」頁填寫，不放在新增行程表單，避免新增服務行程時版面太複雜。
      </div>

      <div class="form-grid">
        <label>
          下次回診日期
          <input name="medical_next_date" id="medicalNextDateInput" type="date" value="${currentDate}">
        </label>

        <label>
          下次回診時間
          <div class="compact-time-row">
            <select id="medicalNextTimeType">
              <option value="不指定">不指定</option>
              <option value="上午">上午</option>
              <option value="下午">下午</option>
            </select>
            <select id="medicalNextHour">${hourOptionsHtml('09')}</select>
            <select id="medicalNextMinute">${minuteOptionsHtml('00')}</select>
          </div>
        </label>

        <label>
          下次執行者
          <select id="medicalNextStaffSelect">
            ${staffSelectOptionsHtml()}
          </select>
        </label>

        <label>
          掛號號碼
          <input id="medicalRegisterNoInput" value="${escapeHtml(currentRegisterNo)}" placeholder="掛號號碼">
        </label>
      </div>

      <div class="modal-actions">
        <button type="button" class="secondary-btn" id="cancelMedicalFollowBtn">取消</button>
        <button type="button" class="primary-btn" id="saveMedicalFollowBtn">儲存回診資訊</button>
      </div>
    </div>
  `

  document.body.appendChild(modal)

  if (currentTimeText.includes('上午')) document.querySelector('#medicalNextTimeType').value = '上午'
  if (currentTimeText.includes('下午')) document.querySelector('#medicalNextTimeType').value = '下午'

  const staffSelect = document.querySelector('#medicalNextStaffSelect')
  if (currentStaffText) {
    Array.from(staffSelect.options).forEach((option, index) => {
      if (option.textContent === currentStaffText) staffSelect.selectedIndex = index
    })
  }

  document.querySelector('#closeMedicalFollowBtn').addEventListener('click', () => modal.remove())
  document.querySelector('#cancelMedicalFollowBtn').addEventListener('click', () => modal.remove())
  document.querySelector('#saveMedicalFollowBtn').addEventListener('click', async () => {
    const dateValue = document.querySelector('#medicalNextDateInput').value
    const timeType = document.querySelector('#medicalNextTimeType').value
    const hour = document.querySelector('#medicalNextHour').value
    const minute = document.querySelector('#medicalNextMinute').value
    const staffId = staffSelect.value
    const staffText = staffSelect.value ? staffSelect.options[staffSelect.selectedIndex].textContent : ''
    const registerNo = document.querySelector('#medicalRegisterNoInput').value.trim()

    if (!dateValue) {
      alert('請輸入下次回診日期，系統才可以建立下一次回診行程。')
      return
    }

    if (!staffId) {
      alert('請選擇下次執行者。')
      return
    }

    const cleanNote = removeNoteLabels(row.sub_type_note, ['下次回診', '下次執行者', '掛號號碼'])
    const newParts = []
    if (cleanNote) newParts.push(cleanNote)
    if (dateValue) newParts.push(`下次回診：${dateValue} ${timeType === '不指定' ? '不指定' : timeType + ' ' + hour + ':' + minute}`)
    if (staffText) newParts.push(`下次執行者：${staffText}`)
    if (registerNo) newParts.push(`掛號號碼：${registerNo}`)

    const nextStartTime = timeType === '不指定' ? null : `${hour}:${minute}:00`

    const { error } = await supabase.rpc('save_medical_followup_and_create_schedule', {
      target_schedule_id: scheduleId,
      followup_note_value: newParts.join('｜'),
      next_date_value: dateValue,
      next_time_type_value: timeType,
      next_start_time_value: nextStartTime,
      next_staff_id_value: staffId,
      register_no_value: registerNo || null
    })

    if (error) {
      alert('更新回診資訊失敗：' + error.message)
      return
    }

    modal.remove()
    await refreshData()
    renderApp()
  })
}


function openEditScheduleModal(scheduleId) {
  const row = schedules.find(item => item.schedule_id === scheduleId)
  if (!row) return

  if (!canModifySchedule(row)) {
    alert('您沒有權限修改此行程。')
    return
  }

  const start = parseTimeForEdit(row.start_time, '09', '00')
  const end = parseTimeForEdit(row.end_time, '10', '00')
  const categoryOptions = optionHtml(formCategories, row.category)
  const serviceTypeOptions = optionHtml(getManagedListOption('serviceScheduleTypes', serviceScheduleTypes), row.schedule_type || '其他')
  const subTypeOptions = optionHtml(getManagedListOption('serviceScheduleTypes', serviceScheduleTypes), row.sub_type || '', true)
  const carSelectOptions = optionHtml(getManagedListOption('carOptions', carOptions), row.car_no || '不使用')
  const editTodoOptions = optionHtml(todoItems, row.category === '待辦事項' ? (row.sub_type || '') : '')
  const editLeaveOptions = optionHtml(leaveMeetingTypes, row.category === '請假 / 會議 / 活動 / 外訓' ? (row.sub_type || row.schedule_type || '') : '')
  const editDeliveryItems = row.category === '證件交付' ? splitMultiValue(row.sub_type || getNoteValue(row, '交付項目')) : []
  const editDeliveryChecks = checkedOptionsHtml(deliveryDocumentItems, editDeliveryItems, 'edit_delivery_items')
  const timeOptions = timeTypeOptionsHtml(row.time_type || '不指定')
  const showTime = ['上午', '下午'].includes(row.time_type)

  const modal = document.createElement('div')
  modal.className = 'modal-backdrop'
  modal.innerHTML = `
    <div class="modal-panel">
      <div class="modal-header">
        <h3>修改行程</h3>
        <button class="icon-btn" id="closeEditModalBtn" type="button">×</button>
      </div>

      <form id="editScheduleForm" class="form-grid">
        <label>
          類別
          <select name="category" id="editCategorySelect">
            ${categoryOptions}
          </select>
        </label>

        <label>
          狀態
          <input value="${escapeHtml(row.status || '未完成')}" disabled>
        </label>

        <div class="span-2 service-grid" id="editServiceBlock">
          <label>
            行程類型
            <select name="schedule_type">
              ${serviceTypeOptions}
            </select>
          </label>

          <div class="extra-schedule-box compact-hide-for-reminder">
            <label>
              是否有附加行程
              <select name="has_extra_schedule" id="editHasExtraScheduleSelect">
                <option value="否" ${row.sub_type ? '' : 'selected'}>否</option>
                <option value="是" ${row.sub_type ? 'selected' : ''}>是</option>
              </select>
            </label>
            <div id="editExtraScheduleBlock" class="${row.sub_type ? '' : 'hidden'}">
              <label>
                附加行程
                <select name="sub_type">
                  ${subTypeOptions}
                </select>
              </label>
            </div>
          </div>

          <div class="span-2 service-record-box compact-hide-for-reminder">
            <div class="field-title">服務紀錄單</div>
            <label class="service-check">
              <input name="need_service_record" type="checkbox" id="editNeedServiceRecordCheck" ${row.need_service_record ? 'checked' : ''}>
              <span>需要服務紀錄單</span>
            </label>
            <label class="service-check">
              <input name="service_record_submitted_check" type="checkbox" id="editServiceRecordSubmittedCheck" ${row.service_record_submitted_date ? 'checked' : ''}>
              <span>已繳交</span>
            </label>
          </div>

          <label class="compact-hide-for-reminder">
            服務紀錄單繳交日期
            <input name="service_record_submitted_date" type="date" value="${row.service_record_submitted_date || ''}">
          </label>

          <label class="compact-hide-for-reminder">
            公務車
            <select name="car_no">
              ${carSelectOptions}
            </select>
          </label>
        </div>

        <div class="span-2 service-location-top" id="editServiceLocationBlock">
          <label>
            區域 / 客戶
            <input name="customer_name" value="${escapeHtml(row.customer_name || '')}">
          </label>

          <label>
            地點
            <input name="location_name" value="${escapeHtml(row.location_name || '')}">
          </label>

          <label class="span-2">
            地址
            <input name="address" value="${escapeHtml(row.address || '')}">
          </label>
        </div>

        <div class="span-2 form-section hidden" id="editTodoBlock">
          <label>
            待辦項目
            <select name="edit_todo_item">
              ${editTodoOptions}
            </select>
          </label>
        </div>

        <div class="span-2 form-section hidden" id="editLeaveMeetingBlock">
          <label>
            類別細項
            <select name="edit_leave_meeting_type">
              ${editLeaveOptions}
            </select>
          </label>
        </div>

        <div class="span-2 form-section hidden" id="editDocumentDeliveryBlock">
          <div class="document-delivery-box">
            <div class="field-title">交付項目（可複選）</div>
            <div class="inline-check-list">${editDeliveryChecks}</div>
          </div>
        </div>

        <label class="span-2">
          標題
          <input name="title" required value="${escapeHtml(row.title || '')}">
        </label>

        <label class="span-2">
          內容
          <textarea name="description" rows="3">${escapeHtml(row.description || '')}</textarea>
        </label>

        <label>
          開始日期
          <input name="start_date" type="date" required value="${row.start_date || todayString()}">
        </label>

        <label>
          結束日期
          <input name="end_date" type="date" value="${row.end_date || row.start_date || todayString()}">
        </label>

        <label>
          時間類型
          <select name="time_type" id="editTimeTypeSelect">
            ${timeOptions}
          </select>
        </label>

        <div class="span-2 conditional-time ${showTime ? '' : 'hidden'}" id="editTimeRangeBlock">
          <div class="time-select-row">
            <label>
              開始小時
              <select name="start_hour">${hourOptionsHtml(start.hour)}</select>
            </label>
            <label>
              開始分鐘
              <select name="start_minute">${minuteOptionsHtml(start.minute)}</select>
            </label>
            <label>
              結束小時
              <select name="end_hour">${hourOptionsHtml(end.hour)}</select>
            </label>
            <label>
              結束分鐘
              <select name="end_minute">${minuteOptionsHtml(end.minute)}</select>
            </label>
          </div>
        </div>

        <label class="span-2">
          備註 / 提醒 / 證件
          <input name="sub_type_note" value="${escapeHtml(row.sub_type_note || '')}">
        </label>

        <div class="span-2 edit-assignee-box">
          <div class="field-title">執行者</div>
          <div class="checkbox-list">${editStaffOptionsHtml(row) || '<div class="empty-state">目前沒有可選人員。</div>'}</div>
          <p class="field-hint">修改執行者會同步更新個人行程表與行程總覽。</p>
        </div>

        <div class="modal-actions span-2">
          <button type="button" class="secondary-btn" id="cancelEditModalBtn">取消</button>
          <button type="submit" class="primary-btn">儲存修改</button>
        </div>
      </form>
    </div>
  `

  document.body.appendChild(modal)

  const categorySelect = document.querySelector('#editCategorySelect')
  const serviceBlock = document.querySelector('#editServiceBlock')
  const serviceLocationBlock = document.querySelector('#editServiceLocationBlock')
  const timeTypeSelect = document.querySelector('#editTimeTypeSelect')
  const timeBlock = document.querySelector('#editTimeRangeBlock')
  const needRecordCheck = document.querySelector('#editNeedServiceRecordCheck')
  const submittedCheck = document.querySelector('#editServiceRecordSubmittedCheck')
  const editServiceTypeSelect = document.querySelector('#editServiceBlock select[name="schedule_type"]')
  const editHasExtraScheduleSelect = document.querySelector('#editHasExtraScheduleSelect')
  const editExtraScheduleBlock = document.querySelector('#editExtraScheduleBlock')
  const submittedDateInput = document.querySelector('input[name="service_record_submitted_date"]')

  function refreshEditServiceBlock() {
    const category = categorySelect.value
    const todoBlock = document.querySelector('#editTodoBlock')
    const leaveBlock = document.querySelector('#editLeaveMeetingBlock')
    const deliveryBlock = document.querySelector('#editDocumentDeliveryBlock')

    serviceBlock.classList.toggle('hidden', category !== '服務行程')
    if (serviceLocationBlock) serviceLocationBlock.classList.toggle('hidden', category !== '服務行程')
    if (todoBlock) todoBlock.classList.toggle('hidden', category !== '待辦事項')
    if (leaveBlock) leaveBlock.classList.toggle('hidden', category !== '請假 / 會議 / 活動 / 外訓')
    if (deliveryBlock) deliveryBlock.classList.toggle('hidden', category !== '證件交付')

    applyEditCompactSpecialFields()
  }

  function refreshEditTimeBlock() {
    timeBlock.classList.toggle('hidden', !['上午', '下午'].includes(timeTypeSelect.value))
  }

  function refreshEditExtraScheduleBlock() {
    if (!editHasExtraScheduleSelect || !editExtraScheduleBlock) return
    editExtraScheduleBlock.classList.toggle('hidden', editHasExtraScheduleSelect.value !== '是')
    applyEditCompactSpecialFields()
  }

  function refreshEditServiceRecordChecks() {
    if (!needRecordCheck.checked) {
      submittedCheck.checked = false
      submittedCheck.disabled = true
      submittedDateInput.value = ''
      submittedDateInput.disabled = true
    } else {
      submittedCheck.disabled = false
      submittedDateInput.disabled = !submittedCheck.checked
      if (submittedCheck.checked && !submittedDateInput.value) submittedDateInput.value = todayString()
      if (!submittedCheck.checked) submittedDateInput.value = ''
    }
  }

  categorySelect.addEventListener('change', refreshEditServiceBlock)
  timeTypeSelect.addEventListener('change', refreshEditTimeBlock)
  needRecordCheck.addEventListener('change', refreshEditServiceRecordChecks)
  submittedCheck.addEventListener('change', refreshEditServiceRecordChecks)
  if (editServiceTypeSelect) editServiceTypeSelect.addEventListener('change', applyEditCompactSpecialFields)
  if (editHasExtraScheduleSelect) editHasExtraScheduleSelect.addEventListener('change', refreshEditExtraScheduleBlock)

  refreshEditExtraScheduleBlock()
  refreshEditServiceBlock()
  refreshEditTimeBlock()
  refreshEditServiceRecordChecks()
  applyEditCompactSpecialFields()

  document.querySelector('#closeEditModalBtn').addEventListener('click', () => modal.remove())
  document.querySelector('#cancelEditModalBtn').addEventListener('click', () => modal.remove())
  document.querySelector('#editScheduleForm').addEventListener('submit', event => saveEditedSchedule(event, modal, row))
}

async function saveEditedSchedule(event, modal, originalRow) {
  event.preventDefault()

  const form = new FormData(event.target)
  const editExecutorIds = [...document.querySelectorAll('input[name="edit_executor"]:checked')].map(input => input.value)

  if (!editExecutorIds.length) {
    alert('請至少選擇一位執行者。')
    return
  }

  const category = form.get('category')
  const isService = category === '服務行程'
  const submitted = isService && form.get('service_record_submitted_check') === 'on'
  const submittedDate = submitted ? (form.get('service_record_submitted_date') || todayString()) : null
  const editDeliveryItems = [...document.querySelectorAll('input[name="edit_delivery_items"]:checked')].map(input => input.value)
  const editDeliveryText = editDeliveryItems.join('、')

  let editScheduleType = category
  let editSubType = null
  let editSubTypeNote = null

  if (category === '服務行程') {
    editScheduleType = form.get('schedule_type') || '其他'
    editSubType = !isCompactSpecialScheduleType(editScheduleType) && form.get('has_extra_schedule') === '是' ? (form.get('sub_type') || null) : null
    editSubTypeNote = isCompactSpecialScheduleType(editScheduleType) ? null : (form.get('sub_type_note') || null)
  }

  if (category === '一般記事') {
    editScheduleType = '一般記事'
  }

  if (category === '待辦事項') {
    editScheduleType = '待辦事項'
    editSubType = form.get('edit_todo_item') || null
  }

  if (category === '請假 / 會議 / 活動 / 外訓') {
    editScheduleType = form.get('edit_leave_meeting_type') || '請假'
    editSubType = editScheduleType
  }

  if (category === '證件交付') {
    editScheduleType = '證件交付'
    editSubType = editDeliveryText || null
    editSubTypeNote = editDeliveryText ? `交付項目：${editDeliveryText}` : null
  }

  const payload = {
    category,
    schedule_type: editScheduleType,
    sub_type: editSubType,
    sub_type_note: editSubTypeNote,
    title: form.get('title'),
    description: form.get('description') || null,
    start_date: form.get('start_date'),
    end_date: form.get('end_date') || form.get('start_date'),
    time_type: form.get('time_type'),
    start_time: getTimeValue(form, 'start'),
    end_time: getTimeValue(form, 'end'),
    customer_name: isService ? (form.get('customer_name') || null) : null,
    location_name: isService ? (form.get('location_name') || null) : null,
    address: isService ? (form.get('address') || null) : null,
    car_no: isService && !isCompactSpecialScheduleType(form.get('schedule_type')) ? (form.get('car_no') || null) : null,
    need_service_record: isService && !isCompactSpecialScheduleType(form.get('schedule_type')) && form.get('need_service_record') === 'on',
    service_record_submitted: isService && !isCompactSpecialScheduleType(form.get('schedule_type')) && submitted,
    service_record_submitted_date: isService && !isCompactSpecialScheduleType(form.get('schedule_type')) ? submittedDate : null
  }

  const { error } = await supabase
    .from('schedules')
    .update(payload)
    .eq('schedule_id', originalRow.schedule_id)

  if (error) {
    alert('修改行程失敗：' + error.message)
    return
  }

  const { error: assigneeError } = await supabase.rpc('update_schedule_assignees', {
    target_schedule_id: originalRow.schedule_id,
    staff_ids_value: editExecutorIds
  })

  if (assigneeError) {
    alert('行程內容已修改，但執行者同步失敗：' + assigneeError.message)
    return
  }

  await supabase.from('audit_logs').insert({
    operated_by_profile_id: currentProfile.profile_id,
    operated_by_staff_id: currentProfile.staff_id,
    operated_by_name: currentProfile.name || currentProfile.email,
    action_type: '修改',
    source_type: 'schedule',
    source_id: originalRow.schedule_id,
    note: 'V002-1F 修改行程內容'
  })

  modal.remove()
  await refreshData()
  renderApp()
}


async function saveSchedule(event, modal) {
  event.preventDefault()
  if (saving) return
  saving = true
  // V002-1H-7-2_SAVE_GUARD_FIX
  try {

  const form = new FormData(event.target)

  const category = form.get('category')
  if (!canCreateScheduleCategory(category)) {
    alert('你的角色沒有新增此類行程的權限。')
    saving = false
    return
  }
  const availableFormCategories = getAvailableFormCategories()
  if (!availableFormCategories.includes(category)) {
    alert('此頁面只能新增一般記事、待辦事項、請假 / 會議 / 活動 / 外訓。')
    saving = false
    return
  }

  const executorIds = [...document.querySelectorAll('input[name="executor"]:checked')].map(input => input.value)

  if (!executorIds.length) {
    alert('請至少選擇一位執行者。')
    saving = false
    return
  }

  if (form.get('repeat_mode') === '每週重複') {
    const checkedWeekdays = document.querySelectorAll('input[name="repeat_weekdays"]:checked')
    if (!checkedWeekdays.length) {
      alert('每週重複請至少選擇一個星期。')
      saving = false
      return
    }
  }

  const selectedStaff = staffList.filter(staff => executorIds.includes(staff.staff_id))
  const firstStaff = selectedStaff[0]
  const needServiceRecord = category === '服務行程' && form.get('need_service_record') === 'on'
  const serviceRecordSubmitted = category === '服務行程' && form.get('service_record_submitted_check') === 'on'
  const submittedDate = serviceRecordSubmitted ? (form.get('service_record_submitted_date') || todayString()) : null

  let scheduleType = ''
  let subType = ''
  let subTypeNoteParts = [buildRepeatNote(form)]
  let customerName = null
  let locationName = null
  let address = null
  let carNo = null
  let endDate = form.get('repeat_mode') === '單日'
    ? form.get('start_date')
    : (form.get('end_date') || form.get('start_date'))

  if (category === '一般記事') {
    scheduleType = '一般記事'
  }

  if (category === '待辦事項') {
    scheduleType = '待辦事項'
    subType = form.get('todo_item') || null
  }

  if (category === '請假 / 會議 / 活動 / 外訓') {
    scheduleType = form.get('leave_meeting_type') || '請假'
    subType = scheduleType
    if (getSelectedProxyName()) subTypeNoteParts.push(`代理人：${getSelectedProxyName()}`)
  }

  if (category === '證件交付') {
    scheduleType = '證件交付'
    const deliveryItems = [...document.querySelectorAll('input[name="delivery_items"]:checked')]
      .map(input => input.value)
      .join('、')
    subType = deliveryItems || null
    if (deliveryItems) subTypeNoteParts.push(`交付項目：${deliveryItems}`)
  }

  if (category === '服務行程') {
    scheduleType = form.get('schedule_type') || '其他'
    subType = isCompactSpecialScheduleType(scheduleType) ? null : (form.get('has_extra_schedule') === '是' ? (form.get('sub_type') || null) : null)
    customerName = form.get('customer_name') || null
    locationName = form.get('location_name') || null
    address = form.get('address') || null
    carNo = isCompactSpecialScheduleType(scheduleType) ? null : (form.get('car_no') || null)
    if (!isCompactSpecialScheduleType(scheduleType)) {
      subTypeNoteParts.push(...buildServiceExtraNotes(form, scheduleType))
      if (form.get('sub_type_note')) subTypeNoteParts.push(form.get('sub_type_note'))
      if (needServiceRecord) subTypeNoteParts.push(`服務紀錄單：${serviceRecordSubmitted ? '已繳交' : '需要，尚未繳交'}`)
    }
  }

  const schedulePayload = {
    creator_profile_id: currentProfile.profile_id,
    creator_staff_id: currentProfile.staff_id,
    creator_name: currentProfile.name || currentProfile.email,
    department_id: firstStaff.department_id || currentProfile.department_id,
    department_name: firstStaff.department_name || currentProfile.department_name,
    category,
    schedule_type: scheduleType,
    sub_type: subType || null,
    sub_type_note: subTypeNoteParts.filter(Boolean).join('｜'),
    title: form.get('title'),
    description: form.get('description') || null,
    start_date: form.get('start_date'),
    end_date: endDate,
    time_type: form.get('time_type'),
    start_time: getTimeValue(form, 'start'),
    end_time: getTimeValue(form, 'end'),
    customer_name: customerName,
    location_name: locationName,
    address,
    car_no: carNo,
    status: '未完成',
    need_service_record: needServiceRecord,
    service_record_submitted: Boolean(submittedDate),
    service_record_submitted_date: submittedDate
  }

  const { data: schedule, error: scheduleError } = await supabase
    .from('schedules')
    .insert(schedulePayload)
    .select()
    .single()

  if (scheduleError) {
    console.error(scheduleError)
    alert('新增行程失敗：' + scheduleError.message)
    saving = false
    return
  }

  const assigneeRows = selectedStaff.map(staff => ({
    schedule_id: schedule.schedule_id,
    staff_id: staff.staff_id,
    staff_name: staff.name,
    department_id: staff.department_id,
    department_name: staff.department_name,
    position: staff.position,
    assignee_type: 'executor'
  }))

  const { error: assigneeError } = await supabase.from('schedule_assignees').insert(assigneeRows)

  if (assigneeError) {
    console.error(assigneeError)
    alert('行程已建立，但指派人員寫入失敗：' + assigneeError.message)
    saving = false
    return
  }

  if (needServiceRecord) {
    const serviceRows = selectedStaff.map(staff => ({
      schedule_id: schedule.schedule_id,
      staff_id: staff.staff_id,
      staff_name: staff.name,
      department_id: staff.department_id,
      department_name: staff.department_name,
      schedule_date: schedulePayload.start_date,
      schedule_type: schedulePayload.schedule_type,
      title: schedulePayload.title,
      location_name: schedulePayload.location_name || schedulePayload.customer_name,
      need_submit: true,
      submitted: Boolean(submittedDate),
      submitted_date: submittedDate
    }))

    const { error: serviceError } = await supabase.from('service_records').insert(serviceRows)

    if (serviceError) {
      console.error(serviceError)
      alert('行程已建立，但服務紀錄單資料寫入失敗：' + serviceError.message)
    }
  }

  await supabase.from('audit_logs').insert({
    operated_by_profile_id: currentProfile.profile_id,
    operated_by_staff_id: currentProfile.staff_id,
    operated_by_name: currentProfile.name || currentProfile.email,
    action_type: '新增',
    source_type: 'schedule',
    source_id: schedule.schedule_id,
    note: 'V002-1E-4 新增行程'
  })

  modal.remove()
  await refreshData()
  saving = false
  renderApp()
  } catch (err) {
    console.error(err)
    alert('儲存失敗：' + (err?.message || err))
    saving = false
  }
}

async function completeSchedule(scheduleId) {
  if (!confirm('確定要將此行程標記為已完成嗎？')) return

  const { error } = await supabase.rpc('complete_schedule', {
    target_schedule_id: scheduleId
  })

  if (error) {
    alert('完成行程失敗：' + error.message)
    return
  }

  await refreshData()
  renderApp()
}

function openCancelModal(scheduleId) {
  const row = schedules.find(item => item.schedule_id === scheduleId)
  if (!row) return

  const modal = document.createElement('div')
  modal.className = 'modal-backdrop'
  modal.innerHTML = `
    <div class="modal-panel detail-panel">
      <div class="modal-header">
        <h3>取消 / 刪除行程</h3>
        <button class="icon-btn" id="closeCancelModalBtn" type="button">×</button>
      </div>

      <div class="warning-card">
        <strong>防呆提醒</strong>
        <p>系統目前會以「取消行程」方式保留紀錄，不會直接硬刪資料。</p>
      </div>

      <div class="radio-list">
        <label class="radio-row">
          <input type="radio" name="deleteScope" value="只刪今天" checked>
          <span>
            <strong>只刪今天</strong>
            <small>只取消這一筆行程，其他週期行程不受影響。</small>
          </span>
        </label>

        <label class="radio-row">
          <input type="radio" name="deleteScope" value="刪除之後行程（包含今天）">
          <span>
            <strong>刪除之後行程（包含今天）</strong>
            <small>保留今天以前的行程，取消今天與之後的週期行程。</small>
          </span>
        </label>

        <label class="radio-row danger-option">
          <input type="radio" name="deleteScope" value="刪除全部行程">
          <span>
            <strong>刪除全部行程</strong>
            <small>取消整組週期行程，影響最大。</small>
          </span>
        </label>
      </div>

      <label>
        取消原因
        <textarea id="cancelReasonInput" rows="3" placeholder="請輸入取消原因"></textarea>
      </label>

      <div id="deleteAllConfirmBlock" class="hidden">
        <label>
          若選擇「刪除全部行程」，請輸入：刪除全部
          <input id="deleteAllConfirmInput" placeholder="請輸入 刪除全部">
        </label>
      </div>

      <div class="modal-actions">
        <button type="button" class="secondary-btn" id="cancelCancelBtn">返回</button>
        <button type="button" class="danger-btn" id="confirmCancelBtn">確認取消</button>
      </div>
    </div>
  `

  document.body.appendChild(modal)

  function refreshDeleteAllBlock() {
    const scope = document.querySelector('input[name="deleteScope"]:checked')?.value
    document.querySelector('#deleteAllConfirmBlock').classList.toggle('hidden', scope !== '刪除全部行程')
  }

  document.querySelectorAll('input[name="deleteScope"]').forEach(input => {
    input.addEventListener('change', refreshDeleteAllBlock)
  })

  document.querySelector('#closeCancelModalBtn').addEventListener('click', () => modal.remove())
  document.querySelector('#cancelCancelBtn').addEventListener('click', () => modal.remove())
  document.querySelector('#confirmCancelBtn').addEventListener('click', async () => {
    const scope = document.querySelector('input[name="deleteScope"]:checked')?.value || '只刪今天'
    const reason = document.querySelector('#cancelReasonInput').value.trim()

    if (!reason) {
      alert('請輸入取消原因。')
      return
    }

    if (scope === '刪除全部行程') {
      const confirmText = document.querySelector('#deleteAllConfirmInput').value.trim()
      if (confirmText !== '刪除全部') {
        alert('刪除全部行程需輸入「刪除全部」才可繼續。')
        return
      }
    }

    const finalReason = `${scope}｜${reason}`
    modal.remove()
    await cancelSchedule(scheduleId, finalReason)
  })

  refreshDeleteAllBlock()
}

async function cancelSchedule(scheduleId, reason) {
  const { error } = await supabase.rpc('cancel_schedule', {
    target_schedule_id: scheduleId,
    cancel_note: reason
  })

  if (error) {
    alert('取消行程失敗：' + error.message)
    return
  }

  await refreshData()
  renderApp()
}


function openServiceRecordModal(scheduleId) {
  const row = schedules.find(item => item.schedule_id === scheduleId)
  if (!row) return

  const modal = document.createElement('div')
  modal.className = 'modal-backdrop'
  modal.innerHTML = `
    <div class="modal-panel detail-panel">
      <div class="modal-header">
        <h3>服務紀錄單繳交狀況</h3>
        <button class="icon-btn" id="closeRecordModalBtn" type="button">×</button>
      </div>

      <div class="notice">
        行程完成狀態與服務紀錄單繳交狀態分開管理。此處只更新服務紀錄單，不會改變行程是否完成。
      </div>

      <div class="detail-grid">
        <div class="span-2"><span>行程</span><strong>${escapeHtml(row.schedule_type || row.category)}｜${escapeHtml(row.title)}</strong></div>
        <div><span>行程日期</span><strong>${escapeHtml(row.start_date || '-')}</strong></div>
        <div><span>目前狀態</span><strong>${row.service_record_submitted_date ? '已繳交：' + row.service_record_submitted_date : '尚未繳交'}</strong></div>
      </div>

      <label class="service-check record-modal-check">
        <input id="recordSubmittedInput" type="checkbox" ${row.service_record_submitted_date ? 'checked' : ''}>
        <span>已繳交服務紀錄單</span>
      </label>

      <label>
        繳交日期
        <input id="recordSubmittedDateInput" type="date" value="${row.service_record_submitted_date || todayString()}">
      </label>

      <div class="modal-actions">
        <button type="button" class="secondary-btn" id="closeRecordModalBtn2">取消</button>
        <button type="button" class="primary-btn" id="saveRecordStatusBtn">儲存紀錄單狀況</button>
      </div>
    </div>
  `

  document.body.appendChild(modal)

  const submittedInput = document.querySelector('#recordSubmittedInput')
  const dateInput = document.querySelector('#recordSubmittedDateInput')

  function refreshRecordDate() {
    dateInput.disabled = !submittedInput.checked
    if (submittedInput.checked && !dateInput.value) dateInput.value = todayString()
    if (!submittedInput.checked) dateInput.value = ''
  }

  submittedInput.addEventListener('change', refreshRecordDate)
  refreshRecordDate()

  document.querySelector('#closeRecordModalBtn').addEventListener('click', () => modal.remove())
  document.querySelector('#closeRecordModalBtn2').addEventListener('click', () => modal.remove())
  document.querySelector('#saveRecordStatusBtn').addEventListener('click', async () => {
    const submitted = submittedInput.checked
    const submittedDate = submitted ? dateInput.value : null

    if (submitted && !submittedDate) {
      alert('請輸入服務紀錄單繳交日期。')
      return
    }

    const { error } = await supabase.rpc('update_service_record_status', {
      target_schedule_id: scheduleId,
      submitted_value: submitted,
      submitted_date_value: submittedDate
    })

    if (error) {
      alert('更新服務紀錄單狀況失敗：' + error.message)
      return
    }

    modal.remove()
    await refreshData()
    renderApp()
  })
}



function isPasswordRecoveryUrl() {
  const hash = window.location.hash || ''
  const search = window.location.search || ''
  return hash.includes('type=recovery')
    || search.includes('type=recovery')
    || hash.includes('access_token=')
}

function renderPasswordRecoveryPage() {
  document.querySelector('#app').innerHTML = `
    <section class="login-page password-recovery-page">
      <div class="login-card password-recovery-card">
        <div class="login-brand">${renderBrandLogo('square')}</div>
        <h1>設定新密碼</h1>
        <p>請輸入新密碼，至少 6 碼；新密碼不能與舊密碼相同。</p>

        <label for="newPassword">新密碼</label>
        <input id="newPassword" type="password" placeholder="請輸入新密碼，至少 6 碼" autocomplete="new-password" />

        <label for="confirmPassword">再次確認新密碼</label>
        <input id="confirmPassword" type="password" placeholder="請再次輸入新密碼" autocomplete="new-password" />

        <div class="password-hint-box">
          <strong>密碼提示</strong>
          <span>至少 6 碼；不可與舊密碼相同。</span>
        </div>

        <button id="updatePasswordBtn">更新密碼</button>
        <button id="backToLoginBtn" class="secondary-login-btn" type="button">回登入頁</button>
        <div id="passwordRecoveryError" class="error"></div>

        <div class="login-note">
          如果這個頁面不是由重設密碼信件開啟，請重新點選信件內的連結。
        </div>
      </div>
    </section>
  `

  document.querySelector('#updatePasswordBtn').addEventListener('click', updateRecoveryPassword)
  document.querySelector('#backToLoginBtn').addEventListener('click', async () => {
    await supabase.auth.signOut()
    history.replaceState(null, '', window.location.pathname)
    renderLogin()
  })
  document.querySelector('#confirmPassword').addEventListener('keydown', event => {
    if (event.key === 'Enter') updateRecoveryPassword()
  })
}

async function updateRecoveryPassword() {
  const newPassword = document.querySelector('#newPassword').value
  const confirmPassword = document.querySelector('#confirmPassword').value
  const errorText = document.querySelector('#passwordRecoveryError')
  const updateBtn = document.querySelector('#updatePasswordBtn')
  errorText.textContent = ''

  if (!newPassword || newPassword.length < 6) {
    errorText.textContent = '新密碼 至少 6 碼，請至少輸入 6 碼。'
    return
  }

  if (newPassword !== confirmPassword) {
    errorText.textContent = '兩次輸入的新密碼不一致。'
    return
  }

  updateBtn.disabled = true
  updateBtn.textContent = '更新中...'

  const { error } = await supabase.auth.updateUser({
    password: newPassword
  })

  if (error) {
    const message = String(error.message || '')
    if (message.includes('different from the old password')) {
      errorText.textContent = '更新失敗：新密碼不能與舊密碼相同，請換一組 6 碼以上密碼。'
    } else if (message.toLowerCase().includes('password')) {
      errorText.textContent = `更新失敗：${message}。請確認新密碼至少 4 碼，且不要與舊密碼相同。`
    } else {
      errorText.textContent = `更新失敗：${message}`
    }
    updateBtn.disabled = false
    updateBtn.textContent = '更新密碼'
    return
  }

  alert('密碼已更新，請使用新密碼登入。')
  await supabase.auth.signOut()
  currentProfile = null
  history.replaceState(null, '', window.location.pathname)
  renderLogin()
}

async function initialLoad() {
  if (isPasswordRecoveryUrl()) {
    const { data } = await supabase.auth.getSession()

    if (!data?.session) {
      await new Promise(resolve => setTimeout(resolve, 300))
    }

    renderPasswordRecoveryPage()
    return
  }

  await loadProfile()
}


async function logout() {
  await supabase.auth.signOut()
  currentProfile = null
  renderLogin()
}

window.addEventListener('load', initialLoad)

/* FOR-e V002-1H-7 START - personal reminder stable rules */
/*
  V002-1H-7｜個人行程表提醒區確認修正
  只穩定個人提醒區，不動 LOGO、表單欄位、權限、Supabase。
*/
function getPersonalReminderTestSummary() {
  const rows = getPersonalReminderRows()
  return {
    total: rows.length,
    today: rows.filter(row => isTodaySchedule(row)).length,
    overdue: rows.filter(row => isOverdueSchedule(row)).length,
    types: [...new Set(rows.map(row => row.schedule_type).filter(Boolean))]
  }
}
/* FOR-e V002-1H-7 END - personal reminder stable rules */


/* FOR-e V002-1H-8-2 START - safe visible form rules */
/*
  本版只處理畫面顯示規則：
  - 不改行程類型選項
  - 不改 Supabase
  - 不改主要儲存流程
  - 只依類型隱藏不需要區塊
*/
/* FOR-e V002-1H-8-2 END - safe visible form rules */

/* FOR-e V002-1J-1 START - field detail content and simplified actions */
/*
  V002-1J-1｜外務明細顯示內容與右側按鈕簡化
  - 外務明細列表新增內容欄位
  - 右側操作只保留狀態與查看
  - 已送件 / 取消改回進入查看頁後操作，避免列表過於複雜
*/
/* FOR-e V002-1J-1 END - field detail content and simplified actions */

/* FOR-e V002-1K-1-5 START - field ampm time */
/*
  外務行程時間增加上午 / 下午選項。
  若只選上午或下午，不填小時，卡片顯示上午 / 下午。
  若同時選上午 / 下午與小時分鐘，卡片顯示上午 09:00。
*/
/* FOR-e V002-1K-1-5 END - field ampm time */

/* FOR-e V002-1K-1-6 START - field special dropdown */
/*
  外務特殊提醒改為下拉勾選式複選。
  外務時間保留 V002-1K-1-5 的不指定 / 上午 / 下午 + 小時分鐘。
*/
/* FOR-e V002-1K-1-6 END - field special dropdown */

/* FOR-e V002-1L-1-1 START - incident assignee type fix */
/*
  修正新增異況時 schedule_assignees_type_check 失敗。
  負責人 / 協助人員角色保留在 sub_type_note。
  schedule_assignees.assignee_type 一律使用 executor，符合現有 DB constraint。
*/
/* FOR-e V002-1L-1-1 END - incident assignee type fix */

/* FOR-e V002-1L-2 START - incident history edit service record */
/*
  V002-1L-2｜異況追蹤修改、追蹤紀錄與服務紀錄單選項
*/
/* FOR-e V002-1L-2 END - incident history edit service record */

/* FOR-e V002-1L-3 START - incident next tracking button */
/*
  V002-1L-3｜異況新增下次追蹤按鈕
  - 查看異況頁新增「新增下次追蹤」按鈕
  - 異況列表新增「下次追蹤」快捷按鈕
  - 新增追蹤後會追加第 N 次追蹤紀錄，並更新下一次追蹤日期 / 時間
*/
/* FOR-e V002-1L-3 END - incident next tracking button */

/* FOR-e V002-1L-4 START - incident tracking item edit */
/*
  V002-1L-4｜異況追蹤項目可修改
  - 每一筆追蹤紀錄可修改標題與內容
  - 修改後保留第一次、第二次、第三次追蹤順序
*/
/* FOR-e V002-1L-4 END - incident tracking item edit */

/* FOR-e V002-1L-5 START - incident tracking schedule target */
/*
  V002-1L-5｜異況追蹤項目上行程＋執行對象
  - 新增下次追蹤時可選執行對象
  - 儲存後建立一筆追蹤行程並寫入執行對象
  - 追蹤行程同步到所選人員的個人行程與行程總覽
*/
/* FOR-e V002-1L-5 END - incident tracking schedule target */

/* FOR-e V002-1L-6 START - search categories and incident created day schedule */
/*
  V002-1L-6｜行程搜尋類別補外務 / 異況，異況建立當天自動上行程
  - 行程搜尋類別加入：外務行程、異況追蹤、會議室預約
  - 新增異況後，第一次追蹤會自動建立一筆當天行程，並同步到負責 / 協助人員
*/
/* FOR-e V002-1L-6 END - search categories and incident created day schedule */

/* FOR-e V002-1M-1 START - service record dashboard upgrade */
/*
  V002-1M-1｜服務紀錄單總表強化
  - 增加部門 / 行程類型 / 關鍵字篩選
  - 增加本月紀錄統計
  - 增加人員繳交統計
  - 列表增加行程內容預覽
*/
/* FOR-e V002-1M-1 END - service record dashboard upgrade */

/* FOR-e V002-1M-2 START - service record month year department detail */
/*
  V002-1M-2｜服務紀錄單當月 / 當年 / 部門繳交狀況與繳交明細調整
  - 當月個人員繳交狀況
  - 當年個人員繳交狀況
  - 一部 / 二部繳交狀況
  - 繳交明細顯示執行者，不顯示內容
*/
/* FOR-e V002-1M-2 END - service record month year department detail */

/* FOR-e V002-1M-2-1 START - service record person status table */
/*
  V002-1M-2-1｜服務紀錄單個人員繳交狀況改為表格顯示
  - 當月個人員繳交狀況改表格
  - 當年個人員繳交狀況改表格
  - 不再一個人一張卡片
*/
/* FOR-e V002-1M-2-1 END - service record person status table */

/* FOR-e V002-1M-2-2 START - service record combined person table */
/*
  V002-1M-2-2｜服務紀錄單個人員繳交狀況合併表格
  - 當月 / 當年合併到同一張表
  - 不再一人一張卡片
  - 隱藏舊的人員卡片統計樣式
*/
/* FOR-e V002-1M-2-2 END - service record combined person table */

/* FOR-e V002-1N-3 START - statistics numbers no grid */
/*
  V002-1N-3｜統計報表數字版、無格線
  - 顯示清楚數字
  - 不使用表格格線
  - 行程類型、一部二部、服務紀錄單皆改成數字列
*/
/* FOR-e V002-1N-3 END - statistics numbers no grid */

/* FOR-e V002-1N-4 START - statistics simple table style */
/*
  V002-1N-4｜統計報表改成表列型態
  - 類似你提供的列表樣式
  - 顯示清楚數字
  - 沒有表格格線
  - 以橫列方式顯示行程類型、一部/二部、服務紀錄單統計
*/
/* FOR-e V002-1N-4 END - statistics simple table style */

/* FOR-e V002-1N-5 START - statistics by person type and smaller numbers */
/*
  V002-1N-5｜統計報表增加 BY 人員的行程類型統計，並縮小數字。
*/
/* FOR-e V002-1N-5 END - statistics by person type and smaller numbers */

/* FOR-e V002-1N-6 START - person type columns */
/*
  V002-1N-6｜人員統計各行程類型獨立列出
  - 每個行程類型變成獨立欄位
  - 不再用標籤塞在同一欄
*/
/* FOR-e V002-1N-6 END - person type columns */

/* FOR-e V002-1N-7 START - remove service record from stats */
/*
  V002-1N-7｜統計報表移除服務紀錄單統計
  - 統計報表只保留行程類型、一部/二部、人員統計
  - 服務紀錄單統計回到服務紀錄單頁面查看
*/
/* FOR-e V002-1N-7 END - remove service record from stats */

/* FOR-e V002-1O-2 START - schedule type content templates */
/*
  V002-1O-2｜行程類型自動帶出對應內容
  - 新增行程時，依行程類型自動帶入內容
  - 內容可手動輸入，也可按「帶入對應內容」覆蓋帶入
  - 選項管理可新增 / 修改服務行程類型與行程類型對應內容
*/
/* FOR-e V002-1O-2 END - schedule type content templates */

/* FOR-e V002-1O-3 START - options page redesign */
/*
  V002-1O-3｜選項管理頁面重整
  - 改成更直覺的新增 / 更新頁面
  - 移除大面積空白感
  - 同時保留原本儲存邏輯
*/
/* FOR-e V002-1O-3 END - options page redesign */

/* FOR-e V002-1O-4 START - option line editor */
/*
  V002-1O-4｜選項管理單筆新增 / 刪除
  - 每個選項改成一列一筆
  - 支援「新增一筆」與「刪除」
  - 儲存時仍沿用原本 localStorage 選項管理邏輯
*/
/* FOR-e V002-1O-4 END - option line editor */

/* FOR-e V002-1M-2-3 START - service record statistics style */
function buildServiceRecordCombinedRows(records, groupBy = 'staff') {
  const monthRows = getServiceRecordPeriodRows(records, 'month')
  const yearRows = getServiceRecordPeriodRows(records, 'year')

  const getKey = record => groupBy === 'department'
    ? (record.department_name || '未指定')
    : (record.staff_id || record.staff_name || '未指定')

  const getLabel = record => groupBy === 'department'
    ? (record.department_name || '未指定')
    : (record.staff_name || '-')

  const monthMap = new Map(
    summarizeServiceRecordRows(monthRows, getKey, getLabel)
      .map(row => [row.key, row])
  )
  const yearMap = new Map(
    summarizeServiceRecordRows(yearRows, getKey, getLabel)
      .map(row => [row.key, row])
  )

  const keys = [...new Set([...monthMap.keys(), ...yearMap.keys()])]
  return keys.map(key => {
    const month = monthMap.get(key) || { total: 0, pending: 0, overdue: 0, submitted: 0, label: key }
    const year = yearMap.get(key) || { total: 0, pending: 0, overdue: 0, submitted: 0, label: key }
    return {
      key,
      label: month.label || year.label || key,
      month,
      year
    }
  }).sort((a, b) => {
    const aScore = a.month.overdue + a.year.overdue
    const bScore = b.month.overdue + b.year.overdue
    if (bScore !== aScore) return bScore - aScore
    const aPending = a.month.pending + a.year.pending
    const bPending = b.month.pending + b.year.pending
    if (bPending !== aPending) return bPending - aPending
    return String(a.label).localeCompare(String(b.label), 'zh-Hant')
  })
}

function renderServiceRecordPeriodValueCell(value, alert = false) {
  return `<b class="${alert && value ? 'is-alert' : ''}">${value || 0}</b>`
}

function renderServiceRecordCombinedTable(title, subtitle, rows, firstColumnTitle = '人員') {
  return `
    <section class="clean-stats-section">
      <div class="section-title-row">
        <h4>${title}</h4>
        <span>${subtitle}</span>
      </div>

      ${rows.length ? `
        <div class="simple-stat-table-wrap service-record-combined-wrap">
          <div class="service-record-combined-head">
            <span>${firstColumnTitle}</span>
            <span>當月總數</span>
            <span>當月未繳</span>
            <span>當月逾期</span>
            <span>當月已交</span>
            <span>當年總數</span>
            <span>當年未繳</span>
            <span>當年逾期</span>
            <span>當年已交</span>
          </div>

          ${rows.map(row => `
            <div class="service-record-combined-row ${(row.month.overdue + row.year.overdue) ? 'has-overdue' : ''}">
              <strong>${escapeHtml(row.label)}</strong>
              ${renderServiceRecordPeriodValueCell(row.month.total)}
              ${renderServiceRecordPeriodValueCell(row.month.pending)}
              ${renderServiceRecordPeriodValueCell(row.month.overdue, true)}
              ${renderServiceRecordPeriodValueCell(row.month.submitted)}
              ${renderServiceRecordPeriodValueCell(row.year.total)}
              ${renderServiceRecordPeriodValueCell(row.year.pending)}
              ${renderServiceRecordPeriodValueCell(row.year.overdue, true)}
              ${renderServiceRecordPeriodValueCell(row.year.submitted)}
            </div>
          `).join('')}
        </div>
      ` : '<div class="empty-state">目前沒有符合條件的服務紀錄單。</div>'}
    </section>
  `
}

function renderServiceRecordPersonCombinedStatusV2(records) {
  const rows = buildServiceRecordCombinedRows(records, 'staff')
  return renderServiceRecordCombinedTable(
    '個人員繳交狀況',
    '同表顯示當月 / 當年，呈現方式與統計報表一致',
    rows,
    '人員'
  )
}

function renderServiceRecordDepartmentStatusV2(records) {
  const rows = buildServiceRecordCombinedRows(records, 'department')
  return renderServiceRecordCombinedTable(
    '一部、二部繳交狀況',
    '以部門為單位顯示當月 / 當年服務紀錄單狀況',
    rows,
    '部門'
  )
}
/* FOR-e V002-1M-2-3 END - service record statistics style */

/* FOR-e V002-1M-2-3-1 START - build fix duplicated service record functions */
/*
  修正 Vercel build failed：
  renderServiceRecordPersonCombinedStatus / renderServiceRecordDepartmentStatus 重複宣告。
  保留 V002-1M-2-3 新樣式，改由 dashboard 呼叫 V2 函式。
*/
/* FOR-e V002-1M-2-3-1 END - build fix duplicated service record functions */

/* FOR-e V002-1P-1 START - options sr todo incident urgency */
/*
  V002-1P-1｜選項管理版面、服務紀錄單月年分開、當日待辦、異況緊急程度
*/
/* FOR-e V002-1P-1 END - options sr todo incident urgency */

/* FOR-e V002-1P-2 START - sidebar icons */
/*
  V002-1P-2｜側邊欄與手機選單 ICON
  - 左側功能按鈕新增 ICON
  - 手機底部選單同步顯示 ICON
  - 不新增圖片檔，使用內建文字圖示，避免多檔案與載入問題
*/
/* FOR-e V002-1P-2 END - sidebar icons */

/* FOR-e V002-1P-2-1 START - real icon files */
/*
  V002-1P-2-1｜左側選單改用使用者提供的圖檔
  - siren.png：異況追蹤
  - push-pin.png：我指派的事項追蹤 / 外務明細
  - padlock.png：選項管理 / 人員帳號
  其他頁面尚未提供正式圖檔，暫時保留內建符號。
*/
/* FOR-e V002-1P-2-1 END - real icon files */


/* FOR-e V002-1P-2-2 START - full provided icon set */
/*
  V002-1P-2-2｜左側選單全面改用使用者提供 ICON
*/
/* FOR-e V002-1P-2-2 END - full provided icon set */

/* FOR-e V002-1P-2-4 START - uploaded named nav icons */
/*
  V002-1P-2-4｜使用使用者重新上傳並命名的 ICON
  - 個人行程表：calendar-check.png
  - 我指派的事項追蹤：assigned-document.png
  - 外務明細：field-detail-document.png
  - 行程總覽：grid.png
  - 服務紀錄單：hand-heart.png
  - 紀錄單繳交頁：hand-leaf.png
  - 異動紀錄：note.png
  - 保留 V002-1P-2-3 左側靠左對齊設定
*/
/* FOR-e V002-1P-2-4 END - uploaded named nav icons */

/* FOR-e V002-1P-4 START - users account page */
/*
  V002-1P-4｜人員 / 帳號頁正式列表
  - 顯示目前啟用人員清單
  - 支援關鍵字 / 部門 / 角色篩選
  - 顯示人員統計與目前登入帳號
  - 不改 SQL、不新增資料表
*/
/* FOR-e V002-1P-4 END - users account page */

/* FOR-e V002-1P-5 START - field staff checkbox */
/*
  V002-1P-5｜人員 / 帳號增加是否外務人員勾選
  - 管理員可勾選人員是否為外務人員
  - 外務行程的人員清單會依勾選結果顯示
  - 設定暫存 localStorage，不改 SQL
*/
/* FOR-e V002-1P-5 END - field staff checkbox */

/* FOR-e V002-1P-5-1 START - compact field staff toggle */
/*
  V002-1P-5-1｜外務人員勾選改成精簡切換鈕
  - 人員 / 帳號頁的「是否外務人員」不再佔大欄位
  - 改成小型 switch
  - 外務行程人員清單仍依此設定顯示
*/
/* FOR-e V002-1P-5-1 END - compact field staff toggle */

/* FOR-e V002-1P-6-1 START - white schedule background with accent */
/*
  V002-1P-6-1｜行程顏色改為白底＋左側色條
  - 行程卡片背景統一以白色為主
  - 顏色設定改為左側標示色
  - 套用個人行程、行程總覽、外務行程、會議室預約
*/
/* FOR-e V002-1P-6-1 END - white schedule background with accent */

/* FOR-e V002-1P-6-2 START - colored border restore text */
/*
  V002-1P-6-2｜行程卡片改成白底＋外框顏色
  - 不再使用左側色條
  - 顏色改套用整張卡片外框
  - 字體顏色恢復原本樣式
*/
/* FOR-e V002-1P-6-2 END - colored border restore text */

/* FOR-e V002-1P-6-3 START - card border reminders todo */
/*
  V002-1P-6-3
  - 會議室預約卡片外框固定 #DFD3C3
  - 行程卡片外框加粗
  - 個人行程待確認 / 待通知提醒區固定顯示並強化辨識
  - 個人一般待辦新增當日待辦提醒通知
*/
/* FOR-e V002-1P-6-3 END - card border reminders todo */

/* FOR-e V002-1P-6-4 START - meeting firstTracking fix */
/*
  V002-1P-6-4｜修正新增會議室預約 firstTracking is not defined
  - 原因：會議室預約 payload 誤用了異況追蹤的 firstTracking 變數
  - 修正：會議室 description 改回讀取表單 description
*/
/* FOR-e V002-1P-6-4 END - meeting firstTracking fix */

/* FOR-e V002-1P-6-5 START - reminder color and color picker align */
/*
  V002-1P-6-5
  - 提醒事項預設色改為 #FF8383
  - 舊版 localStorage 若仍是 #EED3D9，會自動更新為 #FF8383
  - 顏色設定頁的顏色選擇靠左對齊
*/
/* FOR-e V002-1P-6-5 END - reminder color and color picker align */

/* FOR-e V002-1P-6-6 START - overdue meeting repeat color layout */
/*
  V002-1P-6-6
  - 個人行程表新增任務逾期通知
  - 會議室預約行程模式顯示修正：連續日期 / 每週重複 / 每月重複
  - 每週重複未勾星期時，自動用開始日期的星期
  - 顏色設定版面整理成固定欄位
*/
/* FOR-e V002-1P-6-6 END - overdue meeting repeat color layout */

/* FOR-e V002-1P-7 START - users add edit staff */
/*
  V002-1P-7｜人員 / 帳號新增與修改人員資料
  - 新增人員
  - 修改姓名 / 部門 / 職務 / 角色 / 狀態 / 顯示順序
  - 管理是否為外務人員
  - staffList 維持只給啟用人員供行程下拉使用
  - allStaffList 供人員 / 帳號頁查看啟用與停用資料
  - 不處理 Supabase Auth 登入密碼
*/
/* FOR-e V002-1P-7 END - users add edit staff */

/* FOR-e V002-1P-8 START - no completion position select color header align */
/*
  V002-1P-8
  - 請假 / 會議 / 外訓 / 活動只顯示於行事曆，不控管已完成
  - 此類行程不列入逾期任務、不出現已完成按鈕、不列入指派追蹤
  - 統計未完成 / 已完成排除此類不控管行程
  - 新增 / 修改人員的職務改為下拉選項
  - 顏色設定表頭與內容對齊
*/
/* FOR-e V002-1P-8 END - no completion position select color header align */

/* FOR-e V002-1P-9 START - line notification page */
/*
  V002-1P-9｜LINE 通知頁正式初版
  - 今日行程通知
  - 任務逾期通知
  - 待確認 / 待通知提醒
  - 今日外務通知
  - 今日會議室通知
  - 可複製文字與 LINE 分享
*/
/* FOR-e V002-1P-9 END - line notification page */

/* FOR-e V002-1P-10 START - line target and color column center */
/*
  V002-1P-10
  - LINE 通知對象可選指定人員
  - 管理員 / 主管可選：自己、全部、單一人員
  - 一般角色維持只能選自己
  - 顏色設定頁「顏色」欄位置中對齊表頭
*/
/* FOR-e V002-1P-10 END - line target and color column center */

/* FOR-e V002-1P-11 START - common csv export */
/*
  V002-1P-11｜共通匯出 CSV
  - 依目前頁面 / 篩選條件 / 目前週次匯出
  - 支援個人行程、待辦、指派追蹤、行程總覽、外務、會議室、異況、搜尋、統計、服務紀錄單、異動紀錄、人員與 LINE 通知資料
*/
/* FOR-e V002-1P-11 END - common csv export */

/* FOR-e V002-1P-12 START - export filters mobile color preview */
/*
  V002-1P-12
  - 匯出 CSV 改為先選條件：年 / 月 / 日 / 部門 / 人員
  - 手機版不顯示匯出 CSV
  - 顏色設定預覽欄位寬度統一
*/
/* FOR-e V002-1P-12 END - export filters mobile color preview */

/* FOR-e V002-1P-13 START - audit detail and filters */
/*
  V002-1P-13｜異動紀錄查詢強化
  - 新增來源類型 / 部門 / 人員篩選
  - 列表新增查看明細
  - 明細可回到原行程
  - 異動紀錄統計增加來源與動作摘要
*/
/* FOR-e V002-1P-13 END - audit detail and filters */

/* FOR-e V002-1P-14 START - shared app settings */
/*
  V002-1P-14｜系統設定共用化
  - 顏色設定支援 app_settings 共用
  - 外務人員勾選支援 app_settings 共用
  - 未執行 SQL 時仍 fallback localStorage，不阻斷系統
*/
/* FOR-e V002-1P-14 END - shared app settings */

/* FOR-e V002-1P-15 START - users department summary */
/*
  V002-1P-15｜人員 / 帳號統計改為每個部門都顯示
  - 不再只固定顯示一部、二部
  - 依目前人員清單 / 篩選結果，自動列出每個部門的人數
  - 保留人員總數、啟用、停用、外務人員統計
*/
/* FOR-e V002-1P-15 END - users department summary */

/* FOR-e V002-1P-16 START - shared options management */
/*
  V002-1P-16｜選項管理共用化
  - 選項管理改用 app_settings.managed_options 儲存
  - 外務目的 / 地點、會議室、異況類型、待辦項目等可跨帳號同步
  - 未執行 SQL 時仍 fallback localStorage
*/
/* FOR-e V002-1P-16 END - shared options management */

/* FOR-e V002-1P-17 START - login account status reset */
/*
  V002-1P-17｜人員 / 帳號加入登入帳號狀態與重設密碼
  - 讀取 profiles 顯示登入 Email / 已綁定狀態
  - 管理員可寄送 Supabase 重設密碼信
  - 新增 / 修改人員視窗顯示登入帳號狀態
  - 不在前端建立 Supabase Auth 使用者，避免暴露 service_role
*/
/* FOR-e V002-1P-17 END - login account status reset */

/* FOR-e V002-1P-18 START - create login account */
/*
  V002-1P-18｜建立登入帳號
  - 人員未綁定登入帳號時顯示「建立」
  - 透過 Supabase Edge Function admin-create-user 建立 Auth 使用者
  - 建立後寫入 profiles 並綁定 staff_id
  - 前端不保存 service_role key
*/
/* FOR-e V002-1P-18 END - create login account */

/* FOR-e V002-1P-19 START - merged shared options and login reminder */
/*
  V002-1P-19｜合併共用選項與登入提醒
  - 修復 V002-1P-17 / 1P-18 可能覆蓋 V002-1P-16 選項共用化的問題
  - 選項管理恢復 Supabase app_settings.managed_options 共用
  - 登入後顯示今日提醒總覽：今日行程、今日待辦、任務逾期、待確認 / 待通知
*/
/* FOR-e V002-1P-19 END - merged shared options and login reminder */

/* FOR-e V002-1P-20 START - login function check */
/*
  V002-1P-20｜帳號建立功能檢查
  - 人員 / 帳號頁新增「檢查帳號功能」
  - 可確認 admin-create-user Edge Function 是否已部署與權限是否正常
  - 更新 admin-create-user function 支援 dry_run 檢查
  - 補回 Edge Function 檔案，避免版本小包覆蓋後遺失
*/
/* FOR-e V002-1P-20 END - login function check */

/* FOR-e V002-1P-22 START - staff not found fix */
/*
  V002-1P-22｜修正建立登入帳號 Staff not found
  - 前端建立帳號時會檢查 staff_id 是否有效
  - 傳送 staff_snapshot 給 Edge Function 作為備援
  - 避免 staff_id 空值 / undefined 導致 Function 找不到 staff
*/
/* FOR-e V002-1P-22 END - staff not found fix */

/* FOR-e V002-1P-23 START - robust login staff lookup */
/*
  V002-1P-23｜建立登入帳號 staff 查找強化
  - 前端送出 frontend_version，方便確認是否已更新
  - 建立失敗時顯示 staff_id / hint / code
*/
/* FOR-e V002-1P-23 END - robust login staff lookup */

/* FOR-e V002-1P-24 START - login no staff hard fail */
/*
  V002-1P-24｜建立登入帳號不再因 staff 查不到直接失敗
  - staff_snapshot 增加 display_order
  - 前端標記 V002-1P-24，方便確認部署版本
*/
/* FOR-e V002-1P-24 END - login no staff hard fail */

/* FOR-e V002-1P-29 START - password recovery page */
/*
  V002-1P-29｜重設密碼頁面
  - 修正重設密碼信件導到 localhost 後無法修改密碼的問題
  - 重設連結回到 FOR-e 後顯示設定新密碼頁
  - resetPasswordForEmail 在 localhost 觸發時也會導向正式 Vercel 網址
*/
/* FOR-e V002-1P-29 END - password recovery page */

/* FOR-e V002-1P-30 START - password 4 chars hint */
/*
  V002-1P-30｜密碼提示與 4 碼設定
  - 重設密碼頁提示 至少 6 碼
  - 新密碼不能與舊密碼相同時，改顯示中文提示
  - 建立登入帳號的臨時密碼改為 4 碼
*/
/* FOR-e V002-1P-30 END - password 4 chars hint */

/* FOR-e V002-1P-31 START - role based permissions */
/*
  V002-1P-31｜權限依角色執行
  - 建立統一角色權限矩陣
  - 新增 / 修改 / 完成 / 取消 / 指派 / 匯出 / 選項 / 帳號管理依角色控管
  - 非主管 / 行政 / 管理員不可建立服務行程、外務、異況
  - 一般角色新增行程時只可新增自己的個人事項
*/
/* FOR-e V002-1P-31 END - role based permissions */

/* FOR-e V002-1P-32 START - password 4 and role sync */
/*
  V002-1P-32｜修正 4 碼臨時密碼與角色同步
  - 建立登入帳號臨時密碼驗證由 8 碼改為 4 碼
  - 登入後會以 staff 表角色覆蓋 profile 角色，避免人員已改管理員但登入仍是一般職員
  - 修改人員角色後會嘗試同步 profiles，並立即套用目前登入者權限
*/
/* FOR-e V002-1P-32 END - password 4 and role sync */

/* FOR-e V002-1P-32-1 START - build syntax fix */
/*
  V002-1P-32-1｜Build syntax fix
  - 修正 openMeetingRoomModal 的權限判斷誤放在參數預設值內
  - 修正 openFieldScheduleModal 的權限判斷誤放在參數預設值內
  - 解決 Vercel build error: Expected identifier but found "!"
*/
/* FOR-e V002-1P-32-1 END - build syntax fix */

/* FOR-e V002-1P-33 START - delete user reset password position custom */
/*
  V002-1P-33｜人員刪除、職務手動新增、直接重設密碼
  - 人員 / 帳號新增刪除鈕
  - 刪除採停用 + deleted_at 軟刪除，避免破壞歷史行程
  - 職務可手動輸入新職務
  - 重設密碼改為直接設定臨時密碼，不再寄送 Email，避免 email rate limit exceeded
*/
/* FOR-e V002-1P-33 END - delete user reset password position custom */

/* FOR-e V002-1P-36 START - password min 6 */
/*
  V002-1P-36｜密碼最低長度改為 6 碼
  - 配合 Supabase Auth 預設最低密碼長度 6 碼
  - 建立登入帳號臨時密碼改為 6 碼
  - 重設登入密碼改為至少 6 碼
  - 設定新密碼頁提示改為至少 6 碼
*/
/* FOR-e V002-1P-36 END - password min 6 */

/* FOR-e V002-1P-39 START - user account view permissions */
/*
  V002-1P-39｜人員帳號檢視權限與操作按鈕整理
  - 管理員：全部檢視、修改、重設、建立、刪除、啟用
  - 主管：全部檢視，只能調整是否外務人員
  - 行政 / 海外、翻譯、外務 / 宿管人員 / 會計、一般職員：只看自己的帳號資訊
  - 右側操作按鈕統一大小、字型與樣式
*/
/* FOR-e V002-1P-39 END - user account view permissions */

/* FOR-e V002-1P-40 START - own password and mobile cards */
/*
  V002-1P-40｜所有角色可修改自己密碼、手機行程卡片避免遮擋
  - 人員 / 帳號頁新增「修改我的密碼」按鈕
  - 自己的人員列顯示「密碼」按鈕，所有角色皆可用
  - 自改密碼使用 Supabase Auth updateUser，不需管理員、不需 Edge Function
  - 手機版週曆卡片加寬欄位、修正卡片 overflow，避免內容被遮擋
*/
/* FOR-e V002-1P-40 END - own password and mobile cards */

/* FOR-e V002-1P-41 START - overview filters medical mobile width */
/*
  V002-1P-41｜行程總覽篩選、醫療回診欄位、手機日期欄加寬
  - 行程總覽新增部門 / 人員篩選
  - 行程總覽支援連續 / 每週 / 每月重複行程顯示
  - 新增醫療行程時可填下次回診日期、時間、掛號號碼、下次執行人
  - 醫療有下次回診日期與執行人時，自動建立下一筆回診行程
*/
/* FOR-e V002-1P-41 END - overview filters medical mobile width */

/* FOR-e V002-1P-42 START - overview multi select persist */
/*
  V002-1P-42｜行程總覽部門 / 人員複選與記憶
  - 部門篩選改為可複選
  - 人員篩選改為可複選
  - 篩選條件會依登入者存到 localStorage
  - 下次登入後行程總覽會直接套用前一次選擇的人員 / 部門
*/
/* FOR-e V002-1P-42 END - overview multi select persist */

/* FOR-e V002-1P-43 START - overview field compact multiselect */
/*
  V002-1P-43｜行程總覽與外務行程精簡複選篩選
  - 行程總覽部門 / 人員改成精簡下拉複選
  - 外務行程部門 / 外務人員也改成精簡下拉複選
  - 兩個頁面的篩選條件都會依登入者記住
*/
/* FOR-e V002-1P-43 END - overview field compact multiselect */

/* FOR-e V002-1P-44 START - multiselect sort bind button */
/*
  V002-1P-44｜下拉複選靠左、綁定帳號按鈕、行程排序
  - 行程總覽 / 外務行程複選項目靠左，一個項目一行
  - 行程總覽 / 外務行程新增排序：顯示順序、部門、姓名
  - 排序條件會跟篩選條件一起記住
  - 人員帳號未綁定時顯示「綁定」按鈕
*/
/* FOR-e V002-1P-44 END - multiselect sort bind button */

/* FOR-e V002-1P-46 START - company cars and field open fix */
/*
  V002-1P-46｜公務車資訊與外務行程表開啟修正
  - 公務車預設清單改為實際車牌與使用者
  - 選項管理新增「公務車資訊」，可自行新增 / 修改 / 刪除
  - 新增 / 修改行程的公務車選單改讀選項管理
  - 外務 / 宿管人員 / 會計可檢視外務行程表
  - 外務行程表若載入失敗會顯示錯誤訊息，不會整頁打不開
*/
/* FOR-e V002-1P-46 END - company cars and field open fix */

/* FOR-e V002-1P-46-1 START - build repair */
/*
  V002-1P-46-1｜Build Repair
  - 修復 Vercel build：src/main.js 第一行被錯誤內容覆蓋造成 Expected ";" but found "for"
  - 重新覆蓋為有效 main.js
*/
/* FOR-e V002-1P-46-1 END - build repair */

/* FOR-e V002-1P-46-2 START - field filter helper fix */
/*
  V002-1P-46-2｜外務行程表篩選 helper 修正
  - 修正外務行程表打不開：getFieldDepartmentSelectedText is not defined
  - 補上 getFieldDepartmentSelectedText / getFieldStaffSelectedText
  - 保留 V002-1P-46 公務車資訊與外務行程表開啟修正
*/
/* FOR-e V002-1P-46-2 END - field filter helper fix */

/* FOR-e V002-1P-47 START - system health check */
/*
  V002-1P-47｜系統檢查頁
  - 新增系統檢查頁，管理員 / 主管可見
  - 快速檢查 Supabase 環境、人員、行程、服務紀錄單、異動紀錄、共用設定、公務車與角色權限
  - 可確認 admin-create-user Edge Function dry_run
*/
/* FOR-e V002-1P-47 END - system health check */

/* FOR-e V002-1P-48 START - system health icon mapping */
/*
  V002-1P-48｜系統檢查 ICON 路徑修正
  - 系統檢查改用 /icons/nav/system-health.png
  - 不再共用 checklist.png
*/
/* FOR-e V002-1P-48 END - system health icon mapping */

/* FOR-e V002-1P-49 START - health tools */
/*
  V002-1P-49｜系統檢查工具強化
  - 顯示目前前端版本與目前網址
  - 新增複製系統檢查報告
  - 新增清除我的畫面記憶，清除行程總覽 / 外務篩選 localStorage
  - 系統檢查頁強化上線前確認清單
*/
/* FOR-e V002-1P-49 END - health tools */

/* FOR-e V002-1P-50 START - role permission matrix */
/*
  V002-1P-50｜角色權限矩陣
  - 系統檢查頁新增角色權限矩陣
  - 系統檢查頁新增頁面檢視權限矩陣
  - 目前角色可用權限摘要
  - 複製檢查報告時加入目前角色可用權限
*/
/* FOR-e V002-1P-50 END - role permission matrix */

/* FOR-e V002-1P-51 START - role access update */
/*
  V002-1P-51｜角色頁面權限調整
  - 翻譯可看顏色設定與異況追蹤
  - 主管可看選項管理
  - 一般職員不顯示 LINE 通知與異動紀錄
  - 角色權限矩陣同步更新
*/
/* FOR-e V002-1P-51 END - role access update */

/* FOR-e V002-1P-52 START - launch test checklist */
/*
  V002-1P-52｜正式上線前確認清單
  - 系統檢查頁新增可勾選的正式上線前確認清單
  - 勾選進度存在本機 localStorage，不修改資料庫
  - 可複製確認清單與清除勾選紀錄
  - 系統檢查報告加入上線確認進度
*/
/* FOR-e V002-1P-52 END - launch test checklist */

/* FOR-e V002-1P-53 START - remove translator incident access */
/*
  V002-1P-53｜翻譯移除異況追蹤權限
  - 翻譯不顯示異況追蹤
  - 翻譯 createIncident 權限改為 false
  - 翻譯仍保留顏色設定與紀錄單繳交
  - 系統檢查與上線確認清單同步更新
*/
/* FOR-e V002-1P-53 END - remove translator incident access */

/* FOR-e V002-1P-54 START - hard delete staff */
/*
  V002-1P-54｜人員永久刪除與停用分流
  - 人員按「刪除」改為真正刪除 staff 資料列
  - 刪除後不會再出現在人員 / 帳號頁
  - 停用維持用「修改」把狀態改為停用，停用人員會繼續留在人員名單上
  - 舊版 soft delete 的 deleted_at 人員也不再顯示
  - 系統版本更新為 V002-1P-54
*/
/* FOR-e V002-1P-54 END - hard delete staff */

/* FOR-e V002-1P-55 START - mobile permission finish */
/*
  V002-1P-55｜手機版與權限一致性收尾
  - 保留 V002-1P-54 人員永久刪除規則
  - 一般職員 rolePermissionMatrix.viewAudit 改為 false，和頁面權限一致
  - 手機版彈窗改為底部抽屜式，標題固定在上方
  - 手機版工具列、表單、週曆、表格、底部選單安全區整理
  - 系統版本更新為 V002-1P-55
*/
/* FOR-e V002-1P-55 END - mobile permission finish */

/* FOR-e V002-1P-56 START - rebind account hide deleted */
/*
  V002-1P-56｜重新綁定帳號與刪除名單隱藏
  - 已綁定帳號的人員新增「重綁」按鈕，可重新指定登入 Email
  - 重新綁定會更新 profiles.staff_id 與角色 / 部門 / 職務 / 狀態資料
  - 目標 Email 若已綁定其他人員，會確認後改綁
  - 舊的登入 profile 會解除 staff_id 或停用，避免仍被姓名 fallback 誤判已綁定
  - 人員 / 帳號頁與 CSV 匯出統一排除 deleted_at 人員
  - 刪除的人員不會出現在人員名單；停用人員仍會留在名單上
*/
/* FOR-e V002-1P-56 END - rebind account hide deleted */

/* FOR-e V002-1P-57 START - account binding audit */
/*
  V002-1P-57｜帳號綁定檢查
  - 系統檢查頁新增帳號綁定狀態卡片
  - 新增帳號綁定檢查區塊，檢查重複綁定、綁到已刪除人員、綁到不存在人員、姓名 fallback 風險、啟用人員未綁定
  - 複製系統檢查報告會帶入帳號綁定檢查結果
  - 正式上線前確認清單新增帳號綁定檢查項目
*/
/* FOR-e V002-1P-57 END - account binding audit */

/* FOR-e V002-1P-58 START - launch readiness summary */
/*
  V002-1P-58｜正式上線狀態總結
  - 系統檢查頁新增正式上線狀態總結
  - 自動彙整紅色阻擋項目、注意項目、確認進度、帳號綁定狀態
  - 新增複製上線狀態報告
  - 系統檢查報告加入上線狀態
*/
/* FOR-e V002-1P-58 END - launch readiness summary */

/* FOR-e V002-1P-59 START - launch backup exports */
/*
  V002-1P-59｜正式上線前資料備份匯出
  - 系統檢查頁新增正式上線前資料備份區塊
  - 可匯出人員資料、登入帳號綁定、行程資料、服務紀錄單、異動紀錄、共用設定、帳號綁定檢查
  - 支援一鍵下載全部備份
  - 上線確認清單新增備份項目
*/
/* FOR-e V002-1P-59 END - launch backup exports */

/* FOR-e V002-1P-60 START - data integrity audit */
/*
  V002-1P-60｜資料完整性檢查
  - 系統檢查頁新增資料完整性狀態卡片與檢查區塊
  - 檢查行程日期、結束日期、類別、標題內容、執行者、指派到已刪除 / 不存在人員、服務紀錄單連結
  - 正式上線狀態總結納入資料完整性錯誤
  - 備份匯出新增資料完整性檢查 CSV
  - 上線確認清單新增資料完整性項目
*/
/* FOR-e V002-1P-60 END - data integrity audit */

/* FOR-e V002-1P-61 START - role test panel */
/*
  V002-1P-61｜角色確認面板
  - 系統檢查頁新增角色確認面板
  - 六種角色可個別複製確認清單、標記完成、清除紀錄
  - 正式上線狀態總結納入角色確認進度
  - 系統檢查報告加入角色確認報告
  - 上線確認清單新增角色確認項目
*/
/* FOR-e V002-1P-61 END - role test panel */

/* FOR-e V002-1P-62 START - final acceptance report */
/*
  V002-1P-62｜正式上線驗收報告
  - 系統檢查頁新增正式上線驗收報告區塊
  - 自動彙整確認清單、角色確認、帳號綁定、資料完整性、阻擋項目
  - 新增已完成功能模組摘要
  - 可一鍵複製正式上線驗收報告
  - 上線確認清單新增正式驗收報告留存項目
*/
/* FOR-e V002-1P-62 END - final acceptance report */

/* FOR-e V002-1P-63 START - mobile font hide account */
/*
  V002-1P-63｜手機字體放大與手機隱藏帳號頁
  - 手機版整體字體放大
  - 手機版表單、提醒文字、卡片、按鈕、底部選單字級加大
  - 手機底部選單不再顯示「人員 / 帳號」
  - 若手機停在 desktop-only 頁面，自動回到個人行程表
  - 系統版本更新為 V002-1P-63
*/
/* FOR-e V002-1P-63 END - mobile font hide account */

/* FOR-e V002-1P-64 START - mobile nav icon size */
/*
  V002-1P-64｜手機底部選單圖示放大
  - 手機底部選單圖示放大
  - 同時支援 emoji、img、svg 與 nav-icon-img
  - 增加底部選單按鈕高度，避免圖示與文字太擠
  - 系統版本更新為 V002-1P-64
*/
/* FOR-e V002-1P-64 END - mobile nav icon size */

/* FOR-e V002-1P-65 START - production wording cleanup */
/*
  V002-1P-65｜正式版文案清理
  - 登入頁移除確認項目文字
  - 系統檢查頁將確認字樣改為確認 / 驗收語氣
  - 角色確認改為角色確認
  - 上線前確認清單改為上線前確認清單
  - 空白佔位頁移除確認文案
  - 系統版本更新為 V002-1P-65
*/
/* FOR-e V002-1P-65 END - production wording cleanup */

/* FOR-e V002-1P-66 START - staff department id fix */
/*
  V002-1P-66｜新增人員 department_id 修正
  - 新增 / 修改人員時不再讓 staff.department_id 寫入 null
  - 手動輸入新部門時，會先嘗試在 departments 建立或取得部門 ID
  - 若 departments 權限或欄位不允許建立，會在寫入 staff 前提示，不會再出現 not-null constraint 錯誤
  - 手動輸入部門提示改為：若要新增新部門才填寫；留空則使用左側選單
*/
/* FOR-e V002-1P-66 END - staff department id fix */


/* FOR-e V002-1P-66-1 START - build syntax repair */
/*
  V002-1P-66-1｜Build Syntax Repair
  - 重新提供完整有效的 src/main.js / src/style.css
  - 修復 Vercel build：src/main.js 第一行被錯誤文字覆蓋造成 Expected ";" but found "for"
  - 保留 V002-1P-66 新增人員 department_id 修正
*/
/* FOR-e V002-1P-66-1 END - build syntax repair */

/* FOR-e V002-1P-67 START - department position options */
/*
  V002-1P-67｜新增部門與職務選項
  - 人員 / 帳號新增預設部門：總經理室、財務稽核、營管處、業務處、人才發展、管顧事業
  - 人員 / 帳號新增預設職務：協理、執行長、總經理、副總經理、副理、組長、海外行政、PT
  - 職務下拉移除角色類選項：管理員、主管、行政/海外、外務/宿管人員/會計
  - 手動新增部門時優先建立 department_id，降低 departments / staff not-null 錯誤
*/
/* FOR-e V002-1P-67 END - department position options */

/* FOR-e V002-1P-69 START - staff position required */
/*
  V002-1P-69｜人員職務必填與舊職務提醒
  - 修改 / 新增人員時，職務不可空白，避免 staff.position not-null constraint 錯誤
  - 若原本職務是「管理員 / 主管 / 行政/海外 / 外務/宿管人員/會計」這類已移除職務，表單會提醒改選實際職務
  - 手動輸入職務也會阻擋角色類職務，避免職務與角色混在一起
  - 保留 V002-1P-67 部門與職務選項
*/
/* FOR-e V002-1P-69 END - staff position required */

/* FOR-e V002-1P-70 START - staff delete unbind profiles */
/*
  V002-1P-70｜刪除人員前解除 profiles 綁定
  - 修正刪除人員時 profiles_staff_id_fkey foreign key 擋住 staff delete
  - 刪除前先把 profiles.staff_id 設為 null 並將 profile 狀態改為停用
  - 再執行 staff delete
  - 若仍有其他歷史資料 FK 擋住，會提示改用停用
*/
/* FOR-e V002-1P-70 END - staff delete unbind profiles */

/* FOR-e V002-1P-72 START - hide deleted schedules everywhere */
/*
  V002-1P-72｜刪除 / 取消行程殘留資料隱藏
  - 行程搜尋改為只顯示有效行程，已刪除 / 已取消行程不顯示
  - 服務紀錄單頁面與紀錄單繳交頁會排除已刪除 / 已取消 / 找不到原行程的紀錄單
  - 統計報表延續有效行程規則，避免已刪除 / 已取消行程殘留在統計數據
  - 備份匯出的行程與服務紀錄單也排除已刪除 / 已取消殘留資料
  - 新增 isDeletedSchedule / isCancelledSchedule / isActiveServiceRecord 共用判斷，避免各頁規則不一致
*/
/* FOR-e V002-1P-72 END - hide deleted schedules everywhere */

/* FOR-e V002-1P-73 START - department position management */
/*
  V002-1P-73｜部門與職務選項管理
  - 新增部門選項「營運二部」
  - 選項管理新增「部門選項」與「職務選項」
  - 部門 / 職務可新增、刪除，並用上移 / 下移調整順序
  - 人員新增 / 修改的部門與職務下拉改讀選項管理
  - 職務選項自動排除管理員、主管、行政/海外、外務/宿管人員/會計等角色類文字
*/
/* FOR-e V002-1P-73 END - department position management */

/* FOR-e V002-1P-74 START - compact options page */
/*
  V002-1P-74｜選項管理簡約化
  - 選項管理頁面改成更乾淨、緊湊、清楚
  - 選項列按鈕改為 ↑ / ↓ / ×，減少佔版面
  - 部門 / 職務與其他選項維護保留新增、刪除、上移、下移
  - 清理系統內殘留確認版文案
*/
/* FOR-e V002-1P-74 END - compact options page */

/* FOR-e V002-1P-75 START - schedule template editor */
/*
  V002-1P-75｜行程類型對應內容編輯器
  - 行程類型對應內容改為「行程類型＋預設內容」兩欄式編輯
  - 新增 / 修改欄位更清楚，不再需要手動輸入「行程類型｜內容」格式
  - 預設內容格子放大、加長，可直接多行編輯
  - 支援新增一組、刪除、上移、下移
*/
/* FOR-e V002-1P-75 END - schedule template editor */
