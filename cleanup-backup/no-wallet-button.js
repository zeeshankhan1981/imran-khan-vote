// Add a "No Wallet View" button next to the "Connect Wallet" button
function addNoWalletButton() {
  // Wait for DOM to be fully loaded
  const checkExist = setInterval(function() {
    // Look for the Connect Wallet button - try multiple selectors to find it
    let connectWalletButton = document.querySelector('button:not([id]):not([class*="tab"]):not([class*="vote"])');
    
    // If not found with the first selector, try another approach
    if (!connectWalletButton) {
      // Try to find by text content containing "Connect"
      const buttons = document.querySelectorAll('button');
      for (const btn of buttons) {
        if (btn.textContent && btn.textContent.includes('Connect')) {
          connectWalletButton = btn;
          break;
        }
      }
    }
    
    if (connectWalletButton && !document.getElementById('no-wallet-button')) {
      console.log("Found connect wallet button, adding no-wallet button");
      
      // Create the No Wallet View button
      const noWalletButton = document.createElement('a');
      noWalletButton.id = 'no-wallet-button';
      noWalletButton.href = '/no-wallet.html';
      noWalletButton.textContent = 'No Wallet View';
      
      // Copy styles from the Connect Wallet button
      noWalletButton.style.backgroundColor = '#4b5563'; // Gray color
      noWalletButton.style.color = 'white';
      noWalletButton.style.padding = '8px 16px';
      noWalletButton.style.borderRadius = '6px';
      noWalletButton.style.marginLeft = '10px';
      noWalletButton.style.textDecoration = 'none';
      noWalletButton.style.fontSize = '14px';
      noWalletButton.style.fontWeight = 'bold';
      noWalletButton.style.display = 'inline-flex';
      noWalletButton.style.alignItems = 'center';
      noWalletButton.style.justifyContent = 'center';
      noWalletButton.style.cursor = 'pointer';
      noWalletButton.style.transition = 'background-color 0.2s';
      
      // Add hover effect
      noWalletButton.onmouseover = function() {
        this.style.backgroundColor = '#374151';
      };
      noWalletButton.onmouseout = function() {
        this.style.backgroundColor = '#4b5563';
      };
      
      // Insert the button after the Connect Wallet button
      connectWalletButton.parentNode.appendChild(noWalletButton);
      
      // Clear the interval once we've added the button
      clearInterval(checkExist);
    }
  }, 500); // Check every 500ms
  
  // Stop checking after 10 seconds to prevent infinite loop
  setTimeout(() => clearInterval(checkExist), 10000);
}

// Run when the page loads
window.addEventListener('load', function() {
  // Wait a bit for React to render components
  setTimeout(addNoWalletButton, 1000);
});

// Also run when the DOM content is loaded (backup)
document.addEventListener('DOMContentLoaded', function() {
  // Wait a bit for React to render components
  setTimeout(addNoWalletButton, 1000);
});
