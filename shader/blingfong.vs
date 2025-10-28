attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTexCoords;

uniform mat4 uRMatrix;
uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

varying vec2 texCoords;
varying vec4 pos3D;
varying vec3 N;

void main(void) {
    texCoords = aTexCoords;
    pos3D = uMVMatrix * vec4(aVertexPosition, 1.0);
    N = vec3(uRMatrix * vec4(aVertexNormal, 0.0));
    gl_Position = uPMatrix * pos3D;
}