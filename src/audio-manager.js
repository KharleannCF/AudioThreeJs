import * as THREE from 'three';

let helper = {
    isDefined : function(conf) {
        return (conf !== null && conf !== undefined);
    },
    findByName  : function(elem, name) {
        return elem.getObjectByName(name);
    }
};

let normalAudio = {
    normal_1: 'https://s3.amazonaws.com/assets-test-o-zone/assets/sound/Soundsilk_WOOSH.mp3',
    button_1: 'https://s3.amazonaws.com/assets-test-o-zone/assets/sound/button.wav',
    foxi_1_en: 'https://s3.amazonaws.com/assets-test-o-zone/assets/sound/Hi_Foxy_English_Salli.mp3',
    foxi_1_ja: 'https://s3.amazonaws.com/assets-test-o-zone/assets/sound/Hi_Foxy_Japanese_Mizuki.mp3',
    profile_foxi_en: 'https://s3.amazonaws.com/assets-test-o-zone/assets/sound/Hello_Foxy_English_Salli.mp3',
    profile_foxi_ja: 'https://s3.amazonaws.com/assets-test-o-zone/assets/sound/Hello_Foxy_Japanese_Mizuki.mp3',
    teleport_1: 'https://s3.amazonaws.com/assets-test-o-zone/assets/sound/teleport1.wav',
    teleport_2: 'https://s3.amazonaws.com/assets-test-o-zone/assets/sound/teleport2.wav',
    man_1_en: 'https://s3.amazonaws.com/assets-test-o-zone/assets/sound/People_Sorry_English_Matthew.mp3',
    man_1_ja: 'https://s3.amazonaws.com/assets-test-o-zone/assets/sound/People_Sorry_Japanese_Takumi.mp3',
    woman_1_en: 'https://s3.amazonaws.com/assets-test-o-zone/assets/sound/People_Sorry_English_Joanna.mp3',
    woman_1_ja: 'https://s3.amazonaws.com/assets-test-o-zone/assets/sound/People_Sorry_Japanese_Mizuki.mp3',
    woman_1_shiseido: 'https://s3.amazonaws.com/assets-test-o-zone/assets/sound/Shiseido/1.mp3',
    woman_2_shiseido: 'https://s3.amazonaws.com/assets-test-o-zone/assets/sound/Shiseido/2.mp3',
    woman_3_shiseido: 'https://s3.amazonaws.com/assets-test-o-zone/assets/sound/Shiseido/3.mp3',
    woman_4_shiseido: 'https://s3.amazonaws.com/assets-test-o-zone/assets/sound/Shiseido/4.mp3',
    woman_5_shiseido: 'https://s3.amazonaws.com/assets-test-o-zone/assets/sound/Shiseido/5.mp3',



    man_1_bank: 'https://assets-test-o-zone.s3.amazonaws.com/assets/sound/BANK/bank1Welcome.mp3',
    man_2_bank: 'https://assets-test-o-zone.s3.amazonaws.com/assets/sound/BANK/bank2DoYouWantMoreInfo.mp3',
    man_3_bank: 'https://assets-test-o-zone.s3.amazonaws.com/assets/sound/BANK/bank3CreditcardInfo.mp3',
    man_4_bank: 'https://assets-test-o-zone.s3.amazonaws.com/assets/sound/BANK/bank4GreatLetMeConnectYou.mp3',
    man_5_bank: 'https://assets-test-o-zone.s3.amazonaws.com/assets/sound/BANK/bank5OkayNoProblem.mp3',
    man_6_bank: 'https://assets-test-o-zone.s3.amazonaws.com/assets/sound/BANK/bank6OkayThanksForStoppingBy.mp3',
    man_7_bank: 'https://assets-test-o-zone.s3.amazonaws.com/assets/sound/BANK/bank4GreatLetMeConnectYou.mp3',
    red:'red.mp3',
    green:'green.mp3',
    blue:'blue.mp3'


},
    ambient = {
        ambient_1: 'https://s3.amazonaws.com/assets-test-o-zone/assets/sound/ghost_force_V1.mp3',
        ozone_jay: 'https://s3.amazonaws.com/assets-test-o-zone/assets/sound/Ambient.mp3'
    },
    audioPlay = [],
    camera,
    distance = 1,
    mute = false,
    masterVol = 1,
    ambientPlay,
    listener,
    listenerList = {},
    loaderaudio = new THREE.AudioLoader(),
    soundCont = 0;


export function setListener(_camera) {

    if (!helper.isDefined(listenerList[_camera.name])) {
        listener = new THREE.AudioListener()
        listener.name = "listener";
        listenerList[_camera.name] = listener;
        _camera.add(listener);
        listener.setMasterVolume(masterVol);
    } else {
        listener = listenerList[_camera.name];
    }
    camera = _camera;
}


//Added an elem parameter, multiple cameras could be defined with setListener method
//Previous version wasn't working on example scene
//Comented c value reassignation previous error may come from my helper definition
//Added Math.max function, negative values are considered positive by API
export function upDownAudio(vol, elem) {
    let c = helper.findByName(elem, "listener");
    //c=c[0]
    c.setMasterVolume(Math.max(c.getMasterVolume() + vol, 0));
}

export const getListenerAudio = () => {
    return listener;
}

export function initAudio(conf, position, object) {
    position = helper.isDefined(position) ? position : [];
    for (let i = 0; i < conf.length; i++) {

        switch (conf[i].type) {

            case "event":

                addAudioEvent(conf[i], position[i], object);

                break;

            case "point":

                addAudioPoint(conf[i], position[i]);

                break;

            default:
                break;
        }
    }
}

export function initAmbientAudio(name) {
    name = !helper.isDefined(name) ? "ozone_jay" : name;
    let sound = new THREE.Audio(listener);
    let v = -1;

    loaderaudio.load(ambient[name], function (buffer) {

        sound.setBuffer(buffer);
        sound.Volume = 0
        ambientPlay = sound;
        sound.name = "ambient";
        sound.setLoop(true);
        for (let i = 0; i < audioPlay.length; i++) {
            if (audioPlay[i].name != "ambient") continue;
            audioPlay[i].stop();
            v = i;
            break;
        }
        setVolume(sound);
        sound.play();
        v == -1 ? audioPlay.push(sound) : audioPlay[v] = sound;
    });

}

export function addAudioEvent(conf, position, _object) {
    let sound = new THREE.PositionalAudio(listener);
    let object = helper.isDefined(_object) ? _object : AudioObject(position, true);
    conf.volumen = helper.isDefined(conf.volumen) ? conf.volumen : 50;
    conf.distance = helper.isDefined(conf.distance) ? conf.distance : 50;

    loaderaudio.load(normalAudio[conf.name], function (buffer) {

        sound.setBuffer(buffer);
        sound.Volume = conf.volumen;
        setVolume(sound);
        sound.name = "Audio";
        sound.setRefDistance(conf.distance);
        object.add(sound);
        sound.plays = false;
        audioPlay.push(sound);
        object.view_from = (x, object) => {
            startAudio(object);
        };
    });

}

//Name changed for consistency with prevously defined methods
//createEventAudio now is createAudioEvent
export function createAudioEvent(conf, position, _object) {
    let sound = new THREE.PositionalAudio(listener);
    let object = helper.isDefined(_object) ? _object : AudioObject(position, true);
    conf.volumen = helper.isDefined(conf.volumen) ? conf.volumen : 50;
    conf.distance = helper.isDefined(conf.distance) ? conf.distance : 50;

    loaderaudio.load(normalAudio[conf.name], function (buffer) {
        
        sound.setBuffer(buffer);
        sound.Volume = conf.volumen;
        setVolume(sound);
        sound.name = "Audio";
        sound.setRefDistance(conf.distance);
        object.add(sound);
        sound.plays = false;
        audioPlay.push(sound);
    });
}

function addAudioPoint(conf, position) {

    let object = AudioObject(position, false);
    let sound = new THREE.PositionalAudio(listener);
    conf.distance = helper.isDefined(conf.distance) ? 50 : conf.distance;
    conf.volumen = helper.isDefined(conf.volumen) ? 50 : conf.volumen;

    loaderaudio.load(normalAudio[conf.name], function (buffer) {

        sound.setBuffer(buffer);
        sound.Volume = conf.volumen;
        setVolume(sound);
        sound.setLoop(true);
        sound.name = "Audio";
        sound.play();
        sound.plays = false;
        sound.setRefDistance(conf.distance);
        object.add(sound);
        audioPlay.push(sound);

    });
}

export function startAudio(object) {
    let v = false;
    let c = object.children.filter(object => object.name == "Audio");
    if (c.length > 1) {

        if (!AudioStayPlay(c)) {

            for (let i = 0; i < c.length; i++) {
                if (c[i].plays) continue;
                c[i].plays = true;
                c[i].play();
                v = true;
                break;
            }
            if (!v) {
                for (let i = 0; i < c.length; i++) {
                    c[i].plays = false;
                }
                startAudio(object);
            }
        }

    } else {

        c[0].play();
    }
}

//Previous version wasn't working on example scene
//removed '[0]' from v.remove(c[0]) previous error may come from my helper definition
//If audio element is only removed it will still keep playing till song ends
//unles you pause it before removing it
export function deleteAudio(v) {
    let c = helper.findByName(v, "Audio");
    c.pause();
    v.remove(c);
}

export function stopAllAudio() {

    let v;
    for (let i = 0; i < audioPlay.length; i++) {

        if (audioPlay[i].isPlaying && audioPlay[i].name != "ambient") {
            audioPlay[i].stop();
        } else {
            v = audioPlay[i];
        }

    }
    audioPlay = [];

    if (v === undefined) {

        // initAudio("ambient");

    } else {

        audioPlay.push(v);

    }

}

function AudioObject(position, visible) {

    let geometry = new THREE.BoxBufferGeometry(1, 1, 1);
    let material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
    let cube = new THREE.Mesh(geometry, material);
    cube.position.copy(position);
    cube.visible = visible;
    scene.add(cube);

    cube.onBeforeRender = function (renderer, scene, camera, geometry, material, group) {
        this.rotation.x += 0.01;
        this.rotation.z += 0.01;
    }
    return cube;
}

export function muteAudio(v) {

    let snapSound = document.getElementById("ambientAudio");

    snapSound.muted = !snapSound.muted;
}

export const playAmbient = () => {
    let snapSound = document.getElementById("ambientAudio");
    snapSound.currentTime = 0;
    snapSound.loop = true;
    snapSound.volume = 0.25;
    snapSound.play();
}

function setVolume(audio) {

    if (mute) {

        if (audio.name === "ambient") {

            audio.setVolume(0);
        }

    } else {

        audio.setVolume(audio.Volume);

    }

}


export function addAudioEventMultiple(name, object, n, conf) {

    let sound = new THREE.PositionalAudio(listener);
    sound.name = n;
    conf = helper.isDefined(conf) ? conf : {};
    conf.volumen = helper.isDefined(conf.volumen) ? conf.volumen : 1;
    conf.distance = helper.isDefined(conf.distance) ? conf.distance : 20;

    loaderaudio.load(normalAudio[name], function (buffer) {

        sound.setBuffer(buffer);
        sound.Volume = conf.volumen;
        setVolume(sound);
        sound.setRefDistance(conf.distance);
        sound.plays = false;
        object.add(sound);
        audioPlay.push(sound);

    });

}

export function startAudioMultiple(object, j) {

    let c = object.children.filter(object => object.type == "Audio");
    let v = object.children.filter(object => object.name == j);

    let snapSound = document.getElementById("ambientAudio");
    snapSound.volume = 0.1;

    if (c.length > 0) {
        for (let i = 0; i < c.length; i++) {
            if (!c[i].plays) continue;
            c[i].plays = false;
            c[i].stop();
        }
        v[0].plays = true;
        v[0].play();

        v[0].source.onended = function () {
            snapSound.volume = 0.25;
            this.isPlaying = false;
        }
    }
}

export function loadAudio(name, object, conf) {

    let sound = new THREE.PositionalAudio(listener);
    conf = helper.isDefined(conf) ? conf : {};
    conf.volumen = helper.isDefined(conf.volumen) ? conf.volumen : 1;
    conf.distance = helper.isDefined(conf.distance) ? conf.distance : 20;

    loaderaudio.load(normalAudio[name], function (buffer) {

        sound.setBuffer(buffer);
        sound.Volume = conf.volumen;
        setVolume(sound);
        sound.name = "Audio";
        sound.setRefDistance(conf.distance);
        sound.plays = false;
        object.add(sound);
        audioPlay.push(sound);

    });

}

function AudioStayPlay(sound) {
    for (let i = 0; i < sound.length; i++) {
        if (sound[i].isPlaying) {
            return true;
        }
    }
    return false;
}


//Added Functions

//Receive Id of html audio element, this is usefull when only have the html tag
function createAudioElement(id){
    const audioElement = document.getElementById(id);
    audioElement.play();
    return audioElement;
}



//receive the Id from an audio html tag return element to set
//this also receive a configuration JSON that set the properties of the audio element
//See threejs documentation in order to see what configuration you could give
//the function are case sensitive, so you must write the config exactly
//the same way threeJS name function (minus the '.set')
//This function also receive a previously defined object to add the sound to
export function createPositionalAudio(audioElementId, conf, object){
    const sound = new THREE.PositionalAudio(getListenerAudio());
    const audioElement = createAudioElement(audioElementId);
    sound.setMediaElementSource( audioElement );
    let confEntries = (conf) ? Object.entries(conf) : [];
    for (let i = 0; i< confEntries.length ; i++ ){
        confEntries[i][0] = "set" + confEntries[i][0];
        if (typeof sound[confEntries[i][0]] === "function"){
            sound[confEntries[i][0]](confEntries[i][1]);
        }
    }
    sound.name ='Audio';
    object.add(sound)
}

//This function receive an object and return if the audio
//from said object is playing or not (usefull to avoid console warnings)
export function audioPlaying(object){
    let c = helper.findByName(object, 'Audio')
    return c.isPlaying;
}

//Function to create the positional audio through a media stream
//this receive a stream and a configuration JSON that set properties of the audio element
//See threejs documentation in order to see what configuration you could give
//the function are case sensitive, so you must write the config exactly
//the same way threeJS name function (minus the '.set')
let createAudioStream = function(stream, conf){
    let sound = new THREE.PositionalAudio(getListenerAudio());
    sound.setMediaStreamSource(stream);
    let confEntries = (conf) ? Object.entries(conf) : [];
    for (let i = 0; i< confEntries.length ; i++ ){
        confEntries[i][0] = "set" + confEntries[i][0];
        if (typeof sound[confEntries[i][0]] === "function"){
            sound[confEntries[i][0]](confEntries[i][1]);
        }
    }
    return sound;
}

//Receive an object and put the media stream element on it
//also receive a config json to change the audioStream default configuration
//createAudioStream function
export let catchMicrophone = function(object, conf){
    let mediaRecorder;
    let constraints = {audio : true};
    navigator.mediaDevices.getUserMedia(constraints).then(function(stream){
        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.onstart = function(e){
            const audio = createAudioStream(e.target.stream, conf);
            audio.name = 'audio';
            object.add(audio);
        }
        mediaRecorder.start();
    })
}
