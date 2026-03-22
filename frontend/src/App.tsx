import { useAppKit } from "@reown/appkit/react";
import Dashboard from "../src/components/Dashboard";
import { useToken } from "./hooks/useToken";

function App() {
  const { open } = useAppKit();
  const {
    balance, totalSupply, tokenName, symbol,
    countdown, address,
    handleRequestToken, isRequesting,
    handleMint, isMinting,
    handleTransfer, isTransferring,
  } = useToken();

  return (
    <Dashboard
      tokenName={tokenName}
      symbol={symbol}
      balance={balance}
      totalSupply={totalSupply}
      countdown={countdown}
      address={address ?? ""}
      isRequesting={isRequesting}
      isMinting={isMinting}
      isTransferring={isTransferring}
      onConnectWallet={() => open()}
      onRequestToken={handleRequestToken}
      onMint={handleMint}
      onTransfer={handleTransfer}
    />
  );
}

export default App;