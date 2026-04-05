// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VotingContract {
    struct Candidate {
        string name;
        uint256 voteCount;
    }

    Candidate[] public candidates;
    address public owner;
    mapping(address => bool) public voters;
    mapping(address => uint256) public voterToCandidate;
    mapping(string => bool) private candidateExists;

    uint256 public votingStart;
    uint256 public votingEnd;

    event Voted(address indexed voter, uint256 indexed candidateIndex);
    event CandidateAdded(string name);

    constructor(
        string[] memory _candidateNames,
        uint256 _setupWindowMinutes,
        uint256 _durationInMinutes
    ) {
        require(_candidateNames.length > 0, "At least one candidate required");
        require(_durationInMinutes > 0, "Duration must be greater than 0");

        for (uint256 i = 0; i < _candidateNames.length; i++) {
            string memory name = _candidateNames[i];

            require(bytes(name).length > 0, "Empty candidate name");
            require(!candidateExists[name], "Duplicate candidate");

            candidateExists[name] = true;

            candidates.push(Candidate({name: name, voteCount: 0}));
        }

        owner = msg.sender;

        votingStart = block.timestamp + (_setupWindowMinutes * 1 minutes);
        votingEnd = votingStart + (_durationInMinutes * 1 minutes);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action.");
        _;
    }

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

    function vote(uint256 _candidateIndex) public {
        require(getVotingStatus(), "Voting is not currently active.");
        require(!voters[msg.sender], "You have already voted.");
        require(_candidateIndex < candidates.length, "Invalid candidate index");

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
        return candidates;
    }

    function getAllCandidates() public view returns (string[] memory) {
        string[] memory candidateNames = new string[](candidates.length);
        for (uint256 i = 0; i < candidates.length; i++) {
            candidateNames[i] = candidates[i].name;
        }
        return candidateNames;
    }

    function getVotingStatus() public view returns (bool) {
        return (block.timestamp >= votingStart && block.timestamp < votingEnd);
    }

    function getRemainingTime() public view returns (uint256) {
        require(block.timestamp >= votingStart, "Voting has not started yet");

        if (block.timestamp >= votingEnd) {
            return 0;
        }

        return votingEnd - block.timestamp;
    }

    function voterVotedFor(address _voter) public view returns (string memory) {
        require(voters[_voter], "This address has not casted a vote yet");

        uint256 candidateIndex = voterToCandidate[_voter];
        return candidates[candidateIndex].name;
    }
}
