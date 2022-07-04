import { Alert, Button, Card, Checkbox, Input, notification, Radio, Space, Typography, Collapse, Select } from "antd";
import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useLocalStorage } from "./hooks";
import { AddressInput } from "./components";
import Gun from "gun";
import "gun/lib/open";
import "gun/sea";
//import "gun/lib/mobile.js" // most important!
//import GUN from 'gun/gun'
//import SEA from 'gun/sea'
import 'gun/lib/radix2.js'
import 'gun/lib/radisk.js'
import 'gun/lib/store.js'
import 'gun/lib/rindexed.js'
//import AsyncStorage from "@react-native-community/async-storage"
//import asyncStore from 'gun/lib/ras.js'

// Warning: Android AsyncStorage has 6mb limit by default!
//Gun({ store: asyncStore({ AsyncStorage }) })
var gun = Gun();
var SEA = Gun.SEA;
// Peers to 'pin' to initially
gun = Gun({peers:['https://gun-manhattan.herokuapp.com/gun','https://gun-us.herokuapp.com/gun'],radisk:true,  localStorage: false});

const { Text } = Typography;
const { Panel } = Collapse;
const { Option } = Select;
const codec = require("json-url")("lzw");

/*
    Welcome to the Signator!
*/

const eip712Example = {
  types: {
    Greeting: [
      {
        name: "salutation",
        type: "string",
      },
      {
        name: "target",
        type: "string",
      },
      {
        name: "born",
        type: "int32",
      },
    ],
  },
  message: {
    salutation: "Hello",
    target: "Ethereum",
    born: 2015,
  },
};

function Signator({ injectedProvider, address, loadWeb3Modal, chainList, mainnetProvider }) {
  const [allMessages, setAllMessages] = useLocalStorage({});
  const [messageText, setMessageText] = useLocalStorage("messageText", "hello ethereum");
  // const [metaData, setMetaData] = useState("none");
  // const [messageDate, setMessageDate] = useState(new Date());
  const [hashMessage, setHashMessage] = useState(false);
  // const [latestBlock, setLatestBlock] = useState();
  const [signing, setSigning] = useState(false);
  const [typedData, setTypedData] = useLocalStorage("typedData", eip712Example);
  const [manualTypedData, setManualTypedData] = useLocalStorage(
    "manualTypedData",
    JSON.stringify(eip712Example, null, "\t"),
  );
  const [invalidJson, setInvalidJson] = useState(false);
  const [type, setType] = useLocalStorage("signingType", "message");
  const [typedDataChecks, setTypedDataChecks] = useState({});
  const [chainId, setChainId] = useState(
    typedData && typedData.domain && typedData.domain.chainId ? parseInt(typedData.domain.chainId, 10) : 1,
  );
  const [action, setAction] = useState("send");
  const [manualSignature, setManualSignature] = useState();
  const [manualAddress, setManualAddress] = useState();

  function useSearchParams() {
    const _params = new URLSearchParams(useLocation().search);
    return _params;
  }

  const searchParams = useSearchParams();
  const history = useHistory();

  const getMessage = () => {
    const _message = messageText;

    /*
    if (metaData === "time") {
      _message = `${messageDate.toLocaleString()}: ${messageText}`;
    } else if (metaData == "block") {
      _message = `${latestBlock}: ${messageText}`;
    } else {
      _message = messageText;
    }
    */

    if (hashMessage) {
      return ethers.utils.keccak256(ethers.utils.toUtf8Bytes(_message)); // _message//ethers.utils.hashMessage(_message)
    }
    return _message;
  };

  // If you want to call a function on a new block
  /*
  useOnBlock(mainnetProvider, () => {
    console.log(`⛓ A new mainnet block is here: ${mainnetProvider.blockNumber}`);
    setLatestBlock(mainnetProvider.blockNumber);
  });
  */

  useEffect(() => {
    if (typedData) {
      const _checks = {};
      _checks.domain = "domain" in typedData;
      _checks.types = "types" in typedData;
      _checks.message = "message" in typedData;
      let _hash;
      try {
        _hash = ethers.utils._TypedDataEncoder.hash(typedData.domain, typedData.types, typedData.message);
        _checks.hash = _hash;
      } catch (e) {
        console.log("failed to compute hash", e);
      }
      setTypedDataChecks(_checks);
    }
  }, [typedData]);

  const signMessage = async () => {
    try {
      setSigning(true);

      const injectedSigner = action === "send" && injectedProvider.getSigner();

      let _signature;

      if (type === "message") {
        // const _messageToSign = ethers.utils.isBytesLike(_message) ? ethers.utils.arrayify(_message) : _message;
        const _message = getMessage();
        console.log(`${action}: ${_message}`);
        if (action === "send") _signature = await injectedProvider.send("personal_sign", [_message, address]);
        // _signature = await injectedSigner.signMessage(_messageToSign);

        searchParams.set("message", _message);
      }
      // console.log(_signature)

      if (action === "send") console.log(`Success! ${_signature}`);

      if (action === "send") {
        searchParams.set("signatures", _signature);
        searchParams.set("addresses", address);
      } else if (action === "verify") {
        searchParams.set("signatures", manualSignature);
        searchParams.set("addresses", manualAddress);
      }
      console.log('Put this into gun?? ', `/view?${searchParams.toString()}`);
      history.push(`/view?${searchParams.toString()}`);
      const when = `${Date.now()}`;
      // TODO - insert jbx project or project id here
      const toAddress = '0x' + 'your-JB-Project-address'.toLowerCase();
      console.log(toAddress);
        
      var pair = await SEA.pair();
      console.log('This is a holder for the gun-user ', pair);
      //gun.user(pair)
/*       gun.user().get('jbtest').set({ fromAddress: address, signature: _signature, message: messageText, id: randomId, evidence: `/view?${searchParams.toString()}`}).on(async data => {
        let soul = Gun.node.soul(data)
        //let soul = data._["#"];
        let hash = await SEA.work(soul, null, null,{name:'SHA-256'})
        gun.get('#messages').get(hash).put(soul)  // User puts a hashed soul of the message in a public content-addressed node
      }) */
      gun.get("jbtest1").get(when).put({ fromAddress: address, signature: _signature, message: messageText, when: when, evidence: `/view?${searchParams.toString()}`}).once(function(x){console.log(x)});
      setSigning(false);
      gun.get('jbtest1').map().once(function(x){console.log(x);
        let last = x.when;
        console.log(last);
        setAllMessages(x);
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

  console.log(manualAddress, manualSignature);

  return (
    <div className="container">
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
            disabled={
              (type === "typedData" && (!typedDataChecks.hash || invalidJson)) ||
              (action === "verify" && (!ethers.utils.isAddress(manualAddress) || !manualSignature))
            }
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
                {/* <Radio.Button value="message">Message</Radio.Button>
                <Radio.Button value="typedData">Typed Data</Radio.Button> */}
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
