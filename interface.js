function objFilePicker(file) {
    OBJ1.objName = URL.createObjectURL(file);
    OBJ1.Init();
}

function bmpFilePicker(file){
    const url = URL.createObjectURL(file);
    PLANE.texture = createSample2D(url);
    PLANE.Init();
}

function heightFilePicker(file){
    const url = URL.createObjectURL(file);
    console.log(url);
    HEIGHT = new heightMap(url, [
        IMG_PATH+'water.png',    // 0-20% : eau
        IMG_PATH+'grass.png',   // 20-80% : herbe
        IMG_PATH+'snow.png'     // 80-100% : neige
    ]);
}

function objChangeSelect(value){
    OBJ1.objName = OBJ_PATH+value;
    OBJ1.Init();
}

function shaderChangeSelect(value){
    OBJ1.shaderName = SHADER_PATH+value;
    OBJ1.Init();
}

function shaderChangeShini(value){
    shininess = value;
}

function shaderChangeLi(value){
    li = value;
}

function heightChange(value){
    scale = value;
}

function shaderChangeColor(value){
    OBJ1.objColor = hexToNormalizedRGB(value);
}

function changePlaneType(value){
    if(value === "plane"){
        drawPlane = true;
        PLANE.useBumpMap = false;
        drawHeightMap = false;
        PLANE.shaderName = SHADER_PATH+value;
        document.getElementById("bump_option").style.display = "none";
        document.getElementById("height_option").style.display = "none";
        PLANE.Init();
    }
    if(value === "bump"){
        drawPlane = true;
        drawHeightMap = false;
        PLANE.useBumpMap = true;
        PLANE.shaderName = SHADER_PATH+'blingfong';
        document.getElementById("bump_option").style.display = "block";
        document.getElementById("height_option").style.display = "none";
        PLANE.Init();
    }
    if(value === "height"){
        drawPlane = false;
        drawHeightMap = true;
        document.getElementById("bump_option").style.display = "none";
        document.getElementById("height_option").style.display = "block";
    }
}

function planeChangeColor(value){
    PLANE.objColor = hexToNormalizedRGB(value);
}

function changeHeightShader(value){
    if(document.getElementById("textureCheckbox").checked) {
        HEIGHT.shaderName = SHADER_PATH+'gradient';
    }
    else{
        HEIGHT.shaderName = SHADER_PATH+'texture';
    }
    loadShaders(HEIGHT);
}