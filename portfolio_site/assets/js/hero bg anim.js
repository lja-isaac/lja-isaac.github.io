import * as THREE from "three/webgpu";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { positionGeometry, modelViewMatrix, cameraProjectionMatrix, vec4, color, positionLocal, range, time, vec3, mod, uv, float, pass, uniform } from "three/tsl";
import { afterImage } from 'three/addons/tsl/display/AfterImageNode.js';
import { gaussianBlur } from 'three/addons/tsl/display/GaussianBlurNode.js';
import { getBackground } from "./hero bg anim bg.js";

const starCount = 5000;
const starSize = 1;
const starSpeed = 20;
const starBoxSize = 100;
const starBrightnessRange = range(0.1, 1.2)
// const starColorRange = range(color(0x000000), color(0xffffff))
const starColorRange = range(color(0xffffff), color(0xffffff))
const afterImageStrength = uniform(0.85);

const w = window.innerWidth;
const h = window.innerHeight;
const scene = new THREE.Scene();
scene.background = new THREE.Color("#000000");
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.z = 0;
const renderer = new THREE.WebGPURenderer({ antialias: true });
renderer.setSize(w, h);
await renderer.init();

// document.body.appendChild(renderer.domElement);
const heroBg = document.getElementById('hero-bg');
heroBg.appendChild(renderer.domElement);

// const ctrls = new OrbitControls(camera, renderer.domElement);
// ctrls.enableDamping = true;

const geometry = new THREE.PlaneGeometry(starSize, starSize, 1, 1);
const material = new THREE.MeshBasicNodeMaterial({
  // color: 0xff0066,
  transparent: true,
  alphaTest: 0.1,
  blending: THREE.AdditiveBlending, // Makes overlapping areas brighter!
  depthWrite: false,          // Stops stars from blocking objects behind them
  // side: THREE.DoubleSide
});
// material.colorNode = positionLocal;
material.colorNode = starColorRange.mul(starBrightnessRange);

const positionRange = range(new THREE.Vector3(-starBoxSize, -starBoxSize, -starBoxSize), new THREE.Vector3(starBoxSize, starBoxSize, starBoxSize));

const animatedZ = mod(positionRange.z.add(time.mul(starSpeed)), starBoxSize * 2).sub(starBoxSize);
const animatedPos = vec3(positionRange.x, positionRange.y, animatedZ);
material.positionNode = positionLocal.add(animatedPos);

material.opacityNode = float(0.1).div(uv().sub(0.5).length()).sub(0.25);
// const distFromCenter = uv().sub(0.5).length();
// material.opacityNode = distFromCenter.smoothstep(0.0, 0.5).oneMinus();

// Force billboarding: Transform the center of the instance, then offset vertices manually
// This removes camera rotation from the matrix transformation
const mvPosition = modelViewMatrix.mul(vec4(animatedPos, 1.0));
const billboardPosition = mvPosition.xyz.add(positionGeometry.xyz);
// Write directly to the vertex output node
material.vertexNode = cameraProjectionMatrix.mul(vec4(billboardPosition, 1.0));

const stars = new THREE.InstancedMesh(geometry, material, starCount);
stars.frustumCulled = false; 
scene.add(stars);

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
  camera.rotation.z += 0.001;
  camera.updateMatrixWorld();

  // knot.rotation.x += 0.01;
  // knot.rotation.y += 0.02;
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