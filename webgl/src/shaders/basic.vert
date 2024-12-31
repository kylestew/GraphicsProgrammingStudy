#version 300 es

// an attribute is an input (in) to a vertex shader.
// It will receive data from a buffer
in vec2 a_position;
in vec4 a_color;

uniform float u_time;

out vec4 v_color;

// The vertex shader's job is to transform the vertex data into the clip space
void main() {
    // Convert 2D position to 4d (homogeneous coordinates)
    // gl_Position is a special variable a vertex shader is responsible for setting
    vec2 position = a_position;
    position.y += 0.3 * sin(u_time * 1.2);
    position.x += 0.3 * cos(u_time);
    gl_Position = vec4(position, 0.0, 1.0);

    v_color = a_color;
}