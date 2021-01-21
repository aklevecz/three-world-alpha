import { Action } from "redux";
import * as THREE from "three";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";
import {
  JUMP,
  MOVE_BACKWARD,
  MOVE_FORWARD,
  MOVE_LEFT,
  MOVE_RIGHT,
  STANDING,
  UPDATE_CONTROLS,
  UPDATE_ROTATION,
} from "../actions";

type ControlsState = {
  moveBackward: boolean;
  moveForward: boolean;
  moveLeft: boolean;
  moveRight: boolean;
  standing: boolean;
  velocity: THREE.Vector3;
  direction: THREE.Vector3;
  phi: number;
  theta: number;
  controls: PointerLockControls | undefined;
};

const initialState: ControlsState = {
  moveBackward: false,
  moveForward: false,
  moveLeft: false,
  moveRight: false,
  standing: true,
  velocity: new THREE.Vector3(),
  direction: new THREE.Vector3(),
  phi: 0,
  theta: (1 * Math.PI) / 180,
  controls: undefined,
};

interface KeyAction extends Action {
  keyDown: boolean;
}

interface ControlAction extends Action {
  controls: PointerLockControls;
}

interface RotationAction extends Action {
  rotation: { phi: number; theta: number };
}

const reducer = (
  state = initialState,
  action: KeyAction & ControlAction & RotationAction
) => {
  switch (action.type) {
    case MOVE_FORWARD:
      return { ...state, moveForward: action.keyDown };
    case MOVE_BACKWARD:
      return { ...state, moveBackward: action.keyDown };
    case MOVE_LEFT:
      return { ...state, moveLeft: action.keyDown };
    case MOVE_RIGHT:
      return { ...state, moveRight: action.keyDown };
    case JUMP:
      const newVelocity = state.velocity;
      newVelocity.y += 100;
      return {
        ...state,
        velocity: newVelocity,
        standing: false,
      };
    case STANDING:
      return { ...state, standing: true };
    case UPDATE_ROTATION:
      return { ...state, ...action.rotation };
    case UPDATE_CONTROLS:
      return { ...state, controls: action.controls };
    default:
      return state;
  }
};

export default reducer;
