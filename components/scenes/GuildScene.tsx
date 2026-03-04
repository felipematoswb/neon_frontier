
import React from 'react';
import { WesternButton } from '../UI';
import { Scene } from '../../types';

interface GuildSceneProps {
  onNavigate: (scene: Scene) => void;
  currentScene: Scene;
}

export const GuildScene: React.FC<GuildSceneProps> = ({ onNavigate, currentScene }) => {
  return (
    <div className="flex flex-col items-center justify-center h-96 text-center">
      <h2 className="anime-title text-7xl text-slate-700 mb-6 font-black select-none opacity-50">LOCKED</h2>
      <div className="bg-slate-900 p-8 max-w-lg border border-red-500/30 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-red-500/5 animate-pulse"></div>
        <p className="anime-title text-2xl text-red-400 mb-4 z-10 relative">ACCESS DENIED</p>
        <p className="anime-text text-sm text-slate-400 z-10 relative">System maintenance in progress for {currentScene}. Please try again later.</p>
      </div>
      <WesternButton variant="accent" className="mt-12" onClick={() => onNavigate('Character')}>RETURN</WesternButton>
    </div>
  );
};
