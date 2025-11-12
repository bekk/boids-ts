import type { Boid } from "./boids";
import { createUi } from "./createUi";
import type { Predator } from "./predator";
import "./style.css";
import { nonNegativeRollingIntervalTimer } from "./timer";
import { clamp } from "./utils/math";
import { Vector2 } from "./vector2";
import { World } from "./world";

function setupCanvas() {
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  const ctx = canvas.getContext("2d");
  canvas.addEventListener("mousemove", (event) => onMouseMove(event, canvas));
  canvas.addEventListener("mouseleave", () => {
    world.mousePosition = null;
  });
  window.addEventListener(
    "wheel",
    (event: WheelEvent) => {
      if (world.mousePosition === null) return;
      const targetValue =
        world.parameters.value.mouseRadius + event.deltaY * 0.2;
      world.parameters.setParameter("mouseRadius", clamp(targetValue, 10, 500));
      event.preventDefault();
      event.stopPropagation();
    },
    { passive: false }
  );
  if (!ctx) {
    throw new Error("Failed to get canvas 2D context");
  }
  return { canvas, ctx };
}

function onMouseMove(event: MouseEvent, canvas: HTMLCanvasElement) {
  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  world.mousePosition = new Vector2(mouseX, mouseY);
}

const timer = nonNegativeRollingIntervalTimer();
let lastTime = 0;
function render(
  timeInMs: number,
  world: World,
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D
) {
  const actualDeltaTime = (timeInMs - lastTime) / 1000;
  // clamp deltaTime for å unngå store hopp ved f.eks. fanebytte eller debugging
  const deltaTime = clamp(actualDeltaTime, 0.001, 0.1);
  timer.mark();

  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  ctx.fillStyle = "white";
  ctx.fillText("FPS: " + (1000 / timer.getAverage()).toFixed(1), 10, 20);
  world.update(deltaTime);
  world.boids.forEach((boid) => {
    drawBoid(ctx, boid);
  });
  world.predators.forEach((predator) => {
    drawPredator(ctx, predator);
  });
  drawMouseAttractionArea(ctx, world);
  lastTime = timeInMs;
  requestAnimationFrame((newTime) => render(newTime, world, canvas, ctx));
}

function drawBoid(ctx: CanvasRenderingContext2D, boid: Boid) {
  const position = boid.position;
  const direction = boid.velocity.normalize();
  ctx.save();
  ctx.translate(position.x, position.y);
  ctx.rotate(direction.angle());
  ctx.beginPath();
  ctx.moveTo(5, 0);
  ctx.lineTo(-5, 3);
  ctx.lineTo(-5, -3);
  ctx.fill();
  ctx.restore();
}

function drawPredator(ctx: CanvasRenderingContext2D, predator: Predator) {
  const position = predator.position;
  const direction = predator.velocity.normalize();
  ctx.save();
  ctx.translate(position.x, position.y);
  ctx.rotate(direction.angle());
  ctx.fillStyle = "red";
  ctx.beginPath();
  ctx.moveTo(8, 0);
  ctx.lineTo(-8, 8);
  ctx.lineTo(-8, -8);
  ctx.fill();
  ctx.restore();
}

function drawMouseAttractionArea(ctx: CanvasRenderingContext2D, world: World) {
  const mousePosition = world.mousePosition;
  if (!mousePosition) return;

  ctx.save();
  ctx.fillStyle = "none";
  ctx.strokeStyle = "white";
  ctx.setLineDash([5, 5]);

  const radius = world.parameters.value.mouseRadius;
  ctx.strokeStyle = "white";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(mousePosition.x, mousePosition.y, radius, 0, Math.PI * 2);
  ctx.stroke();

  ctx.restore();
}

const { canvas, ctx } = setupCanvas();

const world = new World(1280, 720);
createUi(world.parameters);
render(0, world, canvas, ctx);
