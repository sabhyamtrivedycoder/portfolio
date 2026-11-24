/**
 * Sabhaym Trivedi - Flagship 3D Portfolio
 * Interactive 3D WebGL Antique Berliner Gramophone (Three.js)
 * Fully interactive 3D model with rotatable orbit, manual play/pause,
 * animated tonearm, spinning vinyl disc, rotating crank, and acoustic rings.
 */

(function() {
  'use strict';

  let scene, camera, renderer, canvas;
  let gramophoneRoot;
  let turntableGroup, tonearmGroup, crankGroup, hornGroup;
  let pulseRings = [];
  let isPlaying = false;
  let vinylSpeed = 0;
  let tonearmAngle = -0.35;
  let targetTonearmAngle = -0.35;

  // Interaction & Orbit state
  let isDragging = false;
  let previousMousePosition = { x: 0, y: 0 };
  let startMousePosition = { x: 0, y: 0 };
  let targetRotationY = 0.45;
  let targetRotationX = 0.15;
  let currentRotationY = 0.45;
  let currentRotationX = 0.15;
  let autoRotateSpeed = 0.003;
  let userInteracted = false;

  function initGramophone3D(canvasId) {
    canvas = document.getElementById(canvasId);
    if (!canvas || typeof THREE === 'undefined') return;

    const width = canvas.parentElement.clientWidth || 260;
    const height = canvas.parentElement.clientHeight || 300;

    // --- Scene & Camera ---
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
    camera.position.set(0, 3.2, 11.5);
    camera.lookAt(0, 1.8, 0);

    // --- Renderer ---
    renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // --- Lighting ---
    const ambientLight = new THREE.AmbientLight(0xfff6ea, 0.85);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfff3db, 1.35);
    sunLight.position.set(5, 10, 7);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    scene.add(sunLight);

    const rimLight = new THREE.DirectionalLight(0xa594fd, 0.8);
    rimLight.position.set(-6, 5, -5);
    scene.add(rimLight);

    const hornGlowLight = new THREE.PointLight(0xf59e0b, 1.4, 7);
    hornGlowLight.position.set(-0.8, 4.2, 1.2);
    scene.add(hornGlowLight);

    // --- Build 3D Gramophone Model ---
    buildModel();

    // --- Wire Events ---
    initInteractionEvents();

    // --- Resize Observer ---
    const resizeObserver = new ResizeObserver(() => onWindowResize());
    resizeObserver.observe(canvas.parentElement);

    // --- Animation Loop ---
    animate();
  }

  function buildModel() {
    gramophoneRoot = new THREE.Group();
    gramophoneRoot.position.set(0, -0.6, 0);
    scene.add(gramophoneRoot);

    // Materials
    const woodPlinthMat = new THREE.MeshStandardMaterial({
      color: 0x4a2511,
      roughness: 0.45,
      metalness: 0.08
    });

    const woodBodyMat = new THREE.MeshStandardMaterial({
      color: 0x613217,
      roughness: 0.38,
      metalness: 0.05
    });

    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xe5b23d,
      roughness: 0.24,
      metalness: 0.92,
      side: THREE.DoubleSide
    });

    const brassHornInnerMat = new THREE.MeshStandardMaterial({
      color: 0xdfa528,
      roughness: 0.18,
      metalness: 0.95,
      side: THREE.DoubleSide
    });

    const silverMetalMat = new THREE.MeshStandardMaterial({
      color: 0xd4d4d8,
      roughness: 0.28,
      metalness: 0.92
    });

    const darkHandleMat = new THREE.MeshStandardMaterial({
      color: 0x18181b,
      roughness: 0.5,
      metalness: 0.1
    });

    const vinylMat = new THREE.MeshStandardMaterial({
      color: 0x09090b,
      roughness: 0.32,
      metalness: 0.25
    });

    const labelMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      roughness: 0.45,
      metalness: 0.1
    });

    // 1. Wooden Base Plinth (bottom molding)
    const plinthGeo = new THREE.BoxGeometry(4.4, 0.4, 4.4);
    const plinthMesh = new THREE.Mesh(plinthGeo, woodPlinthMat);
    plinthMesh.position.y = 0.2;
    plinthMesh.receiveShadow = true;
    plinthMesh.castShadow = true;
    gramophoneRoot.add(plinthMesh);

    // 2. Main Wooden Cabinet Box
    const boxGeo = new THREE.BoxGeometry(3.8, 1.5, 3.8);
    const boxMesh = new THREE.Mesh(boxGeo, woodBodyMat);
    boxMesh.position.y = 1.15;
    boxMesh.receiveShadow = true;
    boxMesh.castShadow = true;
    gramophoneRoot.add(boxMesh);

    // 3. Top Cornice Molding
    const topCorniceGeo = new THREE.BoxGeometry(4.2, 0.3, 4.2);
    const topCorniceMesh = new THREE.Mesh(topCorniceGeo, woodPlinthMat);
    topCorniceMesh.position.y = 2.05;
    topCorniceMesh.receiveShadow = true;
    topCorniceMesh.castShadow = true;
    gramophoneRoot.add(topCorniceMesh);

    // 4. Brass Plaque on Cabinet Front
    const plaqueGeo = new THREE.BoxGeometry(1.6, 0.55, 0.05);
    const plaqueMesh = new THREE.Mesh(plaqueGeo, brassMat);
    plaqueMesh.position.set(0, 1.15, 1.93);
    gramophoneRoot.add(plaqueMesh);

    // 5. Hand Crank (Right Side)
    crankGroup = new THREE.Group();
    crankGroup.position.set(1.9, 1.15, 0.4);

    const crankShaftGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.5, 12);
    crankShaftGeo.rotateZ(Math.PI / 2);
    const crankShaftMesh = new THREE.Mesh(crankShaftGeo, silverMetalMat);
    crankShaftMesh.position.x = 0.25;
    crankGroup.add(crankShaftMesh);

    const crankArmGeo = new THREE.BoxGeometry(0.08, 0.7, 0.08);
    const crankArmMesh = new THREE.Mesh(crankArmGeo, silverMetalMat);
    crankArmMesh.position.set(0.5, -0.25, 0);
    crankGroup.add(crankArmMesh);

    const crankHandleGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.5, 12);
    crankHandleGeo.rotateZ(Math.PI / 2);
    const crankHandleMesh = new THREE.Mesh(crankHandleGeo, darkHandleMat);
    crankHandleMesh.position.set(0.75, -0.55, 0);
    crankGroup.add(crankHandleMesh);

    gramophoneRoot.add(crankGroup);

    // 6. Turntable & Spinning Vinyl Record
    turntableGroup = new THREE.Group();
    turntableGroup.position.set(-0.25, 2.2, -0.2);

    // Platter Rim (Brass)
    const platterGeo = new THREE.CylinderGeometry(1.65, 1.65, 0.12, 48);
    const platterMesh = new THREE.Mesh(platterGeo, brassMat);
    platterMesh.receiveShadow = true;
    turntableGroup.add(platterMesh);

    // Vinyl Record Disc
    const vinylGeo = new THREE.CylinderGeometry(1.58, 1.58, 0.04, 64);
    const vinylMesh = new THREE.Mesh(vinylGeo, vinylMat);
    vinylMesh.position.y = 0.08;
    vinylMesh.receiveShadow = true;
    turntableGroup.add(vinylMesh);

    // Record Center Label
    const labelGeo = new THREE.CylinderGeometry(0.55, 0.55, 0.045, 32);
    const labelMesh = new THREE.Mesh(labelGeo, labelMat);
    labelMesh.position.y = 0.082;
    turntableGroup.add(labelMesh);

    // Spindle Pin
    const spindleGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.35, 16);
    const spindleMesh = new THREE.Mesh(spindleGeo, silverMetalMat);
    spindleMesh.position.y = 0.2;
    turntableGroup.add(spindleMesh);

    gramophoneRoot.add(turntableGroup);

    // 7. Support Pillar at Back Right
    const pillarGeo = new THREE.CylinderGeometry(0.18, 0.22, 1.2, 16);
    const pillarMesh = new THREE.Mesh(pillarGeo, silverMetalMat);
    pillarMesh.position.set(1.4, 2.7, 1.0);
    gramophoneRoot.add(pillarMesh);

    // 8. Tonearm Assembly (Pivotable)
    tonearmGroup = new THREE.Group();
    tonearmGroup.position.set(1.4, 3.2, 1.0);

    // Pivot collar
    const collarGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.25, 16);
    const collarMesh = new THREE.Mesh(collarGeo, silverMetalMat);
    tonearmGroup.add(collarMesh);

    // Tonearm curved pipe
    const armCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(-0.6, 0.1, -0.4),
      new THREE.Vector3(-1.3, -0.15, -0.9),
      new THREE.Vector3(-1.7, -0.75, -1.2)
    ]);
    const armTubeGeo = new THREE.TubeGeometry(armCurve, 24, 0.07, 12, false);
    const armTubeMesh = new THREE.Mesh(armTubeGeo, brassMat);
    tonearmGroup.add(armTubeMesh);

    // Soundbox Head
    const soundboxGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.14, 24);
    soundboxGeo.rotateZ(Math.PI / 4);
    const soundboxMesh = new THREE.Mesh(soundboxGeo, silverMetalMat);
    soundboxMesh.position.set(-1.75, -0.78, -1.2);
    tonearmGroup.add(soundboxMesh);

    // Needle Tip
    const needleGeo = new THREE.ConeGeometry(0.03, 0.18, 8);
    needleGeo.rotateX(Math.PI);
    const needleMesh = new THREE.Mesh(needleGeo, silverMetalMat);
    needleMesh.position.set(-1.85, -0.92, -1.25);
    tonearmGroup.add(needleMesh);

    // Initial rest angle
    tonearmGroup.rotation.y = tonearmAngle;
    gramophoneRoot.add(tonearmGroup);

    // 9. Curved Acoustic Horn Neck & Fluted Brass Bell
    hornGroup = new THREE.Group();
    hornGroup.position.set(1.4, 3.2, 1.0);

    // Elbow Sound Conduit (curves back and up toward the front-left)
    const elbowCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0.8, -0.2),
      new THREE.Vector3(-0.6, 1.4, -0.5),
      new THREE.Vector3(-1.4, 1.9, -0.8)
    ]);
    const elbowGeo = new THREE.TubeGeometry(elbowCurve, 32, 0.18, 16, false);
    const elbowMesh = new THREE.Mesh(elbowGeo, brassMat);
    hornGroup.add(elbowMesh);

    // Fluted Brass Bell
    const hornPoints = [];
    for (let i = 0; i <= 28; i++) {
      const t = i / 28;
      const y = t * 3.6;
      const r = 0.22 + Math.pow(t, 2.6) * 2.5;
      hornPoints.push(new THREE.Vector2(r, y));
    }
    const bellLatheGeo = new THREE.LatheGeometry(hornPoints, 48);

    // Apply 12-flute petal ridges across horn flare
    const pos = bellLatheGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = pos.getZ(i);
      const angle = Math.atan2(z, x);
      const currentR = Math.sqrt(x * x + z * z);
      const t = Math.max(0, y / 3.6);
      const flute = Math.sin(angle * 12) * 0.08 * Math.pow(t, 2.2);
      const newR = currentR + flute;
      pos.setX(i, Math.cos(angle) * newR);
      pos.setZ(i, Math.sin(angle) * newR);
    }
    bellLatheGeo.computeVertexNormals();

    const bellMesh = new THREE.Mesh(bellLatheGeo, brassHornInnerMat);
    // Align horn bell pointing diagonally forward/upward toward the viewer
    bellMesh.position.set(-1.4, 1.9, -0.8);
    bellMesh.rotation.set(-Math.PI / 4, -Math.PI / 6, 0);
    bellMesh.castShadow = true;
    hornGroup.add(bellMesh);

    gramophoneRoot.add(hornGroup);

    // 10. 3D Acoustic Wave Rings (from horn opening)
    const bellMouthPos = new THREE.Vector3(-2.8, 3.8, 0.8);
    for (let i = 0; i < 3; i++) {
      const ringGeo = new THREE.RingGeometry(0.3, 0.36, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xfbbf24,
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.copy(bellMouthPos);
      ringMesh.rotation.set(-Math.PI / 4, -Math.PI / 6, 0);
      ringMesh.userData = { offset: i * 0.33, life: 0 };
      gramophoneRoot.add(ringMesh);
      pulseRings.push(ringMesh);
    }
  }

  function initInteractionEvents() {
    canvas.style.cursor = 'grab';

    // Desktop Mouse Drag Orbit
    canvas.addEventListener('mousedown', (e) => {
      isDragging = true;
      userInteracted = true;
      canvas.style.cursor = 'grabbing';
      startMousePosition = { x: e.clientX, y: e.clientY };
      previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      targetRotationY += deltaX * 0.012;
      targetRotationX += deltaY * 0.008;

      // Restrict vertical pitch to prevent flipping
      targetRotationX = Math.max(-0.4, Math.min(0.6, targetRotationX));

      previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mouseup', (e) => {
      if (!isDragging) return;
      isDragging = false;
      canvas.style.cursor = 'grab';

      // Check if it was a quick click without dragging
      const dist = Math.hypot(e.clientX - startMousePosition.x, e.clientY - startMousePosition.y);
      if (dist < 6 && typeof window.toggleGramophone === 'function') {
        window.toggleGramophone();
      }
    });

    // Touch Drag Orbit (Mobile)
    canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        isDragging = true;
        userInteracted = true;
        startMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (!isDragging || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - previousMousePosition.x;
      const deltaY = e.touches[0].clientY - previousMousePosition.y;

      targetRotationY += deltaX * 0.014;
      targetRotationX += deltaY * 0.009;
      targetRotationX = Math.max(-0.4, Math.min(0.6, targetRotationX));

      previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }, { passive: true });

    window.addEventListener('touchend', (e) => {
      if (!isDragging) return;
      isDragging = false;
      if (e.changedTouches.length === 1) {
        const dist = Math.hypot(
          e.changedTouches[0].clientX - startMousePosition.x,
          e.changedTouches[0].clientY - startMousePosition.y
        );
        if (dist < 8 && typeof window.toggleGramophone === 'function') {
          window.toggleGramophone();
        }
      }
    });
  }

  function onWindowResize() {
    if (!renderer || !camera || !canvas) return;
    const width = canvas.parentElement.clientWidth || 260;
    const height = canvas.parentElement.clientHeight || 300;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }

  function animate() {
    requestAnimationFrame(animate);

    // Smooth rotational damping
    if (!isDragging && !userInteracted) {
      targetRotationY += autoRotateSpeed;
    }
    currentRotationY += (targetRotationY - currentRotationY) * 0.08;
    currentRotationX += (targetRotationX - currentRotationX) * 0.08;

    if (gramophoneRoot) {
      gramophoneRoot.rotation.y = currentRotationY;
      gramophoneRoot.rotation.x = currentRotationX;
    }

    // Tonearm smooth pivot animation
    targetTonearmAngle = isPlaying ? 0.38 : -0.35;
    tonearmAngle += (targetTonearmAngle - tonearmAngle) * 0.06;
    if (tonearmGroup) {
      tonearmGroup.rotation.y = tonearmAngle;
    }

    // Vinyl spinning physics
    const targetVinylSpeed = isPlaying ? 0.048 : 0;
    vinylSpeed += (targetVinylSpeed - vinylSpeed) * 0.05;
    if (turntableGroup && Math.abs(vinylSpeed) > 0.0001) {
      turntableGroup.rotation.y += vinylSpeed;
    }

    // Hand crank rotation
    if (crankGroup && isPlaying) {
      crankGroup.rotation.x += 0.06;
    }

    // 3D Acoustic Rings expansion from horn
    const time = performance.now() * 0.0015;
    pulseRings.forEach((ring) => {
      if (isPlaying) {
        const phase = (time + ring.userData.offset) % 1;
        const scale = 0.5 + phase * 2.2;
        ring.scale.set(scale, scale, scale);
        ring.material.opacity = Math.sin(phase * Math.PI) * 0.65;
        ring.visible = true;
      } else {
        ring.material.opacity *= 0.9;
        if (ring.material.opacity < 0.01) {
          ring.visible = false;
        }
      }
    });

    if (renderer && scene && camera) {
      renderer.render(scene, camera);
    }
  }

  // Public Interface
  window.Gramophone3D = {
    init: initGramophone3D,
    setPlaying: function(playing) {
      isPlaying = !!playing;
    },
    isPlaying: function() {
      return isPlaying;
    }
  };

  // Auto-init on DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    initGramophone3D('gramophone-3d-canvas');
  });

})();
