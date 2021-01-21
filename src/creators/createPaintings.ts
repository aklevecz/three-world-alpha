import * as THREE from "three";

export default function ({
  importedScene,
  texture,
}: {
  importedScene: THREE.Object3D;
  texture: THREE.Texture;
}) {
  const paintings = importedScene.children.filter(
    (group: THREE.Object3D) => group.name === "Paintings"
  )[0].children;
  const painting = paintings[0] as THREE.Mesh;
  const paintingMaterial = painting.material as THREE.MeshBasicMaterial;
  paintingMaterial.map = texture;
  paintingMaterial.needsUpdate = true;
}
