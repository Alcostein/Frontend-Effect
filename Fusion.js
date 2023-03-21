import {Mouse} from '../lib/Mouse.js';
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Initialize
let points = [];
let points2 = [];
const particles = [];
let hue = 0;
let angle = 0;
let lastMoveTimestamp = 0;
let distance = 15;
let particleNumNow = 0;

// Mouse

const mouse = new Mouse();

function drawLine(points,hue) {
  for (let i = 1; i < points.length; i++) {
    ctx.beginPath();
    ctx.moveTo(points[i - 1].x, points[i - 1].y);
    ctx.lineTo(points[i].x, points[i].y);
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = `hsla(${hue+180}, 100%, 50%, ${1 - i / points.length})`;
    ctx.shadowBlur = 15;
    ctx.shadowColor = `hsla(${hue}, 100%, 50%, ${1 - i / points.length})`;
    ctx.stroke();
  }
}

function getTrailPoints(x, y, angle, distance) {
  return {
    x: x + distance * Math.cos(angle),
    y: y + distance * Math.sin(angle),
  };
}

// Particle

function createParticle(x, y) {
  const angle = Math.random() * Math.PI * 2;
  const speed = Math.random() / 3;
  const size = Math.random()  + 1;

  particles.push({
    x: x,
    y: y,
    angle: angle,
    speed: speed,
    size: size,
    life: 2,
  });
}

function drawParticle(particle,hue) {
  ctx.beginPath();
  ctx.arc(particle.x, particle.y, 1, 0, Math.PI * 2); 
  ctx.fillStyle = `hsla(${hue}, 100%, 50%,${particle.life})`;
  ctx.shadowBlur = 3;
  ctx.shadowColor = `hsla(${hue}, 100%,  100%)`;
  ctx.fill();
}

function updateParticle(particle) {
  particle.angle += 0.03;
  particle.life -= 0.01;
  particle.speed += 0.001;
  
  particle.x += Math.cos(particle.angle) * particle.speed;
  particle.y += Math.sin(particle.angle) * particle.speed;
  if(particleNumNow > 100) particle.life -= 0.01;
}

// Animation
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (mouse.x !== -1 && mouse.y !== -1) {
    const firstTrailPoint = getTrailPoints(mouse.x, mouse.y, angle, distance);
    points.unshift(firstTrailPoint);

    const secondTrailPoint = getTrailPoints(mouse.x, mouse.y, angle + Math.PI, distance);
    points2.unshift(secondTrailPoint);

    if (points.length > 20) {
      points.pop();
      points2.pop();
    }
  }

  if (points.length > 1) {
    drawLine(points,hue);
    drawLine(points2,hue+180);
  }

  hue = (hue + 0.1) % 360;

  const currentTime = new Date().getTime();
  if (currentTime - lastMoveTimestamp > 10 && distance > 0) {
    distance -= 0.2;
  }
  if(mouse.pressed) {
    if(distance < 2) {
       distance += 5;
      angle += 0.2;
    }else if (distance > 3) {
      distance -= 5;
      angle += 0.2;
    }
  }
    angle += 0.1;

  for (let i = particles.length - 1; i >= 0; i--) {
    const particle = particles[i];

    drawParticle(particle,hue + 7*i);
    updateParticle(particle);

    if (particle.life <= 0) {
      particles.splice(i, 1);
      particleNumNow--;
    }
  }

  requestAnimationFrame(animate);
}

// Event Listeners
document.addEventListener("mousedown", () => {
  mouse.pressed = true;
});

document.addEventListener("mouseup", (event) => {
  const numberOfParticles = 50; 

  for (let i = 0; i < numberOfParticles; i++) {
    createParticle(event.clientX, event.clientY);
    particleNumNow++;
    if(distance < 30) distance += 5;
  }
  mouse.pressed = false;
});

document.addEventListener("pointermove", (event) => {
  lastMoveTimestamp = new Date().getTime();

  if (distance < 15 && !mouse.pressed) {
    distance += 0.2;
  }

  mouse.x = event.clientX;
  mouse.y = event.clientY;
});

animate();

setInterval(() => {
  if (points.length > 1) {
    points.pop();
    points2.pop();
  }
}, 16);
