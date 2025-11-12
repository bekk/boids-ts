/** En timer som holder styr på gjennomsnittlig tid over et rullende vindu */
export class RollingIntervalTimer {
  private sampleCount: number;
  private samples: number[];
  private currentIndex = 0;
  private lastTime: number;
  private total: number;

  /**
   * Oppretter en ny RollingIntervalTimer
   * @param sampleCount Antall samples å ta gjennomsnitt over
   * @param initialAverage Initiell gjennomsnittlig verdi, i millisekunder
   */
  constructor(sampleCount: number = 100, initialAverage: number = 0) {
    this.sampleCount = sampleCount;
    this.lastTime = performance.now();
    this.samples = new Array<number>(sampleCount).fill(initialAverage);
    this.total = initialAverage * sampleCount;
  }

  /** Registrerer et nytt tidsstempel */
  mark() {
    const now = performance.now();
    const delta = now - this.lastTime;
    this.lastTime = now;

    // total er løpende - vi fjerner den eldste og legger til den nyeste
    this.total += delta - this.samples[this.currentIndex];
    this.samples[this.currentIndex] = delta;
    this.currentIndex = (this.currentIndex + 1) % this.sampleCount;
  }

  /** Gjennomsnittlig tid mellom markeringer, i millisekunder */
  get average(): number {
    return this.total / this.samples.length;
  }
}
