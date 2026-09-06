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
  const categoryText = String(row.category || '').replace(/\s+/g, '')
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
  name: 'for-e-1-3eq-public-duty-field-table-all',
  enforce: 'pre',
  transform(code, id) {
    if (!id.replaceAll('\\', '/').endsWith('/src/main.js')) return null

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
  const categoryText = String(row.category || '').replace(/\s+/g, '')
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

const forEReportRangePatch = {
  name: 'for-e-1-3eq-report-range-filters',
  enforce: 'post',
  transform(code, id) {
    if (!id.replaceAll('\\', '/').endsWith('/src/main.js')) return null

    let next = code
      .replace(/const APP_VERSION = 'V002-1H-stable-1-3e[a-z]'/, "const APP_VERSION = 'V002-1H-stable-1-3eq'")
      .replace(/const OFFICIAL_VERSION = 'official-v002-1h-stable-1-3e[a-z]'/, "const OFFICIAL_VERSION = 'official-v002-1h-stable-1-3eq'")

    if (!next.includes("const DATE_RANGE_REPORT_FILTER_LOGIC_VERSION = '1-3eq'")) {
      next = next.replace(
        "const STATS_TRANSLATOR_ONLY_LOGIC_VERSION = '1-3ec'",
        "const STATS_TRANSLATOR_ONLY_LOGIC_VERSION = '1-3ec'\nconst DATE_RANGE_REPORT_FILTER_LOGIC_VERSION = '1-3eq'"
      )
    }

    next = next.replace(
      /let statsFilters = \{[\s\S]*?\n\}\n\nlet serviceRecordFilters = \{[\s\S]*?\n\}/,
`let statsFilters = {
  period: '月份',
  monthValue: todayString().slice(0, 7),
  yearValue: todayString().slice(0, 4),
  startDate: '',
  endDate: '',
  department: '全部',
  staffId: '全部',
  category: '全部'
}

let serviceRecordFilters = {
  period: '月份',
  monthValue: todayString().slice(0, 7),
  yearValue: todayString().slice(0, 4),
  status: '全部',
  staffId: '全部',
  department: '全部',
  scheduleType: '全部',
  keyword: '',
  startDate: '',
  endDate: ''
}`)

    next = next.replace(
      /function getStatsScheduleLoadOptions\(\) \{[\s\S]*?\n\}\n\nfunction getScheduleLoadOptionsForPage/,
`function getStatsScheduleLoadOptions() {
  const range = getStatsDateRange()
  if (range.start && range.end) return { scope: \`stats-\${statsFilters.period || 'range'}\`, dateStart: range.start, dateEnd: range.end }
  return getPersonalPageScheduleLoadOptions('stats')
}

function getServiceRecordDateRange() {
  const today = todayString()
  const period = String(serviceRecordFilters.period || '月份')
  if (period === '月份') {
    const month = /^\\d{4}-\\d{2}$/.test(serviceRecordFilters.monthValue || '') ? serviceRecordFilters.monthValue : today.slice(0, 7)
    return { start: \`\${month}-01\`, end: getMonthLastDay(\`\${month}-01\`), label: \`\${month} 月份\` }
  }
  if (period === '年份') {
    const year = /^\\d{4}$/.test(serviceRecordFilters.yearValue || '') ? serviceRecordFilters.yearValue : today.slice(0, 4)
    return { start: \`\${year}-01-01\`, end: \`\${year}-12-31\`, label: \`\${year} 年\` }
  }
  if (period === '自訂') {
    return {
      start: serviceRecordFilters.startDate || '',
      end: serviceRecordFilters.endDate || '',
      label: \`\${serviceRecordFilters.startDate || '不限起日'} ～ \${serviceRecordFilters.endDate || '不限迄日'}\`
    }
  }
  return { start: '', end: '', label: '全部期間' }
}

function getServiceRecordScheduleLoadOptions() {
  const range = getServiceRecordDateRange()
  if (range.start && range.end) return { scope: \`service-record-\${serviceRecordFilters.period || 'range'}\`, dateStart: range.start, dateEnd: range.end }
  return getPersonalPageScheduleLoadOptions('service-record')
}

function getScheduleLoadOptionsForPage`)

    next = next.replace(
      "  if (pageKey === 'stats') return getStatsScheduleLoadOptions()\n  return null",
      "  if (pageKey === 'stats') return getStatsScheduleLoadOptions()\n  if (pageKey === 'serviceRecord' || pageKey === 'recordSubmit') return getServiceRecordScheduleLoadOptions()\n  return null"
    )

    next = next.replace(
      /async function loadServiceRecords\(\) \{[\s\S]*?serviceRecordsLoading = false\n\}/,
`async function loadServiceRecords() {
  serviceRecordsLoading = true
  serviceRecordsError = ''

  let query = supabase
    .from('service_records')
    .select('*')
    .order('schedule_date', { ascending: false })

  if (currentPage === 'serviceRecord' || currentPage === 'recordSubmit') {
    const range = getServiceRecordDateRange()
    if (range.start) query = query.gte('schedule_date', range.start)
    if (range.end) query = query.lte('schedule_date', range.end)
  } else {
    query = query.limit(2000)
  }

  const { data, error } = await query

  if (error) {
    console.error(error)
    serviceRecords = []
    serviceRecordsError = error.message
  } else {
    serviceRecords = data || []
  }

  serviceRecordsLoading = false
}`)

    next = next.replace(
      /serviceRecordFilters = \{\n        status: '全部',[\s\S]*?endDate: ''\n      \}\n      renderApp\(\)/,
`serviceRecordFilters = {
        period: '月份',
        monthValue: todayString().slice(0, 7),
        yearValue: todayString().slice(0, 4),
        status: '全部',
        staffId: '全部',
        department: '全部',
        scheduleType: '全部',
        keyword: '',
        startDate: '',
        endDate: ''
      }
      loadServiceRecords().then(() => renderAppAndEnsurePageData(currentPage))`)

    next = next.replace(
      /serviceRecordFilterForm\.addEventListener\('submit', event => \{[\s\S]*?\n      renderApp\(\)\n    \}\)/,
`serviceRecordFilterForm.addEventListener('submit', async event => {
      event.preventDefault()
      const form = new FormData(event.target)
      serviceRecordFilters = {
        period: form.get('period') || '月份',
        monthValue: form.get('monthValue') || todayString().slice(0, 7),
        yearValue: form.get('yearValue') || todayString().slice(0, 4),
        status: form.get('status') || '全部',
        staffId: form.get('staffId') || '全部',
        department: form.get('department') || '全部',
        scheduleType: form.get('scheduleType') || '全部',
        keyword: form.get('keyword') || '',
        startDate: form.get('startDate') || '',
        endDate: form.get('endDate') || ''
      }
      await loadServiceRecords()
      await renderAppAndEnsurePageData(currentPage)
    })`)

    next = next.replace(
      /statsFilters = \{\n        period: form\.get\('period'\) \|\| '當月',[\s\S]*?category: form\.get\('category'\) \|\| '全部'\n      \}\n      renderApp\(\)/,
`statsFilters = {
        period: form.get('period') || '月份',
        monthValue: form.get('monthValue') || todayString().slice(0, 7),
        yearValue: form.get('yearValue') || todayString().slice(0, 4),
        startDate: form.get('startDate') || '',
        endDate: form.get('endDate') || '',
        department: form.get('department') || '全部',
        staffId: form.get('staffId') || '全部',
        category: form.get('category') || '全部'
      }
      renderAppAndEnsurePageData('stats')`)

    next = next.replace(
      /statsFilters = \{\n        period: '當月',[\s\S]*?category: '全部'\n      \}\n      renderApp\(\)/,
`statsFilters = {
        period: '月份',
        monthValue: todayString().slice(0, 7),
        yearValue: todayString().slice(0, 4),
        startDate: '',
        endDate: '',
        department: '全部',
        staffId: '全部',
        category: '全部'
      }
      renderAppAndEnsurePageData('stats')`)

    next = next.replace(
      /function getStatsDateRange\(\) \{[\s\S]*?\n\}\n\nconst STATS_EXCLUDED_SCHEDULE_TYPE_NAMES/,
`function getStatsDateRange() {
  const today = todayString()
  const period = String(statsFilters.period || '月份')
  if (period === '月份') {
    const month = /^\\d{4}-\\d{2}$/.test(statsFilters.monthValue || '') ? statsFilters.monthValue : today.slice(0, 7)
    return { start: \`\${month}-01\`, end: getMonthLastDay(\`\${month}-01\`), label: \`\${month} 月份\` }
  }
  if (period === '年份') {
    const year = /^\\d{4}$/.test(statsFilters.yearValue || '') ? statsFilters.yearValue : today.slice(0, 4)
    return { start: \`\${year}-01-01\`, end: \`\${year}-12-31\`, label: \`\${year} 年\` }
  }
  return {
    start: statsFilters.startDate || '',
    end: statsFilters.endDate || '',
    label: \`\${statsFilters.startDate || '不限起日'} ～ \${statsFilters.endDate || '不限迄日'}\`
  }
}

const STATS_EXCLUDED_SCHEDULE_TYPE_NAMES`)

    next = next.replace(
      /function renderStatsFilterForm\(\) \{[\s\S]*?\n\}\n\nfunction renderStatsMetricCards/,
`function getReportYearOptions(selectedYear = todayString().slice(0, 4)) {
  const currentYear = Number(todayString().slice(0, 4))
  const years = []
  for (let year = currentYear + 1; year >= currentYear - 8; year -= 1) years.push(String(year))
  if (selectedYear && !years.includes(String(selectedYear))) years.push(String(selectedYear))
  return [...new Set(years)].sort((a, b) => Number(b) - Number(a))
    .map(year => \`<option value="\${year}" \${String(selectedYear) === year ? 'selected' : ''}>\${year}年</option>\`)
    .join('')
}

function renderStatsFilterForm() {
  const periodOptions = ['月份', '年份', '自訂']
    .map(item => \`<option value="\${item}" \${statsFilters.period === item ? 'selected' : ''}>\${item}</option>\`)
    .join('')
  const departmentOptions = buildServiceRecordOptionList(getStatsDepartmentOptions(), statsFilters.department)
  const categoryOptions = buildServiceRecordOptionList(getStatsCategoryOptions(), statsFilters.category)

  return \`
    <form id="statsFilterForm" class="stats-filter-panel clean-stats-filter">
      <label>查看方式<select name="period">\${periodOptions}</select></label>
      <label>月份<input name="monthValue" type="month" value="\${statsFilters.monthValue || todayString().slice(0, 7)}"></label>
      <label>年份<select name="yearValue">\${getReportYearOptions(statsFilters.yearValue)}</select></label>
      <label>起日<input name="startDate" type="date" value="\${statsFilters.startDate}"></label>
      <label>迄日<input name="endDate" type="date" value="\${statsFilters.endDate}"></label>
      <label>部門<select name="department">\${departmentOptions}</select></label>
      <label>翻譯人員<select name="staffId">\${getStatsStaffOptionsHtml()}</select></label>
      <label>行程類型<select name="category">\${categoryOptions}</select></label>
      <button type="submit" class="primary-btn">套用統計</button>
    </form>
  \`
}

function renderStatsMetricCards`)

    next = next.replace(
      "  if (serviceRecordFilters.startDate && record.schedule_date < serviceRecordFilters.startDate) return false\n  if (serviceRecordFilters.endDate && record.schedule_date > serviceRecordFilters.endDate) return false",
      "  const range = getServiceRecordDateRange()\n  if (range.start && record.schedule_date < range.start) return false\n  if (range.end && record.schedule_date > range.end) return false"
    )

    next = next.replace(
      /  return `\n    <form id="serviceRecordFilterForm" class="service-record-filter service-record-filter-upgraded">\n      <label>\n        狀態/,
`  const periodOptions = ['月份', '年份', '自訂', '全部']
    .map(item => \`<option value="\${item}" \${serviceRecordFilters.period === item ? 'selected' : ''}>\${item}</option>\`)
    .join('')

  return \`
    <form id="serviceRecordFilterForm" class="service-record-filter service-record-filter-upgraded">
      <label>查看方式<select name="period">\${periodOptions}</select></label>
      <label>月份<input name="monthValue" type="month" value="\${serviceRecordFilters.monthValue || todayString().slice(0, 7)}"></label>
      <label>年份<select name="yearValue">\${getReportYearOptions(serviceRecordFilters.yearValue)}</select></label>
      <label>
        狀態`)

    next = next.replace(
      "    \${renderServiceRecordPersonSplitStatusV3(records)}\n    \${renderServiceRecordDepartmentSplitStatusV3(records)}",
      "    \${renderServiceRecordUnifiedStatus(records)}"
    )

    if (!next.includes('function renderServiceRecordUnifiedStatus(records)')) {
      next = next.replace(
        '\nfunction renderServiceRecordDashboard() {',
`\nfunction renderServiceRecordUnifiedStatus(records) {
  const range = getServiceRecordDateRange()
  const personRows = summarizeServiceRecordRows(
    records,
    record => record.staff_id || record.staff_name || '未指定',
    record => record.staff_name || '-'
  )
  const departmentRows = summarizeServiceRecordDepartmentGroupRows(records)
  return \`
    \${renderServiceRecordSimplePeriodTable('全部繳交狀況－人員', range.label, personRows, '人員')}
    \${renderServiceRecordSimplePeriodTable('全部繳交狀況－部門', range.label, departmentRows, '部門')}
  \`
}

function renderServiceRecordDashboard() {`)
    }

    next = next.replace(
      '<strong>\${monthlyRows.length}</strong>\n        <span>本月紀錄</span>',
      '<strong>\${records.length}</strong>\n        <span>查詢範圍</span>'
    )

    return { code: next, map: null }
  }
}

export default defineConfig({
  plugins: [forEPhase4CompatibilityPatch, forEReportRangePatch],
  server: {
    host: '0.0.0.0',
    port: 5173
  }
})
