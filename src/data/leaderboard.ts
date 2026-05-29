export type Modality = 'protein' | 'dna' | 'rna'

export type MetricKey = 'spearman' | 'recallAt10' | 'ndcgAt10'

export type LeaderboardEntry = {
  id: string
  rank: number
  methodName: string
  modelFamily: string
  modality: Modality
  split: 'test'
  spearman: number
  recallAt10: number
  ndcgAt10: number
  codeUrl: string
  commitHash: string
  submittedBy: string
  validatedOn: string
  status: 'verified' | 'internal-preview'
  sequenceBackbone: string
  notes: string
  configPath: string
}

export const metricLabels: Record<MetricKey, string> = {
  spearman: 'Spearman',
  recallAt10: 'Recall@10%',
  ndcgAt10: 'NDCG@10%',
}

export const metricDescriptions: Record<MetricKey, string> = {
  spearman: 'Rank correlation over the full held-out split.',
  recallAt10: 'Recovery of top experimental variants within the highest-scoring 10%.',
  ndcgAt10: 'Discounted ranking quality over the highest-priority discovery band.',
}

export const modalityMeta: Record<
  Modality,
  {
    label: string
    shortLabel: string
    subtitle: string
    splitName: string
    accent: string
    sequenceAlphabet: string[]
  }
> = {
  protein: {
    label: 'Protein',
    shortLabel: 'AA',
    subtitle: 'Amino-acid sequence models on future-round protein engineering tasks.',
    splitName: 'all.AA.test',
    accent: '#bf3f2f',
    sequenceAlphabet: ['M', 'K', 'T', 'L', 'V', 'A', 'G', 'E', 'D', 'Y'],
  },
  dna: {
    label: 'DNA',
    shortLabel: 'DNA',
    subtitle: 'Nucleotide models evaluated through the same fixed discovery protocol.',
    splitName: 'all.DNA.test',
    accent: '#1b7f72',
    sequenceAlphabet: ['A', 'C', 'G', 'T'],
  },
  rna: {
    label: 'RNA',
    shortLabel: 'RNA',
    subtitle: 'RNA-sequence submissions prepared for modality-specific leaderboard views.',
    splitName: 'all.RNA.test',
    accent: '#8a6417',
    sequenceAlphabet: ['A', 'C', 'G', 'U'],
  },
}

export const leaderboardEntries: LeaderboardEntry[] = [
  {
    id: 'protein-esmc-300m-mlp',
    rank: 1,
    methodName: 'ESMC-300M + MLP',
    modelFamily: 'EvolutionaryScale ESM Cambrian',
    modality: 'protein',
    split: 'test',
    spearman: 0.681,
    recallAt10: 0.247,
    ndcgAt10: 0.792,
    codeUrl: 'https://github.com/shiyegao/TadABench-1M',
    commitHash: '3dd8c99',
    submittedBy: 'TadA-Bench baseline',
    validatedOn: '2026-05-29',
    status: 'internal-preview',
    sequenceBackbone: 'MKTLLVAGDDY',
    notes: 'Placeholder internal baseline row for the website prototype. Replace with reviewed submissions before public launch.',
    configPath: 'config/NB1M_ood_MLP_ESMC-300M.py',
  },
  {
    id: 'protein-esm2-35m-mlp',
    rank: 2,
    methodName: 'ESM2-35M + MLP',
    modelFamily: 'Meta ESM2',
    modality: 'protein',
    split: 'test',
    spearman: 0.622,
    recallAt10: 0.213,
    ndcgAt10: 0.755,
    codeUrl: 'https://github.com/shiyegao/TadABench-1M',
    commitHash: '3dd8c99',
    submittedBy: 'TadA-Bench baseline',
    validatedOn: '2026-05-29',
    status: 'internal-preview',
    sequenceBackbone: 'GVADEYTKLM',
    notes: 'Smoke-tested baseline family. Public table should use final reviewed benchmark numbers.',
    configPath: 'config/NB1M_ood_MLP_ESM2-35M.py',
  },
  {
    id: 'protein-onehot-ridge',
    rank: 3,
    methodName: 'One-hot Ridge',
    modelFamily: 'Classical sequence baseline',
    modality: 'protein',
    split: 'test',
    spearman: 0.421,
    recallAt10: 0.122,
    ndcgAt10: 0.602,
    codeUrl: 'https://github.com/shiyegao/TadABench-1M',
    commitHash: 'pending',
    submittedBy: 'TadA-Bench baseline',
    validatedOn: '2026-05-29',
    status: 'internal-preview',
    sequenceBackbone: 'AAGTLMKDYV',
    notes: 'Reference row to show lower-complexity methods in the interaction design.',
    configPath: 'pending',
  },
  {
    id: 'dna-nt-50m-mlp',
    rank: 1,
    methodName: 'NT-50M + MLP',
    modelFamily: 'Nucleotide Transformer',
    modality: 'dna',
    split: 'test',
    spearman: 0.574,
    recallAt10: 0.19,
    ndcgAt10: 0.711,
    codeUrl: 'https://github.com/shiyegao/TadABench-1M',
    commitHash: '3dd8c99',
    submittedBy: 'TadA-Bench baseline',
    validatedOn: '2026-05-29',
    status: 'internal-preview',
    sequenceBackbone: 'ACGTGCAATGCG',
    notes: 'DNA baseline row for previewing modality-specific leaderboard controls.',
    configPath: 'config/NB1M_ood_MLP_NT-50M.py',
  },
  {
    id: 'dna-kmer-ridge',
    rank: 2,
    methodName: 'K-mer Ridge',
    modelFamily: 'Classical nucleotide baseline',
    modality: 'dna',
    split: 'test',
    spearman: 0.352,
    recallAt10: 0.101,
    ndcgAt10: 0.541,
    codeUrl: 'https://github.com/shiyegao/TadABench-1M',
    commitHash: 'pending',
    submittedBy: 'TadA-Bench baseline',
    validatedOn: '2026-05-29',
    status: 'internal-preview',
    sequenceBackbone: 'TACGATCGGCAT',
    notes: 'Simple baseline placeholder for visual density and comparison testing.',
    configPath: 'pending',
  },
  {
    id: 'rna-transformer-mlp',
    rank: 1,
    methodName: 'RNA Transformer + MLP',
    modelFamily: 'RNA foundation model',
    modality: 'rna',
    split: 'test',
    spearman: 0.536,
    recallAt10: 0.175,
    ndcgAt10: 0.689,
    codeUrl: 'https://github.com/shiyegao/TadABench-1M',
    commitHash: 'pending',
    submittedBy: 'TadA-Bench baseline',
    validatedOn: '2026-05-29',
    status: 'internal-preview',
    sequenceBackbone: 'AUGGCAUCGUUA',
    notes: 'RNA placeholder row to validate the three-panel information architecture.',
    configPath: 'pending',
  },
  {
    id: 'rna-kmer-ridge',
    rank: 2,
    methodName: 'K-mer Ridge',
    modelFamily: 'Classical nucleotide baseline',
    modality: 'rna',
    split: 'test',
    spearman: 0.331,
    recallAt10: 0.089,
    ndcgAt10: 0.52,
    codeUrl: 'https://github.com/shiyegao/TadABench-1M',
    commitHash: 'pending',
    submittedBy: 'TadA-Bench baseline',
    validatedOn: '2026-05-29',
    status: 'internal-preview',
    sequenceBackbone: 'UACGAACGUAUG',
    notes: 'Simple RNA baseline placeholder for rank and metric interactions.',
    configPath: 'pending',
  },
]

export const submissionColumns = [
  'sequence',
  'prediction',
  'method_name',
  'model_family',
  'code_url',
  'commit_hash',
  'notes',
]
