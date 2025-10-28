function objFilePicker(file) {
    const url = URL.createObjectURL(file);
    OBJ1.objName = url;
    OBJ1.Init();
}

function bmpFilePicker(file){
    const url = URL.createObjectURL(file);
    PLANE.texture = createSample2D(url);
    PLANE.Init();
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

function shaderChangeColor(value){
    OBJ1.objColor = hexToNormalizedRGB(value);
}

function changePlaneType(value){
    if(value === "plane"){
        PLANE.useBumpMap = false;
        PLANE.shaderName = SHADER_PATH+value;
        document.getElementById("bump_option").style.display = "none";
        document.getElementById("height_option").style.display = "none";
    }
    if(value === "bump"){
        PLANE.useBumpMap = true;
        PLANE.shaderName = SHADER_PATH+'blingfong';
        document.getElementById("bump_option").style.display = "block";
        document.getElementById("height_option").style.display = "none";
    }
    if(value === "height"){
        document.getElementById("bump_option").style.display = "none";
        document.getElementById("height_option").style.display = "block";
    }
    PLANE.Init();
}

function planeChangeColor(value){
    PLANE.objColor = hexToNormalizedRGB(value);
}