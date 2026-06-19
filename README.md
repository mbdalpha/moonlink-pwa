# moonlink-pwa

A single-file PWA that talks to a standard MoonBoard LED box over **Web
Bluetooth** (Nordic UART, `l#S5,P9,E18#` protocol). Paint holds on the grid or
pick a problem from a library, and the wall lights up.

No build step, no dependencies — `index.html` is the whole app.

## Running it

Web Bluetooth needs a secure context and Chrome/Edge (Android or desktop); on
iPhone use the Bluefy browser.

- **Live demo (Recommended):** [mbdalpha.github.io/moonlink-pwa](https://mbdalpha.github.io/moonlink-pwa/).
- **Served:** `python3 -m http.server` in this directory, then
  open `http://localhost:8000`. `localhost` counts as secure.
- **Local file:** just open `index.html`.
- Installable as a PWA (offline app shell via service worker).

## Problem library
**Drag & drop** — drop any problems JSON onto the drop zone. You can get the problems from my [moonboard-scraper](https://github.com/mbdalpha/moonboard-scraper).

The library is persisted in IndexedDB, so it survives reloads and
works offline. **Clear library** forgets it.

Once loaded you can search name/setter, filter by grade range, board, angle and
benchmarks, and sort by repeats, grade (either direction), user rating, date
set, or name. Rows show grade, setter, board/angle, repeat count and rating;
**Random problem** picks from the current filter. Tapping a problem loads it
onto the board — and sends it straight to the wall if connected.

Not affiliated with Moon Climbing.
