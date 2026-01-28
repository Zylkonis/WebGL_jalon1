#define MAX_SPHERES 32

precision mediump float;

uniform float density;
uniform vec3 texture_3D;
varying vec3 pos3D;

void main(void) {
    //float color = noise3D(pos3D);
	gl_FragColor = vec4(0.5, 0.5, 0.5, 1.0);

	vec3 rayDir = normalize(pos3D);  // Ray direction from camera through fragment
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

