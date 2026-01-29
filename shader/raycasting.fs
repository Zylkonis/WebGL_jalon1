#version 300 es
#define MAX_SPHERES 32

precision mediump float;

uniform float density;
uniform highp sampler3D texture_3D;
uniform vec3 u_boxSize;  // Taille de la boîte (width, depth, height)

in vec3 pos3D;      // Position en view space
in vec3 localPos;   // Position locale NON transformée
out vec4 fragColor;

void main(void) {
    // Convertit la position locale en coordonnées de texture normalisées [0, 1]
    // localPos va de [-size, -size, 0] à [size, size, height]
    vec3 texCoord;
    texCoord.x = (localPos.x - 1.) * 0.5 ;  // de [-size, size] à [0, 1]
    texCoord.y = (localPos.y - 1.) * 0.5 ;  // de [-size, size] à [0, 1]
    texCoord.z = (localPos.z + 1.) * 0.5 ;   // de [0, height] à [0, 1]

    // Échantillonne la texture 3D
    float color = texture(texture_3D, texCoord).r;

    // Affiche la valeur de la texture
    fragColor = vec4(color ,color ,color , 1.0);
}

//void main(void) {
//    vec3 rayDir = normalize(pos3D);  // Ray direction from camera through fragment
//
//    for(int i = 0; i < 2; i++) {
//        vec3 sphereCenter = u_spheres[i].xyz;
//        float sphereRadius = u_spheres[i].w;
//
//        float a = dot(rayDir, rayDir);
//        float b = -2.0 * dot(rayDir, sphereCenter);
//        float c = dot(sphereCenter, sphereCenter) - (sphereRadius * sphereRadius);
//
//        float Delta = (b * b) - 4.0 * a * c;
//
//        if (Delta >= 0.0) {
//            gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
//            break;
//        }
//        else
//            gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
//    }
//}

