import * as THREE from "three/webgpu";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { positionGeometry, modelViewMatrix, cameraProjectionMatrix, vec4, color, positionLocal, range, time, vec3, mod, uv, float, pass, uniform } from "three/tsl";
import { afterImage } from 'three/addons/tsl/display/AfterImageNode.js';
import { gaussianBlur } from 'three/addons/tsl/display/GaussianBlurNode.js';
import { getBackground } from "./hero bg anim bg.js";
import { getStars } from "./hero bg anim stars.js";
import { getFastStars } from "./hero bg anim fast stars.js";

const afterImageStrength = uniform(0.85);

const w = window.innerWidth;
const h = window.innerHeight;
const scene = new THREE.Scene();
scene.background = new THREE.Color("#000000");
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 10000);
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 0;
const renderer = new THREE.WebGPURenderer({ antialias: true });
renderer.setSize(w, h);
await renderer.init();

// document.body.appendChild(renderer.domElement);
const heroBg = document.getElementById('hero-bg');
heroBg.appendChild(renderer.domElement);

// const ctrls = new OrbitControls(camera, renderer.domElement);
// ctrls.enableDamping = true;

const stars = getStars();
scene.add(stars);

const fastStars = getFastStars();
scene.add(fastStars);

// const hemiLight = new THREE.HemisphereLight(0xffffff, 0x000000, 2.0);
// scene.add(hemiLight);

// // background
// const bgSphere = getBackground();
// scene.add(bgSphere);

const postProcessing = new THREE.RenderPipeline(renderer);
const scenePass = pass(scene, camera);
const scenePassColor = scenePass.getTextureNode();

const afterImageEffect = afterImage(scenePassColor, afterImageStrength);
const smoothTrail = gaussianBlur(afterImageEffect, { radius: 4 });

postProcessing.outputNode = smoothTrail;

function animate() {
  camera.rotation.x += 0.001;
  // camera.rotation.y += 0.001;
  camera.rotation.z += 0.002;

  // renderer.render(scene, camera);
  postProcessing.render(scene, camera);
  // ctrls.update();
}
renderer.setAnimationLoop(animate);

function handleWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', handleWindowResize, false);