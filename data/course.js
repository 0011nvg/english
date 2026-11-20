// Reading summaries and language exercises follow the supplied English World 4 edition.
// Page references use printed page numbers. Historical challenges are original practice.
const rule = (title, note, example, questions) => ({title, note, example, questions});
const choice = (prompt, answer, alternatives, explain) =>
  ({type:'choice', prompt, answer, options:[answer,...alternatives], explain});
const input = (prompt, answer, explain, accept = []) => ({type:'input',prompt,answer,explain,accept});
const order = (prompt, answer, explain) => ({type:'order',prompt,answer,explain});

const content = {
  1:{
    title:'School clubs', icon:'♟️', pages:'22–29', grammarPages:'4–6', readingTitle:'School clubs are fun!',
    words:[['choir','хор'],['competition','соревнование'],['practise','тренироваться'],['coach','тренер'],['record','рекорд'],['swim','плавать'],['win','побеждать'],['lose','проигрывать']],
    reading:[
      'Candy went to Choir. The group sang funny songs. Mrs Hall told them about a competition in December. Anna went to Computer Club. She learnt to make an animation. A girl threw a ball and a boy caught it.',
      'Pete swam fifty metres at Swimming Club. He wants to beat the club record. Sam played chess. He won against Ben but lost against Anna. He was tired after running in his sports lesson.'
    ],
    check:[choice('Who told the choir about a competition?','Mrs Hall',['Pete','Anna'],'Mrs Hall руководит хором.'),choice('Who won the chess game against Sam?','Anna',['Pete','Ben'],'Sam lost against Anna.'),choice('What did Anna learn at Computer Club?','to make an animation',['to swim','to play chess'],'Anna learnt animation.')],
    rules:[
      rule('Past Simple: irregular verbs','Если рассказываешь о вчерашнем событии, у некоторых глаголов меняется всё слово. Запомни пары go → went, swim → swam, throw → threw.','Yesterday Pete swam fifty metres.',[
        choice('Yesterday Candy ___ to Choir.','went',['go','goes'],'go → went.'),input('The girl ___ a ball. (throw)','threw','throw → threw.'),input('Sam ___ the chess game against Ben. (win)','won','win → won.')
      ]),
      rule('Too + adjective','Too перед словом-признаком означает «слишком». Too tired значит, что усталость мешает что-то сделать.','Sam was too tired to play well.',[
        choice('The room is ___ noisy. I can’t hear the song.','too',['two','to'],'Too noisy — слишком шумно.'),order('Собери: Задание слишком сложное.','The task is too difficult','Too ставим перед difficult.')
      ])
    ],
    practice:choice('Hi Anna! I ___ at Choir yesterday. See you soon, Candy.','sang',['sing','sings'],'В письме рассказываем о завершившемся событии: sang.'),
    speak:'Which club would you like to join? What did you do after school yesterday?',
    support:'I’d like to join … / Yesterday I went to … and I …',
    writing:'Напиши другу короткое письмо о кружке. Укажи, когда ты был там, что сделал и понравилось ли тебе.',
    scenes:[
      choice('Yesterday the young knight ___ a game of chess.','won',['wins','win'],'win → won.'),
      choice('The castle choir was ___ loud. The king put a bowl on his head.','too',['to','two'],'Too loud — слишком громко.'),
      input('The king’s cat ___ in the pond yesterday. (swim)','swam','swim → swam.')
    ], gameTitle:'The Castle Clubs'
  },
  2:{
    title:'In the theatre', icon:'🎭', pages:'30–37', grammarPages:'7–9', readingTitle:'Red Riding Hood',
    words:[['woodcutter','дровосек'],['cloak','плащ'],['path','тропинка'],['basket','корзина'],['curtains','занавески'],['knock','стучать'],['brave','смелый'],['scream','кричать']],
    reading:[
      'Red Riding Hood was walking to her grandmother’s house with a basket. The sun was shining. A wolf stopped her and showed her some flowers. While the girl was picking flowers, the wolf disappeared.',
      'At the house, the curtains were closed. Someone in Grandmother’s nightcap was sitting in bed. It was the wolf! Red Riding Hood called for help. Her father came in and the wolf escaped through the window. They found Grandmother in the cupboard.'
    ],
    check:[choice('Where was Red Riding Hood going?','to her grandmother’s house',['to the theatre','to school'],'Она шла к бабушке.'),choice('Who was wearing the nightcap?','the wolf',['the woodcutter','Grandmother'],'В кровати был волк.'),choice('Where was Grandmother?','in the cupboard',['in the forest','under the window'],'Бабушка оказалась в шкафу.')],
    rules:[
      rule('Past Continuous','Вспомни кадр из прошлого. Если действие шло прямо тогда, поставь was или were и добавь к глаголу -ing.','She was walking through the forest.',[
        choice('The birds ___ singing.','were',['was','is'],'Birds — несколько птиц: were.'),input('Red Riding Hood ___ wearing a red cloak.','was','She → was.'),order('Собери вопрос о корзине.','Was she carrying a basket','В вопросе Was идёт перед she.')
      ]),
      rule('Could / couldn’t','Could значит «мог» или «умел» в прошлом. После could глагол остаётся коротким: could see.','She couldn’t see well in the dark.',[
        choice('The curtains were closed. She ___ see well.','couldn’t',['can','could to'],'Couldn’t значит «не могла».'),input('A year ago I ___ read this story. (мог)','could','Could + глагол без to.')
      ])
    ],
    practice:choice('Which event belongs at the end of the story?','They found Grandmother.',['The girl picked flowers.','The wolf stopped on the path.'],'Бабушку нашли после побега волка.'),
    speak:'You are the woodcutter. What was the wolf doing when you opened the door?',
    support:'When I opened the door, the wolf was … / I could see …',
    writing:'Перескажи сказку по плану Beginning → Middle → End. Добавь одну реплику героя.',
    scenes:[
      choice('The knight ___ wearing a red cloak backstage.','was',['were','is yesterday'],'The knight → was.'),
      choice('The curtains were closed. The king ___ see the stage.','couldn’t',['could to','was'],'Couldn’t + see.'),
      order('Собери вопрос про репетицию.','Were they practising a play','Вопрос начинается с Were.')
    ], gameTitle:'The Backstage Mystery'
  },
  3:{
    title:'Water birds', icon:'🪶', pages:'38–45', grammarPages:'10–12', readingTitle:'Birds of the oceans and lakes',
    words:[['feather','перо'],['beak','клюв'],['wings','крылья'],['dive','нырять'],['nest','гнездо'],['swan','лебедь'],['cygnet','птенец лебедя'],['gosling','гусёнок']],
    reading:[
      'An albatross has long wings and a hooked beak. It can fly a long way and grab fish. A penguin cannot fly but it swims very well. The Emperor penguin is taller than the Little Blue penguin.',
      'Swans build nests with twigs and small branches near water. A young swan is a cygnet. Geese can swim and fly. When a group of geese flies, it often looks like a big V.'
    ],
    check:[choice('Which bird cannot fly?','a penguin',['an albatross','a goose'],'Пингвины хорошо плавают, но не летают.'),choice('What do swans use for their nests?','twigs and small branches',['wool and cloth','sand and shells'],'Swans use twigs and branches.'),choice('What do we call a young swan?','a cygnet',['a gosling','an albatross'],'Cygnet — лебедёнок.')],
    rules:[
      rule('More / the most','С длинными словами more помогает сравнить два предмета, а the most выделяет чемпиона среди всех.','This bird is more beautiful. That bird is the most beautiful of all.',[
        choice('Picture B is ___ beautiful than picture A.','more',['most','as'],'Подсказка: than.'),input('It is ___ most enormous nest in the book.','the','Перед most в превосходной степени ставим the.'),choice('Which means «самый трудный»?','the most difficult',['more difficult','as difficult'],'The most + difficult.')
      ]),
      rule('As … as','As … as — «такой же … как». Поставь слово-признак между двумя as. Not as … as значит, что равенства нет.','A young swan is not as white as its parents.',[
        choice('This bird is as ___ as that one.','strong',['stronger','strongest'],'Внутри as … as пишем strong.'),order('Собери сравнение двух птенцов.','This cygnet is as small as that one','As small as — такой же маленький, как.')
      ])
    ],
    practice:choice('Penguins can see well under water, ___ they can catch fish there.','so',['because','than'],'So показывает результат: поэтому.'),
    speak:'Compare two birds. What can each bird do? Which bird do you like best and why?',
    support:'The … is more … than the … / It can … because …',
    writing:'Сделай карточку водной птицы. Подпиши части тела и добавь 3–4 факта с because или so.',
    scenes:[
      choice('The king’s swan is ___ graceful than his wooden bird.','more',['most','as'],'More graceful than.'),
      choice('The royal map shows a V in the sky. What birds might it show?','geese',['penguins','cygnets in a nest'],'Гуси в полёте могут образовывать V.'),
      input('The king’s bird is as ___ as the queen’s bird. (strong)','strong','Внутри as … as форма strong.')
    ], gameTitle:'The Royal Bird Keeper'
  },
  5:{
    title:'All about a show', icon:'🎟️', pages:'56–63', grammarPages:'20–22', readingTitle:'A dance festival',
    words:[['festival','фестиваль'],['ballet','балет'],['programme','программка'],['ticket','билет'],['perform','выступать'],['graceful','грациозный'],['mask','маска'],['leap','прыгать']],
    reading:[
      'Olga and Mathew won festival tickets. Olga saw The Nutcracker. Clara got a wooden nutcracker. In her dream it came to life and protected her from the Mouse King. The nutcracker then became a prince.',
      'Mathew watched dancers from Japan and Palestine. A Japanese dance told a story about a brave soldier and an evil king. While the Palestinian dancers were performing, musicians were playing drums and pipes.'
    ],
    check:[choice('Which ballet did Olga see?','The Nutcracker',['Sleeping Beauty','The Red Shoes'],'Olga went to The Nutcracker.'),choice('What was Clara’s nutcracker made of?','wood',['iron','paper'],'It was a wooden nutcracker.'),choice('What were the musicians playing?','drums and pipes',['pianos','violins'],'Они играли на барабанах и дудках.')],
    rules:[
      rule('While + Past Continuous','While значит «пока» или «в то время как». Представь два действия на одном кадре: оба продолжались одновременно.','While we were waiting, I was reading the programme.',[
        choice('While Clara was sleeping, she ___ about mice.','was dreaming',['were dreaming','will dream'],'Clara → was.'),choice('___ the dancers were performing, the musicians were playing.','While',['Either','Finally'],'While связывает два одновременных действия.'),input('The musicians ___ playing the drums.','were','The musicians → were.')
      ]),
      rule('Either … or','Если есть два варианта и нужно выбрать один, скажи either … or — «либо … либо».','Choose either the mask or the fan.',[
        choice('You can take either a fan ___ an umbrella.','or',['and','but'],'Either … or.'),order('Собери: Выбери либо танец, либо песню.','Choose either a dance or a song','Either ставится перед первым вариантом.')
      ])
    ],
    practice:choice('Which detail does a visitor need to find the show?','the theatre address',['the colour of my shoes','a pet’s name'],'Адрес помогает зрителю найти театр.'),
    speak:'What was happening while you were waiting for the show? Ask a partner to choose one of two shows.',
    support:'While I was waiting, … / You can choose either … or …',
    writing:'Составь афишу и короткую программу представления. Добавь место, время и два номера.',
    scenes:[
      choice('While the king was dancing, the knight ___ playing a drum.','was',['were','are'],'The knight → was.'),
      choice('The cat can wear either a mask ___ a tiny crown.','or',['while','than'],'Either … or.'),
      input('While the cooks ___ eating, the queen was rehearsing.','were','Множественное число: were.')
    ], gameTitle:'The Castle Talent Show'
  },
  6:{
    title:'Changes in nature', icon:'🦋', pages:'64–71', grammarPages:'23–25', readingTitle:'Amazing changes',
    words:[['egg','яйцо'],['caterpillar','гусеница'],['chrysalis','куколка'],['dragonfly','стрекоза'],['larva','личинка'],['wing','крыло'],['spread','расправлять'],['feathers','перья']],
    reading:[
      'The first poem gives clues about four stages of a butterfly. A little egg is under a leaf. A caterpillar eats the leaf. Later, a chrysalis hangs up high. At the end, a butterfly appears and spreads its wings.',
      'Another poem describes a dragonfly larva and the thin adult dragonfly. A third poem shows an ordinary-looking chick that will become a colourful bird of paradise.'
    ],
    check:[choice('Which stage comes after the egg?','a caterpillar',['a chrysalis','a bird'],'Сначала из яйца выходит гусеница.'),choice('What hangs up high?','a chrysalis',['a duck','a dragonfly egg'],'Высоко висит куколка.'),choice('What will the chick become?','a bird of paradise',['a butterfly','a swan'],'Это птенец райской птицы.')],
    rules:[
      rule('Will / won’t','Will помогает сказать, что случится позже. Won’t значит will not. После will и won’t форма глагола не меняется.','It will become a butterfly. It won’t become a dragonfly.',[
        choice('The caterpillar ___ become a butterfly.','will',['was','has'],'Прогноз: will + become.'),input('It ___ become a bird. (will not)',"won’t",'Won’t = will not.',['will not']),order('Собери прогноз.','The butterfly will spread its wings','Will стоит перед spread.')
      ]),
      rule('Better, best, worse, worst','Good и bad меняются целиком. Запомни две лестницы: good → better → best, bad → worse → worst.','This one is better. That one is the best.',[
        choice('This picture is good. That one is even ___.','better',['more good','best'],'Good → better при сравнении.'),input('This is the ___ picture of all. (bad)','worst','Bad → worse → worst.')
      ])
    ],
    practice:choice('Choose a rhyme for “light”.','night',['leaf','wing'],'Light и night рифмуются.'),
    speak:'Choose an egg, a chrysalis or a chick. What will it become? Give your partner three clues.',
    support:'It is … now. It will become … / It won’t become …',
    writing:'Продолжи своё короткое стихотворение о превращении. Попробуй light / night или sky / fly.',
    scenes:[
      choice('The king thinks the caterpillar will become a dragon. What will it really become?','a butterfly',['a dragon','a knight'],'В тексте прослеживаем превращение бабочки.'),
      choice('My picture is good. The queen’s is ___.','better',['more good','gooder'],'Good → better.'),
      input('The caterpillar ___ become a knight. (will not)',"won’t",'Won’t = will not.',['will not'])
    ], gameTitle:'The King’s Unusual Pets'
  },
  7:{
    title:'People of the world', icon:'🌍', pages:'74–81', grammarPages:'30–32', readingTitle:'Old customs in the modern world',
    words:[['custom','обычай'],['weave','ткать'],['pattern','узор'],['herd','стадо'],['reindeer','северный олень'],['yak','як'],['tent','палатка'],['falcon','сокол']],
    reading:[
      'In Peru, Quechua weavers make patterned cloth from wool. Some of the patterns are like old Inca patterns. In northern Europe, some Sami families keep reindeer. In Tibet, yaks help farmers pull carts and ploughs.',
      'Some Bedouin families have a tradition of travelling through the desert with animals. Many Bedouin people today live in towns and villages. Falconry is one of the traditions described in the book.'
    ],
    check:[choice('What do the Quechua weavers use?','wool',['wax','clay'],'Из шерсти делают ткань.'),choice('Which animals pull carts in the text?','yaks',['falcons','reindeer'],'Яков используют в хозяйстве.'),choice('Where do the Sami in this text live?','northern Europe',['Peru','Tibet'],'В этом тексте речь о севере Европы.')],
    rules:[
      rule('Much, many, a lot of','Можно посчитать по одному? Many animals. Нельзя посчитать по одному? Much snow. A lot of можно использовать с обоими.','Are there many yaks? Is there much snow?',[
        choice('Are there ___ tents?','many',['much','a little'],'Tents можно посчитать.'),input('Is there ___ snow? (много)','much','Snow не считаем по одному.',['a lot of','lots of']),choice('There are ___ yaks on the farm.','a lot of',['much','a little'],'A lot of подходит со множественным числом.')
      ]),
      rule('Should / shouldn’t','Should помогает дать совет. После should используй глагол без to. Shouldn’t — совет чего-то избегать.','You should take a warm coat.',[
        choice('It is very cold. You ___ wear warm clothes.','should',['shouldn’t','should to'],'Should + wear.'),order('Собери совет.','You should not travel alone','Should not + travel.')
      ])
    ],
    practice:choice('Choose a good subheading for a paragraph about wool and patterns.','Weavers',['Fishermen','The weather tomorrow'],'Заголовок называет тему абзаца.'),
    speak:'Choose a person from the reading. Describe their work. Give a visitor one tip.',
    support:'They use … / There is a lot of … / You should …',
    writing:'Напиши небольшой текст об одном ремесле или обычае из книги. Добавь заголовок и подпись к рисунку.',
    scenes:[
      choice('The castle weaver uses ___ wool.','a lot of',['many','a few'],'Wool не считаем по одному.'),
      choice('Are there ___ reindeer on this old map?','many',['much','a little'],'Оленей можно посчитать; reindeer имеет ту же форму во множественном числе.'),
      choice('It is snowing. What is good advice for the knight?','He should take a coat.',['He should to take a coat.','He should swims.'],'После should ставим take без to.')
    ], gameTitle:'The Traveller’s Notebook'
  },
  8:{
    title:'The Incas', icon:'🏛️', pages:'82–89', grammarPages:'33–35', readingTitle:'A message for the Inca king',
    words:[['messenger','гонец'],['palace','дворец'],['dawn','рассвет'],['tunic','туника'],['passage','проход'],['jewels','драгоценности'],['silver','серебро'],['gate','ворота']],
    reading:[
      'Before dawn, Poma’s teacher woke him. Poma put on his tunic and followed the teacher across a courtyard. In the palace, lamps lit a room with golden walls. Prince Urco was waiting.',
      'The prince asked Poma to take a message to the king. Poma had to remember every word. He repeated the message to the prince and then ran out through the city gates.'
    ],
    check:[choice('Who woke Poma?','his teacher',['the king','a soldier'],'Учитель разбудил Пому до рассвета.'),choice('Where did the prince meet him?','in the palace',['in a forest','by a river'],'Пома вошёл во дворец.'),choice('What did Poma have to remember?','every word of the message',['the colour of a cup','the names of all the soldiers'],'Гонцу нужно запомнить послание.')],
    rules:[
      rule('Somebody, anybody, nobody','Somebody — кто-то. В нейтральном вопросе и после isn’t часто подходит anybody. Nobody — никто.','Is there anybody behind the door? There is nobody here.',[
        choice('Is there ___ in the courtyard?','anybody',['nobody','every thing'],'В нейтральном вопросе — anybody.'),choice('There is ___ at the gate. I can see a person.','somebody',['nobody','anything'],'Somebody — кто-то.'),input('There isn’t ___ in the room.','anybody','После isn’t подходит anybody.',['anyone'])
      ]),
      rule('Directions','Walk straight on — иди прямо. Turn left at … — поверни налево у … . Скажи at перед местом поворота.','Walk straight on and turn right at the gate.',[
        choice('Which means «поверни налево у театра»?','Turn left at the theatre.',['Walk past the theatre.','Turn right at the theatre.'],'Turn left — поверни налево.'),order('Собери команду для гонца.','Turn right at the gate','Сначала команда, затем at + место.')
      ])
    ],
    practice:choice('Choose an opening that tells us where and when.','Before dawn, Poma woke in the palace.',['It was nice.','Yes, please.'],'Before dawn задаёт время, in the palace — место.'),
    speak:'Give your partner directions from the palace door to the gate. The partner is Poma.',
    support:'Go straight on. Turn … at … / Is there anybody near …?',
    writing:'Продолжи авторскую сцену про гонца. Назови место, время и один звук. Добавь реплику героя.',
    scenes:[
      choice('A voice says, “Is there ___ at the gate?”','anybody',['nothing','nobody in'],'Вопрос о человеке: anybody.'),
      choice('The passage goes left. What should the messenger do?','Turn left.',['Turn right.','Go upstairs.'],'Left — налево.'),
      order('Собери описание начала пути.','Poma ran through the city gates','Сначала Poma, затем ran и место.')
    ], gameTitle:'The Messenger’s Route'
  },
  9:{
    title:'Chinese inventions', icon:'🧭', pages:'90–97', grammarPages:'36–38', readingTitle:'We use these every day',
    words:[['invention','изобретение'],['paper','бумага'],['woodblock','деревянный печатный блок'],['ink','чернила'],['pattern','узор'],['compass','компас'],['needle','игла, стрелка'],['sailor','моряк']],
    reading:[
      'Paper was first used for things such as wrapping, then for writing and drawing. Chinese printers used wooden blocks to print patterns on cloth and later words on paper. One block could make many copies.',
      'A compass helped sailors find directions when they could not see the stars. A special needle pointed north. The reading also describes fireworks as another example of early technology from China.'
    ],
    check:[choice('What did printers first print patterns on in the text?','cloth',['glass','stone'],'В тексте печать сначала показана на ткани.'),choice('What can make many copies of a page?','a woodblock',['a compass','a candle'],'Одну печатную форму можно использовать снова.'),choice('What direction did the compass needle point?','north',['west','south'],'North — север.')],
    rules:[
      rule('If + Present Simple, will','If значит «если». Для условия о будущем после if используй обычное настоящее время. Will ставь в части с результатом.','If it rains, we will stay at home.',[
        choice('If it ___, we will stay inside.','rains',['will rain','rained'],'После if — rains.'),input('If it is cloudy, the sailor ___ use a compass.','will','Will в части с результатом.'),order('Собери условие и результат.','If we find north we will follow the map','После условия в начале предложения ставим запятую.')
      ]),
      rule('Shall we …? / Let’s …','Shall we …? спрашивает, стоит ли сделать что-то вместе. Let’s … предлагает сделать это. После обоих ставим глагол без to.','Shall we make a map? Let’s draw it on paper.',[
        choice('___ we take some paper?','Shall',['Let’s','Are'],'Shall we + take?'),choice('Choose a suggestion.','Let’s draw a map.',['Let’s to draw a map.','Let’s drawing a map.'],'Let’s + draw.')
      ])
    ],
    practice:choice('Which sentence explains what a compass does?','A compass helps you find directions.',['I like breakfast.','My pencil is blue.'],'Полезное описание объясняет назначение предмета.'),
    speak:'Choose an invention. How do people use it? Suggest a plan for a school museum display.',
    support:'People use a … to … / Shall we …? / If we …, we will …',
    writing:'Опиши изобретение из чтения. Напиши, из чего оно состоит и кому оно помогает.',
    scenes:[
      choice('If the clouds cover the stars, the sailor ___ use a compass.','will',['did','is'],'Will показывает результат.'),
      choice('The museum printer needs to make ten copies. What can he use?','a woodblock',['a compass','a candle'],'Один блок печатает много копий.'),
      order('Собери предложение для выставки.','Let’s print a picture on paper','Let’s + print.')
    ], gameTitle:'The Inventor’s Museum'
  },
  10:{
    title:'Space travel', icon:'🚀', pages:'100–107', grammarPages:'43–45', readingTitle:'Space pioneers',
    words:[['cosmonaut','космонавт'],['spacecraft','космический корабль'],['spacesuit','скафандр'],['orbit','орбита'],['parachute','парашют'],['flight','полёт'],['take off','взлетать'],['call sign','позывной']],
    reading:[
      'Valentina Tereshkova was born near Yaroslavl in 1937. She worked in a factory and later joined the space programme. In June 1963, she took off in Vostok 6 and became the first woman in space.',
      'Her flight lasted almost three days. Her call sign was Chaika, the Russian word for seagull. The reading also introduces Yuri Gagarin, Alexei Leonov and Neil Armstrong.'
    ],
    check:[choice('Which spacecraft did she fly in?','Vostok 6',['Vostok 1','Apollo 11'],'В тексте указан Vostok 6.'),choice('What was her call sign?','Chaika',['Mars','Moon'],'Чайка — её позывной.'),choice('How long did her flight last?','almost three days',['one hour','three months'],'Полёт длился почти трое суток.')],
    rules:[
      rule('A few / a little','Если предметы можно посчитать, скажи a few. Если речь о жидкости или другом веществе, скажи a little.','There are a few sandwiches and a little juice.',[
        choice('There are ___ biscuits.','a few',['a little','much'],'Biscuits можно посчитать.'),input('There is ___ water. (немного)','a little','Water не считаем по одному.'),choice('___ apples are there?','How many',['How much','How little'],'How many + исчисляемые предметы.')
      ]),
      rule('Adjective + enough','Enough значит «достаточно». Со словом-признаком оно встаёт после: big enough.','This bag isn’t big enough for the spacesuit.',[
        choice('The bag isn’t ___ enough.','big',['bigger','biggest'],'Big enough — достаточно большой.'),order('Собери: Рация недостаточно громкая.','The radio is not loud enough','Enough после loud.')
      ])
    ],
    practice:choice('Which sentence fits a biography?','She joined the space programme in 1962.',['Shall we play chess?','There are three apples in my bag.'],'Биография сообщает о событиях жизни.'),
    speak:'You are packing for a space trip. What will you take and how much do you need?',
    support:'We need a few … / We need a little … / The bag is big enough.',
    writing:'Напиши 4–5 предложений о Валентине Терешковой. Используй годы как опоры и поставь события по порядку.',
    scenes:[
      choice('The space museum has ___ old photographs.','a few',['a little','much'],'Фотографии можно посчитать.'),
      choice('The display case is too small for the spacesuit. It isn’t ___ enough.','big',['heavy','quick'],'Big enough — достаточного размера.'),
      choice('Which object does an astronaut wear in space?','a spacesuit',['a compass','a woodblock'],'Spacesuit — скафандр.')
    ], gameTitle:'A Night in the Space Museum'
  },
  11:{
    title:'Life in the north', icon:'🦌', pages:'108–115', grammarPages:'46–48', readingTitle:'The Sami people',
    words:[['reindeer','северный олень'],['antlers','оленьи рога'],['herd','стадо'],['sledge','сани'],['fur','мех'],['border','кайма'],['fringe','бахрома'],['jewellery','украшения']],
    reading:[
      'Sami people live in the north of Norway, Sweden, Finland and Russia. In the past, some Sami communities followed reindeer herds. They used hides for tents and boots and antlers for tools.',
      'Traditional clothes may have bright borders and silver jewellery. Today Sami people have different jobs and ways of life. Sami languages are used in schools and media.'
    ],
    check:[choice('What did some people make from reindeer skin?','tents and boots',['paper and ink','pots and candles'],'Шкуры использовали для палаток и сапог.'),choice('Where is Sápmi?','in northern Europe',['in South America','in central China'],'Территория находится на севере Европы.'),choice('What can you see on some traditional Sami clothes?','colourful borders',['large wheels','wooden wings'],'У национальной одежды бывает цветная кайма.')],
    rules:[
      rule('Have / has + форма глагола','Когда важно, что уже готово сейчас, можно сказать I have painted или She has painted. С he / she / it выбирай has.','Grandpa has painted the door.',[
        choice('She ___ made a coat.','has',['have','is'],'She → has.'),choice('They have ___ the bag.','packed',['pack','packing'],'Have + packed.'),input('We ___ picked some flowers.','have','We → have.')
      ]),
      rule('Might / might not','Might значит «может быть, случится». После might форма глагола не меняется. Might not — «может быть, не».','We might see the northern lights.',[
        choice('We ___ see snow tomorrow. It is possible.','might',['was','did'],'Might показывает возможность.'),order('Собери: Возможно, огней не будет видно.','We might not see the lights','Might not + see.')
      ])
    ],
    practice:choice('Which sentence describes what someone is wearing now?','She is wearing a red dress.',['She wears a red dress every day.','She wore a red dress yesterday.'],'Is wearing описывает одежду сейчас.'),
    speak:'Describe traditional clothes from the reading. What might you see on a winter visit?',
    support:'She is wearing … / It has a … / We might see …',
    writing:'Опиши одежду и внешность человека по иллюстрации учебника. Добавь цвета, материалы и одну деталь.',
    scenes:[
      choice('The museum guide ___ put on the traditional hat.','has',['have','is'],'The guide → has.'),
      choice('It is cloudy tonight. We ___ see the northern lights.','might not',['was not','did not'],'Might not — возможно, не увидим.'),
      input('They ___ packed the costumes.','have','They → have.')
    ], gameTitle:'The Northern Exhibition'
  },
  12:{
    title:'A desert oasis', icon:'🏜️', pages:'116–123', grammarPages:'49–51', readingTitle:'The lost city',
    words:[['oasis','оазис'],['desert','пустыня'],['statue','статуя'],['torch','фонарик'],['dune','дюна'],['furniture','мебель'],['ruins','руины'],['archaeologist','археолог']],
    reading:[
      'Jenny, Pete and Uncle Jim stopped in the desert. Jenny found the head of a statue. Pete stepped on a stone and it moved. Uncle Jim shone a torch into the hole and saw a room with pots and furniture.',
      'When a car arrived, they hid the hole with a map and made the statue look like part of a picnic. Two men asked about valuable things. After they left, Uncle Jim called the museum. Professor Hamid thought the children had found a lost city.'
    ],
    check:[choice('What did Jenny find first?','the head of a statue',['a compass','a museum ticket'],'Дженни заметила огромное каменное ухо.'),choice('What did Uncle Jim use to see into the hole?','a torch',['a map','a candle'],'Он посветил фонариком.'),choice('Who came from the museum?','Professor Hamid',['Prince Urco','Mrs Hall'],'Профессор Хамид — археолог.')],
    rules:[
      rule('A person who …','Who помогает объяснить, что делает человек. Представь карточку со словом и его объяснением.','A tourist is a person who visits places on holiday.',[
        choice('An archaeologist is a person ___ studies things from the past.','who',['where','when'],'Who относится к человеку.'),order('Собери определение.','A poet is a person who writes poems','К человеку добавляем часть who writes poems.'),input('A person ___ builds bridges is an engineer.','who','Who описывает человека.',['that'])
      ]),
      rule('What do you call a person who …?','Так можно спросить название профессии. Сначала скажи What do you call, затем объясни, чем человек занимается.','What do you call a person who looks after people’s teeth?',[
        choice('What do you call a person who works with teeth?','a dentist',['a potter','a sailor'],'Dentist — стоматолог.'),choice('What do you call a person who makes pots?','a potter',['a tourist','a poet'],'Potter — гончар.')
      ])
    ],
    practice:choice('Which opening makes the reader curious?','Jenny sat down next to a giant stone ear.',['There are things in the world.','It was Tuesday.'],'Необычная деталь заставляет читать дальше.'),
    speak:'Your group finds a strange object. Who can help you? Tell the story to a museum worker.',
    support:'We found … / An archaeologist is a person who …',
    writing:'Придумай первые 4–5 предложений истории о находке. С первой строки дай необычную деталь и добавь одну реплику.',
    scenes:[
      choice('Who can study a very old statue?','an archaeologist',['a choir singer','a swimmer'],'Археолог изучает предметы прошлого.'),
      choice('A sailor is a person ___ works on a ship.','who',['when','where'],'Who относится к человеку.'),
      order('Собери вопрос про таинственную находку.','What did they find in the desert','Did стоит перед they, основной глагол — find.')
    ], gameTitle:'The Lost Museum Label'
  }
};

export const courseContent = Object.fromEntries(Object.entries(content).map(([id, unit]) => {
  const numbered = (part, list) => list.map((q, i) => ({...q,id:`u${id}-${part}-${i+1}`}));
  return [Number(id), {
    ...unit,
    check:numbered('r',unit.check),
    rules:unit.rules.map((group,i)=>({...group,questions:numbered(`g${i+1}`,group.questions)})),
    practice:numbered('p',[unit.practice]),
    scenes:numbered('history',unit.scenes)
  }];
}));
