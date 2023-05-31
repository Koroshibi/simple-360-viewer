import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const dropzone = document.getElementById("dropzone");
const image360 = document.getElementById("image360");

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  200
);

const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);

image360.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.rotateSpeed = 0.5;
controls.enableZoom = true;
controls.enablePan = false;
camera.position.set(-0.1, 0, 0);
controls.update();

dropzone.addEventListener("dragover", handleDragOver, false);

dropzone.addEventListener("dragleave", handleDragLeave, false);

dropzone.addEventListener("drop", handleDrop, false);

window.onresize = handleResize;

function handleDragOver(e) {
  e.preventDefault();
  dropzone.style.border = "2px dashed #4d4d4d";
}

function handleDragLeave() {
  dropzone.style.border = "2px dashed #ccc";
}

function handleDrop(e) {
  e.preventDefault();

  dropzone.style.display = "none";
  image360.style.display = "flex";

  var file = e.dataTransfer.files[0];
  var reader = new FileReader();
  reader.readAsDataURL(file);

  reader.onload = handleReaderOnLoad;
}

function handleReaderOnLoad(event) {
  const geometry = new THREE.SphereGeometry(50, 32, 32);
  const texture = new THREE.TextureLoader().load(event.target.result);
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.DoubleSide,
  });

  material.transparent = true;

  const sphere = new THREE.Mesh(geometry, material);
  scene.add(sphere);

  render();
}

function render() {
  requestAnimationFrame(render);

  controls.update();

  renderer.render(scene, camera);
}

function handleResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
