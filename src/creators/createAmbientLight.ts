import * as THREE from "three";

export default function () {
  const color = 0xffffff;
  const intensity = 0.1;
  const light = new THREE.AmbientLight(color, intensity);
  return light;
}
