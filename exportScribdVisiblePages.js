/**
 * 📄 Scribd to PDF Extractor
 * Extrae todas las imágenes visibles del visor de Scribd
 * y genera una ventana imprimible como PDF (Ctrl+P o Cmd+P).
 * 
 * - Hace scroll automático para cargar todas las páginas
 * - Toma solo las imágenes del documento actual
 * - Compatible con vista parcial (sin CORS)
 * 
 * Autor: Luis Humeau
 * Licencia: MIT
 */

(async function exportVisiblePagesFromScribd() {
  const scrollToBottom = async () => {
    return new Promise(resolve => {
      let lastScrollTop = -1;
      const interval = setInterval(() => {
        window.scrollBy(0, 300);
        const current = document.documentElement.scrollTop || document.body.scrollTop;
        if (current === lastScrollTop) {
          clearInterval(interval);
          resolve();
        }
        lastScrollTop = current;
      }, 200);
    });
  };

  console.log("⬇️ Scroll automático...");
  await scrollToBottom();
  console.log("✅ Scroll completo. Buscando imágenes...");

  const images = [...document.querySelectorAll(".outer_page img[src*='scribdassets']")];

  if (!images.length) {
    alert("⚠️ No se encontraron imágenes del documento.");
    return;
  }

  const container = document.createElement("div");
  container.style.background = "white";

  images.forEach(img => {
    const wrapper = document.createElement("div");
    wrapper.style.pageBreakAfter = "always";

    const newImg = document.createElement("img");
    newImg.src = img.src;
    newImg.style.width = "100%";
    newImg.style.display = "block";
    newImg.style.margin = "0 auto";

    wrapper.appendChild(newImg);
    container.appendChild(wrapper);
  });

  const win = window.open("", "_blank");

  if (!win || !win.document) {
    alert("❌ La ventana fue bloqueada. Habilita los pop-ups.");
    return;
  }

  win.document.open();
  win.document.write(`
    <html>
      <head>
        <title>Documento para Imprimir</title>
        <style>
          body { margin: 0; background: white; }
          img { max-width: 100%; display: block; page-break-after: always; }
        </style>
        <script>
          window.onload = () => {
            setTimeout(() => window.print(), 1000);
          };
        </script>
      </head>
      <body>${container.innerHTML}</body>
    </html>
  `);
  win.document.close();
})();
