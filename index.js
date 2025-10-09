AOS.init({
      duration: 1200,
      once: true
    });


    
    // 🦋 Реалистическое плавание фигур
class FloatingShape {
  constructor(svgTemplate) {
    this.element = svgTemplate.cloneNode(true);
    this.element.classList.add('floating-decor');
    document.body.appendChild(this.element);

    this.x = Math.random() * window.innerWidth;
    this.y = Math.random() * window.innerHeight;
    this.angle = Math.random() * Math.PI * 2;
    this.speed = 0.3 + Math.random() * 0.5;
    this.element.style.opacity = '0.1';

    const g = this.element.querySelector('g');
    if (g) {
      g.style.transformOrigin = 'center';
    }
  }

  update() {
    this.angle += Math.sin(Date.now() / 2000 + this.x) * 0.002;
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed;

    if (this.x < -150) this.x = window.innerWidth + 150;
    if (this.x > window.innerWidth + 150) this.x = -150;
    if (this.y < -150) this.y = window.innerHeight + 150;
    if (this.y > window.innerHeight + 150) this.y = -150;

    const rotation = this.angle * 180 / Math.PI;
    this.element.style.transform = `translate(${this.x}px, ${this.y}px) rotate(${rotation}deg)`;
  }
}

window.addEventListener("DOMContentLoaded", () => {
  const svgTemplate = document.querySelector('.decor-top-left');
  if (svgTemplate) {
    const shapes = [];
    const totalShapes = 8; // количество "бабочек"

    for (let i = 0; i < totalShapes; i++) {
      const shape = new FloatingShape(svgTemplate);
      shapes.push(shape);
    }

    // Прячем оригинальные svg-шаблоны
    svgTemplate.style.opacity = '0';
    svgTemplate.style.pointerEvents = 'none';
    svgTemplate.style.position = 'absolute';
    svgTemplate.style.left = '-9999px';

    const bottomSvg = document.querySelector('.decor-bottom-right');
    if (bottomSvg) {
      bottomSvg.style.opacity = '0';
      bottomSvg.style.pointerEvents = 'none';
      bottomSvg.style.position = 'absolute';
      bottomSvg.style.left = '-9999px';
    }

    // Анимация
    function animate() {
      shapes.forEach(shape => shape.update());
      requestAnimationFrame(animate);
    }
    animate();
  }
});


const words = ["mystical", "atmospheric", "team", "Interesting", "frightening"];
const span = document.getElementById("randomword");
const rotator = document.querySelector(".rotator");

function getRandomWord(exclude) {
  if (words.length <= 1) return words[0] || "";
  let pick;
  do {
    pick = words[Math.floor(Math.random() * words.length)];
  } while (pick === exclude);
  return pick;
}

function changeWord() {
  span.classList.add("fade-out");
  setTimeout(() => {
    span.textContent = getRandomWord(span.textContent);
    span.classList.remove("fade-out");
    span.classList.add("fade-in");
    setTimeout(() => span.classList.remove("fade-in"), 500);
  }, 500);
}

setInterval(changeWord, 3000);


document.addEventListener("DOMContentLoaded", async () => {
  const reviewText = document.querySelector(".review");
  const username = document.querySelector(".username");
  const userAvatar = document.getElementById("User-avatar");
  const dots = document.querySelectorAll(".dot-fill");

  let users = [];
  let currentIndex = 0;
  const interval = 8000; // 8 секунд
  let autoSwitch; // хранит setInterval, чтобы сбрасывать при клике

  // Загружаем users.json
    try {
    const response = await fetch("users.json");
    if (!response.ok) throw new Error("Ошибка загрузки users.json");
    users = await response.json();
  } catch (error) {
    console.error("Ошибка загрузки данных:", error);
    return;
  }

  if (!users.length) return;

  function updateReview() {
    const user = users[currentIndex];
    const card = document.querySelector(".user-card");
    card.style.opacity = 0;

    setTimeout(() => {
      reviewText.innerHTML = user.text;
      username.textContent = user.name;
      userAvatar.src = user.avatar;
      card.style.opacity = 1;
    }, 500);
  }

  function resetDots() {
    dots.forEach(dot => {
      dot.style.transition = "none";
      dot.style.transform = "scaleX(0)";
      dot.parentElement.classList.remove("active");
    });
  }

  function animateDot(index) {
    resetDots();
    const activeDot = dots[index];
    activeDot.parentElement.classList.add("active");
    void activeDot.offsetWidth;
    activeDot.style.transition = `transform ${interval}ms linear`;
    activeDot.style.transform = "scaleX(1)";
  }

  function startAutoSwitch() {
    autoSwitch = setInterval(() => {
      currentIndex = (currentIndex + 1) % users.length;
      updateReview();
      animateDot(currentIndex);
    }, interval);
  }

  function stopAutoSwitch() {
    clearInterval(autoSwitch);
  }

  // ✅ Добавляем обработчик клика по точкам
  dots.forEach((dot, index) => {
    dot.parentElement.addEventListener("click", () => {
      stopAutoSwitch();
      currentIndex = index;
      updateReview();
      animateDot(currentIndex);
      startAutoSwitch(); // после клика таймер запускается заново
    });
  });

  // Первая загрузка
  updateReview();
  animateDot(currentIndex);
  startAutoSwitch();
});


  const video = document.getElementById("loopVideo");
let playingBackward = false;

video.addEventListener("loadedmetadata", () => {
  video.currentTime = 0;
  playForward();
});

function playForward() {
  playingBackward = false;
  video.playbackRate = 1;
  video.play();

  video.onended = () => {
    video.pause();
    playBackward();
  };
}

function playBackward() {
  playingBackward = true;
  video.pause();
  reverseFrame();
}

function reverseFrame() {
  if (!playingBackward) return;

  video.currentTime -= 1 / 60; // 60 кадров в секунду

  if (video.currentTime <= 0) {
    playForward();
    return;
  }

  requestAnimationFrame(reverseFrame);
}
