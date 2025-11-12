import type { Boid } from "./boids";
import { clamp } from "./utils/math";
import { Vector2 } from "./utils/vector2";
import type { World } from "./world";

/**
 * Representerer et rovdyr i simuleringen som jakter på boids.\
 * Hvert rovdyr velger seg ut et bytte (boid) å jakte på, og beveger seg mot det.
 */
export class Predator {
  position: Vector2;
  velocity: Vector2;
  private currentPrey: Boid | null = null;
  private world: World;
  private turnRadius = 50;

  constructor(position: Vector2, velocity: Vector2, world: World) {
    this.position = position;
    this.velocity = velocity;
    this.world = world;
  }

  /**
   * Oppdaterer rovdyrens posisjon og retning
   * @param deltaTime
   */
  update(deltaTime: number) {
    /* Velg bytte */

    if (this.currentPrey === null || Math.random() < 0.01) {
      const potentialPrey =
        this.world.boids[Math.floor(Math.random() * this.world.boids.length)];
      if (potentialPrey) {
        this.currentPrey = potentialPrey;
      }
    }

    if (this.currentPrey) {
      this.updateVelocity(this.currentPrey.position, deltaTime);
    }

    this.position = this.position.add(this.velocity.mul(deltaTime));

    // Wrap around world edges
    if (this.position.x < 0) this.position.x += this.world.width;
    if (this.position.x >= this.world.width)
      this.position.x -= this.world.width;
    if (this.position.y < 0) this.position.y += this.world.height;
    if (this.position.y >= this.world.height)
      this.position.y -= this.world.height;
  }

  private updateVelocity(preyPosition: Vector2, deltaTime: number) {
    const toPrey = preyPosition.sub(this.position);

    // sjekk om man kan ta "snarveien" rundt world edges
    if (toPrey.x > this.world.width / 2) {
      toPrey.x -= this.world.width;
    } else if (toPrey.x < -this.world.width / 2) {
      toPrey.x += this.world.width;
    }
    if (toPrey.y > this.world.height / 2) {
      toPrey.y -= this.world.height;
    } else if (toPrey.y < -this.world.height / 2) {
      toPrey.y += this.world.height;
    }

    // finn maksimal svingvinkel for denne framen
    const targetSpeed = this.world.parameters.value.predatorSpeed;
    const angularVelocity =
      this.world.parameters.value.predatorSpeed / this.turnRadius;
    const maxTurnAngle = angularVelocity * deltaTime;

    // må null-sjekke velocity, hvis ikke kommer man seg aldri vekk fra (0,0)
    // bruker (1, 0) som fallback, for det stemmer overens med hvordan det ser ut visuelt
    const currentDirection =
      this.velocity.length() > 0
        ? this.velocity.normalize()
        : new Vector2(1, 0);
    const desiredDirection = toPrey.normalize();
    const angleToPrey = currentDirection.angleTo(desiredDirection);
    const clampedTurnAngle = clamp(angleToPrey, -maxTurnAngle, maxTurnAngle);

    this.velocity = this.velocity
      .rotate(clampedTurnAngle)
      .normalize()
      .mul(targetSpeed);
  }
}
