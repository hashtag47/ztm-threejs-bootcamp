import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { Pane } from "tweakpane";

const pane = new Pane();

// initialize the scene
const scene = new THREE.Scene();

// add objects to the scene

// Create a custom geometry
const vertices = new Float32Array([
  0,
  0,
  0, // 0
  0,
  1,
  0, // 1
  1,
  0,
  0, // 2
]);

// const geometry = new THREE.SphereGeometry(1, 32, 32);
// const geometry = new IcosahedronGeometry(1, 3)
// const geometry = new THREE.TorusGeometry(1, 0.3, 16, 100);
let geometry = new THREE.PlaneGeometry(1, 1);

// const geometry = new THREE.BufferGeometry()
// const bufferAttribute = new THREE.BufferAttribute(vertices, 3)
// console.log(bufferAttribute)
// geometry.setAttribute('position', bufferAttribute)

const cubeMaterial = new THREE.MeshBasicMaterial({
  color: "red",
  wireframe: true,
});
const cubeMesh = new THREE.Mesh(geometry, cubeMaterial);
scene.add(cubeMesh);

const planeParameters = {
  width: 1,
  height: 1,
};

const planeFolder = pane.addFolder({
  title: "Plane",
});

planeFolder
  .addBinding(planeParameters, "width", {
    min: 0,
    max: 10,
    step: 0.1,
    label: "Width",
  })
  .on("change", (ev) => {
    geometry = new THREE.PlaneGeometry(ev.value, planeParameters.height);
    cubeMesh.geometry = geometry;
  });

planeFolder
  .addBinding(planeParameters, "height", {
    min: 0,
    max: 10,
    step: 0.1,
    label: "Height",
  })
  .on("change", () => {
    geometry = new THREE.PlaneGeometry(
      planeParameters.width,
      planeParameters.height
    );
    cubeMesh.geometry = geometry;
  });

// pane.addBinding(cubeMesh.scale, "y", {
//   min: 0,
//   max: 10,
//   step: 0.1,
//   label: "Scale Y",
// });

// initialize the camera
const camera = new THREE.PerspectiveCamera(
  35,
  window.innerWidth / window.innerHeight,
  0.1,
  200
);
camera.position.z = 5;

// initialize the renderer
const canvas = document.querySelector("canvas.threejs");
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// instantiate the controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.autoRotate = true;

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// render the scene
const renderloop = () => {
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(renderloop);
};

renderloop();
