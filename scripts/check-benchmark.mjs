import { readFile } from 'node:fs/promises';

const [, , baselinePath, ...currentPaths] = process.argv;
const defaultRegressionThreshold = 0.1;
// Sub-0.1ms benchmarks are noisy in shared CI runners. Require a meaningful
// absolute increase in addition to the relative threshold.
const defaultMinimumRegressionMs = 0.02;
// These benchmarks measure jsdom/history-library setup rather than this
// package's own code. Creation is a one-time cost in real apps and the
// numbers fluctuate heavily on shared CI runners, so only fail on a
// catastrophic regression.
const benchmarkOverrides = {
  createBrowserHistory: { regressionThreshold: 1, minimumRegressionMs: 0.15 },
  createHashHistory: { regressionThreshold: 1, minimumRegressionMs: 0.15 },
};

if (!baselinePath || currentPaths.length === 0) {
  console.error(
    'Usage: node scripts/check-benchmark.mjs <baseline> <current> [...current]',
  );
  process.exit(1);
}

const [baseline, ...currentRuns] = await Promise.all([
  readFile(baselinePath, 'utf8').then(JSON.parse),
  ...currentPaths.map((path) => readFile(path, 'utf8').then(JSON.parse)),
]);

const currentBenchmarkRuns = currentRuns.map(
  (current) =>
    new Map(
      current.files.flatMap((file) =>
        file.groups.flatMap((group) =>
          group.benchmarks.map((benchmark) => [benchmark.name, benchmark]),
        ),
      ),
    ),
);

const median = (values) => {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[middle - 1] + sorted[middle]) / 2
    : sorted[middle];
};

let hasRegression = false;

for (const benchmark of baseline.benchmarks) {
  const results = currentBenchmarkRuns
    .map((run) => run.get(benchmark.name)?.mean)
    .filter((mean) => mean != null);

  if (results.length === 0) {
    console.error(`Missing benchmark: ${benchmark.name}`);
    hasRegression = true;
    continue;
  }

  if (results.length !== currentBenchmarkRuns.length) {
    console.error(`Incomplete benchmark: ${benchmark.name}`);
    hasRegression = true;
    continue;
  }

  const currentMean = median(results);
  const change = currentMean / benchmark.mean - 1;
  const changePercent = (change * 100).toFixed(2);
  const {
    regressionThreshold = defaultRegressionThreshold,
    minimumRegressionMs = defaultMinimumRegressionMs,
  } = benchmarkOverrides[benchmark.name] ?? {};
  const isRegression = currentBenchmarkRuns.every((run) => {
    const mean = run.get(benchmark.name)?.mean;

    return (
      mean != null &&
      mean / benchmark.mean - 1 > regressionThreshold &&
      mean - benchmark.mean > minimumRegressionMs
    );
  });
  const status = isRegression ? 'FAIL' : 'PASS';

  console.log(
    `${status} ${benchmark.name}: ${benchmark.mean.toFixed(4)}ms -> ${currentMean.toFixed(4)}ms (${changePercent}%)`,
  );

  hasRegression ||= isRegression;
}

if (hasRegression) {
  console.error(
    `Benchmark regression exceeds ${(defaultRegressionThreshold * 100).toFixed(0)}% and ${defaultMinimumRegressionMs}ms`,
  );
  process.exit(1);
}
