import { useState, useEffect } from "react";
import { ethers } from "ethers";
import Articles from "./components/Articles";

// This will be updated after contract deployment
const CONTRACT_ADDRESS = "0x52d3778ffbB1024b44D55214b3385e1e0F7A1354"; 
const ABI = [
  "function voteYes() public",
  "function voteFYes() public",
  "function getVotes() public view returns (uint256, uint256)"
];

// Development mode flag
const isDev = import.meta.env.DEV;

// For development testing - simulating a backend API with localStorage
// In production, this would be replaced with a real backend API
const LOCAL_STORAGE_KEY = "imranKhanGlobalVotes";

// Mock API functions for local vote tracking
const mockAPI = {
  // Get global votes from localStorage
  getGlobalVotes: () => {
    const storedVotes = localStorage.getItem(LOCAL_STORAGE_KEY);
    return storedVotes ? JSON.parse(storedVotes) : { yes: 0, fYes: 0 };
  },
  
  // Update global votes in localStorage
  updateGlobalVotes: (choice) => {
    const currentVotes = mockAPI.getGlobalVotes();
    const newVotes = { ...currentVotes };
    
    if (choice === "yes") {
      newVotes.yes += 1;
    } else if (choice === "fYes") {
      newVotes.fYes += 1;
    }
    
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newVotes));
    return newVotes;
  },
  
  // Reset global votes in localStorage
  resetGlobalVotes: () => {
    const emptyVotes = { yes: 0, fYes: 0 };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(emptyVotes));
    return emptyVotes;
  }
};

function App() {
  const [yesVotes, setYesVotes] = useState(0);
  const [fYesVotes, setFYesVotes] = useState(0);
  const [loading, setLoading] = useState(false);
  const [account, setAccount] = useState("");
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [activeTab, setActiveTab] = useState("vote"); // "vote", "facts", "timeline", "articles"
  
  // New state for wallet-optional voting
  const [localVotes, setLocalVotes] = useState({ yes: 0, fYes: 0 });
  const [hasVoted, setHasVoted] = useState(false);
  const [showWalletPrompt, setShowWalletPrompt] = useState(null);
  const [userVoteChoice, setUserVoteChoice] = useState(null); // Track user's vote choice
  const [totalVotes, setTotalVotes] = useState({ yes: 0, fYes: 0 }); // Combined votes
  const [showDebugPanel, setShowDebugPanel] = useState(false); // Debug panel toggle

  useEffect(() => {
    // Load local votes from localStorage (global votes)
    const globalVotes = mockAPI.getGlobalVotes();
    setLocalVotes(globalVotes);
    
    // Check if user has already voted
    const votedStatus = localStorage.getItem("hasVoted");
    if (votedStatus) {
      setHasVoted(JSON.parse(votedStatus));
    }
    
    // Load user's vote choice
    const savedChoice = localStorage.getItem("userVoteChoice");
    if (savedChoice) {
      setUserVoteChoice(savedChoice);
    }
    
    const init = async () => {
      if (window.ethereum) {
        try {
          // Request account access
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          setAccount(accounts[0]);
          
          // Create provider, signer and contract instances
          const provider = new ethers.BrowserProvider(window.ethereum);
          setProvider(provider);
          
          const signer = await provider.getSigner();
          setSigner(signer);
          
          const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
          setContract(contract);
          
          // Fetch initial votes
          fetchVotes(contract);
          
          // Listen for account changes
          window.ethereum.on('accountsChanged', (accounts) => {
            setAccount(accounts[0]);
          });
        } catch (error) {
          console.error("Error connecting to MetaMask", error);
        }
      } else {
        console.log("No wallet detected. Local voting is available.");
      }
    };
    
    init();
    
    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners();
      }
    };
  }, []);

  useEffect(() => {
    setTotalVotes({
      yes: yesVotes + localVotes.yes,
      fYes: fYesVotes + localVotes.fYes
    });
  }, [yesVotes, fYesVotes, localVotes]);

  // Poll for global vote updates every 2 seconds in development mode
  useEffect(() => {
    if (!isDev) return;
    
    const pollInterval = setInterval(() => {
      const globalVotes = mockAPI.getGlobalVotes();
      setLocalVotes(globalVotes);
    }, 2000);
    
    return () => clearInterval(pollInterval);
  }, []);

  const fetchVotes = async (contractInstance) => {
    if (!contractInstance) return;
    
    try {
      const votes = await contractInstance.getVotes();
      setYesVotes(Number(votes[0]));
      setFYesVotes(Number(votes[1]));
    } catch (error) {
      console.error("Error fetching votes:", error);
    }
  };

  const castVote = async (choice) => {
    if (contract) {
      // If wallet is connected, cast blockchain vote
      setLoading(true);
      try {
        const tx = choice === "yes" 
          ? await contract.voteYes() 
          : await contract.voteFYes();
        
        await tx.wait();
        fetchVotes(contract);
        
        // Also mark as voted locally and save the choice
        setHasVoted(true);
        setUserVoteChoice(choice);
        localStorage.setItem("hasVoted", JSON.stringify(true));
        localStorage.setItem("userVoteChoice", choice);
      } catch (error) {
        console.error("Error casting vote:", error);
        alert("Error casting vote. Check console for details.");
      } finally {
        setLoading(false);
      }
    } else {
      // If no wallet is connected, show wallet prompt with the choice
      setShowWalletPrompt(choice);
    }
  };
  
  // New function for voting without wallet
  const voteWithoutWallet = (choice) => {
    // Update global vote count using our mock API
    const newVotes = mockAPI.updateGlobalVotes(choice);
    setLocalVotes(newVotes);
    
    // Mark as voted and save the choice
    setHasVoted(true);
    setUserVoteChoice(choice);
    localStorage.setItem("hasVoted", JSON.stringify(true));
    localStorage.setItem("userVoteChoice", choice);
    
    // Hide the wallet prompt
    setShowWalletPrompt(null);
  };
  
  // Reset local votes (for testing)
  const resetLocalVotes = () => {
    const emptyVotes = mockAPI.resetGlobalVotes();
    setLocalVotes(emptyVotes);
    setHasVoted(false);
    setUserVoteChoice(null);
    localStorage.removeItem("hasVoted");
    localStorage.removeItem("userVoteChoice");
  };

  // Toggle debug panel (dev mode only)
  const toggleDebugPanel = () => {
    setShowDebugPanel(!showDebugPanel);
  };

  // Function to handle wallet connection after local voting
  const connectWalletAfterVoting = async () => {
    if (!window.ethereum) {
      alert("No wallet detected. Please install MetaMask or another Ethereum wallet.");
      return;
    }
    
    try {
      // Connect wallet
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0]);
      
      // Create provider, signer and contract instances
      const provider = new ethers.BrowserProvider(window.ethereum);
      setProvider(provider);
      
      const signer = await provider.getSigner();
      setSigner(signer);
      
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
      setContract(contract);
      
      // Fetch blockchain votes
      fetchVotes(contract);
      
      // Notify user that their local vote will be migrated to blockchain when they cast a vote
      alert("Your wallet is now connected! Your local vote will be migrated to the blockchain when you cast a vote using your wallet.");
    } catch (error) {
      console.error("Error connecting wallet:", error);
      alert("Error connecting wallet. Please try again.");
    }
  };

  // Election facts
  const electionFacts = [
    {
      title: "Landslide Victory",
      description: "On February 8, 2024, Imran Khan's Pakistan Tehreek-e-Insaf (PTI) party won a landslide victory in the general elections, securing over 180 seats in the National Assembly despite facing unprecedented obstacles."
    },
    {
      title: "Imprisoned During Elections",
      description: "Imran Khan was imprisoned during the elections on politically motivated charges, yet his party still managed to win the majority of seats, demonstrating his overwhelming public support."
    },
    {
      title: "Form 47 Manipulation",
      description: "Despite PTI's clear victory, the Election Commission of Pakistan manipulated Form 47 results to deny PTI their rightful seats, leading to widespread protests across Pakistan."
    },
    {
      title: "International Recognition",
      description: "Multiple international election observers and human rights organizations acknowledged the electoral fraud and recognized Imran Khan's party as the true winner of the 2024 elections."
    }
  ];

  // Timeline events
  const timelineEvents = [
    {
      date: "April 2022",
      title: "Removed via No-Confidence Vote",
      description: "Imran Khan was removed from office through a controversial no-confidence vote widely believed to be orchestrated by the military establishment."
    },
    {
      date: "May 2023",
      title: "Arrested on False Charges",
      description: "Khan was arrested on multiple fabricated charges, leading to nationwide protests."
    },
    {
      date: "February 8, 2024",
      title: "Electoral Victory",
      description: "Despite being imprisoned, Khan's party won a decisive victory in the general elections."
    },
    {
      date: "February 9-13, 2024",
      title: "Election Rigging",
      description: "Results were delayed and manipulated to deny PTI their electoral victory."
    },
    {
      date: "March 2024",
      title: "Ongoing Struggle",
      description: "Khan remains imprisoned while the people of Pakistan continue to demand their rightful government."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/* Header */}
      <header className="bg-black/30 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600">
              Imran Khan Vote
            </h1>
            
            <nav className="hidden md:flex space-x-6">
              <button 
                onClick={() => setActiveTab("vote")}
                className={`transition-colors ${activeTab === "vote" ? "text-green-400" : "text-gray-300 hover:text-white"}`}
              >
                Vote
              </button>
              <button 
                onClick={() => setActiveTab("facts")}
                className={`transition-colors ${activeTab === "facts" ? "text-green-400" : "text-gray-300 hover:text-white"}`}
              >
                Election Facts
              </button>
              <button 
                onClick={() => setActiveTab("timeline")}
                className={`transition-colors ${activeTab === "timeline" ? "text-green-400" : "text-gray-300 hover:text-white"}`}
              >
                Timeline
              </button>
              <button 
                onClick={() => setActiveTab("articles")}
                className={`transition-colors ${activeTab === "articles" ? "text-green-400" : "text-gray-300 hover:text-white"}`}
              >
                Articles
              </button>
            </nav>
            
            <div className="flex items-center space-x-4">
              {account ? (
                <div className="flex items-center bg-gray-800 rounded-full px-4 py-1 text-sm border border-gray-700">
                  <div className="w-2 h-2 rounded-full bg-green-400 mr-2"></div>
                  <span>{account.substring(0, 6)}...{account.substring(account.length - 4)}</span>
                </div>
              ) : (
                <button 
                  onClick={() => window.ethereum && window.ethereum.request({ method: 'eth_requestAccounts' })}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm transition-colors"
                >
                  Connect Wallet
                </button>
              )}
            </div>
          </div>
          
          {/* Mobile Navigation */}
          <div className="md:hidden flex justify-center mt-4 border-t border-gray-800 pt-4">
            <div className="flex space-x-2">
              <button 
                onClick={() => setActiveTab("vote")}
                className={`px-3 py-1 rounded-md ${activeTab === "vote" ? "bg-green-900/30 text-green-400" : "text-gray-300"}`}
              >
                Vote
              </button>
              <button 
                onClick={() => setActiveTab("facts")}
                className={`px-3 py-1 rounded-md ${activeTab === "facts" ? "bg-green-900/30 text-green-400" : "text-gray-300"}`}
              >
                Facts
              </button>
              <button 
                onClick={() => setActiveTab("timeline")}
                className={`px-3 py-1 rounded-md ${activeTab === "timeline" ? "bg-green-900/30 text-green-400" : "text-gray-300"}`}
              >
                Timeline
              </button>
              <button 
                onClick={() => setActiveTab("articles")}
                className={`px-3 py-1 rounded-md ${activeTab === "articles" ? "bg-green-900/30 text-green-400" : "text-gray-300"}`}
              >
                Articles
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Vote Tab */}
        {activeTab === "vote" && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-black/20 backdrop-blur-md rounded-xl overflow-hidden shadow-2xl">
              <div className="md:flex">
                <div className="md:w-1/2">
                  <img 
                    src="/imrankhan.jpg" 
                    alt="Imran Khan" 
                    className="w-full h-full object-cover" 
                  />
                </div>
                
                <div className="p-6 md:w-1/2 flex flex-col justify-between">
                  <div>
                    <h2 className="text-3xl font-bold mb-2">Is Imran Khan the rightful Prime Minister of Pakistan?</h2>
                    <p className="text-gray-300 mb-6">
                      On February 8, 2024, Imran Khan's party won a landslide victory in Pakistan's general elections,
                      but the results were manipulated to deny him his rightful position.
                    </p>
                    
                    {account ? (
                      <div className="bg-green-900/20 border-l-4 border-green-500 p-4 mb-6 rounded">
                        <h3 className="font-bold text-lg text-green-400 mb-2">Benefits of Voting</h3>
                        <ul className="list-disc pl-5 text-gray-200">
                          <li className="mb-1">Commemorative NFT Badge: Each voter receives a unique digital collectible proving their support</li>
                          <li className="mb-1">Priority Access: Early access to future Imran Khan digital initiatives</li>
                          <li className="mb-1">Community Membership: Join an exclusive community of supporters</li>
                          <li>Historical Record: Your vote is permanently recorded on the Ethereum blockchain</li>
                        </ul>
                      </div>
                    ) : (
                      <div className="bg-yellow-900/20 border-l-4 border-yellow-500 p-4 mb-6 rounded">
                        <h3 className="font-bold text-lg text-yellow-400 mb-2">Vote Without a Wallet</h3>
                        <p className="text-gray-200 mb-2">
                          You can vote without connecting a wallet, but your vote will only be stored locally and not on the blockchain.
                        </p>
                        <p className="text-gray-200">
                          <span className="text-yellow-400 font-semibold">Connect a wallet</span> to receive an NFT badge and other benefits.
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    {hasVoted ? (
                      <div className="bg-green-900/30 p-4 rounded-lg text-center">
                        <h3 className="text-xl font-bold text-green-400 mb-2">Thank You for Voting!</h3>
                        <p className="text-gray-300">Your vote has been recorded.</p>
                        
                        {/* Show vote counter */}
                        <div className="mt-4 grid grid-cols-2 gap-4">
                          <div className={`bg-black/30 p-3 rounded-lg ${userVoteChoice === "yes" ? "ring-2 ring-green-400" : ""}`}>
                            <div className="text-2xl font-bold text-green-400">{totalVotes.yes}</div>
                            <div className="text-sm text-gray-400">Yes, I Agree</div>
                            {userVoteChoice === "yes" && <div className="text-xs text-green-400 mt-1">Your choice</div>}
                          </div>
                          <div className={`bg-black/30 p-3 rounded-lg ${userVoteChoice === "fYes" ? "ring-2 ring-green-400" : ""}`}>
                            <div className="text-2xl font-bold text-green-400">{totalVotes.fYes}</div>
                            <div className="text-sm text-gray-400">ABSOLUTELY YES!</div>
                            {userVoteChoice === "fYes" && <div className="text-xs text-green-400 mt-1">Your choice</div>}
                          </div>
                        </div>
                        
                        {!account && (
                          <div className="mt-4">
                            <p className="text-sm text-gray-400 mb-2">Connect a wallet to receive NFT benefits:</p>
                            <button 
                              onClick={connectWalletAfterVoting}
                              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm transition-colors"
                            >
                              Connect Wallet
                            </button>
                          </div>
                        )}
                        {/* For testing - allow reset of local votes */}
                        <button 
                          onClick={resetLocalVotes}
                          className="mt-4 text-xs text-gray-500 hover:text-gray-400"
                        >
                          Reset Vote (Testing Only)
                        </button>
                      </div>
                    ) : (
                      <>
                        <button 
                          className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-lg hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center"
                          onClick={() => castVote("yes")}
                          disabled={loading}
                        >
                          {loading ? (
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          ) : (
                            <span className="flex items-center">
                              <span className="mr-2">✅</span> Yes, I Agree ({totalVotes.yes})
                            </span>
                          )}
                        </button>

                        <button 
                          className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-green-800 text-white font-bold rounded-lg hover:from-green-700 hover:to-green-900 transition-all transform hover:scale-[1.03] hover:shadow-lg disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center"
                          onClick={() => castVote("fYes")}
                          disabled={loading}
                        >
                          {loading ? (
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          ) : (
                            <span className="flex items-center text-lg">
                              <span className="mr-2">🔥</span> ABSOLUTELY YES! ({totalVotes.fYes})
                              <span className="ml-2 text-yellow-300">✨</span>
                            </span>
                          )}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Wallet Connection Prompt Modal */}
            {showWalletPrompt && (
              <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
                  <h3 className="text-xl font-bold mb-4">Connect Wallet or Vote Locally?</h3>
                  <p className="text-gray-300 mb-2">
                    You selected: <span className="font-bold text-green-400">
                      {showWalletPrompt === "yes" ? "Yes, I Agree" : "ABSOLUTELY YES!"}
                    </span>
                  </p>
                  <p className="text-gray-300 mb-6">
                    You can connect a wallet to record your vote on the blockchain and receive an NFT badge,
                    or you can vote without a wallet but your vote will only be stored locally.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                      onClick={() => {
                        connectWalletAfterVoting();
                        setShowWalletPrompt(null);
                      }}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-md transition-colors"
                    >
                      Connect Wallet
                    </button>
                    <button
                      onClick={() => voteWithoutWallet(showWalletPrompt)}
                      className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-3 rounded-md transition-colors"
                    >
                      Vote Without Wallet
                    </button>
                  </div>
                  <button
                    onClick={() => setShowWalletPrompt(null)}
                    className="mt-4 text-gray-400 hover:text-white text-sm w-full"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
            
            <div className="mt-8 text-center">
              <div className="mt-6 pt-4 border-t border-gray-800">
                <h3 className="font-medium text-sm text-gray-300 mb-2">How Your Vote Makes a Difference:</h3>
                <p className="text-sm text-gray-400 mb-2">
                  Your vote is more than just a number. It's a permanent declaration of support recorded on the Ethereum blockchain.
                  The NFT badge you'll receive serves as both a collectible and proof of your early support.
                </p>
                <p className="text-sm text-gray-400 mb-4">
                  <strong>Note:</strong> NFT badges will be airdropped to voter wallets within 14 days after voting.
                  By voting, you're also granted membership in our exclusive community with access to future initiatives.
                </p>
                <div className="bg-black/30 rounded-lg p-4 max-w-lg mx-auto">
                  <h4 className="text-green-400 font-semibold mb-2">What's the difference?</h4>
                  <div className="grid grid-cols-2 gap-4 text-left">
                    <div>
                      <p className="font-medium text-white mb-1">✅ Yes, I Agree:</p>
                      <p className="text-gray-300 text-sm">I support Imran Khan as the rightful Prime Minister of Pakistan based on the election results.</p>
                    </div>
                    <div>
                      <p className="font-medium text-white mb-1">🔥 ABSOLUTELY YES!:</p>
                      <p className="text-gray-300 text-sm">I passionately and unequivocally believe Imran Khan is the ONLY legitimate leader of Pakistan! No question about it!</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Facts Tab */}
        {activeTab === "facts" && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Election Facts: February 8, 2024</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {electionFacts.map((fact, index) => (
                <div key={index} className="bg-black/20 backdrop-blur-md rounded-xl p-6 shadow-xl border border-gray-800 hover:border-green-500/30 transition-colors">
                  <h3 className="text-xl font-bold mb-3 text-green-400">{fact.title}</h3>
                  <p className="text-gray-300">{fact.description}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-12 bg-black/20 backdrop-blur-md rounded-xl p-6 shadow-xl border border-gray-800">
              <h3 className="text-xl font-bold mb-4 text-center">The Numbers Don't Lie</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="bg-black/30 p-4 rounded-lg">
                  <div className="text-3xl font-bold text-green-400">180+</div>
                  <div className="text-sm text-gray-400">Seats Won by PTI</div>
                </div>
                <div className="bg-black/30 p-4 rounded-lg">
                  <div className="text-3xl font-bold text-green-400">70%</div>
                  <div className="text-sm text-gray-400">Popular Vote</div>
                </div>
                <div className="bg-black/30 p-4 rounded-lg">
                  <div className="text-3xl font-bold text-green-400">15M+</div>
                  <div className="text-sm text-gray-400">Vote Margin</div>
                </div>
                <div className="bg-black/30 p-4 rounded-lg">
                  <div className="text-3xl font-bold text-green-400">342</div>
                  <div className="text-sm text-gray-400">Total Assembly Seats</div>
                </div>
              </div>
              
              <p className="mt-6 text-gray-400 text-center">
                Despite these overwhelming numbers, the Election Commission of Pakistan manipulated the results to deny Imran Khan's party their rightful victory.
              </p>
            </div>
          </div>
        )}
        
        {/* Timeline Tab */}
        {activeTab === "timeline" && (
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Imran Khan's Journey</h2>
            
            <div className="relative border-l-2 border-green-500/50 pl-8 ml-4 space-y-10">
              {timelineEvents.map((event, index) => (
                <div key={index} className="relative">
                  <div className="absolute -left-12 mt-1.5 w-6 h-6 rounded-full border-2 border-green-500 bg-gray-900 flex items-center justify-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                  
                  <div className="bg-black/20 backdrop-blur-md rounded-xl p-5 shadow-xl border border-gray-800">
                    <span className="text-xs font-semibold inline-block py-1 px-2 rounded-full bg-green-900/50 text-green-400 mb-2">
                      {event.date}
                    </span>
                    <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                    <p className="text-gray-300">{event.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Articles Tab */}
        {activeTab === "articles" && <Articles />}
      </main>
      
      <footer className="bg-black/40 py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm text-gray-400">
                This dApp runs on Ethereum mainnet. Make sure your wallet is connected to the Ethereum network.
              </p>
            </div>
            
            <div className="flex space-x-4">
              <a href="https://twitter.com/ImranKhanPTI" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                Twitter
              </a>
              <a href="https://www.instagram.com/imrankhan.pti" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                Instagram
              </a>
              <a href="https://www.facebook.com/ImranKhanOfficial" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                Facebook
              </a>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-800 text-center">
            <p className="text-xs text-gray-500">
              &copy; {new Date().getFullYear()} Imran Khan Vote. All rights reserved. This site is not affiliated with any political party.
            </p>
            
            {/* Development Mode Debug Button */}
            {isDev && (
              <button 
                onClick={toggleDebugPanel} 
                className="mt-4 text-xs bg-gray-800 text-gray-400 px-3 py-1 rounded hover:bg-gray-700"
              >
                {showDebugPanel ? "Hide Debug Info" : "Show Debug Info"}
              </button>
            )}
          </div>
        </div>
      </footer>
      
      {/* Development Mode Debug Panel */}
      {isDev && showDebugPanel && (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-700 p-4 text-xs font-mono text-gray-300 z-50">
          <h3 className="font-bold mb-2 text-green-400">Development Mode Debug Panel</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-bold mb-1 text-yellow-400">Blockchain Votes:</h4>
              <p>Yes Votes: {yesVotes}</p>
              <p>Absolutely Yes Votes: {fYesVotes}</p>
            </div>
            <div>
              <h4 className="font-bold mb-1 text-yellow-400">Local Votes (Shared):</h4>
              <p>Yes Votes: {localVotes.yes}</p>
              <p>Absolutely Yes Votes: {localVotes.fYes}</p>
            </div>
          </div>
          <div className="mt-2">
            <h4 className="font-bold mb-1 text-yellow-400">User State:</h4>
            <p>Has Voted: {hasVoted ? "Yes" : "No"}</p>
            <p>Vote Choice: {userVoteChoice || "None"}</p>
            <p>Wallet Connected: {account ? "Yes" : "No"}</p>
            {account && <p>Account: {account}</p>}
          </div>
          <div className="mt-2 flex space-x-2">
            <button 
              onClick={resetLocalVotes}
              className="bg-red-900 hover:bg-red-800 text-white px-2 py-1 rounded text-xs"
            >
              Reset Local Votes
            </button>
            <button 
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
              className="bg-red-900 hover:bg-red-800 text-white px-2 py-1 rounded text-xs"
            >
              Clear All Storage & Reload
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
