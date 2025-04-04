# Messiah

prevent next 1.5B hack

<img src="concept.png"  width="100%">

# Incident Report

| File                                                                               | Lost |
| ---------------------------------------------------------------------------------- | ---- |
| [Bybit Hack](./incident/Bybit/Bybit-Incident-Investigation-Preliminary-Report.pdf) | 1.5B |

### Frontend

```bash
pnpm install
pnpm dev
```

#### Tech Stack:

- React
- Tailwind CSS
- TypeScript
- Vite
- Web3 Onboard
- ethers.js v6

## Chain and gas setup

### HashKey Chain Testnet

add to wallet: https://chainlist.org/chain/133

faucet: https://faucet.hsk.xyz/zh_TW/faucet

### Celo Alfajores Testnet

add to wallet: https://chainlist.org/chain/44787

faucet: https://faucet.celo.org/alfajores

### Zircuit

add to wallet: https://chainlist.org/chain/48898

faucet: https://docs.zircuit.com/garfield-testnet/quick-start#deposit-eth-from-sepolia-to-zircuit-l1-greater-than-l2
get sepolia ETH first and then use https://bridge.garfield-testnet.zircuit.com/ to bridge it to Zircuit testnet

## Contract Deployment

use [Remix](https://remix.ethereum.org/) to deploy

1.Paste the contract into the editor and keep it open.

2.Then go to the sidebar, select "Solidity compiler," and click "Compile."

3.Next, go to "Deploy & run transactions." At the top under "Environment," select "WalletConnect" to connect to your Browser Wallet. Then switch to the chain you want to deploy on, make sure the correct contract is selected for deployment, and click "Deploy." A wallet confirmation for the transaction will pop up, and that’s it.
