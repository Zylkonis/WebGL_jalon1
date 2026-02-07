function SkyChangeColor(value){
    const skyColor = hexToNormalizedRGB(value);
    gl.clearColor(skyColor[0], skyColor[1], skyColor[2], 1.0);
}

function CloudChangeColor(value){
    CLOUD.objColor = hexToNormalizedRGB(value);
}

function CloudActivateLightMarching(value){
    CLOUD.activateLightMarching =
        document.getElementById('cloudsActivateLightMarching').checked;
}

function CloudChangeNb(value){
    CLOUD.nbClouds = value;
    document.getElementById("label_nbClouds")
        .innerText=("Number of clouds : "+value);
    document.getElementById("regenerate_clouds").style.color="red";
}

function ChangeCloudResolution(value) {
    cloud_sample_size = value;
    document.getElementById("regenerate_clouds").style.color="red";
}

function CloudChangeDepth(value) {
    CLOUD.depthFactor = value;
}

function CloudChangeDensity(value) {
    CLOUD.densityFactor = value;
}

function CloudChangeAngle(value) {
    CLOUD.windDirection = value
}

function CloudChangeAbsorption(value) {
    CLOUD.absorption = value;
}

function CloudChangeTransmittance(value) {
    CLOUD.transmittance = value;
}

function setCloudOffset(value) {
    CLOUD.height_offset =
        document.getElementById('cloudsHeightOffset').checked;
}

function CloudChangeSpeed(value) {
    CLOUD.windSpeed = value
}

function CloudChangeDistInAir(value) {
    CLOUD.distance_in_air = value;
}

function CloudChangeHeight(value) {
    document.getElementById("regenerate_clouds").style.color="red";
    CLOUD.height = value;
}

function CloudChangeSize(value) {
    document.getElementById("regenerate_clouds").style.color="red";
    CLOUD.size = value;
}

function RegenerateClouds(){
    document.getElementById("regenerate_clouds").style.color="black";
    CLOUD.Init();
}

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

function heightMipMapTextureFilePicker(file, choice){
    const url = URL.createObjectURL(file);
    console.log(url);
    switch (choice) {
        case 1:
            HEIGHT.mipmap_T1 = createSample2D(url);
            break;
        case 2:
            HEIGHT.mipmap_T1grayscale = createSample2D(url);
            break;
        case 3:
            HEIGHT.mipmap_T2 = createSample2D(url);
            break;
        case 4:
            HEIGHT.mipmap_T2grayscale = createSample2D(url);
            break;
        case 5:
            HEIGHT.mipmap_T3 = createSample2D(url);
            break;
        case 6:
            HEIGHT.mipmap_T3grayscale = createSample2D(url);
            break;
    }
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
    OCEAN.height = treshold_1to2 * (scale / oceanHeightSoftener);
}

function shaderChangeColor(value){
    OBJ1.objColor = hexToNormalizedRGB(value);
}

function changePlaneType(value){
    if(value === "plane"){
        drawPlane = true;
        PLANE.shaderName = SHADER_PATH+"plane";
        PLANE.Init();
    }

    if(value === "bump"){
        drawPlane = true;
        PLANE.useBumpMap = true;
        PLANE.shaderName = SHADER_PATH+'blingfong';
        document.getElementById("bump_option").style.display = "block";
        PLANE.Init();
    }
    else{
        PLANE.useBumpMap = false;
        document.getElementById("bump_option").style.display = "none";
    }

    if(value === "height"){
        drawPlane = false;
        drawHeightMap = true;
        document.getElementById("height_option").style.display = "block";
    }
    else{
        drawHeightMap = false;
        document.getElementById("oceanDrawnCheckbox").checked = false;
        document.getElementById("height_option").style.display = "none";
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
    OCEAN.height = treshold_1to2 * (scale / oceanHeightSoftener);
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

function changeDelta_1to2(value) {
    alpha_1to2 = parseFloat(value);

    const slider1 = document.getElementById('tresh_1to2_scale');
    const slider2 = document.getElementById('tresh_2to3_scale');
    const minSpace = alpha_1to2;

    if(treshold_2to3 - treshold_1to2 < minSpace) {
        const newTreshold2 = treshold_1to2 + minSpace;

        if(newTreshold2 <= 1.0) {
            treshold_2to3 = newTreshold2;
            slider2.value = treshold_2to3;
        } else {
            treshold_2to3 = 1.0;
            treshold_1to2 = 1.0 - minSpace;
            slider1.value = treshold_1to2;
            slider2.value = treshold_2to3;
        }
    }

    if(treshold_1to2 > 1.0 - alpha_1to2) {
        treshold_1to2 = 1.0 - alpha_1to2;
        slider1.value = treshold_1to2;
    }
}

function changeDelta_2to3(value) {
    alpha_2to3 = parseFloat(value);

    const slider2 = document.getElementById('tresh_2to3_scale');

    if(treshold_2to3 > 1.0 - alpha_2to3) {
        treshold_2to3 = 1.0 - alpha_2to3;
        slider2.value = treshold_2to3;

        const slider1 = document.getElementById('tresh_1to2_scale');
        if(treshold_1to2 > treshold_2to3 - alpha_1to2) {
            treshold_1to2 = treshold_2to3 - alpha_1to2;
            slider1.value = treshold_1to2;
        }
    }
}

function initOcean(){
    OCEAN.objColor = hexToNormalizedRGB("#0000FF");
    OCEAN.useBumpMap = true;
    OCEAN.shaderName = SHADER_PATH+'blingfong';
    OCEAN.texture = createSample2D(IMG_PATH+"water.png");
    OCEAN.Init();
}

