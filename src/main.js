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

const formCategories = ['服務行程', '一般記事', '待辦事項', '請假 / 會議 / 活動 / 外訓']
const serviceScheduleTypes = [
  '面談', '上線 / 教育訓練', '定期 / 開會', '送工', '銀行', '醫療',
  '車禍處理', '結薪', '收送簽文件', '逃跑通知', '轉出追蹤',
  '住變資訊', '驗證提醒', '返台提醒', '宿舍', '其他'
]
const todoItems = ['送件', '補件', '登記', '回覆', '追蹤']
const leaveMeetingTypes = ['請假', '返鄉', '會議', '外訓', '公司活動', '部門活動']
const carOptions = ['不使用', 'A車', 'B車', 'C車', '其他']
const documentOptions = ['護照', '居留證', '健保卡', '印章', '其他']
const weekdays = [
  ['MO', '週一'], ['TU', '週二'], ['WE', '週三'], ['TH', '週四'],
  ['FR', '週五'], ['SA', '週六'], ['SU', '週日']
]

let currentProfile = null
let currentPage = 'personalSchedule'
let schedules = []
let staffList = []
let loadingSchedules = false
let schedulesError = ''
let saving = false
let searchFilters = {
  keyword: '',
  status: '全部',
  category: '全部',
  staffId: '全部',
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
      item.includes('終止日') ||
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
          ${renderBrandLogo('icon')}
          <span>FOR-e</span>
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

  const addBtn = document.querySelector('#addScheduleBtn')
  if (addBtn) addBtn.addEventListener('click', openScheduleModal)

  document.querySelectorAll('[data-view-schedule]').forEach(btn => {
    btn.addEventListener('click', () => openScheduleDetail(btn.dataset.viewSchedule))
  })

  document.querySelectorAll('[data-record-schedule]').forEach(btn => {
    btn.addEventListener('click', () => openServiceRecordModal(btn.dataset.recordSchedule))
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

function renderSearchPage() {
  const results = getSearchResults()
  const statusOptions = buildOptionList(['全部', '未完成', '已完成', '取消'], searchFilters.status)
  const categoryOptions = buildOptionList(['全部', ...formCategories], searchFilters.category)

  return `
    <div class="page-toolbar">
      <div>
        <h3>行程搜尋</h3>
        <p class="muted">可查詢未完成、已完成與取消行程。個人頁隱藏的資料可在此查回。</p>
      </div>
      <div class="toolbar-actions">
        <button class="secondary-btn" id="resetSearchBtn">清除條件</button>
        <button class="secondary-btn" id="refreshBtn">重新整理</button>
      </div>
    </div>

    ${renderReadStatus()}

    <form id="searchForm" class="search-panel">
      <label class="span-2">
        關鍵字
        <input name="keyword" value="${escapeHtml(searchFilters.keyword)}" placeholder="搜尋標題、內容、客戶、地點、備註、人員">
      </label>

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

      <label>
        起日
        <input name="startDate" type="date" value="${searchFilters.startDate}">
      </label>

      <label>
        迄日
        <input name="endDate" type="date" value="${searchFilters.endDate}">
      </label>

      <div class="search-actions">
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

    ${renderScheduleList(results, '沒有符合條件的行程。')}
  `
}


function renderPageContent() {
  if (currentPage === 'personalSchedule') return renderPersonalSchedule()
  if (currentPage === 'personalTodo') return renderPersonalTodo()
  if (currentPage === 'scheduleOverview') return renderScheduleOverview()
  if (currentPage === 'search') return renderSearchPage()
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
        <p class="muted">V002-1E-4：卡片、證件欄位、提醒標籤與 LOGO。</p>
      </div>
      <div class="toolbar-actions">
        <button class="primary-btn" id="addScheduleBtn">${currentPage === 'personalTodo' ? '新增一般待辦' : '新增行程'}</button>
        <button class="secondary-btn" id="refreshBtn">重新整理</button>
      </div>
    </div>
  `
}

function renderPersonalSchedule() {
  const myRows = schedules.filter(row => isActivePersonalSchedule(row) && isMine(row))
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
    ${renderScheduleList(myRows, '目前沒有個人行程。', true)}
  `
}

function renderPersonalTodo() {
  const myRows = schedules.filter(row => isActivePersonalSchedule(row) && isMine(row) && ['一般記事', '待辦事項', '請假 / 會議 / 活動 / 外訓'].includes(row.category))
  return `
    ${renderToolbar('個人一般待辦')}
    ${renderReadStatus()}
    ${renderScheduleList(myRows, '目前沒有一般記事或待辦事項。', true)}
  `
}

function renderScheduleOverview() {
  return `
    ${renderToolbar('行程總覽')}
    ${renderReadStatus()}
    ${renderScheduleList(schedules.filter(row => isVisibleSchedule(row)), '目前沒有行程資料。')}
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
              ${hideCategoryMeta ? '' : `<div class="schedule-meta">${escapeHtml(row.category)}${row.sub_type ? '｜附加：' + escapeHtml(row.sub_type) : ''}</div>`}
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
        <div><span>公務車</span><strong>${escapeHtml(row.car_no || '-')}</strong></div>
        <div class="span-2"><span>標題 / 辦理內容</span><strong>${escapeHtml(row.title)}</strong></div>
        <div class="span-2"><span>區域 / 客戶</span><strong>${escapeHtml(row.customer_name || '-')}</strong></div>
        <div class="span-2"><span>地點</span><strong>${escapeHtml(row.location_name || '-')}</strong></div>
        <div class="span-2"><span>地址</span><strong>${escapeHtml(row.address || '-')}</strong></div>
        <div class="span-2"><span>內容</span><strong>${escapeHtml(row.description || '-')}</strong></div>
        <div class="span-2"><span>備註 / 提醒 / 證件</span><strong>${escapeHtml(row.sub_type_note || '-')}</strong></div>
        <div class="span-2"><span>服務紀錄單繳交狀況</span><strong>${row.need_service_record ? (row.service_record_submitted_date ? '已繳交：' + row.service_record_submitted_date : '需繳交，尚未繳交') : '不需繳交'}</strong></div>
      </div>

      <div class="notice">${permissionNote}</div>

      <div class="modal-actions">
        <button type="button" class="secondary-btn" id="closeDetailBtn2">關閉</button>
        ${row.schedule_type === '醫療' && isMine(row) && row.status !== '取消' ? `<button type="button" class="secondary-btn" id="detailMedicalFollowBtn">回診資訊</button>` : ''}
        ${canModifySchedule(row) && row.status !== '取消' ? `<button type="button" class="secondary-btn" id="detailEditBtn">修改行程</button>` : ''}
        ${canCompleteSchedule(row) ? `<button type="button" class="primary-btn" id="detailCompleteBtn">已完成</button>` : ''}
        ${canCancelSchedule(row) ? `<button type="button" class="danger-btn" id="detailCancelBtn">取消行程</button>` : ''}
      </div>
    </div>
  `

  document.body.appendChild(modal)
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
      openEditScheduleModal(scheduleId)
    })
  }

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
  if (currentPage === 'personalTodo') return ['一般記事', '待辦事項', '請假 / 會議 / 活動 / 外訓']
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

          <div class="extra-schedule-box">
            <label class="service-check">
              <input name="has_extra_schedule" type="checkbox" id="hasExtraScheduleCheck">
              <span>是否有附加行程</span>
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

          <div class="span-2 service-record-box">
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

          <label class="span-2">
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

        <div class="span-2 form-section hidden service-grid" data-section="service">
          <div class="span-2 vehicle-doc-row">
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
            <div class="group-title">逃跑三日通知</div>
            <div class="compact-grid">
              <label>第一日日期<input name="runaway_day1" type="date"></label>
              <label>第二日日期<input name="runaway_day2" type="date"></label>
              <label>第三日日期<input name="runaway_day3" type="date"></label>
            </div>
          </div>

          <div class="span-2 conditional-service hidden" data-service-extra="轉出追蹤">
            <div class="group-title">轉出提醒</div>
            <div class="compact-grid">
              <label>終止日<input name="transfer_end_date" type="date"></label>
              <label>轉出到期日<input name="transfer_due_date" type="date"></label>
            </div>
          </div>

          <div class="span-2 conditional-service hidden" data-service-extra="返台提醒">
            <div class="group-title">抵台提醒</div>
            <div class="compact-grid">
              <label>返台日期<input name="return_date" type="date"></label>
              <label>班機<input name="return_flight" placeholder="班機"></label>
              <label>
                抵台時間
                ${compactTimeSelectHtml('arrival', '09', '00')}
              </label>
            </div>
          </div>

          <div class="span-2 conditional-service hidden" data-service-extra="住變資訊">
            <div class="group-title">住變提醒</div>
            <div class="compact-grid">
              <label>住變日期<input name="housing_change_date" type="date"></label>
              <label>
                搬家時間
                ${compactTimeSelectHtml('housing_move', '09', '00')}
              </label>
              <label class="span-2">新地址 / 住變說明<input name="housing_note" placeholder="新地址或住變說明"></label>
            </div>
          </div>

          <div class="span-2 conditional-service hidden" data-service-extra="驗證提醒">
            <div class="group-title">驗證提醒</div>
            <div class="compact-grid">
              <label>最後工作日<input name="verify_last_work_date" type="date"></label>
              <label>驗證日期<input name="verify_date" type="date"></label>
              <label>離境日期<input name="verify_leave_date" type="date"></label>
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
    document.querySelectorAll('.form-section').forEach(section => section.classList.add('hidden'))
    document.querySelector('[data-section="common-simple"]').classList.remove('hidden')

    if (category === '待辦事項') document.querySelector('[data-section="todo"]').classList.remove('hidden')
    if (category === '請假 / 會議 / 活動 / 外訓') document.querySelector('[data-section="leave-meeting"]').classList.remove('hidden')
    if (category === '服務行程') {
      const serviceTop = document.querySelector('[data-section="service-top"]')
      const serviceLocation = document.querySelector('[data-section="service-location"]')
      const serviceBlock = document.querySelector('[data-section="service"]')
      if (serviceTop) serviceTop.classList.remove('hidden')
      if (serviceLocation) serviceLocation.classList.remove('hidden')
      if (serviceBlock) serviceBlock.classList.remove('hidden')
    }
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
  }

  function refreshDocumentsBlock() {
    document.querySelector('#documentOptionsBlock').classList.toggle('hidden', hasDocumentsSelect.value !== '是')
  }

  categorySelect.addEventListener('change', refreshFormSections)
  timeTypeSelect.addEventListener('change', refreshTimeBlock)
  repeatModeSelect.addEventListener('change', refreshRepeatBlocks)
  serviceTypeSelect.addEventListener('change', refreshServiceExtras)
  hasDocumentsSelect.addEventListener('change', refreshDocumentsBlock)

  const hasExtraScheduleCheck = document.querySelector('#hasExtraScheduleCheck')
  const extraScheduleBlock = document.querySelector('#extraScheduleBlock')

  function refreshExtraScheduleBlock() {
    if (!hasExtraScheduleCheck || !extraScheduleBlock) return
    extraScheduleBlock.classList.toggle('hidden', !hasExtraScheduleCheck.checked)
  }

  if (hasExtraScheduleCheck) hasExtraScheduleCheck.addEventListener('change', refreshExtraScheduleBlock)

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
    if (form.get('runaway_day1')) notes.push(`逃跑第一日：${form.get('runaway_day1')}`)
    if (form.get('runaway_day2')) notes.push(`逃跑第二日：${form.get('runaway_day2')}`)
    if (form.get('runaway_day3')) notes.push(`逃跑第三日：${form.get('runaway_day3')}`)
  }

  if (scheduleType === '轉出追蹤') {
    if (form.get('transfer_end_date')) notes.push(`終止日：${form.get('transfer_end_date')}`)
    if (form.get('transfer_due_date')) notes.push(`轉出到期日：${form.get('transfer_due_date')}`)
  }

  if (scheduleType === '返台提醒') {
    if (form.get('return_date')) notes.push(`返台日期：${form.get('return_date')}`)
    if (form.get('return_flight')) notes.push(`班機：${form.get('return_flight')}`)
    notes.push(`抵台時間：${getCompactTime(form, 'arrival')}`)
  }

  if (scheduleType === '住變資訊') {
    if (form.get('housing_change_date')) notes.push(`住變日期：${form.get('housing_change_date')}`)
    notes.push(`搬家時間：${getCompactTime(form, 'housing_move')}`)
    if (form.get('housing_note')) notes.push(`住變說明：${form.get('housing_note')}`)
  }

  if (scheduleType === '驗證提醒') {
    if (form.get('verify_last_work_date')) notes.push(`最後工作日：${form.get('verify_last_work_date')}`)
    if (form.get('verify_date')) notes.push(`驗證日期：${form.get('verify_date')}`)
    if (form.get('verify_leave_date')) notes.push(`離境日期：${form.get('verify_leave_date')}`)
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

          <div class="extra-schedule-box">
            <label class="service-check">
              <input name="has_extra_schedule" type="checkbox" id="editHasExtraScheduleCheck" ${row.sub_type ? 'checked' : ''}>
              <span>是否有附加行程</span>
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

          <div class="span-2 service-record-box">
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

          <label>
            服務紀錄單繳交日期
            <input name="service_record_submitted_date" type="date" value="${row.service_record_submitted_date || ''}">
          </label>

          <label>
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
  const editHasExtraScheduleCheck = document.querySelector('#editHasExtraScheduleCheck')
  const editExtraScheduleBlock = document.querySelector('#editExtraScheduleBlock')
  const submittedDateInput = document.querySelector('input[name="service_record_submitted_date"]')

  function refreshEditServiceBlock() {
    serviceBlock.classList.toggle('hidden', categorySelect.value !== '服務行程')
    if (serviceLocationBlock) serviceLocationBlock.classList.toggle('hidden', categorySelect.value !== '服務行程')
  }

  function refreshEditTimeBlock() {
    timeBlock.classList.toggle('hidden', !['上午', '下午'].includes(timeTypeSelect.value))
  }

  function refreshEditExtraScheduleBlock() {
    if (!editHasExtraScheduleCheck || !editExtraScheduleBlock) return
    editExtraScheduleBlock.classList.toggle('hidden', !editHasExtraScheduleCheck.checked)
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
  if (editHasExtraScheduleCheck) editHasExtraScheduleCheck.addEventListener('change', refreshEditExtraScheduleBlock)

  refreshEditExtraScheduleBlock()
  refreshEditServiceBlock()
  refreshEditTimeBlock()
  refreshEditServiceRecordChecks()

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

  const payload = {
    category,
    schedule_type: isService ? (form.get('schedule_type') || '其他') : category,
    sub_type: isService && form.get('has_extra_schedule') === 'on' ? (form.get('sub_type') || null) : null,
    sub_type_note: form.get('sub_type_note') || null,
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
    car_no: isService ? (form.get('car_no') || null) : null,
    need_service_record: isService && form.get('need_service_record') === 'on',
    service_record_submitted: submitted,
    service_record_submitted_date: submittedDate
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

  const form = new FormData(event.target)
  const editExecutorIds = [...document.querySelectorAll('input[name="edit_executor"]:checked')].map(input => input.value)

  if (!editExecutorIds.length) {
    alert('請至少選擇一位執行者。')
    return
  }

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

  if (category === '服務行程') {
    scheduleType = form.get('schedule_type') || '其他'
    subType = form.get('has_extra_schedule') === 'on' ? (form.get('sub_type') || null) : null
    customerName = form.get('customer_name') || null
    locationName = form.get('location_name') || null
    address = form.get('address') || null
    carNo = form.get('car_no') || null
    subTypeNoteParts.push(...buildServiceExtraNotes(form, scheduleType))
    if (form.get('sub_type_note')) subTypeNoteParts.push(form.get('sub_type_note'))
    if (needServiceRecord) subTypeNoteParts.push(`服務紀錄單：${serviceRecordSubmitted ? '已繳交' : '需要，尚未繳交'}`)
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
