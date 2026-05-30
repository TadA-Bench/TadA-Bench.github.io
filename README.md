# TadA-Bench Leaderboard Site

Interactive leaderboard website for TadA-Bench 1M. The site presents the
paper-aligned future-round replay protocol: train on rounds 1-27, validate on
round 28, and report final rankings on rounds 29-31 across DNA, RNA, and protein
views.

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

Rows in `src/data/leaderboard.ts` are the paper baseline values from the
future-round DNA/RNA/protein tables. Random-split rows are shown only as an
interpolation diagnostic and are not the official leaderboard setting.
