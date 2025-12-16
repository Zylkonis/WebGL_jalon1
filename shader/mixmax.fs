precision mediump float; //varying vec4 pos3D;

varying vec3 vNormal;
uniform sampler2D u_noise;
varying vec2 vTextureCoord;

uniform sampler2D uSampler0;  uniform sampler2D uSampler_grayscale_0;
uniform sampler2D uSampler1;  uniform sampler2D uSampler_grayscale_1;
uniform sampler2D uSampler2;  uniform sampler2D uSampler_grayscale_2;

uniform float treshold_1to2; uniform float alpha_1to2;
uniform float treshold_2to3; uniform float alpha_2to3;


void main(void) {
    float rgb_1 = texture2D(uSampler_grayscale_0, vTextureCoord).r;
    float rgb_2 = texture2D(uSampler_grayscale_1, vTextureCoord).r;
    float rgb_3 = texture2D(uSampler_grayscale_2, vTextureCoord).r;
    float noiseBrightness = texture2D(u_noise, vTextureCoord).r;

    vec3 lightDir = normalize(vec3(0.5, 0.5, 1.0));
    float diff = max(dot(vNormal, lightDir), 0.0);

    vec4 finalColor;

    if (noiseBrightness < treshold_1to2 - alpha_1to2) {
        // Zone basse : t1 pure
        finalColor = vec4(texture2D(uSampler0, vTextureCoord).rgb, 1.0);
    }
    else if (noiseBrightness < treshold_1to2 + alpha_1to2) {
        // Zone transition t1 vers t2
        if (noiseBrightness + rgb_1 >  1.0 - noiseBrightness + rgb_2) {
            finalColor = vec4(texture2D(uSampler0, vTextureCoord).rgb, 1.0);
        }
        else {
            finalColor = vec4(texture2D(uSampler1, vTextureCoord).rgb, 1.0);
        }
    }
    else if (noiseBrightness < treshold_2to3 - alpha_2to3) {
        // Zone moyenne : t2 pure
        finalColor = vec4(texture2D(uSampler1, vTextureCoord).rgb, 1.0);
    }
    else if (noiseBrightness < treshold_2to3 + alpha_2to3) {
        // Zone transition t1 vers t2
        if (noiseBrightness + rgb_2 >  1.0 - noiseBrightness + rgb_3) {
            finalColor = vec4(texture2D(uSampler1, vTextureCoord).rgb, 1.0);
        }
        else {
            finalColor = vec4(texture2D(uSampler2, vTextureCoord).rgb, 1.0);
        }
    }
    else{
        // Zone haute : t3 pure
        finalColor = vec4(texture2D(uSampler2, vTextureCoord).rgb, 1.0);
    }

    vec3 ambient = finalColor.rgb * 0.3;
    vec3 diffuse = finalColor.rgb * diff * 0.7;

    gl_FragColor = vec4(ambient + diffuse, finalColor.a);
}
