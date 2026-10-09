/* RADIO LARIA — interactions
   WhatsApp: numéro au format international, sans + ni espaces.
*/
"use strict";

const WHATSAPP_NUMBER = "50946331042";

document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".nav-toggle");
  const navMenu = document.querySelector(".nav-menu");
  const navLinks = document.querySelectorAll(".nav-link");
  const currentYear = document.getElementById("currentYear");
  const contactForm = document.getElementById("contactForm");
  const formStatus = document.getElementById("formStatus");

  if (currentYear) currentYear.textContent = new Date().getFullYear();

  function closeMenu() {
    if (!toggle || !navMenu) return;
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Ouvrir le menu");
    navMenu.classList.remove("is-open");
    document.body.classList.remove("menu-open");
  }

  if (toggle && navMenu) {
    toggle.addEventListener("click", () => {
      const isOpen = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!isOpen));
      toggle.setAttribute("aria-label", isOpen ? "Ouvrir le menu" : "Fermer le menu");
      navMenu.classList.toggle("is-open", !isOpen);
      document.body.classList.toggle("menu-open", !isOpen);
    });

    navLinks.forEach(link => link.addEventListener("click", closeMenu));
    navMenu.querySelectorAll(".nav-cta").forEach(link => link.addEventListener("click", closeMenu));

    document.addEventListener("keydown", event => {
      if (event.key === "Escape") closeMenu();
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 900) closeMenu();
    });
  }

  // Mark the navigation link for the section currently visible.
  const sections = document.querySelectorAll("main section[id]");
  if ("IntersectionObserver" in window && sections.length) {
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navLinks.forEach(link => {
          const active = link.getAttribute("href") === `#${entry.target.id}`;
          link.classList.toggle("active", active);
        });
      });
    }, { rootMargin: "-35% 0px -55% 0px", threshold: 0 });
    sections.forEach(section => sectionObserver.observe(section));
  }

  // Reveal content as it enters the viewport. Keep it visible on older browsers.
  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach(item => revealObserver.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add("is-visible"));
  }

  function openWhatsApp(message) {
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  // Each package button prepares a specific WhatsApp enquiry.
  document.querySelectorAll("[data-package]").forEach(button => {
    button.addEventListener("click", event => {
      event.preventDefault();
      const packageName = button.dataset.package;
      const price = button.dataset.price;
      const message = `Bonjour RADIO LARIA, je souhaite obtenir plus d'informations sur le forfait ${packageName} (${price}). Pouvez-vous me confirmer les conditions, la durée et les disponibilités ?`;
      openWhatsApp(message);
    });
  });

  // Service links preselect the subject in the contact form.
  document.querySelectorAll("[data-service]").forEach(link => {
    link.addEventListener("click", () => {
      const subject = document.getElementById("subject");
      if (subject) {
        const service = link.dataset.service.toLowerCase();
        if (service.includes("spot")) subject.value = "Production de spot audio ou vidéo";
        else if (service.includes("sonore")) subject.value = "Diffusion par haut-parleurs";
        else if (service.includes("numérique")) subject.value = "Campagne Facebook ou TikTok";
        else if (service.includes("graphique")) subject.value = "Conception graphique";
        else subject.value = "Autre demande";
      }
    });
  });

  // Static GitHub Pages cannot store form submissions by itself.
  // This form validates locally, then opens WhatsApp with the composed message.
  if (contactForm) {
    contactForm.addEventListener("submit", event => {
      event.preventDefault();
      if (!contactForm.reportValidity()) return;

      const data = new FormData(contactForm);
      const name = String(data.get("name") || "").trim();
      const company = String(data.get("company") || "").trim();
      const email = String(data.get("email") || "").trim();
      const subject = String(data.get("subject") || "").trim();
      const message = String(data.get("message") || "").trim();

      const whatsappMessage = [
        "Bonjour RADIO LARIA, je vous contacte depuis votre site web.",
        "",
        `Nom : ${name}`,
        company ? `Entreprise : ${company}` : "",
        `E-mail : ${email}`,
        `Sujet : ${subject}`,
        "",
        `Message : ${message}`
      ].filter(Boolean).join("\n");

      if (formStatus) {
        formStatus.textContent = "Votre message est prêt. WhatsApp va s'ouvrir pour vous permettre de l'envoyer.";
      }
      openWhatsApp(whatsappMessage);
    });
  }
});
