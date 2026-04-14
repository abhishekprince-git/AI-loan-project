import React, { useState, useEffect, useRef } from 'react';
import { Sun, VolumeX, Wifi, AlertCircle, CheckCircle } from 'lucide-react';

export const EnvironmentCheckSection = ({ stream }) => {
  const [internet, setInternet] = useState('pending');
  const [lighting, setLighting] = useState('pending');
  const [noise, setNoise] = useState('pending');

  const audioContextRef = useRef(null);
  const animationFrameRef = useRef(null);

  // Internet Check
  useEffect(() => {
    const checkNetwork = () => {
      if (!navigator.onLine) {
        setInternet('poor');
        return;
      }
      
      const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      if (conn) {
        // If downlink is less than 1Mbps or rtt is high (>500ms), it's considered poor/weak
        if (conn.downlink < 1.0 || conn.rtt > 500) {
          setInternet('poor');
        } else {
          setInternet('good');
        }
      } else {
        setInternet('good'); // Fallback if online but no metrics API is available
      }
    };

    checkNetwork();
    
    // Listen to connection changes
    const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (conn) {
      conn.addEventListener('change', checkNetwork);
    }
    window.addEventListener('online', checkNetwork);
    window.addEventListener('offline', checkNetwork);

    return () => {
      if (conn) conn.removeEventListener('change', checkNetwork);
      window.removeEventListener('online', checkNetwork);
      window.removeEventListener('offline', checkNetwork);
    };
  }, []);

  // Lighting Check
  useEffect(() => {
    if (!stream || !stream.getVideoTracks().length) return;

    const videoElement = document.createElement('video');
    videoElement.muted = true;
    videoElement.playsInline = true;
    videoElement.srcObject = stream;

    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    let isUnmounted = false;
    let timerId = null;

    videoElement.play().then(() => {
      const checkBrightness = () => {
        if (isUnmounted) return;
        ctx.drawImage(videoElement, 0, 0, 64, 64);
        const imageData = ctx.getImageData(0, 0, 64, 64);
        let colorSum = 0;
        
        for (let i = 0; i < imageData.data.length; i += 4) {
          const r = imageData.data[i];
          const g = imageData.data[i + 1];
          const b = imageData.data[i + 2];
          // Standard rgb brightness calculation
          colorSum += Math.sqrt(0.299 * (r ** 2) + 0.587 * (g ** 2) + 0.114 * (b ** 2));
        }

        const averageBrightness = Math.floor(colorSum / (64 * 64)); // ranges ~0 to 255
        
        if (averageBrightness < 40) {
           setLighting('poor');
        } else {
           setLighting('good');
        }

        // Re-check periodically
        timerId = setTimeout(checkBrightness, 2000);
      };
      
      checkBrightness();
    }).catch(err => {
      console.warn("Could not start hidden video for lighting check", err);
    });

    return () => {
      isUnmounted = true;
      clearTimeout(timerId);
      videoElement.pause();
      videoElement.srcObject = null;
    };
  }, [stream]);

  // Noise Check
  useEffect(() => {
    if (!stream || !stream.getAudioTracks().length) return;

    let isUnmounted = false;
    
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      audioContextRef.current = audioCtx;
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.8;
      
      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const checkVolume = () => {
        if (isUnmounted) return;
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const average = sum / bufferLength;

        // If average frequency amplitude is high continuously, it's noisy. 
        // 50 is an arbitrary threshold that usually means background noise is too high.
        if (average > 50) {
           setNoise('poor');
        } else {
           setNoise('good');
        }

        // Loop using requestAnimationFrame (~60fps) but we could also throttle this.
        animationFrameRef.current = requestAnimationFrame(checkVolume);
      };

      checkVolume();
    } catch (e) {
       console.warn("Audio Context init fail", e);
    }

    return () => {
      isUnmounted = true;
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, [stream]);

  const config = {
    lighting: { icon: <Sun size={24} />, label: 'Good lighting', status: lighting },
    internet: { icon: <Wifi size={24} />, label: 'Stable internet', status: internet },
    noise: { icon: <VolumeX size={24} />, label: 'Quiet room', status: noise }
  };

  const getStatusClasses = (status) => {
    if (status === 'good') return 'bg-green-500/10 text-green-500 border-green-500/30';
    if (status === 'poor') return 'bg-orange-500/10 text-orange-500 border-orange-500/30';
    return 'bg-surface-container text-primary/60 border-transparent';
  };

  const getStatusIcon = (status) => {
    if (status === 'good') return <CheckCircle size={14} className="text-green-500 absolute top-2 right-2" />;
    if (status === 'poor') return <AlertCircle size={14} className="text-orange-500 absolute top-2 right-2" />;
    return null;
  };

  const getLabel = (baseLabel, status) => {
    if (status !== 'poor') return baseLabel;
    if (baseLabel === 'Good lighting') return 'Poor lighting';
    if (baseLabel === 'Stable internet') return 'Weak connection';
    if (baseLabel === 'Quiet room') return 'Noisy room';
    return baseLabel;
  };

  return (
    <section className="bg-surface-container-lowest rounded-xl p-5 sm:p-6 lg:p-8 ambient-bloom">
      <h3 className="text-xl font-semibold tracking-tight mb-6 sm:mb-8">Environment Check</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.values(config).map((item, i) => (
          <div 
            key={i} 
            className={`relative p-6 rounded-xl text-center space-y-3 transition-colors border ${getStatusClasses(item.status)}`}
          >
            {getStatusIcon(item.status)}
            <div className={`flex justify-center transition-colors ${item.status === 'pending' ? 'opacity-60 text-primary' : ''}`}>
              {item.icon}
            </div>
            <p className="text-sm font-medium">
              {getLabel(item.label, item.status)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};
