class base_mesh {
    constructor(shader) {
        this.shaderName = SHADER_PATH+shader;
        this.objColor = [1, 0, 0];
        this.loaded = -1;
        this.shader = null;
        this.mesh = null;
        this.useBumpMap = false;
        this.texture = null;
    }

    Init(){
        this.loaded = -1;
        this.shader = null;
        this.mesh = null;
    }

    setShadersParams() {
        gl.useProgram(this.shader);

        this.shader.rMatrixUniform = gl.getUniformLocation(this.shader, "uRMatrix");
        this.shader.mvMatrixUniform = gl.getUniformLocation(this.shader, "uMVMatrix");
        this.shader.pMatrixUniform = gl.getUniformLocation(this.shader, "uPMatrix");
        this.shader.objColor = gl.getUniformLocation(this.shader, "objColor");

        gl.uniform3fv(this.shader.objColor, this.objColor);
    }

    loadBlingFongParam(){
        this.shader.tAttrib = gl.getAttribLocation(this.shader, "aTexCoords");
        gl.enableVertexAttribArray(this.shader.tAttrib);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.mesh.textureBuffer);
        gl.vertexAttribPointer(this.shader.tAttrib,this.mesh.textureBuffer.itemSize, gl.FLOAT, false, 0, 0);

        this.shader.uLightColor = gl.getUniformLocation(this.shader, "uLightColor");
        this.shader.Ks = gl.getUniformLocation(this.shader, "Ks");
        this.shader.Kd = gl.getUniformLocation(this.shader, "Kd");
        this.shader.shininess = gl.getUniformLocation(this.shader, "shininess");
        this.shader.li = gl.getUniformLocation(this.shader, "li");
        this.shader.useBumpMap = gl.getUniformLocation(this.shader, "useBumpMap");

        gl.uniform3fv(this.shader.uLightColor, uLightColor);
        gl.uniform3fv(this.shader.Ks, Ks);
        gl.uniform3fv(this.shader.Kd, Kd);
        gl.uniform1f(this.shader.shininess, shininess);
        gl.uniform1f(this.shader.li, li);
        gl.uniform1i(this.shader.useBumpMap, this.useBumpMap)
    }

    LoadTextureInShader(){
        const textureLocation = gl.getUniformLocation(this.shader, 'u_texture');

        // Set the active texture unit (e.g., 0)
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.texture);

        // Set the sampler uniform to use texture unit 0
        gl.uniform1i(textureLocation, 0);
    }

    setMatrixUniforms() {
        mat4.identity(mvMatrix);
        mat4.translate(mvMatrix, distCENTER);
        mat4.multiply(mvMatrix, rotMatrix);
        gl.uniformMatrix4fv(this.shader.rMatrixUniform, false, rotMatrix);
        gl.uniformMatrix4fv(this.shader.mvMatrixUniform, false, mvMatrix);
        gl.uniformMatrix4fv(this.shader.pMatrixUniform, false, pMatrix);
    }

    draw() {

    }
}