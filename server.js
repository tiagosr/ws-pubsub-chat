import express from "express";
import ViteExpress from "vite-express";
import {Server} from "socket.io";

const port = 5173

const app = express();

//ViteExpress.config({mode:"development"});
app.get("/message", (_, res) => res.send("hello express!"));
const server = app.listen(port, "0.0.0.0", () => console.log(`hello vite-express! http://localhost:${port}/`));
const io = new Server(server, {
    cors: {
        origin: [`http://localhost:${port}`]
    }
});
io.on("connection", (stream) => {
    console.log("someone connected!");
    stream.on("disconnect", () => {
        console.log("someone disconnected!");
    })
});
ViteExpress.bind(app, server);
