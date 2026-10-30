import os
import sys

# Ensure UTF-8 output on Windows terminal
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

from gtts import gTTS

AUDIO_DIR = os.path.join(os.path.dirname(__file__), 'server', 'public', 'audio')
os.makedirs(AUDIO_DIR, exist_ok=True)

SCRIPTS = {
    "english": {
        "text": "Hello! Calling from Paytm Business Ad Onboarding team. We noticed your Ad Setup is pending. We have sent a quick guide on WhatsApp to go live instantly. Please check!",
        "lang": "en",
        "tld": "co.in",
        "filename": "voice_note_english_onboarding.mp3"
    },
    "tamil": {
        "text": "வணக்கம்! Paytm Business Ad Onboarding குழுவிலிருந்து பேசுகிறோம். உங்கள் விளம்பர அமைப்பு நிலுவையில் உள்ளது. உடனடியாகத் தொடங்க WhatsApp மெசேஜைப் பார்க்கவும். நன்றி!",
        "lang": "ta",
        "tld": "co.in",
        "filename": "voice_note_tamil_onboarding.mp3"
    },
    "telugu": {
        "text": "నమస్కారం! Paytm Business Ad Onboarding టీమ్ నుండి కాల్ చేస్తున్నాము. మీ యాడ్ సెటప్ ఇంకా పెండింగ్లో ఉంది. త్వరగా లైవ్ చేయడానికి WhatsApp మెసేజ్ చూడండి. ధన్యవాదాలు!",
        "lang": "te",
        "tld": "co.in",
        "filename": "voice_note_telugu_onboarding.mp3"
    },
    "marathi": {
        "text": "नमस्कार! मी Paytm Business Ad Onboarding टीमकडून बोलत आहे. तुमचे Ad Setup अजून बाकी आहे. त्वरित लाईव्ह करण्यासाठी WhatsApp वर पाठवलेला मेसेज पहा. धन्यवाद!",
        "lang": "mr",
        "tld": "co.in",
        "filename": "voice_note_marathi_onboarding.mp3"
    },
    "gujarati": {
        "text": "નમસ્તે! હું Paytm Business Ad Onboarding ટીમમાંથી વાત કરી રહ્યો છું. તમારું Ad Setup હજુ બાકી છે. ઝડપથી લાઇવ કરવા માટે WhatsApp મેસેજ જુઓ. ધન્યવાદ!",
        "lang": "gu",
        "tld": "co.in",
        "filename": "voice_note_gujarati_onboarding.mp3"
    }
}

print(f"Generating multi-language regional voice notes into {AUDIO_DIR}...")

for key, config in SCRIPTS.items():
    output_path = os.path.join(AUDIO_DIR, config["filename"])
    print(f"Generating {key.capitalize()} ({config['lang']}): {config['filename']}...")
    try:
        tts = gTTS(text=config["text"], lang=config["lang"], tld=config["tld"], slow=False)
        tts.save(output_path)
        size = os.path.getsize(output_path)
        print(f"Saved {config['filename']} ({size} bytes)")
    except Exception as e:
        print(f"Error with tld={config['tld']}, trying default tld: {e}")
        tts = gTTS(text=config["text"], lang=config["lang"], slow=False)
        tts.save(output_path)
        size = os.path.getsize(output_path)
        print(f"Saved {config['filename']} ({size} bytes)")

print("All regional audio files generated successfully!")
