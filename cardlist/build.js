// Builds the card list page from the game's own card data, design notes and change log.
const fs = require('fs'), E = require('../src/engine.js');
const why = require('./why.json'), log = require('./changelog.json');
const ARCHN = { alliance: 'Alliance', vote: 'Vote Out', idol: 'Idols', beast: 'Challenge Beast', strat: 'Strategist', event: 'Scenario', host: 'Host' };
const cards = E.CARDS.filter(c => !c.token && !c.held).map(c => ({ // held cards stay off the public list
  id: c.id, name: c.name, cost: c.cost, power: c.power, arch: c.arch, archName: ARCHN[c.arch], kw: c.kw,
  event: c.type === 'event', starter: E.STARTER.includes(c.id),
  text: c.text.replace(/^(On Reveal|Ongoing|End of Turn|Scenario): /, '').replace(' Ongoing: ', ' '),
  why: why[c.id] || 'Design note to come.'
}));
const kw = {}; Object.entries(E.KW).forEach(([k, v]) => { if (cards.some(c => c.kw === k) || k === 'start' || k === 'objective') kw[k] = v; });
const data = { asof: process.argv[2] || new Date().toISOString().slice(0, 10), cards, kw, log };
const html = fs.readFileSync(__dirname + '/template.html', 'utf8').replace('/*DATA*/null', JSON.stringify(data).replace(/</g, '\\u003c'));
fs.writeFileSync(__dirname + '/card-list.html', html);
console.log(cards.length, 'cards');
