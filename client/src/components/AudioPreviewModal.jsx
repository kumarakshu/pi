import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Volume2, 
  Play, 
  Pause, 
  RotateCcw, 
  Languages, 
  Sparkles, 
  CheckCircle2 
} from 'lucide-react';

const TRANSCRIPTS = {
  "Hindi": {
    title: "Hindi Voice Note · Onboarding Introduction & Next Steps",
    transcript: "Namaste! Main Paytm Ad Onboarding team se baat kar raha hoon. Aapke ad setup ko fast live karane ke liye humne aapko WhatsApp message bheja hai. Kripya us link par click karke setup complete karein. Dhanyawad!",
    duration: "0:12",
    audioSrc: "/audio/voice_note_hindi_onboarding.mp3"
  },
  "English": {
    title: "English Voice Note · Step-by-Step Onboarding Guide",
    transcript: "Hello! Calling from Paytm Business Ad Onboarding team. We noticed your Ad Setup is pending. We have sent a quick guide on WhatsApp to go live instantly. Please check!",
    duration: "0:10",
    audioSrc: "/audio/voice_note_english_onboarding.mp3"
  },
  "Tamil": {
    title: "Tamil Voice Note · Business Onboarding Audio",
    transcript: "வணக்கம்! Paytm Business Ad Onboarding குழுவிலிருந்து பேசுகிறோம். உங்கள் விளம்பர அமைப்பு நிலுவையில் உள்ளது. உடனடியாகத் தொடங்க WhatsApp மெசேஜைப் பார்க்கவும். நன்றி!",
    duration: "0:11",
    audioSrc: "/audio/voice_note_tamil_onboarding.mp3"
  },
  "Telugu": {
    title: "Telugu Voice Note · Store Launch Guide",
    transcript: "నమస్కారం! Paytm Business Ad Onboarding టీమ్ నుండి కాల్ చేస్తున్నాము. మీ యాడ్ సెటప్ ఇంకా పెండింగ్లో ఉంది. త్వరగా లైవ్ చేయడానికి WhatsApp మెసేజ్ చూడండి. ధన్యవాదాలు!",
    duration: "0:11",
    audioSrc: "/audio/voice_note_telugu_onboarding.mp3"
  },
  "Marathi": {
    title: "Marathi Voice Note · Pi Commerce Store Setup Guide",
    transcript: "नमस्कार! मी Paytm Business Ad Onboarding टीमकडून बोलत आहे. तुमचे Ad Setup अजून बाकी आहे. त्वरित लाईव्ह करण्यासाठी WhatsApp वर पाठवलेला मेसेज पहा. धन्यवाद!",
    duration: "0:11",
    audioSrc: "/audio/voice_note_marathi_onboarding.mp3"
  },
  "Gujarati": {
    title: "Gujarati Voice Note · Digital Dukaan Activation",
    transcript: "નમસ્તે! હું Paytm Business Ad Onboarding ટીમમાંથી વાત કરી રહ્યો છું. તમારું Ad Setup હજુ બાકી છે. ઝડપથી લાઇવ કરવા માટે WhatsApp મેસેજ જુઓ. ધન્યવાદ!",
    duration: "0:11",
    audioSrc: "/audio/voice_note_gujarati_onboarding.mp3"
  },
  "Hinglish": {
    title: "Hinglish Voice Note · Quick WhatsApp Store Setup",
    transcript: "Namaste! Main Paytm Ad Onboarding team se baat kar raha hoon. Aapke ad setup ko fast live karane ke liye humne aapko WhatsApp message bheja hai. Kripya us link par click karke setup complete karein. Dhanyawad!",
    duration: "0:12",
    audioSrc: "/audio/voice_note_hindi_onboarding.mp3"
  }
};

export default function AudioPreviewModal({ isOpen, onClose, initialLanguage = 'Hindi' }) {
  const [currentLang, setCurrentLang] = useState(initialLanguage);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioContextRef = useRef(null);
  const audioElementRef = useRef(null);
  const intervalRef = useRef(null);

  // Stop & reset helper
  const stopAudio = () => {
    setIsPlaying(false);
    setProgress(0);
    if (audioElementRef.current) {
      audioElementRef.current.pause();
      audioElementRef.current.currentTime = 0;
      audioElementRef.current = null;
    }
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  useEffect(() => {
    setCurrentLang(initialLanguage);
    stopAudio();
  }, [initialLanguage]);

  // Clean up audio on unmount or close
  useEffect(() => {
    return () => {
      if (audioElementRef.current) {
        audioElementRef.current.pause();
        audioElementRef.current = null;
      }
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, []);

  if (!isOpen) return null;

  const currentData = TRANSCRIPTS[currentLang] || TRANSCRIPTS["Hindi"];

  const togglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      if (audioElementRef.current) {
        audioElementRef.current.pause();
      }
      if (intervalRef.current) clearInterval(intervalRef.current);
    } else {
      setIsPlaying(true);
      if (currentData.audioSrc) {
        if (!audioElementRef.current) {
          const audio = new Audio(currentData.audioSrc);
          audioElementRef.current = audio;
          audio.ontimeupdate = () => {
            if (audio.duration) {
              setProgress((audio.currentTime / audio.duration) * 100);
            }
          };
          audio.onended = () => {
            setIsPlaying(false);
            setProgress(0);
          };
        }
        audioElementRef.current.play().catch(e => {
          console.warn('Audio playback error, using tone fallback:', e.message);
        });
      } else {
        // Fallback tone preview
        try {
          const AudioCtx = window.AudioContext || window.webkitAudioContext;
          if (AudioCtx) {
            const ctx = new AudioCtx();
            audioContextRef.current = ctx;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(587.33, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3);
            gain.gain.setValueAtTime(0.15, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.4);
          }
        } catch (e) {
          console.log('Web Audio tone preview fallback');
        }

        intervalRef.current = setInterval(() => {
          setProgress(prev => {
            if (prev >= 100) {
              setIsPlaying(false);
              clearInterval(intervalRef.current);
              return 0;
            }
            return prev + 3;
          });
        }, 150);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-fadeIn">
        
        {/* Header */}
        <div className="bg-[#0b1329] px-6 py-4 flex items-center justify-between text-white border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-purple-600/30 rounded-lg border border-purple-500/40">
              <Volume2 className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h3 className="font-bold text-base">Regional Voice Note Preview</h3>
              <p className="text-xs text-slate-400">Meta WhatsApp Business Audio Message Asset</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs text-slate-700">
          
          {/* Language Tabs */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
              Select Regional Language
            </label>
            <div className="flex flex-wrap gap-1.5">
              {Object.keys(TRANSCRIPTS).map(lang => (
                <button
                  key={lang}
                  onClick={() => {
                    setCurrentLang(lang);
                    stopAudio();
                  }}
                  className={`px-3 py-1 rounded-md text-xs font-semibold transition ${
                    currentLang === lang
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          {/* Audio Wave Player Box */}
          <div className="bg-[#0f172a] rounded-xl p-5 text-white border border-slate-800 shadow-inner">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="font-semibold text-purple-300 text-xs">
                {currentData.title}
              </span>
              <span className="font-mono text-xs">{currentData.duration}</span>
            </div>

            {/* Simulated Audio Waveform */}
            <div className="flex items-center gap-1 h-12 my-3 px-2 bg-slate-900/80 rounded-lg">
              {[40, 65, 80, 45, 90, 70, 50, 85, 95, 60, 45, 75, 85, 65, 40, 90, 100, 70, 55, 80, 40, 60, 85, 45, 65, 75, 55, 35].map((height, idx) => {
                const isActive = (idx / 28) * 100 <= progress;
                return (
                  <div
                    key={idx}
                    className={`flex-1 rounded-full transition-all duration-75 ${
                      isActive ? 'bg-purple-400' : 'bg-slate-700'
                    }`}
                    style={{
                      height: isPlaying ? `${Math.max(20, (height * Math.random() + 20) % 100)}%` : `${height}%`
                    }}
                  ></div>
                );
              })}
            </div>

            {/* Play Controls */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                <button
                  onClick={togglePlay}
                  className="w-10 h-10 rounded-full bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center shadow-lg transition active:scale-95"
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                </button>
                <button
                  onClick={stopAudio}
                  className="p-2 text-slate-400 hover:text-white transition"
                  title="Reset Audio"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              <div className="text-[11px] text-slate-400">
                {isPlaying ? 'Playing Regional Audio Note...' : 'Click to listen to sample'}
              </div>
            </div>
          </div>

          {/* Transcript Box */}
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
            <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Audio Script & Transcript:
            </span>
            <p className="text-xs text-slate-800 leading-relaxed italic">
              "{currentData.transcript}"
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-md text-xs font-semibold transition"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}
