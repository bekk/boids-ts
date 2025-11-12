/** Parameterverdier for boidene */
export interface Parameters {
  cohesionWeight: number;
  alignmentWeight: number;
  separationWeight: number;
  predatorAvoidanceWeight: number;
  wallAvoidanceWeight: number;
  mouseAttractionWeight: number;
  neighborRadius: number;
  collisionRadius: number;
  mouseRadius: number;
  maxSpeed: number;
  minSpeed: number;
  totalForceWeight: number;
  numBoids: number;
  numPredators: number;
  predatorSpeed: number;
}

/** Et navn på en parameter som kan settes i {@link PersistedParameters} */
export type ParameterName = keyof Parameters;

/** Standardverdier som brukes når verdiene ikke finnes i localStorage */
const defaultParameters: Parameters = {
  numBoids: 600,
  cohesionWeight: 1,
  alignmentWeight: 1,
  separationWeight: 1,
  predatorAvoidanceWeight: 5,
  wallAvoidanceWeight: 5,
  mouseAttractionWeight: 5,
  totalForceWeight: 5_000,
  neighborRadius: 50,
  collisionRadius: 45,
  mouseRadius: 100,
  minSpeed: 100,
  maxSpeed: 300,
  numPredators: 5,
  predatorSpeed: 300,
};

/**
 * En klasse som håndterer lagring og henting av boid-parametere i localStorage.
 * Gir også mulighet for å lytte på endringer av parametere.
 * Ved opprettelse hentes lagrede parametere fra localStorage, eller standardverdier brukes hvis ingen lagrede verdier finnes.
 * Standardverdier kan endres i {@link defaultParameters}.
 */
export class PersistedParameters {
  private _parameters: Parameters;
  private _subscribers: {
    [K in ParameterName]?: Array<(newValue: Parameters[K]) => void>;
  } = {};

  /** Oppretter en instans av PersistedParameters.
   * Hver enkelt parameterverdi hentes fra localStorage hvis den finnes, ellers brukes standardverdien fra {@link defaultParameters}.
   */
  constructor() {
    const storedValue = localStorage.getItem("boidParameters");
    if (storedValue) {
      // merge lagrede verdier med defaults, i tilfelle en enkeltparameter mangler
      this._parameters = { ...defaultParameters, ...JSON.parse(storedValue) };
    } else {
      this._parameters = { ...defaultParameters };
    }
  }

  /**
   * Legger til en lytter som kalles når en parameter endres
   * @param key Navnet på parameteren som skal lyttes på
   * @param listener Funksjonen som kalles når parameteren endres
   * @example parameters.onChange("numBoids", (newNumBoids) => {
   *   console.log("Number of boids changed to", newNumBoids);
   * });
   */
  public onChange<K extends ParameterName>(
    key: K,
    listener: (newValue: Parameters[K]) => void
  ) {
    if (!this._subscribers[key]) {
      this._subscribers[key] = [];
    }
    this._subscribers[key]!.push(listener);
  }

  /** En kopi av alle parameterverdier.\
   * Merk at dette returnerer en kopi, så endringer på objektet vil ikke påvirke de faktiske parameterne.\
   * For å endre en parameter, bruk {@link setParameter}
   */
  public get value(): Parameters {
    return { ...this._parameters };
  }

  /**
   * Setter verdien til en gitt parameter.\
   * Verdien blir lagret i localStorage, og alle lyttere for denne parameteren blir kalt.
   * @param key Navnet på parameteren som skal settes.
   * @param value Den nye verdien for parameteren.
   * @example parameters.setParameter("maxSpeed", 300);
   */
  public setParameter<K extends ParameterName>(key: K, value: Parameters[K]) {
    this._parameters[key] = value;
    localStorage.setItem("boidParameters", JSON.stringify(this._parameters));
    this._subscribers[key]?.forEach((listener) => listener(value));
  }
}
