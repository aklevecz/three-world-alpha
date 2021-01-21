import { combineReducers } from "redux";
import graphics from "./graphics";
import controls from "./controls";
import entities from "./entities";

export default combineReducers({ graphics, controls, entities });
