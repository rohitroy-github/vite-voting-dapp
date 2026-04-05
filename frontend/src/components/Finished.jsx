const Finished = (props) => {
  function findWinningCandidate() {
    if (!props.candidates || props.candidates.length === 0) {
      return null;
    }

    const maxVoteCount = Math.max(
      ...props.candidates.map((candidate) => candidate.voteCount)
    );
    const winningCandidates = props.candidates.filter(
      (candidate) => candidate.voteCount === maxVoteCount
    );

    // A winner exists only when exactly one candidate has the highest votes.
    if (winningCandidates.length === 1) {
      const winningCandidate = winningCandidates[0];
      return {
        name: winningCandidate.name,
        voteCount: winningCandidate.voteCount,
      };
    } else {
      return null;
    }
  }

  const winningCandidate = findWinningCandidate();

  return (
    <div className="flex w-full flex-col items-center justify-center py-8 text-center text-white md:flex-row md:items-start">
      <div className="my-4 flex w-full flex-col items-center justify-center md:w-1/2 md:self-stretch md:pr-8">
        <div>
          <p className="m-0 p-0 text-lg font-extrabold md:m-[1.2rem] md:text-xl">Results Portal</p>
          <p className="m-0 mt-1 p-0 text-xs font-medium md:text-sm">
            Polls have ended, results are out.
          </p>
        </div>
        <div className="w-full text-center">
          {winningCandidate ? (
            <>
              <p className="m-0 p-0 text-sm font-bold md:m-[1.2rem] md:text-base">
                The winning candidate : {winningCandidate.name}
              </p>
              <p className="m-0 p-0 text-sm font-bold md:m-[1.2rem] md:text-base">
                Votes secured by the winning candidate : {" "}
                {winningCandidate.voteCount}
              </p>
            </>
          ) : (
            <p className="m-0 p-0 text-sm font-bold md:m-[1.2rem] md:text-base">
              There is no clear majority in this poll.
            </p>
          )}
        </div>
      </div>

      {/* rightBlock */}
      <div className="relative my-4 flex w-full flex-col items-center justify-center text-center md:w-1/2 md:self-stretch">
        <table className="w-full max-w-[560px]">
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
