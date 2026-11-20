// Mappings checked against spoken track introductions and Pupil's Book pp.48–54.
const q=(id,prompt,answer,options,explain,type='choice',extra={})=>({id,prompt,answer,options,explain,type,...extra});
const labels=['loom','wheel','reeds','clay','wax','basket','pots','cloth','candles'];
export const listeningQuestions=[
 q('l1','What does the potter use?','clay and a wheel',['wool and a loom','clay and a wheel','wax and string'],'Дорожка 35: глина и специальный гончарный круг.'),
 q('l2','What does the potter do first?','cuts the clay',['paints the pot','cuts the clay','bakes the pot'],'Сначала гончар отрезает глину.'),
 q('l3','What is the duck’s nest made from?','twigs and reeds',['wool and cloth','wax and clay','twigs and reeds'],'Дорожка 36: гнездо сделано из веточек и камыша.'),
 q('l4','Are the yellow objects real eggs?','No, they are tennis balls',['Yes, they are eggs','No, they are tennis balls','No, they are candles'],'В сценке вместо яиц — жёлтые теннисные мячи.'),
 q('l5','Complete: There is ___ in your pocket.','something',null,'Дорожка 38: учитель считает, что в кармане что-то есть.','input'),
 q('l6','Where must the boy put everything?','on the desk',['on the desk','in the basket','under the chair'],'Учитель просит выложить всё на стол.'),
 q('l7','Which word repeats in the song?','anything',['nothing','anything','somewhere'],'Дорожка 40: Anything you can do …'),
 ...labels.map((word,i)=>q('l'+(i+8),`Дорожка 42 · Number ${i+1}: какой предмет описан?`,word,labels,`Number ${i+1}: ${word}. Буква на картинке — ${'BEAUTIFUL'[i]}.`)),
 q('l17','Какое слово получилось из 9 букв картинок? Впиши его без пробелов.','beautiful',null,'Порядок: loom B; wheel E; reeds A; clay U; wax T; basket I; pots F; cloth U; candles L.','input',{accept:['B E A U T I F U L']}),
 q('l18','Дорожка 43: какое слово описывает липкий леденец?','sticky',['sticky','straight','smooth'],'Sticky — липкий. Конечная y в sticky даёт короткий /i/.')
];
export const tracks=[
 {file:'u4_35.mp3',title:'Making things we use',short:'Reading',source:'Pupil’s Book pp.48–49 · Reading',questions:['l1','l2']},
 {file:'u4_36.mp3',title:'Everything’s falling down!',short:'The play',source:'Pupil’s Book p.51 · Activities 1–2',questions:['l3','l4'],image:'stage'},
 {file:'u4_37.mp3',title:'The play · Listen and say',source:'Pupil’s Book p.51 · Activity 3',questions:[]},
 {file:'u4_38.mp3',title:'What’s that noise?',short:'The pocket',source:'Pupil’s Book p.53 · Activity 1',questions:['l5','l6']},
 {file:'u4_39.mp3',title:'The pocket · Listen and say',source:'Pupil’s Book p.53 · Activity 2',questions:[]},
 {file:'u4_40.mp3',title:'Anything you can do',short:'The song',source:'Pupil’s Book p.53 · Activity 4',questions:['l7']},
 {file:'u4_41.mp3',title:'Anything you can do · Sing again',source:'Pupil’s Book p.53 · Повторное пение',questions:[]},
 {file:'u4_42.mp3',title:'Crafts · Listen and identify',short:'9 pictures',source:'Pupil’s Book p.54 · Activities 1–2',questions:Array.from({length:10},(_,i)=>'l'+(i+8)),image:'listen-grid'},
 {file:'u4_43.mp3',title:'Heavy and sticky · Phonics',short:'Phonics',source:'Pupil’s Book p.54 · Phonics',questions:['l18']}
];
