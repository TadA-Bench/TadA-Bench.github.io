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
      <div className="section-heading">
        <div>
          <p className="eyebrow">Benchmark idea</p>
          <h2 id="story-heading">From a recorded TadA campaign to replayed future-round decisions.</h2>
        </div>
        <p>
          TadA-Bench isolates the ranking module a future protein-engineering workflow would need before acquisition
          policies or new wet-lab actions are added.
        </p>
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
                <strong>Random split control</strong>
                <span className="rank-axis" />
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
        </div>

        <aside className="story-takeaway" aria-label="Benchmark takeaway">
          <p className="eyebrow">Key takeaway</p>
          <h3>Known-data interpolation is not future-round discovery.</h3>
          <p>
            The benchmark asks whether a model can use recorded wet-lab history to prioritize later candidates under a
            fixed replay protocol.
          </p>
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
        </aside>
      </div>
    </section>
  )
}

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

      <StorylineSection />

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
