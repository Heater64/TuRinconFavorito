
document.addEventListener('DOMContentLoaded', () => {
    const audioPlayer = document.getElementById('audio-player');
    const musicList = document.getElementById('music-list');
    const nowPlayingDiv = document.getElementById('now-playing');
    let currentPlayingItem = null; // Para saber qué canción se está reproduciendo actualmente

    if (!audioPlayer || !musicList || !nowPlayingDiv) {
        console.error("No se encontraron todos los elementos necesarios para la playlist. Asegúrate de que los IDs existan en tu HTML.");
        return; // Detener la ejecución si faltan elementos
    }

    musicList.addEventListener('click', (event) => {
        const playBtn = event.target.closest('.play-btn'); // Buscamos si el clic fue en el botón de reproducir
        if (playBtn) {
            const listItem = playBtn.closest('.playlist-item'); // Obtenemos el <li> padre

            if (listItem) {
                const src = listItem.dataset.src;
                const title = listItem.dataset.title || 'Título Desconocido';
                const artist = listItem.dataset.artist || 'Artista Desconocido';

                // Si ya hay una canción reproduciéndose, la pausamos
                if (audioPlayer.src === src && !audioPlayer.paused) {
                    audioPlayer.pause();
                    playBtn.textContent = 'Reproducir';
                    nowPlayingDiv.textContent = `Pausado: ${title} - ${artist}`;
                    if (currentPlayingItem) {
                        currentPlayingItem.classList.remove('playing');
                    }
                } else {
                    // Si es una canción diferente o la misma pausada, la reproducimos
                    audioPlayer.src = src;
                    audioPlayer.play();
                    
                    // Actualizar el texto del botón del ítem que se estaba reproduciendo antes
                    if (currentPlayingItem) {
                        currentPlayingItem.querySelector('.play-btn').textContent = 'Reproducir';
                        currentPlayingItem.classList.remove('playing');
                    }

                    // Marcar el nuevo ítem como el que se está reproduciendo
                    playBtn.textContent = 'Pausar';
                    nowPlayingDiv.textContent = `Reproduciendo: ${title} - ${artist}`;
                    listItem.classList.add('playing');
                    currentPlayingItem = listItem;
                }
            }
        }
    });

    // Evento para cuando la canción termina
    audioPlayer.addEventListener('ended', () => {
        nowPlayingDiv.textContent = 'Reproduciendo: Nada';
        if (currentPlayingItem) {
            currentPlayingItem.querySelector('.play-btn').textContent = 'Reproducir';
            currentPlayingItem.classList.remove('playing');
            currentPlayingItem = null;
        }
    });

    // Evento para cuando se pausa
    audioPlayer.addEventListener('pause', () => {
        if (currentPlayingItem && audioPlayer.currentTime > 0) { // Solo si ya ha empezado a sonar
            currentPlayingItem.querySelector('.play-btn').textContent = 'Reproducir';
            const title = currentPlayingItem.dataset.title || 'Título Desconocido';
            const artist = currentPlayingItem.dataset.artist || 'Artista Desconocido';
            nowPlayingDiv.textContent = `Pausado: ${title} - ${artist}`;
        }
    });

    // Evento para cuando se empieza a reproducir
    audioPlayer.addEventListener('play', () => {
        if (currentPlayingItem) {
            const title = currentPlayingItem.dataset.title || 'Título Desconocido';
            const artist = currentPlayingItem.dataset.artist || 'Artista Desconocido';
            nowPlayingDiv.textContent = `Reproduciendo: ${title} - ${artist}`;
            currentPlayingItem.querySelector('.play-btn').textContent = 'Pausar';
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const audioPlayer = document.getElementById('audio-player');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const progressBar = document.getElementById('progress-bar');
    const currentTimeSpan = document.getElementById('current-time');
    const durationTimeSpan = document.getElementById('duration-time');
    const volumeBar = document.getElementById('volume-bar');
    const muteBtn = document.getElementById('mute-btn');
    const shuffleBtn = document.getElementById('shuffle-btn');
    const repeatBtn = document.getElementById('repeat-btn');
    const currentSongCover = document.getElementById('current-song-cover');
    const currentSongTitle = document.getElementById('current-song-title');
    const currentSongArtist = document.getElementById('current-song-artist');
    const nowPlayingText = document.getElementById('now-playing');
    const musicList = document.getElementById('music-list');

    let currentSongIndex = 0;
    let isShuffling = false;
    let repeatMode = 'none'; // 'none', 'one', 'all'
    let isMuted = false;

    // Lista de canciones (obtenida de los elementos HTML)
    const playlistItems = Array.from(musicList.querySelectorAll('.playlist-item'));
    const playlist = playlistItems.map(item => ({
        src: item.dataset.src,
        title: item.dataset.title,
        artist: item.dataset.artist,
        cover: item.dataset.cover
    }));

    // --- Funciones de Utilidad ---

    // Formatea el tiempo de segundos a MM:SS
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }

    // Carga y reproduce una canción
    function loadSong(index) {
        if (index >= 0 && index < playlist.length) {
            currentSongIndex = index;
            const song = playlist[currentSongIndex];
            audioPlayer.src = song.src;
            currentSongCover.src = song.cover;
            currentSongTitle.textContent = song.title;
            currentSongArtist.textContent = song.artist;
            nowPlayingText.textContent = 'Reproduciendo:';

            // Marca la canción actual en la lista
            playlistItems.forEach((item, i) => {
                item.classList.remove('active');
                const playBtnIcon = item.querySelector('.item-play-btn i');
                if (playBtnIcon) playBtnIcon.classList.replace('fa-pause', 'fa-play');
            });
            playlistItems[currentSongIndex].classList.add('active');
            const currentItemPlayBtnIcon = playlistItems[currentSongIndex].querySelector('.item-play-btn i');
            if (currentItemPlayBtnIcon) currentItemPlayBtnIcon.classList.replace('fa-play', 'fa-pause');

            playSong();
        }
    }

    // Reproduce la canción actual
    function playSong() {
        audioPlayer.play();
        playPauseBtn.querySelector('i').classList.replace('fa-play', 'fa-pause');
        nowPlayingText.textContent = 'Reproduciendo:';
        // Actualiza el icono de la canción actual en la lista
        const currentItemPlayBtnIcon = playlistItems[currentSongIndex].querySelector('.item-play-btn i');
        if (currentItemPlayBtnIcon) currentItemPlayBtnIcon.classList.replace('fa-play', 'fa-pause');
    }

    // Pausa la canción actual
    function pauseSong() {
        audioPlayer.pause();
        playPauseBtn.querySelector('i').classList.replace('fa-pause', 'fa-play');
        nowPlayingText.textContent = 'Pausado:';
        // Actualiza el icono de la canción actual en la lista
        const currentItemPlayBtnIcon = playlistItems[currentSongIndex].querySelector('.item-play-btn i');
        if (currentItemPlayBtnIcon) currentItemPlayBtnIcon.classList.replace('fa-pause', 'fa-play');
    }

    // Cambia a la siguiente canción
    function nextSong() {
        if (isShuffling) {
            let newIndex;
            do {
                newIndex = Math.floor(Math.random() * playlist.length);
            } while (newIndex === currentSongIndex && playlist.length > 1); // Evitar repetir la misma canción si hay más de una
            loadSong(newIndex);
        } else {
            currentSongIndex++;
            if (currentSongIndex >= playlist.length) {
                currentSongIndex = 0; // Vuelve al inicio si llega al final
            }
            loadSong(currentSongIndex);
        }
    }

    // Cambia a la canción anterior
    function prevSong() {
        currentSongIndex--;
        if (currentSongIndex < 0) {
            currentSongIndex = playlist.length - 1; // Va al final si llega al principio
        }
        loadSong(currentSongIndex);
    }

    // --- Manejo de Eventos del Reproductor ---

    // Evento de clic para el botón de Reproducir/Pausar
    playPauseBtn.addEventListener('click', () => {
        const isPlaying = audioPlayer.paused;
        if (isPlaying) {
            playSong();
        } else {
            pauseSong();
        }
    });

    // Evento para el botón de Siguiente
    nextBtn.addEventListener('click', nextSong);

    // Evento para el botón de Anterior
    prevBtn.addEventListener('click', prevSong);

    // Evento para actualizar la barra de progreso y el tiempo
    audioPlayer.addEventListener('timeupdate', () => {
        const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        progressBar.value = progress;
        currentTimeSpan.textContent = formatTime(audioPlayer.currentTime);
    });

    // Evento cuando la canción está cargada y lista para reproducirse
    audioPlayer.addEventListener('loadedmetadata', () => {
        durationTimeSpan.textContent = formatTime(audioPlayer.duration);
        progressBar.max = audioPlayer.duration; // Asegura que el max de la barra de progreso sea la duración total
    });

    // Evento para buscar en la canción al arrastrar la barra de progreso
    progressBar.addEventListener('input', () => {
        const seekTime = (progressBar.value / 100) * audioPlayer.duration;
        audioPlayer.currentTime = seekTime;
    });

    // Evento al finalizar la canción
    audioPlayer.addEventListener('ended', () => {
        if (repeatMode === 'one') {
            playSong(); // Repite la misma canción
        } else if (repeatMode === 'all') {
            nextSong(); // Pasa a la siguiente en modo repetición de lista
        } else {
            // Si no hay repetición y es la última canción, pausa
            if (currentSongIndex === playlist.length - 1 && !isShuffling) {
                pauseSong();
                audioPlayer.currentTime = 0;
                progressBar.value = 0;
                nowPlayingText.textContent = 'Fin de la lista';
            } else {
                nextSong(); // Pasa a la siguiente
            }
        }
    });

    // Control de volumen
    volumeBar.addEventListener('input', () => {
        audioPlayer.volume = volumeBar.value;
        if (audioPlayer.volume === 0) {
            muteBtn.querySelector('i').classList.replace('fa-volume-up', 'fa-volume-mute');
            isMuted = true;
        } else {
            muteBtn.querySelector('i').classList.replace('fa-volume-mute', 'fa-volume-up');
            isMuted = false;
        }
    });

    // Botón de silenciar/activar volumen
    muteBtn.addEventListener('click', () => {
        if (isMuted) {
            audioPlayer.volume = volumeBar.value; // Restaura el volumen guardado
            muteBtn.querySelector('i').classList.replace('fa-volume-mute', 'fa-volume-up');
        } else {
            audioPlayer.volume = 0;
            muteBtn.querySelector('i').classList.replace('fa-volume-up', 'fa-volume-mute');
        }
        isMuted = !isMuted;
    });

    // Botón de reproducción aleatoria (Shuffle)
    shuffleBtn.addEventListener('click', () => {
        isShuffling = !isShuffling;
        shuffleBtn.classList.toggle('active', isShuffling);
    });

    // Botón de repetición
    repeatBtn.addEventListener('click', () => {
        if (repeatMode === 'none') {
            repeatMode = 'all';
            repeatBtn.classList.add('active');
            repeatBtn.querySelector('i').classList.replace('fa-redo-alt', 'fa-sync-alt'); // Icono para repetir lista
            repeatBtn.title = 'Repetir lista';
        } else if (repeatMode === 'all') {
            repeatMode = 'one';
            repeatBtn.classList.add('active');
            repeatBtn.querySelector('i').classList.replace('fa-sync-alt', 'fa-redo-alt'); // Icono para repetir una canción
            repeatBtn.title = 'Repetir una canción';
        } else {
            repeatMode = 'none';
            repeatBtn.classList.remove('active');
            repeatBtn.querySelector('i').classList.replace('fa-redo-alt', 'fa-redo-alt'); // Vuelve al icono original
            repeatBtn.title = 'No repetir';
        }
    });

    // Manejar clics en los elementos de la playlist
    musicList.addEventListener('click', (event) => {
        const clickedItem = event.target.closest('.playlist-item');
        if (clickedItem) {
            const index = playlistItems.indexOf(clickedItem);
            if (index !== -1) {
                // Si la canción ya está reproduciéndose y se hace clic en su botón de play/pause
                if (index === currentSongIndex && !audioPlayer.paused) {
                    pauseSong();
                } else {
                    loadSong(index);
                }
            }
        }
    });

    // Cargar la primera canción al iniciar
    if (playlist.length > 0) {
        loadSong(0);
        pauseSong(); // Pausa inicialmente hasta que el usuario dé play
    }
});