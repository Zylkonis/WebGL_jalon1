#define MAX_SPHERES 32

uniform float density;
uniform vec4 u_spheres[MAX_SPHERES]; // xyz = centre, w = rayon
uniform int u_sphereCount; // nbr sphères

varying vec4 pos3D;

void main(void) {

    for(int i = 0; i < u_sphereCount; i++) {
        // Coordonnées de la source lumineuse nulles car dans la caméra
        // vect directeur du rayon = coordonnées du point d'arrivé
        float rayX = pos3D.x;
        float rayY = pos3D.y;
        float rayZ = pos3D.z;

        vec3 sphereCenter = u_spheres[i].xyz;
        float sphereRadius = u_spheres[i].w;

        // Intersection droite rayon X sphere nuage
        float a = (rayX * rayX) + (rayY * rayY) + (rayZ * rayZ);
        float b = -2 * (rayX * sphereCenter.x + rayY * sphereCenter.x + rayZ * sphereCenter.x);
        float c = (sphereCenter.x * sphereCenter.x) + (sphereCenter.y * sphereCenter.y) + (sphereCenter.z * sphereCenter.z) + (sphereRadius * sphereRadius);

        Delta = (b*b) - 4*a*c;

        if (Delta >= 0) {
            gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);    // Blanc au niveau des intersections
        }
    }
}
