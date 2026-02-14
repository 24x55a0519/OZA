# BrandCraft 🚀
**Generative AI-Powered Branding Automation System**

Built for the 2024 Hackathon.

## Features
- **Brand Identity**: Text generation using **Groq** (Llama 3).
- **Visual Assets**: 
    - **Hugging Face InferenceClient**: Generate custom logos using FLUX.1-Krea-dev model with FAL-AI provider.
    - **Pexels API**: High-quality stock visuals (Fast).
- **Content Strategy**: Marketing copy & Sentiment analysis.

## ⚡️ Quick Start

### Prerequisites
- Python 3.8+ installed.
- Hugging Face Token: [Get it here](https://huggingface.co/settings/tokens)

### 1. Set Environment Variables
Create a `.env` file in the project root with your Hugging Face token:

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

### 5. Configure Keys in App Settings
In the BrandCraft app settings, add:
- **Groq API Key**: For text generation (optional, uses mock mode if not provided)
- **Hugging Face Token**: For logo generation (required for real logo generation)
- **Pexels API Key**: For stock photos (optional)

## Logo Generation with Hugging Face

The logo generator uses **Hugging Face InferenceClient** with the **FAL-AI provider** and **FLUX.1-Krea-dev** model for high-quality AI-powered image generation.

### Get Started with Hugging Face
1. Create a free account at [huggingface.co](https://huggingface.co)
2. Get your API token from your [account settings](https://huggingface.co/settings/tokens)
3. Set the token in the app settings or environment variable

### Code Example
```python
from huggingface_hub import InferenceClient

client = InferenceClient(
    provider="fal-ai",
    api_key="hf_YOUR_TOKEN_HERE",
)

# Generate image
image = client.text_to_image(
    "Astronaut riding a horse",
    model="black-forest-labs/FLUX.1-Krea-dev",
)
```

### How It Works
- Enter a logo description in the Logo Creator tool
- The FLUX.1-Krea-dev model generates a high-quality image
- Download and use your generated logo

## Technologies
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Python FastAPI
- **AI Models**: 
  - Groq (Llama 3) for text generation
  - Hugging Face InferenceClient (FLUX.1-Krea-dev via FAL-AI) for logo generation
  - Pexels API for stock imagery

## License
MIT
