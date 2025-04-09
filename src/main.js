// Last modified by Exon on Tuesday april 8th, 2025.

// Retrieved on April 7th, 2025
// Adapted from: https://github.com/mrdoob/three.js/blob/master/examples/webgl_multiple_elements.html

import * as THREE from 'three';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let canvas, renderer;

window.scenes = [];

init();

function init() {

    canvas = document.getElementById( 'c' );

    const geometries = [
        new THREE.BoxGeometry( 1, 1, 1 ),
        new THREE.SphereGeometry( 0.5, 12, 8 ),
        new THREE.DodecahedronGeometry( 0.5 ),
        new THREE.CylinderGeometry( 0.5, 0.5, 1, 12 )
    ];

    const content = document.getElementById( 'content' );
    let amountOfElements = 100; // i should extract this from a json...

    window.currentSceneIndex = 0;

    for ( let i = 0; i < amountOfElements; i ++ ) {
        // a way to construct scene from json? Hmmm... or classes to create the room. i guess thats what scenes are for but like... whats the point of iterating if its not a data.
        const scene = new THREE.Scene();

        const sceneElement = document.createElement( 'div' );
        sceneElement.id = i;
        content.appendChild( sceneElement );
        // sceneElement.style.width = "50vw"
        // sceneElement.style.height = "50vh"

        if (i % 2 !== 0){
            sceneElement.style.float = "right"
            scene.background = new THREE.Color(0x000000);
        } else {
            sceneElement.style.float = "left"
            scene.background = new THREE.Color(0xffffff);
        }

        if (i == 0){
            sceneElement.style.width = "100vw"
            
        } else {
            sceneElement.style.width = "0vw"
        }

        // if (style.display)

        // the element that represents the area we want to render the scene
        scene.userData.element = sceneElement;

        const camera = new THREE.PerspectiveCamera( 50, 1, 1, 10 );
        camera.position.z = 2;
        scene.userData.camera = camera;

        const controls = new OrbitControls( scene.userData.camera, scene.userData.element );
        controls.minDistance = 2;
        controls.maxDistance = 5;
        controls.enablePan = false;
        controls.enableZoom = false;
        scene.userData.controls = controls;

        // add one random mesh to each scene
        const geometry = geometries[ geometries.length * Math.random() | 0 ];

        const material = new THREE.MeshStandardMaterial( {

            color: new THREE.Color().setHSL( Math.random(), 1, 0.75, THREE.SRGBColorSpace ),
            roughness: 0.5,
            metalness: 0,
            flatShading: true

        } );

        scene.add( new THREE.Mesh( geometry, material ) );

        scene.add( new THREE.HemisphereLight( 0xaaaaaa, 0x444444, 3 ) );

        const light = new THREE.DirectionalLight( 0xffffff, 1.5 );
        light.position.set( 1, 1, 1 );
        scene.add( light );

        scenes.push( scene );
    }

    renderer = new THREE.WebGLRenderer( { canvas: canvas, alpha: true, antialias: true } );
    renderer.setClearColor( 0xffffff, 0 );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setAnimationLoop( animate );

}

function updateSize() {

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    if ( canvas.width !== width || canvas.height !== height ) {

        renderer.setSize( width, height, false );

    }

}

let sceneSize = 50;
let flipped = false;
function animate() {

    updateSize();

    canvas.style.transform = `translateY(${window.scrollY}px)`;

    renderer.setClearColor( 0xffffff );
    renderer.setScissorTest( true );
    renderer.clear();

    renderer.setClearColor( 0xe0e0e0 );
    renderer.setScissorTest( true );

    scenes.forEach( function ( scene, i ) {

        // so something moves
        scene.children[ 0 ].rotation.y = Date.now() * 0.001;

        // get the element that is a place holder for where we want to
        // draw the scene
        const element = scene.userData.element;

        // get its position relative to the page's viewport
        const rect = element.getBoundingClientRect();

        // check if it's offscreen. If so skip it
        // Todo, fix this, its breaking the rendering of the 2nd element once the 0th element reaches 100vw.
        if ( rect.bottom < 0 || rect.top > renderer.domElement.clientHeight ||
            rect.right < 0 || rect.left > renderer.domElement.clientWidth ) {
            return; // it's off screen
        }

        // set the viewport
        const width = rect.right - rect.left;
        const height = rect.bottom - rect.top;
        const left = rect.left;
        const bottom = renderer.domElement.clientHeight - rect.bottom;

        renderer.setViewport( left, bottom, width, height );
        renderer.setScissor( left, bottom, width, height );

        const camera = scene.userData.camera;

        camera.aspect = width / height; // not changing in this example
        camera.updateProjectionMatrix();

        scene.userData.controls.update();

        renderer.render( scene, camera );

    } );

}