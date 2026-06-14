import { createClient } from '@supabase/supabase-js'
import './style.css'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || ''
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || ''
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

const pages = [
  { key: 'personalSchedule', label: '個人行程表', mobileLabel: '個人', roles: 'ALL', mobile: true },
  { key: 'personalTodo', label: '個人一般待辦', mobileLabel: '待辦', roles: 'ALL', mobile: true },
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

const formCategories = [
  '服務行程',
  '一般記事',
  '待辦事項',
  '請假 / 會議 / 活動 / 外訓'
]

const serviceScheduleTypes = [
  '面談',
  '上線 / 教育訓練',
  '定期 / 開會',
  '送工',
  '銀行',
  '醫療',
  '車禍處理',
  '結薪',
  '收送簽文件',
  '逃跑通知',
  '轉出追蹤',
  '住變資訊',
  '驗證提醒',
  '返台提醒',
  '宿舍',
  '其他'
]

const serviceSubTypeMap = {
  '送工': ['新入境', '承接'],
  '銀行': ['開戶', '補辦', '領錢', '異動'],
  '醫療': ['看診', '回診', '住院', '急診', '開刀'],
  '車禍處理': ['做筆錄', '現場協調', '和解', '出庭'],
  '收送簽文件': ['證件', '用印', '簽文件'],
  '逃跑通知': ['逃跑第一天', '逃跑第二天', '逃跑第三天'],
  '轉出追蹤': ['終止日', '轉出到期日'],
  '住變資訊': ['搬家時間'],
  '驗證提醒': ['最後工作日', '驗證日期', '離境日期'],
  '返台提醒': ['返台日期', '班機', '時間']
}

const todoItems = ['送件', '補件', '登記', '回覆', '追蹤']
const leaveMeetingTypes = ['請假', '返鄉', '會議', '外訓', '公司活動', '部門活動']

let currentProfile = null
let currentPage = 'personalSchedule'
let schedules = []
let staffList = []
let loadingSchedules = false
let schedulesError = ''
let saving = false

function canSeePage(page, role) {
  return page.roles === 'ALL' || page.roles.includes(role)
}

function isPowerRole() {
  return ['管理員', '主管', '行政 / 海外'].includes(currentProfile?.role)
}

function todayString() {
  return new Date().toISOString().slice(0, 10)
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

function isTranslator() {
  return currentProfile?.role === '翻譯'
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

function formatTime(row) {
  if (row.time_type === '指定時間' && row.start_time) return row.start_time.slice(0, 5)
  return row.time_type || '不指定'
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

function renderLogin() {
  document.querySelector('#app').innerHTML = `
    <section class="login-page">
      <div class="login-card">
        <div class="logo-mark">FOR-e</div>
        <h1>FOR-e 共享排程系統</h1>
        <p>V002-1E｜依類別切換表單欄位</p>

        <label for="email">Email / 帳號</label>
        <input id="email" type="email" placeholder="請輸入 Email" autocomplete="email" />

        <label for="password">密碼</label>
        <input id="password" type="password" placeholder="請輸入密碼" autocomplete="current-password" />

        <button id="loginBtn">登入</button>
        <div id="errorText" class="error"></div>

        <div class="login-note">
          測試項目：一般記事、待辦事項、請假 / 會議 / 活動 / 外訓、服務行程欄位切換。
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
    errorText.textContent = '尚未設定 Supabase 環境變數。請到 Vercel 設定 VITE_SUPABASE_URL 與 VITE_SUPABASE_ANON_KEY。'
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
  await Promise.all([loadStaff(), loadSchedules()])
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

function renderApp() {
  const visiblePages = pages.filter(page => canSeePage(page, currentProfile.role))
  const mobilePages = visiblePages.filter(page => page.mobile)

  document.querySelector('#app').innerHTML = `
    <section class="layout">
      <aside class="sidebar">
        <div class="brand">
          <div class="brand-title">FOR-e</div>
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

  const addBtn = document.querySelector('#addScheduleBtn')
  if (addBtn) addBtn.addEventListener('click', openScheduleModal)

  document.querySelectorAll('[data-view-schedule]').forEach(btn => {
    btn.addEventListener('click', () => openScheduleDetail(btn.dataset.viewSchedule))
  })

  document.querySelectorAll('[data-complete-schedule]').forEach(btn => {
    btn.addEventListener('click', () => completeSchedule(btn.dataset.completeSchedule))
  })

  document.querySelectorAll('[data-cancel-schedule]').forEach(btn => {
    btn.addEventListener('click', () => cancelSchedule(btn.dataset.cancelSchedule))
  })
}

function getPageTitle() {
  const page = pages.find(item => item.key === currentPage)
  return page ? page.label : '個人行程表'
}

function renderPageContent() {
  if (currentPage === 'personalSchedule') return renderPersonalSchedule()
  if (currentPage === 'personalTodo') return renderPersonalTodo()
  if (currentPage === 'scheduleOverview') return renderScheduleOverview()
  if (currentPage === 'recordSubmit') return renderRecordSubmit()
  if (currentPage === 'users') return renderUsersPage()

  return `
    <h3>${getPageTitle()}</h3>
    <p>此頁面目前為權限測試佔位頁，正式功能會在下一階段逐步加入。</p>
  `
}

function renderToolbar(title) {
  return `
    <div class="page-toolbar">
      <div>
        <h3>${title}</h3>
        <p class="muted">V002-1E：依類別切換表單欄位，時間改為 5 分鐘下拉。</p>
      </div>
      <div class="toolbar-actions">
        <button class="primary-btn" id="addScheduleBtn">新增行程</button>
        <button class="secondary-btn" id="refreshBtn">重新整理</button>
      </div>
    </div>
  `
}

function renderPersonalSchedule() {
  const myRows = schedules.filter(row => isMine(row))
  const today = todayString()
  const todayRows = myRows.filter(row => row.start_date === today && row.status !== '已完成' && row.status !== '取消')

  return `
    ${renderToolbar('個人行程表')}
    ${renderReadStatus()}
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
    ${renderScheduleList(myRows, '目前沒有個人行程。')}
  `
}

function renderPersonalTodo() {
  const myRows = schedules.filter(row => isMine(row) && ['一般記事', '待辦事項'].includes(row.category))
  return `
    ${renderToolbar('個人一般待辦')}
    ${renderReadStatus()}
    ${renderScheduleList(myRows, '目前沒有一般記事或待辦事項。')}
  `
}

function renderScheduleOverview() {
  return `
    ${renderToolbar('行程總覽')}
    ${renderReadStatus()}
    ${renderScheduleList(schedules, '目前沒有行程資料。')}
  `
}

function renderReadStatus() {
  if (loadingSchedules) return `<div class="notice">正在讀取行程資料...</div>`
  if (schedulesError) return `<div class="error-card">讀取行程失敗：${schedulesError}</div>`
  return ''
}

function renderScheduleList(rows, emptyText) {
  if (!rows.length) return `<div class="empty-state">${emptyText}</div>`

  return `
    <div class="schedule-list">
      ${rows.map(row => `
        <div class="schedule-card ${row.status === '已完成' ? 'is-completed' : ''} ${row.status === '取消' ? 'is-cancelled' : ''}">
          <div class="schedule-card-main">
            <div class="schedule-date">${formatDate(row.start_date)}｜${formatTime(row)}</div>
            <div class="schedule-title">${escapeHtml(row.title)}</div>
            <div class="schedule-meta">${escapeHtml(row.category)}${row.schedule_type ? '｜' + escapeHtml(row.schedule_type) : ''}${row.sub_type ? '｜' + escapeHtml(row.sub_type) : ''}</div>
            <div class="schedule-meta">執行者：${escapeHtml(getAssigneeNames(row))}</div>
            ${row.customer_name ? `<div class="schedule-meta">區域 / 客戶：${escapeHtml(row.customer_name)}</div>` : ''}
            ${row.location_name ? `<div class="schedule-meta">地點：${escapeHtml(row.location_name)}</div>` : ''}
            ${row.sub_type_note ? `<div class="schedule-meta">備註：${escapeHtml(row.sub_type_note)}</div>` : ''}
            ${row.need_service_record ? '<div class="service-record-hint">需服務紀錄單</div>' : ''}
          </div>
          <div class="schedule-card-actions">
            <span class="status-pill">${row.status}</span>
            <button class="small-secondary-btn" data-view-schedule="${row.schedule_id}">查看</button>
            ${canCompleteSchedule(row) ? `<button class="small-btn" data-complete-schedule="${row.schedule_id}">已完成</button>` : ''}
            ${canCancelSchedule(row) ? `<button class="small-danger-btn" data-cancel-schedule="${row.schedule_id}">取消</button>` : ''}
          </div>
        </div>
      `).join('')}
    </div>
  `
}

function renderRecordSubmit() {
  return `
    <h3>紀錄單繳交</h3>
    <div class="notice">
      翻譯專用頁。服務紀錄單提醒會在後續階段加入。
    </div>
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
    ? '您可以管理此行程。'
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
        <div><span>日期</span><strong>${escapeHtml(row.start_date)}</strong></div>
        <div><span>時間</span><strong>${escapeHtml(formatTime(row))}</strong></div>
        <div><span>類別</span><strong>${escapeHtml(row.category)}</strong></div>
        <div><span>行程類型</span><strong>${escapeHtml(row.schedule_type)}</strong></div>
        <div><span>附加 / 待辦 / 代理</span><strong>${escapeHtml(row.sub_type || row.sub_type_note || '-')}</strong></div>
        <div><span>執行者</span><strong>${escapeHtml(getAssigneeNames(row))}</strong></div>
        <div><span>公務車</span><strong>${escapeHtml(row.car_no || '-')}</strong></div>
        <div class="span-2"><span>標題 / 辦理內容</span><strong>${escapeHtml(row.title)}</strong></div>
        <div class="span-2"><span>區域 / 客戶</span><strong>${escapeHtml(row.customer_name || '-')}</strong></div>
        <div class="span-2"><span>地點</span><strong>${escapeHtml(row.location_name || '-')}</strong></div>
        <div class="span-2"><span>地址</span><strong>${escapeHtml(row.address || '-')}</strong></div>
        <div class="span-2"><span>內容</span><strong>${escapeHtml(row.description || '-')}</strong></div>
        <div class="span-2"><span>服務紀錄單</span><strong>${row.need_service_record ? '需繳交' : '不需繳交'}</strong></div>
      </div>

      <div class="notice">${permissionNote}</div>

      <div class="modal-actions">
        <button type="button" class="secondary-btn" id="closeDetailBtn2">關閉</button>
        ${canCompleteSchedule(row) ? `<button type="button" class="primary-btn" id="detailCompleteBtn">已完成</button>` : ''}
        ${canCancelSchedule(row) ? `<button type="button" class="danger-btn" id="detailCancelBtn">取消行程</button>` : ''}
      </div>
    </div>
  `

  document.body.appendChild(modal)
  document.querySelector('#closeDetailBtn').addEventListener('click', () => modal.remove())
  document.querySelector('#closeDetailBtn2').addEventListener('click', () => modal.remove())

  const completeBtn = document.querySelector('#detailCompleteBtn')
  if (completeBtn) {
    completeBtn.addEventListener('click', async () => {
      modal.remove()
      await completeSchedule(scheduleId)
    })
  }

  const cancelBtn = document.querySelector('#detailCancelBtn')
  if (cancelBtn) {
    cancelBtn.addEventListener('click', async () => {
      modal.remove()
      await cancelSchedule(scheduleId)
    })
  }
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

function hourOptionsHtml() {
  return Array.from({ length: 24 }, (_, i) => {
    const value = String(i).padStart(2, '0')
    return `<option value="${value}">${value}</option>`
  }).join('')
}

function minuteOptionsHtml() {
  return Array.from({ length: 12 }, (_, i) => {
    const value = String(i * 5).padStart(2, '0')
    return `<option value="${value}">${value}</option>`
  }).join('')
}

function openScheduleModal() {
  const defaultStaffId = currentProfile.staff_id || ''
  const formCategoryOptions = formCategories.map(category => `<option value="${category}">${category}</option>`).join('')
  const serviceTypeOptions = serviceScheduleTypes.map(type => `<option value="${type}">${type}</option>`).join('')
  const todoOptions = todoItems.map(item => `<option value="${item}">${item}</option>`).join('')
  const leaveOptions = leaveMeetingTypes.map(item => `<option value="${item}">${item}</option>`).join('')

  const modal = document.createElement('div')
  modal.className = 'modal-backdrop'
  modal.innerHTML = `
    <div class="modal-panel">
      <div class="modal-header">
        <h3>新增行程</h3>
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

        <label>
          日期
          <input name="start_date" type="date" required value="${todayString()}">
        </label>

        <label>
          時間類型
          <select name="time_type" id="timeTypeSelect">
            <option value="不指定">不指定</option>
            <option value="整天">整天</option>
            <option value="上午">上午</option>
            <option value="下午">下午</option>
            <option value="指定時間">指定時間</option>
          </select>
        </label>

        <div class="span-2 conditional-time hidden" id="specificTimeBlock">
          <div class="time-select-row">
            <label>
              小時
              <select name="start_hour">${hourOptionsHtml()}</select>
            </label>
            <label>
              分鐘
              <select name="start_minute">${minuteOptionsHtml()}</select>
            </label>
          </div>
          <p class="field-hint">分鐘固定以 5 分鐘為單位，不再使用瀏覽器原生時間欄位。</p>
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
            <select name="todo_item">${todoOptions}</select>
          </label>
          <p class="field-hint">待辦項目之後會放到「選項管理」維護，可新增、修改、停用。</p>
        </div>

        <div class="span-2 form-section hidden" data-section="leave-meeting">
          <label>
            類別細項
            <select name="leave_meeting_type">${leaveOptions}</select>
          </label>

          <label>
            代理人
            <select name="proxy_staff_id" id="proxyStaffSelect">${staffSelectOptionsHtml()}</select>
          </label>
        </div>

        <div class="span-2 form-section hidden service-grid" data-section="service">
          <label>
            行程類型
            <select name="schedule_type" id="scheduleTypeSelect">${serviceTypeOptions}</select>
          </label>

          <label>
            附加行程
            <select name="sub_type" id="subTypeSelect"><option value="">無</option></select>
          </label>

          <label>
            附加行程備註
            <input name="sub_type_note" placeholder="例如：掛號號碼、證件內容、航班資訊">
          </label>

          <label>
            迄日
            <input name="end_date" type="date" value="${todayString()}">
          </label>

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

          <label>
            公務車
            <input name="car_no" placeholder="例如：A車、B車、車號">
          </label>

          <label>
            服務紀錄單繳交日期
            <input name="service_record_submitted_date" type="date">
          </label>

          <label class="span-2 service-check">
            <input name="need_service_record" type="checkbox">
            <span>此行程需要服務紀錄單</span>
          </label>
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
  const scheduleTypeSelect = document.querySelector('#scheduleTypeSelect')
  const subTypeSelect = document.querySelector('#subTypeSelect')

  function refreshFormSections() {
    const category = categorySelect.value
    document.querySelectorAll('.form-section').forEach(section => section.classList.add('hidden'))
    document.querySelector('[data-section="common-simple"]').classList.remove('hidden')

    if (category === '待辦事項') document.querySelector('[data-section="todo"]').classList.remove('hidden')
    if (category === '請假 / 會議 / 活動 / 外訓') document.querySelector('[data-section="leave-meeting"]').classList.remove('hidden')
    if (category === '服務行程') document.querySelector('[data-section="service"]').classList.remove('hidden')
  }

  function refreshTimeBlock() {
    document.querySelector('#specificTimeBlock').classList.toggle('hidden', timeTypeSelect.value !== '指定時間')
  }

  function refreshSubTypes() {
    const selected = scheduleTypeSelect.value
    const items = serviceSubTypeMap[selected] || []
    subTypeSelect.innerHTML = `<option value="">無</option>` + items.map(item => `<option value="${item}">${item}</option>`).join('')
  }

  categorySelect.addEventListener('change', refreshFormSections)
  timeTypeSelect.addEventListener('change', refreshTimeBlock)
  scheduleTypeSelect.addEventListener('change', refreshSubTypes)

  refreshFormSections()
  refreshTimeBlock()
  refreshSubTypes()

  document.querySelector('#closeModalBtn').addEventListener('click', () => modal.remove())
  document.querySelector('#cancelModalBtn').addEventListener('click', () => modal.remove())
  document.querySelector('#scheduleForm').addEventListener('submit', event => saveSchedule(event, modal))
}

function getStartTime(form) {
  const timeType = form.get('time_type')
  if (timeType !== '指定時間') return null
  const hour = form.get('start_hour') || '00'
  const minute = form.get('start_minute') || '00'
  return `${hour}:${minute}:00`
}

function getSelectedProxyName() {
  const proxySelect = document.querySelector('#proxyStaffSelect')
  if (!proxySelect || !proxySelect.value) return ''
  const option = proxySelect.options[proxySelect.selectedIndex]
  return option ? option.textContent : ''
}

async function saveSchedule(event, modal) {
  event.preventDefault()
  if (saving) return
  saving = true

  const form = new FormData(event.target)
  const category = form.get('category')
  const executorIds = [...document.querySelectorAll('input[name="executor"]:checked')].map(input => input.value)

  if (!executorIds.length) {
    alert('請至少選擇一位執行者。')
    saving = false
    return
  }

  const selectedStaff = staffList.filter(staff => executorIds.includes(staff.staff_id))
  const firstStaff = selectedStaff[0]
  const needServiceRecord = category === '服務行程' && form.get('need_service_record') === 'on'
  const submittedDate = category === '服務行程' ? (form.get('service_record_submitted_date') || null) : null

  let scheduleType = ''
  let subType = ''
  let subTypeNote = null
  let customerName = null
  let locationName = null
  let address = null
  let carNo = null
  let endDate = form.get('start_date')

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
    subTypeNote = getSelectedProxyName() ? `代理人：${getSelectedProxyName()}` : null
  }

  if (category === '服務行程') {
    scheduleType = form.get('schedule_type') || '其他'
    subType = form.get('sub_type') || null
    subTypeNote = form.get('sub_type_note') || null
    customerName = form.get('customer_name') || null
    locationName = form.get('location_name') || null
    address = form.get('address') || null
    carNo = form.get('car_no') || null
    endDate = form.get('end_date') || form.get('start_date')
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
    sub_type_note: subTypeNote,
    title: form.get('title'),
    description: form.get('description') || null,
    start_date: form.get('start_date'),
    end_date: endDate,
    time_type: form.get('time_type'),
    start_time: getStartTime(form),
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
    note: 'V002-1E 新增行程'
  })

  modal.remove()
  await refreshData()
  saving = false
  renderApp()
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

async function cancelSchedule(scheduleId) {
  const reason = prompt('請輸入取消原因，可留空：') || ''

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

async function logout() {
  await supabase.auth.signOut()
  currentProfile = null
  renderLogin()
}

window.addEventListener('load', loadProfile)
