import { createSlider } from "./createSliders";
import type { ParameterName, Parameters } from "./parameters";

export function createUi(parameters: Parameters) {
  const factory = createSliderFactory(
    parameters,
    document.querySelector("#sliders") as HTMLElement
  );
  factory.create("Number of Boids", 100, 2000, 100, "numBoids");
  factory.create("Neighbor Radius", 10, 100, 5, "neighborRadius");
  factory.create("Boid Speed", 0.5, 10, 0.5, "maxSpeed");
  factory.create("Separation Weight", 0, 5, 0.1, "separationWeight");
  factory.create("Alignment Weight", 0, 5, 0.1, "alignmentWeight");
  factory.create("Cohesion Weight", 0, 5, 0.1, "cohesionWeight");
  factory.create("Turning Weight", 0, 5, 0.1, "turningWeight");
  factory.create("Total Force Weight", 0, 1000, 50, "totalForceWeight");
}

export function createSliderFactory(
  parameters: Parameters,
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
