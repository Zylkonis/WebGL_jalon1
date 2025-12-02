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

    if(noiseBrightness < 0.2){
        gl_FragColor = vec4(texture2D(u_texture_2, texCoords).rgb, 1.0);
    }
    else if(noiseBrightness > 0.3){
        gl_FragColor = vec4(texture2D(u_texture_1, texCoords).rgb, 1.0);
    }
    else{
        if(rgb_1 + noiseBrightness < rgb_2 + 1.0 - noiseBrightness)
            gl_FragColor = vec4(texture2D(u_texture_2, texCoords).rgb, 1.0);
        else
            gl_FragColor = vec4(texture2D(u_texture_1, texCoords).rgb, 1.0);

        //float blend = vHeight / 0.2;
        //finalColor = mix(texture2D(u_texture_2, texCoords).rgb, texture2D(u_texture_1, texCoords).rgb, blend);
        //gl_FragColor = vec4(finalColor, 1.0);
    }
}
