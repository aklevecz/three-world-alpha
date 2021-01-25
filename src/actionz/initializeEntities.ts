import * as THREE from "three";
import { Dispatch } from "redux";
import { SET_ENTITIES, SET_FLOORS } from "../actionz";
import createVideoTexture from "../creators/createVideoTexture";
import createPaintings from "../creators/createPaintings";

interface GroupedMesh extends THREE.Mesh {
  groupOffset: THREE.Vector3;
}

export default () => {
  return (dispatch: Dispatch, getState: Function) => {
    const {
      graphics: { scene },
    } = getState();
    const loader = new THREE.ObjectLoader();
    const sceneJson = require("../../scene.json");
    const importedScene = loader.parse(sceneJson);

    // Walls
    const wallGroup = importedScene.children.filter(
      (group) => group.name === "Walls"
    )[0].children;
    const boxes: Array<{
      box: THREE.Box3;
      object: THREE.Object3D;
      state?: any;
    }> = [];
    wallGroup.forEach((wall: THREE.Mesh) => {
      const box = new THREE.Box3();
      wall.geometry.computeBoundingBox();
      boxes.push({ box, object: wall, state: { moved: false } });
    });

    // Stairs
    const stairGroups = importedScene.children.filter(
      (group) => group.name === "Stairs"
    );
    stairGroups.forEach((stairGroup: THREE.Group, i) => {
      stairGroup.children.forEach((stair: GroupedMesh) => {
        const box = new THREE.Box3();
        stair.geometry.computeBoundingBox();
        stair.groupOffset = stairGroups[i].position;
        boxes.push({ box, object: stair });
      });
    });

    // Floors
    const floors = importedScene.children.filter(
      (child) => child.name === "Floor"
    );
    floors.forEach((floor: THREE.Mesh) => {
      const box = new THREE.Box3();
      floor.geometry.computeBoundingBox();
      boxes.push({ box, object: floor });
    });

    dispatch({ type: SET_ENTITIES, entities: boxes });
    dispatch({ type: SET_FLOORS, floors });
    scene.add(importedScene);

    // Could probably be somewhere else
    const texture = createVideoTexture();
    createPaintings({ importedScene, texture });
  };
};
