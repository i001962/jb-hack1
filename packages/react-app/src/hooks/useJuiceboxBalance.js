import { useEffect, useState } from "react";
import { JsonRpcProvider } from "@ethersproject/providers";

import {
  getJBDirectory,
  getJBSingleTokenPaymentTerminalStore,
} from "juice-sdk";

const RPC_HOST =
  "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161";
export default function useJuiceboxBalance({ projectId }) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState();
  const [error, setError] = useState();

  useEffect(() => {
    async function getBalance(projectId) {
      const provider = new JsonRpcProvider(RPC_HOST);
      //const provider = provider;
      const terminals = await getJBDirectory(provider).terminalsOf(projectId);
      const primaryTerminal = terminals[0];

      const balance = await getJBSingleTokenPaymentTerminalStore(
        provider
      ).balanceOf(primaryTerminal, projectId);
      console.log('inside hook getting balance ', balance);
      return balance;
    }

    setLoading(true);

    getBalance(projectId)
      .then((balance) => {
        setLoading(false);
        setData(balance);
        console.log('inside hook getBalance.then ', balance);

      })
      .catch((e) => {
        setError(e);
        console.log('inside hook getting balance err',  e);

      });
  }, [projectId]);

  return { loading, data, error };
}