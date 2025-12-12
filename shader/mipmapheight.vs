attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uRMatrix;
uniform float uScale;

varying vec3 vNormal;
varying vec2 vTextureCoord;
varying vec4 pos3D;

void main(void) {
    vec3 scaledPosition = vec3( aVertexPosition.x,
                                aVertexPosition.y,
                                aVertexPosition.z * uScale / 40.0);

    gl_Position = uPMatrix * uMVMatrix * vec4(scaledPosition, 1.0);
    vNormal = vec3(uRMatrix * vec4(aVertexNormal, 0.0));
    vTextureCoord = aTextureCoord;
}