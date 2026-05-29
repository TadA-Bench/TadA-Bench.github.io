# TadA-Bench Leaderboard Site

Interactive leaderboard website prototype for TadA-Bench 1M. This repository is
intended to become the `TadA-Bench.github.io` organization Pages site.

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run lint
npm run build
```

## Deployment target

For a root organization GitHub Pages site, create the repository:

```text
TadA-Bench/TadA-Bench.github.io
```

Then push this repository to `main` and enable GitHub Pages through GitHub
Actions. The workflow in `.github/workflows/deploy.yml` builds the Vite app and
publishes the `dist/` artifact.

## Data model

Current rows in `src/data/leaderboard.ts` are internal preview placeholders.
Before public launch, replace them with reviewed validator outputs from the
benchmark repository.
