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
 if(!active)return;
 const rows=[...table.querySelectorAll(':scope > tbody > tr:not(.for-e-name-band)')];
 for(const row of rows){
  const cell=row.firstElementChild;
  if(!cell||row.children.length<2||cell.colSpan>1)continue;
  const name=cell.querySelector('.calendar-staff-name-text,.meeting-room-name-main')||cell.querySelector('strong');
  const raw=clean(name?.textContent||cell.textContent);
  if(!raw)continue;
  const num=cell.querySelector('.meeting-room-name-number');
  const department=cell.querySelector('.calendar-staff-department');
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
 // Only remove the original name column, not the date columns.
 for(const row of table.querySelectorAll(':scope > thead > tr')){
  const cell=row.firstElementChild;
  if(cell&&row.children.length>1&&cell.colSpan===1)cell.classList.add('for-e-original-name');
 }
 const firstCol=table.querySelector(':scope > colgroup > col:first-child');
 if(firstCol)firstCol.classList.add('for-e-original-name');
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
function updateFilters(){
 const panels=[...document.querySelectorAll('.overview-filter-panel-compact,.field-filter-panel-compact,.overview-filter-panel')].filter(p=>!p.parentElement.closest('.overview-filter-panel-compact,.field-filter-panel-compact,.overview-filter-panel'));
 panels.forEach((panel,i)=>{
  const key=panel.id|| (panel.classList.contains('field-filter-panel-compact')?'field':'overview')+':'+i;
  const isMobile=mobile.matches&&!document.body.classList.contains('force-desktop-mode');
  let toggle=panel.previousElementSibling;
  if(!toggle?.classList.contains('for-e-filter-toggle')){
   toggle=document.createElement('button');toggle.type='button';toggle.className='for-e-filter-toggle';
   const label=document.createElement('span');label.textContent='篩選條件';
   const mark=document.createElement('span');mark.className='for-e-filter-mark';toggle.append(label,mark);
   toggle.addEventListener('click',()=>{filterPrefs.set(key,!filterPrefs.get(key));updateFilters()});
   panel.before(toggle);
  }
  const expanded=filterPrefs.get(key)===true;
  panel.classList.toggle('for-e-filter-collapsed',isMobile&&!expanded);
  toggle.setAttribute('aria-expanded',String(expanded));
  const mark=toggle.querySelector('.for-e-filter-mark');
  const text=expanded?'收起 ▴':'展開 ▾';
  if(mark.textContent!==text)mark.textContent=text;
 });
}

let queued=false;
function refresh(){queued=false;updateMenus();document.querySelectorAll(selector).forEach(updateTable);updateOptions();updateFilters();}
function schedule(){if(!queued){queued=true;requestAnimationFrame(refresh)}}
new MutationObserver(schedule).observe(document.getElementById('app')||document.body,{childList:true,subtree:true});
mobile.addEventListener('change',schedule);
window.addEventListener('resize',schedule,{passive:true});
schedule();
