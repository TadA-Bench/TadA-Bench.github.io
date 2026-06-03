import { useMemo, useState, type CSSProperties } from 'react'
import {
  ArrowDown,
  ArrowDownUp,
  ArrowUp,
  BarChart3,
  BookOpen,
  Code2,
  Database,
  Dna,
  ExternalLink,
  FileText,
  Filter,
  FlaskConical,
  Search,
} from 'lucide-react'
import './App.css'
import {
  baselineEntries,
  citationBibtex,
  metricLabels,
  modalityMeta,
  paperAffiliations,
  paperAuthors,
  paperTitle,
  randomSplitProteinControls,
  releasedRowCounts,
  resourceLinks,
  splitLabels,
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
type SortKey = 'rank' | 'modelName' | MetricKey
type SortDirection = 'asc' | 'desc'

const baselineOrder = new Map(baselineEntries.map((entry, index) => [entry.id, index]))
const tableColumns: { key: SortKey; label: string }[] = [
  { key: 'rank', label: 'Rank' },
  { key: 'modelName', label: 'Model' },
  { key: 'spearman', label: metricLabels.spearman },
  { key: 'recallAt10', label: metricLabels.recallAt10 },
  { key: 'ndcgAt10', label: metricLabels.ndcgAt10 },
]

function formatScore(value: number) {
  return value.toFixed(4)
}

function formatCount(value: number) {
  return new Intl.NumberFormat('en-US').format(value)
}

function splitCountTotal(counts: SplitMembershipCounts) {
  return counts.train + counts.validation + counts.test
}

function getSortValue(entry: (typeof baselineEntries)[number], key: SortKey, split: SplitKey) {
  if (key === 'rank') return baselineOrder.get(entry.id) ?? 0
  if (key === 'modelName') return entry.modelName
  return entry[split][key]
}

function compareSortValues(a: string | number, b: string | number, direction: SortDirection) {
  const comparison = typeof a === 'string' && typeof b === 'string' ? a.localeCompare(b) : Number(a) - Number(b)
  return direction === 'asc' ? comparison : -comparison
}

function ModalityIcon({ modality }: { modality: Modality }) {
  if (modality === 'protein') return <FlaskConical aria-hidden="true" />
  if (modality === 'dna') return <Dna aria-hidden="true" />
  return <BarChart3 aria-hidden="true" />
}

function ResourceIcon({ label }: { label: string }) {
  if (label === 'Paper') return <FileText aria-hidden="true" />
  if (label === 'Dataset') return <Database aria-hidden="true" />
  return <Code2 aria-hidden="true" />
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

const storyPillars = [
  {
    key: 'chronology',
    label: 'Chronology',
    title: 'Recorded rounds become a past-to-future task.',
    body: 'The campaign order is preserved: earlier wet-lab evidence trains the model, while later rounds define the ranking target.',
  },
  {
    key: 'scale',
    label: 'Scale',
    title: 'Million-scale coverage makes discovery measurable.',
    body: 'Dense campaign coverage gives the replay enough variants to test candidate prioritization beyond small static screens.',
  },
  {
    key: 'consistency',
    label: 'Consistency',
    title: (
      <>
        Seq2Graph builds
        <br />
        one activity
        <br />
        scale.
      </>
    ),
    body: 'Within-round rankings and overlap anchors reconcile noisy NGS selections into comparable cross-round labels.',
  },
] as const

const seq2GraphSteps = ['NGS selections', 'Within-round ranks', 'Overlap anchors', 'Cycle cleanup', 'Activity scores']

const variantDots = Array.from({ length: 54 }, (_, index) => ({
  x: 9 + ((index * 37) % 82),
  y: 13 + ((index * 53) % 72),
  delay: (index % 9) * 0.12,
  size: 3 + (index % 4),
}))

function StoryVisual({ type }: { type: (typeof storyPillars)[number]['key'] }) {
  if (type === 'chronology') {
    return (
      <div className="mini-timeline" aria-hidden="true">
        <span data-state="train" />
        <span data-state="train" />
        <span data-state="train" />
        <i />
        <span data-state="validation" />
        <span data-state="test" />
      </div>
    )
  }

  if (type === 'scale') {
    return (
      <div className="variant-field" aria-hidden="true">
        {variantDots.map((dot, index) => (
          <span
            key={index}
            style={
              {
                '--dot-x': `${dot.x}%`,
                '--dot-y': `${dot.y}%`,
                '--dot-delay': `${dot.delay}s`,
                '--dot-size': `${dot.size}px`,
              } as CSSProperties
            }
          />
        ))}
      </div>
    )
  }

  return (
    <div className="anchor-map" aria-hidden="true">
      <span className="anchor-cluster" data-cluster="i">
        <i />
        <i />
        <i />
      </span>
      <b />
      <span className="anchor-cluster" data-cluster="j">
        <i />
        <i />
        <i />
      </span>
      <b />
      <span className="anchor-cluster" data-cluster="k">
        <i />
        <i />
        <i />
      </span>
    </div>
  )
}

function StorylineSection() {
  return (
    <section className="story-section" aria-labelledby="story-heading">
      <div className="section-heading section-heading--compact">
        <div>
          <p className="eyebrow">Benchmark idea</p>
          <h2 id="story-heading">Recorded TadA campaign, replayed future-round decisions.</h2>
        </div>
      </div>

      <div className="story-board">
        <div className="story-main">
          <div className="story-pillars" aria-label="Benchmark construction properties">
            {storyPillars.map((pillar, index) => (
              <article className="story-pillar" data-pillar={pillar.key} key={pillar.key}>
                <div className="pillar-kicker">
                  <span>{index + 1}</span>
                  {pillar.label}
                </div>
                <h3>{pillar.title}</h3>
                <p>{pillar.body}</p>
                <StoryVisual type={pillar.key} />
              </article>
            ))}
          </div>

          <div className="seq2graph-strip" aria-label="Seq2Graph construction steps">
            <p className="eyebrow">How we build it: Seq2Graph</p>
            <div className="seq2graph-steps">
              {seq2GraphSteps.map((step, index) => (
                <span key={step}>
                  <b>{index + 1}</b>
                  {step}
                </span>
              ))}
            </div>
          </div>

          <div className="replay-panel" aria-label="Fixed-data replay evaluation">
            <div>
              <p className="eyebrow">How we evaluate</p>
              <h3>Models rank held-out later-round variants using labeled rounds 1-27.</h3>
            </div>
            <div className="replay-layout">
              <div className="replay-track" aria-hidden="true">
                <span data-phase="train">
                  <b>Train</b>
                  <small>Rounds 1-27</small>
                </span>
                <i />
                <span data-phase="validation">
                  <b>Tune</b>
                  <small>Round 28</small>
                </span>
                <i />
                <span data-phase="test">
                  <b>Rank</b>
                  <small>Rounds 29-31</small>
                </span>
                <i />
                <span data-phase="rank">
                  <b>Score</b>
                  <small>Top-k recovery</small>
                </span>
              </div>
              <div className="discovery-contrast">
                <div className="rank-sketch" data-mode="random">
                  <strong>8:1:1 interpolation</strong>
                  <em>Mixed variants across rounds</em>
                  <span className="rank-axis">
                    <svg aria-hidden="true" focusable="false" viewBox="0 0 100 90" preserveAspectRatio="none">
                      <line x1="8" y1="78" x2="92" y2="14" />
                    </svg>
                  </span>
                </div>
                <div className="rank-sketch" data-mode="future">
                  <strong>Held-out later rounds</strong>
                  <em>Rank variants from rounds 29-31</em>
                  <span className="rank-scatter">
                    <i />
                    <i />
                    <i />
                    <i />
                    <i />
                    <i />
                    <i />
                  </span>
                </div>
                <div className="rank-sketch" data-mode="coverage">
                  <strong>Coverage over local density</strong>
                  <em>Top-k candidates should cover later-round regions</em>
                  <span className="coverage-map">
                    <span className="coverage-local" data-label="Near neighbors">
                      <i />
                      <i />
                      <i />
                      <i />
                      <i />
                      <i />
                      <i />
                      <i />
                      <i />
                    </span>
                    <b aria-hidden="true" />
                    <span className="coverage-broad" data-label="Rounds 29-31">
                      <i data-phase="train" />
                      <i data-phase="validation" />
                      <i data-phase="test" />
                      <i data-phase="train" />
                      <i data-phase="test" />
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function DataOverviewSection() {
  return (
    <section className="data-section" aria-labelledby="data-heading">
      <div className="section-heading section-heading--compact">
        <div>
          <p className="eyebrow">Dataset</p>
          <h2 id="data-heading">Released views and fixed replay split.</h2>
        </div>
      </div>

      <div className="data-view-grid">
        {modalities.map((modality) => {
          const rowCounts = releasedRowCounts[modality]
          const totalRows = splitCountTotal(rowCounts)
          return (
            <article
              className="split-overview-panel data-view-card"
              key={modality}
              style={{ '--view-accent': modalityMeta[modality].accent } as CSSProperties}
            >
              <div className="split-overview-header">
                <div className="view-title">
                  <span className="view-icon">
                    <ModalityIcon modality={modality} />
                  </span>
                  <div>
                    <p className="eyebrow">{modalityMeta[modality].shortLabel} view</p>
                    <h3>{formatCount(totalRows)} released rows</h3>
                  </div>
                </div>
              </div>

              <div className="split-row-list" aria-label={`${modalityMeta[modality].label} released split rows`}>
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
          )
        })}
      </div>
    </section>
  )
}

function App() {
  const [activeModality, setActiveModality] = useState<Modality>('dna')
  const [activeSplit, setActiveSplit] = useState<SplitKey>('test')
  const [query, setQuery] = useState('')
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection }>({
    key: 'spearman',
    direction: 'desc',
  })

  const visibleEntries = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    return baselineEntries
      .filter((entry) => entry.modality === activeModality)
      .filter((entry) => {
        if (!normalizedQuery) return true
        return `${entry.modelName} ${entry.modelFamily} ${entry.protocol}`.toLowerCase().includes(normalizedQuery)
      })
      .sort((a, b) => {
        const primary = compareSortValues(
          getSortValue(a, sortConfig.key, activeSplit),
          getSortValue(b, sortConfig.key, activeSplit),
          sortConfig.direction,
        )
        if (primary !== 0) return primary
        return a.modelName.localeCompare(b.modelName)
      })
  }, [activeModality, activeSplit, query, sortConfig])

  const handleSort = (key: SortKey) => {
    setSortConfig((current) => {
      if (current.key === key) {
        return { key, direction: current.direction === 'asc' ? 'desc' : 'asc' }
      }
      return { key, direction: key === 'modelName' || key === 'rank' ? 'asc' : 'desc' }
    })
  }

  const tableHeading =
    activeSplit === 'test' ? (
      <>
        <span>Paper baselines on the</span>
        <span>fixed future-round test set.</span>
      </>
    ) : (
      <>
        <span>Paper baselines on the</span>
        <span>validation split.</span>
      </>
    )

  return (
    <main>
      <section className="hero-section" aria-labelledby="page-title">
        <div className="hero-copy">
          <p className="eyebrow">ICML 2026</p>
          <h1 id="page-title">TadA-Bench</h1>
          <p className="hero-paper-title">{paperTitle}</p>
          <p className="author-line" aria-label="Authors">
            {paperAuthors.map((author) => (
              <span className="author-entry" key={author.name}>
                {author.name}
                <sup>{author.affiliations.join(',')}</sup>
                {author.corresponding ? <sup>*</sup> : null}
              </span>
            ))}
          </p>
          <p className="affiliation-line" aria-label="Affiliations">
            {paperAffiliations.map((affiliation) => (
              <span key={affiliation.id}>
                <sup>{affiliation.id}</sup>
                {affiliation.label}
              </span>
            ))}
          </p>
          <p className="correspondence-line">
            <sup>*</sup> Corresponding authors: Yuming Lu and Dequan Wang.
          </p>
          <div className="hero-actions" aria-label="Primary links">
            {resourceLinks.map((link) => (
              <a className="icon-button" href={link.href} key={link.label} target="_blank" rel="noreferrer">
                <ResourceIcon label={link.label} />
                {link.label}
                <ExternalLink aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>

        <aside className="hero-instrument" aria-label="Benchmark summary">
          <div className="instrument-topline">
            <span className="instrument-label">Fixed future-round replay</span>
            <span className="instrument-value">1-27 / 28 / 29-31</span>
          </div>
          <div className="fact-list">
            <div>
              <span className="fact-label">DNA/RNA rows per view</span>
              <span className="fact-value">1,027,200</span>
            </div>
            <div>
              <span className="fact-label">Protein variants</span>
              <span className="fact-value">409,869</span>
            </div>
            <div>
              <span className="fact-label">Released views</span>
              <span className="fact-value">DNA, RNA, protein</span>
            </div>
          </div>
        </aside>
      </section>

      <StorylineSection />

      <DataOverviewSection />

      <section className="baseline-section" id="paper-baselines">
        <div className="section-heading section-heading--baseline">
          <div>
            <p className="eyebrow">Paper baselines</p>
            <h2 className="baseline-heading-lines">{tableHeading}</h2>
          </div>
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
            <div className="table-filter-group" aria-label="Baseline table filters">
              <label className="filter-select">
                <Filter aria-hidden="true" />
                <span>View</span>
                <select
                  aria-label="Filter by sequence view"
                  onChange={(event) => setActiveModality(event.target.value as Modality)}
                  value={activeModality}
                >
                  {modalities.map((modality) => (
                    <option key={modality} value={modality}>
                      {modalityMeta[modality].label} view
                    </option>
                  ))}
                </select>
              </label>
              <label className="filter-select">
                <Filter aria-hidden="true" />
                <span>Split</span>
                <select
                  aria-label="Filter by evaluation split"
                  onChange={(event) => setActiveSplit(event.target.value as SplitKey)}
                  value={activeSplit}
                >
                  {splitKeys.map((split) => (
                    <option key={split} value={split}>
                      {splitLabels[split]} split
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          <div className="baseline-table-wrap">
            <table className="baseline-table" aria-label={`${modalityMeta[activeModality].label} ${splitLabels[activeSplit]} baseline metrics`}>
              <thead>
                <tr>
                  {tableColumns.map((column) => {
                    const isActiveSort = sortConfig.key === column.key
                    return (
                      <th
                        aria-sort={
                          isActiveSort ? (sortConfig.direction === 'asc' ? 'ascending' : 'descending') : 'none'
                        }
                        key={column.key}
                        scope="col"
                      >
                        <button
                          className="sort-header"
                          data-active={isActiveSort}
                          onClick={() => handleSort(column.key)}
                          type="button"
                        >
                          {column.label}
                          {isActiveSort ? (
                            sortConfig.direction === 'asc' ? (
                              <ArrowUp aria-hidden="true" />
                            ) : (
                              <ArrowDown aria-hidden="true" />
                            )
                          ) : (
                            <ArrowDownUp aria-hidden="true" />
                          )}
                        </button>
                      </th>
                    )
                  })}
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
                    {metricKeys.map((metric) => (
                      <td className="score-cell" key={metric}>
                        {formatScore(entry[activeSplit][metric])}
                      </td>
                    ))}
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
            <p className="eyebrow">Protein-view diagnostic</p>
            <h2 id="diagnostic-heading">Interpolation control, not the future-round leaderboard.</h2>
          </div>
          <p>
            The paper reports this 8:1:1 interpolation-control table on the protein view. It is a label-learnability
            diagnostic, not a DNA/RNA/protein leaderboard.
          </p>
        </div>

        <div className="random-table-wrap">
          <table className="random-table" aria-label="Protein interpolation-control test metrics">
            <thead>
              <tr>
                <th>Model</th>
                <th>Spearman</th>
                <th>Recall@10%</th>
                <th>nDCG@10%</th>
              </tr>
            </thead>
            <tbody>
              {randomSplitProteinControls.map((row) => (
                <tr key={row.modelName}>
                  <td>
                    <strong>{row.modelName}</strong>
                  </td>
                  <td>{formatScore(row.test.spearman)}</td>
                  <td>{formatScore(row.test.recallAt10)}</td>
                  <td>{formatScore(row.test.ndcgAt10)}</td>
                </tr>
              ))}
            </tbody>
          </table>
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
          <a href="https://arxiv.org/abs/2606.02624v1" target="_blank" rel="noreferrer">
            <FileText aria-hidden="true" />
            arXiv paper
            <ExternalLink aria-hidden="true" />
          </a>
          <a href="https://huggingface.co/datasets/JinGao/TadABench-1M" target="_blank" rel="noreferrer">
            <BookOpen aria-hidden="true" />
            Hugging Face dataset
            <ExternalLink aria-hidden="true" />
          </a>
          <a href="https://github.com/shiyegao/TadABench-1M" target="_blank" rel="noreferrer">
            <Code2 aria-hidden="true" />
            Code repository
            <ExternalLink aria-hidden="true" />
          </a>
        </div>
      </section>
    </main>
  )
}

export default App
