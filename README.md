# NNET-IT Workspaces — Kasm Registry

A self-managed [Kasm Workspaces](https://kasmweb.com) registry for NNET-IT's custom
workspace images. Built from the
[workspaces_registry_template](https://github.com/kasmtech/workspaces_registry_template)
(schema **1.1**).

This repo is a **catalog of metadata only** — it does not host container images. Each
workspace's `workspace.json` points at an image hosted on a container registry
(`ghcr.io/mamama1/...`). GitHub Actions builds this repo into a static site published to
GitHub Pages; Kasm reads that site.

KASM-REGISTRY-DISCOVERY-IDENTIFIER

## Add this registry to Kasm

1. **Admin → Workspaces → Workspaces Registry → Add new**
2. Paste the base URL (Kasm appends the schema version):
   `https://mamama1.github.io/kasm-registry/`
3. **Add Registry**, then click the registry's icon to filter to its workspaces and install
   one.

If a workspace's image is on a **private** registry, first add pull credentials in Kasm
(Admin → Registries) for that registry host.

## Workspaces

| Workspace | Image | Notes |
|-----------|-------|-------|
| Ubuntu Noble (Intel Arc Battlemage) | `ghcr.io/mamama1/kasm-ubuntu-noble-desktop-battlemage:1.19.0` | Needs an Intel Arc GPU agent with `/dev/dri/renderD128` passthrough (render gid `993`). Source: [kasm-ubuntu-noble-desktop-battlemage](https://github.com/mamama1/kasm-ubuntu-noble-desktop-battlemage). |

## Image updates (how new builds reach Kasm)

Because each `workspace.json` sets `docker_registry`, Kasm agents **re-pull the image tag
every hour** even when it's already cached ([Kasm: Image Maintenance](https://www.kasmweb.com/docs/latest/how_to/image_maintenance.html)).
So the tag you reference decides the behaviour:

- **Moving tag** (e.g. `:1.19.0`, the default here): new CI builds that overwrite the tag
  roll out **automatically** to new sessions within the hour — no edits to this repo.
- **Immutable tag** (e.g. `:1.19.0-20260709`): pins to one exact build. To change it you edit
  `compatibility[].image` and commit; the workspace's folder hash changes and Kasm shows
  **"update available"** on the installed workspace for you to apply.

Editing this repo is therefore only needed to **pin/roll back**, to change `run_config`, or to
add a workspace — not for routine image refreshes.

## Adding a new workspace

1. Push the built image to `ghcr.io/mamama1/<name>:<tag>` (public, or private + Kasm creds).
2. Copy `workspaces/<Name>/` — edit `workspace.json` (schema 1.1: `friendly_name`,
   `description`, `image_src`, `architecture`, `compatibility[]` with `version` +
   `image` + `uncompressed_size_mb`; optional `run_config`/`exec_config`, `categories`,
   `notes`, `docker_registry`).
3. Add a square icon (≥50×50) named to match `image_src`.
4. Commit and push — the CI regenerates `list.json` and redeploys Pages.

## Notes for maintainers

- **Only `basePath` keeps the literal `1.0` token** — `build_all_branches.sh` rewrites `1.0`
  → the branch name (`1.1`) at build time for the site's HTML. But `processjson.js` generates
  `list.json` *before* that rewrite, so `icon`/`listUrl` must be hardcoded (no `1.0` token) or
  the wrong version leaks into `list.json`: `icon` uses the full `/1.1/` asset URL, and
  `listUrl` is the version-less registry root. Change the repo-name segment (`kasm-registry`)
  and `mamama1` user if yours differ. Set **`1.1` as the repo's default branch** so the site
  root redirects to `/1.1/`.
- **The URL you paste into Kasm is the version-less root** (Kasm discovers versions via
  `versions.txt`): `https://mamama1.github.io/kasm-registry/` — trailing slash, **no** `/1.1/`.
- Generated files (`public/`, `site/public/list.json`, `site/public/icons/`) are build
  artifacts and are git-ignored — the CI produces them.
- Pull upstream template/schema updates later with:
  `git fetch upstream && git merge upstream/1.1`.
