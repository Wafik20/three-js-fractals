import * as THREE from 'three';

export class MengerSponge {
    constructor(scene, size = 5, depth = 2) {
        this.scene = scene;
        this.size = size;
        this.depth = depth;
        this.meshes = [];
    }

    create() {
        this.createSponge(new THREE.Vector3(0, 0, 0), this.size, this.depth);
    }

    createSponge(position, size, depth) {
        if (depth === 0) {
            const geometry = new THREE.BoxGeometry(size, size, size);
            const material = new THREE.MeshNormalMaterial();
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.copy(position);
            this.scene.add(mesh);
            this.meshes.push(mesh);
        } else {
            const newSize = size / 3;
            const offset = newSize * 2;

            // Create 20 smaller cubes (removing the center cube and the center of each face)
            for (let x = -1; x <= 1; x++) {
                for (let y = -1; y <= 1; y++) {
                    for (let z = -1; z <= 1; z++) {
                        // Skip the center cube and the center of each face
                        if (Math.abs(x) + Math.abs(y) + Math.abs(z) <= 1) continue;

                        const newPosition = position.clone().add(
                            new THREE.Vector3(x * offset, y * offset, z * offset)
                        );
                        this.createSponge(newPosition, newSize, depth - 1);
                    }
                }
            }
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