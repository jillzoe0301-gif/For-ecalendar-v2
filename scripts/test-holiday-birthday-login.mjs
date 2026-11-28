import assert from 'node:assert/strict'
import fs from 'node:fs'
import vm from 'node:vm'
import { HOLIDAY_COUNTRIES, getHolidayEntries, renderHolidayLabels, renderHolidayDetails } from '../src/holiday-calendar.js'
const countryCodes = date => [...new Set(getHolidayEntries(date).map(entry => entry.code))]
assert.deepEqual(countryCodes('2027-01-01'), HOLIDAY_COUNTRIES.map(x => x.code))
assert.deepEqual(countryCodes('2026-12-25'), ['tw','id','ph'])
assert.deepEqual(countryCodes('2026-12-31'), ['ph','th'])
assert.deepEqual(countryCodes('2027-12-31'), ['tw','ph','th'])
assert(getHolidayEntries('2027-02-09').some(x => x.code === 'tw' && x.holiday.includes('補假')))
assert(getHolidayEntries('2027-07-27').some(x => x.code === 'vn'))
assert(getHolidayEntries('2026-11-24').some(x => x.code === 'vn'))
assert(!getHolidayEntries('2027-03-10').some(x => x.code === 'ph')) // PH Eid date not yet proclaimed
assert.equal(getHolidayEntries('2028-01-01').length, 0)
for (const year of [2026, 2027]) {
  const entries = Array.from({length:365}, (_, i) => new Date(Date.UTC(year,0,i+1)).toISOString().slice(0,10)).flatMap(getHolidayEntries)
  assert(HOLIDAY_COUNTRIES.every(x => entries.filter(y=>y.code===x.code).length>=13))
}
const five = renderHolidayLabels('2027-01-01')
assert.equal((five.match(/class="for-e-holiday-country hc-/g)||[]).length, 5)
assert.match(renderHolidayLabels('2027-01-04'), /aria-hidden="true"/)
assert(!renderHolidayLabels('2027-01-04').includes('data-holiday-date'))
assert.equal((renderHolidayDetails('2027-01-01').match(/class="for-e-holiday-detail-row"/g)||[]).length, 5)
assert(renderHolidayDetails('2026-12-25').includes('行憲紀念日'))
assert.equal(renderHolidayDetails('2027-01-04'), '')
const source=fs.readFileSync(new URL('../src/main.js',import.meta.url),'utf8')
const take=(a,b)=>source.slice(source.indexOf(a),source.indexOf(b,source.indexOf(a)))
const ctx=vm.createContext({escapeHtml:x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])),renderBirthdayGiftIcon:()=>'<img alt="">',todayString:()=> '2026-11-29',currentProfile:{staff_id:'self',name:'自己'},canViewBirthdayWishesForStaff:staff=>staff.staff_id==='self',birthdayWishesError:null,getBirthdayWishRows:()=>[{sender_name:'同仁',message:'私人祝福',created_at:'2026-11-29T09:00:00'}]})
vm.runInContext(take('function renderBirthdayGreetingCard(', 'function getCurrentBirthdayStaffRow('),ctx)
vm.runInContext(take('const quickBirthdayGreetings = [','function openBirthdayWishModal('),ctx)
const anonymous=ctx.renderLoginBirthdayReminderSection([{name:'不能顯示的名字',department_name:'不能顯示的部門',staff_id:'private-id'}])
assert(anonymous.includes('今天有 1 位同仁生日'))
assert(!anonymous.includes('不能顯示')&&!anonymous.includes('private-id'))
const self=ctx.renderBirthdayGreetingCard(true,0,'自己')
assert(self.includes('生日快樂，自己！'))
assert.equal(ctx.renderBirthdayWishRows({staff_id:'other'}),'')
assert(ctx.renderBirthdayWishRows({staff_id:'self'}).includes('私人祝福'))
const form=ctx.renderBirthdayWishForm({staff_id:'other'},'2026-11-29',true)
assert(form.includes('for-e-birthday-single-form') && form.includes('data-birthday-template="2"') && form.includes('maxlength="300"'))
assert.equal(ctx.renderBirthdayWishForm({staff_id:'self'}),'')
assert.deepEqual(vm.runInContext('quickBirthdayGreetings.map(x=>x[1].length>25&&x[1].length<=300).every(Boolean)',ctx),true)
console.log('Holiday dates, date chips, birthday anonymity, private wishes, and greeting templates passed.')
