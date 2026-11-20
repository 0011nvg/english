import {courseContent} from './course.js';

export const sections = [
  ['learn','✦','Learn','План юнита'],
  ['warmup','☀','Warm-up','Разминка'],
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

export const units = Array.from({length:9},(_,i) => ({
  id:i+4,
  status:i===0?'ready':'adapted',
  title:i===0?'Crafts':courseContent[i+4].title,
  sections:sections.map(section => section[0])
}));
