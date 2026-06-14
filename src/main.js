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

let currentProfile = null
let currentPage = 'personalSchedule'
let schedules = []
let loadingSchedules = false
let schedulesError = ''

function canSeePage(page, role) {
  return page.roles === 'ALL' || page.roles.includes(role)
}

function isPowerRole() {
  return ['管理員', '主管', '行政 / 海外'].includes(currentProfile?.role)
}

function isMine(row) {
  const myStaffId = currentProfile?.staff_id
  if (!myStaffId) return false

  if (row.creator_staff_id === myStaffId) return true

  const assignees = row.schedule_assignees || []
  return assignees.some(item => item.staff_id === myStaffId && !item.deleted_at)
}

function formatDate(value) {
  return value || '-'
}

function formatTime(row) {
  if (row.time_type === '指定時間' && row.start_time) {
    return row.start_time.slice(0, 5)
  }
  return row.time_type || '不指定'
}

function getAssigneeNames(row) {
  const names = (row.schedule_assignees || [])
    .filter(item => !item.deleted_at)
    .map(item => item.staff_name)

  return names.length ? names.join('、') : '-'
}

function renderLogin() {
  document.querySelector('#app').innerHTML = `
    <section class="login-page">
      <div class="login-card">
        <div class="logo-mark">FOR-e</div>
        <h1>FOR-e 共享排程系統</h1>
        <p>V002-1A｜核心行程讀取測試</p>

        <label for="email">Email / 帳號</label>
        <input id="email" type="email" placeholder="請輸入 Email" autocomplete="email" />

        <label for="password">密碼</label>
        <input id="password" type="password" placeholder="請輸入密碼" autocomplete="current-password" />

        <button id="loginBtn">登入</button>
        <div id="errorText" class="error"></div>

        <div class="login-note">
          目前測試登入、角色選單、個人行程表讀取、行程總覽讀取。
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

  const { data: profile, error } = await supabase
    .rpc('get_my_profile')
    .single()

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
  await loadSchedules()
  renderApp()
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
      await loadSchedules()
      renderApp()
    })
  }
}

function getPageTitle() {
  const page = pages.find(item => item.key === currentPage)
  return page ? page.label : '個人行程表'
}

function renderPageContent() {
  if (currentPage === 'personalSchedule') return renderPersonalSchedule()
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
        <p class="muted">V002-1A：目前只測試讀取行程，不提供新增或修改。</p>
      </div>
      <div class="toolbar-actions">
        <button class="secondary-btn" id="refreshBtn">重新整理</button>
      </div>
    </div>
  `
}

function renderPersonalSchedule() {
  const myRows = schedules.filter(row => isMine(row))
  const today = new Date().toISOString().slice(0, 10)
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

function renderScheduleOverview() {
  return `
    ${renderToolbar('行程總覽')}
    ${renderReadStatus()}
    ${renderScheduleList(schedules, '目前沒有行程資料。')}
  `
}

function renderReadStatus() {
  if (loadingSchedules) {
    return `<div class="notice">正在讀取行程資料...</div>`
  }

  if (schedulesError) {
    return `<div class="error-card">讀取行程失敗：${schedulesError}</div>`
  }

  return ''
}

function renderScheduleList(rows, emptyText) {
  if (!rows.length) {
    return `<div class="empty-state">${emptyText}</div>`
  }

  return `
    <div class="schedule-list">
      ${rows.map(row => `
        <div class="schedule-card ${row.status === '已完成' ? 'is-completed' : ''} ${row.status === '取消' ? 'is-cancelled' : ''}">
          <div class="schedule-card-main">
            <div class="schedule-date">${formatDate(row.start_date)}｜${formatTime(row)}</div>
            <div class="schedule-title">${row.title}</div>
            <div class="schedule-meta">${row.category}｜${row.schedule_type}${row.sub_type ? '｜' + row.sub_type : ''}</div>
            <div class="schedule-meta">執行者：${getAssigneeNames(row)}</div>
            <div class="schedule-meta">地點 / 客戶：${row.location_name || row.customer_name || '-'}</div>
          </div>
          <div class="schedule-card-actions">
            <span class="status-pill">${row.status}</span>
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

async function logout() {
  await supabase.auth.signOut()
  currentProfile = null
  renderLogin()
}

window.addEventListener('load', loadProfile)
