function objFilePicker(file) {
    const url = URL.createObjectURL(file);
    OBJ1 = new objmesh(url);
};

function objChangeSelect(value){
    OBJ1 = new objmesh(OBJ_PATH+value);
};

function changeToWireframe(value){
    displayMode = value;
};