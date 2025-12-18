
// =====================================================
var gl;

// =====================================================
var mvMatrix = mat4.create();
var pMatrix = mat4.create();
var rotMatrix = mat4.create();
var distCENTER;

var uLightColor = [1.0, 1.0, 1.0]; // lumière blanche
var Kd = [0.8, 0.8, 0.8]; // diffuse rouge-orangée
var Ks = [0.2, 0.2, 0.2]; // réflexion blanche
var shininess = 0.5; // brillance
var li = 1.0; // intensité lumineuse
// =====================================================

var treshold_1to2 = 0.25;
var treshold_2to3 = 0.60;
var alpha_1to2 = 0.1;
var alpha_2to3 = 0.1;
var oceanHeightSoftener = 50;

var OBJ1 = null;
var PLANE = null;
var HEIGHT = null;
var OCEAN = null;
var CLOUD = null;
var OBJ_PATH = 'obj/';
var IMG_PATH = 'img/';
var SHADER_PATH = 'shader/';

var drawPlane = true;
var drawHeightMap = false;


// =====================================================
// FONCTIONS GENERALES, INITIALISATIONS
// =====================================================



// =====================================================
function initGL(canvas)
{
	try {
		gl = canvas.getContext("webgl2");
		gl.viewportWidth = canvas.width;
		gl.viewportHeight = canvas.height;
		gl.viewport(0, 0, canvas.width, canvas.height);

		gl.clearColor(0.7, 0.7, 0.7, 1.0);
		gl.enable(gl.DEPTH_TEST);
		gl.enable(gl.CULL_FACE);
		gl.cullFace(gl.BACK); 
	} catch (e) {}
	if (!gl) {
		console.log("Could not initialise WebGL");
	}
}

function initWireframeBuffers(gl, mesh){
    lines = [];
    for (let i = 0; i < mesh.indices.length; i += 3) {
    	let a = mesh.indices[i];
    	let b = mesh.indices[i + 1];
    	let c = mesh.indices[i + 2];

    	lines.push(a,b,b,c,c,a);
    }

    mesh.lineBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.lineBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(lines), gl.STATIC_DRAW);
    mesh.lineBuffer.numItems = lines.length;
}

// =====================================================
loadObjFile = function(OBJ3D)
{
	var xhttp = new XMLHttpRequest();

	xhttp.onreadystatechange = function() {
		if (xhttp.readyState == 4 && xhttp.status == 200) {
			var tmpMesh = new OBJ.Mesh(xhttp.responseText);
			OBJ.initMeshBuffers(gl, tmpMesh);
			initWireframeBuffers(gl, tmpMesh);
			OBJ3D.mesh=tmpMesh;
		}
	}
	xhttp.open("GET", OBJ3D.objName, true);
    xhttp.overrideMimeType('text/plain');
	xhttp.send();
}



// =====================================================
function loadShaders(Obj3D) {
	loadShaderText(Obj3D,'.vs');
	loadShaderText(Obj3D,'.fs');
}

// =====================================================
function loadShaderText(Obj3D,ext) {   // lecture asynchrone...
  var xhttp = new XMLHttpRequest();
  
  xhttp.onreadystatechange = function() {
	if (xhttp.readyState === 4 && xhttp.status === 200) {
		if(ext==='.vs') { Obj3D.vsTxt = xhttp.responseText; Obj3D.loaded ++; }
		if(ext==='.fs') { Obj3D.fsTxt = xhttp.responseText; Obj3D.loaded ++; }
		if(Obj3D.loaded===2) {
			Obj3D.loaded ++;
			compileShaders(Obj3D);
			Obj3D.loaded ++;
		}
	}
  }
  
  Obj3D.loaded = 0;
  xhttp.open("GET", Obj3D.shaderName+ext, true);
  xhttp.overrideMimeType('text/plain');
  xhttp.send();
}

// =====================================================
function compileShaders(Obj3D)
{
	Obj3D.vshader = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(Obj3D.vshader, Obj3D.vsTxt);
	gl.compileShader(Obj3D.vshader);
	if (!gl.getShaderParameter(Obj3D.vshader, gl.COMPILE_STATUS)) {
		console.log("Vertex Shader FAILED... "+Obj3D.shaderName+".vs");
		console.log(gl.getShaderInfoLog(Obj3D.vshader));
	}

	Obj3D.fshader = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(Obj3D.fshader, Obj3D.fsTxt);
	gl.compileShader(Obj3D.fshader);
	if (!gl.getShaderParameter(Obj3D.fshader, gl.COMPILE_STATUS)) {
		console.log("Fragment Shader FAILED... "+Obj3D.shaderName+".fs");
		console.log(gl.getShaderInfoLog(Obj3D.fshader));
	}

	Obj3D.shader = gl.createProgram();
	gl.attachShader(Obj3D.shader, Obj3D.vshader);
	gl.attachShader(Obj3D.shader, Obj3D.fshader);
	gl.linkProgram(Obj3D.shader);
	if (!gl.getProgramParameter(Obj3D.shader, gl.LINK_STATUS)) {
		console.log("Could not initialise shaders");
		console.log(gl.getProgramInfoLog(Obj3D.shader));
	}
}


// =====================================================
function webGLStart() {
	
	var canvas = document.getElementById("WebGL-test");

	canvas.onmousedown = handleMouseDown;
	document.onmouseup = handleMouseUp;
	document.onmousemove = handleMouseMove;
	canvas.onwheel = handleMouseWheel;

	initGL(canvas);

	mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);
	mat4.identity(rotMatrix);
	mat4.rotate(rotMatrix, rotX, [1, 0, 0]);
	mat4.rotate(rotMatrix, rotY, [0, 0, 1]);

	distCENTER = vec3.create([0,-0.2,-3]);

	PLANE = new plane(1);
    HEIGHT = new heightMap(IMG_PATH+'texture2.png', [
		IMG_PATH+'water.png',    // 0-20% : eau
		IMG_PATH+'grass.png',   // 20-80% : herbe
		IMG_PATH+'snow.png'     // 80-100% : neige
	],
		'gradient');

	OCEAN = new plane(3.8);

	OBJ1 = new obj_mesh(OBJ_PATH+'bunny.obj', 'obj');

	CLOUD = new cloud(1., 0.5, 10, []);

    adaptCanvasSize();
	
	tick();

	document.getElementById("oceanDrawnCheckbox").checked = false;
	document.getElementById('tresh_1to2_scale').value = treshold_1to2;
	document.getElementById('tresh_2to3_scale').value = treshold_2to3;
	document.getElementById('delta_1to2_scale').value = alpha_1to2;
	document.getElementById('delta_1to2_scale').value = alpha_2to3;
}

// =====================================================
function drawScene() {
	gl.clear(gl.COLOR_BUFFER_BIT);
	CLOUD.draw();

    if(drawPlane)
        PLANE.draw();
    if(drawHeightMap)
        HEIGHT.draw();
	if(document.getElementById("oceanDrawnCheckbox").checked)
		OCEAN.draw();
	if(document.getElementById("objDrawnCheckbox").checked)
		OBJ1.draw();
}

function hexToNormalizedRGB(hex) {
    // On enlève le '#' si présent
    if (hex.startsWith('#')) {
        hex = hex.slice(1);
    }

    // Supporte le format court (#abc) en le transformant en long (#aabbcc)
    if (hex.length === 3) {
        hex = hex.split('').map(ch => ch + ch).join('');
    }

    if (hex.length !== 6) {
        throw new Error("Format hexadécimal invalide. Attendu 3 ou 6 caractères.");
    }

    // Extraction des composantes rouges, vertes, bleues
    const r = parseInt(hex.slice(0, 2), 16) / 255;
    const g = parseInt(hex.slice(2, 4), 16) / 255;
    const b = parseInt(hex.slice(4, 6), 16) / 255;

    return [r, g, b];
}

function createSample2D(imgName){
    // Create a texture
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

// Provide texture image data
    const image = new Image();
    image.src = imgName;
    image.onload = function () {
        gl.bindTexture(gl.TEXTURE_2D, texture);

        // Upload the image into the texture
        gl.texImage2D(
            gl.TEXTURE_2D,    // target
            0,                // level
            gl.RGBA,          // internal format
            gl.RGBA,          // format
            gl.UNSIGNED_BYTE, // type
            image             // image
        );

        // Set texture parameters (required)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    };
    return texture;
}

function adaptCanvasSize(){
    const canv = gl.canvas;
    const width  = canv.clientWidth;
    const height = canv.clientHeight;

    canv.width = canv.clientWidth;
    canv.height = canv.clientHeight;
    gl.viewport(0, 0, width, height);

    mat4.perspective(
        45,
        width / height,
        0.1,
        100.0,
        pMatrix);
}




