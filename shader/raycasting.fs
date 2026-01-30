#version 300 es

precision highp float;

uniform highp sampler3D texture_3D;
uniform vec3 u_boxSize;  // Taille de la boîte (width, depth, height)
uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform vec3 objColor;

in vec3 pos3D;      // Position en view space
in vec3 localPos;   // Position locale NON transformée

out vec4 fragColor;

// Convertit une position locale en coordonnées de texture [0, 1]
vec3 localToTexCoord(vec3 local) {
    vec3 texCoord;
    texCoord.x = (local.x + u_boxSize.x) / (2.0 * u_boxSize.x);  // [-size, size] → [0, 1]
    texCoord.y = (local.y + u_boxSize.y) / (2.0 * u_boxSize.y);  // [-size, size] → [0, 1]
    texCoord.z = local.z / u_boxSize.z;                          // [0, height] → [0, 1]
    return texCoord;
}

// Convertit une position en view space vers l'espace local
vec3 viewToLocal(vec3 viewPos) {
    // Inverse de la transformation uMVMatrix
    vec4 localPos4 = inverse(uMVMatrix) * vec4(viewPos, 1.0);
    return localPos4.xyz;
}

void main(void) {
    vec4 outColor = vec4(0.0, 0.0, 0.0, 0.0);

    float step = 0.02;
    int maxSteps = 128;

    // Ray marching en espace vue
    vec3 rayDir = normalize(pos3D.xyz);
    vec3 rayOrigin = vec3(0.0, 0.0, 0.0);

    float globalAlphaAcc = 0.0;

    // Calculer l'intersection avec la bounding box en espace local
    vec3 boxMin = vec3(-u_boxSize.x, -u_boxSize.y, 0.0);
    vec3 boxMax = vec3(u_boxSize.x, u_boxSize.y, u_boxSize.z);

    // Transformer rayOrigin et rayDir en espace local pour l'intersection
    vec3 rayOriginLocal = viewToLocal(rayOrigin);
    vec3 rayDirLocal = normalize(viewToLocal(rayOrigin + rayDir) - rayOriginLocal);

    // Ray-box intersection (algorithme de Smits)
    vec3 invRayDir = 1.0 / rayDirLocal;
    vec3 tMin = (boxMin - rayOriginLocal) * invRayDir;
    vec3 tMax = (boxMax - rayOriginLocal) * invRayDir;

    vec3 t1 = min(tMin, tMax);
    vec3 t2 = max(tMin, tMax);

    float tNear = max(max(t1.x, t1.y), t1.z);
    float tFar = min(min(t2.x, t2.y), t2.z);

    if (tNear > tFar || tFar < 0.0) {
        discard; // Pas d'intersection avec la box
    }

    float tStart = max(tNear, 0.0);
    float tEnd = tFar;

    // Ray marching le long du rayon
    for (int stepIdx = 0; stepIdx < 128; stepIdx++) {
        if (stepIdx >= maxSteps) break;
        if (globalAlphaAcc > 0.999) break;

        float t = tStart + float(stepIdx) * step;
        if (t >= tEnd) break;

        // Position actuelle en espace vue
        vec3 marchPosView = rayOrigin + rayDir * t;

        // Convertir en espace local
        vec3 marchPosLocal = viewToLocal(marchPosView);

        // Convertir en coordonnées de texture
        vec3 texCoord = localToTexCoord(marchPosLocal);

        // Vérifier que nous sommes dans les limites [0, 1]
        if (texCoord.x < 0.0 || texCoord.x > 1.0 ||
            texCoord.y < 0.0 || texCoord.y > 1.0 ||
            texCoord.z < 0.0 || texCoord.z > 1.0) {
            continue;
        }

        // Échantillonner la densité depuis la texture 3D
        float densitySample = texture(texture_3D, texCoord).r;

        if (densitySample > 0.01) {
            // Absorption de la lumière
            float absorption = 1.0 - exp(-densitySample * step);

            // Couleur du nuage (blanc)
            vec3 sampleColor = vec3(objColor);

            // Accumulation front-to-back
            outColor.rgb += (1.0 - globalAlphaAcc) * sampleColor * absorption;
            globalAlphaAcc += (1.0 - globalAlphaAcc) * absorption;
        }
    }

    if (globalAlphaAcc < 0.01) {
        discard;
    }

    outColor.a = clamp(globalAlphaAcc, 0.0, 1.0);
    fragColor = outColor;
}