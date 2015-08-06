import Fuzzy from 'clj-fuzzy';
import R from 'ramda';

const keywordList = [
  {
    'keyword': 'sofa',
    'syns': [
      'futon',
      'settee'
    ]
  },
  {
    'keyword': 'bed',
    'syns': [
      'divan',
      'chesterfield'
    ]
  },
  {
    'keyword': 'vacuum',
    'syns': []
  }
];

const tests = ['vaccum', 'vacuum', 'sofa', 'soda', 'futin', 'futon', 'bad', 'bed', 'devan', 'setter', 'settee', 'chisterfeld'];
const expectedResults = ['vacuum', 'vacuum', 'sofa', 'sofa', 'sofa', 'sofa', 'bed', 'bed', 'bed', 'sofa', 'sofa', 'bed'];
const THRESHOLD = 0.5;
const distanceMatcher = Fuzzy.metrics.jaccard;

const testsMapper = (test) => {
  const kwExtractor = R.compose(R.nth(0), R.pluck('keyword'), R.filter);
  const directMatchedKW = kwExtractor(R.where({ keyword: R.equals(test) }), keywordList);
  const correctedMatchedKW = kwExtractor(kw => distanceMatcher(kw.keyword, test) <= THRESHOLD, keywordList);
  const directSynMatchedKW = kwExtractor(R.where({ syns: R.contains(test) }), keywordList);
  const correctedSynMatchedKW = kwExtractor(kw => R.length(R.filter(syn => distanceMatcher(syn, test) <= THRESHOLD, kw.syns)), keywordList);
  return directMatchedKW || correctedMatchedKW || directSynMatchedKW || correctedSynMatchedKW || test;
};

const computedResults = R.map(testsMapper, tests);
console.log(R.equals(expectedResults, computedResults));

const testText = '1 vaccuum, several chests of drawers, 2 sodas';
const tokenized = testText.split(/\s+/);
console.log(tokenized);
const punctuatedTokens = R.flatten(R.map((token) => token.split(/\b/), tokenized));
console.log(punctuatedTokens);
const correctedTokens = R.map(testsMapper, punctuatedTokens);
console.log(correctedTokens.join(' '));
