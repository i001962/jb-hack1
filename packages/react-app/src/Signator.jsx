import { Button, Card, Input, notification, Space } from "antd";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useLocalStorage } from "./hooks";
import useJuiceboxBalance from "./hooks/useJuiceboxBalance";
import { formatEther } from "ethers/lib/utils";
// Gun config (here?)
import Gun from "gun";
import "gun/lib/open";
import "gun/sea";
import 'gun/lib/radix.js'
import 'gun/lib/radisk.js'
import 'gun/lib/store.js'
import 'gun/lib/rindexed.js'

// hash namespace for chat
import HashNamespace from "./helpers/HashNamespace";

var SEA = Gun.SEA;
// Peers to 'pin' to initially
gun = Gun({peers:['https://gun-manhattan.herokuapp.com/gun','https://gun-us.herokuapp.com/gun'],radisk:true,  localStorage: false});

const codec = require("json-url")("lzw");
/*
    Welcome to the Signator!
*/


function Signator({ injectedProvider, address, loadWeb3Modal, chainList, mainnetProvider }) {

  // JB something will get looked up here: projectId, onwnerAccount etc
  const PROJECT_ID = 1;
  const { data: balance } = useJuiceboxBalance({ projectId: PROJECT_ID});
  console.log("Balance here", balance);
  const balanceETH = balance
  ? parseFloat(formatEther(balance)).toFixed(4)
  : "...";
  console.log('balanceETH', balanceETH);
  //jb
  
  const [allMessages, setAllMessages] = useState([]);
  const [messageText, setMessageText] = useLocalStorage("messageText", "hello ethereum");
  const [signing, setSigning] = useState(false);
  const [type, setType] = useLocalStorage("signingType", "message");
  const [chainId, setChainId] = useState(1,);
  const [action, setAction] = useState("send");
  const [manualSignature, setManualSignature] = useState();
  const [manualAddress, setManualAddress] = useState();

  function useSearchParams() {
    const _params = new URLSearchParams(useLocation().search);
    return _params;
  }

  const searchParams = useSearchParams();

  function updateMsg() {
    gun.get("chat").map().once(data => {
      console.log(data);
      setAllMessages(prev => [...prev, data]);
    })
  }

  useEffect(() => {
    updateMsg()
  }, [setAllMessages]);

  const getMessage = () => {
    const _message = messageText;
    return _message;
  };

  */
  const signMessage = async () => {
    
    //jb just testing juice-sdk here need to be smarter with the scopes
    console.log('injectedProvider ', injectedProvider);
    // jb

    try {
      setSigning(true);
      const injectedSigner = action === "send" && injectedProvider.getSigner();
      let _signature;

      if (type === "message") {
        const _message = getMessage();
        console.log(`${action}: ${_message}`);
        if (action === "send") { _signature = await injectedProvider.send("personal_sign", [_message, address]);
          console.log(`%c ${_message}`, 'background: #222; font-size:3rem;  color: #bada55');
          gun.get("chat").set(_message);
        }
        // _signature = await injectedSigner.signMessage(_messageToSign);

        searchParams.set("message", _message);
      }

      if (action === "send") console.log(`Success! ${_signature}`);

      if (action === "send") {
        searchParams.set("signatures", _signature);
        searchParams.set("addresses", address);
      } else if (action === "verify") {
        searchParams.set("signatures", manualSignature);
        searchParams.set("addresses", manualAddress);
      }
      console.log('Put this into gun?? ', `/view?${searchParams.toString()}`);

      const when = `${Date.now()}`;
      // TODO - make sure to insert jbx project or project id and toAddress for project owner into gun
      const toAddress = '0x' + 'your-JB-Project-address'.toLowerCase();
      console.log(toAddress);
      gun.get("jbtest2").get(when).put({ fromAddress: address, signature: _signature, message: messageText, when: when, evidence: `/view?${searchParams.toString()}`}).once(function(x){console.log(x)});
      setSigning(false);
      gun.get('jbtest2').map().on(function(x){
        //let last = x.when;
        setAllMessages([x]);
      });
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
      <p>
          Project {PROJECT_ID} Juicebox balance: {} ETH
      </p>

      <ul>
        {allMessages.map(msg => <li>{msg}</li> )}
      </ul>
      <Card>
        {type === "message" && (
          <Input.TextArea
            style={{ fontSize: 18 }}
            size="large"
            autoSize={{ minRows: 1 }}
            value={messageText}
            onChange={e => {
              setMessageText(e.target.value);
            }}
          />
        )}
        <Space>
          <Button
            size="large"
            type="primary"
            onClick={action !== "send" ? signMessage : injectedProvider ? signMessage : loadWeb3Modal}
            loading={signing}
            style={{ marginTop: 10 }}
          >
            {action !== "send" ? action : injectedProvider ? action : "Connect account to send"}
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
        <Collapse ghost>
          <Panel header="Advanced" key="1">
          <Space direction="vertical" style={{ width: "100%" }}>
          <p>Hi mom</p>
          </Space>
            <Space direction="vertical" style={{ width: "100%" }}>
              <Radio.Group
                value={type}
                buttonStyle="solid"
                size="large"
                onChange={e => {
                  setType(e.target.value);
                }}
              >
              </Radio.Group>

              {type === "message" && (
                <>

                </>
              )}
              <Radio.Group
                value={action}
                onChange={e => {
                  setAction(e.target.value);
                }}
                style={{ marginTop: 10 }}
              >
                <Radio value="send">Send</Radio>
                {/* <Radio value="create">Create</Radio> */}
                <Radio value="verify">Verify</Radio>
              </Radio.Group>
              {action === "verify" && (
                <>
                  <AddressInput
                    value={manualAddress}
                    onChange={v => setManualAddress(v)}
                    ensProvider={mainnetProvider}
                  />
                  <Input
                    placeholder="signature"
                    value={manualSignature}
                    onChange={e => setManualSignature(e.target.value)}
                  />
                </>
              )}
            </Space>
          </Panel>
        </Collapse>
      </Card>
    </div>
  );
}

export default Signator;
