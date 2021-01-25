import { INITIALIZE, UPDATE_GRAPHICS } from "../actionz";
import initializeThreeScene from "../creators/initializeThreeScene";

export default () => {
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
