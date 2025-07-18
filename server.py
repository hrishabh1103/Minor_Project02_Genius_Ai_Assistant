from flask import Flask, request
from flask_cors import CORS
import speech_recognition as sr
from openai import OpenAI
import webbrowser
import os
import platform
from config import OPENROUTER_API_KEY
from langdetect import detect

# Flask app
app = Flask(__name__)
CORS(app)

# OpenRouter client
client = OpenAI(
    base_url = "https://openrouter.ai/api/v1",
    api_key = OPENROUTER_API_KEY
)

# Recognizer
recognizer = sr.Recognizer()

# Stop words
STOP_WORDS_EN = ["stop", "be quiet", "shut up", "enough", "cancel"]
STOP_WORDS_HI = ["रुक जा", "बस कर", "बंद करो", "चुप हो जाओ"]

def detect_language(text):
    try:
        lang = detect(text)
        if lang == 'hi':
            return "hi"
        else:
            return "en"
    except:
        return "en"

def predefined_responses(query, language="en"):
    responses = {
        "en": {
            "who made you": "I was created by Hrishabh Sir.",
            "what is your name": "My name is Genius.",
            "what is your purpose": "I am here to assist you with your tasks and provide information.",
            "what is your age": "I am a digital assistant and do not have an age.",
            "who is rishabh": "Hrishabh Gupta is an innovative developer, entrepreneur, and AI enthusiast working on various tech projects.",
            "what can you do": "I can help you in doing almost anything you ask me to do.",
            "tell me about Hrishabh": "Hrishabh Gupta is an innovative developer, entrepreneur, and AI enthusiast working on various tech projects.",
        },
        "hi": {
            "तुम कौन हो": "मैं ऋषभ सर का व्यक्तिगत सहायक हूँ।",
            "तुम क्या कर सकते हो": "मैं आपकी किसी भी चीज़ में सहायता कर सकता हूँ।",
            "ऋषभ के बारे में बताओ": "ऋषभ गुप्ता एक नवाचारी डेवलपर और एआई विशेषज्ञ हैं।",
            "तुम्हें किसने बनाया है": "मुझे ऋषभ सर ने बनाया है।",
        }
    }
    for key in responses[language]:
        if key in query:
            return responses[language][key]
    return None

def ask_openai(query):
    try
        model = "meta-llama/llama-3.3-8b-instruct:free"
        system_prompt = (
            "You are a helpful assistant for Rishabh Sir. "
            "Detect the language of the user input (English or Hindi) and reply fully in that language. "
            "If user asked in Hindi, answer completely in Hindi, not Hinglish. "
            "Keep your answer short and clear."
        )

        response = client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": query}
            ],
            max_tokens=1024,
            temperature=0.7
        )
        return response.choices[0].message.content
    except Exception as e:
        print(f"Error in OpenRouter API: {e}")
        return "Sorry, I couldn't process that request."

def open_application(app_name):
    system = platform.system()
    apps = {
        "Darwin": {
            "chrome": "open -a 'Google Chrome'",
            "vs code": "open -a 'Visual Studio Code'",
            "youtube": "open -a Safari https://www.youtube.com"
        },
        "Windows": {
            "chrome": "start chrome",
            "vs code": "code",
            "youtube": "start chrome https://www.youtube.com"
        },
        "Linux": {
            "chrome": "google-chrome",
            "vs code": "code",
            "youtube": "xdg-open https://www.youtube.com"
        }
    }
    app_name = app_name.lower().strip()
    if system in apps and app_name in apps[system]:
        os.system(apps[system][app_name])
        return f"Opening {app_name}..."
    else:
        return f"Could not find {app_name} for {system}."

def handle_query(query, language=None):
    if not query:
        return "I didn't hear anything."

    if language is None:
        language = detect_language(query)

    if (language == "en" and any(word in query for word in STOP_WORDS_EN)) or \
       (language == "hi" and any(word in query for word in STOP_WORDS_HI)):
        return "Okay, stopping." if language == "en" else "ठीक है, रोक रहा हूँ।"

    response = predefined_responses(query, language)
    if response:
        return response

    if "open" in query or "खोलो" in query:
        app_name = query.replace("open ", "").replace("खोलो ", "").strip()
        return open_application(app_name)

    if "search" in query or "खोजें" in query:
        search_query = query.replace("search", "").replace("खोजें", "").strip()
        webbrowser.open(f"https://www.google.com/search?q={search_query}")
        return f"Searching for {search_query}..."

    answer = ask_openai(query)
    return answer

@app.route('/api/health', methods=['GET'])
def health_check():
    return {"status": "ok"}, 200

@app.route('/api/listen', methods=['POST'])
def listen_and_respond():
    try:
        with sr.Microphone() as source:
            print("🎙️ Listening...")
            recognizer.adjust_for_ambient_noise(source)
            print("ℹ️ Ambient noise adjusted")

            audio = recognizer.listen(source, timeout=5)
            print("✅ Audio captured")

            print("🧠 Recognizing speech...")
            text = recognizer.recognize_google(audio, language="hi-IN,en-US").lower()
            print(f"📝 Recognized: {text}")

            response = handle_query(text)
            print(f"💬 Response: {response}")

            return {"transcription": text, "response": response}, 200

    except sr.WaitTimeoutError:
        print("⚠️ Timeout — no speech detected in 5 seconds")
        return {"error": "Listening timed out. Please try again."}, 408

    except sr.UnknownValueError:
        print("⚠️ Could not understand audio (UnknownValueError)")
        return {"error": "Could not understand audio."}, 400

    except sr.RequestError as e:
        print(f"⚠️ Speech recognition service failed ({e})")
        return {"error": "Speech recognition service failed."}, 500

    except Exception as e:
        print(f"🔥 Unexpected error: {e}")
        return {"error": "Unexpected error."}, 500

@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        text = data.get("text", "")
        if not text:
            return {"error": "No text provided."}, 400

        print(f"💬 User: {text}")

        response = handle_query(text)
        print(f"💬 Response: {response}")

        return {"response": response}, 200

    except Exception as e:
        print(f"🔥 Unexpected error in /api/chat: {e}")
        return {"error": "Unexpected error."}, 500

if __name__ == '__main__':
    app.run(port=5001, debug=True)