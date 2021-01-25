import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";
import {
  JUMP,
  MOVE_BACKWARD,
  MOVE_FORWARD,
  MOVE_LEFT,
  MOVE_RIGHT,
  UPDATE_CONTROLS,
} from "../actionz";

export default () => {
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
