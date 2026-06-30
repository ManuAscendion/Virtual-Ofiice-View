import * as THREE from 'three';

// ─── Default appearance presets ────────────────────────────────────────────
export const PRESETS = {
  male: {
    gender: 'male',
    skin:  '#f4c48a',
    hair:  '#2d1b00',
    shirt: '#3b82f6',
    pants: '#1e293b',
    shoes: '#1a1a2e',
  },
  female: {
    gender: 'female',
    skin:  '#f6cba0',
    hair:  '#4a2511',
    shirt: '#d6336c',
    pants: '#2b2438',
    shoes: '#1a1a2e',
  },
};

export const SKIN_TONES   = ['#f4c48a', '#f6cba0', '#e8a96f', '#c98a55', '#8d5a34', '#5c3a22'];
export const HAIR_COLORS  = ['#2d1b00', '#4a2511', '#1a1a1a', '#6b4423', '#a85d2a', '#d4d4d4', '#8b1a1a'];
export const SHIRT_COLORS = ['#3b82f6', '#d6336c', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#0891b2', '#1e293b'];
export const PANTS_COLORS = ['#1e293b', '#2b2438', '#374151', '#44403c', '#1c1917', '#0c4a6e'];

// ─── Build a fresh avatar mesh group for a given gender ────────────────────
function buildBody(gender) {
  const group = new THREE.Group();
  const isFemale = gender === 'female';

  // Materials — created per-avatar so colors can be changed independently
  const mats = {
    skin:  new THREE.MeshLambertMaterial({ color: 0xf4c48a }),
    hair:  new THREE.MeshLambertMaterial({ color: 0x2d1b00 }),
    shirt: new THREE.MeshLambertMaterial({ color: 0x3b82f6 }),
    pants: new THREE.MeshLambertMaterial({ color: 0x1e293b }),
    shoes: new THREE.MeshLambertMaterial({ color: 0x1a1a2e }),
    eye:   new THREE.MeshLambertMaterial({ color: 0x1a1a2e }),
  };

  // Body proportions differ slightly by gender
  const torsoW   = isFemale ? 0.44 : 0.5;
  const torsoH   = isFemale ? 0.62 : 0.65;
  const shoulderX= isFemale ? 0.27 : 0.31;
  const hipW     = isFemale ? 0.42 : 0.48;
  const headSize = isFemale ? 0.32 : 0.34;

  // Torso
  const torso = new THREE.Mesh(new THREE.BoxGeometry(torsoW, torsoH, 0.27), mats.shirt);
  torso.position.y = 1.1;
  torso.castShadow = true;
  group.add(torso);

  // Head
  const head = new THREE.Mesh(new THREE.BoxGeometry(headSize, headSize, 0.31), mats.skin);
  head.position.y = 1.62;
  head.castShadow = true;
  group.add(head);

  // Hair — shape differs by gender
  let hair;
  if (isFemale) {
    // Longer hair: a back panel hanging past shoulders + top cap
    const hairGroup = new THREE.Group();
    const topCap = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.12, 0.32), mats.hair);
    topCap.position.y = 1.83;
    const backPanel = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.42, 0.1), mats.hair);
    backPanel.position.set(0, 1.55, -0.18);
    const sideL = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.34, 0.3), mats.hair);
    sideL.position.set(0.18, 1.55, 0);
    const sideR = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.34, 0.3), mats.hair);
    sideR.position.set(-0.18, 1.55, 0);
    hairGroup.add(topCap, backPanel, sideL, sideR);
    hair = hairGroup;
  } else {
    hair = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.12, 0.33), mats.hair);
    hair.position.y = 1.83;
  }
  group.add(hair);

  // Neck
  const neck = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 0.12), mats.skin);
  neck.position.y = 1.46;
  group.add(neck);

  // Eyes
  const eyeGeo = new THREE.BoxGeometry(0.06, 0.05, 0.02);
  const leftEye = new THREE.Mesh(eyeGeo, mats.eye);
  leftEye.position.set(0.09, 1.63, 0.16);
  group.add(leftEye);
  const rightEye = new THREE.Mesh(eyeGeo, mats.eye);
  rightEye.position.set(-0.09, 1.63, 0.16);
  group.add(rightEye);

  // Pelvis
  const pelvis = new THREE.Mesh(new THREE.BoxGeometry(hipW, 0.2, 0.26), mats.pants);
  pelvis.position.y = 0.78;
  group.add(pelvis);

  // === ARMS ===
  function buildArm(side) {
    const armGroup = new THREE.Group();
    armGroup.position.set(side * shoulderX, 1.35, 0);
    const upper = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.32, 0.13), mats.shirt);
    upper.position.y = -0.16;
    upper.castShadow = true;
    const lower = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.28, 0.11), mats.skin);
    lower.position.y = -0.46;
    lower.castShadow = true;
    armGroup.add(upper, lower);
    return armGroup;
  }
  const leftArmGroup  = buildArm(1);
  const rightArmGroup = buildArm(-1);
  group.add(leftArmGroup, rightArmGroup);

  // === LEGS ===
  function buildLeg(side) {
    const legGroup = new THREE.Group();
    legGroup.position.set(side * 0.13, 0.68, 0);
    const upper = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.38, 0.17), mats.pants);
    upper.position.y = -0.19;
    upper.castShadow = true;
    const lower = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.36, 0.15), mats.pants);
    lower.position.y = -0.52;
    lower.castShadow = true;
    const foot = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.1, 0.21), mats.shoes);
    foot.position.set(0, -0.73, 0.03);
    legGroup.add(upper, lower, foot);
    return legGroup;
  }
  const leftLegGroup  = buildLeg(1);
  const rightLegGroup = buildLeg(-1);
  group.add(leftLegGroup, rightLegGroup);

  // Shadow blob
  const shadowBlob = new THREE.Mesh(
    new THREE.CircleGeometry(0.35, 16),
    new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.18, depthWrite: false })
  );
  shadowBlob.rotation.x = -Math.PI / 2;
  shadowBlob.position.y = 0.01;
  group.add(shadowBlob);

  return { group, mats, parts: { leftArmGroup, rightArmGroup, leftLegGroup, rightLegGroup } };
}

// ─── Public API ──────────────────────────────────────────────────────────────
export function createAvatar(scene, gender = 'male', appearance = null) {
  const preset = appearance || PRESETS[gender] || PRESETS.male;
  const { group, mats, parts } = buildBody(preset.gender || gender);

  applyAppearance(mats, preset);

  scene.add(group);

  let walkTime = 0;
  function animate(isMoving, delta) {
    if (isMoving) {
      walkTime += delta * 8;
    } else {
      walkTime *= 0.85;
      if (Math.abs(walkTime) < 0.01) walkTime = 0;
    }
    const swing = Math.sin(walkTime) * 0.5;
    parts.leftArmGroup.rotation.x  = -swing;
    parts.rightArmGroup.rotation.x =  swing;
    parts.leftLegGroup.rotation.x  =  swing;
    parts.rightLegGroup.rotation.x = -swing;
    group.position.y = isMoving ? Math.abs(Math.sin(walkTime)) * 0.03 : 0;
  }

  function setColor(part, hexString) {
    if (mats[part]) mats[part].color.set(hexString);
  }

  function rebuild(newGender, newAppearance) {
    // Remove old group, build fresh one with new body shape
    scene.remove(group);
    const next = createAvatar(scene, newGender, newAppearance);
    return next;
  }

  return { group, animate, setColor, mats, rebuild };
}

function applyAppearance(mats, appearance) {
  if (appearance.skin)  mats.skin.color.set(appearance.skin);
  if (appearance.hair)  mats.hair.color.set(appearance.hair);
  if (appearance.shirt) mats.shirt.color.set(appearance.shirt);
  if (appearance.pants) mats.pants.color.set(appearance.pants);
  if (appearance.shoes) mats.shoes.color.set(appearance.shoes);
}