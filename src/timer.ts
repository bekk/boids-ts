export function nonNegativeRollingIntervalTimer(sampleCount: number = 100) {
  const samples = new Array<number>(sampleCount).fill(0);
  let currentIndex = 0;
  let lastTime = performance.now();
  let total = 0;

  function mark() {
    const now = performance.now();
    const delta = now - lastTime;
    lastTime = now;

    total += delta - samples[currentIndex];
    samples[currentIndex] = delta;
    currentIndex = (currentIndex + 1) % sampleCount;
  }

  function getAverage() {
    return total / sampleCount;
  }

  return { mark, getAverage };
}
