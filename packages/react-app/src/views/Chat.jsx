import React, { useEffect, useState, useCallback, memo } from "react";
import { Card, Input, Button } from "antd";
import List from "../components/Convlist";
import Gun from "gun";

const gun = Gun({radisk: false, localStorage:false});

const get =  key => {
     return new Promise((resolve, reject) => {
        gun.get(key).on(data => resolve(data));
    })
}

const lastOf = async key => { 
    return Object.values(await get(key)).pop();
}

// push to array last element on change of other  var.
export default function Chat({ isLogged }) {
    
    const [msg, setMsg] = useState(["<b>Welcome to this amazing discussion...</b>", "Please feel free to enjoy ;)"]);
    const [connected, setConnected] = useState(false);
    const [write, setWritten] = useState("");

    useEffect(() => {
        if (!(isLogged == "")) setConnected(true)
        else if (isLogged == "") setConnected(false);
    }, [isLogged])

    useEffect(() => {
        gun.get("chat").map().once(data => {
            setMsg((prev) => ( [...prev, data] ))
        });
    }, [setMsg])
    return (
        connected ?         
        <div id="chat" className="chat">
            <Card>
                <h1>Hi {isLogged}!</h1>
                <List who={isLogged} db={gun}></List>
            </Card>
        </div>

        :

        <div>
            Not Connected
        </div>
    )
}

export const ChatMemo = memo(Chat);



// {msg.map(data =>
//     <li>{data}</li>
// )}

// <Input placeholder="Type here..." type="text" value={write} onInput={(e) => setWritten(e.target.value)}/>
// <Button onClick={() => { 
//     console.log(write)
//     gun.get("chat").set(write);
// }}>Send</Button>