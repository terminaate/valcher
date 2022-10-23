import errorMiddleware from './middlewares/error.middleware';
import serverRouter from './routers/server.router';
import * as path from 'path';
import db from './db';
import JwtService from './services/jwt.service';
import {Server} from "socket.io";
import SocketRouter from "./routers/socket.router";

// IMPORTS THAT CONFLICTS
const express = require('express');
const cors = require('cors');
const cookieParser = require("cookie-parser")

async function start(port = 19245) {
    const app = express();

    try {
        await db.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }

    await JwtService.init();

    app.use(cors({
        credentials: true,
        origin: ["http://127.0.0.1:3000", "http://localhost:3000", "http://127.0.0.1:19245", "http://localhost:19245"]
    }));
    app.use(cookieParser())
    app.use(express.json({extended: true, limit: '100mb'}));
    app.use(express.static(path.resolve(__dirname, '../client')));
    app.use('/api', serverRouter);
    app.use(errorMiddleware);

    app.get('/*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../client/index.html'));
    });

    try {
        const server = await app.listen(port, () =>
            console.log('Server listening on http://127.0.0.1:' + port)
        );
        const io = new Server(server, {
            cors: {
                credentials: true,
                origin: ["http://127.0.0.1:3000", "http://localhost:3000", "http://127.0.0.1:19245", "http://localhost:19245"]
            }
        });
        io.on("connection", socket => {
            new SocketRouter(socket, io);
        })
    } catch (e) {
        throw new Error(e.message);
        process.exit(0);
    }
}

start();
