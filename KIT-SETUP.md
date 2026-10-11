# Kit setup for the HouseTour AI waitlist (for Ohin)

**What this does:** connects the two "Join the waitlist" forms on aihousetour.com (the one at the top of the page and the one at the bottom) to your Kit account, so every signup lands in Kit.
**Time:** about 20–30 minutes. **You need:** a Kit account (the free Newsletter plan is enough) and this project folder.
**Nothing here needs an API key.** If any screen offers you an "API key" or "API secret", ignore it. Never paste one into the website files: anyone can read them.

Until you finish step 6, the website forms are "local only": they show "You're on the list." but **send nothing anywhere**.

---

## What the website sends to Kit

Each signup sends exactly this (and nothing else):

| What | Sent as | Possible values | You create in Kit |
|---|---|---|---|
| Email address | `email_address` | what the person typed | nothing (built in) |
| Renter or landlord/operator (as a custom field) | `fields[audience]` | `renter` or `landlord-operator` | custom field **`audience`** |
| Which form they used | `fields[signup_source]` | `hero` (top of the page) or `join` (bottom of the page) | custom field **`signup_source`** |
| Renter or landlord/operator (as a tag) | `tags[]` | the tag **ID number** of one of the two tags | tags **`renter`** and **`landlord-operator`** |

**Signup date and time:** you don't need to set anything up. Kit records it on every subscriber automatically (it's the "Created date and time" column when you export subscribers). The website does not send a time.

The renter/landlord choice is stored twice on purpose: the **tag** is the easiest way to email only renters or only landlords later. The **custom field** shows the choice as text on each subscriber and in exports. If you only want one, see "Optional" at the end.

---

## Step 1: Create the form

1. Log in to Kit.
2. Go to **Grow → Landing Pages & Forms**.
3. Click **Create new** → **Form** → **Inline** → pick any template (the design doesn't matter, our website uses its own form).
4. Name it **HouseTour AI waitlist** (top left).
5. Click **Save**.

## Step 2: Create the two custom fields (exact names matter)

Kit turns the name you type into a "key" (lowercase, spaces become underscores). The website sends the keys `audience` and `signup_source`, so type the names **exactly like this, all lowercase**:

- `audience`
- `signup_source`

How (inside the form builder from step 1):

1. Click the **+** under the last field on the form.
2. Click the new field. In the right-hand sidebar, set **Save as → Custom field**.
3. In the **Custom field** box, type `audience` and choose the option to create it.
4. Leave **Required** **unchecked**.
5. Repeat 1–4 for `signup_source`.
6. Click **Save**.

These fields will never show on the website (our page sends the values itself). Adding them to this Kit form is so the HTML in step 5 shows their exact names, which you can check.

## Step 3: Create the two tags (exact names)

Still in the form builder:

1. Click **+** again, click the new field, set **Save as → Tag** and choose **Dropdown**.
2. Label: `I am a`.
3. Under the tag options, create two tags, spelled exactly:
   - `renter`
   - `landlord-operator`
4. Click **Save**.

## Step 4: Decide on double opt-in (recommended: ON)

Double opt-in means Kit emails each new signup a "Confirm your subscription" button, and they're only added to your list once they click it.

**Our recommendation: turn it on.** Canada's anti-spam law (CASL) requires consent and proof of it; a confirmation click is strong proof, and it keeps typos and fake addresses off the list. *This is a recommendation, not legal advice.* Have someone qualified check your setup if you're unsure.

How:

1. In the form builder, click **Settings** (top toolbar) → **Confirmation Email**.
2. Keep **Send confirmation email** **checked**.
3. Keep **Auto-confirm new subscribers** **unchecked** (unchecked = double opt-in ON).
4. Optional: **After confirming, redirect to** → URL → `https://aihousetour.com/`.
5. Optional: **Edit Email Contents** to make the confirmation email sound like HouseTour AI. Keep the confirm button as it is.
6. Click **Save**, then **Publish** (top right).

Heads-up if double opt-in is ON: the website's message after signing up says "You're on the list. Follow the build @housetourai." It doesn't mention checking email. If you'd like it to say something like "Check your email to confirm", ask us to change it (it's in `src-v2/form.html`).

## Step 5: Find the form ID and the two tag IDs

1. In the form builder, click **Publish** (or **Embed**) → choose **HTML**.
2. Copy all of the HTML and paste it into a plain text editor (TextEdit / Notepad) so you can read it.
3. **Form ID:** find `action="https://app.kit.com/forms/` . The number right after it is the form ID.
   Example: `action="https://app.kit.com/forms/1234567/subscriptions"` → form ID is **1234567**.
   (It's also the number in your browser's address bar while you edit the form.)
4. **Tag IDs:** find the dropdown from step 3 in the HTML. Each choice looks like
   `<option value="5551234">renter</option>`. The number in `value="..."` is that tag's ID. Write down the number for `renter` and the number for `landlord-operator`.
5. **Check the field names:** search the HTML for `fields[`. You should see `fields[audience]` and `fields[signup_source]`. If Kit shows a different name inside the brackets, use that name in step 6 instead.

## Step 6: Paste the values into the website file

Open **`src-v2/waitlist.js`** (in this project folder) in a plain text editor. Only change what's between the quotes on these lines:

| Line | Looks like now | Change to (example) |
|---|---|---|
| **32** | `var KIT_FORM_ID = 'TODO_KIT_FORM_ID';` | `var KIT_FORM_ID = '1234567';` |
| **34** | `renter: 'TODO_RENTER_TAG_ID',` | `renter: '5551234',` |
| **35** | `landlord_operator: 'TODO_LANDLORD_TAG_ID'` | `landlord_operator: '5551235'` |
| **37** | `var KIT_AUDIENCE_FIELD = 'audience';` | leave as is (only change it if step 5 showed a different name) |
| **38** | `var KIT_SOURCE_FIELD = 'signup_source';` | leave as is (only change it if step 5 showed a different name) |

Rules: numbers only, keep the quotes, keep the commas and semicolons. Don't paste any API key anywhere.

Then rebuild the site. In a terminal, from the project folder:

```
python3 src-v2/build.py
```

It should print `built dark-v2/index.html …` and `built launch/index.html …`. That updates both copies of the page. **Never edit `dark-v2/` or `launch/` by hand.** Always edit `src-v2/` and rebuild.

## Step 7: Test checklist (after the site with your IDs is published)

Use an email you can check. Gmail "plus" addresses are handy: `you+hero@gmail.com`, `you+join@gmail.com`.

- [ ] **Top form, renter:** sign up with `you+hero@…`. The page shows "You're on the list."
- [ ] **Bottom form, landlord or operator:** sign up with `you+join@…`. The page shows "You're on the list."
- [ ] **Bad email:** type `test@example` and press Join. You should see "Please enter a valid email." and nothing is sent.
- [ ] If double opt-in is on, both confirmation emails arrive. Click **Confirm** in each.
- [ ] In Kit → **Subscribers**, open each test subscriber and check:
  - `you+hero@…`: tag **renter**, `audience` = `renter`, `signup_source` = `hero`
  - `you+join@…`: tag **landlord-operator**, `audience` = `landlord-operator`, `signup_source` = `join`
  - a signup date/time is shown
- [ ] Optional: turn on airplane mode, submit the form, and check that it says "Something went wrong. Please try again."
- [ ] Delete the test subscribers from Kit when you're done.

If a tag or field is missing on the test subscriber, recheck the spelling (step 2/3) and the numbers (step 6), rebuild, publish and try again. If the page shows "Something went wrong" with internet on, the form ID is probably wrong.

---

## Optional

- **Only want tags, not the `audience` field?** Set line 37 to `var KIT_AUDIENCE_FIELD = '';` and rebuild.
- **Only want the field, not tags?** Leave lines 34–35 as `TODO_…`. Tagging is skipped automatically.
- **Don't want signup source?** Set line 38 to `var KIT_SOURCE_FIELD = '';` and rebuild. The privacy page says we collect the signup source, so if you drop it, the privacy page should be updated too.

---

## For whoever maintains the code: what's verified and what isn't (checked Oct 7, 2026 ET)

**Verified from Kit's own docs:**
- Custom fields must exist before they can be used. Kit generates the field **key** from the label: ASCII, lowercased, underscored (developers.kit.com, v3 Custom Fields). So labels `audience` / `signup_source` give keys `audience` / `signup_source`.
- Custom fields and tag dropdowns can be added to a form in the form builder (Save as → Custom field / Tag), and you can create new ones from there (help.kit.com "How to add custom fields to Forms and Landing Pages", "Adding tag dropdowns + checkboxes to Kit forms").
- Forms have a raw **HTML** embed option (help.kit.com "Form embedding basics").
- Double opt-in: Settings → Confirmation Email. "Send confirmation email" on and "Auto-confirm new subscribers" **unchecked** = double opt-in (Kit "strongly recommends" it). The default post-confirm page is `https://app.kit.com/confirm-subscription`, and it can be replaced with your own URL (help.kit.com "The Confirmation Email").
- Signup time is recorded automatically. Subscriber exports include "Created date and time" (help.kit.com "How to export subscribers"), and the v4 API subscriber record has `created_at`.
- The v3 API "subscribe to form" call takes `fields` (custom fields) and `tags` (an array of tag IDs). This is the API, not the public form endpoint; it's shown only as supporting evidence for the parameter names.

**Verified by us earlier, not from Kit docs:**
- CORS preflight to `https://app.kit.com/forms/<id>/subscriptions` returns `access-control-allow-origin: *` (preflight only, no data sent, Oct 7).

**Not verified (no official Kit page documents the public endpoint; confirm with the step 7 test):**
- That `POST https://app.kit.com/forms/<id>/subscriptions` (urlencoded body) accepts `email_address`, `fields[<key>]` and `tags[]=<tag id>`. This matches the `action` URL and `name` attributes in Kit's HTML embeds as reproduced in third-party guides (`fields[first_name]`, `fields[<key>]` hidden inputs, `tags[]`), but Kit doesn't document it as an API.
- Whether a `fields[...]` or `tags[]` value is accepted when that field/tag isn't on the Kit form. Steps 2–3 put them on the form to avoid depending on this.
- The JSON reply (`{"status":"success"}`, or `{"status":"quarantined","url":…}` when Kit's bot check flags a signup). The page handles both, and any other status or HTTP error shows "Something went wrong. Please try again."
- Whether, with double opt-in, tags and custom fields show on the subscriber before or only after they confirm. Also whether "Created date" is the submit time or the confirm time.
- Where tag IDs appear in Kit's UI other than the HTML embed (e.g. the tag page URL).
