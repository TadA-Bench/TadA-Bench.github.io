import { useEffect, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react'
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
  phaseDescriptions,
  phaseForRound,
  phaseLabels,
  randomSplitProteinControls,
  resourceLinks,
  splitDescriptions,
  splitLabels,
  splitStages,
  type MetricKey,
  type Modality,
  type RoundPhase,
  type SplitKey,
} from './data/baselines'

const metricKeys = Object.keys(metricLabels) as MetricKey[]
const modalities = Object.keys(modalityMeta) as Modality[]
const splitKeys = Object.keys(splitLabels) as SplitKey[]
const graphPhases: Array<RoundPhase | 'all'> = ['all', 'train', 'validation', 'test']
const graphWidth = 920
const graphHeight = 320
const graphLeft = 64
const graphRight = 856
const graphBaselineY = 172
const graphNodeRadius = 11
const graphNodeStep = (graphRight - graphLeft) / 30

type GraphPoint = {
  x: number
  y: number
}

type GraphNode = {
  id: string
  round: number
  phase: RoundPhase
  label: string
}

function formatScore(value: number) {
  return value.toFixed(4)
}

function positionForRound(round: number): GraphPoint {
  return {
    x: graphLeft + (round - 1) * graphNodeStep,
    y: graphBaselineY,
  }
}

function makeGraphNodes(): GraphNode[] {
  return Array.from({ length: 31 }, (_, index) => {
    const round = index + 1
    const phase = phaseForRound(round)
    return {
      id: `round-${round}`,
      round,
      phase,
      label: `Round ${round}`,
    }
  })
}

function ModalityIcon({ modality }: { modality: Modality }) {
  if (modality === 'protein') return <FlaskConical aria-hidden="true" />
  if (modality === 'dna') return <Dna aria-hidden="true" />
  return <BarChart3 aria-hidden="true" />
}

function isNeighbor(a: number, b: number) {
  return Math.abs(a - b) === 1
}

const phaseRanges: Record<RoundPhase, string> = {
  train: 'R1-R27',
  validation: 'R28',
  test: 'R29-R31',
}

const graphLegendLabels: Record<RoundPhase, string> = {
  train: 'Train R1-R27',
  validation: 'Val R28',
  test: 'Test R29-R31',
}

function splitBandGeometry(phase: RoundPhase) {
  const roundRange = {
    train: [1, 27],
    validation: [28, 28],
    test: [29, 31],
  }[phase]
  const xStart = positionForRound(roundRange[0]).x - 22
  const xEnd = positionForRound(roundRange[1]).x + 22
  return {
    x: xStart,
    y: 80,
    width: xEnd - xStart,
    height: 156,
  }
}

function shouldShowRoundLabel(round: number, activeRound: number, selectedRound: number) {
  return round === 1 || round === 5 || round === 10 || round === 15 || round === 20 ||
    round === 25 || round === 27 || round >= 28 || round === activeRound || round === selectedRound
}

function RoundGraphSection() {
  const graphCanvasRef = useRef<HTMLDivElement | null>(null)
  const [hoveredRound, setHoveredRound] = useState<number | null>(null)
  const [selectedRound, setSelectedRound] = useState<number>(29)
  const [phaseFilter, setPhaseFilter] = useState<RoundPhase | 'all'>('all')

  const nodes = useMemo(() => makeGraphNodes(), [])
  const selectedNode = nodes.find((node) => node.round === (hoveredRound ?? selectedRound)) ?? nodes[28]
  const activeRound = hoveredRound ?? selectedRound
  const visibleNodes = nodes.filter((node) => phaseFilter === 'all' || node.phase === phaseFilter)
  const visibleNodeIds = new Set(visibleNodes.map((node) => node.id))

  const chronologyEdges = nodes.slice(1).map((node, index) => ({
    source: nodes[index],
    target: node,
  }))

  useEffect(() => {
    const canvas = graphCanvasRef.current
    if (!canvas || canvas.scrollWidth <= canvas.clientWidth) return

    const selectedX = (positionForRound(selectedRound).x / graphWidth) * canvas.scrollWidth
    canvas.scrollTo({
      left: Math.max(0, selectedX - canvas.clientWidth / 2),
      behavior: 'smooth',
    })
  }, [selectedRound])

  function nodeIsMuted(node: GraphNode) {
    if (phaseFilter !== 'all' && node.phase !== phaseFilter) return true
    return node.round !== activeRound && !isNeighbor(node.round, activeRound)
  }

  function edgeIsActive(source: GraphNode, target: GraphNode) {
    return source.round === activeRound || target.round === activeRound
  }

  function selectPhaseFilter(nextPhase: RoundPhase | 'all') {
    setPhaseFilter(nextPhase)
    setHoveredRound(null)
    if (nextPhase === 'all') return
    const firstRoundInPhase = nodes.find((node) => node.phase === nextPhase)
    if (firstRoundInPhase) setSelectedRound(firstRoundInPhase.round)
  }

  return (
    <section className="round-graph-section" aria-labelledby="round-graph-heading">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Fixed future-round replay</p>
          <h2 id="round-graph-heading">Recorded PANCE rounds and split roles.</h2>
        </div>
        <p>
          Color marks the fixed split: rounds 1-27 for training evidence, round 28 for validation, and rounds 29-31
          for future-round testing. Lines connect adjacent recorded rounds only.
        </p>
      </div>

      <div className="graph-controls" aria-label="Round graph controls">
        <div className="metric-toggle" aria-label="Split focus">
          {graphPhases.map((phase) => (
            <button
              aria-pressed={phaseFilter === phase}
              className="metric-button"
              data-active={phaseFilter === phase}
              key={phase}
              onClick={() => selectPhaseFilter(phase)}
              type="button"
            >
              <Filter aria-hidden="true" />
              {phase === 'all' ? 'All rounds' : graphLegendLabels[phase]}
            </button>
          ))}
        </div>
      </div>

      <div className="graph-workspace">
        <div className="graph-panel">
          <div className="graph-canvas" ref={graphCanvasRef}>
            <svg
              aria-labelledby="round-graph-svg-title round-graph-svg-desc"
              className="round-graph"
              role="group"
              viewBox={`0 0 ${graphWidth} ${graphHeight}`}
            >
              <title id="round-graph-svg-title">Interactive split map of 31 recorded TadA rounds</title>
              <desc id="round-graph-svg-desc">
                Nodes represent recorded PANCE rounds. Lines show adjacent recorded order only and do not encode
                ancestry, sequence similarity, or sample size.
              </desc>

              <g className="graph-bands" aria-hidden="true">
                {(['train', 'validation', 'test'] as RoundPhase[]).map((phase) => {
                  const band = splitBandGeometry(phase)
                  return (
                    <g key={phase}>
                      <rect
                        data-phase={phase}
                        height={band.height}
                        rx="6"
                        width={band.width}
                        x={band.x}
                        y={band.y}
                      />
                    </g>
                  )
                })}
              </g>

              <g className="graph-edges graph-edges--chronology" aria-hidden="true">
                {chronologyEdges.map(({ source, target }) => {
                  const sourcePosition = positionForRound(source.round)
                  const targetPosition = positionForRound(target.round)
                  const visible = visibleNodeIds.has(source.id) && visibleNodeIds.has(target.id)
                  return (
                    <line
                      data-active={edgeIsActive(source, target)}
                      data-muted={!visible}
                      key={`${source.id}-${target.id}`}
                      x1={sourcePosition.x}
                      x2={targetPosition.x}
                      y1={sourcePosition.y}
                      y2={targetPosition.y}
                    />
                  )
                })}
              </g>

              <g className="graph-nodes">
                {nodes.map((node) => {
                  const position = positionForRound(node.round)
                  const muted = nodeIsMuted(node)
                  const selected = node.round === selectedRound
                  const active = node.round === activeRound
                  const visible = visibleNodeIds.has(node.id)
                  const interactiveProps = visible
                    ? {
                        'aria-label': `${node.label}, ${phaseLabels[node.phase]}`,
                        'aria-pressed': selected,
                        onClick: () => setSelectedRound(node.round),
                        onFocus: () => setHoveredRound(node.round),
                        onKeyDown: (event: KeyboardEvent<SVGGElement>) => {
                          if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault()
                            setSelectedRound(node.round)
                          }
                          if (event.key === 'Escape') setHoveredRound(null)
                        },
                        onPointerEnter: () => setHoveredRound(node.round),
                        onPointerLeave: () => setHoveredRound(null),
                        role: 'button',
                        tabIndex: 0,
                      }
                    : {
                        'aria-hidden': true,
                      }
                  return (
                    <g
                      className="graph-node"
                      data-active={active}
                      data-muted={muted}
                      data-phase={node.phase}
                      data-selected={selected}
                      key={node.id}
                      transform={`translate(${position.x} ${position.y})`}
                      {...interactiveProps}
                    >
                      <circle className="graph-hitbox" r="22" />
                      <circle className="graph-dot" r={graphNodeRadius} />
                      {shouldShowRoundLabel(node.round, activeRound, selectedRound) && (
                        <text y={graphNodeRadius + 18}>R{node.round}</text>
                      )}
                    </g>
                  )
                })}
              </g>

              <g className="graph-axis-labels" aria-hidden="true">
                {[1, 5, 10, 15, 20, 25, 28, 31].map((round) => (
                  <text key={round} x={positionForRound(round).x} y="274">
                    {round}
                  </text>
                ))}
              </g>
            </svg>
          </div>

          <div className="graph-legend" aria-label="Graph legend">
            {(['train', 'validation', 'test'] as RoundPhase[]).map((phase) => (
              <span data-phase={phase} key={phase}>
                {graphLegendLabels[phase]}
              </span>
            ))}
          </div>
        </div>

        <aside className="graph-detail" aria-label="Selected round details">
          <p className="eyebrow">Highlighted round</p>
          <h3>R{selectedNode.round}</h3>
          <p>{phaseDescriptions[selectedNode.phase]}</p>

          <dl className="detail-grid">
            <div>
              <dt>Fixed split</dt>
              <dd>{phaseRanges[selectedNode.phase]}</dd>
            </div>
            <div>
              <dt>Role</dt>
              <dd>{phaseLabels[selectedNode.phase]}</dd>
            </div>
          </dl>

          <p className="graph-note">
            Counts shown on the protocol cards are split-level row totals.
          </p>
        </aside>
      </div>
    </section>
  )
}

function App() {
  const [activeModality, setActiveModality] = useState<Modality>('protein')
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

  return (
    <main>
      <section className="hero-section" aria-labelledby="page-title">
        <div className="hero-copy">
          <p className="eyebrow">ICML 2026</p>
          <h1 id="page-title">{paperTitle}</h1>
          <p className="hero-copy__lead">
            TadA-Bench is a million-variant wet-lab replay benchmark from 31 TadA directed-evolution rounds.
            Models use earlier recorded variants and activity labels to rank variants from later rounds.
          </p>
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

      <RoundGraphSection />

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
                        <strong>{entry.modelName}</strong>
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
            <h2 id="diagnostic-heading">Random split is an interpolation control.</h2>
          </div>
          <p>
            The paper uses the 8:1:1 random split to test label learnability under interpolation. Future-round replay
            remains the benchmark task.
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
