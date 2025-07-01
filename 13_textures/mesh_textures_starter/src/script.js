import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { normalize } from "three/src/math/MathUtils.js";
import { Pane } from "tweakpane";

// initialize the pane
const pane = new Pane();

// initialize the scene
const scene = new THREE.Scene();

// initialize the loader
const textureLoader = new THREE.TextureLoader();

// initialize the geometry
const geometry = new THREE.BoxGeometry(1, 1, 1);

const uv2Geometry = new THREE.BufferAttribute(geometry.attributes.uv.array, 2);
geometry.setAttribute("uv2", uv2Geometry);

const torusKnotGeometry = new THREE.TorusKnotGeometry(0.5, 0.15, 100, 16);
const uv2TorusKnotGeometry = new THREE.BufferAttribute(
  torusKnotGeometry.attributes.uv.array,
  2
);
torusKnotGeometry.setAttribute("uv2", uv2TorusKnotGeometry);

const planeGeometry = new THREE.PlaneGeometry(1, 1);
const uv2PlaneGeometry = new THREE.BufferAttribute(
  planeGeometry.attributes.uv.array,
  2
);
planeGeometry.setAttribute("uv2", uv2PlaneGeometry);

const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
const uv2SphereGeometry = new THREE.BufferAttribute(
  sphereGeometry.attributes.uv.array
);
sphereGeometry.setAttribute("uv2", uv2SphereGeometry);

const cylinderGeometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 32);
const uv2CylinderGeometry = new THREE.BufferAttribute(
  cylinderGeometry.attributes.uv.array,
  2
);
cylinderGeometry.setAttribute("uv2", uv2CylinderGeometry);

// initialize the texture
const grassAlbedo = textureLoader.load(
  "/textures/whispy-grass-meadow-bl/wispy-grass-meadow_albedo.png"
);
// Ambient Occlusion
const grassAo = textureLoader.load(
  "/textures/whispy-grass-meadow-bl/wispy-grass-meadow_ao.png"
);

const grassHeight = textureLoader.load(
  "/textures/whispy-grass-meadow-bl/wispy-grass-meadow_height.png"
);

const grassMetallic = textureLoader.load(
  "/textures/whispy-grass-meadow-bl/wispy-grass-meadow_metallic.png"
);

const grassNormal = textureLoader.load(
  "/textures/whispy-grass-meadow-bl/wispy-grass-meadow_normal-ogl.png"
);
const grassRoughness = textureLoader.load(
  "/textures/whispy-grass-meadow-bl/wispy-grass-meadow_roughness.png"
);
// grassTexture.repeat.set(2, 2);
// grassTexture.wrapS = THREE.MirroredRepeatWrapping;
// grassTexture.wrapT = THREE.MirroredRepeatWrapping;

// grassTexture.wrapS = THREE.RepeatWrapping;
// grassTexture.wrapT = THREE.RepeatWrapping;

// grassTexture.offset.x = 0.5;

// pane.addBinding(grassTexture, "offset", {
//   x: {
//     min: -1,
//     max: 1,
//     step: 0.001,
//   },
//   y: {
//     min: -1,
//     max: 1,
//     step: 0.001,
//   },
// });

// initialize the material
const material = new THREE.MeshStandardMaterial();
material.side = THREE.DoubleSide;
material.map = grassAlbedo;
material.roughnessMap = grassRoughness;
material.roughness = 1;

material.metalnessMap = grassMetallic;
material.metalness = 1;

material.normalMap = grassNormal;

material.displacementMap = grassHeight;
material.displacementScale = 0.1;

material.aoMap = grassAo;
pane.addBinding(material, "aoMapIntensity", {
  min: 0,
  max: 1,
  step: 0.01,
});

// material.color = new THREE.Color("red");

//initialize a group
const group = new THREE.Group();

// initialize the mesh
const cube = new THREE.Mesh(geometry, material);

const knot = new THREE.Mesh(torusKnotGeometry, material);
knot.position.x = 1.5;

const plane = new THREE.Mesh(planeGeometry, material);
plane.position.x = -1.5;
// plane.rotation.x = -(Math.PI * 0.5);
// plane.scale.set(100, 100);

const sphere = new THREE.Mesh();
sphere.geometry = sphereGeometry;
sphere.material = material;
sphere.position.y = 1.5;

const cylinder = new THREE.Mesh();
cylinder.geometry = cylinderGeometry;
cylinder.material = material;
cylinder.position.y = -1.5;

// add the mesh to the scene
group.add(sphere, cylinder, cube, knot, plane);
// group.add(plane);
scene.add(group);

// initialize the light
const light = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(light);

const pointLight = new THREE.PointLight(0xffffff, 50);
pointLight.position.set(5, 5, 5);
scene.add(pointLight);

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

const clock = new THREE.Clock();
let previousTime = 0;

// render the scene
const renderloop = () => {
  const currentTime = clock.getElapsedTime();
  const delta = currentTime - previousTime;

  previousTime = currentTime;

  group.children.forEach((child) => {
    if (child instanceof THREE.Mesh) {
      child.rotation.y += THREE.MathUtils.degToRad(delta) * 2; // you could plus any number you wish
    }
  });

  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(renderloop);
};

renderloop();
