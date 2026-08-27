import * as THREE from "three/webgpu";
import { color, distance, smoothstep, uniform, uv, vec2, vec3 } from "three/tsl";

const bgGeometry = new THREE.IcosahedronGeometry(100, 2);
const bgColor = uniform(new THREE.Color('#152f85'));
const circ = smoothstep(0.001, 0.2, distance(uv(), vec2(0.55))).oneMinus();
const bgColorNode = bgColor.mul(vec3(circ));
const bgMat = new THREE.MeshBasicNodeMaterial({
  side: THREE.BackSide,
  colorNode: bgColorNode,
});
const bgSphere = new THREE.Mesh(bgGeometry, bgMat);
bgSphere.rotation.y = Math.PI * -0.5;
bgSphere.userData = {
  setColor: (css) => {
    bgColor.value.set(css);
  },
};

function getBackground() {
  return bgSphere;
}
export { getBackground };