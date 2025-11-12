import type { Boid, BoidCollection } from "./boids";

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
