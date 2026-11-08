# sohamritmondal.dev — Portfolio

Personal portfolio of Soham Mondal. A static site (vanilla HTML / CSS / JS, no build step) deployed to
GitHub Pages from the root of this repository.

- Light theme by default, dark via the toggle in the nav (the choice is remembered per browser)
- No frameworks, no bundler, no dependencies to install

---

## 1. Project structure

```
.
├── index.html                  # the single page; links every CSS/JS file in a fixed order
├── assets/
│   ├── css/
│   │   ├── base/               # variables (both themes), reset, breakpoints, reduced-motion
│   │   ├── layout/             # navbar (incl. theme toggle), section headings, footer
│   │   ├── components/         # aurora background, dot grid, buttons, reveal, marquee, form …
│   │   └── sections/           # hero, about, services, resume (journey), skills, projects, contact
│   ├── js/
│   │   ├── core/
│   │   │   ├── theme-init.js   # runs in <head>; sets data-theme before first paint
│   │   │   └── utils.js        # shared flags (hover / reduced-motion); must load first in <body>
│   │   └── features/           # one self-contained file per behaviour (table below)
│   ├── images/                 # photo, project thumbnails, favicon
│   └── docs/Soham_CV.pdf
└── .github/workflows/deploy-pages.yml   # GitHub Pages deployment (optional, see §4)
```

### CSS: load order matters
Plain CSS files linked from `<head>`. The cascade depends on the `<link>` order:
`base/variables` → `base/reset` → background + navbar → section files (each followed by the components it
introduces) → `base/responsive.css` → `base/reduced-motion.css`. The last two must stay last.

All colours come from tokens in `assets/css/base/variables.css`: light is `:root`, dark is
`html[data-theme="dark"]`. Never hard-code a colour in a section file; add a token instead.

To add a section: create `assets/css/sections/<name>.css`, link it before `responsive.css`, and give its
root a `reveal` class so it animates in on scroll.

### JS: one feature per file
Every file in `assets/js/features/` is a self-contained IIFE and can be removed independently.
`core/utils.js` must stay the first script in `<body>`; `core/theme-init.js` must stay in `<head>`.

| File | Feature |
|---|---|
| `preloader.js` | fades the loader, then flags `body.is-ready`, which starts the hero entrance |
| `navigation.js` | sticky navbar, active link highlight, mobile menu |
| `theme.js` | dark / light toggle, persisted in `localStorage` |
| `scroll-progress.js` | top progress bar |
| `scroll-to-top.js` | back-to-top button |
| `typewriter.js` | rotating role text (edit the `roles` array) |
| `terminal.js` | hero terminal types its commands and prints output, then replays (edit the lines in `index.html`) |
| `reveal.js` | scroll reveal for `.reveal` elements, staggered inside grids |
| `skill-bars.js` | animates the Tech Arsenal bars |
| `counters.js` | count-up stats in About |
| `journey.js` | resume presentation mode: spine fills on scroll, current step steps forward |
| `resume-tabs.js` | Experience / Education tabs with sliding indicator and arrow-key support |
| `tilt.js` | eased 3D tilt and lift on `.tilt` cards |
| `parallax.js` | hero 3D scene follows the pointer and drifts on scroll |
| `magnetic.js` | magnetic pull on icon buttons |
| `contact-form.js` | submits the form to the two backends (see §2) |
| `footer-year.js` | current year in the footer |

### Motion rules used throughout
Transform and opacity only, strong ease-out curves (`--ease-out` in variables.css), hover effects gated to
real mice, and a reduced-motion stylesheet that keeps fades but removes movement. Keep new animation inside
those rules.

---

## 2. Contact form

The form (`<form name="Contact-form">` in `index.html`) has five fields: `NAME`, `EMAIL`, `PHONE`, `SUBJECT`,
`MESSAGE`. On submit, `assets/js/features/contact-form.js` sends the same data in **two separate requests** to
two **independent** Google Apps Script web apps. Neither knows about the other; a failure in one does not
affect the other.

```
browser ──POST──▶  sheetURL   stores one row per submission in a Google Sheet
        └─POST──▶  mailURL    e-mails the details to Soham and sends the visitor a short acknowledgement
```

- Both URLs live at the top of `contact-form.js`. Nothing else in the site refers to them.
- The "Message sent" screen follows the **sheet** request. A mail failure is only logged to the browser
  console, so a visitor is never asked to resend and the sheet never gets duplicate rows.
- Field names are uppercase and must match on all three sides: the form, the sheet's header row, and the mail
  script. Adding a field means adding it in all three places.
- The scripts contain no credentials. Apps Script sends mail from the account that owns the mail project,
  after a one-time permission grant made in the Apps Script editor.
- The mail web app answers `{"result":"success","mail":"sent","ack":"sent"}`; on error the `mail` / `ack`
  values carry `failed: <reason>`. Opening the mail URL in a browser returns a small status JSON.

Updating a script: edit it in the Apps Script editor, then **Deploy → Manage deployments → pencil →
Version: New version → Deploy**. Never create a "New deployment" for a code change: that produces a new URL
and the site would keep calling the old one.

Troubleshooting: row saved but no mail → the mail deployment was not updated to a new version, or the URL in
`contact-form.js` is wrong. `mail: failed: Authorization is required` → run the test function in the editor
and approve the prompt. Mail "sent" but not in the inbox → check Spam once. The **Executions** panel in the
Apps Script editor lists every call with its error.

---

## 3. Local development
Open the folder in VS Code and run Live Server (any port), or any static file server. No install step.
Both form backends are live URLs, so submitting the form locally creates a real row and sends real mail.

## 4. Deployment
GitHub Pages serves the repository root; `index.html` and `assets/` must stay at the top level and all paths
are relative. Two options:

- **Deploy from a branch** (Settings → Pages → Source → branch): push to the default branch and Pages publishes
  it. The workflow file is ignored in this mode and can be deleted.
- **GitHub Actions** (Settings → Pages → Source → GitHub Actions): `.github/workflows/deploy-pages.yml`
  publishes the root on every push to `main`.

## 5. Notes
- Everything in this repository is public by design. No API keys, passwords or tokens may ever be committed.
  The two Apps Script URLs are public endpoints by nature; each can only do what its script does.
- Hardening not yet applied: Content-Security-Policy meta tag, Subresource Integrity on the Font Awesome CDN
  link, `rel="noopener noreferrer"` on external links, and a honeypot field plus throttling in the mail script
  if spam ever appears.
