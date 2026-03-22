import { useState, useEffect, useCallback } from "react";
import { useAppKitAccount } from "@reown/appkit/react";
import { useReadToken } from "./specific/useReadToken";
import { useWriteToken } from "./specific/useWriteToken";
import { toast } from "react-toastify";

export const useToken = () => {
  const { address } = useAppKitAccount();
  const {
    fetchBalance,
    fetchTotalSupply,
    fetchTokenName,
    fetchSymbol,
    fetchNextClaimTime,
  } = useReadToken();

  const {
    requestToken, isRequesting,
    mint, isMinting,
    transfer, isTransferring,
  } = useWriteToken();

  const [balance, setBalance] = useState<string>("0");
  const [totalSupply, setTotalSupply] = useState<string>("0");
  const [tokenName, setTokenName] = useState<string>("");
  const [symbol, setSymbol] = useState<string>("");
  const [nextClaimTime, setNextClaimTime] = useState<number>(0);
  const [countdown, setCountdown] = useState<string>("");

  // Load token info on mount
  useEffect(() => {
    const load = async () => {
      const name = await fetchTokenName();
      const sym = await fetchSymbol();
      const supply = await fetchTotalSupply();
      if (name) setTokenName(name);
      if (sym) setSymbol(sym);
      if (supply) setTotalSupply(supply);
    };
    load();
  }, []);

  // Load user-specific data when wallet connects
  useEffect(() => {
    if (!address) return;
    const loadUser = async () => {
      const bal = await fetchBalance(address);
      const claimTime = await fetchNextClaimTime(address);
      if (bal) setBalance(bal);
      if (claimTime) setNextClaimTime(claimTime);
    };
    loadUser();
  }, [address]);

  // Countdown timer — per user, updates every second
  useEffect(() => {
    if (!nextClaimTime) return;
    const interval = setInterval(() => {
      const now = Math.floor(Date.now() / 1000);
      const diff = nextClaimTime - now;
      if (diff <= 0) {
        setCountdown("");
        clearInterval(interval);
        return;
      }
      const hours = Math.floor(diff / 3600);
      const mins = Math.floor((diff % 3600) / 60);
      const secs = diff % 60;
      setCountdown(`Retry in ${hours}h ${mins}m ${secs}s`);
    }, 1000);
    return () => clearInterval(interval);
  }, [nextClaimTime]);

  const handleRequestToken = useCallback(async () => {
    const success = await requestToken();
    if (success) {
      toast.success("Tokens claimed successfully!");
      if (address) {
        const bal = await fetchBalance(address);
        const claimTime = await fetchNextClaimTime(address);
        if (bal) setBalance(bal);
        if (claimTime) setNextClaimTime(claimTime);
      }
    }
  }, [requestToken, address, fetchBalance, fetchNextClaimTime]);

  const handleMint = useCallback(async (to: string, amount: string) => {
    const success = await mint(to, amount);
    if (success) {
      toast.success("Minted successfully!");
      const supply = await fetchTotalSupply();
      if (supply) setTotalSupply(supply);
    }
  }, [mint, fetchTotalSupply]);

  const handleTransfer = useCallback(async (to: string, amount: string) => {
    const success = await transfer(to, amount);
    if (success) {
      toast.success("Transfer successful!");
      if (address) {
        const bal = await fetchBalance(address);
        if (bal) setBalance(bal);
      }
    }
  }, [transfer, address, fetchBalance]);

  return {
    balance, totalSupply, tokenName, symbol,
    countdown, nextClaimTime,
    handleRequestToken, isRequesting,
    handleMint, isMinting,
    handleTransfer, isTransferring,
    address,
  };
};