# BrandCraft 🚀
**Generative AI-Powered Branding Automation System**

Built for the 2024 Hackathon.

## Features
- **Brand Identity**: Text generation using **Groq** (Llama 3).
- **Visual Assets**: 
    - **Replicate API**: Generate custom logos using the Flux model (fast & reliable).
    - **Pexels API**: High-quality stock visuals (Fast).
- **Content Strategy**: Marketing copy & Sentiment analysis.

## ⚡️ Quick Start

### Prerequisites
- Python 3.8+ installed.
- Replicate API Token (Free): [Get it here](https://replicate.com/account/api-tokens)

### 1. Set Environment Variables
Create a `.env` file in the project root with your Replicate token:

```bash
export REPLICATE_API_TOKEN=r8_YOUR_TOKEN_HERE
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
- **Replicate Token**: For logo generation (required for real logo generation)
- **Pexels API Key**: For stock photos (optional)

## Logo Generation with Replicate

The logo generator uses **Replicate's Flux model** for high-quality AI-powered image generation.

### Get Started with Replicate
1. Create a free account at [replicate.com](https://replicate.com)
2. Get your API token from your [account settings](https://replicate.com/account/api-tokens)
3. Set the token in the app settings or environment variable

### How It Works
- Enter a logo description in the Logo Creator tool
- The Flux model generates a high-quality image in 30-60 seconds
- Download and use your generated logo

## Technologies
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Python FastAPI
- **AI Models**: 
  - Groq (Llama 3) for text generation
  - Replicate (Flux) for logo generation
  - Pexels API for stock imagery

## License
MIT
