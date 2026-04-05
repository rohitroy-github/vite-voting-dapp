import Login from "./components/Login.jsx";
import Finished from "./components/Finished.jsx";
import Connected from "./components/Connected.jsx";
import Navbar from "./components/Navbar.jsx";
import { useVoting } from "./hooks/useVoting.js";

function App() {
  const {
    account,
    isConnected,
    votingStatus,
    candidates,
    number,
    CanVote,
    vote,
    connectToMetamask,
    handleNumberChange,
    disconnectWallet,
  } = useVoting();

  return (
    <div className="font-['Montserrat',sans-serif]">
      <Navbar
        isConnected={isConnected}
        account={account}
        connectWallet={connectToMetamask}
        disconnectWallet={disconnectWallet}
      />
      {votingStatus ? (
        isConnected ? (
          <Connected
            account={account}
            candidates={candidates}
            number={number}
            handleNumberChange={handleNumberChange}
            voteFunction={vote}
            showButton={CanVote}
          />
        ) : (
          <Login connectWallet={connectToMetamask} />
        )
      ) : (
        <Finished candidates={candidates} />
      )}

      <footer className="fixed bottom-[10px] left-1/2 z-[900] m-0 -translate-x-1/2 p-0 text-center font-['Montserrat',sans-serif] text-[0.72rem] font-medium text-white/95 md:bottom-[10px] md:text-[0.82rem]">
        Build to improve transperancy by Rohit Roy | 2026
      </footer>
    </div>
  );
}

export default App;
