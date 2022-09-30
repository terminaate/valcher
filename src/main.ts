import {app, BrowserWindow} from "electron";
import * as path from "path";
import * as fs from "fs";

const { setupTitlebar, attachTitlebarToWindow } = require("custom-electron-titlebar/main")

setupTitlebar()

function createWindow() {
    const mainWindow = new BrowserWindow({
        minHeight: 480,
        minWidth: 850,
        height: 480,
        width: 850,
        resizable: true,
        center: true,
        // autoHideMenuBar: true, // hide menubar on top
        titleBarStyle: 'hidden',
        webPreferences: {
            sandbox: false,
            preload: path.join(__dirname, 'preload.js')
        }
    });

    attachTitlebarToWindow(mainWindow);

    const loadingInterval = setInterval(() => {
        if (fs.readdirSync(path.resolve(__dirname, "")).includes("client") && fs.readdirSync(path.resolve(__dirname, "./client")).includes("index.html")) {
            mainWindow.loadFile(path.resolve(__dirname, "./client/index.html"));
            clearInterval(loadingInterval)
        }
    }, 1)

    require("./server/index.js")
}


app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
        if (require.cache["./server/index.js"]) {
            delete require.cache["./server/index.js"];
        }
    }
});

