export function decodeError(error: unknown): string {
  if (!error) return "Transaction failed";

  if (typeof error === "object" && error !== null) {
    const err = error as Record<string, unknown>;

    // ethers v6 surfaces reason directly
    if (typeof err.reason === "string" && err.reason) {
      return err.reason;
    }

    // nested error object
    if (err.error && typeof err.error === "object") {
      const inner = err.error as Record<string, unknown>;
      if (typeof inner.reason === "string" && inner.reason) {
        return inner.reason;
      }
      if (typeof inner.message === "string") {
        return cleanMessage(inner.message);
      }
    }

    // shortMessage is ethers v6 specific
    if (typeof err.shortMessage === "string" && err.shortMessage) {
      return cleanMessage(err.shortMessage);
    }

    // raw message
    if (typeof err.message === "string" && err.message) {
      return cleanMessage(err.message);
    }
  }

  return "Transaction failed";
}

function cleanMessage(msg: string): string {
  // Contract revert strings
  if (msg.includes("Wait for cool-down")) return "Wait for cool-down — try again in 24 hours";
  if (msg.includes("Max supply reached")) return "Max supply has been reached";

  // OpenZeppelin custom errors
  if (msg.includes("OwnableUnauthorizedAccount")) return "Only the contract owner can mint";
  if (msg.includes("ERC20InsufficientBalance")) return "Insufficient token balance";
  if (msg.includes("ERC20InvalidReceiver")) return "Invalid recipient address";

  // Wallet errors
  if (msg.includes("user rejected") || msg.includes("User rejected")) return "Transaction cancelled";
  if (msg.includes("insufficient funds")) return "Insufficient ETH for gas fees";
  if (msg.includes("nonce")) return "Transaction error — please try again";
  if (msg.includes("timeout") || msg.includes("network")) return "Network error — check your connection";
  if (msg.includes("execution reverted")) return "Transaction reverted by contract";

  // Fallback — trim long raw messages
  return msg.length > 80 ? msg.slice(0, 80) + "…" : msg;
}