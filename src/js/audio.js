
export function audioManager(settings, logger) {
    const sounds = {};
    const load = (name, path) => new Promise((resolve, reject) => {
        const audio = new Audio(path);
        sounds[name] = {audio, loaded: false};
        audio.onloadeddata = () => {
            sounds[name].loaded = true;
            resolve();
        };
        audio.onerror = (err) => {
            logger.error("No audio on path " + path);
            reject(err);
        };
    });
    const play = (name) => {
        if (!settings.sound) {
            return;
        }
        const sound = sounds[name];
        if (sound && sound.loaded) {
            sound.audio.currentTime = 0;
            // catch?
            sound.audio.play().catch(err => {
                logger.log(err);
                logger.error("Playback failed: " + err.name + " " + err.message);
            });
        } else {
            logger.log("Not loaded sound " + name);
        }
    };

    const loadAll = () => Promise.all([
        load("move", "./sounds/drop.mp3"),
        load("gameover", "./sounds/clear_game.mp3")
    ]);

    const getAllSounds = () => sounds;

    return {
        load,
        loadAll,
        getAllSounds,
        play
    };
}
