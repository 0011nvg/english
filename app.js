import {sections,units} from './data/units.js?v=2';
import {vocabulary,supportWords,grammar,readings,practice,speaking,gameModes,teacherGuide,processSteps,coilSteps} from './data/unit4.js';
import {tracks,listeningQuestions} from './data/audio.js';
import {playDialogue} from './data/dialogues.js';
import {$,$$,escape,shuffle,state,progress,save,mastered,toast,speech,quizBank,renderQuestion,audioMarkup,bindAudio,cleanupMedia,updateSide,resetUnit4Progress,storageAvailable} from './core.js?v=2';
import {renderGame,stopGame} from './games.js?v=2';
import {historyGames} from './data/history.js';
import {historyCards,renderQueen,renderHistoryGame,historyResultList} from './history.js';
import {bindTeacherMode} from './teacher.js';
import {renderCourseUnit} from './course.js';
import {secretMarkup,renderReflection} from './lesson-tools.js';
const content=$('#content');let releaseRecording=()=>{};
const link=(section,text,cls='button')=>`<a class="${cls}" href="#4/${section}">${text}</a>`;
const figure=(name,alt,cls='reading-visual')=>`<img class="${cls}" src="assets/images/${name}.webp" alt="${escape(alt)}" loading="lazy">`;
function heading(title,description){return `<h1>${title}</h1><p class="page-intro muted">${description}</p>`}
function render(){
 stopGame();cleanupMedia();releaseRecording();releaseRecording=()=>{};
 const match=location.hash.match(/^#(\d+)\/([a-z]+)(?:\/([a-z-]+)(\?review)?)?$/);
 state.unit=match?Number(match[1]):4;
 state.section=match?match[2]:'learn';
 if(!units.some(u=>u.id===state.unit))state.unit=4;
 if(!sections.some(section=>section[0]===state.section))state.section='learn';
 const unit=units.find(u=>u.id===state.unit);
 const section=sections.find(s=>s[0]===state.section);
 $('#unit-select').value=state.unit;
 $('#nav').innerHTML=sections.map(([id,icon,label,description])=>`<a href="#${state.unit}/${id}" title="${description}" class="${id===state.section?'active':''}" ${id===state.section?'aria-current="page"':''}><span class="nav-icon" aria-hidden="true">${icon}</span>${label}</a>`).join('');
 $$('#main-nav [data-hub]').forEach(a=>{
  a.href=`#${state.unit}/${a.dataset.hub}`;
  const current=a.dataset.hub===state.section;
  a.classList.toggle('active',current);
  if(current)a.setAttribute('aria-current','page');
  else a.removeAttribute('aria-current');
 });
 content.innerHTML=`${state.section==='learn'?'':`<p class="crumb">Unit ${unit.id} · ${escape(unit.title)} / ${section[2]}</p>`}${state.teacher&&unit.id===4&&teacherGuide[state.section]?`<aside class="teacher-box"><strong>Для учителя · ${section[2]}</strong>${teacherGuide[state.section].map(t=>`<p>${escape(t)}</p>`).join('')}</aside>`:''}<div id="view"></div>`;
 const view=$('#view');
 if(unit.id!==4){renderCourseUnit(view,unit,state.section);return}
 const views={learn:learnView,vocabulary:vocabularyView,grammar:grammarView,reading:readingView,listening:listeningView,speaking:speakingView,games:gamesView,practice:practiceView,challenge:challengeView,progress:progressView,reflection:root=>renderReflection(root,unit,['I can name three craft materials.','I can say what happened using when.','I can explain how to make a pot.'])};
 const game=state.section==='games'&&historyGames.find(g=>g.id===match?.[3]);
 if(state.section==='games'&&match?.[3]==='queen')renderQueen(view);
 else if(game)renderHistoryGame(view,game,Boolean(match[4]));
 else views[state.section](view);
 updateSide();
 if(location.hash!=='#content')$('#nav .active')?.scrollIntoView({block:'nearest',inline:'nearest'});
}

function learnView(root){
 const masteredWords=mastered('v');
 const errors=vocabulary.filter(word=>progress.answers[word.id]?.lastCorrect===false).length;
 const done=masteredWords+mastered('g')+mastered('r')+mastered('l')+mastered('p');
 const total=vocabulary.length+grammar.length+readings.flatMap(r=>r.questions).length+listeningQuestions.length+practice.length;
 const nextSections=[
  ['vocabulary',masteredWords,vocabulary.length],['grammar',mastered('g'),grammar.length],
  ['reading',mastered('r'),readings.flatMap(r=>r.questions).length],
  ['listening',mastered('l'),listeningQuestions.length],['practice',mastered('p'),practice.length]
 ];
 const next=done ? nextSections.find(([,count,size])=>count<size)?.[0]||'challenge' : 'games/queen';
 root.innerHTML=`<section class="hero">
   <div><span class="section-label">English World 4 · Unit 4</span>
     <h1 lang="en">Crafts. <span class="hl-pink">Make it.</span><br><span class="hl-blue">Say it.</span></h1>
     <p class="lead">Узнай, как мастера делают горшки, ткань и свечи. Потом загляни в замок и помоги рыцарю объяснить всё по-английски.</p>
     <div class="row"><a class="button" href="#4/games/queen">Начать урок</a>${link('vocabulary','Слова','button secondary')}${link('reading','Чтение','button secondary')}</div>
   </div><figure class="hero-art"><img src="assets/keks.webp" width="720" height="630" alt="Кекс с синим платком и картой"><figcaption class="art-sticker" lang="en">Ready? Let’s go!</figcaption></figure>
 </section>
 <div class="home-tiles">
   <a class="home-tile" href="#4/progress"><span class="section-label">Мой прогресс</span><b>${done} из ${total}</b><span>Заданий освоено</span><progress id="side-progress" max="${total}" value="${done}" aria-label="Прогресс Unit 4"></progress></a>
   <a class="home-tile" href="#4/${next}"><span class="section-label">${done?'Продолжить':'Начать'}</span><b lang="en">Unit 4 · Crafts</b><span>Слова, правила и мастерская</span></a>
   <a class="home-tile" href="#4/games"><span class="section-label">Игры</span><b lang="en">History Challenge</b><span>Мемы, король и побег из замка</span></a>
   <a class="home-tile" href="#4/progress"><span class="section-label">Повторение</span><b>${errors?`Слова с ошибками: ${errors}`:'Разбор ошибок'}</b><span>Открой задания для повторения</span></a>
 </div>
 <div class="section-head"><h2>Как устроен урок</h2></div>
 ${state.teacher?'<aside class="teacher-box"><b>Пример занятия на 36 минут</b><p>24 минуты на лексику, грамматику, чтение или аудирование и практику по учебнику. 12 минут на разминку, историческую игру и рефлексию.</p><p>С опорой: предложите сказать четыре шага по шаблонам First, Then, Next, Finally. Сложнее: пусть ученик объяснит процесс от имени гончара и задаст королю два вопроса.</p></aside>':''}
 <div class="card route-strip">
   <a href="#4/games/queen">Warm-up</a><a href="#4/vocabulary">Vocabulary</a><a href="#4/grammar">Grammar</a>
   <a href="#4/reading">Reading</a><a href="#4/listening">Listening</a><a href="#4/practice">Practice</a>
   <a href="#4/games">History Challenge</a><a href="#4/reflection">Reflection</a>
 </div>
 <div class="section-head"><h2>Занятия в Unit 4</h2></div>
 <div class="grid">${[
 ['vocabulary','🏺','Материалы и инструменты','33 слова словаря, материалы, инструменты и действия','pink'],
 ['reading','📖','От глины до горшка','Как мастера работают с глиной, шерстью, камышом и воском','yellow'],
 ['grammar','🧩','Что случилось потом?','When, something, anything и особые формы множественного числа','blue'],
 ['speaking','🎭','Мастер на ярмарке','Сыграй посетителя выставки, мастера или героя сценки','pink'],
 ['listening','🎧','Ремёсла на слух','9 записей учебника, вопросы и фонетика','lilac'],
 ['practice','✎','Сделай свой горшок','Опиши этапы изготовления горшка из глиняного жгута','yellow']
 ].map(([s,i,t,d,c])=>`<a class="card lesson-card ${c}" href="#4/${s}"><span class="lesson-icon" aria-hidden="true">${i}</span><div><h3>${t}</h3><p>${d}</p></div></a>`).join('')}</div>
 <div class="section-head"><h2>Юниты English World 4</h2></div>
 <div class="unit-map">${units.map(u=>`<a href="#${u.id}/learn" class="unit-number ${u.id===4?'current':''}" ${u.id===4?'aria-current="page"':''}>${u.id}<small lang="en">${escape(u.title)}</small></a>`).join('')}</div>
 <p class="source">Pupil’s Book, pp. 48–55 · Dictionary, Unit 4 · Grammar Practice Book, pp. 17–19</p>`;
}
function vocabularyView(root){
 root.innerHTML=heading('Words with a little magic','33 слова Unit 4. Сначала познакомься со словами, затем выбери игру. Слова с ошибками можно повторять отдельно.')+`<div class="row"><button class="button show-flash">Карточки</button><button class="button secondary show-all">Весь словарь</button><button class="button secondary repeat-wrong">Повторить ошибки</button></div><div class="vocab-main" style="margin-top:20px"></div><div class="section-head"><h2>Ещё несколько опор из текста</h2></div><div class="card"><p>${supportWords.map(([e,r])=>`<b>${e}</b> — ${r}`).join(' · ')}</p><span class="source">Эти слова взяты из основного текста, а не добавлены в список словаря.</span></div><div class="section-footer">${link('games','Выбрать словесную игру')}</div>`;
 $('.vocab-main',root).insertAdjacentHTML('beforebegin',secretMarkup('Собери слова парами: clay → pot, wool → cloth, wax → candle. Спроси себя: What do I use? — I use clay. What do I make? — I make a pot.'));
 let index=0,flip=false;const area=$('.vocab-main',root);
 const flash=()=>{const w=vocabulary[index];area.innerHTML=`<button class="word-card"><span class="word-icon">${w.icon}</span><strong>${escape(flip?w.ru:w.en)}</strong><span>${escape(flip?w.example:'Нажми и узнай перевод')}</span></button><div class="word-controls"><button class="button secondary prev-word">Предыдущая</button><span class="small">${index+1} / ${vocabulary.length}</span><button class="button secondary next-word">Следующая</button><button class="button say-word">♫ Послушать</button></div><p class="note">Произношение — голос браузера, если установлен английский голос. Словарные примеры составлены для тренировки.</p>`;$('.word-card',area).onclick=()=>{flip=!flip;flash()};$('.prev-word',area).onclick=()=>{index=(index-1+vocabulary.length)%vocabulary.length;flip=false;flash()};$('.next-word',area).onclick=()=>{index=(index+1)%vocabulary.length;flip=false;flash()};$('.say-word',area).onclick=()=>speech(w.en)};
 $('.show-flash',root).onclick=flash;$('.show-all',root).onclick=()=>{area.innerHTML=`<div class="word-list">${vocabulary.map((w,i)=>`<button class="word-item" data-index="${i}"><b>${w.icon} ${w.en}</b><br>${w.ru}</button>`).join('')}</div>`;$$('.word-item',area).forEach(b=>b.onclick=()=>{index=+b.dataset.index;flip=false;flash()})};$('.repeat-wrong',root).onclick=()=>renderGame(root,'missing',()=>vocabularyView(root),{reviewOnly:true});flash()
}
function grammarView(root){
 root.innerHTML=heading('Grammar that clicks','Три коротких правила. Изучи пример, затем потренируйся — по одному заданию на экране.')+`<div class="tabs"><button class="tab active" data-block="0">When · 10 заданий</button><button class="tab" data-block="1">Something · 10 заданий</button><button class="tab" data-block="2">Knives · 6 заданий</button></div><div class="grammar-explanation"></div><div class="grammar-quiz"></div>`;
 const blocks=[
  {questions:grammar.slice(0,10),title:'When: одно событие, затем другое',html:'<p><b>When</b> значит «когда». В этом юните связываем два события в прошлом: произошло одно — затем другое.</p><div class="phonics"><b>When</b> the rain <mark>stopped</mark>, the children <mark>went</mark> outside.</div><p>Когда дождь закончился, дети вышли на улицу. В обеих частях — <b>Past Simple</b>. После части с When в начале предложения ставим запятую.</p><p class="small">Нужные формы: go → went · see → saw · buy → bought · run → ran · fall → fell.</p>'},
  {questions:grammar.slice(10,20),title:'Что-то, что-нибудь, ничего, всё',html:'<div class="table-wrap"><table><thead><tr><th>Слово</th><th>Когда нужно</th><th>Пример</th></tr></thead><tbody><tr><td>something</td><td>что-то есть</td><td>There is something in the box.</td></tr><tr><td>anything</td><td>вопрос или отрицание</td><td>Is there anything? I can’t see anything.</td></tr><tr><td>nothing</td><td>ничего нет</td><td>There is nothing in the box.</td></tr><tr><td>everything</td><td>всё</td><td>Everything is on the desk.</td></tr></tbody></table></div><p>Не делаем двойное отрицание: <b>I can’t see anything.</b> Или: <b>I can see nothing.</b></p>'},
  {questions:grammar.slice(20),title:'Knife → knives',html:'<p>У этих слов во множественном числе <b>-f / -fe</b> меняется на <b>-ves</b>. Это группа слов, а не правило для всех слов на -f.</p><div class="phonics">knife → <mark>knives</mark> · leaf → <mark>leaves</mark></div><p>shelf → shelves · wolf → wolves · thief → thieves · half → halves</p>'}
 ];
 const secrets=[
  'После when попробуй подставить «когда». Скажи два коротких события: the king opened the door, the cat ran away. Теперь свяжи их: When the king opened the door, the cat ran away.',
  'Представь коробку. Видишь там что-то — something. Спрашиваешь, есть ли что-нибудь, — anything. Пусто — nothing. Всё на месте — everything.',
  'Представь два острых ножа, которые срезали f и e. Получилось knives. Похожая пара: leaf → leaves.'
 ];
 const draw=i=>{$$('.tab',root).forEach((b,j)=>b.classList.toggle('active',i===j));$('.grammar-explanation',root).innerHTML=`<div class="card lilac"><h3>${blocks[i].title}</h3>${blocks[i].html}</div>${secretMarkup(secrets[i])}`;quizBank($('.grammar-quiz',root),blocks[i].questions,{title:'Grammar'})};$$('.tab',root).forEach(b=>b.onclick=()=>draw(+b.dataset.block));draw(0)
}
function readingView(root){
 root.innerHTML=heading('From clay to wow','Читай по небольшому фрагменту. Выделенные слова можно нажать, чтобы увидеть перевод.')+`<div class="tabs">${readings.map((r,i)=>`<button class="tab ${i===0?'active':''}" data-story="${i}">${r.title}</button>`).join('')}</div><div class="reading-main"></div>`;
 let story=0,part=0,gloss=true;const area=$('.reading-main',root);
 const draw=()=>{const r=readings[story];$$('[data-story]',root).forEach((b,i)=>b.classList.toggle('active',i===story));let text=escape(r.text[part]);if(gloss){const terms=[...vocabulary.map(w=>[w.en,w.ru]),...supportWords].sort((a,b)=>b[0].length-a[0].length);const pattern=new RegExp('\\b('+terms.map(([w])=>w).join('|')+')\\b','gi');text=text.replace(pattern,m=>`<button class="gloss-word" data-term="${escape(m.toLowerCase())}">${m}</button>`)}
  area.innerHTML=`<div class="reading-layout"><div>${figure(r.image,r.title)}<p class="source">${r.source} · Цифровая адаптация текста${r.id==='story'?' · Авторская история':''}</p><button class="button secondary small toggle-gloss">${gloss?'Скрыть':'Показать'} словарные подсказки</button></div><div class="card"><span class="section-label">ЧАСТЬ ${part+1} ИЗ ${r.text.length}</span><p class="story-text">${text}</p><div class="translation" hidden></div><div class="question-controls reading-pager"><button class="button secondary prev-part" ${part===0?'disabled':''}>Раньше</button><button class="button next-part" ${part===r.text.length-1?'disabled':''}>Дальше</button></div></div></div><div class="section-head"><h2>Проверь понимание</h2></div><div class="reading-check"></div>${r.id==='pots'?'<div class="section-head"><h2>Что за чем?</h2></div><div class="question-stage process-quiz"></div>':''}`;
  $('.toggle-gloss',area).onclick=()=>{gloss=!gloss;draw()};$('.prev-part',area).onclick=()=>{part--;draw()};$('.next-part',area).onclick=()=>{part++;draw()};$$('.gloss-word',area).forEach(b=>b.onclick=()=>{const w=vocabulary.find(w=>w.en===b.dataset.term);const ru=w?.ru||supportWords.find(([e])=>e===b.dataset.term)?.[1];$('.translation',area).hidden=false;$('.translation',area).textContent=`${b.textContent} — ${ru}`});quizBank($('.reading-check',area),r.questions,{title:'Reading'});
  if(r.id==='pots')renderQuestion($('.process-quiz',area),{id:'extra-reading-process',type:'order',prompt:'Поставь этапы изготовления горшка по порядку.',tokens:processSteps,answer:processSteps.join(' · '),joiner:' · ',explain:'Сначала подготовь глину, затем форму. После сушки — роспись.'},{label:'Reading'});
 };$$('[data-story]',root).forEach(b=>b.onclick=()=>{story=+b.dataset.story;part=0;draw()});draw()
}
function listeningView(root){
 root.innerHTML=heading('Turn your ears on','Оригинальные записи учебника. Слушай, ставь на паузу, возвращайся к началу и меняй скорость.')+`<div class="tabs"><button class="tab active" data-listen="practice">Слушать и выполнять</button><button class="tab" data-listen="library">Все 9 записей</button></div><div class="listening-main"></div>`;
 const area=$('.listening-main',root);const library=()=>{cleanupMedia();area.innerHTML=`<div class="grid">${tracks.map(audioMarkup).join('')}</div>`;bindAudio(area)};
 const exercises=()=>{cleanupMedia();area.innerHTML=`<div class="tabs">${tracks.filter(t=>t.questions?.length).map((t,i)=>`<button class="tab ${i===0?'active':''}" data-track="${t.file}">${t.short||t.title}</button>`).join('')}</div><div class="listening-exercise"></div><div class="section-head"><h2>Phonics · короткий /i/</h2></div><div class="card yellow"><p class="phonics">heav<mark>y</mark> · stick<mark>y</mark> · bab<mark>y</mark> · lad<mark>y</mark></p><p>В этих словах конечная y звучит как короткий /i/. В clay сочетание ay звучит иначе: /eɪ/.</p><button class="button secondary phonics-say">♫ Произнести слова</button></div>`;
  const exercise=$('.listening-exercise',area);const show=file=>{cleanupMedia();const t=tracks.find(t=>t.file===file);$$('[data-track]',area).forEach(b=>b.classList.toggle('active',b.dataset.track===file));exercise.innerHTML=audioMarkup(t)+(t.image?figure(t.image,'Иллюстрации к аудиозаданию','listening-picture'):'')+'<div class="listen-quiz"></div>';bindAudio(exercise);quizBank($('.listen-quiz',exercise),t.questions.map(id=>listeningQuestions.find(q=>q.id===id)),{title:'Listening'})};$$('[data-track]',area).forEach(b=>b.onclick=()=>show(b.dataset.track));const first=tracks.find(t=>t.questions?.length);if(first)show(first.file);else exercise.innerHTML='<div class="card"><p>Записи доступны во вкладке «Все 9 записей». Сопоставление с заданиями ещё проверяется.</p></div>';$('.phonics-say',area).onclick=()=>speech('heavy, sticky, baby, lady')};
 $$('[data-listen]',root).forEach(b=>b.onclick=()=>{$$('[data-listen]',root).forEach(x=>x.classList.toggle('active',x===b));b.dataset.listen==='library'?library():exercises()});exercises()
}
function speakingView(root){
 let index=0,independent=false;root.innerHTML=heading('A little braver, every word','Говори с преподавателем или используй речевые опоры самостоятельно. Здесь оцениваем смысл и понятность речи.')+`<div class="tabs"><button class="tab active with-teacher">With Teacher</button><button class="tab independent">Independent Practice</button></div><div class="speaking-main"></div>`;
 const draw=()=>{cleanupMedia();releaseRecording();releaseRecording=()=>{};const s=speaking[index],area=$('.speaking-main',root);area.innerHTML=`<div class="card"><span class="section-label">SPEAKING CARD ${index+1} / ${speaking.length} · ${s.time} MIN</span><h2>${s.icon} ${s.title}</h2><p class="story-text">${s.prompt}</p>${index===4?figure('pots','Мастер формирует глиняный горшок'):index===3?figure('stage','Дети готовят декорации на сцене'):''}<details class="speech-support" ${independent?'open':''}><summary><b>Речевые опоры</b></summary>${s.roles.map(r=>`<p>${escape(r)}</p>`).join('')}</details>${index===3?`<details class="speech-support"><summary><b>Сценка учебника · p.51</b></summary>${audioMarkup(tracks[1])}${playDialogue.map(([role,line])=>`<p><b>${role}:</b> ${escape(line)}</p>`).join('')}</details>`:''}${state.teacher?`<div class="hint">${s.goal}. Не прерывайте каждую ошибку: сначала завершите диалог, затем разберите 1–2 конструкции.</div>`:''}${independent?'<p class="small muted">Сначала скажи ответ вслух. При желании запиши себя и послушай.</p><div class="record-area"></div><label class="input-label">Мой план ответа<textarea class="speaking-draft" placeholder="First, I … Then, I …"></textarea></label><p class="writing-saved" role="status"></p>':''}<div class="question-controls"><button class="button secondary prev-card">Предыдущая карточка</button><button class="button next-card">Следующая карточка</button></div></div><p class="note">Автоматическая оценка произношения не используется. Обратную связь даёт преподаватель или сам ученик после прослушивания.</p>`;
  bindAudio(area);$('.prev-card',area).disabled=index===0;$('.next-card',area).disabled=index===speaking.length-1;$('.prev-card',area).onclick=()=>{index--;draw()};$('.next-card',area).onclick=()=>{index++;draw()};if(independent){const t=$('.speaking-draft',area);t.value=progress.drafts['speaking'+index]||'';t.oninput=()=>{progress.drafts['speaking'+index]=t.value;save();$('.writing-saved',area).textContent=storageAvailable()?'План сохранён в этом браузере.':'Черновик доступен до закрытия страницы.'};setupRecorder($('.record-area',area))}};
 $('.with-teacher',root).onclick=()=>{independent=false;$('.with-teacher',root).classList.add('active');$('.independent',root).classList.remove('active');draw()};$('.independent',root).onclick=()=>{independent=true;$('.independent',root).classList.add('active');$('.with-teacher',root).classList.remove('active');draw()};draw()
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
  secretMarkup('Представь, что даёшь мастеру четыре карточки. На первой First, на второй Then, на третьей Next, а на последней Finally. Так легче рассказать, что за чем идёт.','First, cut the clay. Finally, paint the pot.')+`<div class="practice-quiz"></div><div class="section-head"><h2>My craft story</h2><span class="tag">Письмо · p.55</span></div><div class="writing-grid"><div class="card">${figure('coil','Этапы изготовления горшка из глиняного жгута')}<div class="speech-support"><b>Твой план</b><p>${coilSteps.join(' · ')}</p><p>First, the potter … Then, he … Next, he … Finally, he …</p></div><label class="input-label">Напиши 5–7 предложений<textarea id="craft-writing" placeholder="First, the potter cuts the clay. …"></textarea></label><p class="writing-saved" role="status"></p><div class="row"><button class="button check-writing">Проверить свой текст по плану</button><button class="button secondary download-writing">Скачать текст</button></div><div class="writing-checklist"></div></div></div>${state.teacher?'<div class="teacher-box"><h3>Образец и критерии</h3><details><summary>Открыть образец</summary><p>First, the potter cuts the clay. Then, he pushes and pulls it into a smooth lump. Next, he rolls a long, thin piece. He coils the clay and makes the shape. He dries the pot slowly. Finally, he paints it.</p></details><p>Содержание и порядок — 0–2; слова юнита — 0–2; ясные предложения — 0–2. Не требуйте буквального совпадения с образцом.</p></div>':''}`;
 quizBank($('.practice-quiz',root),practice,{title:'Practice'});const draft=$('#craft-writing',root);draft.value=progress.drafts.craft||'';draft.oninput=()=>{progress.drafts.craft=draft.value;save();$('.writing-saved',root).textContent=storageAvailable()?'Черновик сохранён в этом браузере.':'Черновик доступен до закрытия страницы.'};$('.check-writing',root).onclick=()=>{$('.writing-checklist',root).innerHTML='<div class="hint"><b>Проверь себя</b><p>□ Есть начало с First?<br>□ Этапы идут по порядку?<br>□ Есть слова clay, roll, coil, dry, paint?<br>□ Последний шаг начинается с Finally?<br>□ Каждое предложение начинается с большой буквы?</p><p>Это памятка для самопроверки. Содержание текста проверяет учитель.</p></div>'};$('.download-writing',root).onclick=()=>{if(!draft.value.trim()){toast('Сначала напиши текст.');return}download('my-craft-story.txt',draft.value,'text/plain;charset=utf-8')}
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
$('#unit-select').innerHTML=units.map(u=>`<option value="${u.id}">Unit ${u.id}${' · '+escape(u.title)}</option>`).join('');$('#unit-select').onchange=e=>location.hash=`${e.target.value}/learn`;
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
