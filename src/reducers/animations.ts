import { Action } from "redux";
import * as THREE from "three";
import { TRIGGER_ANIMATION } from "../actionz";

type AnimationsState = {
  objects: Array<THREE.Object3D>;
};

const initialState: AnimationsState = {
  objects: [],
};

interface PayloadAction extends Action {
  payload: { [key: string]: any };
}

const reducer = (state = initialState, action: PayloadAction) => {
  switch (action.type) {
    case TRIGGER_ANIMATION:
      return { ...state, objects: state.objects.push(action.payload.object) };
    default:
      return state;
  }
};

export default reducer;
