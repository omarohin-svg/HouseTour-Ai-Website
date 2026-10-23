import asyncio, pathlib, json
from playwright.async_api import async_playwright
R=pathlib.Path('/workspace/housetour-redesign'); OUT=R/'renders'/'v2'; OUT.mkdir(parents=True,exist_ok=True)
W=R/'work'/'v2'; W.mkdir(parents=True,exist_ok=True)
URL=(R/'dark-v2'/'index.html').as_uri()
external=[]
async def open_page(b,w,h,dpr):
    pg=await b.new_page(viewport={'width':w,'height':h},device_scale_factor=dpr)
    pg.on('request',lambda r: external.append(r.url) if not r.url.startswith(('file:','data:')) else None)
    errs=[]; pg.on('pageerror',lambda e: errs.append(str(e))); pg.on('console',lambda m: errs.append(m.text) if m.type=='error' else None)
    await pg.goto(URL); await pg.evaluate('document.fonts.ready'); await pg.wait_for_timeout(300)
    pg._errs=errs
    return pg
async def clip_of(pg,sel,pad=22):
    bb=await pg.locator(sel).bounding_box()
    top=10
    return {'x':max(0,bb['x']-pad),'y':max(0,bb['y']-top),'width':bb['width']+2*pad,'height':bb['height']+top+pad}
async def states(b,dev,w,h,dpr):
    names=[]
    async def fresh():
        return await open_page(b,w,h,dpr)
    # default
    pg=await fresh(); c=await clip_of(pg,'#wl-hero'); await pg.mouse.move(0,0)
    await pg.screenshot(path=str(W/f'{dev}-1-default.png'),clip=c); names.append(('Default',f'{dev}-1-default.png'))
    # focus email (keyboard): tab from radio
    await pg.focus('#email-hero'); await pg.wait_for_timeout(150)
    await pg.screenshot(path=str(W/f'{dev}-2-focus-email.png'),clip=c); names.append(('Focus · email field',f'{dev}-2-focus-email.png'))
    await pg.keyboard.press('Shift+Tab'); await pg.wait_for_timeout(150)
    await pg.screenshot(path=str(W/f'{dev}-3-focus-toggle.png'),clip=c); names.append(('Focus · role toggle (keyboard)',f'{dev}-3-focus-toggle.png'))
    await pg.keyboard.press('ArrowRight'); await pg.wait_for_timeout(150)
    await pg.screenshot(path=str(W/f'{dev}-3b-toggle-landlord.png'),clip=c); names.append(('Toggle · landlord selected (keyboard)',f'{dev}-3b-toggle-landlord.png'))
    await pg.focus('#email-hero'); await pg.keyboard.press('Tab'); await pg.wait_for_timeout(150)
    await pg.screenshot(path=str(W/f'{dev}-4-focus-button.png'),clip=c); names.append(('Focus · button (keyboard)',f'{dev}-4-focus-button.png'))
    await pg.close()
    # invalid
    pg=await fresh(); c=await clip_of(pg,'#wl-hero',28)
    await pg.focus('#email-hero'); await pg.keyboard.type('kira@home'); await pg.keyboard.press('Enter'); await pg.wait_for_timeout(200)
    c=await clip_of(pg,'#wl-hero',28)
    st=await pg.evaluate("[document.querySelector('#err-hero').hidden, document.querySelector('#email-hero').getAttribute('aria-invalid')]")
    await pg.screenshot(path=str(W/f'{dev}-5-invalid.png'),clip=c); names.append(('Invalid email (inline message)',f'{dev}-5-invalid.png'))
    await pg.close()
    # success
    pg=await fresh()
    await pg.fill('#email-hero','you@example.com'); await pg.click('#wl-hero .btn'); await pg.wait_for_timeout(250)
    c=await clip_of(pg,'#wl-hero',28)
    ok=await pg.evaluate("[document.querySelector('#wl-hero form').hidden, document.querySelector('#wl-hero .wl-done').hidden]")
    await pg.screenshot(path=str(W/f'{dev}-6-success.png'),clip=c); names.append(('Success (replaces form)',f'{dev}-6-success.png'))
    # also bottom form success + invalid check
    await pg.fill('#email-join','nope'); await pg.click('#wl-join .btn'); await pg.wait_for_timeout(150)
    joininv=await pg.evaluate("!document.querySelector('#err-join').hidden")
    print(dev,'invalid state',st,'success form hidden/done hidden',ok,'join invalid shown',joininv, 'errors',pg._errs)
    await pg.close()
    return names
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch()
        for dev,(w,h),dpr in [('desktop',(1440,900),1),('mobile',(390,844),2)]:
            pg=await open_page(b,w,h,dpr)
            await pg.screenshot(path=str(OUT/f'dark-v2-{dev}-{w}-hero.png'))
            await pg.screenshot(path=str(OUT/f'dark-v2-{dev}-{w}-full.png'),full_page=True)
            m=await pg.evaluate("(()=>{const r=document.querySelector('#wl-hero').getBoundingClientRect();return {formBottom:r.bottom, vh:innerHeight, sw:document.documentElement.scrollWidth}})()")
            print(dev,m,'errors',pg._errs); await pg.close()
        # mobile Join tap: before / after
        pg=await open_page(b,390,844,2)
        await pg.evaluate('window.scrollTo(0,1400)'); await pg.wait_for_timeout(200)
        await pg.screenshot(path=str(W/'join-1-before.png'))
        await pg.click('.js-join'); await pg.wait_for_timeout(1200)
        info=await pg.evaluate("({active:document.activeElement.id, y:scrollY})")
        print('join tap ->',info)
        await pg.screenshot(path=str(W/'join-2-after.png')); await pg.close()
        pg=await open_page(b,390,844,2)
        await pg.screenshot(path=str(W/'join-0-top.png')); await pg.close()
        sd=await states(b,'desktop',1440,900,1)
        sm=await states(b,'mobile',390,844,2)
        json.dump({'d':sd,'m':sm},open(W/'states.json','w'))
        await b.close()
    print('external requests:',external)
asyncio.run(main())
