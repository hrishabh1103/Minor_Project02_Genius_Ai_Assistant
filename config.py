from dotenv import load_dotenv
import os

# Load environment variables from the .env file
load_dotenv()

# Get the GEMINI_API_KEY from the environment
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
OPENROUTER_API_KEY = "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"
# Now, GEMINI_API_KEY will hold the actual API key value