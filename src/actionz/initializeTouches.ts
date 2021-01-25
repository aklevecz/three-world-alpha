import * as THREE from "three";
import {
  MOVE_BACKWARD,
  MOVE_FORWARD,
  UPDATE_CONTROLS,
  UPDATE_ROTATION,
} from "../actionz";

export default (phi: number, theta: number) => {
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
