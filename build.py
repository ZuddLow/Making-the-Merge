#!/usr/bin/env python3
"""Build Making the Merge.

  python3 build.py          -> index.html and cards.html (the website, served by GitHub Pages)
  python3 build.py claude   -> dist/claude.html (the version published as a Claude artifact)

Edit the game in src/ (engine.js = rules and cards, ui.html = screens), then rebuild.
"""
import json, os, re, subprocess, sys

ROOT = os.path.dirname(os.path.abspath(__file__))
rd = lambda p: open(os.path.join(ROOT, p), encoding='utf-8').read()
FIREBASE_VERSION = '10.12.2'

def game_page(art_baked, web, art_files):
    ui, eng = rd('src/ui.html'), rd('src/engine.js')
    out = (ui.replace('/*ENGINE*/', eng)
             .replace('/*ARTBAKED*/{ cards: {}, locs: {} }', json.dumps(art_baked))
             .replace('/*WEB*/false', 'true' if web else 'false')
             .replace('/*ARTFILES*/{}', json.dumps(art_files)))
    assert '/*ARTBAKED*/' not in out and '/*WEB*/' not in out and '/*ARTFILES*/' not in out
    return out

def web_art():
    art = json.load(open(os.path.join(ROOT, 'art/art.json')))
    baked, files = {'cards': {}, 'locs': {}}, {}
    for kind in ('cards', 'locs'):
        for key, e in art.get(kind, {}).items():
            aid = f'file-{kind}-{key}'
            files[aid] = e['file']
            baked[kind][key] = {'id': aid, **{k: e[k] for k in ('r', 'z', 'px', 'py') if k in e}}
    return baked, files

HEAD = """<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="robots" content="noindex, nofollow">
<meta name="theme-color" content="#0c120f">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="The Merge">
<link rel="manifest" href="manifest.json">
<link rel="icon" type="image/png" href="icons/icon-192.png">
<link rel="apple-touch-icon" href="icons/apple-touch-icon.png">
<style>:root{color-scheme:dark;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px);box-sizing:border-box}html,body{height:100%}body{margin:0;font:14px system-ui,-apple-system,sans-serif;overscroll-behavior:none}img{max-width:100%}[hidden]{display:none!important}</style>
"""

def check_cards():
    # Held cards must never appear in a bot deck or the starter deck, or players would see them.
    out = subprocess.run(['node', '-e', "const E=require('./src/engine.js');const bad=[];[...E.BOTS.map(b=>[b.name,b.deck]),['Starter',E.STARTER]].forEach(([n,d])=>d.forEach(id=>{if(!E.CARD[id])bad.push(n+': unknown '+id);else if(E.CARD[id].held)bad.push(n+': held card '+id)}));E.CARDS.forEach(c=>{if(!c.token&&!E.CARD_TIER[c.id])bad.push('no tier: '+c.id)});console.log(bad.join('\\n'))"], cwd=ROOT, capture_output=True, text=True, check=True).stdout.strip()
    if out: sys.exit('Card check failed:\n' + out)

def build_web():
    baked, files = web_art()
    page = game_page(baked, True, files)
    i = page.index('</style>') + len('</style>')   # the page's own title, fonts and styles go in <head>
    head_part, body_part = page[:i], page[i:]
    fb = ''.join(f'<script src="https://www.gstatic.com/firebasejs/{FIREBASE_VERSION}/firebase-{m}-compat.js"></script>\n' for m in ('app', 'auth', 'firestore'))
    html = (HEAD + head_part + '\n' + fb +
            '<script src="src/firebase-config.js"></script>\n<script src="src/firebase-adapter.js"></script>\n'
            '</head>\n<body>\n' + body_part + '\n</body>\n</html>\n')
    open(os.path.join(ROOT, 'index.html'), 'w', encoding='utf-8').write(html)
    # card list page, from the same card data
    subprocess.run(['node', os.path.join(ROOT, 'cardlist/build.js')], check=True)
    cl = rd('cardlist/card-list.html')
    open(os.path.join(ROOT, 'cards.html'), 'w', encoding='utf-8').write(
        HEAD.replace('<meta name="apple-mobile-web-app-capable" content="yes">\n', '') + '</head>\n<body>\n' + cl + '\n</body>\n</html>\n')
    print('built index.html and cards.html')

def build_claude():
    baked = json.load(open(os.path.join(ROOT, 'src/claude-art.json')))
    os.makedirs(os.path.join(ROOT, 'dist'), exist_ok=True)
    open(os.path.join(ROOT, 'dist/claude.html'), 'w', encoding='utf-8').write(game_page(baked, False, {}))
    print('built dist/claude.html')

if __name__ == '__main__':
    check_cards()
    build_claude() if (sys.argv[1:] or ['web'])[0] == 'claude' else build_web()
