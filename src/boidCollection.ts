import type { Boid, BoidCollection } from "./boids";
import type { Vector2 } from "./vector2";

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

class SpatialHashBoidCollection implements BoidCollection {
  private _boids: Boid[];
  private _detectionRadius2: number;
  private cellSize: number;
  private cols: number;
  private rows: number;
  private grid: number[];
  private next: number[];

  constructor(
    width: number,
    height: number,
    boids: Boid[],
    detectionRadius: number
  ) {
    this._boids = boids;
    this.cellSize = detectionRadius;
    this.cols = Math.ceil(width / this.cellSize);
    this.rows = Math.ceil(height / this.cellSize);

    this.grid = new Array(this.cols * this.rows).fill(-1);
    this.next = new Array(boids.length).fill(-1);
    this._detectionRadius2 = detectionRadius * detectionRadius;
  }

  private hashPosition(position: Vector2): number {
    const col = Math.floor(position.x / this.cellSize) % this.cols;
    const row = Math.floor(position.y / this.cellSize) % this.rows;
    return row * this.cols + col;
  }

  public buildGrid() {
    this.grid.fill(-1);
    this.next.fill(-1);
    this._boids.forEach((boid, index) => {
      const hash = this.hashPosition(boid.position);
      this.next[index] = this.grid[hash];
      this.grid[hash] = index;
    });
  }

  private isInDetectionArea(boid: Boid, other: Boid): boolean {
    const vectorToOther = other.position.sub(boid.position);
    return vectorToOther.lengthSquared() <= this._detectionRadius2;
  }

  public getNeighbors(boid: Boid): Boid[] {
    const neighbors: Boid[] = [];
    const baseHash = this.hashPosition(boid.position);
    const baseCol = baseHash % this.cols;
    const baseRow = Math.floor(baseHash / this.cols);

    const minRow = Math.max(0, baseRow - 1);
    const maxRow = Math.min(this.rows - 1, baseRow + 1);
    const minCol = Math.max(0, baseCol - 1);
    const maxCol = Math.min(this.cols - 1, baseCol + 1);

    for (let row = minRow; row <= maxRow; row++) {
      for (let col = minCol; col <= maxCol; col++) {
        const hash = row * this.cols + col;
        let index = this.grid[hash];
        while (index !== -1) {
          const otherBoid = this._boids[index];
          if (otherBoid !== boid && this.isInDetectionArea(boid, otherBoid)) {
            neighbors.push(otherBoid);
          }
          index = this.next[index];
        }
      }
    }

    return neighbors;
  }
  setDetectionRadius(radius: number): void {
    this._detectionRadius2 = radius * radius;
  }
  setBoids(boids: Boid[]): void {
    this._boids = boids;
  }
}
