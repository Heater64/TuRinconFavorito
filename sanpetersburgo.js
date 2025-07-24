// Animación de aparición suave al hacer scroll
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, {
  threshold: 0.1
});

document.querySelectorAll('section, .card, .gallery img, .frase').forEach(el => {
  el.classList.add('fade-in');
  observer.observe(el);
});

  // Esto se ejecuta automáticamente al cargar
  document.addEventListener("DOMContentLoaded", () => {
    const links = document.querySelectorAll("nav a");
    links.forEach(link => {
      if (link.href === window.location.href) {
        link.classList.add("active");
      }
    });
  });
