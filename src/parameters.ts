interface InternalParameters {
  cohesionWeight: number;
  alignmentWeight: number;
  separationWeight: number;
  turningWeight: number;
  neighborRadius: number;
  collisionRadius: number;
  maxSpeed: number;
  totalForceWeight: number;
  numBoids: number;
}

export type ParameterName = keyof InternalParameters;

const defaultParameters: InternalParameters = {
  cohesionWeight: 1,
  alignmentWeight: 1,
  separationWeight: 1,
  turningWeight: 1,
  neighborRadius: 50,
  collisionRadius: 10,
  maxSpeed: 200,
  totalForceWeight: 10_000,
  numBoids: 2000,
};

export class Parameters {
  private _parameters: InternalParameters;

  constructor() {
    const storedValue = localStorage.getItem("boidParameters");
    if (storedValue) {
      this._parameters = JSON.parse(storedValue);
    } else {
      this._parameters = { ...defaultParameters };
    }
  }

  private _subscribers: {
    [K in ParameterName]?: Array<(newValue: InternalParameters[K]) => void>;
  } = {};

  public onChange<K extends ParameterName>(
    key: K,
    listener: (newValue: InternalParameters[K]) => void
  ) {
    if (!this._subscribers[key]) {
      this._subscribers[key] = [];
    }
    this._subscribers[key]!.push(listener);
  }

  public get value(): InternalParameters {
    return { ...this._parameters };
  }

  public setParameter<K extends ParameterName>(
    key: K,
    value: InternalParameters[K]
  ) {
    this._parameters[key] = value;
    this.save();
    this._subscribers[key]?.forEach((listener) => listener(value));
  }

  private save() {
    localStorage.setItem("boidParameters", JSON.stringify(this._parameters));
  }
}
