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
