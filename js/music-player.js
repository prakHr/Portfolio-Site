class MusicPlayer extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `
      <link rel="stylesheet" href="./css/style.css" />

      <div class="music-container" id="music-container">
        <div class="music-info">
          <h4 id="title"></h4>
          <div class="progressm-container" id="progressm-container">
            <div class="progressm" id="progressm"></div>
          </div>
        </div>

        <audio id="audio"></audio>

        <div class="img-container">
          <img id="cover" />
        </div>

        <div class="navigation">
          <button id="prev" class="action-btn">
            <i class="fas fa-backward"></i>
          </button>
          <button id="play" class="action-btn action-btn-big">
            <i class="fas fa-play"></i>
          </button>
          <button id="next" class="action-btn">
            <i class="fas fa-forward"></i>
          </button>
        </div>
      </div>
    `;
  }

  connectedCallback() {
    // Elements
    const musicContainer = this.querySelector('#music-container');
    const playBtn = this.querySelector('#play');
    const prevBtn = this.querySelector('#prev');
    const nextBtn = this.querySelector('#next');
    const audio = this.querySelector('#audio');
    const progress = this.querySelector('#progressm');
    const progressContainer = this.querySelector('#progressm-container');
    const title = this.querySelector('#title');
    const cover = this.querySelector('#cover');

    const songs = ['superheroWorkoutMotivation', 'IncredibleLove', 'iWillBecomeHokage'];
    let songIndex = songs.length - 1;

    function loadSong(song) {
      title.innerText = song;
      audio.src = `./music/${song}.webm`;
      cover.src = `./music-image/${song}.jpg`;
    }

    function playSong() {
      musicContainer.classList.add('play');
      playBtn.innerHTML = `<i class="fas fa-pause"></i>`;
      audio.play();
    }

    function pauseSong() {
      musicContainer.classList.remove('play');
      playBtn.innerHTML = `<i class="fas fa-play"></i>`;
      audio.pause();
    }

    function prevSong() {
      songIndex = (songIndex - 1 + songs.length) % songs.length;
      loadSong(songs[songIndex]);
      playSong();
    }

    function nextSong() {
      songIndex = (songIndex + 1) % songs.length;
      loadSong(songs[songIndex]);
      playSong();
    }

    function updateProgress(e) {
      const { duration, currentTime } = e.target;
      const percent = (currentTime / duration) * 100;
      progress.style.width = `${percent}%`;
    }

    function setProgress(e) {
      const width = progressContainer.clientWidth;
      const clickX = e.offsetX;
      const duration = audio.duration;
      audio.currentTime = (clickX / width) * duration;
    }

    // Events
    playBtn.addEventListener('click', () => {
      musicContainer.classList.contains('play') ? pauseSong() : playSong();
    });

    prevBtn.addEventListener('click', prevSong);
    nextBtn.addEventListener('click', nextSong);
    audio.addEventListener('timeupdate', updateProgress);
    progressContainer.addEventListener('click', setProgress);
    audio.addEventListener('ended', nextSong);

    loadSong(songs[songIndex]);
  }
}

customElements.define('music-player', MusicPlayer);