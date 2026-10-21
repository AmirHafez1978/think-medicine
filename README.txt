Symptom-Based Internal Medicine V5.7 — installable offline web app
=====================================================================

This folder is the phone/tablet app version of the guide. Once it is put on
any HTTPS website and opened once, it saves itself on the device and then
works with no internet (airplane mode).

1. Put it online (once)
   - GitHub Pages: create a repository, upload ALL the files in this folder
     (index.html, sw.js, manifest.webmanifest, the .png icons, and the whole
     assets/ and fonts/ folders), then
     Settings → Pages → Deploy from branch → main / root.
   - Or Netlify Drop (app.netlify.com/drop): drag this whole folder onto the page.
   Keep the files together in the same folder. Do not rename them.

2. How students read it
   The app opens on a home screen of 50 subject cards, grouped by block with
   an icon per block. Tapping a card opens that subject on its own page, so
   each page is a few screens long instead of one 400,000-pixel scroll.
   Previous / Home / Next sit at the foot of every subject, Contents and
   Search still reach the whole guide, and the arrow keys page back and forth
   on a keyboard. Printing still produces the entire guide in one go.

3. Install on a phone or tablet (students do this once, while online)
   - iPhone / iPad (Safari): open the link → Share → Add to Home Screen.
   - Android (Chrome): open the link → ⋮ menu → Install app / Add to Home screen.
   Wait for "Ready offline" in the header line (tap ? for details), then it
   works offline from the home-screen icon.

4. Updating the guide later
   Replace index.html, and in sw.js change CACHE = 'sbim-v5-8-3' to a new value
   (e.g. 'sbim-v5-8-4'). Devices pick up the new copy next time they open the
   app while online. If you add or remove figures in assets/ or fonts/, update
   the MEDIA list in sw.js to match, or they will not be saved for offline use.

   Folder layout
   -------------
   index.html              the guide (about 0.9 MB)
   assets/fig-01.webp …    the 42 clinical figures (about 14 MB)
   fonts/font-1.woff2 …    the 8 embedded fonts
   icon-192 / icon-512     home-screen icons
   icon-maskable-*.png     Android adaptive (circle-safe) icons
   apple-touch-icon.png    iPhone / iPad home-screen icon

   The figures and fonts are separate files on purpose. They used to be pasted
   inside index.html, which made it 21 MB; phones ran out of memory, scrolling
   stalled, and the app would not install. Keep them as separate files.

The separate single file "Symptom-Based Internal Medicine V5.7 - Mobile Chapters.html"
is the same guide as one file, for laptops or for sharing directly. On phones,
opening a local HTML file is unreliable (iPhone Files preview does not run the
navigation), so the web app above is the dependable route for mobiles.
