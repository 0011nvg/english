const choice = (slug, prompt, answer, distractors, explain, scene) =>
  ({slug, prompt, answer, options:[answer, ...distractors], explain, scene, type:'choice'});
const order = (slug, prompt, answer, explain, scene, tokens = answer.split(' '), joiner = ' ') =>
  ({slug, prompt, answer, explain, scene, tokens, joiner, type:'order'});
const input = (slug, prompt, answer, explain, accept = [], scene) =>
  ({slug, prompt, answer, explain, accept, scene, type:'input'});
const open = (slug, prompt, model, hint, scene) =>
  ({slug, prompt, model, hint, scene, type:'open'});

export const moods = [
  {id:'happy', word:'Happy', caption:'My tea arrived on time.', cue:'I feel happy because …', image:'queen-happy'},
  {id:'curious', word:'Curious', caption:'Who hid my biscuits?', cue:'I’m curious about …', image:'queen-curious'},
  {id:'tired', word:'Tired', caption:'Even queens need a nap.', cue:'I feel tired because …', image:'queen-tired'},
  {id:'surprised', word:'Surprised', caption:'The crown did WHAT?', cue:'I’m surprised because …', image:'queen-surprised'}
];

export const historySources = {
  jug:{label:'London Museum · Medieval face jug', url:'https://www.londonmuseum.org.uk/collections/v/object-34047/jug/'},
  candles:{label:'English Heritage · Helmsley Castle, предмет 9', url:'https://www.english-heritage.org.uk/siteassets/home/learn/teaching-resources/learning-resources-sections/helmsley-handling-collection-cards_ks2.pdf'},
  crown:{label:'The Royal Family · Coronation facts', url:'https://www.royal.uk/100-coronation-facts'},
  wheel:{label:'The Metropolitan Museum of Art · Jug, 1400–1600', url:'https://www.metmuseum.org/art/collection/search/468399'}
};

const fact = (slug, prompt, isTrue, explain, source, scene) =>
  ({...choice(slug,prompt,isTrue?'Fact':'Fiction',[isTrue?'Fiction':'Fact'],explain,scene), source});

export const historyGames = [
  {
    id:'meme-lab', title:'Medieval Meme Lab', icon:'🎨', goal:'Описать смешную картинку и закончить диалог',
    desc:'Подпиши мем, исправь реплику и допиши диалог.', art:'knight-wheel',
    intro:'Посмотри на рисунок. Где есть выбор, найди подходящую подпись. В открытых заданиях придумай свою реплику на английском.',
    ending:'Три экспоната для музея мемов готовы. Сэр Глина просит убрать только один. Тот, где он на круге.',
    rounds:[
      open('caption','Write a funny caption for the knight at the wheel.','When I said “turn the pot”, I didn’t mean “turn the knight”!', 'Начни с When I … или The knight …','A knight tried to make a vase. The wheel had other plans.'),
      input('fix','Fix one word: When the wheel started, the vase fall.','fell','fall → fell. Ваза уже упала.',['When the wheel started, the vase fell.'],'The vase did its own stunt.'),
      open('dialogue','King: “Is there anything in this basket?” Cat: “…”','“Nothing but your new boss. Meow!”','Можно начать с There is something … или Nothing but …','The basket says “meow”.')
    ]
  },
  {
    id:'kings-english', title:'The King’s English', icon:'👑', goal:'Исправить Past Simple и выбрать слова для вопроса',
    desc:'Стань учителем короля. Он уверен, что go уже в прошлом.', art:'pot-hat',
    intro:'Исправь формы в репликах короля. Можно написать слово или целое исправленное предложение.',
    ending:'“I learnt three things today,” said the king. The cat checked the sentence. It was finally right.',
    success:'“Even my cat is impressed!”', retry:'“Can I blame my crown? Let me try again.”',
    rounds:[
      input('went','King: Yesterday I go to my castle.','went','go → went. Yesterday указывает на прошлое.',['Yesterday I went to my castle','Your Majesty, yesterday you went to your castle','Yesterday you went to your castle'],'The king is sure that a crown makes every sentence correct.'),
      input('made','King: I make a pot yesterday.','made','make → made.',['I made a pot yesterday'],'He made it. He is also wearing it.'),
      input('anything','King: I can’t hear nothing. Fix the last word.','anything','После can’t здесь подходит anything.',["I can't hear anything",'I cannot hear anything'],'The king put the pot over his ears. That explains a lot.')
    ]
  },
  {
    id:'detective', title:'Historical Detective', icon:'🔍', goal:'Узнать ремесло и предмет по коротким подсказкам',
    desc:'Угадай предметы из мастерской по английским уликам.', art:'basket-cat',
    intro:'Прочитай улики. Выбери человека или вещь. Назови вслух слово, которое помогло угадать.',
    ending:'Case closed. Следы лап и дырка в корзине раскрыли самое громкое дело недели.',
    rounds:[
      choice('potter','I work with clay. I use a wheel. I make bowls. Who am I?','a potter',['a weaver','a cook'],'Clay, wheel и bowls подсказывают профессию.','Three clues are on the castle door.'),
      choice('candle','I am made of wax. You can light me when it is dark. What am I?','a candle',['a basket','a vase'],'Wax — воск. A candle — свеча.','The detective found a small object near the stairs.'),
      choice('loom','I hold threads. A weaver works with me. What am I?','a loom',['a wheel','a mould'],'На ткацком станке натянуты нити.','There are threads all over the room.')
    ]
  },
  {
    id:'fact-fiction', title:'History Fact or Fiction?', icon:'🏺', goal:'Понять короткий исторический факт на английском',
    desc:'Угадай, что правда. После ответа откроется объяснение и источник.', art:'castle-candle',
    intro:'Прочитай утверждение. Выбери Fact, если оно верно, или Fiction, если это выдумка.',
    ending:'Ты проверил четыре утверждения. Расскажи, какой факт удивил тебя больше всего.',
    rounds:[
      fact('face-jug','Some medieval potters put faces on their jugs.',true,'В коллекции London Museum есть глиняный кувшин с бородатым лицом. Такие кувшины были популярны вокруг Лондона.','jug','Imagine pouring water from a jug with a beard.'),
      fact('electric','Medieval wax candles needed electricity.',false,'Свечи горели с помощью фитиля. В средневековых источниках описаны свечи из воска и животного жира.','candles','A knight is looking for a light switch. Good luck with that.'),
      fact('cat','A cat slept on the Coronation Chair on Elizabeth II’s coronation day.',true,'Утром коронации в кресле нашли спящего чёрного кота по имени Мэтинс. Это было в 1953 году.','crown','One royal seat. One very confident cat.'),
      fact('wheel','A potter could decorate wet clay while it turned on a wheel.',true,'В музее Met есть кувшин с полосами, которые нанесли на влажную глину на вращающемся круге.','wheel','Round and round. The lines stay straight!')
    ]
  },
  {
    id:'royal-battle', title:'Royal Grammar Battle', icon:'⚡', goal:'Связать два события с when и поставить глаголы в Past Simple',
    desc:'Три раунда против короля и его неправильных глаголов.', art:'pot-hat',
    intro:'Восстанови фразы короля. В одном раунде собери слова по порядку.',
    ending:'The king lost the battle. He won a new verb. Fair deal.',
    success:'“Excellent! Put that verb on my shield.”', retry:'“The grammar dragon ate my homework!”',
    rounds:[
      choice('saw','When the king opened the door, he ___ a giant vase.','saw',['see','seeing'],'Оба действия произошли в прошлом. see → saw.','Round 1: Surprise at the door.'),
      choice('ran','When the wheel stopped, the cat ___ away.','ran',['runs','run'],'Past Simple: run → ran.','Round 2: The cat refuses to stay for grammar.'),
      order('sentence','Собери: Когда король увидел горшок, он рассмеялся.','When the king saw the pot he laughed','When the king saw the pot, he laughed. После части с When ставим запятую.','Round 3: The pot looks like the king.')
    ]
  },
  {
    id:'save-knight', title:'Save the Knight', icon:'🛡️', goal:'Понять короткие инструкции и выбрать инструмент',
    desc:'Рыцарь застрял в мастерской. Найди предметы, которые ему помогут.', art:'knight-wheel',
    intro:'Выбери предмет по смыслу реплики. После каждого ответа откроется следующий шаг спасения.',
    ending:'The knight is free! He thanked the basket. The basket said “meow”.',
    rounds:[
      choice('basket','Put the little tools in a ___.','basket',['candle','wheel'],'В корзину легко сложить небольшие инструменты.','The knight’s feet are stuck under the workbench. Clear the floor.'),
      choice('candle','It is dark. Which thing can give light?','a candle',['a lump of clay','a loom'],'Свеча даёт свет.','The door is open, but the stairs are dark.'),
      choice('wax','What is the candle made of?','wax',['wool','reeds'],'Свечу в этой мастерской сделали из воска.','The knight can see the stairs. He wants to order a new candle.')
    ]
  },
  {
    id:'castle-escape', title:'Castle Escape', icon:'🚪', goal:'Составить вопросы с anything и показать порядок действий',
    desc:'Открой три двери замка с помощью английского.', art:'basket-cat',
    intro:'У каждой двери есть своя фраза. Собери её или выбери нужное слово.',
    ending:'You’re out! The castle cat found a door marked “Exit” five minutes ago.',
    rounds:[
      order('door','Собери вопрос: Есть ли что-нибудь в коробке?','Is there anything in the box','В нейтральном вопросе подойдёт anything.','Door 1. There’s a little box next to the lock.'),
      choice('key','The box has a key. There is ___ in it.','something',['nothing','anything'],'Something сообщает, что внутри что-то есть.','Door 2. Lift the lid and look inside.'),
      choice('last','We find the key, we open the door and ___ we go outside.','finally',['first','carefully'],'Finally показывает последний шаг.','Door 3. Fresh air at last!')
    ]
  },
  {
    id:'royal-message', title:'Fix the Royal Message', icon:'✉️', goal:'Проверить Past Simple, отрицание и множественное число',
    desc:'В письме для мастеров три ошибки. Найди и исправь их.', art:'pot-hat',
    intro:'В каждом предложении письма одна ошибка. Впиши исправленное слово.',
    ending:'The message is ready. The king signed it. The cat walked across the ink.',
    rounds:[
      input('bought','Yesterday I buy some wax.','bought','buy → bought.',['Yesterday I bought some wax'],'The king’s shopping report.'),
      input('knives','We need two sharp knifes.','knives','knife → knives.',['We need two sharp knives'],'An order from the basket maker.'),
      input('anything','I didn’t find nothing in the basket. Fix the last word.','anything','После didn’t здесь подходит anything.',["I didn't find anything in the basket",'I did not find anything in the basket'],'A basket inspection on royal orders.')
    ]
  },
  {
    id:'history-meme', title:'History Meme Challenge', icon:'💬', goal:'Прочитать подписи и описать сцену в Past Simple',
    desc:'Придумай королевскую подпись и выбери те, что подходят к сцене.', art:'pot-hat',
    intro:'Выбирай подпись, которая подходит к рисунку и написана правильно. Затем придумай свою.',
    ending:'The Royal Meme Gallery is open. Admission: one good English sentence.',
    rounds:[
      choice('hat','Which caption fits the picture?','The king put a pot on his head.',['The king put a basket on the horse.','The king puts a pot on his bed.'],'Pot, head и действие в прошлом описывают сцену.','The knight makes a pot. The king thinks it is the latest fashion.'),
      choice('basket','Which caption fits the noisy basket?','When I looked in the basket, I saw a cat.',['When I looked in the basket, I see a cat.','When I opened a cupboard, I saw a horse.'],'После looked рассказываем о результате тоже в Past Simple: saw.','Forget the crown. Look at the basket.'),
      open('own','What does the king say about his new “hat”?','“My new hat is beautiful. Why does it have a handle?”','Начни с My new hat is … или Is there …?','The king is waiting for your caption.')
    ]
  },
  {
    id:'royal-workshop', title:'The Royal Workshop', icon:'⚱️', goal:'Назвать материалы и поставить этапы изготовления по порядку',
    desc:'Сделай горшок и объясни, что мастер делает сначала и в конце.', art:'knight-wheel',
    intro:'Собери заказ короля. Сначала выбери материал, затем расставь действия по порядку.',
    ending:'The king asked for a vase. He got a royal hat. The potter asked for a day off.',
    rounds:[
      choice('material','You want to make a pot on a wheel. What do you need?','clay',['reeds','wool'],'Горшок на круге делают из глины.','Your order: one vase for the king. No holes, please.'),
      order('steps','Нажми действия в том порядке, в котором их выполняет гончар.','Shape the clay · Dry the pot · Paint the pot','Сначала форма, потом сушка, в конце роспись.','The potter needs his instruction cards back.', ['Shape the clay','Dry the pot','Paint the pot'],' · '),
      choice('candle','Finally, we take the cold candle out of the ___.','mould',['loom','wheel'],'Mould — форма. Когда воск остыл, свечу вынимают.','The king wants a candle to see his amazing vase.')
    ]
  },
  {
    id:'who-said', title:'Who Said That?', icon:'🎭', goal:'Узнать мастера по словам об инструментах и материалах',
    desc:'Три реплики из замка. Угадай, кто их сказал.', art:'castle-candle',
    intro:'В каждой реплике есть подсказка. Найди слово про материал или инструмент и выбери мастера.',
    ending:'You know the voices of the castle. The cat would like a speaking part next time.',
    rounds:[
      choice('weaver','“I use a loom and wool every day.”','the weaver',['the potter','the candle maker'],'Loom и wool указывают на ткача.','Three castle workers hid behind a curtain.'),
      choice('candle','“I pour the wax into a mould.”','the candle maker',['the weaver','the potter'],'Wax — воск. В этой реплике мастер делает свечу.','Another voice comes from behind the curtain.'),
      choice('potter','“I dry my pots slowly before I paint them.”','the potter',['the basket maker','the weaver'],'Pots — изделия гончара.','One worker is covered in little dots of clay.')
    ]
  },
  {
    id:'time-travel', title:'Time Travel English', icon:'⏳', goal:'Понять рассказ о ремесле и связать события в прошлом',
    desc:'Пройди от средневекового рынка до музея наших дней.', art:'basket-cat',
    intro:'Прочитай короткую сцену на каждой остановке. Ответ откроет следующую встречу.',
    ending:'Back in the museum. The jug looks familiar. It still has mud from the knight’s boots.',
    rounds:[
      choice('market','“I shaped the clay, but the jug is still wet.” What did the potter make?','a jug',['a candle','a ribbon'],'Jug — кувшин. Его сделал гончар.','Medieval market. A potter is carrying a jug with a funny face.'),
      choice('castle','When the cat ___ the jug, the knight ran.','pushed',['push','pushing'],'Сначала кот толкнул кувшин, потом рыцарь побежал.','Castle kitchen. The knight tries to hide the jug from the cat.'),
      open('museum','Tell a visitor what happened. Start with “When the cat …”.','“When the cat pushed the jug, the knight ran.”','Свяжи два события с When. Для рассказа в прошлом подойдут pushed, ran, found.','Museum today. A visitor asks why the jug has a funny face.')
    ]
  }
].map(game => ({...game, rounds:game.rounds.map(round => ({...round, id:`history-${game.id}-${round.slug}`}))}));

export const workshopArt = {
  'knight-wheel':{alt:'Рыцарь пытается удержать кривую вазу на гончарном круге'},
  'basket-cat':{alt:'Полосатый кот выглядывает из плетёной корзины'},
  'castle-candle':{alt:'В замковой мастерской король держит свечу, а повара машут руками'},
  'pot-hat':{alt:'Король примеряет глиняный горшок вместо шляпы'}
};
