import { useMemo, useState, type CSSProperties } from 'react'
import {
  ArrowDownUp,
  BadgeCheck,
  BarChart3,
  ChevronRight,
  ClipboardCheck,
  Code2,
  Dna,
  ExternalLink,
  Filter,
  FlaskConical,
  GitBranch,
  Search,
  Trophy,
} from 'lucide-react'
import './App.css'
import {
  diagnosticFindings,
  leaderboardEntries,
  metricDescriptions,
  metricLabels,
  modalityMeta,
  randomSplitProteinControls,
  splitDescriptions,
  splitLabels,
  splitStages,
  submissionColumns,
  type LeaderboardEntry,
  type MetricKey,
  type Modality,
  type SplitKey,
} from './data/leaderboard'

const metricKeys = Object.keys(metricLabels) as MetricKey[]
const modalities = Object.keys(modalityMeta) as Modality[]
const splitKeys = Object.keys(splitLabels) as SplitKey[]

function formatScore(value: number) {
  return value.toFixed(3)
}

function sampleMotif(modality: Modality) {
  const alphabet = modalityMeta[modality].sequenceAlphabet
  return Array.from({ length: modality === 'protein' ? 11 : 12 }, (_, index) => alphabet[index % alphabet.length])
}

function SequenceRibbon({ modality }: { modality: Modality }) {
  const letters = sampleMotif(modality)

  return (
    <div className="sequence-ribbon" aria-label={`${modalityMeta[modality].label} sequence motif`}>
      {letters.map((letter, index) => (
        <span className="sequence-token" data-tone={index % 4} key={`${letter}-${index}`}>
          {letter}
        </span>
      ))}
    </div>
  )
}

function MetricBar({ value, accent }: { value: number; accent: string }) {
  return (
    <span className="metric-bar" aria-hidden="true">
      <span
        style={
          {
            '--bar-width': `${Math.min(Math.max(value, 0) * 100, 100)}%`,
            '--bar-color': accent,
          } as CSSProperties
        }
      />
    </span>
  )
}

function ModalityIcon({ modality }: { modality: Modality }) {
  if (modality === 'protein') return <FlaskConical aria-hidden="true" />
  if (modality === 'dna') return <Dna aria-hidden="true" />
  return <BarChart3 aria-hidden="true" />
}

function EntryDetail({
  entry,
  metric,
  split,
}: {
  entry: LeaderboardEntry
  metric: MetricKey
  split: SplitKey
}) {
  const meta = modalityMeta[entry.modality]
  const score = entry[split][metric]

  return (
    <aside className="detail-panel" aria-label="Selected baseline details">
      <div className="detail-panel__header">
        <div>
          <p className="eyebrow">Paper baseline</p>
          <h2>{entry.modelName}</h2>
        </div>
        <span className="rank-badge">{formatScore(score)}</span>
      </div>

      <SequenceRibbon modality={entry.modality} />

      <dl className="detail-grid">
        <div>
          <dt>View</dt>
          <dd>{meta.label}</dd>
        </div>
        <div>
          <dt>Stage</dt>
          <dd>{splitLabels[split]}</dd>
        </div>
        <div>
          <dt>Metric</dt>
          <dd>{metricLabels[metric]}</dd>
        </div>
        <div>
          <dt>Score</dt>
          <dd>{formatScore(score)}</dd>
        </div>
      </dl>

      <div className="detail-stack">
        <div>
          <p className="detail-label">Model family</p>
          <p>{entry.modelFamily}</p>
        </div>
        <div>
          <p className="detail-label">Protocol</p>
          <p>{entry.protocol}</p>
        </div>
        <div>
          <p className="detail-label">Split semantics</p>
          <p>{splitDescriptions[split]}</p>
        </div>
        <div>
          <p className="detail-label">Note</p>
          <p>{entry.notes}</p>
        </div>
        <div>
          <p className="detail-label">Source</p>
          <p>{entry.source}</p>
        </div>
      </div>

      <a
        className="detail-link"
        href="https://github.com/shiyegao/TadABench-1M"
        target="_blank"
        rel="noreferrer"
      >
        <GitBranch aria-hidden="true" />
        Benchmark protocol
        <ExternalLink aria-hidden="true" />
      </a>
    </aside>
  )
}

function EmptyDetail() {
  return (
    <aside className="detail-panel" aria-label="No matching baseline">
      <div className="detail-panel__header">
        <div>
          <p className="eyebrow">No match</p>
          <h2>No baseline row matches the current filter.</h2>
        </div>
      </div>
      <p className="empty-copy">Clear the search field or switch modality to inspect paper baseline rows.</p>
    </aside>
  )
}

function App() {
  const [activeModality, setActiveModality] = useState<Modality>('protein')
  const [activeMetric, setActiveMetric] = useState<MetricKey>('spearman')
  const [activeSplit, setActiveSplit] = useState<SplitKey>('test')
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState('protein-esmc-600m')

  const visibleEntries = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    return leaderboardEntries
      .filter((entry) => entry.modality === activeModality)
      .filter((entry) => {
        if (!normalizedQuery) return true
        return `${entry.modelName} ${entry.modelFamily} ${entry.protocol}`.toLowerCase().includes(normalizedQuery)
      })
      .sort((a, b) => b[activeSplit][activeMetric] - a[activeSplit][activeMetric])
  }, [activeMetric, activeModality, activeSplit, query])

  const selectedEntry =
    visibleEntries.find((entry) => entry.id === selectedId) ??
    visibleEntries[0]

  const modalityCounts = modalities.map((modality) => {
    const entries = leaderboardEntries.filter((entry) => entry.modality === modality)
    return {
      modality,
      count: entries.length,
      best: Math.max(...entries.map((entry) => entry[activeSplit][activeMetric])),
    }
  })

  function selectModality(modality: Modality) {
    setActiveModality(modality)
    const topEntry = leaderboardEntries
      .filter((entry) => entry.modality === modality)
      .sort((a, b) => b[activeSplit][activeMetric] - a[activeSplit][activeMetric])[0]
    setSelectedId(topEntry?.id ?? selectedId)
  }

  return (
    <main>
      <section className="hero-section" aria-labelledby="page-title">
        <div className="hero-copy">
          <p className="eyebrow">TadA-Bench leaderboard</p>
          <h1 id="page-title">Few-shot future-round replay for TadA engineering.</h1>
          <p className="hero-copy__lead">
            A 31-round wet-lab benchmark where models learn from earlier recorded TadA variants,
            tune on round 28, and rank candidates from rounds 29-31.
          </p>
          <div className="hero-actions" aria-label="Primary links">
            <a className="icon-button icon-button--dark" href="#leaderboard">
              <Trophy aria-hidden="true" />
              View paper baselines
            </a>
            <a
              className="icon-button"
              href="https://github.com/shiyegao/TadABench-1M"
              target="_blank"
              rel="noreferrer"
            >
              <Code2 aria-hidden="true" />
              Protocol repo
            </a>
          </div>
        </div>

        <div className="hero-instrument" aria-label="Replay protocol summary">
          <div className="instrument-topline">
            <span>Replay protocol</span>
            <strong>Rounds 1-27 / 28 / 29-31</strong>
          </div>
          <div className="assay-lanes">
            {modalityCounts.map(({ modality, count, best }) => (
              <button
                className="assay-lane"
                data-active={activeModality === modality}
                key={modality}
                onClick={() => selectModality(modality)}
                style={{ '--lane-accent': modalityMeta[modality].accent } as CSSProperties}
                type="button"
              >
                <span className="assay-lane__icon">
                  <ModalityIcon modality={modality} />
                </span>
                <span>
                  <strong>{modalityMeta[modality].label}</strong>
                  <small>
                    {count} paper baselines · {modalityMeta[modality].totalCount} sequences
                  </small>
                </span>
                <b>{formatScore(best)}</b>
              </button>
            ))}
          </div>
          <div className="submission-strip">
            <ClipboardCheck aria-hidden="true" />
            <span>Submission CSV:</span>
            <code>{submissionColumns.slice(0, 3).join(', ')}</code>
          </div>
        </div>
      </section>

      <section className="protocol-map" aria-label="Train validation test protocol">
        {splitStages.map((stage) => (
          <article className="stage-card" key={stage.label}>
            <p className="eyebrow">{stage.label}</p>
            <h2>{stage.rounds}</h2>
            <p>{stage.purpose}</p>
            <dl>
              <div>
                <dt>DNA/RNA</dt>
                <dd>{stage.dnaRnaCount}</dd>
              </div>
              <div>
                <dt>Protein</dt>
                <dd>{stage.proteinCount}</dd>
              </div>
            </dl>
          </article>
        ))}
      </section>

      <section className="control-band" aria-label="Leaderboard controls">
        <div className="tabs" role="tablist" aria-label="Modality">
          {modalities.map((modality) => (
            <button
              aria-selected={activeModality === modality}
              className="tab-button"
              key={modality}
              onClick={() => selectModality(modality)}
              role="tab"
              style={{ '--tab-accent': modalityMeta[modality].accent } as CSSProperties}
              type="button"
            >
              <ModalityIcon modality={modality} />
              {modalityMeta[modality].label}
            </button>
          ))}
        </div>

        <div className="metric-toggle" aria-label="Split">
          {splitKeys.map((split) => (
            <button
              className="metric-button"
              data-active={activeSplit === split}
              key={split}
              onClick={() => setActiveSplit(split)}
              type="button"
            >
              <Filter aria-hidden="true" />
              {splitLabels[split]}
            </button>
          ))}
        </div>

        <div className="metric-toggle" aria-label="Metric">
          {metricKeys.map((metric) => (
            <button
              className="metric-button"
              data-active={activeMetric === metric}
              key={metric}
              onClick={() => setActiveMetric(metric)}
              type="button"
            >
              <ArrowDownUp aria-hidden="true" />
              {metricLabels[metric]}
            </button>
          ))}
        </div>
      </section>

      <section className="leaderboard-section" id="leaderboard">
        <div className="section-heading">
          <div>
            <p className="eyebrow">
              {modalityMeta[activeModality].shortLabel} · {splitLabels[activeSplit]} leaderboard
            </p>
            <h2>{modalityMeta[activeModality].subtitle}</h2>
          </div>
          <p>
            {metricDescriptions[activeMetric]} {splitDescriptions[activeSplit]}
          </p>
        </div>

        <div className="workspace">
          <div className="table-panel">
            <div className="table-toolbar">
              <label className="search-box">
                <Search aria-hidden="true" />
                <span className="sr-only">Search methods</span>
                <input
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search model or family"
                  type="search"
                  value={query}
                />
              </label>
              <span className="filter-pill">
                <Filter aria-hidden="true" />
                {modalityMeta[activeModality].splitName}.{activeSplit === 'validation' ? 'val' : 'test'}
              </span>
            </div>

            <div
              className="leaderboard-table"
              role="table"
              aria-label={`${modalityMeta[activeModality].label} rankings`}
            >
              <div className="table-row table-row--head" role="row">
                <span role="columnheader">Rank</span>
                <span role="columnheader">Model</span>
                <span role="columnheader">Primary</span>
                <span role="columnheader">Spearman</span>
                <span role="columnheader">Recall@10%</span>
                <span role="columnheader">NDCG@10%</span>
              </div>

              {visibleEntries.map((entry, index) => (
                <button
                  className="table-row table-row--entry"
                  data-selected={selectedEntry?.id === entry.id}
                  key={entry.id}
                  onClick={() => setSelectedId(entry.id)}
                  role="row"
                  style={{ '--row-accent': modalityMeta[entry.modality].accent } as CSSProperties}
                  type="button"
                >
                  <span className="rank-cell" role="cell">#{index + 1}</span>
                  <span className="method-cell" role="cell">
                    <strong>{entry.modelName}</strong>
                    <small>{entry.modelFamily}</small>
                  </span>
                  <span className="score-cell score-cell--primary" role="cell">
                    {formatScore(entry[activeSplit][activeMetric])}
                    <MetricBar value={entry[activeSplit][activeMetric]} accent={modalityMeta[entry.modality].accent} />
                  </span>
                  <span className="score-cell" role="cell">{formatScore(entry[activeSplit].spearman)}</span>
                  <span className="score-cell" role="cell">{formatScore(entry[activeSplit].recallAt10)}</span>
                  <span className="score-cell" role="cell">{formatScore(entry[activeSplit].ndcgAt10)}</span>
                  <ChevronRight className="row-chevron" aria-hidden="true" />
                </button>
              ))}
              {visibleEntries.length === 0 && (
                <div className="table-empty" role="row">
                  No paper baseline rows match this search.
                </div>
              )}
            </div>
          </div>

          {selectedEntry ? <EntryDetail entry={selectedEntry} metric={activeMetric} split={activeSplit} /> : <EmptyDetail />}
        </div>
      </section>

      <section className="diagnostic-section" aria-labelledby="diagnostic-heading">
        <div className="section-heading section-heading--single">
          <div>
            <p className="eyebrow">Interpretation guardrails</p>
            <h2 id="diagnostic-heading">Random split is a control, not the leaderboard setting.</h2>
          </div>
          <p>
            The paper uses random-split interpolation to show that labels are learnable. The benchmark claim is the
            gap between that control and future-round replay.
          </p>
        </div>

        <div className="diagnostic-grid">
          {diagnosticFindings.map((item) => (
            <article className="protocol-item diagnostic-card" key={item.label}>
              <BadgeCheck aria-hidden="true" />
              <p className="diagnostic-value">{item.value}</p>
              <h3>{item.label}</h3>
              <p>{item.detail}</p>
            </article>
          ))}
        </div>

        <div className="random-table" aria-label="Protein random-split diagnostic rows">
          {randomSplitProteinControls.map((row) => (
            <div className="random-row" key={row.modelName}>
              <strong>{row.modelName}</strong>
              <span>Random-split test Spearman {formatScore(row.testSpearman)}</span>
              <span>Recall@10% {formatScore(row.testRecallAt10)}</span>
              <span>NDCG@10% {formatScore(row.testNdcgAt10)}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="protocol-section" aria-labelledby="protocol-heading">
        <div>
          <p className="eyebrow">Submission protocol</p>
          <h2 id="protocol-heading">Leaderboard rows must report the future-round replay test set.</h2>
        </div>
        <div className="protocol-grid">
          <div className="protocol-item">
            <BadgeCheck aria-hidden="true" />
            <h3>Few-shot replay scope</h3>
            <p>Use earlier recorded rounds as support evidence; do not reshuffle data into the official table.</p>
          </div>
          <div className="protocol-item">
            <ClipboardCheck aria-hidden="true" />
            <h3>Validation is not test</h3>
            <p>Round 28 is for model selection. Final claims belong to rounds 29-31.</p>
          </div>
          <div className="protocol-item">
            <GitBranch aria-hidden="true" />
            <h3>Transparent curation</h3>
            <p>Submissions disclose model family, code URL, external data, and exact prediction CSV columns.</p>
          </div>
        </div>
      </section>
    </main>
  )
}

export default App
