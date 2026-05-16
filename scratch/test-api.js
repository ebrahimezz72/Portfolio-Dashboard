const fs = require('fs');

const testChat = async () => {
  try {
    const res = await fetch("http://localhost:3000/api/ai/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "hi",
        history: [],
        currentPath: "/",
        language: "en"
      })
    });
    const data = await res.json();
    fs.writeFileSync('scratch/result.json', JSON.stringify({
      status: res.status,
      data
    }, null, 2));
  } catch (e) {
    fs.writeFileSync('scratch/result.json', JSON.stringify({
      error: e.message,
      stack: e.stack
    }, null, 2));
  }
};

testChat();
