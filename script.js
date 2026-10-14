
"use strict";

/*
  WEBSITE CONFIGURATION
  Replace the example details before publishing.
*/
const CONFIG = {
  advocateName: "ADV. AAQIB ANSARI",
  whatsappNumber: "91 9927525545",
  phoneDisplay: "+91 9927525545",
  email: "advocateaaqib@gmail.com",
  address: "F-6 1st Floor, Grand Square Hapur Road, Meerut, Uttar Pradesh"
};

// Update advocate details throughout the website.
document.querySelectorAll(".advocate-name").forEach((element) => {
  element.textContent = CONFIG.advocateName.toUpperCase();
});

const phoneLink = document.getElementById("phoneLink");
phoneLink.textContent = CONFIG.phoneDisplay;
phoneLink.href = `tel:${CONFIG.whatsappNumber}`;

const emailLink = document.getElementById("emailLink");
emailLink.textContent = CONFIG.email;
emailLink.href = `mailto:${CONFIG.email}`;

document.getElementById("officeAddress").textContent = CONFIG.address;
document.getElementById("year").textContent = new Date().getFullYear();

// Mobile navigation
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

function closeMenu() {
  navLinks.classList.remove("open");
  menuToggle.classList.remove("active");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation");
  document.body.classList.remove("menu-open");
}

menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");

  menuToggle.classList.toggle("active", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute(
    "aria-label",
    isOpen ? "Close navigation" : "Open navigation"
  );

  document.body.classList.toggle("menu-open", isOpen);
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 800) closeMenu();
});

// Reveal animations, with fallback for older browsers
const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          currentObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -25px 0px" }
  );

  revealElements.forEach((element) => observer.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("visible"));
}

// Select the relevant service when a service card is clicked.
document.querySelectorAll("[data-service]").forEach((link) => {
  link.addEventListener("click", () => {
    const serviceSelect = document.getElementById("service");
    const selectedService = link.dataset.service;

    const option = Array.from(serviceSelect.options).find(
      (item) => item.value === selectedService
    );

    if (option) serviceSelect.value = option.value;
  });
});

// Select individual or business client type from the audience section.
document.querySelectorAll("[data-client]").forEach((link) => {
  link.addEventListener("click", () => {
    document.getElementById("clientType").value = link.dataset.client;
  });
});

// Consultation form -> WhatsApp
const contactForm = document.getElementById("contactForm");
const formError = document.getElementById("formError");

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();

  formError.hidden = true;
  formError.textContent = "";

  const whatsappNumber = CONFIG.whatsappNumber.replace(/\D/g, "");

  // Do not accidentally publish the example WhatsApp number.
  if (
    !/^[1-9]\d{9,14}$/.test(whatsappNumber) ||
    whatsappNumber === "919876543210"
  ) {
    formError.textContent =
      "Please add the actual WhatsApp number in the CONFIG section of script.js.";
    formError.hidden = false;
    return;
  }

  if (!contactForm.reportValidity()) return;

  const data = new FormData(contactForm);

  const name = String(data.get("name") || "").trim();
  const phone = String(data.get("phone") || "").trim();
  const clientType = String(data.get("clientType") || "").trim();
  const service = String(data.get("service") || "").trim();
  const deadline = String(data.get("deadline") || "").trim();
  const message = String(data.get("message") || "").trim();

  // Basic input checks
  if (!name || !phone || !clientType || !service || !message) {
    formError.textContent = "Please complete all required fields.";
    formError.hidden = false;
    return;
  }

  if (
    name.length > 100 ||
    phone.length > 20 ||
    message.length > 1200
  ) {
    formError.textContent =
      "Please check your details and shorten any lengthy fields.";
    formError.hidden = false;
    return;
  }

  // Do not accept past deadlines.
  if (deadline) {
    const today = new Date();
    const localToday = [
      today.getFullYear(),
      String(today.getMonth() + 1).padStart(2, "0"),
      String(today.getDate()).padStart(2, "0")
    ].join("-");

    if (deadline < localToday) {
      formError.textContent =
        "Please select today or a future date for the deadline.";
      formError.hidden = false;
      return;
    }
  }

  const enquiry = [
    "TAX & LEGAL CONSULTATION ENQUIRY",
    "",
    `Name: ${name}`,
    `Phone: ${phone}`,
    `Client Type: ${clientType}`,
    `Service Required: ${service}`,
    `Deadline: ${deadline || "Not specified"}`,
    "",
    "Requirement:",
    message
  ].join("\n");

  const whatsappURL =
    `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(enquiry)}`;

  // Open WhatsApp only after the user submits the form.
  const newWindow = window.open(
    whatsappURL,
    "_blank",
    "noopener,noreferrer"
  );

  if (!newWindow) {
    formError.textContent =
      "WhatsApp could not be opened. Please allow pop-ups or use the contact number shown on the website.";
    formError.hidden = false;
  }
});

// Floating WhatsApp button
document.getElementById("floatingContact").href =
  `https://wa.me/${CONFIG.whatsappNumber.replace(/\D/g, "")}`;
