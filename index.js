import * as THREE from "https://unpkg.com/three/build/three.module.js";

let frametime = 0.0;
const clock = new THREE.Clock();
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({ antialias: true });
const camera = new THREE.OrthographicCamera(-1.0, 1.0, 1.0, -1.0, 0.0, 1000.0);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

function onResize() {
    const aspect = (window.innerWidth / window.innerHeight);
    const ortho_d = 5.0;
    camera.left = aspect * (-ortho_d);
    camera.right = aspect * (+ortho_d);
    camera.top = (+ortho_d);
    camera.bottom = (-ortho_d);
    camera.position.set(500, 500, 500);
    camera.updateProjectionMatrix();
    camera.lookAt(scene.position);
    renderer.setSize(window.innerWidth, window.innerHeight);
};

window.addEventListener("resize", onResize);
onResize();

// Create a funny cube
const NCUBES = 15;
const material = new THREE.MeshNormalMaterial();
const boxgeom = new THREE.BoxGeometry(1, 1, 1);
const mesh = new THREE.InstancedMesh(boxgeom, material, NCUBES * NCUBES * 4);
const dummy = new THREE.Object3D();
mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
scene.add(mesh);

(function frame() {
    requestAnimationFrame(frame);
    frametime = clock.getDelta();

    let index = 0;
    let phase = 0.0;
    for(let x = -NCUBES; x < NCUBES; x++) {
        for(let z = -NCUBES; z < NCUBES; z++) {
            const angle = ((1.0 / 16.0) * 2.0 * Math.PI * clock.elapsedTime + phase);
            const sval = Math.sin(angle);
            const aval = Math.acos(sval);
            dummy.position.set(x, sval, z);
            dummy.rotation.set(aval, aval, aval);
            dummy.updateMatrix();
            mesh.setMatrixAt(index++, dummy.matrix);
            phase += (Math.PI / mesh.count);
        }
    }

    // Make sure we update the thing
    mesh.instanceMatrix.needsUpdate = true;

    renderer.render(scene, camera);
})();
