/* ==========================================================================
   THREE.JS ARCHITECTURAL WIREFRAME BUILDING SCENE
   Lightweight, performant 3D structural model with WebGL detection & fallback
   ========================================================================== */

(function initStructural3DScene() {
  const container = document.getElementById('three-blueprint-canvas');
  if (!container) return;

  // WebGL availability check
  function isWebGLAvailable() {
    try {
      const canvas = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch (e) {
      return false;
    }
  }

  if (typeof THREE === 'undefined' || !isWebGLAvailable()) {
    container.innerHTML = `
      <div class="canvas-fallback">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#315A78" stroke-width="1.5">
          <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
          <polyline points="2 17 12 22 22 17"></polyline>
          <polyline points="2 12 12 17 22 12"></polyline>
        </svg>
        <span>STRUCTURAL BLUEPRINT 07<br><small style="color: #D87532;">2D VECTOR MODE ACTIVE</small></span>
      </div>
    `;
    return;
  }

  // Scene, Camera, Renderer setup
  const scene = new THREE.Scene();
  const width = container.clientWidth || 320;
  const height = container.clientHeight || 280;

  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  camera.position.set(24, 18, 28);
  camera.lookAt(0, 4, 0);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  // Structural Group
  const structureGroup = new THREE.Group();
  scene.add(structureGroup);

  // Materials
  const blueprintLineMat = new THREE.LineBasicMaterial({
    color: 0x315A78,
    transparent: true,
    opacity: 0.85,
    linewidth: 1.5
  });

  const orangeHighlightMat = new THREE.LineBasicMaterial({
    color: 0xD87532,
    transparent: true,
    opacity: 0.95,
    linewidth: 2
  });

  const floorPlaneMat = new THREE.MeshBasicMaterial({
    color: 0x315A78,
    transparent: true,
    opacity: 0.08,
    side: THREE.DoubleSide
  });

  // Build architectural tower floors
  const numFloors = 8;
  const floorWidth = 10;
  const floorDepth = 10;
  const floorHeight = 2.2;

  for (let f = 0; f < numFloors; f++) {
    const y = f * floorHeight;
    const isUnderConstruction = f >= 5; // Top floors in progress
    const lineMat = isUnderConstruction ? orangeHighlightMat : blueprintLineMat;

    // Floor slab outline
    const slabGeo = new THREE.BoxGeometry(floorWidth, 0.2, floorDepth);
    const edges = new THREE.EdgesGeometry(slabGeo);
    const slabLines = new THREE.LineSegments(edges, lineMat);
    slabLines.position.y = y;
    structureGroup.add(slabLines);

    // Floor plane mesh
    const plane = new THREE.Mesh(slabGeo, floorPlaneMat);
    plane.position.y = y;
    structureGroup.add(plane);

    // Structural columns at 4 corners + center core
    const colOffsets = [
      [-floorWidth/2 + 0.5, -floorDepth/2 + 0.5],
      [floorWidth/2 - 0.5, -floorDepth/2 + 0.5],
      [-floorWidth/2 + 0.5, floorDepth/2 - 0.5],
      [floorWidth/2 - 0.5, floorDepth/2 - 0.5],
      [0, 0]
    ];

    colOffsets.forEach(pos => {
      const colGeo = new THREE.BoxGeometry(0.3, floorHeight, 0.3);
      const colEdges = new THREE.EdgesGeometry(colGeo);
      const colLine = new THREE.LineSegments(colEdges, lineMat);
      colLine.position.set(pos[0], y + floorHeight/2, pos[1]);
      structureGroup.add(colLine);
    });
  }

  // Add Construction Crane Model at the top
  const craneGroup = new THREE.Group();
  const craneBaseY = numFloors * floorHeight;

  // Mast
  const mastGeo = new THREE.BoxGeometry(0.8, 6, 0.8);
  const mastEdges = new THREE.EdgesGeometry(mastGeo);
  const mastLines = new THREE.LineSegments(mastEdges, orangeHighlightMat);
  mastLines.position.set(0, craneBaseY + 3, 0);
  craneGroup.add(mastLines);

  // Jib (Horizontal arm)
  const jibGeo = new THREE.BoxGeometry(14, 0.4, 0.6);
  const jibEdges = new THREE.EdgesGeometry(jibGeo);
  const jibLines = new THREE.LineSegments(jibEdges, orangeHighlightMat);
  jibLines.position.set(2, craneBaseY + 6, 0);
  craneGroup.add(jibLines);

  structureGroup.add(craneGroup);

  // Ground Grid
  const gridHelper = new THREE.GridHelper(24, 12, 0xD87532, 0x1E394C);
  gridHelper.position.y = 0;
  scene.add(gridHelper);

  // Mouse Interaction
  let targetRotationY = 0;
  let targetRotationX = 0;
  let mouseX = 0;
  let mouseY = 0;

  window.addEventListener('mousemove', (e) => {
    const rect = container.getBoundingClientRect();
    if (e.clientY >= rect.top - 200 && e.clientY <= rect.bottom + 200) {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
      targetRotationY = mouseX * 0.6;
      targetRotationX = mouseY * 0.3;
    }
  });

  // Handle Resize
  const resizeObserver = new ResizeObserver(entries => {
    for (let entry of entries) {
      const w = entry.contentRect.width;
      const h = entry.contentRect.height;
      if (w > 0 && h > 0) {
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      }
    }
  });
  resizeObserver.observe(container);

  // Animation Loop
  let reqId;
  function animate() {
    reqId = requestAnimationFrame(animate);

    structureGroup.rotation.y += 0.004;
    craneGroup.rotation.y = Math.sin(Date.now() * 0.001) * 0.4;

    // Smooth lerp mouse rotation
    structureGroup.rotation.y += (targetRotationY - structureGroup.rotation.y) * 0.05;
    structureGroup.rotation.x += (targetRotationX - structureGroup.rotation.x) * 0.05;

    renderer.render(scene, camera);
  }

  animate();
})();
