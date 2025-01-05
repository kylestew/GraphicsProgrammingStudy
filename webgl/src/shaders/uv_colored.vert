#version 300 es

in vec3 position;
in vec3 normal;
in vec2 uv;

uniform mat4 uModelMatrix;

out vec4 v_color;

void main() {
    gl_Position = uModelMatrix * vec4(position, 1.0);

    v_color = vec4(uv, 0., 1.);
}
