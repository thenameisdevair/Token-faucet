import { useCallback } from "react";
import { useETHASSIGNContract } from "../useContract";
import { toast } from "react-toastify";
import { formatEther } from "ethers";

interface TokenContract {
  balanceOf(address: string): Promise<bigint>;
  totalSupply(): Promise<bigint>;
  name(): Promise<string>;
  symbol(): Promise<string>;
  nextClaimTime(address: string): Promise<bigint>;
}

export const useReadToken = () => {
  const rawContract = useETHASSIGNContract();
  const contract = rawContract as unknown as TokenContract | null;

  const fetchBalance = useCallback(async (address: string) => {
    if (!contract) return null;
    try {
      const balance = await contract.balanceOf(address);
      return formatEther(balance);
    } catch {
      toast.error("Failed to fetch balance");
      return null;
    }
  }, [contract]);

  const fetchTotalSupply = useCallback(async () => {
    if (!contract) return null;
    try {
      const supply = await contract.totalSupply();
      return formatEther(supply);
    } catch {
      toast.error("Failed to fetch total supply");
      return null;
    }
  }, [contract]);

  const fetchTokenName = useCallback(async () => {
    if (!contract) return null;
    try {
      return await contract.name();
    } catch {
      return null;
    }
  }, [contract]);

  const fetchSymbol = useCallback(async () => {
    if (!contract) return null;
    try {
      return await contract.symbol();
    } catch {
      return null;
    }
  }, [contract]);

  const fetchNextClaimTime = useCallback(async (address: string) => {
    if (!contract) return null;
    try {
      const time = await contract.nextClaimTime(address);
      return Number(time);
    } catch {
      return null;
    }
  }, [contract]);

  return {
    fetchBalance,
    fetchTotalSupply,
    fetchTokenName,
    fetchSymbol,
    fetchNextClaimTime,
  };
};