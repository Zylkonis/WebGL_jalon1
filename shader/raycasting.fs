#version 300 es

precision highp float;

uniform highp sampler3D texture_3D;
uniform vec3 u_boxSize;  // Taille de la boîte (width, depth, height)
uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform vec3 objColor;
uniform float u_windAngle;   // Angle du vent en radians (0 = axe X positif)
uniform float u_windSpeed;   // Vitesse du vent
uniform float u_time;        // Temps pour l'animation

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
    vec4 localPos4 = inverse(uMVMatrix) * vec4(viewPos, 1.0);
    return localPos4.xyz;
}

// Applique le mouvement du vent aux coordonnées de texture
vec3 applyWindMovement(vec3 texCoord, vec3 localPosition) {
    // Calculer le vecteur de déplacement basé sur l'angle et la vitesse
    vec2 windDirection = vec2(cos(u_windAngle), sin(u_windAngle));

    // Créer un mouvement basé sur le temps uniforme
    vec2 offset = windDirection * u_windSpeed * u_time;

    // Appliquer le décalage avec wrapping (pour que le nuage boucle)
    vec3 movedTexCoord = texCoord;
    movedTexCoord.x = fract(texCoord.x + offset.x);
    movedTexCoord.y = fract(texCoord.y + offset.y);

    return movedTexCoord;
}

// Calcule un éclairage simple basé sur la densité et la profondeur
float calculateCloudShading(float density, float depth, float maxDepth) {
    // Atténuation en profondeur (les parties profondes sont plus sombres)
    float depthFactor = 1.0 - (depth / maxDepth) * 0.5;     //TODO: slider controle facteur profondeur (0.5)

    // Les zones denses diffusent moins de lumière (plus sombres)
    float densityFactor = 1.0 - density * 0.7;  //TODO: slider controle densité (0.7)

    return depthFactor * densityFactor;
}

void main(void) {
    vec4 outColor = vec4(0.0, 0.0, 0.0, 0.0);

    int numSteps = 128;

    // Ray marching en espace LOCAL
    vec3 rayOriginLocal = viewToLocal(vec3(0.0, 0.0, 0.0));
    vec3 rayEndLocal = viewToLocal(normalize(pos3D.xyz));
    vec3 rayDirLocal = normalize(rayEndLocal - rayOriginLocal);

    float globalAlphaAcc = 0.0;
    float transmittance = 1.0;  // Pour le calcul de la lumière transmise

    // Calculer l'intersection avec la bounding box en espace local
    vec3 boxMin = vec3(-u_boxSize.x, -u_boxSize.y, 0.0);
    vec3 boxMax = vec3(u_boxSize.x, u_boxSize.y, u_boxSize.z);

    // Ray-box intersection
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

    // Calculer la distance totale à parcourir dans la boîte
    float totalDistance = tEnd - tStart;

    // Calculer la taille du pas en fonction de la distance
    float stepSize = totalDistance / float(numSteps);

    // Ray marching avec exactement 128 pas
    for (int stepIdx = 0; stepIdx < 200; stepIdx++) {
        if (globalAlphaAcc > 0.95) break;  // Arrêt anticipé pour les nuages opaques

        // Calcul de la position le long du rayon
        float t = tStart + float(stepIdx) * stepSize;
        float depth = float(stepIdx) * stepSize;

        // Position actuelle en espace LOCAL
        vec3 currentPos = rayOriginLocal + rayDirLocal * t;

        // Convertir en coordonnées de texture
        vec3 texCoord = localToTexCoord(currentPos);

        // Vérification des limites (sécurité)
        if (texCoord.x < 0.0 || texCoord.x > 1.0 ||
            texCoord.y < 0.0 || texCoord.y > 1.0 ||
            texCoord.z < 0.0 || texCoord.z > 1.0) {
            continue;
        }

        // Appliquer le mouvement du vent en utilisant la position locale
        vec3 movedTexCoord = applyWindMovement(texCoord, currentPos);

        // Échantillonner la densité depuis la texture 3D avec le mouvement
        float densitySample = texture(texture_3D, movedTexCoord).r;

        if (densitySample > 0.01) {
            // Calcul de l'ombrage du nuage
            float shading = calculateCloudShading(densitySample, depth, totalDistance);

            // Couleur du nuage avec variation de gris (pas blanc pur)
            // Les nuages réels varient du gris clair au gris foncé
            vec3 sampleColor = objColor * shading;

            // Absorption ajustée pour un rendu plus doux
            float absorption = 1.0 - exp(-densitySample * stepSize * 60.0); //TODO: slider controle absorbtion (60.0)

            // Atténuation de la lumière à travers le nuage
            transmittance *= exp(-densitySample * stepSize * 35.0); //TODO: slider controle transmitance (35.0)

            // Accumulation front-to-back avec atténuation
            float weight = absorption * transmittance;
            outColor.rgb += sampleColor * weight;
            globalAlphaAcc += weight;
        }
    }

    if (globalAlphaAcc < 0.01) {
        discard;
    }

    // Normaliser la couleur par l'alpha accumulé pour éviter le sur-éclairage
    if (globalAlphaAcc > 0.01) {
        outColor.rgb /= max(globalAlphaAcc, 0.01);
    }

    outColor.a = clamp(globalAlphaAcc, 0.0, 1.0);
    fragColor = outColor;
}