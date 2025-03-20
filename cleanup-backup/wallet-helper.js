// Create a helper element
function createWalletHelper() {
    // Create iframe to load the helper
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.bottom = '0';
    iframe.style.right = '0';
    iframe.style.width = '320px';
    iframe.style.height = '150px';
    iframe.style.border = 'none';
    iframe.style.zIndex = '9999';
    iframe.style.overflow = 'hidden';
    iframe.src = '/wallet-helper.html';
    
    // Add to body
    document.body.appendChild(iframe);
}

// Wait for page to load
window.addEventListener('load', function() {
    // Check if MetaMask is installed
    setTimeout(function() {
        if (typeof window.ethereum === 'undefined') {
            createWalletHelper();
        }
    }, 3000); // Wait 3 seconds before showing
});
