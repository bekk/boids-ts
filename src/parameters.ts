interface InternalParameters {
  cohesionWeight: number;
  alignmentWeight: number;
  separationWeight: number;
  turningWeight: number;
  neighborRadius: number;
  collisionRadius: number;
  maxSpeed: number;
  detectionAngle: number;
  totalForceWeight: number;
  numBoids: number;
}

const defaultParameters: InternalParameters = {
  cohesionWeight: 1,
  alignmentWeight: 1,
  separationWeight: 1,
  turningWeight: 1,
  neighborRadius: 50,
  collisionRadius: 10,
  maxSpeed: 200,
  detectionAngle: Math.PI * 2,
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

  private save() {
    localStorage.setItem("boidParameters", JSON.stringify(this._parameters));
  }

  get cohesionWeight() {
    return this._parameters.cohesionWeight;
  }
  set cohesionWeight(value: number) {
    this._parameters.cohesionWeight = value;
    this.save();
  }

  get alignmentWeight() {
    return this._parameters.alignmentWeight;
  }
  set alignmentWeight(value: number) {
    this._parameters.alignmentWeight = value;
    this.save();
  }

  get separationWeight() {
    return this._parameters.separationWeight;
  }
  set separationWeight(value: number) {
    this._parameters.separationWeight = value;
    this.save();
  }

  get neighborRadius() {
    return this._parameters.neighborRadius;
  }
  set neighborRadius(value: number) {
    this._parameters.neighborRadius = value;
    this.save();
  }

  get collisionRadius() {
    return this._parameters.collisionRadius;
  }
  set collisionRadius(value: number) {
    this._parameters.collisionRadius = value;
    this.save();
  }

  get maxSpeed() {
    return this._parameters.maxSpeed;
  }
  set maxSpeed(value: number) {
    this._parameters.maxSpeed = value;
    this.save();
  }

  get detectionAngle() {
    return this._parameters.detectionAngle;
  }
  set detectionAngle(value: number) {
    this._parameters.detectionAngle = value;
    this.save();
  }

  get totalForceWeight() {
    return this._parameters.totalForceWeight;
  }
  set totalForceWeight(value: number) {
    this._parameters.totalForceWeight = value;
    this.save();
  }

  get numBoids() {
    return this._parameters.numBoids;
  }
  set numBoids(value: number) {
    this._parameters.numBoids = value;
    this.save();
  }

  get turningWeight() {
    return this._parameters.turningWeight;
  }
  set turningWeight(value: number) {
    this._parameters.turningWeight = value;
    this.save();
  }
}
