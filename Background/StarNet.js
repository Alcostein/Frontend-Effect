import {Mouse} from '../../lib/Mouse.js';
const bgCanvas = document.getElementById("bgCanvas");
const bgCtx = bgCanvas.getContext("2d");

// Initialize
bgCanvas.width = window.innerWidth;
bgCanvas.height = window.innerHeight;
const stars = [];
const starCount = 150;

const mouse = new Mouse();

// Event Listeners
window.addEventListener('mousemove', (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

window.addEventListener('mousedown', (e) => {
  mouse.pressed = true;
});

window.addEventListener('mouseup', (e) => {
  mouse.pressed = false;
});

// Stars
class Star {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = Math.random() * 2 + 1;
    this.connections = [];
    this.speed = Math.random() * 0.05 + 0.05;
    this.originalSpeed = this.speed;
    this.angle = Math.random() * Math.PI * 2;
  }

  draw() {
    bgCtx.beginPath();
    bgCtx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    bgCtx.fillStyle = `hsla(${200}, 100%, 50%, 1)`;
    bgCtx.fill();
    bgCtx.closePath();
  }

  update() {
    const dx = this.x - mouse.x;
    const dy = this.y - mouse.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (mouse.pressed & distance < 100) {
      this.x -= dx / distance * 10;
      this.y -= dy / distance * 10;
      this.speed = Math.max(this.speed, Math.sqrt(dx * dx + dy * dy) / 20);
    }else if (this.speed > this.originalSpeed) {
      this.speed -= 0.005;
    }
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed;

    if (this.x < 0 || this.x > bgCanvas.width) {
      this.angle = Math.PI - this.angle;
    }
    if (this.y < 0 || this.y > bgCanvas.height) {
      this.angle = -this.angle;
    }

    this.angle += Math.random() * 0.05 - 0.025;
  }
}


// Create Stars
for (let i = 0; i < starCount; i++) {
  const x = Math.random() * bgCanvas.width;
  const y = Math.random() * bgCanvas.height;
  stars.push(new Star(x, y));
}

// connect stars
function connectStars() {
  for (let i = 0; i < stars.length; i++) {
    for (let j = i + 1; j < stars.length; j++) {
      const dx = stars[i].x - stars[j].x
      const dy = stars[i].y - stars[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 100) {
        bgCtx.beginPath();
        bgCtx.moveTo(stars[i].x, stars[i].y);
        bgCtx.lineTo(stars[j].x, stars[j].y);
        bgCtx.strokeStyle = `rgba(255, 255, 255, ${1 - distance / 100})`;
        bgCtx.lineWidth = 0.5;
        bgCtx.stroke();
        bgCtx.closePath();

        stars[i].connections.push(stars[j]);
        stars[j].connections.push(stars[i]);
      }
    }
  }
}

// Animation Loop
function drawBackground() {
  bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
  connectStars();
  for (const star of stars) {
    star.draw();
    star.update();
  }
  requestAnimationFrame(drawBackground);
}

drawBackground();

