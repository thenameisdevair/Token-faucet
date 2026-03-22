import { useMemo } from "react";
import { Contract } from "ethers";
import { getAddress } from "ethers";
import useRunners from "./useRunner";
import { ETHASSIGN_ABI } from "../ABI/token";

export const useETHASSIGNContract = (withSigner = false) => {
  const { readOnlyProvider, signer } = useRunners();

  return useMemo(() => {
    if (withSigner) {
      if (!signer) return null;
      return signer.then((s) =>
        new Contract(
          getAddress(import.meta.env.VITE_TOKEN_CONTRACT_ADDRESS),
          ETHASSIGN_ABI,
          s
        )
      );
    }
    return new Contract(
      getAddress(import.meta.env.VITE_TOKEN_CONTRACT_ADDRESS),
      ETHASSIGN_ABI,
      readOnlyProvider
    );
  }, [readOnlyProvider, signer, withSigner]);
};