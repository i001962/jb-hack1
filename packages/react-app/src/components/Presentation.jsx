import React, {useEffect, useState} from "react";
import {Image, Input} from "antd";
import { DebounceInput } from "react-debounce-input";

import useJuiceboxGetMetadata from "../hooks/useJuiceboxGetMetadata";

export default function Presentation () {


    const [PROJECT_ID, setPROJECT_ID] = useState(95); // TODO: Ask the user for the projectID in UI for now.

    const [gundbPeers, setGunDBPeers] = useState([])
  
    const  [chatSupport, setChatSupport] = useState("");
    const [logoUri, setLogoUri] = useState("");
    const { data } = useJuiceboxGetMetadata({ projectId: PROJECT_ID});

    const updateMetadata = async () => {
      await setLogoUri(data?.logoUri);
      await setChatSupport(data?.chatSupport)
    }

    useEffect(() => {
      updateMetadata()
    }, [data, setPROJECT_ID])

    return (
      <>
        <Image
        width={200}
        src={logoUri} />

        <p>One time setup: <a href={`/?chat=${chatSupport}`}><code>?chat={chatSupport}</code></a><br />

        <DebounceInput element={Input} value={PROJECT_ID} debounceTimeout={300} onChange={e => setPROJECT_ID(e.target.value)} />

        to talk to this JB Project's Support contact</p>
        <p>Or you may manually specify who you want to talk to <code>?chat={`<ETH ADRESS HERE>`}</code></p>
        <p>You can check for new messages at <a href="/inbox">/inbox</a></p>
        <p>If you need help, <a href="https://github.com/i001962/jb-hack1/blob/main/README.md">read this explanatory guide</a>.</p>
      </>
    )
}