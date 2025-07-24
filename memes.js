document.addEventListener('DOMContentLoaded', () => {
  const memesImagenes = [
    'memes/GorditoJoker.png',
    'memes/Peeerry.png',
    'memes/Refri.jpg',
    'memes/Gatosencama.jpg',
    'memes/MinecraftUs.jpg',
    'memes/MemeAvion.jpg',
    // Añade más rutas aquí
  ];

  const memesVideos = [
    'memes/HazcaradeGuapo.mp4',
    'memes/Megustalapepsi.mp4',
    'memes/ElCirco.mp4',
    'memes/TiaPaola.mp4',
    'memes/SaltarPayasos.mp4',
    'memes/ParejaTrend.mp4',
    'memes/Negro.mp4',
    'memes/DiasBonitos.mp4',
    'memes/Nomeire.mp4',
    'memes/Cumpleaños.mp4',
    'memes/Carts.mp4',
    'memes/Callate.mp4',
    'memes/Audiocalmante.mp4',
    // Añade más rutas aquí
  ];

  const imagenesContainer = document.getElementById('memes-imagenes');
  const videosContainer = document.getElementById('memes-videos');
  const likedMemes = JSON.parse(localStorage.getItem('likedMemes')) || [];

  function createMemeCard(src, isVideo = false, alt = 'Meme') {
    const card = document.createElement('div');
    card.className = 'meme-card';

    let media;
   if (isVideo) {
  media = document.createElement('video');
  media.src = src;
  media.className = 'meme-item';
  media.playsInline = true;
  media.muted = false;
  media.loop = false;
  media.setAttribute('controls', false);
  media.removeAttribute('controls');

  // Evita el clic derecho (menú de video)
  media.addEventListener('contextmenu', (e) => e.preventDefault());

  // Solo se reproduce al tocar
  media.addEventListener('click', () => {
    if (media.paused) media.play();
    else media.pause();
  });
}

     else {
      media = document.createElement('img');
      media.src = src;
      media.alt = alt;
      media.className = 'meme-item';
    }

    const actions = document.createElement('div');
    actions.className = 'meme-actions';

    const likeBtn = document.createElement('button');
    likeBtn.className = 'like-btn';
    likeBtn.innerHTML = likedMemes.includes(src) ? '❤️' : '🤍';

    likeBtn.addEventListener('click', () => {
      const indexInLiked = likedMemes.indexOf(src);
      if (indexInLiked > -1) {
        likedMemes.splice(indexInLiked, 1);
        likeBtn.innerHTML = '🤍';
      } else {
        likedMemes.push(src);
        likeBtn.innerHTML = '❤️';
      }
      localStorage.setItem('likedMemes', JSON.stringify(likedMemes));
    });

    actions.appendChild(likeBtn);
    card.appendChild(media);
    card.appendChild(actions);

    return card;
  }

  memesImagenes.forEach((src, i) => {
    imagenesContainer.appendChild(createMemeCard(src, false, `Meme ${i + 1}`));
  });

  memesVideos.forEach((src, i) => {
    videosContainer.appendChild(createMemeCard(src, true, `Video Meme ${i + 1}`));
  });
});
