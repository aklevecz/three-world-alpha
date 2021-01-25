import initializeControls from "./intializeControls";
import initializeEntities from "./initializeEntities";
import initializeTouches from "./initializeTouches";
import initializeScene from "./initializeScene";
import triggerAnimation from "./triggerAnimation";
export {
  initializeControls,
  initializeEntities,
  initializeScene,
  initializeTouches,
  triggerAnimation,
};

export const INITIALIZE = "INITIALIZE";
export const UPDATE_GRAPHICS = "UPDATE_GRAPHICS";
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
