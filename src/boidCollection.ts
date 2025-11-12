import type { Boid, BoidCollection } from "./boids";
import type { Vector2 } from "./vector2";

export function naiveBoidCollection(
  boids: Boid[],
  detectionRadius: number
): BoidCollection {
  const detectionRadiusSq = detectionRadius * detectionRadius;
  function isInDetectionArea(boid: Boid, other: Boid): boolean {
    const vectorToOther = other.position.sub(boid.position);
    return vectorToOther.lengthSquared() <= detectionRadiusSq;
  }

  return {
    getNeighbors(boid: Boid): Boid[] {
      return boids.filter(
        (other) => other !== boid && isInDetectionArea(boid, other)
      );
    },
    setDetectionRadius(radius: number): void {
      detectionRadius = radius;
    },
    setBoids(newBoids: Boid[]): void {
      boids = newBoids;
    },
  };
}

export interface SpatialHashBoidCollection extends BoidCollection {
  buildGrid(): void;
}

export function spatialHashBoidCollection(
  width: number,
  height: number,
  boids: Boid[],
  detectionRadius: number
): SpatialHashBoidCollection {
  let _boids = boids;
  let _detectionRadius2 = detectionRadius * detectionRadius;
  const cellSize = detectionRadius;
  const cols = Math.ceil(width / cellSize);
  const rows = Math.ceil(height / cellSize);

  let grid = new Array(cols * rows).fill(-1);
  let next = new Array(_boids.length).fill(-1);

  function hashPosition(position: Vector2): number {
    const col = Math.floor(position.x / cellSize) % cols;
    const row = Math.floor(position.y / cellSize) % rows;
    return row * cols + col;
  }

  function buildGrid() {
    grid.fill(-1);
    next.fill(-1);
    boids.forEach((boid, index) => {
      const hash = hashPosition(boid.position);
      next[index] = grid[hash];
      grid[hash] = index;
    });
  }

  function isInDetectionArea(boid: Boid, other: Boid): boolean {
    const vectorToOther = other.position.sub(boid.position);
    return vectorToOther.lengthSquared() <= _detectionRadius2;
  }

  function getNeighbors(boid: Boid): Boid[] {
    const neighbors: Boid[] = [];
    const baseHash = hashPosition(boid.position);
    const baseCol = baseHash % cols;
    const baseRow = Math.floor(baseHash / cols);

    const minRow = Math.max(0, baseRow - 1);
    const maxRow = Math.min(rows - 1, baseRow + 1);
    const minCol = Math.max(0, baseCol - 1);
    const maxCol = Math.min(cols - 1, baseCol + 1);

    for (let row = minRow; row <= maxRow; row++) {
      for (let col = minCol; col <= maxCol; col++) {
        const hash = row * cols + col;
        let index = grid[hash];
        while (index !== -1) {
          const otherBoid = boids[index];
          if (otherBoid !== boid && isInDetectionArea(boid, otherBoid)) {
            neighbors.push(otherBoid);
          }
          index = next[index];
        }
      }
    }

    return neighbors;
  }
  return {
    buildGrid,
    getNeighbors,
    setDetectionRadius(radius: number): void {
      _detectionRadius2 = radius * radius;
    },
    setBoids(boids: Boid[]): void {
      _boids = boids;
    },
  };
}
