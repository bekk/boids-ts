import { createSlider } from "./createSliders";
import type { World } from "./world";

export function createUi(world: World) {
  const sliderContainer = document.querySelector("#sliders") as HTMLElement;
  createSlider(
    sliderContainer,
    "Number of Boids",
    100,
    2000,
    100,
    world.parameters.numBoids,
    (newNumBoids) => world.setNumberOfBoids(newNumBoids)
  );
  createSlider(
    sliderContainer,
    "Neighbor Radius",
    10,
    100,
    5,
    world.parameters.neighborRadius,
    (newRadius) => {
      world.setDetectionRadius(newRadius);
    }
  );
  createSlider(
    sliderContainer,
    "Boid Speed",
    50,
    1000,
    50,
    world.parameters.maxSpeed,
    (newSpeed) => {
      world.setMaxSpeed(newSpeed);
    }
  );
  createSlider(
    sliderContainer,
    "Separation Weight",
    0,
    5,
    0.1,
    world.parameters.separationWeight,
    (newWeight) => {
      world.setSeparationWeight(newWeight);
    }
  );
  createSlider(
    sliderContainer,
    "Alignment Weight",
    0,
    5,
    0.1,
    world.parameters.alignmentWeight,
    (newWeight) => {
      world.setAlignmentWeight(newWeight);
    }
  );
  createSlider(
    sliderContainer,
    "Cohesion Weight",
    0,
    5,
    0.1,
    world.parameters.cohesionWeight,
    (newWeight) => {
      world.setCohesionWeight(newWeight);
    }
  );
  createSlider(
    sliderContainer,
    "Turning Weight",
    0,
    5,
    0.1,
    world.parameters.turningWeight,
    (newWeight) => {
      world.setTurningWeight(newWeight);
    }
  );
  createSlider(
    sliderContainer,
    "Total Force Weight",
    0,
    1000,
    50,
    world.parameters.totalForceWeight,
    (newWeight) => {
      world.setTotalForceWeight(newWeight);
    }
  );
}
