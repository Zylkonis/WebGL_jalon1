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

function heightMipMapTexture1FilePicker(file){
    const url = URL.createObjectURL(file);
    console.log(url);
    HEIGHT.mipmap_T1 = createSample2D(url);
    loadShaders(HEIGHT)
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
        document.getElementById("mipmap_option").style.display = "none";
        document.getElementById("height_option").style.display = "none";
        PLANE.Init();
    }
    if(value === "bump"){
        drawPlane = true;
        drawHeightMap = false;
        PLANE.useBumpMap = true;
        PLANE.shaderName = SHADER_PATH+'blingfong';
        document.getElementById("bump_option").style.display = "block";
        document.getElementById("mipmap_option").style.display = "none";
        document.getElementById("height_option").style.display = "none";
        PLANE.Init();
    }
    if(value === "height"){
        drawPlane = false;
        drawHeightMap = true;
        document.getElementById("bump_option").style.display = "none";
        document.getElementById("mipmap_option").style.display = "none";
        document.getElementById("height_option").style.display = "block";
    }
    if(value === "mipmap"){
        drawPlane = true;
        PLANE.useBumpMap = false;
        drawHeightMap = false;
        PLANE.shaderName = SHADER_PATH+"mipmap";
        document.getElementById("bump_option").style.display = "none";
        document.getElementById("height_option").style.display = "none";
        PLANE.InitMipMapTexture(
            "Ground097_1K-PNG_Color.png", "Bricks097_1K-PNG_Color.png", "PavingStones150_1K-PNG_Color.png",
            "Ground097_1K-PNG_Displacement.png", "Bricks097_1K-PNG_Displacement.png", "PavingStones150_1K-PNG_Displacement.png",
            "texture3.png");
        PLANE.Init();
    }
}

function planeChangeColor(value){
    PLANE.objColor = hexToNormalizedRGB(value);
}

function changeHeightShader(value){
    HEIGHT.shaderName = SHADER_PATH + value;
    loadShaders(HEIGHT);
    if (value === "mipmapheight"){
        document.getElementById("height_mipmap_option_files").style.display = "block";
        document.getElementById("mipmap_option").style.display = "block";
    } else {
        document.getElementById("height_mipmap_option_files").style.display = "none";
        document.getElementById("mipmap_option").style.display = "none";
    }
}

function changeTreshold_1to2(value) {
    const slider1 = document.getElementById('tresh_1to2_scale');
    const newValue = parseFloat(value);

    // Bloquer la valeur si elle dépasse la limite haute
    if(newValue > treshold_2to3 - alpha_1to2) {
        slider1.value = treshold_2to3 - alpha_1to2;
        treshold_1to2 = treshold_2to3 - alpha_1to2;
    } else {
        treshold_1to2 = newValue;
    }

    // Mettre à jour les limites du slider 2
    const slider2 = document.getElementById('tresh_2to3_scale');
    if(parseFloat(slider2.value) < treshold_1to2 + alpha_1to2) {
        slider2.value = treshold_1to2 + alpha_1to2;
        treshold_2to3 = treshold_1to2 + alpha_1to2;
    }
}

function changeTreshold_2to3(value) {
    const slider2 = document.getElementById('tresh_2to3_scale');
    const newValue = parseFloat(value);

    // Bloquer la valeur si elle est en dessous de la limite basse
    if(newValue < treshold_1to2 + alpha_1to2) {
        slider2.value = treshold_1to2 + alpha_1to2;
        treshold_2to3 = treshold_1to2 + alpha_1to2;
    } if(newValue > 1 - alpha_2to3) {
        slider2.value = 1 - alpha_2to3;
        treshold_2to3 = 1 - alpha_2to3;
    } else {
        treshold_2to3 = newValue;
    }
}