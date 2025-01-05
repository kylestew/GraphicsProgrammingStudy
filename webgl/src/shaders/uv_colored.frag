#version 300 es

// fragment shaders don't have a default precision - vertex shaders default to highp
precision mediump float;

in vec4 v_color;

out vec4 fragColor;

// The fragment shader's job is to output the color of the pixel
void main() { fragColor = v_color; }