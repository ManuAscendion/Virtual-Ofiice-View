import * as THREE from 'three';

export function buildOffice(scene) {

  // ── FLOOR ──────────────────────────────────────────────────────────────────
  const floorMat = new THREE.MeshStandardMaterial({ color:0xf0ece4, roughness:0.85 });
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(62, 58), floorMat);
  floor.rotation.x = -Math.PI/2;
  floor.receiveShadow = true;
  scene.add(floor);

  // Tile grid lines
  const tileMat = new THREE.MeshStandardMaterial({ color:0xddd8d0, roughness:0.9 });
  for (let x = -30; x <= 30; x += 2) {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(0.04, 58), tileMat);
    m.rotation.x = -Math.PI/2; m.position.set(x, 0.001, 4); scene.add(m);
  }
  for (let z = -24; z <= 32; z += 2) {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(62, 0.04), tileMat);
    m.rotation.x = -Math.PI/2; m.position.set(0, 0.001, z); scene.add(m);
  }

  // ── CEILING ────────────────────────────────────────────────────────────────
  const ceil = new THREE.Mesh(
    new THREE.PlaneGeometry(62, 58),
    new THREE.MeshStandardMaterial({ color:0xfafaf8, roughness:0.95 })
  );
  ceil.rotation.x = Math.PI/2; ceil.position.set(0, 3.2, 4);
  scene.add(ceil);

  // ── OUTER WALLS ────────────────────────────────────────────────────────────
  const wallMat = new THREE.MeshStandardMaterial({ color:0xf0ece4, roughness:0.9 });
  const H = 3.2;
  [
    [62, [0,    H/2, -24.5], 0           ],  // North
    [62, [0,    H/2,  32.5], Math.PI     ],  // South
    [58, [-30.5,H/2,  4   ], Math.PI/2   ],  // West
    [58, [ 30.5,H/2,  4   ],-Math.PI/2   ],  // East
  ].forEach(([w, pos, ry]) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, H), wallMat);
    m.position.set(...pos); m.rotation.y = ry; m.receiveShadow = true;
    scene.add(m);
  });

  // ── GLASS PARTITION HELPER ─────────────────────────────────────────────────
  const glassMat = new THREE.MeshStandardMaterial({
    color:0x99ccdd, transparent:true, opacity:0.28,
    roughness:0.05, metalness:0.1, side:THREE.DoubleSide
  });
  const kneeMat  = new THREE.MeshStandardMaterial({ color:0xe4e0d8, roughness:0.8 });
  const frameMat = new THREE.MeshStandardMaterial({ color:0x888888, roughness:0.4, metalness:0.5 });

  // Draws a wall segment from (x1,z1) to (x2,z2) — matches collision lines exactly
  function partition(x1, z1, x2, z2) {
    const dx = x2-x1, dz = z2-z1;
    const len = Math.sqrt(dx*dx + dz*dz);
    if (len < 0.1) return;
    const angle = Math.atan2(dx, dz);
    const cx = (x1+x2)/2, cz = (z1+z2)/2;

    const knee = new THREE.Mesh(new THREE.BoxGeometry(len, 1.0, 0.12), kneeMat);
    knee.position.set(cx, 0.5, cz); knee.rotation.y = angle;
    scene.add(knee);

    const glass = new THREE.Mesh(new THREE.BoxGeometry(len, 2.1, 0.05), glassMat);
    glass.position.set(cx, 2.05, cz); glass.rotation.y = angle;
    scene.add(glass);

    const rail = new THREE.Mesh(new THREE.BoxGeometry(len, 0.06, 0.14), frameMat);
    rail.position.set(cx, 3.13, cz); rail.rotation.y = angle;
    scene.add(rail);
  }

  // ── INTERIOR PARTITIONS (matching collision boxes exactly) ─────────────────
  //
  // Z=-8 horizontal (hallway north boundary)
  // Help desk solid left, gap -22 to -20, lobby solid, open from -1 onwards
  partition(-30,  -8, -22,  -8);   // help desk south solid
  // door gap -22 to -20
  partition(-20,  -8,  -1,  -8);   // lobby+workspace south
  // open plan — no wall needed east of X=-1

  // Z=+2 horizontal (hallway south boundary)
  // boardroom door gap -25 to -23
  partition(-30,   2, -25,   2);   // boardroom north-left
  // door gap -25 to -23
  partition(-23,   2, -16,   2);   // boardroom north-right
  // pods door gap -14 to -12
  partition(-12,   2,  -2,   2);   // pods + start mtg-A
  // door gap -2 to 0
  partition(  0,   2,   6,   2);   // meeting A north-left
  // meeting A's own door gap 6 to 8
  partition(  8,   2,  16,   2);   // meeting A north-right
  // room divider at x=16 (no door here — A and B each get their own door)
  partition( 16,   2,  21,   2);   // meeting B north-left
  // meeting B's own door gap 21 to 23
  partition( 23,   2,  30,   2);   // meeting B north-right

  // North zone vertical dividers
  // Help desk/lobby divider at X=-18, door gap Z=-21 to -19
  partition(-18, -24, -18, -21);   // north
  partition(-18, -19, -18,  -8);   // south (stops at hallway wall)

  // Lobby/workspace divider at X=0, door gap Z=-20 to -18
  partition(  0, -24,   0, -20);   // north
  partition(  0, -18,   0,  -8);   // south

  // South zone vertical dividers — stop 0.3 short of walls to kill corner traps
  partition(-14, 2.3, -14, 17.7);  // boardroom/pods
  partition(  0, 2.3,   0, 17.7);  // pods/meeting-A
  partition( 16, 2.3,  16, 17.7);  // meeting-A/meeting-B

  // Z=+18 horizontal (south rooms bottom)
  // boardroom door gap -26 to -24
  partition(-30,  18, -26,  18);
  // door gap -26 to -24
  partition(-24,  18,  -2,  18);
  // door gap -2 to 0
  partition(  0,  18,  14,  18);
  // door gap 14 to 16
  partition( 16,  18,  30,  18);

  // Cafeteria/lounge divider at X=6, gap Z=24 to 26
  partition(  6,  18,   6,  24);   // north
  partition(  6,  26,   6,  32);   // south

  // ── CEILING LIGHTS ─────────────────────────────────────────────────────────
  const fixtureMat = new THREE.MeshStandardMaterial({
    color:0xffffff, emissive:0xfffde8, emissiveIntensity:0.7
  });
  [
    // hallway strip
    [-24,-2],[-12,-2],[0,-2],[12,-2],[24,-2],
    // north rooms
    [-24,-18],[-9,-18],[10,-18],[22,-18],
    // south rooms
    [-22,10],[-7,10],[8,10],[23,10],
    // cafe + lounge
    [-22,25],[-12,25],[-2,25],[16,25],[24,25],
  ].forEach(([x,z]) => {
    const fix = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.05, 0.55), fixtureMat);
    fix.position.set(x, 3.17, z); scene.add(fix);
    const pt = new THREE.PointLight(0xfff8e8, 1.4, 14, 1.4);
    pt.position.set(x, 3.0, z); scene.add(pt);
  });

  // Ambient
  scene.add(new THREE.AmbientLight(0xfff8f0, 0.6));
  const sun = new THREE.DirectionalLight(0xfff8e8, 0.2);
  sun.position.set(5, 20, 5); scene.add(sun);

  // ── ROOM SIGNS ─────────────────────────────────────────────────────────────
  [
    [-24, 3.0, -8.3, 'RECEPTION',  0x63b3ed],
    [-9,  3.0, -8.3, 'LOBBY',      0x68d391],
    [14,  3.0, -8.3, 'WORKSPACE',  0xf6e05e],
    [-22, 3.0,  2.1, 'BOARDROOM',  0xfc8181],
    [-7,  3.0,  2.1, 'PODS',       0x76e4f7],
    [8,   3.0,  2.1, 'MTG  A',     0xb794f4],
    [23,  3.0,  2.1, 'MTG  B',     0xfbd38d],
    [-14, 3.0, 18.1, 'CAFETERIA',  0xf687b3],
    [18,  3.0, 18.1, 'LOUNGE',     0x9ae6b4],
  ].forEach(([x,y,z,label,col]) => {
    const bg = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.22, 0.04),
      new THREE.MeshStandardMaterial({ color:0x10162a }));
    bg.position.set(x, y, z); scene.add(bg);
    const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.22, 0.05),
      new THREE.MeshStandardMaterial({ color:col, emissive:col, emissiveIntensity:0.35 }));
    stripe.position.set(x-0.76, y, z); scene.add(stripe);
  });

  // ── AREA RUGS ──────────────────────────────────────────────────────────────
  [
    [-10,-18, 6, 4, 0x4a6fa5],
    [-22, 10, 6, 4, 0x8b3a3a],
    [16,  24, 12,8, 0x4a7a5a],
  ].forEach(([x,z,w,d,col]) => {
    const rug = new THREE.Mesh(new THREE.PlaneGeometry(w,d),
      new THREE.MeshStandardMaterial({ color:col, roughness:0.99, transparent:true, opacity:0.38 }));
    rug.rotation.x = -Math.PI/2; rug.position.set(x, 0.003, z); scene.add(rug);
  });
}