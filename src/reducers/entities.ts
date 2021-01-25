import { Action } from "redux";
import * as THREE from "three";
import { SET_ENTITIES, SET_FLOORS } from "../actions";

type EntityState = {
  moved: boolean;
};

export type Entity = {
  object: THREE.Object3D;
  box: THREE.Box3;
  state: EntityState;
};

type EntitiesState = {
  entities: Array<Entity>;
  floors: Array<any>;
};

const initialState: EntitiesState = {
  entities: [],
  floors: [],
};

interface EntitiesAction extends Action {
  entities?: Array<THREE.Object3D>;
  floors: Array<any>;
}

const reducer = (state = initialState, action: EntitiesAction) => {
  switch (action.type) {
    case SET_ENTITIES:
      return { ...state, entities: action.entities };
    case SET_FLOORS:
      return { ...state, floors: action.floors };
    default:
      return state;
  }
};

export default reducer;
