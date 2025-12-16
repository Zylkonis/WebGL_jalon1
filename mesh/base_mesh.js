class base_mesh {
    constructor(shader) {
        this.shaderName = SHADER_PATH+shader;
        this.objColor = [1, 0, 0];
        this.loaded = -1;
        this.shader = null;
        this.mesh = null;
        this.useBumpMap = false;
        this.texture = null;

        this.mixmax_T1 = null;
        this.mixmax_T2 = null;
        this.mixmax_T3 = null;
        this.mixmax_T1grayscale = null;
        this.mixmax_T2grayscale = null;
        this.mixmax_T3grayscale = null;
        this.mixmax_noise = null;
    }

    Init(){
        this.loaded = -1;
        this.shader = null;
        this.mesh = null;
    }

    InitMixMaxTexture(T1_path, T2_path, T3_path, T1grayscale_path, T2grayscale_path, T3grayscale_path, noise_path){
        this.mixmax_T1 = createSample2D(IMG_PATH+T1_path);
        this.mixmax_T2 = createSample2D(IMG_PATH+T2_path);
        this.mixmax_T3 = createSample2D(IMG_PATH+T3_path);
        this.mixmax_T1grayscale = createSample2D(IMG_PATH+T1grayscale_path);
        this.mixmax_T2grayscale = createSample2D(IMG_PATH+T2grayscale_path);
        this.mixmax_T3grayscale = createSample2D(IMG_PATH+T3grayscale_path);
        this.mixmax_noise = createSample2D(noise_path);
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
        this.shader.tAttrib = gl.getAttribLocation(this.shader, "aTextureCoord");
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

    LoadMixMaxParameter(){
        const textureLocation_1 = gl.getUniformLocation(this.shader, 'uSampler0');
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, this.mixmax_T1);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        gl.uniform1i(textureLocation_1, 1);

        const textureLocation_2 = gl.getUniformLocation(this.shader, 'uSampler1');
        gl.activeTexture(gl.TEXTURE2);
        gl.bindTexture(gl.TEXTURE_2D, this.mixmax_T2);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        gl.uniform1i(textureLocation_2, 2);

        const textureLocation_3 = gl.getUniformLocation(this.shader, 'uSampler2');
        gl.activeTexture(gl.TEXTURE3);
        gl.bindTexture(gl.TEXTURE_2D, this.mixmax_T3);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        gl.uniform1i(textureLocation_3, 3);

        const textureLocation_4 = gl.getUniformLocation(this.shader, 'uSampler_grayscale_0');
        gl.activeTexture(gl.TEXTURE4);
        gl.bindTexture(gl.TEXTURE_2D, this.mixmax_T1grayscale);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        gl.uniform1i(textureLocation_4, 4);

        const textureLocation_5 = gl.getUniformLocation(this.shader, 'uSampler_grayscale_1');
        gl.activeTexture(gl.TEXTURE5);
        gl.bindTexture(gl.TEXTURE_2D, this.mixmax_T2grayscale);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        gl.uniform1i(textureLocation_5, 5);

        const textureLocation_6 = gl.getUniformLocation(this.shader, 'uSampler_grayscale_2');
        gl.activeTexture(gl.TEXTURE6);
        gl.bindTexture(gl.TEXTURE_2D, this.mixmax_T3grayscale);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        gl.uniform1i(textureLocation_6, 6);

        const textureLocation_7 = gl.getUniformLocation(this.shader, 'u_heightmap');
        gl.activeTexture(gl.TEXTURE7);
        gl.bindTexture(gl.TEXTURE_2D, this.mixmax_noise);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        gl.uniform1i(textureLocation_7, 7);
        
        this.shader.treshold_1to2 = gl.getUniformLocation(this.shader, "treshold_1to2");
        this.shader.treshold_2to3 = gl.getUniformLocation(this.shader, "treshold_2to3");
        this.shader.alpha_1to2 = gl.getUniformLocation(this.shader, "alpha_1to2");
        this.shader.alpha_2to3 = gl.getUniformLocation(this.shader, "alpha_2to3");
        gl.uniform1f(this.shader.treshold_1to2, treshold_1to2);
        gl.uniform1f(this.shader.treshold_2to3, treshold_2to3);
        gl.uniform1f(this.shader.alpha_1to2, alpha_1to2);
        gl.uniform1f(this.shader.alpha_2to3, alpha_2to3);

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