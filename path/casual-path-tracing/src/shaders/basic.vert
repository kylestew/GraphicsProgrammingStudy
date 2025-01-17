attribute vec2 uv;
attribute vec2 position;

uniform vec3 cameraPosition;
uniform float aspectRatio;

varying vec2 vUv;
varying vec3 vCameraPosition;

void main() {
    vUv = uv * 2.0 - 1.0;
    vUv.x *= aspectRatio;
    vCameraPosition = cameraPosition;
    gl_Position     = vec4(position, 0, 1);
}
