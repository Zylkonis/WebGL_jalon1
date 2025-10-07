precision mediump float;

uniform vec3 uLightColor;
uniform vec3 Ks;
uniform vec3 Kd;
uniform float shininess;
uniform vec3 objColor;
uniform float li;

varying vec3 N;
varying vec4 pos3D;

void main(void) {

    //vec3 uLightColor = vec3(1.0); // lumière blanche
    //vec3 Kd = vec3(0.8); // diffuse rouge-orangée
    //vec3 Ks = vec3(0.2); // réflexion blanche
    //float shininess = 0.5; // brillance

    float pi = 3.14159265;
    vec3 normale =normalize(N);
    vec3 lightdir = normalize(-pos3D.xyz);
    float weight = max(dot(normale, lightdir),0.0);
    vec3 v = normalize(-pos3D.xyz);
    vec3 h = normalize(v+lightdir);
    float cosOi = max(dot(normale, lightdir), 0.0);
    float specFactor = pow(max(dot(normale, h), 0.0), shininess);

    vec3 FrP = (Kd * (1.0 - Ks) / pi) + ((shininess + 2.0) / (2.0 * pi)) * Ks * specFactor;

    vec3 Lo = objColor * ((li * uLightColor) * FrP * cosOi);

    gl_FragColor = vec4(Lo, 1.0);
}

