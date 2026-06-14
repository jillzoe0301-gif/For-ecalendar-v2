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
let staffList = []
let schedulesError = ''
let saving = false

function canSeePage(page, role) { return page.roles === 'ALL' || page.roles.includes(role) }
function todayString() { return new Date().toISOString().slice(0, 10) }
function isMine(row) {
  const myStaffId = currentProfile?.staff_id
  if (!myStaffId) return false
  if (row.creator_staff_id === myStaffId) return true
  return (row.schedule_assignees || []).some(a => a.staff_id === myStaffId && !a.deleted_at)
}
function formatTime(row) { return row.time_type === '指定時間' && row.start_time ? row.start_time.slice(0,5) : (row.time_type || '不指定') }
function getAssigneeNames(row) {
  const names = (row.schedule_assignees || []).filter(a => !a.deleted_at).map(a => a.staff_name)
  return names.length ? names.join('、') : '-'
}

function renderLogin() {
  document.querySelector('#app').innerHTML = `
    <section class="login-page"><div class="login-card">
      <div class="logo-mark">FOR-e</div>
      <h1>FOR-e 共享排程系統</h1>
      <p>V002-1B｜新增一般行程</p>
      <label for="email">Email / 帳號</label><input id="email" type="email" placeholder="請輸入 Email" autocomplete="email" />
      <label for="password">密碼</label><input id="password" type="password" placeholder="請輸入密碼" autocomplete="current-password" />
      <button id="loginBtn">登入</button><div id="errorText" class="error"></div>
      <div class="login-note">測試項目：新增一般行程、指派人員、個人行程表與行程總覽同步。</div>
    </div></section>`
  document.querySelector('#loginBtn').addEventListener('click', login)
  document.querySelector('#password').addEventListener('keydown', e => { if (e.key === 'Enter') login() })
}

async function login() {
  const email = document.querySelector('#email').value.trim()
  const password = document.querySelector('#password').value
  const errorText = document.querySelector('#errorText')
  errorText.textContent = ''
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return errorText.textContent = '尚未設定 Supabase 環境變數。'
  if (!email || !password) return errorText.textContent = '請輸入 Email 與密碼。'
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return errorText.textContent = `登入失敗：${error.message}`
  await loadProfile()
}

async function loadProfile() {
  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) { renderLogin(); return }
  const { data: profile, error } = await supabase.rpc('get_my_profile').single()
  if (error || !profile) { await supabase.auth.signOut(); renderLogin(); alert('找不到 profiles，請確認 Supabase 帳號與 profiles 是否正確。'); return }
  if (profile.status !== '啟用') { await supabase.auth.signOut(); renderLogin(); alert('此帳號已停用，請聯繫管理員。'); return }
  currentProfile = profile
  currentPage = 'personalSchedule'
  await refreshData()
  renderApp()
}

async function refreshData() { await Promise.all([loadStaff(), loadSchedules()]) }
async function loadStaff() {
  const { data, error } = await supabase.from('staff').select('staff_id,name,department_id,department_name,position,role,status,deleted_at').eq('status','啟用').is('deleted_at', null).order('display_order')
  if (error) { console.error(error); staffList=[]; return }
  staffList = data || []
}
async function loadSchedules() {
  schedulesError = ''
  const { data, error } = await supabase.from('schedules').select('*, schedule_assignees(*)').is('deleted_at', null).order('start_date').order('start_time')
  if (error) { console.error(error); schedules=[]; schedulesError=error.message; return }
  schedules = data || []
}

function renderApp() {
  const visiblePages = pages.filter(p => canSeePage(p, currentProfile.role))
  const mobilePages = visiblePages.filter(p => p.mobile)
  document.querySelector('#app').innerHTML = `
  <section class="layout">
    <aside class="sidebar"><div class="brand"><div class="brand-title">FOR-e</div><div class="brand-subtitle">共享排程系統</div></div>
      <nav class="desktop-menu">${visiblePages.map(p => `<button class="menu-btn ${p.key===currentPage?'active':''}" data-page="${p.key}">${p.label}</button>`).join('')}</nav>
    </aside>
    <main class="main"><header class="topbar"><div><h2>${getPageTitle()}</h2><p>${currentProfile.name || currentProfile.email}｜${currentProfile.role}｜${currentProfile.department_name || '-'}｜${currentProfile.position_name || currentProfile.position || '-'}</p></div><button class="logout-btn" id="logoutBtn">登出</button></header><section class="content-card">${renderPageContent()}</section></main>
    <nav class="mobile-nav">${mobilePages.map(p => `<button class="${p.key===currentPage?'active':''}" data-page="${p.key}">${p.mobileLabel}</button>`).join('')}</nav>
  </section>`
  document.querySelectorAll('[data-page]').forEach(btn => btn.addEventListener('click', () => { currentPage=btn.dataset.page; renderApp() }))
  document.querySelector('#logoutBtn').addEventListener('click', logout)
  const refreshBtn = document.querySelector('#refreshBtn'); if (refreshBtn) refreshBtn.addEventListener('click', async () => { await refreshData(); renderApp() })
  const addBtn = document.querySelector('#addScheduleBtn'); if (addBtn) addBtn.addEventListener('click', openScheduleModal)
}
function getPageTitle() { return (pages.find(p => p.key === currentPage) || pages[0]).label }
function renderPageContent() {
  if (currentPage === 'personalSchedule') return renderPersonalSchedule()
  if (currentPage === 'scheduleOverview') return renderScheduleOverview()
  if (currentPage === 'recordSubmit') return `<h3>紀錄單繳交</h3><div class="notice">翻譯專用頁。服務紀錄單提醒會在後續階段加入。</div>`
  if (currentPage === 'users') return `<h3>人員 / 帳號</h3><div class="notice">權限規則：管理員可管理全部帳號；其他角色只能查看與修改自己的帳號基本資料，不能刪除、停用或啟用帳號。</div><div class="empty-state"><strong>目前登入帳號</strong><p>${currentProfile.email}</p></div>`
  return `<h3>${getPageTitle()}</h3><p>此頁面目前為權限測試佔位頁，正式功能會在下一階段逐步加入。</p>`
}
function renderToolbar(title) { return `<div class="page-toolbar"><div><h3>${title}</h3><p class="muted">V002-1B：新增一般行程、指派人員、同步到個人行程表與行程總覽。</p></div><div class="toolbar-actions"><button class="primary-btn" id="addScheduleBtn">新增行程</button><button class="secondary-btn" id="refreshBtn">重新整理</button></div></div>` }
function renderPersonalSchedule() {
  const myRows = schedules.filter(row => isMine(row))
  const todayRows = myRows.filter(row => row.start_date === todayString() && row.status !== '已完成' && row.status !== '取消')
  return `${renderToolbar('個人行程表')}${renderReadStatus()}<div class="summary-grid"><div class="summary-card"><strong>${todayRows.length}</strong><span>今日待處理</span></div><div class="summary-card"><strong>${myRows.length}</strong><span>個人行程總數</span></div></div>${renderScheduleList(myRows, '目前沒有個人行程。')}`
}
function renderScheduleOverview() { return `${renderToolbar('行程總覽')}${renderReadStatus()}${renderScheduleList(schedules, '目前沒有行程資料。')}` }
function renderReadStatus() { return schedulesError ? `<div class="error-card">讀取行程失敗：${schedulesError}</div>` : '' }
function renderScheduleList(rows, emptyText) {
  if (!rows.length) return `<div class="empty-state">${emptyText}</div>`
  return `<div class="schedule-list">${rows.map(row => `<div class="schedule-card ${row.status==='已完成'?'is-completed':''} ${row.status==='取消'?'is-cancelled':''}"><div class="schedule-card-main"><div class="schedule-date">${row.start_date || '-'}｜${formatTime(row)}</div><div class="schedule-title">${row.title}</div><div class="schedule-meta">${row.category}｜${row.schedule_type}${row.sub_type ? '｜' + row.sub_type : ''}</div><div class="schedule-meta">執行者：${getAssigneeNames(row)}</div><div class="schedule-meta">地點 / 客戶：${row.location_name || row.customer_name || '-'}</div>${row.need_service_record ? '<div class="service-record-hint">需服務紀錄單</div>' : ''}</div><div class="schedule-card-actions"><span class="status-pill">${row.status}</span></div></div>`).join('')}</div>`
}

function openScheduleModal() {
  const defaultStaffId = currentProfile.staff_id || ''
  const staffOptions = staffList.map(staff => `<label class="check-row"><input type="checkbox" name="executor" value="${staff.staff_id}" ${staff.staff_id===defaultStaffId?'checked':''}><span>${staff.name}｜${staff.department_name}｜${staff.position}</span></label>`).join('')
  const modal = document.createElement('div')
  modal.className = 'modal-backdrop'
  modal.innerHTML = `<div class="modal-panel"><div class="modal-header"><h3>新增一般行程</h3><button class="icon-btn" id="closeModalBtn" type="button">×</button></div><form id="scheduleForm" class="form-grid">
    <label>類別<select name="category"><option value="服務行程">服務行程</option><option value="一般記事">一般記事</option><option value="待辦事項">待辦事項</option><option value="提醒事項">提醒事項</option></select></label>
    <label>行程類型<select name="schedule_type"><option value="面談">面談</option><option value="醫療">醫療</option><option value="送工">送工</option><option value="銀行">銀行</option><option value="收送簽文件">收送簽文件</option><option value="提醒追蹤事項">提醒追蹤事項</option><option value="其他">其他</option></select></label>
    <label class="span-2">辦理內容<input name="title" required placeholder="例如：王小明回診、客戶面談、文件處理"></label>
    <label>日期<input name="start_date" type="date" required value="${todayString()}"></label>
    <label>時間類型<select name="time_type"><option value="不指定">不指定</option><option value="整天">整天</option><option value="上午">上午</option><option value="下午">下午</option><option value="指定時間">指定時間</option></select></label>
    <label>開始時間<input name="start_time" type="time" step="300"></label>
    <label>地點 / 客戶<input name="location_name" placeholder="地點或客戶名稱"></label>
    <label class="span-2">內容說明<textarea name="description" rows="3" placeholder="補充說明"></textarea></label>
    <label class="span-2 service-check"><input name="need_service_record" type="checkbox"><span>此行程需要服務紀錄單</span></label>
    <div class="span-2"><div class="field-title">執行者</div><div class="checkbox-list">${staffOptions || '<div class="empty-state">目前沒有可選人員。</div>'}</div></div>
    <div class="modal-actions span-2"><button type="button" class="secondary-btn" id="cancelModalBtn">取消</button><button type="submit" class="primary-btn">儲存</button></div>
  </form></div>`
  document.body.appendChild(modal)
  document.querySelector('#closeModalBtn').addEventListener('click', () => modal.remove())
  document.querySelector('#cancelModalBtn').addEventListener('click', () => modal.remove())
  document.querySelector('#scheduleForm').addEventListener('submit', event => saveSchedule(event, modal))
}

async function saveSchedule(event, modal) {
  event.preventDefault()
  if (saving) return
  saving = true
  const form = new FormData(event.target)
  const executorIds = [...document.querySelectorAll('input[name="executor"]:checked')].map(input => input.value)
  if (!executorIds.length) { alert('請至少選擇一位執行者。'); saving = false; return }
  const selectedStaff = staffList.filter(staff => executorIds.includes(staff.staff_id))
  const firstStaff = selectedStaff[0]
  const needServiceRecord = form.get('need_service_record') === 'on'
  const schedulePayload = {
    creator_profile_id: currentProfile.profile_id,
    creator_staff_id: currentProfile.staff_id,
    creator_name: currentProfile.name || currentProfile.email,
    department_id: firstStaff.department_id || currentProfile.department_id,
    department_name: firstStaff.department_name || currentProfile.department_name,
    category: form.get('category'),
    schedule_type: form.get('schedule_type'),
    title: form.get('title'),
    description: form.get('description') || null,
    start_date: form.get('start_date'),
    end_date: form.get('start_date'),
    time_type: form.get('time_type'),
    start_time: form.get('start_time') || null,
    location_name: form.get('location_name') || null,
    status: '未完成',
    need_service_record: needServiceRecord
  }
  const { data: schedule, error: scheduleError } = await supabase.from('schedules').insert(schedulePayload).select().single()
  if (scheduleError) { console.error(scheduleError); alert('新增行程失敗：' + scheduleError.message); saving = false; return }
  const assigneeRows = selectedStaff.map(staff => ({ schedule_id: schedule.schedule_id, staff_id: staff.staff_id, staff_name: staff.name, department_id: staff.department_id, department_name: staff.department_name, position: staff.position, assignee_type: 'executor' }))
  const { error: assigneeError } = await supabase.from('schedule_assignees').insert(assigneeRows)
  if (assigneeError) { console.error(assigneeError); alert('行程已建立，但指派人員寫入失敗：' + assigneeError.message); saving = false; return }
  if (needServiceRecord) {
    const serviceRows = selectedStaff.map(staff => ({ schedule_id: schedule.schedule_id, staff_id: staff.staff_id, staff_name: staff.name, department_id: staff.department_id, department_name: staff.department_name, schedule_date: schedulePayload.start_date, schedule_type: schedulePayload.schedule_type, title: schedulePayload.title, location_name: schedulePayload.location_name, need_submit: true, submitted: false }))
    const { error: serviceError } = await supabase.from('service_records').insert(serviceRows)
    if (serviceError) { console.error(serviceError); alert('行程已建立，但服務紀錄單資料寫入失敗：' + serviceError.message) }
  }
  await supabase.from('audit_logs').insert({ operated_by_profile_id: currentProfile.profile_id, operated_by_staff_id: currentProfile.staff_id, operated_by_name: currentProfile.name || currentProfile.email, action_type: '新增', source_type: 'schedule', source_id: schedule.schedule_id, note: 'V002-1B 新增一般行程' })
  modal.remove()
  await refreshData()
  saving = false
  renderApp()
}

async function logout() { await supabase.auth.signOut(); currentProfile = null; renderLogin() }
window.addEventListener('load', loadProfile)
