export default function handleHelpBtn(window, document, settings, trans, logger) {
    const btn = document.querySelector(".js-help");
    if (!btn) {
        logger.log("No button");
        return;
    }
    const dialog = document.querySelector("#rulesDialog");
    const textField = dialog.querySelector(".rulesContent");
    btn.classList.remove("hidden");
    btn.addEventListener("click", async (e) => {
        e.preventDefault();
        const text = await trans.t("rules");
        textField.textContent = text;
        dialog.togglePopover();
    });
}
