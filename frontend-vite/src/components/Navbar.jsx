import React, { useState } from "react";
import { shortenAddress } from "../utils/utils.js";

const Navbar = ({ isConnected, account, connectWallet, disconnectWallet }) => {
  const [isHoveringAccount, setIsHoveringAccount] = useState(false);
  const centerBtnClass =
    "rounded-lg border-[1.5px] border-white/70 bg-transparent px-4 py-[0.45rem] font-['Montserrat',sans-serif] text-[0.85rem] font-bold text-white transition-all duration-200 hover:border-white hover:bg-white/15";
  const walletBtnBaseClass =
    "cursor-pointer min-w-[160px] rounded-lg border-2 border-white/70 bg-white/15 px-4 py-[0.45rem] font-['Montserrat',sans-serif] text-[0.85rem] font-bold text-white transition-all duration-200 hover:border-white hover:bg-white/25";

  return (
    <nav className="fixed left-0 right-0 top-[14px] z-[1000] text-white">
      <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between rounded-[14px] border border-white/20 bg-white/10 px-[1.4rem] py-[0.65rem] backdrop-blur-[12px]">
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
                {isHoveringAccount ? "Disconnect Wallet" : shortenAddress(account)}
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
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
