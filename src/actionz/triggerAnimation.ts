import * as THREE from "three";
import { Dispatch } from "redux";
import { TRIGGER_ANIMATION } from "../actionz";
import { Entity } from "../reducers/entities";

export default (entity: Entity) => {
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
