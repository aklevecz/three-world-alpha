import * as THREE from "three";
import store from "./store";
import {
  initializeControls,
  initializeScene,
  initializeTouches,
  initializeEntities,
  triggerAnimation,
  STANDING,
} from "./actionz";
import createAmbientLight from "./creators/createAmbientLight";
import { Entity } from "./reducers/entities";

document.body.style.margin = "0px";
document.body.style.overflow = "hidden";
/*
TO DO:
- Abstract render
- Better structure actions

- Add more paintings
- Add more levels
- Add level[state] awareness
*/

// Setup
store.dispatch<any>(initializeScene());
const {
  graphics: { scene, camera, renderer },
} = store.getState();

// Lighting
const light = createAmbientLight();
scene.add(light);

// Controls
store.dispatch<any>(initializeControls());
const {
  controls: { velocity, direction },
} = store.getState();

// Entities
store.dispatch<any>(initializeEntities());

// Touches
let phi = 0;
let theta = (1 * Math.PI) / 180;
store.dispatch<any>(initializeTouches(phi, theta));

// Render
let prevTime: number = performance.now();
const oldPosition = new THREE.Vector3();
let standing: boolean = true;

var orientation = new THREE.Quaternion();
var previousPhi: any;
var previousTheta: any;
var euler = new THREE.Euler(0, 0, 0, "YXZ");
let floorPosition = 0;
let visionHeight = 10;

const render = () => {
  const time = performance.now();
  const {
    controls: { theta, phi, controls, standing },
  } = store.getState();
  if (phi === previousPhi && theta === previousTheta) {
  } else {
    previousPhi = phi;
    previousTheta = theta;
    euler.set(phi, theta, 0, "YXZ");
    orientation.setFromEuler(euler);
    camera.quaternion.copy(orientation);
  }
  if (controls.isLocked) {
    const {
      entities: { entities },
      controls: { moveBackward, moveForward, moveLeft, moveRight },
    } = store.getState();

    oldPosition.copy(controls.getObject().position);
    direction.z = Number(moveForward) - Number(moveBackward);
    direction.x = Number(moveRight) - Number(moveLeft);
    direction.normalize();
    const delta = (time - prevTime) / 1000;
    velocity.x -= velocity.x * 10 * delta;
    velocity.z -= velocity.z * 10 * delta;

    velocity.y -= 9.8 * 10 * delta;

    if (moveForward || moveBackward) {
      velocity.z -= direction.z * 400 * delta;
    }

    if (moveLeft || moveRight) {
      velocity.x -= direction.x * 400 * delta;
    }

    velocity.y -= 9.8 * 10.0 * delta;

    controls.moveRight(-velocity.x * delta);
    controls.moveForward(-velocity.z * delta);

    // Wall collision
    const sphere = new THREE.Sphere(controls.getObject().position, 1);

    const intersections = (entities as Array<Entity>).filter((box: Entity) => {
      box.box
        .copy((box.object as any).geometry.boundingBox)
        .applyMatrix4(box.object.matrixWorld);
      return sphere.intersectsBox(box.box);
    });

    // Check wall collision (walls are tall, but this could also be explicit)
    if (intersections.length > 0) {
      const fI = intersections[0];
      if (
        fI.object.name === "Moving_Wall" &&
        fI.state &&
        fI.state.moved === false
      ) {
        store.dispatch<any>(triggerAnimation(fI));
      }
      if (fI.box.max.y - fI.box.min.y > 100) {
        controls.getObject().position.copy(oldPosition);
      }
    }
    oldPosition.copy(controls.getObject().position);

    controls.getObject().position.y += velocity.y * delta;

    // Floor collision
    const feetSphere = new THREE.Sphere(
      controls.getObject().position,
      visionHeight + 5
    );

    const feetIntersections = (entities as Array<Entity>).filter(
      (box: Entity) => {
        box.box
          .copy((box.object as any).geometry.boundingBox)
          .applyMatrix4(box.object.matrixWorld);
        return feetSphere.intersectsBox(box.box);
      }
    );
    if (feetIntersections.length > 0) {
      // Find object closest to feet (to naively decide camera Y)
      let distance = 9999;
      let closest: any;
      for (let i = 0; i < feetIntersections.length; i++) {
        const o = feetIntersections[i] as Entity;
        const _d = controls.getObject().position.distanceTo(o.object.position);
        if (_d < distance) {
          distance = _d;
          closest = o;
        }
      }
      const o = closest;
      const gOY = o.object.groupOffset ? o.object.groupOffset.y : 0;
      const oY = o.object.position.y + gOY;
      const oH =
        o.object.geometry.boundingBox !== null
          ? o.object.geometry.boundingBox.max.y -
            o.object.geometry.boundingBox.min.y
          : 0;
      floorPosition = oH + oY;
      velocity.y = Math.max(0, velocity.y);
    } else {
      floorPosition = 0;
    }

    if (controls.getObject().position.y < visionHeight + floorPosition) {
      if (!standing) store.dispatch({ type: STANDING });
      velocity.y = 0;
      controls.getObject().position.y = visionHeight + floorPosition;
    }
    if (controls.getObject().position.y === visionHeight) {
      controls.getObject().position.set(-30, 500, 38);
    }
    prevTime = time;
  }
  renderer.render(scene, camera);
};

// Loop
const animate = () => {
  requestAnimationFrame(animate);
  render();
};

// Finish
animate();
