import {$, $$, cleanupMedia, escape, progress, quizBank, renderQuestion, save, shuffle, speech, state} from './core.js?v=2';
import {courseContent} from './data/course.js';
import {units} from './data/units.js?v=2';
import {renderReflection, secretMarkup} from './lesson-tools.js';

const lessonLink = (unit, section, label, style = 'secondary') =>
  `<a class="button ${style}" href="#${unit.id}/${section}">${label}</a>`;
const heading = (title, text) => `<h1 lang="en">${escape(title)}</h1><p class="page-intro muted">${escape(text)}</p>`;

function scrambled(questions) {
  return questions.map(q => q.options ? {...q,options:shuffle(q.options)} : q);
}

export function courseBanks(unit) {
  const data = courseContent[unit.id];
  const vocab = data.words.map(([en,ru],i) => ({
    id:`u${unit.id}-v-${i+1}`,
    type:'choice',
    prompt:`Выбери перевод: ${en}`,
    answer:ru,
    options:[ru,...data.words.slice(i+1).concat(data.words.slice(0,i)).slice(0,2).map(w=>w[1])],
    explain:`${en} — ${ru}.`
  }));
  return {
    Vocabulary:vocab,
    Grammar:data.rules.flatMap(rule=>rule.questions),
    Reading:data.check,
    Practice:data.practice,
    'History Challenge':data.scenes
  };
}

const teacherNotes = {
  learn:'Начните с одного вопроса об интересах ученика. Выберите два-три учебных этапа для первой встречи и завершите коротким устным итогом.',
  vocabulary:'Сначала покажите слово и попросите объяснить его по-русски. Затем закройте список и предложите найти слово в тексте или придумать свой пример.',
  grammar:'Сначала прочитайте пример, затем попросите ученика объяснить свой выбор. Для усложнения замените героя и сохраните конструкцию.',
  reading:'До чтения обсудите заголовок. После чтения попросите ученика найти в тексте фразу, которая подтверждает его ответ.',
  listening:'Учитель может прочитать адаптированный текст из Reading. Первый раз ученик слушает для общего смысла, второй — для деталей.',
  speaking:'Дайте минуту на подготовку. Для опоры прочитайте начало фразы. Для усложнения попросите задать встречный вопрос.',
  practice:'Проверьте содержание, порядок мыслей и использование конструкции юнита. Можно дать образец начала, затем убрать его.',
  games:'Попросите ученика после каждого выбора объяснить ответ одним коротким предложением. Можно пройти раунд без словаря.',
  challenge:'Предложите закончить проверку без подсказок, затем выберите одну ошибку для устного разбора.',
  progress:'Разберите с учеником последние ошибки. Можно повторить их в другом порядке и затем вернуться к тексту.'
};

export function renderCourseUnit(root, unit, section) {
  const data = courseContent[unit.id];
  const banks = courseBanks(unit);
  const masteredCount = questions => questions.filter(q=>progress.answers[q.id]?.mastered).length;
  const all = Object.values(banks).flat();
  const mistakes = () => all.filter(q=>progress.answers[q.id]?.lastCorrect===false);
  const bookPage = Number(data.pages.split('–')[0]);

  root.innerHTML = `${state.teacher&&teacherNotes[section]?`<aside class="teacher-box"><b>Для учителя</b><p>${escape(teacherNotes[section])}</p></aside>`:''}<div class="course-section"></div>`;
  const view = $('.course-section',root);
  const bank = (selector, questions, title) => quizBank($(selector,view),scrambled(questions),{title});
  const renderers = {
    learn() {
      const learned = masteredCount(all);
      view.innerHTML = `<section class="hero course-hero">
        <div><span class="section-label">English World 4 · Unit ${unit.id}</span>
        <h1 lang="en">${escape(data.title)}</h1><p class="lead" lang="en">${escape(data.readingTitle)}</p>
        <div class="row">${lessonLink(unit,'speaking','Начать урок','')}${lessonLink(unit,'reading','Открыть чтение')}</div></div>
        <div class="unit-hero-icon" aria-hidden="true">${data.icon}</div>
        </section>
        <div class="home-tiles">
          <a class="home-tile" href="#${unit.id}/progress"><span class="section-label">Мой прогресс</span><b>${learned} из ${all.length}</b><span>Заданий освоено</span><progress value="${learned}" max="${all.length}" aria-label="Прогресс юнита"></progress></a>
          <a class="home-tile" href="#${unit.id}/vocabulary"><span class="section-label">Словарь</span><b>8 слов</b><span>Значения и тренировка</span></a>
          <a class="home-tile" href="#${unit.id}/reading"><span class="section-label">Чтение</span><b lang="en">${escape(data.readingTitle)}</b><span>Текст и проверка понимания</span></a>
          <a class="home-tile" href="#${unit.id}/games"><span class="section-label">Историческая игра</span><b lang="en">${escape(data.gameTitle)}</b><span>Три раунда</span></a>
        </div>
        <div class="section-head"><h2>Как устроен урок</h2></div>
        <div class="card route-strip">${[
          ['speaking','Warm-up'],['vocabulary','Vocabulary'],['grammar','Grammar'],['reading','Reading'],
          ['listening','Listening'],['practice','Practice'],['games','History Challenge'],['reflection','Reflection']
        ].map(([id,label])=>`<a href="#${unit.id}/${id}">${label}</a>`).join('')}</div>
        <div class="section-head"><h2>Юниты English World 4</h2></div>
        <div class="unit-map">${units.map(item=>`<a class="unit-number ${item.id===unit.id?'current':''}" href="#${item.id}/learn" ${item.id===unit.id?'aria-current="page"':''}>${item.id}<small lang="en">${escape(item.title)}</small></a>`).join('')}</div>
        <p class="source">Pupil’s Book, pp. ${data.pages} · Grammar Practice Book, pp. ${data.grammarPages} · Dictionary, Unit ${unit.id}</p>`;
    },
    vocabulary() {
      view.innerHTML = heading('Vocabulary','Открой слово, прочитай перевод и проверь себя.')+
        `<div class="word-list course-word-list">${data.words.map(([en,ru],i)=>`<details class="word-item">
          <summary lang="en"><b>${escape(en)}</b></summary><p>${escape(ru)}</p>
          <button class="button secondary small" data-word="${i}" type="button">Послушать</button></details>`).join('')}</div>
        <div class="section-head"><h2>Проверь слова</h2></div><div class="course-bank"></div>`;
      $$('[data-word]',view).forEach(button=>{button.onclick=()=>speech(data.words[Number(button.dataset.word)][0])});
      bank('.course-bank',banks.Vocabulary,'Vocabulary');
    },
    grammar() {
      view.innerHTML = heading('Grammar','Прочитай объяснение, разбери пример и попробуй сам.')+
        `<div class="tabs">${data.rules.map((rule,i)=>`<button class="tab" type="button" data-rule="${i}">${escape(rule.title)}</button>`).join('')}</div>
        <div class="rule-explanation"></div><div class="course-bank"></div>`;
      const show = i => {
        const rule = data.rules[i];
        $$('[data-rule]',view).forEach((b,n)=>{
          b.classList.toggle('active',n===i);
          b.setAttribute('aria-pressed',String(n===i));
        });
        $('.rule-explanation',view).innerHTML=secretMarkup(rule.note,rule.example);
        bank('.course-bank',rule.questions,rule.title);
      };
      $$('[data-rule]',view).forEach(button=>{button.onclick=()=>show(Number(button.dataset.rule))});
      show(0);
    },
    reading() {
      view.innerHTML = heading(data.readingTitle,'Прочитай адаптированный текст. Затем ответь на вопросы.')+
        `<article class="card"><p class="source">По тексту Pupil’s Book, pp. ${bookPage}–${bookPage+1}</p>
        ${data.reading.map(text=>`<p class="story-text" lang="en">${escape(text)}</p>`).join('')}</article>
        <div class="section-head"><h2>Проверь понимание</h2></div><div class="course-bank"></div>`;
      bank('.course-bank',banks.Reading,'Reading');
    },
    listening() {
      view.innerHTML = heading('Listening','Послушай короткую цифровую адаптацию текста и ответь на вопросы.')+
        `<article class="card"><h2 lang="en">${escape(data.readingTitle)}</h2>
        <p>Текст читает английский голос браузера. Можно включить повторное чтение или попросить учителя прочитать текст из раздела Reading.</p>
        <div class="row"><button class="button start-listening">Послушать</button><button class="button secondary stop-listening">Остановить</button></div>
        <p class="note">Оригинальной записи для этого юнита в предоставленных материалах нет. Задание учебника на аудирование находится на стр. ${bookPage+6}.</p></article>
        <div class="section-head"><h2>Что ты услышал?</h2></div><div class="course-bank"></div>`;
      $('.start-listening',view).onclick=()=>speech(data.reading.join(' '));
      $('.stop-listening',view).onclick=cleanupMedia;
      bank('.course-bank',banks.Reading,'Listening · адаптация');
    },
    speaking() {
      view.innerHTML = heading('Speaking','Скажи ответ вслух, затем задай вопрос преподавателю.')+
        `<div class="card yellow"><span class="section-label">Warm-up</span><h2 lang="en">What do you already know?</h2>
        <p lang="en">Look at the title “${escape(data.title)}”. What words do you know about this topic?</p></div>
        <div class="section-head"><h2>Говорим по теме</h2></div><div class="card">
        <p class="story-text" lang="en">${escape(data.speak)}</p><details class="speech-support" open>
        <summary>Начало ответа</summary><p lang="en">${escape(data.support)}</p></details></div><div class="section-footer">${lessonLink(unit,'vocabulary','Перейти к словам')}</div>`;
    },
    practice() {
      const key = `u${unit.id}-writing`;
      view.innerHTML = heading('Practice','Проверь изученное и напиши короткий текст.')+
        `<div class="course-bank"></div><div class="section-head"><h2>Writing</h2></div>
        <section class="card"><p>${escape(data.writing)}</p>
        <label class="input-label">Мой текст<textarea lang="en"></textarea></label>
        <p class="writing-saved" role="status"></p>
        <details class="hint"><summary>Проверь себя</summary><p>Я выполнил задание. Мои мысли идут по порядку. Я проверил заглавные буквы и точки.</p></details>
        ${state.teacher?`<details class="teacher-answer"><summary>Показать опору для ответа</summary><p lang="en">${escape(data.support)}<br>${escape(data.rules[0].example)}</p></details>`:''}</section>`;
      bank('.course-bank',banks.Practice,'Practice');
      const draft=$('textarea',view);
      draft.value=progress.drafts[key]||'';
      if(!state.teacher) draft.oninput=()=>{
        progress.drafts[key]=draft.value;
        save();
        $('.writing-saved',view).textContent='Черновик сохранён.';
      };
    },
    games() {
      view.innerHTML = heading(data.gameTitle,'Реши три задания. После ответа узнаешь, почему подходит именно этот вариант.')+
        `<div class="card yellow"><p>Это авторская игра на лексику и грамматику юнита.</p>
        <button class="button start-course-game" type="button">Играть</button></div>
        <div class="section-footer"><a class="button secondary" href="#4/games">Исторические игры Unit 4</a></div>`;
      $('.start-course-game',view).onclick=()=>runRounds(view,unit,banks['History Challenge'],{title:data.gameTitle});
    },
    challenge() {
      view.innerHTML = heading('Challenge','В каждом задании учитывается первый ответ. Разбор появится в конце.')+
        '<button class="button start-course-check" type="button">Начать проверку</button>';
      const questions=[...banks.Vocabulary.slice(0,2),...banks.Grammar,...banks.Reading,...banks.Practice];
      $('.start-course-check',view).onclick=()=>runRounds(view,unit,questions,{title:'Challenge',exam:true});
    },
    reflection() {
      renderReflection(view,unit,[
        'I can use three new words.',
        'I can explain one idea from the reading.',
        'I can give an example of the grammar.'
      ]);
    },
    progress() {
      const tests = progress.challenge.filter(item=>item.unit===unit.id);
      view.innerHTML=heading('Progress','Посмотри, какие задания уже освоены, и вернись к ошибкам.')+
        `<div class="grid three">${Object.entries(banks).map(([label,questions])=>{
          const count=masteredCount(questions);
          return `<div class="card"><h3 lang="en">${escape(label)}</h3><div class="stat">${count} / ${questions.length}</div>
            <progress value="${count}" max="${questions.length}" aria-label="${escape(label)}"></progress></div>`;
        }).join('')}</div><div class="section-head"><h2>Работа над ошибками</h2></div>
        <div class="card"><p>${mistakes().length?`Для повторения: ${mistakes().length}`:'Здесь появятся задания для повторения.'}</p>
        <button class="button secondary review-course-errors" type="button" ${mistakes().length?'':'disabled'}>Повторить ошибки</button></div><div class="review-bank"></div>
        <div class="section-head"><h2>Результаты проверок</h2></div>
        ${tests.length?`<div class="result-list">${tests.slice(-10).reverse().map(test=>`<div class="result-row"><span>${new Date(test.date).toLocaleDateString('ru-RU')}</span><b>${test.score} / ${test.total}</b></div>`).join('')}</div>`:'<p class="muted">Завершённых проверок пока нет.</p>'}
        <div class="section-head"><h2>Награда юнита</h2></div>
        <div class="card ${masteredCount(all)>=Math.ceil(all.length*.8)?'yellow':''}"><b>🏅 ${masteredCount(all)>=Math.ceil(all.length*.8)?'Получено!':'Освой 80% заданий'}</b></div>
        <div class="section-footer">${lessonLink(unit,'reflection','Открыть рефлексию')}</div>`;
      $('.review-course-errors',view).onclick=()=>bank('.review-bank',mistakes(),'Повторение');
    }
  };
  renderers[section]();
}

function runRounds(root,unit,questions,{title,exam=false}) {
  const sequence=scrambled(questions);
  const results=[];
  let index=0;
  function draw() {
    const question=sequence[index];
    root.innerHTML=heading(title,exam?'Выбери или напиши ответ.':'Попробуй ответить. При необходимости загляни в разбор.')+
      `<p class="question-meta">${index+1} / ${sequence.length}</p>
        <progress max="${sequence.length}" value="${index}" aria-label="Ход задания"></progress>
        <div class="question-stage"></div><button class="button next-round" type="button" disabled>${index+1===sequence.length?'Получить результат':'Дальше'}</button>`;
    const next=$('.next-round',root);
    renderQuestion($('.question-stage',root),question,{label:title,exam,record:!exam,onAnswer(correct,value){
      if(!results[index])results[index]={id:question.id,correct,value};
      next.disabled=false;
    }});
    next.onclick=()=>{
      index++;
      if(index<sequence.length)draw();else finish();
      $('h1',root).tabIndex=-1;
      $('h1',root).focus({preventScroll:true});
      window.scrollTo({top:0,behavior:'instant'});
    };
  }
  function finish() {
    const score=results.filter(result=>result.correct).length;
    if(exam&&!state.teacher){
      progress.challenge.push({unit:unit.id,date:new Date().toISOString(),score,total:sequence.length,results});
      save();
    }
    root.innerHTML=heading(title,'Готово!')+
      `<div class="card yellow"><div class="stat">${score} / ${sequence.length}</div>
       <p>Верно с первой попытки</p><div class="row"><button class="button replay-rounds">Пройти снова</button>
       ${lessonLink(unit,'progress','Мой прогресс')}${lessonLink(unit,'reflection','Рефлексия')}</div></div>
       <div class="result-list">${sequence.map((q,i)=>`<article class="card"><p><b>${escape(q.prompt)}</b></p>
       <p>Твой ответ: ${escape(results[i].value)}</p><p>Один из верных вариантов: <b>${escape(q.answer)}</b></p><p>${escape(q.explain)}</p></article>`).join('')}</div>`;
    $('.replay-rounds',root).onclick=()=>runRounds(root,unit,questions,{title,exam});
  }
  draw();
}
