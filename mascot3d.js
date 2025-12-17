// Import Three.js module (Assuming ES modules usage in index.html, else we use global THREE)
// Since we are using CDN in script tag, THREE will be global.

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("canvas-container");
  if (!container) return; // Only run on pages with the container

  // --- 1. Scene Setup ---
  const scene = new THREE.Scene();

  // Camera
  const camera = new THREE.PerspectiveCamera(
    50,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  camera.position.z = 5;
  camera.position.y = 0.5;

  // Renderer
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  container.appendChild(renderer.domElement);

  // Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  const dirLight = new THREE.DirectionalLight(0xffffff, 1);
  dirLight.position.set(5, 5, 5);
  scene.add(dirLight);

  const rimLight = new THREE.DirectionalLight(0xff5722, 0.8); // Orange rim light
  rimLight.position.set(-5, 5, 0);
  scene.add(rimLight);

  // --- 2. Wolf Construction (Low Poly Geometric) ---
  const wolfGroup = new THREE.Group();
  scene.add(wolfGroup);

  // Materials
  const furMaterial = new THREE.MeshStandardMaterial({
    color: 0x333333,
    roughness: 0.7,
    flatShading: true,
  });
  const whiteFurMaterial = new THREE.MeshStandardMaterial({
    color: 0xeeeeee,
    roughness: 0.9,
    flatShading: true,
  });
  const orangeMaterial = new THREE.MeshStandardMaterial({
    color: 0xff5722,
    roughness: 0.2,
    emissive: 0xaa2200,
    emissiveIntensity: 0.2,
  });
  const noseMaterial = new THREE.MeshStandardMaterial({ color: 0x111111 });

  // Head Group (Pivot point for rotation)
  const headGroup = new THREE.Group();
  wolfGroup.add(headGroup);

  // Main Head Shape (Icosahedron roughly)
  const headGeo = new THREE.DodecahedronGeometry(1.2, 0);
  // Stretch it to look more like a head
  headGeo.scale(0.9, 1, 1.1);
  const head = new THREE.Mesh(headGeo, furMaterial);
  headGroup.add(head);

  // Snout
  const snoutGeo = new THREE.ConeGeometry(0.5, 1.2, 4);
  snoutGeo.rotateX(Math.PI / 2); // Point forward
  const snout = new THREE.Mesh(snoutGeo, whiteFurMaterial);
  snout.position.z = 1.1;
  snout.position.y = -0.2;
  headGroup.add(snout);

  // Nose Tip
  const noseTipGeo = new THREE.DodecahedronGeometry(0.2);
  const noseTip = new THREE.Mesh(noseTipGeo, noseMaterial);
  noseTip.position.z = 1.7;
  noseTip.position.y = -0.2;
  headGroup.add(noseTip);

  // Ears
  const earGeo = new THREE.ConeGeometry(0.4, 0.8, 4);

  const leftEar = new THREE.Mesh(earGeo, furMaterial);
  leftEar.position.set(0.6, 1, -0.2);
  leftEar.rotation.set(-0.2, 0, -0.3);
  headGroup.add(leftEar);

  const rightEar = new THREE.Mesh(earGeo, furMaterial);
  rightEar.position.set(-0.6, 1, -0.2);
  rightEar.rotation.set(-0.2, 0, 0.3);
  headGroup.add(rightEar);

  // Eyes (Glowing)
  const eyeGeo = new THREE.SphereGeometry(0.25, 16, 16);

  const leftEye = new THREE.Mesh(eyeGeo, orangeMaterial);
  leftEye.position.set(0.4, 0.3, 0.8);
  leftEye.scale.set(1, 0.6, 1); // Angry/Serious squint shape
  headGroup.add(leftEye);

  const rightEye = new THREE.Mesh(eyeGeo, orangeMaterial);
  rightEye.position.set(-0.4, 0.3, 0.8);
  rightEye.scale.set(1, 0.6, 1);
  headGroup.add(rightEye);

  // Torso (Hints of shoulders)
  // We keep it abstract/floating head style or add a small neck
  const neckGeo = new THREE.CylinderGeometry(0.5, 0.8, 1, 6);
  const neck = new THREE.Mesh(neckGeo, furMaterial);
  neck.position.y = -1.2;
  wolfGroup.add(neck);

  // --- 3. Animation Interaction ---

  // Variables for interpolation
  let mouseX = 0;
  let mouseY = 0;
  let targetRotationX = 0;
  let targetRotationY = 0;

  // Mouse Move Event
  document.addEventListener("mousemove", (event) => {
    // Normalize mouse position -1 to 1
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
  });

  // Resize Handle
  window.addEventListener("resize", () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });

  // Chat Bubble Interaction on Click/Hover
  const chatBubble = document.getElementById("chatBubble");

  // Animate
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const time = clock.getElapsedTime();

    // 1. Idle Float
    wolfGroup.position.y = Math.sin(time * 1.5) * 0.1;

    // 2. Mouse Look (Smooth lerp)
    // Head follows mouse
    targetRotationY = mouseX * 0.6; // Scale rotation range
    targetRotationX = mouseY * 0.4;

    // Smoothly interpolate current rotation to target
    headGroup.rotation.y += (targetRotationY - headGroup.rotation.y) * 0.05;
    headGroup.rotation.x += (targetRotationX - headGroup.rotation.x) * 0.05;

    // Neck follows a bit less for realism
    neck.rotation.y = headGroup.rotation.y * 0.5;

    // 3. Render
    renderer.render(scene, camera);
  }

  animate();
  console.log("🐺 Wolf 3D System Online");
});
