import { createClient } from '@supabase/supabase-js'
import './style.css'

/* FOR-e V002-1K-1-3 START - build repair */
/* Repair: restore valid src/main.js top-level syntax after failed Vercel build. */
/* FOR-e V002-1K-1-3 END - build repair */

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || ''
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || ''
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

const pages = [
  { key: 'personalSchedule', label: '個人行程表', mobileLabel: '個人', roles: 'ALL', mobile: true },
  { key: 'personalTodo', label: '個人一般待辦', mobileLabel: '待辦', roles: 'ALL', mobile: true },
  { key: 'assignedTracking', label: '我指派的事項追蹤', mobileLabel: '指派', roles: 'ALL', mobile: true },
  { key: 'scheduleOverview', label: '行程總覽', mobileLabel: '行程', roles: 'ALL', mobile: true },
  { key: 'fieldSchedule', label: '外務行程', mobileLabel: '外務', roles: ['管理員', '主管', '行政 / 海外'], mobile: true },
  { key: 'fieldDetail', label: '外務明細', mobileLabel: '明細', roles: ['管理員', '行政 / 海外'], mobile: false },
  { key: 'meetingRoom', label: '會議室預約', mobileLabel: '會議室', roles: ['管理員', '主管', '行政 / 海外', '外務 / 宿管人員 / 會計', '一般職員'], mobile: true },
  { key: 'incident', label: '異況追蹤', mobileLabel: '異況', roles: ['管理員', '主管', '行政 / 海外'], mobile: true },
  { key: 'search', label: '行程搜尋', mobileLabel: '搜尋', roles: ['管理員', '主管', '行政 / 海外'], mobile: false },
  { key: 'stats', label: '統計報表', mobileLabel: '統計', roles: ['管理員', '主管'], mobile: false },
  { key: 'serviceRecord', label: '服務紀錄單', mobileLabel: '紀錄', roles: ['管理員', '主管'], mobile: false },
  { key: 'recordSubmit', label: '紀錄單繳交', mobileLabel: '繳交', roles: ['翻譯'], mobile: true },
  { key: 'line', label: 'LINE 通知', mobileLabel: 'LINE', roles: 'ALL', mobile: true },
  { key: 'color', label: '顏色設定', mobileLabel: '顏色', roles: ['管理員', '主管', '行政 / 海外', '外務 / 宿管人員 / 會計', '一般職員'], mobile: false },
  { key: 'options', label: '選項管理', mobileLabel: '選項', roles: ['管理員'], mobile: false },
  { key: 'audit', label: '異動紀錄', mobileLabel: '紀錄', roles: ['管理員', '主管', '行政 / 海外', '外務 / 宿管人員 / 會計', '一般職員'], mobile: false },
  { key: 'users', label: '人員 / 帳號', mobileLabel: '帳號', roles: ['管理員', '主管', '行政 / 海外', '翻譯', '外務 / 宿管人員 / 會計', '一般職員'], mobile: true }
]

const formCategories = ['服務行程', '一般記事', '待辦事項', '請假 / 會議 / 活動 / 外訓', '證件交付']
const serviceScheduleTypes = [
  '面談', '上線 / 教育訓練', '定期 / 開會', '送工', '銀行', '醫療',
  '車禍處理', '結薪', '收送簽文件', '逃跑通知', '轉出追蹤',
  '住變資訊', '驗證提醒', '返台提醒', '宿舍', '其他'
]
const todoItems = ['送件', '補件', '登記', '回覆', '追蹤', '重要事項!', '繳費']
const leaveMeetingTypes = ['請假', '返鄉', '會議', '外訓', '部門活動', '公司活動']
const meetingRoomOptions = ['第一會議室', '第二會議室', '大會議室', '小會議室']
const carOptions = ['不使用', 'A車', 'B車', 'C車', '其他']
const documentOptions = ['護照', '居留證', '健保卡', '印章', '其他']
const deliveryDocumentItems = ['護照', '居留證', '健保卡', '印章', '文件', '其他']
const fieldPurposeOptions = ['送件', '申請', '登記', '送審', '領件', '認證', '繳費', '外務日', '其他']
const fieldSpecialReminderOptions = ['必送件', '無法更換人員', '急件']
const incidentTypeOptions = ['逃跑', '轉出', '車禍', '醫療異況', '雇主反映', '工人反映', '宿舍異況', '文件異常', '其他']
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



const reminderScheduleTypes = ['逃跑通知', '轉出追蹤', '住變資訊', '返台提醒', '驗證提醒', '追蹤提醒事項']

function isReminderSchedule(row) {
  if (!row) return false
  const scheduleType = String(row.schedule_type || '').trim()
  return reminderScheduleTypes.includes(scheduleType)
}

function isOverdueSchedule(row) {
  if (!row || !row.start_date) return false
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
  if (!rows.length) return ''

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
        ${rows.map(row => {
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
        }).join('')}
      </div>
    </section>
  `
}

let currentProfile = null
let currentPage = 'personalSchedule'
let schedules = []
let staffList = []
let loadingSchedules = false
let schedulesError = ''
let saving = false
let overviewWeekOffset = 0
let fieldWeekOffset = 0
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
  startDate: '',
  endDate: ''
}

let serviceRecords = []
let serviceRecordsLoading = false
let serviceRecordsError = ''
let serviceRecordFilters = {
  status: '全部',
  staffId: '全部',
  department: '全部',
  scheduleType: '全部',
  keyword: '',
  startDate: '',
  endDate: ''
}

function canSeePage(page, role) {
  return page.roles === 'ALL' || page.roles.includes(role)
}

function isPowerRole() {
  return ['管理員', '主管', '行政 / 海外'].includes(currentProfile?.role)
}

function todayString() {
  return new Date().toISOString().slice(0, 10)
}

function isVisibleSchedule(row) {
  return row && row.status !== '取消' && row.is_cancelled !== true && !row.deleted_at
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

function canCompleteSchedule(row) {
  if (!currentProfile) return false
  if (row.status === '已完成' || row.status === '取消') return false
  if (isPowerRole()) return true
  return row.creator_staff_id === currentProfile.staff_id || isAssignedToMe(row)
}

function canCancelSchedule(row) {
  if (!currentProfile) return false
  if (row.status === '取消') return false
  if (isPowerRole()) return true
  return row.creator_staff_id === currentProfile.staff_id
}

function canModifySchedule(row) {
  if (!currentProfile) return false
  if (isPowerRole()) return true
  return row.creator_staff_id === currentProfile.staff_id
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
          測試項目：行程類型在標題前、卡片內容前兩行、證件欄位、提醒標籤與 LOGO。
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

  if (profile.status !== '啟用') {
    await supabase.auth.signOut()
    renderLogin()
    alert('此帳號已停用，請聯繫管理員。')
    return
  }

  currentProfile = profile
  currentPage = 'personalSchedule'
  await refreshData()
  renderApp()
}

async function refreshData() {
  await Promise.all([loadStaff(), loadSchedules(), loadAuditLogs(), loadServiceRecords()])
}

async function loadStaff() {
  const { data, error } = await supabase
    .from('staff')
    .select('staff_id, name, department_id, department_name, position, role, status, deleted_at')
    .eq('status', '啟用')
    .is('deleted_at', null)
    .order('display_order', { ascending: true })

  if (error) {
    console.error(error)
    staffList = []
    return
  }

  staffList = data || []
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
  const mobilePages = visiblePages.filter(page => page.mobile)

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
              ${page.label}
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
            ${page.mobileLabel}
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
        startDate: form.get('startDate') || '',
        endDate: form.get('endDate') || ''
      }
      renderApp()
    })
  }

  
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
    cell.addEventListener('dblclick', () => openScheduleModal())
  })


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
    cell.addEventListener('dblclick', () => openMeetingRoomModal({
      date: cell.dataset.meetingDate || '',
      room: cell.dataset.meetingRoom || ''
    }))
  })


  const addIncidentBtn = document.querySelector('#addIncidentBtn')
  if (addIncidentBtn) {
    addIncidentBtn.addEventListener('click', () => openIncidentModal())
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

  const addBtn = document.querySelector('#addScheduleBtn')
  if (addBtn) {
    addBtn.addEventListener('click', () => {
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
  return schedules.filter(row => matchesSearchFilters(row))
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
  const statusOptions = buildOptionList(['全部', '未完成', '已完成', '取消'], searchFilters.status)
  const categoryOptions = buildOptionList(['全部', ...new Set([...formCategories, '外務行程', '異況追蹤', '會議室預約'])], searchFilters.category)

  return `
    <div class="page-toolbar">
      <div>
        <h3>行程搜尋</h3>
        <p class="muted">搜尋已完成、取消與未完成行程；列表先簡潔顯示，需要完整內容再點查看。</p>
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
        <strong>${results.filter(row => row.status === '取消').length}</strong>
        <span>取消</span>
      </div>
    </div>

    ${renderSearchResultList(results, '沒有符合條件的行程。')}
  `
}


function matchesAuditFilters(row) {
  const keyword = normalizeText(auditFilters.keyword)
  const actionType = auditFilters.actionType
  const startDate = auditFilters.startDate
  const endDate = auditFilters.endDate
  const createdDate = row.created_at ? row.created_at.slice(0, 10) : ''

  if (actionType !== '全部' && row.action_type !== actionType) return false
  if (startDate && createdDate < startDate) return false
  if (endDate && createdDate > endDate) return false

  if (keyword) {
    const haystack = normalizeText([
      row.operated_by_name,
      row.action_type,
      row.source_type,
      row.note,
      row.source_id
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
  const results = auditLogs.filter(row => matchesAuditFilters(row))
  const actionOptions = getAuditActionTypes().map(item => `<option value="${item}" ${auditFilters.actionType === item ? 'selected' : ''}>${item}</option>`).join('')

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

    <form id="auditForm" class="search-panel search-panel-simple">
      <label class="search-keyword">
        關鍵字
        <input name="keyword" value="${escapeHtml(auditFilters.keyword)}" placeholder="搜尋操作人、動作、備註">
      </label>

      <div class="search-row date-range-row audit-filter-row">
        <label>
          動作類型
          <select name="actionType">${actionOptions}</select>
        </label>

        <label>
          起日
          <input name="startDate" type="date" value="${auditFilters.startDate}">
        </label>

        <label>
          迄日
          <input name="endDate" type="date" value="${auditFilters.endDate}">
        </label>

        <button type="submit" class="primary-btn">搜尋</button>
      </div>
    </form>

    <div class="summary-grid search-summary">
      <div class="summary-card">
        <strong>${results.length}</strong>
        <span>異動筆數</span>
      </div>
      <div class="summary-card">
        <strong>${results.filter(row => row.action_type === '取消').length}</strong>
        <span>取消</span>
      </div>
      <div class="summary-card">
        <strong>${results.filter(row => String(row.action_type || '').includes('修改')).length}</strong>
        <span>修改類</span>
      </div>
    </div>

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
    <div class="audit-list">
      ${rows.map(row => `
        <div class="audit-row">
          <div class="audit-time">${escapeHtml(formatDateTime(row.created_at))}</div>
          <div class="audit-main">
            <div class="audit-title">
              <span class="audit-action">${escapeHtml(row.action_type || '-')}</span>
              <strong>${escapeHtml(row.operated_by_name || '-')}</strong>
            </div>
            <div class="audit-note">${escapeHtml(row.note || '-')}</div>
            <div class="audit-meta audit-source"><span>異動行程：</span>${escapeHtml(getAuditSourceLabel(row))}</div>
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

function scheduleMatchesDateByMode(row, dateKey) {
  if (!row?.start_date) return false
  const startDate = row.start_date
  const endDate = row.end_date || row.start_date
  if (dateKey < startDate || dateKey > endDate) return false

  const note = String(row.sub_type_note || '')
  const mode = getScheduleModeFromNote(row)
  if (mode === '連續日期') return true

  if (mode === '每週重複') {
    const label = getWeekdayLabelFromDateKey(dateKey)
    return label ? note.includes(label) : dateKey === startDate
  }

  if (mode === '每月重複') {
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

  const weekdayValues = new Set(form.getAll('repeat_weekdays'))
  const monthlyDay = Number(form.get('monthly_day') || startDate.slice(8, 10))

  while (current <= end) {
    const key = toDateKey(current)
    if (mode === '單日') {
      if (key === startDate) dates.push(key)
    } else if (mode === '連續日期') {
      dates.push(key)
    } else if (mode === '每週重複') {
      const weekdayValue = getWeekdayValueFromDateKey(key)
      if (!weekdayValues.size ? key === startDate : weekdayValues.has(weekdayValue)) dates.push(key)
    } else if (mode === '每月重複') {
      if (Number(key.slice(8, 10)) === monthlyDay) dates.push(key)
    }
    current = addDays(current, 1)
  }

  return dates.length ? dates : [startDate]
}
/* FOR-e V002-1K-1-4 END - schedule mode display helpers */

function getFieldStaffRows() {
  const fieldRows = staffList.filter(staff => {
    const text = [staff.role, staff.position, staff.position_name, staff.department_name].filter(Boolean).join('｜')
    return text.includes('外務') || text.includes('宿管')
  })

  return fieldRows.length ? fieldRows : staffList
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
    <button type="button" class="field-week-schedule-card ${row.status === '已完成' ? 'is-completed' : ''}" data-view-schedule="${row.schedule_id}">
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
        <button class="primary-btn" id="addScheduleBtn">新增外務</button>
        <button class="secondary-btn" id="refreshBtn">重新整理</button>
      </div>
    </div>

    ${renderReadStatus()}

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
              <span class="status-pill">${escapeHtml(row.status || '未完成')}</span>
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
  return row.category === '會議室預約' || row.schedule_type === '會議室預約' || text.includes('會議室預約') || meetingRoomOptions.includes(row.location_name)
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
    <button type="button" class="meeting-room-card ${row.status === '已完成' ? 'is-completed' : ''}" data-view-schedule="${row.schedule_id}">
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
        <button class="primary-btn" id="addScheduleBtn">新增預約</button>
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
          ${meetingRoomOptions.map(room => `
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
  return meetingRoomOptions.map(room => `<option value="${room}" ${room === selectedRoom ? 'selected' : ''}>${room}</option>`).join('')
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
  const defaultDate = defaults.date || todayString()
  const defaultRoom = defaults.room || meetingRoomOptions[0] || ''

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
      description: firstTracking || null,
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
  return incidentTypeOptions.map(item => `<option value="${item}" ${item === selectedValue ? 'selected' : ''}>${item}</option>`).join('')
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
        <button class="primary-btn" id="addIncidentBtn">新增異況</button>
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
              <div class="incident-title">${escapeHtml(row.sub_type || '異況')}｜${escapeHtml(row.title || '-')}</div>
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


function renderPageContent() {
  if (currentPage === 'personalSchedule') return renderPersonalSchedule()
  if (currentPage === 'personalTodo') return renderPersonalTodo()
  if (currentPage === 'assignedTracking') return renderAssignedTrackingPage()
  if (currentPage === 'scheduleOverview') return renderScheduleOverview()
  if (currentPage === 'fieldSchedule') return renderFieldScheduleCalendar()
  if (currentPage === 'fieldDetail') return renderFieldDetailPage()
  if (currentPage === 'meetingRoom') return renderMeetingRoomCalendar()
  if (currentPage === 'incident') return renderIncidentTrackingPage()
  if (currentPage === 'search') return renderSearchPage()
  if (currentPage === 'serviceRecord') return renderServiceRecordDashboard()
  if (currentPage === 'recordSubmit') return renderRecordSubmit()
  if (currentPage === 'audit') return renderAuditPage()
  if (currentPage === 'users') return renderUsersPage()

  return `
    <h3>${getPageTitle()}</h3>
    <p>此頁面目前為權限測試佔位頁，正式功能會在下一階段逐步加入。</p>
  `
}


/* FOR-e V002-1H-5 START - assigned task tracking */
function getAssignedTrackingRows() {
  const myStaffId = currentProfile?.staff_id
  if (!myStaffId) return []

  return schedules
    .filter(row => isVisibleSchedule(row))
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
        <button class="primary-btn" id="addScheduleBtn">新增行程</button>
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
  return `
    <div class="page-toolbar">
      <div>
        <h3>${title}</h3>
        <p class="muted">V002-1E-4：卡片、證件欄位、提醒標籤與 LOGO。</p>
      </div>
      <div class="toolbar-actions">
        <button class="primary-btn" id="addScheduleBtn">${currentPage === 'personalTodo' ? '新增一般待辦' : '新增行程'}</button>
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

function renderPersonalSchedule() {
  const myRows = schedules.filter(row => isActivePersonalSchedule(row) && isMine(row))
  const today = todayString()
  const todayRows = myRows.filter(row => row.start_date === today && row.status !== '已完成' && row.status !== '取消')

  return `
    ${renderToolbar('個人行程表')}
    ${renderReadStatus()}
    ${renderServiceRecordReminderArea()}
    ${renderPersonalReminderArea()}
    <div class="summary-grid">
      <div class="summary-card">
        <strong>${todayRows.length}</strong>
        <span>今日待處理</span>
      </div>
      <div class="summary-card">
        <strong>${myRows.length}</strong>
        <span>個人行程總數</span>
      </div>
    </div>
    ${renderScheduleList(myRows, '目前沒有個人行程。', true)}
  `
}

function renderPersonalTodo() {
  const myRows = schedules.filter(row => isActivePersonalSchedule(row) && isMine(row) && ['一般記事', '待辦事項', '請假 / 會議 / 活動 / 外訓', '證件交付'].includes(row.category))
  return `
    ${renderToolbar('個人一般待辦')}
    ${renderReadStatus()}
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

function getOverviewStaffRows() {
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
    if (row.start_date !== dateKey) return false
    return (row.schedule_assignees || []).some(item => item.staff_id === staffId && !item.deleted_at)
  })
}

function renderWeekScheduleCard(row) {
  const contentPreview = getFirstTwoLines(row.description)
  return `
    <button type="button" class="week-schedule-card ${row.status === '已完成' ? 'is-completed' : ''}" data-view-schedule="${row.schedule_id}">
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
          <div class="schedule-card ${row.status === '已完成' ? 'is-completed' : ''} ${row.status === '取消' ? 'is-cancelled' : ''}">
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
              <span class="status-pill">${row.status}</span>
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

  return records.filter(record => {
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
  return records.filter(record => String(record.schedule_date || '').startsWith(monthKey))
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
    ${renderServiceRecordPersonCombinedStatus(records)}
    ${renderServiceRecordDepartmentStatus(records)}
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

function renderUsersPage() {
  return `
    <h3>人員 / 帳號</h3>
    <div class="notice">
      權限規則：管理員可管理全部帳號；主管、行政、翻譯、外務 / 宿管人員 / 會計、一般職員只能查看與修改自己的帳號基本資料，不能刪除、停用或啟用帳號。
    </div>
    <div class="empty-state">
      <strong>目前登入帳號</strong>
      <p>${currentProfile.email}</p>
    </div>
  `
}

function openScheduleDetail(scheduleId) {
  const row = schedules.find(item => item.schedule_id === scheduleId)
  if (!row) return

  const permissionNote = canModifySchedule(row)
    ? '您可以管理此行程，包含修改內容與執行者。'
    : '此行程由他人指派，您只能查看與完成，不能修改、取消或刪除。'

  const modal = document.createElement('div')
  modal.className = 'modal-backdrop'
  modal.innerHTML = `
    <div class="modal-panel detail-panel">
      <div class="modal-header">
        <h3>查看行程</h3>
        <button class="icon-btn" id="closeDetailBtn" type="button">×</button>
      </div>

      <div class="detail-grid">
        <div><span>狀態</span><strong>${escapeHtml(row.status)}</strong></div>
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
        ${isIncidentSchedule(row) && row.status !== '取消' ? `<button type="button" class="primary-btn" id="detailIncidentNextFollowBtn">新增下次追蹤</button>` : ''}
        ${canCompleteSchedule(row) ? `<button type="button" class="primary-btn" id="detailCompleteBtn">${isFieldScheduleRow(row) ? '已送件（完成）' : '已完成'}</button>` : ''}
        ${isFieldScheduleRow(row) && row.status !== '取消' ? `<button type="button" class="secondary-btn field-result-btn" id="detailNeedSupplementBtn">要補件</button>` : ''}
        ${isFieldScheduleRow(row) && row.status !== '取消' ? `<button type="button" class="secondary-btn field-result-btn" id="detailFieldAbnormalBtn">送件異常</button>` : ''}
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
  return staffList.map(staff => `
    <label class="check-row">
      <input type="checkbox" name="edit_executor" value="${staff.staff_id}" ${selectedIds.has(staff.staff_id) ? 'checked' : ''}>
      <span>${staff.name}｜${staff.department_name}｜${staff.position}</span>
    </label>
  `).join('')
}

function staffOptionsHtml(defaultStaffId = '') {
  return staffList.map(staff => `
    <label class="check-row">
      <input type="checkbox" name="executor" value="${staff.staff_id}" ${staff.staff_id === defaultStaffId ? 'checked' : ''}>
      <span>${staff.name}｜${staff.department_name}｜${staff.position}</span>
    </label>
  `).join('')
}

function staffSelectOptionsHtml() {
  return `<option value="">未指定</option>` + staffList.map(staff => `
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
  if (currentPage === 'personalTodo') return ['一般記事', '待辦事項', '請假 / 會議 / 活動 / 外訓', '證件交付']
  return formCategories
}

function serviceTypeOptionsHtml(includeEmpty = false) {
  const empty = includeEmpty ? '<option value="">無</option>' : ''
  return empty + serviceScheduleTypes.map(type => `<option value="${type}">${type}</option>`).join('')
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
  return `<option value="">手動輸入 / 不指定</option>` + fieldLocationOptions.map(item => `
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
        ${fieldSpecialReminderOptions.map(item => `
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
            ${optionHtmlForItems(fieldPurposeOptions, purpose)}
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
  return staffList.map(staff => `
    <option value="${staff.staff_id}" ${staff.staff_id === selectedStaffId ? 'selected' : ''} data-department="${escapeHtml(staff.department_name || '')}">
      ${staff.name}｜${staff.department_name || ''}
    </option>
  `).join('')
}


function openFieldScheduleModal(defaults = {}) {
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
            ${optionHtmlForItems(fieldPurposeOptions)}
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
  const defaultStaffId = currentProfile.staff_id || ''
  const availableFormCategories = getAvailableFormCategories()
  const formCategoryOptions = availableFormCategories.map(category => `<option value="${category}">${category}</option>`).join('')
  const todoOptions = todoItems.map(item => `<option value="${item}">${item}</option>`).join('')
  const leaveOptions = leaveMeetingTypes.map(item => `<option value="${item}">${item}</option>`).join('')
  const carSelectOptions = carOptions.map(item => `<option value="${item}">${item}</option>`).join('')
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
            <textarea name="description" rows="3" placeholder="請輸入內容"></textarea>
          </label>
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

  categorySelect.addEventListener('change', refreshFormSections)
  timeTypeSelect.addEventListener('change', refreshTimeBlock)
  repeatModeSelect.addEventListener('change', refreshRepeatBlocks)
  serviceTypeSelect.addEventListener('change', refreshServiceExtras)
  hasDocumentsSelect.addEventListener('change', refreshDocumentsBlock)

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
    const days = [...document.querySelectorAll('input[name="repeat_weekdays"]:checked')]
      .map(input => weekdays.find(([value]) => value === input.value)?.[1] || input.value)
      .join('、')
    return `行程模式：每週重複；重複星期：${days || '未設定'}`
  }

  if (mode === '每月重複') return `行程模式：每月重複；每月 ${form.get('monthly_day') || '1'} 號`
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
    if (getStaffNameFromSelect('medical_next_staff')) notes.push(`下次執行者：${getStaffNameFromSelect('medical_next_staff')}`)
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
  const currentStaffText = getNoteValue(row, '下次執行者')

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
  const serviceTypeOptions = optionHtml(serviceScheduleTypes, row.schedule_type || '其他')
  const subTypeOptions = optionHtml(serviceScheduleTypes, row.sub_type || '', true)
  const carSelectOptions = optionHtml(carOptions, row.car_no || '不使用')
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


async function logout() {
  await supabase.auth.signOut()
  currentProfile = null
  renderLogin()
}

window.addEventListener('load', loadProfile)

/* FOR-e V002-1H-7 START - personal reminder stable rules */
/*
  V002-1H-7｜個人行程表提醒區測試修正
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
