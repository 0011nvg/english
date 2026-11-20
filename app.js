import {sections,units} from './data/units.js?v=3';
import {vocabulary,grammar,readings,practice,speaking,gameModes,teacherGuide,processSteps,coilSteps} from './data/unit4.js';
import {readingBasics,readingTerms,readingTranslations,playTranslations,stageRoles,audioSupport,speakingSupport} from './data/unit4-support.js';
import {tracks,listeningQuestions} from './data/audio.js';
import {playDialogue} from './data/dialogues.js';
import {$,$$,escape,shuffle,state,progress,save,mastered,toast,speech,quizBank,renderQuestion,audioMarkup,bindAudio,cleanupMedia,updateSide,unit4Progress,teacherTranslation,resetUnit4Progress,storageAvailable} from './core.js?v=3';
import {renderGame,stopGame,vocabularyModes} from './games.js?v=3';
import {historyGames} from './data/history.js';
import {historyCards,renderQueen,renderHistoryGame,historyResultList} from './history.js';
import {bindTeacherMode} from './teacher.js';
import {courseBanks,renderCourseUnit} from './course.js';
import {renderWheel,secretMarkup,renderReflection} from './lesson-tools.js';
const content=$('#content');let releaseRecording=()=>{};
const link=(section,text,cls='button')=>`<a class="${cls}" href="#4/${section}">${text}</a>`;
const figure=(name,alt,cls='reading-visual')=>`<img class="${cls}" src="assets/images/${name}.webp" alt="${escape(alt)}" loading="lazy">`;
function heading(title,description){return `<h1 lang="en">${title}</h1><p class="page-intro muted">${description}</p>`}
const accents = ['yellow','pink','blue','lilac'];
const unitSelect = $('#unit-select');
const courseBar = $('.course-bar');
const stageNav = $('#nav');
const lessonSections = sections.slice(1);
const readingSelection = {story:0,part:0,gloss:true};
const speakingSelection = {index:0,independent:false};

function sectionLink(unit,section,label,className='button secondary'){
 return `<a class="${className}" href="#${unit.id}/${section}">${escape(label)}</a>`;
}
function setHub(active,unit){
 $$('[data-hub]').forEach(a=>{
  if(a.dataset.hub==='lesson')a.href=`#${unit.id}/learn`;
  const selected=a.dataset.hub===active;
  a.classList.toggle('active',selected);
  if(selected)a.setAttribute('aria-current','page');
  else a.removeAttribute('aria-current');
 });
}
function nextStage(unit){
 if(unit.id!==4)return 'warmup';
 if(!progress.history.queen?.finished)return 'warmup';
 const banks=[
  ['vocabulary',vocabulary],['grammar',grammar],['reading',readings.flatMap(r=>r.questions)],
  ['listening',listeningQuestions],['practice',practice]
 ];
 return banks.find(([,items])=>items.some(q=>!progress.answers[q.id]?.mastered))?.[0]??'challenge';
}
function unitProgress(unit){
 if(unit.id===4)return unit4Progress();
 const items=Object.values(courseBanks(unit)).flat();
 return {done:items.filter(q=>progress.answers[q.id]?.mastered).length,total:items.length};
}
function courseView(unit){
 const {done,total}=unitProgress(units[0]);
 const errors=vocabulary.filter(w=>progress.answers[w.id]?.lastCorrect===false).length;
 content.innerHTML=`<section class="hero course-home">
   <div><span class="section-label">Английский для 4 класса</span>
   <h1 lang="en">English <span class="hl-blue">World 4</span></h1>
   <p class="lead">Начинаем с Unit 4 «Crafts». Узнай, как делают горшки, ткань и свечи, и расскажи об этом по-английски.</p>
   <div class="row">${sectionLink(units[0],'learn','Открыть Unit 4','button')}${sectionLink(units[0],nextStage(units[0]),progress.history.queen?.finished?'Продолжить':'Начать с разминки')}</div></div>
   <figure class="hero-art"><img src="assets/keks.webp" width="720" height="630" alt="Кекс с картой"></figure>
 </section>
 <div class="home-tiles">
   <a class="home-tile" href="#4/progress"><span class="section-label">Прогресс</span><b>${done} из ${total}</b><span>Слов и заданий освоено</span><progress max="${total}" value="${done}" aria-label="Прогресс Unit 4"></progress></a>
   <a class="home-tile" href="#4/vocabulary"><span class="section-label">Словарь</span><b>33 слова</b><span>Карточки и тренировка</span></a>
   <a class="home-tile" href="#4/games"><span class="section-label">Игры</span><b lang="en">History Challenge</b><span>Детектив, замок и ярмарка</span></a>
   <a class="home-tile" href="#4/progress"><span class="section-label">Повторение</span><b>${errors?`Слова с ошибками: ${errors}`:'Разбор ошибок'}</b><span>Открой задания для повторения</span></a>
 </div>
 <div class="section-head"><h2>Карта курса</h2></div>
 <ol class="course-map">${units.map(u=>{
  const score=unitProgress(u);
  return `<li><a class="course-unit ${u.id===unit.id?'current':''}" href="#${u.id}/learn">
   <span class="unit-badge">${u.id}</span><span><b lang="en">Unit ${u.id} · ${escape(u.title)}</b><small>${u.id===4?'Ремёсла · Pupil’s Book, стр. 48–55':'Краткий урок'}</small></span>
   <span class="route-score">${Math.round(score.done/score.total*100)}%</span></a></li>`;
 }).join('')}</ol>`;
}

function lessonRoute(unit){
 return `<section class="lesson-route">
  <div class="section-head"><h2>Как устроен урок</h2></div>
  <p class="muted">Иди по порядку или открой нужный этап. Маршрут можно пройти за несколько занятий.</p>
  <ol class="lesson-steps">${lessonSections.map(([id,icon,label,description],i)=>`<li>
   <a class="card route-step ${accents[i%accents.length]}" href="#${unit.id}/${id}">
    <span class="step-icon" aria-hidden="true">${icon}</span>
    <span><strong lang="en">${label}</strong><small>${description}</small></span>
   </a></li>`).join('')}</ol>
 </section>`;
}

function render(){
 stopGame();cleanupMedia();releaseRecording();releaseRecording=()=>{};
 const match=location.hash.match(/^#(\d+)\/([a-z]+)(?:\/([a-z-]+)(\?review)?)?$/);
 const map=location.hash==='#course';
 const requestedUnit=match?Number(match[1]):4;
 const unit=units.find(u=>u.id===(map?state.unit:requestedUnit))??units[0];
 const oldWarmup=unit.id===4&&match?.[2]==='games'&&match[3]==='queen';
 const requestedSection=unit.id===requestedUnit?match?.[2]:null;
 state.unit=unit.id;
 state.section=oldWarmup?'warmup':sections.find(s=>s[0]===requestedSection)?.[0]??'learn';
 if(oldWarmup||(match&&requestedUnit!==unit.id))history.replaceState(null,'',`#${unit.id}/${state.section}`);
 setHub(map?'course':'lesson',unit);
 courseBar.hidden=map;
 if(map){courseView(unit);return}

 const index=sections.findIndex(s=>s[0]===state.section);
 const section=sections[index];
 unitSelect.value=unit.id;
 stageNav.innerHTML=sections.map(([id,icon,label,description],i)=>`<a href="#${unit.id}/${id}" title="${description}" class="stage-${accents[i%accents.length]}${id===state.section?' active':''}" ${id===state.section?'aria-current="step"':''}><span class="nav-icon" aria-hidden="true">${icon}</span><span lang="en">${label}</span></a>`).join('');
 content.innerHTML=`${state.section==='learn'?'':`<p class="crumb"><a href="#${unit.id}/learn">Unit ${unit.id} · ${escape(unit.title)}</a> / <span lang="en">${section[2]}</span></p>`}${state.teacher&&unit.id===4&&teacherGuide[state.section]?`<details class="teacher-box teacher-guide"><summary>Подсказки к уроку для учителя</summary>${teacherGuide[state.section].map(t=>`<p>${escape(t)}</p>`).join('')}</details>`:''}<div id="view"></div>`;
 const view=$('#view');
 if(unit.id!==4)renderCourseUnit(view,unit,state.section);
 else {
  const views={learn:learnView,warmup:renderQueen,vocabulary:vocabularyView,grammar:grammarView,reading:readingView,listening:listeningView,speaking:speakingView,games:gamesView,practice:practiceView,challenge:challengeView,progress:progressView,reflection:root=>renderReflection(root,unit,['I can name three craft materials.','I can say what happened using when.','I can explain how to make a pot.'])};
  const game=state.section==='games'&&historyGames.find(g=>g.id===match?.[3]);
  if(game)renderHistoryGame(view,game,Boolean(match[4]));
  else views[state.section](view);
 }
 if(state.section==='learn')content.insertAdjacentHTML('beforeend',lessonRoute(unit));
 else content.insertAdjacentHTML('beforeend',`<nav class="lesson-footer" aria-label="Переход между этапами">
  ${sectionLink(unit,sections[index-1][0],sections[index-1][2])}
  ${sections[index+1]?sectionLink(unit,sections[index+1][0],sections[index+1][2],'button'):'<a class="button" href="#course">Карта курса</a>'}
 </nav>`);
 updateSide(unitProgress(unit));
 const active=$('#nav .active');
 if(active){
  const {left,right}=active.getBoundingClientRect();
  const rail=stageNav.getBoundingClientRect();
  if(left<rail.left||right>rail.right)stageNav.scrollLeft+=left-rail.left-8;
 }
}

function learnView(root){
 const unit=units[0];
 root.innerHTML=`<section class="lesson-hero">
   <div><span class="section-label">Unit 4 · Pupil’s Book, стр. 48–55</span>
     <h1 lang="en">Crafts</h1>
     <p class="lead">Узнай, как мастера делают горшки, ткут ткань, плетут корзины и отливают свечи. Научись объяснять по-английски, что за чем происходит.</p>
     <div class="row">${sectionLink(unit,nextStage(unit),progress.history.queen?.finished?'Продолжить урок':'Начать с разминки','button')}</div>
   </div>${figure('hero-pots','Керамические изделия в мастерской','lesson-cover')}
 </section>
 ${state.teacher?'<aside class="teacher-box"><b>Пример занятия на 36 минут</b><p>24 минуты на лексику, грамматику, чтение или аудирование и практику по учебнику. 12 минут на разминку, историческую игру и рефлексию.</p></aside>':''}`;
}
function vocabularyView(root){
 root.innerHTML=heading('Vocabulary','Выучи слова о ремёслах и потренируйся в четырёх играх.')+`
  <div class="lexi-modes" role="group" aria-label="Словарные игры">${vocabularyModes.map(([id,title,description,icon],i)=>`<button class="card mode-card ${accents[i]}" type="button" data-vocab-game="${id}" aria-pressed="false">
   <span class="mode-icon" aria-hidden="true">${icon}</span><strong>${title}</strong><small>${description}</small>
  </button>`).join('')}</div>
  <div class="tabs vocab-tabs" role="group" aria-label="Просмотр слов">
   <button class="tab show-flash" type="button">Карточки</button>
   <button class="tab show-all" type="button">Весь словарь</button>
   <button class="tab repeat-wrong" type="button">Повторить ошибки</button>
  </div>
  <div class="vocab-main"></div>
  <details class="card word-support"><summary>Ещё шесть слов для чтения</summary><ul>
   ${readingBasics.map(([en,ru,ipa])=>`<li><span><b lang="en">${en}</b> <span class="ipa">/${ipa}/</span> — ${ru}</span><button class="button secondary small" type="button" data-say="${en}" aria-label="Послушать слово ${en}">♫</button></li>`).join('')}
  </ul></details>`;
 $$('[data-say]',root).forEach(button=>button.onclick=()=>speech(button.dataset.say));
 let index=0,flipped=false;
 const area=$('.vocab-main',root);
 const controls=$$('.vocab-tabs button,.mode-card',root);
 const mark=button=>controls.forEach(control=>control.setAttribute('aria-pressed',String(control===button)));
 const flash=()=>{
  const w=vocabulary[index];
  area.innerHTML=`<button class="word-card" type="button"><span class="word-icon">${w.icon}</span>
   <strong lang="${flipped?'ru':'en'}">${escape(flipped?w.ru:w.en)}</strong>
   <span class="ipa">/${w.ipa}/</span>
   <span lang="${flipped?'en':'ru'}">${escape(flipped?w.example:'Нажми и узнай перевод')}</span></button>
   <div class="word-controls"><button class="button secondary prev-word">Предыдущая</button><span class="small">${index+1} / ${vocabulary.length}</span><button class="button secondary next-word">Следующая</button><button class="button say-word">♫ Послушать</button></div>
   ${teacherTranslation('Перевод примера',[w.exampleRu])}`;
  $('.word-card',area).onclick=()=>{flipped=!flipped;flash();$('.word-card',area).focus()};
  const change=(step,selector)=>{
   index=(index+step+vocabulary.length)%vocabulary.length;
   flipped=false;
   flash();
   $(selector,area).focus();
  };
  $('.prev-word',area).onclick=()=>change(-1,'.prev-word');
  $('.next-word',area).onclick=()=>change(1,'.next-word');
  $('.say-word',area).onclick=()=>speech(w.en);
 };
 const openFlash=()=>{stopGame();mark($('.show-flash',root));flash()};
 $('.show-flash',root).onclick=openFlash;
 $('.show-all',root).onclick=event=>{
  stopGame();
  mark(event.currentTarget);
  area.innerHTML=`<div class="word-list">${vocabulary.map((w,i)=>`<article class="word-item">
    <button type="button" class="word-list-open" data-index="${i}"><b lang="en">${w.icon} ${escape(w.en)}</b> <span class="ipa">/${w.ipa}/</span><span>${escape(w.ru)}</span></button>
    ${teacherTranslation('Перевод примера',[w.example+' → '+w.exampleRu])}
  </article>`).join('')}</div>`;
  $$('[data-index]',area).forEach(button=>button.onclick=()=>{index=Number(button.dataset.index);flipped=false;openFlash();$('.word-card',area).focus()});
 };
 $('.repeat-wrong',root).onclick=event=>{
  mark(event.currentTarget);
  renderGame(area,'missing',openFlash,{reviewOnly:true,backLabel:'К карточкам'});
 };
 $$('[data-vocab-game]',root).forEach(button=>button.onclick=()=>{
  mark(button);
  renderGame(area,button.dataset.vocabGame,openFlash,{vocabularyMode:true,backLabel:'К карточкам'});
 });
 openFlash();
}
function grammarView(root){
 const blocks=[
  {questions:grammar.slice(0,10),short:'When + Past Simple',source:'Pupil’s Book, стр. 52 · Grammar Practice Book, стр. 17',title:'When: одно событие, затем другое',html:'<p><b>When</b> значит «когда». В этом юните связываем два события в прошлом: произошло одно — затем другое.</p><div class="phonics"><b>When</b> the rain <mark>stopped</mark>, the children <mark>went</mark> outside.</div><p>Когда дождь закончился, дети вышли на улицу. В обеих частях — <b>Past Simple</b>. После части с When в начале предложения ставим запятую.</p><p class="small">Нужные формы: go → went · see → saw · buy → bought · run → ran · fall → fell.</p>'},
  {questions:grammar.slice(10,20),short:'Something / Anything',source:'Pupil’s Book, стр. 53 · Grammar Practice Book, стр. 18',title:'Что-то, что-нибудь, ничего, всё',html:'<div class="table-wrap"><table><thead><tr><th>Слово</th><th>Когда нужно</th><th>Пример</th></tr></thead><tbody><tr><td>something</td><td>что-то есть</td><td>There is something in the box.</td></tr><tr><td>anything</td><td>вопрос или отрицание</td><td>Is there anything? I can’t see anything.</td></tr><tr><td>nothing</td><td>ничего нет</td><td>There is nothing in the box.</td></tr><tr><td>everything</td><td>всё</td><td>Everything is on the desk.</td></tr></tbody></table></div><p>Не делаем двойное отрицание: <b>I can’t see anything.</b> Или: <b>I can see nothing.</b></p>'},
  {questions:grammar.slice(20),short:'Knife → knives',source:'Grammar Practice Book, стр. 19',title:'Knife → knives',html:'<p>У этих слов во множественном числе <b>-f / -fe</b> меняется на <b>-ves</b>. Это группа слов, а не правило для всех слов на -f.</p><div class="phonics">knife → <mark>knives</mark> · leaf → <mark>leaves</mark></div><p>shelf → shelves · wolf → wolves · thief → thieves · half → halves</p>'}
 ];
 const secrets=[
  'После when попробуй подставить «когда». Скажи два коротких события: the king opened the door, the cat ran away. Теперь свяжи их: When the king opened the door, the cat ran away.',
  'Представь коробку. Видишь там что-то — something. Спрашиваешь, есть ли что-нибудь, — anything. Пусто — nothing. Всё на месте — everything.',
  'Обведи в каждой паре то, что меняется: kni(fe) → kni(ves), lea(f) → lea(ves). Прочитай пары вслух и послушай, как /f/ меняется на /v/.'
 ];
 root.innerHTML=heading('Grammar','Разбери три правила Unit 4. Все задания открыты: можно идти по порядку или выбрать нужную тему.')+`
  <div class="tabs grammar-jumps" role="group" aria-label="Темы грамматики">${blocks.map((block,i)=>`<button type="button" class="tab" data-block="${i}">${block.short} · ${block.questions.length}</button>`).join('')}</div>
  ${blocks.map((block,i)=>`<section class="grammar-block" id="grammar-topic-${i}" tabindex="-1">
   <div class="card ${accents[i]}"><h2>${block.title}</h2>${block.html}<p class="source">${block.source}</p>
   ${i===1?teacherTranslation('Перевод примеров',['В коробке что-то есть.','Там что-нибудь есть? Я ничего не вижу.','В коробке ничего нет.','Всё на столе.']):''}
   ${i===2?teacherTranslation('Перевод слов',['knife — нож, leaf — лист, shelf — полка, wolf — волк, thief — вор, half — половина.']):''}</div>
   ${secretMarkup(secrets[i])}
   <ol class="grammar-exercises">${block.questions.map(q=>`<li><div class="question-stage" data-grammar-question="${q.id}"></div></li>`).join('')}</ol>
  </section>`).join('')}`;
 $$('[data-block]',root).forEach(button=>button.onclick=()=>{
  const block=$('#grammar-topic-'+button.dataset.block,root);
  block.focus({preventScroll:true});
  block.scrollIntoView({block:'start'});
 });
 grammar.forEach(q=>renderQuestion($(`[data-grammar-question="${q.id}"]`,root),q,{label:'Grammar'}));
}

function readingView(root){
 root.innerHTML=heading('Reading','Читай по одному фрагменту. Нажми на выделенное слово, чтобы увидеть транскрипцию и перевод.')+`
  <div class="tabs" role="group" aria-label="Тексты">${readings.map((r,i)=>`<button class="tab" type="button" data-story="${i}">${r.title}</button>`).join('')}</div><div class="reading-main"></div>`;
 const area=$('.reading-main',root);
 const glossary=new Map([...vocabulary.map(w=>[w.en,[w.ru,w.ipa]]),...readingTerms.map(([en,ru,ipa])=>[en,[ru,ipa]])]);
 const terms=[...glossary.keys()].sort((a,b)=>b.length-a.length);
 const termPattern=new RegExp('\\b('+terms.join('|')+')\\b','gi');
 const draw=()=>{
  const {story,part,gloss}=readingSelection;
  const r=readings[story];
  $$('[data-story]',root).forEach((button,i)=>button.setAttribute('aria-pressed',String(i===story)));
  let text=escape(r.text[part]);
  if(gloss)text=text.replace(termPattern,m=>`<button class="gloss-word" type="button" data-term="${m.toLowerCase()}">${m}</button>`);
  area.innerHTML=`<div class="reading-layout">
   <div>${figure(r.image,r.title)}<p class="source">${r.source}${r.id==='story'?'':' · Цифровая адаптация текста'}</p>
   <button class="button secondary small toggle-gloss" type="button" aria-pressed="${gloss}">Словарные подсказки</button></div>
   <div class="card"><span class="section-label">Часть ${part+1} из ${r.text.length}</span><p class="story-text" lang="en">${text}</p>
   <div class="translation" role="status" hidden></div>
   ${teacherTranslation('Перевод фрагмента для учителя',[readingTranslations[r.id][part]])}
   <div class="question-controls reading-pager"><button class="button secondary prev-part" ${part===0?'disabled':''}>Предыдущий фрагмент</button><button class="button next-part" ${part===r.text.length-1?'disabled':''}>Следующий фрагмент</button></div></div></div>
   <div class="section-head"><h2>Проверь понимание</h2></div><div class="reading-check"></div>
   ${r.id==='pots'?'<div class="section-head"><h2>Что за чем?</h2></div><div class="question-stage process-quiz"></div>':''}`;
  $('.toggle-gloss',area).onclick=()=>{readingSelection.gloss=!gloss;draw();$('.toggle-gloss',area).focus()};
  $('.prev-part',area).onclick=()=>{readingSelection.part--;draw();$('.prev-part:enabled, .next-part:enabled',area).focus()};
  $('.next-part',area).onclick=()=>{readingSelection.part++;draw();($('.next-part:enabled',area)??$('.prev-part:enabled',area)).focus()};
  $$('.gloss-word',area).forEach(button=>button.onclick=()=>{
   const [ru,ipa]=glossary.get(button.dataset.term);
   const translation=$('.translation',area);
   translation.textContent=`${button.textContent} /${ipa}/ — ${ru}`;
   translation.hidden=false;
  });
  quizBank($('.reading-check',area),r.questions,{title:'Reading'});
  if(r.id==='pots')renderQuestion($('.process-quiz',area),{id:'extra-reading-process',type:'order',prompt:'Поставь этапы изготовления горшка по порядку.',tokens:processSteps,answer:processSteps.join(' · '),joiner:' · ',explain:'Сначала подготовь глину, затем форму. После сушки — роспись.'},{label:'Reading'});
 };
 $$('[data-story]',root).forEach(button=>button.onclick=()=>{readingSelection.story=Number(button.dataset.story);readingSelection.part=0;draw()});
 draw();
}

function listeningTranslation(track){
 const support=audioSupport[track.file];
 if(support)return teacherTranslation(support.label,support.lines);
 return teacherTranslation('Перевод сценки для учителя',playDialogue.map(([role],i)=>`${stageRoles[role]}: ${playTranslations[i]}`));
}
function listeningView(root){
 root.innerHTML=heading('Turn your ears on','Оригинальные записи учебника. Слушай, ставь на паузу, возвращайся к началу и меняй скорость.')+`<div class="tabs"><button class="tab active" data-listen="practice">Слушать и выполнять</button><button class="tab" data-listen="library">Все 9 записей</button></div><div class="listening-main"></div>`;
 const area=$('.listening-main',root);const library=()=>{cleanupMedia();area.innerHTML=`<div class="grid">${tracks.map(t=>`<div>${audioMarkup(t)}${listeningTranslation(t)}</div>`).join('')}</div>`;bindAudio(area)};
 const exercises=()=>{cleanupMedia();area.innerHTML=`<div class="tabs">${tracks.filter(t=>t.questions?.length).map((t,i)=>`<button class="tab ${i===0?'active':''}" data-track="${t.file}">${t.short||t.title}</button>`).join('')}</div><div class="listening-exercise"></div><div class="section-head"><h2>Phonics · короткий /i/</h2></div><div class="card yellow"><p class="phonics">heav<mark>y</mark> · stick<mark>y</mark> · bab<mark>y</mark> · lad<mark>y</mark></p><p>В этих словах конечная y звучит как короткий /i/. В clay сочетание ay звучит иначе: /eɪ/.</p><button class="button secondary phonics-say">♫ Произнести слова</button></div>`;
  const exercise=$('.listening-exercise',area);const show=file=>{cleanupMedia();const t=tracks.find(t=>t.file===file);$$('[data-track]',area).forEach(b=>b.classList.toggle('active',b.dataset.track===file));exercise.innerHTML=audioMarkup(t)+listeningTranslation(t)+(t.image?figure(t.image,'Иллюстрации к аудиозаданию','listening-picture'):'')+'<div class="listen-quiz"></div>';bindAudio(exercise);quizBank($('.listen-quiz',exercise),t.questions.map(id=>listeningQuestions.find(q=>q.id===id)),{title:'Listening'})};$$('[data-track]',area).forEach(b=>b.onclick=()=>show(b.dataset.track));const first=tracks.find(t=>t.questions?.length);if(first)show(first.file);else exercise.innerHTML='<div class="card"><p>Записи доступны во вкладке «Все 9 записей». Сопоставление с заданиями ещё проверяется.</p></div>';$('.phonics-say',area).onclick=()=>speech('heavy, sticky, baby, lady')};
 $$('[data-listen]',root).forEach(b=>b.onclick=()=>{$$('[data-listen]',root).forEach(x=>x.classList.toggle('active',x===b));b.dataset.listen==='library'?library():exercises()});exercises()
}
function speakingView(root){
 let {index,independent}=speakingSelection;root.innerHTML=heading('Speaking','Попробуй ответить по образцу. Потом замени детали и скажи свою версию.')+`<div class="tabs"><button class="tab with-teacher" aria-pressed="${!independent}">В диалоге с учителем</button><button class="tab independent" aria-pressed="${independent}">Самостоятельно</button></div><div class="speaking-main"></div>`;
 const draw=()=>{cleanupMedia();releaseRecording();releaseRecording=()=>{};const s=speaking[index],support=speakingSupport[index],area=$('.speaking-main',root);area.innerHTML=`<div class="card"><span class="section-label">SPEAKING CARD ${index+1} / ${speaking.length} · ${s.time} MIN</span><h2>${s.icon} ${s.title}</h2><p class="story-text">${s.prompt}</p>${index===4?figure('pots','Мастер формирует глиняный горшок'):index===3?figure('stage','Дети готовят декорации на сцене'):''}<details class="speech-support" ${independent?'open':''}><summary><b>Речевые опоры</b></summary>${s.roles.map(r=>`<p lang="en">${escape(r)}</p>`).join('')}</details>
  <div class="speech-support speech-frames"><h3>Подставь свои слова</h3><p lang="en">${escape(support.words)}</p>${support.frames.map(r=>`<p lang="en"><b>${escape(r)}</b></p>`).join('')}</div>
  <details class="speech-support" open><summary><b>Пример ответа</b></summary>${support.model.map(r=>`<p lang="en">${escape(r)}</p>`).join('')}${teacherTranslation('Перевод примера для учителя',support.ru)}</details>${index===3?`<details class="speech-support"><summary><b>Сценка учебника · p.51</b></summary>${audioMarkup(tracks[1])}${listeningTranslation(tracks[1])}${playDialogue.map(([role,line])=>`<p><b>${role}:</b> ${escape(line)}</p>`).join('')}</details>`:''}${state.teacher?`<div class="hint">${s.goal}. Не прерывайте каждую ошибку: сначала завершите диалог, затем разберите 1–2 конструкции.</div>`:''}${independent?'<p class="small muted">Сначала скажи ответ вслух. При желании запиши себя и послушай.</p><div class="record-area"></div><label class="input-label">Мой план ответа<textarea class="speaking-draft" placeholder="First, I … Then, I …"></textarea></label><p class="writing-saved" role="status"></p>':''}<div class="question-controls"><button class="button secondary prev-card">Предыдущая карточка</button><button class="button next-card">Следующая карточка</button></div></div><p class="note">Автоматическая оценка произношения не используется. Обратную связь даёт преподаватель или сам ученик после прослушивания.</p>`;
  bindAudio(area);$('.prev-card',area).disabled=index===0;$('.next-card',area).disabled=index===speaking.length-1;$('.prev-card',area).onclick=()=>{speakingSelection.index=--index;draw()};$('.next-card',area).onclick=()=>{speakingSelection.index=++index;draw()};if(independent){const t=$('.speaking-draft',area);t.value=progress.drafts['speaking'+index]||'';if(!state.teacher)t.oninput=()=>{progress.drafts['speaking'+index]=t.value;save();$('.writing-saved',area).textContent=storageAvailable()?'План сохранён в этом браузере.':'Черновик доступен до закрытия страницы.'};setupRecorder($('.record-area',area))}};
 const setPractice=value=>{
  speakingSelection.independent=independent=value;
  $('.with-teacher',root).setAttribute('aria-pressed',String(!value));
  $('.independent',root).setAttribute('aria-pressed',String(value));
  draw();
 };
 $('.with-teacher',root).onclick=()=>setPractice(false);
 $('.independent',root).onclick=()=>setPractice(true);
 draw()
}
function setupRecorder(root){
 if(!navigator.mediaDevices?.getUserMedia||!window.MediaRecorder){root.innerHTML='<p class="note">Запись голоса недоступна в этом браузере. Можно ответить вслух.</p>';return}
 let recorder,stream,url,active=true;root.innerHTML='<div class="row"><button class="button record-start">Записать ответ</button><button class="button secondary record-stop" disabled>Остановить</button><span class="record-status small" role="status"></span></div><div class="record-result"></div>';
 releaseRecording=()=>{active=false;if(recorder?.state==='recording')recorder.stop();stream?.getTracks().forEach(t=>t.stop());if(url)URL.revokeObjectURL(url)};
 $('.record-start',root).onclick=async()=>{try{stream=await navigator.mediaDevices.getUserMedia({audio:true});if(!active){stream.getTracks().forEach(t=>t.stop());return}const chunks=[];recorder=new MediaRecorder(stream);recorder.ondataavailable=e=>{if(e.data.size)chunks.push(e.data)};recorder.onstop=()=>{stream.getTracks().forEach(t=>t.stop());if(!active)return;if(url)URL.revokeObjectURL(url);const blob=new Blob(chunks,{type:recorder.mimeType});url=URL.createObjectURL(blob);$('.record-result',root).innerHTML=`<audio class="record-audio" controls src="${url}"></audio><a class="button secondary small" href="${url}" download="my-speaking-answer.${recorder.mimeType.includes('mp4')?'mp4':recorder.mimeType.includes('ogg')?'ogg':'webm'}">Скачать запись</a><p class="note">Запись остаётся на устройстве. Скачай её, чтобы сохранить после ухода со страницы.</p>`;$('.record-start',root).disabled=false;$('.record-stop',root).disabled=true;$('.record-status',root).textContent='Готово — послушай себя.'};recorder.start();$('.record-start',root).disabled=true;$('.record-stop',root).disabled=false;$('.record-status',root).textContent='Идёт запись…';}catch{if(active)toast('Не удалось включить микрофон. Можно ответить вслух.')}};$('.record-stop',root).onclick=()=>{if(recorder?.state==='recording')recorder.stop()}
}
function gamesView(root){root.innerHTML=heading('Games','Потренируй английский в замке, в мастерской или в словесной игре.')+`<div class="section-head"><h2>Исторические игры</h2><span class="small muted">Авторские задания · Unit 4</span></div>${historyCards()}<div class="section-head"><h2>Слова и грамматика</h2></div><div class="grid three">${gameModes.map(([id,title,desc,icon],i)=>`<button class="card game-card ${['pink','blue','yellow','lilac'][i%4]}" data-game="${id}"><span class="game-icon">${icon}</span><h3>${title}</h3><p>${desc}</p></button>`).join('')}</div>`;$$('[data-game]',root).forEach(b=>b.onclick=()=>renderGame(root,b.dataset.game,()=>gamesView(root)))}
function practiceView(root){
 root.innerHTML=heading('Make it your own','Закрепи слова, произношение и грамматику. Затем опиши, как мастер делает горшок из глиняного жгута.')+
  `<div class="practice-quiz"></div><div class="section-head"><h2>Колесо заданий</h2></div><div class="practice-wheel"></div><div class="section-head"><h2>My craft story</h2><span class="tag">Письмо · p.55</span></div><div class="writing-grid"><div class="card">${figure('coil','Этапы изготовления горшка из глиняного жгута')}<div class="speech-support"><b>Твой план</b><p>${coilSteps.join(' · ')}</p><p>First, the potter … Then, he … Next, he … Finally, he …</p></div><label class="input-label">Напиши 5–7 предложений<textarea id="craft-writing" placeholder="First, the potter cuts the clay. …"></textarea></label><p class="writing-saved" role="status"></p><div class="row"><button class="button check-writing">Проверить свой текст по плану</button><button class="button secondary download-writing">Скачать текст</button></div><div class="writing-checklist"></div></div></div>${state.teacher?'<div class="teacher-box"><h3>Образец и критерии</h3><details><summary>Открыть образец</summary><p>First, the potter cuts the clay. Then, he pushes and pulls it into a smooth lump. Next, he rolls a long, thin piece. He coils the clay and makes the shape. He dries the pot slowly. Finally, he paints it.</p><p>Сначала гончар отрезает кусок глины. Затем мнёт и вытягивает её, пока не получится гладкий комок. Потом раскатывает длинный тонкий жгут, сворачивает глину витками и придаёт изделию форму. Горшок медленно сохнет. В конце гончар раскрашивает его.</p></details><p>Содержание и порядок — 0–2; слова юнита — 0–2; ясные предложения — 0–2. Не требуйте буквального совпадения с образцом.</p></div>':''}`;
 quizBank($('.practice-quiz',root),practice,{title:'Practice'});renderWheel($('.practice-wheel',root),practice);const draft=$('#craft-writing',root);draft.value=progress.drafts.craft||'';draft.oninput=()=>{progress.drafts.craft=draft.value;save();$('.writing-saved',root).textContent=storageAvailable()?'Черновик сохранён в этом браузере.':'Черновик доступен до закрытия страницы.'};$('.check-writing',root).onclick=()=>{$('.writing-checklist',root).innerHTML='<div class="hint"><b>Проверь себя</b><p>□ Есть начало с First?<br>□ Этапы идут по порядку?<br>□ Есть слова clay, roll, coil, dry, paint?<br>□ Последний шаг начинается с Finally?<br>□ Каждое предложение начинается с большой буквы?</p><p>Это памятка для самопроверки. Содержание текста проверяет учитель.</p></div>'};$('.download-writing',root).onclick=()=>{if(!draft.value.trim()){toast('Сначала напиши текст.');return}download('my-craft-story.txt',draft.value,'text/plain;charset=utf-8')}
}
const examQuestions=()=>[...grammar.filter(q=>['g1','g3','g11','g12','g13','g18','g21'].includes(q.id)),...readings.slice(0,3).flatMap(r=>r.questions).filter(q=>['r2','r5','r8'].includes(q.id)),...practice.filter(q=>['p2','p7'].includes(q.id)),...listeningQuestions.filter(q=>['l5','l9','l18'].includes(q.id)).map(q=>({...q,audio:tracks.find(t=>t.questions.includes(q.id)).file})),...vocabulary.filter(w=>['weave','pour','smooth'].includes(w.en)).map(w=>({id:w.id,prompt:`Выбери перевод: ${w.en}`,answer:w.ru,options:shuffle([w.ru,...shuffle(vocabulary.filter(o=>o.id!==w.id)).slice(0,2).map(o=>o.ru)]),explain:w.example}))].map(q=>({...q,id:'c-'+q.id,originalId:q.id}));
function challengeView(root){
 const begin=()=>{const exam=examQuestions();let index=0;const results=[];const next=()=>{cleanupMedia();if(index===exam.length){const score=results.filter(r=>r.correct).length;if(!state.teacher){progress.challenge.push({date:new Date().toISOString(),score,total:exam.length,results});save();}root.innerHTML=heading('Challenge complete!','Разбери ответы и выбери, что повторить.')+`<div class="card yellow"><div class="stat">${score} / ${exam.length}</div><p>Верно с первой попытки: ${Math.round(score/exam.length*100)}%.</p><div class="row"><button class="button retry-exam">Пройти заново</button>${link('progress','Мои результаты','button secondary')}</div></div><div class="result-list">${exam.map((q,i)=>`<div class="card"><strong>${results[i].correct?'✓':'○'} ${escape(q.prompt)}</strong><p>Твой ответ: ${escape(results[i].value)}</p><p>Правильный ответ: <b>${escape(q.answer)}</b>. ${escape(q.explain||'')}</p></div>`).join('')}</div>`;$('.retry-exam',root).onclick=begin;return}
  cleanupMedia();root.innerHTML=heading('Your little big challenge',`${exam.length} заданий. Ответ фиксируется один раз; разбор откроется после завершения.`)+`<span class="section-label">QUESTION ${index+1} / ${exam.length}</span><progress max="${exam.length}" value="${index}"></progress>${exam[index].audio?audioMarkup(tracks.find(t=>t.file===exam[index].audio)):''}<div class="question-stage"></div><div class="row"><button class="button exam-next" disabled>${index===exam.length-1?'Завершить испытание':'Дальше'}</button><button class="button secondary exit-exam">Выйти из испытания</button></div><p class="note">Незавершённый результат не попадёт в историю испытаний.</p>`;
  bindAudio(root);renderQuestion($('.question-stage',root),exam[index],{exam:true,label:'Challenge',onAnswer:(correct,value)=>{results[index]={id:exam[index].id,correct,value};$('.exam-next',root).disabled=false}});$('.exam-next',root).onclick=()=>{index++;next()};$('.exit-exam',root).onclick=()=>{if(confirm('Выйти? Эта незавершённая попытка не будет сохранена в истории.'))challengeView(root)};
 };next()};
 root.innerHTML=heading('Ready for a little challenge?','Всё, что ты уже изучил: слова, грамматика, чтение, аудирование и звук y. Без таймера и спешки.')+`<div class="card lilac"><span class="section-label">UNIT 4 · FINAL CHECK</span><h2>Ты справишься ✦</h2><p>18 заданий. Примерно 12–15 минут. Здесь нет подсказок; ответы откроются после завершения.</p><button class="button start-exam">Начать испытание</button></div><p class="note">Аудиозадания включены в испытание. Устную речь и письменную работу оценивает преподаватель отдельно.</p>`;$('.start-exam',root).onclick=begin
}
function badges(){const passed=progress.challenge.some(c=>(!c.unit||c.unit===4)&&c.total&&c.score/c.total>=.8);return [
 ['⭐','Vocabulary Star',mastered('v')>=20,`${mastered('v')} / 20 слов освоено`],['🧩','Grammar Hero',mastered('g')>=18,`${mastered('g')} / 18 заданий`],['📖','Reading Explorer',mastered('r')>=9,`${mastered('r')} / 9 заданий`],['🎧','Listening Master',mastered('l')>=9,`${mastered('l')} / 9 заданий`],['👑','Royal Workshop Badge',Object.values(progress.history).filter(x=>x?.attempts).length>=4,'Заверши четыре исторические игры'],['🏆','English Champion',passed&&mastered('v')>=20&&mastered('g')>=18&&mastered('r')>=9&&mastered('l')>=9,'Испытание ≥80% и все 4 награды']
 ]}
function progressView(root){
 const unitResults=progress.challenge.filter(c=>!c.unit||c.unit===4);const stats=[['Vocabulary',mastered('v'),vocabulary.length],['Grammar',mastered('g'),grammar.length],['Reading',mastered('r'),readings.flatMap(r=>r.questions).length],['Listening',mastered('l'),listeningQuestions.length],['Practice',mastered('p'),practice.length]];const mistakes=vocabulary.filter(w=>progress.answers[w.id]?.lastCorrect===false);
 const reviewBank=[...grammar,...readings.flatMap(r=>r.questions),...listeningQuestions,...practice];
 const mistakesToReview=()=>reviewBank.filter(q=>progress.answers[q.id]?.lastCorrect===false);
 root.innerHTML=heading('Look how far you’ve come','Маленькие шаги тоже считаются. Здесь — выполненные задания и реальные достижения.')+`<div class="grid three">${stats.map(([t,n,d])=>`<div class="card"><span class="section-label">${t}</span><div class="stat">${n}<span class="muted" style="font-size:20px"> / ${d}</span></div><progress max="${d||1}" value="${n}"></progress><p class="note">Освоенные задания</p></div>`).join('')}</div><div class="section-head"><h2>Your little victories</h2></div><div class="grid three">${badges().map(([icon,t,done,desc])=>`<div class="card badge-card"><span class="badge ${done?'earned':''}">${icon}</span><h3>${t}</h3><p>${done?'Получено!':desc}</p></div>`).join('')}</div><div class="section-head"><h2>Повторим ещё раз?</h2></div><div class="card"><p>${mistakes.length?mistakes.map(w=>escape(w.en)).join(' · '):'Пока нет слов для повторения после ошибок.'}</p><div class="row"><button class="button secondary repeat-mistakes" ${mistakes.length?'':'disabled'}>Потренировать эти слова</button><button class="button secondary repeat-exercises" ${mistakesToReview().length?'':'disabled'}>Повторить задания</button></div></div><div class="exercise-review"></div><div class="section-head"><h2>Исторические игры</h2></div>${historyResultList()}<div class="section-head"><h2>История испытаний</h2></div><div class="result-list">${unitResults.length?unitResults.slice().reverse().slice(0,10).map(c=>`<div class="result-row"><span>${new Date(c.date).toLocaleString('ru-RU')}</span><b>${c.score} / ${c.total} · ${Math.round(c.score/c.total*100)}%</b></div>`).join(''):'<p class="muted">Здесь появятся завершённые испытания.</p>'}</div><p class="note">Прогресс хранится в этом браузере на этом устройстве. Очистка данных браузера удалит результаты; синхронизация между устройствами пока не подключена.</p>${state.teacher?'<div class="teacher-box"><h3>Заметки преподавателя</h3><label class="input-label">Наблюдения и следующий шаг<textarea class="teacher-notes"></textarea></label><div class="row"><button class="button secondary export-progress">Скачать отчёт</button><button class="button danger reset-progress">Сбросить результаты</button></div></div>':''}`;
 $('.repeat-exercises',root).onclick=()=>quizBank($('.exercise-review',root),mistakesToReview(),{title:'Повторение'});
 $('.repeat-mistakes',root).onclick=()=>renderGame(root,'missing',()=>progressView(root),{reviewOnly:true});if(state.teacher){$('.teacher-notes',root).value=progress.notes;$('.teacher-notes',root).oninput=e=>{progress.notes=e.target.value;save()};$('.export-progress',root).onclick=()=>download('english-unit4-progress.json',JSON.stringify(progress,null,2),'application/json');$('.reset-progress',root).onclick=()=>{if(confirm('Удалить результаты, черновики и заметки Unit 4 из этого браузера?')){resetUnit4Progress();progressView(root);toast('Результаты сброшены.')}}}
}
function download(name,text,type){const url=URL.createObjectURL(new Blob([text],{type}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}
unitSelect.innerHTML=units.map(u=>`<option value="${u.id}">Unit ${u.id} · ${escape(u.title)}</option>`).join('');
unitSelect.onchange=e=>location.hash=`${e.target.value}/learn`;
const mainNav=$('#main-nav');
const menuToggle=$('#menu-toggle');
function closeMenu(){
 mainNav.classList.remove('open');
 menuToggle.setAttribute('aria-expanded','false');
}
menuToggle.addEventListener('click',()=>{
 const open=mainNav.classList.toggle('open');
 menuToggle.setAttribute('aria-expanded',String(open));
});
mainNav.addEventListener('click',event=>{if(event.target.closest('a'))closeMenu()});
document.addEventListener('keydown',event=>{
 if(event.key==='Escape'&&mainNav.classList.contains('open')){closeMenu();menuToggle.focus()}
});
bindTeacherMode({dialog:$('#mode-dialog'),student:$('#student-mode'),teacher:$('#teacher-mode'),onChange(value){
 state.teacher=value;
 render();
}});
$('.skip').onclick=event=>{event.preventDefault();content.focus()};
window.addEventListener('hashchange',()=>{
 render();
 window.scrollTo({top:0,behavior:'instant'});
 content.focus({preventScroll:true});
});
window.addEventListener('pagehide',()=>{releaseRecording();cleanupMedia();stopGame()});
render();
