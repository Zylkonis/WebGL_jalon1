function objFilePicker(file) {
    const url = URL.createObjectURL(file);
    OBJ1.objName = url;
    reloadObj();
}

function bmpFilePicker(file){
    const url = URL.createObjectURL(file);
    PLANE.texture = createSample2D(url);
    PLANE.initAll();
}

function objChangeSelect(value){
    OBJ1.actualObj = value;
    OBJ1.objName = OBJ_PATH+OBJ1.actualObj;
    reloadObj();
}

function shaderChangeSelect(value){
    OBJ1.usedShader = value;
    OBJ1.ReloadShader();
}

function shaderChangeShini(value){
    shininess = value;
}

function shaderChangeLi(value){
    li = value;
}

function shaderChangeColor(value){
    OBJ1.objColor = hexToNormalizedRGB(value);
}

function changePlaneType(value){
    if(value === "plane"){
        PLANE.usedShader = value;
        document.getElementById("bump_option").style.display = "none";
        document.getElementById("height_option").style.display = "none";
    }
    if(value === "bump"){
        PLANE.usedShader = value;
        document.getElementById("bump_option").style.display = "block";
        document.getElementById("height_option").style.display = "none";
    }
    if(value === "height"){
        document.getElementById("bump_option").style.display = "none";
        document.getElementById("height_option").style.display = "block";
    }
    PLANE.initAll();
}

function planeChangeColor(value){
    PLANE.objColor = hexToNormalizedRGB(value);
}