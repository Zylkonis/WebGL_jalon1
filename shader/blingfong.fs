precision mediump float;

uniform vec3 uLightColor;
uniform vec3 Ks;
uniform vec3 Kd;
uniform float shininess;
uniform vec3 objColor;
uniform float li;
uniform bool useBumpMap;
uniform sampler2D u_texture;

varying vec3 N;
varying vec4 pos3D;
varying vec2 texCoords;

void main(void) {
    float pi = 3.14159265;
    vec3 normale;

    if(useBumpMap){
        vec3 rgb = texture2D(u_texture, texCoords).rgb;
        vec3 temp = normalize(rgb * 2.0 - 1.0);
        normale = normalize(temp + N);

    }
    else {
        normale = normalize(N);
    }

    vec3 lightdir = normalize(-pos3D.xyz);
    float weight = max(dot(normale, lightdir), 0.0);
    vec3 v = normalize(-pos3D.xyz);
    vec3 h = normalize(v + lightdir);
    float cosOi = max(dot(normale, lightdir), 0.0);
    float specFactor = pow(max(dot(normale, h), 0.0), shininess);

    vec3 diffuseTerm = objColor * (Kd * (1.0 - Ks) / pi) * cosOi;
    vec3 specularTerm = uLightColor * ((shininess + 2.0) / (2.0 * pi)) * Ks * specFactor * cosOi;
    vec3 Lo = (diffuseTerm + specularTerm) * li;

    gl_FragColor = vec4(Lo, 1.0);
}
