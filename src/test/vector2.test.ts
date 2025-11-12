import { describe, expect, test } from "vitest";
import { Vector2 } from "../utils/vector2";

describe("Constructor", () => {
  test("should create a Vector2 with given x and y", () => {
    const v = new Vector2(3, 4);
    expect(v.x).toBe(3);
    expect(v.y).toBe(4);
  });

  test("should handle negative coordinates", () => {
    const v = new Vector2(-1, -2);
    expect(v.x).toBe(-1);
    expect(v.y).toBe(-2);
  });

  test("should handle zero coordinates", () => {
    const v = new Vector2(0, 0);
    expect(v.x).toBe(0);
    expect(v.y).toBe(0);
  });

  test("Handles infinity coordinates", () => {
    const v1 = new Vector2(Infinity, 2);
    expect(v1.x).toBe(Infinity);
    expect(v1.y).toBe(2);

    const v2 = new Vector2(1, -Infinity);
    expect(v2.x).toBe(1);
    expect(v2.y).toBe(-Infinity);

    const v3 = new Vector2(Infinity, -Infinity);
    expect(v3.x).toBe(Infinity);
    expect(v3.y).toBe(-Infinity);
  });

  describe("Throws error when creating with NaN coordinates", () => {
    test("When x is NaN", () => {
      expect(() => new Vector2(NaN, 2)).toThrow();
    });
    test("When y is NaN", () => {
      expect(() => new Vector2(1, NaN)).toThrow();
    });
    test("When both x and y are NaN", () => {
      expect(() => new Vector2(NaN, NaN)).toThrow();
    });
  });
});

describe("copy()", () => {
  test("should create a new Vector2 with the same coordinates", () => {
    const v1 = new Vector2(3, 4);
    const v2 = v1.copy();
    expect(v2).toEqual(new Vector2(3, 4));
  });

  test("should not be the same instance", () => {
    const v1 = new Vector2(3, 4);
    const v2 = v1.copy();
    expect(v1).not.toBe(v2);
  });

  test("modifying the copy should not affect the original", () => {
    const v1 = new Vector2(3, 4);
    const v2 = v1.copy();
    v2.x = 10;
    expect(v1).toEqual(new Vector2(3, 4));
    expect(v2).toEqual(new Vector2(10, 4));
  });
});

describe("add(scalar)", () => {
  test("should add scalar to both coordinates", () => {
    const v = new Vector2(1, 2);
    const result = v.add(3);
    expect(result).toEqual(new Vector2(4, 5));
  });

  test("should not modify the original vector", () => {
    const v = new Vector2(1, 2);
    v.add(3);
    expect(v).toEqual(new Vector2(1, 2));
  });

  test("should handle negative scalars", () => {
    const v = new Vector2(5, 7);
    const result = v.add(-2);
    expect(result).toEqual(new Vector2(3, 5));
  });

  test("should handle zero scalar", () => {
    const v = new Vector2(1, 2);
    const result = v.add(0);
    expect(result).toEqual(new Vector2(1, 2));
  });
});

describe("add(vector)", () => {});
describe("sub(scalar)", () => {});
describe("sub(vector)", () => {});
describe("mul(scalar)", () => {});
describe("div(scalar)", () => {});
describe("lengthSquared()", () => {
  test("should return the squared length of the vector", () => {
    const v = new Vector2(3, 4);
    expect(v.lengthSquared()).toBe(25);
  });

  test("should return 0 for the zero vector", () => {
    const v = new Vector2(0, 0);
    expect(v.lengthSquared()).toBe(0);
  });

  test("should handle negative coordinates", () => {
    const v = new Vector2(-3, -4);
    expect(v.lengthSquared()).toBe(25);
  });

  test("should handle non-integer coordinates", () => {
    const v = new Vector2(1.5, 2.5);
    expect(v.lengthSquared()).toBeCloseTo(8.5);
  });

  test("should be be equal to length() squared", () => {
    const v = new Vector2(6, 8);
    expect(v.lengthSquared()).toBeCloseTo(v.length() ** 2);
  });

  test("Returns Infinity for vectors with infinite components", () => {
    const v1 = new Vector2(Infinity, 1);
    expect(v1.lengthSquared()).toBe(Infinity);

    const v2 = new Vector2(1, -Infinity);
    expect(v2.lengthSquared()).toBe(Infinity);

    const v3 = new Vector2(Infinity, -Infinity);
    expect(v3.lengthSquared()).toBe(Infinity);
  });
});
describe("normalize()", () => {});
describe("length()", () => {});
describe("dot(vector)", () => {});
describe("angle()", () => {});
describe("angle(vector)", () => {
  test("Angle to self should be 0", () => {
    const v = new Vector2(1, 0);
    expect(v.angle(v)).toBeCloseTo(0);
  });

  test("Angle between orthogonal vectors should be π/2", () => {
    const v1 = new Vector2(2, 3);
    const v2 = new Vector2(-3, 2);
    expect(v1.angle(v2)).toBeCloseTo(Math.PI / 2);
  });

  test("Angle between opposite vectors should be π", () => {
    const v1 = new Vector2(1, 1);
    const v2 = new Vector2(-1, -1);
    expect(v1.angle(v2)).toBeCloseTo(Math.PI);
  });
});
describe("rotate(radians)", () => {});
describe("distanceTo(vector)", () => {});
