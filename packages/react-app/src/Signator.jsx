import { Button, Card, Input, notification, Space, Typography, Collapse, Select, Image } from "antd";
import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useLocalStorage } from "./hooks";
import Gun from "gun";
import "gun/lib/open";
import "gun/sea";
import 'gun/lib/radix.js'
import 'gun/lib/radisk.js'
import 'gun/lib/store.js'
import 'gun/lib/rindexed.js'
import useJuiceboxGetMetadata from "./hooks/useJuiceboxGetMetadata";
// import useJuiceboxGetAllProjects from "./hooks/useJuiceboxGetAllProjects";
import SupportSetup from "./components/SupportSetup";
import HashNamespace from "./helpers/HashNamespace";
import { v4 as uuidv4 } from 'uuid';

// TODO: set gun relay/pinning peers from project metata. hook needs function component
var gun = Gun({ peers:['https://gun-manhattan.herokuapp.com/gun', 'https://gun-us.herokuapp.com/gun', "https://gunpoint.herokuapp.com/gun"],localStorage:false, radisk:true});
var SEA = Gun.SEA;
// Peers to 'pin' to initially
// gun = Gun({radisk:true,  localStorage: true});

const { Text } = Typography;
const { Panel } = Collapse;
const { Option } = Select;
const codec = require("json-url")("lzw");
/*
    Welcome to the Signator! <-- They did the heavy lifting here for signing and verifying.
*/
function Signator({ injectedProvider, address, loadWeb3Modal, chainList, mainnetProvider }) {
  // jb
  const PROJECT_ID = 95; // TODO: Ask the user for the projectID in UI for now.
  // TODO: Move up and use with gun construcutor
  let gundbPeers;
  let chatSupport;
  let logoUri;
  const { data: projectMetadata } = useJuiceboxGetMetadata({ projectId: PROJECT_ID});
  if (!projectMetadata) {
    console.log('no project metadata');
  } else {
    gundbPeers = projectMetadata.gundbPeers;
    chatSupport = projectMetadata.chatSupport;
    logoUri = projectMetadata.logoUri;
    const projectName = projectMetadata.name;
    const description = projectMetadata.description;
    console.log('project metadata: ', projectMetadata.name);
    console.log('project metadata: ', projectMetadata.description); 
  }
  console.log('gundbPeers: ', gundbPeers);
  console.log('chatSupport: ', chatSupport);
  console.log('logoUri: ', logoUri);
  //jb
  const [allMessages, setAllMessages] = useState([]);
  const [messageText, setMessageText] = useLocalStorage("");
  const [hashMessage, setHashMessage] = useState(false);
  const [signing, setSigning] = useState(false);
  const [type, setType] = useLocalStorage("signingType", "message");
  const [chainId, setChainId] = useState(1,);
  const [action, setAction] = useState("Send");
  const [manualSignature, setManualSignature] = useState();
  const [manualAddress, setManualAddress] = useState();

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

  const getMessage = () => {
    const _message = messageText;

    if (hashMessage) {
      return ethers.utils.keccak256(ethers.utils.toUtf8Bytes(_message)); // _message//ethers.utils.hashMessage(_message)
    }
    return _message;
  };

  const signMessage = async () => {
    // console.log('injectedProvider ', injectedProvider);
    setMessageText("");

    try {
      setSigning(true);
      const injectedSigner = action === "Send" && injectedProvider.getSigner();
      let _signature;
      let _messageHolder;
      if (type === "message") {
        const _message = getMessage();
        _messageHolder = _message;
        // console.log(`${action}: ${_message}`);
        if (action === "Send") { 
          _signature = await injectedProvider.send("personal_sign", [_message, address]);
          // console.log(`%c ${_message}`, 'background: #222; font-size:3rem;  color: #bada55');
          // console.log(`%c ${_signature}`, 'background: #222; font-size:3rem;  color: #bada55');
          // gun.get("chat").set({ from: address, body: _message, time:`${new Date()}`, signature: _signature, evidence: `/view?${searchParams.toString()}`, id: uuidv4()  });
        }
        searchParams.set("message", _message);
      }

      if (action === "Send") console.log(`Success! ${_signature}`);

      if (action === "Send") {
        searchParams.set("signatures", _signature);
        searchParams.set("addresses", address);
        // console.log('searchParams', searchParams.toString());

      } else if (action === "verify") {
        searchParams.set("signatures", manualSignature);
        searchParams.set("addresses", manualAddress);
      }
      // console.log('Put this into gun?? ', `/view?${searchParams.toString()}`);
      // TODO - insert jbx project or project id here
      console.log(HashNamespace(await [address, chatWith].sort().join()))
      gun.get(HashNamespace(await [address, chatWith].sort().join())).set({ from: address, body: _messageHolder, time:`${new Date()}`, signature: _signature, evidence: searchParams.toString(), id: uuidv4()  });
      setSigning(false);

    } catch (e) {
        console.log(e);
        setSigning(false);
        if (e.message.indexOf("Provided chainId") !== -1) {
          notification.open({
            message: "Incorrect network selected in Metamask",
            description: `${chainId && `Select ${chainList.find(element => element.chainId === chainId).name}`}. Error: ${
              e.message
            }`,
          });
        }
     }
    };

  return (
    <div className="container">

      <Card stlye={{height:"25vh"}} title='Verifiable Chat Support for JB Projects'>
        <h3>{HashNamespace([address, chatWith].sort().join())}</h3>
        <div style={{overflowY:"scroll", height:"400px"}}>
          {action !== "Send" ? action : injectedProvider ? 
            (chatWith === null) ? 
              
              <>
              <Image
              width={200}
              src={logoUri}
            />
              <p>One time setup: <pre><code>?chat={chatSupport}</code></pre> 
              <SupportSetup chatSupport={chatSupport}/>
              to talk to this JB Project's Support contact</p>
            <p>Or you may manually specify who you want to talk to <pre><code>?chat={`<ETH ADRESS HERE>`}</code></pre></p>
            </>
              : 
              allMessages.map(msg => {
            
                return (
                  <li className="msg" id={msg.id} key={msg.id}>
                    <p><a href={`/view?${msg.evidence}`}>{msg.body}</a></p>
                    <p>From:  
                    <a style={{color:"gray", opacity:"90%", fontWeight: "bold"}} href={`https://etherscan.io/address/${msg.from}`}><u>{msg.from}</u></a>
                    <br/>   
                      {msg.time} 
                    </p>
                  </li>
                )
               })
          : "You need to connect to send message"}
          <div id="the-end" className="the-end"></div>
        </div>
      </Card>

      <Card>
        { (chatWith === null) 
        
        ? <p>No ETH adress specified!</p> 
        : <div>
          {type === "message" && (
            <Input.TextArea
              style={{ fontSize: 18 }}
              size="large"
              autoSize={{ minRows: 1 }}
              value={messageText}
              placeholder="Type your message..."
              onChange={e => {
                setMessageText(e.target.value);
              }}
            />
          )}

          <Space>
            <Button
              size="large"
              type="primary"
              onClick={action !== "Send" ? signMessage : injectedProvider ? signMessage : loadWeb3Modal}
              loading={signing}
              style={{ marginTop: 10, fontWeight: "bold" }}
            >
              {action !== "Send" ? action : injectedProvider ? action : "Connect account to send"}
            </Button>

            {signing && (
              <Button
                size="large"
                onClick={() => {
                  setSigning(false);
                }}
                style={{ marginTop: 10 }}
              >
                Cancel
              </Button>
            )}
          </Space>      
        </div>
        
        }
      </Card>
    </div>
  );
}

export default Signator;
