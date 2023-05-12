import {useEffect, useState} from "react";

const Finished = (props) => {
  function findWinningCandidate() {
    const maxVoteCount = Math.max(
      ...props.candidates.map((candidate) => candidate.voteCount)
    );
    const winningCandidates = props.candidates.filter(
      (candidate) => candidate.voteCount === maxVoteCount
    );
    if (winningCandidates.length > 0) {
      const winningCandidate = winningCandidates[0];
      return {
        name: winningCandidate.name,
        voteCount: winningCandidate.voteCount,
      };
    } else {
      return null;
    }
  }

  return (
    <div className="main_container">
      <div className="left_block">
        <div className="welcome_message">
          <p>Results Portal</p>
        </div>
        <div className="connected_header">
          <p>The winning candidate : {findWinningCandidate().name}</p>
          <p>
            Votes secured by the winning candidate :{" "}
            {findWinningCandidate().voteCount}
          </p>
        </div>
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

export default Finished;
