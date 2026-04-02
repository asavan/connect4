function drawAudioSymbol(btn, hasSound) {
    let text = "🔇";
    if (hasSound) {
        text = "🔊";
    }
    btn.textContent = text;
}

export default function handleAudio(window, document, settings) {
    const btn = document.querySelector(".js-sound-btn");
    if (!btn) {
        return;
    }

    btn.classList.remove("hidden");
    drawAudioSymbol(btn, settings.sound);
    let text = "🔇";
    if (settings.sound) {
        text = "🔊";
    }

    btn.textContent = text;

    btn.addEventListener("click", (e) => {
        e.preventDefault();
        settings.sound = !settings.sound;
        drawAudioSymbol(btn, settings.sound);
    });
}
