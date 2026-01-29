#version 300 es

in vec3 aVertexPosition;
in vec3 aVertexNormal;
in vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uRMatrix;

out vec3 vNormal;
out vec2 vTextureCoord;
out vec3 pos3D;       // Position en view space
out vec3 localPos;    // Position locale NON transformée (pour la texture 3D)

void main(void) {
    vNormal = vec3(uRMatrix * vec4(aVertexNormal, 0.0));
    vTextureCoord = aTextureCoord;

    // Position en view space (pour le ray marching)
    vec4 viewPos = uMVMatrix * vec4(aVertexPosition, 1.0);
    pos3D = viewPos.xyz;

    // Position locale NON transformée - c'est la position du vertex par rapport au centre du cube
    // C'est exactement ce qu'il faut pour la texture 3D car elle ne doit PAS bouger avec les transformations
    localPos = aVertexPosition;

    gl_Position = uPMatrix * viewPos;
}