/* HouseTour AI waitlist form -> Kit (formerly ConvertKit).
 * Source of truth: src-v2/waitlist.js (inlined into dark-v2/index.html and launch/index.html by build.py).
 *
 * =========================== KIT CONFIG: Ohin fills these in ===========================
 * Step-by-step guide: KIT-SETUP.md. Paste values between the quotes; nothing else in this file needs editing.
 *
 * KIT_FORM_ID      The number in your Kit form's HTML embed:
 *                  Kit > Grow > Landing Pages & Forms > (your form) > Publish > HTML >
 *                  action="https://app.kit.com/forms/<THIS NUMBER>/subscriptions".
 *                  Until this is a real number the page makes NO network calls: the form only shows
 *                  the local success state and logs a console warning.
 *
 * KIT_TAG_IDS      Numeric tag IDs for the two tags 'renter' and 'landlord-operator'. Copy each from the value="..."
 *                  of its option in the same HTML embed (after adding the tag dropdown, see KIT-SETUP.md), or from the
 *                  number at the end of the tag's URL in Kit > Subscribers > (click the tag). Sent as tags[]=<id>.
 *                  Leave a TODO value to skip tagging.
 *
 * KIT_AUDIENCE_FIELD  Key of the Kit custom field that stores the choice (we suggest 'audience').
 *                  Sent as fields[audience]=renter | landlord-operator. Set to '' to skip the custom field.
 *
 * KIT_SOURCE_FIELD Key of the Kit custom field that stores which form was used (we suggest 'signup_source').
 *                  Sent as fields[signup_source]=hero (top of the page) | join (bottom of the page).
 *                  Set to '' to skip. The signup date/time is NOT sent: Kit stamps every subscriber itself.
 *
 * KIT_POST_FIELD   Key of the Kit custom field that stores which post/link brought the visitor (we suggest 'post_source').
 *                  Read from ?src= in the page URL (e.g. aihousetour.com/?src=renter-reel), sanitised to lowercase
 *                  a-z, 0-9 and hyphens (max 40 chars), kept in sessionStorage for the visit.
 *                  Sent as fields[post_source]=<src> | direct (no ?src). Set to '' to skip.
 *
 * NO KEYS OF ANY KIND belong here. The public form endpoint needs no API key; never paste a Kit API secret
 * or a v4 API key (they start with kit_) into this page: anyone can read it with View Source.
 * ======================================================================================
 */
(function () {
  'use strict';

  var KIT_FORM_ID = '10031788';               // Kit form (Ohin, Oct 11, 2026)
  var KIT_TAG_IDS = {
    renter: 'TODO_RENTER_TAG_ID',             // TODO(kit): numeric tag ID of the 'renter' tag, e.g. '5551234'
    landlord_operator: 'TODO_LANDLORD_TAG_ID' // TODO(kit): numeric tag ID of the 'landlord-operator' tag
  };
  var KIT_AUDIENCE_FIELD = 'audience';        // TODO(kit): must match the custom field key in Kit exactly ('' = don't send)
  var KIT_SOURCE_FIELD = 'signup_source';     // TODO(kit): must match the custom field key in Kit exactly ('' = don't send)
  var KIT_POST_FIELD = 'post_source';         // TODO(kit): must match the custom field key in Kit exactly ('' = don't send)
  /* ==================================== end of config ==================================== */

  var KIT_ENDPOINT = 'https://app.kit.com/forms/' + encodeURIComponent(KIT_FORM_ID) + '/subscriptions';
  var KIT_READY = /^\d+$/.test(String(KIT_FORM_ID));
  var AUDIENCE_VALUE = { renter: 'renter', landlord_operator: 'landlord-operator' };
  var SOURCE_VALUE = { hero: 'hero', join: 'join' }; // from data-source on each form wrapper (form.html)
  var EMAIL_RE = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)*\.[A-Za-z]{2,}$/;
  var warned = false;

  // Post-level source: ?src=renter-reel -> 'renter-reel'. Sanitised, persisted for the session, 'direct' if absent.
  var POST_SOURCE_KEY = 'htai_post_source';
  function cleanSrc(v) {
    return String(v || '').toLowerCase().replace(/[^a-z0-9-]/g, '').slice(0, 40);
  }
  function getPostSource() {
    var fromUrl = '';
    try { fromUrl = cleanSrc(new URLSearchParams(window.location.search).get('src')); } catch (e) {}
    try {
      if (fromUrl) { window.sessionStorage.setItem(POST_SOURCE_KEY, fromUrl); return fromUrl; }
      var saved = cleanSrc(window.sessionStorage.getItem(POST_SOURCE_KEY));
      if (saved) return saved;
    } catch (e) { if (fromUrl) return fromUrl; }
    return 'direct';
  }
  var POST_SOURCE = getPostSource();

  // Sent: email address, renter / landlord-operator choice, which form was used (hero / join),
  // and which post/link brought the visitor (?src=..., or 'direct').
  // This matches the privacy page; the signup time is recorded by Kit, not sent from here.
  function sendToKit(payload) {
    if (!KIT_READY) {
      if (!warned) {
        warned = true;
        if (window.console && console.warn) console.warn('[HouseTour AI] Kit is not configured (KIT_FORM_ID is a placeholder). ' +
          'Signup NOT sent anywhere; showing the local success state only. See KIT-SETUP.md.');
      }
      return Promise.resolve({ ok: true, local: true });
    }
    var body = new URLSearchParams();
    body.append('email_address', payload.email);
    var tag = KIT_TAG_IDS[payload.role];
    if (/^\d+$/.test(String(tag))) body.append('tags[]', String(tag));
    if (KIT_AUDIENCE_FIELD) body.append('fields[' + KIT_AUDIENCE_FIELD + ']', AUDIENCE_VALUE[payload.role] || payload.role);
    if (KIT_SOURCE_FIELD && payload.source) body.append('fields[' + KIT_SOURCE_FIELD + ']', payload.source);
    if (KIT_POST_FIELD) body.append('fields[' + KIT_POST_FIELD + ']', payload.postSource || 'direct');
    // urlencoded body + Accept header only = a CORS "simple" request; Kit answers preflights with Access-Control-Allow-Origin: *.
    return fetch(KIT_ENDPOINT, { method: 'POST', headers: { 'Accept': 'application/json' }, body: body })
      .then(function (r) {
        return r.json().catch(function () { return {}; }).then(function (data) {
          if (!r.ok) throw new Error('HTTP ' + r.status);
          // Kit's embed endpoint is expected to answer { status: 'success' } or, when its bot check
          // flags a signup, { status: 'quarantined', url } (unverified; confirm with one test signup).
          if (data && data.status === 'quarantined' && data.url) return { ok: true, confirmUrl: data.url };
          if (data && data.status && data.status !== 'success') throw new Error('Kit: ' + data.status);
          return { ok: true };
        });
      });
  }

  function setInvalid(form, on) {
    var input = form.querySelector('input[type="email"]');
    var field = input.closest('.field');
    var err = form.querySelector('.err:not(.send-err)');
    field.classList.toggle('is-invalid', on);
    input.setAttribute('aria-invalid', on ? 'true' : 'false');
    err.hidden = !on;
  }

  function setSendError(form, on) {
    var el = form.querySelector('.send-err');
    if (el) el.hidden = !on;
  }

  function showSuccess(wrap) {
    var form = wrap.querySelector('form');
    var done = wrap.querySelector('.wl-done');
    form.hidden = true;
    done.hidden = false;
    wrap.classList.add('is-done');
    done.focus({ preventScroll: true });
  }

  Array.prototype.forEach.call(document.querySelectorAll('[data-wl]'), function (wrap) {
    var form = wrap.querySelector('form');
    var input = form.querySelector('input[type="email"]');
    var btn = form.querySelector('button[type="submit"]');
    var attempted = false;

    input.addEventListener('input', function () {
      if (attempted) setInvalid(form, !EMAIL_RE.test(input.value.trim()));
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      attempted = true;
      setSendError(form, false);
      var email = input.value.trim();
      if (!EMAIL_RE.test(email)) { setInvalid(form, true); input.focus(); return; }
      setInvalid(form, false);
      var role = (form.querySelector('input[name="role"]:checked') || {}).value || 'renter';
      var source = SOURCE_VALUE[wrap.getAttribute('data-source')] || '';
      var payload = { email: email, role: role, source: source, postSource: POST_SOURCE }; // role: 'renter' | 'landlord_operator'; source: 'hero' | 'join'; postSource: ?src or 'direct'
      btn.disabled = true; wrap.setAttribute('aria-busy', 'true');
      sendToKit(payload).then(function (res) {
        if (res && res.confirmUrl) {
          // Kit flagged the signup for a quick human check: point the person to Kit's confirm page.
          var p = wrap.querySelector('.done-p');
          p.innerHTML = 'One more step: <a href="" target="_blank" rel="noopener">confirm you\'re human</a>.';
          p.querySelector('a').href = res.confirmUrl;
        }
        showSuccess(wrap);
      }).catch(function () {
        setSendError(form, true);   // network / Kit error: keep the form, let them retry
        btn.disabled = false;
      }).then(function () { wrap.removeAttribute('aria-busy'); });
    });
  });

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // 'I'm renting' choice card: make sure the renter role is selected on the waitlist form, then scroll there.
  Array.prototype.forEach.call(document.querySelectorAll('[data-role="renter"]'), function (a) {
    a.addEventListener('click', function (e) {
      var wrap = document.getElementById('wl-join');
      if (!wrap) return;
      e.preventDefault();
      var r = wrap.querySelector('input[name="role"][value="renter"]'); if (r) r.checked = true;
      wrap.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
      var target = wrap.classList.contains('is-done') ? wrap.querySelector('.wl-done') : document.getElementById('email-join');
      if (target) target.focus({ preventScroll: true });
    });
  });

  // Nav "Join" button: smooth-scroll to the waitlist form and focus its email field.
  Array.prototype.forEach.call(document.querySelectorAll('.js-join'), function (a) {
    a.addEventListener('click', function (e) {
      var wrap = document.getElementById('wl-join');
      if (!wrap) return;
      e.preventDefault();
      wrap.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
      var target = wrap.classList.contains('is-done') ? wrap.querySelector('.wl-done') : document.getElementById('email-join');
      if (target) target.focus({ preventScroll: true });
    });
  });
})();
