import { Vector2 } from "./utils/vector2";
import type { World } from "./world";

export interface Boid {
  position: Vector2;
  velocity: Vector2;
}

/** Beregner de totale kreftene som virker på en boid basert på naboer og omgivelser.*/
export function calculateBoidForces(boid: Boid, world: World): Vector2 {
  /** Denne metoden er ferdig implementert! */
  const neighbors = world.collection.getNeighbors(boid);
  const parameters = world.parameters.value;

  return Vector2.zero
    .add(alignmentForce(neighbors).mul(parameters.alignmentWeight))
    .add(cohesionForce(boid, neighbors).mul(parameters.cohesionWeight))
    .add(
      separationForce(boid, neighbors, parameters.collisionRadius).mul(
        parameters.separationWeight
      )
    )
    .add(
      predatorAvoidanceForce(
        boid,
        world.predators,
        parameters.neighborRadius
      ).mul(parameters.predatorAvoidanceWeight)
    )
    .add(
      mouseAttractionForce(
        boid,
        world.mousePosition,
        parameters.mouseRadius
      ).mul(parameters.mouseAttractionWeight)
    )
    .add(wallAvoidanceForce(boid, world).mul(parameters.wallAvoidanceWeight))
    .mul(parameters.globalForceMultiplier);
}

function alignmentForce(neighbors: Boid[]): Vector2 {
  // for all boids in detection radius and angle
  // find average direction

  if (neighbors.length === 0) {
    return new Vector2(0, 0);
  }

  return neighbors
    .reduce((acc, boid) => acc.add(boid.velocity), new Vector2(0, 0))
    .normalize();
}

function cohesionForce(boid: Boid, neighbors: Boid[]): Vector2 {
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

function separationForce(
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
    return direction.withLength(relativeDistance);
  }

  return neighbors
    .map(forceFromNeighbor)
    .reduce((acc, force) => acc.add(force), new Vector2(0, 0));
}

function predatorAvoidanceForce(
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
      return toPredator.withLength(strength);
    } else {
      return Vector2.zero;
    }
  }

  const avoidanceForce = predators
    .map(forceFromPredator)
    .reduce((acc, force) => acc.add(force), Vector2.zero);

  return avoidanceForce;
}

/** Kraften som tiltrekker boiden mot musens posisjon */
function mouseAttractionForce(
  boid: Boid,
  mousePosition: Vector2 | null,
  mouseRadius: number
): Vector2 {
  if (!mousePosition) {
    return Vector2.zero;
  }

  const toMouse = mousePosition.sub(boid.position);
  const distance = toMouse.length();
  if (distance > mouseRadius) {
    return Vector2.zero;
  }
  const strength = 1 - distance / mouseRadius;
  return toMouse.withLength(strength);
}

/** Kraften som hindrer boiden fra å kollidere med kantene av verden */
function wallAvoidanceForce(boid: Boid, world: World): Vector2 {
  const margin = 20; // predict 0.5 second ahead

  const force = Vector2.zero;

  if (boid.position.x < margin) {
    force.x += 1;
  } else if (boid.position.x > world.width - margin) {
    force.x -= 1;
  } else if (boid.position.y < margin) {
    force.y += 1;
  } else if (boid.position.y > world.height - margin) {
    force.y -= 1;
  }

  return force;
}
