// Desktop-only presentation. Original inputs remain the source of truth.
const desktop = () => matchMedia('(min-width:769px) and (pointer:fine)').matches
const el = (tag, cls, text) => { const n = document.createElement(tag); n.className = cls; if (text != null) n.textContent = text; return n }
const button = (text, cls='dc-button') => {const n=el('button',cls,text); n.type='button'; return n}
const change = input => input.dispatchEvent(new Event('change',{bubbles:true}))
const name = input => {
  const label = input.closest('label')
  const copy = (label?.querySelector('span') || label)?.cloneNode(true)
  copy?.querySelectorAll('small,input').forEach(n=>n.remove())
  return (copy?.textContent || input.value).split('｜')[0].trim()
}
let activeClose
function popup(anchor, host, title, build) {
  activeClose?.()
  const panel=el('section','dc-popup')
  panel.setAttribute('role','dialog'); panel.setAttribute('aria-label',title)
  const head=el('div','dc-popup-head'), close=button('×')
  head.append(el('strong','',title),close); panel.append(head); host.append(panel)
  anchor.setAttribute('aria-expanded','true')
  const dismiss=()=>{panel.remove();anchor.setAttribute('aria-expanded','false');document.removeEventListener('pointerdown',outside,true);document.removeEventListener('keydown',key,true);window.removeEventListener('resize',dismiss);if(activeClose===dismiss)activeClose=null}
  const outside=e=>{if(!panel.contains(e.target)&&!anchor.contains(e.target))dismiss()}
  const key=e=>{if(e.key==='Escape'){e.stopPropagation();dismiss();anchor.focus()}}
  close.onclick=dismiss; activeClose=dismiss
  document.addEventListener('pointerdown',outside,true);document.addEventListener('keydown',key,true);window.addEventListener('resize',dismiss)
  build(panel,dismiss)
  const r=anchor.getBoundingClientRect(), width=Math.min(Math.max(r.width,300),420,window.innerWidth-24)
  panel.style.width=width+'px';panel.style.left=Math.max(12,Math.min(r.left,window.innerWidth-width-12))+'px'
  const h=panel.getBoundingClientRect().height
  panel.style.top=Math.max(12,Math.min(r.bottom+6,window.innerHeight-h-12))+'px'
  panel.querySelector('input[type=search]')?.focus({preventScroll:true})
}
function search(panel, placeholder, onChange){
  const input=el('input','dc-search');input.type='search';input.placeholder=placeholder;input.setAttribute('aria-label',placeholder);input.autocomplete='off';input.onkeydown=e=>{if(e.key==='Enter')e.preventDefault()};input.oninput=()=>onChange(input.value.trim().toLowerCase());panel.append(input)
}
function multi(anchor,host,source,title,{overview=false,group=false,extra=false}={}){
  const all=[...source.querySelectorAll('input[type=checkbox]')]
  const selected=new Set(all.filter(i=>i.checked));let query=''
  popup(anchor,host,title,(panel,dismiss)=>{
    const actions=el('div','dc-popup-actions'),list=el('div','dc-options'),foot=el('div','dc-popup-actions')
    if(extra) list.classList.add('dc-options-grid')
    const allBtn=button('全選'),clear=button('清除'),count=el('span','dc-count'),apply=button('套用','dc-button dc-primary')
    const visible=()=>all.filter(i=>name(i).toLowerCase().includes(query))
    const draw=()=>{
      list.replaceChildren();let previous=null
      for(const input of visible()){
        const dept=group?input.closest('label')?.dataset.choiceDepartment:''
        if(dept&&dept!==previous){list.append(el('div','dc-option-heading',dept));previous=dept}
        const row=button(name(input),'dc-option');row.setAttribute('aria-pressed',String(selected.has(input)));row.disabled=input.disabled
        row.onclick=()=>{selected.has(input)?selected.delete(input):selected.add(input);draw()}
        list.append(row)
      }
      if(!list.children.length)list.append(el('p','dc-count','沒有符合的選項'))
      count.textContent='已選 '+selected.size+(extra?' 項':' 位／項')
    }
    search(panel,extra?'搜尋附加行程':title.includes('部門')?'搜尋部門':'搜尋姓名',v=>{query=v;draw()})
    allBtn.onclick=()=>{visible().filter(i=>!i.disabled).forEach(i=>selected.add(i));draw()}
    clear.onclick=()=>{all.filter(i=>!i.disabled).forEach(i=>selected.delete(i));draw()}
    actions.append(allBtn,clear);foot.append(count,apply);panel.append(actions,list,foot);draw()
    apply.onclick=()=>{
      if(overview){for(const i of all)if(!i.disabled)i.checked=selected.has(i);dismiss();const form=source.closest('form');form.dataset.desktopFilterApply='1';form.requestSubmit()}
      else {for(const i of all)if(!i.disabled&&i.checked!==selected.has(i)){i.checked=selected.has(i);change(i)}dismiss()}
    }
  })
}
export function enhanceDesktopCreate(modal){
  const form=modal.querySelector('#scheduleForm');if(!form||!desktop())return
  const syncs=[]
  for(const select of form.querySelectorAll('select')){
    if(select.multiple|| /(?:_hour|_minute)$/.test(select.name))continue
    const direct=['repeat_mode','time_type','has_documents'].includes(select.name)
    const wrap=el('div',direct?'dc-segments':'dc-trigger-wrap')
    select.classList.add('dc-source');select.after(wrap)
    if(direct){
      const sync=()=>{const options=[...select.options];if(wrap.children.length!==options.length||options.some((o,i)=>wrap.children[i]?.dataset.value!==o.value)){wrap.replaceChildren(...options.map(o=>{const b=button(o.textContent.trim(),'dc-button');b.dataset.value=o.value;b.onclick=e=>{e.preventDefault();select.value=o.value;change(select)};return b}))}options.forEach((o,i)=>{const b=wrap.children[i];b.setAttribute('aria-pressed',String(o.value===select.value));b.disabled=select.disabled||o.disabled})}
      syncs.push(sync)
    }else{
      const b=button('','dc-trigger');wrap.append(b)
      const sync=()=>{b.textContent=select.selectedOptions[0]?.textContent.trim()||'請選擇';b.disabled=select.disabled}
      syncs.push(sync)
      b.onclick=e=>{e.preventDefault();popup(b,modal,select.closest('label')?.firstChild?.textContent.trim()||'選擇項目',(panel,dismiss)=>{
        const list=el('div','dc-options');const draw=q=>{list.replaceChildren(...[...select.options].filter(o=>o.textContent.toLowerCase().includes(q)).map(o=>{const item=button(o.textContent.trim(),'dc-option');item.disabled=o.disabled;item.setAttribute('aria-pressed',String(o.value===select.value));item.onclick=()=>{select.value=o.value;change(select);dismiss()};return item}))};search(panel,'搜尋選項',draw);panel.append(list);draw('')
      })}
    }
  }
  const types=[['#scheduleAssigneeBlock .checkbox-list','選擇人員'],['.pa-supervisor-list','通知主管'],['.service-original-translator-direct-list','通知原翻譯'],['details.service-admin-dropdown:not(.maintenance-notify-dropdown)','通知行政'],['details.maintenance-notify-dropdown','通知相關人員'],['.service-extra-check-list','附加行程']]
  for(const [selector,title] of types) for(const source of form.querySelectorAll(selector)){
    const b=button('','dc-trigger dc-multi-trigger');source.before(b);source.classList.add('dc-source')
    const sync=()=>{const picked=[...source.querySelectorAll('input[type=checkbox]:checked')];b.textContent=picked.length?'已選 '+picked.length+' 項｜'+picked.slice(0,2).map(name).join('、')+(picked.length>2?'…':''):title==='附加行程'?'選擇附加行程（選填）':title+'（未選）'}
    syncs.push(sync);b.onclick=()=>multi(b,modal,source,title,{extra:title==='附加行程'})
  }
  const sync=()=>syncs.forEach(fn=>fn())
  form.addEventListener('change',()=>queueMicrotask(sync));sync()
  modal.addEventListener('click',e=>{if(e.target.closest('#closeModalBtn,#cancelModalBtn'))activeClose?.()})
}
export function bindDesktopOverview(form){
  for(const details of form.querySelectorAll('[data-overview-filter-panel]')){
    const summary=details.querySelector('summary')
    summary.addEventListener('click',e=>{
      if(!desktop()||details.classList.contains('is-disabled-filter'))return
      e.preventDefault()
      const staff=details.dataset.overviewFilterPanel==='staff'
      multi(summary,form,details,staff?'選擇人員':'選擇部門',{overview:true,group:staff})
    })
  }
}
