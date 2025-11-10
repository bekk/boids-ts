import type { Boid } from "./boids";
import { createUi } from "./createUi";
import "./style.css";
import { nonNegativeRollingIntervalTimer } from "./timer";
import { Vector2 } from "./vector2";
import { World } from "./world";

let mousePosition = new Vector2(0, 0);
function setupCanvas() {
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  const ctx = canvas.getContext("2d");
  canvas.addEventListener("mousemove", (event) => onMouseMove(event, canvas));
  if (!ctx) {
    throw new Error("Failed to get canvas 2D context");
  }
  return { canvas, ctx };
}

function onMouseMove(event: MouseEvent, canvas: HTMLCanvasElement) {
  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  mousePosition.x = mouseX;
  mousePosition.y = mouseY;
  world.setMousePosition(mousePosition);
}

const timer = nonNegativeRollingIntervalTimer();
let lastTime = 0;
function render(
  timeInMs: number,
  world: World,
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D
) {
  const deltaTime = (timeInMs - lastTime) / 1000 || 0.016;
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

  lastTime = timeInMs;
  requestAnimationFrame((newTime) => render(newTime, world, canvas, ctx));
}

function drawBoid(ctx: CanvasRenderingContext2D, boid: Boid) {
  const position = boid.position;
  const direction = boid.velocity.normalize();
  ctx.save();
  if (boid.isHero) {
    ctx.fillStyle = "red";
  } else if (boid.isNeighbor) {
    ctx.fillStyle = "yellow";
  }
  ctx.translate(position.x, position.y);
  ctx.rotate(direction.angle());
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(-12, 5);
  ctx.lineTo(-12, -5);
  ctx.fill();
  ctx.restore();
}

const { canvas, ctx } = setupCanvas();

const world = new World(1280, 720);
createUi(world);
render(0, world, canvas, ctx);
