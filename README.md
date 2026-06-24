# Veterinary Voice Agent 🐾

This is a real-time, low-latency conversational Voice AI designed for veterinary assistance.

## 🧠 What's Inside (Tech Stack)
*   **Ears (Speech-to-Text):** Deepgram Nova-2 (Optimized for Indian English accents)
*   **Brain (LLM):** Groq + Llama-3.1-8B-instant (Ultra-fast LPU inference)
*   **Mouth (Text-to-Speech):** Deepgram Aura Asteria (Natural conversational voice)
*   **Hardware Audio:** `sounddevice` for raw microphone capture


## 🛠️ Setup Instructions

### 1. Install Dependencies
Open your terminal in this folder and run:
```bash
pip install sounddevice "deepgram-sdk<4.0.0" groq python-dotenv playsound==1.2.2
```
*(Note: Python 3.10 - 3.12 is recommended. Avoid very new Python versions to prevent Windows build errors).* 

### 2. Run the Agent
```bash
python agent.py
```
Wait for the terminal to say **"🟢 Voice Agent is Live!"**, then start talking naturally!

*(To exit, press `Ctrl+C`)*
