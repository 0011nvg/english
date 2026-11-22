export const workshops = [
  {
    "short": "Present или Past?",
    "title": "Мастерская времени",
    "html": "<p>Представь две подписи к фото гончара. <b>She makes bowls.</b> Такова её работа. <b>She made this bowl.</b> Она уже сделала именно эту миску. Даже без yesterday смысл подсказывает время.</p><div class=\"table-wrap\"><table><tr><th></th><th>Present Simple · обычно</th><th>Past Simple · тогда</th></tr><tr><th>+</th><td>I work. She works.</td><td>I worked. She worked.</td></tr><tr><th>−</th><td>She doesn’t work.</td><td>She didn’t work.</td></tr><tr><th>?</th><td>Does she work?</td><td>Did she work?</td></tr></table></div><p>Every Friday и usually часто сопровождают привычку. Yesterday, last Friday и two days ago помещают действие в прошлое. Привычка тоже может быть прошлой: <b>When he was young, he made pots every day.</b></p><p>Если описываешь, где или каким был герой, пригодится <b>be</b>: I/he/she/it was, you/we/they were. Вопрос: Was the vase heavy? Отрицание: The cups weren’t heavy.</p>",
    "secret": "Покажи вещь рядом с собой. Скажи, как обычно её используешь, а потом расскажи, что делал с ней вчера.",
    "source": "Дополнительная практика · Unit 4",
    "questions": [
      {
        "id": "g4x1-1",
        "prompt": "Гид рассказывает о своей работе: “I show visitors the castle.” Какое это время?",
        "answer": "Present Simple",
        "explain": "Гид описывает свою обычную работу.",
        "type": "choice",
        "options": [
          "Present Simple",
          "Past Simple"
        ]
      },
      {
        "id": "g4x1-2",
        "prompt": "Из дневника: “We found a ring under the floor.” Какое это время?",
        "answer": "Past Simple",
        "explain": "Found — прошедшая форма find. Речь об одной находке.",
        "type": "choice",
        "options": [
          "Present Simple",
          "Past Simple"
        ]
      },
      {
        "id": "g4x1-3",
        "prompt": "Это расписание музея. The guide ___ the doors at ten every morning.",
        "answer": "opens",
        "explain": "Обычное действие. The guide = he или she, поэтому opens.",
        "type": "choice",
        "options": [
          "opened",
          "opens",
          "open"
        ]
      },
      {
        "id": "g4x1-4",
        "prompt": "Last winter, the guide ___ the doors at ten every morning.",
        "answer": "opened",
        "explain": "Last winter задаёт период в прошлом, хотя действие повторялось.",
        "type": "choice",
        "options": [
          "opens",
          "open",
          "opened"
        ]
      },
      {
        "id": "g4x1-5",
        "prompt": "Укажи подпись к фото со вчерашней экскурсии.",
        "answer": "We saw a knight.",
        "explain": "Saw сообщает, кого увидели на экскурсии.",
        "type": "choice",
        "options": [
          "We see a knight every week.",
          "We saw a knight."
        ]
      },
      {
        "id": "g4x1-6",
        "prompt": "Вчера зал был пуст. The hall ___ empty.",
        "answer": "was",
        "explain": "The hall — один зал. В прошлом используем was.",
        "type": "choice",
        "options": [
          "did",
          "was",
          "were"
        ]
      },
      {
        "id": "g4x1-7",
        "prompt": "Собери вопрос о щитах на выставке.",
        "answer": "Were the shields heavy?",
        "explain": "С shields берём were и ставим перед подлежащим.",
        "type": "order"
      }
    ]
  },
  {
    "short": "Irregular verbs",
    "title": "Бюро находок рыцарского замка",
    "html": "<p>У правильных глаголов есть окончание -ed: look → looked. У неправильных форму нужно запомнить. Выбери полку и прочитай пары вслух.</p><details><summary>В мастерской</summary><p>make → made (делать) · take → took (брать) · break → broke (ломать)</p></details><details><summary>На поисках</summary><p>go → went (идти) · see → saw (видеть) · find → found (находить)</p></details><details><summary>На рынке</summary><p>buy → bought (покупать) · give → gave (давать) · bring → brought (приносить)</p></details><p><b>The knight took the cup. Did he take the cup? He didn’t take the crown.</b> В вопросе и отрицании прошлое уже показывает did, поэтому берём исходную форму take.</p>",
    "secret": "Один игрок — стражник, другой — свидетель. Спроси Did you see the crown? Ответь и добавь, что ты видел.",
    "source": "Дополнительная практика · Unit 4",
    "questions": [
      {
        "id": "g4x2-1",
        "prompt": "Подмастерье закончил чашку. Yesterday he ___ a cup.",
        "answer": "made",
        "explain": "Make → made.",
        "type": "choice",
        "options": [
          "makes",
          "made",
          "maked"
        ]
      },
      {
        "id": "g4x2-2",
        "prompt": "Пропала печать! The knight ___ it to the tower. Впиши форму take.",
        "answer": "took",
        "explain": "Take → took.",
        "type": "input"
      },
      {
        "id": "g4x2-3",
        "prompt": "В отчёте ошибка: The potter breaked the bowl. Замени только breaked.",
        "answer": "broke",
        "explain": "Break → broke.",
        "type": "input"
      },
      {
        "id": "g4x2-4",
        "prompt": "Свидетель видел корону. Какой глагол искать в словаре для saw?",
        "answer": "see",
        "explain": "See → saw.",
        "type": "choice",
        "options": [
          "say",
          "see",
          "show"
        ]
      },
      {
        "id": "g4x2-5",
        "prompt": "Yesterday the guard ___ to the gate. Впиши форму go.",
        "answer": "went",
        "explain": "Go → went.",
        "type": "input"
      },
      {
        "id": "g4x2-6",
        "prompt": "Собери вопрос стражника.",
        "answer": "Did you find the key?",
        "explain": "После did используем find.",
        "type": "order"
      },
      {
        "id": "g4x2-7",
        "prompt": "Исправь одно слово: The knight didn’t bought the cup.",
        "answer": "buy",
        "explain": "После didn’t нужна исходная форма buy.",
        "type": "input"
      },
      {
        "id": "g4x2-8",
        "prompt": "The queen ___ the potter a coin yesterday. Впиши форму give.",
        "answer": "gave",
        "explain": "Give → gave.",
        "type": "input"
      },
      {
        "id": "g4x2-9",
        "prompt": "Гонец принёс письмо. He ___ a letter.",
        "answer": "brought",
        "explain": "Bring → brought значит «принёс». Buy → bought значит «купил».",
        "type": "choice",
        "options": [
          "bought",
          "brought",
          "brings"
        ]
      }
    ]
  },
  {
    "short": "Numbers",
    "title": "Озвучь музейную выставку",
    "html": "<p><b>How many?</b> Считаем экспонаты: one coin, two coins, twelve coins. <b>Which one?</b> Называем место по порядку: the first coin, the second coin, the third coin. Дальше часто добавляем -th: four → fourth, six → sixth. Запомни five → fifth, twelve → twelfth, twenty → twentieth.</p><p>13 — thirteen, 30 — thirty. В числах 21–99 из двух слов ставим дефис: twenty-one. Для порядкового меняется последнее слово: twenty-first (21st).</p><p>В 1969 году люди впервые высадились на Луне. Для аудиогида год можно прочитать двумя частями: <b>nineteen sixty-nine</b>. Теперь ты озвучиваешь экспозицию о полёте.</p>",
    "secret": "Придумай музейный билет. Назови номер зала, количество экспонатов и какой по счёту экспонат ты хочешь увидеть.",
    "source": "Дополнительная практика · Unit 4",
    "questions": [
      {
        "id": "g4x3-1",
        "prompt": "В витрине 13 моделей. There are ___ models.",
        "answer": "thirteen",
        "explain": "13 — thirteen, а 30 — thirty.",
        "type": "choice",
        "options": [
          "third",
          "thirty",
          "thirteen"
        ]
      },
      {
        "id": "g4x3-2",
        "prompt": "В зал пришли 30 гостей. Напиши 30 словом.",
        "answer": "thirty",
        "explain": "У десятка окончание -ty.",
        "type": "input"
      },
      {
        "id": "g4x3-3",
        "prompt": "Ты у второго экспоната. This is the ___ model.",
        "answer": "second",
        "explain": "Место по порядку: two → second.",
        "type": "choice",
        "options": [
          "two",
          "twice",
          "second"
        ]
      },
      {
        "id": "g4x3-4",
        "prompt": "Укажи подпись к двенадцатому билету.",
        "answer": "the twelfth ticket",
        "explain": "Twelve → twelfth.",
        "type": "choice",
        "options": [
          "the twelve tickets",
          "the twelfth ticket",
          "the twentieth ticket"
        ]
      },
      {
        "id": "g4x3-5",
        "prompt": "Впиши словами: the 21st visitor → the ___ visitor.",
        "answer": "twenty-first",
        "explain": "Меняем только one → first.",
        "type": "input",
        "accept": [
          "twenty first"
        ]
      },
      {
        "id": "g4x3-6",
        "prompt": "Архивная запись: In 1969, astronauts ___ on the Moon.",
        "answer": "landed",
        "explain": "1969 — завершённый год. Land — правильный глагол.",
        "type": "choice",
        "options": [
          "land",
          "lands",
          "landed"
        ]
      },
      {
        "id": "g4x3-7",
        "prompt": "Собери подпись к первому снимку в твоём альбоме.",
        "answer": "Yesterday I took my first photo.",
        "explain": "Took — прошлое от take, first — порядковое числительное.",
        "type": "order"
      }
    ]
  }
];
