function objFilePicker(file) {
    const url = URL.createObjectURL(file);
    OBJ1 = new objmesh(url);
};

function objChangeSelect(value){
    actualObj = value;
    reloadObj();
};

function changeToWireframe(value){
    displayMode = value;
};

function shaderChangeSelect(value){
    usedShader = value;
    reloadObj();
};

function shaderChangeShini(value){
    shininess = value;
    OBJ1.loadBlingFongParam();
};

function shaderChangeLi(value){
    li = value;
    OBJ1.loadBlingFongParam();
};

function shaderChangeColor(value){
    OBJ1.objColor = hexToNormalizedRGB(value);
    OBJ1.loadBlingFongParam();
};
