import { useEffect, useState } from "react";
import { JsonRpcProvider } from "@ethersproject/providers";

import {
  getJBDirectory,
} from "juice-sdk";

const RPC_HOST =
  "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161";
export default function useJuiceboxGetAllProjects() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState();
  const [error, setError] = useState();
  console.log('you are in here');
  useEffect(() => {
    async function getProjects(projectId) {
      const provider = new JsonRpcProvider(RPC_HOST);
      const JBProjects = getJBDirectory(provider)
      console.log('JBProjectsArry: ', JBProjects.projects());
      const projectsArry = JBProjects;
      // const projectsArry = await JBProjects.ownerOf(projectId);
      // console.log("JBDirectory.getProjects:", projectsArry)

      return projectsArry;
    }

    setLoading(true);

    getProjects()
      .then((projectsArry) => {
        setLoading(false);
        setData(projectsArry);
        console.log('inside hook getProjects.then ', projectsArry);

      })
      .catch((e) => {
        setError(e);
        console.log('inside hook getting getProjects err',  e);

      });
  }, []);

  return { loading, data, error };
}