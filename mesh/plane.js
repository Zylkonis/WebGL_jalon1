class plane extends base_mesh{

    // --------------------------------------------
    constructor(size) {
        super('plane');

        this.imagePath = IMG_PATH+'Surface10.png';
        this.texture = createSample2D(this.imagePath);
        this.size = size;
        this.height = 0.0;
        this.Init();
    }

    // --------------------------------------------
    Init() {
        super.Init()

        this.mesh = OBJ.Mesh(new XMLHttpRequest().responseText);

        this.mesh = {};
        this.mesh.vertices = [
            -this.size, -this.size, 0.1,
            this.size, -this.size, 0.1,
            this.size, this.size, 0.1,
            -this.size, this.size, 0.1
        ];

        this.mesh.textures = [
            0.0,0.0,
            0.0,1.0,
            1.0,1.0,
            1.0,0.0
        ];

        this.mesh.normale = [
            0.0, 0.0, 1.,
            0.0, 0.0, 1.,
            0.0, 0.0, 1.,
            0.0, 0.0, 1.,
        ];

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

        loadShaders(this);
    }


    // --------------------------------------------
    setShadersParams() {
        super.setShadersParams();

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
        gl.vertexAttribPointer(this.shader.tAttrib,this.mesh.textureBuffer.itemSize, gl.FLOAT, false, 0, 0);

        // Get location of sampler2D uniform in the shader
        this.LoadTextureInShader();
        this.loadBlingFongParam();
        this.LoadMixMaxParameter();
    }

    // --------------------------------------------
    draw() {
        if(this.shader && this.loaded==4) {
            this.setShadersParams();
            mat4.identity(mvMatrix);
            mat4.translate(mvMatrix, distCENTER);
            mat4.multiply(mvMatrix, rotMatrix);

            mat4.translate(mvMatrix, [0., 0., this.height]);

            gl.uniformMatrix4fv(this.shader.rMatrixUniform, false, rotMatrix);
            gl.uniformMatrix4fv(this.shader.mvMatrixUniform, false, mvMatrix);
            gl.uniformMatrix4fv(this.shader.pMatrixUniform, false, pMatrix);

            gl.drawArrays(gl.TRIANGLE_FAN, 0, this.mesh.vertexBuffer.numItems);
            gl.drawArrays(gl.LINE_LOOP, 0, this.mesh.vertexBuffer.numItems);
        }
    }
}