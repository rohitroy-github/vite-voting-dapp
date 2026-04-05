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

    const votedCandidateName = await contractInstance.voterVotedFor(
      await signer.getAddress()
    );

    setVotedCandidate(votedCandidateName);
  }

  // Function to fetch the remaining time
  async function getRemainingTime() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const contractInstance = new ethers.Contract(
      contractAddress,
      contractABI,
      signer
    );
    const time = await contractInstance.getRemainingTime();
    // conversionToSeconds
    const timeInSeconds = time.toNumber();
    // conversionToMinutes
    const timeInMinutes = Math.floor(timeInSeconds / 60);

    setRemainingTime(timeInMinutes);
  }

  useEffect(() => {
    if (props.showButton) {
      getVotedCandidate();
    }
  }, [props.showButton]);

  useEffect(() => {
    getRemainingTime();

    // Update the remaining time every second
    const timer = setInterval(() => {
      getRemainingTime();
    }, 1000);

    // Clear the interval when the component is unmounted
    return () => {
      clearInterval(timer);
    };
  }, [remainingTime]);

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
          <p className="m-0 p-0 text-base font-extrabold md:m-[1.2rem]">Remaining Time : {remainingTime} minutes</p>
        </div>
        {props.showButton ? (
          <div className="m-[1.2rem] flex w-full flex-col text-center">
            <p className="m-0 p-0 text-center font-extrabold">
              You have already casted your vote to : <b className="font-medium">{votedCandidate}</b>
            </p>
          </div>
        ) : (
          <div className="m-[1.2rem] flex w-full flex-col text-center">
            <input
              type="number"
              placeholder="Entern Candidate Index"
              value={props.number}
              onChange={props.handleNumberChange}
              className="mb-[5px] box-border rounded-[5px] border-2 border-white bg-white p-4 text-center font-['Montserrat',sans-serif] text-base font-extrabold text-black"
            ></input>
            <br />
            <button
              className="rounded-[5px] border-2 border-white bg-white p-4 text-center font-['Montserrat',sans-serif] text-base font-extrabold text-black transition-colors duration-300 hover:bg-gradient-to-br hover:from-[#ec1ae6] hover:via-[#a036eb] hover:to-[#2642e6] hover:text-white"
              onClick={props.voteFunction}
            >
              Cast Your Vote
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
