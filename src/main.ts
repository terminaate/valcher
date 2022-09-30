import {app, BrowserWindow} from "electron";
import * as path from "path";
import * as fs from "fs";

function createWindow() {
    const mainWindow = new BrowserWindow({
        minHeight: 600,
        minWidth: 800,
        center: true,
        webPreferences: {
            preload: path.resolve(__dirname, "./preload.js")
        }
    });

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

