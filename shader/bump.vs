attribute vec3 aVertexPosition;
attribute vec2 aTexCoords;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

varying vec2 texCoords;
varying vec4 pos3D;

void main(void) {
	texCoords = aTexCoords;
	gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
	pos3D = uMVMatrix * vec4(aVertexPosition,1.0);
}
