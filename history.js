import {$, $$, escape, progress, renderQuestion, save, shuffle, state} from './core.js?v=3';
import {historyGames, historySources, moods, workshopArt} from './data/history.js';

const art = (name, cls = '') =>
  `<img class="${cls}" src="assets/images/${name}.webp" alt="${escape(workshopArt[name]?.alt || '')}" loading="lazy" width="768" height="512">`;
const menu = '<a class="button secondary" href="#4/games">Все игры</a>';

export function historyCards() {
  return `<div class="grid three history-grid">
    <a class="card game-card history-card" href="#4/warmup"><span class="game-icon" aria-hidden="true">👑</span>
      <h3 lang="en">Which Queen Elizabeth Are You Today?</h3><p>Выбери настроение и расскажи, как прошёл твой день.</p></a>
    ${historyGames.map(game => `<a class="card game-card history-card" href="#4/games/${game.id}">
      <span class="game-icon" aria-hidden="true">${game.icon}</span><h3 lang="en">${escape(game.title)}</h3>
      <p>${escape(game.desc)}</p></a>`).join('')}
  </div>`;
}

export function renderQueen(root) {
  root.innerHTML = `<header class="game-header"><h1 lang="en">Which Queen Elizabeth Are You Today?</h1></header>
    <p class="page-intro muted">Выбери одну из четырёх иллюстраций. Ответь вслух или запиши свои мысли по-английски.</p>
    <div class="mood-grid">${moods.map(m => `<button class="mood-card" type="button" data-mood="${m.id}" aria-pressed="false">
      <img src="assets/images/${m.image}.webp" alt="" width="768" height="512">
      <b lang="en">${m.word}</b><small lang="en">${m.caption}</small></button>`).join('')}</div>
    <div class="activity-panel"></div>
    <p class="source">Авторские карикатуры на Елизавету II. Подписи придуманы для разминки.</p>
    ${state.teacher ? '<aside class="teacher-box"><h3>Как провести разминку</h3><p>Дайте минуту на подготовку. Для опоры оставьте I feel … because … . Попросите ученика назвать одно вчерашнее событие. В усложнённом варианте пусть он добавит второе с when.</p></aside>' : ''}`;

  const panel = $('.activity-panel', root);
  const select = mood => {
    $$('[data-mood]', root).forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.mood === mood.id));
    });
    panel.innerHTML = `<div class="card">
      <h2 lang="en">${mood.word}</h2>
      <ol lang="en"><li>How are you today?</li><li>Why do you feel like this?</li><li>What happened yesterday?</li></ol>
      <p lang="en"><b>${mood.cue}</b> Yesterday, I went to … / I made … / I saw …</p>
      <label class="input-label">Мой ответ, если хочу записать<textarea class="mood-answer" lang="en"></textarea></label>
      <div class="row"><button class="button finish-mood" type="button">Я ответил</button></div><span class="mood-result" role="status"></span>
      </div>`;
    const answer = $('.mood-answer', panel);
    answer.value = progress.drafts['history-mood'] || '';
    $('.finish-mood', panel).onclick = () => {
      if (!state.teacher) {
        progress.drafts['history-mood'] = answer.value.trim();
        progress.history.queen = {mood:mood.id, finished:true};
        save();
      }
      $('.mood-result', panel).textContent = 'Разминка пройдена.';
    };
  };
  $$('[data-mood]', root).forEach(button => {
    button.onclick = () => {
      select(moods.find(m => m.id === button.dataset.mood));
      $('.mood-answer', panel).focus({preventScroll:true});
    };
  });
  const previous = moods.find(m => m.id === progress.history.queen?.mood);
  if (previous) select(previous);
}

export function renderHistoryGame(root, game, reviewOnly = false) {
  const rounds = reviewOnly ? game.rounds.filter(round =>
    round.type !== 'open' && progress.answers[round.id]?.lastCorrect === false) : game.rounds;
  const first = new Map();
  let index = 0;

  function finish() {
    const correct = [...first.values()].filter(Boolean).length;
    const total = rounds.filter(round => round.type !== 'open').length;
    const originalTotal = game.rounds.filter(round => round.type !== 'open').length;
    if (!state.teacher && !reviewOnly) {
      const previous = progress.history[game.id];
      progress.history[game.id] = {
        attempts:(previous?.attempts || 0) + 1,
        best:Math.max(previous?.best || 0, correct),
        latest:correct,
        total:originalTotal
      };
      save();
    }
    const retry = game.rounds.some(round => progress.answers[round.id]?.lastCorrect === false);
    root.innerHTML = `<header class="game-header"><h1 lang="en">${escape(game.title)}</h1>${menu}</header>
      <div class="grid">
        <section class="card yellow"><h2>Готово!</h2>
          <div class="stat">${correct} / ${total}</div>
          <p>Верно с первой попытки. Открытые ответы можно обсудить с учителем.</p>
          <p>${escape(game.ending)}</p>
          <div class="row"><button class="button replay" type="button">Сыграть ещё раз</button>
          ${retry ? '<button class="button secondary review-game" type="button">Повторить ошибки</button>' : ''}
          <a class="button secondary" href="#4/reflection">Рефлексия</a></div>
        </section>${art(game.art, 'history-art')}
      </div>`;
    $('.replay', root).onclick = () => renderHistoryGame(root, game);
    $('.review-game', root)?.addEventListener('click', () => renderHistoryGame(root, game, true));
    root.querySelector('h1').setAttribute('tabindex','-1');
    root.querySelector('h1').focus({preventScroll:true});
  }

  function draw() {
    const round = rounds[index];
    const roundArt = round.slug === 'dialogue' || (game.id === 'history-meme' && round.slug === 'basket') ? 'basket-cat' : game.art;
    root.innerHTML = `<header class="game-header"><h1 lang="en">${escape(game.title)}</h1>${menu}</header>
      <p class="page-intro muted">${escape(game.intro)}</p>
      ${state.teacher ? `<aside class="teacher-box"><b>Цель</b><p>${escape(game.goal)}.</p><p>Вариант с опорой: прочитайте сцену вместе. Сложнее: пусть ученик объяснит выбор полным английским предложением.</p></aside>` : ''}
      <div class="question-meta"><b>${reviewOnly ? 'Повторение' : 'Раунд'} ${index+1} / ${rounds.length}</b><span>${round.source ? 'Исторический факт' : 'Авторская сценка'}</span></div>
      <progress max="${rounds.length}" value="${index}" aria-label="Ход игры"></progress>
      <div class="round-layout activity-panel">
        <div><div class="question-stage history-question"></div><div class="history-reaction" role="status"></div></div>
        <aside class="card round-scene">${art(roundArt)}<p lang="en">${escape(round.scene)}</p></aside>
      </div>
      <div class="row"><button class="button next-round" type="button" ${round.type === 'open' ? '' : 'disabled'}>${index+1 === rounds.length ? 'Посмотреть результат' : 'Следующий раунд'}</button></div>`;
    const stage = $('.history-question', root);
    const next = $('.next-round', root);
    const reaction = $('.history-reaction', root);
    if (round.type === 'open') {
      stage.innerHTML = `<p class="prompt" lang="en">${escape(round.prompt)}</p>
        <label class="input-label">Мой вариант (можно ответить вслух)<textarea lang="en"></textarea></label>
        <details class="hint"><summary>Подсказка</summary><p>${escape(round.hint)}</p></details>
        <details class="speech-support"><summary>${state.teacher ? 'Показать образец учителю' : 'Сравнить со смешным примером'}</summary><p lang="en">${escape(round.model)}</p></details>`;
      const draft = $('textarea', stage);
      draft.value = progress.drafts[round.id] || '';
      if (!state.teacher) draft.oninput = () => { progress.drafts[round.id] = draft.value; save(); };
    } else {
      const question = round.options ? {...round, options:shuffle(round.options)} : round;
      renderQuestion(stage, question, {label:game.title, onAnswer(correct) {
        if (!first.has(round.id)) first.set(round.id, correct);
        next.disabled = false;
        if (round.source) {
          const source = historySources[round.source];
          reaction.innerHTML = `<div class="card source-links"><b lang="en">${round.answer}</b>
            <p>${escape(round.explain)}</p><a href="${source.url}" target="_blank" rel="noopener noreferrer">${escape(source.label)}</a></div>`;
        } else {
          reaction.textContent = correct ? game.success || '' : game.retry || '';
        }
      }});
    }
    next.onclick = () => {
      index++;
      if (index === rounds.length) finish();
      else {
        draw();
        const stage = $('.history-question', root);
        stage.tabIndex = -1;
        stage.focus({preventScroll:true});
      }
      window.scrollTo({top:0,behavior:'instant'});
    };
  }

  if (rounds.length) draw();
  else renderHistoryGame(root, game);
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
