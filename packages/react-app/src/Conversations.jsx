import React, { useEffect, useState } from "react";

import Gun from "gun";
import "gun/lib/open";
import "gun/sea";
import 'gun/lib/radix.js'
import 'gun/lib/radisk.js'
import 'gun/lib/store.js'
import 'gun/lib/rindexed.js'
import { data } from "autoprefixer";

var gun = Gun({ peers:['https://gun-manhattan.herokuapp.com/gun', 'https://gun-us.herokuapp.com/gun', "https://gunpoint.herokuapp.com/gun"],localStorage:false, radisk:true});
var SEA = Gun.SEA;

export default function Conversations({ injectedProvider, address, loadWeb3Modal, chainList, mainnetProvider }) {
    
    const [Conversations, setConservations] = useState([])

    const getConv = async () => {
        gun.get(await address).once(data => {
            console.log(data)
        })
    }

    useEffect(() => {
        getConv()
    }, [setConservations, address])


    return (
        <div>
            <p>{address}</p>
            {Conversations.map(data => 
                <li>{data}</li>
            )}
        </div>
    )
}