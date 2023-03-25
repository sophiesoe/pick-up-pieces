window.addEventListener("load", () => {
  const c = document.getElementById("canvas1");
  const ctx = c.getContext("2d");
  c.width = window.innerWidth;
  c.height = window.innerHeight;
  const image = document.getElementById("img1");

  class Particle {
    constructor(effect, x, y, color) {
      this.effect = effect;
      this.x = Math.random() * this.effect.width;
      this.y = Math.random() * this.effect.height;
      this.originalX = Math.floor(x);
      this.originalY = Math.floor(y);
      this.color = color;
      this.size = this.effect.gap;
      this.vx = 0;
      this.vy = 0;
      this.ease = 0.08;
      this.dy = 0;
      this.dx = 0;
      this.force = 0;
      this.distance = 0;
      this.angle = 0;
      this.friction = 0.95;
    }
    draw(context) {
      context.fillStyle = this.color;
      context.fillRect(this.x, this.y, this.size, this.size);
    }
    update() {
      this.dx = this.effect.mouse.x - this.x;
      this.dy = this.effect.mouse.y - this.y;
      this.distance = this.dx * this.dx + this.dy * this.dy;
      this.force = -this.effect.mouse.radius / this.distance;
      if (this.distance < this.effect.mouse.radius) {
        this.angle = Math.atan2(this.dy, this.dx);
        this.vx += this.force * Math.cos(this.force);
        this.vy += this.force * Math.sin(this.force);
      }
      this.x +=
        (this.vx *= this.friction) + (this.originalX - this.x) * this.ease;
      this.y +=
        (this.vy *= this.friction) + (this.originalY - this.y) * this.ease;
    }
    wrap() {
      this.x = Math.random() * this.effect.width;
      this.y = Math.random() * this.effect.height;
      this.ease = 0.03;
    }
  }

  class Effect {
    constructor(width, height) {
      this.width = width;
      this.height = height;
      this.particleArray = [];
      this.image = document.getElementById("img1");
      this.centerX = this.width * 0.5;
      this.centerY = this.height * 0.5;
      this.x = this.centerX - this.image.width * 0.5;
      this.y = this.centerY - this.image.height * 0.5;
      this.gap = 2;
      this.mouse = {
        x: undefined,
        y: undefined,
        radius: 3000,
      };
      window.addEventListener("mousemove", (e) => {
        this.mouse.x = e.x;
        this.mouse.y = e.y;
      });
    }
    init(context) {
      context.drawImage(this.image, this.x, this.y);
      const pixels = context.getImageData(0, 0, this.width, this.height).data;
      for (let y = 0; y < this.height; y += this.gap) {
        for (let x = 0; x < this.width; x += this.gap) {
          const index = (y * this.width + x) * 4;
          const red = pixels[index];
          const green = pixels[index + 1];
          const blue = pixels[index + 2];
          const alpha = pixels[index + 3];
          const color = `rgb(${red}, ${green}, ${blue})`;
          if (alpha > 0) {
            this.particleArray.push(new Particle(this, x, y, color));
          }
        }
      }
    }
    draw(context) {
      this.particleArray.forEach((particle) => particle.draw(context));
    }
    update() {
      this.particleArray.forEach((particle) => particle.update());
    }
    wrap() {
      this.particleArray.forEach((particle) => particle.wrap());
    }
  }
  const effect = new Effect(c.width, c.height);
  effect.init(ctx);

  function animate() {
    ctx.clearRect(0, 0, c.width, c.height);
    effect.draw(ctx);
    effect.update();
    requestAnimationFrame(animate);
  }
  animate();
  const wrapBtn = document.getElementById("wrapBtn");
  wrapBtn.addEventListener("click", () => {
    effect.wrap();
  });
});
