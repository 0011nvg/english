import {$, $$, escape, progress, save, state} from './core.js?v=2';

export const secretMarkup = (text, example = '') =>
  `<aside class="card secret"><img src="assets/keks-face.webp" alt="" width="46" height="46" loading="lazy">
    <div><h3>Секретик от Кекса</h3><p>${escape(text)}</p>${example ? `<p lang="en"><b>${escape(example)}</b></p>` : ''}</div>
  </aside>`;

export function renderReflection(root, unit, goals) {
  const key = `reflection-u${unit.id}`;
  const stored = progress.drafts[key] || {};
  root.innerHTML = `<h1 lang="en">Reflection</h1><p class="page-intro muted">Отметь, что уже получается. Скажи или запиши одну фразу по-английски.</p>
    <section class="card"><h2 lang="en">Today I can …</h2>
      <div class="reflection-goals">${goals.map((goal,i)=>`<label><input type="checkbox" value="${i}" ${stored.goals?.includes(i)?'checked':''}><span lang="en">${escape(goal)}</span></label>`).join('')}</div>
      <label class="input-label">Что получилось или что хочу повторить
        <textarea lang="en" placeholder="Today I learnt … / Next time I want to practise …"></textarea>
      </label>
      <button class="button save-reflection" type="button">Сохранить итог</button>
      <p class="writing-saved" role="status"></p>
    </section>
    ${state.teacher ? '<aside class="card teacher-box"><h3>Как дать обратную связь</h3><p>Попросите ученика привести один конкретный пример к отмеченной цели и выбрать один следующий шаг.</p></aside>' : ''}
    <div class="section-footer"><a class="button secondary" href="#${unit.id}/progress">Мой прогресс</a></div>`;
  const answer = $('textarea',root);
  answer.value = stored.text || '';
  $('.save-reflection',root).onclick = () => {
    if (!state.teacher) {
      progress.drafts[key] = {goals:$$('input:checked',root).map(input=>Number(input.value)),text:answer.value.trim()};
      save();
    }
    $('.writing-saved',root).textContent = state.teacher ? 'Просмотр учителя.' : 'Итог сохранён.';
  };
}
