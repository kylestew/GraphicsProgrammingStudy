#version 300 es

// an attribute is an input (in) to a vertex shader.
// It will receive data from a buffer
in vec3 aPosition;
// in vec4 aColor;

// // Rotation angle in radians
// const float angle = 1.0; // Example: rotate by 1 radian

// // Axis of rotation (normalized)
// const vec3 axis = vec3(1.0, 0.0, 0.0); // Example: Y-axis

// // Define the model matrix for 3D rotation using Rodrigues' rotation formula
// const mat4 modelMatrix =
//     mat4(cos(angle) + axis.x * axis.x * (1.0 - cos(angle)), //
//          axis.x *axis.y * (1.0 - cos(angle)) - axis.z * sin(angle),
//          axis.x *axis.z * (1.0 - cos(angle)) + axis.y * sin(angle), 0.0,
//          axis.y *axis.x * (1.0 - cos(angle)) + axis.z * sin(angle), cos(angle) + axis.y * axis.y * (1.0 -
//          cos(angle)), axis.y *axis.z * (1.0 - cos(angle)) - axis.x * sin(angle), 0.0, axis.z *axis.x * (1.0 -
//          cos(angle)) - axis.y * sin(angle), axis.z *axis.y * (1.0 - cos(angle)) + axis.x * sin(angle), cos(angle) +
//          axis.z * axis.z * (1.0 - cos(angle)), 0.0, 0.0, 0.0, 0.0, 1.0);

out vec4 v_color;

// The vertex shader's job is to transform the vertex data into the clip space
void main() {
    vec3 position = aPosition;
    gl_Position   = vec4(position, 1.0);

    v_color = vec4(1, 0, 0, 1);
    // v_color = aColor;
}

/*
https://learnopengl.com/Getting-started/Transformations

#version 330 core
layout (location = 0) in vec3 aPos;
layout (location = 1) in vec2 aTexCoord;

out vec2 TexCoord;

uniform mat4 transform;

void main()
{
    gl_Position = transform * vec4(aPos, 1.0f);
    TexCoord = vec2(aTexCoord.x, aTexCoord.y);
}
*/