attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uRMatrix;

varying vec3 vNormal;
varying vec2 vTextureCoord;
varying vec3 pos3D;  // Change to view space position

void main(void) {
    vNormal = vec3(uRMatrix * vec4(aVertexNormal, 0.0));
    vTextureCoord = aTextureCoord;

    // Get view space position
    vec4 viewPos = uMVMatrix * vec4(aVertexPosition, 1.0);
    pos3D = viewPos.xyz;  // Store view space position

    gl_Position = uPMatrix * viewPos;
}