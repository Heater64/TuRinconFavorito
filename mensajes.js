document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form-mensaje');
  const textarea = document.getElementById('nuevo-mensaje');
  const lista = document.getElementById('lista-mensajes');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const mensaje = textarea.value.trim();
    if (mensaje) {
      const mensajes = JSON.parse(localStorage.getItem('mensajes')) || [];
      mensajes.unshift(mensaje);
      localStorage.setItem('mensajes', JSON.stringify(mensajes));
      mostrarMensajes();
      textarea.value = '';
    }
  });

  function mostrarMensajes() {
    const mensajes = JSON.parse(localStorage.getItem('mensajes')) || [];
    lista.innerHTML = '';
    mensajes.forEach(msg => {
      const li = document.createElement('li');
      li.textContent = msg;
      lista.appendChild(li);
    });
  }

  mostrarMensajes();
});
