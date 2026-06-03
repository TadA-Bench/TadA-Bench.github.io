import { useMemo, useState, type CSSProperties } from 'react'
import {
  ArrowDownUp,
  BarChart3,
  BookOpen,
  Code2,
  Database,
  Dna,
  ExternalLink,
  FileText,
  Filter,
  FlaskConical,
  GitBranch,
  Search,
} from 'lucide-react'
import './App.css'
import {
  baselineEntries,
  citationBibtex,
  metricDescriptions,
  metricLabels,
  modalityMeta,
  paperAffiliations,
  paperAuthors,
  paperTitle,
  randomSplitProteinControls,
  releasedRowCounts,
  resourceLinks,
  splitDescriptions,
  splitLabels,
  splitOverlapAudit,
  splitStages,
  type MetricKey,
  type Modality,
  type RoundPhase,
  type SplitKey,
  type SplitMembershipCounts,
} from './data/baselines'

const metricKeys = Object.keys(metricLabels) as MetricKey[]
const modalities: Modality[] = ['dna', 'rna', 'protein']
const splitKeys = Object.keys(splitLabels) as SplitKey[]
const splitPhases: RoundPhase[] = ['train', 'validation', 'test']

function formatScore(value: number) {
  return value.toFixed(4)
}

function formatCount(value: number) {
  return new Intl.NumberFormat('en-US').format(value)
}

function splitCountTotal(counts: SplitMembershipCounts) {
  return counts.train + counts.validation + counts.test
}

function ModalityIcon({ modality }: { modality: Modality }) {
  if (modality === 'protein') return <FlaskConical aria-hidden="true" />
  if (modality === 'dna') return <Dna aria-hidden="true" />
  return <BarChart3 aria-hidden="true" />
}

const datasetSplitLabels: Record<RoundPhase, string> = {
  train: 'Training set',
  validation: 'Validation set',
  test: 'Test set',
}

const splitRoundLabels: Record<RoundPhase, string> = {
  train: 'Rounds 1-27',
  validation: 'Round 28',
  test: 'Rounds 29-31',
}

const splitAuditPairs = [
  { key: 'trainValidation', label: 'Train-Val' },
  { key: 'trainTest', label: 'Train-Test' },
  { key: 'validationTest', label: 'Val-Test' },
] as const

function DataOverviewSection({
  activeDataModality,
  setActiveDataModality,
}: {
  activeDataModality: Modality
  setActiveDataModality: (modality: Modality) => void
}) {
  const rowCounts = releasedRowCounts[activeDataModality]
  const totalRows = splitCountTotal(rowCounts)

  return (
    <section className="data-section" aria-labelledby="data-heading">
      <div className="section-heading section-heading--compact">
        <div>
          <p className="eyebrow">Dataset</p>
          <h2 id="data-heading">Released views and fixed replay split.</h2>
        </div>
      </div>

      <div className="data-controls" aria-label="Dataset view controls">
        <div className="tabs" aria-label="Released view">
          {modalities.map((modality) => (
            <button
              aria-pressed={activeDataModality === modality}
              className="tab-button"
              key={modality}
              onClick={() => setActiveDataModality(modality)}
              style={{ '--tab-accent': modalityMeta[modality].accent } as CSSProperties}
              type="button"
            >
              <ModalityIcon modality={modality} />
              {modalityMeta[modality].label}
            </button>
          ))}
        </div>
      </div>

      <div className="data-overview">
        <article className="split-overview-panel">
          <div className="split-overview-header">
            <div>
              <p className="eyebrow">{modalityMeta[activeDataModality].shortLabel} view</p>
              <h3>{formatCount(totalRows)} released rows</h3>
            </div>
          </div>

          <div className="split-row-list" aria-label={`${modalityMeta[activeDataModality].label} released split rows`}>
            {splitPhases.map((phase) => {
              const count = rowCounts[phase]
              const share = count / totalRows
              return (
                <div className="split-row" data-phase={phase} key={phase}>
                  <div className="split-row-label">
                    <strong>{datasetSplitLabels[phase]}</strong>
                    <span>{splitRoundLabels[phase]}</span>
                  </div>
                  <div className="split-row-meter" aria-hidden="true">
                    <i style={{ transform: `scaleX(${share})` }} />
                  </div>
                  <div className="split-row-count">
                    <strong>{formatCount(count)}</strong>
                    <span>{Math.round(share * 100)}%</span>
                  </div>
                </div>
              )
            })}
          </div>
        </article>

        <article className="split-audit-panel">
          <div>
            <p className="eyebrow">Split integrity</p>
            <h3>Exact sequence overlap is zero.</h3>
            <p>
              Official split membership is the Hugging Face split name. The released <code>Domain</code> field is
              multi-valued metadata, not the train/validation/test definition.
            </p>
          </div>
          <div className="split-audit-table-wrap">
            <div className="split-audit-grid" role="table" aria-label="Exact sequence overlap across released splits">
              <div className="split-audit-head" role="row">
                <span role="columnheader">View</span>
                {splitAuditPairs.map((pair) => (
                  <span key={pair.key} role="columnheader">
                    {pair.label}
                  </span>
                ))}
              </div>
              {modalities.map((modality) => (
                <div
                  className="split-audit-row"
                  data-active={activeDataModality === modality}
                  key={modality}
                  role="row"
                >
                  <strong role="rowheader">{modalityMeta[modality].label}</strong>
                  {splitAuditPairs.map((pair) => (
                    <span key={pair.key} role="cell">
                      {formatCount(splitOverlapAudit[modality][pair.key])}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </article>
      </div>
    </section>
  )
}

function App() {
  const [activeModality, setActiveModality] = useState<Modality>('dna')
  const [activeMetric, setActiveMetric] = useState<MetricKey>('spearman')
  const [activeSplit, setActiveSplit] = useState<SplitKey>('test')
  const [query, setQuery] = useState('')

  const visibleEntries = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    return baselineEntries
      .filter((entry) => entry.modality === activeModality)
      .filter((entry) => {
        if (!normalizedQuery) return true
        return `${entry.modelName} ${entry.modelFamily} ${entry.protocol}`.toLowerCase().includes(normalizedQuery)
      })
      .sort((a, b) => b[activeSplit][activeMetric] - a[activeSplit][activeMetric])
  }, [activeMetric, activeModality, activeSplit, query])

  const tableHeading =
    activeSplit === 'test'
      ? 'Paper baselines on the fixed future-round test set.'
      : 'Paper baseline table sorted by validation metrics.'
  const visibleMetricMax = Math.max(
    ...visibleEntries.flatMap((entry) => [entry.validation[activeMetric], entry.test[activeMetric]]),
    0.001,
  )
  const topEntries = visibleEntries.slice(0, 3)

  return (
    <main>
      <section className="hero-section" aria-labelledby="page-title">
        <div className="hero-copy">
          <p className="eyebrow">ICML 2026</p>
          <h1 id="page-title">TadA-Bench</h1>
          <p className="hero-paper-title">{paperTitle}</p>
          <p className="author-line">{paperAuthors.join(', ')}</p>
          <p className="affiliation-line">{paperAffiliations.join(' · ')}</p>
          <div className="hero-actions" aria-label="Primary links">
            {resourceLinks.map((link) => (
              <a className="icon-button" href={link.href} key={link.label} target="_blank" rel="noreferrer">
                {link.label === 'Dataset' ? <Database aria-hidden="true" /> : <Code2 aria-hidden="true" />}
                {link.label}
                <ExternalLink aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>

        <aside className="hero-instrument" aria-label="Benchmark summary">
          <div className="instrument-topline">
            <span>Fixed future-round replay</span>
            <strong>1-27 / 28 / 29-31</strong>
          </div>
          <div className="fact-list">
            <div>
              <span>DNA/RNA rows per view</span>
              <strong>1,027,200</strong>
            </div>
            <div>
              <span>Protein variants</span>
              <strong>409,869</strong>
            </div>
            <div>
              <span>Released views</span>
              <strong>DNA, RNA, protein</strong>
            </div>
          </div>
        </aside>
      </section>

      <section className="protocol-map" aria-label="Train validation test protocol">
        {splitStages.map((stage) => (
          <article className="stage-card" key={stage.label}>
            <p className="eyebrow">{stage.label}</p>
            <h2>{stage.rounds}</h2>
            <p>{stage.purpose}</p>
            <dl>
              <div>
                <dt>DNA/RNA each</dt>
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

      <DataOverviewSection activeDataModality={activeModality} setActiveDataModality={setActiveModality} />

      <section className="control-band" aria-label="Baseline sorting controls">
        <div className="tabs" aria-label="Sequence view">
          {modalities.map((modality) => (
            <button
              aria-pressed={activeModality === modality}
              className="tab-button"
              key={modality}
              onClick={() => setActiveModality(modality)}
              style={{ '--tab-accent': modalityMeta[modality].accent } as CSSProperties}
              type="button"
            >
              <ModalityIcon modality={modality} />
              {modalityMeta[modality].label}
            </button>
          ))}
        </div>

        <div className="metric-toggle" aria-label="Sort split">
          {splitKeys.map((split) => (
            <button
              aria-pressed={activeSplit === split}
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

        <div className="metric-toggle" aria-label="Sort metric">
          {metricKeys.map((metric) => (
            <button
              aria-pressed={activeMetric === metric}
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

      <section className="baseline-section" id="paper-baselines">
        <div className="section-heading">
          <div>
            <p className="eyebrow">
              {modalityMeta[activeModality].shortLabel} · sorted by {splitLabels[activeSplit]} {metricLabels[activeMetric]}
            </p>
            <h2>{tableHeading}</h2>
          </div>
          <p>
            {metricDescriptions[activeMetric]} {splitDescriptions[activeSplit]}
          </p>
        </div>

        <div className="baseline-strips" aria-label="Top baseline metric comparison">
          {topEntries.map((entry, index) => (
            <article className="baseline-strip" key={entry.id}>
              <span className="strip-rank">{index + 1}</span>
              <div className="strip-method">
                {entry.modelHref ? (
                  <a href={entry.modelHref} target="_blank" rel="noreferrer">
                    {entry.modelName}
                    <ExternalLink aria-hidden="true" />
                  </a>
                ) : (
                  <strong>{entry.modelName}</strong>
                )}
                <small>{entry.modelFamily}</small>
              </div>
              {(['validation', 'test'] as SplitKey[]).map((split) => (
                <div className="strip-metric" key={split}>
                  <span>
                    {splitLabels[split]} {metricLabels[activeMetric]}
                    <em>{formatScore(entry[split][activeMetric])}</em>
                  </span>
                  <i
                    aria-hidden="true"
                    style={{ transform: `scaleX(${entry[split][activeMetric] / visibleMetricMax})` }}
                  />
                </div>
              ))}
            </article>
          ))}
        </div>

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
              {modalityMeta[activeModality].label} view · {splitLabels[activeSplit]} split
            </span>
          </div>

          <div className="baseline-table-wrap">
            <table className="baseline-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Model</th>
                  <th>Val Spearman</th>
                  <th>Val Recall@10%</th>
                  <th>Val nDCG@10%</th>
                  <th>Test Spearman</th>
                  <th>Test Recall@10%</th>
                  <th>Test nDCG@10%</th>
                </tr>
              </thead>
              <tbody>
                {visibleEntries.map((entry, index) => (
                  <tr key={entry.id}>
                    <td className="rank-cell">{index + 1}</td>
                    <td>
                      <span className="method-cell">
                        {entry.modelHref ? (
                          <a className="model-link" href={entry.modelHref} target="_blank" rel="noreferrer">
                            {entry.modelName}
                            <ExternalLink aria-hidden="true" />
                          </a>
                        ) : (
                          <strong>{entry.modelName}</strong>
                        )}
                        <small>{entry.modelFamily}</small>
                      </span>
                    </td>
                    <td className="score-cell">{formatScore(entry.validation.spearman)}</td>
                    <td className="score-cell">{formatScore(entry.validation.recallAt10)}</td>
                    <td className="score-cell">{formatScore(entry.validation.ndcgAt10)}</td>
                    <td className="score-cell">{formatScore(entry.test.spearman)}</td>
                    <td className="score-cell">{formatScore(entry.test.recallAt10)}</td>
                    <td className="score-cell">{formatScore(entry.test.ndcgAt10)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {visibleEntries.length === 0 && (
              <div className="table-empty">
                No baseline rows match this search.
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="diagnostic-section" aria-labelledby="diagnostic-heading">
        <div className="section-heading section-heading--single">
          <div>
            <p className="eyebrow">Interpretation</p>
            <h2 id="diagnostic-heading">Interpolation control, not the benchmark leaderboard.</h2>
          </div>
          <p>
            The paper uses the 8:1:1 random split to test label learnability under interpolation. These scores are
            separate from the fixed future-round leaderboard above.
          </p>
        </div>

        <div className="random-table" aria-label="Protein random-split test rows">
          {randomSplitProteinControls.map((row) => (
            <div className="random-row" key={row.modelName}>
              <strong>{row.modelName}</strong>
              <span>Test Spearman {formatScore(row.test.spearman)}</span>
              <span>Recall@10% {formatScore(row.test.recallAt10)}</span>
              <span>nDCG@10% {formatScore(row.test.ndcgAt10)}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="protocol-section" aria-labelledby="scope-heading">
        <div>
          <p className="eyebrow">Scope</p>
          <h2 id="scope-heading">Fixed-data replay, not autonomous wet-lab execution.</h2>
        </div>
        <div className="protocol-grid">
          <div className="protocol-item">
            <GitBranch aria-hidden="true" />
            <h3>Fixed replay scope</h3>
            <p>Future-round replay is the benchmark task; the random split is an interpolation analysis.</p>
          </div>
          <div className="protocol-item">
            <Filter aria-hidden="true" />
            <h3>Validation is not test</h3>
            <p>Round 28 is for model selection. Test claims belong to rounds 29-31.</p>
          </div>
          <div className="protocol-item">
            <FileText aria-hidden="true" />
            <h3>Offline boundary</h3>
            <p>The reported evaluation does not simulate proposal, planning, tool use, or autonomous wet-lab execution.</p>
          </div>
        </div>
      </section>

      <section className="citation-section" aria-labelledby="citation-heading">
        <div>
          <p className="eyebrow">Citation</p>
          <h2 id="citation-heading">BibTeX</h2>
        </div>
        <pre>
          <code>{citationBibtex}</code>
        </pre>
        <div className="citation-links" aria-label="Citation resources">
          <a href="https://huggingface.co/datasets/JinGao/TadABench-1M" target="_blank" rel="noreferrer">
            <BookOpen aria-hidden="true" />
            Hugging Face dataset
            <ExternalLink aria-hidden="true" />
          </a>
          <a href="https://github.com/shiyegao/TadABench-1M" target="_blank" rel="noreferrer">
            <GitBranch aria-hidden="true" />
            Code repository
            <ExternalLink aria-hidden="true" />
          </a>
        </div>
      </section>
    </main>
  )
}

export default App
