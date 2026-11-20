import {vocabulary,grammar,readings,practice} from './data/unit4.js';
import {listeningQuestions} from './data/audio.js';
export const $=(s,root=document)=>root.querySelector(s);
export const $$=(s,root=document)=>[...root.querySelectorAll(s)];
export const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const normal=s=>String(s).normalize('NFKC').toLowerCase().replace(/[’‘]/g,"'").replace(/[.,!?;:«»“”]/g,'').replace(/\s+/g,' ').trim();
export const shuffle=a=>{const b=[...a];for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]]}return b};
const key='english-world4-progress-v1';
const fresh=()=>({version:1,answers:{},drafts:{},challenge:[],listened:[],history:{},notes:'',updated:null});
let writable=true;
export let progress=fresh();
try{const p=JSON.parse(localStorage.getItem(key));if(p?.version===1&&p.answers&&typeof p.answers==='object'){progress={...fresh(),...p};if(!Array.isArray(progress.challenge))progress.challenge=[];if(!Array.isArray(progress.listened))progress.listened=[];if(!progress.history||typeof progress.history!=='object'||Array.isArray(progress.history))progress.history={};if(!progress.drafts||typeof progress.drafts!=='object')progress.drafts={}}}catch{writable=false}
export const state={teacher:false,unit:4,section:'learn'};
export function toast(message){const t=$('#toast');t.textContent=message;t.classList.add('visible');clearTimeout(toast.timer);toast.timer=setTimeout(()=>t.classList.remove('visible'),3200)}
export function save(){progress.updated=new Date().toISOString();try{localStorage.setItem(key,JSON.stringify(progress));writable=true}catch{writable=false;toast('Сохранение недоступно. Результаты действуют до закрытия страницы.')}updateSide()}
export function attempt(id,correct){if(state.teacher)return;const old=progress.answers[id];progress.answers[id]={attempts:(old?.attempts||0)+1,mastered:!!(old?.mastered||correct),firstCorrect:old?old.firstCorrect:correct,lastCorrect:correct};save()}
export function mastered(prefix){return Object.entries(progress.answers).filter(([k,v])=>k.startsWith(prefix)&&v.mastered).length}
export function resetUnit4Progress(){
 for(const id of Object.keys(progress.answers))if(/^(?:[vgrpl]\d+$|c-|extra-|history-)/.test(id))delete progress.answers[id];
 for(const id of Object.keys(progress.drafts)){
  if(id==='craft'||id==='reflection-u4'||id.startsWith('speaking')||id.startsWith('history-'))delete progress.drafts[id];
 }
 progress.challenge=progress.challenge.filter(item=>item.unit&&item.unit!==4);
 progress.history={};
 progress.listened=[];
 progress.notes='';
 save();
}
export function storageAvailable(){return writable}
export function updateSide(){
 const total=vocabulary.length+grammar.length+readings.flatMap(r=>r.questions).length+practice.length+listeningQuestions.length;
 const done=mastered('v')+mastered('g')+mastered('r')+mastered('p')+mastered('l');
 if($('#side-score'))$('#side-score').textContent=`${done} / ${total}`;
 if($('#side-progress')){$('#side-progress').max=total;$('#side-progress').value=done}
}
export const button=(label,cls='')=>`<button class="button ${cls}">${escape(label)}</button>`;
export function speech(text){if(!('speechSynthesis'in window)){toast('В этом браузере нет озвучивания. Используй записи в Listening.');return false}const voices=speechSynthesis.getVoices();const english=voices.find(v=>v.lang==='en-GB')||voices.find(v=>v.lang?.startsWith('en'));if(voices.length&&!english){toast('Английский голос не установлен в браузере. Используй записи Listening.');return false}speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang='en-GB';u.rate=.85;if(english)u.voice=english;u.onerror=()=>toast('Озвучивание недоступно. Используй записи в Listening.');speechSynthesis.speak(u);return true}
export function teacherAnswer(q,root){if(!state.teacher)return;const wrap=document.createElement('div');wrap.className='teacher-answer';wrap.innerHTML='<button class="button secondary small">Показать ответ учителю</button><div hidden></div>';const b=$('button',wrap),d=$('div',wrap);b.onclick=()=>{d.hidden=!d.hidden;d.textContent=`Ответ: ${q.answer}. ${q.explain||''}`;b.textContent=d.hidden?'Показать ответ учителю':'Скрыть ответ'};root.appendChild(wrap)}
export function renderQuestion(root,q,opts={}){
 let checked=false,solved=false,selected=[];
 root.innerHTML=`<div class="question-meta"><span>${escape(q.type==='order'?'Собери по порядку':q.type==='input'?'Впиши ответ':'Выбери ответ')}</span><span class="tag">${escape(opts.label||'Practice')}</span></div><p class="prompt">${escape(q.prompt)}</p><div class="interaction"></div><div class="feedback" role="status" aria-live="polite"></div>${q.hint&&!opts.exam?`<details class="hint"><summary>Подсказка</summary>${escape(q.hint)}</details>`:''}`;
 const box=$('.interaction',root),feedback=$('.feedback',root);
 const check=value=>{
  if((checked&&opts.exam)||solved)return;
  if(!normal(value)){feedback.className='feedback neutral';feedback.textContent='Сначала напиши или выбери ответ.';return}
  const correct=[q.answer,...(q.accept||[])].some(a=>normal(a)===normal(value));
  if(opts.record!==false&&(!checked||!opts.exam))attempt(q.id,correct);checked=true;solved=correct;
  feedback.className=`feedback ${opts.exam?'neutral':correct?'good':'bad'}`;
  feedback.textContent=opts.exam?'Ответ сохранён. Разбор появится в конце.':correct?`Верно! ${q.explain||''}`:'Пока не получилось. Попробуй ещё раз или открой разбор.';
  if(correct&&!opts.exam){$('.review-answer',root)?.remove();root.classList.remove('good-flash');void root.offsetWidth;root.classList.add('good-flash')}
  if(opts.exam||correct)$$('button,input',box).forEach(el=>el.disabled=true);
  if(!correct&&!opts.exam&&!$('.review-answer',root)){
   const reveal=document.createElement('button');reveal.className='button secondary small review-answer';reveal.textContent='Разобрать ответ';reveal.onclick=()=>{feedback.textContent=`${q.answer}. ${q.explain||''}`;reveal.remove()};root.appendChild(reveal)
  }
  opts.onAnswer?.(correct,value);
  return correct;
 };
 if(q.type==='input'){
  box.innerHTML='<label class="input-label">Твой ответ<input class="answer-input" autocomplete="off" spellcheck="false" autocapitalize="off"></label><button class="button">Проверить</button>';
  $('button',box).onclick=()=>check($('input',box).value);$('input',box).onkeydown=e=>{if(e.key==='Enter')check(e.target.value)};
 }else if(q.type==='order'){
  const tokens=q.tokens||q.answer.split(' ');let bank=shuffle(tokens.map((word,i)=>({word,i})));
  const draw=()=>{box.innerHTML='<div class="answer-zone" aria-label="Твоё предложение"></div><div class="bank" aria-label="Слова для выбора"></div><button class="button check-order">Проверить</button> <button class="button secondary clear-order">Сначала</button>';
   for(const [arr,zone]of [[selected,'.answer-zone'],[bank,'.bank']])arr.forEach(t=>{const b=document.createElement('button');b.className='tile';b.textContent=t.word;b.onclick=()=>{if(solved||checked&&opts.exam)return;if(arr===bank){bank=bank.filter(x=>x.i!==t.i);selected.push(t)}else{selected=selected.filter(x=>x.i!==t.i);bank.push(t)}draw()};$(zone,box).appendChild(b)});
   $('.check-order',box).onclick=()=>check(selected.map(x=>x.word).join(q.joiner??' '));$('.clear-order',box).onclick=()=>{bank=shuffle([...bank,...selected]);selected=[];draw()};
  };draw();
 }else{
  box.innerHTML=`<div class="options ${q.options?.length>4?'compact':''}"></div>`;(q.options||[]).forEach(option=>{const b=document.createElement('button');b.className='option';b.textContent=option;b.onclick=()=>{if(solved||checked&&opts.exam)return;const correct=check(option);if(!opts.exam){$$('.option',box).forEach(x=>x.classList.remove('correct','wrong'));b.classList.add(correct?'correct':'wrong')}};$('.options',box).appendChild(b)})
 }
 if(!opts.exam)teacherAnswer(q,root);
}
export function audioMarkup(track){return `<article class="card track-card"><div class="audio-name"><span class="audio-icon">♫</span><div><strong>${escape(track.title)}</strong><div class="source">${escape(track.source||'English World 4')} · ${escape(track.file)}</div></div></div><audio controls preload="none" src="assets/audio/${escape(track.file)}" aria-label="${escape(track.title)}"></audio><div class="audio-controls"><label>Скорость <select aria-label="Скорость воспроизведения"><option value="1">1×</option><option value="0.85">0.85×</option><option value="0.7">0.7×</option></select></label><button class="button secondary small repeat-audio">Повторить сначала</button></div><div class="audio-error note" role="status"></div></article>`}
export function bindAudio(root=document){$$('.track-card',root).forEach(card=>{const a=$('audio',card);a.preservesPitch=true;$('select',card).onchange=e=>a.playbackRate=Number(e.target.value);$('.repeat-audio',card).onclick=()=>{a.currentTime=0;a.play().catch(()=>toast('Нажми кнопку воспроизведения в плеере.'))};a.onplay=()=>$$('audio').forEach(other=>{if(other!==a)other.pause()});a.onerror=()=>{$('.audio-error',card).textContent='Запись не загрузилась. Проверь соединение и повтори.'};a.onended=()=>{const file=a.getAttribute('src').split('/').pop();if(!state.teacher&&!progress.listened.includes(file)){progress.listened.push(file);save()}}})}
export function cleanupMedia(){if('speechSynthesis'in window)speechSynthesis.cancel();$$('audio').forEach(a=>a.pause())}
export function quizBank(root,questions,{title='Practice'}={}){
 if(!questions.length){root.innerHTML='<p class="note">Здесь пока нет заданий для повторения.</p>';return}
 let index=0;const draw=()=>{root.innerHTML=`<div class="question-meta"><span>${escape(title)} · ${index+1} / ${questions.length}</span><span class="mastered-count">Освоено ${questions.filter(q=>progress.answers[q.id]?.mastered).length} / ${questions.length}</span></div><progress max="${questions.length}" value="${index+1}"></progress><div class="question-stage"></div><div class="question-controls"><button class="button secondary prev">Предыдущее</button><label class="small">Задание <select aria-label="Номер задания">${questions.map((q,i)=>`<option value="${i}" ${i===index?'selected':''}>${i+1}</option>`).join('')}</select></label><button class="button next">Следующее</button></div>`;renderQuestion($('.question-stage',root),questions[index],{label:title,onAnswer:()=>{const counter=$('.mastered-count',root);if(counter)counter.textContent=`Освоено ${questions.filter(q=>progress.answers[q.id]?.mastered).length} / ${questions.length}`}});$('.prev',root).disabled=index===0;$('.next',root).disabled=index===questions.length-1;$('.prev',root).onclick=()=>{index--;draw()};$('.next',root).onclick=()=>{index++;draw()};$('select',root).onchange=e=>{index=+e.target.value;draw()}};draw()
}
