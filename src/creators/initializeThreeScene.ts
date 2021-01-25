import * as THREE from "three";

export default function ({
  camera,
  renderer,
}: {
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
}) {
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(-30, 500, 38);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Listeners
  const onWindowResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };
  window.addEventListener("resize", onWindowResize, false);

  return { updated_renderer: renderer, updated_camera: camera };
}
