let cloud_sample_size = 64;

class cloud extends base_mesh {
    constructor(size, height) {
        super('raycasting');
        this.size = size;
        this.height = height;
        this.objColor = [1., 1., 1.];
        this.nbClouds = 200;
        this.windDirection = 0.;
        this.windSpeed = 0.;
        this.height_offset = false;
        this.depthFactor = 0.5;
        this.densityFactor = 0.7;
        this.absorption = 60;
        this.transmittance = 35.;
        this.distance_in_air = 0.5;
        this.activateLightMarching = false;
        this.stepsOfLight = 10;

        this.Init();
    }

    Init() {
        super.Init();

        this.mesh = {};
        this.mesh.vertices = [
            // Plafond (top face)
            -this.size, -this.size, this.height,
            this.size, -this.size, this.height,
            this.size, this.size, this.height,
            -this.size, this.size, this.height,
            // Sol (bottom face)
            -this.size, -this.size, 0,
            this.size, -this.size, 0,
            this.size, this.size, 0,
            -this.size, this.size, 0,
            // Devant (front face)
            -this.size, -this.size, 0,
            this.size, -this.size, 0,
            this.size, -this.size, this.height,
            -this.size, -this.size, this.height,
            // Derriere (back face)
            this.size, this.size, 0,
            -this.size, this.size, 0,
            -this.size, this.size, this.height,
            this.size, this.size, this.height,
            // Gauche (left face)
            -this.size, this.size, 0,
            -this.size, -this.size, 0,
            -this.size, -this.size, this.height,
            -this.size, this.size, this.height,
            // Droite (right face)
            this.size, -this.size, 0,
            this.size, this.size, 0,
            this.size, this.size, this.height,
            this.size, -this.size, this.height
        ];

        this.mesh.textures = [
            0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
            0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
            0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
            0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
            0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
            0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0
        ];

        this.mesh.normale = [
            0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,
            0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0,
            0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0,
            0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,
            -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0,
            1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0
        ];

        this.mesh.indices = [
            0, 1, 2, 0, 2, 3,
            4, 6, 5, 4, 7, 6,
            8, 9, 10, 8, 10, 11,
            12, 13, 14, 12, 14, 15,
            16, 17, 18, 16, 18, 19,
            20, 21, 22, 20, 22, 23
        ];

        this.GenerateCloud();

        // Créer les buffers
        this.mesh.vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.mesh.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.mesh.vertices), gl.STATIC_DRAW);
        this.mesh.vertexBuffer.itemSize = 3;
        this.mesh.vertexBuffer.numItems = 24;

        this.mesh.textureBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.mesh.textureBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.mesh.textures), gl.STATIC_DRAW);
        this.mesh.textureBuffer.itemSize = 2;
        this.mesh.textureBuffer.numItems = 24;

        this.mesh.normalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.mesh.normalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.mesh.normale), gl.STATIC_DRAW);
        this.mesh.normalBuffer.itemSize = 3;
        this.mesh.normalBuffer.numItems = 24;

        this.mesh.indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.mesh.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(this.mesh.indices), gl.STATIC_DRAW);
        this.mesh.indexBuffer.itemSize = 1;
        this.mesh.indexBuffer.numItems = this.mesh.indices.length;

        loadShaders(this);
    }

    GenerateCloud(){
        // Générer des sphères aléatoires
        this.clouds = this.generateRandomSpheres(this.nbClouds, this.height/10, this.height/5);


        // Créer la texture 3D avec le bruit de Perlin basé sur les sphères
        this.cloudsMatrix = new Uint8Array(cloud_sample_size * cloud_sample_size * cloud_sample_size);

        for (let z = 0; z < cloud_sample_size; z++) {
            for (let y = 0; y < cloud_sample_size; y++) {
                for (let x = 0; x < cloud_sample_size; x++) {
                    let index = x + y * cloud_sample_size + z * cloud_sample_size * cloud_sample_size;

                    // Normaliser les coordonnées [0, 1]
                    const nx = x / (cloud_sample_size - 1);
                    const ny = y / (cloud_sample_size - 1);
                    const nz = z / (cloud_sample_size - 1);

                    // Convertir en coordonnées monde
                    const worldX = -this.size + nx * 2 * this.size;
                    const worldY = -this.size + ny * 2 * this.size;
                    const worldZ = nz * this.height;

                    let density = 0.0;

                    // Vérifier si on est dans une sphère
                    const distToCenter = this.inSphere(worldX, worldY, worldZ);
                    if (distToCenter !== 0.) {
                        // Ajouter du bruit de Perlin pour la variation
                        const noiseValue = noise3D(noiseVec3(worldX * 2, worldY * 2, worldZ * 2));
                        density = Math.max(0, noiseValue) * distToCenter;
                    }

                    this.cloudsMatrix[index] = Math.floor(Math.max(0, Math.min(1, density)) * 255);
                }
            }
        }
    }

    inSphere(xCoo, yCoo, zCoo) {
        let res = 0.;
        for (let i = 0; i < this.clouds.length; i += 4) {
            const dx = xCoo - this.clouds[i];
            const dy = yCoo - this.clouds[i + 1];
            const dz = zCoo - this.clouds[i + 2];
            const distSq = dx * dx + dy * dy + dz * dz;
            const radiusSq = this.clouds[i + 3] * this.clouds[i + 3];

            if (distSq < radiusSq) {
                res += (radiusSq - distSq) / radiusSq;
            }
        }
        return res;
    }

    generateRandomSpheres(count, minRadius, maxRadius) {
        const spheres = [];

        for (let i = 0; i < count; i++) {
            let x, y;
            x = (Math.random() - 0.5) * 2 * (this.size - maxRadius);
            y = (Math.random() - 0.5) * 2 * (this.size - maxRadius);

            const z = maxRadius + Math.random() * (this.height - 2 * maxRadius);
            const radius = minRadius + Math.random() * (maxRadius - minRadius);

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
        if (this.shader.tAttrib !== -1) {
            gl.enableVertexAttribArray(this.shader.tAttrib);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.mesh.textureBuffer);
            gl.vertexAttribPointer(this.shader.tAttrib, 2, gl.FLOAT, false, 0, 0);
        }

        // Envoyer la taille de la boîte
        this.shader.boxSizeUniform = gl.getUniformLocation(this.shader, "u_boxSize");
        if (this.shader.boxSizeUniform !== null) {
            gl.uniform3f(this.shader.boxSizeUniform, this.size, this.size, this.height);
        }

        // Créer et lier la texture 3D
        if (!this.cloudsTexture) {
            this.cloudsTexture = gl.createTexture();
        }

        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_3D, this.cloudsTexture);

        gl.texImage3D(
            gl.TEXTURE_3D,
            0,
            gl.R8,
            cloud_sample_size,
            cloud_sample_size,
            cloud_sample_size,
            0,
            gl.RED,
            gl.UNSIGNED_BYTE,
            this.cloudsMatrix
        );

        gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_WRAP_R, gl.CLAMP_TO_EDGE);

        this.shader.texture3D = gl.getUniformLocation(this.shader, "texture_3D");
        if (this.shader.texture3D !== null) {
            gl.uniform1i(this.shader.texture3D, 1);
        }

        // Dans votre boucle de rendu
        let time = performance.now() / 1000.0; // Temps en secondes
        gl.uniform1f(gl.getUniformLocation(this.shader, "u_time"), time);
        gl.uniform1f(gl.getUniformLocation(this.shader, "u_windAngle"), this.windDirection);
        gl.uniform1f(gl.getUniformLocation(this.shader, "u_windSpeed"), this.windSpeed);
        gl.uniform1i(gl.getUniformLocation(this.shader, "u_activateLightMarching"), this.activateLightMarching);
        gl.uniform1i(gl.getUniformLocation(this.shader, "u_stepsOfLight"), this.stepsOfLight);
        gl.uniform1i(gl.getUniformLocation(this.shader, "height_offset"), this.height_offset);
        gl.uniform1f(gl.getUniformLocation(this.shader, "mult_depthFactor"), this.depthFactor);
        gl.uniform1f(gl.getUniformLocation(this.shader, "mult_densityFactor"), this.densityFactor);
        gl.uniform1f(gl.getUniformLocation(this.shader, "mult_absorption"), this.absorption);
        gl.uniform1f(gl.getUniformLocation(this.shader, "mult_transmittance"), this.transmittance);
    }

    draw() {
        if (this.shader && this.loaded == 4) {
            gl.enable(gl.BLEND);
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
            gl.depthMask(false);
            gl.disable(gl.CULL_FACE);

            this.setShadersParams();

            mat4.identity(mvMatrix);
            mat4.translate(mvMatrix, distCENTER);
            mat4.multiply(mvMatrix, rotMatrix);

            mat4.translate(mvMatrix, vec3.create([0,0, this.distance_in_air]));

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