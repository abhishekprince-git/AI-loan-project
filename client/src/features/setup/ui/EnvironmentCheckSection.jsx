import React from 'react';
import { Sun, VolumeX, Wifi } from 'lucide-react';

export const EnvironmentCheckSection = () => (
  <section className="bg-surface-container-lowest rounded-xl p-5 sm:p-6 lg:p-8 ambient-bloom">
    <h3 className="text-xl font-semibold tracking-tight mb-6 sm:mb-8">Environment Check</h3>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[
        { icon: <Sun size={24} />, label: 'Good lighting' },
        { icon: <Wifi size={24} />, label: 'Stable internet' },
        { icon: <VolumeX size={24} />, label: 'Quiet room' }
      ].map((item, i) => (
        <div key={i} className="p-6 bg-surface-container rounded-xl text-center space-y-3">
          <div className="flex justify-center text-primary opacity-60">{item.icon}</div>
          <p className="text-sm font-medium">{item.label}</p>
        </div>
      ))}
    </div>
  </section>
);
