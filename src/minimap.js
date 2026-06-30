import { ZONES } from './layout.js';

const MAP_W = 180, MAP_H = 180, PAD = 8;
// Office: X[-30..30], Z[-24..32] → total 60 x 56
const WORLD_X0 = -30, WORLD_Z0 = -24;
const WORLD_W  =  60, WORLD_D  =  56;

function toCanvas(wx, wz) {
  const cx = ((wx - WORLD_X0) / WORLD_W) * (MAP_W - PAD*2) + PAD;
  const cy = ((wz - WORLD_Z0) / WORLD_D) * (MAP_H - PAD*2) + PAD;
  return [cx, cy];
}

export function drawMinimap(canvas, playerX, playerZ, playerAngle) {
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, MAP_W, MAP_H);

  // Background
  ctx.fillStyle = '#0d1117';
  ctx.beginPath(); ctx.roundRect(0, 0, MAP_W, MAP_H, 8); ctx.fill();

  // Grid
  ctx.strokeStyle = 'rgba(255,255,255,0.04)'; ctx.lineWidth = 0.5;
  for (let x = -30; x <= 30; x += 10) {
    const [cx] = toCanvas(x, 0);
    ctx.beginPath(); ctx.moveTo(cx, PAD); ctx.lineTo(cx, MAP_H-PAD); ctx.stroke();
  }
  for (let z = -24; z <= 32; z += 10) {
    const [, cy] = toCanvas(0, z);
    ctx.beginPath(); ctx.moveTo(PAD, cy); ctx.lineTo(MAP_W-PAD, cy); ctx.stroke();
  }

  // Zones
  ZONES.forEach(zone => {
    const [x1, y1] = toCanvas(zone.x, zone.z);
    const [x2, y2] = toCanvas(zone.x + zone.w, zone.z + zone.d);
    const w = x2-x1, h = y2-y1;

    ctx.fillStyle   = zone.color + '25';
    ctx.strokeStyle = zone.color + '70';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.roundRect(x1, y1, w, h, 2); ctx.fill(); ctx.stroke();

    ctx.fillStyle = zone.color + 'bb';
    ctx.font = '5px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText(zone.name.split(' ')[0].toUpperCase(), x1 + w/2, y1 + h/2 + 2);
  });

  // Player
  const [px, py] = toCanvas(playerX, playerZ);

  // View cone
  ctx.save();
  ctx.translate(px, py);
  ctx.rotate(playerAngle + Math.PI);
  ctx.beginPath();
  ctx.moveTo(0, 0); ctx.lineTo(-5, -14); ctx.lineTo(5, -14); ctx.closePath();
  ctx.fillStyle = 'rgba(99,179,237,0.3)'; ctx.fill();
  ctx.restore();

  // Dot
  ctx.beginPath(); ctx.arc(px, py, 4.5, 0, Math.PI*2);
  ctx.fillStyle = '#63b3ed'; ctx.fill();
  ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.5; ctx.stroke();
}