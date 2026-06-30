import * as THREE from 'three';
import { COLLISION_BOXES, ZONES } from './layout.js';

// Renders every collision box as a translucent red rectangle directly on the
// floor, plus zone boundaries in cyan outline, so misalignments between the
// visual walls and the actual collision geometry are immediately visible.
//
// Toggle with the 'B' key (wired in main.js).
export function createDebugOverlay(scene) {
  const group = new THREE.Group();
  group.visible = false;

  const wallMat = new THREE.MeshBasicMaterial({
    color: 0xff3333, transparent: true, opacity: 0.45, depthWrite: false,
  });
  const wallEdgeMat = new THREE.LineBasicMaterial({ color: 0xff0000 });

  COLLISION_BOXES.forEach(box => {
    const w = box.maxX - box.minX;
    const d = box.maxZ - box.minZ;
    const cx = (box.minX + box.maxX) / 2;
    const cz = (box.minZ + box.maxZ) / 2;

    const plane = new THREE.Mesh(new THREE.PlaneGeometry(w, d), wallMat);
    plane.rotation.x = -Math.PI / 2;
    plane.position.set(cx, 0.05, cz);
    group.add(plane);

    // Outline so thin walls are still visible even at low opacity
    const edges = new THREE.EdgesGeometry(new THREE.PlaneGeometry(w, d));
    const outline = new THREE.LineSegments(edges, wallEdgeMat);
    outline.rotation.x = -Math.PI / 2;
    outline.position.set(cx, 0.06, cz);
    group.add(outline);
  });

  // Zone boundaries in cyan — helps confirm room-detection rectangles line up
  // with the physical rooms too (separate bug class from wall collision).
  const zoneMat = new THREE.LineBasicMaterial({ color: 0x00ffff });
  ZONES.forEach(zone => {
    const w = zone.w, d = zone.d;
    const cx = zone.x + w / 2;
    const cz = zone.z + d / 2;
    const edges = new THREE.EdgesGeometry(new THREE.PlaneGeometry(w, d));
    const outline = new THREE.LineSegments(edges, zoneMat);
    outline.rotation.x = -Math.PI / 2;
    outline.position.set(cx, 0.08, cz);
    group.add(outline);
  });

  scene.add(group);

  function toggle() {
    group.visible = !group.visible;
    return group.visible;
  }

  return { group, toggle };
}