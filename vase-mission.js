import {$,$$,escape,progress,renderQuestion,save,shuffle,speech,state,teacherTranslation} from './core.js?v=5';
import {vaseMissionKey,vaseWords,vaseGrammar,vaseClue,vaseEndings} from './data/vase-mission.js';

const stepTitles=['След в мастерской','Слова рыцаря','Записка гончара','Доклад королю'];
const fresh=()=>({step:0,word:0,grammar:0,seen:false,dialogue:false,clue:false,ending:'',draft:'',finished:false});
const illustration=(image,alt)=>`<img class="vase-mission-art" src="assets/images/${image}.webp" alt="${alt}" width="768" height="512">`;
const button=(label,className)=>`<button type="button" class="button ${className}">${label}</button>`;

export function vaseMissionEntry(){
 const player=progress.drafts[vaseMissionKey];
 const label=player?.finished?'Посмотреть итог миссии':player?'Продолжить миссию':'Начать миссию на 15 минут';
 return `<a class="button" href="#4/mission">${label}</a>`;
}

export function renderVaseMission(root){
 let player={...fresh(),...progress.drafts[vaseMissionKey]};

 function persist(){
  if(state.teacher)return;
  progress.drafts[vaseMissionKey]={...player};
  save();
 }

 function go(step){
  player.step=step;
  persist();
  render(true);
 }

 function render(focus=false){
  if(player.finished){
   const ending=vaseEndings.find(item=>item.id===player.ending)??vaseEndings[0];
   root.innerHTML=`<section class="card yellow vase-finish">
    <h1 tabindex="-1">Дело раскрыто!</h1>
    <p>Ты назвал предметы, нашёл улику в записке и рассказал королю, где была ваза.</p>
    <p class="vase-final-line" lang="en">${escape(player.draft.trim()||ending.line)}</p>
    ${teacherTranslation('Перевод образца для учителя',[ending.lineRu])}
    <div class="row"><a class="button" href="#4/games">К играм</a><a class="button secondary" href="#4/learn">План юнита</a>
    ${button('Сыграть ещё раз','secondary replay-mission')}</div>
   </section>`;
   $('.replay-mission',root).onclick=()=>{player=fresh();go(0)};
   if(focus)$('h1',root).focus();
   return;
  }

  root.innerHTML=`<header class="vase-heading">
    <div class="question-meta"><b>Шаг ${player.step+1} из ${stepTitles.length}</b><span>Около 15 минут</span></div>
    <progress value="${player.step}" max="${stepTitles.length}" aria-label="Завершённые шаги миссии"></progress>
    <h1 lang="en">The Missing Vase</h1>
    <h2 tabindex="-1">${stepTitles[player.step]}</h2>
  </header>
  <div class="vase-stage"></div>
  <div class="row vase-nav">
   ${player.step?button('Предыдущий шаг','secondary vase-back'):'<a class="button secondary" href="#4/learn">К плану юнита</a>'}
   <button type="button" class="button vase-next" disabled>${player.step===3?'Раскрыть дело':'Следующий шаг'}</button>
  </div>`;
  const stage=$('.vase-stage',root);
  const next=$('.vase-next',root);
  const setReady=ready=>{next.disabled=!ready};
  [words,grammar,reading,ending][player.step](stage,setReady);
  $('.vase-back',root)?.addEventListener('click',()=>go(player.step-1));
  next.onclick=()=>{
   if(player.step<3){go(player.step+1);return}
   player.finished=true;
   persist();
   render(true);
  };
  if(focus)$('h2',root).focus();
 }

 function words(stage,setReady){
  const warmup={
   id:'mission-vase',type:'choice',prompt:'What is the knight making?',
   options:shuffle(['A vase','A candle','A basket']),answer:'A vase',
   explain:'Рыцарь пытается сделать вазу. Запомни предметы, которые помогут её найти.',
   teacherRu:['Что делает рыцарь? Вазу, свечу или корзину?']
  };
  stage.innerHTML=`<div class="vase-layout">
   ${illustration('knight-wheel','Рыцарь у гончарного круга')}
   <section class="card"><p>Рыцарь сделал вазу для короля, но она пропала. Что он делал в мастерской?</p>
    <div class="vase-question"></div>
    <div class="vase-words" ${player.seen?'':'hidden'}>
     <h3>Шесть слов для расследования</h3>
     <div class="vase-word" aria-live="polite"></div>
     <div class="row">
      ${button('Предыдущее слово','secondary word-back')}
      ${button('Следующее слово','secondary word-next')}
      ${button('Послушать','secondary word-say')}
     </div>
    </div>
   </section></div>`;
  const showWord=()=>{
   const [en,ru,ipa]=vaseWords[player.word];
   $('.vase-word',stage).innerHTML=`<span class="small">${player.word+1} из ${vaseWords.length}</span>
    <strong lang="en">${en}</strong><span>/${ipa}/ · ${ru}</span>`;
   $('.word-back',stage).disabled=player.word===0;
   $('.word-next',stage).disabled=player.word===vaseWords.length-1;
   setReady(player.seen&&player.word===vaseWords.length-1);
  };
  const question=$('.vase-question',stage);
  if(player.seen)question.innerHTML='<p class="feedback good">Да, это ваза — <b lang="en">a vase</b>.</p>';
  else renderQuestion(question,warmup,{record:false,label:'Warm-up',onAnswer(correct){
   if(!correct)return;
   player.seen=true;
   persist();
   $('.vase-words',stage).hidden=false;
   showWord();
  }});
  for(const [selector,delta] of [['.word-back',-1],['.word-next',1]]){
   $(selector,stage).onclick=()=>{player.word+=delta;persist();showWord()};
  }
  $('.word-say',stage).onclick=()=>speech(vaseWords[player.word][0]);
  showWord();
 }

 function grammar(stage,setReady){
  stage.innerHTML=`<section class="card">
   <p>Рыцарю нужно рассказать, что произошло. Восстанови три фразы с <b lang="en">when</b>.</p>
   <div class="vase-grammar-question"></div>
  </section>`;
  const area=$('.vase-grammar-question',stage);
  function exercise(focus=false){
   if(player.grammar>=vaseGrammar.length){
    area.innerHTML=`<div class="speech-support"><h3 tabindex="-1">Спроси напарника</h3>
     <p lang="en"><b>Is there anything in the basket?</b><br>There is a ___ in the basket.</p>
     <p>Задай вопрос и ответь на него вслух. Вставь одно из шести слов.</p>
     ${teacherTranslation('Перевод диалога для учителя',['В корзине есть что-нибудь?','В корзине есть ___.'])}
     ${button(player.dialogue?'Диалог готов ✓':'Я сказал две реплики','secondary vase-dialogue')}
    </div>`;
    $('.vase-dialogue',area).disabled=player.dialogue;
    $('.vase-dialogue',area).onclick=()=>{
     player.dialogue=true;
     persist();
     exercise(true);
    };
    setReady(player.dialogue);
    if(focus)$('h3',area).focus();
    return;
   }
   const step=player.grammar;
   area.innerHTML=`<p class="section-label" tabindex="-1">Фраза ${step+1} из ${vaseGrammar.length}</p><div class="vase-question"></div>
    <button type="button" class="button secondary grammar-next" disabled>${step===vaseGrammar.length-1?'К диалогу':'Следующая фраза'}</button>`;
   const question=vaseGrammar[step];
   const onward=$('.grammar-next',area);
   renderQuestion($('.vase-question',area),{...question,options:question.options&&shuffle(question.options)},{record:false,label:'Grammar',onAnswer(correct){
    if(correct){
     player.grammar=step+1;
     persist();
     onward.disabled=false;
    }
   }});
   onward.onclick=()=>exercise(true);
   if(focus)$('.section-label',area).focus();
  }
  exercise();
 }

 function reading(stage,setReady){
  stage.innerHTML=`<div class="vase-layout">
   ${illustration('basket-cat','Кот выглядывает из корзины')}
   <section class="card">
    <p>Гончар оставил записку. Найди в ней место, где стоит корзина.</p>
    <blockquote class="vase-note" lang="en">${vaseClue.before}<span class="vase-evidence">${vaseClue.evidence}</span>${vaseClue.after}</blockquote>
    ${teacherTranslation('Перевод записки для учителя',[vaseClue.ru])}
    <div class="vase-question"></div>
    <button type="button" class="button secondary small vase-show-clue" aria-pressed="false">Подсветить улику</button>
   </section></div>`;
  const hint=$('.vase-show-clue',stage);
  const highlight=value=>{
   $('.vase-evidence',stage).classList.toggle('reading-evidence',value);
   hint.setAttribute('aria-pressed',String(value));
   hint.textContent=value?'Снять подсветку':'Подсветить улику';
  };
  hint.onclick=()=>highlight(hint.getAttribute('aria-pressed')==='false');
  const area=$('.vase-question',stage);
  if(player.clue){
   area.innerHTML=`<p class="feedback good" lang="en">${vaseClue.question.answer}</p>`;
   highlight(true);
  }else renderQuestion(area,{...vaseClue.question,options:shuffle(vaseClue.question.options)},{record:false,label:'Reading',onAnswer(correct){
   highlight(true);
   if(!correct)return;
   player.clue=true;
   persist();
   setReady(true);
  }});
  setReady(player.clue);
 }

 function ending(stage,setReady){
  stage.innerHTML=`<div class="vase-layout">
   ${illustration('pot-hat','Король примеряет горшок вместо шляпы')}
   <section class="card"><p>Гончар оставил улику. Теперь придумай свою концовку: где в итоге нашлась ваза?</p>
    <div class="vase-endings" role="group" aria-label="Место, где нашлась ваза">${vaseEndings.map(item=>`<button type="button" class="tab" lang="en" data-ending="${item.id}">${item.label}</button>`).join('')}</div>
    ${teacherTranslation('Перевод вариантов для учителя',vaseEndings.map(item=>item.ru))}
    <div class="vase-ending-cue" aria-live="polite"></div>
    <label class="input-label" hidden>Скажи фразу королю. Если хочешь, запиши свой вариант.
     <textarea class="vase-draft" lang="en" placeholder="When the knight …, he …"></textarea>
    </label>
   </section></div>`;
  const editor=$('.vase-draft',stage);
  editor.value=player.draft;
  editor.oninput=()=>{player.draft=editor.value;persist()};
  const select=()=>{
   const item=vaseEndings.find(item=>item.id===player.ending);
   $$('[data-ending]',stage).forEach(option=>option.setAttribute('aria-pressed',String(option.dataset.ending===player.ending)));
   $('.vase-ending-cue',stage).innerHTML=item
    ?`<div class="speech-support"><p lang="en"><b>${item.line}</b></p>${teacherTranslation('Перевод реплики для учителя',[item.lineRu])}</div>`
    :'';
   editor.closest('label').hidden=!item;
   setReady(Boolean(item));
  };
  $$('[data-ending]',stage).forEach(option=>option.onclick=()=>{player.ending=option.dataset.ending;persist();select()});
  select();
 }

 persist();
 render();
}
