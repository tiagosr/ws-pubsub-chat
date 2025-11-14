import express from "express";
import ViteExpress from "vite-express";
import { Server } from "socket.io";

const port = 5173;

const app = express();

//ViteExpress.config({mode:"development"});
app.get("/message", (_, res) => res.send("hello express!"));
const server = app.listen(port, "0.0.0.0", () =>
  console.log(`hello vite-express! http://localhost:${port}/`)
);
const io = new Server(server, {
  cors: {
    origin: [`http://localhost:${port}`],
  },
});

let users = {};
io.on("connection", (stream) => {
  const thisUser = { id: stream.id, name: `user-${stream.id}` };
  users[stream.id] = thisUser;
  io.emit("user-joined", thisUser);
  stream.emit("all-users-list", Object.values(users));

  stream.on("main", (message) => {
    console.log(message);
    io.emit("message", message, thisUser);
  });
  stream.on("disconnect", () => {
    console.log(`${thisUser.name} disconnected!`);
    io.emit("user-left", thisUser);
    delete users[stream.id];
  });

  stream.on("change-name", (userName) => {
    console.log("change name: ", userName);
    let user = users[stream.id];
    user.name = userName;
    users[stream.id] = user;
    io.emit("change-name", user);
  });
});
ViteExpress.bind(app, server);
