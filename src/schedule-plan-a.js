// Mobile forms: visual controls mirror existing form inputs, preserving submission and listeners.
const node = (tag, cls, text) => { const el=document.createElement(tag); if(cls)el.className=cls; if(text!==undefined)el.textContent=text; return el }
const btn = (cls, text) => {const el=node('button',cls,text);el.type='button';return el}
const fire = el => el.dispatchEvent(new Event('change',{bubbles:true}))
const fieldLabel = el => {
  const label=el.closest('label'); if(!label)return ''
  return [...label.childNodes].filter(n=>n.nodeType===3).map(n=>n.textContent.trim()).join(' ').trim() || label.querySelector('.form-label-text')?.textContent?.trim() || ''
}
const caption = el => el.selectedOptions?.[0]?.textContent.trim() || '請選擇'
const labelText = (input) => input.closest('label')?.querySelector('span')?.textContent?.trim() || input.closest('label')?.textContent?.trim() || input.value
const nameOf = input => {const label=input.closest('label'),span=label?.querySelector('span');if(span){const copy=span.cloneNode(true);copy.querySelectorAll('small').forEach(n=>n.remove());return copy.textContent.split('｜')[0].trim()}return labelText(input).split('｜')[0].trim()}
function showSheet(modal,title,build){
  modal.querySelector('.pa-choice-overlay')?.remove()
  const overlay=node('div','pa-choice-overlay'),sheet=node('section','pa-choice-sheet'),head=node('div','pa-sheet-head'),close=btn('pa-sheet-close','×'),body=node('div','pa-sheet-body'),foot=node('div','pa-sheet-footer'),done=btn('pa-sheet-done','完成');
  sheet.setAttribute('role','dialog');sheet.setAttribute('aria-modal','true');sheet.setAttribute('aria-label',title);head.append(node('strong','',title),close);sheet.append(head,body,foot);foot.append(done);overlay.append(sheet);modal.append(overlay)
  const active=document.activeElement, panel=modal.querySelector('.modal-panel');const dismiss=()=>{overlay.remove();modal.classList.remove('pa-sheet-open');if(panel)panel.inert=false;active?.focus?.({preventScroll:true})};if(panel)panel.inert=true;modal.classList.add('pa-sheet-open');close.onclick=dismiss;overlay.onclick=e=>{if(e.target===overlay)dismiss()};overlay.addEventListener('keydown',e=>{if(e.key==='Escape'){e.stopPropagation();dismiss()}})
  build(body,done,dismiss);close.focus({preventScroll:true});return overlay
}
function searchBox(body,placeholder,callback){const e=node('input','pa-sheet-search');e.type='search';e.placeholder=placeholder;e.autocomplete='off';e.addEventListener('input',()=>callback(e.value.trim().toLowerCase()));body.append(e);return e}
function optionButton(text,selected){const b=btn('pa-sheet-option',text);b.setAttribute('aria-pressed',String(selected));return b}
function installSelect(modal,select,syncs){
  if(select.dataset.paReady || select.multiple || /(?:_hour|_minute)$/.test(select.name))return
  select.dataset.paReady='1';select.classList.add('pa-native-select')
  const opts=[...select.options],n=select.name||'',direct=['category','leave_meeting_type','edit_leave_meeting_type','repeat_mode','time_type','has_extra_schedule','has_documents','activity_scope','edit_activity_scope'].includes(n) && opts.length<=8;
  const wrap=node('div',direct?'pa-segments':'pa-select-trigger-wrap');wrap.classList.add('pa-enhancement');if(n==='category'||n==='leave_meeting_type'||n==='edit_leave_meeting_type')wrap.classList.add('pa-tile-grid');select.after(wrap)
  function sync(){
    if(direct){const options=[...select.options]; if(wrap.children.length!==options.length || options.some((o,i)=>wrap.children[i]?.dataset.value!==o.value)){
      wrap.replaceChildren(...options.map(o=>{const short= n==='repeat_mode' ? {'每週重複':'每週','每月重複':'每月'}[o.value] : null;const b=btn('pa-segment',short||o.textContent.trim());b.dataset.value=o.value;b.onclick=e=>{e.preventDefault();if(select.disabled||o.disabled)return;select.value=o.value;fire(select)};return b}))
    } [...wrap.children].forEach((b,i)=>{b.setAttribute('aria-pressed',String(options[i].value===select.value));b.disabled=select.disabled||options[i].disabled})}
    else{const b=wrap.firstElementChild;b.textContent=caption(select);b.disabled=select.disabled; b.setAttribute('aria-label',`${fieldLabel(select)||'選擇'}：${caption(select)}`)}
  }
  if(!direct){const b=btn('pa-select-trigger','');wrap.append(b);b.onclick=e=>{e.preventDefault();showSheet(modal,fieldLabel(select)||'選擇項目',(body,done,dismiss)=>{
    let selected=select.value,keyword='';const list=node('div','pa-sheet-options');if(/schedule_type|service_reminder_type/.test(n)&&n!=='service_reminder_type')list.classList.add('pa-sheet-grid');
    const options=[...select.options];const draw=()=>{list.replaceChildren();for(const o of options){const t=o.textContent.trim();if(keyword&&!t.toLowerCase().includes(keyword))continue;const item=optionButton(t,o.value===selected);item.disabled=o.disabled;item.onclick=()=>{selected=o.value;draw()};list.append(item)}if(!list.children.length)list.append(node('p','pa-empty','查無符合項目'))};
    if(options.length>8||/staff|car|location|room|schedule_type/.test(n))searchBox(body,'搜尋選項',v=>{keyword=v;draw()});body.append(list);draw();done.onclick=()=>{select.value=selected;fire(select);dismiss()}
  })}}
  syncs.push(sync);sync()
}
function installTimePairs(modal,form,syncs){
  for(const hour of form.querySelectorAll('select[name$="_hour"]')){
    const minute=form.querySelector(`select[name="${hour.name.replace(/_hour$/,'_minute')}"]`);if(!minute||hour.dataset.paReady||minute.dataset.paReady)continue;
    hour.dataset.paReady=minute.dataset.paReady='1';hour.classList.add('pa-native-select');minute.classList.add('pa-native-select');const b=btn('pa-select-trigger pa-enhancement pa-time-trigger','');hour.after(b);const timeRow=hour.closest('.compact-time-row');if(timeRow)timeRow.classList.add('pa-time-pair-row');const label=hour.closest('label'),minuteLabel=minute.closest('label');if(minuteLabel&&minuteLabel!==label)minuteLabel.classList.add('pa-time-minute-label');
    const sync=()=>{b.textContent=hour.value?`${hour.value}:${minute.value||'00'}`:'不指定';b.disabled=hour.disabled};syncs.push(sync);sync();b.onclick=e=>{e.preventDefault();showSheet(modal,fieldLabel(hour).replace('小時','時間')||'設定時間',(body,done,dismiss)=>{let h=hour.value,m=minute.value;const hr=node('div','pa-sheet-options pa-hour-grid'),mi=node('div','pa-sheet-options pa-hour-grid');const draw=()=>{hr.replaceChildren(...[...hour.options].map(o=>{const x=optionButton(o.textContent.trim(),o.value===h);x.onclick=()=>{h=o.value;draw()};return x}));mi.replaceChildren(...[...minute.options].map(o=>{const x=optionButton(o.textContent.trim(),o.value===m);x.onclick=()=>{m=o.value;draw()};return x}))};body.append(node('strong','','小時'),hr,node('strong','','分鐘（5 分鐘）'),mi);draw();done.onclick=()=>{hour.value=h;minute.value=m;fire(hour);fire(minute);dismiss()}})}
  }
}
function installMulti(modal,source,title,syncs){
  if(!source||source.dataset.paMulti||!source.querySelector('input[type=checkbox]'))return;source.dataset.paMulti='1';source.classList.add('pa-native-multi');const trigger=btn('pa-select-trigger pa-enhancement','');source.before(trigger);const inputs=()=>[...source.querySelectorAll('input[type=checkbox]')];
  const sync=()=>{const picked=inputs().filter(i=>i.checked);trigger.textContent=picked.length?`已選 ${picked.length} 項｜${picked.slice(0,2).map(nameOf).join('、')}${picked.length>2?'…':''}`:'請選擇';trigger.setAttribute('aria-label',`${title}，${trigger.textContent}`)};syncs.push(sync);sync();trigger.onclick=e=>{e.preventDefault();showSheet(modal,title,(body,done,dismiss)=>{
    const all=inputs(),selected=new Set(all.filter(i=>i.checked)),list=node('div','pa-sheet-options');let keyword='',dept='';const department=i=>{const t=labelText(i);return t.includes('｜')?t.split('｜').slice(1).join('｜').trim():i.closest('label')?.querySelector('small')?.textContent?.trim()||''};const departments=[...new Set(all.map(department).filter(Boolean))];const visible=()=>all.filter(i=>(!dept||department(i)===dept)&&(!keyword||labelText(i).toLowerCase().includes(keyword)));
    const draw=()=>{list.replaceChildren();for(const i of visible()){const item=optionButton(nameOf(i),selected.has(i));item.classList.add('pa-person-option');if(department(i))item.append(node('small','',department(i)));item.disabled=i.disabled;item.onclick=()=>{if(selected.has(i))selected.delete(i);else selected.add(i);draw()};list.append(item)}if(!list.children.length)list.append(node('p','pa-empty','查無符合項目'));done.textContent=`完成（${selected.size} 項）`};
    searchBox(body,'搜尋姓名或部門',v=>{keyword=v;draw()});if(departments.length){const filt=node('select','pa-dept-filter');for(const d of ['',...departments]){const op=node('option','',d||'全部部門');op.value=d;filt.append(op)}filt.onchange=()=>{dept=filt.value;draw()};body.append(filt)}const actions=node('div','pa-sheet-actions'),allBtn=btn('','全選目前清單'),clear=btn('','清除');allBtn.onclick=()=>{visible().filter(i=>!i.disabled).forEach(i=>selected.add(i));draw()};clear.onclick=()=>{all.filter(i=>!i.disabled).forEach(i=>selected.delete(i));draw()};actions.append(allBtn,clear);body.append(actions,list);draw();done.onclick=()=>{for(const i of all){if(i.disabled)continue;const next=selected.has(i);if(i.checked!==next){i.checked=next;fire(i)}}sync();dismiss()}
  })}
}
export function enhanceSchedulePlanA(modal){
  const form=modal.querySelector('form');if(!form||form.dataset.planA)return;form.dataset.planA='1';modal.classList.add('pa-modal');const syncs=[];
  installTimePairs(modal,form,syncs);for(const select of form.querySelectorAll('select'))installSelect(modal,select,syncs);
  const lists=[['#scheduleAssigneeBlock > .checkbox-list','選擇執行人員'],['#editScheduleAssigneeBlock > .checkbox-list','選擇執行人員'],['#scheduleAssigneeBlock .checkbox-list','選擇執行人員'],['#meetingDepartmentAssigneeBlock .checkbox-list','選擇部門'],['#editMeetingDepartmentAssigneeBlock .checkbox-list','選擇部門'],['.service-original-translator-direct-list','通知原翻譯'],['details.service-admin-dropdown','通知人員'],['details.meeting-dropdown-select','選擇與會人員／部門'],['details.field-staff-dropdown','選擇外務人員']];
  for(const [selector,title] of lists)for(const source of form.querySelectorAll(selector))installMulti(modal,source,title,syncs);
  for(const source of form.querySelectorAll('.checkbox-list'))if(!source.closest('.pa-native-multi')&&source.querySelector('input[name="edit_executor"]'))installMulti(modal,source,'選擇執行人員',syncs);
  if(form.id==='scheduleForm'){
    const serviceTop=form.querySelector('[data-section="service-top"]'),actions=form.querySelector('.modal-actions');
    const toggle=btn('pa-advanced-toggle pa-enhancement','通知與其他設定　⌄');toggle.setAttribute('aria-expanded','false');if(serviceTop&&actions){actions.before(toggle);form.classList.add('pa-advanced-collapsed');toggle.onclick=()=>{const expanded=form.classList.toggle('pa-advanced-collapsed')===false;toggle.setAttribute('aria-expanded',String(expanded));toggle.textContent=expanded?'通知與其他設定　⌃':'通知與其他設定　⌄';if(expanded){const first=[...form.querySelectorAll('.notify-supervisor-field,.notify-original-translator-field,.service-admin-notify-field,.extra-schedule-box,.vehicle-doc-row,.service-general-address-field')].find(el=>el.getClientRects().length);first?.scrollIntoView({block:'center',behavior:'smooth'})}}}
    const save=actions?.querySelector('button[type=submit]');if(save)save.textContent='儲存行程';
  }
  const sync=()=>{for(const f of syncs)f()};form.addEventListener('change',()=>queueMicrotask(sync));form.addEventListener('input',()=>queueMicrotask(sync));sync();
}
