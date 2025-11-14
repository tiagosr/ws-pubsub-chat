import { useEffect, useReducer, useState } from "react";
import { socket } from "./Socket";
import "./App.css";
import { ConnectionManager } from "./ConnectionManager";

type User = {
  name: string;
  id: string;
};

type Message = {
  value: string;
  userId: string;
};

function App() {
  const [userName, setUserName] = useState("");
  const [count, setCount] = useState(0);
  const [connected, setConnected] = useState(false);
  const [messages, dispatchMessages] = useReducer(
    (
      state: Message[],
      { type, message }: { type: string; message: Message }
    ): Message[] => {
      switch (type) {
        case "add":
          if (message !== null) return [...state, message];
      }
      return state;
    },
    []
  );

  const [message, setMessage] = useState("");
  const [users, dispatchUsers] = useReducer(
    (
      state: User[],
      { type, user, users }: { type: string; user?: User; users?: User[] }
    ): User[] => {
      switch (type) {
        case "add":
          return [...state, user!];
        case "remove":
          return state.filter((currentUser) => currentUser.id !== user!.id);
        case "allUsers":
          console.log("all users received:", users);
          return [...users!];
        case "changeName":
          console.log(state);
          return state.map((currentUser: User): User => {
            if (user!.id === currentUser.id) {
              return user!;
            } else {
              return currentUser;
            }
          });
      }
      return state;
    },
    []
  );

  useEffect(() => {
    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(false);
    const onMessage = (value: string, user: User) =>
      dispatchMessages({ type: "add", message: { value, userId: user.id } });
    const onUserJoined = (user: User) =>
      dispatchUsers({ type: "add", user: user });
    const onAllUsersList = (users: User[]) =>
      dispatchUsers({ type: "allUsers", users });
    const onChangeName = (user: User) =>
      dispatchUsers({ type: "changeName", user });
    const onUserLeft = (user: User) => dispatchUsers({ type: "remove", user });

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("message", onMessage);
    socket.on("user-joined", onUserJoined);
    socket.on("all-users-list", onAllUsersList);
    socket.on("change-name", onChangeName);
    socket.on("user-left", onUserLeft);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("message", onMessage);
      socket.off("user-joined", onUserJoined);
      socket.off("all-users-list", onAllUsersList);
      socket.off("change-name", onChangeName);
      socket.off("user-left", onUserLeft);
    };
  }, []);

  return (
    <>
      <h1>Vite + React + Socket.io</h1>
      <input type="text" onChange={(e) => setMessage(e.target.value)}></input>
      <button
        onClick={() => {
          console.log(message);
          socket.emit("main", message);
        }}
      >
        send
      </button>
      <input type="text" onChange={(e) => setUserName(e.target.value)}></input>
      <button
        onClick={() => {
          socket.emit("change-name", userName);
        }}
      >
        change my name
      </button>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <div>
          <ConnectionManager connected={connected} />
        </div>
        Are we connected? {connected ? "Yes" : "No"}
        <ul>
          {messages.map((message, i) => (
            <li key={i}>
              {users.find((user) => message.userId === user.id)?.name}:{" "}
              {message.value}
            </li>
          ))}
        </ul>
        <ul>
          {users.map((user, i) => (
            <li key={i}>{user.name}</li>
          ))}
          <input
            type="text"
            onChange={(e) => setMessage(e.target.value)}
          ></input>
          <button
            onClick={() => {
              console.log(message);
              socket.emit("main", message);
            }}
          >
            send
          </button>
        </ul>
      </div>
    </>
  );
}

export default App;
