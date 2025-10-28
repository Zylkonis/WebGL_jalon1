precision mediump float;

varying vec3 vNormal;
varying vec4 vColor;

void main(void) {
    vec3 lightDir = normalize(vec3(0.5, 0.5, 1.0));
    vec3 normal = normalize(vNormal);
    float diff = max(dot(normal, lightDir), 0.0);

    vec3 ambient = vColor.rgb * 0.3;
    vec3 diffuse = vColor.rgb * diff * 0.7;

    gl_FragColor = vec4(ambient + diffuse, vColor.a);
    gl_FragColor = vec4(ambient + diffuse, vColor.a);
}