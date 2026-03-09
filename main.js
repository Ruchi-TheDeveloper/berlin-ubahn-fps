let camera, scene, renderer, controls;
let velocity = new THREE.Vector3();
let direction = new THREE.Vector3();
let moveForward=false, moveBackward=false, moveLeft=false, moveRight=false;

init();
animate();

function init(){

scene = new THREE.Scene();
scene.background = new THREE.Color(0x202020);

camera = new THREE.PerspectiveCamera(
75,
window.innerWidth/window.innerHeight,
0.1,
1000
);

renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(window.innerWidth,window.innerHeight);
document.body.appendChild(renderer.domElement);

controls = new THREE.PointerLockControls(camera,document.body);
document.body.addEventListener("click",()=>{
controls.lock();
});
  
const instructions = document.getElementById("instructions");

instructions.addEventListener("click",function(){
controls.lock();
});

controls.addEventListener("lock",()=>{
instructions.style.display="none";
});

controls.addEventListener("unlock",()=>{
instructions.style.display="";
});

scene.add(controls.getObject());

camera.position.y = 1.6;

const light = new THREE.HemisphereLight(0xffffff,0x444444);
light.position.set(0,200,0);
scene.add(light);

const loader = new THREE.GLTFLoader();

loader.load("./models/berlin_station.glb",function(gltf){

const model = gltf.scene;
model.scale.set(1,1,1);

scene.add(model);

});

document.addEventListener("keydown",function(event){

switch(event.code){

case "KeyW": moveForward=true; break;
case "KeyS": moveBackward=true; break;
case "KeyA": moveLeft=true; break;
case "KeyD": moveRight=true; break;

}

});

document.addEventListener("keyup",function(event){

switch(event.code){

case "KeyW": moveForward=false; break;
case "KeyS": moveBackward=false; break;
case "KeyA": moveLeft=false; break;
case "KeyD": moveRight=false; break;

}

});

window.addEventListener("resize",onWindowResize);

}

function onWindowResize(){

camera.aspect = window.innerWidth/window.innerHeight;
camera.updateProjectionMatrix();

renderer.setSize(window.innerWidth,window.innerHeight);

}

function animate(){

requestAnimationFrame(animate);

direction.z = Number(moveForward) - Number(moveBackward);
direction.x = Number(moveRight) - Number(moveLeft);
direction.normalize();

velocity.x -= velocity.x*0.1;
velocity.z -= velocity.z*0.1;

velocity.z -= direction.z*0.1;
velocity.x -= direction.x*0.1;

controls.moveRight(-velocity.x);
controls.moveForward(-velocity.z);

/* head bobbing */

camera.position.y = 1.6 + Math.sin(Date.now()*0.01)*0.02;

renderer.render(scene,camera);

}
