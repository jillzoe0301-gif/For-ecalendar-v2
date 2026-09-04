import { defineConfig } from 'vite'

const oldFieldScheduleRow = `function isFieldScheduleRow(row) {
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
}`

const newFieldScheduleRow = `const FIELD_PUBLIC_DUTY_DISPLAY_LOGIC_VERSION = '1-3em'

function isFieldPublicDutySchedule(row = {}) {
  if (!row) return false
  if (String(row.category || '').trim() !== '請假 / 會議 / 活動 / 外訓') return false
  const typeText = [row.sub_type, row.schedule_type, row.title]
    .filter(Boolean)
    .join('｜')
  if (!typeText.includes(publicDutyLeaveMeetingType)) return false

  return getActiveAssigneeIds(row).some(staffId => {
    const staff = staffList.find(item => String(item?.staff_id || '') === String(staffId || ''))
    return staff ? isStaffFieldWorker(staff) : false
  })
}

function isFieldScheduleRow(row) {
  if (!row) return false
  if (isFieldPublicDutySchedule(row)) return true

  const text = [row.category, row.schedule_type, row.sub_type, row.title, row.sub_type_note]
    .filter(Boolean)
    .join('｜')

  return (
    text.includes('外務') ||
    row.category === '外務行程' ||
    row.schedule_type === '外務行程' ||
    row.schedule_type === '外務'
  )
}`

const oldFieldScheduleReadBranch = `      if (isFieldDayReminderSchedule(row)) return false
      if (isLeaveOrReturnSchedule(row)) return false
      return true`

const newFieldScheduleReadBranch = `      if (isFieldDayReminderSchedule(row)) return false
      if (isLeaveOrReturnSchedule(row) && !isFieldPublicDutySchedule(row)) return false
      return true`

const oldFieldScheduleReadBranchDirect = `    if (isFieldDayReminderSchedule(row)) return false
    if (isLeaveOrReturnSchedule(row)) return false
    if (!scheduleMatchesDateByMode(row, dateKey)) return false`

const newFieldScheduleReadBranchDirect = `    if (isFieldDayReminderSchedule(row)) return false
    if (isLeaveOrReturnSchedule(row) && !isFieldPublicDutySchedule(row)) return false
    if (!scheduleMatchesDateByMode(row, dateKey)) return false`

const oldRenderFieldScheduleCard = `function renderFieldScheduleCard(row) {
  if (typeof isFieldDayReminderSchedule === 'function' && isFieldDayReminderSchedule(row)) return ''
  const displayConfig = getScheduleCardDisplayConfig(row, 'field-calendar')`

const newRenderFieldScheduleCard = `function renderFieldScheduleCard(row) {
  if (typeof isFieldDayReminderSchedule === 'function' && isFieldDayReminderSchedule(row)) return ''
  // 1-3em：外務人員的公差外出只借用外務頁顯示資格，卡片仍使用原本公差外出樣式。
  if (typeof isFieldPublicDutySchedule === 'function' && isFieldPublicDutySchedule(row)) {
    return renderWeekScheduleCard(row, row.__occurrence_date || row.__render_date || row.start_date || '')
  }
  const displayConfig = getScheduleCardDisplayConfig(row, 'field-calendar')`

const oldSimpleFieldCardDecision = `function shouldUseSimpleFieldScheduleCard(row = {}) {
  if (typeof isFieldScheduleRow === 'function' && !isFieldScheduleRow(row)) return false
  if (typeof isFieldDayReminderSchedule === 'function' && isFieldDayReminderSchedule(row)) return false
  return true
}`

const newSimpleFieldCardDecision = `function shouldUseSimpleFieldScheduleCard(row = {}) {
  // 1-3em：公差外出雖可出現在外務頁，但不可轉成外務卡片樣式。
  if (typeof isFieldPublicDutySchedule === 'function' && isFieldPublicDutySchedule(row)) return false
  if (typeof isFieldScheduleRow === 'function' && !isFieldScheduleRow(row)) return false
  if (typeof isFieldDayReminderSchedule === 'function' && isFieldDayReminderSchedule(row)) return false
  return true
}`

const oldFieldColorDecision = `  if (typeof isFieldScheduleRow === 'function' && isFieldScheduleRow(colorRow)) return '外務行程'
  if (typeof isIncidentSchedule === 'function' && isIncidentSchedule(colorRow)) return '異況追蹤'`

const newFieldColorDecision = `  // 1-3em：公差外出保留原本公差外出顏色，不因出現在外務頁而變成外務橘色。
  if (typeof isFieldPublicDutySchedule === 'function' && isFieldPublicDutySchedule(colorRow)) return publicDutyLeaveMeetingType
  if (typeof isFieldScheduleRow === 'function' && isFieldScheduleRow(colorRow)) return '外務行程'
  if (typeof isIncidentSchedule === 'function' && isIncidentSchedule(colorRow)) return '異況追蹤'`

const forEPhase4CompatibilityPatch = {
  name: 'for-e-1-3em-field-public-duty-original-card-style',
  enforce: 'pre',
  transform(code, id) {
    if (!id.replaceAll('\\', '/').endsWith('/src/main.js')) return null

    let next = code
      .replace(/const APP_VERSION = 'V002-1H-stable-1-3e[a-z]'/, "const APP_VERSION = 'V002-1H-stable-1-3em'")
      .replace(/const OFFICIAL_VERSION = 'official-v002-1h-stable-1-3e[a-z]'/, "const OFFICIAL_VERSION = 'official-v002-1h-stable-1-3em'")
      .replaceAll('全部翻譯當周行程', '全部翻譯當週行程')
      .replace('翻譯池（翻譯、雙語人員、雙語舍監、宿管、PT）', '翻譯池（雙語人員、雙語舍監、宿管、PT）')
      .replace("  if (roleText === '翻譯') return true\n", '')
      .replace(
        'const normalizedTokens = [roleText, ...positionValues, departmentText]',
        'const normalizedTokens = positionValues'
      )

    if (!next.includes('function isFieldPublicDutySchedule(row = {})')) {
      next = next.replace(oldFieldScheduleRow, newFieldScheduleRow)
    }
    next = next
      .replace("const FIELD_PUBLIC_DUTY_DISPLAY_LOGIC_VERSION = '1-3ek'", "const FIELD_PUBLIC_DUTY_DISPLAY_LOGIC_VERSION = '1-3em'")
      .replace("const FIELD_PUBLIC_DUTY_DISPLAY_LOGIC_VERSION = '1-3el'", "const FIELD_PUBLIC_DUTY_DISPLAY_LOGIC_VERSION = '1-3em'")
      .replace(oldFieldScheduleReadBranch, newFieldScheduleReadBranch)
      .replace(oldFieldScheduleReadBranchDirect, newFieldScheduleReadBranchDirect)
      .replace(oldRenderFieldScheduleCard, newRenderFieldScheduleCard)
      .replace(oldSimpleFieldCardDecision, newSimpleFieldCardDecision)
      .replace(oldFieldColorDecision, newFieldColorDecision)

    if (!next.includes("const TRANSLATOR_WEEK_ROLE_FILTER_LOGIC_VERSION = '1-3ej'")) {
      next = next.replace(
        "const MOBILE_MONTH_OVERVIEW_LAYOUT_LOGIC_VERSION = '1-3ei'",
        "const MOBILE_MONTH_OVERVIEW_LAYOUT_LOGIC_VERSION = '1-3ei'\nconst TRANSLATOR_WEEK_ROLE_FILTER_LOGIC_VERSION = '1-3ej'"
      )
    }

    return { code: next, map: null }
  }
}

export default defineConfig({
  plugins: [forEPhase4CompatibilityPatch],
  server: {
    host: '0.0.0.0',
    port: 5173
  }
})
