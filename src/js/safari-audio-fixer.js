function playThenPause(audioManager) {
    for (const audObj of Object.values(audioManager.getAllSounds())) {
        const audio = audObj.audio;
        audio.play();
        audio.pause();
        audio.currentTime = 0;
    }
}

export function safariFixAudio(document, audioManager, logger) {
    try {
        document.querySelector("body")?.addEventListener("click", () => {
            logger.log("This will only log once.");
            try {
                playThenPause(audioManager);
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
