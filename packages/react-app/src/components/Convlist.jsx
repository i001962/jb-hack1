import React, { useState, useEffect, memo } from "react";
import { Card, Input, Button } from "antd";

import crypto from "crypto";

export default function List ({who, who2, db }) {

    const [Conversations, setConversations] = useState([]);
    const [write, setWritten] = useState("");
    const [msg, setMsg] = useState([]);

    useEffect(() => {
        db.get("chat").map().once(data => {
            setMsg((prev) => ( [...prev, data] ))
        });
    }, [setMsg])

    return (
        <Card>
            <div className="convList">
                {msg.map(data =>
                    <li>{data}</li>
                )}

                <Input placeholder="Type here..." type="text" value={write} onInput={(e) => setWritten(e.target.value)}/>
                <Button onClick={() => { 
                    console.log(write)
                    db.get("chat").set(write);
                }}>Send</Button>
            </div>
        </Card>
    )
}

export const ListMemo = memo(List);