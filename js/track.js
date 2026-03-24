const Mvideo = document.getElementById("Mmyvideo");
const Mcanvas = document.getElementById("Mcanvas");
const Mcontext = Mcanvas.getContext("2d");
let MtrackButton = document.getElementById("Mtrackbutton");
let MupdateNote = document.getElementById("Mupdatenote");

let MisVideo = false;
let Mmodel = null;

let pulse = 0;

const MmodelParams = {
    flipHorizontal: true,
    maxNumBoxes: 20,
    iouThreshold: 0.5,
    scoreThreshold: 0.6,
};

// 🎥 Start video
function MstartVideo() {
    handTrack.startVideo(Mvideo).then(function (status) {
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

// ⚡ Draw Iron Man repulsor beam
function drawRepulsor(ctx, x, y) {
    pulse += 0.15;

    const coreRadius = 8 + Math.sin(pulse) * 3;
    const beamLength = 150 + Math.sin(pulse) * 20;

    ctx.save();

    // 🔆 Core glow
    ctx.shadowColor = "yellow";
    ctx.shadowBlur = 30;

    ctx.beginPath();
    ctx.arc(x, y, coreRadius, 0, 2 * Math.PI);
    ctx.fillStyle = "yellow";
    ctx.fill();

    // ⚡ Beam (gradient)
    const gradient = ctx.createLinearGradient(x, y, x, y - beamLength);
    gradient.addColorStop(0, "rgba(255,255,0,1)");
    gradient.addColorStop(1, "rgba(255,255,0,0)");

    ctx.beginPath();
    ctx.moveTo(x - 4, y);
    ctx.lineTo(x + 4, y);
    ctx.lineTo(x + 2, y - beamLength);
    ctx.lineTo(x - 2, y - beamLength);
    ctx.closePath();

    ctx.fillStyle = gradient;
    ctx.fill();

    // ✨ Outer glow beam
    ctx.beginPath();
    ctx.moveTo(x - 8, y);
    ctx.lineTo(x + 8, y);
    ctx.lineTo(x + 4, y - beamLength);
    ctx.lineTo(x - 4, y - beamLength);
    ctx.closePath();

    ctx.fillStyle = "rgba(255,255,0,0.2)";
    ctx.fill();

    ctx.restore();
}

// 🔍 Detection loop
function MrunDetection() {
    if (!Mvideo.paused && MisVideo) {
        Mmodel.detect(Mvideo).then(Mpredictions => {

            if (Mpredictions.length > 0) {
                let label = Mpredictions[0].label;

                if (label == 'closed') {
                    window.scrollBy(0, -100);
                } else if (label == 'open') {
                    window.scrollBy(0, 100);
                }
            }

            // Draw boxes
            Mmodel.renderPredictions(Mpredictions, Mcanvas, Mcontext, Mvideo);

            // ⚡ Draw repulsor beams
            Mpredictions.forEach(pred => {
                const [x, y, width, height] = pred.bbox;

                const centerX = x + width / 2;
                const centerY = y + height / 2;

                drawRepulsor(Mcontext, centerX, centerY);
            });

            requestAnimationFrame(MrunDetection);
        });
    }
}

// Load model
handTrack.load(MmodelParams).then(lmodel => {
    Mmodel = lmodel;
    MupdateNote.innerText = "Loaded Model!";
    MtrackButton.disabled = false;
});

// Keep canvas aligned with scroll
function updateCanvasPosition() {
    Mcanvas.style.position = 'absolute';
    Mcanvas.style.top = window.scrollY + 'px';
}
