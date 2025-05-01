# Import Flask components to create the web app and handle requests
#  Standard library
import os
import io
import base64
import tempfile

# Third-party libraries
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from dotenv import load_dotenv
import google.generativeai as genai

# Local application imports
# for future


# Create the Flask app instance
# Flask will, by default, look for the 'static/' and 'templates/' folders
app = Flask(__name__)

# Enable CORS for the entire application
CORS(app)

# laod the key values from .env
load_dotenv()
# Configure the Gemini API with your Google API key

gemeni_api_key = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=gemeni_api_key)

# Define the route for the homepage and seacrh for index,html
@app.route("/")
def index():
    # Render the index.html file from the /templates directory
    return render_template("index.html")

# Optional: Prevent 404 error for favicon.ico request
@app.route("/favicon.ico")
def favicon():
    return "", 204  # Return "No Content"

# Define the route for the AI chat companion
@app.route("/chat", methods=["POST", "OPTIONS"])
def chat_with_gemini():
    if request.method == "OPTIONS":
        return "", 200

    try:
        data = request.json
        print("process started")

        if "image" not in data:
            return jsonify({"error": "No image provided"}), 400

        base64_img = data["image"].split(",")[1]
        image_bytes = base64.b64decode(base64_img)
        print("image_bytes")

        model = genai.GenerativeModel("gemini-1.5-pro-latest")
        print("model")

           # Decode base64 image (you already have this)
        image_bytes = base64.b64decode(base64_img)

# Save image temporarily to disk
        with tempfile.NamedTemporaryFile(delete=False, suffix=".png") as tmp_file:
          tmp_file.write(image_bytes)
        tmp_file_path = tmp_file.name
        print(tmp_file_path)

        # Upload the image from that file path
        uploaded_image = genai.upload_file(tmp_file_path)
       
        response = model.generate_content([
            "You're a friendly companion AI. React to what you see on the screen and chat with the user naturally.",
             uploaded_image
        ])

        ##  when LIMIT Quota was ended to using test response
        class TestingResponse:
         def __init__(self, text):
          self.text = text

       ## response = TestingResponse("testing the screenshot1111111111")
        return jsonify({"response": response.text})

    except Exception as e:
        print("Error during Gemini processing:", str(e))

        return jsonify({"error": str(e)}), 500
# Run the Flask app locally on port 5000 in debug mode (matching the port in your error message)
if __name__ == "__main__":
    app.run(debug=True, port=5000, host="0.0.0.0")