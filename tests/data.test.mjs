import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,access} from 'node:fs/promises';
import {units,sections} from '../data/units.js';
import {vocabulary,grammar,readings,practice,gameModes} from '../data/unit4.js';
import {tracks,listeningQuestions} from '../data/audio.js';
import {courseContent} from '../data/course.js';
import {courseBanks} from '../course.js';
import {historyGames,historySources,moods,workshopArt} from '../data/history.js';
import {normal} from '../core.js';
const bank=[...grammar,...readings.flatMap(r=>r.questions),...practice,...listeningQuestions];
test('All 12 units have a section contract, title and assigned content',()=>{
  assert.equal(units.length,12);
  assert.deepEqual(units.filter(u=>u.status==='ready').map(u=>u.id),[4]);
  for(const unit of units){
    assert.ok(unit.title);
    assert.deepEqual(unit.sections,sections.map(s=>s[0]));
    if(unit.id!==4)assert.equal(courseContent[unit.id].title,unit.title);
  }
});
test('Question IDs are unique and every choice has a valid answer',()=>{assert.equal(new Set(bank.map(q=>q.id)).size,bank.length);for(const q of bank){assert.ok(q.answer&&q.prompt,q.id);if(q.type==='choice'){assert.ok(q.options.includes(q.answer),q.id);assert.equal(new Set(q.options).size,q.options.length,q.id)}}});
test('Vocabulary is exactly the reviewed Unit 4 dictionary set',()=>{assert.equal(vocabulary.length,33);assert.equal(new Set(vocabulary.map(w=>w.en)).size,33);for(const w of vocabulary)assert.ok(w.ru&&w.example&&w.source.includes('7–9'));});
test('All nine tracks and all image references exist',async()=>{assert.equal(tracks.length,9);assert.equal(new Set(tracks.map(t=>t.file)).size,9);for(const t of tracks){await access(new URL('../assets/audio/'+t.file,import.meta.url));if(t.image)await access(new URL('../assets/images/'+t.image+'.webp',import.meta.url))}for(const r of readings)await access(new URL('../assets/images/'+r.image+'.webp',import.meta.url));});
test('Every listening question belongs to exactly one checked track',()=>{const ids=tracks.flatMap(t=>t.questions);assert.equal(new Set(ids).size,ids.length);assert.deepEqual(ids.slice().sort(),listeningQuestions.map(q=>q.id).sort());});
test('The nine-picture listening key spells BEAUTIFUL',()=>{const q=listeningQuestions.filter(q=>/^l(?:[89]|1[0-6])$/.test(q.id));assert.equal(q.length,9);assert.deepEqual(q.map(q=>q.answer),['loom','wheel','reeds','clay','wax','basket','pots','cloth','candles']);assert.equal(listeningQuestions.find(q=>q.id==='l17').answer,'beautiful');});
test('All game routes have distinct stable IDs',()=>{assert.equal(gameModes.length,18);assert.equal(new Set(gameModes.map(g=>g[0])).size,18);});
test('Original lesson and English title are retained',async()=>{const original=await readFile(new URL('../intro.html',import.meta.url),'utf8');assert.ok(original.includes('The museum mix-up'));assert.ok(original.includes('keks-lesson-notes'));const entry=await readFile(new URL('../index.html',import.meta.url),'utf8');assert.ok(entry.includes('<title>English</title>'));assert.ok(entry.includes('href="intro.html"'));});

test('All authored closed sets have distinct IDs and solvable choices or tiles',()=>{
  const authored=units.filter(u=>u.id!==4).flatMap(u=>Object.values(courseBanks(u)).flat());
  const history=historyGames.flatMap(g=>g.rounds);
  const all=[...bank,...authored,...history];
  assert.equal(new Set(all.map(q=>q.id)).size,all.length);
  assert.equal(authored.length,220);
  for(const q of [...authored,...history]){
    assert.ok(q.prompt,q.id);
    if(q.type==='open'){
      assert.ok(q.model&&q.hint,q.id);
      continue;
    }
    assert.ok(q.answer&&q.explain,q.id);
    if(q.type==='choice'){
      assert.ok(q.options.includes(q.answer),q.id);
      assert.equal(new Set(q.options.map(normal)).size,q.options.length,q.id);
    }
    if(q.type==='order'&&q.tokens)assert.equal(normal(q.tokens.join(q.joiner??' ')),normal(q.answer),q.id);
  }
});

test('Historical illustrations, fact references and game endings exist',async()=>{
  assert.equal(historyGames.length,12);
  assert.equal(moods.length,4);
  assert.equal(new Set(historyGames.map(g=>g.id)).size,historyGames.length);
  for(const game of historyGames){
    assert.ok(game.rounds.length>=3&&game.ending&&game.goal&&workshopArt[game.art],game.id);
    for(const round of game.rounds){
      if(round.source)assert.match(historySources[round.source].url,/^https:\/\//);
    }
  }
  for(const name of [...Object.keys(workshopArt),...moods.map(m=>m.image)]){
    await access(new URL(`../assets/images/${name}.webp`,import.meta.url));
  }
});
