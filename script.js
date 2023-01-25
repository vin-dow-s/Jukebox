const audio = document.querySelector('audio');
const progressEl = document.querySelector('input[type="range"]');

const vinyl = document.querySelector('.vinyl');
const title = document.querySelector('#title');
const volumeSlider = document.querySelector('.slider');

const previousButton = document.querySelector('#previous');
const playPauseButton = document.querySelector('#play-pause');
const nextButton = document.querySelector('#next');

const songList = document.querySelector('.song-list');

let timer = document.querySelector('#timer');
let update = setInterval(function() {
    let mins = Math.floor(audio.currentTime / 60);
    let secs = Math.floor(audio.currentTime % 60);
    if (secs < 10) {
        secs = '0' + String(secs);
    }
    timer.innerHTML = mins + ':' + secs;
}, 10);

let songArray = [];
let songHeading = '';
let songIndex = 0;
let isPlaying = false;
let mouseDownOnSlider = false;

function loadAudio(){
    audio.src = songArray[songIndex];

    let songListItems = songList.getElementsByTagName('li');
    songHeading = songListItems[songIndex].getAttribute('data-name');
    title.innerText = songHeading;

    //Highlight
    for (i = 0; i < songListItems.length; i++){
        songListItems[i].classList.remove('active');
    }

    songList.getElementsByTagName('li')[songIndex].classList.add('active');
}

function loadSongs(){
    let songs = songList.getElementsByTagName('li');
    for(i = 0; i < songs.length ; i++) {
        songArray.push(songs[i].getAttribute('data-src'));
    }

    loadAudio();
}

loadSongs();

function playAudio(){
    audio.play();
    playPauseButton.querySelector('i.fa-solid').classList.remove('fa-play');
    playPauseButton.querySelector('i.fa-solid').classList.add('fa-pause');
    isPlaying = true;
    vinyl.classList.remove('vinyl-paused');
    vinyl.classList.add('vinyl-animation');
}

function pauseAudio(){
    audio.pause();
    playPauseButton.querySelector('i.fa-solid').classList.remove('fa-pause');
    playPauseButton.querySelector('i.fa-solid').classList.add('fa-play');
    isPlaying = false;
    vinyl.classList.add('vinyl-paused');
}

function previousSong(){
    songIndex--;

    if(songIndex < 0){
        songIndex = songArray.length - 1;
    }
    loadAudio();
    playAudio();
}

function nextSong(){
    songIndex++;

    if(songIndex > songArray.length - 1){
        songIndex = 0;
    }
    loadAudio();
    playAudio();
}

playPauseButton.addEventListener('click', function(){
   if(isPlaying){
       pauseAudio();
       vinyl.classList.add('.paused');
   } else {
       playAudio();
       vinyl.classList.remove('.paused');
   }
}, false);

previousButton.addEventListener('click', function(){
    previousSong();
}, false);

nextButton.addEventListener('click', function(){
    nextSong();
}, false);

songList.addEventListener('click', function (e){
    songIndex = e.target.closest('li').getAttribute('data-index');
    loadAudio();
    playAudio();
}, false);

audio.addEventListener('ended', function(){
   nextSong();
}, false);

volumeSlider.addEventListener('input', function(){
    audio.volume = volumeSlider.value / 100;
}, false);

audio.addEventListener("timeupdate", () => {
    if (!mouseDownOnSlider) {
        progressEl.value = audio.currentTime / audio.duration * 100;
    }
});

progressEl.addEventListener("change", () => {
    const pct = progressEl.value / 100;
    audio.currentTime = (audio.duration || 0) * pct;
});

progressEl.addEventListener("mousedown", () => {
    mouseDownOnSlider = true;
});

progressEl.addEventListener("mouseup", () => {
    mouseDownOnSlider = false;
});

