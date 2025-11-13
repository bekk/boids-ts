import { Vector2 } from "./utils/vector2";
import type { World } from "./world";

export interface Boid {
  position: Vector2;
  velocity: Vector2;
}

/** Beregner de totale kreftene som virker på en boid basert på naboer og omgivelser.*/
export function calculateBoidForces(boid: Boid, world: World): Vector2 {
  /** Denne metoden er ferdig implementert! Det er i de andre metodene i denne fila du skal gjøre ditt arbeid. */
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
        parameters.predatorRadius
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
  // finn gjennomsnittsretningen til alle naboene

  return Vector2.zero;
}

function cohesionForce(boid: Boid, neighbors: Boid[]): Vector2 {
  // finn gjennomsnittsposisjonen til naboene
  // finn vektoren fra boidens posisjon til denne gjennomsnittsposisjonen
  // normaliser denne vektoren og returner den

  return Vector2.zero;
}

function separationForce(
  boid: Boid,
  neighbors: Boid[],
  collisionRadius: number
): Vector2 {
  // for all naboer
  // hvis de er innenfor collisionRadius
  // legg til en kraft som peker bort fra dem, sterkere jo nærmere de er

  return Vector2.zero;
}

function predatorAvoidanceForce(
  boid: Boid,
  predators: Boid[],
  predatorRadius: number
): Vector2 {
  // for alle predators
  // hvis de er innenfor predatorRadius
  // legg til en kraft som peker bort fra dem, sterkere jo nærmere de er

  return Vector2.zero;
}

/** Kraften som tiltrekker boiden mot musens posisjon */
function mouseAttractionForce(
  boid: Boid,
  mousePosition: Vector2 | null,
  mouseRadius: number
): Vector2 {
  // hvis musen ikke er tilstede, ingen kraft
  // ellers, hvis boiden er innenfor mouseRadius
  // legg til en kraft som peker mot musen
  // enten konstant styrke, eller sterkere jo nærmere den er

  return Vector2.zero;
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
