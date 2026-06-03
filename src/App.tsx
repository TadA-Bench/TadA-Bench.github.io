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
    title: 'Seq2Graph builds one activity scale.',
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
              <h3>Models rank later recorded variants from earlier evidence.</h3>
            </div>
            <div className="replay-track" aria-hidden="true">
              <span data-phase="train">Train 1-27</span>
              <i />
              <span data-phase="validation">Validate 28</span>
              <i />
              <span data-phase="test">Test 29-31</span>
              <i />
              <span data-phase="rank">Top-k shortlist</span>
            </div>
            <div className="discovery-contrast">
              <div className="rank-sketch" data-mode="random">
                <strong>8:1:1 interpolation control</strong>
                <span className="rank-axis">
                  <svg aria-hidden="true" focusable="false" viewBox="0 0 100 70" preserveAspectRatio="none">
                    <line x1="8" y1="62" x2="92" y2="10" />
                  </svg>
                </span>
              </div>
              <div className="rank-sketch" data-mode="future">
                <strong>Future-round replay</strong>
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
                <span className="coverage-node">
                  <i />
                  <i />
                  <i />
                  <i />
                </span>
              </div>
            </div>
          </div>

          <div className="story-takeaway" aria-label="Benchmark takeaway">
            <div>
              <p className="eyebrow">Key takeaway</p>
              <h3>Known-data interpolation is not future-round discovery.</h3>
              <p>
                TadA-Bench isolates the ranking module a future protein-engineering workflow would need before
                acquisition policies or new wet-lab actions are added. The benchmark asks whether recorded wet-lab
                history is enough to prioritize later candidates under a fixed replay protocol.
              </p>
            </div>
            <dl>
              <div>
                <dt>Input evidence</dt>
                <dd>Earlier rounds</dd>
              </div>
              <div>
                <dt>Decision proxy</dt>
                <dd>Candidate ranking</dd>
              </div>
              <div>
                <dt>Offline boundary</dt>
                <dd>No new experiments</dd>
              </div>
            </dl>
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

      <StorylineSection />

      <DataOverviewSection />

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
