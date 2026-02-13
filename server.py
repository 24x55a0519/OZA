import os
import torch
from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from diffusers import DiffusionPipeline
import uvicorn
import base64
from io import BytesIO

# --- App Setup ---
app = FastAPI()

# --- Model Loading (Global) ---
print("⏳ Loading Stable Diffusion XL Model... (This may take a while on first run)")

device = "mps" if torch.backends.mps.is_available() else "cpu"
print(f"🚀 Using device: {device}")

try:
    pipe = DiffusionPipeline.from_pretrained(
        "stabilityai/stable-diffusion-xl-base-1.0",
        torch_dtype=torch.float16 if device == "mps" else torch.float32,
        use_safetensors=True,
        variant="fp16" if device == "mps" else None
    )
    pipe.to(device)
    print("✅ Model Loaded Successfully!")
except Exception as e:
    print(f"❌ Error loading model: {e}")
    print("Ensure you have internet connection to download weights or check disk space.")
    pipe = None

# --- API Request Model ---
class ImageRequest(BaseModel):
    prompt: str

# --- Endpoints ---

@app.post("/api/generate-image")
async def generate_image(req: ImageRequest):
    if pipe is None:
        raise HTTPException(status_code=500, detail="Model failed to load. Check server logs.")
    
    try:
        print(f"🎨 Generating: {req.prompt}")
        # Run inference
        # Steps reduced to 25 for speed on local mac
        image = pipe(prompt=req.prompt, num_inference_steps=25).images[0]
        
        # Convert to Base64
        buffered = BytesIO()
        image.save(buffered, format="PNG")
        img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")
        
        return {"url": f"data:image/png;base64,{img_str}"}
    except Exception as e:
        print(f"Error during generation: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# --- Static Files (Serve Frontend) ---
# Serve the current directory's static files (css, js)
app.mount("/", StaticFiles(directory=".", html=True), name="static")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
