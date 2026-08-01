# Quest Invoices — Installable App (PWA)

This folder is a real, installable Progressive Web App. It is **five files that
must stay together, in the same folder**:

```
index.html      the app itself
manifest.json   tells the browser the app's name, icon, and how to launch it
sw.js           service worker — enables "Install" and offline reopening
icon-192.png    app icon (small)
icon-512.png    app icon (large)
```

## Why hosting is required

Browsers only allow an app to register as installable (the service worker in
`sw.js`, the "Install" button, the automatic "Add to Home screen" prompt) when
it's served over **HTTPS** — or from `localhost` while testing. This is a
security rule, not something this app can bypass: opening `index.html`
directly from disk (double-click, or a `file://` link) will **not** register
the service worker and the browser will not offer to install it, even though
the manifest and icons are all correctly set up.

So: upload all five files to any HTTPS web host, and open it from that
`https://` address.

## Fastest ways to host it (all free)

**GitHub Pages**
1. Create a new GitHub repository, upload these 5 files to it.
2. Repository Settings → Pages → Source → deploy from the `main` branch.
3. Open the `https://<your-username>.github.io/<repo>/` URL it gives you.

**Netlify Drop**
1. Go to https://app.netlify.com/drop
2. Drag this whole folder onto the page.
3. It gives you a live `https://....netlify.app` URL immediately — no account needed.

**Your own web server / company site**
Just upload the 5 files into any folder on your existing HTTPS web server and
open that URL. Any static host works (cPanel, Vercel, Firebase Hosting, S3 +
CloudFront, etc.).

## Testing locally before you host it

You can test the full installable behavior on your own computer first,
since `localhost` is also treated as secure:

1. Install Python (most computers already have it) or Node.js.
2. Open a terminal in this folder and run:
   - Python: `python3 -m http.server 8000`
   - Node: `npx serve .`
3. Open `http://localhost:8000` in Chrome or Edge.
4. You should see an **Install** icon appear in the address bar.

## Installing it

**Desktop (Chrome / Edge)**
Open the hosted `https://...` URL → click the **Install** icon in the address
bar (or menu → "Install Quest Invoices…"). It opens afterward as its own
app window, with its own icon in your Start Menu / Applications folder —
not inside a browser tab.

**Android (Chrome)**
Open the URL → menu (⋮) → **"Install app"** (or a banner will offer this
automatically). It's added to your home screen and app drawer like any
other app.

**iPhone / iPad (Safari)**
Open the URL in Safari → tap the **Share** icon → **"Add to Home Screen"**.
(iOS does not show a "browser install" banner the way Android/Chrome does —
this Share-menu step is Apple's install mechanism, and it's the only one
that works on iOS.)

## What still needs the internet, even once installed

This app stores all your invoices, quotations, receipts, customers, and
settings **on the device**, in the browser's local storage — so once
installed, viewing, creating, and editing documents all keep working with no
internet connection. The one exception: generating a PDF (Download / Share)
loads a small PDF library from a CDN the first time it's needed, so that
specific action needs a live connection.

## Updating it later

If you change `index.html` (or anything else) after you've deployed it,
bump `CACHE_VERSION` at the top of `sw.js` (e.g. `quest-invoices-v1` →
`quest-invoices-v2`) before re-uploading. That tells already-installed
copies of the app to fetch the new version instead of quietly keeping the
old cached one.
