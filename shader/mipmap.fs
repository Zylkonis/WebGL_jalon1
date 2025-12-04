precision mediump float; //varying vec4 pos3D;

varying vec3 N;
uniform sampler2D u_noise;
varying vec2 texCoords;

uniform sampler2D u_texture_1;  uniform sampler2D u_texture_grayscale_1;
uniform sampler2D u_texture_2;  uniform sampler2D u_texture_grayscale_2;
uniform sampler2D u_texture_3;  uniform sampler2D u_texture_grayscale_3;

void main(void) {
    float rgb_1 = texture2D(u_texture_grayscale_1, texCoords).r;
    float rgb_2 = texture2D(u_texture_grayscale_2, texCoords).r;
    float noiseBrightness = texture2D(u_noise, texCoords).r;

    vec3 lightDir = normalize(vec3(0.5, 0.5, 1.0));
    float diff = max(dot(N, lightDir), 0.0);

    vec4 finalColor;

    //TODO: 3-4 textures + sliders pour séparateurs et deltas
    float sep1 = 0.25;
    float delta1 = 0.15;

    if (noiseBrightness < sep1 - delta1) {
        // Zone moyenne (0-25%) : t1 pure
        finalColor = vec4(texture2D(u_texture_1, texCoords).rgb, 1.0);
    }
    else if (noiseBrightness < sep1 + delta1) {
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
