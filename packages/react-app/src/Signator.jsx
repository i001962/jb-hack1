import { Button, Card, Input, notification, Space, Typography, Collapse, Select, Image } from "antd";
import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";

import Gun from "gun";
import "gun/lib/open";
import "gun/sea";
import 'gun/lib/radix.js'
import 'gun/lib/radisk.js'
import 'gun/lib/store.js'
import 'gun/lib/rindexed.js'

import HashNamespace from "./helpers/HashNamespace";

import Messages from "./components/Message";
import Presentation from "./components/Presentation";
import MessageInput from "./components/MessageInput";

// TODO: set gun relay/pinning peers from project metata. hook needs function component
const gun = Gun({ peers:['https://gun-manhattan.herokuapp.com/gun', 'https://gun-us.herokuapp.com/gun', "https://gunpoint.herokuapp.com/gun"],localStorage:false, radisk:true})
  .get("succus-soccor").get("production");

  var SEA = Gun.SEA;

// Components
function Signator({ injectedProvider, address, loadWeb3Modal, chainList, mainnetProvider }) {
  // jb
  // console.log('gundbPeers: ', gundbPeers);
  // console.log('chatSupport: ', chatSupport);
  // console.log('logoUri: ', logoUri);
  //jb
  const [allMessages, setAllMessages] = useState([]);
  const [action, setAction] = useState("Send");

  function useSearchParams() {
    const _params = new URLSearchParams(useLocation().search);
    return _params;
  }
  const searchParams = useSearchParams();
  const history = useHistory();
  const chatWith = searchParams.get("chat")

  async function updateMsg() {
    gun.get(HashNamespace(await [address, chatWith].sort().join())).map().once(data => {
      // console.log('this is in gundb ',data);
      setAllMessages(prev => [...prev, data]);
      var anchor = document.querySelector('#the-end');
      anchor.scrollIntoView();
    })
  }

  useEffect(() => {
    updateMsg()
  }, [setAllMessages, address]);

  return (
    <div className="container">

      <Card stlye={{height:"25vh"}} title='Verifiable Chat Support for JB Projects' extra={<a href="/inbox">Inbox</a>} >
        <div style={{overflowY:"scroll", overflowX:"hidden", height:"400px"}}>
          {action !== "Send" ? action : injectedProvider ? 
            (chatWith === null) ? 
              <Presentation/>
              : 
              <Messages msgs={allMessages} />
          : "You need to connect to send message"}
          <div id="the-end" className="the-end"></div>
        </div>
      </Card>

      <MessageInput 
        chatWith={chatWith} address={address} injectedProvider={injectedProvider} 
        action={action} searchParams={searchParams} gun={gun} chainList={chainList}
        loadWeb3Modal={loadWeb3Modal}
      />

    </div>
  );
}

export default Signator;
