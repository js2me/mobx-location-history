import { readFile } from 'node:fs/promises';

const [, , baselinePath, currentPath] = process.argv;
const regressionThreshold = 0.1;

if (!baselinePath || !currentPath) {
  console.error('Usage: node scripts/check-benchmark.mjs <baseline> <current>');
  process.exit(1);
}

const [baseline, current] = await Promise.all([
  readFile(baselinePath, 'utf8').then(JSON.parse),
  readFile(currentPath, 'utf8').then(JSON.parse),
]);

const currentBenchmarks = new Map(
  current.files.flatMap((file) =>
    file.groups.flatMap((group) =>
      group.benchmarks.map((benchmark) => [benchmark.name, benchmark]),
    ),
  ),
);

let hasRegression = false;

for (const benchmark of baseline.benchmarks) {
  const result = currentBenchmarks.get(benchmark.name);

  if (!result) {
    console.error(`Missing benchmark: ${benchmark.name}`);
    hasRegression = true;
    continue;
  }

  const change = result.mean / benchmark.mean - 1;
  const changePercent = (change * 100).toFixed(2);
  const status = change > regressionThreshold ? 'FAIL' : 'PASS';

  console.log(
    `${status} ${benchmark.name}: ${benchmark.mean.toFixed(4)}ms -> ${result.mean.toFixed(4)}ms (${changePercent}%)`,
  );

  if (change > regressionThreshold) {
    hasRegression = true;
  }
}

if (hasRegression) {
  console.error(`Benchmark regression exceeds ${(regressionThreshold * 100).toFixed(0)}%`);
  process.exit(1);
}
