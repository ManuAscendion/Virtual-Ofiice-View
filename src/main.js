import * as THREE from 'three';
import { buildOffice } from './office.js';
import { buildFurniture } from './furniture.js';
import { createAvatar } from './avatar.js';
import { drawMinimap } from './minimap.js';
import { initCharSelect } from './charSelect.js';
import { createDebugOverlay } from './debugOverlay.js';
import { FURNITURE, COLLISION_BOXES, ZONES, AVATAR_SPAWN, AVATAR_RADIUS } from './layout.js';

// ─── Scene Setup ─────────────────────────────────────────────────────────────
const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.1;
document.getElementById('app').prepend(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a1e2e);
scene.fog = new THREE.Fog(0x1a1e2e, 22, 50);

// ─── Camera ───────────────────────────────────────────────────────────────────
const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.05, 80);

// ─── Lighting ─────────────────────────────────────────────────────────────────
scene.add(new THREE.AmbientLight(0xfff8f0, 0.55));
const sunLight = new THREE.DirectionalLight(0xfff8e8, 0.3);
sunLight.position.set(5, 20, 5);
scene.add(sunLight);

// ─── Build World (always loaded, char-select renders on top) ────────────────
buildOffice(scene);
buildFurniture(scene, FURNITURE);
const debugOverlay = createDebugOverlay(scene);

// ─── Avatar (created/recreated after character selection) ──────────────────
let avatarHandle = null; // { group, animate, setColor, mats }
let currentGender = 'male';
let currentAppearance = null;

// ─── Player State ─────────────────────────────────────────────────────────────
const player = {
  x: AVATAR_SPAWN.x,
  z: AVATAR_SPAWN.z,
  yaw: AVATAR_SPAWN.ry,
  pitch: -0.15,
  speed: 5.5,
  height: 1.62,
  radius: AVATAR_RADIUS,
};

// ─── Input ────────────────────────────────────────────────────────────────────
const keys = {};
window.addEventListener('keydown', e => { keys[e.code] = true; });
window.addEventListener('keyup',   e => { keys[e.code] = false; });

// ─── Pointer Lock (mouse look) ────────────────────────────────────────────────
let isPointerLocked = false;
renderer.domElement.addEventListener('click', () => {
  if (sessionStarted) renderer.domElement.requestPointerLock();
});
document.addEventListener('pointerlockchange', () => {
  isPointerLocked = document.pointerLockElement === renderer.domElement;
});

document.addEventListener('mousemove', e => {
  if (!isPointerLocked) return;
  const sensitivity = 0.0018;
  player.yaw   -= e.movementX * sensitivity;
  player.pitch -= e.movementY * sensitivity;
  player.pitch  = Math.max(-0.5, Math.min(0.4, player.pitch));
});

// ─── Touch / Swipe look (mobile fallback) ─────────────────────────────────────
let lastTouch = null;
renderer.domElement.addEventListener('touchstart', e => {
  if (e.touches.length === 1) lastTouch = { x: e.touches[0].clientX, y: e.touches[0].clientY };
}, { passive: true });
renderer.domElement.addEventListener('touchmove', e => {
  if (!lastTouch || e.touches.length !== 1) return;
  const dx = e.touches[0].clientX - lastTouch.x;
  const dy = e.touches[0].clientY - lastTouch.y;
  player.yaw   -= dx * 0.003;
  player.pitch -= dy * 0.003;
  player.pitch  = Math.max(-0.5, Math.min(0.4, player.pitch));
  lastTouch = { x: e.touches[0].clientX, y: e.touches[0].clientY };
}, { passive: true });

// ─── Collision Detection ──────────────────────────────────────────────────────
function isColliding(nx, nz) {
  const r = player.radius;
  for (const box of COLLISION_BOXES) {
    if (nx + r > box.minX && nx - r < box.maxX &&
        nz + r > box.minZ && nz - r < box.maxZ) {
      return true;
    }
  }
  return false;
}

function tryMove(dx, dz) {
  const nx = player.x + dx;
  const nz = player.z + dz;
  if (!isColliding(nx, nz)) { player.x = nx; player.z = nz; return; }
  if (!isColliding(nx, player.z)) { player.x = nx; return; }
  if (!isColliding(player.x, nz)) { player.z = nz; return; }
}

// ─── Zone Detection ───────────────────────────────────────────────────────────
let currentZone = null;
const zoneEl   = document.getElementById('current-zone');
const roomCard = document.getElementById('room-card');
const cardIcon = document.getElementById('card-icon');
const cardName = document.getElementById('card-name');
const cardDesc = document.getElementById('card-desc');
let cardTimer  = null;

function detectZone() {
  for (const zone of ZONES) {
    if (player.x >= zone.x && player.x <= zone.x + zone.w &&
        player.z >= zone.z && player.z <= zone.z + zone.d) {
      if (zone.id !== currentZone) {
        currentZone = zone.id;
        zoneEl.textContent = zone.name;
        cardIcon.textContent = zone.icon;
        cardName.textContent = zone.name;
        cardDesc.textContent = zone.desc;
        roomCard.classList.add('visible');
        clearTimeout(cardTimer);
        cardTimer = setTimeout(() => roomCard.classList.remove('visible'), 3500);
      }
      return;
    }
  }
  if (currentZone !== 'hallway') {
    currentZone = 'hallway';
    zoneEl.textContent = 'Main Corridor';
  }
}

// ─── Minimap ──────────────────────────────────────────────────────────────────
const minimapCanvas = document.getElementById('minimap');
let minimapTimer = 0;

// ─── Third-person camera ──────────────────────────────────────────────────────
const THIRD_PERSON = { distance: 4.5, height: 2.8 };
let useThirdPerson = false;
window.addEventListener('keydown', e => {
  if (e.code === 'KeyV') useThirdPerson = !useThirdPerson;
  if (e.code === 'KeyB') {
    const isOn = debugOverlay.toggle();
    const indicator = document.getElementById('debug-indicator');
    if (indicator) indicator.style.display = isOn ? 'flex' : 'none';
  }
});

// ─── Clock ────────────────────────────────────────────────────────────────────
const clock = new THREE.Clock();
let sessionStarted = false;

// ─── Main Loop ────────────────────────────────────────────────────────────────
function animate() {
  requestAnimationFrame(animate);
  const delta = Math.min(clock.getDelta(), 0.05);

  if (!sessionStarted || !avatarHandle) {
    renderer.render(scene, camera);
    return;
  }

  const avatarGroup = avatarHandle.group;

  // === Movement ===
  let moveX = 0, moveZ = 0;
  const forward = -Math.sin(player.yaw);
  const right   = -Math.cos(player.yaw);
  const fwdZ    = -Math.cos(player.yaw);
  const rightZ  =  Math.sin(player.yaw);

  if (keys['KeyW'] || keys['ArrowUp'])    { moveX += forward; moveZ += fwdZ; }
  if (keys['KeyS'] || keys['ArrowDown'])  { moveX -= forward; moveZ -= fwdZ; }
  if (keys['KeyA'] || keys['ArrowLeft'])  { moveX += right;   moveZ += rightZ; }
  if (keys['KeyD'] || keys['ArrowRight']) { moveX -= right;   moveZ -= rightZ; }

  const isMoving = moveX !== 0 || moveZ !== 0;

  if (isMoving) {
    const len = Math.sqrt(moveX * moveX + moveZ * moveZ);
    tryMove((moveX / len) * player.speed * delta, (moveZ / len) * player.speed * delta);
  }

  // === Avatar position & facing ===
  avatarGroup.position.x = player.x;
  avatarGroup.position.z = player.z;
  if (isMoving) {
    const targetAngle = Math.atan2(moveX, moveZ);
    const diff = ((targetAngle - avatarGroup.rotation.y + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
    avatarGroup.rotation.y += diff * Math.min(1, delta * 12);
  }
  avatarHandle.animate(isMoving, delta);

  // === Camera ===
  if (useThirdPerson) {
    const camX = player.x + Math.sin(player.yaw) * THIRD_PERSON.distance;
    const camZ = player.z + Math.cos(player.yaw) * THIRD_PERSON.distance;
    camera.position.set(camX, THIRD_PERSON.height, camZ);
    camera.lookAt(player.x, 1.2, player.z);
    avatarGroup.visible = true;
  } else {
    camera.position.set(player.x, player.height, player.z);
    const lookTarget = new THREE.Vector3(
      player.x - Math.sin(player.yaw) * Math.cos(player.pitch),
      player.height + Math.sin(player.pitch),
      player.z - Math.cos(player.yaw) * Math.cos(player.pitch)
    );
    camera.lookAt(lookTarget);
    avatarGroup.visible = false;
  }

  detectZone();

  minimapTimer += delta;
  if (minimapTimer > 0.05) {
    minimapTimer = 0;
    drawMinimap(minimapCanvas, player.x, player.z, player.yaw);
  }

  renderer.render(scene, camera);
}

// ─── Resize ───────────────────────────────────────────────────────────────────
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// ─── Spawn / respawn avatar in main scene ─────────────────────────────────────
function spawnAvatar(gender, appearance) {
  if (avatarHandle) scene.remove(avatarHandle.group);
  avatarHandle = createAvatar(scene, gender, appearance);
  currentGender = gender;
  currentAppearance = appearance;
}

// ─── Character select wiring ──────────────────────────────────────────────────
const editBtn = document.getElementById('edit-avatar-btn');
const charSelectScreenEl = document.getElementById('char-select');

const charSelect = initCharSelect((gender, appearance, name) => {
  spawnAvatar(gender, appearance);
  // Reset spawn position each time we (re)enter
  player.x = AVATAR_SPAWN.x;
  player.z = AVATAR_SPAWN.z;
  player.yaw = AVATAR_SPAWN.ry;
  sessionStarted = true;
  editBtn.style.display = 'flex';
  if (name) {
    document.getElementById('current-zone').textContent = `${name} · Main Lobby`;
  }
});

editBtn.addEventListener('click', () => {
  sessionStarted = false;
  document.exitPointerLock?.();
  charSelectScreenEl.classList.remove('hidden');
});

// ─── Loading screen → reveal character select ─────────────────────────────────
setTimeout(() => {
  document.getElementById('loading').classList.add('done');
  setTimeout(() => document.getElementById('loading').remove(), 1000);
}, 1500);

// ─── Start render loop (idle until sessionStarted) ────────────────────────────
animate();