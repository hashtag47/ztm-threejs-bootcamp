import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { Pane } from "tweakpane";
import { RectAreaLightHelper } from "three/addons/helpers/RectAreaLightHelper.js";

// initialize the pane
const pane = new Pane();

// initialize the scene
const scene = new THREE.Scene();

// add meshes to the scene

const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const sphereGeometry = new THREE.SphereGeometry(0.75, 32, 32);
const torusKnotGeometry = new THREE.TorusKnotGeometry(0.5, 0.2, 100, 16);
const circleGeometry = new THREE.CircleGeometry(0.5, 32);

const material = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  metalness: 0.0,
  roughness: 0.5,
});

const box = new THREE.Mesh(boxGeometry, material);
box.position.x = -2;

const box2 = new THREE.Mesh(boxGeometry, material);
box2.position.x = -2;
box2.position.z = -2;

const sphere = new THREE.Mesh(sphereGeometry, material);
sphere.position.x = 0;

const sphere2 = new THREE.Mesh(sphereGeometry, material);
sphere2.position.x = 0;
sphere2.position.z = -2;

const torusKnot = new THREE.Mesh(torusKnotGeometry, material);
torusKnot.position.x = 2;

const torusKnot2 = new THREE.Mesh(torusKnotGeometry, material);
torusKnot2.position.x = 2;
torusKnot2.position.z = -2;

const circle = new THREE.Mesh(circleGeometry, material);
circle.scale.setScalar(20);
circle.position.y = -2;
circle.rotation.x = -Math.PI / 2;

scene.add(box, sphere, torusKnot, circle);
scene.add(box2, sphere2, torusKnot2);

// initialize the light
// 1. Ambient Light
// const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
const ambientLight = new THREE.AmbientLight(new THREE.Color("white"), 0.4);
// console.log(ambientLight);
scene.add(ambientLight);

pane.addBinding(ambientLight, "color", {
  color: { type: "float" },
});

pane.addBinding(ambientLight, "intensity", {
  min: 0,
  max: 1,
  step: 0.01,
});

// 2. HemisphereLight
// const hemisphereLight = new THREE.HemisphereLight("red", "blue", 0.5);
// pane.addBinding(hemisphereLight, "intensity", {
//   min: 0,
//   max: 1,
//   step: 0.01,
// });

// scene.add(hemisphereLight);

// 3. Directional Light
// const directionalLight = new THREE.DirectionalLight("white", 0.5);
// pane.addBinding(directionalLight, "color", {
//   color: { type: "float" },
// });

// pane.addBinding(directionalLight, "intensity", {
//   min: 0,
//   max: 1,
//   step: 0.01,
// });

// scene.add(directionalLight);
// directionalLight.position.x = 5;
// directionalLight.position.z = 5;

// directionalLight.target.position.set(0, 1, 0);

// const directionalLightHelper = new THREE.DirectionalLightHelper(
//   directionalLight,
//   0.5
// );
// scene.add(directionalLightHelper);

// 4. Point Light
// const pointLight = new THREE.PointLight("white", 0.5, 20);
// scene.add(pointLight);
// pane.addBinding(pointLight, "color", {
//   color: { type: "float" },
// });

// pane.addBinding(pointLight, "intensity", {
//   min: 0,
//   max: 100,
//   step: 0.01,
// });

// scene.add(pointLight);
// pointLight.position.x = 3;
// pointLight.position.z = 3;
// pointLight.position.y = 3;

// const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.5);
// scene.add(pointLightHelper);

// 5. Spot Light
// const spotLight = new THREE.SpotLight(0x59ffe9, 0.5);
// // console.log(spotLight);
// spotLight.position.set(-2, 2, 0);
// spotLight.target.position.set(2, 0, -2);
// scene.add(spotLight);

// pane.addBinding(spotLight, "angle", {
//   min: 0,
//   max: Math.PI / 2,
//   step: 0.01,
// });

// pane.addBinding(spotLight, "penumbra", {
//   min: 0,
//   max: 1,
//   step: 0.01,
// });

// pane.addBinding(spotLight, "decay", {
//   min: 1,
//   max: 5,
//   step: 0.01,
// });

// pane.addBinding(spotLight, "distance", {
//   min: 0,
//   max: 10,
//   step: 0.01,
// });

// pane.addBinding(spotLight, "color", {
//   color: { type: "float" },
// });

// pane.addBinding(spotLight, "intensity", {
//   min: 0,
//   max: 100,
//   step: 0.01,
// });

// const spotLightHelper = new THREE.SpotLightHelper(spotLight, 0.5);
// scene.add(spotLightHelper);

// 6. Rect Area Light
const rectAreaLight = new THREE.RectAreaLight(0x0e0aff, 0.5, 2, 2);
scene.add(rectAreaLight);
rectAreaLight.position.y = 3;
rectAreaLight.lookAt(0, 0, 0);

const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight, 0.5);
scene.add(rectAreaLightHelper);

pane.addBinding(rectAreaLight, "color", {
  color: { type: "float" },
});

pane.addBinding(rectAreaLight, "intensity", {
  min: 0,
  max: 10,
  step: 0.01,
});

// initialize the camera
const camera = new THREE.PerspectiveCamera(
  35,
  window.innerWidth / window.innerHeight,
  0.1,
  10000
);
camera.position.z = 10;
camera.position.y = 5;

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
