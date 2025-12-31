/* =====================================================
   SAFE DOM READY
===================================================== */
document.addEventListener("DOMContentLoaded", () => {

  /* =====================================================
     AUDIO SETUP
  ===================================================== */
  const bgMusic = document.getElementById("bgMusic");

  const heartBeat = new Audio("audio/heartbeat.mp3");
  heartBeat.loop = true;
  heartBeat.volume = 0.6;

  const loveMusic = new Audio("audio/love.mp3");
  loveMusic.loop = true;
  loveMusic.volume = 0.7;

  let musicEnabled = false;

  /* Enable audio after first user interaction (browser-safe) */
  document.addEventListener("click", () => {
    musicEnabled = true;
  }, { once: true });

  /* Toggle background music manually */
  window.toggleMusic = function () {
    if (!musicEnabled || !bgMusic) return;

    bgMusic.volume = 0.6;
    bgMusic.paused ? bgMusic.play() : bgMusic.pause();
  };

  /* =====================================================
     SMOOTH SCROLL
  ===================================================== */
  window.scrollToSection = function (id) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  /* =====================================================
     FLOATING HEARTS
  ===================================================== */
  const heartContainer = document.getElementById("heart-container");

  setInterval(() => {
    if (!heartContainer) return;

    const heart = document.createElement("div");
    heart.className = "heart";
    heart.textContent = "❤️";
    heart.style.left = Math.random() * 100 + "vw";
    heart.style.fontSize = Math.random() * 18 + 14 + "px";

    heartContainer.appendChild(heart);
    setTimeout(() => heart.remove(), 6000);
  }, 900);

  /* =====================================================
     CINEMATIC COUNTDOWN
  ===================================================== */
  const targetDate = new Date("January 1, 2026 00:00:00").getTime();
  const timer = document.getElementById("timer");
  const waitMessage = document.getElementById("waitMessage");
  const countdownScreen = document.getElementById("countdownScreen");
  const newYearContent = document.getElementById("newYearContent");

  /* Start heartbeat slightly after page loads */
  setTimeout(() => {
    if (musicEnabled) heartBeat.play().catch(() => {});
  }, 1200);

  const countdownInterval = setInterval(() => {
    const diff = targetDate - Date.now();

    if (diff <= 0) {
      clearInterval(countdownInterval);

      timer.innerHTML = "🎆 HAPPY NEW YEAR 🎆";
      waitMessage.innerText = "This moment is ours ❤️";

      /* Stop heartbeat */
      heartBeat.pause();
      heartBeat.currentTime = 0;

      /* Start love music */
      if (musicEnabled) loveMusic.play().catch(() => {});

      /* Fireworks blast */
      launchFireworks();

      setTimeout(() => {
        countdownScreen.style.display = "none";
        document.body.classList.remove("countdown-lock");
        newYearContent.style.display = "block";
        scrollToSection("chats");
      }, 5000);

      return;
    }

    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff / 3600000) % 24);
    const m = Math.floor((diff / 60000) % 60);
    const s = Math.floor((diff / 1000) % 60);

    timer.innerHTML = `${d}d ${h}h ${m}m ${s}s`;
  }, 1000);

  /* =====================================================
     FIREWORKS (BOTTOM BLASTS)
  ===================================================== */
  const canvas = document.getElementById("fireworks");
  const ctx = canvas?.getContext("2d");

  function launchFireworks() {
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.display = "block";

    let particles = [];

    function blast() {
      const x = Math.random() * canvas.width;
      const y = canvas.height - 40;

      for (let i = 0; i < 90; i++) {
        particles.push({
          x,
          y,
          dx: (Math.random() - 0.5) * 6,
          dy: Math.random() * -8 - 2,
          life: 100,
          color: `hsl(${Math.random() * 360},100%,60%)`
        });
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
        p.x += p.dx;
        p.y += p.dy;
        p.life--;
      });

      particles = particles.filter(p => p.life > 0);
      if (particles.length > 0) requestAnimationFrame(animate);
    }

    let count = 0;
    const interval = setInterval(() => {
      blast();
      count++;
      if (count > 8) clearInterval(interval);
    }, 600);

    animate();
  }

  /* =====================================================
     CHAT ANIMATION
  ===================================================== */
  const chats = [
    { text: "Do you remember our first talk?", side: "left" },
    { text: "From strangers to something special 💕", side: "right" },
    { text: "Snapchat se shuru hui kahaani…", side: "left" },
    { text: "Aur pata hi nahi chala kab tum meri aadat ban gayi ❤️", side: "right" },
    { text: "Every message from you made my day brighter ✨", side: "left" }
  ];

  let chatIndex = 0;
  const chatBox = document.getElementById("chatBox");
  const typing = document.getElementById("typing");

  function showChat() {
    if (chatIndex >= chats.length) {
      typing.style.display = "none";
      return;
    }

    typing.style.display = "block";

    setTimeout(() => {
      typing.style.display = "none";
      const msg = document.createElement("div");
      msg.className = `chat ${chats[chatIndex].side}`;
      msg.innerText = chats[chatIndex].text;
      chatBox.appendChild(msg);
      chatIndex++;
      setTimeout(showChat, 1200);
    }, 800);
  }

  window.addEventListener("scroll", () => {
    if (window.scrollY > 300 && chatIndex === 0) showChat();
  });

  /* =====================================================
     VIDEO CONTROLS
  ===================================================== */
  const video = document.getElementById("memoryVideo");
  const playBtn = document.getElementById("playBtn");
  const soundBtn = document.getElementById("soundBtn");

  window.playVideo = function () {
    if (!video) return;

    video.play();
    playBtn.style.display = "none";
    soundBtn.style.display = "block";
    loveMusic.pause();
  };

  window.toggleVideoSound = function () {
    if (!video) return;
    video.muted = !video.muted;
    soundBtn.innerText = video.muted ? "🔇" : "🔊";
  };

  video?.addEventListener("ended", () => {
    playBtn.style.display = "flex";
    soundBtn.style.display = "none";
    video.currentTime = 0;
    if (musicEnabled) loveMusic.play().catch(() => {});
  });

});
