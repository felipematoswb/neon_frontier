
import React from 'react';
import { Quest, Character, LogType } from '../../types';
import { QUESTS } from '../../constants';
import { BorderedCard, WesternButton } from '../UI';
import { generateQuestNarrative } from '../../services/geminiService';
import { Compass, Loader2 } from 'lucide-react';

interface SaloonSceneProps {
  character: Character;
  activeQuest: { quest: Quest; timeRemaining: number; startTime: number } | null;
  startQuest: (quest: Quest) => void;
  addLog: (message: string, type: LogType) => void;
  setIsLoadingNarrative: (loading: boolean) => void;
  isLoadingNarrative: boolean;
}

export const SaloonScene: React.FC<SaloonSceneProps> = ({
  character,
  activeQuest,
  startQuest,
  addLog,
  setIsLoadingNarrative,
  isLoadingNarrative
}) => {

  const handleExpedition = async () => {
    if (isLoadingNarrative) return;
    
    setIsLoadingNarrative(true);
    addLog("Initializing expedition protocols... Scouting wild sectors...", 'system');
    
    const randomQuest = QUESTS[Math.floor(Math.random() * QUESTS.length)];
    
    try {
        const timeoutPromise = new Promise<string>((_, reject) => 
            setTimeout(() => reject(new Error("Expedition timeout")), 10000)
        );

        const narrative = await Promise.race([
            generateQuestNarrative(randomQuest.title, character.name, character.species),
            timeoutPromise
        ]);
        
        addLog(`Expedition Report: ${narrative}`, 'quest');
    } catch (e) {
        addLog("Expedition failed: Signal interference detected. Please retry.", 'system');
    } finally {
        setIsLoadingNarrative(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
       <h2 className="anime-title text-6xl mb-12 text-white text-center drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
         <span className="text-cyan-500">NEO</span>_HUB
       </h2>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <BorderedCard title="MISSION_BOARD">
            <div className="space-y-4">
              {QUESTS.map(q => (
                <div key={q.id} className="p-4 bg-slate-800/50 border border-slate-600 flex justify-between items-center group hover:border-cyan-400 transition-all cursor-pointer relative overflow-hidden">
                  <div className="absolute inset-0 bg-cyan-500/5 translate-x-[-100%] group-hover:translate-x-0 transition-transform"></div>
                  <div className="relative z-10">
                    <h4 className="anime-title text-lg text-white group-hover:text-cyan-300">{q.title}</h4>
                    <div className="text-[10px] anime-title text-slate-400 mt-2 flex items-center gap-2">
                      <span className="bg-slate-900 px-2 border border-slate-700 text-pink-400">{q.difficulty}</span>
                      <span className="text-cyan-600">REWARD: {q.reward.gold}¥ | {q.reward.exp}XP</span>
                    </div>
                  </div>
                  <WesternButton 
                    variant="secondary" 
                    disabled={!!activeQuest}
                    onClick={() => startQuest(q)}
                    className="py-1 px-4 text-xs z-10"
                  >
                    ACCEPT
                  </WesternButton>
                </div>
              ))}
            </div>
          </BorderedCard>
          <div className="space-y-8">
            <div className="aspect-video bg-black border border-slate-700 relative overflow-hidden group rounded-lg">
               <img src="https://images.unsplash.com/photo-1534234828563-025317354318?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover opacity-60 hover:scale-110 transition-all duration-700" alt="Cyberpunk City" />
               <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
               <div className="absolute bottom-4 left-4 flex items-center gap-3">
                  <div className="w-2 h-2 bg-pink-500 rounded-full animate-ping"></div>
                  <span className="anime-title text-2xl text-white drop-shadow-lg">SECTOR_7</span>
               </div>
            </div>
            
            <BorderedCard title="FREE_ROAM">
               <div className="flex flex-col gap-4">
                 <p className="anime-text text-sm text-slate-400">
                   Venture into the unknown. Generate a random narrative event based on your character.
                 </p>
                 <WesternButton 
                    variant="accent"
                    onClick={handleExpedition}
                    disabled={isLoadingNarrative}
                    className={`w-full py-4 flex justify-center items-center shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:shadow-[0_0_25px_rgba(168,85,247,0.5)] transition-shadow`}
                 >
                    {isLoadingNarrative ? (
                        <>
                            <Loader2 size={20} className="mr-2 animate-spin" />
                            SCOUTING...
                        </>
                    ) : (
                        <>
                            <Compass size={20} className="mr-2" />
                            EMBARK EXPEDITION
                        </>
                    )}
                 </WesternButton>
               </div>
            </BorderedCard>

            <BorderedCard title="GLOBAL_CHAT">
               <p className="anime-text text-xs text-green-400 leading-relaxed font-mono">
                 &gt; User_99: Anyone seen the Void Dragon yet?<br/>
                 &gt; Admin: Bounty updated for Sector 4.<br/>
                 &gt; Kaito: LFG Daily Raid.
               </p>
            </BorderedCard>
          </div>
       </div>
    </div>
  );
};
