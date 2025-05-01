// main.js 
 
const video = document.getElementById("video"); 
const chatBox = document.getElementById("chatBox"); 
 


/*let config = { screenCapture: { captureInterval: 100000 } };

async function loadConfig() {
  try {
    const response = await fetch('/config.yaml');
    const yamlText = await response.text();
    config = jsyaml.load(yamlText);
    console.log("Configuration loaded:", config);
  } catch (err) {
    console.error("Error loading configuration, using defaults:", err);
  }
}
 */
let captureInterval=10000





const welcomeMsg = document.createElement("div"); 
welcomeMsg.innerText = "🤖 Hello! Share your screen and I'll chat with you about what you're viewing."; 
chatBox.appendChild(welcomeMsg); 
 
document.getElementById("startBtn").onclick = async () => { 
  try { 
    
     //  STEP 1: Ask user for confirmation BEFORE browser's share popup 
     const confirmed = confirm("⚠️ Now your screen will be shared. Do you want to continue?"); 
     if (!confirmed) return; 
  
     // (Optional) Debug log 
     console.log("👉 Button clicked:", new Date()); 
 
  
    //once called all the activities inside could not be controlled!! 
    const stream = await navigator.mediaDevices.getDisplayMedia({ video: true }); 
 
 
 
    video.srcObject = stream; 
    const track = stream.getVideoTracks()[0]; 
    const capture = new ImageCapture(track); 
 
    const startMsg = document.createElement("div"); 
    startMsg.innerText = "🤖 Screen sharing started! I'll analyze your screen immediately and then every "+ captureInterval/100+" seconds."; 
    chatBox.appendChild(startMsg); 

    // Function to capture and process screenshot
    const captureAndProcessScreen = async () => {
      try { 
        const frame = await capture.grabFrame(); 
        const canvas = document.createElement("canvas"); 
        canvas.width = frame.width; 
        canvas.height = frame.height; 
        const ctx = canvas.getContext("2d"); 
        ctx.drawImage(frame, 0, 0); 
        const base64 = canvas.toDataURL("image/png"); 
 
        const loadingMsg = document.createElement("div"); 
       
        loadingMsg.innerText = "🤖 Analyzing your screen..."; 
        chatBox.appendChild(loadingMsg); 
 
        const apiUrl = window.location.origin + "/chat"; 
        console.log("Sending request to:", apiUrl); 
 
        const res = await fetch(apiUrl, { 
          method: "POST", 
          headers: { "Content-Type": "application/json" }, 
          body: JSON.stringify({ image: base64 }) 
        }); 
 
        const data = await res.json(); 
        chatBox.removeChild(loadingMsg); 
 
        const msg = document.createElement("div"); 
        msg.innerText = "🤖 " + data.response; 
        chatBox.appendChild(msg); 
        chatBox.scrollTop = chatBox.scrollHeight; 
 
      } catch (err) { 
        console.error("Error in screenshot processing:", err); 
        const errorMsg = document.createElement("div"); 
        errorMsg.innerText = "🤖 Sorry, I encountered an error: " + err.message; 
        chatBox.appendChild(errorMsg); 
      } 
    };

    // Capture screenshot immediately and await to finalize the task
    // then set the interval each 100 seconds
    await captureAndProcessScreen();
    
    // Then set up interval for subsequent captures every 10 seconds
    setInterval(captureAndProcessScreen, captureInterval); 
  } catch (err) { 
    console.error("Error starting screen share:", err); 
    const errorMsg = document.createElement("div"); 
    errorMsg.innerText = "🤖 Could not start screen sharing: " + err.message; 
    chatBox.appendChild(errorMsg); 
  } 
};