import type { Boid } from "./boids";
import type { Vector2 } from "./vector2";
import type { World } from "./world";

export class Predator {
  position: Vector2;
  velocity: Vector2;
  currentPrey: Boid | null = null;
  world: World;

  constructor(position: Vector2, velocity: Vector2, world: World) {
    this.position = position;
    this.velocity = velocity;
    this.world = world;
  }

  update(deltaTime: number) {
    if (this.currentPrey === null || Math.random() < 0.01) {
      const potentialPrey =
        this.world.boids[Math.floor(Math.random() * this.world.boids.length)];
      if (potentialPrey) {
        this.currentPrey = potentialPrey;
      }
    }

    if (this.currentPrey) {
      const maxSpeed = 300;

      const toPrey = this.currentPrey.position.sub(this.position);
      // check if its faster to wrap around the world edges
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

      const turnRadius = 50;
      const angleToPrey = this.velocity.angle(toPrey);
      const angularVelocity = maxSpeed / turnRadius;
      const maxTurnAngle = angularVelocity * deltaTime;
      const clampedTurnAngle = Math.min(Math.abs(angleToPrey), maxTurnAngle);
      const turnDirection = angleToPrey < 0 ? -1 : 1;

      this.velocity = this.velocity
        .rotate(clampedTurnAngle * turnDirection)
        .normalize()
        .mul(maxSpeed);
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
}
