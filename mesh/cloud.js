class cloud extends base_mesh {
    constructor(size, height, cloudSpheres, coord){
        super('raycasting');
        this.size = size;
        this.height = height;
        this.coord = coord;

        this.cloudSpheresInput = cloudSpheres;
        this.sphereCount = cloudSpheres.length / 4;

        this.Init();
    }

    Init(){
        super.Init();

        // Transformer les coordonnées des sphères EN ESPACE LOCAL du cube
        this.cloudSpheresLocal = [];
        for (let i = 0; i < this.cloudSpheresInput.length; i += 4){
            // X, Y: de [-1, 1] vers [-size, size]
            let x = this.cloudSpheresInput[i] * this.size;
            let y = this.cloudSpheresInput[i+1] * this.size;

            // Z: de [-1, 1] vers [0, height]
            let z = (this.cloudSpheresInput[i+2] + 1.0) * this.height / 2.0;

            // Rayon
            let r = this.cloudSpheresInput[i+3];

            this.cloudSpheresLocal.push(x, y, z, r);
        }

        this.clouds = new Float32Array(this.cloudSpheresLocal);

        // ... reste du code (mesh, buffers, etc.)

        this.mesh = {};
        this.mesh.vertices = [
            -this.size, -this.size, this.height,
            this.size, -this.size, this.height,
            this.size, this.size, this.height,
            -this.size, this.size, this.height,
            -this.size, -this.size, 0,
            this.size, -this.size, 0,
            this.size, this.size, 0,
            -this.size, this.size, 0,
            -this.size, -this.size, 0,
            this.size, -this.size, 0,
            this.size, -this.size, this.height,
            -this.size, -this.size, this.height,
            this.size, this.size, 0,
            -this.size, this.size, 0,
            -this.size, this.size, this.height,
            this.size, this.size, this.height,
            -this.size, this.size, 0,
            -this.size, -this.size, 0,
            -this.size, -this.size, this.height,
            -this.size, this.size, this.height,
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

        // ⚠️ NE PAS transformer les sphères - les envoyer telles quelles
        this.shader.spheresUniform = gl.getUniformLocation(this.shader, "u_spheres");
        if (this.shader.spheresUniform !== null) {
            gl.uniform4fv(this.shader.spheresUniform, this.clouds);
        }

        this.shader.sphereCountUniform = gl.getUniformLocation(this.shader, "u_sphereCount");
        if (this.shader.sphereCountUniform !== null) {
            gl.uniform1i(this.shader.sphereCountUniform, this.sphereCount);
        }
    }

    draw() {
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