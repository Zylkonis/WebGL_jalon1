attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

varying vec2 texCoords;

void main(void) {
	texCoords = aTextureCoord;
	gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
}
