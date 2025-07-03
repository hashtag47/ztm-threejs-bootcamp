import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Pane } from "tweakpane";

const pane = new Pane();
const scene = new THREE.Scene();
const material = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  metalness: 0.0,
  roughness: 0,
});

const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const sphereGeometry = new THREE.SphereGeometry(0.75, 32, 32);
const torusKnotGeometry = new THREE.TorusKnotGeometry(0.5, 0.2, 100, 16);
const circleGeometry = new THREE.CircleGeometry(0.5, 32);

const box = new THREE.Mesh(boxGeometry, material);
box.position.x = -2;
box.castShadow = true;

const sphere = new THREE.Mesh(sphereGeometry, material);
sphere.position.x = 0;
sphere.castShadow = true;

const torusKnot = new THREE.Mesh(torusKnotGeometry, material);
torusKnot.position.x = 2;
torusKnot.castShadow = true;

const circle = new THREE.Mesh(circleGeometry, material);
circle.scale.setScalar(20);
circle.position.y = -2;
circle.rotation.x = -Math.PI / 2;
circle.receiveShadow = true;

scene.add(box, sphere, torusKnot, circle);

const directionalLight = new THREE.DirectionalLight(0xff0000, 1);
directionalLight.position.set(3, 10, 15);
scene.add(directionalLight);

directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 512;
directionalLight.shadow.mapSize.height = 512;
directionalLight.shadow.radius = 10;

directionalLight.shadow.camera.left = -3;
directionalLight.shadow.camera.right = 3;
directionalLight.shadow.camera.top = 3;
directionalLight.shadow.camera.bottom = -3;

// const directionalLightHelper = new THREE.DirectionalLightHelper(
//   directionalLight
// );
// scene.add(directionalLightHelper);

// Try not to use pointLight, it's consuming on light rendering
const pointLight = new THREE.PointLight(0x00ff00, 20);
pointLight.position.set(-3, 2, -3);
scene.add(pointLight);
const pointLightHelper = new THREE.PointLightHelper(pointLight);
scene.add(pointLightHelper);

pointLight.castShadow = true;
pointLight.shadow.mapSize.width = 512;
pointLight.shadow.mapSize.height = 512;
pointLight.shadow.radius = 10;

// pointLight.shadow.camera.near = 10;
pointLight.shadow.camera.far = 1;

const spotLight = new THREE.SpotLight(0x0000ff, 500, 50, Math.PI * 0.1);
spotLight.position.set(8, 4, 4);
spotLight.target.position.set(0, -1, 0);
scene.add(spotLight);
// const spotLightHelper = new THREE.SpotLightHelper(spotLight);
// scene.add(spotLightHelper);
spotLight.castShadow = true;
spotLight.shadow.mapSize.width = 512;
spotLight.shadow.mapSize.height = 512;
spotLight.shadow.radius = 10;

const spotLightCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera);
scene.add(spotLightCameraHelper);
spotLightCameraHelper.visible = false;

const directionalLightCameraHelper = new THREE.CameraHelper(
  directionalLight.shadow.camera
);
scene.add(directionalLightCameraHelper);

// const pointLightCameraHelper = new THREE.CameraHelper(pointLight.shadow.camera);
// scene.add(pointLightCameraHelper);

const camera = new THREE.PerspectiveCamera(
  35,
  window.innerWidth / window.innerHeight,
  0.1,
  10000
);
camera.position.z = 10;
camera.position.y = 5;

const canvas = document.querySelector("canvas.threejs");
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.BasicShadowMap;

// renderer.useLegacyLights = true;

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

const renderloop = () => {
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(renderloop);
};

renderloop();
