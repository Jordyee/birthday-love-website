const body = document.body;
const intro = document.getElementById("intro");
const openGift = document.getElementById("openGift");
const mainContent = document.getElementById("mainContent");
const musicToggle = document.getElementById("musicToggle");
const musicLabel = document.getElementById("musicLabel");
const backgroundMusic = document.getElementById("backgroundMusic");
const progressBar = document.getElementById("progressBar");

let isMusicPlaying = false;

function startMusic() {
  if (isMusicPlaying || !backgroundMusic) return;
  backgroundMusic.muted = false;
  backgroundMusic.volume = 1;
  const playAttempt = backgroundMusic.play();
  if (!playAttempt) return;
  playAttempt.then(() => {
    isMusicPlaying = true;
    musicToggle.classList.add("playing");
    musicLabel.textContent = "Our song is playing";
    musicToggle.setAttribute("aria-label", "Hentikan lagu");
  }).catch(() => {
    musicToggle.classList.remove("playing");
    musicLabel.textContent = "Tap here to play ♫";
    musicToggle.setAttribute("aria-label", "Tap untuk memutar lagu");
  });
}

function stopMusic() {
  backgroundMusic.pause();
  isMusicPlaying = false;
  musicToggle.classList.remove("playing");
  musicLabel.textContent = "Play our song";
  musicToggle.setAttribute("aria-label", "Putar lagu Out Of My League");
}

openGift.addEventListener("click", () => {
  // Keep playback inside this direct user gesture; mobile browsers reject delayed autoplay.
  startMusic();
  intro.classList.add("opened");
  body.classList.remove("locked");
  body.classList.add("started");
  mainContent.setAttribute("aria-hidden", "false");
  setTimeout(() => intro.remove(), 900);
});

musicToggle.addEventListener("click", () => isMusicPlaying ? stopMusic() : startMusic());

window.addEventListener("scroll", () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
}, { passive: true });

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });
document.querySelectorAll(".reveal").forEach((item) => observer.observe(item));

const strip = document.getElementById("photoStrip");
let isDragging = false;
let dragStartX = 0;
let initialScrollLeft = 0;

strip.addEventListener("pointerdown", (event) => {
  isDragging = true;
  dragStartX = event.clientX;
  initialScrollLeft = strip.scrollLeft;
  strip.classList.add("grabbing");
  strip.setPointerCapture(event.pointerId);
});
strip.addEventListener("pointermove", (event) => {
  if (!isDragging) return;
  strip.scrollLeft = initialScrollLeft - (event.clientX - dragStartX) * 1.4;
});
strip.addEventListener("pointerup", () => {
  isDragging = false;
  strip.classList.remove("grabbing");
});
strip.addEventListener("pointercancel", () => {
  isDragging = false;
  strip.classList.remove("grabbing");
});

const traitMessage = document.getElementById("traitMessage");
document.querySelectorAll(".trait").forEach((trait) => {
  trait.addEventListener("click", () => {
    document.querySelectorAll(".trait").forEach((item) => item.classList.remove("active"));
    trait.classList.add("active");
    traitMessage.textContent = trait.dataset.note;
  });
});

const reasonCards = [...document.querySelectorAll(".reason-card")];
const reasonCount = document.getElementById("reasonCount");
let reasonIndex = 0;

function showReason(nextIndex, direction = 1) {
  reasonCards[reasonIndex].classList.remove("active");
  reasonCards[reasonIndex].classList.toggle("exit-left", direction > 0);
  reasonIndex = (nextIndex + reasonCards.length) % reasonCards.length;
  reasonCards.forEach((card, index) => {
    if (index !== reasonIndex) card.classList.remove("active");
    setTimeout(() => card.classList.remove("exit-left"), 560);
  });
  reasonCards[reasonIndex].classList.add("active");
  reasonCount.textContent = `${reasonIndex + 1} / ${reasonCards.length}`;
}
document.getElementById("nextReason").addEventListener("click", () => showReason(reasonIndex + 1, 1));
document.getElementById("prevReason").addEventListener("click", () => showReason(reasonIndex - 1, -1));

const catchHeart = document.getElementById("catchHeart");
const heartGame = document.getElementById("heartGame");
const heartScore = document.getElementById("heartScore");
const secretMessage = document.getElementById("secretMessage");
let score = 0;

function moveHeart() {
  const padding = 80;
  const maxX = Math.max(0, heartGame.clientWidth - padding);
  const maxY = Math.max(0, heartGame.clientHeight - padding);
  catchHeart.style.left = `${Math.random() * maxX}px`;
  catchHeart.style.top = `${Math.random() * maxY}px`;
}

catchHeart.addEventListener("click", () => {
  score += 1;
  heartScore.textContent = score;
  burstHearts(catchHeart.getBoundingClientRect());
  if (score >= 5) {
    catchHeart.hidden = true;
    secretMessage.classList.add("show");
  } else {
    moveHeart();
  }
});
window.addEventListener("resize", () => { if (score < 5) moveHeart(); });

function burstHearts(rect) {
  for (let i = 0; i < 6; i += 1) {
    const heart = document.createElement("span");
    heart.textContent = "♡";
    heart.style.cssText = `
      position:fixed;z-index:140;left:${rect.left + rect.width / 2}px;top:${rect.top}px;
      color:#d84b6a;font-size:${18 + Math.random() * 18}px;pointer-events:none;
      transition:transform .8s ease,opacity .8s ease;
    `;
    document.body.appendChild(heart);
    requestAnimationFrame(() => {
      heart.style.transform = `translate(${(Math.random() - .5) * 150}px,${-50 - Math.random() * 90}px) rotate(${Math.random() * 80 - 40}deg)`;
      heart.style.opacity = "0";
    });
    setTimeout(() => heart.remove(), 850);
  }
}

const envelope = document.getElementById("envelope");
const loveLetter = document.getElementById("loveLetter");
envelope.addEventListener("click", () => {
  if (envelope.classList.contains("open")) return;
  envelope.classList.add("open");
  setTimeout(() => {
    loveLetter.classList.add("show");
    loveLetter.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 1050);
});

const shyBtn = document.getElementById("shyBtn");
const shyCaption = document.getElementById("shyCaption");
const shyLines = [
  "Hehe, tombolnya malu… coba lagi.",
  "Jawaban itu kayaknya kurang yakin 🤭",
  "Masa Vell tega sama Sandroo?",
  "Oke, tombol ini resmi menyerah ♡"
];
let shyAttempts = 0;

function dodgeShyButton() {
  const area = document.getElementById("answerButtons");
  const bounds = area.getBoundingClientRect();
  const maxX = Math.max(10, bounds.width - shyBtn.offsetWidth);
  const maxY = 80;
  shyBtn.style.position = "absolute";
  shyBtn.style.left = `${Math.random() * maxX}px`;
  shyBtn.style.top = `${Math.random() * maxY}px`;
  shyCaption.textContent = shyLines[Math.min(shyAttempts, shyLines.length - 1)];
  shyAttempts += 1;
  if (shyAttempts >= 4) {
    shyBtn.textContent = "Boleh juga deh ♡";
    shyBtn.removeEventListener("pointerenter", dodgeShyButton);
    shyBtn.removeEventListener("click", dodgeShyButton);
    shyBtn.addEventListener("click", celebrate, { once: true });
  }
}
shyBtn.addEventListener("pointerenter", dodgeShyButton);
shyBtn.addEventListener("click", dodgeShyButton);

const celebration = document.getElementById("celebration");
document.getElementById("yesBtn").addEventListener("click", celebrate);
document.getElementById("closeCelebration").addEventListener("click", closeCelebration);
celebration.addEventListener("click", (event) => {
  if (event.target === celebration) closeCelebration();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && celebration.classList.contains("show")) closeCelebration();
});

function celebrate() {
  celebration.classList.add("show");
  body.classList.add("locked");
  launchConfetti();
  document.getElementById("closeCelebration").focus();
}
function closeCelebration() {
  celebration.classList.remove("show");
  body.classList.remove("locked");
}

function launchConfetti() {
  const canvas = document.getElementById("confettiCanvas");
  const ctx = canvas.getContext("2d");
  const colors = ["#d84b6a", "#f89ab0", "#ffd9e2", "#fff3e3", "#ffffff"];
  const particles = Array.from({ length: 150 }, () => ({
    x: Math.random() * window.innerWidth,
    y: -20 - Math.random() * window.innerHeight * .45,
    size: 5 + Math.random() * 8,
    speed: 2 + Math.random() * 4,
    drift: (Math.random() - .5) * 2.2,
    rotation: Math.random() * Math.PI,
    color: colors[Math.floor(Math.random() * colors.length)]
  }));
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  let frame = 0;
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p) => {
      p.y += p.speed;
      p.x += p.drift;
      p.rotation += .08;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 3, p.size, p.size * .65);
      ctx.restore();
    });
    frame += 1;
    if (frame < 260) requestAnimationFrame(draw);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  draw();
}
