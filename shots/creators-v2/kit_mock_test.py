# Mocked Kit test: EVERY non-localhost request is intercepted. kit.com is fulfilled locally (never reaches Kit); anything else is aborted + reported.
from playwright.sync_api import sync_playwright
import urllib.parse, json
kit=[]; other=[]
def handler(mode):
    def h(route):
        r=route.request; u=r.url
        if u.startswith('http://localhost:8766/'): return route.continue_()
        if 'kit.com' in u:
            kit.append((r.method,u,dict(r.headers),r.post_data))
            if mode=='ok': return route.fulfill(status=200,content_type='application/json',body='{"status":"success"}')
            return route.fulfill(status=500,content_type='application/json',body='{}')
        other.append(u); return route.abort()
    return h
def fill(pg):
    pg.fill('#cr-name','Sam Sample'); pg.fill('#cr-email','sam.sample@example.com')
    pg.fill('#cr-ig','@sam.sample'); pg.fill('#cr-tt','https://www.tiktok.com/@samsample')
    for v in ('5k-20k','yes','either'): pg.click(f'.cr-form label:has(input[value="{v}"])')
    pg.fill('input[name=reel_1]','https://www.instagram.com/reel/AAA111/')
    pg.fill('input[name=reel_2]','https://www.instagram.com/reel/BBB222/')
    pg.fill('input[name=reel_3]','https://www.instagram.com/reel/CCC333/')
    pg.click('.cr-chips label:has(input[value="300-500-cad"])')
    pg.click('.q-follow .cb'); pg.click('#cr-consent + .cb')
with sync_playwright() as p:
    b=p.chromium.launch()
    # 1) full sample fill, mocked success, ?src with junk to test sanitising
    c=b.new_context(viewport={'width':390,'height':844}); c.route('**/*',handler('ok'))
    pg=c.new_page(); pg.goto('http://localhost:8766/creators/?src=IG_Story-Oct%2022!',wait_until='networkidle')
    fill(pg); pg.click('.cr-submit'); pg.wait_for_timeout(1200)
    print('thanks shown:',pg.is_visible('.wl-done'),'| form hidden:',pg.is_hidden('.cr-form'))
    m,u,h,body=kit[0]
    print('\nMOCKED REQUEST:',m,u); print('content-type:',h.get('content-type'),'| accept:',h.get('accept'))
    print('raw body:',body); print('decoded body:')
    for k,v in urllib.parse.parse_qsl(body,keep_blank_values=True): print(f'  {k} = {v!r}')
    c.close()
    # 2) no ?src -> default source; empty submit -> no request
    c=b.new_context(viewport={'width':390,'height':844}); c.route('**/*',handler('ok'))
    pg=c.new_page(); pg.goto('http://localhost:8766/creators/',wait_until='networkidle'); n=len(kit)
    pg.click('.cr-submit'); pg.wait_for_timeout(400); print('\nempty submit -> kit requests:',len(kit)-n)
    fill(pg); pg.click('.cr-submit'); pg.wait_for_timeout(1000)
    print('default source:',dict(urllib.parse.parse_qsl(kit[-1][3],keep_blank_values=True)).get('fields[signup_source]'))
    c.close()
    # 3) Kit error (mocked 500) -> error message, form stays
    c=b.new_context(viewport={'width':390,'height':844}); c.route('**/*',handler('err'))
    pg=c.new_page(); pg.goto('http://localhost:8766/creators/',wait_until='networkidle'); fill(pg); pg.click('.cr-submit'); pg.wait_for_timeout(1000)
    print('mocked 500 -> send-err visible:',pg.is_visible('.send-err'),'| button re-enabled:',pg.is_enabled('.cr-submit'),'| thanks:',pg.is_visible('.wl-done'))
    c.close(); b.close()
print('\nkit.com requests (all mocked locally):',len(kit),'| any other external requests:',other or 'none')
