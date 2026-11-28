// 2026–2027 national and officially published substitute holidays. Overseas
// government/collective leave is explicitly named; it does not change Taiwan workdays.
// Sources: see docs/holiday-calendar-2026-2027.md.
export const HOLIDAY_COUNTRIES = [
  { code: 'tw', short: '台', name: '台灣' },
  { code: 'vn', short: '越', name: '越南' },
  { code: 'id', short: '印', name: '印尼' },
  { code: 'ph', short: '菲', name: '菲律賓' },
  { code: 'th', short: '泰', name: '泰國' }
]
const dates = {
  2026: {
    tw: [
      ['01-01','元旦'],['02-15','小年夜'],['02-16','除夕'],['02-17 02-18 02-19','春節'],['02-20','春節補假'],
      ['02-27','和平紀念日補假'],['02-28','和平紀念日'],['04-03','兒童節補假'],['04-04','兒童節'],['04-05','清明節'],['04-06','清明節補假'],['05-01','勞動節'],['06-19','端午節'],['09-25','中秋節'],['09-28','教師節'],['10-09','國慶日補假'],['10-10','國慶日'],['10-25','臺灣光復暨金門古寧頭大捷紀念日'],['10-26','臺灣光復紀念日補假'],['12-25','行憲紀念日']
    ],
    vn: [
      ['01-01','元旦'],['01-02','元旦調整休假（政府機關）'],['02-16 02-17 02-18 02-19 02-20','春節假期（政府機關）'],['04-26','雄王祭祖日'],['04-27','雄王祭祖日補假'],['04-30','統一日'],['05-01','勞動節'],['08-31','國慶調整休假（政府機關）'],['09-01 09-02','國慶日'],['11-24','越南文化日']
    ],
    id: [
      ['01-01','元旦'],['01-16','先知登霄節'],['02-16','農曆新年共同休假'],['02-17','農曆新年'],['03-18','寧靜日共同休假'],['03-19','寧靜日'],['03-20 03-23 03-24','開齋節共同休假'],['03-21 03-22','開齋節'],['04-03','耶穌受難日'],['04-05','復活節'],['05-01','勞動節'],['05-14','耶穌升天日'],['05-15','耶穌升天日共同休假'],['05-27','古爾邦節'],['05-28','古爾邦節共同休假'],['05-31','衛塞節'],['06-01','建國五項原則日'],['06-16','伊斯蘭新年'],['08-17','獨立日'],['08-25','先知誕辰'],['12-24','聖誕節共同休假'],['12-25','聖誕節']
    ],
    ph: [
      ['01-01','元旦'],['02-17','農曆新年'],['03-20','開齋節'],['04-02','聖週四'],['04-03','耶穌受難日'],['04-04','聖週六'],['04-09','勇士節'],['05-01','勞動節'],['05-27','古爾邦節'],['06-12','獨立日'],['08-21','尼諾·阿基諾紀念日'],['08-31','國家英雄日'],['11-01','諸聖節'],['11-02','追思亡者日'],['11-30','博尼法西奧日'],['12-08','聖母無原罪日'],['12-24','平安夜'],['12-25','聖誕節'],['12-30','黎剎日'],['12-31','跨年假日']
    ],
    th: [
      ['01-01','元旦'],['01-02','元旦特別休假'],['03-03','萬佛節'],['04-06','查克里王朝紀念日'],['04-13 04-14 04-15','宋干節'],['05-01','勞動節'],['05-04','加冕紀念日'],['05-31','衛塞節'],['06-01','衛塞節補假'],['06-03','王后誕辰'],['07-28','國王誕辰'],['07-29','三寶佛節'],['07-30','守夏節'],['08-12','母親節'],['10-13','蒲美蓬紀念日'],['10-23','朱拉隆功紀念日'],['12-05','國慶暨父親節'],['12-07','國慶暨父親節補假'],['12-10','憲法日'],['12-16','王太后國葬特別休假'],['12-31','跨年假日']
    ]
  },
  2027: {
    tw: [
      ['01-01','元旦'],['02-04','小年夜'],['02-05','除夕'],['02-06 02-07 02-08','春節'],['02-09 02-10','春節補假'],['02-28','和平紀念日'],['03-01','和平紀念日補假'],['04-04','兒童節'],['04-05','清明節'],['04-06','兒童節補假'],['04-30','勞動節補假'],['05-01','勞動節'],['06-09','端午節'],['09-15','中秋節'],['09-28','教師節'],['10-10','國慶日'],['10-11','國慶日補假'],['10-25','臺灣光復暨金門古寧頭大捷紀念日'],['12-24','行憲紀念日補假'],['12-25','行憲紀念日'],['12-31','2028年元旦補假']
    ],
    vn: [
      ['01-01','元旦'],['02-04 02-05 02-06 02-07 02-08 02-09 02-10','春節假期（政府機關）'],['04-16','雄王祭祖日'],['04-30','統一日'],['05-01','勞動節'],['05-03','勞動節補假'],['07-27','傷殘軍人暨烈士紀念日'],['09-02 09-03','國慶日'],['11-24','越南文化日']
    ],
    id: [
      ['01-01','元旦'],['01-05','先知登霄節'],['02-05','農曆新年共同休假'],['02-06','農曆新年'],['03-08','寧靜日'],['03-09 03-12 03-15','開齋節共同休假'],['03-10 03-11','開齋節'],['03-25','耶穌受難日共同休假'],['03-26','耶穌受難日'],['03-28','復活節'],['05-01','勞動節'],['05-06','耶穌升天日'],['05-17','古爾邦節'],['05-18','古爾邦節共同休假'],['05-19','衛塞節共同休假'],['05-20','衛塞節'],['06-01','建國五項原則日'],['06-06','伊斯蘭新年'],['08-15','先知誕辰'],['08-17','獨立日'],['12-24','聖誕節共同休假'],['12-25','聖誕節'],['12-26','先知登霄節']
    ],
    // Philippine Eid dates are proclaimed separately; do not mark an unannounced date as a confirmed holiday.
    ph: [
      ['01-01','元旦'],['02-06','農曆新年'],['03-25','聖週四'],['03-26','耶穌受難日'],['03-27','聖週六'],['04-09','勇士節'],['05-01','勞動節'],['06-12','獨立日'],['08-21','尼諾·阿基諾紀念日'],['08-30','國家英雄日'],['11-01','諸聖節'],['11-02','追思亡者日'],['11-30','博尼法西奧日'],['12-08','聖母無原罪日'],['12-24','平安夜'],['12-25','聖誕節'],['12-30','黎剎日'],['12-31','跨年假日']
    ],
    th: [
      ['01-01','元旦'],['02-21','萬佛節'],['02-22','萬佛節補假'],['04-06','查克里王朝紀念日'],['04-13 04-14 04-15','宋干節'],['05-01','勞動節'],['05-03','勞動節補假'],['05-04','加冕紀念日'],['05-20','衛塞節'],['06-03','王后誕辰'],['07-18','三寶佛節'],['07-19','三寶佛節補假（銀行）'],['07-19','守夏節'],['07-20','三寶佛節補假（部分機關）'],['07-28','國王誕辰'],['08-12','母親節'],['10-13','蒲美蓬紀念日'],['10-23','朱拉隆功紀念日'],['10-25','朱拉隆功紀念日補假'],['12-05','國慶暨父親節'],['12-06','國慶暨父親節補假'],['12-10','憲法日'],['12-31','跨年假日']
    ]
  }
}
const index = new Map()
for (const [year, countries] of Object.entries(dates)) {
  for (const country of HOLIDAY_COUNTRIES) {
    for (const [dayKeys, name] of countries[country.code] || []) {
      for (const day of dayKeys.split(' ')) {
        const date = `${year}-${day}`
        if (!index.has(date)) index.set(date, [])
        const entries = index.get(date)
        if (!entries.some(row => row.code === country.code && row.holiday === name)) entries.push({ ...country, holiday: name })
      }
    }
  }
}
export function getHolidayEntries(dateKey) { return index.get(String(dateKey)) || [] }
const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]))
export function renderHolidayLabels(dateKey) {
  const entries = getHolidayEntries(dateKey)
  if (!entries.length) return '<div class="holiday-labels for-e-holiday-slot" aria-hidden="true"></div>'
  const countries = HOLIDAY_COUNTRIES.filter(country => entries.some(row => row.code === country.code))
  return `<div class="holiday-labels for-e-holiday-slot"><button type="button" class="for-e-holiday-trigger" data-holiday-date="${escape(dateKey)}" aria-label="查看${escape(dateKey)}國定假日（${countries.length}國）"><span class="for-e-holiday-caption">國定假日</span><span class="for-e-holiday-countries">${countries.map(c => `<span class="for-e-holiday-country hc-${c.code}">${c.short}</span>`).join('')}</span><span class="for-e-holiday-arrow" aria-hidden="true">›</span></button></div>`
}
export function renderHolidayDetails(dateKey) {
  const rows = getHolidayEntries(dateKey)
  if (!rows.length) return ''
  const countries = new Set(rows.map(row => row.code)).size
  const day = ['日','一','二','三','四','五','六'][new Date(`${dateKey}T12:00:00Z`).getUTCDay()]
  return `<div class="modal-panel for-e-holiday-dialog" role="dialog" aria-modal="true" aria-label="國定假日"><div class="modal-header"><h3>${escape(dateKey.replaceAll('-','/'))}（${day}）</h3><button type="button" class="icon-btn" data-holiday-close aria-label="關閉">×</button></div><div class="for-e-holiday-details"><p>國定假日｜共 ${countries} 國</p>${rows.map(row => `<div class="for-e-holiday-detail-row"><strong class="hc-${row.code}">${row.name}</strong><span>${escape(row.holiday)}</span></div>`).join('')}</div><div class="modal-actions"><button type="button" class="primary-btn" data-holiday-close>關閉</button></div></div>`
}
export function bindHolidayDetails() {
  document.addEventListener('click', event => {
    const trigger = event.target.closest?.('[data-holiday-date]')
    if (!trigger) return
    const html = renderHolidayDetails(trigger.dataset.holidayDate)
    if (!html) return
    event.preventDefault(); event.stopPropagation()
    document.querySelector('.for-e-holiday-backdrop')?.remove()
    const backdrop = document.createElement('div')
    backdrop.className = 'modal-backdrop for-e-holiday-backdrop'
    backdrop.innerHTML = html
    document.body.append(backdrop)
    const close = () => { backdrop.remove(); document.removeEventListener('keydown', onKey); if (trigger.isConnected) trigger.focus({preventScroll:true}) }
    const onKey = e => { if (e.key === 'Escape' && backdrop.isConnected) { e.stopPropagation(); close() } }
    backdrop.addEventListener('click', e => { if (e.target === backdrop || e.target.closest('[data-holiday-close]')) close() })
    document.addEventListener('keydown', onKey)
    backdrop.querySelector('[data-holiday-close]')?.focus({preventScroll:true})
  })
}
