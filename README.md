# ERC20 Token Faucet

A simple ERC20 token faucet built for Web3Bridge Cohort XIV.

## Contract

- **Network:** Lisk Sepolia (Chain ID: 4202)
- **Contract Address:** `0x5F376871EF63fF42AC9cd955220E54f035D7baDD`
- **Verified:** https://sepolia-blockscout.lisk.com/address/0x5f376871ef63ff42ac9cd955220e54f035d7badd

## Token Details

- **Name:** ERCASSIGN
- **Symbol:** (SYM)
- **Max Supply:** 10,000,000
- **Claim Amount:** 10 tokens per 24 hours

## Features

- `requestToken()` — claim 10 tokens every 24 hours
- `mint()` — owner only, mint to any address
- `transfer()` — send tokens to any address
- Per-user cooldown countdown timer
- 5 read functions integrated

## Frontend

- **Live URL:** (add after Vercel deploy)
- Built with React + TypeScript + Tailwind CSS
- Wallet connection via Reown AppKit

## Tests

5 Foundry tests — all passing.