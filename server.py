import os
from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from huggingface_hub import InferenceClient
import uvicorn
import base64
from io import BytesIO
from PIL import Image
import requests
import json

# --- App Setup ---
app = FastAPI()

# --- Hugging Face InferenceClient Setup ---
hf_token = os.getenv("HF_TOKEN")
print(f"HF_TOKEN Status: {'Set' if hf_token else 'Not Set'}")

if hf_token:
    print("✅ Hugging Face InferenceClient initialized with FAL-AI provider")
    client = InferenceClient(
        provider="fal-ai",
        api_key=hf_token,
    )
else:
    print("⚠️  HF_TOKEN not set. Using free Hugging Face Inference API")
    client = InferenceClient()  # Uses default free API

# --- API Request Model ---
class ImageRequest(BaseModel):
    prompt: str

# --- Endpoints ---

@app.post("/api/generate-image")
async def generate_image(req: ImageRequest):
    """Generate an image using Hugging Face InferenceClient"""
    
    try:
        print(f"🎨 Generating logo: {req.prompt}")
        
        # Enhance the prompt for better results
        enhanced_prompt = f"{req.prompt}, high quality, professional, logo design, vector art, clean"
        
        # Try with FLUX model first (if token is available)
        if hf_token:
            try:
                print("Trying FLUX.1-Krea-dev model...")
                image = client.text_to_image(
                    enhanced_prompt,
                    model="black-forest-labs/FLUX.1-Krea-dev",
                )
                print("✅ FLUX model succeeded")
            except Exception as e:
                print(f"FLUX model failed: {e}, trying Stable Diffusion...")
                # Fallback to Stable Diffusion
                image = client.text_to_image(enhanced_prompt)
        else:
            # Use free inference API with a reliable model
            print("Using free Hugging Face Inference API...")
            image = client.text_to_image(
                enhanced_prompt,
                model="stabilityai/stable-diffusion-2-1"
            )
        
        # Convert image to base64
        if isinstance(image, bytes):
            img_data = image
        else:
            # If it's a PIL Image
            buffered = BytesIO()
            image.save(buffered, format="PNG")
            img_data = buffered.getvalue()
        
        img_str = base64.b64encode(img_data).decode("utf-8")
        return {"url": f"data:image/png;base64,{img_str}"}
            
    except Exception as e:
        print(f"Error during generation: {e}")
        print(f"Error type: {type(e).__name__}")
        raise HTTPException(status_code=500, detail=str(e))

# --- Static Files (Serve Frontend) ---
# Serve the current directory's static files (css, js)
app.mount("/", StaticFiles(directory=".", html=True), name="static")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
