export const sections = [
 ['learn','✦','Learn','Начнём знакомство'],['vocabulary','◈','Vocabulary','Слова и образы'],['grammar','▧','Grammar','Понятные правила'],['reading','▤','Reading','Читаем по частям'],['listening','♫','Listening','Слушаем и узнаём'],['speaking','☏','Speaking','Говорим смелее'],['games','✿','Games','Учимся играя'],['practice','✎','Practice','Закрепляем'],['challenge','⚑','Challenge','Проверяем себя'],['progress','☆','Progress','Мои результаты']
];
export const units=Array.from({length:12},(_,i)=>({id:i+1,status:i===3?'ready':'planned',title:i===3?'Crafts':null,sections:sections.map(s=>s[0])}));
