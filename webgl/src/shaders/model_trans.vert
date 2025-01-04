#version 300 es

in vec3 aPosition;
in vec4 aColor;

uniform mat4 uModelMatrix;

out vec4 v_color;

void main() {
    gl_Position = uModelMatrix * vec4(aPosition, 1.0);

    v_color = aColor;
}
