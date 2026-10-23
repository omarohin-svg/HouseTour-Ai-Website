import asyncio, pathlib, base64
B=pathlib.Path('/workspace/housetour-redesign/brand')
def uri(n): return 'data:image/svg+xml;base64,'+base64.b64encode((B/n).read_bytes()).decode()
from playwright.async_api import async_playwright
async def shot(b, svg, size, out, bg=None):
    pg=await b.new_page(viewport={'width':size,'height':size},device_scale_factor=1)
    html=f'<html><body style="margin:0;background:{bg or "transparent"}"><img src="{uri(svg)}" style="display:block;width:{size}px;height:{size}px"></body></html>'
    await pg.set_content(html); await pg.wait_for_timeout(100)
    await pg.screenshot(path=str(out), omit_background=bg is None, clip={'x':0,'y':0,'width':size,'height':size}); await pg.close()
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch()
        await shot(b,'favicon.svg',32,B/'favicon-32.png')
        await shot(b,'favicon.svg',16,B/'favicon-16.png')
        # apple touch icon: full-bleed square (iOS applies its own mask)
        pg=await b.new_page(viewport={'width':180,'height':180})
        svg=uri('housetour-mark.svg')
        await pg.set_content(f'<html><body style="margin:0;background:#04060D"><div style="width:180px;height:180px;display:grid;place-items:center;background:radial-gradient(circle at 50% 60%,rgba(53,154,231,.22),rgba(53,154,231,0) 65%),#04060D"><img src="{svg}" style="width:124px;height:124px;margin-top:-4px"></div></body></html>')
        await pg.wait_for_timeout(100); await pg.screenshot(path=str(B/'apple-touch-icon-180.png')); await pg.close()
        for s in (16,32):
            await shot(b,'housetour-mark-small.svg',s,B/f'housetour-mark-{s}.png')
        for s in (64,180,512):
            await shot(b,'housetour-mark.svg',s,B/f'housetour-mark-{s}.png')
        await b.close()
asyncio.run(main())
print('ok')
