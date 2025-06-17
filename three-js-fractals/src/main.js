import * as THREE from 'three';

// Setup scene, camera, renderer
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);
const width = 800;
const height = 600;
const camera = new THREE.PerspectiveCamera(75, width/height, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);
renderer.domElement.style.display = 'block';
renderer.domElement.style.margin = '0 auto';
document.body.appendChild(renderer.domElement);

// Recursive function to add pyramids
function sierpinski(position, size, depth) {
  if (depth === 0) {
    const geometry = new THREE.TetrahedronGeometry(size);
    const material = new THREE.MeshNormalMaterial();
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.copy(position);
    scene.add(mesh);
  } else {
    const newSize = size / 2;
    const offsets = [
      new THREE.Vector3(0, newSize, 0),
      new THREE.Vector3(-newSize, -newSize, newSize),
      new THREE.Vector3(newSize, -newSize, newSize),
      new THREE.Vector3(0, -newSize, -newSize)
    ];
    offsets.forEach(offset => {
      sierpinski(position.clone().add(offset), newSize, depth - 1);
    });
  }
}

sierpinski(new THREE.Vector3(0, 0, 0), 5, 4);

camera.position.z = 15;

function animate() {
  requestAnimationFrame(animate);
  scene.rotation.y += 0.005;
  renderer.render(scene, camera);
}

animate();
