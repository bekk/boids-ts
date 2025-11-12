import type { Boid } from "./boids";

/** Representerer en samling boids, med muligheten for å hente naboer til en gitt boid basert på en deteksjonsradius */
export interface BoidCollection {
  /** Henter alle boids innenfor deteksjonsradiusen til den gitte boiden */
  getNeighbors(boid: Boid): Boid[];
  /** Setter hvilke boids som er i samlingen */
  setBoids(boids: Boid[]): void;
  /** Setter deteksjonsradiusen brukt for å finne naboer */
  setDetectionRadius(radius: number): void;
}

/** Naiv n^2 implementasjon av {@link BoidCollection} \
 * For hver boid, sjekkes alle andre boids for å se om de er innenfor deteksjonsradiusen
 */
export class NaiveBoidCollection implements BoidCollection {
  private _boids: Boid[];
  private _detectionRadiusSq: number;

  constructor(boids: Boid[], detectionRadius: number) {
    this._boids = boids;
    this._detectionRadiusSq = detectionRadius * detectionRadius;
  }

  private isInDetectionArea(boid: Boid, other: Boid): boolean {
    const vectorToOther = other.position.sub(boid.position);
    return vectorToOther.lengthSquared() <= this._detectionRadiusSq;
  }

  getNeighbors(boid: Boid): Boid[] {
    return this._boids.filter(
      (other) => other !== boid && this.isInDetectionArea(boid, other)
    );
  }
  setDetectionRadius(radius: number): void {
    this._detectionRadiusSq = radius * radius;
  }
  setBoids(newBoids: Boid[]): void {
    this._boids = newBoids;
  }
}
