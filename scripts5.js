// DOM elements
const audio = document.getElementById('audio-player');
const playBtn = document.getElementById('play-btn');
const pauseBtn = document.getElementById('pause-btn');
const nextBtn = document.getElementById('next-btn');
const prevBtn = document.getElementById('prev-btn');
const seekBar = document.querySelector('.music-seek-bar');
const currentTimeEl = document.querySelector('.current-time');
const durationEl = document.querySelector('.duration');
const volumeSlider = document.querySelector('.volume-slider');
const songNameEl = document.querySelector('.current-song-name');
const artistNameEl = document.querySelector('.artist-name');
const coverImage = document.querySelector('.cover');
const playlistSection = document.querySelector('.playlist');
const queueList = document.querySelector('.queue-list');
const navBtn = document.querySelector('.nav-btn');
const backToPlayerBtn = document.querySelector('.playlist .back-btn');
const musicPlayerSection = document.querySelector('.music-player-section');
const backBtn = document.querySelector('.music-player-section .back-btn');

// Globals
let currentIndex = 0;

// Load song by index
function loadSong(index) {
    const song = songs[index];
    audio.src = song.path;
    songNameEl.textContent = song.name;
    artistNameEl.textContent = song.artist;
    coverImage.src = song.cover;

    setTimeout(() => {
        seekBar.max = audio.duration;
        durationEl.textContent = formatTime(audio.duration);
    }, 300);

    audio.currentTime = 0;
    seekBar.value = 0;
    currentTimeEl.textContent = '00:00';
}

// Format time as MM:SS
function formatTime(time) {
    let min = Math.floor(time / 60);
    let sec = Math.floor(time % 60);
    return ${min < 10 ? '0' + min : min}:${sec < 10 ? '0' + sec : sec};
}

// Play song
function playMusic() {
    audio.play();
    playBtn.classList.add('hidden');
    pauseBtn.classList.remove('hidden');
    coverImage.classList.add('rotate');
}

// Pause song
function pauseMusic() {
    audio.pause();
    pauseBtn.classList.add('hidden');
    playBtn.classList.remove('hidden');
    coverImage.classList.remove('rotate');
}

// Update seekbar and time
audio.addEventListener('timeupdate', () => {
    seekBar.value = audio.currentTime;
    currentTimeEl.textContent = formatTime(audio.currentTime);
});

// Seek bar control
seekBar.addEventListener('input', () => {
    audio.currentTime = seekBar.value;
});

// Volume control
volumeSlider.addEventListener('input', () => {
    audio.volume = volumeSlider.value;
});

// Button events
playBtn.addEventListener('click', playMusic);
pauseBtn.addEventListener('click', pauseMusic);

nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % songs.length;
    loadSong(currentIndex);
    playMusic();
});

prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + songs.length) % songs.length;
    loadSong(currentIndex);
    playMusic();
});

// Playlist toggle
navBtn.addEventListener('click', () => {
    playlistSection.classList.add('active');
});
backToPlayerBtn.addEventListener('click', () => {
    playlistSection.classList.remove('active');
});

// Back button from full player to mini
backBtn.addEventListener('click', () => {
    musicPlayerSection.classList.remove('active');
});

// Double click to show full player
musicPlayerSection.addEventListener('dblclick', () => {
    musicPlayerSection.classList.add('active');
});

// Generate playlist
function generatePlaylist() {
    queueList.innerHTML = '';
    songs.forEach((song, index) => {
        const queueItem = document.createElement('div');
        queueItem.classList.add('queue');

        queueItem.innerHTML = `
            <div class="queue-cover"><img src="${song.cover}" alt=""></div>
            <p class="name">${song.name}</p>
        `;

        queueItem.addEventListener('click', () => {
            currentIndex = index;
            loadSong(currentIndex);
            playMusic();
            playlistSection.classList.remove('active');
        });

        queueList.appendChild(queueItem);
    });
}

// Carousel
const carousel = [...document.querySelectorAll('.carousel img')];
let carouselImageIndex = 0;
function changeCarousel() {
    carousel[carouselImageIndex].classList.remove('active');
    carouselImageIndex = (carouselImageIndex + 1) % carousel.length;
    carousel[carouselImageIndex].classList.add('active');
}
setInterval(changeCarousel, 3000);

// Init
loadSong(currentIndex);
generatePlaylist();
function searchSongs() {
    const input = document.getElementById("searchInput").value.toLowerCase();
    const allCards = document.querySelectorAll(".playlist-group .playlist-card");

    allCards.forEach(card => {
        const name = card.querySelector(".playlist-card-name").textContent.toLowerCase();
        if (name.includes(input)) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });
}
let startY = 0;
let endY = 0;
const player = document.querySelector(".music-player-section");

player.addEventListener("touchstart", e => {
  startY = e.touches[0].clientY;
});

player.addEventListener("touchmove", e => {
  endY = e.touches[0].clientY;
});

player.addEventListener("touchend", () => {
  if (startY - endY > 50) {
    // Swiped up
    player.classList.add("active");
  } else if (endY - startY > 50) {
    // Swiped down
    player.classList.remove("active");
  }
});

// Optional: for desktop drag with mouse
let isDragging = false;
let startYMouse = 0;
player.addEventListener("mousedown", e => {
  isDragging = true;
  startYMouse = e.clientY;
});

document.addEventListener("mousemove", e => {
  if (isDragging) {
    endY = e.clientY;
  }
});

document.addEventListener("mouseup", () => {
  if (isDragging) {
    if (startYMouse - endY > 50) {
      player.classList.add("active");
    } else if (endY - startYMouse > 50) {
      player.classList.remove("active");
    }
    isDragging = false;
  }
});
function showSection(section) {
    document.querySelector('.home-section').classList.add('hidden');
    document.querySelector('.about-section').classList.add('hidden');
    document.querySelector('.login-section').classList.add('hidden');

    if (section === 'home') {
        document.querySelector('.home-section').classList.remove('hidden');
    } else if (section === 'about') {
        document.querySelector('.about-section').classList.remove('hidden');
    } else if (section === 'login') {
        document.querySelector('.login-section').classList.remove('hidden');
    }
}

// Search songs
function searchSongs() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    document.querySelectorAll('.playlist-card').forEach(card => {
        const name = card.querySelector('.playlist-card-name').textContent.toLowerCase();
        card.style.display = name.includes(query) ? 'block' : 'none';
    });
}

// Login system
function loginUser() {
    const name = document.getElementById('usernameInput').value.trim();
    if (name) {
        localStorage.setItem('musicUser', name);
        alert(Welcome, ${name}!);
        showSection('home');
    }
}

// Optional: display name if already logged in
window.addEventListener('DOMContentLoaded', () => {
    const name = localStorage.getItem('musicUser');
    if (name) {
        showSection('home');
    }
});