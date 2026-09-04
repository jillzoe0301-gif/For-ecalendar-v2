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

const newFieldScheduleRow = `const FIELD_PUBLIC_DUTY_DISPLAY_LOGIC_VERSION = '1-3ep'

function isFieldPublicDutySchedule(row = {}) {
  if (!row) return false
  const categoryText = String(row.category || '').replace(/\\s+/g, '')
  if (categoryText !== '請假/會議/活動/外訓') return false
  const typeText = [row.sub_type, row.schedule_type, row.title]
    .filter(Boolean)
    .join('｜')
  return typeText.includes(publicDutyLeaveMeetingType)
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

// 1-3ep：外務行程類型與外務行程表顯示資格分離。
// 所有「公出」都會同步顯示在外務行程表，但不會套用任何外務行程設定。
function isFieldCalendarVisibleSchedule(row = {}) {
  return isFieldScheduleRow(row) || isFieldPublicDutySchedule(row)
}`

const oldRenderFieldScheduleCard = `function renderFieldScheduleCard(row) {
  if (typeof isFieldDayReminderSchedule === 'function' && isFieldDayReminderSchedule(row)) return ''
  const displayConfig = getScheduleCardDisplayConfig(row, 'field-calendar')`

const newRenderFieldScheduleCard = `function renderFieldScheduleCard(row) {
  if (typeof isFieldDayReminderSchedule === 'function' && isFieldDayReminderSchedule(row)) return ''
  // 1-3ep：公出只借用外務行程表顯示資格，卡片維持一般公出樣式與原標題。
  if (typeof isFieldPublicDutySchedule === 'function' && isFieldPublicDutySchedule(row)) {
    return renderWeekScheduleCard(row, row.__occurrence_date || row.__render_date || row.start_date || '')
  }
  const displayConfig = getScheduleCardDisplayConfig(row, 'field-calendar')`

const forEPhase4CompatibilityPatch = {
  name: 'for-e-1-3ep-public-duty-field-table-all',
  enforce: 'pre',
  transform(code, id) {
    if (!id.replaceAll('\\\\', '/').endsWith('/src/main.js')) return null

    let next = code
      .replace(/const APP_VERSION = 'V002-1H-stable-1-3e[a-z]'/, "const APP_VERSION = 'V002-1H-stable-1-3ep'")
      .replace(/const OFFICIAL_VERSION = 'official-v002-1h-stable-1-3e[a-z]'/, "const OFFICIAL_VERSION = 'official-v002-1h-stable-1-3ep'")
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
    } else {
      next = next
        .replace(/const FIELD_PUBLIC_DUTY_DISPLAY_LOGIC_VERSION = '1-3e[a-z]'/, "const FIELD_PUBLIC_DUTY_DISPLAY_LOGIC_VERSION = '1-3ep'")
        .replace(/function isFieldPublicDutySchedule\(row = \{\}\) \{[\s\S]*?\n\}/, `function isFieldPublicDutySchedule(row = {}) {
  if (!row) return false
  const categoryText = String(row.category || '').replace(/\\s+/g, '')
  if (categoryText !== '請假/會議/活動/外訓') return false
  const typeText = [row.sub_type, row.schedule_type, row.title]
    .filter(Boolean)
    .join('｜')
  return typeText.includes(publicDutyLeaveMeetingType)
}`)
    }

    next = next
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
