import { useEffect, useState } from "react";
import { JsonRpcProvider } from "@ethersproject/providers";

import {
  getJBProjects
} from "juice-sdk";

const RPC_HOST =
  "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161";

export default function useJuiceboxGetOwner({ projectId }) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState();
  const [error, setError] = useState();

  useEffect(() => {
    async function getOwner(projectId) {
      const provider = new JsonRpcProvider(RPC_HOST);
      const JBProjects = getJBProjects(provider)
      const ownerOf = await JBProjects.ownerOf(projectId);
      console.log("JBProjects.ownerOf:", ownerOf)
      const support = await getJBProjects(provider).metadataContentOf(projectId, 0);
      console.log("JBProjects.metadataContentOf:", support)
      const chatSettings = await fetch('https://jbx.mypinata.cloud/ipfs/'+support) // TODO: change to .env
      .then(data => {
        return data.json();
        })
        .then(config => {
        return config;
        });

      return chatSettings;
    }

    setLoading(true); 

    getOwner(projectId)
      .then((gundbPeers) => {
        setLoading(false);
        setData(gundbPeers);
        console.log('inside hook getMetadata.then ', gundbPeers);

      })
      .catch((e) => {
        setError(e);
        console.log('inside hook getting owner err',  e);

      });
  }, [projectId]);

  return { loading, data, error };
}