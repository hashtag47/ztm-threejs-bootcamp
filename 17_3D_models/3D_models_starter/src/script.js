import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { Pane } from "tweakpane";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";

// initialize the pane
const pane = new Pane();

// add loaders
const cubeTextureLoader = new THREE.CubeTextureLoader();
cubeTextureLoader.setPath("textures/");

// initialize the scene
const scene = new THREE.Scene();

// add the environment map
const envMap = cubeTextureLoader.load([
  "px.png",
  "nx.png",
  "py.png",
  "ny.png",
  "pz.png",
  "nz.png",
]);

scene.background = envMap;

// add stuff here
// For Draco-compressed
const gltfLoaderDraco = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/draco/");
gltfLoaderDraco.setDRACOLoader(dracoLoader);

// For normal
const gltfLoaderNormal = new GLTFLoader();

// Draco model
gltfLoaderDraco.load("/models/boomBoxDraco/BoomBox.gltf", (gltf) => {
  const modelScene = gltf.scene;
  modelScene.scale.setScalar(50);
  scene.add(gltf.scene);
});

// Non-Draco model
gltfLoaderNormal.load("/models/boomBoxGLTF/BoomBox.gltf", (gltf) => {
  const modelScene = gltf.scene;
  modelScene.scale.setScalar(50);
  scene.add(gltf.scene);
});

// 1. First method
// gltfLoader.load("/models/boomBoxDraco/BoomBox.gltf", (gltf) => {
//   const modelScene = gltf.scene;
//   modelScene.scale.setScalar(50);
//   // modelScene.scale.setScalar(0.2);
//   // console.log(modelScene);
//   // modelScene.traverse((child) => {
//   //   if (child.isMesh && child.material) {
//   //     if (child.name !== "Wheels" && child.name !== "Wheels001") {
//   //       child.material.envMap = envMap;
//   //       child.material.roughness = 0;
//   //       child.material.metalness = 1;
//   //     }
//   //   }

//   scene.add(gltf.scene);
// });

// 2. Second method
// const model = await gltfLoader.loadAsync("/models/boomBoxGLTF/BoomBox.gltf");
// model.scene.scale.setScalar(50);
// scene.add(model.scene);

// 3. Third method
// const loadModel = async () => {
//   const model = await gltfLoader.loadAsync("/models/boomBoxGLTF/BoomBox.gltf");
//   return model;
// };
// const modelPromise = loadModel();
// modelPromise.then((model) => {
//   const modelScene = model.scene;
//   const material = modelScene.children[0].material;
//   pane.addBinding(material, "roughness", {
//     min: 0,
//     max: 1,
//     step: 0.01,
//   });

//   material.envMap = envMap;
//   material.envMapIntensity = 2;

//   modelScene.scale.setScalar(50);
//   scene.add(modelScene);
// });

// add the lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 6);
directionalLight.position.set(2, 2, 2);
scene.add(directionalLight);

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
