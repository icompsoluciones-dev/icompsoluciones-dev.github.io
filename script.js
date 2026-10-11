(() => {
  const config = window.ICOMP_CONFIG || {};
  const $ = (selector, root = document) => root.querySelector(selector);
  const cleanPhone = String(config.whatsappNumber || "").replace(/\D/g, "");
  const validWhatsApp = Boolean(config.whatsappEnabled && cleanPhone && !/^0+$/.test(cleanPhone));
  const whatsappUrl = (message) => `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;

  // Email y datos corporativos se controlan desde config.js.
  const emailText = $("#email-text");
  const emailLink = $("#email-link");
  if (emailText && config.email) emailText.textContent = config.email;
  if (emailLink && config.email) {
    emailLink.href = `mailto:${config.email}`;
    emailLink.setAttribute("aria-label", `Enviar correo a ${config.email}`);
  }
  $("#year").textContent = new Date().getFullYear();

  const floatButton = $("#whatsapp-float");
  if (validWhatsApp) {
    floatButton.href = whatsappUrl(config.defaultMessage || "Hola, quisiera información sobre sus servicios.");
    floatButton.target = "_blank";
    floatButton.rel = "noopener noreferrer";
  } else {
    floatButton.href = "#contacto";
    floatButton.title = "Configura el número de WhatsApp en config.js para activar el contacto directo";
  }

  // Enlaces de servicio: seleccionan el servicio correspondiente en el formulario.
  document.querySelectorAll("[data-service]").forEach(link => {
    link.addEventListener("click", () => {
      const select = $("#service");
      if (select) {
        const wanted = link.dataset.service;
        const option = Array.from(select.options).find(item => item.value === wanted || item.textContent.trim() === wanted);
        if (option) select.value = option.value;
      }
    });
  });

  // Menú móvil accesible.
  const toggle = $(".menu-toggle");
  const nav = $(".main-nav");
  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") !== "true";
    toggle.setAttribute("aria-expanded", String(open));
    nav.classList.toggle("is-open", open);
    document.body.classList.toggle("menu-open", open);
  });
  nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
    toggle.setAttribute("aria-expanded", "false");
    nav.classList.remove("is-open");
    document.body.classList.remove("menu-open");
  }));

  // Formulario: no almacena datos. Construye un mensaje y abre WhatsApp si está configurado.
  $("#contact-form").addEventListener("submit", event => {
    event.preventDefault();
    const form = event.currentTarget;
    const error = $("#form-error");
    error.hidden = true;
    if (!form.reportValidity()) return;
    if (!validWhatsApp) {
      error.textContent = "Para activar el envío directo, edita config.js: coloca el número real en formato internacional y cambia whatsappEnabled a true. Mientras tanto, puedes escribir al correo configurado.";
      error.hidden = false;
      return;
    }
    const data = new FormData(form);
    const message = [
      `Hola ${config.companyName || "IComp Soluciones"}, quiero conversar sobre un proyecto.`,
      `Nombre: ${data.get("name")}`,
      data.get("business") ? `Empresa: ${data.get("business")}` : "",
      `Servicio: ${data.get("service")}`,
      `Detalle: ${data.get("message")}`
    ].filter(Boolean).join("\n");
    gtag('event', 'generate_lead', {
      method: 'whatsapp'
    });
    window.open(whatsappUrl(message), "_blank", "noopener,noreferrer");
  });
})();
