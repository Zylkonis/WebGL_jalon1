#define MAX_SPHERES 32

uniform vec4 u_spheres[MAX_SPHERES]; // xyz = centre, w = rayon
uniform int u_sphereCount; // nbr sphères

varying vec4 pos3D;

void main(void) {

    for(int i = 0; i < u_sphereCount; i++) {
        vec3 sphereCenter = u_spheres[i].xyz;
        float sphereRadius = u_spheres[i].w;

        // Votre logique de ray casting ici
    }
}
