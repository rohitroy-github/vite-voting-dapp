// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract VotingContract {
    struct Candidate {
        string name;
        uint256 voteCount;
    }

    // Ordered list of all candidates in the election.
    Candidate[] public candidates;
    // Contract deployer who controls pre-voting admin actions.
    address public owner;
    // Tracks whether an address has already voted.
    mapping(address => bool) public voters;
    // Stores the selected candidate index for each voter address.
    mapping(address => uint256) public voterToCandidate;
    // Internal helper to prevent duplicate candidate names.
    mapping(string => bool) private candidateExists;

    // Voting window timestamps (unix seconds).
    uint256 public votingStart;
    uint256 public votingEnd;

    event Voted(address indexed voter, uint256 indexed candidateIndex);
    event CandidateAdded(string name);

    constructor(
        string[] memory _candidateNames,
        uint256 _setupWindowMinutes,
        uint256 _durationInMinutes
    ) {
        // Require at least one candidate and a valid voting duration.
        require(_candidateNames.length > 0, "At least one candidate required");
        require(_durationInMinutes > 0, "Duration must be greater than 0");

        // Seed the initial candidate list while enforcing non-empty unique names.
        for (uint256 i = 0; i < _candidateNames.length; i++) {
            string memory name = _candidateNames[i];

            require(bytes(name).length > 0, "Empty candidate name");
            require(!candidateExists[name], "Duplicate candidate");

            candidateExists[name] = true;

            candidates.push(Candidate({name: name, voteCount: 0}));
        }

        owner = msg.sender;

        // Voting can start after an optional setup window.
        votingStart = block.timestamp + (_setupWindowMinutes * 1 minutes);
        votingEnd = votingStart + (_durationInMinutes * 1 minutes);
    }

    // Restricts access to owner-only administrative actions.
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action.");
        _;
    }

    // Adds a new candidate before voting begins.
    function addCandidate(string memory _name) public onlyOwner {
        require(
            block.timestamp < votingStart,
            "Cannot add candidates after voting has started."
        );

        require(bytes(_name).length > 0, "Candidate name cannot be empty");
        require(!candidateExists[_name], "Candidate already exists");

        candidateExists[_name] = true;

        candidates.push(Candidate({name: _name, voteCount: 0}));

        emit CandidateAdded(_name);
    }

    // Casts one vote for a candidate by index.
    function vote(uint256 _candidateIndex) public {
        require(getVotingStatus(), "Voting is not currently active.");
        require(!voters[msg.sender], "You have already voted.");
        require(_candidateIndex < candidates.length, "Invalid candidate index");

        // Overflow is unrealistic here (uint256), so unchecked saves gas.
        unchecked {
            candidates[_candidateIndex].voteCount++;
        }
        voters[msg.sender] = true;
        voterToCandidate[msg.sender] = _candidateIndex;

        emit Voted(msg.sender, _candidateIndex);
    }

    function getAllVotesOfCandidates()
        public
        view
        returns (Candidate[] memory)
    {
        // Returns names and vote counts for each candidate.
        return candidates;
    }

    // Returns only candidate names, useful for lightweight UI population.
    function getAllCandidates() public view returns (string[] memory) {
        string[] memory candidateNames = new string[](candidates.length);
        for (uint256 i = 0; i < candidates.length; i++) {
            candidateNames[i] = candidates[i].name;
        }
        return candidateNames;
    }

    // True only while current time is inside the voting window.
    function getVotingStatus() public view returns (bool) {
        return (block.timestamp >= votingStart && block.timestamp < votingEnd);
    }

    // Remaining voting time in seconds; returns 0 after end.
    function getRemainingTime() public view returns (uint256) {
        require(block.timestamp >= votingStart, "Voting has not started yet");

        if (block.timestamp >= votingEnd) {
            return 0;
        }

        return votingEnd - block.timestamp;
    }

    // Returns the candidate name chosen by a specific voter address.
    function voterVotedFor(address _voter) public view returns (string memory) {
        require(voters[_voter], "This address has not casted a vote yet");

        uint256 candidateIndex = voterToCandidate[_voter];
        return candidates[candidateIndex].name;
    }
}
