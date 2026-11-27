// Presentation-only enhancement. Original handlers and data storage remain untouched.
const mobile = matchMedia('(max-width: 768px), (pointer: coarse)');
const css = `
.for-e-menu-removed { display:none!important; }
.for-e-option-hidden { display:none!important; }
.option-management-form .for-e-option-tabs { display:flex; flex-wrap:wrap; gap:8px; padding:12px; background:#f4f6fa; border-radius:14px; }
.for-e-option-tabs button { padding:10px 14px; background:white; color:#42536e; border:1px solid #dce2ee; }
.for-e-option-tabs button[aria-pressed="true"] { color:white; background:#5170ff; border-color:#5170ff; }
.option-management-form .option-group-body { grid-template-columns:minmax(0,1fr)!important; }
.option-management-form .option-line-list { max-height:none!important; overflow:visible!important; }
.option-management-form .option-edit-box { min-width:0; }
.option-management-form .option-form-actions { position:sticky; bottom:0; background:white; padding:12px; z-index:5; }
.for-e-float-name { display:none; }
@media (max-width:768px), (pointer:coarse) {
 body:not(.force-desktop-mode) table.for-e-float-active > thead > tr > :first-child {
  left:auto!important; inset-inline-start:auto!important; z-index:1!important;
 }
 body:not(.force-desktop-mode) table.for-e-float-active > tbody > tr > :first-child {
  position:relative!important; left:auto!important; inset-inline-start:auto!important;
  z-index:4!important; overflow:visible!important; background:transparent!important; box-shadow:none!important;
 }
 body:not(.force-desktop-mode) table.for-e-float-active > tbody > tr > :first-child > :not(.for-e-float-name) { visibility:hidden!important; }
 body:not(.force-desktop-mode) table.for-e-float-active > tbody > tr > :not(:first-child) { padding-top:34px!important; }
 body:not(.force-desktop-mode) table.for-e-float-active .for-e-float-name {
  display:block!important; position:absolute!important; top:5px!important; left:7px!important;
  transform:translateX(var(--for-e-float-x,0px))!important; white-space:nowrap!important;
  color:#fff!important; background:#526783!important; font-size:12px!important; font-weight:700!important;
  line-height:18px!important; padding:2px 9px!important; border-radius:999px!important;
  width:max-content!important; max-width:none!important; visibility:visible!important; pointer-events:none!important;
 }
}
`;
const style=document.createElement('style'); style.id='for-e-calendar-options-1-3fe'; style.textContent=css; document.head.append(style);
const removed = new Set(['個人行程表','異況追蹤','異況','顏色設定']);
const clean = value=>String(value||'').replace(/\s+/g,'').trim();
function navKey(el){return el.getAttribute('data-page')||el.getAttribute('data-target')||el.getAttribute('data-view')||''}
function updateMenus(){
 const buttons=[...document.querySelectorAll('.sidebar button,.mobile-nav button,.sidebar a,.mobile-nav a')];
 const keys=new Set(buttons.filter(b=>removed.has(clean(b.textContent))||removed.has(clean(b.getAttribute('title')))).map(navKey).filter(Boolean));
 for(const b of buttons){
  const hide=removed.has(clean(b.textContent))||removed.has(clean(b.getAttribute('title')))||removed.has(clean(b.getAttribute('aria-label')))||keys.has(navKey(b));
  b.classList.toggle('for-e-menu-removed',hide);
  if(hide && b.classList.contains('active')){
   const target=buttons.find(x=>!x.classList.contains('for-e-menu-removed')&&['行程總覽','行程'].includes(clean(x.textContent)));
   if(target && target!==b){queueMicrotask(()=>{if(b.isConnected&&b.classList.contains('active'))target.click()});}
  }
 }
}
const observed = new WeakSet();
const selector='table.week-overview-table,table.field-week-table,table.meeting-week-table,table.meeting-room-table';
function getScroll(table){
 for(let p=table.parentElement;p&&p!==document.body;p=p.parentElement){
  const overflow=getComputedStyle(p).overflowX;
  if(/auto|scroll/.test(overflow)) return p;
 }
 return null;
}
function updateTable(table){
 const scroll=getScroll(table); if(!scroll)return;
 const update=()=>{
  const active=mobile.matches&&!document.body.classList.contains('force-desktop-mode')&&scroll.scrollLeft>3;
  table.classList.toggle('for-e-float-active',active);
  table.style.setProperty('--for-e-float-x',Math.max(0,scroll.scrollLeft)+'px');
 };
 for(const row of table.querySelectorAll(':scope > tbody > tr')){
  const cell=row.firstElementChild;
  if(!cell||row.children.length<2||cell.querySelector(':scope > .for-e-float-name'))continue;
  const name=cell.querySelector('.calendar-staff-name-text,.meeting-room-name-main')||cell.querySelector('strong');
  const raw=clean(name?.textContent||cell.textContent);
  if(!raw)continue;
  const num=cell.querySelector('.meeting-room-name-number');
  const label=document.createElement('span'); label.className='for-e-float-name';
  label.textContent=raw+(num&&!raw.includes(clean(num.textContent))?' '+clean(num.textContent):'');
  label.setAttribute('aria-hidden','true'); cell.append(label);
 }
 if(!observed.has(table)){observed.add(table);scroll.addEventListener('scroll',update,{passive:true});}
 update();
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
let queued=false;
function refresh(){queued=false;updateMenus();document.querySelectorAll(selector).forEach(updateTable);updateOptions();}
function schedule(){if(!queued){queued=true;requestAnimationFrame(refresh)}}
new MutationObserver(schedule).observe(document.getElementById('app')||document.body,{childList:true,subtree:true});
mobile.addEventListener('change',schedule);
window.addEventListener('resize',schedule,{passive:true});
schedule();
