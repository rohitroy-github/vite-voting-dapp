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
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-[#ec1ae6] via-[#a036eb] to-[#2642e6] px-8 py-8 text-center text-white md:flex-row md:p-0">
      <div className="my-4 flex w-full flex-col items-center md:mx-20 md:w-1/2">
        <div>
          <p className="m-0 p-0 font-extrabold md:m-[1.2rem]">Results Portal</p>
        </div>
        <div className="w-full text-center">
          <p className="m-0 p-0 text-base font-extrabold md:m-[1.2rem]">The winning candidate : {findWinningCandidate().name}</p>
          <p className="m-0 p-0 text-base font-extrabold md:m-[1.2rem]">
            Votes secured by the winning candidate :{" "}
            {findWinningCandidate().voteCount}
          </p>
        </div>
      </div>

      {/* rightBlock */}
      <div className="relative my-4 flex w-full flex-col items-center text-center md:mx-20 md:w-1/2">
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

export default Finished;
