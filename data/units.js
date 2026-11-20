import {courseContent} from './course.js';

export const sections = [
  ['learn','✦','Learn','План юнита'],
  ['vocabulary','◈','Vocabulary','Слова и выражения'],
  ['grammar','▧','Grammar','Правила с примерами'],
  ['reading','▤','Reading','Чтение'],
  ['listening','♫','Listening','Аудирование'],
  ['speaking','☏','Speaking','Говорение'],
  ['practice','✎','Practice','Закрепление и письмо'],
  ['games','🎮','Games','Учебные игры'],
  ['challenge','⚑','Challenge','Проверка знаний'],
  ['reflection','✓','Reflection','Итог урока'],
  ['progress','☆','Progress','Мои результаты']
];

export const units = Array.from({length:12},(_,i) => ({
  id:i+1,
  status:i===3?'ready':'adapted',
  title:i===3?'Crafts':courseContent[i+1].title,
  sections:sections.map(section => section[0])
}));
