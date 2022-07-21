import React, {useEffect, useState} from "react";

import Address from "./Address";

import TimeAgo from 'javascript-time-ago'
import ReactTimeAgo from 'react-time-ago'
import en from 'javascript-time-ago/locale/en.json'


TimeAgo.addDefaultLocale(en);

export default function Message({msgs, address, mainnetProvider}) {
    return (
        msgs.map(msg => {
            return (
              <li className="msg" id={msg.id} key={msg.id}>
                <p style={{ fontSize:"22px" }}><a href={`/view?${msg.evidence}`}>{msg.body}</a></p>
                <p>
                <a style={{color:"gray", opacity:"90%", fontWeight: "bold"}} href={`https://etherscan.io/address/${msg.from}`}><u>{(msg.from === address) ? "Me" : <Address address={msg.from} ensProvider={mainnetProvider}></Address>}</u></a>
                <br/>   
                  <ReactTimeAgo date={msg.time}></ReactTimeAgo>
                </p>
              </li>
            )
        })
    )
}