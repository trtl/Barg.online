function moveTowards(targetX, targetY) {
  const obj = document.querySelector('.stickman');
  let x = parseInt(obj.style.left);
  let y = parseInt(obj.style.top);

  function animate() {
    // Compute direction vector
    const dx = targetX - x;
    const dy = targetY - y;
    const dist = Math.sqrt(dx*dx + dy*dy);

    // Normalize + scale speed
    const speed = 2;
    x += (dx / dist) * speed;
    y += (dy / dist) * speed;

    obj.style.left = x + 'px';
    obj.style.top = y + 'px';

    if (dist > 5) {
      requestAnimationFrame(animate);
    }
  }

  animate();
}

document.addEventListener('DOMContentLoaded', () => {
  const stickman = document.querySelector('stickman');
  const blackHole = document.getElementById('black-hole');
  
  // Set initial position styles
  stickman.style.position = 'absolute';
  stickman.style.left = '0px';
  stickman.style.top = '0px';

  // Get center coordinates of the black hole
  const bhRect = blackHole.getBoundingClientRect();
  const targetX = bhRect.left + bhRect.width / 2;
  const targetY = bhRect.top + bhRect.height / 2;

  // Start the movement
  moveTowards(targetX, targetY);
});


//--------------------------------------------------------------
// Popup functionality

const aboutBtn = document.getElementById("about-button");
const aboutPopup = document.getElementById("about-popup");
const workBtn = document.getElementById("work-button");
const workPopup = document.getElementById("work-popup");
const contactBtn = document.getElementById("contact-button");
const contactPopup = document.getElementById("contact-popup");
const popups = document.querySelectorAll(".popup");

// Toogle popup button visibility
aboutBtn.addEventListener("click", () => {
  aboutPopup.classList.toggle("hidden");
});
workBtn.addEventListener("click", () => {
  workPopup.classList.toggle("hidden");
});
contactBtn.addEventListener("click", () => {
  contactPopup.classList.toggle("hidden");
});

// Close popup button functionality
const closeBtn1 = aboutPopup.querySelector(".close-btn");
closeBtn1.addEventListener("click", () => {
  aboutPopup.classList.add("hidden");
});
const closeBtn2 = workPopup.querySelector(".close-btn");
closeBtn2.addEventListener("click", () => {
  workPopup.classList.add("hidden");
});
const closeBtn3 = contactPopup.querySelector(".close-btn");
closeBtn3.addEventListener("click", () => {
  contactPopup.classList.add("hidden");
});


// popup drag functionality

let dragTarget = null;
let offsetX = 0;
let offsetY = 0;
let topZIndex = 10;

function makeDraggable(popup) {
  popup.addEventListener("mousedown", (e) => {
    dragTarget = popup;
    offsetX = e.clientX - popup.offsetLeft;
    offsetY = e.clientY - popup.offsetTop;
    popup.style.cursor = "grabbing";
    dragTarget.style.zIndex = 1000;
    topZIndex++;
    popup.style.zIndex = topZIndex;
  });
}

document.addEventListener("mousemove", (e) => {
  if (dragTarget) {
    dragTarget.style.left = `${e.clientX - offsetX}px`;
    dragTarget.style.top = `${e.clientY - offsetY}px`;
  }
});

document.addEventListener("mouseup", () => {
  if (dragTarget) {
    dragTarget.style.cursor = "grab";
    dragTarget = null;
  }
});

const allPopups = [
  document.getElementById("about-popup"),
  document.getElementById("work-popup"),
  document.getElementById("contact-popup")
];

allPopups.forEach((popup, index) => {
  popup.style.zIndex = 10 + index; // Set initial z-index
  makeDraggable(popup);
});


// 3D Model functionality----------------------------------------------------------------------------------

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("model-container").appendChild(renderer.domElement);

// Light
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(2, 2, 5);
scene.add(light);

// Load GLB model
const loader = new THREE.GLTFLoader();
let model;
loader.load("models/Bath.glb", (gltf) => {
  model = gltf.scene;
  scene.add(model);
  model.position.set(0, -1, 0); // adjust position
  camera.position.z = 5;
}, undefined, (error) => {
  console.error(error);
});

// Animation
function animate() {
  requestAnimationFrame(animate);

  if (model) {
    model.rotation.y += 0.002; // slow smooth spin
    model.rotation.x += (Math.random() - 0.5) * 0.0005; // tiny random wobble
  }

  renderer.render(scene, camera);
}
animate();

// Handle resizing
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// scribble dog: script
const scribbleDog = document.getElementById("scribble-dog");
let scribbleDogTimer;

function barkScribbleDog() {
  clearTimeout(scribbleDogTimer);
  scribbleDog.classList.remove("is-barking");
  void scribbleDog.offsetWidth;
  scribbleDog.classList.add("is-barking");
  scribbleDogTimer = setTimeout(() => {
    scribbleDog.classList.remove("is-barking");
  }, 1600);
}

scribbleDog.addEventListener("click", barkScribbleDog);
scribbleDog.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    barkScribbleDog();
  }
});
