import React, { useEffect, useState, useRef } from "react";
import { Card } from "antd";
import Gun from "gun";

const gun = Gun();

gun.get("chat").put({ hvrjg: "hsughsbjk" })

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
    
    const [msg, setMsg] = useState([]);

    useEffect(() => {
        gun.get("chat").map().on(data => {
            setMsg((prev) => ( [...prev, data] ))
        })
    }, [])

    return <div id="chat" className="chat">
        <Card>
            <p>Test</p>

            <button onClick={() => { gun.get("chat").set(Math.random() * 0.1) }}>Add random value</button>
            {msg.map(data =>
                <li>{data}</li>
            )}
        </Card>
    </div>
}