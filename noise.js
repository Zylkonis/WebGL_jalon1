let noise_scale = 10.0;
let noise_transform = { x: 0.0, y: 0.0, z: 0.0 };

// Fonction pour crée un tableau a multi dimension
function makeMultDirArray(dim, lvl, arr) {
    if (lvl === 1) return [];
    if (!lvl) lvl = dim;
    if (!arr) arr = [];
    for (var i = 0, l = dim; i < l; i += 1) {
        arr[i] = makeMultDirArray(dim, lvl - 1, arr[i]);
    }
    return arr;
}

// Fonction utilitaire pour créer un vecteur 3D
function noiseVec3(x, y, z) {
    return { x, y, z };
}

// Produit scalaire
function dot(v1, v2) {
    return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
}

// Partie fractionnaire
function fract(v) {
    if (typeof v === 'number') {
        return v - Math.floor(v);
    }
    return noiseVec3(
        v.x - Math.floor(v.x),
        v.y - Math.floor(v.y),
        v.z - Math.floor(v.z)
    );
}

// Fonction floor pour vecteurs
function floor(v) {
    return noiseVec3(Math.floor(v.x), Math.floor(v.y), Math.floor(v.z));
}

// Fonction smoothstep
function smoothstep(edge0, edge1, v) {
    const t = Math.max(0, Math.min(1, (v - edge0) / (edge1 - edge0)));
    return t * t * (3 - 2 * t);
}

function smoothstepVec3(edge0, edge1, v) {
    return noiseVec3(
        smoothstep(edge0, edge1, v.x),
        smoothstep(edge0, edge1, v.y),
        smoothstep(edge0, edge1, v.z)
    );
}

// Fonction mix (interpolation linéaire)
function mix(a, b, t) {
    return a * (1 - t) + b * t;
}

function random3D(uvw) {
    let v = noiseVec3(
        dot(uvw, noiseVec3(127.1, 311.7, 513.7)),
        dot(uvw, noiseVec3(269.5, 183.3, 396.5)),
        dot(uvw, noiseVec3(421.3, 314.1, 119.7))
    );

    v = noiseVec3(
        Math.sin(v.x) * 43758.5453123,
        Math.sin(v.y) * 43758.5453123,
        Math.sin(v.z) * 43758.5453123
    );

    v = fract(v);

    return noiseVec3(
        -1.0 + 2.0 * v.x,
        -1.0 + 2.0 * v.y,
        -1.0 + 2.0 * v.z
    );
}

function noise3D(uvw) {
    // Multiplication par le scale
    uvw = noiseVec3(
        uvw.x * noise_scale,
        uvw.y * noise_scale,
        uvw.z * noise_scale
    );

    // Addition de la transformation
    uvw = noiseVec3(
        uvw.x + noise_transform.x,
        uvw.y + noise_transform.y,
        uvw.z + noise_transform.z
    );

    const gridIndex = floor(uvw);
    const gridFract = fract(uvw);

    const blur = smoothstepVec3(0.0, 1.0, gridFract);

    const blb = noiseVec3(gridIndex.x + 0.0, gridIndex.y + 0.0, gridIndex.z + 0.0);
    const brb = noiseVec3(gridIndex.x + 1.0, gridIndex.y + 0.0, gridIndex.z + 0.0);
    const tlb = noiseVec3(gridIndex.x + 0.0, gridIndex.y + 1.0, gridIndex.z + 0.0);
    const trb = noiseVec3(gridIndex.x + 1.0, gridIndex.y + 1.0, gridIndex.z + 0.0);
    const blf = noiseVec3(gridIndex.x + 0.0, gridIndex.y + 0.0, gridIndex.z + 1.0);
    const brf = noiseVec3(gridIndex.x + 1.0, gridIndex.y + 0.0, gridIndex.z + 1.0);
    const tlf = noiseVec3(gridIndex.x + 0.0, gridIndex.y + 1.0, gridIndex.z + 1.0);
    const trf = noiseVec3(gridIndex.x + 1.0, gridIndex.y + 1.0, gridIndex.z + 1.0);

    const gradBLB = random3D(blb);
    const gradBRB = random3D(brb);
    const gradTLB = random3D(tlb);
    const gradTRB = random3D(trb);
    const gradBLF = random3D(blf);
    const gradBRF = random3D(brf);
    const gradTLF = random3D(tlf);
    const gradTRF = random3D(trf);

    const distToPixelFromBLB = noiseVec3(gridFract.x - 0.0, gridFract.y - 0.0, gridFract.z - 0.0);
    const distToPixelFromBRB = noiseVec3(gridFract.x - 1.0, gridFract.y - 0.0, gridFract.z - 0.0);
    const distToPixelFromTLB = noiseVec3(gridFract.x - 0.0, gridFract.y - 1.0, gridFract.z - 0.0);
    const distToPixelFromTRB = noiseVec3(gridFract.x - 1.0, gridFract.y - 1.0, gridFract.z - 0.0);
    const distToPixelFromBLF = noiseVec3(gridFract.x - 0.0, gridFract.y - 0.0, gridFract.z - 1.0);
    const distToPixelFromBRF = noiseVec3(gridFract.x - 1.0, gridFract.y - 0.0, gridFract.z - 1.0);
    const distToPixelFromTLF = noiseVec3(gridFract.x - 0.0, gridFract.y - 1.0, gridFract.z - 1.0);
    const distToPixelFromTRF = noiseVec3(gridFract.x - 1.0, gridFract.y - 1.0, gridFract.z - 1.0);

    const dotBLB = dot(gradBLB, distToPixelFromBLB);
    const dotBRB = dot(gradBRB, distToPixelFromBRB);
    const dotTLB = dot(gradTLB, distToPixelFromTLB);
    const dotTRB = dot(gradTRB, distToPixelFromTRB);
    const dotBLF = dot(gradBLF, distToPixelFromBLF);
    const dotBRF = dot(gradBRF, distToPixelFromBRF);
    const dotTLF = dot(gradTLF, distToPixelFromTLF);
    const dotTRF = dot(gradTRF, distToPixelFromTRF);

    return mix(
        mix(
            mix(dotBLB, dotBRB, blur.x),
            mix(dotTLB, dotTRB, blur.x),
            blur.y
        ),
        mix(
            mix(dotBLF, dotBRF, blur.x),
            mix(dotTLF, dotTRF, blur.x),
            blur.y
        ),
        blur.z
    ) + 0.5;
}

// Exemple d'utilisation :
// const result = noise3D(noiseVec3(0.5, 0.5, 0.5));
// console.log(result);