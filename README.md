# BrandCraft 🚀
**Generative AI-Powered Branding Automation System**

Built for the 2024 Hackathon.

## Features
- **Brand Identity**: Text generation using **Groq** (Llama 3).
- **Visual Assets**: 
    - **Hugging Face GLM-Image**: Generate custom logos using the `zai-org/GLM-Image` model via fal-ai provider.
    - **Pexels API**: High-quality stock visuals (Fast).
- **Content Strategy**: Marketing copy & Sentiment analysis.

## ⚡️ Quick Start

### Prerequisites
- Python 3.8+ installed.
- Hugging Face Token (for logo generation): [Get yours here](https://huggingface.co/settings/tokens)

### 1. Set Environment Variables
Create a `.env` file in the project root with your Hugging Face token:
```
HF_TOKEN=hf_YOUR_TOKEN_HERE
```

Or set it directly in your terminal:
```bash
export HF_TOKEN=hf_YOUR_TOKEN_HERE
```

### 2. Install Backend Dependencies
Run this command in the terminal to install dependencies:
```bash
pip install -r requirements.txt
```

### 3. Run the Server
Start the application:
```bash
python3 server.py
```

### 4. Open App
Go to: [http://localhost:8000](http://localhost:8000)

## Configuration
- **Groq API**: Enter your key (`gsk_...`) in Settings for text generation.
- **Hugging Face Token**: Set `HF_TOKEN` environment variable for logo generation using GLM-Image model.
- **Pexels API**: Enter key in Settings for instant stock photos (optional).

## Logo Generation API
The logo generator uses the **Hugging Face InferenceClient** with the **zai-org/GLM-Image** model:

```python
from huggingface_hub import InferenceClient

client = InferenceClient(api_key=hf_token)
image = client.text_to_image(
    prompt="Your logo description",
    model="zai-org/GLM-Image",
    provider="fal-ai",
    parameters={"num_inference_steps": 5}
)
```

Simply enter your logo description in the search box in the Logo Creator tool!

## Technologies
- **Frontend**: HTML5, CSS3, Vanilla JS.
- **Backend**: Python FastAPI.
- **AI**: 
  - Groq (Llama 3) for text generation
  - Hugging Face InferenceClient (GLM-Image) for logo generation
  - Pexels API for stock imagery
