import React, { useState } from 'react';
import { 
  Sun, 
  Video, 
  Mic, 
  VolumeX, 
  PhoneOff, 
  CheckCircle, 
  Bot, 
  CheckCheck 
} from 'lucide-react';
import { motion } from 'motion/react';

export const ScreenVideo = ({ onNext }) => {
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [messages] = useState([
    { role: 'ai', text: "Hello Alex, I'm your AI assistant today. Let's start by verifying your identity. Could you please look directly at the camera?", time: '10:24 AM' },
    { role: 'user', text: "Yes, I'm looking now. Is this okay?", time: '10:24 AM' },
    { role: 'ai', text: "Perfect. Now, please state your full name and the purpose of your loan application.", time: '10:25 AM' },
    { role: 'user', text: "My name is Alex Rivera, and I am applying for a residential mortgage for a property in Austin.", time: '10:25 AM' }
  ]);

  return (
    <div className="flex-1 flex flex-col xl:flex-row gap-0 overflow-hidden h-full">
      <section className="flex-1 bg-surface-container-lowest relative flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="absolute top-4 sm:top-6 lg:top-10 left-4 sm:left-6 lg:left-10 flex flex-col gap-2 sm:gap-3 z-20">
          <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-xs font-medium">
            <span className={`w-2 h-2 rounded-full ${isVideoOn ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></span>
            {isVideoOn ? 'Face detected' : 'Video Off'}
          </div>
          <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-xs font-medium">
            <Sun size={14} className={isVideoOn ? 'text-emerald-400' : 'text-gray-400'} />
            {isVideoOn ? 'Lighting OK' : '---'}
          </div>
        </div>
        <div className="absolute top-4 sm:top-6 lg:top-10 right-4 sm:right-6 lg:right-10 z-20">
          <div className="bg-black/40 backdrop-blur-md text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-sm sm:text-lg font-mono tracking-widest">
            02:45
          </div>
        </div>

        <div className="w-full max-w-2xl aspect-[4/3] bg-surface-container-high rounded-2xl sm:rounded-3xl overflow-hidden relative shadow-2xl">
          {isVideoOn ? (
            <img 
              src="https://picsum.photos/seed/video-call/800/600" 
              alt="Live camera feed" 
              className="w-full h-full object-cover opacity-90"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-full h-full bg-surface-container-highest flex flex-col items-center justify-center gap-4">
              <div className="w-24 h-24 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant">
                <Video size={48} />
              </div>
              <p className="text-on-surface-variant font-bold">Camera is turned off</p>
            </div>
          )}
          
          {isVideoOn && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-44 h-56 sm:w-56 sm:h-72 lg:w-64 lg:h-80 border-2 border-emerald-400/60 rounded-[3rem] sm:rounded-[4rem] relative">
                <div className="absolute -top-10 sm:-top-12 left-1/2 -translate-x-1/2 bg-emerald-500 text-white px-3 sm:px-4 py-1 rounded-full text-[10px] sm:text-xs font-bold whitespace-nowrap shadow-lg">
                  BLINK TO CONFIRM
                </div>
                <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-emerald-500 rounded-tl-2xl"></div>
                <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-emerald-500 rounded-tr-2xl"></div>
                <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-emerald-500 rounded-bl-2xl"></div>
                <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-emerald-500 rounded-br-2xl"></div>
              </div>
            </div>
          )}
          
          <div className="absolute bottom-4 sm:bottom-6 lg:bottom-10 left-1/2 -translate-x-1/2 glass-panel px-4 sm:px-6 py-2 rounded-full shadow-lg">
            <p className="text-sm font-semibold text-on-surface tracking-tight">
              {isVideoOn ? 'Stay in the center of the frame' : 'Turn on camera to proceed'}
            </p>
          </div>
        </div>

        <div className="mt-6 sm:mt-8 max-w-xl text-center">
          <p className="text-base sm:text-lg font-medium text-on-surface-variant leading-relaxed">
            "Please confirm that you have read and understood the <span className="text-primary font-bold">Terms of Service</span> and the <span className="text-primary font-bold">Data Privacy Agreement</span>."
          </p>
          <div className="mt-4 flex items-center justify-center gap-2 text-emerald-600 font-bold text-sm bg-emerald-50 px-4 py-2 rounded-full inline-flex">
            <CheckCircle size={16} className="fill-current" />
            Consent captured ✅
          </div>
        </div>

        <div className="mt-6 sm:mt-8 flex gap-3 sm:gap-4">
          <button 
            onClick={() => setIsMicOn(!isMicOn)}
            className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all ${isMicOn ? 'bg-surface-container-high text-on-surface' : 'bg-red-500 text-white'}`}
          >
            {isMicOn ? <Mic size={20} className="sm:w-6 sm:h-6" /> : <VolumeX size={20} className="sm:w-6 sm:h-6" />}
          </button>
          <button 
            onClick={() => setIsVideoOn(!isVideoOn)}
            className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all ${isVideoOn ? 'bg-surface-container-high text-on-surface' : 'bg-red-500 text-white'}`}
          >
            <Video size={20} className="sm:w-6 sm:h-6" />
          </button>
          <button 
            onClick={onNext}
            className="px-5 sm:px-8 h-12 sm:h-14 rounded-full bg-error text-white flex items-center gap-2 font-bold shadow-lg shadow-error/20 hover:opacity-90 transition-all text-sm sm:text-base"
          >
            <PhoneOff size={18} className="fill-current sm:w-5 sm:h-5" />
            End Call
          </button>
        </div>
      </section>

      <aside className="w-full xl:w-[400px] bg-surface-container border-t xl:border-t-0 xl:border-l border-outline-variant/10 flex flex-col">
        <div className="p-5 sm:p-6 lg:p-8 flex flex-col h-full">
          <div className="flex flex-col items-center mb-6 sm:mb-8 lg:mb-10">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-primary-gradient p-1 shadow-2xl">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center animate-pulse">
                    <Bot size={40} className="text-primary" />
                  </div>
                </div>
              </div>
              <div className="absolute bottom-1 right-1 w-6 h-6 bg-emerald-500 border-4 border-surface-container rounded-full"></div>
            </div>
            <h2 className="mt-4 text-lg font-bold text-on-surface">LoanFlow AI</h2>
            <p className="text-xs text-on-surface-variant font-medium">Intelligent Verification Agent</p>
          </div>

          <div className="flex-1 space-y-4 sm:space-y-6 overflow-y-auto pr-2 custom-scrollbar max-h-[340px] xl:max-h-none">
            {messages.map((msg, i) => (
              <div key={i} className={`flex flex-col gap-2 ${msg.role === 'user' ? 'items-end ml-auto' : ''} max-w-[85%]`}>
                <div className={`p-4 rounded-2xl shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-primary text-white rounded-tr-none' 
                    : 'bg-surface-container-lowest text-on-surface rounded-tl-none'
                }`}>
                  <p className={`text-sm leading-relaxed ${msg.role === 'user' ? 'italic' : ''}`}>{msg.text}</p>
                </div>
                <div className="flex items-center gap-1.5 px-1">
                  {msg.role === 'user' && <CheckCheck size={12} className="text-emerald-500" />}
                  <span className="text-[10px] text-on-surface-variant font-medium">
                    {msg.role === 'ai' ? 'AI Assistant' : 'Transcribed'} • {msg.time}
                  </span>
                </div>
              </div>
            ))}
            <div className="flex flex-col gap-2 max-w-[85%]">
              <div className="bg-surface-container-lowest p-4 rounded-2xl rounded-tl-none shadow-sm border-2 border-primary/20">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
                  <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Listening...</span>
                </div>
                <p className="text-sm text-on-surface leading-relaxed">Please read the consent statement on the screen to proceed with the legal verification.</p>
              </div>
            </div>
          </div>

          <div className="mt-5 sm:mt-6 p-4 bg-surface-container-high rounded-2xl flex items-center justify-between gap-4">
            <div className="flex items-end gap-1 h-8">
              {[2, 5, 8, 4, 6, 3, 7, 5].map((h, i) => (
                <motion.div 
                  key={i}
                  animate={{ height: [h * 4, (h + 2) * 4, h * 4] }}
                  transition={{ repeat: Infinity, duration: 1, delay: i * 0.1 }}
                  className="w-1 bg-primary rounded-full"
                />
              ))}
            </div>
            <div className="text-xs font-bold text-on-surface-variant uppercase tracking-tighter">Audio Level Optimal</div>
          </div>
        </div>
      </aside>
    </div>
  );
};
