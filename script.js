document.addEventListener('DOMContentLoaded', () => {
    // Código para el diario (mantenlo si lo usas)
    const diarioTextarea = document.getElementById("diario");
    if (diarioTextarea) {
        diarioTextarea.value = localStorage.getItem("miDiario") || "";
        // Puedes vincular esto a un botón de guardar si lo tienes en tu HTML de diario.html
    }

    // --- Funcionalidad de la Galería y Lightbox ---
    const mainGallery = document.getElementById('main-gallery');
    const galleryCategoryPanels = document.querySelectorAll('.gallery-category-panel');
    const backToMainButtons = document.querySelectorAll('.back-to-main');
    const galleryTitle = document.getElementById('gallery-title'); // Título principal de la galería

    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const closeBtn = document.querySelector('.close-btn');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    let currentImageIndex = 0;
    let activeGalleryImages = []; // Array para almacenar las imágenes de la galería activa

    // Función para actualizar el array de imágenes activas para el lightbox
    // Ahora, esta función rellenará activeGalleryImages con las imágenes del contenedor que le pases.
    const updateActiveGalleryImages = (container) => {
        // Asegúrate de que el contenedor existe y es un elemento DOM
        if (container && container.nodeType === 1) {
            activeGalleryImages = Array.from(container.querySelectorAll('.galeria-item img'));
        } else {
            console.error("El contenedor para actualizar las imágenes activas no es un elemento DOM válido.");
            activeGalleryImages = []; // Si algo va mal, asegúrate de que esté vacío.
        }
    };

    // --- Abrir Panel de Categoría ---
    mainGallery.addEventListener('click', (event) => {
        const item = event.target.closest('.galeria-item');
        if (item) {
            const category = item.dataset.category; // Obtiene la categoría del data-attribute
            const targetPanel = document.getElementById(`panel-${category}`);

            if (targetPanel) {
                // Oculta la galería principal y su título
                mainGallery.classList.add('main-gallery-hidden');
                galleryTitle.style.display = 'none';

                // Oculta todos los paneles de categoría antes de mostrar el actual
                galleryCategoryPanels.forEach(panel => {
                    panel.classList.remove('visible');
                    panel.classList.add('hidden');
                });

                // Muestra el panel de la categoría clickeada
                targetPanel.classList.remove('hidden');
                targetPanel.classList.add('visible');

                // *** ESTO ES CRUCIAL: Actualiza las imágenes activas PARA EL LIGHTBOX ***
                // Ahora, activeGalleryImages contendrá solo las imágenes del panel que se acaba de abrir.
                updateActiveGalleryImages(targetPanel);

                // Aplica animaciones a los ítems dentro del panel
                targetPanel.querySelectorAll('.galeria-item').forEach((panelItem, index) => {
                    panelItem.style.animationDelay = `${0.05 * index}s`; // Retraso más rápido para los ítems del panel
                    panelItem.style.opacity = '1';
                    panelItem.style.transform = 'translateY(0)';
                });
            }
        }
    });

    // --- Volver a la Galería Principal ---
    backToMainButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Oculta todos los paneles de categoría
            galleryCategoryPanels.forEach(panel => {
                panel.classList.remove('visible');
                panel.classList.add('hidden');
            });

            // Muestra la galería principal y su título
            mainGallery.classList.remove('main-gallery-hidden');
            galleryTitle.style.display = 'block';

            // *** ESTO ES CRUCIAL: Actualiza las imágenes activas PARA EL LIGHTBOX ***
            // Ahora, activeGalleryImages contendrá las imágenes de la galería principal.
            updateActiveGalleryImages(mainGallery);


            // Reinicia las animaciones de la galería principal (opcional, para que se vea "fresca")
            mainGallery.querySelectorAll('.galeria-item').forEach((item, index) => {
                item.style.animation = 'none'; // Quita la animación temporalmente
                void item.offsetWidth; // Trigger reflow
                item.style.animation = `itemFadeIn 0.8s forwards ${0.1 * index}s`; // Vuelve a aplicar
            });
        });
    });

    // --- Abrir Lightbox (para cualquier imagen, de la principal o de los paneles) ---
    document.body.addEventListener('click', (event) => {
        if (event.target.tagName === 'IMG' && event.target.closest('.galeria-item')) {
            openLightbox(event.target);
        }
    });

    function openLightbox(imgElement) {
        lightbox.style.display = 'flex'; // Cambiar a flex para centrar
        lightboxImg.src = imgElement.src;
        lightboxCaption.innerHTML = imgElement.alt || imgElement.nextElementSibling.innerText || '';

        // *** IMPORTANTE: Actualiza activeGalleryImages justo ANTES de abrir el lightbox ***
        // Esto asegura que el lightbox siempre tenga el contexto correcto de qué galería se está viendo.
        // Si la imagen clicada está dentro de un panel, usa ese panel; si no, usa la galería principal.
        const currentParentPanel = imgElement.closest('.gallery-category-panel');
        if (currentParentPanel) {
            updateActiveGalleryImages(currentParentPanel);
        } else {
            updateActiveGalleryImages(mainGallery);
        }

        // Encuentra el índice de la imagen actual en el array de imágenes activas
        currentImageIndex = activeGalleryImages.findIndex(img => img.src === imgElement.src);

        // Si por alguna razón la imagen no se encuentra, cierra el lightbox y lanza un error.
        if (currentImageIndex === -1) {
            console.error("La imagen clicada no se encontró en la galería activa. activeGalleryImages:", activeGalleryImages);
            lightbox.style.display = 'none';
            return; // Detiene la ejecución para evitar el error 'src'
        }
    }

    // --- Cerrar Lightbox ---
    closeBtn.addEventListener('click', () => {
        lightbox.style.display = 'none';
    });

    // Cerrar el lightbox al hacer clic fuera de la imagen (en el fondo)
    lightbox.addEventListener('click', (event) => {
        if (event.target === lightbox) {
            lightbox.style.display = 'none';
        }
    });

    // --- Navegación del Lightbox ---
    prevBtn.addEventListener('click', () => {
        if (activeGalleryImages.length === 0) return; // Previene error si el array está vacío
        currentImageIndex = (currentImageIndex - 1 + activeGalleryImages.length) % activeGalleryImages.length;
        updateLightboxContent();
    });

    nextBtn.addEventListener('click', () => {
        if (activeGalleryImages.length === 0) return; // Previene error si el array está vacío
        currentImageIndex = (currentImageIndex + 1) % activeGalleryImages.length;
        updateLightboxContent();
    });

    function updateLightboxContent() {
        // Asegúrate de que activeGalleryImages no esté vacío antes de intentar acceder a sus elementos
        if (activeGalleryImages.length === 0 || currentImageIndex < 0 || currentImageIndex >= activeGalleryImages.length) {
            console.error("Intento de actualizar el lightbox con un índice o array de imágenes inválido.", { currentImageIndex, activeGalleryImages });
            lightbox.style.display = 'none'; // Cierra el lightbox si hay un problema
            return;
        }

        const nextImg = activeGalleryImages[currentImageIndex];
        lightboxImg.src = nextImg.src;
        lightboxCaption.innerHTML = nextImg.alt || nextImg.nextElementSibling.innerText || '';
        // Reiniciar la animación de zoom para la nueva imagen
        lightboxImg.style.animation = 'none';
        void lightboxImg.offsetWidth; // Trigger reflow
        lightboxImg.style.animation = 'zoomIn 0.4s ease-out';
    }

    // --- Navegación con Teclado ---
    document.addEventListener('keydown', (event) => {
        if (lightbox.style.display === 'flex') { // Solo si el lightbox está abierto
            if (event.key === 'ArrowLeft') {
                prevBtn.click();
            } else if (event.key === 'ArrowRight') {
                nextBtn.click();
            } else if (event.key === 'Escape') {
                closeBtn.click();
            }
        }
    });

    // Animación de aparición inicial de los elementos de la galería principal
    mainGallery.querySelectorAll('.galeria-item').forEach((item, index) => {
        item.style.animationDelay = `${0.1 * index}s`;
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
    });

    // *** Al cargar la página por primera vez, asegúrate de que activeGalleryImages
    // contenga las imágenes de la galería principal para la navegación inicial. ***
    updateActiveGalleryImages(mainGallery);
});


