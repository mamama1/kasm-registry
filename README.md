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
| Ubuntu Noble (Intel Arc Battlemage) | `ghcr.io/mamama1/kasm-ubuntu-noble-desktop-battlemage:1.19.0` | Needs an Intel Arc GPU agent with `/dev/dri/renderD128` passthrough (render gid `993`). Source: [workspaces-images @ battlemage](https://git.void.ne-mail.net/NNET-IT/workspaces-images). |

## Adding a new workspace

1. Push the built image to `ghcr.io/mamama1/<name>:<tag>` (public, or private + Kasm creds).
2. Copy `workspaces/<Name>/` — edit `workspace.json` (schema 1.1: `friendly_name`,
   `description`, `image_src`, `architecture`, `compatibility[]` with `version` +
   `image` + `uncompressed_size_mb`; optional `run_config`/`exec_config`, `categories`,
   `notes`, `docker_registry`).
3. Add a square icon (≥50×50) named to match `image_src`.
4. Commit and push — the CI regenerates `list.json` and redeploys Pages.

## Notes for maintainers

- **`basePath` / URLs in `site/next.config.js` keep the literal `1.0` token on purpose.**
  `build_all_branches.sh` rewrites `1.0` → the branch name (`1.1`) at build time. Only change
  the repo-name segment (`kasm-registry`) if you rename the GitHub repo, and the
  `mamama1` GitHub user if different. Set **`1.1` as the repo's default branch** so the site
  root redirects to `/1.1/`.
- Generated files (`public/`, `site/public/list.json`, `site/public/icons/`) are build
  artifacts and are git-ignored — the CI produces them.
- Pull upstream template/schema updates later with:
  `git fetch upstream && git merge upstream/1.1`.
