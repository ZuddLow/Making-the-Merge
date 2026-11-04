// ===== Making the Merge: game engine (pure data, no DOM) =====
const ARCH = {
  alliance: 'Alliance', vote: 'Vote Out', idol: 'Idols', beast: 'Challenge Beast',
  strat: 'Strategist', event: 'Scenario', host: 'Host', goat: 'Goat'
};

const CARDS = [
  { id: 'cochran', name: 'John Cochran', short: 'Cochran', cost: 1, power: 1, arch: 'strat', text: 'On Reveal: Draw a card.' },
  { id: 'maryanne', name: 'Maryanne Oketch', short: 'Maryanne', cost: 1, power: 2, arch: 'idol', text: 'On Reveal: If an enemy card here has more influence, +3 influence.' },
  { id: 'erik', name: 'Erik Reichenbach', short: 'Erik', cost: 1, power: 4, arch: 'beast', text: 'Ongoing: Enemy cards here have +1 influence.' },
  { id: 'natalie', name: 'Natalie Anderson', short: 'Natalie', cost: 1, power: 2, arch: 'vote', text: 'When one of your other cards is voted out, +3 influence.' },
  { id: 'rick', name: 'Rick Devens', short: 'Devens', cost: 1, power: 2, arch: 'vote', text: 'When voted out, comes back at a random location with +3 influence.' },
  { id: 'parvati', name: 'Parvati Shallow', short: 'Parvati', cost: 2, power: 2, arch: 'alliance', text: 'Ongoing: +3 influence if you have more cards here than your opponent.' },
  { id: 'tony', name: 'Tony Vlachos', short: 'Tony', cost: 2, power: 2, arch: 'strat', text: 'On Reveal: If your opponent played a card here this turn, +3 influence.' },
  { id: 'russell', name: 'Russell Hantz', short: 'Russell', cost: 2, power: 2, arch: 'idol', text: 'On Reveal: Give a hidden idol to your strongest card at each location.' },
  { id: 'kass', name: 'Kass McQuillen', short: 'Kass', cost: 2, power: 2, arch: 'vote', text: 'On Reveal: Vote out your other cards here. +3 influence for each.' },
  { id: 'sandra', name: 'Sandra Diaz-Twine', short: 'Sandra', cost: 2, power: 2, arch: 'vote', text: "Can't be voted out. Ongoing: +1 influence for each card voted out this game." },
  { id: 'reward', name: 'Reward Challenge', short: 'Reward', cost: 2, power: 0, arch: 'event', type: 'event', text: 'Scenario: Your other cards here get +2 influence.' },
  { id: 'tribeswap', name: 'Tribe Swap', short: 'Swap', cost: 2, power: 0, arch: 'event', type: 'event', text: 'Scenario: Move the strongest enemy card here to another location.' },
  { id: 'ozzy', name: 'Ozzy Lusth', short: 'Ozzy', cost: 3, power: 3, arch: 'beast', text: 'Ongoing: +4 influence if this is your only card here.' },
  { id: 'yamyam', name: 'Yam Yam Arocho', short: 'Yam Yam', cost: 3, power: 3, arch: 'alliance', text: 'On Reveal: Your other cards here get +1 influence.' },
  { id: 'brian', name: 'Brian Heidik', short: 'Brian', cost: 3, power: 3, arch: 'strat', text: 'On Reveal: Drag a Goat to the enemy side of each other location.' },
  { id: 'rob', name: 'Rob Mariano', short: 'Boston Rob', cost: 3, power: 3, arch: 'alliance', text: 'Ongoing: Your other cards here have +1 influence.' },
  { id: 'rocks', name: 'Rock Draw', short: 'Rocks', cost: 3, power: 0, arch: 'event', type: 'event', text: 'Scenario: A random card here, from either side, is voted out.' },
  { id: 'cirie', name: 'Cirie Fields', short: 'Cirie', cost: 4, power: 2, arch: 'strat', text: 'On Reveal: Flip the weakest enemy card here with 3 or less influence to your side.' },
  { id: 'joe', name: 'Joe Anglim', short: 'Joe', cost: 4, power: 6, arch: 'beast', text: 'No ability.' },
  { id: 'jeremy', name: 'Jeremy Collins', short: 'Jeremy', cost: 4, power: 3, arch: 'idol', text: "Ongoing: Your other cards here can't be voted out." },
  { id: 'hatch', name: 'Richard Hatch', short: 'Hatch', cost: 4, power: 3, arch: 'alliance', text: 'Ongoing: Your cards at the other locations have +1 influence.' },
  { id: 'blindside', name: 'Blindside', short: 'Blindside', cost: 4, power: 0, arch: 'event', type: 'event', text: 'Scenario: Vote out the strongest enemy card here.' },
  { id: 'kim', name: 'Kim Spradlin', short: 'Kim', cost: 5, power: 6, arch: 'beast', text: 'Ongoing: Enemy cards here have -1 influence.' },
  { id: 'dee', name: 'Dee Valladares', short: 'Dee', cost: 5, power: 5, arch: 'vote', text: 'On Reveal: Vote out the strongest enemy card here with 4 or less influence.' },
  { id: 'jeff', name: 'Jeff Probst', short: 'Probst', cost: 6, power: 4, arch: 'host', text: 'On Reveal: The tribe has spoken. The weakest card at each other location is voted out.' },
  { id: 'westman', name: 'Tom Westman', short: 'Westman', cost: 6, power: 11, arch: 'beast', text: 'No ability.' },
  // ---- Batch 2 (tiers to be sorted later) ----
  { id: 'spencer', name: 'Spencer Bledsoe', short: 'Spencer', cost: 1, power: 1, arch: 'strat', text: 'When an enemy card is voted out, +1 influence.' },
  { id: 'amber', name: 'Amber Mariano', short: 'Amber', cost: 1, power: 2, arch: 'alliance', text: 'Ongoing: +3 influence if Boston Rob is on your side here.' },
  { id: 'carolyn', name: 'Carolyn Wiger', short: 'Carolyn', cost: 1, power: 3, arch: 'strat', text: 'On Reveal: Wanders to a random other location with room and gets +2 influence.' },
  { id: 'jt', name: 'J.T. Thomas', short: 'J.T.', cost: 1, power: 4, arch: 'idol', text: 'On Reveal: Give a hidden idol to the strongest enemy card here.' },
  { id: 'malcolm', name: 'Malcolm Freberg', short: 'Malcolm', cost: 2, power: 3, arch: 'idol', text: 'On Reveal: If one of your cards holds a hidden idol, +3 influence.' },
  { id: 'tyson', name: 'Tyson Apostol', short: 'Tyson', cost: 2, power: 5, arch: 'beast', text: 'End of Turn: If this was played last turn, it is voted out.' },
  { id: 'fairplay', name: 'Jonny Fairplay', short: 'Fairplay', cost: 2, power: 2, arch: 'vote', text: 'On Reveal: The strongest enemy card here gets -2 influence.' },
  { id: 'tina', name: 'Tina Wesson', short: 'Tina', cost: 2, power: 2, arch: 'alliance', text: 'Ongoing: +4 influence if your opponent has more cards here.' },
  { id: 'michele', name: 'Michele Fitzgerald', short: 'Michele', cost: 2, power: 2, arch: 'strat', text: "Ongoing: +4 influence if you're losing at both other locations." },
  { id: 'david', name: 'David Wright', short: 'David', cost: 2, power: 1, arch: 'idol', text: 'On Reveal: Give a hidden idol to each of your other cards here.' },
  { id: 'q', name: 'Q Burdette', short: 'Q', cost: 2, power: 5, arch: 'vote', text: 'On Reveal: If an enemy card here has more influence, this is voted out.' },
  { id: 'jerri', name: 'Jerri Manthey', short: 'Jerri', cost: 3, power: 3, arch: 'vote', text: 'On Reveal: Enemy cards here get -1 influence.' },
  { id: 'rupert', name: 'Rupert Boneham', short: 'Rupert', cost: 3, power: 3, arch: 'strat', text: "On Reveal: Steal the top card of your opponent's deck into your hand." },
  { id: 'sarah', name: 'Sarah Lacina', short: 'Sarah', cost: 3, power: 2, arch: 'strat', text: "On Reveal: +1 influence for each other card you've played this game." },
  { id: 'chris', name: 'Chris Underwood', short: 'Chris', cost: 3, power: 3, arch: 'vote', text: 'On Reveal: +4 influence if one of your cards has been voted out this game.' },
  { id: 'kenzie', name: 'Kenzie Petty', short: 'Kenzie', cost: 3, power: 2, arch: 'alliance', text: 'On Reveal: Your cards at the other locations get +1 influence.' },
  { id: 'rachel', name: 'Rachel LaMont', short: 'Rachel', cost: 3, power: 3, arch: 'beast', text: "On Reveal: +3 influence if you've played a Scenario this game." },
  { id: 'colby', name: 'Colby Donaldson', short: 'Colby', cost: 4, power: 7, arch: 'beast', text: 'Ongoing: Your other cards here have -1 influence.' },
  { id: 'ben', name: 'Ben Driebergen', short: 'Ben', cost: 4, power: 4, arch: 'beast', text: 'Ongoing: +5 influence at Tribal Council or Fire-Making.' },
  { id: 'earl', name: 'Earl Cole', short: 'Earl', cost: 5, power: 6, arch: 'alliance', text: "Ongoing: +4 influence if you're winning both other locations." },
  // ---- Batch 3 ----
  { id: 'kelly', name: 'Kelly Wiglesworth', short: 'Kelly', cost: 2, power: 3, arch: 'strat', text: "On Reveal: The next card you play moves one location to the left after it reveals. If it's already on the far left, it stays." },
  { id: 'phillip', name: 'Phillip Sheppard', short: 'Phillip', cost: 2, power: -4, arch: 'strat', text: "On Reveal: Switches to the enemy side here, if there's room." },
  { id: 'wade', name: 'Coach Wade', short: 'Coach', cost: 3, power: 4, arch: 'alliance', text: 'On Reveal: Move your strongest card from another location here.' },
  { id: 'necklace', name: 'Immunity Necklace', short: 'Necklace', cost: 1, power: 0, arch: 'event', type: 'event', text: 'Scenario: Give your strongest card here a hidden idol.' },
  { id: 'shotdark', name: 'Shot in the Dark', short: 'Shot', cost: 1, power: 0, arch: 'event', type: 'event', text: 'Scenario: 1 in 3 chance to give each of your cards here a hidden idol.' },
  { id: 'nullifier', name: 'Idol Nullifier', short: 'Nullifier', cost: 2, power: 0, arch: 'event', type: 'event', text: 'Scenario: Remove every hidden idol from enemy cards, at all locations.' },
  { id: 'extravote', name: 'Extra Vote', short: 'Extra Vote', cost: 2, power: 0, arch: 'event', type: 'event', text: 'Scenario: Your strongest card here gets +4 influence.' },
  { id: 'doordie', name: 'Do or Die', short: 'Do or Die', cost: 3, power: 0, arch: 'event', type: 'event', text: "Scenario: Coin flip. Your strongest card here gets +6 influence, or it's voted out." },
  // ---- Batch 4: early era (Seasons 1-20) ----
  { id: 'rudy', name: 'Rudy Boesch', short: 'Rudy', cost: 3, power: 5, arch: 'beast', text: "Ongoing: Can't be moved, flipped or switched to the other side." },
  { id: 'ethan', name: 'Ethan Zohn', short: 'Ethan', cost: 4, power: 5, arch: 'alliance', text: "Ongoing: Your other cards here can't drop below their printed influence." },
  { id: 'lex', name: 'Lex van den Berghe', short: 'Lex', cost: 3, power: 3, arch: 'vote', text: 'On Reveal: Your weakest other card here switches to the enemy side. +3 influence.' },
  { id: 'vecepia', name: 'Vecepia Towery', short: 'Vecepia', cost: 2, power: 2, arch: 'strat', text: "Start of Turn: +1 influence if this isn't the strongest card here." },
  { id: 'robc', name: 'Rob Cesternino', short: 'Rob C.', cost: 3, power: 1, arch: 'strat', text: 'On Reveal: Swap the influence of the strongest enemy card here with 6 or less influence and your weakest card here.' },
  { id: 'chrisd', name: 'Chris Daugherty', short: 'Chris D.', cost: 3, power: 3, arch: 'strat', text: "Objective: At game end, if you're losing here by 4 or less, +5 influence." },
  { id: 'terry', name: 'Terry Deitz', short: 'Terry', cost: 4, power: 4, arch: 'beast', text: 'Start of Turn: +1 influence.' },
  { id: 'yul', name: 'Yul Kwon', short: 'Yul', cost: 3, power: 3, arch: 'idol', text: 'Ongoing: Your cards holding a hidden idol, anywhere, have +2 influence.' },
  { id: 'yauman', name: 'Yau-Man Chen', short: 'Yau-Man', cost: 2, power: 2, arch: 'strat', text: "On Reveal: The weakest enemy card here gets +3 influence. Draw 2 cards." },
  { id: 'dreamz', name: 'Dreamz Herd', short: 'Dreamz', cost: 2, power: 4, arch: 'vote', text: 'Ongoing: On turn 6, +3 influence and your other cards here have -2.' },
  { id: 'james', name: 'James Clement', short: 'James', cost: 3, power: 5, arch: 'idol', text: "Ongoing: Hidden idols don't protect him. While holding one, +3 influence." },
  { id: 'bob', name: 'Bob Crowley', short: 'Bob', cost: 1, power: 2, arch: 'idol', text: "On Reveal: Put a Fake Idol into your opponent's hand." },
  { id: 'steph', name: 'Stephenie LaGrossa', short: 'Stephenie', cost: 2, power: 2, arch: 'beast', text: 'Ongoing: +1 influence for each enemy card here.' },
  { id: 'ian', name: 'Ian Rosenberger', short: 'Ian', cost: 1, power: 3, arch: 'alliance', text: 'End of Turn: If you lead here by 6 or more, Ian bows out and your other cards here get +2.' },
  { id: 'fakeidol', name: 'Fake Idol', short: 'Fake Idol', cost: 1, power: 0, arch: 'event', type: 'event', token: true, text: 'Scenario: Does nothing. Bob made it out of a stick.' },
  { id: 'goat', name: 'Goat', short: 'Goat', cost: 0, power: 0, arch: 'goat', token: true, text: 'Takes up a spot. Does nothing.' }
];
const CARD = Object.fromEntries(CARDS.map(c => [c.id, c]));
// Ability types. Cards that fire when something happens keep the 'reaction' label.
const KW = { reveal: 'On Reveal', ongoing: 'Ongoing', start: 'Start of Turn', end: 'End of Turn', objective: 'Objective', reaction: 'Reaction', none: 'No ability' };
const CARD_KW = {
  ongoing: ['erik', 'parvati', 'sandra', 'ozzy', 'rob', 'jeremy', 'hatch', 'kim', 'amber', 'tina', 'michele', 'colby', 'ben', 'earl', 'rudy', 'ethan', 'yul', 'dreamz', 'james', 'steph'],
  reaction: ['natalie', 'rick', 'spencer'],
  end: ['tyson', 'ian'],
  none: ['joe', 'westman', 'goat'],
  start: ['vecepia', 'terry'], objective: ['chrisd']
};
CARDS.forEach(c => { c.kw = Object.keys(CARD_KW).find(k => CARD_KW[k].includes(c.id)) || 'reveal'; });

const LOCS = [
  { id: 'tribal', name: 'Tribal Council', text: 'End of each turn: if 2+ cards are here, the one with the least influence is voted out.' },
  { id: 'exile', name: 'Exile Island', text: 'Each player can have only 1 card here.' },
  { id: 'immunity', name: 'Immunity Challenge', text: "Cards here can't be voted out, moved or flipped." },
  { id: 'feast', name: 'Reward Feast', text: 'Cards played here get +2 influence.' },
  { id: 'idolspot', name: 'Hidden Idol Spot', text: 'The first card each player plays here gets a hidden idol.' },
  { id: 'swap', name: 'Swap Beach', text: 'After turn 4, every card here switches sides.' },
  { id: 'edge', name: 'Edge of Extinction', text: "Cards voted out at other locations come back here, if there's room." },
  { id: 'loved', name: 'Loved Ones Visit', text: 'When you play a card here, draw a card.' },
  { id: 'merge', name: 'The Merge', text: 'When revealed, both players draw 2 cards.' },
  { id: 'fire', name: 'Fire-Making', text: 'Each player can have only 2 cards here.' },
  { id: 'camp', name: 'Day 1 Camp', text: 'No effect. Build a shelter.' },
  { id: 'island', name: 'Island of the Idols', text: 'End of each turn: cards here get +1 influence.' }
];
const LOC = Object.fromEntries(LOCS.map(l => [l.id, l]));

const BOTS = [
  { name: 'Tagi', style: 'Alliance', deck: ['cochran', 'maryanne', 'parvati', 'tony', 'reward', 'yamyam', 'rob', 'hatch', 'joe', 'cirie', 'kim', 'westman'] },
  { name: 'Pagong', style: 'Vote Out', deck: ['natalie', 'rick', 'erik', 'kass', 'sandra', 'kim', 'rocks', 'brian', 'blindside', 'cirie', 'dee', 'jeff'] },
  { name: 'Koror', style: 'Idol Hunters', deck: ['jt', 'necklace', 'david', 'malcolm', 'extravote', 'rachel', 'kenzie', 'jerri', 'ben', 'colby', 'chris', 'earl'] },
  { name: 'Rotu', style: 'Old School', deck: ['bob', 'ian', 'vecepia', 'steph', 'yauman', 'dreamz', 'chrisd', 'yul', 'james', 'rudy', 'lex', 'terry'] },
  { name: 'Ulong', style: 'Idols & Beasts', deck: ['cochran', 'erik', 'maryanne', 'russell', 'tony', 'ozzy', 'brian', 'jeremy', 'joe', 'kim', 'dee', 'westman'] }
];
const STARTER = ['cochran', 'maryanne', 'erik', 'parvati', 'tony', 'reward', 'ozzy', 'yamyam', 'rob', 'joe', 'kim', 'westman'];
// Collection tiers: 1 Day One (starter + a few pulls), 2 Pre-Merge, 3 The Merge, 4 Legends
const TIERS_INFO = { 1: { name: 'Day One', at: 0, rank: 'Castaway' }, 2: { name: 'Pre-Merge', at: 10, rank: 'Swing Vote' }, 3: { name: 'The Merge', at: 25, rank: 'Merged' }, 4: { name: 'Legends', at: 45, rank: 'Juror' } };
const CARD_TIER = {
  cochran: 1, maryanne: 1, erik: 1, parvati: 1, tony: 1, reward: 1, ozzy: 1, yamyam: 1, rob: 1, joe: 1, kim: 1, westman: 1,
  natalie: 1, tribeswap: 1, rick: 1, brian: 1,
  russell: 2, kass: 2, rocks: 2, hatch: 2, jeremy: 2,
  cirie: 3, blindside: 3, dee: 3,
  sandra: 4, jeff: 4,
  // batch 2: provisional, everything collectible from Tree Mail until tiers are sorted
  spencer: 1, amber: 1, carolyn: 1, jt: 1, malcolm: 1, tyson: 1, fairplay: 1, tina: 1, michele: 1, david: 1, q: 1,
  jerri: 1, rupert: 1, sarah: 1, chris: 1, kenzie: 1, rachel: 1, colby: 1, ben: 1, earl: 1,
  kelly: 1, phillip: 1, wade: 1,
  necklace: 1, shotdark: 1, nullifier: 1, extravote: 1, doordie: 1,
  rudy: 1, ethan: 1, lex: 1, vecepia: 1, robc: 1, chrisd: 1, terry: 1, yul: 1, yauman: 1, dreamz: 1, james: 1, bob: 1, steph: 1, ian: 1
};

let RNG = Math.random;
const rnd = n => Math.floor(RNG() * n);
const pick = a => a[rnd(a.length)];
function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = rnd(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; }
const maxBy = (a, f) => a.reduce((b, x) => (b == null || f(x) > f(b) ? x : b), null);
const minBy = (a, f) => a.reduce((b, x) => (b == null || f(x) < f(b) ? x : b), null);

function mk(g, id, p) { return { uid: g.uid++, id, owner: p, perm: 0, idol: false, loc: -1 }; }
function emit(g, ev) { g.events.push(ev); }

function newGame(deck0, deck1) {
  const g = { turn: 0, uid: 1, locs: [], players: [], votedOut: 0, stakes: 1, pending: 1, idol: [false, false],
    events: [], over: false, result: null, turnPlays: [[], []], outBy: [0, 0], gone: [] };
  g.locs = shuffle(LOCS.map(l => l.id)).slice(0, 3).map(id => ({ id, revealed: false, sides: [[], []], idolGiven: [false, false] }));
  [deck0, deck1].forEach((d, p) => {
    g.players.push({ deck: shuffle(d.map(id => mk(g, id, p))), hand: [], staged: [], energy: 0, played: 0, events: 0, kellyArm: false });
  });
  for (let p = 0; p < 2; p++) draw(g, p, 3);
  return g;
}

function draw(g, p, n = 1) {
  const P = g.players[p];
  for (let i = 0; i < n; i++) { if (!P.deck.length || P.hand.length >= 7) return; P.hand.push(P.deck.pop()); }
}

function cap(L) { if (L.revealed) { if (L.id === 'exile') return 1; if (L.id === 'fire') return 2; } return 4; }
function space(g, li, p) {
  const L = g.locs[li];
  return cap(L) - L.sides[p].length - g.players[p].staged.filter(s => s.loc === li).length;
}
function fireLeft(g, p) { const P = g.players[p]; return P.energy - P.staged.reduce((s, x) => s + CARD[x.card.id].cost, 0); }
function canStage(g, p, card, li) { return CARD[card.id].cost <= fireLeft(g, p) && space(g, li, p) > 0; }
function stage(g, p, uid, li) {
  const P = g.players[p]; const i = P.hand.findIndex(c => c.uid === uid);
  if (i < 0 || !canStage(g, p, P.hand[i], li)) return false;
  P.staged.push({ card: P.hand.splice(i, 1)[0], loc: li }); return true;
}
function unstage(g, p, uid) {
  const P = g.players[p]; const i = P.staged.findIndex(s => s.card.uid === uid);
  if (i < 0) return false; P.hand.push(P.staged.splice(i, 1)[0].card); return true;
}

let REF_DEPTH = 0; // guards Michele/Earl, whose bonus reads other locations' totals
function power(g, c) {
  let v = CARD[c.id].power + c.perm;
  if (c.loc < 0) return v;
  const L = g.locs[c.loc], mine = L.sides[c.owner], theirs = L.sides[1 - c.owner];
  if (c.id === 'amber' && mine.some(o => o.id === 'rob')) v += 3;
  if (c.id === 'tina' && theirs.length > mine.length) v += 4;
  if (c.id === 'ben' && L.revealed && (L.id === 'tribal' || L.id === 'fire')) v += 5;
  if ((c.id === 'michele' || c.id === 'earl') && REF_DEPTH === 0) {
    REF_DEPTH++;
    try {
      const others = g.locs.map((_, i) => i).filter(i => i !== c.loc);
      const res = others.map(i => total(g, i, c.owner) - total(g, i, 1 - c.owner));
      if (c.id === 'michele' && res.every(d => d < 0)) v += 4;
      if (c.id === 'earl' && res.every(d => d > 0)) v += 4;
    } finally { REF_DEPTH--; }
  }
  for (const o of mine) if (o !== c && o.id === 'colby') v -= 1;
  if (c.id === 'steph') v += theirs.length;
  if (c.id === 'james' && c.idol) v += 3;
  if (c.idol && g.locs.some(M => M.sides[c.owner].some(o => o.id === 'yul'))) v += 2;
  if (g.turn === 6) { if (c.id === 'dreamz') v += 3; for (const o of mine) if (o !== c && o.id === 'dreamz') v -= 2; }
  if (c.id === 'parvati' && mine.length > theirs.length) v += 3;
  if (c.id === 'sandra') v += g.votedOut;
  if (c.id === 'ozzy' && mine.length === 1) v += 4;
  for (const o of mine) if (o !== c && o.id === 'rob') v += 1;
  for (const o of theirs) { if (o.id === 'erik') v += 1; if (o.id === 'kim') v -= 1; }
  g.locs.forEach(M => { if (M !== L) for (const o of M.sides[c.owner]) if (o.id === 'hatch') v += 1; });
  if (mine.some(o => o !== c && o.id === 'ethan')) v = Math.max(v, CARD[c.id].power);
  return v;
}
const fixedCard = c => c.id === 'rudy'; // Rudy never moves or changes sides
function total(g, li, p) { return g.locs[li].sides[p].reduce((s, c) => s + power(g, c), 0); }
function locWinner(g, li) { const a = total(g, li, 0), b = total(g, li, 1); return a > b ? 0 : b > a ? 1 : -1; }
function standing(g) {
  const w = [0, 0], t = [0, 0];
  g.locs.forEach((L, li) => { const x = locWinner(g, li); if (x >= 0) w[x]++; t[0] += total(g, li, 0); t[1] += total(g, li, 1); });
  return { w, t };
}
function gameWinner(g) { const { w, t } = standing(g); if (w[0] !== w[1]) return w[0] > w[1] ? 0 : 1; if (t[0] !== t[1]) return t[0] > t[1] ? 0 : 1; return -1; }

function place(g, c, li, p) { c.owner = p; c.loc = li; g.locs[li].sides[p].push(c); }
function removeFrom(g, c) { const s = g.locs[c.loc].sides[c.owner]; s.splice(s.indexOf(c), 1); c.loc = -1; }
const isImmunity = L => L.revealed && L.id === 'immunity';

function revealLoc(g, li) {
  const L = g.locs[li]; L.revealed = true; emit(g, { t: 'loc', li });
  if (L.id === 'merge') { draw(g, 0, 2); draw(g, 1, 2); }
}

function startTurn(g) {
  g.turn++;
  if (g.turn === 6) g.pending *= 2;
  g.stakes = g.pending;
  if (g.turn <= 3) revealLoc(g, g.turn - 1);
  for (let p = 0; p < 2; p++) { draw(g, p); g.players[p].energy = g.turn; }
  // Start of Turn abilities, for cards already on the board
  g.locs.forEach(L => {
    const all = [...L.sides[0], ...L.sides[1]];
    for (const c of all) {
      if (c.id === 'terry') { c.perm += 1; emit(g, { t: 'sot', id: c.id }); }
      if (c.id === 'vecepia') { const top = Math.max(...all.map(o => power(g, o))); if (power(g, c) < top) { c.perm += 1; emit(g, { t: 'sot', id: c.id }); } }
    }
  });
}

function playIdol(g, p) { if (g.over || g.idol[p]) return false; g.idol[p] = true; g.pending *= 2; return true; }
function quit(g, p) { g.over = true; g.result = { winner: 1 - p, stakes: g.stakes, quit: p }; }

function voteOut(g, c) {
  if (c.loc < 0) return false;
  const L = g.locs[c.loc];
  if (c.id === 'sandra' || isImmunity(L) || L.sides[c.owner].some(o => o !== c && o.id === 'jeremy')) { emit(g, { t: 'safe', uid: c.uid, id: c.id }); return false; }
  if (c.idol && c.id !== 'james') { c.idol = false; emit(g, { t: 'idol', uid: c.uid, id: c.id }); return false; }
  const from = c.loc; removeFrom(g, c); g.votedOut++; g.outBy[c.owner]++;
  const goneEntry = { uid: c.uid, id: c.id, owner: c.owner, turn: g.turn, why: 'out' }; g.gone.push(goneEntry);
  g.locs.forEach(M => M.sides[1 - c.owner].forEach(o => { if (o.id === 'spencer') o.perm += 1; }));
  emit(g, { t: 'out', uid: c.uid, id: c.id, owner: c.owner });
  g.locs.forEach(M => M.sides[c.owner].forEach(o => { if (o.id === 'natalie') o.perm += 3; }));
  if (c.id === 'rick') {
    const d = [0, 1, 2].filter(i => g.locs[i].sides[c.owner].length < cap(g.locs[i]));
    if (d.length) { c.perm += 3; place(g, c, pick(d), c.owner); g.gone.splice(g.gone.indexOf(goneEntry), 1); emit(g, { t: 'back', uid: c.uid, id: c.id }); }
  } else {
    const ei = g.locs.findIndex(M => M.revealed && M.id === 'edge');
    if (ei >= 0 && ei !== from && g.locs[ei].sides[c.owner].length < cap(g.locs[ei])) { place(g, c, ei, c.owner); g.gone.splice(g.gone.indexOf(goneEntry), 1); emit(g, { t: 'edge', uid: c.uid, id: c.id }); }
  }
  return true;
}

function playEffects(g, c, li, p) {
  const L = g.locs[li], def = CARD[c.id], op = 1 - p;
  if (L.revealed) {
    if (L.id === 'loved') draw(g, p);
    if (def.type !== 'event') {
      if (L.id === 'feast') c.perm += 2;
      if (L.id === 'idolspot' && !L.idolGiven[p]) { L.idolGiven[p] = true; c.idol = true; emit(g, { t: 'gotidol', uid: c.uid, id: c.id }); }
    }
  }
  switch (c.id) {
    case 'cochran': draw(g, p); break;
    case 'maryanne': if (L.sides[op].some(o => power(g, o) > power(g, c))) c.perm += 3; break;
    case 'tony': if (g.turnPlays[op].includes(li)) c.perm += 3; break;
    case 'russell': g.locs.forEach(M => { const b = maxBy(M.sides[p], o => power(g, o)); if (b) b.idol = true; }); emit(g, { t: 'russell' }); break;
    case 'kass': { let n = 0; for (const o of L.sides[p].filter(o => o !== c)) if (voteOut(g, o)) n++; c.perm += 3 * n; break; }
    case 'yamyam': L.sides[p].forEach(o => { if (o !== c) o.perm += 1; }); break;
    case 'brian': g.locs.forEach((M, mi) => { if (mi !== li && M.sides[op].length < cap(M)) place(g, mk(g, 'goat', op), mi, op); }); emit(g, { t: 'goats' }); break;
    case 'cirie': {
      if (isImmunity(L) || L.sides[p].length >= cap(L)) break;
      const t = minBy(L.sides[op].filter(o => power(g, o) <= 3 && !fixedCard(o)), o => power(g, o));
      if (t) { removeFrom(g, t); place(g, t, li, p); emit(g, { t: 'flip', uid: t.uid, id: t.id }); }
      break;
    }
    case 'dee': { const t = maxBy(L.sides[op].filter(o => power(g, o) <= 4), o => power(g, o)); if (t) voteOut(g, t); break; }
    case 'jeff':
      g.locs.forEach((M, mi) => {
        if (mi === li) return;
        const all = [...M.sides[0], ...M.sides[1]]; if (!all.length) return;
        const m = Math.min(...all.map(o => power(g, o)));
        voteOut(g, pick(all.filter(o => power(g, o) === m)));
      });
      break;
    case 'reward': L.sides[p].forEach(o => { if (o !== c) o.perm += 2; }); break;
    case 'wade': {
      if (L.sides[p].length >= cap(L)) break;
      const cands = [];
      g.locs.forEach((M, mi) => { if (mi !== li && !isImmunity(M)) M.sides[p].forEach(o => { if (!fixedCard(o)) cands.push(o); }); });
      const t = maxBy(cands, o => power(g, o));
      if (t) { removeFrom(g, t); place(g, t, li, p); emit(g, { t: 'moved', uid: t.uid, id: t.id }); }
      break;
    }
    case 'lex': {
      c.perm += 3;
      if (isImmunity(L) || L.sides[op].length >= cap(L)) break;
      const t = minBy(L.sides[p].filter(o => o !== c && !fixedCard(o)), o => power(g, o));
      if (t) { removeFrom(g, t); place(g, t, li, op); emit(g, { t: 'lex', uid: t.uid, id: t.id }); }
      break;
    }
    case 'robc': {
      const a = maxBy(L.sides[op].filter(o => power(g, o) <= 6), o => power(g, o)), b = minBy(L.sides[p], o => power(g, o));
      if (a && b) { const d = power(g, a) - power(g, b); if (d > 0) { a.perm -= d; b.perm += d; emit(g, { t: 'robc', id: a.id, id2: b.id }); } }
      break;
    }
    case 'yauman': { const t = minBy(L.sides[op], o => power(g, o)); if (t) t.perm += 3; draw(g, p, 2); break; }
    case 'bob': { const H = g.players[op].hand; if (H.length < 7) { H.push(mk(g, 'fakeidol', op)); emit(g, { t: 'fakeidol', owner: op }); } break; }
    case 'phillip':
      if (L.sides[op].length < cap(L)) { removeFrom(g, c); place(g, c, li, op); emit(g, { t: 'mole', uid: c.uid, id: c.id }); }
      break;
    case 'carolyn': {
      if (isImmunity(L)) break;
      const d = [0, 1, 2].filter(i => i !== li && g.locs[i].sides[p].length < cap(g.locs[i]));
      if (d.length) { removeFrom(g, c); place(g, c, pick(d), p); c.perm += 2; emit(g, { t: 'moved', uid: c.uid, id: c.id }); }
      break;
    }
    case 'jt': { const t = maxBy(L.sides[op], o => power(g, o)); if (t) { t.idol = true; emit(g, { t: 'gotidol', uid: t.uid, id: t.id }); } break; }
    case 'malcolm': if (g.locs.some(M => M.sides[p].some(o => o.idol))) c.perm += 3; break;
    case 'fairplay': { const t = maxBy(L.sides[op], o => power(g, o)); if (t) t.perm -= 2; break; }
    case 'david': L.sides[p].forEach(o => { if (o !== c) o.idol = true; }); break;
    case 'q': if (L.sides[op].some(o => power(g, o) > power(g, c))) voteOut(g, c); break;
    case 'jerri': L.sides[op].forEach(o => { o.perm -= 1; }); break;
    case 'rupert': { const D = g.players[op].deck, H = g.players[p].hand; if (D.length && H.length < 7) { const t = D.pop(); g.gone.push({ uid: t.uid, id: t.id, owner: op, turn: g.turn, why: 'stolen' }); t.owner = p; H.push(t); emit(g, { t: 'steal', id: t.id, owner: p }); } break; }
    case 'sarah': c.perm += Math.max(0, g.players[p].played - 1); break;
    case 'chris': if (g.outBy[p] > 0) c.perm += 4; break;
    case 'kenzie': g.locs.forEach((M, mi) => { if (mi !== li) M.sides[p].forEach(o => { o.perm += 1; }); }); break;
    case 'rachel': if (g.players[p].events > 0) c.perm += 3; break;
    case 'necklace': { const t = maxBy(L.sides[p].filter(o => o !== c), o => power(g, o)); if (t) { t.idol = true; emit(g, { t: 'gotidol', uid: t.uid, id: t.id }); } break; }
    case 'shotdark': if (RNG() < 1 / 3) { L.sides[p].forEach(o => { if (o !== c) o.idol = true; }); emit(g, { t: 'shot', ok: true }); } else emit(g, { t: 'shot', ok: false }); break;
    case 'nullifier': g.locs.forEach(M => M.sides[op].forEach(o => { o.idol = false; })); emit(g, { t: 'nullified' }); break;
    case 'extravote': { const t = maxBy(L.sides[p].filter(o => o !== c), o => power(g, o)); if (t) t.perm += 4; break; }
    case 'doordie': { const t = maxBy(L.sides[p].filter(o => o !== c), o => power(g, o)); if (t) { if (RNG() < 0.5) { t.perm += 6; emit(g, { t: 'dod', ok: true, id: t.id }); } else { emit(g, { t: 'dod', ok: false, id: t.id }); voteOut(g, t); } } break; }
    case 'tribeswap': {
      if (isImmunity(L)) break;
      const t = maxBy(L.sides[op].filter(o => !fixedCard(o)), o => power(g, o)); if (!t) break;
      const d = [0, 1, 2].filter(i => i !== li && g.locs[i].sides[op].length < cap(g.locs[i]));
      if (d.length) { removeFrom(g, t); place(g, t, pick(d), op); emit(g, { t: 'moved', uid: t.uid, id: t.id }); }
      break;
    }
    case 'rocks': { const all = [...L.sides[0], ...L.sides[1]].filter(o => o !== c); if (all.length) voteOut(g, pick(all)); break; }
    case 'blindside': { const t = maxBy(L.sides[op], o => power(g, o)); if (t) voteOut(g, t); break; }
  }
  const P = g.players[p];
  if (c.id === 'kelly') P.kellyArm = true;
  else if (P.kellyArm && def.type !== 'event' && c.loc >= 0 && c.owner === p) {
    P.kellyArm = false;
    const from = g.locs[c.loc], to = c.loc - 1, T = g.locs[to];
    if (to >= 0 && !fixedCard(c) && !isImmunity(from) && T.sides[p].length < cap(T)) { removeFrom(g, c); place(g, c, to, p); emit(g, { t: 'moved', uid: c.uid, id: c.id }); }
  }
  if (def.type === 'event' && c.loc >= 0) { removeFrom(g, c); g.gone.push({ uid: c.uid, id: c.id, owner: p, turn: g.turn, why: 'scenario' }); }
}

function* resolveTurn(g) {
  const s = standing(g);
  const first = s.w[0] > s.w[1] ? 0 : s.w[1] > s.w[0] ? 1 : rnd(2);
  g.turnPlays = [g.players[0].staged.map(x => x.loc), g.players[1].staged.map(x => x.loc)];
  yield { t: 'order', first, tie: s.w[0] === s.w[1] };
  for (const p of [first, 1 - first]) {
    const P = g.players[p];
    // cards stay face-down in their spots until their own reveal, in the order they were played
    while (P.staged.length) {
      const { card, loc } = P.staged.shift();
      const L = g.locs[loc];
      if (L.sides[p].length >= cap(L)) { if (P.hand.length < 7) P.hand.push(card); else P.deck.unshift(card); emit(g, { t: 'nofit', uid: card.uid, id: card.id, owner: p }); continue; }
      place(g, card, loc, p); card.turn = g.turn;
      P.played++; if (CARD[card.id].type === 'event') P.events++;
      yield { t: 'reveal', uid: card.uid };
      playEffects(g, card, loc, p);
      yield { t: 'after', uid: card.uid };
    }
  }
  yield* endOfTurn(g);
}

function* endOfTurn(g) {
  for (const L of g.locs) for (const c of [...L.sides[0], ...L.sides[1]]) {
    if (c.id === 'tyson' && c.turn === g.turn - 1) { emit(g, { t: 'tyson', id: c.id }); voteOut(g, c); }
  }
  for (const L of g.locs) if (L.revealed && L.id === 'island') [...L.sides[0], ...L.sides[1]].forEach(o => o.perm += 1);
  for (const L of g.locs) {
    if (!L.revealed || L.id !== 'tribal') continue;
    const all = [...L.sides[0], ...L.sides[1]];
    if (all.length >= 2) {
      const m = Math.min(...all.map(o => power(g, o)));
      emit(g, { t: 'tribal' });
      voteOut(g, pick(all.filter(o => power(g, o) === m)));
      yield { t: 'tribal' };
    }
  }
  if (g.turn === 4) for (const L of g.locs) {
    if (!L.revealed || L.id !== 'swap') continue;
    const stay = [L.sides[0].filter(fixedCard), L.sides[1].filter(fixedCard)];
    const ns = [L.sides[1].filter(c => !fixedCard(c)).concat(stay[0]), L.sides[0].filter(c => !fixedCard(c)).concat(stay[1])];
    L.sides = ns[0].length <= cap(L) && ns[1].length <= cap(L) ? ns : [L.sides[1], L.sides[0]]; // no room to stay put: Rudy swaps too
    L.sides.forEach((s, p) => s.forEach(c => { c.owner = p; }));
    emit(g, { t: 'swap' }); yield { t: 'swap' };
  }
  for (const [li, L] of g.locs.entries()) for (const p of [0, 1]) for (const c of [...L.sides[p]]) {
    if (c.id !== 'ian') continue;
    if (total(g, li, p) - total(g, li, 1 - p) >= 6) {
      removeFrom(g, c); g.gone.push({ uid: c.uid, id: c.id, owner: p, turn: g.turn, why: 'left' });
      L.sides[p].forEach(o => { o.perm += 2; });
      emit(g, { t: 'ian', id: c.id }); yield { t: 'ian' };
    }
  }
  if (g.turn >= 6) {
    // Objectives are checked at game end, before the winner is decided
    for (const [li, L] of g.locs.entries()) for (const p of [0, 1]) for (const c of L.sides[p]) {
      if (c.id !== 'chrisd') continue;
      const gap = total(g, li, 1 - p) - total(g, li, p);
      if (gap >= 1 && gap <= 4) { c.perm += 5; emit(g, { t: 'objective', id: c.id }); yield { t: 'objective' }; }
    }
    g.over = true; g.result = { winner: gameWinner(g), stakes: g.pending, quit: -1 };
  }
}

// ----- Bot -----
function evalFor(g, p) {
  let s = 0;
  g.locs.forEach((L, li) => {
    const d = total(g, li, p) - total(g, li, 1 - p);
    s += Math.max(-10, Math.min(10, d)) + (d > 0 ? 8 : d < 0 ? -8 : 0);
  });
  return s;
}
function simEval(g, p, play) {
  const h = JSON.parse(JSON.stringify({ ...g, events: [] }));
  if (play && !stage(h, p, play.uid, play.li)) return -1e9;
  h.players[1 - p].staged = [];
  h.turnPlays = [[], []];
  const list = h.players[p].staged; h.players[p].staged = [];
  const saved = RNG; let seed = 7; RNG = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
  try {
    for (const { card, loc } of list) {
      const L = h.locs[loc]; if (L.sides[p].length >= cap(L)) continue;
      place(h, card, loc, p); card.turn = h.turn; h.players[p].played++; if (CARD[card.id].type === 'event') h.players[p].events++;
      playEffects(h, card, loc, p);
    }
  } finally { RNG = saved; }
  return evalFor(h, p);
}
function botPlan(g, p) {
  for (let iter = 0; iter < 8; iter++) {
    const P = g.players[p], base = simEval(g, p, null);
    let best = null;
    for (const c of P.hand) {
      if (CARD[c.id].cost > fireLeft(g, p)) continue;
      for (let li = 0; li < 3; li++) {
        if (space(g, li, p) <= 0) continue;
        const sc = simEval(g, p, { uid: c.uid, li }) + CARD[c.id].cost * 0.8 + RNG() * 1.5;
        if (!best || sc > best.sc) best = { sc, uid: c.uid, li };
      }
    }
    if (!best || best.sc < base - 1) break;
    stage(g, p, best.uid, best.li);
  }
}
function botWantsIdol(g, p) {
  if (g.idol[p] || g.turn < 3) return false;
  const h = JSON.parse(JSON.stringify({ ...g, events: [] }));
  const list = h.players[p].staged; h.players[p].staged = [];
  for (const { card, loc } of list) if (h.locs[loc].sides[p].length < cap(h.locs[loc])) place(h, card, loc, p);
  let lead = 0, won = 0;
  h.locs.forEach((L, li) => { const d = total(h, li, p) - total(h, li, 1 - p); if (d > 0) { won++; lead += Math.min(d, 10); } });
  return won >= 2 && lead >= 10 + (6 - g.turn) * 2;
}
function botWantsQuit(g, p) {
  if (g.turn < 5 || g.stakes < 2) return false;
  let lost = 0, gap = 0;
  g.locs.forEach((L, li) => { const d = total(g, li, 1 - p) - total(g, li, p); if (d > 0) { lost++; gap += d; } });
  return lost >= 2 && gap >= (g.turn === 6 ? 12 : 18);
}

if (typeof module !== 'undefined') module.exports = { KW, TIERS_INFO, CARD_TIER, CARDS, CARD, LOCS, BOTS, STARTER, newGame, startTurn, resolveTurn, botPlan, botWantsIdol, botWantsQuit, playIdol, quit, stage, total, power, cap, standing, setRNG: f => { RNG = f; } };
