precision mediump float;

uniform sampler2D u_texture;
uniform vec3 objColor;

varying vec2 texCoords;
varying vec4 pos3D;

void main(void)
{
    vec3 rgb = texture2D(u_texture, texCoords).rgb;
    vec3 N = normalize(rgb * 2.0 - 1.0);
    vec3 col = objColor * dot(N,normalize(vec3(-pos3D))); // Lambert rendering, eye light source
    gl_FragColor = vec4(col,1.0);
}