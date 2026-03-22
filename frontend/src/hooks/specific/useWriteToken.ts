import { useCallback, useState } from "react";
import { useETHASSIGNContract } from "../useContract";
import { useAppKitAccount } from "@reown/appkit/react";
import { toast } from "react-toastify";
import { parseEther } from "ethers";
import { decodeError } from "../../utils/decodeError";



export const useWriteToken = () => {
  const contractPromise = useETHASSIGNContract(true);
  const { address } = useAppKitAccount();
  const [isRequesting, setIsRequesting] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [isTransferring, setIsTransferring] = useState(false);

  const requestToken = useCallback(async (): Promise<boolean> => {
    if (!address) { toast.error("Connect your wallet"); return false; }
    const contract = await contractPromise;
    if (!contract) { toast.error("Contract not found"); return false; }
    try {
      setIsRequesting(true);
      const tx = await contract.requestToken();
      const receipt = await tx.wait();
      return receipt.status === 1;
    } catch (error: unknown) {
        toast.error(decodeError(error));
        return false;
        }finally {
      setIsRequesting(false);
    }
  }, [address, contractPromise]);

  const mint = useCallback(async (to: string, amount: string): Promise<boolean> => {
    if (!address) { toast.error("Connect your wallet"); return false; }
    const contract = await contractPromise;
    if (!contract) { toast.error("Contract not found"); return false; }
    try {
      setIsMinting(true);
      const tx = await contract.mint(to, parseEther(amount));
      const receipt = await tx.wait();
      return receipt.status === 1;
    } catch (error: unknown) {
        toast.error(decodeError(error));
        return false;
        }finally {
      setIsMinting(false);
    }
  }, [address, contractPromise]);

  const transfer = useCallback(async (to: string, amount: string): Promise<boolean> => {
    if (!address) { toast.error("Connect your wallet"); return false; }
    const contract = await contractPromise;
    if (!contract) { toast.error("Contract not found"); return false; }
    try {
      setIsTransferring(true);
      const tx = await contract.transfer(to, parseEther(amount));
      const receipt = await tx.wait();
      return receipt.status === 1;
    } catch (error: unknown) {
        toast.error(decodeError(error));
        return false;
        } finally {
      setIsTransferring(false);
    }
  }, [address, contractPromise]);

  return {
    requestToken, isRequesting,
    mint, isMinting,
    transfer, isTransferring,
  };
};