"""v3 renders: homepage, footer crops, privacy page, form-states sheet. Fully local (file://).
Any request that isn't file:/data: is recorded; on the dummy-Kit test copy it is aborted inside the browser (never leaves the box)."""
import asyncio, pathlib, base64, json
from playwright.async_api import async_playwright
R=pathlib.Path('/workspace/housetour-redesign'); OUT=R/'renders'/'v3'; W=R/'work'/'v3'; W.mkdir(parents=True,exist_ok=True)
HOME=(R/'dark-v2'/'index.html').as_uri(); PRIV=(R/'dark-v2'/'privacy'/'index.html').as_uri()
LHOME=(R/'launch'/'index.html').as_uri(); LPRIV=(R/'launch'/'privacy'/'index.html').as_uri()
# Test copy = the fresh dark-v2 build with dummy Kit IDs, regenerated on every run (work/ only; never shipped).
TD=R/'work'/'v3-test'; TD.mkdir(parents=True,exist_ok=True)
if not (TD/'assets').exists(): (TD/'assets').symlink_to('../../dark-v2/assets')
_t=(R/'dark-v2'/'index.html').read_text()
for a,b in [("'TODO_KIT_FORM_ID'","'9999999'"),("'TODO_RENTER_TAG_ID'","'1111111'"),("'TODO_LANDLORD_TAG_ID'","'2222222'")]:
    assert _t.count(a)==1, a; _t=_t.replace(a,b)
(TD/'index-dummy-kit.html').write_text(_t)
TEST=(TD/'index-dummy-kit.html').as_uri()
DEV={'desktop':((1440,900),1),'mobile':((390,844),2)}
log={'external_requests_real_pages':[], 'aborted_test_requests':[], 'console':[], 'pageerrors':[], 'metrics':{}}

async def newpage(b,dev,real=True):
    (w,h),dpr=DEV[dev]
    pg=await b.new_page(viewport={'width':w,'height':h},device_scale_factor=dpr)
    def onreq(r):
        if not r.url.startswith(('file:','data:')):
            (log['external_requests_real_pages'] if real else log['aborted_test_requests']).append({'url':r.url,'method':r.method,'body':r.post_data})
    pg.on('request',onreq)
    pg.on('console',lambda m: log['console'].append(f'[{dev}{"" if real else " test"}] {m.type}: {m.text}'))
    pg.on('pageerror',lambda e: log['pageerrors'].append(str(e)))
    async def route(rt):
        if rt.request.url.startswith(('file:','data:')): await rt.continue_()
        else: await rt.abort('internetdisconnected')
    await pg.route('**/*',route)
    return pg

async def load(pg,url):
    await pg.goto(url); await pg.evaluate('document.fonts.ready'); await pg.wait_for_timeout(350)

async def wl_shot(pg,path):
    # crop artefact guard: the fixed mobile nav would be painted over a full-page clip; hide it only for these crops
    await pg.add_style_tag(content='.nav{visibility:hidden!important}')
    bb=await pg.evaluate("(()=>{const r=document.querySelector('#wl-hero').getBoundingClientRect();return {x:r.x,y:r.y+scrollY,width:r.width,height:r.height}})()")
    w=pg.viewport_size['width']
    await pg.screenshot(path=str(path),full_page=True,clip={'x':max(0,bb['x']-20),'y':bb['y']-20,'width':min(w-max(0,bb['x']-20),bb['width']+40),'height':bb['height']+40})

async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch()
        for dev,((w,h),dpr) in DEV.items():
            # homepage
            pg=await newpage(b,dev); await load(pg,HOME)
            await pg.screenshot(path=str(OUT/f'home-{dev}-{w}-hero.png'))
            await pg.screenshot(path=str(OUT/f'home-{dev}-{w}-full.png'),full_page=True)
            log['metrics'][f'home-{dev}']=await pg.evaluate("""(()=>({heroFormBottom:Math.round(document.querySelector('#wl-hero').getBoundingClientRect().bottom),vh:innerHeight,
              scrollW:document.documentElement.scrollWidth,fonts:[...document.fonts].filter(f=>f.status=='loaded').map(f=>f.family),
              footLinks:[...document.querySelectorAll('.foot-links a')].map(a=>[a.textContent,a.getAttribute('href')])}))()""")
            ph=await pg.evaluate('document.documentElement.scrollHeight')
            bb=await pg.evaluate("(()=>{const r=document.querySelector('footer.foot').getBoundingClientRect();return {y:r.y+scrollY,h:r.height}})()")
            top=max(0,bb['y']-120)
            await pg.screenshot(path=str(OUT/f'footer-{dev}-{w}.png'),full_page=True,clip={'x':0,'y':top,'width':w,'height':min(ph-top,bb['h']+120)})
            # form states (real page: default, invalid, success with no network)
            await pg.evaluate("document.querySelector('#wl-hero').scrollIntoView({block:'center'})"); await pg.wait_for_timeout(150)
            await wl_shot(pg,W/f'state-{dev}-1-default.png')
            await pg.fill('#email-hero','renter@example'); await pg.click('#wl-hero button[type=submit]'); await pg.wait_for_timeout(200)
            await wl_shot(pg,W/f'state-{dev}-2-invalid.png')
            await pg.fill('#email-hero','renter@example.com'); await pg.click('#wl-hero button[type=submit]'); await pg.wait_for_timeout(300)
            await wl_shot(pg,W/f'state-{dev}-3-success.png')
            # join form too, landlord choice, still no network
            await pg.check('#wl-join input[value=landlord_operator]',force=True); await pg.fill('#email-join','owner@example.com')
            await pg.click('#wl-join button[type=submit]'); await pg.wait_for_timeout(300)
            log['metrics'][f'home-{dev}']['joinDone']=await pg.evaluate("document.querySelector('#wl-join').classList.contains('is-done')")
            await pg.close()
            # network error: dummy-ID test copy, request aborted locally
            pg=await newpage(b,dev,real=False); await load(pg,TEST)
            await pg.evaluate("document.querySelector('#wl-hero').scrollIntoView({block:'center'})")
            await pg.check('#wl-hero input[value=landlord_operator]',force=True)
            await pg.fill('#email-hero','owner@example.com'); await pg.click('#wl-hero button[type=submit]'); await pg.wait_for_timeout(600)
            await pg.evaluate("document.activeElement.blur()")
            await wl_shot(pg,W/f'state-{dev}-4-network-error.png')
            log['metrics'][f'test-{dev}']=await pg.evaluate("({sendErrVisible:!document.querySelector('#send-err-hero').hidden,btnDisabled:document.querySelector('#wl-hero button').disabled,formHidden:document.querySelector('#wl-hero form').hidden})")
            # join form on the test copy too (renter): records the aborted POST body so signup_source=join is checked
            await pg.fill('#email-join','renter@example.com'); await pg.click('#wl-join button[type=submit]'); await pg.wait_for_timeout(600)
            log['metrics'][f'test-{dev}']['joinSendErrVisible']=await pg.evaluate("!document.querySelector('#send-err-join').hidden")
            await pg.close()
            # privacy
            pg=await newpage(b,dev); await load(pg,PRIV)
            await pg.screenshot(path=str(OUT/f'privacy-{dev}-{w}-full.png'),full_page=True)
            log['metrics'][f'privacy-{dev}']=await pg.evaluate("""(()=>({scrollW:document.documentElement.scrollWidth,
              imgsOk:[...document.images].every(i=>i.complete&&i.naturalWidth>0),fonts:[...document.fonts].filter(f=>f.status=='loaded').map(f=>f.family)}))()""")
            await pg.close()
            # launch copies load cleanly too
            for u in (LHOME,LPRIV):
                pg=await newpage(b,dev); await load(pg,u); await pg.close()
        # sheet
        def uri(f): return 'data:image/png;base64,'+base64.b64encode(f.read_bytes()).decode()
        labels=[('1-default','Default'),('2-invalid','Invalid email'),('3-success',"Success"),('4-network-error','Network error')]
        cells=lambda dev: ''.join(f'<figure><figcaption>{t}</figcaption><img src="{uri(W/f"state-{dev}-{k}.png")}"></figure>' for k,t in labels)
        html=f'''<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{{font-family:Inter;src:url("{(R/'dark-v2/assets/fonts/Inter.ttf').as_uri()}")}}
@font-face{{font-family:Sora;src:url("{(R/'dark-v2/assets/fonts/Sora.ttf').as_uri()}")}}
body{{margin:0;padding:48px;background:#0B0F19;color:#F3F6FB;font-family:Inter}} h1{{font-family:Sora;font-weight:600;font-size:30px;margin:0 0 6px;letter-spacing:-.02em}}
p.s{{color:#93A0B4;margin:0 0 32px;font-size:15px}} h2{{font-family:Sora;font-weight:600;font-size:18px;margin:36px 0 14px;color:#6CC2F5}}
.d{{display:grid;grid-template-columns:1fr 1fr;gap:24px}} .m{{display:grid;grid-template-columns:repeat(4,1fr);gap:20px;align-items:start}}
figure{{margin:0;background:#04060D;border:1px solid rgba(255,255,255,.08);border-radius:16px;padding:14px}} figcaption{{font-size:13px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:#93A0B4;margin:0 0 10px}}
img{{display:block;width:100%;height:auto}}</style></head><body>
<h1>HouseTour AI · waitlist form states (v3)</h1><p class="s">Hero form. Default / invalid / success / network error ("Something went wrong. Please try again."). Network error rendered from a test copy with a dummy Kit form ID; the request was aborted inside the headless browser, nothing left the machine.</p>
<h2>Desktop 1440</h2><div class="d">{cells('desktop')}</div><h2>Mobile 390</h2><div class="m">{cells('mobile')}</div></body></html>'''
        (W/'form-states-sheet.html').write_text(html)
        pg=await b.new_page(viewport={'width':1600,'height':900},device_scale_factor=1)
        await pg.goto((W/'form-states-sheet.html').as_uri()); await pg.evaluate('document.fonts.ready'); await pg.wait_for_timeout(300)
        await pg.screenshot(path=str(OUT/'form-states-sheet.png'),full_page=True); await pg.close()
        await b.close()
    (W/'render-log.json').write_text(json.dumps(log,indent=1)); print(json.dumps(log,indent=1))
asyncio.run(main())
