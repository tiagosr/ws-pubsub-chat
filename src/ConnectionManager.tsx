import {socket} from "./Socket";

const ConnectionManager = ({connected}: {connected:boolean}) => {
    return <>
        <button disabled={connected} onClick={()=>socket.connect()}>Connect</button>
        <button disabled={!connected} onClick={()=>socket.disconnect()}>Disconnect</button>
    </>
};

export {ConnectionManager};