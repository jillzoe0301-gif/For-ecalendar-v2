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

const newFieldScheduleRow = `const FIELD_PUBLIC_DUTY_DISPLAY_LOGIC_VERSION = '1-3eo'

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

// 1-3eo：外務行程類型與外務行程表顯示資格分離。
// 公出只取得外務行程表顯示資格，不會套用外務顏色、badge、完成或修改規則。
function isFieldCalendarVisibleSchedule(row = {}) {
  return isFieldScheduleRow(row) || isFieldPublicDutySchedule(row)
}`

const oldRenderFieldScheduleCard = `function renderFieldScheduleCard(row) {
  if (typeof isFieldDayReminderSchedule === 'function' && isFieldDayReminderSchedule(row)) return ''
  const displayConfig = getScheduleCardDisplayConfig(row, 'field-calendar')`

const newRenderFieldScheduleCard = `function renderFieldScheduleCard(row) {
  if (typeof isFieldDayReminderSchedule === 'function' && isFieldDayReminderSchedule(row)) return ''
  // 1-3eo：公出只顯示在外務行程表，卡片仍使用一般公出樣式與原標題。
  if (typeof isFieldPublicDutySchedule === 'function' && isFieldPublicDutySchedule(row)) {
    return renderWeekScheduleCard(row, row.__occurrence_date || row.__render_date || row.start_date || '')
  }
  const displayConfig = getScheduleCardDisplayConfig(row, 'field-calendar')`

const forEPhase4CompatibilityPatch = {
  name: 'for-e-1-3eo-public-duty-field-table-only',
  enforce: 'pre',
  transform(code, id) {
    if (!id.replaceAll('\\', '/').endsWith('/src/main.js')) return null

    let next = code
      .replace(/const APP_VERSION = 'V002-1H-stable-1-3e[a-z]'/, "const APP_VERSION = 'V002-1H-stable-1-3eo'")
      .replace(/const OFFICIAL_VERSION = 'official-v002-1h-stable-1-3e[a-z]'/, "const OFFICIAL_VERSION = 'official-v002-1h-stable-1-3eo'")
      .replaceAll('公差外出', '公出')
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
      .replace(/const FIELD_PUBLIC_DUTY_DISPLAY_LOGIC_VERSION = '1-3e[a-z]'/, "const FIELD_PUBLIC_DUTY_DISPLAY_LOGIC_VERSION = '1-3eo'")
      .replaceAll('if (!isFieldScheduleRow(row)) return false', 'if (!isFieldCalendarVisibleSchedule(row)) return false')
      .replaceAll('.filter(row => isFieldScheduleRow(row))', '.filter(row => isFieldCalendarVisibleSchedule(row))')
      .replace(oldRenderFieldScheduleCard, newRenderFieldScheduleCard)

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
