// static/script.js

// =========================
// Mobile Navigation Toggle
// =========================
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

menuToggle.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});

// Close menu when link clicked
document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("active");
  });
});

// =========================
// Sticky Navbar Shadow
// =========================
const navbar = document.querySelector(".navbar");

window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
}, { passive: true });

// =========================
// Scroll Reveal Animation
// =========================
const reveals = document.querySelectorAll(".reveal");

const revealOnScroll = () => {
  reveals.forEach(el => {
    const windowHeight = window.innerHeight;
    const elementTop = el.getBoundingClientRect().top;

    if (elementTop < windowHeight - 100) {
      el.classList.add("active");
    }
  });
};

window.addEventListener("scroll", revealOnScroll, { passive: true });

// =========================
// Contact Form Submission
// =========================
const form = document.querySelector(".legal-form");
const statusMsg = document.getElementById("formStatus");

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const inputs = form.querySelectorAll("input, textarea");
  let valid = true;

  inputs.forEach(input => {
    if (!input.value.trim()) {
      valid = false;
      input.style.borderColor = "red";
    } else {
      input.style.borderColor = "rgba(255,255,255,0.2)";
    }
  });

  if (!valid) return;

  const btn = form.querySelector("button[type='submit']");
  btn.disabled = true;
  btn.textContent = "Sending...";
  statusMsg.style.display = "none";

  try {
    const res = await fetch("/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.querySelector("input[name='name']").value,
        email: form.querySelector("input[name='email']").value,
        message: form.querySelector("textarea[name='message']").value
      })
    });

    const data = await res.json();

    if (res.ok) {
      statusMsg.textContent = "✅ Message received. I'll be in touch shortly.";
      statusMsg.style.color = "#c9a84c";
      form.reset();
    } else {
      statusMsg.textContent = "❌ " + (data.error || "Something went wrong. Please try again.");
      statusMsg.style.color = "#ff6b6b";
    }
  } catch (err) {
    statusMsg.textContent = "❌ Network error. Please try again.";
    statusMsg.style.color = "#ff6b6b";
  }

  statusMsg.style.display = "block";
  btn.disabled = false;
  btn.textContent = "Submit Documentation";
});
