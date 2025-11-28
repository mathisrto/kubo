import * as THREE from "three";

/**
 * Infinite grid helper using shaders
 * Based on: http://asliceofrendering.com/scene%20helper/2020/01/05/InfiniteGrid/
 */
export class InfiniteGridHelper extends THREE.Mesh {
    constructor() {
        const geometry = new THREE.PlaneGeometry(2, 2, 1, 1);
        const material = new THREE.ShaderMaterial({
            side: THREE.DoubleSide,
            uniforms: {
                uSize1: { value: 1 },
                uSize2: { value: 10 },
                uColor: { value: new THREE.Color(0x888888) },
                uDistance: { value: 8000 },
            },
            transparent: true,
            vertexShader: `
                varying vec3 worldPosition;
                uniform float uDistance;
                
                void main() {
                    vec3 pos = position.xzy * uDistance;
                    pos.xz += cameraPosition.xz;
                    worldPosition = pos;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                }
            `,
            fragmentShader: `
                varying vec3 worldPosition;
                uniform float uSize1;
                uniform float uSize2;
                uniform vec3 uColor;
                uniform float uDistance;
                
                float getGrid(float size) {
                    vec2 r = worldPosition.xz / size;
                    vec2 grid = abs(fract(r - 0.5) - 0.5) / fwidth(r);
                    float line = min(grid.x, grid.y);
                    return 1.0 - min(line, 1.0);
                }
                
                void main() {
                    float d = 1.0 - min(distance(cameraPosition.xz, worldPosition.xz) / uDistance, 1.0);
                    
                    float g1 = getGrid(uSize1);
                    float g2 = getGrid(uSize2);
                    
                    float alpha = (g1 * 0.3 + g2 * 0.5) * d;
                    
                    gl_FragColor = vec4(uColor.rgb, alpha);
                    
                    if (gl_FragColor.a <= 0.0) discard;
                }
            `,
        });

        super(geometry, material);
        this.frustumCulled = false;
    }

    dispose() {
        this.geometry.dispose();
        (this.material as THREE.Material).dispose();
    }
}
