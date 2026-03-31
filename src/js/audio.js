
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
            });
        }
    };

    const loadAll = () => Promise.all([
        load("move", "./sounds/drop.mp3"),
        load("gameover", "./sounds/clear_game.mp3")
    ]);

    return {
        load,
        loadAll,
        play
    };
}
