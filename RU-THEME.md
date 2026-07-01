# Infrays theme — fork notes

This branch (`ru-theme`) is a **thin theme fork** of the official
[remnawave/subscription-page](https://github.com/remnawave/subscription-page).
All the visual changes are kept in as few files as possible so pulling upstream
updates stays easy.

## What was changed

| File | Purpose |
|------|---------|
| `frontend/src/ru-theme.css` | **New.** The whole colour/skin layer — neutral-dark / pale-latte palettes, red accents, opaque header, vignette, no lattice, rounded-square icons, outlined selector, QR always B/W. Follows the OS colour scheme (dark by default). |
| `frontend/src/app.tsx` | One added line: `import './ru-theme.css'` (right after `global.css`). |
| `frontend/src/widgets/main/installation-guide/installation-guide.module.css` | App list restyled as phone-style icon tiles (icon on a rounded square, name beneath, red ring on the selected app). |

Tunable knobs (colours, red shade) live in the token block at the top of
`ru-theme.css`.

> Not yet ported (optional, ask if you want them): merging the three panels into
> one card and moving the language button into the header. Those need a small JSX
> edit to `pages/main/ui/components/main.page.component.tsx`.
> The account panel being "always open" is an **admin-panel setting**
> (Remnawave → subscription page → set the subscription-info block to
> `expanded` / `collapsed`), not a code change.

## Build the image (one-time and after every change)

The Docker image expects a pre-built `frontend/dist`, so it's two steps:

```bash
cd subscription-page

# 1. build the frontend (produces frontend/dist)
cd frontend && npm ci && npm run start:build && cd ..

# 2. build your own image
docker build -t infrays/subscription-page:latest .
```

Then point your compose file at **your** image instead of the official one:

```yaml
# docker-compose-prod.yml
services:
  remnawave-subscription-page:
    image: infrays/subscription-page:latest   # was: remnawave/subscription-page:latest
    # ...everything else stays the same
```

```bash
docker compose -f docker-compose-prod.yml up -d
```

(If you build on a different machine than the server, push to a registry —
`docker push infrays/subscription-page:latest` — or `docker save | docker load`.)

## Pull upstream updates later

```bash
cd subscription-page
git fetch upstream
git checkout ru-theme
git rebase upstream/main       # replays the 3 theme files on top of the new release
# resolve conflicts only if upstream touched those exact files (rare)
```

Then rebuild the image (the two build steps above) and `up -d` again.

## First-time GitHub setup (optional but recommended)

So you can push your branch somewhere safe:

1. Create a fork of `remnawave/subscription-page` on GitHub (button on the repo page).
2. Point this repo at it:
   ```bash
   git remote set-url origin https://github.com/<you>/subscription-page.git
   # 'upstream' already points at remnawave/subscription-page
   git push -u origin ru-theme
   ```
