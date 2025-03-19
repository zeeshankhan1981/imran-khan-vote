const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ImranKhanVote", function () {
  let imranKhanVote;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    
    const ImranKhanVote = await ethers.getContractFactory("ImranKhanVote");
    imranKhanVote = await ImranKhanVote.deploy();
    await imranKhanVote.waitForDeployment();
  });

  describe("Voting", function () {
    it("Should allow users to vote 'Yes'", async function () {
      await imranKhanVote.connect(addr1).voteYes();
      
      const votes = await imranKhanVote.getVotes();
      expect(votes[0]).to.equal(1);
      expect(votes[1]).to.equal(0);
    });

    it("Should allow users to vote 'F*** Yes'", async function () {
      await imranKhanVote.connect(addr1).voteFYes();
      
      const votes = await imranKhanVote.getVotes();
      expect(votes[0]).to.equal(0);
      expect(votes[1]).to.equal(1);
    });

    it("Should count multiple votes correctly", async function () {
      await imranKhanVote.connect(addr1).voteYes();
      await imranKhanVote.connect(addr2).voteFYes();
      await imranKhanVote.connect(owner).voteYes();
      
      const votes = await imranKhanVote.getVotes();
      expect(votes[0]).to.equal(2);
      expect(votes[1]).to.equal(1);
    });
  });
});
