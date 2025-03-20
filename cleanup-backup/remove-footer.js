// Function to remove footer elements
document.addEventListener('DOMContentLoaded', function() {
    // Remove elements containing the text "Unstoppable Domain"
    removeElementsWithText("Unstoppable Domain");
    
    // Remove footer if it exists
    const footers = document.querySelectorAll('footer, [class*="footer"], [id*="footer"]');
    footers.forEach(footer => {
        footer.style.display = 'none';
    });
    
    // Set up a mutation observer to handle dynamically loaded content
    const observer = new MutationObserver(function(mutations) {
        removeElementsWithText("Unstoppable Domain");
        removeElementsWithText("Access via our Unstoppable Domain");
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
});

// Helper function to remove elements containing specific text
function removeElementsWithText(text) {
    const elements = document.querySelectorAll('*');
    
    elements.forEach(element => {
        if (element.innerText && element.innerText.includes(text)) {
            element.style.display = 'none';
        }
    });
    
    // Also check for links
    const links = document.querySelectorAll('a');
    links.forEach(link => {
        if (link.href && link.href.toLowerCase().includes('unstoppable')) {
            link.style.display = 'none';
        }
    });
}
