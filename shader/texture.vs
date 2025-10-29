attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uRMatrix;
uniform float uScale;

varying vec3 vNormal;
varying vec2 vTextureCoord;

void main(void) {
    vec3 aVertexPositionZ = aVertexPosition;
    aVertexPositionZ.z *= uScale;
    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPositionZ, 1.0);
    vNormal = (uRMatrix * vec4(aVertexNormal, 0.0)).xyz;
    vTextureCoord = aTextureCoord;
}