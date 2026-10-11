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
    toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    nav.classList.toggle("is-open", open);
    document.body.classList.toggle("menu-open", open);
  });
  nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Abrir menú");
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

    const name = data.get("name");
    const email = "aicompsoluciones@gmail.com"; // data.get("email") || "No proporcionado";
    const business = data.get("business");
    const service = data.get("service");
    const detail = data.get("message");

    const message = [
      `Hola ${config.companyName || "AiComp Soluciones"}, quiero conversar sobre un proyecto.`,
      `Nombre: ${name}`,
      business ? `Empresa: ${business}` : "",
      `Servicio: ${service}`,
      `Detalle: ${detail}`
    ].filter(Boolean).join("\n");
    gtag('event', 'generate_lead', {
      method: 'whatsapp'
    });

    window.open(whatsappUrl(message), "_blank", "noopener,noreferrer");

    // Enviar notificación por correo mediante Cloudflare Worker
    fetch("/api/contacto  ", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: name,
        email: email,
        message: [
          `Empresa: ${business || "No indicada"}`,
          `Servicio: ${service || "No indicado"}`,
          `Detalle: ${detail || "Sin detalles"}`
        ].join("\n")
      })
    })
    .then(async response => {
      if (!response.ok) {
        throw new Error(`Error HTTP ${response.status}`);
      }

      return response.json();
    })
    .then(result => {
      console.log("Resultado del envío de correo:", result);
    })
    .catch(error => {
      console.error("No se pudo enviar el correo:", error);
    });
  });
})();
