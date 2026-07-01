import os
from google import genai
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

client = genai.Client(api_key=api_key)

# Simulated Zimna Memory
past_context = """
PAST DATA FOR JESSE:
1. You previously noted that you prefer Python over Node.js for backend tasks.
2. In January, you struggled with setting up Docker on Windows; you mentioned wanting to try WSL2 next time.
3. You have a habit of setting goals but forgetting to break them into daily sub-tasks.
"""

current_goal = "I want to start building the database for Zimna AI this weekend."

# Combine the memory with the current request
prompt = f"""
System: You are the core engine of Zimna AI. Your job is to help Jesse by remembering his past preferences and struggles.

Context from Jesse's history:
{past_context}

User Request: {current_goal}

Response: Give a short, encouraging piece of advice based strictly on his history and a list of the next tasks to do
"""

try:
    response = client.models.generate_content(
        model="gemini-3-flash-preview", 
        contents=prompt
    )
    print(f"--- Zimna's Output ---")
    print(response.text)
except Exception as e:
    print(f"Error: {e}")
