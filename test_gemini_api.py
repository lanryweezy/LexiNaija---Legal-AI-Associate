import os
import google.generativeai as genai

# Get API key from environment variable
GEMINI_API_KEY = os.environ.get("VITE_GEMINI_API_KEY")

if not GEMINI_API_KEY:
    print("Please set the VITE_GEMINI_API_KEY environment variable.")
    exit()

genai.configure(api_key=GEMINI_API_KEY)

try:
    # Try the model name and API version the frontend is using
    model = genai.GenerativeModel('gemini-1.5-flash-001', api_version='v1')
    
    prompt = "Explain how the Nigerian legal system works in one sentence."
    print(f"Attempting to generate content with model: {model.model_name}, API version: {model.api_version}")
    response = model.generate_content(prompt)
    print("\nResponse from gemini-1.5-flash-001 (v1):")
    print(response.text)

except Exception as e:
    print(f"\nError with gemini-1.5-flash-001 (v1): {e}")
    print("Trying with a more generic model and default API version...")
    try:
        # Try a more generic model and default API version
        model = genai.GenerativeModel('gemini-pro')
        prompt = "Explain how the Nigerian legal system works in one sentence."
        print(f"Attempting to generate content with model: {model.model_name}, API version: default")
        response = model.generate_content(prompt)
        print("\nResponse from gemini-pro (default API version):")
        print(response.text)
    except Exception as e:
        print(f"\nError with gemini-pro (default API version): {e}")
        print("Failed to generate content with both models. The API key or model availability might be the issue.")
