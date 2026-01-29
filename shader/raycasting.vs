#version 300 es

in vec3 aVertexPosition;
in vec3 aVertexNormal;
in vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uRMatrix;

out vec3 vNormal;
out vec2 vTextureCoord;
out vec3 pos3D;      // Position en view space
out vec3 localPos;   // Position locale NON transformée

void main(void) {
    vNormal = vec3(uRMatrix * vec4(aVertexNormal, 0.0));
    vTextureCoord = aTextureCoord;

    // Garder la position locale originale
    localPos = aVertexPosition;

    // Position en espace vue
    vec4 viewPosition = uMVMatrix * vec4(aVertexPosition, 1.0);
    pos3D = viewPosition.xyz;

    // Position finale en clip space
    gl_Position = uPMatrix * viewPosition;
}