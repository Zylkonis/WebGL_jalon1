precision mediump float;

varying vec3 vNormal;
uniform sampler2D u_heightmap;
varying vec2 vTextureCoord;

uniform sampler2D uSampler0;
uniform sampler2D uSampler_grayscale_0;
uniform sampler2D uSampler1;
uniform sampler2D uSampler_grayscale_1;
uniform sampler2D uSampler2;
uniform sampler2D uSampler_grayscale_2;

uniform float treshold_1to2;
uniform float alpha_1to2;
uniform float treshold_2to3;
uniform float alpha_2to3;

// Min-max blending function (Fournier-Sauvage method)
vec4 minMaxBlend(vec4 color1, float height1, vec4 color2, float height2, float blendFactor, float alpha) {
    // Adjust heights by blend factor
    float h1 = height1 + blendFactor;
    float h2 = height2 + (1.0 - blendFactor);

    // Smooth transition zone
    float diff = abs(h1 - h2);

    if (diff < alpha) {
        // Within transition zone - smooth blend
        float t = (h1 - h2 + alpha) / (2.0 * alpha);
        t = clamp(t, 0.0, 1.0);
        return mix(color2, color1, t);
    } else {
        // Outside transition zone - pick max height
        return (h1 > h2) ? color1 : color2;
    }
}

void main(void) {
    float texture_scaling = 8.;

    // Sample grayscale heightmaps
    float height_1 = texture2D(uSampler_grayscale_0, vTextureCoord * texture_scaling).r;
    float height_2 = texture2D(uSampler_grayscale_1, vTextureCoord * texture_scaling).r;
    float height_3 = texture2D(uSampler_grayscale_2, vTextureCoord * texture_scaling).r;

    // Sample color textures
    vec4 color_1 = texture2D(uSampler0, vTextureCoord * texture_scaling);
    vec4 color_2 = texture2D(uSampler1, vTextureCoord * texture_scaling);
    vec4 color_3 = texture2D(uSampler2, vTextureCoord * texture_scaling);

    // Noise value (this is your control parameter)
    float heightmapBrightness = texture2D(u_heightmap, vTextureCoord).r;

    vec4 finalColor;

    if (heightmapBrightness < treshold_1to2 - alpha_1to2) { // Si la hauteur est sous la première zone de transition
        // Pure texture 1
        finalColor = color_1;
    }
    else if (heightmapBrightness < treshold_1to2 + alpha_1to2) { // Si la hauteur est dans la première zone de transition
        // Transition between texture 1 and 2
        float blendFactor = (heightmapBrightness - (treshold_1to2 - alpha_1to2)) / (2.0 * alpha_1to2);
        finalColor = minMaxBlend(color_2, height_2, color_1, height_1,  blendFactor, alpha_1to2);
    }
    else if (heightmapBrightness < treshold_2to3 - alpha_2to3) { // Si la hauteur est sous la deuxième zone de transition
        // Pure texture 2
        finalColor = color_2;
    }
    else if (heightmapBrightness < treshold_2to3 + alpha_2to3) { // Si la hauteur est dans la deuxième zone de transition
        // Transition between texture 2 and 3
        float blendFactor = (heightmapBrightness - (treshold_2to3 - alpha_2to3)) / (2.0 * alpha_2to3);
        finalColor = minMaxBlend( color_3, height_3, color_2, height_2, blendFactor, alpha_2to3);
    }
    else { // Si la hauteur est au dessus des zones de transition
        // Pure texture 3
        finalColor = color_3;
    }

    // Lighting calculation
    vec3 lightDir = normalize(vec3(0.5, 0.5, 1.0));
    float diff = max(dot(vNormal, lightDir), 0.0);

    vec3 ambient = finalColor.rgb * 0.3;
    vec3 diffuse = finalColor.rgb * diff * 0.7;

    gl_FragColor = vec4(ambient + diffuse, finalColor.a);
}