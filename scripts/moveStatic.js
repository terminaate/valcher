const copyDir = require("copy-dir")
const path = require("path")

const cpDir = (src, dest) => {
    copyDir(path.resolve(__dirname, src), path.resolve(__dirname, dest), {cover: true})
}

cpDir("../src/assets", "../dist/assets")
cpDir("../src/server/static", "../dist/server/static")
console.log("Static is moved without errors!")