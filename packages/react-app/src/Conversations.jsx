import React, { useEffect, useState } from "react";

import Gun from "gun";
import "gun/lib/open";
import "gun/sea";
import 'gun/lib/radix.js'
import 'gun/lib/radisk.js'
import 'gun/lib/store.js'
import 'gun/lib/rindexed.js'
import { data } from "autoprefixer";

import { Card } from "antd";

const options = { peers:['https://gun-manhattan.herokuapp.com/gun', 'https://gun-us.herokuapp.com/gun', "https://gunpoint.herokuapp.com/gun"],localStorage:false, radisk:true}

var gun = Gun(options);
var SEA = Gun.SEA;

export default function Conversations({ injectedProvider, address, loadWeb3Modal, chainList, mainnetProvider }) {
    
    const [Conversations, setConservations] = useState([])

    const getConv = async () => {
        gun.get(await address).map().once((data, id) => {
            if (data === undefined) {
                console.log("data is undefined")
            } else {
                if (data === null) {
                } else {
                    setConservations((prev) => [...prev, { from: data, id:id }])
                }
            }
        })
    }


    const handleRemoveItem = (e, id) => {
         setConservations(Conversations.filter(item => item.name !== id));
    };

    const deleteNotif = (id) => {
        gun.get(address).get(id).put(null);
        handleRemoveItem(id);
    }

    useEffect(() => {
        getConv()
    }, [setConservations, address])

    return (
        <div className="container">
            <Card title="inbox">
                {Conversations.map(data => 
                    <li id={data.id} key={data.id}><a onClick={() => {
                        deleteNotif(data.id)
                    }} href={`/?chat=${data.from}`}>You received message(s) from {data.from} -- ID : {data.id} !</a></li>
                )}
            </Card>
        </div>
    )
}