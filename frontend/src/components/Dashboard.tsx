import { useState, useEffect, useRef } from "react";

interface DashboardProps {
  tokenName: string;
  symbol: string;
  balance: string;
  totalSupply: string;
  countdown: string;
  address: string;
  isRequesting: boolean;
  isMinting: boolean;
  isTransferring: boolean;
  onConnectWallet: () => void;
  onRequestToken: () => void;
  onMint: (to: string, amount: string) => void;
  onTransfer: (to: string, amount: string) => void;
}

const MAX_SUPPLY = 10_000_000;
const CLAIM_AMOUNT = 10;

function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(value);
  const prev = useRef(value);
  useEffect(() => {
    const start = prev.current;
    const end = value;
    const duration = 800;
    const startTime = performance.now();
    const frame = (now: number) => {
      const t = Math.min((now - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(start + (end - start) * ease));
      if (t < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
    prev.current = value;
  }, [value]);
  return <>{display.toLocaleString()}</>;
}

function CountdownRing({ countdown }: { countdown: string }) {
  const isActive = !!countdown;
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  let progress = 0;
  if (isActive) {
    const match = countdown.match(/(\d+)h/);
    const hours = match ? parseInt(match[1]) : 0;
    progress = 1 - hours / 24;
  }
  return (
    <div style={{ position: "relative", width: "140px", height: "140px", flexShrink: 0 }}>
      <svg width="140" height="140" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="70" cy="70" r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
        <circle
          cx="70" cy="70" r={radius} fill="none"
          stroke={isActive ? "#f59e0b" : "#10b981"}
          strokeWidth="6" strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={isActive ? circumference * (1 - progress) : 0}
          style={{ transition: "stroke-dashoffset 1s ease, stroke 0.5s ease" }}
        />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
        {isActive ? (
          <>
            <div style={{ fontSize: "10px", color: "#f59e0b", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "4px" }}>cooldown</div>
            <div style={{ fontSize: "11px", fontWeight: 700, color: "#fbbf24", fontVariantNumeric: "tabular-nums", lineHeight: 1.4, maxWidth: "100px", wordBreak: "break-all" }}>
              {countdown.replace("Retry in ", "")}
            </div>
          </>
        ) : (
          <>
            <div style={{ fontSize: "22px", marginBottom: "2px" }}>✦</div>
            <div style={{ fontSize: "11px", fontWeight: 700, color: "#10b981", letterSpacing: "0.04em" }}>READY</div>
          </>
        )}
      </div>
    </div>
  );
}

export default function Dashboard({
  tokenName, symbol, balance, totalSupply, countdown,
  address, isRequesting, isMinting, isTransferring,
  onConnectWallet, onRequestToken, onMint, onTransfer,
}: DashboardProps) {
  const [mintTo, setMintTo] = useState("");
  const [mintAmount, setMintAmount] = useState("");
  const [transferTo, setTransferTo] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [activeTab, setActiveTab] = useState<"transfer" | "mint">("transfer");

  const shortAddress = address ? `${address.slice(0, 6)}···${address.slice(-4)}` : null;
  const supplyNum = parseFloat(totalSupply || "0");
  const balanceNum = parseFloat(balance || "0");
  const supplyPercent = Math.min((supplyNum / MAX_SUPPLY) * 100, 100);

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
    *{box-sizing:border-box;margin:0;padding:0;}
    body{background:#020917;}
    .d-input{width:100%;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:12px 14px;font-size:13px;color:#e8f4ff;outline:none;font-family:'DM Sans',sans-serif;transition:border-color 0.2s,background 0.2s;}
    .d-input:focus{border-color:rgba(14,165,233,0.5);background:rgba(14,165,233,0.05);}
    .d-input::placeholder{color:rgba(160,200,255,0.3);}
    .s-card{background:rgba(8,20,40,0.6);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);border:1px solid rgba(14,165,233,0.1);border-radius:16px;padding:1.5rem;transition:border-color 0.3s,transform 0.2s;}
    .s-card:hover{border-color:rgba(14,165,233,0.25);transform:translateY(-2px);}
    .g-card{background:rgba(8,20,40,0.55);backdrop-filter:blur(32px);-webkit-backdrop-filter:blur(32px);border:1px solid rgba(14,165,233,0.1);border-radius:20px;}
    .btn-p{background:linear-gradient(135deg,#0ea5e9,#0284c7);border:none;border-radius:12px;padding:13px 28px;font-size:14px;font-weight:700;color:#fff;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all 0.2s ease;box-shadow:0 0 30px rgba(14,165,233,0.3),inset 0 1px 0 rgba(255,255,255,0.15);letter-spacing:-0.01em;}
    .btn-p:hover:not(:disabled){transform:translateY(-1px);box-shadow:0 0 40px rgba(14,165,233,0.5),inset 0 1px 0 rgba(255,255,255,0.15);}
    .btn-p:disabled{background:rgba(255,255,255,0.06);color:rgba(255,255,255,0.2);cursor:not-allowed;box-shadow:none;}
    .btn-g{background:rgba(14,165,233,0.08);border:1px solid rgba(14,165,233,0.2);border-radius:12px;padding:13px 28px;font-size:14px;font-weight:600;color:#38bdf8;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all 0.2s ease;}
    .btn-g:hover:not(:disabled){background:rgba(14,165,233,0.15);border-color:rgba(14,165,233,0.4);}
    .btn-g:disabled{opacity:0.3;cursor:not-allowed;}
    .tab-b{flex:1;padding:10px;border:none;border-radius:10px;font-size:13px;font-weight:600;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all 0.2s;}
    .tab-on{background:rgba(14,165,233,0.15);color:#38bdf8;border:1px solid rgba(14,165,233,0.3);}
    .tab-off{background:transparent;color:rgba(255,255,255,0.3);border:1px solid transparent;}
    .tab-off:hover{color:rgba(255,255,255,0.6);}
    .prog{height:6px;background:rgba(255,255,255,0.06);border-radius:99px;overflow:hidden;margin-top:8px;}
    .prog-f{height:100%;border-radius:99px;background:linear-gradient(90deg,#0ea5e9,#38bdf8);transition:width 1s ease;position:relative;}
    .prog-f::after{content:'';position:absolute;right:0;top:0;bottom:0;width:40px;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.3));}
    .grid-bg{position:fixed;inset:0;pointer-events:none;z-index:0;background-image:linear-gradient(rgba(14,165,233,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(14,165,233,0.03) 1px,transparent 1px);background-size:48px 48px;mask-image:radial-gradient(ellipse 80% 80% at 50% 50%,black 40%,transparent 100%);}
    .orb1{position:fixed;width:600px;height:600px;border-radius:50%;background:radial-gradient(circle,rgba(14,165,233,0.07) 0%,transparent 70%);top:-200px;right:-200px;pointer-events:none;z-index:0;}
    .orb2{position:fixed;width:500px;height:500px;border-radius:50%;background:radial-gradient(circle,rgba(56,189,248,0.05) 0%,transparent 70%);bottom:-200px;left:-150px;pointer-events:none;z-index:0;}
    .ldot{width:7px;height:7px;border-radius:50%;background:#10b981;display:inline-block;box-shadow:0 0 8px #10b981;animation:pdot 2s ease infinite;}
    .badge{display:inline-flex;align-items:center;gap:5px;padding:4px 10px;border-radius:99px;font-size:10px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;}
    .b-g{background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.2);color:#10b981;}
    .b-a{background:rgba(245,158,11,0.1);border:1px solid rgba(245,158,11,0.2);color:#f59e0b;}
    .b-b{background:rgba(14,165,233,0.1);border:1px solid rgba(14,165,233,0.2);color:#38bdf8;}
    @keyframes pdot{0%,100%{opacity:1;transform:scale(1);}50%{opacity:0.6;transform:scale(0.85);}}
    @keyframes spin{from{transform:rotate(0deg);}to{transform:rotate(360deg);}}
  `;

  return (
    <>
      <style>{css}</style>
      <div className="grid-bg" />
      <div className="orb1" />
      <div className="orb2" />

      <div style={{ minHeight: "100vh", background: "#020917", fontFamily: "'DM Sans',sans-serif", color: "#e8f4ff", position: "relative", zIndex: 1 }}>

        {/* Header */}
        <header style={{ position: "sticky", top: 0, zIndex: 50, backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)", background: "rgba(2,9,23,0.8)", borderBottom: "1px solid rgba(14,165,233,0.08)", padding: "0 2rem", height: "68px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: "linear-gradient(135deg,#0ea5e9,#0284c7)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 20px rgba(14,165,233,0.4)", flexShrink: 0 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
                <path d="M2 17l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                <path d="M2 12l10 5 10-5" stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "16px", fontWeight: 800, letterSpacing: "-0.03em", color: "#fff", lineHeight: 1 }}>{tokenName || "Spectra"}</div>
              <div style={{ fontSize: "10px", color: "rgba(56,189,248,0.6)", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: "2px" }}>{symbol || "—"} Spectra Faucet</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span className="ldot" />
            <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", letterSpacing: "0.04em" }}>Lisk Sepolia</span>
          </div>
          <button onClick={onConnectWallet} style={{ background: shortAddress ? "rgba(14,165,233,0.1)" : "linear-gradient(135deg,#0ea5e9,#0284c7)", border: shortAddress ? "1px solid rgba(14,165,233,0.3)" : "none", color: shortAddress ? "#38bdf8" : "#fff", borderRadius: "10px", padding: "9px 20px", fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", transition: "all 0.2s", boxShadow: shortAddress ? "none" : "0 0 24px rgba(14,165,233,0.35)", letterSpacing: "-0.01em" }}>
            {shortAddress ? <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#10b981", display: "inline-block" }} />{shortAddress}</span> : "Connect Wallet"}
          </button>
        </header>

        <main style={{ maxWidth: "1000px", margin: "0 auto", padding: "2.5rem 2rem 5rem" }}>

          {/* Title */}
          <div style={{ marginBottom: "2.5rem" }}>
            <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(28px,4vw,40px)", fontWeight: 800, letterSpacing: "-0.04em", color: "#fff", lineHeight: 1, marginBottom: "8px" }}>Spectra Dashboard</h1>
            <p style={{ fontSize: "14px", color: "rgba(160,200,255,0.5)", letterSpacing: "-0.01em" }}>Claim, transfer and mint {symbol || "tokens"} on Lisk Sepolia . Spectra Faucet</p>
          </div>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1rem", marginBottom: "1.5rem" }}>
            <div className="s-card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                <span style={{ fontSize: "11px", color: "rgba(160,200,255,0.5)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Your Balance</span>
                <span className="badge b-b">{symbol}</span>
              </div>
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "32px", fontWeight: 800, letterSpacing: "-0.04em", color: "#fff", lineHeight: 1 }}><AnimatedNumber value={balanceNum} /></div>
              <div style={{ fontSize: "12px", color: "rgba(160,200,255,0.4)", marginTop: "6px" }}>≈ {(balanceNum * 0.001).toFixed(4)} USD</div>
            </div>
            <div className="s-card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                <span style={{ fontSize: "11px", color: "rgba(160,200,255,0.5)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Circulating Supply</span>
                <span style={{ fontSize: "11px", fontWeight: 700, color: "#0ea5e9" }}>{supplyPercent.toFixed(1)}%</span>
              </div>
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "32px", fontWeight: 800, letterSpacing: "-0.04em", color: "#fff", lineHeight: 1 }}><AnimatedNumber value={supplyNum} /></div>
              <div className="prog"><div className="prog-f" style={{ width: `${supplyPercent}%` }} /></div>
            </div>
            <div className="s-card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                <span style={{ fontSize: "11px", color: "rgba(160,200,255,0.5)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Max Supply</span>
                <span className="badge b-b">Hard Cap</span>
              </div>
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "32px", fontWeight: 800, letterSpacing: "-0.04em", color: "#fff", lineHeight: 1 }}>10,000,000</div>
              <div style={{ fontSize: "12px", color: "rgba(160,200,255,0.4)", marginTop: "6px" }}>{(MAX_SUPPLY - supplyNum).toLocaleString()} remaining</div>
            </div>
          </div>

          {/* Faucet */}
          <div className="g-card" style={{ padding: "2.5rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "2.5rem", flexWrap: "wrap", background: countdown ? "rgba(245,158,11,0.04)" : "rgba(16,185,129,0.04)", borderColor: countdown ? "rgba(245,158,11,0.15)" : "rgba(16,185,129,0.15)" }}>
            <CountdownRing countdown={countdown} />
            <div style={{ flex: 1, minWidth: "200px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "0.75rem" }}>
                <span className={`badge ${countdown ? "b-a" : "b-g"}`}>{countdown ? "⏱ Cooldown Active" : "✓ Available Now"}</span>
              </div>
              <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: "26px", fontWeight: 800, letterSpacing: "-0.03em", color: "#fff", marginBottom: "0.5rem" }}>Daily Faucet</h2>
              <p style={{ fontSize: "13px", color: "rgba(160,200,255,0.5)", lineHeight: 1.7, marginBottom: "1.25rem" }}>
                Claim <strong style={{ color: "#fff" }}>{CLAIM_AMOUNT} {symbol}</strong> every 24 hours. Countdown is personal to your wallet — other users are unaffected.
              </p>
              <button className="btn-p" onClick={onRequestToken} disabled={isRequesting || !!countdown} style={{ minWidth: "180px" }}>
                {isRequesting ? <span style={{ display: "flex", alignItems: "center", gap: "8px", justifyContent: "center" }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: "spin 1s linear infinite" }}><path d="M21 12a9 9 0 11-6.219-8.56"/></svg>Claiming…</span> : countdown ? "Cooldown Active" : "Claim Tokens"}
              </button>
            </div>
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "14px", padding: "1.5rem", minWidth: "140px", textAlign: "center" }}>
              <div style={{ fontSize: "11px", color: "rgba(160,200,255,0.4)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.5rem" }}>Per Claim</div>
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "36px", fontWeight: 800, color: "#0ea5e9", letterSpacing: "-0.04em", lineHeight: 1 }}>{CLAIM_AMOUNT}</div>
              <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", marginTop: "4px" }}>{symbol}</div>
              <div style={{ fontSize: "11px", color: "rgba(160,200,255,0.3)", marginTop: "8px" }}>every 24h</div>
            </div>
          </div>

          {/* Transfer / Mint */}
          <div className="g-card" style={{ padding: "2rem" }}>
            <div style={{ display: "flex", gap: "6px", background: "rgba(255,255,255,0.03)", padding: "5px", borderRadius: "12px", marginBottom: "1.75rem" }}>
              <button className={`tab-b ${activeTab === "transfer" ? "tab-on" : "tab-off"}`} onClick={() => setActiveTab("transfer")}>↗ Transfer {symbol}</button>
              <button className={`tab-b ${activeTab === "mint" ? "tab-on" : "tab-off"}`} onClick={() => setActiveTab("mint")}>
                ⬡ Mint Tokens <span className="badge b-b" style={{ marginLeft: "8px", padding: "2px 7px", fontSize: "9px" }}>Owner</span>
              </button>
            </div>

            {activeTab === "transfer" && (
              <div>
                <p style={{ fontSize: "13px", color: "rgba(160,200,255,0.45)", marginBottom: "1.25rem", lineHeight: 1.6 }}>Send {symbol} tokens to any EVM wallet address on Lisk Sepolia.</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.25rem" }}>
                  <input className="d-input" type="text" placeholder="Recipient address (0x...)" value={transferTo} onChange={(e) => setTransferTo(e.target.value)} />
                  <div style={{ position: "relative" }}>
                    <input className="d-input" type="number" placeholder="Amount to send" value={transferAmount} onChange={(e) => setTransferAmount(e.target.value)} style={{ paddingRight: "60px" }} />
                    <span style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", fontSize: "12px", fontWeight: 700, color: "#0ea5e9" }}>{symbol}</span>
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "12px", color: "rgba(160,200,255,0.35)" }}>Available: {Number(balance || 0).toLocaleString()} {symbol}</span>
                  <button className="btn-g" disabled={isTransferring || !transferTo || !transferAmount} onClick={() => { onTransfer(transferTo, transferAmount); setTransferTo(""); setTransferAmount(""); }} style={{ minWidth: "140px" }}>
                    {isTransferring ? "Sending…" : "Send Tokens →"}
                  </button>
                </div>
              </div>
            )}

            {activeTab === "mint" && (
              <div>
                <div style={{ background: "rgba(14,165,233,0.06)", border: "1px solid rgba(14,165,233,0.15)", borderRadius: "10px", padding: "12px 16px", marginBottom: "1.25rem", fontSize: "13px", color: "rgba(56,189,248,0.8)", lineHeight: 1.6 }}>
                  ⚠ Restricted to the contract owner. Transactions from non-owner wallets will revert on-chain.
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.25rem" }}>
                  <input className="d-input" type="text" placeholder="Recipient address (0x...)" value={mintTo} onChange={(e) => setMintTo(e.target.value)} />
                  <div style={{ position: "relative" }}>
                    <input className="d-input" type="number" placeholder="Amount to mint" value={mintAmount} onChange={(e) => setMintAmount(e.target.value)} style={{ paddingRight: "60px" }} />
                    <span style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", fontSize: "12px", fontWeight: 700, color: "#0ea5e9" }}>{symbol}</span>
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "12px", color: "rgba(160,200,255,0.35)" }}>Remaining cap: {(MAX_SUPPLY - supplyNum).toLocaleString()} {symbol}</span>
                  <button className="btn-g" disabled={isMinting || !mintTo || !mintAmount} onClick={() => { onMint(mintTo, mintAmount); setMintTo(""); setMintAmount(""); }} style={{ minWidth: "140px" }}>
                    {isMinting ? "Minting…" : "Mint Tokens ⬡"}
                  </button>
                </div>
              </div>
            )}
          </div>

        </main>
      </div>
    </>
  );
}
