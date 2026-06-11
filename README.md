# moonlink

A single-file PWA that talks to a standard MoonBoard LED box over **Web
Bluetooth** (Nordic UART, `l#S5,P9,E18#` protocol). Paint holds on the grid or
pick a problem from a library, and the wall lights up.

No build step, no dependencies — `index.html` is the whole app.

## Running it

Web Bluetooth needs a secure context and Chrome/Edge (Android or desktop); on
iPhone use the Bluefy browser.

- **Served (recommended):** `python3 -m http.server` in this directory, then
  open `http://localhost:8000`. `localhost` counts as secure.
- **Local file:** just open `index.html`.
- Installable as a PWA (offline app shell via service worker).

## Problem library

Two ways to get problems in:

1. **Auto-load** — if a `problems.json` sits next to `index.html` when served,
   it loads on startup. [moonboard-dataset](https://github.com/mbdalpha/moonboard-2024-dataset)
   writes that file directly via its `moonlink_pwa_dir` config key.
2. **Drag & drop** — drop any problems JSON onto the drop zone. Understood
   formats: the compact `moonlink/2` file, classic MoonBoard-API-style exports
   (`Moves: [{Description, IsStart, IsEnd}]`), and even moonboard-dataset's raw
   scraper files (packed `moves` strings).

Either way the library is persisted in IndexedDB, so it survives reloads and
works offline. **Clear library** forgets it.

Once loaded you can search name/setter, filter by grade range, board, angle and
benchmarks, and sort by repeats, grade (either direction), user rating, date
set, or name. Rows show grade, setter, board/angle, repeat count and rating;
**Random problem** picks from the current filter. Tapping a problem loads it
onto the board — and sends it straight to the wall if connected.

## Hold photos

If a `holds/` directory sits next to `index.html` (written by
moonboard-dataset's `fetch_hold_layouts.py`), the board renders the **actual
hold photos** at each position — rotation and all — and painted/lit holds
become colored rings around them. The layout switches automatically to match
the board of whatever problem you load; a "Hold photos" toggle under the grid
turns it off. Layout format: `holds/index.json` maps setup slugs to labels,
`holds/<slug>.json` is `{"label": …, "cells": {"A1": ["h203.png", 90], …}}`
with images in `holds/img/`. Photos are cached by the service worker, so they
work offline too. Without `holds/` the grid just stays plain — nothing to
configure.

## problems.json (`moonlink/2` format)

```json
{
  "format": "moonlink/2",
  "generated": "2026-06-11T01:51:47Z",
  "problems": [
    {
      "n": "Shantaram", "g": "6C", "u": "6B+", "b": 1, "r": 5477, "t": 4,
      "s": "Ben Moon", "d": "2023-11-23", "bo": "MoonBoard 2024", "a": "40°",
      "h": "G5,H5|A16,C12,D14,E9,H10|C18"
    }
  ]
}
```

`h` is `start|mid|finish` cells; `u`/`b`/`r`/`t`/`d` (user grade, benchmark,
repeats, rating, date) are optional. `generated` lets the app skip re-ingesting
a dataset it already has. About 5× smaller than the verbose schema.

Not affiliated with Moon Climbing.
