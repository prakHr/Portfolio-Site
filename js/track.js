const Mvideo = document.getElementById("Mmyvideo");
const Mcanvas = document.getElementById("Mcanvas");
const Mcontext = Mcanvas.getContext("2d");
const MtrackButton = document.getElementById("Mtrackbutton");
const MupdateNote = document.getElementById("Mupdatenote");

let MisVideo = false;
let Mmodel = null;

let pulse = 0;
let lastX = 320;
let lastY = 240;

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
            MupdateNote.innerText = "Video started. Use your hand!";
            MisVideo = true;
            MrunDetection();
        } else {
            MupdateNote.innerText = "Please enable camera";
        }
    });
}

// 🔁 Toggle
function MtoggleVideo() {
    if (!MisVideo) {
        MstartVideo();
    } else {
        handTrack.stopVideo(Mvideo);
        MisVideo = false;
        MupdateNote.innerText = "Video stopped";
    }
}

MtrackButton.addEventListener("click", MtoggleVideo);

// ⚡ Draw repulsor beam
function drawRepulsor(ctx, x, y, firing) {
    pulse += 0.15;

    const coreRadius = 8 + Math.sin(pulse) * 3;
    const beamLength = 220 + Math.sin(pulse) * 30;

    ctx.save();

    ctx.shadowColor = firing ? "yellow" : "rgba(255,255,0,0.3)";
    ctx.shadowBlur = firing ? 40 : 10;

    // Core
    ctx.beginPath();
    ctx.arc(x, y, coreRadius, 0, 2 * Math.PI);
    ctx.fillStyle = "yellow";
    ctx.fill();

    // Beam only when closed
    if (firing) {
        const gradient = ctx.createLinearGradient(x, y, x, y - beamLength);
        gradient.addColorStop(0, "rgba(255,255,0,1)");
        gradient.addColorStop(1, "rgba(255,255,0,0)");

        ctx.beginPath();
        ctx.moveTo(x - 6, y);
        ctx.lineTo(x + 6, y);
        ctx.lineTo(x + 2, y - beamLength);
        ctx.lineTo(x - 2, y - beamLength);
        ctx.closePath();
        ctx.fillStyle = gradient;
        ctx.fill();

        // Outer glow
        ctx.beginPath();
        ctx.moveTo(x - 12, y);
        ctx.lineTo(x + 12, y);
        ctx.lineTo(x + 4, y - beamLength);
        ctx.lineTo(x - 4, y - beamLength);
        ctx.closePath();
        ctx.fillStyle = "rgba(255,255,0,0.2)";
        ctx.fill();
    }

    ctx.restore();
}

// 🔍 Detection loop
function MrunDetection() {
    if (!Mvideo.paused && MisVideo) {
        Mmodel.detect(Mvideo).then(Mpredictions => {

            Mcontext.clearRect(0, 0, Mcanvas.width, Mcanvas.height);

            // 🎯 FILTER: only open & closed (robust)
            const validPredictions = Mpredictions.filter(p =>
                p.label.toLowerCase().includes("open") ||
                p.label.toLowerCase().includes("closed")
            );

            console.log("Valid predictions:", validPredictions);

            // 🎨 Draw ONLY filtered bounding boxes
            validPredictions.forEach(pred => {
                const [x, y, width, height] = pred.bbox;

                Mcontext.beginPath();
                Mcontext.rect(x, y, width, height);
                Mcontext.lineWidth = 3;
                Mcontext.strokeStyle =
                    pred.label.toLowerCase().includes("closed") ? "red" : "lime";
                Mcontext.stroke();

                // Label text
                Mcontext.font = "16px Arial";
                Mcontext.fillStyle = "white";
                Mcontext.fillText(pred.label, x, y > 10 ? y - 5 : 10);
            });

            // 🎯 Use first valid hand
            if (validPredictions.length > 0) {
                const pred = validPredictions[0];
                const [x, y, width, height] = pred.bbox;

                const targetX = x + width / 2;
                const targetY = y + height / 2;

                // 🧠 Smooth tracking
                lastX = lastX * 0.7 + targetX * 0.3;
                lastY = lastY * 0.7 + targetY * 0.3;

                const isFiring = pred.label.toLowerCase().includes("closed");

                drawRepulsor(Mcontext, lastX, lastY, isFiring);

                MupdateNote.innerText = isFiring ? "🔥 FIRING" : "🟡 AIMING";
            } else {
                MupdateNote.innerText = "✋ Show open/closed hand";
            }

            requestAnimationFrame(MrunDetection);
        });
    }
}

// 📦 Load model
handTrack.load(MmodelParams).then(lmodel => {
    Mmodel = lmodel;
    MupdateNote.innerText = "Model loaded. Click Start!";
    MtrackButton.disabled = false;
});

// 📐 Keep canvas aligned
function updateCanvasPosition() {
    Mcanvas.style.top = window.scrollY + 'px';
}
window.addEventListener('scroll', updateCanvasPosition);
