/*
 Dependencies Webpack  and three, npm install webpack webpack-cli,
 npm install three, npm install camera-controls
 npm run-script build to compile, work on this file.
 dont change package.json
 Camera-controls Documentation https://github.com/yomotsu/camera-controls

 */


const THREE = require('three');
const audioManager = require('./audio-manager.js');
import CameraControls from 'camera-controls';

CameraControls.install({THREE : THREE});

const canvas = document.getElementById('canvas');

let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
const speedMovement = 300;

let activeCamera; // for camera change

const scene = new THREE.Scene();

const camera1 = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const camera2 = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const camera3 = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const camera4 = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const cameraM = new THREE.PerspectiveCamera(40, window.innerWidth/window.innerHeight, 0.1, 1000);
cameraM.position.set(0, 0, 0,);

activeCamera = cameraM




const renderer = new THREE.WebGLRenderer({canvas});

//Move the camera according to a direction, and speed received as parameter event received
function movement(direction, event, speed){
	let delta = clock.getDelta()
	let moveZ = Number(moveForward) -Number(moveBackward);
  	let moveX = Number(moveRight) - Number(moveLeft);
  	
  	if (moveForward || moveBackward) {
  		cameraControls.forward(speed*delta*moveZ,true);
  	}
  	if (moveLeft || moveRight) {
	  	cameraControls.truck(speed*delta*moveX,0,true);
  	}
  	
  	if(!audioPlaying(greenSphere)){
  		(colisionDetector(cameraControls, greenSphere)) ? audioManager.startAudio(greenSphere) : false;
  	}
}

//Set true if audio of an object received as parameter is playing
function audioPlaying(object){
	let c = object.children
	return c[0].isPlaying;
}



//Glass sphere creator 
function createGlassSphere(radius){
	const glassGeometry = new THREE.SphereGeometry(radius, 32, 32);
	const glassMaterial = new THREE.MeshPhongMaterial({color: 0x0, specular:0xFFFFFF, shininess: 100, opacity:0.3, transparent: true});
	const mesh = new THREE.Mesh(glassGeometry, glassMaterial);
	return mesh;
}

//Sphere creator
function createColorSphere(radius, hexColor){

	const colorSphereGeometry = new THREE.SphereGeometry(radius, 32, 32);
	const sphereMaterial = new THREE.MeshLambertMaterial({color: hexColor});
	let mesh = new THREE.Mesh(colorSphereGeometry, sphereMaterial);
	return mesh;
}


//Receive Id of html audio element
function createAudioElement(id){
	const audioElement = document.getElementById(id);
	audioElement.play();
	return audioElement;
}

//receive audioElement from audio html tag return elemento to set
function createPositionalAudio(audioElement){
	const audio = new THREE.PositionalAudio(audioManager.getListenerAudio());
	audio.setMediaElementSource( audioElement );
	return audio;
}

//receive object that need to detects colisions
function colisionDetector (controlElement, interactiveElement){
	let x = (cameraControls.getPosition().x >= interactiveElement.position.x - 20) && (cameraControls.getPosition().x < interactiveElement.position.x + 20)
	let z = (cameraControls.getPosition().z >= interactiveElement.position.z - 20) && (cameraControls.getPosition().z < interactiveElement.position.z + 20)
	return (x && z);
}

const clicker = function(event){
	if (!audioManager.getListenerAudio()){
		//This one comes from html audio tag
		audioManager.setListener(cameraM);		
		const audioElement = createAudioElement('music');
		const audio = createPositionalAudio(audioElement);
		violetSphere.add(audio);

		// this comes from audio manager file provided
		audioManager.createEventAudio({name:'foxi_1_en', volumen:0.1}, null, redSphere);
		audioManager.createEventAudio({name:'woman_3_shiseido', volumen:0.1}, null, greenSphere);	
	}
}

let geoFloor = new THREE.BoxGeometry( 1000, 1, 1000 );
let matFloor = new THREE.MeshLambertMaterial( { color: 0xA1F6CF } );
let floor = new THREE.Mesh( geoFloor, matFloor );

floor.position.set(0,-0.5,0);
scene.add( floor );

let spotLight = new THREE.SpotLight(0xFFFFFF, 1, 100);
spotLight.position.set(-460,40,0);
scene.add(spotLight);

let glassSphere = createGlassSphere(5);
glassSphere.position.set(-450,40,0);
scene.add(glassSphere);

const blueSphere = createColorSphere(4, 0x0001F1);
blueSphere.position.set(-450,40,0);
scene.add(blueSphere);

spotLight = new THREE.SpotLight(0xFFFFFF, 1, 100);
spotLight.position.set(460,40,0);
scene.add(spotLight);

glassSphere = createGlassSphere(5);
glassSphere.position.set(450,40,0);
scene.add(glassSphere);

const redSphere = createColorSphere(4, 0xF10400);
redSphere.position.set(450,40,0);
scene.add(redSphere);

spotLight = new THREE.SpotLight(0xFFFFFF, 1, 100);
spotLight.position.set(0,40,-460);
scene.add(spotLight);

glassSphere = createGlassSphere(5);
glassSphere.position.set(0,40,-450);
scene.add(glassSphere);

const greenSphere = createColorSphere(4, 0x01F100);
greenSphere.position.set(0,40,-450);
scene.add(greenSphere);

spotLight = new THREE.SpotLight(0xFFFFFF, 1, 100);
spotLight.position.set(0,40,460);
scene.add(spotLight);

glassSphere = createGlassSphere(5);
glassSphere.position.set(0,40,450);
scene.add(glassSphere);

const violetSphere = createColorSphere(4, 0xA100A1);
violetSphere.position.set(0,40,450);
scene.add(violetSphere);

const light = new THREE.PointLight( 0xFFFFFF, 3, 0,0 );
light.position.set( 0, 50, 0 );
scene.add( light );

const clock = new THREE.Clock();
const cameraControls = new CameraControls( activeCamera, renderer.domElement );
cameraControls.setLookAt( 0, 2, 0, 0.0001, 2, 0, false );
cameraControls.maxDistance = 0.0001;
cameraControls.minDistance = 0;
cameraControls.truckSpeed = 2.0;

let onKeyDown = function ( event ) {
	switch ( event.keyCode ) {
		case 38: // up
		case 87: // w
			moveForward = true;
			movement(moveForward, event, speedMovement);
			break;
		case 37: // left
		case 65: // a
			moveLeft = true;
			movement(moveLeft, event, speedMovement);
			break;
		case 40: // down
		case 83: // s
			moveBackward = true;
			movement(moveBackward, event, speedMovement);
			break;
		case 39: // right
		case 68: // d
			moveRight = true;
			movement(moveRight, event, speedMovement);
			break;
		case 70: //F
			audioManager.startAudio(redSphere);
			break;
		}
};

let onKeyUp = function ( event ) {
	switch ( event.keyCode ) {
		case 38: // up
		case 87: // w
			moveForward = false;
			break;
		case 37: // left
		case 65: // a
			moveLeft = false;
			break;
		case 40: // down
		case 83: // s
			moveBackward = false;
			break;
		case 39: // right
		case 68: // d
			moveRight = false;
			break;
		}
};


document.addEventListener( 'keydown', onKeyDown, false );
document.addEventListener( 'keyup', onKeyUp, false );
document.addEventListener( 'click', clicker, false );

// codigo temporal

// Fin codigo Temp


//responsive function
function resizeRendererToDisplaySize(renderer) {
	const canvas = renderer.domElement;
	const pixelRatio = window.devicePixelRatio;
	const width  = canvas.clientWidth  * pixelRatio | 0;
	const height = canvas.clientHeight * pixelRatio | 0;
	const needResize = canvas.width !== width || canvas.height !== height;
	if (needResize) {
	  renderer.setSize(width, height, false);
	}
	return needResize;
}

function render() {


	const delta = clock.getDelta();
	const hasControlUpdated = cameraControls.update(delta);
	


	if ( hasControlUpdated ) {
		renderer.render( scene, activeCamera );
	}

	if (resizeRendererToDisplaySize(renderer)){
			const canvas = renderer.domElement;
			activeCamera.aspect = canvas.clientWidth / canvas.clientHeight;
			activeCamera.updateProjectionMatrix();
		}
	renderer.render(scene, activeCamera);



	requestAnimationFrame(render);
}
requestAnimationFrame(render);