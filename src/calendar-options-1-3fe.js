import { getHolidayEntries } from './holiday-calendar.js';
// Presentation-only enhancement. Original handlers and data storage remain untouched.
const mobile = matchMedia('(max-width: 768px), (pointer: coarse)');
const css = `
#app .for-e-menu-removed, .sidebar .for-e-menu-removed, .mobile-nav .for-e-menu-removed { display:none!important; }
.for-e-option-hidden { display:none!important; }
.option-management-form .for-e-option-tabs { display:flex; flex-wrap:wrap; gap:8px; padding:12px; background:#f4f6fa; border-radius:14px; }
.for-e-option-tabs button { padding:10px 14px; background:white; color:#42536e; border:1px solid #dce2ee; }
.for-e-option-tabs button[aria-pressed="true"] { color:white; background:#5170ff; border-color:#5170ff; }
.option-management-form .option-group-body { grid-template-columns:minmax(0,1fr)!important; }
.option-management-form .option-line-list { max-height:none!important; overflow:visible!important; }
.option-management-form .option-edit-box { min-width:0; }
.option-management-form .option-form-actions { position:sticky; bottom:0; background:white; padding:12px; z-index:5; }
.for-e-name-band { display:none!important; }
@media (max-width:768px), (pointer:coarse) {
  #app table.for-e-horizontal-names > thead > tr > .for-e-original-name,
  #app table.for-e-horizontal-names > tbody > tr > .for-e-original-name,
  #app table.for-e-horizontal-names > colgroup > .for-e-original-name {
    display:none!important;
  }
  #app table.for-e-horizontal-names > tbody > tr.for-e-name-band {
    display:table-row!important;
    height:auto!important;
    min-height:0!important;
  }
  #app table.for-e-horizontal-names > tbody > tr.for-e-name-band > td.for-e-name-band-cell {
    display:table-cell!important;
    position:static!important;
    width:auto!important;
    min-width:0!important;
    max-width:none!important;
    height:auto!important;
    min-height:0!important;
    padding:6px 8px!important;
    background:#eaf0f7!important;
    border:1px solid #d6dce7!important;
    box-shadow:none!important;
    text-align:left!important;
    overflow:visible!important;
    vertical-align:middle!important;
  }
  #app table.for-e-horizontal-names .for-e-name-band-content {
    position:sticky!important;
    left:8px!important;
    display:inline-flex!important;
    align-items:center!important;
    gap:9px!important;
    width:max-content!important;
    max-width:calc(100vw - 32px)!important;
    white-space:nowrap!important;
    line-height:1.25!important;
  }
  #app table.for-e-horizontal-names .for-e-name-pill {
    display:inline-block!important;
    background:#526783!important;
    color:#fff!important;
    border-radius:999px!important;
    font-size:13px!important;
    font-weight:750!important;
    padding:4px 12px!important;
  }
  #app table.for-e-horizontal-names .for-e-name-department {
    color:#64748b!important;
    font-size:12px!important;
    font-weight:500!important;
  }
}

@media (max-width:768px), (pointer:coarse) {
  html body:not(.force-desktop-mode) .mobile-nav {
    display:flex!important; gap:0!important; padding-inline:4px!important;
    justify-content:space-evenly!important; overflow-x:hidden!important;
    box-sizing:border-box!important;
  }
  html body:not(.force-desktop-mode) .mobile-nav > button:not(.for-e-menu-removed),
  html body:not(.force-desktop-mode) .mobile-nav > a:not(.for-e-menu-removed) {
    flex:1 1 0!important; min-width:0!important; width:0!important; max-width:none!important;
    margin:0!important; padding-inline:2px!important;
  }
  html body:not(.force-desktop-mode) .mobile-nav .mobile-menu-label {
    white-space:nowrap!important; font-size:clamp(10px,2.8vw,13px)!important;
  }
  html body:not(.force-desktop-mode) .mobile-nav .for-e-menu-removed { display:none!important; }
  html body:not(.force-desktop-mode) .for-e-filter-toggle {
    display:flex!important; align-items:center; justify-content:space-between;
    width:100%; padding:12px 15px; margin:8px 0; border:1px solid #dbe3f0;
    border-radius:13px; background:#f7f9fc; color:#344563; font-size:14px;
  }
  html body:not(.force-desktop-mode) .for-e-filter-collapsed { display:none!important; }
  html body:not(.force-desktop-mode) .overview-filter-summary,
  html body:not(.force-desktop-mode) .overview-quick-group-title span { display:none!important; }
  #app table.for-e-horizontal-names .for-e-band-field-badge {
    display:inline-flex!important; align-items:center; justify-content:center;
    background:#ffe5c7!important; color:#a95010!important; border:1px solid #f3b46d;
    border-radius:999px!important; font-size:12px!important; font-weight:800!important;
    min-width:24px; height:24px; padding:0 5px;
  }
  #app table.for-e-horizontal-names .for-e-band-field-badge[hidden] { display:none!important; }
}
.for-e-filter-toggle { display:none; }

.for-e-zoom-toolbar{display:none;}
@media (max-width:768px), (pointer:coarse){
 body:not(.force-desktop-mode) .for-e-zoom-toolbar{display:grid!important;gap:7px;margin:8px 0;padding:9px;border:1px solid #dbe3f0;border-radius:12px;background:#f8fafc;}
 .for-e-zoom-toolbar .for-e-zoom-modes,.for-e-zoom-toolbar .for-e-zoom-controls{display:flex;gap:6px;align-items:center;}
 .for-e-zoom-toolbar button{padding:8px 10px;min-height:36px;background:#e8edf7;color:#344563;white-space:nowrap;}
 .for-e-zoom-toolbar .for-e-zoom-modes button{flex:1;}
 .for-e-zoom-toolbar button[aria-pressed="true"]{background:#5170ff;color:white;}
 .for-e-zoom-toolbar input[type="range"]{flex:1;min-width:0;width:auto;height:28px;padding:0;}
 .for-e-zoom-toolbar output{min-width:45px;text-align:center;font-size:12px;color:#344563;font-weight:700;}
 .for-e-zoom-toolbar .for-e-zoom-controls[hidden]{display:none!important;}
 #app table.for-e-zoom-active{transform:none!important;}
}

/* Mobile calendar: bounded zoom controls, visible departments and corner event icons. */
@media (max-width:768px), (pointer:coarse) {
 html body:not(.force-desktop-mode) #app .for-e-zoom-toolbar {
   box-sizing:border-box!important; width:100%!important; max-width:100%!important;
   min-width:0!important; grid-template-columns:minmax(0,1fr)!important;
 }
 html body:not(.force-desktop-mode) #app .for-e-zoom-toolbar .for-e-zoom-modes {
   display:grid!important; grid-template-columns:repeat(2,minmax(0,1fr))!important;
   width:100%!important; min-width:0!important;
 }
 html body:not(.force-desktop-mode) #app .for-e-zoom-toolbar .for-e-zoom-controls:not([hidden]) {
   display:grid!important; grid-template-columns:36px minmax(0,1fr) 36px auto!important;
   width:100%!important; min-width:0!important; gap:6px!important;
 }
 html body:not(.force-desktop-mode) #app .for-e-zoom-toolbar button {
   box-sizing:border-box!important; width:100%!important; min-width:0!important;
   max-width:100%!important; margin:0!important; padding:6px 4px!important;
   font-size:clamp(12px,3.6vw,15px)!important; white-space:normal!important;
 }
 html body:not(.force-desktop-mode) #app .for-e-zoom-toolbar input[type="range"] {
   width:100%!important; min-width:0!important; max-width:100%!important; margin:0!important;
 }
 html body:not(.force-desktop-mode) #app .for-e-zoom-toolbar output {
   min-width:0!important; padding:0 2px!important; white-space:nowrap!important;
 }
 html body:not(.force-desktop-mode) #app .for-e-zoom-toolbar [data-zoom-action="fit"] {
   grid-column:1/-1!important;
 }
 #app table.for-e-horizontal-names .for-e-name-band-content .for-e-name-department:not([hidden]) {
   display:inline-block!important; flex:0 0 auto!important; width:auto!important;
   max-width:none!important; color:#64748b!important; white-space:nowrap!important;
   font-size:12px!important; font-weight:650!important;
 }
 #app table.for-e-horizontal-names .for-e-name-department[hidden] {display:none!important;}
 html body:not(.force-desktop-mode) #app table.for-e-horizontal-names .for-e-corner-event {
   position:relative!important;
 }
 html body:not(.force-desktop-mode) #app table.for-e-horizontal-names .for-e-corner-event .simple-field-schedule-icon {
   position:absolute!important; inset:6px 6px auto auto!important;
   width:18px!important; min-width:18px!important; max-width:18px!important;
   height:18px!important; min-height:18px!important; max-height:18px!important;
   font-size:11px!important; margin:0!important; z-index:1!important;
 }
 html body:not(.force-desktop-mode) #app table.for-e-horizontal-names .for-e-corner-event .simple-field-schedule-head {
   position:static!important; padding-right:24px!important; box-sizing:border-box!important;
 }
 html body:not(.force-desktop-mode) #app table.for-e-horizontal-names .for-e-corner-event.for-e-corner-no-time .simple-field-schedule-head {
   display:contents!important;
 }
 html body:not(.force-desktop-mode) #app table.for-e-horizontal-names .for-e-corner-event.for-e-corner-no-time .simple-field-schedule-title {
   padding-right:24px!important; box-sizing:border-box!important;
 }
 html body:not(.force-desktop-mode) #app table.for-e-horizontal-names .for-e-corner-event .simple-field-schedule-head :is(.for-e-card-time,.week-card-time,.field-week-card-time) {
   white-space:normal!important; overflow:visible!important; text-overflow:clip!important;
 }
}

/* Unified calendar presentation: today B, event cards B, meeting information A. */
#app :is(table.week-overview-table,table.field-week-table,table.meeting-week-table,table.meeting-room-table) :is(th,td).is-today {
  background:#eef0ff!important;
  border-color:#d8deea!important;
  box-shadow:none!important;
  outline:none!important;
}
#app :is(table.week-overview-table,table.field-week-table,table.meeting-week-table,table.meeting-room-table) :is(th,td).is-today:is(.is-holiday,.is-field-day,.is-leave-day,.is-return-day,.is-personal-leave-day,.has-continuation-mark) {
  border-color:#d8deea!important;
  box-shadow:none!important;
}
#app :is(table.week-overview-table,table.field-week-table,table.meeting-week-table,table.meeting-room-table) :is(th,td).is-today.is-field-day {
  background:linear-gradient(90deg,#ffefe2 0 5px,#eef0ff 5px)!important;
}
#app :is(table.week-overview-table,table.field-week-table,table.meeting-week-table,table.meeting-room-table) :is(th,td).is-today::after {
  border:none!important; box-shadow:none!important; outline:none!important;
}
#app :is(table.week-overview-table,table.field-week-table,table.meeting-week-table,table.meeting-room-table) thead th.is-today {
  background:#e1e6ff!important;
}
#app :is(table.week-overview-table,table.field-week-table,table.meeting-week-table,table.meeting-room-table) :is(.week-schedule-card,.field-week-schedule-card,.meeting-room-card,.meeting-room-overview-card,.continuation-day-mark,.return-reminder-day-mark,.administrative-reminder-day-mark) {
  border-top:1px solid #dde2e9!important;
  border-right:1px solid #dde2e9!important;
  border-bottom:1px solid #dde2e9!important;
  border-left-width:4px!important; border-left-style:solid!important;
  border-radius:8px!important;
}
#app :is(table.week-overview-table,table.field-week-table,table.meeting-week-table,table.meeting-room-table) :is(.week-schedule-card,.field-week-schedule-card,.meeting-room-card,.meeting-room-overview-card,.continuation-day-mark,.return-reminder-day-mark,.administrative-reminder-day-mark):not(.is-transfer-due-date,.is-transfer-due-reminder,.is-transfer-tracking-start,.is-runaway-reminder,.is-runaway-day2,.is-runaway-day3,.is-verify-reminder,.is-alert-item) {
  box-shadow:none!important;
}
#app :is(table.week-overview-table,table.field-week-table,table.meeting-week-table,table.meeting-room-table) .for-e-meeting-title-priority {
  display:block!important; color:#263347!important; font-weight:800!important;
  white-space:normal!important; overflow-wrap:anywhere!important; text-align:left!important;
}
#app :is(table.week-overview-table,table.field-week-table,table.meeting-week-table,table.meeting-room-table) .for-e-meeting-location-secondary,
#app :is(table.week-overview-table,table.field-week-table,table.meeting-week-table,table.meeting-room-table) .for-e-meeting-location-secondary * {
  color:#788395!important; font-size:0.85em!important; font-weight:600!important;
  white-space:normal!important; overflow-wrap:anywhere!important; text-align:left!important;
}
#app :is(table.week-overview-table,table.field-week-table,table.meeting-week-table,table.meeting-room-table) .for-e-meeting-location-secondary {
  display:block!important; margin-top:3px!important; line-height:1.3!important;
}
#app :is(table.week-overview-table,table.field-week-table,table.meeting-week-table,table.meeting-room-table) :is(.is-completed,.is-ended,.ended-case,.for-e-v278-meeting-room-past-gray) :is(.for-e-meeting-title-priority,.for-e-meeting-location-secondary,.for-e-meeting-location-secondary *) {
  color:#626b78!important;
}

/* Distinguish current day and holiday; keep external-duty date cue. */
#app :is(table.week-overview-table,table.field-week-table,table.meeting-week-table,table.meeting-room-table) :is(th,td).is-holiday:not(.is-today,.is-field-day,.is-leave-day,.is-return-day,.is-personal-leave-day) {
 background:#F4EFED!important; border-color:#e6dedb!important; box-shadow:none!important;
}
#app :is(table.week-overview-table,table.field-week-table,table.meeting-week-table,table.meeting-room-table) :is(th,td).is-today {
 background:#E2E9FF!important; border-color:#d8deea!important; box-shadow:none!important;
}
#app :is(table.week-overview-table,table.field-week-table,table.meeting-week-table,table.meeting-room-table) :is(th,td).is-today.is-field-day {
 background:linear-gradient(90deg,#ffefe2 0 5px,#E2E9FF 5px)!important;
}
#app :is(table.week-overview-table,table.field-week-table,table.meeting-week-table,table.meeting-room-table) thead th.is-today {
 background:#5269CA!important; color:#fff!important;
}
#app :is(table.week-overview-table,table.field-week-table,table.meeting-week-table,table.meeting-room-table) thead th.is-today :is(strong,span,small,div) {
 color:#fff!important; background:transparent!important; border-color:transparent!important; box-shadow:none!important;
}
#app :is(table.week-overview-table,table.field-week-table,table.meeting-week-table,table.meeting-room-table) thead th.is-holiday:not(.is-today) {background:#EAE2DF!important;color:#92776b!important;}
#app :is(table.week-overview-table,table.field-week-table,table.meeting-week-table,table.meeting-room-table) :is(.for-e-card-type-chip,.week-card-type-line,.continuation-day-type-line,.service-reminder-card-type,.field-day-reminder-badge,.return-reminder-day-mark > span,.administrative-reminder-day-mark > span) {
 background:transparent!important; border:0!important; box-shadow:none!important;
 border-radius:0!important; padding:0!important; margin:0 0 3px!important;
 min-height:0!important; height:auto!important; min-width:0!important; width:auto!important;
 max-width:100%!important; white-space:normal!important; overflow:visible!important;
 overflow-wrap:anywhere!important; text-overflow:clip!important; text-align:left!important;
 font-weight:800!important; line-height:1.3!important;
}
#app :is(table.week-overview-table,table.field-week-table,table.meeting-week-table,table.meeting-room-table) :is(.field-leave-return-prompt,.field-training-calendar-prompt) {border-radius:8px!important;}
#app :is(table.week-overview-table,table.field-week-table,table.meeting-week-table,table.meeting-room-table) .for-e-reminder-palette:not(.is-completed,.is-ended,.ended-case,.is-cancelled,.is-postponed) {
 --schedule-accent:var(--fore-reminder-accent)!important; --day-accent:var(--fore-reminder-accent)!important;
 background:var(--fore-reminder-bg)!important;
 border-top:1px solid #e0e4eb!important; border-right:1px solid #e0e4eb!important; border-bottom:1px solid #e0e4eb!important;
 border-left:4px solid var(--fore-reminder-accent)!important; border-radius:8px!important; box-shadow:none!important;
 color:#293445!important; text-align:left!important;
}
#app :is(table.week-overview-table,table.field-week-table,table.meeting-week-table,table.meeting-room-table) .for-e-reminder-palette:not(.is-completed,.is-ended,.ended-case,.is-cancelled,.is-postponed) :is(.for-e-reminder-heading,.field-day-reminder-badge,.service-reminder-card-type,.for-e-card-type-chip,.week-card-type-line,.continuation-day-type-line,.transfer-last-day-badge) {
 color:var(--fore-reminder-ink)!important; background:transparent!important; border:0!important;
 box-shadow:none!important; border-radius:0!important; padding:0!important; min-height:0!important;
 height:auto!important; width:auto!important; max-width:100%!important; white-space:normal!important;
}
#app :is(table.week-overview-table,table.field-week-table,table.meeting-week-table,table.meeting-room-table) .for-e-reminder-palette:not(.is-completed,.is-ended,.ended-case,.is-cancelled,.is-postponed) :is(strong,.for-e-card-title,.continuation-card-title,.week-card-preview,.field-week-card-preview) {color:#293445!important;}
#app :is(table.week-overview-table,table.field-week-table,table.meeting-week-table,table.meeting-room-table) .for-e-reminder-palette .for-e-reminder-heading {display:block!important; font-weight:800!important; text-align:left!important; line-height:1.3!important;}
#app :is(table.week-overview-table,table.field-week-table,table.meeting-week-table,table.meeting-room-table) .for-e-reminder-palette.field-day-reminder-prompt {display:flex!important; flex-direction:column!important; align-items:flex-start!important; gap:3px!important;}
#app :is(table.week-overview-table,table.field-week-table,table.meeting-week-table,table.meeting-room-table) .for-e-reminder-field {--fore-reminder-accent:#D98236;--fore-reminder-bg:#FFF3E5;--fore-reminder-ink:#A95619;}
#app :is(table.week-overview-table,table.field-week-table,table.meeting-week-table,table.meeting-room-table) .for-e-reminder-return {--fore-reminder-accent:#399AA6;--fore-reminder-bg:#E8F6F8;--fore-reminder-ink:#227580;}
#app :is(table.week-overview-table,table.field-week-table,table.meeting-week-table,table.meeting-room-table) .for-e-reminder-returnToday {--fore-reminder-accent:#399AA6;--fore-reminder-bg:#F1FAFB;--fore-reminder-ink:#227580;}
#app :is(table.week-overview-table,table.field-week-table,table.meeting-week-table,table.meeting-room-table) .for-e-reminder-transfer {--fore-reminder-accent:#8661CF;--fore-reminder-bg:#F1EBFC;--fore-reminder-ink:#6844AC;}
#app :is(table.week-overview-table,table.field-week-table,table.meeting-week-table,table.meeting-room-table) .for-e-reminder-transferEarly {--fore-reminder-accent:#8661CF;--fore-reminder-bg:#F8F5FE;--fore-reminder-ink:#6844AC;}
#app :is(table.week-overview-table,table.field-week-table,table.meeting-week-table,table.meeting-room-table) .for-e-reminder-transferFinal {--fore-reminder-accent:#653AB3;--fore-reminder-bg:#E9DDFB;--fore-reminder-ink:#573098;}
#app :is(table.week-overview-table,table.field-week-table,table.meeting-week-table,table.meeting-room-table) .for-e-reminder-runaway {--fore-reminder-accent:#DB4949;--fore-reminder-bg:#FFF0F0;--fore-reminder-ink:#B92F35;}
#app :is(table.week-overview-table,table.field-week-table,table.meeting-week-table,table.meeting-room-table) .for-e-reminder-runawayFinal {--fore-reminder-accent:#BE3038;--fore-reminder-bg:#FFE3E5;--fore-reminder-ink:#A6242C;}
#app :is(table.week-overview-table,table.field-week-table,table.meeting-week-table,table.meeting-room-table) .for-e-reminder-verify {--fore-reminder-accent:#947318;--fore-reminder-bg:#FFF8DF;--fore-reminder-ink:#806011;}
#app :is(table.week-overview-table,table.field-week-table,table.meeting-week-table,table.meeting-room-table) .for-e-reminder-tracking {--fore-reminder-accent:#43516F;--fore-reminder-bg:#EDF0F6;--fore-reminder-ink:#43516F;}
#app :is(table.week-overview-table,table.field-week-table,table.meeting-week-table,table.meeting-room-table) .for-e-reminder-important {--fore-reminder-accent:#BC4189;--fore-reminder-bg:#FDEDF6;--fore-reminder-ink:#A12F73;}

/* Return notices: retain heading and case title only; details remain in the original record. */
#app :is(table.week-overview-table,table.field-week-table,table.meeting-week-table,table.meeting-room-table) .return-reminder-day-mark :is(strong small,.week-card-preview,.field-week-card-preview,.for-e-card-secondary-text) {
 display:none!important;
}

`;
const style=document.createElement('style'); style.id='for-e-calendar-options-1-3fe'; style.textContent=css; document.head.append(style);
const removed = new Set(['個人行程表','異況追蹤','異況','顏色設定']);
const clean = value=>String(value||'').replace(/\s+/g,'').trim();
function navKey(el){return el.getAttribute('data-page')||el.getAttribute('data-target')||el.getAttribute('data-view')||''}
function updateMenus(){
 const buttons=[...new Set(document.querySelectorAll('.sidebar button,.mobile-nav button,.sidebar a,.mobile-nav a,.mobile-menu-label'))].map(node=>node.matches('.mobile-menu-label')?node.closest('button,a,[role="button"]')||node:node);
 const unique=[...new Set(buttons)];
 const labels=b=>[b.querySelector('.mobile-menu-label')?.textContent,b.textContent,b.getAttribute('title'),b.getAttribute('aria-label')].map(clean);
 const direct=b=>labels(b).some(x=>removed.has(x));
 const mobileHidden=b=>Boolean(b.closest('.mobile-nav')||b.querySelector('.mobile-menu-label')||b.matches('.mobile-menu-label'))&&labels(b).some(x=>['個人','個人行程','異況','異況追蹤','顏色','顏色設定'].includes(x));
 const keys=new Set(unique.filter(b=>direct(b)||mobileHidden(b)).map(navKey).filter(Boolean));
 for(const b of unique){
  const hide=direct(b)||mobileHidden(b)||keys.has(navKey(b));
  b.classList.toggle('for-e-menu-removed',hide);
  if(hide)b.style.setProperty('display','none','important');
  else if(b.dataset.forERemoved==='1')b.style.removeProperty('display');
  if(hide)b.dataset.forERemoved='1';else delete b.dataset.forERemoved;
 }
 const active=unique.find(b=>b.classList.contains('for-e-menu-removed')&&b.classList.contains('active'));
 if(active){
  const target=unique.find(x=>!x.classList.contains('for-e-menu-removed')&&labels(x).some(v=>['行程總覽','行程'].includes(v))&&x.getClientRects().length)||unique.find(x=>!x.classList.contains('for-e-menu-removed')&&labels(x).some(v=>['行程總覽','行程'].includes(v)));
  if(target)queueMicrotask(()=>{if(active.isConnected&&active.classList.contains('active'))target.click()});
 }
}
const selector='table.week-overview-table,table.field-week-table,table.meeting-week-table,table.meeting-room-table';
function updateTable(table){
 const active=mobile.matches&&!document.body.classList.contains('force-desktop-mode');
 table.classList.toggle('for-e-horizontal-names',active);
 for(const strong of table.querySelectorAll(':scope > thead > tr > th:not(:first-child) > strong')){
  if(active&&/^\d{2}-\d{2}$/.test(clean(strong.textContent))){strong.dataset.originalCalendarDate=strong.textContent;strong.textContent=strong.textContent.replace('-','/');}
  else if(!active&&strong.dataset.originalCalendarDate){strong.textContent=strong.dataset.originalCalendarDate;delete strong.dataset.originalCalendarDate;}
 }
 if(!active)return;
 const rows=[...table.querySelectorAll(':scope > tbody > tr:not(.for-e-name-band)')];
 for(const row of rows){
  const cell=row.firstElementChild;
  if(!cell||row.children.length<2||cell.colSpan>1)continue;
  const name=cell.querySelector('.calendar-staff-name-text,.meeting-room-name-main')||cell.querySelector('strong');
  const raw=clean(name?.textContent||cell.textContent);
  if(!raw)continue;
  const num=cell.querySelector('.meeting-room-name-number');
  const department=cell.querySelector('.calendar-staff-department')||[...cell.querySelectorAll(':scope > span,:scope > small')].find(el=>!el.matches('.calendar-staff-name-title,.calendar-staff-name-text,.field-worker-badge,.meeting-room-name-number')&&!el.contains(name)&&clean(el.textContent)&&!['外','行','行政'].includes(clean(el.textContent)));
  const title=raw+(num&&!raw.includes(clean(num.textContent))?' '+clean(num.textContent):'');
  const dept=clean(department?.textContent);
  const fieldBadge=cell.querySelector('.field-worker-badge');
  const fieldText=fieldBadge?clean(fieldBadge.textContent)||'外':'';
  const colspan=[...row.children].slice(1).reduce((n,td)=>n+(td.colSpan||1),0);
  cell.classList.add('for-e-original-name');
  let band=row.previousElementSibling;
  if(!band?.classList.contains('for-e-name-band')){
   band=document.createElement('tr');band.className='for-e-name-band';
   const td=document.createElement('td');td.className='for-e-name-band-cell';
   const content=document.createElement('div');content.className='for-e-name-band-content';
   const pill=document.createElement('span');pill.className='for-e-name-pill';
   const sub=document.createElement('span');sub.className='for-e-name-department';
   const badge=document.createElement('span');badge.className='for-e-band-field-badge';badge.hidden=true;
   content.append(pill,badge,sub);td.append(content);band.append(td);row.before(band);
  }
  const td=band.firstElementChild;
  if(td.colSpan!==colspan)td.colSpan=colspan;
  const pill=td.querySelector('.for-e-name-pill'),sub=td.querySelector('.for-e-name-department');
  if(pill.textContent!==title)pill.textContent=title;
  if(sub.textContent!==dept)sub.textContent=dept;
  sub.hidden=!dept;
  const badge=td.querySelector('.for-e-band-field-badge');
  if(badge.textContent!==fieldText)badge.textContent=fieldText;
  badge.hidden=!fieldText;
 }
 for(const card of table.querySelectorAll('.week-schedule-card.simple-field-schedule-card,.field-week-schedule-card.simple-field-schedule-card')){
  const head=card.querySelector('.simple-field-schedule-head');
  const icon=head?.querySelector('.simple-field-schedule-icon');
  if(!icon)continue;
  card.classList.add('for-e-corner-event');
  const hasOtherText=clean(head.textContent)!==clean(icon.textContent);
  card.classList.toggle('for-e-corner-no-time',!hasOtherText);
 }
 // Only remove the original name column, not the date columns.
 for(const row of table.querySelectorAll(':scope > thead > tr')){
  const cell=row.firstElementChild;
  if(cell&&row.children.length>1&&cell.colSpan===1)cell.classList.add('for-e-original-name');
 }
 const firstCol=table.querySelector(':scope > colgroup > col:first-child');
 if(firstCol)firstCol.classList.add('for-e-original-name');
}
const zoomPrefs=new Map();
const zoomBindings=new WeakMap();
function calendarScroll(table){
 for(let p=table.parentElement;p&&p!==document.body;p=p.parentElement){
  if(/auto|scroll/.test(getComputedStyle(p).overflowX))return p;
 }
 return table.parentElement;
}
function updateCalendarZoom(table, monthHost=null){
 const enabled=mobile.matches&&!document.body.classList.contains('force-desktop-mode');
 const host=monthHost||calendarScroll(table);
 if(!host)return;
 let state=zoomBindings.get(table);
 if(!enabled){
  if(state){
   state.toolbar.hidden=true;
   if(state.controls.parentElement!==state.toolbar)state.toolbar.append(state.controls);
   if(state.toolbar.parentElement!==state.host.parentElement)state.host.before(state.toolbar);
   table.classList.remove('for-e-zoom-active');table.style.removeProperty('zoom');state.applied=1;
  }
  return;
 }
 const kind=document.querySelector('[data-mobile-calendar]')?.dataset.mobileCalendar;
 const key=kind||(table.classList.contains('field-week-table')?'field':table.classList.contains('meeting-week-table')||table.classList.contains('meeting-room-table')?'meeting':'overview');
 let pref=zoomPrefs.get(key);
 if(!pref){pref={mode:'normal',scale:1,fit:true};zoomPrefs.set(key,pref);}
 if(!state){
  const toolbar=document.createElement('div');toolbar.className='for-e-zoom-toolbar';
  toolbar.innerHTML='<div class="for-e-zoom-modes"><button type="button" data-zoom-mode="normal">一般檢視</button><button type="button" data-zoom-mode="overview" aria-label="全覽模式">全覽</button></div><div class="for-e-zoom-controls" hidden><button type="button" data-zoom-action="minus" aria-label="縮小">−</button><input type="range" min="10" max="120" step="1" aria-label="縮放比例"><button type="button" data-zoom-action="plus" aria-label="放大">＋</button><output></output><button type="button" data-zoom-action="fit">適應螢幕</button></div>';
  const controls=toolbar.querySelector('.for-e-zoom-controls');
  state={toolbar,controls,host,applied:1,touch:null};
  zoomBindings.set(table,state);
  const clamp=n=>Math.max(.1,Math.min(1.2,n));
  const render=()=>{
   if(!table.isConnected)return;
   const overview=pref.mode==='overview';
   // Read the unscaled intrinsic width so fit remains accurate after orientation changes.
   let natural=Math.max(table.scrollWidth,table.offsetWidth,1);
   if(state.applied===1)state.natural=natural;
   else natural=state.natural||natural;
   const scale=overview?(pref.fit?clamp((host.clientWidth-2)/Math.max(natural,1)):clamp(pref.scale)):1;
   if(overview){table.style.setProperty('zoom',String(scale),'important');table.classList.add('for-e-zoom-active');}
   else{table.style.removeProperty('zoom');table.classList.remove('for-e-zoom-active');}
   state.applied=scale;
   toolbar.querySelectorAll('[data-zoom-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.zoomMode===pref.mode)));
   controls.hidden=!overview;
   controls.querySelector('input').value=String(Math.round(scale*100));
   const output=controls.querySelector('output');const label=Math.round(scale*100)+'%';if(output.textContent!==label)output.textContent=label;
  };
  state.render=render;
  const handleClick=e=>{
   const button=e.target.closest('button');if(!button)return;
   e.preventDefault();e.stopPropagation();
   if(button.dataset.zoomMode){pref.mode=button.dataset.zoomMode;if(pref.mode==='overview'){pref.fit=true;host.scrollLeft=0;}}
   else if(button.dataset.zoomAction==='fit'){pref.fit=true;host.scrollLeft=0;}
   else{pref.fit=false;pref.scale=clamp(state.applied+(button.dataset.zoomAction==='plus'?.1:-.1));}
   render();
  };
  toolbar.addEventListener('click',handleClick);controls.addEventListener('click',handleClick);
  controls.querySelector('input').addEventListener('input',e=>{pref.fit=false;pref.scale=clamp(Number(e.target.value)/100);render();});
  const distance=t=>Math.hypot(t[0].clientX-t[1].clientX,t[0].clientY-t[1].clientY);
  table.addEventListener('touchstart',e=>{if(pref.mode==='overview'&&e.touches.length===2){state.touch={distance:distance(e.touches),scale:state.applied};}},{passive:true});
  table.addEventListener('touchmove',e=>{if(pref.mode!=='overview'||!state.touch||e.touches.length!==2)return;if(e.cancelable)e.preventDefault();pref.fit=false;pref.scale=clamp(state.touch.scale*distance(e.touches)/Math.max(state.touch.distance,1));render();},{passive:false});
  const end=()=>{state.touch=null;};table.addEventListener('touchend',end,{passive:true});table.addEventListener('touchcancel',end,{passive:true});
 }
 const actions=document.querySelector('[data-mobile-calendar] .mobile-calendar-controls');
 const row=actions?.querySelector('.mobile-calendar-action-row');
 if(row){
  if(state.toolbar.parentElement!==row)row.insertBefore(state.toolbar,row.querySelector('.mobile-calendar-refresh'));
  if(state.controls.parentElement!==actions)actions.append(state.controls);
 }else{
  if(state.toolbar.parentElement!==host.parentElement)host.before(state.toolbar);
  if(state.controls.parentElement!==state.toolbar)state.toolbar.append(state.controls);
 }
 state.toolbar.hidden=false;state.render();
}
function updateSingleMonthZoom(){
 const month=document.querySelector('[data-mobile-calendar]')&&document.querySelector('.personal-month-calendar');
 if(!month)return;
 const enabled=mobile.matches&&!document.body.classList.contains('force-desktop-mode');
 let sheet=month.querySelector(':scope > .mobile-month-zoom-content');
 if(enabled&&!sheet){
  sheet=document.createElement('div');sheet.className='mobile-month-zoom-content';
  sheet.append(...Array.from(month.childNodes));month.append(sheet);
 }
 if(sheet&&!enabled){
  updateCalendarZoom(sheet,month);
  zoomBindings.get(sheet)?.toolbar.remove();
  zoomBindings.delete(sheet);
  sheet.replaceWith(...Array.from(sheet.childNodes));
 }else if(sheet)updateCalendarZoom(sheet,month);
}

let selected='';
function updateOptions(){
 const form=document.querySelector('.option-management-form');
 if(!form)return;
 const boxes=[...form.querySelectorAll('.option-edit-box')].filter(b=>!b.parentElement.closest('.option-edit-box'));
 if(!boxes.length)return;
 let tabs=form.querySelector(':scope > .for-e-option-tabs');
 const names=boxes.map((b,i)=>clean(b.querySelector('.option-edit-head h4,h4,h3')?.textContent)||'分類 '+(i+1));
 if(!names.includes(selected))selected=names[0];
 function apply(){
  boxes.forEach((box,i)=>box.classList.toggle('for-e-option-hidden',names[i]!==selected));
  form.querySelectorAll('.option-group-body').forEach(group=>{
   const visible=boxes.some(b=>group.contains(b)&&!b.classList.contains('for-e-option-hidden'));
   const container=group.parentElement;
   if(container&&container!==form)container.classList.toggle('for-e-option-hidden',!visible);
  });
  tabs.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.textContent===selected)));
 }
 if(tabs && tabs.dataset.categories!==JSON.stringify(names)){tabs.remove();tabs=null;}
 if(!tabs){
  tabs=document.createElement('div');tabs.dataset.categories=JSON.stringify(names);tabs.className='for-e-option-tabs';tabs.setAttribute('aria-label','選項分類');
  const fragment=document.createDocumentFragment();
  for(const name of [...new Set(names)]){const b=document.createElement('button');b.type='button';b.textContent=name;b.addEventListener('click',()=>{selected=name;updateOptions()});fragment.append(b);}
  tabs.append(fragment);form.prepend(tabs);
 }
 apply();
}
const filterPrefs=new Map();
const filterOriginalDisplay=new WeakMap();
function setFilterVisibility(el,hidden){
 if(!filterOriginalDisplay.has(el))filterOriginalDisplay.set(el,{value:el.style.getPropertyValue('display'),priority:el.style.getPropertyPriority('display')});
 el.classList.toggle('for-e-filter-collapsed',hidden);
 if(hidden){if(el.style.getPropertyValue('display')!=='none'||el.style.getPropertyPriority('display')!=='important')el.style.setProperty('display','none','important');}
 else {
  const prev=filterOriginalDisplay.get(el);
  if(prev.value)el.style.setProperty('display',prev.value,prev.priority);
  else el.style.removeProperty('display');
 }
}
// B week navigator and A staged filter: preserve original controls/handlers.
const mobileTools = new WeakMap();
function updateMobileCalendarToolbar(){
 const root=document.querySelector('[data-mobile-calendar]');
 if(!root)return;
 const enabled=mobile.matches&&!document.body.classList.contains('force-desktop-mode');
 const toolbar=root.querySelector('.toolbar-actions');
 const old=mobileTools.get(root);
 if(!enabled){if(old){old.restore();mobileTools.delete(root);}return;}
 if(old)return;
 const kind=root.dataset.mobileCalendar;
 const prefix=kind==='overview'?'':kind;
 const getBtn=name=>toolbar.querySelector('#'+(prefix?prefix+name[0].toUpperCase()+name.slice(1):name));
 const touched=[];const nodes=[];
 function move(node,parent){
  if(!node)return;
  const anchor=document.createComment('calendar-control');
  node.before(anchor);parent.append(node);touched.push(()=>{anchor.replaceWith(node)});
 }
 function make(cls,parent){const el=document.createElement('div');el.className=cls;parent.append(el);nodes.push(el);return el;}
 function shorten(btn,label){if(!btn)return;const before=btn.textContent;const markup=btn.innerHTML;const aria=btn.getAttribute('aria-label');btn.setAttribute('aria-label',before.trim());btn.textContent=label;touched.push(()=>{btn.innerHTML=markup;if(aria===null)btn.removeAttribute('aria-label');else btn.setAttribute('aria-label',aria);});}
 root.classList.add('mobile-calendar-b');
 const title=root.firstElementChild;title.classList.add('mobile-calendar-title');
 const add=toolbar.querySelector('#addScheduleBtn');if(add){move(add,title);shorten(add,'＋ '+add.textContent);}
 const scope=make('mobile-calendar-scope',root);
 if(kind==='overview'){
  const personal=toolbar.querySelector('#personalWeekBtn'),all=toolbar.querySelector('#allTranslatorWeekBtn');
  move(personal,scope);move(all,scope);shorten(personal,'個人當週');shorten(all,'全部翻譯');
 }else{
  const select=toolbar.querySelector('.toolbar-view-control select');
  if(select){for(const opt of select.options){const b=document.createElement('button');b.type='button';b.textContent=opt.textContent;b.setAttribute('aria-pressed',String(opt.value===select.value));b.onclick=()=>{if(select.value!==opt.value){select.value=opt.value;select.dispatchEvent(new Event('change',{bubbles:true}));}};scope.append(b);}}
 }
 const dates=(root.dataset.calendarDates||'').split(',').filter(Boolean),mode=root.dataset.calendarMode;
 const d0=dates[0],d1=dates.at(-1);
 const short=d=>d?Number(d.slice(5,7))+'/'+Number(d.slice(8,10)):'';
 const monthLabel=d=>d?d.slice(0,4)+'年'+Number(d.slice(5,7))+'月':'';
 const nav=make('mobile-calendar-date-nav',root);
 const prev=getBtn('prevWeekBtn'),next=getBtn('nextWeekBtn'),today=getBtn('thisWeekBtn');
 move(prev,nav);
 if(prev){prev.classList.add('mobile-calendar-arrow');touched.push(()=>prev.classList.remove('mobile-calendar-arrow'));shorten(prev,'‹');}
 const center=make('mobile-calendar-date-center',nav);
 const period=document.createElement('strong');
 period.textContent=mode==='month'?monthLabel(d0):mode==='day'?short(d0):short(d0)+' — '+short(d1);
 center.append(period);
 const monthText=document.createElement('span');monthText.textContent=mode==='month'?'選擇月份 ▾':monthLabel(d0)+(d0&&d1&&d0.slice(0,7)!==d1.slice(0,7)?' · '+monthLabel(d1):'')+' ▾';center.append(monthText);
 const month=toolbar.querySelector('input[type=month]');
 if(month){
  const value=month.value;const label=month.closest('label');
  move(label,center);if(d0)month.value=d0.slice(0,7);month.setAttribute('aria-label','選擇月份');
  touched.push(()=>{month.value=value;month.removeAttribute('aria-label');});
 }
 move(next,nav);if(next){next.classList.add('mobile-calendar-arrow');touched.push(()=>next.classList.remove('mobile-calendar-arrow'));shorten(next,'›');}
 move(today,nav);
 if(mode==='week'&&dates.length===7){
  const strip=make('mobile-calendar-week-strip',root);strip.setAttribute('aria-label','當週日期');
  dates.forEach((date,i)=>{
   const day=document.createElement('div');day.className='mobile-calendar-day'+(i>=5?' is-weekend':'')+(date===root.dataset.calendarToday?' is-current':'');
   const weekday=['一','二','三','四','五','六','日'][i];const hasHoliday=getHolidayEntries(date).length>0;
   day.setAttribute('aria-label',date+' 星期'+weekday+(hasHoliday?'，國定假日，點擊查看':''));
   const label=document.createElement('span');label.textContent=weekday+(hasHoliday?' · 假日':'');
   const number=document.createElement('strong');number.textContent=String(Number(date.slice(8)));
   if(hasHoliday){day.classList.add('for-e-holiday-day');day.setAttribute('role','button');day.tabIndex=0;day.dataset.holidayDate=date;day.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();day.click();}});}
   day.append(label,number);strip.append(day);
  });
 }
 const actions=make('mobile-calendar-controls',root);
 const actionRow=make('mobile-calendar-action-row',actions);
 const refresh=toolbar.querySelector('#refreshBtn');if(refresh){move(refresh,actionRow);shorten(refresh,'↻');refresh.classList.add('mobile-calendar-refresh');touched.push(()=>refresh.classList.remove('mobile-calendar-refresh'));}
 const exportBtn=toolbar.querySelector('#exportCsvBtn'),account=document.querySelector('.overview-account-panel');
 if(exportBtn&&account)move(exportBtn,account);
 mobileTools.set(root,{actions,restore:()=>{touched.reverse().forEach(fn=>fn());nodes.reverse().forEach(el=>el.remove());title.classList.remove('mobile-calendar-title');root.classList.remove('mobile-calendar-b');}});
}
const mobileSheets=new WeakMap();
let activeSheet=null;
function updateMobileFilterSheet(panel,isMobile){
 const root=document.querySelector('[data-mobile-calendar]');if(!root)return;
 const actions=root.querySelector('.mobile-calendar-action-row');
 const existing=mobileSheets.get(panel);
 if(!isMobile){if(existing){existing.restore();mobileSheets.delete(panel);}if(activeSheet?.id===panel.id)activeSheet=null;return;}
 if(existing||!actions)return;
 const section=panel.id==='meetingRoomFilterForm'?'會議室':panel.id==='fieldScheduleFilterForm'?'外務人員':'人員';
 const dialog=document.createElement('dialog');dialog.className='overview-sheet-dialog mobile-filter-sheet';
 dialog.setAttribute('aria-label','篩選條件');
 dialog.innerHTML='<div class="mobile-filter-head"><strong>篩選條件</strong><button type="button" data-filter-close aria-label="關閉">×</button></div><div class="mobile-filter-scroll"></div><div class="mobile-filter-footer"><button type="button" data-filter-reset>重設</button><button type="button" data-filter-apply>套用</button></div>';
 panel.before(dialog);dialog.querySelector('.mobile-filter-scroll').append(panel);
 panel.classList.add('mobile-filter-draft');
 const launch=document.createElement('button');launch.type='button';launch.className='overview-sheet-launch mobile-filter-launch';launch.setAttribute('aria-haspopup','dialog');launch.setAttribute('aria-expanded','false');actions.prepend(launch);
 const controls=[...panel.querySelectorAll('input[type=checkbox],select')];
 const controlKey=el=>el.name+'\u0000'+(el.type==='checkbox'?el.value:'select');
 const defaults=controls.map(el=>el.type==='checkbox'?el.checked:el.value);
 const changes=[];
 const generated=[];
 const depInputs=[...panel.querySelectorAll('input[name=departments],input[name=fieldDepartments]')];
 const staffInputs=[...panel.querySelectorAll('input[name=staffIds],input[name=fieldStaffIds],input[name=rooms]')];
 let search=null,count=null,allBtn=null,clearBtn=null,deptAll=null;
 const create=(tag,cls,text)=>{const el=document.createElement(tag);el.className=cls;if(text!==undefined)el.textContent=text;generated.push(el);return el;};
 const eligible=()=>{const deps=new Set(depInputs.filter(e=>e.checked).map(e=>e.value));return staffInputs.filter(e=>!deps.size||deps.has(e.closest('label')?.dataset.choiceDepartment||''));};
 const visible=()=>eligible().filter(e=>!search?.value||clean(e.closest('label').textContent).toLowerCase().includes(search.value.trim().toLowerCase()));
 const ownMode=()=>panel.querySelector('select[name=viewMode]')?.value?.startsWith('個人');
 function update(clearOutside=false){
  const allowed=new Set(eligible()),shown=new Set(visible()),personal=ownMode();
  for(const input of staffInputs){
   if(clearOutside&&!allowed.has(input))input.checked=false;
   input.closest('label').toggleAttribute('data-mobile-filter-hidden',!shown.has(input));
   input.disabled=personal;
  }
  for(const input of depInputs)input.disabled=personal;
  panel.querySelectorAll('.mobile-filter-person-section, .mobile-filter-dept-section').forEach(el=>{el.classList.toggle('mobile-filter-personal',personal);});
  if(deptAll){deptAll.setAttribute('aria-pressed',String(!depInputs.some(e=>e.checked)));deptAll.disabled=personal;}
  const n=staffInputs.filter(e=>e.checked&&allowed.has(e)).length;
  if(count)count.textContent=personal?'個人模式':n?'已選 '+n+(section==='會議室'?' 間':' 人'):'全部 '+allowed.size+(section==='會議室'?' 間':' 人');
  if(allBtn)allBtn.disabled=personal||!shown.size;if(clearBtn)clearBtn.disabled=personal;
  if(search)search.disabled=personal;
  dialog.querySelector('[data-filter-apply]').textContent='套用'+(personal?'':n?'（'+n+(section==='會議室'?'間':'人')+'）':'（全部）');
  for(const select of panel.querySelectorAll('select'))select.parentElement.querySelectorAll('[data-filter-option]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.filterOption===select.value)));
  if(dialog.open)activeSheet={id:panel.id,values:new Map(controls.map(el=>[controlKey(el),el.type==='checkbox'?el.checked:el.value])),search:search?.value||'',scroll:dialog.querySelector('.mobile-filter-scroll').scrollTop};
 }
 for(const details of panel.querySelectorAll('.compact-multi-select')){
  const originalOpen=details.open;details.open=true;changes.push(()=>{details.open=originalOpen;});
  const checkPanel=details.querySelector('.compact-check-panel');if(!checkPanel)continue;
  const department=!!checkPanel.querySelector('input[name=departments],input[name=fieldDepartments]');
  const cls=department?'mobile-filter-dept-section':'mobile-filter-person-section';
  details.classList.add(cls);changes.push(()=>details.classList.remove(cls));
  const heading=create('div','mobile-filter-section-heading');
  heading.append(create('strong','',department?'部門':section));
  if(!department){
   count=create('small','mobile-filter-count');heading.append(count);
   allBtn=create('button','mobile-filter-link','全選');allBtn.type='button';allBtn.onclick=()=>{visible().forEach(e=>e.checked=true);update();};
   clearBtn=create('button','mobile-filter-link','清除');clearBtn.type='button';clearBtn.title='清除勾選（未勾選代表不限範圍）';clearBtn.onclick=()=>{staffInputs.forEach(e=>e.checked=false);update();};
   heading.append(allBtn,clearBtn);
   search=create('input','mobile-filter-search');search.type='search';search.placeholder=section==='會議室'?'搜尋會議室':'搜尋姓名';search.setAttribute('aria-label',search.placeholder);search.autocomplete='off';search.addEventListener('input',()=>update());
  }
  details.insertBefore(heading,checkPanel);if(search&&!department){details.insertBefore(search,checkPanel);const hint=create('small','mobile-filter-selection-hint','未勾選代表不限範圍');details.insertBefore(hint,checkPanel);}
  if(department){deptAll=create('button','mobile-filter-dept-all','全部');deptAll.type='button';deptAll.onclick=()=>{depInputs.forEach(e=>e.checked=false);update(true);};checkPanel.prepend(deptAll);}
  checkPanel.classList.add(department?'mobile-dept-grid':'mobile-person-grid');changes.push(()=>checkPanel.classList.remove('mobile-dept-grid','mobile-person-grid'));
 }
 for(const select of panel.querySelectorAll('select')){
  select.classList.add('overview-sheet-native');changes.push(()=>select.classList.remove('overview-sheet-native'));
  const group=create('div','overview-sheet-choices mobile-filter-choices');group.setAttribute('role','group');group.setAttribute('aria-label',clean(select.parentElement.querySelector('.compact-field-label')?.textContent));
  for(const opt of select.options){const b=create('button','',''+opt.textContent.trim());b.type='button';b.dataset.filterOption=opt.value;b.onclick=e=>{e.preventDefault();select.value=opt.value;update();};group.append(b);}
  select.after(group);
 }
 const dirty=()=>{controls.forEach((el,i)=>{if(el.type==='checkbox')el.checked=defaults[i];else el.value=defaults[i];});if(search)search.value='';update();};
 function close(commit=false){
  if(!commit)dirty();
  activeSheet=null;if(dialog.open)dialog.close();launch.setAttribute('aria-expanded','false');
 }
 function open(restore=false){
  if(!restore)dirty();
  dialog.showModal();launch.setAttribute('aria-expanded','true');update();
 }
 panel.addEventListener('change',onChange);
 function onChange(e){if(e.target.type==='checkbox')update(depInputs.includes(e.target));}
 launch.onclick=()=>open();
 dialog.querySelector('[data-filter-close]').onclick=()=>close();
 dialog.querySelector('[data-filter-reset]').onclick=()=>{
  depInputs.forEach(e=>e.checked=false);staffInputs.forEach(e=>e.checked=false);
  panel.querySelectorAll('select').forEach(el=>{if(/sort/i.test(el.name))el.value=el.options[0]?.value||'';});
  if(search)search.value='';update();
 };
 dialog.querySelector('[data-filter-apply]').onclick=()=>{update(true);close(true);panel.requestSubmit();};
 dialog.addEventListener('cancel',e=>{e.preventDefault();close();});
 dialog.addEventListener('click',e=>{if(e.target!==dialog)return;const r=dialog.getBoundingClientRect();if(e.clientY<r.top||e.clientY>r.bottom||e.clientX<r.left||e.clientX>r.right)close();});
 launch.textContent='篩選'+(staffInputs.filter(e=>e.checked).length?' ('+staffInputs.filter(e=>e.checked).length+')':'');
 mobileSheets.set(panel,{restore:()=>{
  if(dialog.open)close();panel.removeEventListener('change',onChange);panel.classList.remove('mobile-filter-draft');
  panel.querySelectorAll('[data-mobile-filter-hidden]').forEach(el=>el.removeAttribute('data-mobile-filter-hidden'));
  controls.forEach(el=>el.disabled=false);generated.reverse().forEach(el=>el.remove());changes.reverse().forEach(fn=>fn());dialog.before(panel);dialog.remove();launch.remove();
 }});
 if(activeSheet?.id===panel.id){const draft=activeSheet;controls.forEach(el=>{const key=controlKey(el);if(draft.values.has(key)){if(el.type==='checkbox')el.checked=draft.values.get(key);else el.value=draft.values.get(key);}});if(search)search.value=draft.search;open(true);dialog.querySelector('.mobile-filter-scroll').scrollTop=draft.scroll;}
 else update();
}
// Mobile search uses the same staged, two-column choice sheet as calendar
// filters, while keeping the original single-value form and desktop selects.
const searchChoiceBindings=new WeakMap();
function updateMobileSearchControls(isMobile){
 const form=document.querySelector('#searchForm');
 if(!form)return;
 const binding=searchChoiceBindings.get(form);
 if(!isMobile){if(binding){binding.restore();searchChoiceBindings.delete(form);}return;}
 if(binding)return;
 const created=[];const selects=[];const dateRestorers=[];
 const add=(tag,cls,text)=>{const el=document.createElement(tag);if(cls)el.className=cls;if(text!==undefined)el.textContent=text;created.push(el);return el;};
 const status=form.querySelector('select[name="status"]');
 if(status){
  status.classList.add('mobile-search-native');selects.push(status);
  const group=add('div','mobile-search-status-options');group.setAttribute('role','group');group.setAttribute('aria-label','狀態');
  const sync=()=>group.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.searchValue===status.value)));
  [...status.options].forEach(opt=>{const b=add('button','',opt.textContent);b.type='button';b.dataset.searchValue=opt.value;b.onclick=e=>{e.preventDefault();status.value=opt.value;sync();};group.append(b);});
  status.after(group);sync();
 }
 for(const [name,label] of [['category','類別'],['staffId','執行者']]){
  const select=form.querySelector('select[name="'+name+'"]');if(!select)continue;
  select.classList.add('mobile-search-native');selects.push(select);
  const trigger=add('button','mobile-search-choice-trigger');trigger.type='button';trigger.setAttribute('aria-haspopup','dialog');
  const summary=add('span','mobile-search-choice-value');const arrow=add('span','mobile-search-choice-chevron','⌄');arrow.setAttribute('aria-hidden','true');trigger.append(summary,arrow);select.after(trigger);
  const setLabel=()=>{summary.textContent=select.selectedOptions[0]?.textContent||'全部';trigger.setAttribute('aria-label',label+'：'+summary.textContent);};
  setLabel();
  trigger.onclick=e=>{
   e.preventDefault();
   const dialog=document.createElement('dialog');dialog.className='overview-sheet-dialog mobile-filter-sheet mobile-search-choice-sheet';
   dialog.setAttribute('aria-label','選擇'+label);
   dialog.innerHTML='<div class="mobile-filter-head"><strong></strong><button type="button" data-choice-close aria-label="關閉">×</button></div><div class="mobile-filter-scroll"><div class="mobile-search-sheet-body"><input class="mobile-filter-search" type="search" autocomplete="off"><div class="mobile-search-sheet-options" role="group"></div><p class="mobile-search-no-options" hidden>沒有符合條件的選項</p></div></div><div class="mobile-filter-footer"><button type="button" data-choice-reset>重設</button><button type="button" data-filter-apply>確定</button></div>';
   dialog.querySelector('.mobile-filter-head strong').textContent='選擇'+label;
   const input=dialog.querySelector('input');input.placeholder=name==='staffId'?'搜尋姓名或部門':'搜尋類別';input.setAttribute('aria-label',input.placeholder);
   const grid=dialog.querySelector('.mobile-search-sheet-options');grid.setAttribute('aria-label',label);
   let draft=select.value;
   const choices=[...select.options].map(opt=>{
    const b=document.createElement('button');b.type='button';b.dataset.value=opt.value;
    const mark=document.createElement('span');mark.className='mobile-search-choice-check';mark.textContent='✓';mark.setAttribute('aria-hidden','true');
    const text=document.createElement('span');text.textContent=opt.textContent; b.append(mark,text);
    b.onclick=()=>{draft=opt.value;render();};grid.append(b);return b;
   });
   function render(){
    const q=input.value.trim().toLowerCase();let count=0;
    choices.forEach(b=>{b.setAttribute('aria-pressed',String(b.dataset.value===draft));b.hidden=!!q&&!b.textContent.toLowerCase().includes(q);if(!b.hidden)count++;});
    dialog.querySelector('.mobile-search-no-options').hidden=count>0;
   }
   const close=commit=>{if(commit){select.value=draft;setLabel();}if(dialog.open)dialog.close();dialog.remove();trigger.setAttribute('aria-expanded','false');trigger.focus();};
   input.addEventListener('input',render);dialog.querySelector('[data-choice-close]').onclick=()=>close(false);
   dialog.querySelector('[data-choice-reset]').onclick=()=>{draft=select.options[0]?.value||'';input.value='';render();};
   dialog.querySelector('[data-filter-apply]').onclick=()=>close(true);
   dialog.addEventListener('cancel',e=>{e.preventDefault();close(false);});
   dialog.addEventListener('click',e=>{if(e.target!==dialog)return;const r=dialog.getBoundingClientRect();if(e.clientY<r.top||e.clientY>r.bottom||e.clientX<r.left||e.clientX>r.right)close(false);});
   form.after(dialog);trigger.setAttribute('aria-expanded','true');dialog.showModal();render();dialog.querySelector('[data-choice-close]').focus();
  };
 }
 // iOS creates a native date editor with its own vertical alignment and can
 // render today's placeholder even though the input value is empty. Use an
 // explicit visible label, retaining the real native picker and form value.
 for(const [name,label] of [['startDate','起日'],['endDate','迄日']]){
  const input=form.querySelector('input[type="date"][name="'+name+'"]');if(!input)continue;
  const visual=add('div','mobile-search-date-field');
  const value=add('span','mobile-search-date-value');value.setAttribute('aria-hidden','true');
  const clear=add('button','mobile-search-date-clear','×');clear.type='button';clear.setAttribute('aria-label','清除'+label);
  const originalLabel=input.getAttribute('aria-label');
  input.before(visual);visual.append(value,input,clear);input.classList.add('mobile-search-date-native');
  function sync(){
   const selected=!!input.value;value.textContent=selected?input.value.replaceAll('-','/'):'不限日期';
   visual.classList.toggle('has-value',selected);clear.hidden=!selected;
   input.setAttribute('aria-label',label+'：'+value.textContent);
  }
  clear.onclick=e=>{e.preventDefault();e.stopPropagation();input.value='';input.dispatchEvent(new Event('input',{bubbles:true}));input.dispatchEvent(new Event('change',{bubbles:true}));};
  input.addEventListener('input',sync);input.addEventListener('change',sync);sync();
  dateRestorers.push(()=>{
   input.removeEventListener('input',sync);input.removeEventListener('change',sync);
   input.classList.remove('mobile-search-date-native');
   if(originalLabel===null)input.removeAttribute('aria-label');else input.setAttribute('aria-label',originalLabel);
   visual.before(input);
  });
 }
 searchChoiceBindings.set(form,{restore:()=>{
  form.parentElement?.querySelectorAll('.mobile-search-choice-sheet').forEach(d=>{if(d.open)d.close();d.remove();});
  dateRestorers.forEach(restore=>restore());
  selects.forEach(s=>s.classList.remove('mobile-search-native'));created.reverse().forEach(el=>el.remove());
 }});
}
function updateFilters(){
 const selector='.overview-filter-panel-compact,.field-filter-panel-compact,.overview-filter-panel';
 const panels=[...document.querySelectorAll(selector)].filter(p=>!p.parentElement.closest(selector));
 const isMobile=mobile.matches&&!document.body.classList.contains('force-desktop-mode');
 const groups=[...document.querySelectorAll('.overview-quick-group-bar')];
 updateMobileCalendarToolbar();
 updateMobileSearchControls(isMobile);
 const calendarPanels=panels.filter(p=>['overviewFilterForm','fieldScheduleFilterForm','meetingRoomFilterForm'].includes(p.id));
 calendarPanels.forEach(p=>updateMobileFilterSheet(p,isMobile));
 if(!calendarPanels.length)activeSheet=null;
 const overview=panels.find(p=>!p.classList.contains('field-filter-panel-compact'))||panels[0];
 panels.forEach((panel,i)=>{
  if(calendarPanels.includes(panel))return;
  const key=panel.id|| (panel.classList.contains('field-filter-panel-compact')?'field':'overview')+':'+i;
  let toggle=panel.previousElementSibling;
  if(!toggle?.classList.contains('for-e-filter-toggle')){
   toggle=document.createElement('button');toggle.type='button';toggle.className='for-e-filter-toggle';
   const label=document.createElement('span');label.textContent='篩選條件';
   const mark=document.createElement('span');mark.className='for-e-filter-mark';toggle.append(label,mark);
   panel.before(toggle);
  }
  const paired=panel===overview?groups:[];
  const expanded=filterPrefs.get(key)===true;
  const apply=(open)=>{
   setFilterVisibility(panel,isMobile&&!open);
   paired.forEach(group=>setFilterVisibility(group,isMobile&&!open));
   toggle.setAttribute('aria-expanded',String(open));
   const label=toggle.firstElementChild;
   const title=paired.length?'篩選條件／快速人員群組':'篩選條件';
   if(label.textContent!==title)label.textContent=title;
   const mark=toggle.querySelector('.for-e-filter-mark');
   const text=open?'收起 ▴':'展開 ▾';
   if(mark.textContent!==text)mark.textContent=text;
  };
  toggle.onclick=event=>{
   event.preventDefault();event.stopPropagation();
   const next=!Boolean(filterPrefs.get(key));filterPrefs.set(key,next);apply(next);
  };
  apply(expanded);
 });
}


function updateMeetingCardPresentation(table){
 const cards=table.querySelectorAll('.meeting-room-overview-card,.meeting-room-card,.card-display-meeting-room');
 for(const card of cards){
  if(card.closest('table')!==table)continue;
  const room=card.querySelector('.meeting-room-overview-room,.meeting-room-room-line,.meeting-room-name');
  if(!room)continue;
  const usable=el=>el!==room&&!el.contains(room)&&!room.contains(el)&&!el.matches('.meeting-room-name,.meeting-room-room-line,.week-card-time,.for-e-card-time,.meeting-room-time')&&clean(el.textContent);
  const title=[...card.querySelectorAll('.meeting-title,.meeting-room-overview-title,.meeting-room-overview-name,.meeting-room-preview:not(.meeting-room-name)')].find(usable)||[...card.querySelectorAll('.for-e-card-title,strong')].find(usable);
  if(!title||title===room||title.contains(room)||room.contains(title))continue;
  title.classList.add('for-e-meeting-title-priority');
  room.classList.add('for-e-meeting-location-secondary');
  let branch=title;
  while(branch.parentElement&&branch.parentElement!==card)branch=branch.parentElement;
  if(branch.parentElement!==card)continue;
  if(branch.nextElementSibling!==room){
   const former=room.parentElement;
   branch.after(room);
   if(former!==card&&former!==branch&&!former.children.length&&!clean(former.textContent)&&former.matches('.meeting-room-overview-head,.meeting-room-card-head'))former.remove();
  }
 }
}


const reminderKinds=['field','return','returnToday','transfer','transferEarly','transferFinal','runaway','runawayFinal','verify','tracking','important'];
function updateReminderPresentation(table){
 const cards=table.querySelectorAll('.field-day-reminder-prompt,.return-reminder-day-mark,.service-reminder-week-card,.administrative-reminder-day-mark,.week-schedule-card,.field-week-schedule-card,.continuation-day-mark');
 for(const card of cards){
  let heading=card.querySelector('.field-day-reminder-badge,.service-reminder-card-type,.for-e-card-type-chip,.week-card-type-line,.continuation-day-type-line');
  if(!heading&&card.matches('.return-reminder-day-mark,.administrative-reminder-day-mark'))heading=card.querySelector(':scope > span');
  const label=clean(heading?.textContent);
  let kind='';
  if(card.matches('.field-day-reminder-prompt'))kind='field';
  else if(card.matches('.return-reminder-day-mark'))kind=card.matches('.is-return-confirm')?'returnToday':'return';
  else if(card.matches('.is-transfer-due-date'))kind='transferFinal';
  else if(card.matches('.is-transfer-due-reminder'))kind='transferEarly';
  else if(card.matches('.is-transfer-tracking-start'))kind='transfer';
  else if(card.matches('.is-runaway-day3'))kind='runawayFinal';
  else if(card.matches('.is-runaway-reminder,.is-runaway-day2'))kind='runaway';
  else if(card.matches('.is-verify-reminder,.is-verify-date-reminder,.is-verify-departure-notice,.is-verify-salary-reminder'))kind='verify';
  else if(card.matches('.is-important-continuation')||label==='重要事項')kind='important';
  else if(card.matches('.administrative-reminder-day-mark')||/^(提醒追蹤|待追蹤|追蹤提醒|行政事務提醒|下次追蹤)$/.test(label))kind='tracking';
  if(!kind)continue;
  card.classList.add('for-e-reminder-palette');
  for(const k of reminderKinds)card.classList.toggle('for-e-reminder-'+k,k===kind);
  if(heading){
   heading.classList.add('for-e-reminder-heading');
   if(!heading.children.length){
    const rename=kind==='returnToday'&&/^返台確認(?:[（(]今天返台[）)])?$/.test(label)?'今日返台':kind==='transferEarly'&&label==='轉出提醒'?'轉出預告':kind==='transferFinal'&&/^(轉出提醒|轉出期限|轉出到期)$/.test(label)?'轉出最後一天':kind==='tracking'&&label==='提醒追蹤'?'待追蹤':null;
    if(rename&&heading.textContent!==rename)heading.textContent=rename;
   }
  }
  if(kind==='field'){
   for(const el of card.querySelectorAll('span,strong,small')){
    if(!el.children.length&&clean(el.textContent)==='請勿安排其他行程')el.textContent='請勿另排行程';
   }
  }
 }
}

let queued=false;
function updateDesktopAssignedReminder(){
 const desktop=document.body.classList.contains('force-desktop-mode')||!mobile.matches;
 if(!desktop)return;
 document.querySelectorAll('.assigned-reminder-backdrop').forEach(node=>node.remove());
 // The obsolete shortcut led to the retired personal-calendar page.
 document.querySelectorAll('.sidebar button,.sidebar a,.nav button,.nav a').forEach(node=>{
  if(clean(node.textContent)==='指派事項'||clean(node.getAttribute('title'))==='指派事項'){
   node.classList.add('for-e-menu-removed');node.style.setProperty('display','none','important');
  }
 });
}
function refresh(){queued=false;updateDesktopAssignedReminder();updateFilters();updateMenus();document.querySelectorAll(selector).forEach(table=>{updateTable(table);updateCalendarZoom(table);updateMeetingCardPresentation(table);updateReminderPresentation(table)});updateSingleMonthZoom();updateOptions();}
function schedule(){if(!queued){queued=true;requestAnimationFrame(refresh)}}
new MutationObserver(schedule).observe(document.getElementById('app')||document.body,{childList:true,subtree:true});
mobile.addEventListener('change',schedule);
window.addEventListener('resize',schedule,{passive:true});
schedule();
