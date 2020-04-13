/*
 Dependencies Webpack  and three, npm install webpack webpack-cli,
 npm install three, npm install camera-controls
 npm run-script build to compile, work on this file.
 dont change package.json
 Camera-controls Documentation https://github.com/yomotsu/camera-controls
 Media recorder https://developers.google.com/web/fundamentals/media/recording-audio


 */
const button = document.getElementById('starter');
const principal = document.getElementById('principal');

const THREE = require('three');
const audioManager = require('./audio-manager.js');
import CameraControls from 'camera-controls';

CameraControls.install({THREE : THREE});

const canvas = document.getElementById('canvas');
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({canvas});

//field of view, ratio, near, far
const cameraM = new THREE.PerspectiveCamera(40, window.innerWidth/window.innerHeight, 0.1, 1000);
cameraM.position.set(0, 0, 0,);

//variable for camera change (future implementation)
let activeCamera = cameraM
//movement speed variable
let speedMovement = 300;
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;

//Media recorder and mediaStream for the blue parrot sphere
let mediaRecorder;
const mediaStream = new MediaStream();


//Space and scene visual functions

//this function receive a time variable provided by the render and a object3d space to rotate
//this will make the space rotate in a sinusoidal wave
const rotationManager = function(time, space){
	space.rotation.x = time;
	space.rotation.y = time;
}

//Move the camera according to a direction, and speed received as parameter event received
//the delta factor will divide the movement speed by 100 but will make it feel smoother to the controler
function movement(direction, speed){
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




//Glass sphere creator receive the radius of the sphere
function createGlassSphere(radius){
	const glassGeometry = new THREE.SphereGeometry(radius, 32, 32);
	const glassMaterial = new THREE.MeshPhongMaterial({color: 0x0, specular:0xFFFFFF, shininess: 100, opacity:0.3, transparent: true});
	const mesh = new THREE.Mesh(glassGeometry, glassMaterial);
	return mesh;
}

//Sphere creator receive the radius and the color of the sphere
function createColorSphere(radius, hexColor){
	const colorSphereGeometry = new THREE.SphereGeometry(radius, 32, 32);
	const sphereMaterial = new THREE.MeshLambertMaterial({color: hexColor});
	let mesh = new THREE.Mesh(colorSphereGeometry, sphereMaterial);
	return mesh;
}

//receive object that need to detects colisions in the x, z coordinates
function colisionDetector (controlElement, interactiveElement){
	let x = (cameraControls.getPosition().x >= interactiveElement.position.x - 20) && (cameraControls.getPosition().x < interactiveElement.position.x + 20)
	let z = (cameraControls.getPosition().z >= interactiveElement.position.z - 20) && (cameraControls.getPosition().z < interactiveElement.position.z + 20)
	return (x && z);
}

//Audio function and proposal for audio manager

//Receive Id of html audio element, this is usefull when only have the html tag
function createAudioElement(id){
	const audioElement = document.getElementById(id);
	audioElement.play();
	return audioElement;
}

//receive audioElement from audio html tag return elemento to set
//this also receive a configuration JSON that set the properties of the audio element
//See threejs documentation in order to see what configuration you could give
//the function are case sensitive, so you must write the config exactly
//the same way threeJS name function (minus the '.set')
function createPositionalAudio(audioElement, conf){
	const audios = new THREE.PositionalAudio(audioManager.getListenerAudio());
	audios.setMediaElementSource( audioElement );
	let confEntries = (conf) ? Object.entries(conf) : [];
	for (let i = 0; i< confEntries.length ; i++ ){
		confEntries[i][0] = "set" + confEntries[i][0];
		if (typeof audios[confEntries[i][0]] === "function"){
			audios[confEntries[i][0]](confEntries[i][1]);
		}
	}
	return audios;
}


//Set true if audio of an object received as parameter is playing
//useful to reduce the number of warnings in the console when the colission is detected
function audioPlaying(object){
	let c = object.children
	return c[0].isPlaying;
}



//Function to create the positional audio through a media stream
//this receive a stream and a configuration JSON that set properties of the audio element
//See threejs documentation in order to see what configuration you could give
//the function are case sensitive, so you must write the config exactly
//the same way threeJS name function (minus the '.set')
let createAudioStream = function(stream, conf){
	let audios = new THREE.PositionalAudio(audioManager.getListenerAudio());
	audios.setMediaStreamSource(stream);
	let confEntries = (conf) ? Object.entries(conf) : [];
	for (let i = 0; i< confEntries.length ; i++ ){
		confEntries[i][0] = "set" + confEntries[i][0];
		if (typeof audios[confEntries[i][0]] === "function"){
			audios[confEntries[i][0]](confEntries[i][1]);
		}
	}
	return audios;
}

//Receive an object and put the media stream element on it
//future modifications can receive a config Json and send it to the
//createAudioStream function
let catchMicrophone = function(object){
	let constraints = {audio : true};
	navigator.mediaDevices.getUserMedia(constraints).then(function(stream){
		mediaRecorder = new MediaRecorder(stream);
		mediaRecorder.onstart = function(e){
			const audio = createAudioStream(e.target.stream, {Volume: 20});
			audio.name = 'audio';
			object.add(audio);
		}
		mediaRecorder.start();
	})
}



//Ground
let geoFloor = new THREE.BoxGeometry( 1000, 1, 1000 );
let matFloor = new THREE.MeshLambertMaterial( { color: 0xA1F6CF } );
let floor = new THREE.Mesh( geoFloor, matFloor );

floor.position.set(0,-0.5,0);
scene.add( floor );

//space that rotate in sinusoidal wave
const rotationSpace = new THREE.Object3D();

//Red ball that reproduce an in movement sound
let spotLight = new THREE.SpotLight(0xFFFFFF, 1, 100);
spotLight.position.set(460,0,0);
rotationSpace.add(spotLight);

let glassSphere = createGlassSphere(5);
glassSphere.position.set(450,0,0);
rotationSpace.add(glassSphere);

const redSphere = createColorSphere(4, 0xF10400);
redSphere.position.set(450,0,0);
rotationSpace.add(redSphere);

//green sphere that react to anyone walking under them
spotLight = new THREE.SpotLight(0xFFFFFF, 1, 100);
spotLight.position.set(0,40,-460);
scene.add(spotLight);

glassSphere = createGlassSphere(5);
glassSphere.position.set(0,40,-450);
scene.add(glassSphere);

const greenSphere = createColorSphere(4, 0x01F100);
greenSphere.position.set(0,40,-450);
scene.add(greenSphere);

//violet sphere play music endless
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

//Parrot blue sphere that speak at the same time as you
spotLight = new THREE.SpotLight(0xFFFFFF, 1, 100);
spotLight.position.set(-460,40,0);
scene.add(spotLight);

glassSphere = createGlassSphere(5);
glassSphere.position.set(-450,40,0);
scene.add(glassSphere);

const blueSphere = createColorSphere(4, 0x0001F1);
blueSphere.position.set(-450,40,0);
scene.add(blueSphere);

scene.add(rotationSpace);

//clock used by controls
const clock = new THREE.Clock();
//controls
const cameraControls = new CameraControls( activeCamera, renderer.domElement );
cameraControls.setLookAt( 0, 2, 0, 0.0001, 2, 0, false );
cameraControls.maxDistance = 0.0001;
cameraControls.minDistance = 0;
cameraControls.truckSpeed = 2.0;

//Event function when a key is pressed
let onKeyDown = function ( event ) {
	switch ( event.keyCode ) {
		case 38: // up
		case 87: // w
			moveForward = true;
			movement(moveForward, speedMovement);
			break;
		case 37: // left
		case 65: // a
			moveLeft = true;
			movement(moveLeft, speedMovement);
			break;
		case 40: // down
		case 83: // s
			moveBackward = true;
			movement(moveBackward, speedMovement);
			break;
		case 39: // right
		case 68: // d
			moveRight = true;
			movement(moveRight, speedMovement);
			break;
		case 70: //F
			audioManager.startAudio(redSphere);
			break;
		case 67:
		if(mediaRecorder == null) {
			catchMicrophone(blueSphere);
		}else {
			blueSphere.getObjectByName('audio').setVolume(10);
		} 

			break;
		}

};
//event function that works when a key is released
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
		case 67:
			blueSphere.getObjectByName('audio').setVolume(0);
			break;
		}
};
//event function on click
//this create all the sounds elements
const clicker = function(event){
	principal.style.display = 'none';
	canvas.style.display = 'block';
	document.addEventListener( 'keydown', onKeyDown, false );
	document.addEventListener( 'keyup', onKeyUp, false );
	if (!audioManager.getListenerAudio()){
		//This one comes from html audio tag
		audioManager.setListener(cameraM);		
		let audioElement = createAudioElement('violetMusic');
		const audio = createPositionalAudio(audioElement,  {Volume: 4, RolloffFactor : 900, RefDistance : 35});
		violetSphere.add(audio);

		// this comes from audio manager file provided
		audioManager.createEventAudio({name:'red', volumen:30, distance: 0.5}, null, redSphere);
		audioManager.createEventAudio({name:'green', volumen:0.5, distance: 1}, null, greenSphere);	

		// This is mediaStream Manager
	}
}

starter.addEventListener( 'click', clicker, false );


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

function render(time) {
	time *=0.00025;

	rotationManager(time, rotationSpace);

	//this let the render know that the camera matrix changed
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