import * as THREE from 'three';

export class SierpinskiFractal {
    constructor(scene, size = 5, depth = 4) {
        this.scene = scene;
        this.size = size;
        this.depth = depth;
        this.meshes = [];
    }

    create() {
        this.sierpinski(new THREE.Vector3(0, 0, 0), this.size, this.depth);
    }

    sierpinski(position, size, depth) {
        if (depth === 0) {
            const geometry = new THREE.TetrahedronGeometry(size);
            const material = new THREE.MeshNormalMaterial();
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.copy(position);
            this.scene.add(mesh);
            this.meshes.push(mesh);
        } else {
            const newSize = size / 2;
            const offsets = [
                new THREE.Vector3(0, newSize, 0),
                new THREE.Vector3(-newSize, -newSize, newSize),
                new THREE.Vector3(newSize, -newSize, newSize),
                new THREE.Vector3(0, -newSize, -newSize)
            ];
            offsets.forEach(offset => {
                this.sierpinski(position.clone().add(offset), newSize, depth - 1);
            });
        }
    }

    update() {
        // Add any update logic here if needed
    }

    dispose() {
        // Clean up meshes when no longer needed
        this.meshes.forEach(mesh => {
            mesh.geometry.dispose();
            mesh.material.dispose();
            this.scene.remove(mesh);
        });
        this.meshes = [];
    }
} 