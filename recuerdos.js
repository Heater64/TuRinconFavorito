document.addEventListener('DOMContentLoaded', () => {
  const imagenes = document.querySelectorAll('.recuerdo-card img');

  imagenes.forEach((img) => {
    img.addEventListener('click', () => {
      abrirModal(img.src, img.alt);
    });
  });

  function abrirModal(imagenSrc, titulo) {
    const modal = document.createElement('div');
    modal.className = 'modal-imagen';

    const overlay = document.createElement('div');
    overlay.className = 'overlay';

    const imagenAmpliada = document.createElement('img');
    imagenAmpliada.src = imagenSrc;
    imagenAmpliada.alt = titulo;

    const cerrar = document.createElement('span');
    cerrar.textContent = '×';
    cerrar.className = 'cerrar-modal';

    // Cerrar al hacer clic en la X o en el fondo oscuro
    cerrar.addEventListener('click', () => document.body.removeChild(modal));
    overlay.addEventListener('click', () => document.body.removeChild(modal));

    modal.appendChild(overlay);
    modal.appendChild(imagenAmpliada);
    modal.appendChild(cerrar);

    document.body.appendChild(modal);
  }
});


document.addEventListener('DOMContentLoaded', () => {
  const imagenes = document.querySelectorAll('.recuerdo-card img');
  const videos = document.querySelectorAll('.recuerdo-card video');

  // Clic en imagen para ampliar
  imagenes.forEach((img) => {
    img.addEventListener('click', () => {
      abrirModal(img.src, img.alt);
    });
  });

  // Clic en video para pausar/reanudar
  videos.forEach((video) => {
    video.addEventListener('click', () => {
      if (video.paused) {
        video.play();
      } else {
        video.pause();
      }
    });
  });

  // Modal para imágenes
  function abrirModal(imagenSrc, titulo) {
    const modal = document.createElement('div');
    modal.className = 'modal-imagen';

    const overlay = document.createElement('div');
    overlay.className = 'overlay';

    const imagenAmpliada = document.createElement('img');
    imagenAmpliada.src = imagenSrc;
    imagenAmpliada.alt = titulo;

    const cerrar = document.createElement('span');
    cerrar.textContent = '×';
    cerrar.className = 'cerrar-modal';

    cerrar.addEventListener('click', () => document.body.removeChild(modal));
    overlay.addEventListener('click', () => document.body.removeChild(modal));

    modal.appendChild(overlay);
    modal.appendChild(imagenAmpliada);
    modal.appendChild(cerrar);

    document.body.appendChild(modal);
  }
});
