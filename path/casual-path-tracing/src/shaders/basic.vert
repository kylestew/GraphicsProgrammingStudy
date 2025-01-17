#version 300 es

in vec2 uv;
in vec2 position;

uniform vec3 cameraPosition;
uniform float aspectRatio;

out vec2 vUv;
out vec3 vCameraPosition;

void main() {
    vUv = uv * 2.0 - 1.0;
    vUv.x *= aspectRatio;
    vCameraPosition = cameraPosition;
    gl_Position     = vec4(position, 0, 1);
}
