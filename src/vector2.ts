/**
 * Klasse-basert 2D vektor-implementasjon med vanlige vektoroperasjoner.
 * De fleste operasjoner returnerer nye Vector2-instanser og endrer ikke den opprinnelige vektoren.
 */
export class Vector2 {
  /** x-koordinat til vektoren */
  x: number;
  /** y-koordinat til vektoren */
  y: number;

  /** Oppretter en ny Vector2-instans.
   * @param x - x-koordinat. Kan være positiv, negativ eller uendelig. Kan ikke være NaN.
   * @param y - y-koordinat. Kan være positiv, negativ eller uendelig. Kan ikke være NaN.
   * @throws {Error} Hvis x eller y er NaN.
   */
  constructor(x: number, y: number) {
    if (isNaN(x) || isNaN(y)) {
      throw new Error(
        `Tried to create Vector2 with NaN coordinates (was (${x}, ${y}))`
      );
    }
    this.x = x;
    this.y = y;
  }

  /** Returnerer en ny Vector2 med samme x- og y-koordinat som denne. */
  copy(): Vector2 {
    return new Vector2(this.x, this.y);
  }

  /** Returnerer en ny Vector2 hvor x- og y-koordinatene er økt med en verdi.
   * @param scalar - tallverdien man skal legge til
   */
  add(scalar: number): Vector2;
  /** Returnerer en ny Vector2 hvor x- og y-koordinatene er økt med verdiene fra en annen Vector2.
   * @param v - den andre vektoren man skal legge til
   */
  add(v: Vector2): Vector2;
  add(param: number | Vector2): Vector2 {
    if (typeof param === "number") {
      return new Vector2(this.x + param, this.y + param);
    } else {
      return new Vector2(this.x + param.x, this.y + param.y);
    }
  }

  /** Returnerer en ny Vector2 hvor x- og y-koordinatene er redusert med en verdi.
   * @param scalar - tallverdien man skal trekke fra
   */
  sub(scalar: number): Vector2;
  /** Returnerer en ny Vector2 hvor x- og y-koordinatene er redusert med verdiene fra en annen Vector2.
   * @param v - den andre vektoren man skal trekke fra
   */
  sub(v: Vector2): Vector2;
  sub(param: number | Vector2): Vector2 {
    if (typeof param === "number") {
      return new Vector2(this.x - param, this.y - param);
    } else {
      return new Vector2(this.x - param.x, this.y - param.y);
    }
  }

  /** Returnerer en ny Vector2 hvor x- og y-koordinatene er multiplisert med en verdi.
   * @param scalar - tallverdien man skal multiplisere med
   */
  mul(scalar: number): Vector2 {
    return new Vector2(this.x * scalar, this.y * scalar);
  }
  /** Returnerer en ny Vector2 hvor x- og y-koordinatene er delt med en verdi.
   * @param scalar - tallverdien man skal dele på
   * @throws {Error} Hvis divisjonen er med null.
   */
  div(scalar: number): Vector2 {
    if (scalar === 0) {
      throw new Error("Division by zero in Vector2.div");
    }
    return new Vector2(this.x / scalar, this.y / scalar);
  }
  /** Returnerer et tall som representerer kvadratet av lengden til vektoren. \
   * Tilsvarer x² + y², og er det samme som `vec.length() * vec.length()`  \
   * Se {@link Vector2.length} for å få den faktiske lengden. \
   * Nyttig for å unngå kostbar kvadratrotsberegning
   */
  lengthSquared(): number {
    return this.x ** 2 + this.y ** 2;
  }
  /**
   * Returnerer et tall som representerer lengden til vektoren. \
   * Tilsvarer √(x² + y²). Se {@link Vector2.lengthSquared} for å få kvadratet av lengden, \
   * som er nyttig for å unngå kostbar kvadratrotsberegning
   */
  length(): number {
    return Math.sqrt(this.lengthSquared());
  }
  /** Returnerer en ny Vector2 med samme retning som denne vektoren, med lengde 1. \
   * Effektivt det samme som å dele vektoren på sin egen lengde. \
   * Hvis lengden på vektoren er 0, returneres en ny vektor (0, 0) i stedet.
   */
  normalize(): Vector2 {
    const len = this.length();
    return len === 0 ? new Vector2(0, 0) : this.div(len);
  }
  /** Returnerer et tall som representerer skalarproduktet (prikkproduktet) mellom denne vektoren og en annen vektor. \
   * Hvis denne vektoren er `(x₁, y₁)` og den andre vektoren er `(x₂, y₂)`,
   * er skalarproduktet `x₁*x₂ + y₁*y₂`.
   * @param v - den andre vektoren
   */
  dot(v: Vector2): number {
    return this.x * v.x + this.y * v.y;
  }
  /** Returnerer vinkelen i radianer mellom denne vektoren og en annen vektor. \
   * @param v - den andre vektoren
   */
  angle(v: Vector2): number;
  /** Returnerer vinkelen i radianer til denne vektoren i forhold til den positive x-aksen, som tilsvarer vektoren `(1, 0)`.
   */
  angle(): number;
  angle(param?: Vector2): number {
    if (param) {
      return Math.atan2(this.x * param.y - this.y * param.x, this.dot(param));
    } else {
      return Math.atan2(this.y, this.x);
    }
  }
  /** Returnerer en ny Vector2 som er denne vektoren rotert med en gitt vinkel i radianer.
   * @param angle - vinkelen i radianer som vektoren skal roteres med
   */
  rotate(angle: number): Vector2 {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return new Vector2(
      this.x * cos - this.y * sin,
      this.x * sin + this.y * cos
    );
  }
  /** Returnerer et tall som representerer avstanden mellom denne vektoren og en annen vektor. \
   * Tilsvarer lengden av vektoren som går fra denne vektoren til den andre vektoren.
   * @param v - den andre vektoren
   */
  distanceTo(v: Vector2): number {
    return this.sub(v).length();
  }
  /** Returnerer en ny Vector2 som er denne vektoren begrenset til en maksimal lengde. \
   * Hvis lengden på vektoren er mindre enn eller lik maksverdien, returneres en kopi av den opprinnelige vektoren.
   * @param max - maksimal lengde
   */
  limit(max: number): Vector2 {
    const length = this.length();
    if (length > max) {
      return this.mul(max / length);
    }
    return this.copy();
  }
  /** Returnerer en ny Vector2 hvor x- og y-koordinatene er klampet innenfor et spesifisert område.
   * @param min - nedre grensevektor
   * @param max - øvre grensevektor
   */
  clamp(min: Vector2, max: Vector2): Vector2 {
    return new Vector2(
      Math.min(Math.max(this.x, min.x), max.x),
      Math.min(Math.max(this.y, min.y), max.y)
    );
  }
  /** Returnerer en strengrepresentasjon av vektoren i formatet `(x, y)` */
  toString(): string {
    return `(${this.x}, ${this.y})`;
  }

  /** Returnerer en ny Vector2 med verdier `(0, 1)` */
  static get up(): Vector2 {
    return new Vector2(0, 1);
  }
  /** Returnerer en ny Vector2 med verdier `(0, -1)` */
  static get down(): Vector2 {
    return new Vector2(0, -1);
  }
  /** Returnerer en ny Vector2 med verdier `(-1, 0)` */
  static get left(): Vector2 {
    return new Vector2(-1, 0);
  }
  /** Returnerer en ny Vector2 med verdier `(1, 0)` */
  static get right(): Vector2 {
    return new Vector2(1, 0);
  }
  /** Returnerer en ny Vector2 med verdier `(0, 0)` */
  static get zero(): Vector2 {
    return new Vector2(0, 0);
  }
}

export function intersectRayCircle(
  rayOrigin: Vector2,
  rayDirection: Vector2,
  circleCenter: Vector2,
  circleRadius: number
): { hit: boolean; t: number } {
  // Assumes dNorm is normalized
  const m = circleCenter.sub(rayOrigin);
  const b = m.dot(rayDirection);
  const c2 = m.lengthSquared() - circleRadius * circleRadius;
  const disc = b * b - c2;
  if (disc < 0) return { hit: false, t: Infinity };

  const s = Math.sqrt(Math.max(0, disc));
  const t0 = b - s;
  const t1 = b + s;

  const EPS = 1e-6;
  if (t0 >= EPS) return { hit: true, t: t0 }; // entry
  if (t1 >= EPS) return { hit: true, t: t1 }; // started inside, use exit
  return { hit: false, t: Infinity }; // both behind origin
}
