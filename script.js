async function submitQuery() {
    const query = document.getElementById("query").value;
    const responseBox = document.getElementById("response");
  
    responseBox.textContent = "Loading...";
  
    try {
      const res = await fetch("https://ai-ttorney-v3.onrender.com/legalchat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ query })
      });
  
      const data = await res.json();
  
      if (data.answer) {
        responseBox.textContent = data.answer;
      } else if (data.error) {
        responseBox.textContent = "Error: " + data.error;
      } else {
        responseBox.textContent = "Unexpected response.";
      }
    } catch (error) {
      responseBox.textContent = "Request failed: " + error.message;
    }
  }