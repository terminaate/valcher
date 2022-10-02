const fs = require("fs");
const path = require("path");
const rimraf = require("rimraf");

const rootPath = path.resolve(__dirname, "../out");
const appPath = path.resolve(__dirname, rootPath, fs.readdirSync(rootPath)[0], "resources/app");
const appFiles = fs.readdirSync(appPath);
const blackList = ["node_modules", "package.json", "dist"]

for (let file of appFiles) {
    if (!blackList.includes(file)) {
        rimraf.sync(path.resolve(appPath, file))
    }
}