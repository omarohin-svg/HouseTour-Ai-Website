import asyncio, json, pathlib, base64
from playwright.async_api import async_playwright
R=pathlib.Path('/workspace/housetour-redesign'); W=R/'work'/'v2'; OUT=R/'renders'/'v2'; B=R/'brand'
FONT=(R/'dark-v2/assets/fonts').as_uri()
CSS=f'''@font-face{{font-family:Sora;src:url("{FONT}/Sora.ttf")}}@font-face{{font-family:Inter;src:url("{FONT}/Inter.ttf")}}
body{{margin:0;background:#0B0F1A;color:#E9EEF6;font-family:Inter;padding:48px}}
h1{{font-family:Sora;font-weight:600;font-size:30px;letter-spacing:-.02em;margin:0 0 6px}}
.sub{{color:#93A0B4;font-size:15px;margin:0 0 32px}}
.grid{{display:grid;gap:28px 28px}}
.cell .lab{{font-size:13px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:#6CC2F5;margin:0 0 10px}}
.cell img{{display:block;border-radius:14px;border:1px solid rgba(255,255,255,.08)}}
.note{{color:#93A0B4;font-size:13px;margin-top:28px}}'''
def page(title,sub,body,extra=''):
    return f'<html><head><style>{CSS}{extra}</style></head><body><h1>{title}</h1><p class="sub">{sub}</p>{body}</body></html>'
async def shoot(b,html,name,width):
    f=W/(name+'.html'); f.write_text(html)
    pg=await b.new_page(viewport={'width':width,'height':600},device_scale_factor=1)
    await pg.goto(f.as_uri()); await pg.evaluate('document.fonts.ready'); await pg.wait_for_timeout(200)
    await pg.screenshot(path=str(OUT/(name+'.png')),full_page=True); await pg.close()
async def main():
    st=json.load(open(W/'states.json'))
    async with async_playwright() as p:
        b=await p.chromium.launch()
        cells=''.join(f'<div class="cell"><p class="lab">{l}</p><img src="{f}" width="616"></div>' for l,f in st['d'])
        await shoot(b,page('Waitlist form states · desktop (hero form, 1440 wide)','Dark v2 · same component is used for the bottom form. Focus states captured via keyboard (Tab / Shift+Tab / arrow keys). No network calls are made.',f'<div class="grid" style="grid-template-columns:repeat(2,616px)">{cells}</div>'),'dark-v2-form-states-desktop',1400)
        cells=''.join(f'<div class="cell"><p class="lab">{l}</p><img src="{f}" width="390"></div>' for l,f in st['m'])
        await shoot(b,page('Waitlist form states · mobile (hero form, 390 wide)','Dark v2 · rendered at 2x, shown at 1x. Error message sits directly under the email field on mobile.',f'<div class="grid" style="grid-template-columns:repeat(4,390px)">{cells}</div>'),'dark-v2-form-states-mobile',1800)
        cells=''.join(f'<div class="cell"><p class="lab">{l}</p><img src="{f}" width="390"></div>' for l,f in [('1 · Top of page: compact Join button','join-0-top.png'),('2 · Scrolled down, tap Join','join-1-before.png'),('3 · After tap: email focused','join-2-after.png')])
        await shoot(b,page('Mobile nav · Join button','390 wide · no hamburger. Join smooth-scrolls to the hero form and focuses the email field.',f'<div class="grid" style="grid-template-columns:repeat(3,390px)">{cells}</div>'),'dark-v2-mobile-390-join-button',1400)
        # logo sheet
        def u(n): return (B/n).as_uri()
        sizes=''.join(f'<div class="cell" style="align-self:end"><p class="lab">{s}px</p><div class="tile"><img src="{u("housetour-mark-small.svg" if s<=48 else "housetour-mark.svg")}" width="{s}" height="{s}" style="border:0;border-radius:0"></div></div>' for s in (16,32,64,180))
        fav=f'''<div class="cell"><p class="lab">favicon.svg / favicon-32.png</p><div class="row"><img src="{u('favicon.svg')}" width="16" height="16" style="border:0;border-radius:0"><img src="{u('favicon-32.png')}" width="32" height="32" style="border:0;border-radius:0"><img src="{u('favicon.svg')}" width="64" height="64" style="border:0"></div>
        <div class="tab"><img src="{u('favicon.svg')}" width="16" height="16" style="border:0;border-radius:3px">HouseTour AI · Meet Kira</div>
        <div class="tab dark"><img src="{u('favicon.svg')}" width="16" height="16" style="border:0;border-radius:3px">HouseTour AI · Meet Kira</div></div>
        <div class="cell"><p class="lab">apple-touch-icon-180.png</p><img src="{u('apple-touch-icon-180.png')}" width="180" height="180" style="border-radius:40px"></div>'''
        lock=f'''<div class="cell"><p class="lab">Nav lockup on dark (as used in the page, 36px mark)</p><div class="lock"><img src="{u('housetour-mark-small.svg')}" width="36" height="36" style="border:0;border-radius:0;margin-top:-3px"><span>HouseTour <b>AI</b></span></div></div>
        <div class="cell"><p class="lab">Large lockup</p><div class="lock big"><img src="{u('housetour-mark.svg')}" width="96" height="96" style="border:0;border-radius:0;margin-top:-8px"><span>HouseTour <b>AI</b></span></div></div>'''
        extra='''.tile{background:#04060D;display:grid;place-items:center;padding:20px;border-radius:14px;border:1px solid rgba(255,255,255,.08)}
        .row{display:flex;align-items:end;gap:18px;background:#04060D;padding:20px;border-radius:14px;border:1px solid rgba(255,255,255,.08)}
        .tab{display:flex;align-items:center;gap:8px;margin-top:12px;width:260px;padding:8px 12px;border-radius:10px 10px 0 0;background:#F1F3F5;color:#202124;font-size:13px}
        .tab.dark{background:#35363A;color:#E8EAED}
        .lock{display:flex;align-items:center;gap:12px;background:#04060D;padding:26px 30px;border-radius:14px;border:1px solid rgba(255,255,255,.08);font-family:Sora;font-weight:600;font-size:19px;letter-spacing:-.02em;color:#F3F6FB}
        .lock b{font-weight:600;color:#59B4F0}.lock.big{font-size:52px;gap:26px;padding:36px 44px}'''
        body=f'<div class="grid" style="grid-template-columns:repeat(4,auto);justify-content:start;align-items:end">{sizes}</div><div class="grid" style="grid-template-columns:auto auto;justify-content:start;margin-top:36px;align-items:start">{fav}</div><div class="grid" style="grid-template-columns:auto auto;justify-content:start;margin-top:36px;align-items:start">{lock}</div><p class="note">Masters: /workspace/housetour-redesign/brand/ · housetour-mark.svg (master, ≥ 64px), housetour-mark-small.svg (≤ 48px optical variant), housetour-mark-mono-white.svg, favicon.svg. Accent #359AE7 (Kira blue).</p>'
        await shoot(b,page('HouseTour AI · house mark v2','White on midnight, Kira-blue accent. 16 / 32px use the small optical variant; 64 / 180px use the master.',body,extra),'dark-v2-logo-sheet',1200)
        await b.close()
asyncio.run(main()); print('sheets ok')
