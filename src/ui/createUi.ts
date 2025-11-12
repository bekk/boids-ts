import { createSlider } from "./createSliders";
import type { ParameterName, PersistedParameters } from "../parameters";

export function createUi(parameters: PersistedParameters) {
  const factory = new SliderFactory(
    parameters,
    document.querySelector("#sliders") as HTMLElement
  );
  factory.create("Number of boids", 0, 2000, 100, "numBoids");
  factory.create("Boid max speed", 0, 1000, 10, "maxSpeed");
  factory.create("Number of predators", 0, 50, 1, "numPredators");
  factory.create("Predator max speed", 0, 1000, 10, "predatorSpeed");

  factory.createColumn();
  // minVerdi på radius må være større enn 0 for å unngå deling på 0
  factory.create("Neighbor radius", 5, 100, 5, "neighborRadius");
  factory.create("Collision radius", 5, 100, 5, "collisionRadius");

  factory.createColumn();
  factory.create("Separation weight", 0, 5, 0.1, "separationWeight");
  factory.create("Alignment weight", 0, 5, 0.1, "alignmentWeight");
  factory.create("Cohesion weight", 0, 5, 0.1, "cohesionWeight");

  factory.createColumn();
  factory.create(
    "Predator avoidance weight",
    0,
    10,
    0.5,
    "predatorAvoidanceWeight"
  );
  factory.create("Wall avoidance weight", 0, 5, 0.1, "wallAvoidanceWeight");
  factory.create(
    "Mouse attraction weight",
    -10,
    10,
    1,
    "mouseAttractionWeight"
  );
}

/** Hjelpeklasse for å sette opp sliders som endrer på parametere
 * Hver slider legges til i en kolonne, og nye kolonner kan opprettes ved å kalle {@link createColumn}
 */
class SliderFactory {
  private container: HTMLElement;
  private parameters: PersistedParameters;
  private currentColumn: HTMLElement | null = null;

  constructor(parameters: PersistedParameters, container: HTMLElement) {
    this.container = container;
    this.parameters = parameters;
  }

  /** Oppretter en slider som endrer på en parameter.\
   * Legges til i nåværende kolonnen. Hvis ingen kolonne finnes, opprettes en ny kolonne først.
   */
  public create(
    labelText: string,
    min: number,
    max: number,
    step: number,
    parameterKey: ParameterName
  ) {
    const column = this.currentColumn ?? this.createColumn();

    createSlider(
      column,
      labelText,
      min,
      max,
      step,
      this.parameters.value[parameterKey],
      (newValue) => {
        this.parameters.setParameter(parameterKey, newValue);
      }
    );
  }

  /** Oppretter en ny kolonne for sliders.\
   * Neste slider som opprettes via {@link create} vil legges til i denne kolonnen.
   */
  public createColumn() {
    this.currentColumn = document.createElement("div");
    this.currentColumn.classList.add("slider-column");
    this.container.appendChild(this.currentColumn);
    return this.currentColumn;
  }
}
