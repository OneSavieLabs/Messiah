# Messiah

prevent next 1.5B hack

<img src="concept.png"  width="100%">

## Incident Report

| File                                                                               | Lost |
| ---------------------------------------------------------------------------------- | ---- |
| [Bybit Hack](./incident/Bybit/Bybit-Incident-Investigation-Preliminary-Report.pdf) | 1.5B |

## Frontend Setup

```bash
pnpm install
pnpm dev
```

you can use github action deploy to github page

Github Page:
https://daky.github.io/Messiah/

reference:
https://vite.dev/guide/static-deploy

note: since we use pnpm, so need to npm install it

### n8n & Backend Installation Setup

1. Setup Python environment:

```bash
# Initialize virtual environment and install dependencies
poetry shell
poetry install
```

2. Configure environment variables in `.env`:

```bash
cp .env.example .env
```

Update the environment variables in `.env` file if needed.

3. Start n8n and database:

```bash
source .env
docker-compose up -d
```

4. Access the n8n dashboard, Open your browser and navigate to `http://localhost:5678`

5. (First time only) Setup owner account, activate free n8n pro features

#### Tech Stack:

- React
- Tailwind CSS
- TypeScript
- Vite
- Web3 Onboard
- ethers.js v6
- Python
- n8n

## Chain and Faucet Setup

### HashKey Chain Testnet

add to wallet: https://chainlist.org/chain/133

faucet: https://faucet.hsk.xyz/zh_TW/faucet

### Celo Alfajores Testnet

add to wallet: https://chainlist.org/chain/44787

faucet: https://faucet.celo.org/alfajores

### Zircuit Garfield Testnet

add to wallet: https://chainlist.org/chain/48898

faucet: https://docs.zircuit.com/garfield-testnet/quick-start#deposit-eth-from-sepolia-to-zircuit-l1-greater-than-l2
get sepolia ETH first and then use https://bridge.garfield-testnet.zircuit.com/ to bridge it to Zircuit testnet

## Contract Deployment Setup

use [Remix](https://remix.ethereum.org/) to deploy

1.Paste the contract into the editor and keep it open.

2.Then go to the sidebar, select "Solidity compiler," and click "Compile."

3.Next, go to "Deploy & run transactions." At the top under "Environment," select "WalletConnect" to connect to your Browser Wallet. Then switch to the chain you want to deploy on, make sure the correct contract is selected for deployment, and click "Deploy." A wallet confirmation for the transaction will pop up, and that’s it.

## Contract Deployment Result

### HashKey Chain Testnet

Trojan.sol

**address:** 0x60a35129f822f2da2062c26097296b70faea4083

**tx:** https://hashkeychain-testnet-explorer.alt.technology/tx/0x84b208275c14ddcda309c2bcdc99e4cd35312ac62ab30c4a771b6fcfb8d84701

Transfer.sol

**address:** 0xb9b813e06a48fff9b6a2fa4a2809103bf4dd5218

**tx:** https://hashkeychain-testnet-explorer.alt.technology/tx/0x24e98fee1239ebc1376d840638b3b41a502f1394a9163444f1219fa62d0e9ac2

### Celo Alfajores Testnet

Trojan.sol

**address:** 0x60a35129f822f2da2062c26097296b70faea4083

**tx:** https://celo-alfajores.blockscout.com/tx/0x5a88b6a7550348afbf7e0a65687bc8bf88b3c5c4e1be39a1f742d12f0c629db9

Transfer.sol

**address:** 0xb9b813e06a48fff9b6a2fa4a2809103bf4dd5218

**tx:** https://celo-alfajores.blockscout.com/tx/0xffcebeef3ea4cf8512facacb6f32165dc1e58a8acd44bf1ab0687fd401c75b94

### Zircuit Garfield Testnet

Trojan.sol

**address:** 0x60a35129f822f2da2062c26097296b70faea4083

**tx:** https://explorer.testnet.zircuit.com/tx/0x31c1388ef5340806c30b6e5fcaf077b8354be81b57f1d55a8cea3a919e7dcd24

Transfer.sol

**address:** 0xb9b813e06a48fff9b6a2fa4a2809103bf4dd5218

**tx:** https://explorer.testnet.zircuit.com/tx/0xe2e80da6a3f71bac11ef516f968780e26d746fa2a4cefd328ae1e8555e70204b
