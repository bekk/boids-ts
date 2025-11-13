import { createUi } from "./ui/createUi";
import { Renderer } from "./renderer";
import "./style.css";
import { RollingIntervalTimer } from "./utils/rollingIntervalTimer";
import { World } from "./world";
import { setupEventListeners } from "./ui/eventListeners";
import { setupCanvas } from "./ui/canvas";

let lastTime = 0;
function render(timeInMs: number) {
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

  requestAnimationFrame((newTime) => render(newTime));
}

const size = { width: 960, height: 540 };
const { canvas, ctx } = setupCanvas(size.width, size.height);
const world = new World(size.width, size.height);
const renderer = new Renderer(ctx, world);
const timer = new RollingIntervalTimer();

setupEventListeners(canvas, world);
createUi(world.parameters);
render(0);
