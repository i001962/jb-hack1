import React, { useEffect, useState, useCallback, memo } from "react";
import { Card } from "antd";
import Gun from "gun";

const gun = Gun();

const get =  key => {
     return new Promise((resolve, reject) => {
        gun.get(key).on(data => resolve(data));
    })
}

const lastOf = async key => { 
    return Object.values(await get(key)).pop();
}

// push to array last element on change of other  var.
export default function Chat() {
    
    const [msg, setMsg] = useState(["<b>Welcome to this amazing discussion...</b>", "Please feel free to enjoy ;)"]);
    const [write, setWritten] = useState("");

    useEffect(() => {
        gun.get("chat").map().once(data => {
            setMsg((prev) => ( [...prev, data] ))
        });
    }, [setMsg])
    return <div id="chat" className="chat">
        <Card>
            <p>Test</p>

            {msg.map(data =>
                <li>{data}</li>
            )}

            <input placeholder="Type here..." type="text" value={write} onInput={(e) => setWritten(e.target.value)}/>
            <button onClick={() => { 
                console.log(write)
                gun.get("chat").set(write);
            }}>Send</button>
        </Card>
    </div>
}

export const ChatMemo = memo(Chat);