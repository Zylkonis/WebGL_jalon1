class obj_mesh extends base_mesh{

    // --------------------------------------------
    constructor(objFname, shader) {
        super(shader);
        this.objName = objFname;

        this.Init()
    }

    Init() {
        super.Init();
        loadObjFile(this);
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

        this.loadBlingFongParam();
    }

    draw(){
        if(this.shader && this.loaded==4 && this.mesh != null) {
            this.setShadersParams();
            this.setMatrixUniforms();

            var check = document.getElementById("wireframeCheckbox").checked;
            if (check) {
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.mesh.lineBuffer);
                gl.drawElements(gl.LINES, this.mesh.lineBuffer.numItems, gl.UNSIGNED_INT, 0);
            }
            else {
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.mesh.indexBuffer);
                gl.drawElements(gl.TRIANGLES, this.mesh.indexBuffer.numItems, gl.UNSIGNED_INT, 0);
            }
        }
    }
}