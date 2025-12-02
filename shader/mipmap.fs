precision mediump float;

uniform sampler2D u_texture_1;
uniform sampler2D u_texture_2;

uniform sampler2D u_texture_grayscale_1;
uniform sampler2D u_texture_grayscale_2;

uniform sampler2D u_noise;

varying vec3 N;
varying vec4 pos3D;
varying vec2 texCoords;

void main(void) {
    float rgb_1 = texture2D(u_texture_grayscale_1, texCoords).r;
    float rgb_2 = texture2D(u_texture_grayscale_2, texCoords).r;
    float noiseBrightness = texture2D(u_noise, texCoords).r;

    vec3 lightDir = normalize(vec3(0.5, 0.5, 1.0));
    float diff = max(dot(N, lightDir), 0.0);

    vec4 finalColor;

    if (noiseBrightness < 0.1) {
        // Zone moyenne (0-25%) : t1 pure
        finalColor = vec4(texture2D(u_texture_1, texCoords).rgb, 1.0);
    }
    else if (noiseBrightness < 0.9) {
        // (25-75%) : transition de t1 vers t2
        if (noiseBrightness + rgb_1 >  1.0 - noiseBrightness + rgb_2) {
            finalColor = vec4(texture2D(u_texture_1, texCoords).rgb, 1.0);
        }
        else {
            finalColor = vec4(texture2D(u_texture_2, texCoords).rgb, 1.0);
        }
    } else{
        // Zone moyenne (75-100%) : t2 pure
        finalColor = vec4(texture2D(u_texture_1, texCoords).rgb, 1.0);
    }

    vec3 ambient = finalColor.rgb * 0.3;
    vec3 diffuse = finalColor.rgb * diff * 0.7;

    gl_FragColor = vec4(ambient + diffuse, finalColor.a);
}
