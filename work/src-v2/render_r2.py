import asyncio, pathlib
from playwright.async_api import async_playwright
R=pathlib.Path('/workspace/housetour-redesign'); OUT=R/'renders'/'v2'
URL=(R/'dark-v2'/'index.html').as_uri(); external=[]
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch()
        for dev,(w,h),dpr in [('desktop',(1440,900),1),('mobile',(390,844),2)]:
            pg=await b.new_page(viewport={'width':w,'height':h},device_scale_factor=dpr)
            pg.on('request',lambda r: external.append(r.url) if not r.url.startswith(('file:','data:')) else None)
            errs=[]; pg.on('pageerror',lambda e: errs.append(str(e)))
            await pg.goto(URL); await pg.evaluate('document.fonts.ready'); await pg.wait_for_timeout(300)
            await pg.screenshot(path=str(OUT/f'dark-v2-{dev}-{w}-hero-r2.png'))
            await pg.screenshot(path=str(OUT/f'dark-v2-{dev}-{w}-full-r2.png'),full_page=True)
            m=await pg.evaluate("""(()=>{const f=document.querySelector('#wl-hero').getBoundingClientRect();
              const ms=[...document.querySelectorAll('.micro span')].map(s=>Math.round(s.getBoundingClientRect().height));
              return {heroFormBottom:Math.round(f.bottom),vh:innerHeight,microLineHeights:ms,sw:document.documentElement.scrollWidth}})()""")
            print(dev,m,errs)
            # footer crop
            await pg.evaluate("window.scrollTo(0,document.body.scrollHeight)"); await pg.wait_for_timeout(200)
            bb=await pg.locator('footer.foot').bounding_box()
            await pg.screenshot(path=str(OUT/f'dark-v2-{dev}-{w}-footer-r2.png'),clip={'x':0,'y':bb['y']-24,'width':w,'height':bb['height']+24})
            # micro crops for QA
            for fid in ('hero','join'):
                bb=await pg.evaluate(f"(()=>{{const r=document.querySelector('#wl-{fid}').getBoundingClientRect();return {{x:r.x,y:r.y+scrollY,width:r.width,height:r.height}}}})()")
                await pg.screenshot(path=str(R/'work'/'v2'/f'r2-{dev}-{fid}-form.png'),clip={'x':max(0,bb['x']-16),'y':bb['y']-10,'width':min(w,bb['width']+32),'height':bb['height']+26},full_page=True)
            await pg.close()
        await b.close()
    print('external requests:',external)
asyncio.run(main())
