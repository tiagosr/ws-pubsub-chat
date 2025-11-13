import { useEffect, useReducer, useState } from 'react'
import { socket } from './Socket'
import './App.css'
import { ConnectionManager } from './ConnectionManager';

function App() {
  const [count, setCount] = useState(0)
  const [connected, setConnected] = useState(false);
  const [messages, dispatchMessages] = useReducer((state: string[], { type, message }: { type: string; message: string | null; }): string[] => {
    switch (type) {
      case "add":
        if (message !== null)
          return [...state, message];
    }
    return state;
  }, []);

  useEffect(() => {
    const onConnect = () => {
      setConnected(true);
    }
    const onDisconnect = () => {
      setConnected(false);
    }
    const onMessage = (value: string) => {
      dispatchMessages({type: "add", message: value});
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("message", onMessage);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("message", onMessage);
    }

  }, []);

  return (
    <>
      <h1>Vite + React + Socket.io</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          <div><ConnectionManager connected={connected} /></div>
          Are we connected? {connected?"Yes":"No"}
        </p>
        <ul>
          {messages.map((message, i) => <li key={i}>{message}</li>)}
        </ul>
      </div>
    </>
  )
}

export default App
