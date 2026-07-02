# PATCH_CHANGES — what the Infrays theme fork changes

This branch (`ru-theme`) is a **thin theme fork** of
[remnawave/subscription-page](https://github.com/remnawave/subscription-page).
This document explains every change made on top of upstream so future updates
(`git rebase upstream/main`) are easy to reason about.

Design rule we followed: **keep the diff small and layered.**
- All *colours / skin* live in **one new file** (`ru-theme.css`) that rides on
  stable hooks (Mantine CSS variables + `.mantine-*` classes + the app's own
  global classes), so upstream updates rarely touch it.
- *Structural* changes (layout, per-component looks) are a handful of small,
  targeted edits to source files.

Commits on the branch:

| Commit | Summary |
|--------|---------|
| `9f33349` | Skin layer (neutral-dark / latte, red accents) + phone-style app tiles |
| `3f913e7` | Ignore the local `patch.sh` helper (git + docker) |
| `f3b7f11` | Merge the panels into one, header language + theme toggle, account rows |
| `0122e4a` | Account info as clean single-line rows, open by default |

---

## New files

### `frontend/src/ru-theme.css`  *(the whole colour/skin layer)*
Imported once from `app.tsx` **after** `global.css`, so it wins the cascade.
Contains:
- **Theme tokens** for two palettes — **dark = neutral professional grey**
  (default) and **light = pale latte** — plus a **red** brand accent
  (`--red`, `--red-soft`). Light is selected via
  `:root[data-mantine-color-scheme="light"]`, i.e. driven by the header theme
  toggle; dark is the default.
- **Mantine variable remap**: `--mantine-color-white/text/dimmed/body/default*`
  and the `cyan/teal` accents are pointed at our tokens, which recolours most of
  the UI without touching component code.
- **Backgrounds**: removes the lattice grid, replaces the coloured glow with a
  single centre vignette, makes the sticky header opaque.
- **One merged panel**: `.ru-onepane` / `.ru-sep` / `.ru-row-header`, and it
  flattens nested cards (`.ru-onepane .mantine-Card-root`) so the sections read
  as one connected panel. Also forces the account `SimpleGrid` to a single
  column.
- **Rounded-square icon tiles** (`.mantine-ThemeIcon-root`), neutral header
  action buttons (`.mantine-ActionIcon-root`), outlined selector
  (`.mantine-NativeSelect-input`).
- **Red Установка buttons**: `.mantine-Button-root[data-variant="light"]` sets
  its own `--button-*` vars (Mantine scopes `--mantine-color-cyan-*` per
  colour-scheme with higher specificity than `:root`, so remapping the variable
  alone doesn't win — setting the button vars directly does).
- **QR code** forced black-on-white regardless of theme.

### `RU-THEME.md`
Human guide: how to build the image and pull upstream updates.

### `PATCH_CHANGES.md`
This document.

---

## Modified source files

### `frontend/src/app.tsx`  *(+1 line)*
Adds `import './ru-theme.css'` immediately after `import './global.css'`.

### `frontend/src/pages/main/ui/components/main.page.component.tsx`
The layout change:
- The header, subscription-info, and installation sections are wrapped in a
  **single `<Card className="ru-onepane">`** with `.ru-sep` dividers between
  them (previously three separate blocks).
- The **`LanguagePicker` moved into the header** group, next to the
  link/telegram buttons (was a standalone `<Center>` at the bottom).
- Added a small **`ThemeToggle`** component (sun/moon `ActionIcon` using
  Mantine's `useMantineColorScheme`) in the header. It flips
  `data-mantine-color-scheme`, which drives the light palette in `ru-theme.css`
  and persists across reloads.

### `frontend/src/widgets/main/installation-guide/installation-guide.module.css`
App list restyled from horizontal pills to **phone home-screen tiles**: each app
is a rounded-square icon with its name beneath, laid out in an auto-fill grid.
The selected app gets a **red ring + red name**; the "featured" dot sits at the
icon's top-right corner; glyph colour follows light/dark (never red).

### `frontend/src/shared/ui/info-block/info-block.shared.tsx` + `info-block.module.css`
Used by the account widgets. Reworked from a 2-line coloured block into **one
clean line**: small neutral icon · muted label · right-aligned value. All the
per-colour gradient classes were removed so it matches the theme.

### `frontend/src/widgets/main/subscription-info/subscription-info-collapsed.widget.tsx`  *(1 line)*
The account panel now **starts expanded** (`useState(true)`) — "open by default".

### `frontend/src/widgets/main/subscription-info/subscription-info-cards.module.css`
De-chromed the stat cards (transparent, no borders, no blur, no uppercase
labels) so the **`cards`** subscription-info variant also matches — in case the
panel is switched to that block type.

### `.gitignore` / `.dockerignore`
Ignore the local `patch.sh` helper (see below).

---

## Local-only helper (not committed)

### `patch.sh`
A one-shot runner for **your Mac**: ensures the `upstream` remote → fetches →
rebases the theme onto the latest release (only if needed) → builds the frontend
→ **cross-builds the Docker image for `linux/amd64` via `buildx`** → pushes to
GHCR → optionally SSHes into the server to pull + restart. The only line you edit
is `IMAGE=`. It is **git-ignored on purpose** so editing that line never dirties
the tree and blocks a rebase, and **docker-ignored** so it never enters the image.

---

## Depends on Remnawave panel settings

Two looks are tied to admin-panel *block type* settings, not code:
- **Subscription info**: we styled the **`collapsed`** and **`cards`** variants.
  (`expanded` shares `InfoBlockShared`, so it also looks right.)
- **Installation guide**: we styled the **`cards`** renderer (the phone tiles).

If the panel is switched to a block type we didn't style (e.g. the installation
`timeline`/`accordion`/`minimal`), only the colours carry over, not the custom
layout.
