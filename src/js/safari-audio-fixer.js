function playThenPause(audioManager, logger) {
    for (const audObj of Object.values(audioManager.getAllSounds())) {
        const audio = audObj.audio;
        audio.play().then(() => {
            // Audio is now playing successfully
            logger.log("Playback started.");
            audio.pause(); // Safe to pause here
        }).catch(err => {
            logger.log(err);
            logger.error("Playback failed2: " + err.name + " " + err.message);
        });
    }
}

export function safariFixAudio(document, audioManager, logger) {
    try {
        document.querySelector("body")?.addEventListener("click", () => {
            logger.log("This will only log once.");
            try {
                playThenPause(audioManager, logger);
                if (navigator.audioSession) {
                    navigator.audioSession.type = "playback";
                } else {
                    logger.log("No audioSession");
                }
            } catch (e) {
                logger.log(e);
            }
        }, { once: true });

    } catch (e) {
        logger.log(e);
    }
}
