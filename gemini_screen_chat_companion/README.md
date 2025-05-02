# Gemini Screen Chat Companion

A lightweight prototype for building AI-powered screen analysis and chat interfaces using Google Gemini, Flask, and browser-based screen sharing.

---

## 🚀 Features

- 📺 **Live Screen Sharing** via browser
- 🖼️ **Screenshot Capture** every X seconds
- 🤖 **Gemini Vision Integration** using uploaded screen frames
- 💬 **Follow-up Chat** with context-based conversation
- 📦 **Modular Flask Project Structure**
- 🌍 **CORS-Enabled API** ready for web clients
- 🔐 **Secure API Key Loading** via `.env`

## Technical Notes:
-🧪 When your Gemini API quota is exceeded or you're developing offline, you can simulate a Gemini response using a lightweight mock class:TestingResponse to test flow with llm output

📌 Ideas or Future Enhancements
For teachers: use screen sharing to automatically capture screenshots of students during exams. These screenshots can then be analyzed by a model (based on RAG) to detect issues 


## 🏗️ Project Structure


gemini_screen_chat_companion/
│
├── app/
│   ├── config/
│   │   └── config.yaml            
│   ├── static/
│   │   ├── main.js                 
│   │   └── style.css              
│   ├── templates/
│   │   └── index.html              
│   └── server.py                  
│
├── .env                            
├── requirements.txt               
└── README.md           


## How it works

1. Frontend uses getDisplayMedia() to capture screen.
2. first time capture screenshot and send it  to back end to analyse it and then Every x seconds, it captures a screenshot and sends it to the backend.
3. Backend sends it to Google Gemini with a prompt: "Just be a companion while I use my computer."
4. Gemini replies. We display that like a chat message.

# how to start it

1. Clone the repository


# 2. Create and activate a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Add your Gemini API key
echo GEMINI_API_KEY=your-api-key-here > .env

# 5. Run the server  from terminal
python  gemini_screen_chat_companion/app/server.py

# 6. Open in your browser
http://localhost:5000/
