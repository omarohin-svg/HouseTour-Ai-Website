/* HouseTour AI creators application form -> Kit (formerly ConvertKit).
 * Source of truth: src-v2/creators.js (inlined into dark-v2/creators/index.html and launch/creators/index.html by build.py).
 * Same pattern as the live homepage/landlords forms (src-v2/waitlist.js, src-v2/landlords.js): our own HTML form,
 * public Kit form endpoint, urlencoded POST via fetch, no API key, no Kit embed/template/JS.
 *
 * ============================== KIT CONFIG ==============================
 * CREATOR_KIT_FORM_ID  Kit form 'Creator applications' (data-uid b44b82541e):
 *                      POST https://app.kit.com/forms/10084828/subscriptions
 *                      No tag is sent from the page (none configured for this form).
 *
 * CREATOR_FIELDS       Kit custom field keys (Kit > Subscribers > Custom fields). Each key must match EXACTLY.
 *                      Set a value to '' to stop sending that answer.
 *
 * Sent: email_address, fields[first_name] (Kit standard field = the Name entered), and the answers below as fields[...].
 * ?src= in the page URL (e.g. /creators/?src=story-1) is sanitised to a-z, 0-9, hyphens (max 40 chars)
 * and sent as fields[signup_source]; with no ?src it is 'creators-page'.
 *
 * NO KEYS OF ANY KIND belong here: never paste a Kit API secret or v4 key (kit_...) into this page.
 * =========================================================================
 */
(function () {
  'use strict';

  var CREATOR_KIT_FORM_ID = '10084828'; // Kit form 'Creator applications' (data-uid b44b82541e)
  var CREATOR_FIELDS = {
    instagram: 'instagram',           // Instagram handle, without the @
    tiktok: 'tiktok',                 // TikTok handle, without the @ ('' if left blank)
    follower_range: 'follower_range', // under-5k | 5k-20k | 20k-50k | 50k-plus
    toronto_based: 'toronto_based',   // yes | no
    story_side: 'story_side',         // renter | landlord | either
    reel_links: 'reel_links',         // the 1-3 Reel links joined into one value with ' | '
    rate_cad: 'rate_cad',             // required rate-per-Reel range: under-150-cad | 150-300-cad | 300-500-cad | 500-plus-cad
    follows_ig: 'follows_ig',         // yes | no (optional checkbox, not a gate)
    signup_source: 'signup_source'    // ?src value, or 'creators-page'
  };
  /* ================================= end of config ================================= */

  var DEFAULT_SOURCE = 'creators-page';
  var KIT_ENDPOINT = 'https://app.kit.com/forms/' + encodeURIComponent(CREATOR_KIT_FORM_ID) + '/subscriptions';
  var KIT_READY = /^\d+$/.test(String(CREATOR_KIT_FORM_ID));
  var EMAIL_RE = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)*\.[A-Za-z]{2,}$/;
  var HANDLE_RE = /^[A-Za-z0-9._]{1,30}$/;

  function cleanSrc(v) { return String(v || '').toLowerCase().replace(/[^a-z0-9-]/g, '').slice(0, 40); }
  function cleanHandle(v) {
    v = String(v || '').trim().replace(/^@+/, '');
    var m = v.match(/(?:instagram\.com|tiktok\.com)\/@?([A-Za-z0-9._]+)/i); // accept a pasted profile URL
    return m ? m[1] : v;
  }
  function isUrl(v) {
    try { var u = new URL(v); return (u.protocol === 'https:' || u.protocol === 'http:') && /\./.test(u.hostname); }
    catch (e) { return false; }
  }

  var wrap = document.querySelector('[data-cr]');
  if (!wrap) return;
  var form = wrap.querySelector('form');
  var btn = form.querySelector('button[type="submit"]');
  var srcInput = form.querySelector('input[name="signup_source"]');
  try { var s = cleanSrc(new URLSearchParams(window.location.search).get('src')); if (s) srcInput.value = s; } catch (e) {}

  function val(name) { var el = form.elements[name]; return el ? String(el.value || '').trim() : ''; }
  function radio(name) { var el = form.querySelector('input[name="' + name + '"]:checked'); return el ? el.value : ''; }
  function reelLinks() { return ['reel_1', 'reel_2', 'reel_3'].map(val).filter(Boolean); }

  // Each check returns true when valid.
  var checks = {
    name: function () { return val('name').length > 0; },
    email: function () { return EMAIL_RE.test(val('email')); },
    instagram: function () { return HANDLE_RE.test(cleanHandle(val('instagram'))); },
    follower_range: function () { return !!radio('follower_range'); },
    toronto_based: function () { return !!radio('toronto_based'); },
    story_side: function () { return !!radio('story_side'); },
    reel_links: function () { var l = reelLinks(); return l.length > 0 && l.every(isUrl); },
    rate_cad: function () { return !!radio('rate_cad'); },
    consent: function () { return form.elements.consent.checked; }
  };

  function mark(key, ok) {
    var q = form.querySelector('[data-q="' + key + '"]');
    if (!q) return;
    q.classList.toggle('is-invalid', !ok);
    var field = q.querySelector('.field');
    if (field && key !== 'reel_links') field.classList.toggle('is-invalid', !ok);
    if (key === 'reel_links') {
      Array.prototype.forEach.call(q.querySelectorAll('input'), function (i) {
        var bad = !ok && (i.value.trim() ? !isUrl(i.value.trim()) : reelLinks().length === 0 && i.name === 'reel_1');
        i.closest('.field').classList.toggle('is-invalid', bad);
        i.setAttribute('aria-invalid', bad ? 'true' : 'false');
      });
    } else {
      Array.prototype.forEach.call(q.querySelectorAll('input'), function (i) { i.setAttribute('aria-invalid', ok ? 'false' : 'true'); });
    }
    var err = q.querySelector('.err');
    if (err) err.hidden = ok;
  }

  var attempted = false;
  function validate() {
    var firstBad = null;
    Object.keys(checks).forEach(function (k) {
      var ok = checks[k](); mark(k, ok);
      if (!ok && !firstBad) firstBad = k;
    });
    return firstBad;
  }
  form.addEventListener('input', function () { if (attempted) validate(); });
  form.addEventListener('change', function () { if (attempted) validate(); });

  function sendToKit(p) {
    if (!KIT_READY) {
      if (window.console && console.warn) console.warn('[HouseTour AI] Creator Kit form not configured (CREATOR_KIT_FORM_ID is a placeholder). ' +
        'Application NOT sent anywhere; showing the local thank-you state only.', p);
      return Promise.resolve({ ok: true, local: true });
    }
    var body = new URLSearchParams();
    body.append('email_address', p.email);
    body.append('fields[first_name]', p.name);
    Object.keys(CREATOR_FIELDS).forEach(function (k) {
      if (CREATOR_FIELDS[k]) body.append('fields[' + CREATOR_FIELDS[k] + ']', p[k] || '');
    });
    return fetch(KIT_ENDPOINT, { method: 'POST', headers: { 'Accept': 'application/json' }, body: body })
      .then(function (r) {
        return r.json().catch(function () { return {}; }).then(function (data) {
          if (!r.ok) throw new Error('HTTP ' + r.status);
          if (data && data.status === 'quarantined' && data.url) return { ok: true, confirmUrl: data.url };
          if (data && data.status && data.status !== 'success') throw new Error('Kit: ' + data.status);
          return { ok: true };
        });
      });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    attempted = true;
    form.querySelector('.send-err').hidden = true;
    var bad = validate();
    if (bad) {
      var q = form.querySelector('[data-q="' + bad + '"]');
      var target = q && q.querySelector('input');
      if (q) q.scrollIntoView({ behavior: 'smooth', block: 'center' });
      if (target) target.focus({ preventScroll: true });
      return;
    }
    var payload = {
      name: val('name'),
      email: val('email'),
      instagram: cleanHandle(val('instagram')),
      tiktok: cleanHandle(val('tiktok')),
      follower_range: radio('follower_range'),
      toronto_based: radio('toronto_based'),
      story_side: radio('story_side'),
      reel_links: reelLinks().join(' | '),
      rate_cad: radio('rate_cad'),
      follows_ig: form.elements.follows_ig.checked ? 'yes' : 'no',
      signup_source: srcInput.value || DEFAULT_SOURCE
    };
    btn.disabled = true; wrap.setAttribute('aria-busy', 'true');
    sendToKit(payload).then(function (res) {
      if (res && res.confirmUrl) {
        var p = wrap.querySelector('.done-p');
        p.innerHTML = 'One more step: <a href="" target="_blank" rel="noopener">confirm you\'re human</a>.';
        p.querySelector('a').href = res.confirmUrl;
      }
      form.hidden = true;
      var done = wrap.querySelector('.wl-done');
      done.hidden = false; wrap.classList.add('is-done');
      wrap.scrollIntoView({ behavior: 'smooth', block: 'center' });
      done.focus({ preventScroll: true });
    }).catch(function () {
      form.querySelector('.send-err').hidden = false;
      btn.disabled = false;
    }).then(function () { wrap.removeAttribute('aria-busy'); });
  });
})();
