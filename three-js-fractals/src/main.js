import * as THREE from 'three';
import { SierpinskiFractal } from './fractals/SierpinskiFractal';
import { MengerSponge } from './fractals/MengerSponge';

// Setup scene, camera, renderer
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);

// Calculate dimensions based on viewport units
const width = window.innerWidth; // 80vw
const height = window.innerHeight; // 80vh

const camera = new THREE.PerspectiveCamera(75, width/height, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);
renderer.domElement.style.display = 'block';
renderer.domElement.style.margin = '0 auto';
document.body.appendChild(renderer.domElement);

// Handle window resize
window.addEventListener('resize', () => {
    const newWidth = window.innerWidth * 0.8;
    const newHeight = window.innerHeight * 0.8;
    
    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();
    
    renderer.setSize(newWidth, newHeight);
});

// Create fractals
const sierpinski = new SierpinskiFractal(scene, 5, 4);
sierpinski.create();

const mengerSponge = new MengerSponge(scene, 5, 2);
mengerSponge.create();

// Position the fractals side by side
sierpinski.meshes.forEach(mesh => {
    mesh.position.x -= 8;
});
mengerSponge.meshes.forEach(mesh => {
    mesh.position.x += 8;
});

camera.position.z = 25;

// Rotation control variables
let isDragging = false;
let previousMousePosition = {
    x: 0,
    y: 0
};
let rotationSpeed = 0.01;

// Zoom control variables
const minZoom = 10;
const maxZoom = 50;
const zoomSpeed = 0.5;

// Mouse event listeners
renderer.domElement.addEventListener('mousedown', (event) => {
    isDragging = true;
    previousMousePosition = {
        x: event.clientX,
        y: event.clientY
    };
});

renderer.domElement.addEventListener('mousemove', (event) => {
    if (!isDragging) return;

    const deltaMove = {
        x: event.clientX - previousMousePosition.x,
        y: event.clientY - previousMousePosition.y
    };

    scene.rotation.y += deltaMove.x * rotationSpeed;
    scene.rotation.x += deltaMove.y * rotationSpeed;

    previousMousePosition = {
        x: event.clientX,
        y: event.clientY
    };
});

renderer.domElement.addEventListener('mouseup', () => {
    isDragging = false;
});

renderer.domElement.addEventListener('mouseout', () => {
    isDragging = false;
});

// Add wheel event listener for zooming
renderer.domElement.addEventListener('wheel', (event) => {
    // Check if Ctrl key is pressed
    if (event.ctrlKey) {
        event.preventDefault(); // Prevent default browser zoom
        
        // Calculate new zoom level
        const zoomDelta = event.deltaY < 0 ? zoomSpeed : -zoomSpeed;
        const newZoom = camera.position.z + zoomDelta;
        
        // Clamp zoom level between min and max values
        camera.position.z = Math.max(minZoom, Math.min(maxZoom, newZoom));
    }
}, { passive: false });

function animate() {
    requestAnimationFrame(animate);
    sierpinski.update();
    mengerSponge.update();
    renderer.render(scene, camera);
}

animate();
