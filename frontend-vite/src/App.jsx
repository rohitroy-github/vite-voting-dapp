import Login from "./components/Login.jsx";
import Finished from "./components/Finished.jsx";
import Connected from "./components/Connected.jsx";
import Layout from "./components/Layout.jsx";
import { useVoting } from "./hooks/useVoting.js";

function App() {
  const {
    account,
    isConnected,
    isVoting,
    votingStatus,
    candidates,
    number,
    CanVote,
    vote,
    connectToMetamask,
    handleNumberChange,
    disconnectWallet,
    refreshVotingStatus,
  } = useVoting();

  return (
    <Layout
      isConnected={isConnected}
      account={account}
      connectWallet={connectToMetamask}
      disconnectWallet={disconnectWallet}
    >
      {votingStatus ? (
        isConnected ? (
          <Connected
            account={account}
            candidates={candidates}
            number={number}
            handleNumberChange={handleNumberChange}
            voteFunction={vote}
            isVoting={isVoting}
            showButton={CanVote}
            refreshVotingStatus={refreshVotingStatus}
          />
        ) : (
          <Login connectWallet={connectToMetamask} />
        )
      ) : (
        <Finished candidates={candidates} />
      )}
    </Layout>
  );
}

export default App;
