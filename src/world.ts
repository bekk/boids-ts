import { NaiveBoidCollection, type BoidCollection } from "./boidCollection";
import { calculateBoidForces, type Boid } from "./boids";
import { PersistedParameters } from "./parameters";
import { Predator } from "./predator";
import { clamp } from "./utils/math";
import { Vector2 } from "./utils/vector2";

export class World {
  width: number;
  height: number;
  boids: Boid[];
  predators: Predator[];
  collection: BoidCollection;
  mousePosition: Vector2 | null = null;
  parameters: PersistedParameters;

  private isInitialized = false;

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
    this.boids = [];
    this.collection = new NaiveBoidCollection(
      this.boids,
      this.parameters.value.neighborRadius
    );

    this.predators = [];
    this.parameters.onChange("numPredators", (newNumPredators) =>
      this.setNumberOfPredators(newNumPredators)
    );
  }

  private initalize() {
    // må vente med å initialisere predators til etter at konstruktøren er ferdig
    this.setNumberOfBoids(this.parameters.value.numBoids);
    this.setNumberOfPredators(this.parameters.value.numPredators);
    this.isInitialized = true;
  }

  update(deltaTime: number) {
    if (!this.isInitialized) {
      this.initalize();
      return;
    }

    this.predators.forEach((predator) => {
      predator.update(deltaTime);
    });

    /*
    For hver boid gjøres følgende:
      1. beregn krefter basert på naboer og parametere
      2. oppdater hastighet basert på krefter og deltaTime
      3. oppdater posisjon basert på hastighet
     */

    /* Beregn krefter og oppdater hastighet
    Vi kan trygt gjøre dette i samme løkke, fordi ingen krefter er påvirket av boid.velocity

    boid.position må oppdateres i egen løkke, for å unngå at boids leser av nye posisjoner fra naboene sine*/
    this.boids.forEach((boid) => {
      const force = calculateBoidForces(boid, this);

      boid.velocity = boid.velocity.add(force.mul(deltaTime));

      // sett lengden av velocity til å være mellom minSpeed og maxSpeed etter å ha lagt til kraften
      const speed = boid.velocity.length();
      const maxSpeed = this.parameters.value.maxSpeed;
      const desiredSpeed = clamp(
        speed,
        this.parameters.value.minSpeed,
        maxSpeed
      );
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

  private createPredator(): Predator {
    const speed = 100;
    return new Predator(
      new Vector2(Math.random() * this.width, Math.random() * this.height),
      new Vector2(Math.random() - 0.5, Math.random() - 0.5)
        .normalize()
        .mul(speed),
      this
    );
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

  private setNumberOfPredators(newCount: number) {
    const currentCount = this.predators.length;
    if (newCount > currentCount) {
      for (let i = currentCount; i < newCount; i++) {
        this.predators.push(this.createPredator());
      }
    } else if (newCount < currentCount) {
      this.predators.splice(newCount, currentCount - newCount);
    }
  }
}
