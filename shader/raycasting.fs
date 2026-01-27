#define MAX_SPHERES 32

precision mediump float;

uniform float density;
uniform vec4 u_spheres[MAX_SPHERES]; // xyz = centre, w = rayon
uniform int u_sphereCount; // nbr sphères

varying vec3 pos3D;

//float noise3D(vec3 p)
//{
//    p.z = fract(p.z)*256.0;
//    float iz = floor(p.z);
//    float fz = fract(p.z);
//    vec2 a_off = vec2(23.0, 29.0)*(iz)/256.0;
//    vec2 b_off = vec2(23.0, 29.0)*(iz+1.0)/256.0;
//    float a = texture2D(iChannel0, p.xy + a_off, -999.0).r;
//    float b = texture2D(iChannel0, p.xy + b_off, -999.0).r;
//    return mix(a, b, fz);
//}
//
//float perlinNoise3D(vec3 p)
//{
//    float x = 0.0;
//    for (float i = 0.0; i < 6.0; i += 1.0)
//        x += noise3D(p * pow(2.0, i)) * pow(0.5, i);
//    return x;
//}
//
//void main(void) {
//
//    gl_FragColor = vec4 (perlinNoise3D(pos3D), 1.0);
//}

void main(void) {
    vec3 rayDir = normalize(pos3D);  // Ray direction from camera through fragment

    for(int i = 0; i < 2; i++) {
        vec3 sphereCenter = u_spheres[i].xyz;
        float sphereRadius = u_spheres[i].w;

        float a = dot(rayDir, rayDir);
        float b = -2.0 * dot(rayDir, sphereCenter);
        float c = dot(sphereCenter, sphereCenter) - (sphereRadius * sphereRadius);

        float Delta = (b * b) - 4.0 * a * c;

        if (Delta >= 0.0) {
            gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
            break;
        }
        else
            gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
    }
}

