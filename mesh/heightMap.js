var scale = 5;

class heightMap extends base_mesh {
    img;
    longueur;
    largeur;

    heights;
    textures;
    texturesReady;

    // --------------------------------------------
    constructor(mapPath, texturePaths = null) {
        super(texturePaths ? 'texture' : 'gradient');
        this.ready = false;
        this.texturesReady = [false, false, false];
        this.useTexture = texturePaths !== null;
        this.textures = [null, null, null];

        this.img = new Image();
        this.img.src = mapPath;

        this.heights = [];

        this.mesh = {
            vertexBuffer: [],
            normalBuffer: [],
            colorBuffer: [],
            textureBuffer: [],
            indices: [],
            lineBuffer: []
        };

        // Chargement des textures si fournies
        if (texturePaths) {
            if (Array.isArray(texturePaths) && texturePaths.length === 3) {
                this.loadTextures(texturePaths);
            } else {
                console.error("Vous devez fournir exactement 3 textures dans un tableau");
            }
        }

        if (this.img.complete) {
            this.longueur = this.img.width;
            this.largeur = this.img.height;
            this.Init();
        } else {
            this.img.onload = () => {
                this.longueur = this.img.width;
                this.largeur = this.img.height;
                this.Init();
            }
        }
    }

    loadTextures(texturePaths) {
        texturePaths.forEach((path, index) => {
            this.textures[index] = gl.createTexture();
            const textureImage = new Image();
            textureImage.onload = () => {
                gl.bindTexture(gl.TEXTURE_2D, this.textures[index]);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textureImage);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
                gl.generateMipmap(gl.TEXTURE_2D);
                gl.bindTexture(gl.TEXTURE_2D, null);
                this.texturesReady[index] = true;
                console.log(`Texture ${index} chargée avec succès`);
            };
            textureImage.src = path;
        });
    }

    Init() {
        this.processMap();
        console.log("on lance le chargement du shader");
        loadShaders(this);
    }

    processMap() {
        this.heights = [];

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = this.longueur;
        canvas.height = this.largeur;

        ctx.drawImage(this.img, 0, 0);

        const imgData = ctx.getImageData(0, 0, this.longueur, this.largeur);
        const pixels = imgData.data;

        for (let y = this.largeur - 1; y >= 0; y--) {
            for (let x = 0; x < this.longueur; x++) {
                const i = (y * this.longueur + x) * 4;
                const gray = pixels[i];
                this.heights.push(gray/255.0);
            }
        }

        this.buildVertexbuffer();
    }

    buildVertexbuffer() {
        for (let y = this.largeur - 1; y >= 0; y--) {
            for (let x = 0; x < this.longueur; x++) {
                const h = this.heights[y * this.longueur + x];
                this.mesh.vertexBuffer.push(x/70 - (this.largeur/2)/70, y/70 - (this.longueur/2)/70, h);

                // Coordonnées de texture (0 à 1)
                const u = x / (this.longueur - 1);
                const v = y / (this.largeur - 1);
                this.mesh.textureBuffer.push(u, v);

                const t = h;

                // Bleu foncé (0, 0, 0.5) -> Cyan (0, 1, 1) -> Vert (0, 1, 0) -> Jaune (1, 1, 0) -> Rouge (1, 0, 0)
                let r, g, b;
                if (t < 0.25) {
                    // Bleu foncé -> Cyan
                    const localT = t / 0.25;
                    r = 0;
                    g = localT;
                    b = 0.5 + 0.5 * localT;
                } else if (t < 0.5) {
                    // Cyan -> Vert
                    const localT = (t - 0.25) / 0.25;
                    r = 0;
                    g = 1;
                    b = 1 - localT;
                } else if (t < 0.75) {
                    // Vert -> Jaune
                    const localT = (t - 0.5) / 0.25;
                    r = localT;
                    g = 1;
                    b = 0;
                } else {
                    // Jaune -> Rouge
                    const localT = (t - 0.75) / 0.25;
                    r = 1;
                    g = 1 - localT;
                    b = 0;
                }

                this.mesh.colorBuffer.push(r, g, b, 1.0);
            }
        }
        this.buildNormalBuffer()
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
                this.mesh.indices.push(topLeft, bottomLeft, topRight);
                this.mesh.indices.push(topRight, bottomLeft, bottomRight);
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

        this.colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.mesh.colorBuffer), gl.STATIC_DRAW);
        this.colorBuffer.itemSize = 4;
        this.colorBuffer.numItems = this.mesh.colorBuffer.length / 4;

        this.textureBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.textureBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.mesh.textureBuffer), gl.STATIC_DRAW);
        this.textureBuffer.itemSize = 2;
        this.textureBuffer.numItems = this.mesh.textureBuffer.length / 2;

        this.indices = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indices);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(this.mesh.indices), gl.STATIC_DRAW);
        this.indices.itemSize = 1;
        this.indices.numItems = this.mesh.indices.length;

        initWireframeBuffers(gl, this.mesh);
        // Copie le buffer wireframe dans l'instance
        this.lineBuffer = this.mesh.lineBuffer;

        this.ready = true;
    }

    setShadersParams() {
        super.setShadersParams();

        this.shader.vAttrib = gl.getAttribLocation(this.shader, "aVertexPosition");
        gl.enableVertexAttribArray(this.shader.vAttrib);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.vertexAttribPointer(this.shader.vAttrib, this.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

        this.shader.nAttrib = gl.getAttribLocation(this.shader, "aVertexNormal");
        gl.enableVertexAttribArray(this.shader.nAttrib);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
        gl.vertexAttribPointer(this.shader.nAttrib, this.normalBuffer.itemSize, gl.FLOAT, false, 0, 0);

        // Support des couleurs (pour shader gradient)
        this.shader.cAttrib = gl.getAttribLocation(this.shader, "aVertexColor");
        if (this.shader.cAttrib !== -1) {
            gl.enableVertexAttribArray(this.shader.cAttrib);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
            gl.vertexAttribPointer(this.shader.cAttrib, this.colorBuffer.itemSize, gl.FLOAT, false, 0, 0);
        }

        // Support des textures (pour shader texture)
        this.shader.tAttrib = gl.getAttribLocation(this.shader, "aTextureCoord");
        if (this.shader.tAttrib !== -1) {
            gl.enableVertexAttribArray(this.shader.tAttrib);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.textureBuffer);
            gl.vertexAttribPointer(this.shader.tAttrib, this.textureBuffer.itemSize, gl.FLOAT, false, 0, 0);
        }

        this.shader.rScale = gl.getUniformLocation(this.shader, "uScale");

        // Uniform pour les textures
        this.shader.sampler0Uniform = gl.getUniformLocation(this.shader, "uSampler0");
        this.shader.sampler1Uniform = gl.getUniformLocation(this.shader, "uSampler1");
        this.shader.sampler2Uniform = gl.getUniformLocation(this.shader, "uSampler2");
    }

    // --------------------------------------------
    setMatrixUniforms() {
        super.setMatrixUniforms();
        gl.uniform1f(this.shader.rScale, scale);
    }

    // --------------------------------------------
    draw() {
        if (!this.ready) return;

        if (this.shader && this.loaded == 4 && this.mesh != null) {
            this.setShadersParams();
            this.setMatrixUniforms();

            // Active les textures si disponibles
            if (this.useTexture && this.texturesReady[0] && this.texturesReady[1] && this.texturesReady[2]) {
                gl.activeTexture(gl.TEXTURE0);
                gl.bindTexture(gl.TEXTURE_2D, this.textures[0]);
                gl.uniform1i(this.shader.sampler0Uniform, 0);

                gl.activeTexture(gl.TEXTURE1);
                gl.bindTexture(gl.TEXTURE_2D, this.textures[1]);
                gl.uniform1i(this.shader.sampler1Uniform, 1);

                gl.activeTexture(gl.TEXTURE2);
                gl.bindTexture(gl.TEXTURE_2D, this.textures[2]);
                gl.uniform1i(this.shader.sampler2Uniform, 2);
            }

            var check = document.getElementById("wireframeCheckbox").checked;
            console.log(check);
            if (check) {
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.lineBuffer);
                gl.drawElements(gl.LINES, this.lineBuffer.numItems, gl.UNSIGNED_INT, 0);
            } else {
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indices);
                gl.drawElements(gl.TRIANGLES, this.indices.numItems, gl.UNSIGNED_INT, 0);
            }
        }
    }
}