import errorMiddleware from "./middlewares/error.middleware";
import serverRouter from "./server.router";
import DbRepository from "./db.repository";
import path from "path";

const express = require("express");
const cors = require("cors");

async function start(port = 19245) {
    const app = express()

    DbRepository.init()
    app.use(cors())
    app.use(express.json({extended: true}))
    app.use(express.static(path.resolve(__dirname, "../client")))
    app.use("/api", serverRouter)
    app.use(errorMiddleware)

    app.get("/*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "../client/index.html"))
    })

    try {
        await app.listen(port, () => console.log("Server listening on http://127.0.0.1:" + port))
    } catch (e) {
        throw new Error(e.message);
        process.exit(0)
    }
}

start()