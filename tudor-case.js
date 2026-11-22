import {renderQuestion,shuffle} from './core.js?v=5';

const armour='https://www.metmuseum.org/art/collection/search/23936';
const portrait='https://www.rmg.co.uk/collections/objects/rmgc-object-1096108';
const scenes=[
 {title:'Подмена в оружейном зале',image:'queen-surprised',caption:'“My father wore THAT. I wore pearls.”',source:armour,museum:'The Met · Доспех Генриха VIII',evidence:'Генрих VIII правил в 1509–1547 годах. Музей датирует его итальянский полевой доспех примерно 1544 годом. На ярлыке стажёра написано «Made for Henry VIII in 1588».',prompt:'Какая улика опровергает ярлык?',options:['Henry died before 1588.','The armour looks heavy.','Kings usually own armour.'],answer:'Henry died before 1588.',explain:'1547 раньше 1588. Died обозначает завершённое событие. Вес доспеха ничего не говорит о его дате.',clue:'Заказчик доспеха — Генрих VIII.'},
 {title:'Допрос переписчика',image:'pot-hat',caption:'“A helmet? Sir, that is my lunch.”',source:armour,museum:'The Met · Происхождение доспеха',evidence:'След ведёт в Италию. Стажёр пытается спросить, сделал ли мастер доспех, и пишет: “Did an Italian armourer made it?” Armourer — оружейник.',prompt:'Замени только ошибочное слово в вопросе.',type:'input',answer:'make',explain:'После did нужна исходная форма make. В ответе можно сказать: An Italian armourer made it.',clue:'Доспех изготовили в Италии.'},
 {title:'Что видит эксперт?',image:'queen-curious',caption:'“Zoom in. Yes, we had ships before Wi-Fi.”',source:portrait,museum:'Greenwich · Увеличить портрет',evidence:'Открой портрет по музейной ссылке или воспользуйся описанием. За Елизаветой видны корабли. Её правая рука лежит на глобусе. Аудиогид описывает то, что зритель видит на картине сейчас.',prompt:'Собери подпись для аудиогида.',type:'order',tokens:['The queen','rests','her hand','on a globe.'],answer:'The queen rests her hand on a globe.',explain:'На картине эта деталь видна и сегодня. The queen = she, поэтому rests.',clue:'На портрете — глобус и корабли.'},
 {title:'Ночная смена в музее',image:'basket-cat',caption:'“The mice have excellent alibis.”',evidence:'Шуточная запись с музейной камеры: ребёнок заметил мышь у витрины. На следующем кадре уже несколько детей и несколько мышей. Следы ведут к тележке стажёра.',prompt:'Восстанови сообщение целиком: The child saw the mouse. Поставь оба существительных во множественное число.',type:'input',answer:'The children saw the mice.',accept:['The children saw the mice'],explain:'Child → children, mouse → mice. Форма прошедшего времени saw одинакова для одного и нескольких свидетелей.',clue:'Свидетели видели тележку с подписями.'},
 {title:'Королевский фактчек',image:'queen-tired',caption:'“One portrait. Two sea views. Zero selfies.”',source:portrait,museum:'Greenwich · Карточка экспоната',evidence:'«Портрет Армады» датируют примерно 1588 годом. Картина существует сейчас. Художник закончил работу много веков назад.',prompt:'В какой записи обе формы подходят по смыслу?',answer:'The portrait shows ships. The artist painted it centuries ago.',options:['The portrait shows ships. The artist paints it centuries ago.','The portrait shows ships. The artist painted it centuries ago.','The portrait show ships. The artist painted it centuries ago.'],explain:'Shows описывает картину. Painted сообщает, что сделал художник в прошлом.',clue:'Дата около 1588 года относится к портрету.'},
 {title:'Вердикт хранителя',image:'queen-happy',caption:'“Finally. Someone read the labels.”',evidence:'Вспомни два экспоната. На тележке остались две даты: около 1544 и около 1588. Стажёр признаётся, что перепутал карточки. Последняя задача — вернуть их на места.',prompt:'Восстанови запись об экспонатах от более раннего к более позднему.',type:'order',tokens:['First came','Henry’s armour.','Then came','Elizabeth’s portrait.'],answer:'First came Henry’s armour. Then came Elizabeth’s portrait.',explain:'Доспех старше портрета примерно на 44 года. Come → came.',clue:'Обе подписи вернулись на свои места.'}
];

export function renderTudorCase(root){
 let step=0;
 function draw(){
  const scene=scenes[step];
  root.innerHTML=`<div class="tudor-head"><span class="tag">Tudor Files · Дело № 4</span><span>Улики: ${step} / ${scenes.length}</span></div><h2>${scene.title}</h2><div class="tudor-scene"><figure><img alt="" src="assets/images/${scene.image}.webp"><figcaption lang="en">${scene.caption}</figcaption></figure><div><b>Досье хранителя</b><p>${scene.evidence}</p>${scene.source?`<a href="${scene.source}" target="_blank" rel="noopener">${scene.museum} ↗</a>`:''}</div></div><div class="case-task"></div><div class="case-next"></div>`;
  renderQuestion(root.querySelector('.case-task'),{...scene,id:'case-tudor-'+step,type:scene.type||'choice',options:scene.options&&shuffle(scene.options),hint:'Перечитай досье над вопросом.'},{label:'Историческое расследование',record:false,onAnswer:correct=>{
   if(!correct)return;
   const next=root.querySelector('.case-next');
   next.innerHTML=`<p>✓ ${scene.clue}</p><button class="button">${step===scenes.length-1?'Закрыть дело':'Получить следующее досье'} →</button>`;
   next.querySelector('button').onclick=()=>{step++;if(step<scenes.length)draw();else finish();root.focus();};
  }});
 }
 function finish(){
  root.innerHTML='<span class="tag">6 / 6 улик</span><h2>Дело закрыто!</h2><p>Теперь ты ведёшь экскурсию. Выбери экспонат и дай однокласснику или учителю две подсказки, чтобы он угадал его с закрытыми глазами.</p><p lang="en">Today you can see … · Long ago, someone made / painted …</p><button class="button secondary">Расследовать ещё раз</button>';
  root.querySelector('button').onclick=()=>{step=0;draw();root.focus();};
 }
 draw();
}
