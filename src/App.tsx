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
  leaderboardEntries,
  metricDescriptions,
  metricLabels,
  modalityMeta,
  submissionColumns,
  type LeaderboardEntry,
  type MetricKey,
  type Modality,
} from './data/leaderboard'

const metricKeys = Object.keys(metricLabels) as MetricKey[]
const modalities = Object.keys(modalityMeta) as Modality[]

function formatScore(value: number) {
  return value.toFixed(3)
}

function SequenceRibbon({
  sequence,
  modality,
}: {
  sequence: string
  modality: Modality
}) {
  const alphabet = modalityMeta[modality].sequenceAlphabet
  const letters = sequence.split('')

  return (
    <div className="sequence-ribbon" aria-label={`${modalityMeta[modality].label} sequence motif`}>
      {letters.map((letter, index) => {
        const alphabetIndex = Math.max(alphabet.indexOf(letter), 0)
        return (
          <span
            className="sequence-token"
            data-tone={alphabetIndex % 4}
            key={`${letter}-${index}`}
          >
            {letter}
          </span>
        )
      })}
    </div>
  )
}

function MetricBar({ value, accent }: { value: number; accent: string }) {
  return (
    <span className="metric-bar" aria-hidden="true">
      <span
        style={
          {
            '--bar-width': `${Math.min(value * 100, 100)}%`,
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
}: {
  entry: LeaderboardEntry
  metric: MetricKey
}) {
  const meta = modalityMeta[entry.modality]

  return (
    <aside className="detail-panel" aria-label="Selected method details">
      <div className="detail-panel__header">
        <div>
          <p className="eyebrow">Selected method</p>
          <h2>{entry.methodName}</h2>
        </div>
        <span className="rank-badge">#{entry.rank}</span>
      </div>

      <SequenceRibbon sequence={entry.sequenceBackbone} modality={entry.modality} />

      <dl className="detail-grid">
        <div>
          <dt>Primary metric</dt>
          <dd>{metricLabels[metric]}</dd>
        </div>
        <div>
          <dt>Score</dt>
          <dd>{formatScore(entry[metric])}</dd>
        </div>
        <div>
          <dt>Split</dt>
          <dd>{meta.splitName}</dd>
        </div>
        <div>
          <dt>Status</dt>
          <dd>{entry.status === 'verified' ? 'Verified' : 'Internal preview'}</dd>
        </div>
      </dl>

      <div className="detail-stack">
        <div>
          <p className="detail-label">Model family</p>
          <p>{entry.modelFamily}</p>
        </div>
        <div>
          <p className="detail-label">Config</p>
          <code>{entry.configPath}</code>
        </div>
        <div>
          <p className="detail-label">Submission note</p>
          <p>{entry.notes}</p>
        </div>
      </div>

      <a className="detail-link" href={entry.codeUrl} target="_blank" rel="noreferrer">
        <GitBranch aria-hidden="true" />
        Source protocol
        <ExternalLink aria-hidden="true" />
      </a>
    </aside>
  )
}

function App() {
  const [activeModality, setActiveModality] = useState<Modality>('protein')
  const [activeMetric, setActiveMetric] = useState<MetricKey>('spearman')
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState('protein-esmc-300m-mlp')

  const visibleEntries = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    return leaderboardEntries
      .filter((entry) => entry.modality === activeModality)
      .filter((entry) => {
        if (!normalizedQuery) return true
        return `${entry.methodName} ${entry.modelFamily} ${entry.submittedBy}`
          .toLowerCase()
          .includes(normalizedQuery)
      })
      .sort((a, b) => b[activeMetric] - a[activeMetric])
  }, [activeMetric, activeModality, query])

  const selectedEntry =
    visibleEntries.find((entry) => entry.id === selectedId) ??
    visibleEntries[0] ??
    leaderboardEntries.find((entry) => entry.modality === activeModality) ??
    leaderboardEntries[0]

  const modalityCounts = modalities.map((modality) => ({
    modality,
    count: leaderboardEntries.filter((entry) => entry.modality === modality).length,
    best: Math.max(
      ...leaderboardEntries
        .filter((entry) => entry.modality === modality)
        .map((entry) => entry[activeMetric]),
    ),
  }))

  function selectModality(modality: Modality) {
    setActiveModality(modality)
    setSelectedId(leaderboardEntries.find((entry) => entry.modality === modality)?.id ?? selectedId)
  }

  return (
    <main>
      <section className="hero-section" aria-labelledby="page-title">
        <div className="hero-copy">
          <p className="eyebrow">TadA-Bench leaderboard</p>
          <h1 id="page-title">Future-round discovery, ranked by modality.</h1>
          <p className="hero-copy__lead">
            A submission-ready leaderboard surface for the TadA-Bench 1M benchmark,
            organized across protein, DNA, and RNA fixed test splits.
          </p>
          <div className="hero-actions" aria-label="Primary links">
            <a className="icon-button icon-button--dark" href="#leaderboard">
              <Trophy aria-hidden="true" />
              View rankings
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

        <div className="hero-instrument" aria-label="Leaderboard summary">
          <div className="instrument-topline">
            <span>Fixed splits</span>
            <strong>AA / DNA / RNA</strong>
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
                  <small>{count} preview entries</small>
                </span>
                <b>{formatScore(best)}</b>
              </button>
            ))}
          </div>
          <div className="submission-strip">
            <ClipboardCheck aria-hidden="true" />
            <span>Validator columns:</span>
            <code>{submissionColumns.slice(0, 3).join(', ')}</code>
          </div>
        </div>
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
            <p className="eyebrow">{modalityMeta[activeModality].shortLabel} leaderboard</p>
            <h2>{modalityMeta[activeModality].subtitle}</h2>
          </div>
          <p>{metricDescriptions[activeMetric]}</p>
        </div>

        <div className="workspace">
          <div className="table-panel">
            <div className="table-toolbar">
              <label className="search-box">
                <Search aria-hidden="true" />
                <span className="sr-only">Search methods</span>
                <input
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search method or model family"
                  type="search"
                  value={query}
                />
              </label>
              <span className="filter-pill">
                <Filter aria-hidden="true" />
                {modalityMeta[activeModality].splitName}
              </span>
            </div>

            <div className="leaderboard-table" role="table" aria-label={`${modalityMeta[activeModality].label} rankings`}>
              <div className="table-row table-row--head" role="row">
                <span role="columnheader">Rank</span>
                <span role="columnheader">Method</span>
                <span role="columnheader">Primary</span>
                <span role="columnheader">Spearman</span>
                <span role="columnheader">Recall@10%</span>
                <span role="columnheader">NDCG@10%</span>
              </div>

              {visibleEntries.map((entry, index) => (
                <button
                  className="table-row table-row--entry"
                  data-selected={selectedEntry.id === entry.id}
                  key={entry.id}
                  onClick={() => setSelectedId(entry.id)}
                  role="row"
                  style={{ '--row-accent': modalityMeta[entry.modality].accent } as CSSProperties}
                  type="button"
                >
                  <span className="rank-cell" role="cell">#{index + 1}</span>
                  <span className="method-cell" role="cell">
                    <strong>{entry.methodName}</strong>
                    <small>{entry.modelFamily}</small>
                  </span>
                  <span className="score-cell score-cell--primary" role="cell">
                    {formatScore(entry[activeMetric])}
                    <MetricBar value={entry[activeMetric]} accent={modalityMeta[entry.modality].accent} />
                  </span>
                  <span className="score-cell" role="cell">{formatScore(entry.spearman)}</span>
                  <span className="score-cell" role="cell">{formatScore(entry.recallAt10)}</span>
                  <span className="score-cell" role="cell">{formatScore(entry.ndcgAt10)}</span>
                  <ChevronRight className="row-chevron" aria-hidden="true" />
                </button>
              ))}
            </div>
          </div>

          <EntryDetail entry={selectedEntry} metric={activeMetric} />
        </div>
      </section>

      <section className="protocol-section" aria-labelledby="protocol-heading">
        <div>
          <p className="eyebrow">Submission protocol</p>
          <h2 id="protocol-heading">The site is presentation-only; validation stays in the benchmark repo.</h2>
        </div>
        <div className="protocol-grid">
          <div className="protocol-item">
            <BadgeCheck aria-hidden="true" />
            <h3>Fixed test split</h3>
            <p>Every row should come from a full validator run against the selected modality and split.</p>
          </div>
          <div className="protocol-item">
            <ClipboardCheck aria-hidden="true" />
            <h3>CSV contract</h3>
            <p>Required columns are sequence, prediction, and method_name; extra metadata appears in the detail panel.</p>
          </div>
          <div className="protocol-item">
            <GitBranch aria-hidden="true" />
            <h3>Manual curation first</h3>
            <p>For launch, reviewed submissions can update the data file before we add live upload workflows.</p>
          </div>
        </div>
      </section>
    </main>
  )
}

export default App
