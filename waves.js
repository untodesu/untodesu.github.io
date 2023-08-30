import * as THREE from "https://unpkg.com/three/build/three.module.js";

const CAM_FOV = 54.0;
const CAM_Z_MIN = 0.1;
const CAM_Z_MAX = 512;
const CAM_Y_POS = 32;

const WORLD_WIDTH = 64;
const WORLD_DEPTH = 64;

const BACKGROUND = new THREE.Color(1.0, 0.0, 0.0);

const clock = new THREE.Clock();
clock.autoStart = true;

const init_aspect = window.innerWidth / window.innerHeight;
const camera = new THREE.PerspectiveCamera(CAM_FOV, init_aspect, CAM_Z_MIN, CAM_Z_MAX);
camera.position.x = WORLD_WIDTH / 3;
camera.position.z = WORLD_DEPTH / 3;
camera.position.y = CAM_Y_POS;
camera.lookAt(camera.position.x + 1, camera.position.y - 1.1, camera.position.z + 1);

const scene = new THREE.Scene();

const renderer = new THREE.WebGLRenderer({ antialias: false });
document.body.appendChild(renderer.domElement);

const geometry = new THREE.OctahedronGeometry(1);
const material = new THREE.MeshNormalMaterial({ });
const mesh = new THREE.InstancedMesh(geometry, material, WORLD_WIDTH * WORLD_DEPTH);
const dummy = new THREE.Object3D();

scene.add(mesh);

const getpar = function(t) {
    return 2.0 * Math.acos(Math.cos(t)) / Math.PI - 1.0;
};

const animate = function() {
    setTimeout(() => requestAnimationFrame(animate), 1000.0 / 25.0);

    let mesh_index = 0;
    let phase_offset = 0.0;

    for(let x = 0; x < WORLD_WIDTH; ++x) {
        for(let z = 0; z < WORLD_DEPTH; ++z) {
            const t = phase_offset + clock.getElapsedTime();
            const tx = 1.0 * (x / Math.PI + t);
            const tz = 0.5 * (z / Math.PI + t);

            const x_par = Math.cos(tx);
            const z_par = Math.cos(tz);
            const xz_par = x_par * z_par;

            dummy.position.x = 4.0 * x;
            dummy.position.y = 6.0 * xz_par;
            dummy.position.z = 4.0 * z;

            dummy.rotation.x = x_par * xz_par;
            dummy.rotation.z = z_par * xz_par;

            dummy.scale.x = 1.5 + 0.5 * xz_par;
            dummy.scale.y = dummy.scale.x;
            dummy.scale.z = dummy.scale.x;

            dummy.updateMatrix();

            mesh.setMatrixAt(mesh_index++, dummy.matrix);

            // Phase changes depending on position
            phase_offset += Math.PI / mesh.count;
        }
    }

    // Make sure positions are actually updated
    mesh.instanceMatrix.needsUpdate = true;

    renderer.render(mesh, camera);
};

const onresize = function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(window.devicePixelRatio / 4);
    renderer.setSize(window.innerWidth, window.innerHeight);
};

onresize();
animate();
