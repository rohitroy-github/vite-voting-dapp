import {useState, useEffect} from "react";

import {ethers} from "ethers";
import {contractABI, contractAddress} from "../constants/constant.js";
import {shortenAddress} from "../utils/utils.js";

const Connected = (props) => {
  const [votedCandidate, setVotedCandidate] = useState("");
  const [remainingTime, setRemainingTime] = useState("");

  // function : ifAlreadyVoted?ThenToWhom?
  async function getVotedCandidate() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const contractInstance = new ethers.Contract(
      contractAddress,
      contractABI,
      signer
    );

    const voterAddress = await signer.getAddress();
    const hasVoted = await contractInstance.voters(voterAddress);

    if (!hasVoted) {
      setVotedCandidate("");
      return;
    }

    const votedCandidateName = await contractInstance.voterVotedFor(voterAddress);
    setVotedCandidate(votedCandidateName);
  }

  // Function to fetch the remaining time
  async function getRemainingTime() {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const contractInstance = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );

      const [startTs, endTs, latestBlock] = await Promise.all([
        contractInstance.votingStart(),
        contractInstance.votingEnd(),
        provider.getBlock("latest"),
      ]);

      const nowTs = latestBlock.timestamp;
      const votingStartTs = startTs.toNumber();
      const votingEndTs = endTs.toNumber();

      if (nowTs < votingStartTs) {
        setRemainingTime("Not started");
        return;
      }

      if (nowTs >= votingEndTs) {
        setRemainingTime(0);
        return;
      }

      const timeInMinutes = Math.ceil((votingEndTs - nowTs) / 60);
      setRemainingTime(timeInMinutes);
    } catch (err) {
      console.error("Error fetching remaining time:", err);
    }
  }

  useEffect(() => {
    if (props.showButton) {
      getVotedCandidate();
    }
  }, [props.showButton]);

  useEffect(() => {
    getRemainingTime();

    const timer = setInterval(() => {
      getRemainingTime();
    }, 30000); // Update every 30 seconds

    // Clear the interval when the component is unmounted
    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="flex w-full flex-col items-center justify-center py-8 text-center text-white md:flex-row md:items-start">
      {/* leftBlock */}
      <div className="my-4 flex w-full flex-col items-center justify-center md:w-1/2 md:self-stretch md:pr-8">
        <div>
          <p className="m-0 p-0 font-extrabold md:m-[1.2rem]">Voting Portal</p>
        </div>
        <div className="w-full text-center">
          <p className="m-0 p-0 text-base font-extrabold md:m-[1.2rem]">Voter's UID: {shortenAddress(props.account)}</p>
        </div>
        <div className="w-full text-center">
          <p className="m-0 p-0 text-base font-extrabold md:m-[1.2rem]">Poll ends in: {remainingTime} {typeof remainingTime === "number" ? "minutes" : ""}</p>
        </div>
        {props.showButton ? (
          <div className="m-[1.2rem] flex w-full flex-col text-center">
            <p className="m-0 p-0 text-center font-extrabold">
              You voted for : <b className="font-medium">{votedCandidate}</b>
            </p>
          </div>
        ) : (
          <div className="m-[1.2rem] flex w-full flex-col text-center">
            <input
              type="text"
              placeholder="Enter candidate name or index"
              value={props.number}
              onChange={props.handleNumberChange}
              className="box-border w-full rounded-[5px] border-2 border-white bg-white p-4 text-center font-['Montserrat',sans-serif] text-base font-extrabold text-black"
            />
            <button
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-[5px] border-2 border-white bg-white p-4 text-center font-['Montserrat',sans-serif] text-base font-extrabold text-black transition-all duration-300 hover:bg-transparent hover:text-white hover:backdrop-blur-sm"
              onClick={props.voteFunction}
              disabled={props.isVoting}
            >
              {props.isVoting ? (
                <span
                  className="h-5 w-5 animate-spin rounded-full border-2 border-black border-t-transparent"
                  aria-label="Submitting vote"
                />
              ) : (
                "Seal your vote with MetaMask"
              )}
            </button>
          </div>
        )}

        {props.showButton ? (
          <div>
            <p className="m-[1.2rem] text-center text-[0.7rem]">
              Your vote has been casted successfully based on the above
              mentioned UID. <br />
              The results will be displayed after the poll ends.
            </p>
          </div>
        ) : (
          <div>
            <p className="m-[1.2rem] text-center text-[0.7rem]">
              Choose the index number for the respective candidate from the
              mentioned list. <br />
              Once casted, your vote cannot be altered. So please double check
              before proceeding to final casting.
            </p>
          </div>
        )}
      </div>

      {/* rightBlock */}
      <div className="relative my-4 flex w-full flex-col items-center justify-center text-center md:w-1/2 md:self-stretch md:pl-8">
        <p className="mb-3 text-lg font-extrabold md:text-xl">Live Vote Counts</p>
        <table className="w-full">
          <thead>
            <tr>
              <th className="w-1/3 rounded-[2px] border-2 border-white p-4">Index</th>
              <th className="w-1/3 rounded-[2px] border-2 border-white p-4">Candidates</th>
              <th className="w-1/3 rounded-[2px] border-2 border-white p-4">Votes</th>
            </tr>
          </thead>
          <tbody>
            {props.candidates.map((candidate, index) => (
              <tr key={index}>
                <td className="w-1/3 rounded-[2px] border-2 border-white p-4">{candidate.index}</td>
                <td className="w-1/3 rounded-[2px] border-2 border-white p-4">{candidate.name}</td>
                <td className="w-1/3 rounded-[2px] border-2 border-white p-4">{candidate.voteCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Connected;
