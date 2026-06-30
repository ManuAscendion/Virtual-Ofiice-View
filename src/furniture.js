import * as THREE from 'three';

// Shared material cache
const matCache = {};
function mat(hex, rough = 0.7, metal = 0) {
  const key = `${hex}-${rough}-${metal}`;
  if (!matCache[key]) {
    matCache[key] = new THREE.MeshStandardMaterial({ color: hex, roughness: rough, metalness: metal });
  }
  return matCache[key];
}

function box(w, h, d, material) {
  const geo = new THREE.BoxGeometry(w, h, d);
  return new THREE.Mesh(geo, material);
}

function cylinder(r, h, material, segs = 12) {
  const geo = new THREE.CylinderGeometry(r, r, h, segs);
  return new THREE.Mesh(geo, material);
}

// ---- Individual furniture builders ----

function makeDesk() {
  const g = new THREE.Group();
  // Tabletop
  const top = box(1.6, 0.06, 0.8, mat(0xe8e0d0, 0.4));
  top.position.y = 0.74;
  // Legs
  const legMat = mat(0xc0b8a8, 0.5);
  for (let x of [-0.72, 0.72]) for (let z of [-0.34, 0.34]) {
    const leg = box(0.06, 0.74, 0.06, legMat);
    leg.position.set(x, 0.37, z);
    g.add(leg);
  }
  // Monitor
  const screen = box(0.5, 0.32, 0.03, mat(0x1a1a2e, 0.3, 0.2));
  screen.position.set(0, 1.0, -0.28);
  const screenGlow = box(0.46, 0.28, 0.01, mat(0x1e3a5f, 0.1));
  screenGlow.position.set(0, 1.0, -0.27);
  const stand = box(0.04, 0.18, 0.04, mat(0x888, 0.4, 0.5));
  stand.position.set(0, 0.86, -0.28);
  // Keyboard
  const kb = box(0.35, 0.02, 0.15, mat(0xd0ccc0, 0.6));
  kb.position.set(0, 0.77, 0.1);
  // Mouse
  const mouse = box(0.07, 0.025, 0.1, mat(0xd0ccc0, 0.5));
  mouse.position.set(0.26, 0.77, 0.1);
  g.add(top, screen, screenGlow, stand, kb, mouse);
  return g;
}

function makeChair() {
  const g = new THREE.Group();
  const seatMat = mat(0x2d4a6e, 0.8);
  const frameMat = mat(0x555, 0.4, 0.6);
  // Seat
  const seat = box(0.5, 0.06, 0.5, seatMat);
  seat.position.y = 0.46;
  // Back
  const back = box(0.5, 0.5, 0.06, seatMat);
  back.position.set(0, 0.73, -0.22);
  // 5-star base
  for (let i = 0; i < 5; i++) {
    const arm = box(0.38, 0.03, 0.06, frameMat);
    arm.position.y = 0.06;
    arm.rotation.y = (i / 5) * Math.PI * 2;
    g.add(arm);
  }
  const pole = cylinder(0.03, 0.42, frameMat);
  pole.position.y = 0.23;
  g.add(seat, back, pole);
  return g;
}

function makeSofa() {
  const g = new THREE.Group();
  const fabricMat = mat(0x8b7355, 0.9);
  const darkMat = mat(0x5a4a35, 0.9);
  // Base
  const base = box(0.9, 0.3, 0.8, fabricMat);
  base.position.y = 0.18;
  // Back
  const back = box(0.9, 0.5, 0.16, fabricMat);
  back.position.set(0, 0.52, -0.32);
  // Armrests
  const armL = box(0.12, 0.32, 0.8, darkMat);
  armL.position.set(0.51, 0.36, 0);
  const armR = box(0.12, 0.32, 0.8, darkMat);
  armR.position.set(-0.51, 0.36, 0);
  // Cushions
  for (let x of [-0.2, 0.2]) {
    const cushion = box(0.38, 0.14, 0.52, mat(0x9b8365, 0.95));
    cushion.position.set(x, 0.37, 0.02);
    g.add(cushion);
  }
  // Legs
  const legMat = mat(0x3a2a1a, 0.6);
  for (let x of [-0.38, 0.38]) for (let z of [-0.34, 0.34]) {
    const leg = box(0.08, 0.1, 0.08, legMat);
    leg.position.set(x, 0.05, z);
    g.add(leg);
  }
  g.add(base, back, armL, armR);
  return g;
}

function makeCoffeeTable() {
  const g = new THREE.Group();
  const top = box(0.8, 0.05, 0.5, mat(0xd4c5a0, 0.4));
  top.position.y = 0.38;
  const legMat = mat(0x5a4a2a, 0.5, 0.1);
  for (let x of [-0.34, 0.34]) for (let z of [-0.19, 0.19]) {
    const leg = box(0.05, 0.38, 0.05, legMat);
    leg.position.set(x, 0.19, z);
    g.add(leg);
  }
  g.add(top);
  return g;
}

function makePlant() {
  const g = new THREE.Group();
  // Pot
  const pot = new THREE.Mesh(
    new THREE.CylinderGeometry(0.14, 0.1, 0.24, 8),
    mat(0xc06030, 0.8)
  );
  pot.position.y = 0.12;
  // Soil
  const soil = new THREE.Mesh(new THREE.CircleGeometry(0.13, 8), mat(0x3a2800, 0.9));
  soil.rotation.x = -Math.PI / 2;
  soil.position.y = 0.24;
  // Stem
  const stem = cylinder(0.025, 0.4, mat(0x2d5a1e, 0.8), 6);
  stem.position.y = 0.44;
  // Leaves — several spheres
  const leafMat = mat(0x2d7a1e, 0.9);
  const leafPositions = [
    [0, 0.72, 0], [0.14, 0.65, 0], [-0.14, 0.65, 0],
    [0, 0.65, 0.14], [0, 0.65, -0.14],
    [0.1, 0.78, 0.1], [-0.1, 0.78, -0.1],
  ];
  leafPositions.forEach(([x, y, z]) => {
    const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.1, 6, 5), leafMat);
    leaf.position.set(x, y, z);
    leaf.scale.set(1, 0.8 + Math.random() * 0.4, 1);
    g.add(leaf);
  });
  g.add(pot, soil, stem);
  return g;
}

function makeBoardTable() {
  const g = new THREE.Group();
  const top = box(7.0, 0.08, 2.0, mat(0x8b6914, 0.3, 0.1));
  top.position.y = 0.76;
  // Edge trim
  const trim = box(7.06, 0.04, 2.06, mat(0x6b5010, 0.5, 0.3));
  trim.position.y = 0.72;
  // Pedestal legs
  for (let x of [-2.5, 0, 2.5]) {
    const ped = box(0.3, 0.72, 0.8, mat(0x6b5010, 0.5, 0.1));
    ped.position.set(x, 0.36, 0);
    g.add(ped);
  }
  g.add(top, trim);
  return g;
}

function makeMeetingTable() {
  const g = new THREE.Group();
  const top = new THREE.Mesh(
    new THREE.CylinderGeometry(1.3, 1.3, 0.07, 32),
    mat(0x7ab8c0, 0.3, 0.1)
  );
  top.position.y = 0.76;
  const trim = new THREE.Mesh(
    new THREE.CylinderGeometry(1.32, 1.32, 0.03, 32),
    mat(0x4a8890, 0.5, 0.3)
  );
  trim.position.y = 0.745;
  const pedestal = cylinder(0.12, 0.72, mat(0x444, 0.4, 0.5));
  pedestal.position.y = 0.36;
  const base = new THREE.Mesh(
    new THREE.CylinderGeometry(0.5, 0.5, 0.05, 16),
    mat(0x333, 0.4, 0.5)
  );
  base.position.y = 0.025;
  g.add(top, trim, pedestal, base);
  return g;
}

function makeScreen() {
  const g = new THREE.Group();
  const frame = box(0.06, 1.4, 2.2, mat(0x1a1a2e, 0.3, 0.4));
  frame.position.y = 0.9;
  const screenFace = box(0.01, 1.2, 2.0, mat(0x0a1a3a, 0.1));
  screenFace.position.set(0.035, 0.9, 0);
  // Screen content lines (decorative)
  const lineMat = mat(0x1e5a8a, 0.1);
  for (let i = 0; i < 4; i++) {
    const line = box(0.005, 0.04, 1.5, lineMat);
    line.position.set(0.04, 0.5 + i * 0.3, 0);
    g.add(line);
  }
  const stand = box(0.06, 0.06, 0.5, mat(0x555, 0.4, 0.5));
  stand.position.y = 0.03;
  g.add(frame, screenFace, stand);
  return g;
}

function makeWhiteboard() {
  const g = new THREE.Group();
  const board = box(0.06, 1.2, 2.2, mat(0xf5f5f5, 0.95));
  board.position.y = 1.2;
  const frame = box(0.05, 1.26, 2.26, mat(0x888, 0.4, 0.5));
  frame.position.y = 1.2;
  // Tray
  const tray = box(0.08, 0.08, 2.0, mat(0x888, 0.4, 0.3));
  tray.position.set(0, 0.64, 0);
  // Some marker lines on board
  const lineMat = mat(0x3b82f6, 0.2);
  const line1 = box(0.01, 0.02, 1.4, lineMat);
  line1.position.set(0.04, 1.3, 0);
  const line2 = box(0.01, 0.02, 0.8, lineMat);
  line2.position.set(0.04, 1.1, -0.2);
  g.add(board, frame, tray, line1, line2);
  return g;
}

function makePod() {
  const g = new THREE.Group();
  // Pod enclosure - 3 walls + open front
  const wallMat = mat(0x4a6fa5, 0.6, 0.0);
  const glassMat = new THREE.MeshStandardMaterial({
    color: 0x88bbdd, transparent: true, opacity: 0.35, roughness: 0.1
  });
  // Back wall
  const back = box(1.6, 2.0, 0.1, wallMat);
  back.position.set(0, 1.0, -0.75);
  // Left wall
  const left = box(0.1, 2.0, 1.5, glassMat);
  left.position.set(-0.75, 1.0, 0);
  // Right wall
  const right = box(0.1, 2.0, 1.5, glassMat);
  right.position.set(0.75, 1.0, 0);
  // Ceiling
  const ceil = box(1.6, 0.1, 1.6, wallMat);
  ceil.position.y = 2.0;
  // Seat inside
  const seatMat = mat(0x2d4a6e, 0.8);
  const seat = box(0.9, 0.06, 0.5, seatMat);
  seat.position.set(0, 0.44, -0.3);
  const seatBack = box(0.9, 0.5, 0.06, seatMat);
  seatBack.position.set(0, 0.72, -0.54);
  // Small table
  const pdTable = box(0.5, 0.04, 0.3, mat(0xe8e0d0, 0.4));
  pdTable.position.set(0, 0.72, 0.1);
  g.add(back, left, right, ceil, seat, seatBack, pdTable);
  return g;
}

function makeCounter() {
  const g = new THREE.Group();
  const base = box(2.0, 0.96, 0.6, mat(0xe8e0d0, 0.5));
  base.position.y = 0.48;
  const top = box(2.1, 0.05, 0.65, mat(0xc0b8a8, 0.3, 0.1));
  top.position.y = 0.965;
  // Front panel detail
  const panel = box(2.0, 0.3, 0.04, mat(0xd4c8b0, 0.6));
  panel.position.set(0, 0.55, 0.3);
  // Computer on counter
  const monitor = box(0.4, 0.28, 0.03, mat(0x1a1a2e, 0.3, 0.2));
  monitor.position.set(-0.5, 1.23, -0.1);
  const monitorGlow = box(0.36, 0.24, 0.01, mat(0x1e3a5f, 0.1));
  monitorGlow.position.set(-0.5, 1.23, -0.09);
  g.add(base, top, panel, monitor, monitorGlow);
  return g;
}

function makeCoffeMachine() {
  const g = new THREE.Group();
  const body = box(0.3, 0.6, 0.3, mat(0x222, 0.3, 0.4));
  body.position.y = 0.97;
  const top_ = box(0.32, 0.05, 0.32, mat(0x444, 0.4, 0.5));
  top_.position.y = 1.295;
  const nozzle = cylinder(0.025, 0.1, mat(0x888, 0.3, 0.7), 8);
  nozzle.position.set(0.06, 0.88, 0.1);
  const cup = new THREE.Mesh(
    new THREE.CylinderGeometry(0.05, 0.04, 0.1, 8),
    mat(0xffffff, 0.8)
  );
  cup.position.set(0.06, 0.73, 0.1);
  const btn1 = cylinder(0.025, 0.02, mat(0xe53e3e, 0.5), 8);
  btn1.rotation.x = Math.PI / 2;
  btn1.position.set(-0.06, 1.08, 0.155);
  const btn2 = cylinder(0.025, 0.02, mat(0x38a169, 0.5), 8);
  btn2.rotation.x = Math.PI / 2;
  btn2.position.set(0.06, 1.08, 0.155);
  g.add(body, top_, nozzle, cup, btn1, btn2);
  return g;
}

function makeCafeTable() {
  const g = new THREE.Group();
  const top = new THREE.Mesh(
    new THREE.CylinderGeometry(0.4, 0.4, 0.05, 16),
    mat(0xf0e8d0, 0.4)
  );
  top.position.y = 0.74;
  const pedestal = cylinder(0.04, 0.72, mat(0x888, 0.4, 0.5), 8);
  pedestal.position.y = 0.36;
  const base = new THREE.Mesh(
    new THREE.CylinderGeometry(0.25, 0.25, 0.03, 12),
    mat(0x666, 0.4, 0.5)
  );
  base.position.y = 0.015;
  g.add(top, pedestal, base);
  return g;
}

// ---- Main builder ----
export function buildFurniture(scene, items) {
  const builders = {
    desk: makeDesk,
    chair: makeChair,
    sofa: makeSofa,
    coffee_table: makeCoffeeTable,
    plant: makePlant,
    board_table: makeBoardTable,
    meeting_table: makeMeetingTable,
    screen: makeScreen,
    whiteboard: makeWhiteboard,
    pod: makePod,
    counter: makeCounter,
    coffee_machine: makeCoffeMachine,
    cafe_table: makeCafeTable,
  };

  items.forEach(item => {
    const builder = builders[item.type];
    if (!builder) return;
    const mesh = builder();
    mesh.position.set(item.x, 0, item.z);
    if (item.ry !== undefined) mesh.rotation.y = item.ry;
    mesh.traverse(child => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    scene.add(mesh);
  });
}