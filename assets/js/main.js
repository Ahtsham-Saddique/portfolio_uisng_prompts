(() => {
  "use strict";

  // =====================
  // DOM Cache
  // =====================
  const DOM = {
    menuToggle: document.querySelector(".menu-toggle"),
    navLinks: document.querySelector(".nav-links"),
    navItems: document.querySelectorAll(".nav-links a"),
    navbar: document.querySelector(".navbar"),
    scrollProgressBar: document.querySelector(".scroll-progress-bar"),
    scrollBtn: document.getElementById("scrollTop"),
    contactForm: document.querySelector("#whatsapp-contact-form"),
    revealElements: document.querySelectorAll(".reveal"),
    sections: document.querySelectorAll("section[id], header[id]"),
    timeline: document.querySelector(".timeline"),
    bgContainer: document.getElementById("bg-animation-container"),
    fireCanvas: document.getElementById("fireCanvas"),
  };

  // Create overlay element dynamically
  const navOverlay = document.createElement("div");
  navOverlay.className = "nav-overlay";
  document.body.appendChild(navOverlay);

  // Check for Touch Device
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  // =====================
  // Custom Cursor (Desktop Only)
  // =====================
  let cursor, cursorGlow;
  if (!isTouchDevice) {
    cursor = document.createElement("div");
    cursor.id = "custom-cursor";
    cursorGlow = document.createElement("div");
    cursorGlow.id = "cursor-glow";
    document.body.appendChild(cursor);
    document.body.appendChild(cursorGlow);

    document.addEventListener("mousemove", (e) => {
      requestAnimationFrame(() => {
        cursor.style.transform = `translate(${e.clientX - 10}px, ${e.clientY - 10}px)`;
        cursorGlow.style.transform = `translate(${e.clientX - 100}px, ${e.clientY - 100}px)`;
      });
    });

    // Update cursor state on hover
    document.querySelectorAll("a, button").forEach((el) => {
      el.addEventListener("mouseenter", () => cursor.classList.add("cursor-expand"));
      el.addEventListener("mouseleave", () => cursor.classList.remove("cursor-expand"));
    });
  }

  // =====================
  // Mobile Menu Toggle
  // =====================
  if (DOM.menuToggle) {
    const toggleMenu = (active) => {
      DOM.navLinks.classList.toggle("active", active);
      DOM.menuToggle.classList.toggle("active", active);
      navOverlay.classList.toggle("active", active);
      document.body.style.overflow = active ? "hidden" : "";
    };

    DOM.menuToggle.addEventListener("click", () => {
      const isActive = DOM.navLinks.classList.contains("active");
      toggleMenu(!isActive);
    });

    DOM.navItems.forEach((link) => {
      link.addEventListener("click", () => toggleMenu(false));
    });

    navOverlay.addEventListener("click", () => toggleMenu(false));
  }

  // =====================
  // Consolidated Scroll Handler
  // =====================
  const onScroll = () => {
    const scrollY = window.scrollY;

    // Scroll Progress
    if (DOM.scrollProgressBar) {
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrollPercentage = (scrollY / scrollHeight) * 100;
      DOM.scrollProgressBar.style.width = scrollPercentage + "%";
    }

    // Scroll to Top Button
    if (DOM.scrollBtn) {
       DOM.scrollBtn.style.display = scrollY > 300 ? "block" : "none";
    }

    // Navbar Scroll Effect
    if (DOM.navbar) {
      if (scrollY > 50) DOM.navbar.classList.add("scrolled");
      else DOM.navbar.classList.remove("scrolled");
    }

    // Active Nav Highlight
    highlightNavOnScroll(scrollY);

    // Timeline Animation
    animateTimeline();
  };

  const highlightNavOnScroll = (scrollY) => {
    let currentSection = "";

    DOM.sections.forEach((section) => {
      const sectionTop = section.offsetTop - 150;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentSection = section.getAttribute("id");
      }
    });

    if (currentSection) {
      DOM.navItems.forEach((link) => {
        link.classList.remove("active");
        if (link.getAttribute("href") === "#" + currentSection) {
          link.classList.add("active");
        }
      });
    }
  };

  const animateTimeline = () => {
    if (!DOM.timeline) return;
    const timelineRect = DOM.timeline.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    if (timelineRect.top < windowHeight && timelineRect.bottom > 0) {
      const scrollProgress = (windowHeight - timelineRect.top) / (windowHeight + timelineRect.height);
      const drawPercent = Math.min(Math.max(scrollProgress * 150, 0), 100);
      DOM.timeline.style.setProperty("--timeline-height", `${drawPercent}%`);
    }
  };

  window.addEventListener("scroll", onScroll, { passive: true });

  // =====================
  // Animations Helpers (Observer)
  // =====================
  const createAnimationObserver = (startCallback, stopCallback) => {
    return new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) startCallback();
        else stopCallback();
      });
    }, { threshold: 0.1 });
  };

  // =====================
  // Hero Animation (Particle System)
  // =====================
  if (DOM.bgContainer) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    DOM.bgContainer.appendChild(canvas);

    let particles = [];
    let animationId;
    const particleCount = isTouchDevice ? 40 : 80;

    const initCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.color = Math.random() > 0.5 ? "#00f5ff" : "#7f5cff";
        this.opacity = Math.random() * 0.5 + 0.1;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x > canvas.width || this.x < 0 || this.y > canvas.height || this.y < 0) this.reset();
      }
      draw() {
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => { p.update(); p.draw(); });

      for (let i = 0; i < particles.length; i++) {
        for (let j = i; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            ctx.strokeStyle = particles[i].color;
            ctx.globalAlpha = (1 - dist / 150) * 0.2;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      animationId = requestAnimationFrame(animate);
    };

    const start = () => {
      initCanvas();
      particles = Array.from({ length: particleCount }, () => new Particle());
      if (!animationId) animate();
    };

    const stop = () => {
      cancelAnimationFrame(animationId);
      animationId = null;
    };

    createAnimationObserver(start, stop).observe(DOM.bgContainer);
    window.addEventListener("resize", initCanvas, { passive: true });
  }

  // =====================
  // Footer Fire Animation
  // =====================
  if (DOM.fireCanvas) {
    const fctx = DOM.fireCanvas.getContext("2d");
    let f_width, f_height, fireParticles = [], fireAnimationId;

    const resizeFire = () => {
      f_width = DOM.fireCanvas.width = DOM.fireCanvas.parentElement.offsetWidth;
      f_height = DOM.fireCanvas.height = DOM.fireCanvas.parentElement.offsetHeight;
    };

    class FireParticle {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * f_width;
        this.y = f_height + Math.random() * 20;
        this.size = Math.random() * 15 + 10;
        this.speedY = Math.random() * 2 + 1;
        this.life = 1;
        this.death = Math.random() * 0.03 + 0.01;
        this.color = `hsla(${Math.random() * 20 + 15}, 100%, 50%, `;
      }
      update() {
        this.y -= this.speedY;
        this.life -= this.death;
        if (this.life <= 0) this.reset();
      }
      draw() {
        fctx.fillStyle = this.color + this.life + ")";
        fctx.beginPath();
        fctx.arc(this.x, this.y, this.size * this.life, 0, Math.PI * 2);
        fctx.fill();
      }
    }

    const animateFire = () => {
      fctx.clearRect(0, 0, f_width, f_height);
      fireParticles.forEach(p => { p.update(); p.draw(); });
      fireAnimationId = requestAnimationFrame(animateFire);
    };

    const start = () => {
      resizeFire();
      fireParticles = Array.from({ length: 30 }, () => new FireParticle());
      if (!fireAnimationId) animateFire();
    };

    const stop = () => {
      cancelAnimationFrame(fireAnimationId);
      fireAnimationId = null;
    };

    createAnimationObserver(start, stop).observe(DOM.fireCanvas);
    window.addEventListener("resize", resizeFire, { passive: true });
  }

  // =====================
  // Initializations
  // =====================
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add("active"); });
  }, { threshold: 0.1 });
  DOM.revealElements.forEach(el => revealObserver.observe(el));

  // Card Tilt (Desktop Only)
  if (!isTouchDevice) {
    document.querySelectorAll(".project-card").forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left, y = e.clientY - rect.top;
        card.style.setProperty("--mouse-x", `${x}px`);
        card.style.setProperty("--mouse-y", `${y}px`);
        const rotateX = (y - rect.height / 2) / 20, rotateY = (rect.width / 2 - x) / 20;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
      });
      card.addEventListener("mouseleave", () => card.style.transform = "");
    });

    document.querySelectorAll(".skill-card").forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) * 0.3;
        const y = (e.clientY - rect.top - rect.height / 2) * 0.3;
        card.style.transform = `translate(${x}px, ${y}px)`;
      });
      card.addEventListener("mouseleave", () => card.style.transform = "");
    });
  }

  // Forms
  if (DOM.contactForm) {
    DOM.contactForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      const submitBtn = this.querySelector('button[type="submit"]'), originalText = submitBtn.textContent;
      submitBtn.textContent = "Sending..."; submitBtn.disabled = true;
      try {
        const response = await fetch(this.action, { method: "POST", body: new FormData(this), headers: { Accept: "application/json" } });
        if (response.ok) {
          submitBtn.textContent = "Sent! ✓"; this.reset();
          setTimeout(() => { submitBtn.textContent = originalText; submitBtn.disabled = false; }, 3000);
        } else throw new Error();
      } catch (err) {
        submitBtn.textContent = "Error!"; submitBtn.disabled = false;
        alert("Failed to send message.");
      }
    });
  }

  // Smooth Scroll
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) target.scrollIntoView({ behavior: "smooth" });
    });
  });

  console.log("%c🚀 Production Build Loaded Successfully!", "color: #00f5ff; font-weight: bold; font-size: 14px;");
})();
