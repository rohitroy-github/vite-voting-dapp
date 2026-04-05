import React, { useState } from "react";

const Navbar = ({ isConnected, account, connectWallet, disconnectWallet }) => {
  const [isHoveringAccount, setIsHoveringAccount] = useState(false);
  const centerBtnClass =
    "rounded-lg border-[1.5px] border-white/70 bg-transparent px-4 py-[0.45rem] font-['Montserrat',sans-serif] text-[0.85rem] font-bold text-white transition-all duration-200 hover:border-white hover:bg-white/15";
  const walletBtnBaseClass =
    "cursor-pointer min-w-[160px] rounded-lg border-2 border-white/70 bg-white/15 px-4 py-[0.45rem] font-['Montserrat',sans-serif] text-[0.85rem] font-bold text-white transition-all duration-200 hover:border-white hover:bg-white/25";

  return (
    <nav className="fixed left-1/2 top-[14px] z-[1000] flex w-[calc(100%-48px)] max-w-[1200px] -translate-x-1/2 items-center justify-between rounded-[14px] border border-white/20 bg-white/10 px-[1.4rem] py-[0.65rem] text-white backdrop-blur-[12px]">
      <span className="font-['Montserrat',sans-serif] text-[1.3rem] font-extrabold tracking-[0.04em]">Decentrocast</span>
      
      <div className="hidden items-center gap-3 md:flex">
        <button className={centerBtnClass}>Create New Poll</button>
        <button className={centerBtnClass}>Caste Your Vote</button>
      </div>

      <div className="flex items-center gap-3">
        {isConnected ? (
          <button
            className={`${walletBtnBaseClass} whitespace-nowrap`}
            onClick={disconnectWallet}
            onMouseEnter={() => setIsHoveringAccount(true)}
            onMouseLeave={() => setIsHoveringAccount(false)}
          >
            {isHoveringAccount ? "Disconnect Wallet" : `${account.slice(0, 8)}...${account.slice(-5)}`}
          </button>
        ) : (
          <button
            className={walletBtnBaseClass}
            onClick={connectWallet}
          >
            Connect Wallet
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
