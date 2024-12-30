#version 300 es

// an attribute is an input (in) to a vertex shader.
// It will receive data from a buffer
in vec2 a_position;
in vec4 a_color;

uniform mat2 u_model;

out vec4 v_color;

// The vertex shader's job is to transform the vertex data into the clip space
void main() {
    // Convert 2D position to 4d (homogeneous coordinates)
    // gl_Position is a special variable a vertex shader is responsible for setting
    gl_Position = vec4(u_model * a_position, 0.0, 1.0);

    v_color = a_color;
}