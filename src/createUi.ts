import { createSlider } from "./createSliders";
import type { ParameterName, PersistedParameters } from "./parameters";

export function createUi(parameters: PersistedParameters) {
  const factory = createSliderFactory(
    parameters,
    document.querySelector("#sliders") as HTMLElement
  );
  factory.create("Number of Boids", 100, 2000, 100, "numBoids");
  factory.create("Number of Predators", 0, 50, 1, "numPredators");
  factory.create("Neighbor Radius", 5, 300, 5, "neighborRadius");
  factory.create("Collision Radius", 5, 300, 5, "collisionRadius");
  factory.create("Boid min Speed", 0, 1000, 10, "minSpeed");
  factory.create("Boid max Speed", 0, 1000, 10, "maxSpeed");
  factory.create("Separation Weight", 0, 5, 0.1, "separationWeight");
  factory.create("Alignment Weight", 0, 5, 0.1, "alignmentWeight");
  factory.create("Cohesion Weight", 0, 5, 0.1, "cohesionWeight");
  factory.create("Turning Weight", 0, 5, 0.1, "turningWeight");
  factory.create(
    "Mouse attraction weight",
    -10,
    10,
    1,
    "mouseAttractionWeight"
  );
}

export function createSliderFactory(
  parameters: PersistedParameters,
  container: HTMLElement
) {
  return {
    create: (
      labelText: string,
      min: number,
      max: number,
      step: number,
      parameterKey: ParameterName
    ) => {
      createSlider(
        container,
        labelText,
        min,
        max,
        step,
        parameters.value[parameterKey],
        (newValue) => {
          parameters.setParameter(parameterKey, newValue);
        }
      );
    },
  };
}
