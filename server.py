import os
from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
import uvicorn
import base64
from io import BytesIO
from PIL import Image
import requests
import json
import time

# --- App Setup ---
app = FastAPI()

# --- Configuration ---
replicate_token = os.getenv("REPLICATE_API_TOKEN", "")
print(f"REPLICATE_API_TOKEN Status: {'Set' if replicate_token else 'Not Set'}")

if not replicate_token:
    print("⚠️  ⚠️  SETUP REQUIRED ⚠️️  ⚠️")
    print("This app requires a free Replicate API token for logo generation.")
    print("Get one here: https://replicate.com/api")
    print("Then set it as an environment variable:")
    print("  export REPLICATE_API_TOKEN='r8_...'")
    print("")
    print("Once set, restart the server and logo generation will work!")

# --- API Request Model ---
class ImageRequest(BaseModel):
    prompt: str

# --- Endpoints ---

@app.post("/api/generate-image")
async def generate_image(req: ImageRequest):
    """Generate an image using Replicate API"""
    
    try:
        if not replicate_token:
            raise HTTPException(
                status_code=500, 
                detail="SETUP REQUIRED: Please set REPLICATE_API_TOKEN environment variable. Get a free token at https://replicate.com/api"
            )
        
        print(f"🎨 Generating logo: {req.prompt}")
        
        # Enhance the prompt for better results
        enhanced_prompt = f"{req.prompt}, high quality, professional, logo design, vector art, clean, minimalist, modern"
        
        headers = {
            "Authorization": f"Token {replicate_token}",
            "Content-Type": "application/json"
        }
        
        # Use Stable Diffusion via Replicate
        # Version: https://replicate.com/stability-ai/stable-diffusion
        print("Creating image generation request on Replicate...")
        
        create_response = requests.post(
            "https://api.replicate.com/v1/predictions",
            headers=headers,
            json={
                "version": "db21e45d3f7023abc9f30f5358e4b0be2a8ae493a8122d422cc680dd0f532302",
                "input": {
                    "prompt": enhanced_prompt,
                    "width": 512,
                    "height": 512,
                    "num_outputs": 1,
                    "num_inference_steps": 25,
                    "guidance_scale": 7.5,
                }
            },
            timeout=30
        )
        
        if create_response.status_code not in [200, 201]:
            error_detail = create_response.text[:200]
            raise Exception(f"Failed to start generation: {create_response.status_code} - {error_detail}")
        
        prediction = create_response.json()
        prediction_id = prediction["id"]
        print(f"✅ Prediction created: {prediction_id}")
        
        # Poll for completion
        max_wait_time = 300  # 5 minutes
        start_time = time.time()
        
        while time.time() - start_time < max_wait_time:
            poll_response = requests.get(
                f"https://api.replicate.com/v1/predictions/{prediction_id}",
                headers=headers,
                timeout=10
            )
            
            if poll_response.status_code != 200:
                raise Exception(f"Failed to check status: {poll_response.status_code}")
            
            prediction = poll_response.json()
            status = prediction.get("status")
            
            print(f"Status: {status}")
            
            if status == "succeeded":
                output = prediction.get("output")
                if output and len(output) > 0:
                    image_url = output[0]
                    print(f"✅ Image generated: {image_url[:80]}...")
                    
                    # Download the image
                    img_response = requests.get(image_url, timeout=30)
                    if img_response.status_code == 200:
                        image = Image.open(BytesIO(img_response.content))
                        
                        # Convert to base64
                        buffered = BytesIO()
                        image.save(buffered, format="PNG")
                        img_data = buffered.getvalue()
                        img_str = base64.b64encode(img_data).decode("utf-8")
                        
                        return {"url": f"data:image/png;base64,{img_str}"}
                    else:
                        raise Exception(f"Failed to download image: {img_response.status_code}")
                else:
                    raise Exception("No image URL in response")
            
            elif status == "failed":
                error = prediction.get("error", "Unknown error")
                raise Exception(f"Generation failed: {error}")
            
            # Wait before polling again
            time.sleep(1)
        
        raise Exception("Image generation timed out (waited 5 minutes)")
            
    except HTTPException:
        raise
    except Exception as e:
        error_str = str(e)
        print(f"❌ Error: {error_str}")
        raise HTTPException(status_code=500, detail=error_str)

# --- Static Files (Serve Frontend) ---
# Serve the current directory's static files (css, js)
app.mount("/", StaticFiles(directory=".", html=True), name="static")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
