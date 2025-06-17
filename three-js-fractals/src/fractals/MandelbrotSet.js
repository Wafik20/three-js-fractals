import * as THREE from 'three';

export class MandelbrotSet {
    constructor(scene, size = 20) {
        this.scene = scene;
        this.size = size;
        this.mesh = null;
        this.create();
    }

    create() {
        // Create a plane geometry
        const geometry = new THREE.PlaneGeometry(this.size, this.size, 256, 256);
        
        // Create a custom shader material for the Mandelbrot set
        const material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 }
            },
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                varying vec2 vUv;
                
                vec3 hsv2rgb(vec3 c) {
                    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
                    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
                    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
                }

                void main() {
                    vec2 c = (vUv - 0.5) * 4.0;
                    vec2 z = vec2(0.0);
                    float i;
                    
                    for(i = 0.0; i < 100.0; i++) {
                        z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + c;
                        if(dot(z, z) > 4.0) break;
                    }
                    
                    float hue = i < 100.0 ? i / 100.0 : 0.0;
                    vec3 color = hsv2rgb(vec3(hue, 0.8, 0.9));
                    gl_FragColor = vec4(color, 1.0);
                }
            `,
            side: THREE.DoubleSide
        });

        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.rotation.x = -Math.PI / 2; // Rotate to lay flat
        this.mesh.position.y = -5; // Position below the other fractals
        this.scene.add(this.mesh);
    }

    update() {
        if (this.mesh && this.mesh.material.uniforms) {
            this.mesh.material.uniforms.time.value += 0.01;
        }
    }

    dispose() {
        if (this.mesh) {
            this.mesh.geometry.dispose();
            this.mesh.material.dispose();
            this.scene.remove(this.mesh);
        }
    }
} 