import {$, $$, escape, progress, renderQuestion, save, shuffle, state, teacherTranslation} from './core.js?v=4';
import {historyGames, historySources, knightScenes, workshopArt} from './data/history.js?v=4';
import {gameTranslations, roundTranslations} from './data/history-translations.js';

const art = (name, cls = '') =>
  `<img class="${cls}" src="assets/images/${name}.webp" alt="${escape(workshopArt[name]?.alt || '')}" loading="lazy" width="768" height="512">`;
const menu = '<a class="button secondary" href="#4/games">Все игры</a>';
let selectedScene;

export function historyCards() {
  return `<div class="grid three history-grid">
    <a class="card game-card history-card" href="#4/warmup"><span class="game-icon" aria-hidden="true">🛡️</span>
      <h3 lang="en">A Knight in the Workshop</h3><p>Выбери сцену, найди предмет и придумай, что случилось дальше.</p></a>
    ${historyGames.map(game => `<a class="card game-card history-card" href="#4/games/${game.id}">
      <span class="game-icon" aria-hidden="true">${game.icon}</span><h3 lang="en">${escape(game.title)}</h3>
      ${state.teacher?`<small>${escape(gameTranslations[game.id].title)}</small>`:''}<p>${escape(game.desc)}</p></a>`).join('')}
  </div>`;
}

export function renderKnightWarmup(root) {
  root.innerHTML = `<h1 lang="en">A Knight in the Workshop</h1>
    <p class="page-intro muted">Выбери сцену. Найди предмет на картинке и расскажи, что случилось дальше.</p>
    <div class="tabs" role="group" aria-label="Сценки для разминки">${knightScenes.map(scene=>`<button class="tab" type="button" data-scene="${scene.id}" lang="en">${escape(scene.title)}</button>`).join('')}</div>
    <div class="knight-warmup"></div>`;
  const panel = $('.knight-warmup',root);
  const choices = new Map();
  const select = scene => {
    selectedScene=scene.id;
    $$('[data-scene]',root).forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.scene===scene.id)));
    const saved = progress.history.knightWarmup;
    const completed = saved?.scene===scene.id&&saved.finished;
    panel.innerHTML = `<div class="reading-layout knight-layout">
      ${art(scene.image,'reading-visual')}
      <section class="card camp-card"><h2 lang="en">${escape(scene.title)}</h2>
        ${teacherTranslation('Перевод разминки для учителя',scene.ru)}
        <div class="knight-check"></div>
        <div class="speech-support knight-answer" ${completed||choices.has(scene.id)?'':'hidden'}>
          <h3>Что случилось дальше?</h3><p lang="en"><b>${escape(scene.cue)}</b></p>
          <details><summary>Пример ответа</summary><p lang="en">${escape(scene.example)}</p>
          ${teacherTranslation('Перевод примера для учителя',[scene.exampleRu])}</details>
          <label class="input-label">Ответь вслух или запиши свой вариант<textarea class="knight-draft" lang="en"></textarea></label>
          <button class="button finish-knight" type="button">Готово</button>
        </div><p class="knight-status" role="status">${completed?'Разминка пройдена.':''}</p>
      </section></div>`;
    const response=$('.knight-draft',panel);
    const draftKey='history-knight-'+scene.id;
    response.value=progress.drafts[draftKey]||'';
    if(!state.teacher)response.oninput=()=>{progress.drafts[draftKey]=response.value;save()};
    const check=$('.knight-check',panel);
    if(completed||choices.has(scene.id)){
      check.innerHTML=`<p lang="en">${escape(scene.prompt)} <b>${escape(scene.options[0])}</b></p>`;
    }else{
      renderQuestion(check,{id:draftKey,prompt:scene.prompt,answer:scene.options[0],options:shuffle(scene.options),type:'choice'},{label:'Warm-up',record:false,onAnswer(correct){
        if(!correct)return;
        choices.set(scene.id,true);
        $('.knight-answer',panel).hidden=false;
      }});
    }
    $('.finish-knight',panel).onclick=()=>{
      if(!state.teacher){
        progress.history.knightWarmup={scene:scene.id,finished:true};
        save();
      }
      $('.knight-status',panel).textContent='Разминка пройдена.';
    };
  };
  $$('[data-scene]',root).forEach(button=>button.onclick=()=>select(knightScenes.find(scene=>scene.id===button.dataset.scene)));
  select(knightScenes.find(scene=>scene.id===(selectedScene||progress.history.knightWarmup?.scene))??knightScenes[0]);
}

export function renderHistoryGame(root, game, reviewOnly = false) {
  const review=game.rounds.filter(round=>round.type!=='open'&&progress.answers[round.id]?.lastCorrect===false);
  if(!review.length)reviewOnly=false;
  const rounds=reviewOnly?review:game.rounds;
  const first=new Map();
  const frames=new Map();
  const ru=gameTranslations[game.id];
  let index=0, saved=false;

  const header=`<header class="game-header"><div><h1 lang="en">${escape(game.title)}</h1>
    ${state.teacher?`<p class="muted">${escape(ru.title)}</p>`:''}</div>${menu}</header>`;
  root.innerHTML=header+'<div class="history-stage"></div>';
  const area=$('.history-stage',root);

  function finish() {
    const correct=[...first.values()].filter(Boolean).length;
    const total=rounds.filter(round=>round.type!=='open').length;
    if(!state.teacher&&!reviewOnly&&!saved){
      const previous=progress.history[game.id];
      progress.history[game.id]={
        attempts:(previous?.attempts||0)+1,
        best:Math.max(previous?.best||0,correct),
        latest:correct,
        total
      };
      save();
      saved=true;
    }
    const retry=game.rounds.some(round=>progress.answers[round.id]?.lastCorrect===false);
    area.innerHTML=`<div class="grid">
      <section class="card yellow"><h2 tabindex="-1">Готово!</h2>
        <div class="stat">${correct} / ${total}</div>
        <p>Верно с первой попытки. Открытые ответы можно обсудить с учителем.</p>
        <p>${escape(game.ending)}</p>${teacherTranslation('Перевод финала',ru.ending?[ru.ending]:[])}
        <div class="row"><button class="button secondary previous-round" type="button">Предыдущий раунд</button>
        <button class="button replay" type="button">Сыграть ещё раз</button>
        ${retry?'<button class="button secondary review-game" type="button">Повторить ошибки</button>':''}
        <a class="button secondary" href="#4/reflection">Рефлексия</a></div>
      </section>${art(game.art,'history-art')}
    </div>`;
    $('.previous-round',area).onclick=()=>move(-1);
    $('.replay',area).onclick=()=>renderHistoryGame(root,game);
    $('.review-game',area)?.addEventListener('click',()=>renderHistoryGame(root,game,true));
    $('h2',area).focus({preventScroll:true});
  }

  function makeFrame(round,step) {
    const frame=document.createElement('section');
    const [sceneRu,promptRu,responseRu]=roundTranslations[game.id][round.slug];
    const answerRu=Array.isArray(responseRu)
      ?round.options.map((option,i)=>`${option} — ${responseRu[i]}`)
      :[responseRu];
    const roundArt=round.slug==='dialogue'||(game.id==='history-meme'&&round.slug==='basket')?'basket-cat':game.art;
    frame.innerHTML=`<p class="page-intro muted">${escape(game.intro)}</p>
      ${state.teacher?`<aside class="teacher-box"><b>Цель</b><p>${escape(game.goal)}.</p><p>Попросите ученика объяснить выбор по-английски.</p></aside>`:''}
      <div class="question-meta"><b>${reviewOnly?'Повторение':'Раунд'} ${step+1} / ${rounds.length}</b><span>${round.source?'Исторический факт':'Авторская сценка'}</span></div>
      <progress max="${rounds.length}" value="${step}" aria-label="Ход игры"></progress>
      <div class="round-layout activity-panel">
        <div><div class="question-stage history-question" tabindex="-1"></div><div class="history-reaction" role="status"></div></div>
        <aside class="card round-scene">${art(roundArt)}<p lang="en">${escape(round.scene)}</p>
          ${teacherTranslation('Перевод сценки для учителя',[sceneRu])}</aside>
      </div>
      <div class="row"><button class="button secondary previous-round" type="button" ${step===0?'disabled':''}>Предыдущий раунд</button>
        <button class="button next-round" type="button" ${round.type==='open'?'':'disabled'}>${step+1===rounds.length?'Посмотреть результат':'Следующий раунд'}</button></div>`;
    const stage=$('.history-question',frame);
    const next=$('.next-round',frame);
    const reaction=$('.history-reaction',frame);
    if(round.type==='open'){
      stage.innerHTML=`<p class="prompt" lang="en">${escape(round.prompt)}</p>
        ${teacherTranslation('Перевод задания для учителя',[promptRu])}
        <label class="input-label">Мой вариант (можно ответить вслух)<textarea lang="en"></textarea></label>
        <details class="hint"><summary>Подсказка</summary><p>${escape(round.hint)}</p></details>
        <details class="speech-support"><summary>Сравнить с примером</summary><p lang="en">${escape(round.model)}</p>
          ${teacherTranslation('Перевод примера для учителя',answerRu)}</details>`;
      const draft=$('textarea',stage);
      draft.value=progress.drafts[round.id]||'';
      if(!state.teacher)draft.oninput=()=>{progress.drafts[round.id]=draft.value;save()};
    }else{
      const question={...round,options:round.options&&shuffle(round.options),teacherRu:[promptRu,...answerRu]};
      renderQuestion(stage,question,{label:game.title,onAnswer(correct){
        if(!first.has(round.id))first.set(round.id,correct);
        next.disabled=false;
        if(round.source){
          const source=historySources[round.source];
          reaction.innerHTML=`<div class="card source-links"><b lang="en">${escape(round.answer)}</b>
            <p>${escape(round.explain)}</p><a href="${source.url}" target="_blank" rel="noopener noreferrer">${escape(source.label)}</a></div>`;
        }else{
          const translation=correct?ru.success:ru.retry;
          reaction.textContent=[correct?game.success:game.retry,state.teacher&&translation].filter(Boolean).join(' — ');
        }
      }});
    }
    $('.previous-round',frame).onclick=()=>move(-1);
    next.onclick=()=>move(1);
    return frame;
  }

  function show() {
    if(index===rounds.length){finish();return}
    if(!frames.has(index))frames.set(index,makeFrame(rounds[index],index));
    area.replaceChildren(frames.get(index));
  }

  function move(delta) {
    index+=delta;
    show();
    $('.history-question',area)?.focus({preventScroll:true});
    window.scrollTo({top:0,behavior:'instant'});
  }

  show();
}

export function historyResultList() {
  const completed = historyGames.filter(game => progress.history[game.id]?.attempts);
  return completed.length ? `<div class="result-list">${completed.map(game => {
    const result = progress.history[game.id];
    const retry = game.rounds.some(round => progress.answers[round.id]?.lastCorrect === false);
    return `<div class="result-row"><span lang="en">${escape(game.title)}</span><b>${result.best} / ${result.total}</b>
      <a href="#4/games/${game.id}${retry ? '?review' : ''}">${retry ? 'Повторить ошибки' : 'Играть снова'}</a></div>`;
  }).join('')}</div>` : '<p class="muted">Здесь появятся результаты завершённых исторических игр.</p>';
}
