# Preview screenshots of the local /creators/ build (work/launch served on :8766).
# Every kit.com request is ABORTED; no form is filled or submitted. CREATOR_KIT_FORM_ID is unset, so the page makes no network calls.
from playwright.sync_api import sync_playwright
out='/workspace/creators-v2/shots/creators-v2/'
U='http://localhost:8766/creators/'
ext=[]
with sync_playwright() as p:
    b=p.chromium.launch()
    for f,vp,dpr in (('creators-mobile-390-full.png',{'width':390,'height':844},2),
                     ('creators-390.png',{'width':390,'height':844},1),
                     ('creators-desktop-1440-full.png',{'width':1440,'height':900},1)):
        c=b.new_context(viewport=vp,device_scale_factor=dpr); c.route('**/*kit.com/**',lambda r:(ext.append(r.request.url),r.abort()))
        pg=c.new_page(); pg.on('request',lambda r: None if r.url.startswith('http://localhost:8766') or r.url.startswith('data:') else ext.append(r.url))
        pg.goto(U,wait_until='networkidle'); pg.evaluate('document.fonts.ready'); pg.wait_for_timeout(600)
        assert pg.evaluate('document.documentElement.scrollWidth')==vp['width'], 'horizontal overflow'
        pg.screenshot(path=out+f,full_page=True); print(f, vp['width'],'x',pg.evaluate('document.documentElement.scrollHeight'),'@',dpr,'x')
        c.close()
    b.close()
print('external requests:', ext or 'none')
