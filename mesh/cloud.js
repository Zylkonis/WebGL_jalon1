class cloud extends base_mesh{

    constructor(size, height, particlesCount, cloudSpheres){
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

        for (let spheres = 0; spheres < this.clouds.length ; spheres += 4){
            if(this.clouds[spheres] != null)
                this.clouds[spheres] = this.size / 2 + this.clouds[spheres] * this.size / 2;
            if(this.clouds[spheres+1] != null)
                this.clouds[spheres+1] = this.height / 2 + this.clouds[spheres+1] * this.height / 2;
            if(this.clouds[spheres+2] != null)
                this.clouds[spheres+2] = this.size / 2 + this.clouds[spheres+2] * this.size / 2;
        }

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

        this.cloudsMatrix = makeMultDirArray(64, 3);
        for(let x = 0; x < 64; x += 1){
            for(let y = 0; y < 64; y += 1){
                for(let z = 0; z < 64; z += 1) {
                    //if(this.inSphere(x/64 * this.size, x/64 * this.size, x/64 * this.height))
                    this.cloudsMatrix[x][y][z] = noise3D(noiseVec3(x,y,z));
                    //else
                    //    this.cloudsMatrix[x][y][z] = 0;
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
            if(this.clouds[i+3] * this.clouds[i+3] <
                (xCoo - this.clouds[i]) * (xCoo - this.clouds[i]) +
                (yCoo - this.clouds[i+1]) * (yCoo - this.clouds[i+1]) +
                (zCoo - this.clouds[i+2]) * (zCoo - this.clouds[i+2])){
                return true;
            }
        }
        return false;
    }

    setShadersParams() {
        super.setShadersParams();

        // Attributes
        this.shader.vAttrib = gl.getAttribLocation(this.shader, "aVertexPosition");
        gl.enableVertexAttribArray(this.shader.vAttrib);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.mesh.vertexBuffer);
        gl.vertexAttribPointer(this.shader.vAttrib, this.mesh.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

        this.shader.nAttrib = gl.getAttribLocation(this.shader, "aVertexNormal");
        gl.enableVertexAttribArray(this.shader.nAttrib);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.mesh.normalBuffer);
        gl.vertexAttribPointer(this.shader.nAttrib, this.mesh.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

        this.shader.tAttrib = gl.getAttribLocation(this.shader, "aTextureCoord");
        gl.enableVertexAttribArray(this.shader.tAttrib);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.mesh.textureBuffer);
        gl.vertexAttribPointer(this.shader.tAttrib, this.mesh.textureBuffer.itemSize, gl.FLOAT, false, 0, 0);

        // Uniforms pour les sphères
        this.shader.cloudsCoordAndRadius = gl.getUniformLocation(this.shader, "u_spheres");
        gl.uniform4fv(this.shader.cloudsCoordAndRadius, this.clouds);

        this.shader.cloudColor = gl.getUniformLocation(this.shader, "u_cloudColor");
        gl.uniform3fv(this.shader.cloudColor, this.cloudColor);

        this.shader.texture3D = gl.getUniformLocation(this.shader, "texture_3D");
        gl.uniform3fv(this.shader.texture3D, this.cloudsMatrix);
    }

    // --------------------------------------------
    draw() {
        if(this.shader && this.loaded==4) {
            // Active le blending pour la transparence
            gl.enable(gl.BLEND);
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
            gl.depthMask(false);

            this.setShadersParams();
            mat4.identity(mvMatrix);
            mat4.translate(mvMatrix, distCENTER);
            mat4.multiply(mvMatrix, rotMatrix);

            //mat4.translate(mvMatrix, [0., 0., this.height]);

            gl.uniformMatrix4fv(this.shader.rMatrixUniform, false, rotMatrix);
            gl.uniformMatrix4fv(this.shader.mvMatrixUniform, false, mvMatrix);
            gl.uniformMatrix4fv(this.shader.pMatrixUniform, false, pMatrix);

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.mesh.indexBuffer);
            gl.drawElements(gl.TRIANGLES, this.mesh.indexBuffer.numItems, gl.UNSIGNED_INT, 0);

            gl.depthMask(true);
            gl.disable(gl.BLEND);
        }
    }
}