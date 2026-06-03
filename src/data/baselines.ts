export type Modality = 'protein' | 'dna' | 'rna'

export type MetricKey = 'spearman' | 'recallAt10' | 'ndcgAt10'

export type SplitKey = 'validation' | 'test'

export type RoundPhase = 'train' | 'validation' | 'test'

export type MetricSet = Record<MetricKey, number>

export type SplitMembershipCounts = Record<RoundPhase, number>

export type BaselineEntry = {
  id: string
  modelName: string
  modelFamily: string
  modelHref?: string
  modality: Modality
  protocol: string
  validation: MetricSet
  test: MetricSet
  source: string
}

export type PaperAuthor = {
  name: string
  affiliations: number[]
  corresponding?: boolean
}

export type PaperAffiliation = {
  id: number
  label: string
}

export const releasedRowCounts: Record<Modality, SplitMembershipCounts> = {
  dna: { train: 729302, validation: 148014, test: 149884 },
  rna: { train: 729302, validation: 148014, test: 149884 },
  protein: { train: 256429, validation: 45208, test: 108232 },
}

export type RandomSplitProteinEntry = {
  modelName: string
  validation: MetricSet
  test: MetricSet
}

export const paperTitle =
  'TadA-Bench: A Million-Variant Benchmark for Future-Round Discovery Toward Agentic Protein Engineering'

export const paperAuthors: PaperAuthor[] = [
  { name: 'Jin Gao', affiliations: [1] },
  { name: 'Juntu Zhao', affiliations: [1] },
  { name: 'Zirui Zeng', affiliations: [1] },
  { name: 'Jiaqi Shen', affiliations: [1] },
  { name: 'Junhao Shi', affiliations: [1] },
  { name: 'Dukun Zhao', affiliations: [1] },
  { name: 'Yuming Lu', affiliations: [1], corresponding: true },
  { name: 'Dequan Wang', affiliations: [1, 2], corresponding: true },
]

export const paperAffiliations: PaperAffiliation[] = [
  { id: 1, label: 'Shanghai Jiao Tong University' },
  { id: 2, label: 'Shanghai Innovation Institute' },
]

export const resourceLinks = [
  {
    label: 'Paper',
    href: 'https://arxiv.org/abs/2606.02624v1',
  },
  {
    label: 'Dataset',
    href: 'https://huggingface.co/datasets/JinGao/TadABench-1M',
  },
  {
    label: 'Code',
    href: 'https://github.com/shiyegao/TadABench-1M',
  },
]

export const citationBibtex = `@inproceedings{gao2026tadabench,
  title = {TadA-Bench: A Million-Variant Benchmark for Future-Round Discovery Toward Agentic Protein Engineering},
  author = {Gao, Jin and Zhao, Juntu and Zeng, Zirui and Shen, Jiaqi and Shi, Junhao and Zhao, Dukun and Lu, Yuming and Wang, Dequan},
  booktitle = {Proceedings of the 43rd International Conference on Machine Learning},
  year = {2026}
}`

export const metricLabels: Record<MetricKey, string> = {
  spearman: 'Spearman',
  recallAt10: 'Recall@10%',
  ndcgAt10: 'nDCG@10%',
}

export const splitLabels: Record<SplitKey, string> = {
  validation: 'Validation',
  test: 'Test',
}

export const modalityMeta: Record<
  Modality,
  {
    label: string
    shortLabel: string
    accent: string
  }
> = {
  protein: {
    label: 'Protein',
    shortLabel: 'Protein',
    accent: '#bf3f2f',
  },
  dna: {
    label: 'DNA',
    shortLabel: 'DNA',
    accent: '#1b7f72',
  },
  rna: {
    label: 'RNA',
    shortLabel: 'RNA',
    accent: '#8a6417',
  },
}

export const phaseLabels: Record<RoundPhase, string> = {
  train: 'Training split',
  validation: 'Validation',
  test: 'Test split',
}

export const phaseDescriptions: Record<RoundPhase, string> = {
  train: 'Rounds 1-27 provide earlier recorded variants and activity labels.',
  validation: 'Round 28 is used for model selection.',
  test: 'Rounds 29-31 define the paper-reported future-round test set.',
}

export function phaseForRound(round: number): RoundPhase {
  if (round <= 27) return 'train'
  if (round === 28) return 'validation'
  return 'test'
}

export const baselineEntries: BaselineEntry[] = [
  {
    id: 'dna-evo2-7b',
    modelName: 'Evo2-7B',
    modelFamily: 'Evo 2',
    modelHref: 'https://huggingface.co/arcinstitute/evo2_7b',
    modality: 'dna',
    protocol: 'Frozen encoder probe + MLP head',
    validation: { spearman: 0.049, recallAt10: 0.1097, ndcgAt10: 0.2604 },
    test: { spearman: 0.0707, recallAt10: 0.1005, ndcgAt10: 0.3236 },
    source: 'Table: Future-round performance on nucleic-acid views',
  },
  {
    id: 'dna-evo2-40b',
    modelName: 'Evo2-40B',
    modelFamily: 'Evo 2',
    modelHref: 'https://huggingface.co/arcinstitute/evo2_40b',
    modality: 'dna',
    protocol: 'Frozen encoder probe + MLP head',
    validation: { spearman: 0.098, recallAt10: 0.1157, ndcgAt10: 0.2702 },
    test: { spearman: 0.0675, recallAt10: 0.1003, ndcgAt10: 0.3244 },
    source: 'Table: Future-round performance on nucleic-acid views',
  },
  {
    id: 'dna-nt-50m',
    modelName: 'NT-50M',
    modelFamily: 'Nucleotide Transformer',
    modelHref: 'https://huggingface.co/InstaDeepAI/nucleotide-transformer-50m-human-ref',
    modality: 'dna',
    protocol: 'Frozen encoder probe + MLP head',
    validation: { spearman: 0.0401, recallAt10: 0.0959, ndcgAt10: 0.2464 },
    test: { spearman: 0.0166, recallAt10: 0.095, ndcgAt10: 0.3109 },
    source: 'Table: Future-round performance on nucleic-acid views',
  },
  {
    id: 'dna-nt-100m',
    modelName: 'NT-100M',
    modelFamily: 'Nucleotide Transformer',
    modelHref: 'https://huggingface.co/InstaDeepAI/nucleotide-transformer-100m-human-ref',
    modality: 'dna',
    protocol: 'Frozen encoder probe + MLP head',
    validation: { spearman: 0.052, recallAt10: 0.0982, ndcgAt10: 0.2485 },
    test: { spearman: 0.0045, recallAt10: 0.087, ndcgAt10: 0.3048 },
    source: 'Table: Future-round performance on nucleic-acid views',
  },
  {
    id: 'dna-nt-250m',
    modelName: 'NT-250M',
    modelFamily: 'Nucleotide Transformer',
    modelHref: 'https://huggingface.co/InstaDeepAI/nucleotide-transformer-250m-human-ref',
    modality: 'dna',
    protocol: 'Frozen encoder probe + MLP head',
    validation: { spearman: 0.047, recallAt10: 0.0858, ndcgAt10: 0.2137 },
    test: { spearman: 0.0006, recallAt10: 0.0971, ndcgAt10: 0.3085 },
    source: 'Table: Future-round performance on nucleic-acid views',
  },
  {
    id: 'dna-nt-500m',
    modelName: 'NT-500M',
    modelFamily: 'Nucleotide Transformer',
    modelHref: 'https://huggingface.co/InstaDeepAI/nucleotide-transformer-500m-human-ref',
    modality: 'dna',
    protocol: 'Frozen encoder probe + MLP head',
    validation: { spearman: 0.0361, recallAt10: 0.0985, ndcgAt10: 0.2225 },
    test: { spearman: 0.0189, recallAt10: 0.1005, ndcgAt10: 0.3079 },
    source: 'Table: Future-round performance on nucleic-acid views',
  },
  {
    id: 'rna-og-46m',
    modelName: 'OG-46M',
    modelFamily: 'OmniGenome',
    modality: 'rna',
    protocol: 'Frozen encoder probe + MLP head',
    validation: { spearman: 0.0555, recallAt10: 0.0911, ndcgAt10: 0.2192 },
    test: { spearman: 0.0079, recallAt10: 0.1063, ndcgAt10: 0.3158 },
    source: 'Table: Future-round performance on nucleic-acid views',
  },
  {
    id: 'rna-og-418m',
    modelName: 'OG-418M',
    modelFamily: 'OmniGenome',
    modelHref: 'https://huggingface.co/anonymous8/OmniGenome-418M',
    modality: 'rna',
    protocol: 'Frozen encoder probe + MLP head',
    validation: { spearman: 0.0078, recallAt10: 0.0949, ndcgAt10: 0.2391 },
    test: { spearman: 0.0048, recallAt10: 0.0859, ndcgAt10: 0.3042 },
    source: 'Table: Future-round performance on nucleic-acid views',
  },
  {
    id: 'protein-esm2-35m',
    modelName: 'ESM2-35M',
    modelFamily: 'ESM2',
    modelHref: 'https://huggingface.co/facebook/esm2_t12_35M_UR50D',
    modality: 'protein',
    protocol: 'Frozen encoder probe + MLP head',
    validation: { spearman: 0.1591, recallAt10: 0.1449, ndcgAt10: 0.6533 },
    test: { spearman: 0.03, recallAt10: 0.1379, ndcgAt10: 0.3281 },
    source: 'Table: Future-round performance on protein view',
  },
  {
    id: 'protein-esm2-150m',
    modelName: 'ESM2-150M',
    modelFamily: 'ESM2',
    modelHref: 'https://huggingface.co/facebook/esm2_t30_150M_UR50D',
    modality: 'protein',
    protocol: 'Frozen encoder probe + MLP head',
    validation: { spearman: 0.1458, recallAt10: 0.142, ndcgAt10: 0.6569 },
    test: { spearman: 0.0416, recallAt10: 0.123, ndcgAt10: 0.3068 },
    source: 'Table: Future-round performance on protein view',
  },
  {
    id: 'protein-esm2-650m',
    modelName: 'ESM2-650M',
    modelFamily: 'ESM2',
    modelHref: 'https://huggingface.co/facebook/esm2_t33_650M_UR50D',
    modality: 'protein',
    protocol: 'Frozen encoder probe + MLP head',
    validation: { spearman: 0.1423, recallAt10: 0.1473, ndcgAt10: 0.653 },
    test: { spearman: 0.0479, recallAt10: 0.112, ndcgAt10: 0.2791 },
    source: 'Table: Future-round performance on protein view',
  },
  {
    id: 'protein-prot-bert',
    modelName: 'Prot-BERT',
    modelFamily: 'ProtTrans',
    modelHref: 'https://huggingface.co/Rostlab/prot_bert',
    modality: 'protein',
    protocol: 'Frozen encoder probe + MLP head',
    validation: { spearman: 0.128, recallAt10: 0.1128, ndcgAt10: 0.6534 },
    test: { spearman: 0.0214, recallAt10: 0.1162, ndcgAt10: 0.298 },
    source: 'Table: Future-round performance on protein view',
  },
  {
    id: 'protein-prot-xlnet',
    modelName: 'Prot-XLNET',
    modelFamily: 'ProtTrans',
    modelHref: 'https://huggingface.co/Rostlab/prot_xlnet',
    modality: 'protein',
    protocol: 'Frozen encoder probe + MLP head',
    validation: { spearman: 0.157, recallAt10: 0.1261, ndcgAt10: 0.6589 },
    test: { spearman: 0.0342, recallAt10: 0.1175, ndcgAt10: 0.2895 },
    source: 'Table: Future-round performance on protein view',
  },
  {
    id: 'protein-esmc-300m',
    modelName: 'ESMC-300M',
    modelFamily: 'ESM Cambrian',
    modelHref: 'https://huggingface.co/EvolutionaryScale/esmc-300m-2024-12',
    modality: 'protein',
    protocol: 'Frozen encoder probe + MLP head',
    validation: { spearman: 0.1498, recallAt10: 0.1199, ndcgAt10: 0.6495 },
    test: { spearman: 0.0355, recallAt10: 0.1151, ndcgAt10: 0.2867 },
    source: 'Table: Future-round performance on protein view',
  },
  {
    id: 'protein-esmc-600m',
    modelName: 'ESMC-600M',
    modelFamily: 'ESM Cambrian',
    modelHref: 'https://huggingface.co/EvolutionaryScale/esmc-600m-2024-12',
    modality: 'protein',
    protocol: 'Frozen encoder probe + MLP head',
    validation: { spearman: 0.1452, recallAt10: 0.1206, ndcgAt10: 0.6397 },
    test: { spearman: 0.0509, recallAt10: 0.118, ndcgAt10: 0.286 },
    source: 'Table: Future-round performance on protein view',
  },
]

export const randomSplitProteinControls: RandomSplitProteinEntry[] = [
  {
    modelName: 'ESM2-35M',
    validation: { spearman: 0.8032, recallAt10: 0.183, ndcgAt10: 0.4824 },
    test: { spearman: 0.8014, recallAt10: 0.1617, ndcgAt10: 0.4814 },
  },
  {
    modelName: 'ESM2-150M',
    validation: { spearman: 0.7386, recallAt10: 0.229, ndcgAt10: 0.4364 },
    test: { spearman: 0.7371, recallAt10: 0.2324, ndcgAt10: 0.4437 },
  },
  {
    modelName: 'ESM2-650M',
    validation: { spearman: 0.536, recallAt10: 0.1793, ndcgAt10: 0.474 },
    test: { spearman: 0.5348, recallAt10: 0.171, ndcgAt10: 0.4779 },
  },
  {
    modelName: 'Prot-BERT',
    validation: { spearman: 0.791, recallAt10: 0.223, ndcgAt10: 0.4879 },
    test: { spearman: 0.7883, recallAt10: 0.2262, ndcgAt10: 0.4918 },
  },
  {
    modelName: 'Prot-XLNET',
    validation: { spearman: 0.8054, recallAt10: 0.2264, ndcgAt10: 0.4912 },
    test: { spearman: 0.803, recallAt10: 0.2193, ndcgAt10: 0.4965 },
  },
  {
    modelName: 'ESMC-300M',
    validation: { spearman: 0.8102, recallAt10: 0.2439, ndcgAt10: 0.4959 },
    test: { spearman: 0.8067, recallAt10: 0.2363, ndcgAt10: 0.4995 },
  },
  {
    modelName: 'ESMC-600M',
    validation: { spearman: 0.8127, recallAt10: 0.2446, ndcgAt10: 0.5006 },
    test: { spearman: 0.8079, recallAt10: 0.2317, ndcgAt10: 0.4949 },
  },
]
