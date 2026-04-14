import React, { useState } from 'react';
import { 
  Bell, 
  Lock, 
  Eye, 
  Globe, 
  Moon, 
  Smartphone, 
  Shield, 
  ChevronRight,
  Database,
  Cloud
} from 'lucide-react';
import { motion } from 'motion/react';

export const ScreenSettings = () => {
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    twoFactor: true,
    biometrics: true,
    cloudSync: true
  });

  const toggle = (key) => setSettings(prev => ({ ...prev, [key]: !prev[key] }));

  const SettingToggle = ({ icon, title, desc, active, onToggle }) => (
    <div className="flex items-center justify-between p-6 bg-surface-container-low rounded-2xl border border-outline-variant/5 hover:border-primary/20 transition-all group">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${active ? 'bg-primary/10 text-primary' : 'bg-surface-container-high text-on-surface-variant'}`}>
          {icon}
        </div>
        <div>
          <h4 className="font-bold text-on-surface">{title}</h4>
          <p className="text-xs text-on-surface-variant font-medium">{desc}</p>
        </div>
      </div>
      <button 
        onClick={onToggle}
        className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${active ? 'bg-primary' : 'bg-surface-container-highest'}`}
      >
        <motion.div 
          animate={{ x: active ? 24 : 4 }}
          className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
        />
      </button>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-10 lg:py-12">
      <div className="mb-8 sm:mb-10 lg:mb-12">
        <h2 className="text-3xl sm:text-5xl font-bold tracking-[-0.02em] text-on-surface mb-2">System Settings</h2>
        <p className="text-on-surface-variant text-base sm:text-lg">Manage your application preferences and security protocols.</p>
      </div>

      <div className="space-y-8 sm:space-y-10">
        <section>
          <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-6">General Preferences</h3>
          <div className="grid gap-4">
            <SettingToggle 
              icon={<Bell size={20} />} 
              title="Push Notifications" 
              desc="Receive real-time updates on your application status" 
              active={settings.notifications}
              onToggle={() => toggle('notifications')}
            />
            <SettingToggle 
              icon={<Moon size={20} />} 
              title="Dark Mode" 
              desc="Switch to a darker interface for low-light environments" 
              active={settings.darkMode}
              onToggle={() => toggle('darkMode')}
            />
            <SettingToggle 
              icon={<Globe size={20} />} 
              title="Regional Compliance" 
              desc="Automatically adjust settings based on your location" 
              active={true}
              onToggle={() => {}}
            />
          </div>
        </section>

        <section>
          <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-6">Security & Privacy</h3>
          <div className="grid gap-4">
            <SettingToggle 
              icon={<Lock size={20} />} 
              title="Two-Factor Authentication" 
              desc="Add an extra layer of security to your account" 
              active={settings.twoFactor}
              onToggle={() => toggle('twoFactor')}
            />
            <SettingToggle 
              icon={<Smartphone size={20} />} 
              title="Biometric Login" 
              desc="Use FaceID or Fingerprint for faster access" 
              active={settings.biometrics}
              onToggle={() => toggle('biometrics')}
            />
            <div className="flex items-center justify-between p-6 bg-surface-container-low rounded-2xl border border-outline-variant/5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-surface-container-high text-on-surface-variant flex items-center justify-center">
                  <Shield size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-on-surface">Privacy Audit</h4>
                  <p className="text-xs text-on-surface-variant font-medium">Last performed: 2 days ago</p>
                </div>
              </div>
              <button className="text-primary text-sm font-bold flex items-center gap-1 hover:underline">
                View Report <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-6">Data Management</h3>
          <div className="grid gap-4">
            <SettingToggle 
              icon={<Cloud size={20} />} 
              title="Cloud Sync" 
              desc="Keep your data synchronized across all devices" 
              active={settings.cloudSync}
              onToggle={() => toggle('cloudSync')}
            />
            <div className="flex items-center justify-between p-6 bg-surface-container-low rounded-2xl border border-outline-variant/5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-surface-container-high text-on-surface-variant flex items-center justify-center">
                  <Database size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-on-surface">Export Data</h4>
                  <p className="text-xs text-on-surface-variant font-medium">Download a copy of your personal records</p>
                </div>
              </div>
              <button onClick={() => alert("Preparing data export...")} className="px-4 py-2 bg-surface-container-highest rounded-lg text-xs font-bold hover:bg-surface-container transition-colors">
                Request Export
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
