/* HouseTour AI landlord waitlist (/landlords/) -> Kit (formerly ConvertKit).
 * Source of truth: src-v2/landlords.js (inlined into landlords/index.html by build.py).
 * Uses the SAME public Kit form as the homepage waitlist (waitlist.js), so landlords and renters are one list,
 * kept apart by fields[audience] (renter | landlord-operator) and, once the tag ID is filled in, the 'landlord-operator' tag.
 *
 * ========================== KIT CONFIG ==========================
 * LANDLORD_KIT_FORM_ID  Same number as KIT_FORM_ID in waitlist.js (the live homepage form). A non-numeric value
 *                       (e.g. 'TODO') turns the page local-only: no network calls, local success state + console warning.
 * LANDLORD_TAG_ID       Numeric ID of the Kit tag 'landlord-operator' (same as KIT_TAG_IDS.landlord_operator in waitlist.js).
 *                       Leave the TODO value to skip tagging.
 * Field keys must match Kit custom field keys exactly ('' = don't send):
 *   audience       -> 'landlord-operator' (same value the homepage sends for landlords)
 *   units          -> '1' | '2-5' | '6-20' | '21+' | '' (optional)
 *   signup_source  -> ?src= value, else 'landlords-page'
 *   post_source    -> ?src= value (or the one saved this visit on the homepage), else 'direct'
 * NO API KEYS here: the public form endpoint needs none.
 * ================================================================
 */
(function () {
  'use strict';

  var LANDLORD_KIT_FORM_ID = '10031788';               // same Kit form as the homepage waitlist
  var LANDLORD_TAG_ID = 'TODO_LANDLORD_TAG_ID';         // TODO(kit): numeric ID of the 'landlord-operator' tag
  var F = { audience: 'audience', units: 'units', signup_source: 'signup_source', post_source: 'post_source' };
  /* ========================== end of config ========================== */

  var KIT_ENDPOINT = 'https://app.kit.com/forms/' + encodeURIComponent(LANDLORD_KIT_FORM_ID) + '/subscriptions';
  var KIT_READY = /^\d+$/.test(String(LANDLORD_KIT_FORM_ID));
  var EMAIL_RE = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)*\.[A-Za-z]{2,}$/;
  var UNITS = { '1': 1, '2-5': 1, '6-20': 1, '21+': 1 };
  var POST_SOURCE_KEY = 'htai_post_source'; // shared with the homepage script

  function cleanSrc(v) { return String(v || '').toLowerCase().replace(/[^a-z0-9-]/g, '').slice(0, 40); }
  var urlSrc = '';
  try { urlSrc = cleanSrc(new URLSearchParams(window.location.search).get('src')); } catch (e) {}
  var postSource = urlSrc;
  try {
    if (urlSrc) window.sessionStorage.setItem(POST_SOURCE_KEY, urlSrc);
    else postSource = cleanSrc(window.sessionStorage.getItem(POST_SOURCE_KEY));
  } catch (e) {}
  postSource = postSource || 'direct';

  var wrap = document.querySelector('[data-ll]');
  if (!wrap) return;
  var form = wrap.querySelector('form');
  var input = form.querySelector('input[type="email"]');
  var btn = form.querySelector('button[type="submit"]');
  var srcInput = form.querySelector('input[name="signup_source"]');
  if (urlSrc) srcInput.value = urlSrc;

  function setInvalid(on) {
    input.closest('.field').classList.toggle('is-invalid', on);
    input.setAttribute('aria-invalid', on ? 'true' : 'false');
    form.querySelector('.err:not(.send-err)').hidden = !on;
  }

  function sendToKit(p) {
    if (!KIT_READY) {
      if (window.console && console.warn) console.warn('[HouseTour AI] Kit not configured on /landlords; signup NOT sent.', p);
      return Promise.resolve({ ok: true, local: true });
    }
    var body = new URLSearchParams();
    body.append('email_address', p.email);
    if (/^\d+$/.test(String(LANDLORD_TAG_ID))) body.append('tags[]', String(LANDLORD_TAG_ID));
    if (F.audience) body.append('fields[' + F.audience + ']', 'landlord-operator');
    if (F.units && p.units) body.append('fields[' + F.units + ']', p.units);
    if (F.signup_source) body.append('fields[' + F.signup_source + ']', p.signupSource);
    if (F.post_source) body.append('fields[' + F.post_source + ']', p.postSource);
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

  var attempted = false;
  input.addEventListener('input', function () { if (attempted) setInvalid(!EMAIL_RE.test(input.value.trim())); });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    attempted = true;
    form.querySelector('.send-err').hidden = true;
    var email = input.value.trim();
    if (!EMAIL_RE.test(email)) { setInvalid(true); input.focus(); return; }
    setInvalid(false);
    var units = form.elements.units.value;
    var payload = { email: email, units: UNITS[units] ? units : '', signupSource: srcInput.value || 'landlords-page', postSource: postSource };
    btn.disabled = true; wrap.setAttribute('aria-busy', 'true');
    sendToKit(payload).then(function (res) {
      if (res && res.confirmUrl) {
        var p = wrap.querySelector('.done-p');
        p.innerHTML = 'One more step: <a href="" target="_blank" rel="noopener">confirm you\'re human</a>.';
        p.querySelector('a').href = res.confirmUrl;
      }
      form.hidden = true;
      var done = wrap.querySelector('.wl-done');
      done.hidden = false; wrap.classList.add('is-done'); done.focus({ preventScroll: true });
    }).catch(function () {
      form.querySelector('.send-err').hidden = false; btn.disabled = false;
    }).then(function () { wrap.removeAttribute('aria-busy'); });
  });

  // "Join the landlord waitlist" buttons (hero + nav): scroll to the form and focus the email field.
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  Array.prototype.forEach.call(document.querySelectorAll('.js-ll-join, .js-join'), function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      wrap.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
      var t = wrap.classList.contains('is-done') ? wrap.querySelector('.wl-done') : input;
      t.focus({ preventScroll: true });
    });
  });
})();
