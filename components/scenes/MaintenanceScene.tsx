import React from 'react';
import { Wrench } from 'lucide-react';
import { BorderedCard } from '../UI';

export const MaintenanceScene: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto mt-20">
      <BorderedCard title="SYSTEM_MAINTENANCE">
        <div className="flex flex-col items-center justify-center p-12 text-center space-y-6">
          <div className="p-6 bg-slate-800 rounded-full border border-cyan-500/30">
            <Wrench size={64} className="text-cyan-400 animate-pulse" />
          </div>
          <h2 className="anime-title text-4xl text-white">FEATURE_OFFLINE</h2>
          <p className="anime-text text-slate-400 max-w-md">
            This sector of the Neon Frontier is currently under heavy construction by our engineering drones. Please check back later for updates.
          </p>
        </div>
      </BorderedCard>
    </div>
  );
};
