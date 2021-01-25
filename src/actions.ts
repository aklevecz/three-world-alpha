import * as THREE from "three";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";
import initializeThreeScene from "./creators/initializeThreeScene";

export const INITIALIZE = "INITIALIZE";
export const UPDATE_GRAPHICS = "UPDATE_GRAPHICS";

import createVideoTexture from "./creators/createVideoTexture";
import createPaintings from "./creators/createPaintings";
import { Dispatch } from "redux";
import { Entity } from "./reducers/entities";
export const UPDATE_CONTROLS = "UPDATE_CONTROLS";
export const MOVE_FORWARD = "MOVE_FORWARD";
export const MOVE_BACKWARD = "MOVE_BACKWARD";
export const MOVE_LEFT = "MOVE_LEFT";
export const MOVE_RIGHT = "MOVE_RIGHT";
export const JUMP = "JUMP";
export const STANDING = "STANDING";
export const UPDATE_ROTATION = "UPDATE_ROTATION";
export const SET_ENTITIES = "SET_ENTITIES";
export const SET_FLOORS = "SET_FLOORS";
export const TRIGGER_ANIMATION = "TRIGGER_ANIMATION";

interface GroupedMesh extends THREE.Mesh {
  groupOffset: THREE.Vector3;
}

export const initializeScene = () => {
  return (dispatch: any, getState: any) => {
    const { camera, renderer } = getState().graphics;
    const { updated_renderer, updated_camera } = initializeThreeScene({
      camera,
      renderer,
    });
    dispatch({
      type: UPDATE_GRAPHICS,
      payload: { camera: updated_camera, renderer: updated_renderer },
    });
    dispatch({ type: INITIALIZE });
  };
};

export const initializeControls = () => {
  return (dispatch: any, getState: any) => {
    const {
      graphics: { camera, scene },
    } = getState();
    const controls = new PointerLockControls(camera, document.body);
    const lockControls = () => controls.lock();
    document.body.addEventListener("click", lockControls, false);
    scene.add(controls.getObject());

    dispatch({ type: UPDATE_CONTROLS, controls });
    const keyMoveMap: { [key: string]: string } = {
      w: MOVE_FORWARD,
      a: MOVE_LEFT,
      s: MOVE_BACKWARD,
      d: MOVE_RIGHT,
      " ": JUMP,
    };
    function onKeyDown(e: KeyboardEvent) {
      if (!keyMoveMap[e.key]) return;
      if (keyMoveMap[e.key] === JUMP && !getState().controls.standing) return;
      dispatch({ type: keyMoveMap[e.key], keyDown: true });
    }
    function onKeyUp(e: KeyboardEvent) {
      if (e.key === " ") return;
      if (!keyMoveMap[e.key]) return;
      dispatch({ type: keyMoveMap[e.key], keyDown: false });
    }

    document.addEventListener("keydown", onKeyDown, false);
    document.addEventListener("keyup", onKeyUp, false);
  };
};

export const initializeTouches = (phi: number, theta: number) => {
  return (dispatch: any, getState: any) => {
    var xDown: number = null;
    var yDown: number = null;

    const getTouches = (evt: TouchEvent) => {
      return evt.touches;
    };

    const rotateStart = new THREE.Vector2();
    const { controls } = getState().controls;
    const handleTouchStart = (evt: TouchEvent) => {
      if (!controls.isLocked) {
        controls.isLocked = true;
        dispatch({ type: UPDATE_CONTROLS, controls });
        return;
      }
      const firstTouch = getTouches(evt)[0];
      xDown = firstTouch.clientX;
      yDown = firstTouch.clientY;
      rotateStart.set(evt.touches[0].clientX, evt.touches[0].clientY);
    };

    const rotateEnd = new THREE.Vector2();
    const rotateDelta = new THREE.Vector2();

    // const {
    //   controls: { phi, theta },
    // } = getState();

    const handleTouchMove = (evt: TouchEvent) => {
      if (!controls.isLocked) return;
      rotateEnd.set(evt.touches[0].clientX, evt.touches[0].clientY);
      rotateDelta.subVectors(rotateEnd, rotateStart);
      rotateStart.copy(rotateEnd);
      phi =
        phi +
        ((2 * Math.PI * rotateDelta.y) /
          getState().graphics.renderer.domElement.height) *
          0.3;
      theta =
        theta +
        ((2 * Math.PI * rotateDelta.x) /
          getState().graphics.renderer.domElement.width) *
          0.5;
      dispatch({
        type: UPDATE_ROTATION,
        rotation: { theta, phi },
      });
      if (!xDown || !yDown) {
        return;
      }
      var xUp = evt.touches[0].clientX;
      var yUp = evt.touches[0].clientY;
      var xDiff = xDown - xUp;
      var yDiff = yDown - yUp;
      if (Math.abs(xDiff) > Math.abs(yDiff)) {
        if (xDiff > 0) {
        } else {
        }
      } else {
        if (yDiff > 0) {
          dispatch({ type: MOVE_BACKWARD, keyDown: true });
        } else {
          dispatch({ type: MOVE_FORWARD, keyDown: true });
        }
      }
      xDown = null;
      yDown = null;
    };

    const handleTouchEnd = () => {
      dispatch({ type: MOVE_FORWARD, keyDown: false });
      dispatch({ type: MOVE_BACKWARD, keyDown: false });
    };

    document.addEventListener("touchstart", handleTouchStart, false);
    document.addEventListener("touchend", handleTouchEnd, false);
    document.addEventListener("touchmove", handleTouchMove, false);
  };
};

export const initializeEntities = () => {
  return (dispatch: Dispatch, getState: Function) => {
    const {
      graphics: { scene },
    } = getState();
    const loader = new THREE.ObjectLoader();
    const sceneJson = require("../scene.json");
    const importedScene = loader.parse(sceneJson);

    // Walls
    const wallGroup = importedScene.children.filter(
      (group) => group.name === "Walls"
    )[0].children;
    const boxes: Array<{
      box: THREE.Box3;
      object: THREE.Object3D;
      state?: any;
    }> = [];
    wallGroup.forEach((wall: THREE.Mesh) => {
      const box = new THREE.Box3();
      wall.geometry.computeBoundingBox();
      boxes.push({ box, object: wall, state: { moved: false } });
    });

    // Stairs
    const stairGroups = importedScene.children.filter(
      (group) => group.name === "Stairs"
    );
    stairGroups.forEach((stairGroup: THREE.Group, i) => {
      stairGroup.children.forEach((stair: GroupedMesh) => {
        const box = new THREE.Box3();
        stair.geometry.computeBoundingBox();
        stair.groupOffset = stairGroups[i].position;
        boxes.push({ box, object: stair });
      });
    });

    // Floors
    const floors = importedScene.children.filter(
      (child) => child.name === "Floor"
    );
    floors.forEach((floor: THREE.Mesh) => {
      const box = new THREE.Box3();
      floor.geometry.computeBoundingBox();
      boxes.push({ box, object: floor });
    });

    dispatch({ type: SET_ENTITIES, entities: boxes });
    dispatch({ type: SET_FLOORS, floors });
    scene.add(importedScene);

    // Could probably be somewhere else
    const texture = createVideoTexture();
    createPaintings({ importedScene, texture });
  };
};

export const triggerAnimation = (entity: Entity) => {
  return (dispatch: Dispatch) => {
    const object = entity.object;
    dispatch({ type: TRIGGER_ANIMATION, payload: { object } });
    entity.state.moved = true;
    const start = performance.now();
    let frame: number;
    const startingY = object.position.y;
    const animate = () => {
      const delta = (performance.now() - start) * 0.00001;
      const cO = object.position;
      object.position.lerp(new THREE.Vector3(cO.x, startingY + 5, cO.z), delta);
      if (delta <= 1) {
        frame = requestAnimationFrame(animate);
      } else {
        cancelAnimationFrame(frame);
      }
    };
    animate();
  };
};
