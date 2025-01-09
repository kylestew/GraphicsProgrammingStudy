#version 300 es

in vec3 position;
in vec3 normal;
in vec2 uv;
in vec4 color;

uniform mat4 uModelMatrix;
uniform mat4 uProjectionMatrix;

out vec4 v_color;

void main() {
    gl_Position = uProjectionMatrix * uModelMatrix * vec4(position, 1.0);
    v_color     = color;
}
