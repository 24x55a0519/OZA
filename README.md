# BrandCraft 🚀
**Generative AI-Powered Branding Automation System**

Built for the 2024 Hackathon.

## Features
- **Brand Identity**: Text generation using **Groq** (Llama 3).
- **Visual Assets**: 
    - **Hugging Face InferenceClient**: Generate custom logos using high-quality AI models.
    - **Works with or without authentication** - Uses free Hugging Face Inference API by default.
    - **Optional Premium**: Add HF token for priority access and premium models.
    - **Pexels API**: High-quality stock visuals (optional).
- **Content Strategy**: Marketing copy & Sentiment analysis.

## ⚡️ Quick Start

### Prerequisites
- Python 3.8+ installed.

### 1. Install Backend Dependencies
Run this command in the terminal to install dependencies:

```bash
pip install -r requirements.txt
```

### 2. Run the Server
Start the application (no authentication needed!):

```bash
python3 server.py
```

The server will output:
```
HF_TOKEN Status: Not Set
⚠️  HF_TOKEN not set. Using free Hugging Face Inference API
✅ Application startup complete
```

### 3. Open App
Go to: [http://localhost:8000](http://localhost:8000)

### 4. Configure API Keys (Optional)
In the BrandCraft app settings, you can add:
- **Groq API Key**: For text generation (optional, uses mock mode if not provided)
- **Hugging Face Token**: For enhanced logo generation (optional, uses free API if not provided)
- **Pexels API Key**: For stock photos (optional)

## Logo Generation

### Works Out of the Box ✅
The logo generation API works immediately without any authentication:
- Uses free **Hugging Face Inference API**
- Supports multiple models (Stable Diffusion 2.1 and more)
- High-quality image generation
- Fast inference

### Optional: Add Hugging Face Token for Premium Features
For enhanced performance and access to premium models:

```bash
export HF_TOKEN=hf_YOUR_TOKEN_HERE
```

Or add in settings within the app.

### How It Works
1. Enter logo description in the Logo Creator tool
2. Click "Generate Logo"
3. Watch the AI generate your logo (30-60 seconds)
4. Download your generated logo

### Supported Models
- **Default**: `stabilityai/stable-diffusion-2-1` (free tier)
- **Premium** (with HF token): `black-forest-labs/FLUX.1-Krea-dev`

## Architecture

```
Frontend (HTML/CSS/JS)
    ↓
Local FastAPI Server
    ↓
Hugging Face Inference API
    ↓
AI Models (Stable Diffusion, FLUX, etc.)
```

## Technologies Used
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Python FastAPI
- **AI Models**: 
  - Groq (Llama 3) for text generation
  - Hugging Face InferenceClient for logo generation
  - Pexels API for stock imagery

## API Endpoints

### POST /api/generate-image
Generate a logo from a text prompt.

**Request:**
```json
{
  "prompt": "A golden phoenix style logo, vector art, minimalist..."
}
```

**Response:**
```json
{
  "url": "data:image/png;base64,iVBORw0KGgoAAAAN..."
}
```

## Troubleshooting

### "Generation Failed" Error
- Make sure the server is running: `python3 server.py`
- Check the console for error messages
- Try a different prompt (simpler descriptions work better)

### Slow Generation
- First generation may take 30-60 seconds (model loading)
- Subsequent generations are faster
- Free API has rate limiting

### Rate Limiting
The free Hugging Face Inference API has rate limits. If you hit them:
1. Add a Hugging Face token for priority access
2. Wait a few minutes before retrying
3. Use simpler prompts for faster generation

## Future Enhancements
- [ ] Batch logo generation
- [ ] Logo editing tools
- [ ] Image upscaling
- [ ] Color palette generation
- [ ] Font suggestions

## License
MIT
