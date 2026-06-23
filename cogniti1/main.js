gsap.registerPlugin(ScrollTrigger);

// ── THREE.JS: Neural Sphere ───────────────────────────────────────────────

const canvas = document.getElementById('hero-canvas');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 0, 4.5);

// Point cloud sphere
const sphereGeo = new THREE.SphereGeometry(1.6, 40, 40);
const sphereMat = new THREE.PointsMaterial({
  color: 0x4da6ff,
  size: 0.025,
  transparent: true,
  opacity: 0.75,
});
const pointSphere = new THREE.Points(sphereGeo, sphereMat);
scene.add(pointSphere);

// Connection lines between random pairs of sphere vertices
const posAttr = sphereGeo.attributes.position;
const vertCount = posAttr.count;
const lineVerts = [];
for (let i = 0; i < 80; i++) {
  const a = Math.floor(Math.random() * vertCount);
  const b = Math.floor(Math.random() * vertCount);
  lineVerts.push(
    posAttr.getX(a), posAttr.getY(a), posAttr.getZ(a),
    posAttr.getX(b), posAttr.getY(b), posAttr.getZ(b),
  );
}
const lineGeo = new THREE.BufferGeometry();
lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(lineVerts, 3));
const lineMat = new THREE.LineBasicMaterial({ color: 0x4da6ff, transparent: true, opacity: 0.07 });
const meshLines = new THREE.LineSegments(lineGeo, lineMat);
scene.add(meshLines);

// Ambient glow sprite
const glowMat = new THREE.SpriteMaterial({ color: 0x4da6ff, transparent: true, opacity: 0.05 });
const glowSprite = new THREE.Sprite(glowMat);
glowSprite.scale.set(7, 7, 1);
scene.add(glowSprite);

// Mouse parallax
const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
window.addEventListener('mousemove', e => {
  mouse.tx = (e.clientX / window.innerWidth - 0.5) * 0.4;
  mouse.ty = -(e.clientY / window.innerHeight - 0.5) * 0.4;
});

// Resize handler
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Render loop
(function tick() {
  requestAnimationFrame(tick);
  pointSphere.rotation.y += 0.0025;
  pointSphere.rotation.x += 0.0008;
  meshLines.rotation.y = pointSphere.rotation.y;
  meshLines.rotation.x = pointSphere.rotation.x;
  mouse.x += (mouse.tx - mouse.x) * 0.04;
  mouse.y += (mouse.ty - mouse.y) * 0.04;
  camera.position.x = mouse.x;
  camera.position.y = mouse.y;
  camera.lookAt(scene.position);
  renderer.render(scene, camera);
})();

// ── HERO ENTRANCE ─────────────────────────────────────────────────────────

gsap.timeline({ delay: 0.4 })
  .to('.hero-eyebrow', { opacity: 1, duration: 1,   ease: 'power2.out' }, 0)
  .to('.hero-title',   { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' }, 0.15)
  .to('.hero-sub',     { opacity: 1, y: 0, duration: 1,   ease: 'power3.out' }, 0.35)
  .to('.btn-primary',  { opacity: 1, duration: 0.8, ease: 'power2.out' }, 0.55);

// ── MANIFESTO: stagger reveal on scroll ───────────────────────────────────

document.querySelectorAll('.manifesto-line').forEach((el, i) => {
  gsap.to(el, {
    opacity: 1,
    y: 0,
    duration: 0.9,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: el,
      start: 'top 82%',
    },
  });
});

// ── FLOW: sequential node reveal ──────────────────────────────────────────

gsap.to('.flow-eyebrow', {
  opacity: 1,
  duration: 0.8,
  scrollTrigger: { trigger: '.flow', start: 'top 70%' },
});

gsap.to('.flow-title', {
  opacity: 1,
  y: 0,
  duration: 0.9,
  ease: 'power3.out',
  scrollTrigger: { trigger: '.flow', start: 'top 65%' },
});

document.querySelectorAll('.flow-node').forEach((node, i) => {
  gsap.to(node, {
    opacity: 1,
    duration: 0.5,
    delay: i * 0.22,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.flow-track',
      start: 'top 68%',
      onEnter: () => {
        setTimeout(() => {
          node.classList.add('active');
          const connector = node.querySelector('.node-connector');
          if (connector) {
            gsap.to(connector, { scaleX: 1, duration: 0.45, ease: 'power2.inOut' });
          }
        }, i * 220);
      },
    },
  });
});

// ── CONTACT: fade in ──────────────────────────────────────────────────────

gsap.to('.contact-eyebrow', {
  opacity: 1,
  duration: 0.8,
  scrollTrigger: { trigger: '.contact', start: 'top 75%' },
});

gsap.to('.contact-title', {
  opacity: 1,
  y: 0,
  duration: 1,
  ease: 'power3.out',
  scrollTrigger: { trigger: '.contact', start: 'top 70%' },
});

gsap.to('.contact .btn-primary', {
  opacity: 1,
  duration: 0.8,
  delay: 0.2,
  scrollTrigger: { trigger: '.contact', start: 'top 65%' },
});

gsap.to('.contact-footer', {
  opacity: 1,
  duration: 0.8,
  delay: 0.4,
  scrollTrigger: { trigger: '.contact', start: 'top 60%' },
});
