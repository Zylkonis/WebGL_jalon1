#define MAX_SPHERES 32

precision mediump float;

uniform vec4 u_spheres[MAX_SPHERES]; // xyz = centre (espace local), w = rayon
uniform int u_sphereCount;
uniform mat4 uMVMatrix;  // ← AJOUT IMPORTANT
uniform mat4 uPMatrix;   // ← AJOUT IMPORTANT

varying vec4 pos3D;

void main(void) {
    vec4 outColor = vec4(0.0, 0.0, 0.0, 0.0);

    float step = 0.02;
    int maxSteps = 128;

    // Calculer la direction du rayon en espace vue
    vec3 rayDir = normalize(pos3D.xyz);
    vec3 rayOrigin = vec3(0.0, 0.0, 0.0);

    float globalAlphaAcc = 0.0;

    for (int sphereIdx = 0; sphereIdx < MAX_SPHERES; sphereIdx++) {
        if (sphereIdx >= u_sphereCount) break;

        // Position de la sphère en espace local
        vec3 sphereCenterLocal = u_spheres[sphereIdx].xyz;
        float sphereRadius = u_spheres[sphereIdx].w;

        // ⚠️ CLEF : Transformer le centre de la sphère en espace vue
        vec4 sphereCenterView = uMVMatrix * vec4(sphereCenterLocal, 1.0);
        vec3 sphereCenter = sphereCenterView.xyz;

        // Calcul d'intersection rayon-sphère EN ESPACE VUE
        vec3 oc = rayOrigin - sphereCenter;
        float a = dot(rayDir, rayDir);
        float b = 2.0 * dot(oc, rayDir);
        float c = dot(oc, oc) - (sphereRadius * sphereRadius);

        float delta = (b * b) - (4.0 * a * c);

        if (delta > 0.0) {
            float sqrtDelta = sqrt(delta);
            float t1 = (-b - sqrtDelta) / (2.0 * a);
            float t2 = (-b + sqrtDelta) / (2.0 * a);

            if (t2 > 0.0) {
                float tStart = max(t1, 0.0);
                float tEnd = t2;

                for (int stepIdx = 0; stepIdx < 128; stepIdx++) {
                    if (stepIdx >= maxSteps) break;
                    if (globalAlphaAcc > 0.999) break;

                    float t = tStart + float(stepIdx) * step;
                    if (t >= tEnd) break;

                    vec3 marchPos = rayOrigin + rayDir * t;
                    float distToCenter = length(marchPos - sphereCenter);

                    float normalizedDist = distToCenter / sphereRadius;
                    float density = 0.0;

                    if (normalizedDist < 1.0) {
                        density = 1.5 * pow(1.0 - normalizedDist, 2.0);
                    }

                    if (density > 0.01) {
                        float absorption = 1.0 - exp(-density * step);
                        vec3 sampleColor = vec3(1.0, 1.0, 1.0);

                        outColor.rgb += (1.0 - globalAlphaAcc) * sampleColor * absorption;
                        globalAlphaAcc += (1.0 - globalAlphaAcc) * absorption;
                    }
                }
            }
        }
    }

    if (globalAlphaAcc < 0.01) {
        discard;
    }

    outColor.a = clamp(globalAlphaAcc, 0.0, 1.0);
    gl_FragColor = outColor;
}