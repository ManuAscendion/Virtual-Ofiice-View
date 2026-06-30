// Office Layout Definition
// World: X from -30 to +30, Z from -24 to +32
// Avatar radius = 0.25 → door gaps must be at least 0.6 wide (comfortable = 1.5+)

export const OFFICE_WIDTH = 60;
export const OFFICE_DEPTH = 56;

// ─── ZONES ────────────────────────────────────────────────────────────────────
export const ZONES = [
  { id:'help_desk',      name:'Help Desk',      icon:'🎧', desc:'IT support and visitor check-in. Get your badge and equipment here.',          color:'#68d391', x:-30, z:-24, w:12, d:16 },
  { id:'lobby',          name:'Main Lobby',      icon:'🏢', desc:'Welcome to the office. Reception and waiting area for visitors.',              color:'#63b3ed', x:-18, z:-24, w:18, d:16 },
  { id:'open_workspace', name:'Open Workspace',  icon:'💻', desc:'Collaborative open-plan desks for the team. Hot-desking is welcome.',         color:'#f6e05e', x:0,   z:-24, w:30, d:16 },
  { id:'hallway_main',   name:'Main Corridor',   icon:'🚶', desc:'The central hallway connecting all areas of the office.',                     color:'#a0aec0', x:-30, z:-8,  w:60, d:10 },
  { id:'boardroom',      name:'Boardroom',        icon:'📊', desc:'Executive meeting space with presentation equipment. Seats 12.',              color:'#fc8181', x:-30, z:2,   w:16, d:16 },
  { id:'meeting_pods',   name:'Meeting Pods',     icon:'🫧', desc:'Acoustic booths for private calls or quick 1-on-1 meetings.',                color:'#76e4f7', x:-14, z:2,   w:14, d:16 },
  { id:'meeting_a',      name:'Meeting Room A',   icon:'🤝', desc:'Collaborative meeting room. Seats 6. Whiteboard available.',                 color:'#b794f4', x:0,   z:2,   w:16, d:16 },
  { id:'meeting_b',      name:'Meeting Room B',   icon:'📋', desc:'Focused meeting room. Seats 4. Great for small team syncs.',                 color:'#fbd38d', x:16,  z:2,   w:14, d:16 },
  { id:'cafeteria',      name:'Cafeteria',        icon:'☕', desc:'Fully stocked kitchen and dining area. Grab a coffee or lunch.',             color:'#f687b3', x:-30, z:18,  w:36, d:14 },
  { id:'lounge',         name:'Lounge',           icon:'🛋️', desc:'Casual sitting area with sofas. Great for informal chats.',                  color:'#9ae6b4', x:6,   z:18,  w:24, d:14 },
];

// ─── FURNITURE ────────────────────────────────────────────────────────────────
export const FURNITURE = [
  // HELP DESK
  { type:'counter', x:-24, z:-18, ry:0 },
  { type:'chair',   x:-24, z:-16, ry:Math.PI },
  { type:'plant',   x:-28, z:-22 },
  { type:'plant',   x:-20, z:-22 },

  // LOBBY
  { type:'sofa',         x:-14, z:-21, ry:0 },
  { type:'sofa',         x:-10, z:-21, ry:0 },
  { type:'coffee_table', x:-12, z:-18 },
  { type:'plant',        x:-18.5, z:-22 },
  { type:'plant',        x:-1,    z:-22 },

  // OPEN WORKSPACE — 3 rows × 5 desks
  { type:'desk', x:3,  z:-21, ry:0 },         { type:'chair', x:3,  z:-19.5, ry:Math.PI },
  { type:'desk', x:7,  z:-21, ry:0 },         { type:'chair', x:7,  z:-19.5, ry:Math.PI },
  { type:'desk', x:11, z:-21, ry:0 },         { type:'chair', x:11, z:-19.5, ry:Math.PI },
  { type:'desk', x:15, z:-21, ry:0 },         { type:'chair', x:15, z:-19.5, ry:Math.PI },
  { type:'desk', x:19, z:-21, ry:0 },         { type:'chair', x:19, z:-19.5, ry:Math.PI },
  { type:'desk', x:3,  z:-16, ry:Math.PI },   { type:'chair', x:3,  z:-17.5, ry:0 },
  { type:'desk', x:7,  z:-16, ry:Math.PI },   { type:'chair', x:7,  z:-17.5, ry:0 },
  { type:'desk', x:11, z:-16, ry:Math.PI },   { type:'chair', x:11, z:-17.5, ry:0 },
  { type:'desk', x:15, z:-16, ry:Math.PI },   { type:'chair', x:15, z:-17.5, ry:0 },
  { type:'desk', x:19, z:-16, ry:Math.PI },   { type:'chair', x:19, z:-17.5, ry:0 },
  { type:'desk', x:3,  z:-11, ry:0 },         { type:'chair', x:3,  z:-9.5,  ry:Math.PI },
  { type:'desk', x:7,  z:-11, ry:0 },         { type:'chair', x:7,  z:-9.5,  ry:Math.PI },
  { type:'desk', x:11, z:-11, ry:0 },         { type:'chair', x:11, z:-9.5,  ry:Math.PI },
  { type:'desk', x:15, z:-11, ry:0 },         { type:'chair', x:15, z:-9.5,  ry:Math.PI },
  { type:'desk', x:19, z:-11, ry:0 },         { type:'chair', x:19, z:-9.5,  ry:Math.PI },
  { type:'plant', x:27, z:-20 },
  { type:'plant', x:27, z:-11 },

  // BOARDROOM
  { type:'board_table', x:-22, z:10 },
  { type:'chair', x:-28, z:7.5,  ry:Math.PI/2 },
  { type:'chair', x:-28, z:10,   ry:Math.PI/2 },
  { type:'chair', x:-28, z:12.5, ry:Math.PI/2 },
  { type:'chair', x:-16, z:7.5,  ry:-Math.PI/2 },
  { type:'chair', x:-16, z:10,   ry:-Math.PI/2 },
  { type:'chair', x:-16, z:12.5, ry:-Math.PI/2 },
  { type:'chair', x:-24, z:4,    ry:0 },
  { type:'chair', x:-22, z:4,    ry:0 },
  { type:'chair', x:-20, z:4,    ry:0 },
  { type:'chair', x:-24, z:16,   ry:Math.PI },
  { type:'chair', x:-22, z:16,   ry:Math.PI },
  { type:'chair', x:-20, z:16,   ry:Math.PI },
  { type:'screen', x:-29.5, z:10, ry:Math.PI/2 },
  { type:'plant',  x:-15.5, z:3 },
  { type:'plant',  x:-15.5, z:17 },

  // MEETING PODS
  { type:'pod', x:-12, z:5  },
  { type:'pod', x:-6,  z:5  },
  { type:'pod', x:-12, z:13 },
  { type:'pod', x:-6,  z:13 },

  // MEETING ROOM A
  { type:'meeting_table', x:8, z:10 },
  { type:'chair', x:5.5,  z:8.5,  ry:Math.PI/4 },
  { type:'chair', x:8,    z:8,    ry:0 },
  { type:'chair', x:10.5, z:8.5,  ry:-Math.PI/4 },
  { type:'chair', x:5.5,  z:11.5, ry:(3*Math.PI)/4 },
  { type:'chair', x:8,    z:12,   ry:Math.PI },
  { type:'chair', x:10.5, z:11.5, ry:(-3*Math.PI)/4 },
  { type:'whiteboard', x:1, z:10, ry:Math.PI/2 },

  // MEETING ROOM B
  { type:'meeting_table', x:23, z:10 },
  { type:'chair', x:20.5, z:8.5,  ry:Math.PI/4 },
  { type:'chair', x:23,   z:8,    ry:0 },
  { type:'chair', x:25.5, z:8.5,  ry:-Math.PI/4 },
  { type:'chair', x:20.5, z:11.5, ry:(3*Math.PI)/4 },
  { type:'chair', x:23,   z:12,   ry:Math.PI },
  { type:'chair', x:25.5, z:11.5, ry:(-3*Math.PI)/4 },
  { type:'screen', x:29.5, z:10, ry:-Math.PI/2 },

  // CAFETERIA
  { type:'counter',        x:-10, z:19, ry:Math.PI },
  { type:'coffee_machine', x:-18, z:19 },
  { type:'cafe_table', x:-25, z:24 }, { type:'chair', x:-26.5, z:24, ry:Math.PI/2 }, { type:'chair', x:-23.5, z:24, ry:-Math.PI/2 },
  { type:'cafe_table', x:-20, z:24 }, { type:'chair', x:-21.5, z:24, ry:Math.PI/2 }, { type:'chair', x:-18.5, z:24, ry:-Math.PI/2 },
  { type:'cafe_table', x:-15, z:24 }, { type:'chair', x:-16.5, z:24, ry:Math.PI/2 }, { type:'chair', x:-13.5, z:24, ry:-Math.PI/2 },
  { type:'cafe_table', x:-25, z:29 }, { type:'chair', x:-26.5, z:29, ry:Math.PI/2 }, { type:'chair', x:-23.5, z:29, ry:-Math.PI/2 },
  { type:'cafe_table', x:-20, z:29 }, { type:'chair', x:-21.5, z:29, ry:Math.PI/2 }, { type:'chair', x:-18.5, z:29, ry:-Math.PI/2 },
  { type:'plant', x:-29, z:30 },
  { type:'plant', x:-4,  z:30 },

  // LOUNGE
  { type:'sofa',         x:10, z:21, ry:0 },
  { type:'sofa',         x:15, z:21, ry:0 },
  { type:'sofa',         x:25, z:24, ry:-Math.PI/2 },
  { type:'coffee_table', x:16, z:25 },
  { type:'sofa',         x:10, z:28, ry:Math.PI },
  { type:'sofa',         x:15, z:28, ry:Math.PI },
  { type:'plant', x:7,  z:19 },
  { type:'plant', x:7,  z:30 },
  { type:'plant', x:28, z:19 },
];

// ─── COLLISION BOXES ──────────────────────────────────────────────────────────
//
// DESIGN RULES:
//  1. Wall thickness = 0.4 (±0.2 from centre line)
//  2. Avatar radius  = 0.25  →  door gap must be ≥ 0.6, comfortable = 1.5
//  3. All door gaps are 2.0 units wide — impossible to get stuck
//  4. Vertical dividers stop 0.2 short of horizontal walls to kill corner-traps
//  5. NO overlapping boxes at junctions
//
// LAYOUT (top-down):
//   Z=-24 ┌─────────┬──────────────┬──────────────────┐
//         │ HELP DSK│    LOBBY     │   OPEN WORKSPACE │
//   Z=-8  │         │              │                  │
//         ├─────────┴──────────────┴──────────────────┤ ← partial walls + wide doors
//         │              MAIN HALLWAY                 │
//   Z=+2  ├─────────┬──────┬──────────┬──────────────┤ ← partial walls + wide doors
//         │BOARDROOM│ PODS │  MTG A   │    MTG B      │
//   Z=+18 ├─────────┴──────┴──────────┴──────┬────────┤ ← partial walls + wide doors
//         │         CAFETERIA                │ LOUNGE │
//   Z=+32 └──────────────────────────────────┴────────┘

const W = 0.2; // half wall thickness

export const COLLISION_BOXES = [

  // ══ OUTER PERIMETER ════════════════════════════════════════════════════════
  { minX:-31,   maxX: 31,   minZ:-24-W, maxZ:-24+W }, // North wall
  { minX:-31,   maxX: 31,   minZ: 32-W, maxZ: 32+W }, // South wall
  { minX:-30-W, maxX:-30+W, minZ:-24,   maxZ: 32   }, // West wall
  { minX: 30-W, maxX: 30+W, minZ:-24,   maxZ: 32   }, // East wall

  // ══ HORIZONTAL WALL at Z=-8  (hallway north boundary) ══════════════════════
  // Has a 2-unit door gap in help-desk section (at X=-22 to -20)
  // and is OPEN (no wall) from X=-1 onwards into workspace — open plan
  { minX:-30+W, maxX:-22,   minZ:-8-W, maxZ:-8+W }, // help desk south — solid left
  // GAP: -22 to -20  (help desk door into hallway — 2 units wide)
  { minX:-20,   maxX:-1,    minZ:-8-W, maxZ:-8+W }, // lobby south — solid
  // OPEN from X=-1 to +30 — workspace flows into hallway, no wall needed

  // ══ HORIZONTAL WALL at Z=+2  (hallway south boundary / room entrances) ════
  // Boardroom door gap: X=-25 to -23  (2 units)
  { minX:-30+W, maxX:-25,   minZ: 2-W, maxZ: 2+W }, // boardroom north-left solid
  // GAP: -25 to -23  (boardroom door)
  { minX:-23,   maxX:-16+W, minZ: 2-W, maxZ: 2+W }, // boardroom north-right solid
  // GAP: -14 to -12  (pods door) — handled by no box between -16 and -12
  { minX:-12,   maxX:-2,    minZ: 2-W, maxZ: 2+W }, // pods + start of mtg-A north
  // GAP: -2 to 0  (meeting A left door) — no box
  { minX: 0,    maxX: 6,    minZ: 2-W, maxZ: 2+W }, // meeting A north-left solid
  // GAP: 6 to 8  (meeting A's own door)
  { minX: 8,    maxX: 16-W, minZ: 2-W, maxZ: 2+W }, // meeting A north-right solid
  // (room divider at x=16 below — no gap here, A and B are separated, each gets its own door)
  { minX: 16+W, maxX: 21,   minZ: 2-W, maxZ: 2+W }, // meeting B north-left solid
  // GAP: 21 to 23  (meeting B's own door)
  { minX: 23,   maxX: 30-W, minZ: 2-W, maxZ: 2+W }, // meeting B north-right solid

  // ══ VERTICAL DIVIDERS  (north zone, X=-18 and X=0) ═════════════════════════
  // Help desk / lobby divider at X=-18
  // Door gap at Z=-21 to -19  (2 units)
  { minX:-18-W, maxX:-18+W, minZ:-24+W, maxZ:-21   }, // north segment
  // GAP: -21 to -19
  { minX:-18-W, maxX:-18+W, minZ:-19,   maxZ:-8+W  }, // south segment (ends just inside hallway wall)

  // Lobby / workspace divider at X=0
  // Door gap at Z=-20 to -18  (2 units)
  { minX: -W,   maxX:  W,   minZ:-24+W, maxZ:-20   }, // north segment
  // GAP: -20 to -18
  { minX: -W,   maxX:  W,   minZ:-18,   maxZ:-8+W  }, // south segment

  // ══ VERTICAL DIVIDERS  (south zone, between rooms) ═════════════════════════
  // All stop 0.3 short of the Z=2 wall and Z=18 wall to prevent corner traps
  { minX:-14-W, maxX:-14+W, minZ: 2+W,  maxZ:18-W  }, // boardroom / pods
  { minX:  -W,  maxX:   W,  minZ: 2+W,  maxZ:18-W  }, // pods / meeting-A
  { minX: 16-W, maxX: 16+W, minZ: 2+W,  maxZ:18-W  }, // meeting-A / meeting-B

  // ══ HORIZONTAL WALL at Z=+18  (south rooms bottom) ═════════════════════════
  // Boardroom south — gap for cafeteria entrance: -26 to -24
  { minX:-30+W, maxX:-26,   minZ:18-W, maxZ:18+W }, // boardroom south solid
  // GAP: -26 to -24
  { minX:-24,   maxX:-2,    minZ:18-W, maxZ:18+W }, // pods+mtgA south solid
  // GAP: -2 to 0  (open between rooms and cafe)
  { minX: 0,    maxX: 14,   minZ:18-W, maxZ:18+W }, // meeting A south solid
  // GAP: 14 to 16  (lounge entrance)
  { minX: 16,   maxX:30-W,  minZ:18-W, maxZ:18+W }, // meeting B south solid

  // ══ CAFETERIA / LOUNGE DIVIDER at X=+6 ════════════════════════════════════
  // Gap for passage at Z=24 to 26  (2 units)
  { minX: 6-W, maxX: 6+W, minZ:18+W, maxZ:24   }, // north segment
  // GAP: 24 to 26
  { minX: 6-W, maxX: 6+W, minZ:26,   maxZ:32-W }, // south segment

];

// Avatar collision radius — kept small to feel natural in doorways
export const AVATAR_RADIUS = 0.25;

// Spawn in the lobby facing the hallway
export const AVATAR_SPAWN = { x:-10, z:-16, ry:0 };