import * as THREE from 'three';
import { createAvatar, PRESETS, SKIN_TONES, HAIR_COLORS, SHIRT_COLORS, PANTS_COLORS } from './avatar.js';

// Manages the character select screen: live preview + swatches + gender toggle.
// Calls onEnter(gender, appearance, name) when the user clicks "Enter Office".
export function initCharSelect(onEnter) {
  const screenEl   = document.getElementById('char-select');
  const canvasEl   = document.getElementById('char-preview-canvas');
  const nameInput  = document.getElementById('cs-name-input');
  const enterBtn   = document.getElementById('cs-enter-btn');
  const genderBtns = document.querySelectorAll('.cs-gender-btn');

  // State
  let gender = 'male';
  let appearance = { ...PRESETS.male };

  // ─── Mini 3D preview scene ──────────────────────────────────────────────
  const previewScene = new THREE.Scene();
  previewScene.background = null;

  const previewCamera = new THREE.PerspectiveCamera(32, 280 / 360, 0.1, 10);
  previewCamera.position.set(0, 1.1, 3.0);
  previewCamera.lookAt(0, 1.0, 0);

  const previewRenderer = new THREE.WebGLRenderer({ canvas: canvasEl, alpha: true, antialias: true });
  previewRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  previewRenderer.setSize(280, 360, false);

  previewScene.add(new THREE.AmbientLight(0xffffff, 0.8));
  const previewLight = new THREE.DirectionalLight(0xffffff, 0.9);
  previewLight.position.set(2, 4, 3);
  previewScene.add(previewLight);
  const previewLight2 = new THREE.DirectionalLight(0x88aaff, 0.3);
  previewLight2.position.set(-2, 2, -2);
  previewScene.add(previewLight2);

  let previewAvatar = createAvatar(previewScene, gender, appearance);
  previewAvatar.group.position.y = 0;

  let rotateAngle = 0;
  let rafId = null;
  function renderPreviewLoop() {
    rafId = requestAnimationFrame(renderPreviewLoop);
    rotateAngle += 0.008;
    previewAvatar.group.rotation.y = Math.sin(rotateAngle) * 0.4;
    previewRenderer.render(previewScene, previewCamera);
  }
  renderPreviewLoop();

  function rebuildPreview() {
    previewScene.remove(previewAvatar.group);
    previewAvatar = createAvatar(previewScene, gender, appearance);
  }

  // ─── Swatch builder ──────────────────────────────────────────────────────
  function buildSwatches(containerId, colors, appearanceKey) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    colors.forEach(color => {
      const sw = document.createElement('div');
      sw.className = 'cs-swatch';
      sw.style.background = color;
      if (appearance[appearanceKey].toLowerCase() === color.toLowerCase()) {
        sw.classList.add('selected');
      }
      sw.addEventListener('click', () => {
        appearance[appearanceKey] = color;
        previewAvatar.setColor(appearanceKey, color);
        // update selected state
        container.querySelectorAll('.cs-swatch').forEach(el => el.classList.remove('selected'));
        sw.classList.add('selected');
      });
      container.appendChild(sw);
    });
  }

  function refreshAllSwatches() {
    buildSwatches('swatches-skin',  SKIN_TONES,   'skin');
    buildSwatches('swatches-hair',  HAIR_COLORS,  'hair');
    buildSwatches('swatches-shirt', SHIRT_COLORS, 'shirt');
    buildSwatches('swatches-pants', PANTS_COLORS, 'pants');
  }
  refreshAllSwatches();

  // ─── Gender toggle ───────────────────────────────────────────────────────
  genderBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      genderBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      gender = btn.dataset.gender;
      // Reset to gender's default colors but keep it feeling fresh
      appearance = { ...PRESETS[gender] };
      rebuildPreview();
      refreshAllSwatches();
    });
  });

  // ─── Enter button ────────────────────────────────────────────────────────
  enterBtn.addEventListener('click', () => {
    cancelAnimationFrame(rafId);
    screenEl.classList.add('hidden');
    const playerName = nameInput.value.trim();
    onEnter(gender, { ...appearance }, playerName);
  });

  // Return a getter in case main.js needs current appearance (e.g. for "Edit Avatar" later)
  return {
    getCurrent: () => ({ gender, appearance: { ...appearance } }),
  };
}