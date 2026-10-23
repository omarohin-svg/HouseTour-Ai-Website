"""Regenerate launch/screens/*.png (same filenames as before) from the built launch/ pages. Local only; non-file requests are aborted and counted."""
import asyncio, pathlib
from playwright.async_api import async_playwright
R=pathlib.Path('/workspace/housetour-redesign'); L=R/'launch'; OUT=L/'screens'; ext=[]
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch()
        for dev,(w,h),dpr in [('desktop',(1440,900),1),('mobile',(390,844),2)]:
            for name,url in [('index',(L/'index.html').as_uri()),('privacy',(L/'privacy'/'index.html').as_uri())]:
                pg=await b.new_page(viewport={'width':w,'height':h},device_scale_factor=dpr)
                pg.on('request',lambda r: ext.append(r.url) if not r.url.startswith(('file:','data:')) else None)
                await pg.route('**/*',lambda rt: rt.continue_() if rt.request.url.startswith(('file:','data:')) else rt.abort())
                await pg.goto(url); await pg.evaluate('document.fonts.ready'); await pg.wait_for_timeout(300)
                await pg.screenshot(path=str(OUT/f'{name}-{dev}-{w}.png'))
                await pg.screenshot(path=str(OUT/f'{name}-{dev}-{w}-full.png'),full_page=True)
                if name=='index':
                    await pg.fill('#email-hero','renter@example.com'); await pg.click('#wl-hero button[type=submit]'); await pg.wait_for_timeout(300)
                    await pg.evaluate('window.scrollTo(0,0)'); await pg.wait_for_timeout(150)
                    await pg.screenshot(path=str(OUT/f'{name}-{dev}-{w}-after-submit.png'))
                await pg.close()
        await b.close()
    print('external requests:',ext)
asyncio.run(main())
