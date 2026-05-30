export type Modality = 'protein' | 'dna' | 'rna'

export type MetricKey = 'spearman' | 'recallAt10' | 'ndcgAt10'

export type SplitKey = 'validation' | 'test'

export type MetricSet = Record<MetricKey, number>

export type LeaderboardEntry = {
  id: string
  modelName: string
  modelFamily: string
  modality: Modality
  protocol: string
  validation: MetricSet
  test: MetricSet
  notes: string
  source: string
}

export type SplitStage = {
  label: string
  rounds: string
  purpose: string
  dnaRnaCount: string
  proteinCount: string
}

export const metricLabels: Record<MetricKey, string> = {
  spearman: 'Spearman',
  recallAt10: 'Recall@10%',
  ndcgAt10: 'NDCG@10%',
}

export const metricDescriptions: Record<MetricKey, string> = {
  spearman: 'Global rank correlation between predicted and Seq2Graph activity order.',
  recallAt10: 'Fraction of true top-decile variants recovered in the predicted top decile.',
  ndcgAt10: 'Top-decile ranking quality for candidate prioritization under limited wet-lab budget.',
}

export const splitLabels: Record<SplitKey, string> = {
  validation: 'Validation',
  test: 'Test',
}

export const splitDescriptions: Record<SplitKey, string> = {
  validation: 'Round 28 is used for learning-rate and model-selection decisions.',
  test: 'Rounds 29-31 are later wet-lab evidence and define the official future-round report.',
}

export const modalityMeta: Record<
  Modality,
  {
    label: string
    shortLabel: string
    subtitle: string
    splitName: string
    trainCount: string
    validationCount: string
    testCount: string
    totalCount: string
    accent: string
    sequenceAlphabet: string[]
  }
> = {
  protein: {
    label: 'Protein',
    shortLabel: 'AA',
    subtitle: 'Amino-acid models ranking later-round TadA variants after synonymous DNA collapse.',
    splitName: 'all.AA',
    trainCount: '256,429',
    validationCount: '45,208',
    testCount: '108,232',
    totalCount: '409,869',
    accent: '#bf3f2f',
    sequenceAlphabet: ['M', 'K', 'T', 'L', 'V', 'A', 'G', 'E', 'D', 'Y'],
  },
  dna: {
    label: 'DNA',
    shortLabel: 'DNA',
    subtitle: 'DNA language models evaluated on NGS-observed variants from the same TadA campaign.',
    splitName: 'all.DNA',
    trainCount: '729,302',
    validationCount: '148,014',
    testCount: '149,884',
    totalCount: '1,027,200',
    accent: '#1b7f72',
    sequenceAlphabet: ['A', 'C', 'G', 'T'],
  },
  rna: {
    label: 'RNA',
    shortLabel: 'RNA',
    subtitle: 'RNA view produced by T-to-U conversion for RNA-specific model evaluation.',
    splitName: 'all.RNA',
    trainCount: '729,302',
    validationCount: '148,014',
    testCount: '149,884',
    totalCount: '1,027,200',
    accent: '#8a6417',
    sequenceAlphabet: ['A', 'C', 'G', 'U'],
  },
}

export const splitStages: SplitStage[] = [
  {
    label: 'Training evidence',
    rounds: 'Rounds 1-27',
    purpose: 'Earlier recorded variants and Seq2Graph activity labels available to the model.',
    dnaRnaCount: '729,302',
    proteinCount: '256,429',
  },
  {
    label: 'Validation set',
    rounds: 'Round 28',
    purpose: 'Used for learning-rate and hyperparameter selection; not the final claim.',
    dnaRnaCount: '148,014',
    proteinCount: '45,208',
  },
  {
    label: 'Test set',
    rounds: 'Rounds 29-31',
    purpose: 'Future-round candidates used for official reporting and leaderboard ranking.',
    dnaRnaCount: '149,884',
    proteinCount: '108,232',
  },
]

export const leaderboardEntries: LeaderboardEntry[] = [
  {
    id: 'dna-evo2-7b',
    modelName: 'Evo2-7B',
    modelFamily: 'Evo 2',
    modality: 'dna',
    protocol: 'Frozen encoder probe + MLP head',
    validation: { spearman: 0.049, recallAt10: 0.1097, ndcgAt10: 0.2604 },
    test: { spearman: 0.0707, recallAt10: 0.1005, ndcgAt10: 0.3236 },
    notes: 'Best DNA-view test Spearman in the paper baseline table.',
    source: 'Table: Future-round performance on nucleic-acid views',
  },
  {
    id: 'dna-evo2-40b',
    modelName: 'Evo2-40B',
    modelFamily: 'Evo 2',
    modality: 'dna',
    protocol: 'Frozen encoder probe + MLP head',
    validation: { spearman: 0.098, recallAt10: 0.1157, ndcgAt10: 0.2702 },
    test: { spearman: 0.0675, recallAt10: 0.1003, ndcgAt10: 0.3244 },
    notes: 'Strongest validation row among DNA baselines; final ranking should use the test stage.',
    source: 'Table: Future-round performance on nucleic-acid views',
  },
  {
    id: 'dna-nt-50m',
    modelName: 'NT-50M',
    modelFamily: 'Nucleotide Transformer',
    modality: 'dna',
    protocol: 'Frozen encoder probe + MLP head',
    validation: { spearman: 0.0401, recallAt10: 0.0959, ndcgAt10: 0.2464 },
    test: { spearman: 0.0166, recallAt10: 0.095, ndcgAt10: 0.3109 },
    notes: 'Baseline config represented in the public code repository.',
    source: 'Table: Future-round performance on nucleic-acid views',
  },
  {
    id: 'dna-nt-100m',
    modelName: 'NT-100M',
    modelFamily: 'Nucleotide Transformer',
    modality: 'dna',
    protocol: 'Frozen encoder probe + MLP head',
    validation: { spearman: 0.052, recallAt10: 0.0982, ndcgAt10: 0.2485 },
    test: { spearman: 0.0045, recallAt10: 0.087, ndcgAt10: 0.3048 },
    notes: 'Future-round ranking remains near random despite interpolation-capable labels.',
    source: 'Table: Future-round performance on nucleic-acid views',
  },
  {
    id: 'dna-nt-250m',
    modelName: 'NT-250M',
    modelFamily: 'Nucleotide Transformer',
    modality: 'dna',
    protocol: 'Frozen encoder probe + MLP head',
    validation: { spearman: 0.047, recallAt10: 0.0858, ndcgAt10: 0.2137 },
    test: { spearman: 0.0006, recallAt10: 0.0971, ndcgAt10: 0.3085 },
    notes: 'Included to show that larger nucleotide encoders do not close the future-round gap.',
    source: 'Table: Future-round performance on nucleic-acid views',
  },
  {
    id: 'dna-nt-500m',
    modelName: 'NT-500M',
    modelFamily: 'Nucleotide Transformer',
    modality: 'dna',
    protocol: 'Frozen encoder probe + MLP head',
    validation: { spearman: 0.0361, recallAt10: 0.0985, ndcgAt10: 0.2225 },
    test: { spearman: 0.0189, recallAt10: 0.1005, ndcgAt10: 0.3079 },
    notes: 'Largest NT baseline reported in the nucleic-acid future-round table.',
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
    notes: 'RNA-specific model using the T-to-U view under the same replay protocol.',
    source: 'Table: Future-round performance on nucleic-acid views',
  },
  {
    id: 'rna-og-418m',
    modelName: 'OG-418M',
    modelFamily: 'OmniGenome',
    modality: 'rna',
    protocol: 'Frozen encoder probe + MLP head',
    validation: { spearman: 0.0078, recallAt10: 0.0949, ndcgAt10: 0.2391 },
    test: { spearman: 0.0048, recallAt10: 0.0859, ndcgAt10: 0.3042 },
    notes: 'The larger OmniGenome baseline remains in the low-Spearman future-round regime.',
    source: 'Table: Future-round performance on nucleic-acid views',
  },
  {
    id: 'protein-esm2-35m',
    modelName: 'ESM2-35M',
    modelFamily: 'ESM2',
    modality: 'protein',
    protocol: 'Frozen encoder probe + MLP head',
    validation: { spearman: 0.1591, recallAt10: 0.1449, ndcgAt10: 0.6533 },
    test: { spearman: 0.03, recallAt10: 0.1379, ndcgAt10: 0.3281 },
    notes: 'Best protein-view test Recall@10% and nDCG@10% in the reported baselines.',
    source: 'Table: Future-round performance on protein view',
  },
  {
    id: 'protein-esm2-150m',
    modelName: 'ESM2-150M',
    modelFamily: 'ESM2',
    modality: 'protein',
    protocol: 'Frozen encoder probe + MLP head',
    validation: { spearman: 0.1458, recallAt10: 0.142, ndcgAt10: 0.6569 },
    test: { spearman: 0.0416, recallAt10: 0.123, ndcgAt10: 0.3068 },
    notes: 'Mid-scale ESM2 baseline under the same future-round replay setting.',
    source: 'Table: Future-round performance on protein view',
  },
  {
    id: 'protein-esm2-650m',
    modelName: 'ESM2-650M',
    modelFamily: 'ESM2',
    modality: 'protein',
    protocol: 'Frozen encoder probe + MLP head',
    validation: { spearman: 0.1423, recallAt10: 0.1473, ndcgAt10: 0.653 },
    test: { spearman: 0.0479, recallAt10: 0.112, ndcgAt10: 0.2791 },
    notes: 'Large ESM2 baseline; future-round Spearman remains far below random-split interpolation.',
    source: 'Table: Future-round performance on protein view',
  },
  {
    id: 'protein-prot-bert',
    modelName: 'Prot-BERT',
    modelFamily: 'ProtTrans',
    modality: 'protein',
    protocol: 'Frozen encoder probe + MLP head',
    validation: { spearman: 0.128, recallAt10: 0.1128, ndcgAt10: 0.6534 },
    test: { spearman: 0.0214, recallAt10: 0.1162, ndcgAt10: 0.298 },
    notes: 'ProtTrans baseline included in the protein-view comparison.',
    source: 'Table: Future-round performance on protein view',
  },
  {
    id: 'protein-prot-xlnet',
    modelName: 'Prot-XLNET',
    modelFamily: 'ProtTrans',
    modality: 'protein',
    protocol: 'Frozen encoder probe + MLP head',
    validation: { spearman: 0.157, recallAt10: 0.1261, ndcgAt10: 0.6589 },
    test: { spearman: 0.0342, recallAt10: 0.1175, ndcgAt10: 0.2895 },
    notes: 'Strong validation nDCG but still low final future-round Spearman.',
    source: 'Table: Future-round performance on protein view',
  },
  {
    id: 'protein-esmc-300m',
    modelName: 'ESMC-300M',
    modelFamily: 'ESM Cambrian',
    modality: 'protein',
    protocol: 'Frozen encoder probe + MLP head',
    validation: { spearman: 0.1498, recallAt10: 0.1199, ndcgAt10: 0.6495 },
    test: { spearman: 0.0355, recallAt10: 0.1151, ndcgAt10: 0.2867 },
    notes: 'Representative ESMC baseline used in finite-budget discovery diagnostics.',
    source: 'Table: Future-round performance on protein view',
  },
  {
    id: 'protein-esmc-600m',
    modelName: 'ESMC-600M',
    modelFamily: 'ESM Cambrian',
    modality: 'protein',
    protocol: 'Frozen encoder probe + MLP head',
    validation: { spearman: 0.1452, recallAt10: 0.1206, ndcgAt10: 0.6397 },
    test: { spearman: 0.0509, recallAt10: 0.118, ndcgAt10: 0.286 },
    notes: 'Best protein-view test Spearman in the reported frozen-encoder baselines.',
    source: 'Table: Future-round performance on protein view',
  },
]

export const randomSplitProteinControls = [
  { modelName: 'ESMC-600M', testSpearman: 0.8079, testRecallAt10: 0.2317, testNdcgAt10: 0.4949 },
  { modelName: 'ESMC-300M', testSpearman: 0.8067, testRecallAt10: 0.2363, testNdcgAt10: 0.4995 },
  { modelName: 'ESM2-35M', testSpearman: 0.8014, testRecallAt10: 0.1617, testNdcgAt10: 0.4814 },
]

export const diagnosticFindings = [
  {
    label: 'Random split is diagnostic',
    value: '8:1:1',
    detail: 'Protein random split shows label interpolation near rho=0.8, but it is not the official leaderboard task.',
  },
  {
    label: 'Future-round gap persists',
    value: '<=0.071',
    detail: 'Best reported future-round test Spearman across DNA/RNA/protein frozen probes stays around 0.1 or below.',
  },
  {
    label: 'Finite-budget selection',
    value: 'K=96 / 384',
    detail: 'Representative protein baselines recover no true top-1% variants in the reported discovery-mode check.',
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
