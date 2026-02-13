# BrandCraft 🚀
**Generative AI-Powered Branding Automation System**

Built for the 2024 Hackathon.

## Features
- **Brand Identity**: Unlimted Text generation using **Groq** (Llama 3).
- **Visual Assets**: 
    - **Pexels API**: High-quality stock visuals (Fast).
    - **Local Stable Diffusion**: Generate custom logos locally using Python (Requires GPU/Apple Silicon).
- **Content Strategy**: Marketing copy & Sentiment analysis.

## ⚡️ Quick Start

### Prerequisites
- Python 3.8+ installed.

### 1. Install Backend Dependencies
Run this command in the terminal to install FastAPI and AI libraries:
```bash
pip install -r requirements.txt
```
*(Note: Pytorch and Diffusers are large, so this may take a few minutes)*

### 2. Run the Server
Start the application:
```bash
python3 server.py
```
The first time you run this, it will download the **Stable Diffusion XL** model (~6GB).

### 3. Open App
Go to: [http://localhost:8000](http://localhost:8000)

## Configuration
- **Groq API**: Enter your key (`gsk_...`) in Settings.
- **Pexels API**: Enter key in Settings for instant stock photos.
- **Images**: If no Pexels key is provided, the app will use the **Local SDXL** backend to generate images.

## Technologies
- **Frontend**: HTML5, CSS3, Vanilla JS.
- **Backend**: Python FastAPI.
- **AI**: Groq (Llama 3), Stability AI (SDXL), Pexels.

## License
MIT
