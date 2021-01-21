import { Action } from "redux";
import * as THREE from "three";
import { INITIALIZE, UPDATE_GRAPHICS } from "../actions";

const initialState = {
  scene: new THREE.Scene(),
  camera: new THREE.PerspectiveCamera(),
  renderer: new THREE.WebGLRenderer({ antialias: true }),
  intitialized: false,
};

interface PayloadAction extends Action {
  payload: { [key: string]: any };
}

const reducer = (state = initialState, action: PayloadAction) => {
  switch (action.type) {
    case INITIALIZE:
      return { ...state, intitialized: true };
    case UPDATE_GRAPHICS:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export default reducer;
