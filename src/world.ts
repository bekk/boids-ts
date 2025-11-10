import {
  spatialHashBoidCollection,
  type SpatialHashBoidCollection,
} from "./boidCollection";
import { calculateBoidForces, type Boid } from "./boids";
import { Parameters } from "./parameters";
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
    this.boids = Array.from({ length: this.parameters.numBoids }, () =>
      this.createBoid()
    );
    this.boids[0].isHero = true;
    this.collection = spatialHashBoidCollection(
      this.width,
      this.height,
      this.boids,
      this.parameters.neighborRadius,
      this.parameters.detectionAngle
    );
  }

  update(deltaTime: number) {
    this.collection.buildGrid();
    this.boids.forEach((boid) => {
      boid.isNeighbor = false;
    });
    this.boids.forEach((boid) => {
      const force = calculateBoidForces(boid, this.collection, this.parameters);
      //.mul(deltaTime * this.parameters.totalForceWeight);
      boid.velocity = boid.velocity
        .add(force)
        .limit(this.parameters.maxSpeed / 100);
    });
    this.boids.forEach((boid) => {
      boid.position = boid.position.add(boid.velocity);
      boid.position.x = (boid.position.x + this.width) % this.width;
      boid.position.y = (boid.position.y + this.height) % this.height;
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
        .mul(this.parameters.maxSpeed),
      isHero: false,
      isNeighbor: false,
    };
  }

  setNumberOfBoids(newCount: number) {
    const currentCount = this.boids.length;
    if (newCount > currentCount) {
      for (let i = currentCount; i < newCount; i++) {
        this.boids.push(this.createBoid());
      }
    } else if (newCount < currentCount) {
      this.boids.splice(newCount, currentCount - newCount);
    }
    this.parameters.numBoids = newCount;
    this.collection.setBoids(this.boids);
  }

  setDetectionRadius(radius: number) {
    this.collection.setDetectionRadius(radius);
    this.parameters.neighborRadius = radius;
  }
  setDetectionAngle(angle: number) {
    this.collection.setDetectionAngle(angle);
    this.parameters.detectionAngle = angle;
  }
  setCohesionWeight(weight: number) {
    this.parameters.cohesionWeight = weight;
  }
  setAlignmentWeight(weight: number) {
    this.parameters.alignmentWeight = weight;
  }
  setSeparationWeight(weight: number) {
    this.parameters.separationWeight = weight;
  }
  setTotalForceWeight(weight: number) {
    this.parameters.totalForceWeight = weight;
  }
  setMaxSpeed(speed: number) {
    this.parameters.maxSpeed = speed;
  }
  setMousePosition(position: Vector2) {
    this.mousePosition = position;
  }
  setTurningWeight(weight: number) {
    this.parameters.turningWeight = weight;
  }
}
