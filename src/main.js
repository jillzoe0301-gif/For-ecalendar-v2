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
  { key: 'users', label: '人員 / 帳號', mobileLabel: '帳號', roles: ['管理員', '主管', '行政 / 海外', '外務 / 宿管人員 / 會計', '一般職員'], mobile: false }
]

let currentProfile = null
let currentPage = 'personalSchedule'

function canSeePage(page, role) {
  return page.roles === 'ALL' || page.roles.includes(role)
}

function renderLogin() {
  document.querySelector('#app').innerHTML = `
    <section class="login-page">
      <div class="login-card">
        <div class="logo-mark">FOR-e</div>
        <h1>FOR-e 共享排程系統</h1>
        <p>V001｜登入與角色權限測試</p>
        <label for="email">Email / 帳號</label>
        <input id="email" type="email" placeholder="請輸入 Email" autocomplete="email" />
        <label for="password">密碼</label>
        <input id="password" type="password" placeholder="請輸入密碼" autocomplete="current-password" />
        <button id="loginBtn">登入</button>
        <div id="errorText" class="error"></div>
        <div class="login-note">目前只測試 Supabase 登入、角色讀取、桌機選單與手機底部選單。</div>
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
  renderApp()
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
          ${visiblePages.map(page => `<button class="menu-btn ${page.key === currentPage ? 'active' : ''}" data-page="${page.key}">${page.label}</button>`).join('')}
        </nav>
      </aside>
      <main class="main">
        <header class="topbar">
          <div>
            <h2>${getPageTitle()}</h2>
            <p>${currentProfile.name || currentProfile.email}｜${currentProfile.role}｜${currentProfile.department_name || '-'}｜${currentProfile.position || '-'}</p>
          </div>
          <button class="logout-btn" id="logoutBtn">登出</button>
        </header>
        <section class="content-card">${renderPageContent()}</section>
      </main>
      <nav class="mobile-nav">
        ${mobilePages.map(page => `<button class="${page.key === currentPage ? 'active' : ''}" data-page="${page.key}">${page.mobileLabel}</button>`).join('')}
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
}

function getPageTitle() {
  const page = pages.find(item => item.key === currentPage)
  return page ? page.label : '個人行程表'
}

function renderPageContent() {
  if (currentPage === 'personalSchedule') {
    return `
      <h3>個人行程表</h3>
      <div class="notice">今日提醒視窗預留區：之後顯示今日行程、待辦、服務紀錄單提醒與逾期事項。</div>
      <div class="empty-state"><strong>V001 測試完成標準</strong><p>登入成功、讀取 profiles、依角色顯示正確選單、登入後預設進入個人行程表。</p></div>
    `
  }
  if (currentPage === 'recordSubmit') {
    return `<h3>紀錄單繳交</h3><div class="notice">翻譯專用頁。之後顯示須繳交、尚未超過 2 週、超過 2 週未繳交提醒。</div>`
  }
  return `<h3>${getPageTitle()}</h3><p>此頁面目前為權限測試佔位頁，正式功能會在下一階段逐步加入。</p>`
}

async function logout() {
  await supabase.auth.signOut()
  currentProfile = null
  renderLogin()
}

window.addEventListener('load', loadProfile)
