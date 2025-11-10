import { Vector2 } from "./vector2";

interface Parameters {
  cohesionWeight: number;
  alignmentWeight: number;
  separationWeight: number;
  neighborRadius: number;
  collisionRadius: number;
  turningWeight: number;
}

export interface BoidCollection {
  setBoids(boids: Boid[]): void;
  getNeighbors(boid: Boid): Boid[];
  setDetectionRadius(radius: number): void;
  setDetectionAngle(angle: number): void;
}

export interface Boid {
  position: Vector2;
  velocity: Vector2;
  isHero: boolean;
  isNeighbor: boolean;
}

export function calculateBoidForces(
  boid: Boid,
  allBoids: BoidCollection,
  parameters: Parameters
): Vector2 {
  const neighbors = allBoids.getNeighbors(boid);

  if (boid.isHero) {
    neighbors.forEach((neighbor) => {
      neighbor.isNeighbor = true;
    });
  }

  return Vector2.zero
    .add(calculateAlignmentForce(neighbors).mul(parameters.alignmentWeight))
    .add(calculateCohesionForce(boid, neighbors).mul(parameters.cohesionWeight))
    .add(
      calculateSeparationForce(boid, neighbors, parameters.neighborRadius).mul(
        parameters.separationWeight
      )
    )
    .add(calculateTurningForce(boid).mul(parameters.turningWeight));
}

function calculateAlignmentForce(neighbors: Boid[]): Vector2 {
  // for all boids in detection radius and angle
  // find average direction
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
  neighborRadius: number
): Vector2 {
  // for all boids in detection radius and angle
  // find average position of nearby boids
  const collisionRadius2 = neighborRadius * neighborRadius;
  function forceFromNeighbor(neighbor: Boid): Vector2 {
    const direction = boid.position.sub(neighbor.position);
    const relativeDistance =
      (collisionRadius2 - direction.lengthSquared()) / collisionRadius2;
    return direction.normalize().mul(relativeDistance);
  }

  return neighbors
    .map(forceFromNeighbor)
    .reduce((acc, force) => acc.add(force), new Vector2(0, 0));
}

function calculateTurningForce(boid: Boid): Vector2 {
  const margin = 50;
  const turnFactor = 1;
  const force = new Vector2(0, 0);
  if (boid.position.x < margin) {
    force.x += (boid.position.x / margin) * turnFactor;
  } else if (boid.position.x > 1280 - margin) {
    force.x -= ((1280 - boid.position.x) / margin) * turnFactor;
  }
  if (boid.position.y < margin) {
    force.y += (boid.position.y / margin) * turnFactor;
  } else if (boid.position.y > 720 - margin) {
    force.y -= ((720 - boid.position.y) / margin) * turnFactor;
  }
  return force.limit(1);
}
