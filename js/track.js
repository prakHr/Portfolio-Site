let lastLabel = null; // 🧠 remember previous state

function MrunDetection() {
    if (!Mvideo.paused && MisVideo) {
        Mmodel.detect(Mvideo).then(Mpredictions => {

            if (Mpredictions.length > 0) {
                let label = Mpredictions[0].label;

                // 🔁 Only act when label CHANGES
                if (label !== lastLabel) {

                    if (label === 'closed') {
                        // 🔼 Scroll UP
                        window.scrollBy({
                            top: -1000,
                            behavior: 'smooth'
                        });
                    } 
                    else if (label === 'open') {
                        // 🔽 Scroll DOWN
                        window.scrollBy({
                            top: 1000,
                            behavior: 'smooth'
                        });
                    }

                    // 🧠 Update last state
                    lastLabel = label;
                }
            }

            Mmodel.renderPredictions(Mpredictions, Mcanvas, Mcontext, Mvideo);
            requestAnimationFrame(MrunDetection);
        });
    }
}