import { naiveBoidCollection } from "./boidCollection";
import { calculateBoidForces, type Boid, type BoidCollection } from "./boids";
import { PersistedParameters } from "./parameters";
import { clamp } from "./utils/math";
import { Vector2 } from "./vector2";

export class World {
  width: number;
  height: number;
  boids: Boid[];
  collection: BoidCollection;
  mousePosition: Vector2 | null = null;
  parameters: PersistedParameters;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.parameters = new PersistedParameters();
    this.parameters.onChange("numBoids", (newNumBoids) =>
      this.setNumberOfBoids(newNumBoids)
    );
    this.parameters.onChange("neighborRadius", (newRadius) => {
      this.collection.setDetectionRadius(newRadius);
    });
    this.boids = Array.from({ length: this.parameters.value.numBoids }, () =>
      this.createBoid()
    );
    this.collection = naiveBoidCollection(
      this.boids,
      this.parameters.value.neighborRadius
    );
  }

  update(deltaTime: number) {
    /*
    For hver boid gjøres følgende:
      1. beregn krefter basert på naboer og parametere
      2. oppdater hastighet basert på krefter og deltaTime
      3. oppdater posisjon basert på hastighet
     */

    /* Beregn krefter og oppdater hastighet
    Vi kan trygt gjøre dette i samme løkke, fordi ingen krefter er påvirket av boid.velocity
    boid.position må oppdateres i egen løkke, for å unngå blanding av gamle og nye verdier */
    this.boids.forEach((boid) => {
      const force = calculateBoidForces(
        boid,
        this.collection,
        this.parameters.value,
        this.mousePosition
      );

      boid.velocity = boid.velocity.add(force.mul(deltaTime));

      // sett lengden av velocity til å være mellom minSpeed og maxSpeed etter å ha lagt til kraften
      const speed = boid.velocity.length();
      const maxSpeed = this.parameters.value.maxSpeed;
      const minSpeed = this.parameters.value.minSpeed;
      const desiredSpeed = clamp(speed, minSpeed, maxSpeed);
      boid.velocity = boid.velocity.normalize().mul(desiredSpeed);
    });

    this.boids.forEach((boid) => {
      boid.position = boid.position
        .add(boid.velocity.mul(deltaTime))
        .clamp(new Vector2(0, 0), new Vector2(this.width, this.height));
    });
  }

  /** Oppretter en ny boid med tilfeldig posisjon og hastighet */
  private createBoid(): Boid {
    const speed =
      Math.random() *
        (this.parameters.value.maxSpeed - this.parameters.value.minSpeed) +
      this.parameters.value.minSpeed;
    return {
      position: new Vector2(
        Math.random() * this.width,
        Math.random() * this.height
      ),
      velocity: new Vector2(Math.random() - 0.5, Math.random() - 0.5)
        .normalize()
        .mul(speed),
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
