import {$, $$, escape, progress, renderQuestion, save, shuffle, state, teacherTranslation} from './core.js?v=4';

export const secretMarkup = (text, example = '') =>
  `<aside class="card secret"><img src="assets/keks-face.webp" alt="" width="46" height="46" loading="lazy">
    <div><h3>Секретик от Кекса</h3><p>${escape(text)}</p>${example ? `<p lang="en"><b>${escape(example)}</b></p>` : ''}</div>
  </aside>`;

export function renderReflection(root, unit, goals, goalsRu = []) {
  const key = `reflection-u${unit.id}`;
  const stored = progress.drafts[key] || {};
  root.innerHTML = `<h1 lang="en">Reflection</h1><p class="page-intro muted">Отметь, что уже получается. Скажи или запиши одну фразу по-английски.</p>
    <section class="card"><h2 lang="en">Today I can …</h2>
      <div class="reflection-goals">${goals.map((goal,i)=>`<label><input type="checkbox" value="${i}" ${stored.goals?.includes(i)?'checked':''}><span lang="en">${escape(goal)}</span></label>`).join('')}</div>
      ${teacherTranslation('Перевод фраз для учителя',goalsRu.length?[...goalsRu,'Сегодня я узнал(а) … / В следующий раз я хочу потренировать …']:[])}
      <label class="input-label">Что получилось или что хочу повторить
        <textarea lang="en" placeholder="Today I learnt … / Next time I want to practise …"></textarea>
      </label>
      <button class="button save-reflection" type="button">Сохранить итог</button>
      <p class="writing-saved" role="status"></p>
    </section>
    ${state.teacher ? '<aside class="card teacher-box"><h3>Как дать обратную связь</h3><p>Попросите ученика привести один конкретный пример к отмеченной цели и выбрать один следующий шаг.</p></aside>' : ''}
    `;
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

export function renderWheel(root,questions){
  let remaining=shuffle(questions.map((question,index)=>({question,index})));
  let rotation=0;
  const segment=360/questions.length;
  const tiles=questions.map((q,i)=>`<span style="--label-angle:${i*segment}deg">${i+1}</span>`).join('');
  root.innerHTML=`<div class="card wheel-activity">
    <div class="wheel-play">
      <div class="wheel-frame" aria-hidden="true">
        <div class="wheel-pointer"></div>
        <div class="wheel-disc" style="--segment:${segment}deg">${tiles}</div>
      </div>
      <button class="button spin-wheel" type="button">Крутить колесо</button>
    </div>
    <div class="wheel-task"><p class="wheel-status muted" role="status">Крути колесо и выполни задание.</p><div class="wheel-question"></div></div>
  </div>`;
  const button=$('.spin-wheel',root);
  const disc=$('.wheel-disc',root);
  const status=$('.wheel-status',root);
  const stage=$('.wheel-question',root);
  button.onclick=async()=>{
    if(!remaining.length)remaining=shuffle(questions.map((question,index)=>({question,index})));
    const {question,index}=remaining.pop();
    const target=(360-index*segment)%360;
    rotation+=720+(target-rotation%360+360)%360;
    button.disabled=true;
    stage.className='wheel-question';
    stage.replaceChildren();
    status.textContent='Колесо крутится…';
    const start=Number(disc.dataset.angle)||0;
    disc.dataset.angle=String(rotation);
    const duration=matchMedia('(prefers-reduced-motion: reduce)').matches?0:850;
    const animation=disc.animate([{transform:`rotate(${start}deg)`},{transform:`rotate(${rotation}deg)`}],{duration,easing:'cubic-bezier(.18,.66,.16,1)',fill:'forwards'});
    await animation.finished;
    if(!root.isConnected)return;
    disc.style.transform=`rotate(${rotation}deg)`;
    animation.cancel();
    status.textContent=`Выпало задание №${index+1}.`;
    stage.classList.add('question-stage');
    renderQuestion(stage,question,{label:'Practice'});
    button.disabled=false;
  };
}
