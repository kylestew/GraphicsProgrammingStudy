attribute vec2 uv;
attribute vec2 position;

uniform float uAspect;
varying vec2 vUv;

void main() {
    vUv = uv * 2.0 - 1.0;

    // Adjust UVs based on aspect ratio
    if (uAspect >= 1.0) {
        // Wide viewport - scale x
        vUv.x *= uAspect;
    } else {
        // Tall viewport - scale y
        vUv.y /= uAspect;
    }

    gl_Position = vec4(position, 0, 1);
}
