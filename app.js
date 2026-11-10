import * as THREE from './vendor/three.module.js';
const $=s=>document.querySelector(s);let renderer;
try{renderer=new THREE.WebGLRenderer({antialias:true});}catch(e){$('#error').hidden=false;$('#error').textContent='無法啟用 3D。請使用支援 WebGL 的 Chrome、Edge 或 Firefox，並開啟硬體加速。';throw e;}
renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setSize(innerWidth,innerHeight);renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.setClearColor(0xe9e8e2);renderer.outputColorSpace=THREE.SRGBColorSpace;$('#scene').appendChild(renderer.domElement);
const scene=new THREE.Scene();scene.fog=new THREE.Fog(0xe9e8e2,28,65);const camera=new THREE.PerspectiveCamera(48,innerWidth/innerHeight,.05,100);
scene.add(new THREE.HemisphereLight(0xffffff,0xa1ad91,2.5));const sun=new THREE.DirectionalLight(0xfff4dc,3.5);sun.position.set(-3,14,8);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-12,right:12,top:12,bottom:-12});sun.shadow.bias=-.001;scene.add(sun);
const mats={wall:0xf8f6ec,edge:0xe1ded1,wood:0xbca388,white:0xf3eee3,green:0x758a72,dark:0x3b5148,linen:0xd8d6bf,metal:0x737e77};const collisions=[],walls=[],electric=new THREE.Group();scene.add(electric);
function box(x,y,z,w,h,d,color,solid=false){const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),new THREE.MeshStandardMaterial({color:typeof color==='string'?mats[color]:color,roughness:.82}));mesh.position.set(x,y,z);mesh.castShadow=true;mesh.receiveShadow=true;scene.add(mesh);if(solid)collisions.push({x,z,w,d});return mesh;}
function wall(x,z,w,d){const m=box(x,1.35,z,w,2.7,d,'wall',true);walls.push(m);box(x,.07,z,w+.01,.14,d+.02,'edge');}
function label(text,x,z){const c=document.createElement('canvas');c.width=512;c.height=128;const ctx=c.getContext('2d');ctx.fillStyle='#52665c';ctx.font='500 42px sans-serif';ctx.textAlign='center';ctx.fillText(text,256,75);const mesh=new THREE.Mesh(new THREE.PlaneGeometry(1.65,.4125),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(c),transparent:true,depthWrite:false}));mesh.rotation.x=-Math.PI/2;mesh.position.set(x,.023,z);scene.add(mesh);}
box(4.35,-.22,3.45,9.2,.4,7.4,0xd6d4c7);box(3.775,-.025,3.45,7.55,.05,6.9,0xd4c2a7);box(8.15,-.02,3.45,1.2,.05,6.9,0xd1d4c7);
// Individual floorboards and bathroom tile joints.
for(let z=.1;z<6.9;z+=.19)box(3.775,.002,z,7.5,.003,.007,0xb7a38a);
for(const z of [1.75,3.4]){box(3.775,.012,z,1.05,.025,1.55,0xc3c9bd);for(let t=3.25;t<4.3;t+=.26)box(t,.027,z,.006,.003,1.5,0xaeb8a8);}
wall(0,2.825,.12,5.65);wall(0,6.825,.12,.15);
// Main entrance at the former refrigerator position; door shown open inward.
box(0,2.32,6.2,.16,.12,1.2,'wood');
for(const z of [5.65,6.75])box(.025,1.15,z,.16,2.3,.09,'wood');
box(.5,1.1,6.7,1,2.2,.065,'wood',true);box(.9,1.05,6.65,.035,.07,.07,'metal');
box(.8,.015,6.2,1,.025,.65,0xb3b7a1);wall(3.775,0,7.55,.12);wall(3.775,6.9,7.55,.12);
wall(3.25,.35,.12,.7);wall(3.25,2.1,.12,1.08);wall(3.25,3.55,.12,.7);wall(4.3,1.32,.12,2.64);wall(4.3,3.55,.12,.7);
wall(1.3,2.7,2.6,.12);wall(6.25,2.7,2.6,.12);
wall(3.775,1.55,1.05,.09);wall(3.775,3,1.05,.09);wall(3.775,4.15,1.05,.1);
// Balcony wall has two walk-through door openings.
wall(7.55,1,.1,2);wall(7.55,3.1,.1,1);wall(7.55,6.5,.1,.8);
// Window panels and frames.
function windowAt(x,z,w,side=false){const glass=new THREE.Mesh(new THREE.BoxGeometry(side?.025:w,.95,side?w:.025),new THREE.MeshStandardMaterial({color:0xb8d2cd,transparent:true,opacity:.32,roughness:.15}));glass.position.set(x,1.75,z);scene.add(glass);box(x,2.25,z,side?.08:w+.1,.06,side?w+.1:.08,'white');box(x,1.25,z,side?.08:w+.1,.06,side?w+.1:.08,'white');}
windowAt(1.55,.075,2.15);windowAt(5.85,.075,2.15);windowAt(7.5,1.1,1.5,true);
// Balcony railing.
box(8.75,.55,3.45,.045,1.1,6.9,'metal');for(let z=0;z<=6.9;z+=.25)box(8.75,.5,z,.025,1,.025,'metal');box(8.15,.55,0,1.2,1.1,.04,'white');box(8.15,.55,6.9,1.2,1.1,.04,'white');
// Room-specific furniture: primary bedroom has a double bed; kitchen-side room has a single bed.
function bed(x,z,width,name){
 const length=1.9;
 box(x,.24,z,width,.42,length,'wood',true).name=name;
 box(x,.51,z,width-.02,.18,length-.05,'white');
 box(x,.65,z+.24,width,.12,1.25,'green');
 const pillows=width>1.2?[-.38,.38]:[0];
 for(const offset of pillows)box(x+offset,.65,z-.6,.55,.15,.35,'linen');
 box(x,.6,z-length/2,width+.05,1.15,.1,'wood');
}
bed(1.85,1.15,1,'kitchen-bedroom-single-bed');
bed(5.6,1.15,1.5,'primary-bedroom-double-bed');
// Side-wall wardrobes leave usable routes beside each bed and through the doors.
function wardrobe(x,z,depth,name,front){
 box(x,1.1,z,.6,2.2,depth,'linen',true).name=name;
 for(let dz=-depth/2+.03;dz<=depth/2;dz+=depth/3){
  box(x+front*.305,1.1,z+dz,.015,2.05,.012,'wood');
 }
 for(const dz of [-.15,.15])box(x+front*.32,1.15,z+dz,.035,.24,.025,'metal');
}
wardrobe(.37,1.35,1.9,'kitchen-bedroom-wardrobe',1);
wardrobe(7.18,1.35,1.9,'primary-bedroom-wardrobe',-1);
// Living room: rug, sofa, table, television.
box(6,.03,5.25,2.45,.035,1.65,0xe6e3d2);box(6.1,.25,6.48,2.15,.4,.68,'linen',true);box(6.1,.63,6.78,2.15,.64,.18,'linen');for(let x=5.4;x<7;x+=.67){box(x,.5,6.43,.62,.17,.54,'white');box(x,.7,6.68,.52,.35,.12,'green');}box(5.96,.38,5.22,1.2,.13,.6,'wood',true);box(5.96,.19,5.22,.85,.35,.38,'dark');box(6.13,.31,3.25,2.15,.6,.38,'wood',true);box(6.13,1.08,3.27,1.4,.83,.055,0x273330);box(6.13,.61,3.27,.45,.08,.2,'dark');
// Structural column shown on the supplied plan, beside the dining table at the exterior wall.
// Footprint is estimated from the drawing; it projects inward and continues to ceiling height.
const diningColumn=box(3.15,1.35,6.75,.75,2.7,.7,'wall',true);
diningColumn.name='dining-structural-column';
box(3.15,.07,6.75,.77,.14,.72,'edge');
// Dining table and chairs.
box(3.65,.76,5.48,1,.1,1.25,'wood',true);for(let x of [3.25,4.05])for(let z of [5,5.95])box(x,.38,z,.06,.76,.06,'dark');for(const x of [2.95,4.35]){const z=5.48;box(x,.44,z,.4,.08,.4,'linen',true).name='dining-chair';box(x+(x<3?-.18:.18),.65,z,.05,.5,.42,'wood');}
// Kitchen and appliances.
box(.34,.43,4.3,.56,.86,2.4,'white',true);box(.34,.88,4.3,.62,.07,2.4,'wood');box(.35,.925,3.65,.42,.02,.44,'metal');for(let z of [4.45,4.7])box(.35,.93,z,.34,.025,.18,0x343a37);box(4.05,.95,6.5,.7,1.9,.65,'white',true).name='refrigerator';box(4.05,.98,6.165,.65,.02,.015,'metal');
// Two bathrooms: shower, toilet, sink.
for(const z of [.85,2.35]){box(3.5,.85,z,.3,.13,.4,'white');box(4,.22,z+.35,.35,.4,.5,'white',true);box(4,.57,z+.12,.35,.55,.16,'white');box(3.52,1.33,z-.06,.29,.5,.03,0xa8c1b8);}
box(8.2,.45,.5,.58,.9,.65,'white',true);const drum=new THREE.Mesh(new THREE.CylinderGeometry(.21,.21,.025,28),new THREE.MeshStandardMaterial({color:0x7f9997}));drum.rotation.x=Math.PI/2;drum.position.set(8.2,.46,.84);scene.add(drum);
// Two outdoor condensers stacked against the balcony wall adjacent to the primary bedroom.
for(const [i,y] of [1.12,1.93].entries()){
 const unit=box(7.91,y,1.5,.46,.57,.78,'white',true);
 unit.name='outdoor-ac-'+(i+1);
 const fan=new THREE.Mesh(new THREE.CylinderGeometry(.205,.205,.025,32),new THREE.MeshStandardMaterial({color:0x52645e,roughness:.65}));
 fan.rotation.z=-Math.PI/2;fan.position.set(8.15,y,1.5);scene.add(fan);
 for(let spoke=0;spoke<4;spoke++){
  const grille=box(8.17,y,1.5,.025,.39,.013,'metal');grille.rotation.x=spoke*Math.PI/4;
 }
 box(7.73,y-.32,1.5,.4,.045,.85,'metal');
}
// Indoor heads face into the bedrooms from the corridor-side walls.
for(const [x,z,name,front] of [[4.44,1.1,'primary-indoor-ac',1],[3.11,1.1,'secondary-indoor-ac',-1]]){
 box(x,2.24,z,.22,.29,.9,'white').name=name;
 box(x+front*.116,2.15,z,.015,.055,.76,'metal');
 box(x+front*.12,2.26,z+.3,.016,.025,.045,'green');
}
function outlet(x,z,angle=0){const g=new THREE.Group();const plate=new THREE.Mesh(new THREE.BoxGeometry(.13,.19,.025),new THREE.MeshStandardMaterial({color:0xfcfaf0}));g.add(plate);for(let a of [-.028,.028]){const hole=new THREE.Mesh(new THREE.BoxGeometry(.012,.04,.028),new THREE.MeshBasicMaterial({color:0x416e5d}));hole.position.set(a,0,.005);g.add(hole);}g.position.set(x,.42,z);g.rotation.y=angle;electric.add(g);}
for(let x of [.4,2.8,4.7,7])outlet(x,.08);for(let x of [1.4,3.4,5,7])outlet(x,6.82,Math.PI);for(let z of [3.3,4.4,5.4])outlet(.08,z,Math.PI/2);outlet(7.48,3.3,-Math.PI/2);
label('單人臥室',1.65,2.43);label('主臥室 · 雙人床',5.8,2.43);label('客 廳',6,4.45);label('餐 廳',3.65,4.6);label('廚 房',1.6,4.25);label('陽 台',8.15,5.2);label('大 門',1.3,6.3);
let walking=false,yaw=0,pitch=0,drag=false,lastX=0,lastY=0;const keys=new Set();const start=new THREE.Vector3(1.15,1.62,6.15);let orbitAngle=.6,orbitElevation=.86;const target=new THREE.Vector3(4.3,0,3.45);
function overview(){walking=false;$('#modeLabel').textContent='空間總覽';$('#room').textContent='全屋總覽';$('#crosshair').style.display='none';$('#hint').textContent='拖曳旋轉模型 · 滾輪縮放 · 點擊按鈕進入漫遊';if(document.pointerLockElement)document.exitPointerLock();for(const w of walls){w.material.transparent=true;w.material.opacity=.48;} }
function enter(){walking=true;camera.position.copy(start);yaw=0;pitch=0;$('#modeLabel').textContent='室內漫遊';$('#crosshair').style.display='block';$('#hint').textContent='WASD / 方向鍵移動 · 拖曳滑鼠轉向 · 雙擊場景鎖定視線';for(const w of walls){w.material.transparent=false;w.material.opacity=1;}}
$('#enter').onclick=enter;$('#overview').onclick=overview;$('#reset').onclick=()=>walking?enter():(orbitAngle=.6,orbitElevation=.86,distance=14);$('#electric').onchange=e=>electric.visible=e.target.checked;
window.addEventListener('keydown',e=>{if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].includes(e.key))e.preventDefault();keys.add(e.key.toLowerCase());});window.addEventListener('keyup',e=>keys.delete(e.key.toLowerCase()));window.addEventListener('blur',()=>{keys.clear();drag=false;});
renderer.domElement.addEventListener('pointerdown',e=>{drag=true;lastX=e.clientX;lastY=e.clientY;renderer.domElement.setPointerCapture(e.pointerId);});window.addEventListener('pointerup',()=>drag=false);renderer.domElement.addEventListener('dblclick',()=>{if(walking)renderer.domElement.requestPointerLock?.();});
window.addEventListener('mousemove',e=>{if(!drag&&!document.pointerLockElement)return;const dx=document.pointerLockElement?e.movementX:e.clientX-lastX,dy=document.pointerLockElement?e.movementY:e.clientY-lastY;lastX=e.clientX;lastY=e.clientY;if(walking){yaw-=dx*.004;pitch=THREE.MathUtils.clamp(pitch-dy*.003,-1.15,1.15);}else{orbitAngle-=dx*.005;orbitElevation=THREE.MathUtils.clamp(orbitElevation+dy*.004,.35,1.45);}});
let distance=14;renderer.domElement.addEventListener('wheel',e=>{if(!walking)distance=THREE.MathUtils.clamp(distance+e.deltaY*.01,9,22);},{passive:true});
function blocked(x,z){if(x<.23||x>8.52||z<.23||z>6.67)return true;return collisions.some(c=>Math.abs(x-c.x)<c.w/2+.17&&Math.abs(z-c.z)<c.d/2+.17);}
const mc=$('#minimap').getContext('2d');function map(){mc.clearRect(0,0,220,200);mc.save();mc.translate(10,14);mc.scale(22,22);mc.fillStyle='#e7e8dc';mc.fillRect(0,0,8.75,6.9);mc.strokeStyle='#8c9c8a';mc.lineWidth=.06;for(const c of collisions){mc.fillStyle='#cbd1c1';mc.fillRect(c.x-c.w/2,c.z-c.d/2,c.w,c.d);}mc.strokeRect(0,0,8.75,6.9);if(walking){mc.translate(camera.position.x,camera.position.z);mc.rotate(-yaw);mc.fillStyle='#315c4f';mc.beginPath();mc.arc(0,0,.14,0,Math.PI*2);mc.fill();mc.beginPath();mc.moveTo(0,-.48);mc.lineTo(-.16,-.18);mc.lineTo(.16,-.18);mc.closePath();mc.fill();}mc.restore();}
const clock=new THREE.Clock();overview();function frame(){requestAnimationFrame(frame);const dt=Math.min(clock.getDelta(),.05);if(walking){let f=(keys.has('w')||keys.has('arrowup')?1:0)-(keys.has('s')||keys.has('arrowdown')?1:0),r=(keys.has('d')||keys.has('arrowright')?1:0)-(keys.has('a')||keys.has('arrowleft')?1:0);const len=Math.hypot(f,r)||1;f=f/len*dt*1.8;r=r/len*dt*1.8;const dx=-Math.sin(yaw)*f+Math.cos(yaw)*r,dz=-Math.cos(yaw)*f-Math.sin(yaw)*r;if(!blocked(camera.position.x+dx,camera.position.z))camera.position.x+=dx;if(!blocked(camera.position.x,camera.position.z+dz))camera.position.z+=dz;camera.rotation.order='YXZ';camera.rotation.set(pitch,yaw,0);const x=camera.position.x,z=camera.position.z;$('#room').textContent=x>7.55?'陽台':z<2.7?(x<3.25?'臥室':x>4.3?'主臥室':'衛浴空間'):x<2?(z>5.6?'大門 / 玄關':'廚房'):x>4.5?'客廳':'餐廳 / 走道';}else{camera.position.set(target.x+Math.sin(orbitAngle)*distance*Math.cos(orbitElevation),distance*Math.sin(orbitElevation),target.z+Math.cos(orbitAngle)*distance*Math.cos(orbitElevation));camera.lookAt(target);}map();renderer.render(scene,camera);}frame();window.addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);});
// Expose read-only runtime diagnostics for smoke testing.
window.spaceWalk={get walking(){return walking},get position(){return camera.position.toArray()},get meshes(){return scene.children.length}};
