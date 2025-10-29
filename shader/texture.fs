precision mediump float;

varying vec3 vNormal;
varying vec2 vTextureCoord;

uniform sampler2D uSampler;

void main(void) {
    vec3 lightDir = normalize(vec3(0.5, 0.5, 1.0));
    vec3 normal = normalize(vNormal);
    float diff = max(dot(normal, lightDir), 0.0);

    // Récupère couleur de la texture
    vec4 texColor = texture2D(uSampler, vTextureCoord);

    // Applique éclairage
    vec3 ambient = texColor.rgb * 0.3;
    vec3 diffuse = texColor.rgb * diff * 0.7;

    gl_FragColor = vec4(ambient + diffuse, texColor.a);
}