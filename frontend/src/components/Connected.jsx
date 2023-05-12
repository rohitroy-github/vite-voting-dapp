import React from "react";
import {useState, useEffect} from "react";

import {ethers} from "ethers";
import {contractABI, contractAddress} from "../constants/constant.js";

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
    getVotedCandidate();
  }, []);

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
    <div className="main_container">
      {/* leftBlock */}
      <div className="left_block">
        <div className="welcome_message">
          <p>Voting Portal</p>
        </div>
        <div className="connected_header">
          <p>UID (Metamask Address) : {props.account}</p>
        </div>
        <div className="connected_header">
          <p>Remaining Time : {remainingTime} minutes</p>
        </div>
        {props.showButton ? (
          <div className="voting_block">
            <p>
              You have already casted your vote to : <b>{votedCandidate}</b>
            </p>
          </div>
        ) : (
          <div className="voting_block">
            <input
              type="number"
              placeholder="Entern Candidate Index"
              value={props.number}
              onChange={props.handleNumberChange}
            ></input>
            <br />
            <button className="voting_button" onClick={props.voteFunction}>
              Cast Your Vote
            </button>
          </div>
        )}

        {props.showButton ? (
          <div className="rules_block">
            <p>
              Your vote has been casted successfully based on the above
              mentioned UID. <br />
              The results will be displayed after the contest ends.
            </p>
          </div>
        ) : (
          <div className="rules_block">
            <p>
              Choose the index number for the respective candidate from the
              mentioned list. <br />
              Once casted, your vote cannot be altered. So please double check
              before proceeding to final casting.
            </p>
          </div>
        )}
      </div>

      {/* rightBlock */}
      <div className="right_block">
        <table className="candidate_table">
          <thead>
            <tr>
              <th className="index">Index</th>
              <th className="name">Candidates</th>
              <th>Votes</th>
            </tr>
          </thead>
          <tbody>
            {props.candidates.map((candidate, index) => (
              <tr key={index}>
                <td className="index">{candidate.index}</td>
                <td className="index">{candidate.name}</td>
                <td>{candidate.voteCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Connected;
