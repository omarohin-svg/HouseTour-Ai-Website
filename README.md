# HouseTour AI website

Marketing site for **HouseTour AI** (in development, Toronto & GTA), a Charter Residential company.
Live at https://aihousetour.com via GitHub Pages.

## Layout

```
site/             <- everything that gets published
  index.html      landing page (dark-v2 redesign) incl. waitlist forms
  privacy/index.html  privacy notice for the waitlist (served at /privacy/)
  assets/         fonts, Kira image, logo marks, favicons
  CNAME           aihousetour.com (informational; the domain is set in Settings > Pages)
.github/workflows/deploy.yml   uploads ./site to GitHub Pages on every push to main
```

No build step on GitHub: `site/` is plain static HTML. The pages are generated from `src-v2/` in the design
workspace (`python3 src-v2/build.py`); if you edit `site/` by hand, port the change back to `src-v2/` too. Preview locally with
`python3 -m http.server -d site 8000` and open http://localhost:8000.

## Waitlist (Kit)

The forms post to Kit's public form endpoint (`https://app.kit.com/forms/<KIT_FORM_ID>/subscriptions`) from the browser
once `KIT_FORM_ID` is set in the KIT CONFIG block at the top of the script near the bottom of `site/index.html`
(setup steps: KIT-SETUP.md). While it is still the TODO placeholder the forms only show a local success message,
log a console warning, and send nothing. Only public values belong in the page (form ID, tag IDs, custom field key).
No API key or API secret of any kind.

## Previous version

The earlier React + Vite + TypeScript site is preserved at the git tag `legacy-react-vite`.
