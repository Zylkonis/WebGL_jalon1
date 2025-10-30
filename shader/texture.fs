precision mediump float;

varying vec3 vNormal;
varying vec2 vTextureCoord;
varying float vHeight;

uniform sampler2D uSampler0;  // Texture basse altitude (0-20%)
uniform sampler2D uSampler1;  // Texture moyenne altitude (20-80%)
uniform sampler2D uSampler2;  // Texture haute altitude (80-100%)

void main(void) {
    vec3 lightDir = normalize(vec3(0.5, 0.5, 1.0));
    vec3 normal = normalize(vNormal);
    float diff = max(dot(normal, lightDir), 0.0);

    vec4 texColor0 = texture2D(uSampler0, vTextureCoord * 10.0);  // Répète la texture
    vec4 texColor1 = texture2D(uSampler1, vTextureCoord * 10.0);
    vec4 texColor2 = texture2D(uSampler2, vTextureCoord * 10.0);

    vec4 finalColor;

    if (vHeight < 0.2) {
        // (0-20%) : transition de t0 vers t1
        float blend = vHeight / 0.2;
        finalColor = mix(texColor0, texColor1, blend);
    } else if (vHeight < 0.8) {
        // Zone moyenne (20-80%) : t1 pure
        finalColor = texColor1;
    } else {
        // Zone haute (80-100%) : transition de t1 vers t2
        float blend = (vHeight - 0.8) / 0.2;
        finalColor = mix(texColor1, texColor2, blend);
    }

    vec3 ambient = finalColor.rgb * 0.3;
    vec3 diffuse = finalColor.rgb * diff * 0.7;

    gl_FragColor = vec4(ambient + diffuse, finalColor.a);
}