// ---------- Theme toggle (saved in localStorage) ----------
const root = document.documentElement;
const themeBtn = document.getElementById("themeBtn");

function applyTheme(theme) {
  root.dataset.theme = theme;
  themeBtn.setAttribute("aria-label", theme === "dark" ? "Switch to light theme" : "Switch to dark theme");
}
applyTheme(root.dataset.theme === "dark" ? "dark" : "light");

themeBtn.addEventListener("click", () => {
  const next = root.dataset.theme === "dark" ? "light" : "dark";
  applyTheme(next);
  try { localStorage.setItem("theme", next); } catch (e) {}
});

// ---------- Mobile navigation ----------
const menuBtn = document.getElementById("menuBtn");
const siteNav = document.getElementById("siteNav");

function setMenu(open) {
  siteNav.classList.toggle("open", open);
  menuBtn.setAttribute("aria-expanded", String(open));
  menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
}
menuBtn.addEventListener("click", () => setMenu(!siteNav.classList.contains("open")));
document.addEventListener("keydown", e => { if (e.key === "Escape") setMenu(false); });
document.addEventListener("click", e => {
  if (!siteNav.contains(e.target) && !menuBtn.contains(e.target)) setMenu(false);
});

// ---------- Footer year ----------
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ---------- About page: carousel ----------
const slidesEl = document.getElementById("slides");
if (slidesEl) {
  const slides = slidesEl.children;
  const dotsEl = document.getElementById("dots");
  let index = 0;

  for (let i = 0; i < slides.length; i++) {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("aria-label", "Go to slide " + (i + 1));
    dot.addEventListener("click", () => show(i));
    dotsEl.appendChild(dot);
  }

  function show(i) {
    index = (i + slides.length) % slides.length;
    slidesEl.style.transform = "translateX(-" + index * 100 + "%)";
    [...dotsEl.children].forEach((d, n) => d.setAttribute("aria-current", String(n === index)));
  }

  document.getElementById("prevBtn").addEventListener("click", () => show(index - 1));
  document.getElementById("nextBtn").addEventListener("click", () => show(index + 1));
  document.getElementById("carousel").addEventListener("keydown", e => {
    if (e.key === "ArrowLeft") show(index - 1);
    if (e.key === "ArrowRight") show(index + 1);
  });

  // Swipe on touch screens
  let startX = null;
  slidesEl.addEventListener("touchstart", e => { startX = e.touches[0].clientX; }, { passive: true });
  slidesEl.addEventListener("touchend", e => {
    if (startX === null) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) show(index + (dx < 0 ? 1 : -1));
    startX = null;
  });

  show(0);
}

// ---------- Contact page: form validation and feedback ----------
const form = document.getElementById("contactForm");
if (form) {
  const status = document.getElementById("status");
  const fields = {
    name: v => (v ? "" : "Enter your name."),
    email: v => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "" : "Enter an email address like name@example.com."),
    message: v => (v.length >= 10 ? "" : "Write a message of at least 10 characters.")
  };

  function check(name) {
    const input = form.elements[name];
    const error = fields[name](input.value.trim());
    document.getElementById(name + "Err").textContent = error;
    input.closest(".field").classList.toggle("invalid", Boolean(error));
    input.setAttribute("aria-invalid", String(Boolean(error)));
    return !error;
  }

  Object.keys(fields).forEach(name => {
    form.elements[name].addEventListener("blur", () => check(name));
    form.elements[name].addEventListener("input", () => {
      if (form.elements[name].closest(".field").classList.contains("invalid")) check(name);
    });
  });

  form.addEventListener("submit", e => {
    e.preventDefault();
    status.className = "status";
    const valid = Object.keys(fields).map(check).every(Boolean);
    if (!valid) { status.textContent = "Fix the highlighted fields and try again."; return; }

    const name = form.elements.name.value.trim();
    const email = form.elements.email.value.trim();
    const message = form.elements.message.value.trim();
    const subject = encodeURIComponent("Portfolio message from " + name);
    const body = encodeURIComponent(message + "\n\nFrom: " + name + " (" + email + ")");

    status.textContent = "Thanks, " + name + "! Your email app is opening so you can send the message.";
    status.classList.add("ok");
    window.location.href = "mailto:roshinikumari015018@gmail.com?subject=" + subject + "&body=" + body;
    form.reset();
  });
}