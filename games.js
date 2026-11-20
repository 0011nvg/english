import {vocabulary,grammar,gameModes,processSteps} from './data/unit4.js?v=4';
import {processStepsRu} from './data/unit4-support.js?v=4';
import {$,$$,escape,shuffle,normal,state,progress,attempt,renderQuestion,speech,teacherTranslation,toast} from './core.js?v=5';
let timer=null,delayed=null;
export function stopGame(){clearInterval(timer);clearTimeout(delayed);timer=null}
export const vocabularyModes=[
 ['translate','Выбери перевод','Найди русский перевод английского слова','◈'],
 ['tf','Верно или неверно?','Проверь пару «слово — перевод»','✓'],
 ['spell','Напиши слово','Вспомни английское слово и набери его','✎'],
 ['match','Найди пары','Соедини английские слова и их переводы','▦']
];
const choice=(w,prompt,answer,options)=>({id:w.id,prompt,answer,options,type:'choice',explain:`${w.en} — ${w.ru}.`,teacherRu:[`${w.en} /${w.ipa}/ — ${w.ru}.`,w.exampleRu]});
function wordQuestion(w,mode){
 const others=shuffle(vocabulary.filter(x=>x.id!==w.id)).slice(0,3);
 if(mode==='spell')return {id:w.id,type:'input',prompt:`Напиши по-английски: ${w.ru}`,answer:w.en,explain:`${w.en} /${w.ipa}/ — ${w.ru}. ${w.example}`,teacherRu:[w.exampleRu]};
 if(mode==='missing'){const chars=[...w.en].map((c,i)=>i%2&&/[a-z]/.test(c)?'_':c).join('');return {id:w.id,type:'input',prompt:`Восстанови слово: ${chars} · ${w.ru}`,answer:w.en,explain:w.example,teacherRu:[w.exampleRu],hint:'Впиши слово целиком.'}}
 if(mode==='builder')return {id:w.id,type:'order',prompt:`Собери слово: ${w.ru}`,answer:w.en,tokens:[...w.en],joiner:'',explain:w.example,teacherRu:[w.exampleRu]};
 if(mode==='tf'){const right=Math.random()>.5;const translation=right?w.ru:others[0].ru;return choice(w,`${w.en} — ${translation}. Верно?`,right?'Верно':'Неверно',['Верно','Неверно'])}
 if(mode==='listen')return choice(w,'Послушай слово и выбери его написание.',w.en,shuffle([w.en,...others.map(x=>x.en)]));
 return choice(w,`Как переводится ${w.en}?`,w.ru,shuffle([w.ru,...others.map(x=>x.ru)]));
}
export function renderGame(root,mode,onBack,{reviewOnly=false,vocabularyMode=false,backLabel='Все игры'}={}){
 stopGame();const info=(vocabularyMode?vocabularyModes:gameModes).find(g=>g[0]===mode);let difficulty='calm';
 const start=()=>{
  stopGame();root.innerHTML=`<div class="game-header"><div><span class="section-label">PLAY & LEARN</span><h2>${escape(info[1])}</h2></div><button class="button secondary exit">${escape(backLabel)}</button></div><div class="row"><label class="small">Уровень <select class="difficulty"><option value="calm">Спокойно · 6 заданий</option><option value="brave">Смелее · 10 заданий</option></select></label><span class="score-pill">0 баллов</span></div><div class="game-body"></div>`;
  $('.exit',root).onclick=()=>{stopGame();onBack()};$('.difficulty',root).value=difficulty;$('.difficulty',root).onchange=e=>{difficulty=e.target.value;start()};
  let candidates=vocabulary;if(reviewOnly){candidates=vocabulary.filter(w=>progress.answers[w.id]&&!progress.answers[w.id].lastCorrect);if(!candidates.length){$('.game-body',root).innerHTML='<div class="card"><h3>Сейчас нет слов с ошибками</h3><p>Выполняй задания — слова для повторения появятся здесь.</p></div>';return}}
  const n=difficulty==='calm'?6:10;const words=shuffle(candidates).slice(0,n);const body=$('.game-body',root);
  if(mode==='flash'){let i=0,flipped=false;const draw=()=>{const w=words[i];body.innerHTML=`<p class="note">Карточка ${i+1} / ${words.length} · Нажми, чтобы перевернуть. Карточки для знакомства; баллы дают задания.</p><button class="word-card"><span class="word-icon">${w.icon}</span><strong>${escape(flipped?w.ru:w.en)}</strong><span>${escape(flipped?w.example:'Нажми, чтобы увидеть перевод')}</span></button>${teacherTranslation('Перевод примера для учителя',[w.example+' — '+w.exampleRu])}<div class="word-controls"><button class="button secondary previous">Предыдущая</button><button class="button pronounce">♫ Произнести</button><button class="button secondary next">Следующая</button></div><p class="note">Озвучивание голосом браузера, если доступен английский голос.</p>`;$('.word-card',body).onclick=()=>{flipped=!flipped;draw()};$('.previous',body).onclick=()=>{i=(i-1+words.length)%words.length;flipped=false;draw()};$('.next',body).onclick=()=>{i=(i+1)%words.length;flipped=false;draw()};$('.pronounce',body).onclick=()=>speech(w.en)};draw();return}
  if(mode==='memory'){renderMemory(body,words.slice(0,4),root,start);return}
  if(mode==='match'){renderMatch(body,words.slice(0,5),root,start);return}
  if(mode==='maze'){renderMaze(body,root,start,difficulty,candidates);return}
  let questions=words.map(w=>wordQuestion(w,mode));
  if(['battle','boss'].includes(mode))questions=shuffle(grammar).slice(0,n).map(q=>({...q}));
  if(mode==='boss')questions=shuffle([...questions.slice(0,5),...words.slice(0,5).map(w=>wordQuestion(w,'tf'))]);
  if(mode==='mistake')questions=shuffle(grammar.filter(q=>['g8','g18','g19','g20','g21','g22'].includes(q.id)));
  if(mode==='sentence')questions=words.map(w=>({id:w.id,type:'order',prompt:`Собери предложение со словом ${w.en}.`,answer:w.example.replace(/[.!?]/g,''),explain:w.ru,teacherRu:[w.exampleRu]}));
  if(mode==='puzzle')questions=[{id:'extra-pot-process',type:'order',prompt:'Выстрой этапы изготовления горшка.',answer:processSteps.join(' · '),tokens:processSteps,joiner:' · ',explain:'Сначала подготовка глины, затем форма, сушка и роспись.',teacherRu:processStepsRu},...grammar.filter(q=>q.type==='order')];
  if(mode==='picture'){const picWords=vocabulary.filter(w=>['bowl','candle','knife','thread','vase','wheel'].includes(w.en));questions=shuffle(picWords).map(w=>choice(w,`Выбери изображение: ${w.en}`,w.icon,shuffle([w,...shuffle(picWords.filter(o=>o.id!==w.id)).slice(0,3)]).map(x=>x.icon)))}
  if(mode==='detective')questions=[
   {id:'extra-detective1',prompt:'Улика 1: I use clay and a wheel. Who am I?',answer:'a potter',options:['a potter','a weaver','a candle maker'],explain:'Глина и круг нужны гончару.',teacherRu:['Я использую глину и гончарный круг. Кто я?','a potter — гончар · a weaver — ткач · a candle maker — мастер по изготовлению свечей']},
   {id:'extra-detective2',prompt:'Улика 2: I push wool between threads. What do I use?',answer:'a loom',options:['a mould','a loom','an oven'],explain:'Ткань делают на ткацком станке.',teacherRu:['Я продеваю шерсть между нитями. Что я использую?','a mould — форма для отливки · a loom — ткацкий станок · an oven — печь']},
   {id:'extra-detective3',prompt:'Улика 3: The string gets fatter when I dip it many times. What am I making?',answer:'a candle',options:['a candle','a basket','a bowl'],explain:'Слои воска образуют свечу.',teacherRu:['Бечёвка становится толще, когда я окунаю её несколько раз. Что я делаю?','a candle — свечу · a basket — корзину · a bowl — миску']},
   {id:'extra-detective4',prompt:'Твой выбор: You found cold, hard wax in a mould. What happens next?',answer:'Open the mould',options:['Open the mould','Weave the wax','Put it on a loom'],explain:'Когда воск остыл и затвердел, форму можно открыть.',teacherRu:['В форме холодный, твёрдый воск. Что делать дальше?','Открыть форму · сплести воск · положить его на ткацкий станок']}
  ];
  let index=0,score=0,remaining=60,finished=false;
  const frames=new Map();
  const solved=new Set();
  const redrawScore=()=>{$('.score-pill',root).textContent=`${score} баллов`};
  const finish=()=>{
   if(finished)return;
   finished=true;
   stopGame();
   body.innerHTML=`<div class="card yellow"><h2>Раунд завершён</h2><div class="stat">${score} / ${questions.length*10}</div>
    <p>${solved.size} из ${questions.length} заданий завершено. Баллы начисляются за верный ответ с первой попытки.</p>
    <div class="row"><button class="button restart">Сыграть ещё</button><button class="button secondary back">${escape(backLabel)}</button></div></div>`;
   $('.restart',body).onclick=start;
   $('.back',body).onclick=onBack;
  };
  function makeFrame(step){
   const frame=document.createElement('section');
   frame.innerHTML=`<div class="question-meta" style="margin-top:20px"><span>Задание ${step+1} / ${questions.length}</span>
    ${mode==='speed'?`<span class="timer">${difficulty==='brave'?remaining+' сек.':'Без таймера'}</span>`:''}</div>
    ${['race','battle','boss'].includes(mode)?`<div class="race-track"><span class="race-marker" style="margin-left:${step/questions.length*85}%">${mode==='race'?'🚲':mode==='boss'?'🐉':'⭐'}</span></div>`:''}
    <div class="question-stage" tabindex="-1"></div><div class="game-next row">
     <button class="button secondary prev-item" ${step===0?'disabled':''}>Предыдущее задание</button>
     <button class="button next-item" disabled>${step+1===questions.length?'Завершить':'Следующее задание'}</button>
    </div>`;
   const stage=$('.question-stage',frame);
   const next=$('.next-item',frame);
   let first=true;
   function loadQuestion(q){
    renderQuestion(stage,q,{label:info[1],onAnswer(correct){
     if(first&&correct){score+=10;redrawScore()}
     first=false;
     if(correct){solved.add(step);next.disabled=false}
    }});
    if(mode==='listen'){
     const button=document.createElement('button');
     button.className='button secondary';
     button.textContent='♫ Послушать слово';
     button.onclick=()=>speech(words[step].en);
     stage.insertBefore(button,$('.prompt',stage));
    }
   }
   if(mode==='mystery'){
    stage.innerHTML='<p>Выбери коробку — внутри задание.</p><div class="mystery-grid">'+[1,2,3].map(i=>`<button aria-label="Открыть коробку ${i}">🎁</button>`).join('')+'</div>';
    $$('button',stage).forEach(button=>button.onclick=()=>loadQuestion(shuffle([...grammar,...words.map(w=>wordQuestion(w,'tf'))])[0]));
   }else loadQuestion(questions[step]);
   $('.prev-item',frame).onclick=()=>move(-1);
   next.onclick=()=>move(1);
   return frame;
  }
  function show(){
   if(index===questions.length){finish();return}
   if(!frames.has(index))frames.set(index,makeFrame(index));
   body.replaceChildren(frames.get(index));
   const clock=$('.timer',body);
   if(clock&&difficulty==='brave')clock.textContent=remaining+' сек.';
  }
  function move(delta){
   index+=delta;
   show();
   $('.question-stage',body)?.focus({preventScroll:true});
  }
  show();
  if(mode==='speed'&&difficulty==='brave'){timer=setInterval(()=>{remaining--;const t=$('.timer',body);if(t)t.textContent=`${remaining} сек.`;if(remaining<=0)finish()},1000)}
 };start()
}
function renderMemory(body,words,root,restart){
 let first=null,busy=false,matched=0,tries=0;const deck=shuffle(words.flatMap(w=>[{key:w.id,text:w.en,side:'en'},{key:w.id,text:w.ru,side:'ru'}]));
 body.innerHTML='<p class="note">Найди пары «слово — перевод». Одновременно можно открыть две карточки.</p><div class="memory-grid"></div><p class="memory-status" role="status">0 пар</p><button class="button secondary restart-memory">Сначала</button>';
 deck.forEach((item,i)=>{const b=document.createElement('button');b.className='memory-tile';b.textContent='✦';b.setAttribute('aria-label',`Закрытая карточка ${i+1}`);b.onclick=()=>{if(busy||b.classList.contains('done')||first?.button===b)return;b.textContent=item.text;b.classList.add('open');b.setAttribute('aria-label',item.text);if(!first){first={item,button:b};return}tries++;if(first.item.key===item.key&&first.item.side!==item.side){b.classList.add('done');first.button.classList.add('done');b.disabled=first.button.disabled=true;matched++;attempt(item.key,true);first=null;$('.memory-status',body).textContent=`${matched} / ${words.length} пар · ${tries} попыток`;}else{attempt(first.item.key,false);attempt(item.key,false);busy=true;const previous=first.button;delayed=setTimeout(()=>{[b,previous].forEach(x=>{x.textContent='✦';x.classList.remove('open');x.setAttribute('aria-label','Закрытая карточка')});first=null;busy=false},900)}$('.score-pill',root).textContent=`${matched*10} баллов`;if(matched===words.length)toast('Все пары найдены!')};$('.memory-grid',body).appendChild(b)});$('.restart-memory',body).onclick=restart
}
function renderMatch(body,words,root,restart){
 let selected=null,matched=0;body.innerHTML='<p>Сначала выбери английское слово, затем его перевод.</p><div class="match-grid"><div class="match-col en"></div><div class="match-col ru"></div></div><p class="match-status" role="status">0 пар</p><button class="button secondary restart-match">Сначала</button>';
 for(const side of ['en','ru'])shuffle(words).forEach(w=>{const b=document.createElement('button');b.className='option';b.textContent=w[side];b.onclick=()=>{if(b.disabled)return;if(side==='en'){if(selected)selected.button.classList.remove('selected');selected={w,button:b};b.classList.add('selected');return}if(!selected){toast('Сначала выбери английское слово.');return}const correct=selected.w.id===w.id;attempt(selected.w.id,correct);if(correct){b.disabled=selected.button.disabled=true;b.classList.add('correct');selected.button.classList.remove('selected');selected.button.classList.add('correct');matched++;$('.match-status',body).textContent=`${matched} / ${words.length} пар`;$('.score-pill',root).textContent=`${matched*10} баллов`;selected=null;if(matched===words.length)toast('Все пары найдены!')}else toast('Эта пара не совпала. Попробуй ещё.');};$('.'+side,body).appendChild(b)});$('.restart-match',body).onclick=restart
}
function renderMaze(body,root,restart,difficulty,words){
 const width=difficulty==='brave'?5:4,total=width*width,walls=new Set(width===4?[1,5,10]:[1,6,11,13,18,21]);let position=0,steps=0,visited=new Set([0]);
 const neighbours=i=>[i-width,i+width,i%width?i-1:-1,i%width<width-1?i+1:-1].filter(n=>n>=0&&n<total&&!walls.has(n));
 const draw=()=>{
  body.innerHTML=`<p class="note">Доберись до флажка. Нажми соседнюю светлую клетку и реши задание, чтобы перейти. Можно выбрать другой путь.</p><div class="maze-board" style="grid-template-columns:repeat(${width},1fr)">${Array.from({length:total},(_,i)=>`<button class="maze-cell ${i===position?'current':visited.has(i)?'visited':''}" data-cell="${i}" ${walls.has(i)||!neighbours(position).includes(i)?'disabled':''} aria-label="Клетка ${Math.floor(i/width)+1}, ${i%width+1}${i===total-1?', финиш':''}" style="${walls.has(i)?'background:#77718c;opacity:1':''}">${walls.has(i)?'':i===position?'🐾':i===total-1?'⚑':visited.has(i)?'✿':'·'}</button>`).join('')}</div><div class="maze-question"></div>`;
  $$('[data-cell]',body).forEach(b=>b.onclick=()=>{const target=+b.dataset.cell;if(!neighbours(position).includes(target))return;const w=words[target%words.length];const area=$('.maze-question',body);area.className='maze-question question-stage';renderQuestion(area,wordQuestion(w,'match'),{label:'Open the path',onAnswer:correct=>{if(!correct)return;position=target;visited.add(target);steps++;$('.score-pill',root).textContent=`${steps*10} баллов`;if(target===total-1){body.innerHTML=`<div class="card yellow"><h2>Ты нашёл выход! ✿</h2><p>${steps} переходов. Каждая открытая клетка — верный ответ.</p><button class="button restart-maze">Новый маршрут</button></div>`;$('.restart-maze',body).onclick=restart}else draw()}})})
 };draw()
}
