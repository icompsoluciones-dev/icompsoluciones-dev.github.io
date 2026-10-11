# Ai Comp Soluciones — landing page

Landing page responsive en HTML, CSS y JavaScript vanilla. No requiere instalación de dependencias ni compilación.

## Cómo probarla

1. Descomprime la carpeta.
2. Abre `index.html` en un navegador. Para una prueba más parecida a producción, sirve la carpeta con cualquier servidor estático local.
3. Edita `config.js` antes de publicarla.

## Configuración de contacto

En `config.js`:

- `whatsappNumber`: número real en formato internacional, solo dígitos y sin `+`, espacios ni guiones. Ejemplo de formato: `573001234567`.
- `whatsappEnabled`: cambia a `true` una vez configurado el número real. Mientras esté en `false`, el botón flotante lleva al formulario y el formulario informa cómo activar el envío directo.
- `email`: correo real de la agencia; se usa automáticamente en el enlace `mailto:`.
- `companyName` y `defaultMessage`: personalizan los mensajes de contacto.

El formulario no envía ni almacena datos en un servidor. Al activarse WhatsApp, construye el mensaje en el navegador y abre WhatsApp para que la persona lo revise y lo envíe. Para almacenar prospectos o recibir formularios sin WhatsApp, se necesita conectar un backend o servicio de formularios.

## Archivos

- `index.html`: estructura y contenido.
- `styles.css`: paleta, diseño responsive, componentes y animaciones de interacción.
- `script.js`: menú móvil, año, enlaces, formulario y WhatsApp.
- `config.js`: variables editables de contacto y marca.
- `assets/logo-aicomp.svg`: logo proporcionado.

## Paleta inspirada en el logo

- Morado principal: `#7029E8`
- Azul: `#409CFF`
- Violeta: `#6852F4`
- Fondo: `#FBFAFF`
- Texto: `#17152A`
- Acento WhatsApp: `#20BD70`

## Publicación

Puede alojarse en cualquier hosting estático o servidor web. Si se publica detrás de un servidor propio, configura HTTPS y revisa que `config.js` contenga datos de contacto reales. Google Fonts requiere conexión a internet; el sitio conserva tipografías de respaldo si no está disponible.


## Servicios y sectores incorporados

Incluye desarrollo de software a medida, desarrollo web, aplicaciones móviles, inteligencia artificial, automatización e integración/soporte. La sección de enfoque sectorial cubre fintech, salud, retail, banca y finanzas, y ecommerce. Sustituye las descripciones por casos reales y autorizados antes de presentarlos como proyectos ejecutados.


### Tema visual actualizado
La versión actual utiliza una estética oscura en azul marino con acentos neón cian, azul y violeta. El encabezado, el hero y las tarjetas ya no usan un fondo blanco dominante.
