import google.generativeai as genai

# Replace this with your new paid API key
API_KEY = "AIzaSyAAYgi5_0Q2NFoM4N2RX4ZuPImPm3Jlh7Y"

# Configure Gemini API
genai.configure(api_key=API_KEY)

# Create model
try:
    model = genai.GenerativeModel("gemini-1.5-flash-latest")

    # Send a test query
    response = model.generate_content("Hello, who are you?")
    
    print("Gemini API test successful! Response:")
    print(response.text)

except Exception as e:
    print(f"Gemini API test failed: {e}")