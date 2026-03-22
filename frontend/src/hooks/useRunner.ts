import { useAppKitProvider } from "@reown/appkit/react";
import { BrowserProvider } from "ethers";
import { useMemo } from "react";
import { readOnlyProvider } from "../constants/provider";
import type { Eip1193Provider } from "ethers";

const useRunners = () => {
  const { walletProvider } = useAppKitProvider<Eip1193Provider>("eip155");

  const signer = useMemo(() => {
    if (!walletProvider) return null;
    const provider = new BrowserProvider(walletProvider);
    return provider.getSigner();
  }, [walletProvider]);

  return { readOnlyProvider, signer };
};

export default useRunners;