export const vaseMissionKey = 'crafts-vase-mission-v1';

export const vaseWords = [
  ['vase','ваза','vɑːz'],
  ['potter','гончар','ˈpɒtə'],
  ['clay','глина','kleɪ'],
  ['wheel','гончарный круг','wiːl'],
  ['basket','корзина','ˈbɑːskɪt'],
  ['door','дверь','dɔː']
];

export const vaseGrammar = [
  {
    id:'mission-opened',type:'choice',prompt:'When the knight ___ the door, he saw a basket.',
    options:['opened','opens','open'],answer:'opened',explain:'open → opened. Рассказываем о прошлом.',
    teacherRu:['Когда рыцарь открыл дверь, он увидел корзину.']
  },
  {
    id:'mission-saw',type:'choice',prompt:'When the wheel stopped, the potter ___ the vase.',
    options:['saw','sees','see'],answer:'saw',explain:'see → saw. Это форма Past Simple.',
    teacherRu:['Когда гончарный круг остановился, гончар увидел вазу.']
  },
  {
    id:'mission-order',type:'order',prompt:'Собери реплику рыцаря из трёх частей.',
    tokens:['When I opened the door,','I saw','a basket.'],
    answer:'When I opened the door, I saw a basket.',
    explain:'В начале часть с When, затем то, что произошло дальше.',
    teacherRu:['Когда я открыл дверь, я увидел корзину.']
  }
];

export const vaseClue = {
  before:'I made a vase from clay. I put it in a basket. ',
  evidence:'The basket is next to the door.',
  after:' Look inside it!',
  ru:'Я сделал вазу из глины. Я положил её в корзину. Корзина стоит рядом с дверью. Загляни в неё!',
  question:{
    id:'mission-clue',type:'choice',prompt:'Where should the knight look first?',
    options:['In the basket next to the door','Under the wheel','On the king’s head'],
    answer:'In the basket next to the door',explain:'В записке сказано, что корзина стоит рядом с дверью.',
    retryHint:'Найди слово next to («рядом с») в выделенной фразе.',
    teacherRu:['Где рыцарю стоит поискать сначала?','В корзине рядом с дверью / под гончарным кругом / на голове у короля.']
  }
};

export const vaseEndings = [
  {id:'basket',label:'In the basket',ru:'В корзине',line:'When the knight opened the basket, he saw the vase.',lineRu:'Когда рыцарь открыл корзину, он увидел вазу.'},
  {id:'table',label:'Under the table',ru:'Под столом',line:'When the knight looked under the table, he found the vase.',lineRu:'Когда рыцарь заглянул под стол, он нашёл вазу.'},
  {id:'king',label:'On the king’s head',ru:'На голове у короля',line:'When the knight opened the door, he saw the vase on the king’s head.',lineRu:'Когда рыцарь открыл дверь, он увидел вазу на голове у короля.'}
];

export const speakingWheel = [
  {type:'speak',prompt:'You are the knight. Tell the king what you need to make a vase.',
    cue:'I need … and …',teacherRu:['Ты рыцарь. Скажи королю, что тебе нужно, чтобы сделать вазу.','Например: I need clay and a wheel. — Мне нужны глина и гончарный круг.']},
  {type:'speak',prompt:'The basket is closed. Ask a friend what is inside.',
    cue:'Is there anything …?',teacherRu:['Корзина закрыта. Спроси друга, что внутри.','Например: Is there anything in the basket? — В корзине что-нибудь есть?']},
  {type:'speak',prompt:'Tell the king what happened when the wheel stopped.',
    cue:'When the wheel stopped, …',teacherRu:['Расскажи королю, что случилось, когда остановился гончарный круг.','Например: When the wheel stopped, the cat ran away. — Когда круг остановился, кот убежал.']}
];
