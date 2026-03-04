
import React from 'react';
import { Character, LogType } from '../../types';
import { WesternButton } from '../UI';
import { generateDuelNarrative } from '../../services/geminiService';

interface ArenaSceneProps {
  character: Character;
  addLog: (message: string, type: LogType) => void;
  setIsLoadingNarrative: (loading: boolean) => void;
  isLoading: boolean;
  onUpdateCharacter: (updater: (prev: Character) => Character) => void;
}

export const ArenaScene: React.FC<ArenaSceneProps> = ({ character, addLog, setIsLoadingNarrative, isLoading, onUpdateCharacter }) => {
  const runDuel = async () => {
    const totalStats = { ...character.baseStats };
    // Assuming equipment stats logic should be handled here or passed in. 
    // For now, let's just use baseStats to keep it simple as per original logic.
    const win = (totalStats.aim + totalStats.reflexes + Math.random() * 20) > 40;
    
    addLog(`Combat sequence initiated against Viper-X.`, 'combat');
    addLog(`Analyzing opponent combat patterns...`, 'system');
    
    setIsLoadingNarrative(true);
    try {
      const story = await generateDuelNarrative(
        character.name, 
        character.species, 
        "Viper-X", 
        "Android Assassin", 
        win ? 'Win' : 'Loss'
      );
      
      addLog(story, 'combat');
      if (win) {
        addLog(`Target neutralized. Victory rewards: +250¥ | +150XP`, 'reward');
        onUpdateCharacter(prev => ({ ...prev, gold: prev.gold + 250, exp: prev.exp + 150 }));
      } else {
        addLog(`Critical damage sustained. Retreating to repair.`, 'combat');
      }
    } catch(e) {
      addLog("Combat log corrupted.", 'system');
    } finally {
      setIsLoadingNarrative(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[600px] border border-red-900/50 bg-slate-950 relative overflow-hidden">
       {/* Animated Background */}
       <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-1 bg-red-500 animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-red-500 animate-pulse"></div>
       </div>
       
       <div className="relative z-10 text-center mb-16">
          <h2 className="anime-title text-8xl text-red-500 animate-pulse drop-shadow-[0_0_20px_rgba(255,0,0,0.8)] italic">VS</h2>
          <p className="anime-title text-xl text-white mt-4 tracking-[1em] opacity-80">DEATHMATCH</p>
       </div>
       
       <div className="flex flex-col md:flex-row items-center space-y-16 md:space-y-0 md:space-x-40 relative z-10">
          <div className="flex flex-col items-center">
             <div className="w-48 h-48 border-2 border-cyan-500 bg-slate-900 p-2 shadow-[0_0_20px_rgba(0,243,255,0.3)] rounded-full overflow-hidden">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Kaito&clothing=blazerAndShirt&eyes=surprised" alt="Hero" className="w-full h-full object-cover" />
             </div>
             <span className="anime-title text-3xl mt-6 text-cyan-400 tracking-tighter">{character.name}</span>
             <div className="w-full h-2 bg-slate-800 mt-2 rounded overflow-hidden">
                <div className="w-[80%] h-full bg-cyan-500"></div>
             </div>
          </div>
          
          <div className="flex flex-col items-center">
             <div className="w-48 h-48 border-2 border-red-600 bg-slate-900 p-2 shadow-[0_0_20px_rgba(220,38,38,0.5)] rounded-full overflow-hidden">
                <img src="https://api.dicebear.com/7.x/bottts/svg?seed=ViperX" alt="Boss" className="w-full h-full object-cover" />
             </div>
             <span className="anime-title text-3xl mt-6 text-red-500 tracking-tighter">VIPER-X</span>
             <div className="w-full h-2 bg-slate-800 mt-2 rounded overflow-hidden">
                <div className="w-[100%] h-full bg-red-600"></div>
             </div>
          </div>
       </div>

       <WesternButton 
         variant="secondary" 
         className="mt-24 text-4xl px-24 py-8 shadow-[0_0_30px_rgba(236,72,153,0.4)]"
         onClick={runDuel}
         disabled={isLoading}
       >
         {isLoading ? "CALCULATING..." : "ENGAGE"}
       </WesternButton>
    </div>
  );
};
