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

# --- App Setup ---
app = FastAPI()

# --- Hugging Face InferenceClient Setup ---
hf_token = os.getenv("HF_TOKEN")
if not hf_token:
    print("⚠️  HF_TOKEN not set. Logo generation will use mock data.")
    print("Get your token at: https://huggingface.co/settings/tokens")
    client = None
else:
    print("✅ Hugging Face InferenceClient initialized with FAL-AI provider")
    client = InferenceClient(
        provider="fal-ai",
        api_key=hf_token,
    )

# --- API Request Model ---
class ImageRequest(BaseModel):
    prompt: str

# --- Endpoints ---

@app.post("/api/generate-image")
async def generate_image(req: ImageRequest):
    """Generate an image using Hugging Face InferenceClient with FAL-AI provider and FLUX.1-Krea-dev model"""
    
    if client is None:
        raise HTTPException(
            status_code=500, 
            detail="HF_TOKEN not set. Get your token at https://huggingface.co/settings/tokens"
        )
    
    try:
        print(f"🎨 Generating logo: {req.prompt}")
        
        # Call Hugging Face API with FAL-AI provider using FLUX.1-Krea-dev model
        image = client.text_to_image(
            req.prompt,
            model="black-forest-labs/FLUX.1-Krea-dev",
        )
        
        # image is a PIL.Image object, convert to base64
        buffered = BytesIO()
        image.save(buffered, format="PNG")
        img_data = buffered.getvalue()
        img_str = base64.b64encode(img_data).decode("utf-8")
        
        return {"url": f"data:image/png;base64,{img_str}"}
            
    except Exception as e:
        print(f"Error during generation: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# --- Static Files (Serve Frontend) ---
# Serve the current directory's static files (css, js)
app.mount("/", StaticFiles(directory=".", html=True), name="static")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
