class cloud extends base_mesh {
    constructor(size, height, cloudSpheres, coord){
        super('raycasting');
        this.size = size;
        this.height = height;
        this.clouds = cloudSpheres;
        this.particlesCount = particlesCount;

        this.cloudColor = [1.0, 1.0, 1.0]; // Couleur des nuages (blanc)
        this.cloudsMatrix = null;

        this.Init();
    }

    Init(){
        super.Init();

        /*for (let spheres = 0; spheres < this.clouds.length ; spheres += 4){
            if(this.clouds[spheres] != null)
                this.clouds[spheres] = this.size / 2 + this.clouds[spheres] * this.size / 2;
            if(this.clouds[spheres+1] != null)
                this.clouds[spheres+1] = this.height / 2 + this.clouds[spheres+1] * this.height / 2;
            if(this.clouds[spheres+2] != null)
                this.clouds[spheres+2] = this.size / 2 + this.clouds[spheres+2] * this.size / 2;
        }*/

        this.clouds = this.generateRandomSpheres(10, 0.1, 0.5, 1., 1., 1.)

        this.mesh = OBJ.Mesh(new XMLHttpRequest().responseText);

        this.mesh = {};
        this.mesh.vertices = [
            // Plafond (top face) - vertices 0-3
            -this.size, -this.size, this.height,
            this.size, -this.size, this.height,
            this.size, this.size, this.height,
            -this.size, this.size, this.height,

            // Sol (bottom face) - vertices 4-7
            -this.size, -this.size, 0,
            this.size, -this.size, 0,
            this.size, this.size, 0,
            -this.size, this.size, 0,

            // Devant (front face) - vertices 8-11
            -this.size, -this.size, 0,
            this.size, -this.size, 0,
            this.size, -this.size, this.height,
            -this.size, -this.size, this.height,

            // Derriere (back face) - vertices 12-15
            this.size, this.size, 0,
            -this.size, this.size, 0,
            -this.size, this.size, this.height,
            this.size, this.size, this.height,

            // Gauche (left face) - vertices 16-19
            -this.size, this.size, 0,
            -this.size, -this.size, 0,
            -this.size, -this.size, this.height,
            -this.size, this.size, this.height,

            // Droite (right face) - vertices 20-23
            this.size, -this.size, 0,
            this.size, this.size, 0,
            this.size, this.size, this.height,
            this.size, -this.size, this.height
        ];

        this.mesh.textures = [
            0.0, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0, 0.0,  // plafond
            0.0, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0, 0.0,  // sol
            0.0, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0, 0.0,  // devant
            0.0, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0, 0.0,  // derriere
            0.0, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0, 0.0,  // gauche
            0.0, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0, 0.0   // droite
        ];

        this.mesh.normale = [
            // Plafond (top) - normal pointing up
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,

            // Sol (bottom) - normal pointing down
            0.0, 0.0, -1.0,
            0.0, 0.0, -1.0,
            0.0, 0.0, -1.0,
            0.0, 0.0, -1.0,

            // Devant (front) - normal pointing forward (negative Y)
            0.0, -1.0, 0.0,
            0.0, -1.0, 0.0,
            0.0, -1.0, 0.0,
            0.0, -1.0, 0.0,

            // Derriere (back) - normal pointing backward (positive Y)
            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,

            // Gauche (left) - normal pointing left (negative X)
            -1.0, 0.0, 0.0,
            -1.0, 0.0, 0.0,
            -1.0, 0.0, 0.0,
            -1.0, 0.0, 0.0,

            // Droite (right) - normal pointing right (positive X)
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0
        ];

        this.mesh.indices = [
            // Plafond
            0, 1, 2,
            0, 2, 3,

            // Sol
            4, 6, 5,
            4, 7, 6,

            // Devant
            8, 9, 10,
            8, 10, 11,

            // Derriere
            12, 13, 14,
            12, 14, 15,

            // Gauche
            16, 17, 18,
            16, 18, 19,

            // Droite
            20, 21, 22,
            20, 22, 23
        ];

        this.cloudsMatrix = new Uint8Array(cloud_sample_size * cloud_sample_size * cloud_sample_size);

        for(let z = 0; z < cloud_sample_size; z += 1){
            for(let y = 0; y < cloud_sample_size; y += 1){
                for(let x = 0; x < cloud_sample_size; x += 1) {
                    let index = x + y * cloud_sample_size + z * cloud_sample_size * cloud_sample_size;

                    const nx = x / cloud_sample_size;
                    const ny = y / cloud_sample_size;
                    const nz = z / cloud_sample_size;

                    const worldX = -this.size + nx * 2 * this.size;
                    const worldY = -this.size + ny * 2 * this.size;
                    const worldZ = nz * this.height;

                    let density = 0.0;

                    if(this.inSphere(worldX, worldY, worldZ)) {
                        density = noise3D(noiseVec3(worldX, worldY, worldZ));
                    }

                    this.cloudsMatrix[index] = Math.floor(Math.max(0, Math.min(1, density)) * 255);
                }
            }
        }

        this.mesh.vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.mesh.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.mesh.vertices), gl.STATIC_DRAW);
        this.mesh.vertexBuffer.itemSize = 3;
        this.mesh.vertexBuffer.numItems = 4;

        this.mesh.textureBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.mesh.textureBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.mesh.textures), gl.STATIC_DRAW);
        this.mesh.textureBuffer.itemSize = 2;
        this.mesh.textureBuffer.numItems = 4;

        this.mesh.normalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.mesh.normalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.mesh.normale), gl.STATIC_DRAW);
        this.mesh.normalBuffer.itemSize = 3;
        this.mesh.normalBuffer.numItems = this.mesh.normale.length / 3;

        this.mesh.indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.mesh.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(this.mesh.indices), gl.STATIC_DRAW);
        this.mesh.indexBuffer.itemSize = 3;
        this.mesh.indexBuffer.numItems = this.mesh.indices.length;

        loadShaders(this);
    }

    inSphere(xCoo, yCoo, zCoo){
        for (let i = 0; i < this.clouds.length; i += 4) {
            const dx = xCoo - this.clouds[i];
            const dy = yCoo - this.clouds[i+1];
            const dz = zCoo - this.clouds[i+2];
            const distSq = dx * dx + dy * dy + dz * dz;
            const radiusSq = this.clouds[i+3] * this.clouds[i+3];

            if(distSq < radiusSq){
                return true;
            }
        }
        return false;
    }

    generateRandomSpheres(count, minRadius, maxRadius, minHeight, maxHeight, clustering) {
        const spheres = [];

        for (let i = 0; i < count; i++) {
            // Position X et Y normalisée entre -1 et 1
            let x, y;

            if (clustering > Math.random()) {
                // Groupé autour d'un point central
                const centerX = (Math.random() - 0.5) * 2 * this.size;
                const centerY = (Math.random() - 0.5) * 2 * this.size;
                x = centerX + (Math.random() - 0.5) * 0.5;
                y = centerY + (Math.random() - 0.5) * 0.5;
            } else {
                // Complètement aléatoire
                x = (Math.random() - 0.5) * this.size * 2;
                y = (Math.random() - 0.5) * this.size * 2;
            }

            // Position Z normalisée entre minHeight et maxHeight
            const z = minHeight + Math.random() * (maxHeight - minHeight);

            // Rayon aléatoire
            const radius = minRadius + Math.random() * (maxRadius - minRadius);

            // Limite les coordonnées pour que les sphères restent dans le cube
            x = Math.max(-0.9, Math.min(0.9, x));
            y = Math.max(-0.9, Math.min(0.9, y));

            spheres.push(x, y, z, radius);
        }

        return spheres;
    }

    setShadersParams() {
        super.setShadersParams();

        this.shader.vAttrib = gl.getAttribLocation(this.shader, "aVertexPosition");
        if (this.shader.vAttrib !== -1) {
            gl.enableVertexAttribArray(this.shader.vAttrib);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.mesh.vertexBuffer);
            gl.vertexAttribPointer(this.shader.vAttrib, 3, gl.FLOAT, false, 0, 0);
        }

        this.shader.nAttrib = gl.getAttribLocation(this.shader, "aVertexNormal");
        if (this.shader.nAttrib !== -1) {
            gl.enableVertexAttribArray(this.shader.nAttrib);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.mesh.normalBuffer);
            gl.vertexAttribPointer(this.shader.nAttrib, 3, gl.FLOAT, false, 0, 0);
        }

        this.shader.tAttrib = gl.getAttribLocation(this.shader, "aTextureCoord");
        gl.enableVertexAttribArray(this.shader.tAttrib);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.mesh.textureBuffer);
        gl.vertexAttribPointer(this.shader.tAttrib, this.mesh.textureBuffer.itemSize, gl.FLOAT, false, 0, 0);

        // Uniforms pour les sphères
        this.shader.cloudsCoordAndRadius = gl.getUniformLocation(this.shader, "u_spheres");
        gl.uniform4fv(this.shader.cloudsCoordAndRadius, this.clouds);

        this.shader.cloudColor = gl.getUniformLocation(this.shader, "u_cloudColor");
        gl.uniform3fv(this.shader.cloudColor, this.cloudColor);

        this.cloudsTexture = gl.createTexture();
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_3D, this.cloudsTexture);

        gl.texImage3D(
            gl.TEXTURE_3D,
            0,                    // niveau mipmap
            gl.R8,                // format interne
            cloud_sample_size,                 // largeur
            cloud_sample_size,                 // hauteur
            cloud_sample_size,                 // profondeur
            0,                    // bordure
            gl.RED,               // format
            gl.UNSIGNED_BYTE,     // type
            this.cloudsMatrix               // données
        );
        gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_WRAP_R, gl.REPEAT);
        this.shader.texture3D = gl.getUniformLocation(this.shader, "texture_3D");
        gl.uniform1i(this.shader.texture3D, 1);
    }

    draw() {
        if(this.shader && this.loaded==4) {

        if(this.shader && this.loaded == 4) {
            gl.enable(gl.BLEND);
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
            gl.depthMask(false);
            gl.disable(gl.CULL_FACE);

            this.setShadersParams();

            mat4.identity(mvMatrix);
            mat4.translate(mvMatrix, vec3.add(distCENTER, this.coord, vec3.create()));
            mat4.multiply(mvMatrix, rotMatrix);

            gl.uniformMatrix4fv(this.shader.rMatrixUniform, false, rotMatrix);
            gl.uniformMatrix4fv(this.shader.mvMatrixUniform, false, mvMatrix);
            gl.uniformMatrix4fv(this.shader.pMatrixUniform, false, pMatrix);

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.mesh.indexBuffer);
            gl.drawElements(gl.TRIANGLES, this.mesh.indexBuffer.numItems, gl.UNSIGNED_INT, 0);

            gl.enable(gl.CULL_FACE);
            gl.depthMask(true);
            gl.disable(gl.BLEND);
        }
    }
}