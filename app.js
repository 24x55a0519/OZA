/* BrandCraft App Logic */

// --- Configuration ---
const CONFIG = {
    apiKey: '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', // Set by user in settings
    replicateKey: '', // Replicate API key for logo generation
    pexelsKey: '', // Pexels Key
    mockMode: false,
    models: {
        text: 'llama-3.3-70b-versatile', // Updated Groq Model
        image: 'black-forest-labs/flux-schnell' // Replicate Flux model
    },
    endpoints: {
        text: 'https://api.groq.com/openai/v1/chat/completions',
        image: '/api/generate-image', // Local Backend (uses Replicate token from env)
        pexels: 'https://api.pexels.com/v1/search'
    }
};

// --- Mock Data ---
const MOCK_DATA = {
    names: [
        { name: "NebulaNode", slogan: "Connect to the future." },
        { name: "AetherWorks", slogan: "Building beyond boundaries." },
        { name: "ZenithAI", slogan: "Peak performance intelligence." },
        { name: "FluxDynamics", slogan: "Energy in motion." },
        { name: "QuantumPulse", slogan: "The heartbeat of innovation." }
    ],
    logos: [
        "https://images.unsplash.com/photo-1626785774573-4b7993143a23?q=80&w=2070&auto=format&fit=crop", // Abstract Tech
        "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop", // Neon
        "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?q=80&w=2069&auto=format&fit=crop"  // Minimal
    ],
    copy: "Elevate your brand with BrandCraft. Our AI-driven suite empowers creators to build stunning identities in seconds. Experience the future of branding today.",
    sentiment: "Positive (0.92). The text conveys confidence, innovation, and excitement.",
    chat: "I can help you define your brand strategy. Try asking about color psychology or tagline ideas!"
};

// --- UI Navigation ---
function showSection(sectionId) {
    document.querySelectorAll('main > section').forEach(sec => {
        sec.classList.remove('active-section');
        sec.classList.add('hidden-section');
    });
    document.getElementById(sectionId).classList.remove('hidden-section');
    document.getElementById(sectionId).classList.add('active-section');

    // Update Nav
    document.querySelectorAll('.nav-links a').forEach(link => link.classList.remove('active'));
    document.querySelector(`.nav-links a[href="#${sectionId}"]`).classList.add('active');
}

function switchTool(toolId) {
    // Buttons
    document.querySelectorAll('.tool-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`.tool-btn[onclick="switchTool('${toolId}')"]`).classList.add('active');

    // Views
    document.querySelectorAll('.tool-view').forEach(view => {
        view.classList.remove('active-tool');
        view.classList.add('hidden-tool');
    });
    document.getElementById(toolId).classList.remove('hidden-tool');
    document.getElementById(toolId).classList.add('active-tool');
}

function subTab(tabType) {
    if (tabType === 'copy') {
        document.getElementById('view-copy').classList.remove('hidden');
        document.getElementById('view-analyze').classList.add('hidden');
        document.querySelectorAll('.sub-tab')[0].classList.add('active');
        document.querySelectorAll('.sub-tab')[1].classList.remove('active');
    } else {
        document.getElementById('view-copy').classList.add('hidden');
        document.getElementById('view-analyze').classList.remove('hidden');
        document.querySelectorAll('.sub-tab')[0].classList.remove('active');
        document.querySelectorAll('.sub-tab')[1].classList.add('active');
    }
}

function toggleSettings() {
    const modal = document.getElementById('settings-modal');
    if (modal.classList.contains('hidden')) {
        modal.classList.remove('hidden');
        document.getElementById('api-key-input').value = CONFIG.apiKey;
        document.getElementById('replicate-key-input').value = CONFIG.replicateKey;
        document.getElementById('pexels-key-input').value = CONFIG.pexelsKey;
    } else {
        modal.classList.add('hidden');
    }
}

function saveSettings() {
    const key = document.getElementById('api-key-input').value;
    const replicateKey = document.getElementById('replicate-key-input').value;
    const pexelsKey = document.getElementById('pexels-key-input').value;
    
    if (key.trim().length > 0) {
        CONFIG.apiKey = key.trim();
        CONFIG.mockMode = false;
        showToast('Groq API Key Saved.');
    } else {
        CONFIG.mockMode = true;
        showToast('No Groq Key entered. Reverting to Mock Mode.');
    }
    
    if (replicateKey.trim().length > 0) {
        CONFIG.replicateKey = replicateKey.trim();
        showToast('✅ Replicate Token Saved. Logo generation ready!');
    } else {
        showToast('⚠️ No Replicate key. Logo generation will use mock data.');
    }
    
    if (pexelsKey.trim().length > 0) {
        CONFIG.pexelsKey = pexelsKey.trim();
    }
    
    toggleSettings();
}

function showToast(msg) {
    const toast = document.getElementById('toast');
    toast.innerText = msg;
    toast.classList.remove('hidden');
    toast.style.bottom = '20px';
    setTimeout(() => {
        toast.style.bottom = '-100px';
        setTimeout(() => toast.classList.add('hidden'), 500);
    }, 3000);
}

// --- Logic Generators ---

async function generateBrandName() {
    const prompt = document.getElementById('name-prompt').value;
    const style = document.getElementById('name-style').value;
    const resultsArea = document.getElementById('name-results');

    if (!prompt) { showToast('Please enter a description'); return; }

    resultsArea.innerHTML = '<div class="loader"></div>';
    resultsArea.classList.remove('hidden');

    try {
        let names = [];
        if (CONFIG.mockMode) {
            await new Promise(r => setTimeout(r, 1500)); // Fake delay
            names = MOCK_DATA.names;
        } else {
            const response = await fetch(CONFIG.endpoints.text, { // Use Groq Endpoint
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${CONFIG.apiKey}`
                },
                body: JSON.stringify({
                    model: CONFIG.models.text,
                    messages: [{
                        role: "system",
                        content: "You are a creative branding expert. Output JSON only: list of 5 brand names and slogans based on user style. Format: [{\"name\": \"...\", \"slogan\": \"...\"}]"
                    }, {
                        role: "user",
                        content: `Generate 5 ${style} brand names and slogans for: ${prompt}. Return strict JSON array.`
                    }]
                })
            });
            const data = await response.json();
            if (data.error) throw new Error(data.error.message || "API Error");
            if (!data.choices || !data.choices[0]) throw new Error("Invalid API Response. Check Console.");

            // Basic parsing strategy (assuming JSON output)
            const text = data.choices[0].message.content;
            // Clean markdown code blocks if present
            const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
            try {
                names = JSON.parse(jsonStr);
            } catch (jsonErr) {
                // Fallback if model returns text + json
                const match = jsonStr.match(/\[.*\]/s);
                if (match) names = JSON.parse(match[0]);
                else throw new Error("Failed to parse AI response");
            }
        }

        // Render
        let html = '';
        names.forEach(n => {
            html += `
            <div class="result-card" style="background:rgba(255,255,255,0.05); padding:1rem; margin-bottom:0.5rem; border-radius:8px; display:flex; justify-content:space-between; align-items:center;">
                <div>
                    <h3 style="color:var(--accent); margin-bottom:0.2rem;">${n.name}</h3>
                    <small style="color:var(--text-muted);">${n.slogan}</small>
                </div>
                <button onclick="navigator.clipboard.writeText('${n.name}')" style="background:none; border:none; color:white; cursor:pointer;"><i class="fa-solid fa-copy"></i></button>
            </div>`;
        });
        resultsArea.innerHTML = html;

    } catch (e) {
        console.error(e);
        resultsArea.innerHTML = `<p style="color:red">Error: ${e.message}. Check API Key.</p>`;
    }
}

async function generateLogo() {
    const prompt = document.getElementById('logo-prompt').value;
    const imgEl = document.getElementById('generated-logo');
    const resultsContainer = document.getElementById('logo-results');
    const loader = document.getElementById('logo-loader');
    const loadingText = document.getElementById('logo-loading-text');
    const logoDisplay = document.getElementById('logo-display');
    const logoError = document.getElementById('logo-error');

    if (!prompt) { showToast('Describe your logo first'); return; }

    // Show results container
    resultsContainer.classList.remove('hidden');
    
    // Show loader and loading text, hide others
    loader.classList.remove('hidden');
    loadingText.classList.remove('hidden');
    logoDisplay.classList.add('hidden');
    logoError.classList.add('hidden');

    try {
        let imageUrl = '';

        // Use Replicate API via local backend
        if (CONFIG.replicateKey) {
            loadingText.innerText = "🎨 Generating logo using AI (this may take 30-60 seconds)...";
            const response = await fetch(CONFIG.endpoints.image, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: prompt })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || "Generation failed. Check if REPLICATE_API_TOKEN is set on server.");
            }

            const data = await response.json();
            if (data.detail) throw new Error(data.detail);
            imageUrl = data.url; // Base64 data URL
        } else {
            // Fallback to mock with demo logos
            loadingText.innerText = "📸 Loading demo logo...";
            await new Promise(r => setTimeout(r, 1500));
            imageUrl = MOCK_DATA.logos[Math.floor(Math.random() * MOCK_DATA.logos.length)];
            showToast("⚠️ Using demo logo. Add Replicate token in settings for real generation.");
        }

        // Load image
        imgEl.src = imageUrl;
        imgEl.onload = () => {
            loader.classList.add('hidden');
            loadingText.classList.add('hidden');
            logoDisplay.classList.remove('hidden');
            logoError.classList.add('hidden');
            showToast('✅ Logo generated successfully!');
        };

        imgEl.onerror = () => {
            throw new Error('Failed to load generated image');
        };

    } catch (e) {
        console.error(e);
        loader.classList.add('hidden');
        loadingText.classList.add('hidden');
        logoDisplay.classList.add('hidden');
        logoError.classList.remove('hidden');
        logoError.innerHTML = `<strong>❌ Generation Failed:</strong><br>${e.message}<br><br><small>Make sure you have set REPLICATE_API_TOKEN in your server environment and added the token in settings.</small>`;
        showToast('Generation failed. Check console and settings.');
    }
}

// Download logo function
function downloadLogo() {
    const img = document.getElementById('generated-logo');
    if (!img.src) return;
    
    const link = document.createElement('a');
    link.href = img.src;
    link.download = 'logo.png';
    link.click();
    showToast('✅ Logo downloaded!');
}

async function generateCopy() {
    const topic = document.getElementById('copy-topic').value;
    const resDiv = document.getElementById('copy-results');

    if (!topic) return;

    resDiv.classList.remove('hidden');
    resDiv.innerText = 'Generating copy...';

    if (CONFIG.mockMode) {
        setTimeout(() => {
            resDiv.innerText = MOCK_DATA.copy;
        }, 1000);
    } else {
        // Implementation for real API would go here (similar to name gen)
        // Simplified for hackathon speed
        try {
            const response = await fetch(CONFIG.endpoints.text, { // Use Groq Endpoint
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${CONFIG.apiKey}` },
                body: JSON.stringify({
                    model: CONFIG.models.text,
                    messages: [{ role: "user", content: `Write a short, punchy marketing copy for: ${topic}` }]
                })
            });
            const data = await response.json();
            if (data.error) throw new Error(data.error.message);
            resDiv.innerText = data.choices[0].message.content;
        } catch (e) {
            console.error(e);
            resDiv.innerText = `Error: ${e.message}`;
        }
    }
}

async function analyzeSentiment() {
    const txt = document.getElementById('sentiment-text').value;
    const resDiv = document.getElementById('sentiment-results');

    if (!txt) return;

    resDiv.classList.remove('hidden');
    resDiv.innerText = 'Analyzing...';

    if (CONFIG.mockMode) {
        setTimeout(() => {
            resDiv.innerText = MOCK_DATA.sentiment;
        }, 1000);
    } else {
        try {
            const response = await fetch(CONFIG.endpoints.text, { // Use Groq Endpoint
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${CONFIG.apiKey}` },
                body: JSON.stringify({
                    model: CONFIG.models.text,
                    messages: [{ role: "user", content: `Analyze the sentiment of this text: "${txt}". keep it brief.` }]
                })
            });
            const data = await response.json();
            if (data.error) throw new Error(data.error.message);
            resDiv.innerText = data.choices[0].message.content;
        } catch (e) {
            console.error(e);
            resDiv.innerText = `Error: ${e.message}`;
        }
    }
}

// Chat Assistant (Mock)
function sendMessage() {
    const input = document.getElementById('chat-input');
    const history = document.getElementById('chat-history');
    const msg = input.value;
    if (!msg) return;

    // User Msg
    const uDiv = document.createElement('div');
    uDiv.className = 'msg user';
    uDiv.innerText = msg;
    history.appendChild(uDiv);
    input.value = '';

    // Scroll
    history.scrollTop = history.scrollHeight;

    // AI Response
    setTimeout(() => {
        const aDiv = document.createElement('div');
        aDiv.className = 'msg ai';
        aDiv.innerText = CONFIG.mockMode ? MOCK_DATA.chat : "I am connected to the API, but for this demo, I'll keep it short: That sounds like a great strategy!";
        history.appendChild(aDiv);
        history.scrollTop = history.scrollHeight;
    }, 1000);
}

// Initial Load
document.addEventListener('DOMContentLoaded', () => {
    // Check if user provided key via URL param or local storage (optional enhancement)
    // For now, default to mock.
    console.log("BrandCraft Loaded");
});
