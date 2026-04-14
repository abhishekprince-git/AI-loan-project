import React from 'react';
import { CheckCircle, MapPin, Mic, Video, AlertCircle } from 'lucide-react';

export const RequiredPermissionsSection = ({ permissions, errors = {}, onTogglePermission }) => (
  <section className="bg-surface-container-lowest rounded-xl p-5 sm:p-6 lg:p-8 ambient-bloom">
    <div className="flex items-center justify-between gap-4 mb-6 sm:mb-8">
      <h3 className="text-xl font-semibold tracking-tight">Required Permissions</h3>
      <span className="text-xs font-medium text-primary px-3 py-1 bg-primary/10 rounded-full">Mandatory</span>
    </div>
    <div className="space-y-6">
      {[
        { id: 'camera', icon: <Video size={20} />, title: 'Camera Access', desc: 'Required for identity verification' },
        { id: 'mic', icon: <Mic size={20} />, title: 'Microphone Access', desc: 'For clear communication with agents' },
        { id: 'location', icon: <MapPin size={20} />, title: 'Location Access', desc: 'Required for regional compliance' }
      ].map((item, i) => {
        const isAllowed = permissions[item.id];
        const isError = errors[item.id];
        
        return (
          <button
            key={i}
            onClick={() => onTogglePermission(item.id)}
            className={`w-full flex items-center justify-between p-4 bg-surface-container-low rounded-xl border transition-all group ${isError ? 'border-red-500/30 hover:border-red-500/50' : 'border-outline-variant/10 hover:border-primary/30'}`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isAllowed ? 'bg-primary/10 text-primary' : isError ? 'bg-red-500/10 text-red-500' : 'bg-surface-container-highest text-on-surface-variant'}`}>
                {item.icon}
              </div>
              <div className="text-left">
                <p className="font-medium">{item.title}</p>
                <p className="text-xs text-on-surface-variant">{item.desc}</p>
                {isError && <p className="text-xs text-red-500 mt-0.5">{isError}</p>}
              </div>
            </div>
            <div className={`flex items-center gap-2 font-semibold text-sm transition-colors ${isAllowed ? 'text-primary' : isError ? 'text-red-500' : 'text-on-surface-variant opacity-40'}`}>
              {isAllowed ? <CheckCircle size={14} /> : isError ? <AlertCircle size={14} /> : <div className="w-3.5 h-3.5 border-2 border-current rounded-full" />}
              {isAllowed ? 'Allowed' : isError ? 'Denied' : 'Grant'}
            </div>
          </button>
        );
      })}
    </div>
  </section>
);
