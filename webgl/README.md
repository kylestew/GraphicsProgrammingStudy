# WebGL Fundementals

Developing a framework and set of examples summarizing my knowledge of WebGL.

## 01-Basics

> This example covers a lot of the basics of WebGL and includes no outside code

Create and compile a GL program that takes in 2D triangle positions and colors, rendering the triangle to the screen. Uniforms are also bound to animate movement of the triangle.

## 02-Framework

This example rebuilds the previous example using our custom framework

## 03-Transformations

Using transformation matrices, a piece of geometry is rotated, scaled, and translated in 3D.

* https://learnopengl.com/Getting-started/Transformations

## 04-Coordinate Systems

NDC and coordinate systems
Transforming from model space, to world space, to view space (camera), to clip space, then to screen space.

https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_model_view_projection




### Projection

https://www.scratchapixel.com/lessons/3d-basic-rendering/perspective-and-orthographic-projection-matrix/opengl-perspective-projection-matrix.html

To transform vertex coordinates from view to clip-space we define a so called projection matrix that specifies a range of coordinates e.g. -1000 and 1000 in each dimension. The projection matrix then converts coordinates within this specified range to normalized device coordinates (-1.0, 1.0) (not directly, a step called Perspective Division sits in between). All coordinates outside this range will not be mapped between -1.0 and 1.0 and therefore be clipped. With this range we specified in the projection matrix, a coordinate of (1250, 500, 750) would not be visible, since the x coordinate is out of range and thus gets converted to a coordinate higher than 1.0 in NDC and is therefore clipped.

Note that if only a part of a primitive e.g. a triangle is outside the clipping volume OpenGL will reconstruct the triangle as one or more triangles to fit inside the clipping range.
This viewing box a projection matrix creates is called a frustum and each coordinate that ends up inside this frustum will end up on the user's screen. The total process to convert coordinates within a specified range to NDC that can easily be mapped to 2D view-space coordinates is called projection since the projection matrix projects 3D coordinates to the easy-to-map-to-2D normalized device coordinates.

### 3D


https://www.youtube.com/watch?v=gQiD2Kd6xoE&list=PLplnkTzzqsZS3R5DjmCQsqupu43oS9CFN&index=2


https://webgl2fundamentals.org/webgl/lessons/webgl-3d-perspective.html
https://webgl2fundamentals.org/webgl/lessons/webgl-3d-camera.html

https://learnopengl.com/Getting-started/Coordinate-Systems
https://learnopengl.com/Getting-started/Camera