import { clamp } from "../utils/math";
import { Vector2 } from "../utils/vector2";
import type { World } from "../world";

export function setupEventListeners(canvas: HTMLCanvasElement, world: World) {
  canvas.addEventListener("mousemove", (event) =>
    onMouseMove(event, canvas, world)
  );

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

function onMouseMove(
  event: MouseEvent,
  canvas: HTMLCanvasElement,
  world: World
) {
  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  world.mousePosition = new Vector2(mouseX, mouseY);
}
