import type { Boid } from "./boids";
import type { Predator } from "./predator";
import type { World } from "./world";

export class Renderer {
  private ctx: CanvasRenderingContext2D;
  private world: World;
  constructor(ctx: CanvasRenderingContext2D, world: World) {
    this.ctx = ctx;
    this.world = world;
  }

  render() {
    this.world.boids.forEach((boid) => {
      this.renderBoid(boid);
    });
    this.world.predators.forEach((predator) => {
      this.renderPredator(predator);
    });
    this.renderMouseAttractionArea();
  }

  renderMouseAttractionArea() {
    const mousePosition = this.world.mousePosition;
    if (!mousePosition) return;

    this.ctx.save();
    this.ctx.fillStyle = "none";
    this.ctx.strokeStyle = "white";
    this.ctx.setLineDash([5, 5]);

    const radius = this.world.parameters.value.mouseRadius;
    this.ctx.strokeStyle = "white";
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();
    this.ctx.arc(mousePosition.x, mousePosition.y, radius, 0, Math.PI * 2);
    this.ctx.stroke();

    this.ctx.restore();
  }

  renderBoid(boid: Boid) {
    const position = boid.position;
    const direction = boid.velocity.normalize();
    this.ctx.save();
    this.ctx.translate(position.x, position.y);
    this.ctx.rotate(direction.angle());
    this.ctx.beginPath();
    this.ctx.moveTo(5, 0);
    this.ctx.lineTo(-5, 3);
    this.ctx.lineTo(-5, -3);
    this.ctx.fill();
    this.ctx.restore();
  }

  renderPredator(predator: Predator) {
    const position = predator.position;
    const direction = predator.velocity.normalize();
    this.ctx.save();
    this.ctx.translate(position.x, position.y);
    this.ctx.rotate(direction.angle());
    this.ctx.fillStyle = "red";
    this.ctx.beginPath();
    this.ctx.moveTo(8, 0);
    this.ctx.lineTo(-8, 8);
    this.ctx.lineTo(-8, -8);
    this.ctx.fill();
    this.ctx.restore();
  }
}
