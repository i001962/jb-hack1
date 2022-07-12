import React, { useEffect, useState, useCallback, memo } from "react";
import { Card, Input, Button } from "antd";
import List from "../components/Convlist";
import Gun from "gun";

const gun = Gun({radisk: false, localStorage:true});

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
    
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        if (!(isLogged == "")) setConnected(true)
        else if (isLogged == "") setConnected(false);
    }, [isLogged])

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