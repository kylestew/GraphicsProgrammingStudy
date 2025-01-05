#version 300 es

in vec3 position;
in vec4 aColor;

uniform mat4 uModelMatrix;

out vec4 v_color;

void main() {
    gl_Position = uModelMatrix * vec4(position, 1.0);

    v_color = aColor;
}