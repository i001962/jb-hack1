import React, {useEffect, useState} from "react";
import { useLocalStorage } from "../hooks";
import { ethers } from "ethers";
import { v4 as uuidv4 } from 'uuid';

// ui
import { Button, Card, Input, notification, Space } from "antd";

import HashNamespace from "../helpers/HashNamespace";

export default function MessageInput({ injectedProvider, chatWith, action, address, searchParams, gun, chainList, loadWeb3Modal }) {

    const [signing, setSigning] = useState(false);
    const [type, setType] = useLocalStorage("signingType", "message");
    const [chainId, setChainId] = useState(1,);
    const [manualSignature, setManualSignature] = useState();
    const [manualAddress, setManualAddress] = useState();
    const [messageText, setMessageText] = useLocalStorage("");
    const [hashMessage, setHashMessage] = useState(false);

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
    
          gun.get(chatWith).set(address)
    
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
              placeholder={`Type a message to ${chatWith}...`}
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
    )
}