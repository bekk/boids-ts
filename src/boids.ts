import type { Parameters } from "./parameters";
import type { Predator } from "./predator";
import { Vector2 } from "./vector2";

export interface BoidCollection {
  setBoids(boids: Boid[]): void;
  getNeighbors(boid: Boid): Boid[];
  setDetectionRadius(radius: number): void;
}

export interface Boid {
  position: Vector2;
  velocity: Vector2;
}

export function calculateBoidForces(
  boid: Boid,
  allBoids: BoidCollection,
  predators: Predator[],
  parameters: Parameters,
  mousePosition: Vector2 | null
): Vector2 {
  const neighbors = allBoids.getNeighbors(boid);

  return Vector2.zero
    .add(calculateAlignmentForce(neighbors).mul(parameters.alignmentWeight))
    .add(calculateCohesionForce(boid, neighbors).mul(parameters.cohesionWeight))
    .add(
      calculateSeparationForce(boid, neighbors, parameters.collisionRadius).mul(
        parameters.separationWeight
      )
    )
    .add(calculateTurningForce(boid).mul(parameters.turningWeight))
    .add(
      calculateMouseAttractionForce(boid, mousePosition, parameters).mul(
        parameters.mouseAttractionWeight
      )
    )
    .add(calculatePredatorAvoidanceForce(boid, predators, 100).mul(5))
    .mul(parameters.totalForceWeight);
}

function calculateAlignmentForce(neighbors: Boid[]): Vector2 {
  // for all boids in detection radius and angle
  // find average direction
  if (neighbors.length === 0) {
    return new Vector2(0, 0);
  }

  return neighbors
    .reduce((acc, boid) => acc.add(boid.velocity), new Vector2(0, 0))
    .normalize();
}

function calculateCohesionForce(boid: Boid, neighbors: Boid[]): Vector2 {
  // for all boids in detection radius and angle
  // find average position
  if (neighbors.length === 0) {
    return new Vector2(0, 0);
  }

  const averageNeighborPosition = neighbors
    .reduce((acc, boid) => acc.add(boid.position), new Vector2(0, 0))
    .div(neighbors.length);

  return averageNeighborPosition.sub(boid.position).normalize();
}

function calculateSeparationForce(
  boid: Boid,
  neighbors: Boid[],
  collisionRadius: number
): Vector2 {
  // for all boids in detection radius and angle
  // find average position of nearby boids
  if (neighbors.length === 0) {
    return new Vector2(0, 0);
  }

  function forceFromNeighbor(neighbor: Boid): Vector2 {
    const direction = boid.position.sub(neighbor.position);
    const relativeDistance =
      (collisionRadius - direction.length()) / collisionRadius;
    return direction.normalize().mul(relativeDistance);
  }

  return neighbors
    .map(forceFromNeighbor)
    .reduce((acc, force) => acc.add(force), new Vector2(0, 0));
}

function calculatePredatorAvoidanceForce(
  boid: Boid,
  predators: Boid[],
  safeRadius: number
): Vector2 {
  if (predators.length === 0) {
    return Vector2.zero;
  }

  function forceFromPredator(predator: Boid): Vector2 {
    const toPredator = boid.position.sub(predator.position);
    const distance = toPredator.length();
    if (distance < safeRadius) {
      const strength = (safeRadius - distance) / safeRadius;
      return toPredator.normalize().mul(strength);
    } else {
      return Vector2.zero;
    }
  }

  const avoidanceForce = predators
    .map(forceFromPredator)
    .reduce((acc, force) => acc.add(force), Vector2.zero);

  return avoidanceForce;
}

function calculateTurningForce(boid: Boid): Vector2 {
  const margin = 100; // predict 0.5 second ahead

  const bounds = new Vector2(1280, 720);
  const force = Vector2.zero;

  if (boid.position.x < margin) {
    force.x += 1;
  } else if (boid.position.x > bounds.x - margin) {
    force.x -= 1;
  } else if (boid.position.y < margin) {
    force.y += 1;
  } else if (boid.position.y > bounds.y - margin) {
    force.y -= 1;
  }

  return force;
}

function calculateMouseAttractionForce(
  boid: Boid,
  mousePosition: Vector2 | null,
  parameters: Parameters
): Vector2 {
  if (!mousePosition) {
    return Vector2.zero;
  }

  const toMouse = mousePosition.sub(boid.position);
  const distance = toMouse.length();
  if (distance > parameters.mouseRadius) {
    return Vector2.zero;
  }
  const strength = 1 - distance / parameters.mouseRadius;
  return toMouse.normalize().mul(strength);
}
