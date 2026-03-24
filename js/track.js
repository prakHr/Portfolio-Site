const Mvideo = document.getElementById("Mmyvideo"); 
const Mcanvas = document.getElementById("Mcanvas");
const Mcontext = Mcanvas.getContext("2d");
let MtrackButton = document.getElementById("Mtrackbutton");
let MupdateNote = document.getElementById("Mupdatenote");

let MisVideo = false;
let Mmodel = null;

// 🌀 Smooth scrolling variables
let scrollSpeed = 0;
let maxSpeed = 40;     // was 15 → much faster top speed
let acceleration = 3;  // was 1 → speeds up quicker
let decay = 0.95;      // was 0.9 → keeps momentum longer

// 🧠 Stability variables
let lastLabel = "";
let stableCount = 0;
let stabilityThreshold = 3;

const MmodelParams = {
    flipHorizontal: true,
    maxNumBoxes: 20,
    iouThreshold: 0.5,
    scoreThreshold: 0.6,
};

// Start video
function MstartVideo() {
    handTrack.startVideo(Mvideo).then(function (status) {
        if (status) {
            MupdateNote.innerText = "Video started. Now tracking";
            MisVideo = true;
            MrunDetection();
            smoothScrollLoop(); // 🚀 start smooth scrolling
        } else {
            MupdateNote.innerText = "Please enable video";
        }
    });
}

function MtoggleVideo() {
    if (!MisVideo) {
        MupdateNote.innerText = "Starting video";
        MstartVideo();
    } else {
        MupdateNote.innerText = "Stopping video";
        handTrack.stopVideo(Mvideo);
        MisVideo = false;
        scrollSpeed = 0;
        MupdateNote.innerText = "Video stopped";
    }
}

// 🧠 Detection loop
function MrunDetection() {
    if (!Mvideo.paused && MisVideo) {
        Mmodel.detect(Mvideo).then(Mpredictions => {

            if (Mpredictions.length > 0) {
                let label = Mpredictions[0].label;

                // 🧠 Stability check
                if (label === lastLabel) {
                    stableCount++;
                } else {
                    stableCount = 0;
                }
                lastLabel = label;

                if (stableCount > stabilityThreshold) {
                    if (label === 'closed') {
                        scrollSpeed -= acceleration; // scroll up
                    } else if (label === 'open') {
                        scrollSpeed += acceleration; // scroll down
                    }
                }
            }

            // Clamp speed
            scrollSpeed = Math.max(-maxSpeed, Math.min(maxSpeed, scrollSpeed));

            // Draw predictions
            Mmodel.renderPredictions(Mpredictions, Mcanvas, Mcontext, Mvideo);

            requestAnimationFrame(MrunDetection);
        });
    }
}

// 🌀 Smooth scroll loop
function smoothScrollLoop() {
    if (MisVideo) {
        if (Math.abs(scrollSpeed) > 0.1) {
            window.scrollBy(0, scrollSpeed);
            scrollSpeed *= decay; // friction effect
        } else {
            scrollSpeed = 0;
        }
        requestAnimationFrame(smoothScrollLoop);
    }
}

// Load model
handTrack.load(MmodelParams).then(lmodel => {
    Mmodel = lmodel;
    MupdateNote.innerText = "Loaded Model!";
    MtrackButton.disabled = false;
});

// Canvas follows scroll
function updateCanvasPosition() {
    Mcanvas.style.position = 'absolute';
    Mcanvas.style.top = window.scrollY + 'px';
}

window.addEventListener('scroll', updateCanvasPosition);