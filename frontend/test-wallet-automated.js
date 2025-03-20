/**
 * Automated Wallet Connection Test Script
 * 
 * This script provides automated tests for the wallet connection functionality
 * that can be run in the browser console.
 * 
 * Usage:
 * 1. Open the application in a browser
 * 2. Open the browser console (F12 or right-click > Inspect > Console)
 * 3. Copy and paste this entire script into the console
 * 4. Press Enter to run the tests
 */

(async function() {
  console.log("%c=== AUTOMATED WALLET CONNECTION TESTS ===", "color: #4CAF50; font-weight: bold; font-size: 16px;");
  
  // Test environment information
  console.log("%cTest Environment:", "color: #2196F3; font-weight: bold;");
  console.log("Browser:", navigator.userAgent);
  console.log("Window Size:", `${window.innerWidth}x${window.innerHeight}`);
  console.log("Mobile Device:", /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
  console.log("Date/Time:", new Date().toISOString());
  
  // Helper function to check if a function exists
  const functionExists = (funcName) => {
    try {
      return typeof eval(funcName) === 'function';
    } catch (e) {
      return false;
    }
  };
  
  // Test 1: Check if required functions exist
  console.log("%cTest 1: Required Functions", "color: #2196F3; font-weight: bold;");
  const requiredFunctions = [
    'isMetaMaskInstalled',
    'getMetaMaskProvider',
    'connectWalletAfterVoting',
    'testWalletConnection'
  ];
  
  let allFunctionsExist = true;
  requiredFunctions.forEach(func => {
    const exists = functionExists(func);
    console.log(`${func}: ${exists ? '✅ Exists' : '❌ Missing'}`);
    if (!exists) allFunctionsExist = false;
  });
  
  if (!allFunctionsExist) {
    console.error("Some required functions are missing. Tests cannot continue.");
    return;
  }
  
  // Test 2: MetaMask Detection
  console.log("%cTest 2: MetaMask Detection", "color: #2196F3; font-weight: bold;");
  const metaMaskInstalled = isMetaMaskInstalled();
  console.log(`MetaMask Detected: ${metaMaskInstalled ? '✅ Yes' : '❌ No'}`);
  console.log(`Ethereum Object: ${window.ethereum ? '✅ Available' : '❌ Not Available'}`);
  
  if (window.ethereum) {
    console.log("Ethereum Properties:");
    console.log("- isMetaMask:", window.ethereum.isMetaMask);
    console.log("- Has Providers Array:", !!window.ethereum.providers);
    if (window.ethereum.providers) {
      console.log("- Providers Length:", window.ethereum.providers.length);
      window.ethereum.providers.forEach((provider, index) => {
        console.log(`  Provider ${index}:`, provider.isMetaMask ? "MetaMask" : "Other");
      });
    }
  }
  
  // Test 3: Provider Retrieval
  console.log("%cTest 3: Provider Retrieval", "color: #2196F3; font-weight: bold;");
  const provider = getMetaMaskProvider();
  console.log(`Provider: ${provider ? '✅ Retrieved' : '❌ Not Retrieved'}`);
  if (provider) {
    console.log("Provider Properties:");
    console.log("- isMetaMask:", provider.isMetaMask);
    console.log("- Selected Address:", provider.selectedAddress);
  }
  
  // Test 4: Local Storage
  console.log("%cTest 4: Local Storage", "color: #2196F3; font-weight: bold;");
  const localStorageItems = {
    'userVoteChoice': localStorage.getItem('userVoteChoice'),
    'hasVoted': localStorage.getItem('hasVoted'),
    'localVotes': localStorage.getItem('localVotes'),
    'globalVotes': localStorage.getItem('globalVotes')
  };
  
  console.log("Local Storage Items:");
  Object.entries(localStorageItems).forEach(([key, value]) => {
    console.log(`- ${key}: ${value ? `✅ ${value}` : '❌ Not Set'}`);
  });
  
  // Test 5: UI Elements
  console.log("%cTest 5: UI Elements", "color: #2196F3; font-weight: bold;");
  const uiElements = {
    'Vote Buttons': !!document.querySelector('button[onClick*="castVote"]'),
    'Debug Panel Button': !!document.querySelector('button[onClick*="toggleDebugPanel"]'),
    'Wallet Connection Button': !!document.querySelector('button[onClick*="connectWallet"]'),
    'Footer': !!document.querySelector('footer')
  };
  
  console.log("UI Elements:");
  Object.entries(uiElements).forEach(([key, exists]) => {
    console.log(`- ${key}: ${exists ? '✅ Present' : '❌ Missing'}`);
  });
  
  // Test 6: Automated Wallet Connection Test (if MetaMask is available)
  if (metaMaskInstalled && provider) {
    console.log("%cTest 6: Automated Wallet Connection", "color: #2196F3; font-weight: bold;");
    console.log("Attempting automated wallet connection test...");
    console.log("Note: This will trigger a MetaMask popup. Please approve the connection request.");
    
    try {
      // We'll use the testWalletConnection function if it exists
      if (functionExists('testWalletConnection')) {
        console.log("Using testWalletConnection function...");
        await testWalletConnection();
      } else {
        console.log("Using direct connection approach...");
        const accounts = await provider.request({ method: 'eth_requestAccounts' });
        console.log("Connected to accounts:", accounts);
      }
      console.log("✅ Wallet connection test completed successfully");
    } catch (error) {
      console.error("❌ Wallet connection test failed:", error);
    }
  } else {
    console.log("%cTest 6: Automated Wallet Connection", "color: #2196F3; font-weight: bold;");
    console.log("❌ Skipped - MetaMask not detected or provider not available");
  }
  
  // Summary
  console.log("%cTest Summary", "color: #4CAF50; font-weight: bold;");
  console.log(`MetaMask Detection: ${metaMaskInstalled ? '✅ Working' : '❌ Not Working'}`);
  console.log(`Provider Retrieval: ${provider ? '✅ Working' : '❌ Not Working'}`);
  console.log(`UI Elements: ${Object.values(uiElements).every(Boolean) ? '✅ All Present' : '❌ Some Missing'}`);
  console.log(`Local Storage: ${Object.values(localStorageItems).some(Boolean) ? '✅ Working' : '❌ Empty'}`);
  
  console.log("%c=== END OF AUTOMATED TESTS ===", "color: #4CAF50; font-weight: bold; font-size: 16px;");
})();
