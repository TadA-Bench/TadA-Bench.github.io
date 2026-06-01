# TadA-Bench Paper Site

React/Vite paper companion site for TadA-Bench.

The site presents:

- paper title, authors, venue, code, data, and BibTeX;
- the fixed future-round replay protocol;
- a 31-round split map of the recorded TadA campaign;
- paper baseline tables for the DNA, RNA, and protein views;
- protein-view random-split interpolation rows from the paper.

The public benchmark name is `TadA-Bench`. The Hugging Face dataset slug remains
`JinGao/TadABench-1M`.

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

## Data Sources

Paper baseline values are stored in `src/data/baselines.ts`. The round graph
follows the paper's recorded PANCE rounds and fixed split roles: rounds 1-27
for training evidence, round 28 for validation, and rounds 29-31 for the
future-round test set.

The graph encodes recorded rounds and split roles only. Sample sizes are
reported at the split level.
