
// =====================================================
// Map de hauteur, lecture image
// =====================================================

class heightMap {
    img;
    longueur;
    largeur;
    hauteurMin;
    hauteurMax;

    heights;

    // --------------------------------------------
    constructor(mapPath) {
        this.shaderName = 'obj';
        this.loaded = -1;
        this.shader = null;
        this.mesh = null;
        this.ready = false;

        this.img = new Image();
        this.img.src = mapPath;
            this.longueur = this.img.width;
        this.largeur = this.img.height;
        this.hauteurMin = 0;
        this.hauteurMax = 100;

        this.heights = [];

        this.mesh = {
            vertexBuffer: [],
            normalBuffer: [],
            indexBuffer: [],
            lineBuffer: []
        };

        if (this.img.complete) {
            this.processMap();
        } else {
            this.img.onload = () => this.processMap();
        }

        loadShaders(this);
    }

    processMap() {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = this.longueur;
        canvas.height = this.largeur;

        ctx.drawImage(this.img, 0, 0);

        const imgData = ctx.getImageData(0, 0, this.largeur, this.longueur);
        const pixels = imgData.data;

        for (let y = this.longueur - 1; y >= 0; y--) { // 🔁 au lieu de y = 0; y < this.longueur
            for (let x = 0; x < this.largeur; x++) {
                const i = (y * this.longueur + x) * 4;
                const gray = pixels[i];
                this.heights.push(gray / 255.0);
            }
        }

        this.buildVertexbuffer();
    }

    buildVertexbuffer() {
        for (let y = this.largeur - 1; y >= 0; y--) {
            for (let x = 0; x < this.longueur; x++) {
                const h = this.heights[y * this.longueur + x];
                this.mesh.vertexBuffer.push(x/70 - (this.largeur/2)/70, y/70 - (this.longueur/2)/70, h);
            }
        }
        this.buildNormalBuffer()
    }

    buildNormalBuffer2() {
        for (let y = 0; y < this.largeur; y++) {
            for (let x = 0; x < this.longueur; x++) {
                const hL = x > 0 ? this.heights[y * this.longueur + (x - 1)] : this.heights[y * this.longueur + x];
                const hR = x < this.longueur - 1 ? this.heights[y * this.longueur + (x + 1)] : this.heights[y * this.longueur + x];
                const hD = y > 0 ? this.heights[(y - 1) * this.longueur + x] : this.heights[y * this.longueur + x];
                const hU = y < this.largeur - 1 ? this.heights[(y + 1) * this.longueur + x] : this.heights[y * this.longueur + x];
                const nx = hL - hR; const ny = 2.0; const nz = hD - hU; const len = Math.sqrt(nx * nx + ny * ny + nz * nz);
                this.mesh.normalBuffer.push( nx / len, nz / len, ny / len );
            }
        }
        this.buildIndices()
    }

    buildNormalBuffer() {
        const normals = new Array(this.longueur * this.largeur * 3).fill(0);

        // Boucle sur chaque carré (même ordre que buildVertexbuffer : y décroissant)
        for (let y = this.largeur - 1; y > 0; y--) {
            for (let x = 0; x < this.longueur - 1; x++) {

                // Indices des 4 sommets du carré
                const iTL = (y * this.longueur + x);
                const iTR = (y * this.longueur + (x + 1));
                const iBL = ((y - 1) * this.longueur + x);
                const iBR = ((y - 1) * this.longueur + (x + 1));

                // Positions 3D des 4 sommets (avec la même échelle que vertexBuffer)
                const scale = 70;
                const vTL = [x/scale - (this.largeur/2)/scale, y/scale - (this.longueur/2)/scale, this.heights[iTL]];
                const vTR = [(x+1)/scale - (this.largeur/2)/scale, y/scale - (this.longueur/2)/scale, this.heights[iTR]];
                const vBL = [x/scale - (this.largeur/2)/scale, (y-1)/scale - (this.longueur/2)/scale, this.heights[iBL]];
                const vBR = [(x+1)/scale - (this.largeur/2)/scale, (y-1)/scale - (this.longueur/2)/scale, this.heights[iBR]];

                // Triangle 1 : topLeft, bottomLeft, topRight
                const n1 = this.computeFaceNormal(vTL, vBL, vTR);
                // Triangle 2 : topRight, bottomLeft, bottomRight
                const n2 = this.computeFaceNormal(vTR, vBL, vBR);

                // Ajoute les normales à chaque sommet concerné
                this.addNormal(normals, iTL, n1);
                this.addNormal(normals, iBL, n1);
                this.addNormal(normals, iTR, n1);

                this.addNormal(normals, iTR, n2);
                this.addNormal(normals, iBL, n2);
                this.addNormal(normals, iBR, n2);
            }
        }

        // Normalisation finale des normales moyennes
        for (let i = 0; i < normals.length; i += 3) {
            const nx = normals[i];
            const ny = normals[i + 1];
            const nz = normals[i + 2];
            const len = Math.sqrt(nx * nx + ny * ny + nz * nz);
            if (len > 0) {
                this.mesh.normalBuffer.push(nx / len, ny / len, nz / len);
            } else {
                this.mesh.normalBuffer.push(0, 0, 1); // Normale par défaut si longueur nulle
            }
        }

        this.buildIndices();
    }

    computeFaceNormal(v1, v2, v3) {
        const U = [
            v2[0] - v1[0],
            v2[1] - v1[1],
            v2[2] - v1[2]
        ];
        const V = [
            v3[0] - v1[0],
            v3[1] - v1[1],
            v3[2] - v1[2]
        ];

        // Produit vectoriel U × V
        const nx = (U[1] * V[2]) - (U[2] * V[1]);
        const ny = (U[2] * V[0]) - (U[0] * V[2]);
        const nz = (U[0] * V[1]) - (U[1] * V[0]);
        return [nx, ny, nz];
    }

    addNormal(normals, index, normal) {
        normals[index * 3] += normal[0];
        normals[index * 3 + 1] += normal[1];
        normals[index * 3 + 2] += normal[2];
    }


    buildIndices() {
        for (let y = 0; y < this.largeur - 1; y++) {
            for (let x = 0; x < this.longueur - 1; x++) {
                const topLeft = y * this.longueur + x;
                const topRight = topLeft + 1;
                const bottomLeft = (y + 1) * this.longueur + x;
                const bottomRight = bottomLeft + 1;

                // Deux triangles par carré
                this.mesh.indexBuffer.push(topLeft, bottomLeft, topRight);
                this.mesh.indexBuffer.push(topRight, bottomLeft, bottomRight);
            }
        }
        this.buildBuffer()
    }

    buildBuffer() {
        gl.useProgram(this.shader);

        this.vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.mesh.vertexBuffer), gl.STATIC_DRAW);
        this.vertexBuffer.itemSize = 3;
        this.vertexBuffer.numItems = this.mesh.vertexBuffer.length / 3;

        this.normalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.mesh.normalBuffer), gl.STATIC_DRAW);
        this.normalBuffer.itemSize = 3;
        this.normalBuffer.numItems = this.mesh.normalBuffer.length / 3;

        // this.textureBuffer = gl.createBuffer();
        // gl.bindBuffer(gl.ARRAY_BUFFER, this.textureBuffer);
        // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.texture), gl.STATIC_DRAW);
        // this.textureBuffer.itemSize = 2;
        // this.textureBuffer.numItems = this.texture.length / 2;

        this.indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(this.mesh.indexBuffer), gl.STATIC_DRAW);
        this.indexBuffer.itemSize = 1;
        this.indexBuffer.numItems = this.mesh.indexBuffer.length;

        this.ready = true;
    }

    setShadersParams() {
        gl.useProgram(this.shader);

        this.shader.vAttrib = gl.getAttribLocation(this.shader, "aVertexPosition");
        gl.enableVertexAttribArray(this.shader.vAttrib);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.vertexAttribPointer(this.shader.vAttrib, this.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

        this.shader.nAttrib = gl.getAttribLocation(this.shader, "aVertexNormal");
        gl.enableVertexAttribArray(this.shader.nAttrib);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
        gl.vertexAttribPointer(this.shader.nAttrib, this.normalBuffer.itemSize, gl.FLOAT, false, 0, 0);

        this.shader.rMatrixUniform = gl.getUniformLocation(this.shader, "uRMatrix");
        this.shader.mvMatrixUniform = gl.getUniformLocation(this.shader, "uMVMatrix");
        this.shader.pMatrixUniform = gl.getUniformLocation(this.shader, "uPMatrix");
    }

    // --------------------------------------------
    setMatrixUniforms() {
        mat4.identity(mvMatrix);
        mat4.translate(mvMatrix, distCENTER);
        mat4.multiply(mvMatrix, rotMatrix);
        gl.uniformMatrix4fv(this.shader.rMatrixUniform, false, rotMatrix);
        gl.uniformMatrix4fv(this.shader.mvMatrixUniform, false, mvMatrix);
        gl.uniformMatrix4fv(this.shader.pMatrixUniform, false, pMatrix);
    }

    // --------------------------------------------
    draw() {
        if (!this.ready) return;

        if (this.shader && this.loaded == 4 && this.mesh != null) {
            this.setShadersParams();
            this.setMatrixUniforms();

            var check = document.getElementById("wireframeCheckbox").checked;
            console.log(check);
            if (check) {
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.lineBuffer);
                gl.drawElements(gl.LINES, this.lineBuffer.numItems, gl.UNSIGNED_INT, 0);
            } else {
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
                gl.drawElements(gl.TRIANGLES, this.indexBuffer.numItems, gl.UNSIGNED_INT, 0);
            }
        }
    }
}