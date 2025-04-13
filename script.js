function formatMessage(text) {
    // Replace markdown-like syntax with HTML
    let formattedText = text
        // Bold text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        // Italic text
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        // Lists with proper indentation
        .replace(/^\s*[-*]\s+(.*)$/gm, '<li>$1</li>')
        // Nested lists (indented with 2+ spaces)
        .replace(/^\s{2,}[-*]\s+(.*)$/gm, '<li class="nested">$1</li>')
        // Headers
        .replace(/^#\s+(.*)$/gm, '<h3>$1</h3>')
        // Links
        .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank">$1</a>')
        // Line breaks
        .replace(/\n/g, '<br>');

    // Wrap list items in ul tags if they exist
    if (formattedText.includes('<li>')) {
        formattedText = '<ul>' + formattedText + '</ul>';
    }

    return formattedText;
}

async function submitQuery() {
    const query = document.getElementById("query").value.trim();
    if (!query) return;

    const chatMessages = document.getElementById("chat-messages");
    
    // Add user message
    const userMessage = document.createElement("div");
    userMessage.className = "message user-message";
    userMessage.textContent = query;
    chatMessages.appendChild(userMessage);
    
    // Clear input
    document.getElementById("query").value = "";
    
    // Add typing indicator
    const typingIndicator = document.createElement("div");
    typingIndicator.className = "typing-indicator";
    typingIndicator.innerHTML = `
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
    `;
    chatMessages.appendChild(typingIndicator);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;

    try {
        const res = await fetch("https://ai-ttorney-v3.onrender.com/legalchat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ query })
        });

        const data = await res.json();
        
        // Remove typing indicator
        typingIndicator.remove();
        
        // Add bot response
        const botMessage = document.createElement("div");
        botMessage.className = "message bot-message";
        const responseText = data.answer || data.error || "Unexpected response.";
        botMessage.innerHTML = formatMessage(responseText);
        chatMessages.appendChild(botMessage);
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    } catch (error) {
        // Remove typing indicator
        typingIndicator.remove();
        
        // Add error message
        const errorMessage = document.createElement("div");
        errorMessage.className = "message bot-message";
        errorMessage.textContent = "Request failed: " + error.message;
        chatMessages.appendChild(errorMessage);
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

// Add auto-resize for textarea
document.getElementById("query").addEventListener("input", function() {
    this.style.height = "auto";
    this.style.height = (this.scrollHeight) + "px";
});

// Add enter key support
document.getElementById("query").addEventListener("keydown", function(e) {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        submitQuery();
    }
});