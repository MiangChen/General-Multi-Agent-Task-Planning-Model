# GitHub Pages deployment

This repository publishes the static knowledge-base dashboard through GitHub Actions.

## What gets published

The Pages artifact is built into `_site/` by `npm run build:pages`.

Published:

- `index.html`
- `views/`
- `notes/`
- `data/`
- `assets/`
- `pdfs/`

Not published by the Pages artifact:

- `AGENT_PROMPTS.md`
- `papers/`
- `topics/`
- `findings/`
- `open-problems/`
- `outputs/`
- maintenance scripts and repo metadata

The generated pages include `noindex,nofollow,noarchive`, and `_site/robots.txt` disallows crawlers. This lowers search-engine discoverability, but it is not access control. Anyone with the Pages URL can still view the site.

## Enable Pages

1. Push `.github/workflows/pages.yml` to `main`.
2. Open the GitHub repository settings.
3. Go to **Pages**.
4. Set **Build and deployment** to **GitHub Actions**.
5. Open the **Actions** tab and run **Deploy GitHub Pages**, or push to `main`.

The published URL will usually be:

```text
https://miangchen.github.io/General-Multi-Agent-Task-Planning-Model/
```

## Two-week trial

For the trial from 2026-05-08 to 2026-05-22:

1. Share the URL only with the intended readers.
2. Do not link to it from public pages or social posts.
3. On 2026-05-22, disable Pages in repository settings or delete `.github/workflows/pages.yml` and remove the active Pages deployment.

## Local check

Run:

```sh
npm run build
npm run build:pages
```

Then open:

```text
_site/index.html
```
