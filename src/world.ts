import {
  spatialHashBoidCollection,
  type SpatialHashBoidCollection,
} from "./boidCollection";
import { calculateBoidForces, type Boid } from "./boids";
import { Parameters } from "./parameters";
import { clamp } from "./utils/math";
import { Vector2 } from "./vector2";

export class World {
  width: number;
  height: number;
  boids: Boid[];
  collection: SpatialHashBoidCollection;
  mousePosition: Vector2 = new Vector2(0, 0);

  parameters: Parameters;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.parameters = new Parameters();
    this.parameters.onChange("numBoids", (newNumBoids) =>
      this.setNumberOfBoids(newNumBoids)
    );
    this.parameters.onChange("neighborRadius", (newRadius) => {
      this.collection.setDetectionRadius(newRadius);
    });
    this.boids = Array.from({ length: this.parameters.value.numBoids }, () =>
      this.createBoid()
    );
    this.boids[0].isHero = true;
    this.collection = spatialHashBoidCollection(
      this.width,
      this.height,
      this.boids,
      this.parameters.value.neighborRadius
    );
  }

  update(deltaTime: number) {
    this.collection.buildGrid();
    this.boids.forEach((boid) => {
      boid.isNeighbor = false;
    });
    this.boids.forEach((boid) => {
      const force = calculateBoidForces(
        boid,
        this.collection,
        this.parameters.value
      ).mul(deltaTime * this.parameters.value.totalForceWeight);
      boid.velocity = boid.velocity
        .add(force)
        .limit(this.parameters.value.maxSpeed);
    });
    this.boids.forEach((boid) => {
      boid.position = boid.position.add(boid.velocity);
      boid.position.x = clamp(boid.position.x, 0, this.width);
      boid.position.y = clamp(boid.position.y, 0, this.height);
    });
  }

  private createBoid(): Boid {
    return {
      position: new Vector2(
        Math.random() * this.width,
        Math.random() * this.height
      ),
      velocity: new Vector2(Math.random() - 0.5, Math.random() - 0.5)
        .normalize()
        .mul(this.parameters.value.maxSpeed),
      isHero: false,
      isNeighbor: false,
    };
  }

  private setNumberOfBoids(newCount: number) {
    const currentCount = this.boids.length;
    if (newCount > currentCount) {
      for (let i = currentCount; i < newCount; i++) {
        this.boids.push(this.createBoid());
      }
    } else if (newCount < currentCount) {
      this.boids.splice(newCount, currentCount - newCount);
    }
    this.collection.setBoids(this.boids);
  }
}
