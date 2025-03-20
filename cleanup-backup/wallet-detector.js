// Check if MetaMask is installed
function checkMetaMask() {
    if (typeof window.ethereum !== 'undefined') {
        console.log('MetaMask is installed!');
        return true;
    }
    console.log('MetaMask is not installed.');
    return false;
}

// Redirect to no-wallet version if MetaMask is not installed
function redirectIfNoWallet() {
    if (!checkMetaMask()) {
        window.location.href = '/no-wallet.html';
    }
}

// Run check when page loads
window.addEventListener('DOMContentLoaded', redirectIfNoWallet);
