# Codebase Audit Report — badhon495.github.io

> Full audit of the portfolio site (GitHub Pages / Jekyll) — vanilla HTML, CSS, JavaScript.
> Two pages: `index.html` (main portfolio) and `social.html` (social links).
> Ten JS modules, three CSS files, and supporting config files.

---

## CRITICAL Issues (functional breakage or major UX damage)

### C-2 · `mail.js` crashes if `.popup-content form` is null
**File:** `js/mail.js:6–7`

```js
const form = document.querySelector('.popup-content form');
const submitButton = form.querySelector('input[type="submit"]'); // throws TypeError if form is null
```
If the footer hasn't rendered, `form` is `null` and line 7 throws, silently killing all deferred scripts below it on the page.

**Fix:**
```js
const form = document.querySelector('.popup-content form');
if (!form) return;
const submitButton = form.querySelector('input[type="submit"]');
```

---

### C-3 · Popup animation does not replay on re-open
**File:** `css/mail.css:13, 46`

`.popup-overlay { animation: fadeIn … }` and `.popup-content { animation: slideIn … }` are permanent declarations. CSS animations fire once at first paint. Toggling `display: none ↔ flex` via JS does not restart them. After the first open-close cycle, the popup appears with no animation.

**Fix:** Remove animations from the base rules; apply via an `.is-open` class toggled by JS:
```css
/* mail.css */
.popup-overlay.is-open { display: flex; animation: fadeIn 0.3s ease-in-out; }
.popup-overlay.is-open .popup-content { animation: slideIn 0.4s ease-out; }
.popup-overlay { display: none; } /* base state */
```
```js
// mail.js — replace style.display with classList
popupOverlay.classList.add('is-open');    // open
popupOverlay.classList.remove('is-open'); // close
```

---

## HIGH Issues (significant impact on SEO, accessibility, or correctness)

---

### H-1 · No `<h1>` heading on either page — heading hierarchy broken
**Files:** `index.html:178`, `social.html:229`

The person's name is in a `<p class="name">`. All sections use `<h2>`. There is **no `<h1>` anywhere**. This violates WCAG 2.1 SC 1.3.1 and hurts SEO — search engines use H1 as the primary topic signal.

**Fix:** Change the name `<p>` to `<h1>` on both pages:
```html
<h1 class="name" id="Bio-header" style="text-align:center; font-size:2.5em; …">
    Md Sakib Sadman Badhon
</h1>
```

---

### H-2 · Hamburger button missing `aria-expanded`
**File:** `js/components.js:11`, `js/hamburger.js`

The button has `aria-label="Menu"` but never updates `aria-expanded`. Screen readers cannot tell users whether the menu is open or closed (WCAG 4.1.2).

**Fix:**
```js
// hamburger.js — toggle aria-expanded alongside .active class
hamburger.classList.toggle('active');
mobileMenu.classList.toggle('active');
hamburger.setAttribute('aria-expanded', mobileMenu.classList.contains('active'));
// Also set aria-expanded="false" in all close-menu code paths
```

---

### H-3 · Popup close button has no accessible label and is a non-interactive `<span>`
**File:** `js/components.js:45`

```html
<span class="popup-close">&times;</span>
```
The `×` is announced literally by screen readers. The `<span>` is not keyboard-focusable by default. Violates WCAG 1.1.1 and 4.1.2.

**Fix:**
```html
<button class="popup-close" aria-label="Close message form">&times;</button>
```
Update CSS selectors from `.popup-close` to `button.popup-close`.

---

### H-4 · Focus is not trapped in the popup modal
**Files:** `js/mail.js`, `css/mail.css`

When the popup opens, keyboard focus is not moved into it and Tab can reach elements behind the overlay. No focus trap, no focus-return on close. Violates WCAG 2.1.2.

**Fix:**
1. On open: `popupOverlay.querySelector('input, textarea, button').focus()`
2. Trap Tab/Shift+Tab within the popup with a `keydown` listener
3. On close: restore focus to the trigger element

---

### H-5 · Dark mode toggle permanently commented out — system preference cannot be overridden
**File:** `index.html:161`

```html
<!-- <i class="bi bi-brightness-high-fill" id="toggleDark"></i> -->
```
`dark_mode.js` reads `localStorage.getItem('theme')` but without the button, users can never write to it. Anyone with an OS light-mode preference who wants dark mode on this site has no recourse. The `#toggleDark` CSS in `stylesheet.css:35–49` is dead.

**Fix:** remove `dark_mode.js` and the associated CSS entirely.

---

### H-6 · `isMobile` flag computed once at load; IntersectionObserver rootMargin never updates on resize
**File:** `js/navbar_active.js:113`

```js
const isMobile = window.innerWidth <= 1024; // stale after first load
const headerObserver = new IntersectionObserver(…, {
    rootMargin: isMobile ? '-60px 0px -40% 0px' : '-60px 0px -50% 0px',
});
```
If the viewport is resized (e.g., browser DevTools, tablet rotation), the observer uses the wrong rootMargin forever, causing incorrect active-section highlighting.

**Fix:** Recreate the observer on resize using a debounced `ResizeObserver` or `matchMedia('(max-width: 1024px)').addEventListener('change', …)`.

---

### H-7 · `robots.txt` missing sitemap reference
**File:** `robots.txt`

The sitemap exists but is not referenced from robots.txt, reducing crawler discoverability.

**Fix:**
```
User-agent: *
Disallow:
Sitemap: https://badhon495.github.io/sitemap.xml
```

---

### H-8 · No Content Security Policy
**Files:** `index.html`, `social.html`

Neither a CSP HTTP header nor `<meta http-equiv="Content-Security-Policy">` is present. GitHub Pages doesn't support custom HTTP headers, so a meta tag is the only option.

**Fix (meta tag, add to `<head>` on both pages):**
```html
<meta http-equiv="Content-Security-Policy"
  content="default-src 'self';
           script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com;
           style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net;
           font-src 'self' https://fonts.gstatic.com https://cdn.jsdelivr.net;
           img-src 'self' data: https:;
           connect-src 'self' https://formsubmit.co https://www.google-analytics.com;">
```
Note: `unsafe-inline` is required for the existing inline `<script>` blocks (GA tag, dark mode detection).

---

### H-9 · `<table>` used for full page layout
**Files:** `index.html`, `social.html`

All page structure uses `<table class="section">` for layout. Tables announce as "table" to screen readers, creating confusing navigation. WCAG and modern HTML require tables only for tabular data.

**Fix (long-term refactor):** Replace `<table class="section">` with `<section class="section">` or `<div class="section">`. Keep the same CSS max-width/centering rules. Do incrementally, one section at a time, verifying layout at each breakpoint.

---

## MEDIUM Issues (notable quality problems)

---

### M-1 · "Google Google Cybersecurity Professional Certificate" — duplicate word
**File:** `index.html:410–411`

Should be "Google Cybersecurity Professional Certificate" (one "Google").

---

### M-2 · "Brac University" vs "BRAC University" — inconsistent capitalization
**File:** `index.html:380, 587, 760`

Official name is "BRAC University" (acronym). "Brac University" appears in multiple places.

**Fix:** Replace all instances of "Brac University" with "BRAC University".

---

### M-3 · "take some time to response" — grammar error (appears twice)
**File:** `index.html:829, 1249`

"first request might take some time to **response**" → "first request might take some time to **respond**".

---

### M-4 · Dead CSS: `#toggleDark`, `.profile-text`, `.profile-image`
**File:** `css/stylesheet.css:35–49, 338–354`

- `#toggleDark` rules: element is commented out in HTML, never rendered.
- `.profile-text` / `.profile-image` rules: no elements in `index.html` have these classes. The profile section is a single `<td>`. These rules (including responsive two-column layout) are never applied.

**Fix:** Remove these dead rule blocks. If the two-column layout is intended, also add `.profile-text` / `.profile-image` classes to the HTML elements.

---

### M-5 · `hoverZoomLink` class has no CSS rule
**Files:** `index.html:175`, `social.html:222`

Both pages apply `class="hoverZoomLink"` to the profile image but no CSS rule for this class exists anywhere. The implied hover zoom effect is missing.

**Fix (add effect):**
```css
/* stylesheet.css */
.hoverZoomLink { display: inline-block; transition: transform 0.2s ease; }
.hoverZoomLink:hover { transform: scale(1.05); }
```
Or remove the class if no effect is desired.

---

### M-6 · CAPTCHA explicitly disabled — only honeypot for spam protection
**File:** `js/components.js:49`

```html
<input type="hidden" name="_captcha" value="false">
```
The only anti-spam measure is the honeypot field. Manual spam or simple bots that parse the HTML can bypass this.

**Recommendation:** Re-enable CAPTCHA (`value="true"`) or accept and document the risk.

---

### M-7 · No skip-to-main-content link for keyboard users
**Files:** `index.html`, `social.html`

Keyboard users must Tab through the entire navbar before reaching content. Violates WCAG 2.4.1.

**Fix:** Add as the first element in `<body>`:
```html
<a href="#main-content" class="skip-link">Skip to main content</a>
```
Add `id="main-content"` to the first content section, and CSS to visually hide / show on focus:
```css
.skip-link { position: absolute; top: -100%; left: 0; }
.skip-link:focus { top: 0; z-index: 9999; }
```

---

### M-8 · Form submission has no loading state; popup stays open after success
**File:** `js/mail.js:35–51`

No loading indicator during the async fetch. Popup stays open after success with only the disabled "Delivered" button as feedback — no visual prompt to close.

**Fix:**
1. Before fetch: `submitButton.value = 'Sending…'; submitButton.disabled = true;`
2. On success: auto-close after 1.5 s or show a clear success banner with a "Close" action.
3. On error: re-enable the button and show an error message.

---

### M-10 · `font-display: optional` may prevent web font from ever displaying
**File:** `css/stylesheet.css:57, 65, 75, 84, 92, 101, 110, 120`

`font-display: optional` abandons the font if it doesn't arrive within the browser's render window (~100 ms). On slow connections, users permanently see the fallback system font instead of Lato.

**Fix:** Change all `font-display: optional` → `font-display: swap` in every `@font-face` block. This causes a brief FOUT but ensures Lato is always displayed once loaded.

---

### M-11 · `strong` element defined twice in CSS — redundant rule
**File:** `css/stylesheet.css:214–218, 244–247`

```css
b, strong { font-size: 16px; }                            /* line 215 */
strong { font-family: …system fonts…; font-size: 16px; }  /* line 245 */
```
The second block repeats `font-size` and only adds `font-family`.

**Fix:** Merge into one rule:
```css
b, strong {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    font-size: 16px;
}
```

---

### M-12 · Schema.org `url` field inconsistent with canonical URL
**File:** `index.html:128`

- Schema: `"url": "https://badhon495.github.io"` (no trailing slash)
- Canonical: `https://badhon495.github.io/` (trailing slash)

**Fix:** `"url": "https://badhon495.github.io/"`

---

### M-13 · `og:locale` and `twitter:creator` missing
**Files:** `index.html`, `social.html`

**Fix:**
```html
<meta property="og:locale" content="en_US">
<meta name="twitter:creator" content="@badhon495">
```

---

### M-14 · Stray `<p>` before `<ul>` — invalid HTML (auto-closed by browser)
**File:** `index.html:215, 373, 612, 1061, 1082, 1214`

```html
<p style="text-align: justify;">
<ul>…</ul>
```
An open `<p>` before a block-level `<ul>` is auto-closed by the browser, producing an empty `<p>` with unwanted margins. The `<p>` tag has no content and serves no purpose.

**Fix:** Remove the orphaned `<p>` opener before each `<ul>` in these sections. If justify alignment on the list is desired, add `style="text-align: justify;"` directly on the `<ul>` or a wrapping `<div>`.

---

### M-15 · Hardcoded stale fallback date in footer component
**File:** `js/components.js:77`

```html
<span id="lastModified">Last Modified: November 19, 2025 at 06:54 PM</span>
```
For users with JS disabled, this shows a date over 6 months out of date. `last_modified.js` updates it when JS runs, but the fallback is never updated.

**Fix:** Update the hardcoded date on each deploy, or use a build-time substitution. The current date as of this audit is May 23, 2026.

---

### M-16 · `Responsibilities :` — space before colon, inconsistent punctuation
**File:** `index.html:335 vs 222`

Line 335: `<b>Responsibilities</b> :` · Line 222: `<b>Responsibilities</b>:`

**Fix:** Standardize to no space before colon throughout.

---

## LOW Issues (minor polish)

---

### L-1 · Alt text capitalization inconsistency between pages
- `index.html:174`: `alt="Profile photo of …"` (capital P)
- `social.html:223`: `alt="profile photo of …"` (lowercase p)

**Fix:** Use capital P consistently on both pages.

---

### L-2 · Commented-out dark mode toggle is dead HTML
**File:** `index.html:161`

```html
<!-- <i class="bi bi-brightness-high-fill" id="toggleDark"></i> -->
```
Either restore it (see H-5) or delete this line.

---

### L-3 · `#anonymousMessageLink` referenced in `mail.js` but no element has this ID
**File:** `js/mail.js:4, 10`

```js
const anonymousMessageLink = document.querySelector('#anonymousMessageLink');
if (anonymousMessageLink) { … } // null-guarded so no crash, but dead code
```
No element with `id="anonymousMessageLink"` exists anywhere on either page. This handler can never execute.

**Fix:** Remove the `anonymousMessageLink` variable and its event handler block.

---

### L-4 · Bootstrap Icons CDN loaded without Subresource Integrity (SRI)
**Files:** `index.html:89–90`, `social.html:56–57`

No `integrity` attribute means if the CDN is compromised, a malicious stylesheet could be injected.

**Fix:** Add the SRI hash (obtain from [jsdelivr SRI](https://www.jsdelivr.com/package/npm/bootstrap-icons) for version 1.11.3):
```html
<link rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css"
  integrity="sha384-…verified-hash…"
  crossorigin="anonymous" …>
```

---

### L-5 · Only Lato Regular (400) weight preloaded — Bold (700) not preloaded
**File:** `index.html:48–49`

Bold text is used throughout but only the regular weight woff2 is in the preload hint.

**Fix:** Add a second preload:
```html
<link rel="preload"
  href="https://fonts.gstatic.com/s/lato/v15/S6u9w4BMUTPHh6UVSwiPGQ3q5d0.woff2"
  as="font" type="font/woff2" crossorigin>
```

---

### L-6 · `site.webmanifest` missing `start_url` and `description`
**File:** `site.webmanifest`

**Fix:**
```json
{
  "name": "Md Sakib Sadman Badhon",
  "short_name": "Badhon",
  "description": "Portfolio of Md Sakib Sadman Badhon — CS graduate, Software Engineer, and open-source contributor.",
  "start_url": "/",
  "scope": "/",
  "icons": […],
  "theme_color": "#8dd3e3",
  "background_color": "#ffffff",
  "display": "standalone"
}
```

---

### L-7 · Sitemap includes 18 stale sub-pages from `leetjourney/` with 2024 dates
**File:** `sitemap.xml:39–117`

Eighteen URLs point to deep `leetjourney/` pages with `lastmod: 2024-09-02`. Including stale, low-priority sub-pages dilutes the sitemap and may signal low content quality to crawlers.

**Recommendation:** Keep only the top-level `leetjourney/` URL; remove the deep `Leetcode/Algorithms/*.html`, `Database/*`, and `beecrowd/` sub-paths.

---

### L-8 · `smooth_scroll.js` uses `history.pushState`; `bio_scroll.js` uses direct hash assignment — inconsistent
**Files:** `js/smooth_scroll.js:23`, `js/bio_scroll.js:14`

`smooth_scroll.js` calls `history.pushState(…)` (adds a history entry). `bio_scroll.js` assigns `window.location.hash` (also adds an entry but differently). Clicking Bio vs. other sections produces slightly different back-button behavior.

**Fix:** Standardize both to `history.pushState(null, '', '#' + targetId)`.

---

## PERFORMANCE PRIORITIES (ranked by estimated impact)

| # | Issue | Est. Impact |
|---|---|---|
| 3 | Preload Lato Bold 700 weight (L-5) | Reduces FOUT for bold text |
| 4 | Fix popup animation to replay on re-open (C-3) | Removes janky no-animation on 2nd+ open |
| 5 | Remove dead CSS (~25 lines) (M-4) | Minor stylesheet size reduction |

---

## SEO PRIORITIES (ranked by impact)

| # | Issue | Impact |
|---|---|---|
| 1 | Add `<h1>` heading (H-1) | High — primary page topic signal |
| 2 | Add sitemap URL to robots.txt (H-7) | High — crawler discoverability |
| 3 | Fix Schema.org URL consistency (M-12) | Medium |
| 4 | Add `og:locale` (M-13) | Low-Medium |
| 5 | Fix content typos — "Google Google", "BRAC/Brac" (M-1, M-2) | Low-Medium — content credibility |

---

## FINAL SUMMARY

### Immediate Fixes Required
| Issue | File | Change |
|---|---|---|
| C-1 | `js/components.js:30–35` | Add Experience, Education, Project to mobile menu |
| C-2 | `js/mail.js:6–7` | Guard against null `form` before `.querySelector` |
| C-3 | `css/mail.css:13,46` + `js/mail.js` | Fix popup animation via `.is-open` class toggle |
| H-1 | `index.html:178`, `social.html:229` | Change name `<p>` to `<h1>` |
| H-2 | `js/hamburger.js` | Add `aria-expanded` toggle to hamburger button |
| H-3 | `js/components.js:45` | Change `<span class="popup-close">` to `<button>` with `aria-label` |
| M-1 | `index.html:410` | Remove duplicate "Google " from cert name |
| M-3 | `index.html:829, 1249` | "to response" → "to respond" |

### Recommended Optimizations (1–2 hours)
- H-5: Restore dark mode toggle button or remove dead JS/CSS
- H-7: Add sitemap URL to robots.txt (30 seconds)
- M-2: Standardize "BRAC University" casing (find-replace)
- M-4: Remove dead CSS blocks from stylesheet.css
- M-5: Add `.hoverZoomLink` hover CSS or remove the class
- M-7: Add skip-to-main-content link
- M-9: Add Google Analytics preconnect hints
- M-10: Change `font-display: optional` → `swap`
- M-14: Remove stray `<p>` before `<ul>` elements
- L-3: Remove dead `#anonymousMessageLink` code from `mail.js`

### Long-Term Improvements
- H-4: Implement focus trap in popup modal
- H-8: Add Content Security Policy meta tag
- H-9: Replace `<table>` layout with semantic `<section>`/`<main>` elements
- H-6: Fix `isMobile` IntersectionObserver to recompute on resize
- M-8: Add loading state and auto-close to anonymous message form
- L-7: Trim sitemap to actively maintained pages only

### Potential Risks Before Applying Changes
- **C-3 (animation fix):** Changing from `display` style to class toggling requires coordinating changes in `mail.css` and `mail.js`. Test that z-index and overlay behavior are preserved.
- **H-1 (h1 element):** Browser default H1 styles (margin, weight) may visually affect layout. Check at mobile and desktop breakpoints after changing.
- **H-9 (table → semantic HTML):** Large structural refactor. Do it one section at a time and verify layout at all breakpoints before shipping.
- **M-10 (font-display: swap):** Introduces FOUT. Test on throttled connections to confirm the fallback system font doesn't cause visible layout shift (CLS regression).
- **M-14 (remove stray `<p>` tags):** Browsers auto-close these and the rendered layout may already assume the empty `<p>` margins. Removing them could slightly change section spacing — visually check each section after the change.
