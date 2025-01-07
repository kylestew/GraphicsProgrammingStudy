#version 300 es

// an attribute is an input (in) to a vertex shader.
// It will receive data from a buffer
in vec2 position;
in vec4 aColor;

uniform float uTime;

out vec4 v_color;

// The vertex shader's job is to transform the vertex data into the clip space
void main() {
    // Convert 2D position to 4d (homogeneous coordinates)
    // gl_Position is a special variable a vertex shader is responsible for setting
    vec2 pos = position;
    pos.y += 0.3 * sin(uTime * 1.2);
    pos.x += 0.3 * cos(uTime);
    gl_Position = vec4(pos, 0.0, 1.0);

    v_color = aColor;
}