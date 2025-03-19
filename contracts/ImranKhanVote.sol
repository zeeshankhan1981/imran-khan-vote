// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ImranKhanVote {
    uint256 public yesVotes;
    uint256 public fYesVotes;

    event Voted(address indexed voter, string choice);

    function voteYes() public {
        yesVotes++;
        emit Voted(msg.sender, "Yes");
    }

    function voteFYes() public {
        fYesVotes++;
        emit Voted(msg.sender, "Fuck Yes");
    }

    function getVotes() public view returns (uint256, uint256) {
        return (yesVotes, fYesVotes);
    }
}
