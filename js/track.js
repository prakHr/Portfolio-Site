const Mvideo = document.getElementById("Mmyvideo");
const Mcanvas = document.getElementById("Mcanvas");
const Mcontext = Mcanvas.getContext("2d");
let MtrackButton = document.getElementById("Mtrackbutton");
let MupdateNote = document.getElementById("Mupdatenote");

let MisVideo = false;
let Mmodel = null;

const MmodelParams = {
    flipHorizontal: true,   // flip e.g for video  
    maxNumBoxes: 20,        // maximum number of boxes to detect
    iouThreshold: 0.5,      // ioU threshold for non-max suppression
    scoreThreshold: 0.6,    // confidence threshold for predictions.
};

// Wait for video to load before starting detection
Mvideo.addEventListener("loadeddata", () => {
    // console.log("Video data loaded, now ready to start detection.");
    // MstartVideo();
});

function MstartVideo() {
    handTrack.startVideo(Mvideo).then(function (status) {
        // console.log("video started", status);
        if (status) {
            MupdateNote.innerText = "Video started. Now tracking";
            MisVideo = true;
            MrunDetection();
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
        MupdateNote.innerText = "Video stopped";
    }
}

function MrunDetection() {
    if (!Mvideo.paused && MisVideo) {
        Mmodel.detect(Mvideo).then(Mpredictions => {
            // console.log("MPredictions: ", Mpredictions);
            if (Mpredictions.length > 0) {
                let label = Mpredictions[0].label;
                // console.log(label);
                if (label == 'closed') {
                    // Scroll a little bit up (e.g., 100 pixels)
                    window.scrollBy(0, -100); // The second parameter is the vertical scroll distance (negative value for upward scroll)
                } else if (label == 'open') {
                    // Scroll a little bit down (e.g., 100 pixels)
                    window.scrollBy(0, 100); // The second parameter is the vertical scroll distance (positive value for downward scroll)
                }
            }
            Mmodel.renderPredictions(Mpredictions, Mcanvas, Mcontext, Mvideo);
            requestAnimationFrame(MrunDetection); // Continue detection
        });
    }
}

// Load the model.
handTrack.load(MmodelParams).then(lmodel => {
    Mmodel = lmodel;
    MupdateNote.innerText = "Loaded Model!";
    MtrackButton.disabled = false;
});
// Update canvas position with scroll
function updateCanvasPosition() {
    // You can update the canvas's position (e.g., using top or transform)
    // This ensures it moves with the scroll
    Mcanvas.style.position = 'absolute'; // or 'fixed' based on your needs
    Mcanvas.style.top = window.scrollY + 'px'; // Adjust the canvas position with the scroll
}

// Listen to scroll events to move the canvas
window.addEventListener('scroll', updateCanvasPosition);