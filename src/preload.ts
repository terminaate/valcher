const {Titlebar, Color} = require("custom-electron-titlebar")

window.addEventListener('DOMContentLoaded', () => {
    const titleBar = new Titlebar();
    titleBar.updateBackground(Color.fromHex("#0e0e0e"))
    titleBar._menubarContainer.remove()
    titleBar._title.className = "appTitle";
    // titleBar._title.style.maxWidth = "max-content";
    titleBar._windowIcon.innerHTML += titleBar._title.outerHTML;
    titleBar._windowIcon.className = "appIconContainer"
    titleBar._title.remove();
    titleBar._titlebar.style.cursor = "pointer"

    // titleBar._title.style.position = "relative";
    // titleBar._title.style.transform = "";
    // titleBar._title.style.left = "30px"
    // titleBar._title.style.width = "max-content"
});