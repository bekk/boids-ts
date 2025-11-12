import { createUi } from "./createUi";
import { Renderer } from "./draw";
import "./style.css";
import { RollingIntervalTimer } from "./timer";
import { clamp } from "./utils/math";
import { Vector2 } from "./utils/vector2";
import { World } from "./world";

function setupCanvas(): {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
} {
  const canvas = document.getElementById("canvas");
  if (!(canvas instanceof HTMLCanvasElement)) {
    throw new Error("Canvas element not found");
  }
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Failed to get canvas 2D context");
  }
  return { canvas, ctx };
}

function setupEventListeners(canvas: HTMLCanvasElement, world: World) {
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
      // radius må være større enn 0 for å unngå deling på 0-feil
      world.parameters.setParameter("mouseRadius", clamp(targetValue, 10, 500));
      event.preventDefault();
      event.stopPropagation();
    },
    { passive: false }
  );
}

function onMouseMove(event: MouseEvent, canvas: HTMLCanvasElement) {
  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  world.mousePosition = new Vector2(mouseX, mouseY);
}

const timer = new RollingIntervalTimer();
let lastTime = 0;
function render(
  timeInMs: number,
  world: World,
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D
) {
  const actualDeltaTime = (timeInMs - lastTime) / 1000;
  // clamp deltaTime for å unngå store hopp ved f.eks. fanebytte eller debugging
  const deltaTime = Math.min(actualDeltaTime, 0.1);
  lastTime = timeInMs;
  timer.mark();

  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  ctx.fillStyle = "white";
  ctx.fillText("FPS: " + (1000 / timer.average).toFixed(1), 10, 20);

  world.update(deltaTime);
  renderer.render();

  requestAnimationFrame((newTime) => render(newTime, world, canvas, ctx));
}

const { canvas, ctx } = setupCanvas();
const world = new World(1280, 720);
setupEventListeners(canvas, world);
const renderer = new Renderer(ctx, world);
createUi(world.parameters);
render(0, world, canvas, ctx);
