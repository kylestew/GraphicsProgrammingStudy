#version 300 es

// fragment shaders don't have a default precision - vertex shaders default to highp
precision mediump float;

in vec4 v_color;

out vec4 fragColor;

// The fragment shader's job is to output the color of the pixel
void main() {
    // fragColor = vec4(vec3(gl_FragCoord.z), 1.0); // Output depth value as grayscale
    // fragColor = vec4(v_color.rg, gl_FragCoord.z, 1.0);

    fragColor = v_color;
}
