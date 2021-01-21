import * as THREE from "three";

export default function () {
  const src = require("../../goat.mp4");
  const video = document.createElement("video");
  video.playsInline = true;
  video.autoplay = true;
  video.src = src;
  const texture = new THREE.VideoTexture(video);
  return texture;
}
