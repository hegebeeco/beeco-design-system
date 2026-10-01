#!/usr/bin/env python3
"""A méhecske-sprite-ok CSS-e (generált): termek/css/bc-meh-sprite.css – a gyart.py után futtasd (a gyart.py meghívja)."""
import json, os
ROOT = os.path.join(os.path.dirname(__file__), '..', '..')
CFG = json.load(open(os.path.join(ROOT, 'tools/meh-sprite/mozgasok.json'), encoding='utf-8'))
L = ['/* GENERÁLT FÁJL (tools/meh-sprite/css.py) – a méhecske-sprite-ok: <BeeSprite szereplo="…" />',
     '   A lap vízszintes csík; a lejátszás steps()-szel ugrik képkockáról képkockára, a beállított számú ismétlés után megáll.',
     '   Csökkentett mozgásnál az első képkocka áll (bc-base.css). */',
     '.bc-sprite { display: inline-block; flex: none; width: var(--_s, 128px); height: var(--_s, 128px); background-repeat: no-repeat; background-size: calc(var(--_n) * 100%) 100%;',
     '  animation: bc-sprite calc(var(--_n) * 1000ms / var(--_fps)) steps(calc(var(--_n) - 1), jump-none) var(--_ism) both; }',
     '.bc-sprite.is-s { --_s: 64px; } .bc-sprite.is-l { --_s: 192px; }',
     '.bc-sprite.is-paused { animation-play-state: paused; }',
     # n kocka egy csíkban: a háttér 0%-ról 100%-ra lép, n−1 lépésben – így mind az n kocka sorra kerül
     '@keyframes bc-sprite { to { background-position-x: 100%; } }']
for n, sz in CFG['szereplok'].items():
    u = lambda j: f'url("../../dist/meh/{n}/sprite@{j}.webp")'
    L.append(f'.bc-sprite[data-szereplo="{n}"] {{ --_n: {sz["frames"]}; --_fps: {sz["fps"]}; --_ism: {sz["ismetles"]}; '
             f'background-image: {u("1x")}; background-image: image-set({u("1x")} 1x, {u("2x")} 2x, {u("3x")} 3x); }}')
open(os.path.join(ROOT, 'termek/css/bc-meh-sprite.css'), 'w').write('\n'.join(L) + '\n')
print('írva: termek/css/bc-meh-sprite.css')
