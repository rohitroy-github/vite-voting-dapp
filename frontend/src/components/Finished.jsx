const Finished = (props) => {
  function findWinningCandidate() {
    if (!props.candidates || props.candidates.length === 0) {
      return null;
    }

    const maxVoteCount = Math.max(
      ...props.candidates.map((candidate) => candidate.voteCount),
    );
    const winningCandidates = props.candidates.filter(
      (candidate) => candidate.voteCount === maxVoteCount,
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
    <div className="flex w-full flex-col text-white">
      <div className="mb-2 w-full text-left">
        <div className="inline-flex items-center justify-center rounded-lg border border-white/20 bg-white/10 backdrop-blur-[12px] px-6 py-[0.65rem] font-['Montserrat',sans-serif] text-[1rem] font-bold text-white transition-all duration-200 hover:bg-white/15">
          Results Portal
        </div>
      </div>
      <div className="flex w-full flex-1 flex-col items-center justify-center py-8 text-center md:flex-row md:items-start">
        <div className="my-4 flex w-full flex-col items-center justify-center md:w-1/2 md:self-stretch md:pr-8">
          <div className="w-full text-center">
            {winningCandidate ? (
              <>
                <p className="m-0 p-0 text-sm font-bold md:m-[1.2rem] md:text-base">
                  The winning candidate is {winningCandidate.name}
                </p>
                <p className="m-0 p-0 text-sm font-bold md:m-[1.2rem] md:text-base">
                  Votes secured by the winning candidate ={" "}
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
                <th className="w-1/3 rounded-[2px] border-2 border-white p-4">
                  ID
                </th>
                <th className="w-1/3 rounded-[2px] border-2 border-white p-4">
                  Candidate Name
                </th>
                <th className="w-1/3 rounded-[2px] border-2 border-white p-4">
                  Vote Count
                </th>
              </tr>
            </thead>
            <tbody>
              {props.candidates.map((candidate, index) => (
                <tr key={index}>
                  <td className="w-1/3 rounded-[2px] border-2 border-white p-4">
                    {candidate.index}
                  </td>
                  <td className="w-1/3 rounded-[2px] border-2 border-white p-4">
                    {candidate.name}
                  </td>
                  <td className="w-1/3 rounded-[2px] border-2 border-white p-4">
                    {candidate.voteCount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Finished;
