import * as THREE from "https://unpkg.com/three/build/three.module.js";

const CAM_FOV = 54;
const CAM_Z_MIN = 0.1;
const CAM_Z_MAX = 512;
const CAM_Y_POS = 32;

const WORLD_WIDTH = 64;
const WORLD_DEPTH = 64;

const BACKGROUND = new THREE.Color(1.0, 0.0, 0.0);

const clock = new THREE.Clock();

const init_aspect = window.innerWidth / window.innerHeight;
const camera = new THREE.PerspectiveCamera(CAM_FOV, init_aspect, CAM_Z_MIN, CAM_Z_MAX);
camera.position.x = WORLD_WIDTH / 2;
camera.position.z = WORLD_DEPTH / 2;
camera.position.y = CAM_Y_POS;
camera.lookAt(camera.position.x + 1, camera.position.y - 1.1, camera.position.z + 1);

const scene = new THREE.Scene();

const renderer = new THREE.WebGLRenderer({ antialias: false });
document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshNormalMaterial({ });
const box_mesh = new THREE.InstancedMesh(geometry, material, WORLD_WIDTH * WORLD_DEPTH);
const dummy = new THREE.Object3D();

scene.add(box_mesh);

// The code will try to render
// at this framerate if possible
let target_framerate = 50.0;

const animate = function() {
    setTimeout(() => requestAnimationFrame(animate), 1000.0 / target_framerate);

    // For some reason shit breaks if this
    // is not here, I don't even know anymore...
    clock.getDelta();

    let index = 0;
    let phase = 0.0;
    for(let x = 0; x < WORLD_WIDTH; ++x) {
        for(let z = 0; z < WORLD_DEPTH; ++z) {
            const xphase = x / Math.PI;
            const zphase = z / Math.PI;
            const xcval = Math.cos(1.0 * (xphase + phase + clock.elapsedTime));
            const zcval = Math.cos(0.5 * (zphase + phase + clock.elapsedTime));
            dummy.position.x = 4.0 * x;
            dummy.position.z = 4.0 * z;
            dummy.position.y = 6.0 * xcval * zcval;
            dummy.rotation.x = xcval * dummy.position.y / 6.0;
            dummy.rotation.z = zcval * dummy.position.y / 6.0;
            dummy.scale.x = dummy.scale.y = dummy.scale.z = 1.5 + dummy.position.y / 12;
            dummy.updateMatrix();
            box_mesh.setMatrixAt(index++, dummy.matrix);
            phase += (Math.PI / box_mesh.count);
        }
    }

    // Make sure positions are actually updated
    box_mesh.instanceMatrix.needsUpdate = true;

    renderer.render(box_mesh, camera);
};

const onresize = function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(window.devicePixelRatio / 2);
    renderer.setSize(window.innerWidth, window.innerHeight);
};

const onfocus = function() {
    renderer.setPixelRatio(window.devicePixelRatio / 2);
    target_framerate = 50.0;
}

const onblur = function() {
    renderer.setPixelRatio(window.devicePixelRatio / 8);
    target_framerate = 5.0;
}

addEventListener("resize", onresize);
addEventListener("focus", onfocus);
addEventListener("blur", onblur);

addEventListener("visibilitychange", function() {
    if(this.document.visibilityState !== "hidden")
        onfocus();
    else onblur();
});

onresize();
animate();
