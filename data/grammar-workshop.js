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
    "short": "Irregular plurals",
    "title": "Музей перепутанных подписей",
    "source": "Дополнительная практика · Unit 4",
    "secret": "Разыграйте экскурсию: гид называет один экспонат или посетителя, а гость представляет целую группу. I see a child! → I see children!",
    "html": "<p>Один щит — a shield, несколько — shields. У некоторых существительных множественное число особое. Открой витрины, затем восстанови подписи.</p><details><summary>Посетители</summary><p>child → <b>children</b> · man → <b>men</b> · woman → <b>women</b> · person → <b>people</b></p></details><details><summary>Следы и находки</summary><p>mouse → <b>mice</b> · tooth → <b>teeth</b> · foot → <b>feet</b> · goose → <b>geese</b></p></details><details><summary>Форма остаётся прежней</summary><p>sheep → <b>sheep</b> · deer → <b>deer</b></p></details>",
    "questions": [
      {
        "id": "gplural0",
        "explain": "child → children. Эту пару запоминаем целиком.",
        "teacherRu": [
          "child — ребёнок; форма множественного числа — children."
        ],
        "type": "choice",
        "prompt": "Найди пару для музейной карточки: child → …",
        "answer": "children",
        "options": [
          "childs",
          "children",
          "men"
        ]
      },
      {
        "id": "gplural1",
        "explain": "man → men. Эту пару запоминаем целиком.",
        "teacherRu": [
          "man — мужчина; форма множественного числа — men."
        ],
        "type": "input",
        "prompt": "Исправь подпись экскурсовода: several mans. Впиши только существительное.",
        "answer": "men"
      },
      {
        "id": "gplural2",
        "explain": "woman → women. Эту пару запоминаем целиком.",
        "teacherRu": [
          "woman — женщина; форма множественного числа — women."
        ],
        "type": "order",
        "prompt": "Собери из букв множественное число слова woman.",
        "tokens": [
          "w",
          "o",
          "m",
          "e",
          "n"
        ],
        "joiner": "",
        "answer": "women"
      },
      {
        "id": "gplural3",
        "explain": "mouse → mice. Эту пару запоминаем целиком.",
        "teacherRu": [
          "mouse — мышь; форма множественного числа — mice."
        ],
        "type": "choice",
        "prompt": "Найди пару для музейной карточки: mouse → …",
        "answer": "mice",
        "options": [
          "mouses",
          "mice",
          "teeth"
        ]
      },
      {
        "id": "gplural4",
        "explain": "tooth → teeth. Эту пару запоминаем целиком.",
        "teacherRu": [
          "tooth — зуб; форма множественного числа — teeth."
        ],
        "type": "input",
        "prompt": "Исправь подпись экскурсовода: several tooths. Впиши только существительное.",
        "answer": "teeth"
      },
      {
        "id": "gplural5",
        "explain": "foot → feet. Эту пару запоминаем целиком.",
        "teacherRu": [
          "foot — ступня; форма множественного числа — feet."
        ],
        "type": "order",
        "prompt": "Собери из букв множественное число слова foot.",
        "tokens": [
          "f",
          "e",
          "e",
          "t"
        ],
        "joiner": "",
        "answer": "feet"
      },
      {
        "id": "gplural6",
        "explain": "goose → geese. Эту пару запоминаем целиком.",
        "teacherRu": [
          "goose — гусь; форма множественного числа — geese."
        ],
        "type": "choice",
        "prompt": "Найди пару для музейной карточки: goose → …",
        "answer": "geese",
        "options": [
          "gooses",
          "geese",
          "sheep"
        ]
      },
      {
        "id": "gplural7",
        "explain": "sheep → sheep. Форма одинакова в обоих числах.",
        "teacherRu": [
          "sheep — овца; форма множественного числа — sheep."
        ],
        "type": "input",
        "prompt": "Исправь подпись экскурсовода: several sheeps. Впиши только существительное.",
        "answer": "sheep"
      },
      {
        "id": "gplural8",
        "explain": "deer → deer. Форма одинакова в обоих числах.",
        "teacherRu": [
          "deer — олень; форма множественного числа — deer."
        ],
        "type": "order",
        "prompt": "Собери из букв множественное число слова deer.",
        "tokens": [
          "d",
          "e",
          "e",
          "r"
        ],
        "joiner": "",
        "answer": "deer"
      },
      {
        "id": "gplural9",
        "explain": "person → people. Эту пару запоминаем целиком.",
        "teacherRu": [
          "person — человек; форма множественного числа — people."
        ],
        "type": "choice",
        "prompt": "Найди пару для музейной карточки: person → …",
        "answer": "people",
        "options": [
          "persons",
          "people",
          "children"
        ]
      },
      {
        "id": "gplural10",
        "type": "order",
        "prompt": "Собери сообщение смотрителя: «Дети увидели мышей».",
        "answer": "The children saw the mice.",
        "explain": "Child → children, mouse → mice. Saw показывает, что встреча уже произошла.",
        "teacherRu": [
          "Дети увидели мышей."
        ]
      }
    ]
  }
];
