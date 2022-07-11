import React, { useState, useEffect, memo } from "react";
import { Card } from "antd";

import crypto from "crypto";

function HashNamespace(user1, user2) {
    // Return the namespace that'll will be used for Gun. 
    // It hash the user1 eth key using user2's key as secret.
    const sha256Hasher = crypto.createHmac("sha256", user2);

    // hash the string
    const hash = sha256Hasher.update(user1);

    return hash;
}

export default function List ({who, db }) {

    const [Conversations, setConversations] = useState([]);

    console.log(HashNamespace(who, "0x8b80755C441d355405CA7571443Bb9247B77Ec16").digest("hex"))

    useEffect(() => {
    }, [])

    return (
        <Card>
            <div className="convList">
                {Conversations.map(conv =>
                    <li>{conv}</li>
                )}
            </div>
        </Card>
    )
}

export const ListMemo = memo(List);