"""Build the HouseTour AI site from src-v2 (single source of truth).

Outputs (identical pages in both targets):
  dark-v2/index.html          dark-v2/privacy/index.html   dark-v2/landlords/index.html   dark-v2/creators/index.html
  launch/index.html           launch/privacy/index.html    launch/landlords/index.html    launch/creators/index.html
and syncs dark-v2/assets/ -> launch/assets/ (dark-v2/assets is the asset master).
launch/ also holds hand-maintained files (CNAME, LAUNCH-README.md, _deploy/, screens/) that this script never touches.
"""
import pathlib, shutil, filecmp
S = pathlib.Path(__file__).parent; R = S.parent
TARGETS = [R/'dark-v2', R/'launch']

css = (S/'base.css').read_text()+'\n/* theme */\n'+(S/'dark.css').read_text()+'\n'+(S/'v2.css').read_text()+'\n'+(S/'v3.css').read_text()
form = (S/'form.html').read_text()
nav = (S/'nav.html').read_text().rstrip('\n')
foot = (S/'footer.html').read_text().rstrip('\n')

def fill(s, **kv):
    for k, v in kv.items(): s = s.replace('{{%s}}' % k, v)
    assert '{{' not in s, s[s.index('{{'):s.index('{{')+40]
    return s

# homepage: lives at the site root
home = (S/'template.html').read_text()
home = home.replace('{{NAV}}', nav).replace('{{FOOTER}}', foot)
home = fill(home, CSS=css, THEME='dark',
            FORM_JOIN=form.replace('{{ID}}','join'),
            JS=(S/'waitlist.js').read_text(),
            BASE='', HOME='', TOP='#top', PRIVACY='privacy/', PRIVACY_CURRENT='', JOIN='#join', LL_CURRENT='')

# privacy: lives at /privacy/ -> everything one level up
pcss = (css+'\n'+(S/'privacy.css').read_text()).replace('url("assets/', 'url("../assets/')
priv = (S/'privacy.html').read_text().replace('{{NAV}}', nav).replace('{{FOOTER}}', foot)
priv = fill(priv, CSS=pcss, THEME='dark', BASE='../', HOME='../', TOP='../', PRIVACY='./', PRIVACY_CURRENT=' aria-current="page"', JOIN='../#join', LL_CURRENT='')

# shared SVG icon sprite (from the homepage template), reused by /landlords/ and /creators/
tpl = (S/'template.html').read_text()
sprite = tpl[tpl.index('<svg width="0" height="0"'):tpl.index('</svg>', tpl.index('<svg width="0" height="0"'))+len('</svg>')]

# landlords: lives at /landlords/ -> everything one level up; nav "Join" goes to the landlord waitlist on the same page
lcss = (css+'\n'+(S/'landlords.css').read_text()).replace('url("assets/', 'url("../assets/')
lan = (S/'landlords.html').read_text().replace('{{NAV}}', nav).replace('{{FOOTER}}', foot).replace('{{SPRITE}}', sprite)
lan = fill(lan, CSS=lcss, THEME='dark', JS=(S/'landlords.js').read_text(),
           BASE='../', HOME='../', TOP='../', PRIVACY='../privacy/', PRIVACY_CURRENT='', JOIN='#wl-landlord', LL_CURRENT=' aria-current="page"')

# creators (PREVIEW, not published): lives at /creators/ -> everything one level up;
# styled with the live shared CSS + landlords.css (hero, Kira, chips, join panel) + a thin creators.css layer
ccss = (css+'\n'+(S/'landlords.css').read_text()+'\n'+(S/'creators.css').read_text()).replace('url("assets/', 'url("../assets/')
cre = (S/'creators.html').read_text().replace('{{NAV}}', nav).replace('{{FOOTER}}', foot).replace('{{SPRITE}}', sprite)
cre = fill(cre, CSS=ccss, THEME='dark', JS=(S/'creators.js').read_text(),
           BASE='../', HOME='../', TOP='../', PRIVACY='../privacy/', PRIVACY_CURRENT='', JOIN='../#join', LL_CURRENT='')

for t in TARGETS:
    (t/'privacy').mkdir(parents=True, exist_ok=True)
    (t/'landlords').mkdir(parents=True, exist_ok=True)
    (t/'creators').mkdir(parents=True, exist_ok=True)
    (t/'creators'/'index.html').write_text(cre)
    (t/'landlords'/'index.html').write_text(lan)
    (t/'index.html').write_text(home)
    (t/'privacy'/'index.html').write_text(priv)
    print('built', t.name+'/index.html', t.name+'/privacy/index.html', t.name+'/landlords/index.html', t.name+'/creators/index.html')

# assets: dark-v2 is the master copy
src, dst = R/'dark-v2'/'assets', R/'launch'/'assets'
for f in src.rglob('*'):
    if f.is_file():
        d = dst/f.relative_to(src); d.parent.mkdir(parents=True, exist_ok=True)
        if not d.exists() or not filecmp.cmp(f, d, shallow=False): shutil.copy2(f, d); print('synced', d.relative_to(R))
