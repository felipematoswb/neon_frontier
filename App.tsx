
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Character, Item, Scene, Slot, Quest, Recipe, LogEntry, LogType, ItemRarity } from './types';
import { INITIAL_ITEMS, QUESTS, SHOP_ITEMS } from './constants';
import { WesternButton, BorderedCard, StatsBar, EquipSlot, InventorySlot } from './components/UI';
import { SaloonScene } from './components/scenes/SaloonScene';
import { GuildScene } from './components/scenes/GuildScene';
import { ArenaScene } from './components/scenes/ArenaScene';
import { SynthForgeScene } from './components/scenes/SynthForgeScene';
import { MaintenanceScene } from './components/scenes/MaintenanceScene';
import { ShopScene } from './components/scenes/ShopScene';
import { InventoryScene } from './components/scenes/InventoryScene';
import { generateQuestNarrative } from './services/geminiService';
import { User, Trophy, Activity, Sword, Target, Hammer, Terminal, ChevronRight, Radio, Briefcase, ShoppingBag, Globe, Users, Map, Castle, Shield, ScrollText } from 'lucide-react';

const GRID_SIZE = 20;

const SidebarButton = ({ onClick, icon: Icon, label, active }: { onClick: () => void, icon: any, label: string, active: boolean }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 p-2 text-sm transition-all ${
      active 
      ? 'text-cyan-300 bg-cyan-900/30 border-l-4 border-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.3)]' 
      : 'text-slate-400 hover:text-white hover:bg-white/5 border-l-4 border-transparent'
    }`}
  >
    <Icon size={16} />
    {label}
  </button>
);

const App: React.FC = () => {
  // --- State Management ---
  const [character, setCharacter] = useState<Character>({
    name: 'Kaito "Star-Shot"',
    species: 'Cyborg Human',
    level: 1,
    exp: 0,
    gold: 500,
    baseStats: { aim: 15, reflexes: 12, grit: 10, charisma: 8, stamina: 12 },
    equipment: { Hat: null, Revolver: null, Rifle: null, Poncho: null, Boots: null, Badge: null, Belt: null, Material: null },
    inventory: Array(GRID_SIZE).fill(null).map((_, i) => INITIAL_ITEMS[i] ? { ...INITIAL_ITEMS[i], instanceId: `${INITIAL_ITEMS[i].id}-${i}` } : null)
  });

  const [currentScene, setCurrentScene] = useState<Scene>('Character');
  const [activeQuest, setActiveQuest] = useState<{ quest: Quest; timeRemaining: number; startTime: number } | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([
    { id: 'init', timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" }), message: "System initialized. Welcome, Hunter.", type: 'system' }
  ]);
  const [isLoadingNarrative, setIsLoadingNarrative] = useState(false);
  const [selectedInventoryIdx, setSelectedInventoryIdx] = useState<number | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  
  const logEndRef = useRef<HTMLDivElement>(null);

  // --- Derived State ---
  const totalStats = useMemo(() => {
    const stats = { ...character.baseStats };
    (Object.values(character.equipment) as (Item | null)[]).forEach(item => {
      if (item?.stats) {
        Object.entries(item.stats).forEach(([stat, val]) => {
          if (typeof val === 'number') (stats as any)[stat] += val;
        });
      }
    });
    return stats;
  }, [character]);

  // --- Effects ---
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs, isLoadingNarrative]);

  useEffect(() => {
    if (!activeQuest) return;
    const timer = setInterval(() => {
      setActiveQuest(prev => {
        if (!prev) return null;
        const remaining = Math.max(0, prev.quest.duration - Math.floor((Date.now() - prev.startTime) / 1000));
        if (remaining === 0) {
          completeQuest(prev.quest);
          return null;
        }
        return { ...prev, timeRemaining: remaining };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [activeQuest]);

  // --- Actions ---
  const addLog = (message: string, type: LogType = 'system') => {
    const now = new Date();
    const timestamp = now.toLocaleTimeString('en-US', { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" });
    setLogs(prev => {
      const newLogs = [...prev, { id: Math.random().toString(36).substring(2, 9), timestamp, message, type }];
      return newLogs.slice(-100); 
    });
  };

  const completeQuest = async (quest: Quest) => {
    setIsLoadingNarrative(true);
    addLog(`Objective "${quest.title}" phase complete. Uploading mission data...`, 'quest');
    
    try {
      const story = await generateQuestNarrative(quest.title, character.name, character.species);
      addLog(story, 'quest');
      addLog(`Mission Rewards Processed: +${quest.reward.gold}¥ | +${quest.reward.exp}XP`, 'reward');
      
      setCharacter(prev => ({ 
        ...prev, 
        gold: prev.gold + quest.reward.gold, 
        exp: prev.exp + quest.reward.exp, 
        level: Math.floor((prev.exp + quest.reward.exp) / 1000) + 1 
      }));
    } catch (e) {
      addLog("Mission data corrupted during upload.", 'system');
    } finally {
      setIsLoadingNarrative(false);
    }
  };

  const handleEquip = (idx: number) => {
    const item = character.inventory[idx];
    if (!item) return;
    if (item.slot === 'Material') {
      addLog(`Cannot equip raw materials. Use them at the Synth-Forge.`, 'system');
      return;
    }
    const slot = item.slot;
    const currentEquipped = character.equipment[slot];
    setCharacter(prev => {
      const newInventory = [...prev.inventory];
      newInventory[idx] = currentEquipped;
      return { ...prev, equipment: { ...prev.equipment, [slot]: item }, inventory: newInventory };
    });
    addLog(`Equipped ${item.name} to ${slot} slot.`, 'system');
    setSelectedInventoryIdx(null);
  };

  const handleUnequip = (slot: Slot) => {
    const item = character.equipment[slot];
    if (!item) return;
    setCharacter(prev => {
      const emptyIdx = prev.inventory.findIndex(i => i === null);
      if (emptyIdx === -1) {
        addLog("Inventory full. Cannot unequip.", 'system');
        return prev;
      }
      const newInventory = [...prev.inventory];
      newInventory[emptyIdx] = item;
      return { ...prev, equipment: { ...prev.equipment, [slot]: null }, inventory: newInventory };
    });
    addLog(`Unequipped ${item.name}.`, 'system');
  };

  const startQuest = (quest: Quest) => {
    if (activeQuest) return;
    setActiveQuest({ quest, timeRemaining: quest.duration, startTime: Date.now() });
    addLog(`Accepted contract: ${quest.title}. Deploying to sector...`, 'quest');
  };

  const handleBuyItem = (item: Item) => {
    if (character.gold < item.price) {
      addLog(`Insufficient credits for ${item.name}.`, 'system');
      return;
    }
    const emptyIdx = character.inventory.findIndex(i => i === null);
    if (emptyIdx === -1) {
      addLog(`Inventory full. Cannot buy ${item.name}.`, 'system');
      return;
    }
    setCharacter(prev => {
      const newInv = [...prev.inventory];
      newInv[emptyIdx] = { ...item, instanceId: `${item.id}-${Date.now()}` };
      return { ...prev, gold: prev.gold - item.price, inventory: newInv };
    });
    addLog(`Purchased ${item.name} for ${item.price}¥.`, 'reward');
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row relative z-10">
      <div className="fixed inset-0 pointer-events-none scanline z-50"></div>
      {/* Sidebar Navigation */}
      <nav className="w-full md:w-72 bg-slate-900/90 border-r border-cyan-500/20 flex flex-col p-6 z-20 backdrop-blur-md">
        <div className="mb-10 text-center group">
          <div className="relative inline-block">
             <div className="absolute inset-0 bg-cyan-500/20 skew-x-12 -z-10 blur-xl"></div>
             <h1 className="anime-title text-5xl text-white italic font-black drop-shadow-[0_0_10px_rgba(0,243,255,0.8)] tracking-tighter">
              NEON<br/><span className="text-cyan-400">FRONTIER</span>
            </h1>
          </div>
          <div className="text-[10px] anime-title text-pink-500 mt-2 tracking-[0.3em] font-bold">SPACE_BOUNTY_RPG_V1.0</div>
        </div>

        <div className="space-y-1 overflow-y-auto max-h-[calc(100vh-300px)] custom-scrollbar">
          <div className="text-[10px] text-slate-500 font-bold tracking-widest px-3 pt-2">DASHBOARD</div>
          <SidebarButton onClick={() => setCurrentScene('Character')} icon={User} label="Dashboard" active={currentScene === 'Character'} />
          <SidebarButton onClick={() => setCurrentScene('Maintenance')} icon={Activity} label="Character Stats" active={currentScene === 'Maintenance'} />
          
          <div className="text-[10px] text-slate-500 font-bold tracking-widest px-3 pt-4">TAVERN</div>
          <SidebarButton onClick={() => setCurrentScene('Dashboard')} icon={Terminal} label="Dashboard" active={currentScene === 'Dashboard'} />
          <SidebarButton onClick={() => setCurrentScene('CharacterStats')} icon={User} label="Stats" active={currentScene === 'CharacterStats'} />
          <SidebarButton onClick={() => setCurrentScene('Jobs')} icon={Briefcase} label="Jobs" active={currentScene === 'Jobs'} />
          <SidebarButton onClick={() => setCurrentScene('Inventory')} icon={Briefcase} label="Inventory" active={currentScene === 'Inventory'} />
          <SidebarButton onClick={() => setCurrentScene('Shop')} icon={ShoppingBag} label="Store" active={currentScene === 'Shop'} />
          <SidebarButton onClick={() => setCurrentScene('Market')} icon={Globe} label="Market" active={currentScene === 'Market'} />
          <SidebarButton onClick={() => setCurrentScene('Mercenaries')} icon={Users} label="Mercenaries" active={currentScene === 'Mercenaries'} />

          <div className="text-[10px] text-slate-500 font-bold tracking-widest px-3 pt-4">PVE</div>
          <SidebarButton onClick={() => setCurrentScene('Expeditions')} icon={Map} label="Expeditions" active={currentScene === 'Expeditions'} />
          <SidebarButton onClick={() => setCurrentScene('Dungeons')} icon={Castle} label="Dungeons" active={currentScene === 'Dungeons'} />
          
          <div className="text-[10px] text-slate-500 font-bold tracking-widest px-3 pt-4">PVP</div>
          <SidebarButton onClick={() => setCurrentScene('Arena')} icon={Sword} label="Arena" active={currentScene === 'Arena'} />
          
          <div className="text-[10px] text-slate-500 font-bold tracking-widest px-3 pt-4">GUILD</div>
          <SidebarButton onClick={() => setCurrentScene('Quests')} icon={ScrollText} label="Quests" active={currentScene === 'Quests'} />
          <SidebarButton onClick={() => setCurrentScene('Guilds')} icon={Shield} label="Guilds" active={currentScene === 'Guilds'} />

          <div className="text-[10px] text-slate-500 font-bold tracking-widest px-3 pt-4">CRAFTING</div>
          <SidebarButton onClick={() => setCurrentScene('Blacksmith')} icon={Hammer} label="Blacksmith" active={currentScene === 'Blacksmith'} />
        </div>

        <div className="mt-auto pt-6 border-t border-slate-700">
          <div className="flex justify-between items-center mb-4 text-cyan-400">
            <div className="flex flex-col items-center">
              <span className="text-[9px] anime-title text-slate-400">CREDITS</span>
              <div className="flex items-center space-x-1">
                <span className="anime-title font-bold text-xl">¥{character.gold}</span>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[9px] anime-title text-slate-400">RANK</span>
              <div className="flex items-center space-x-1">
                <Trophy size={14} className="text-pink-500" />
                <span className="anime-title font-bold text-xl">{character.level}</span>
              </div>
            </div>
          </div>
          <StatsBar label="REP_LEVEL" value={character.exp % 1000} max={1000} color="from-pink-500 to-purple-600" />
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-10 relative">
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-slate-900 to-transparent opacity-80 pointer-events-none"></div>

        {/* Console Log */}
        <div className="mb-10 max-w-6xl mx-auto">
          <div className="bg-slate-950/95 border border-cyan-500/30 tech-border flex flex-col shadow-[0_0_40px_rgba(0,0,0,0.6)] rounded-lg overflow-hidden">
             
             <div className="bg-slate-900 p-2 px-4 border-b border-cyan-500/20 flex justify-between items-center">
                <div className="flex items-center gap-2">
                   <Terminal size={16} className="text-cyan-400" />
                   <span className="anime-title text-xs text-cyan-100 tracking-widest">SYSTEM_CONSOLE_LOG // V.2.4.1</span>
                </div>
                <div className="flex gap-2">
                   <div className="w-3 h-3 bg-red-500/20 rounded-full border border-red-500/50"></div>
                   <div className="w-3 h-3 bg-yellow-500/20 rounded-full border border-yellow-500/50"></div>
                   <div className="w-3 h-3 bg-green-500/20 rounded-full border border-green-500/50"></div>
                </div>
             </div>

             <div className="h-48 overflow-y-auto p-4 font-mono text-sm bg-black/80 space-y-2 relative custom-scrollbar">
                {logs.length === 0 && <div className="text-slate-600 italic">No activity recorded...</div>}
                
                {logs.map((log) => (
                   <div key={log.id} className="flex gap-3 animate-in fade-in duration-300">
                      <span className="text-slate-600 select-none">[{log.timestamp}]</span>
                      <span className={`
                         ${log.type === 'system' ? 'text-slate-400' : ''}
                         ${log.type === 'combat' ? 'text-red-400' : ''}
                         ${log.type === 'quest' ? 'text-cyan-400' : ''}
                         ${log.type === 'reward' ? 'text-yellow-400 font-bold' : ''}
                         ${log.type === 'craft' ? 'text-orange-400 font-bold' : ''}
                      `}>
                         {log.type === 'system' && <span className="mr-2 text-slate-600">{'>'}</span>}
                         {log.type === 'combat' && <Sword size={12} className="inline mr-2 text-red-600" />}
                         {log.type === 'quest' && <Activity size={12} className="inline mr-2 text-cyan-600" />}
                         {log.type === 'reward' && <Trophy size={12} className="inline mr-2 text-yellow-600" />}
                         {log.type === 'craft' && <Hammer size={12} className="inline mr-2 text-orange-600" />}
                         {log.message}
                      </span>
                   </div>
                ))}

                {isLoadingNarrative && (
                   <div className="flex gap-3 items-center text-pink-400 animate-pulse">
                      <span className="text-slate-600">[{new Date().toLocaleTimeString('en-US', { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" })}]</span>
                      <span className="flex items-center gap-2">
                         <Radio size={12} className="animate-spin" />
                         DECODING_INCOMING_TRANSMISSION...
                      </span>
                   </div>
                )}
                <div ref={logEndRef} />
             </div>

             {activeQuest && (
              <div className="bg-slate-900/80 p-2 border-t border-cyan-500/20">
                <div className="flex justify-between text-[10px] anime-title text-slate-400 mb-1 font-bold px-2">
                  <span className="flex items-center gap-2"><Activity size={12} className="text-pink-500" /> ACTIVE_OP: {activeQuest.quest.title}</span>
                  <span className="text-pink-400 font-mono">{activeQuest.timeRemaining.toFixed(1)}s REMAINING</span>
                </div>
                <div className="h-1 bg-slate-800 w-full overflow-hidden rounded-full mx-2 max-w-[calc(100%-16px)]">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-500 to-pink-500 shadow-[0_0_10px_#ec4899]" 
                    style={{ width: `${(activeQuest.timeRemaining / activeQuest.quest.duration) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="max-w-7xl mx-auto">
          {currentScene === 'Character' && (
            <div className="grid grid-cols-1 gap-8">
              <div className="space-y-8">
                <BorderedCard title="CHARACTER_SUMMARY">
                    <p className="text-slate-400">Welcome back, Pilot. Check your inventory to manage gear or visit the store to upgrade your loadout.</p>
                </BorderedCard>
              </div>
            </div>
          )}

          {currentScene === 'Dashboard' && <MaintenanceScene />}
          {currentScene === 'CharacterStats' && <MaintenanceScene />}
          {currentScene === 'Expeditions' && <MaintenanceScene />}
          {currentScene === 'Dungeons' && <MaintenanceScene />}
          {currentScene === 'Market' && <MaintenanceScene />}
          {currentScene === 'Mercenaries' && <MaintenanceScene />}
          {currentScene === 'Guilds' && <MaintenanceScene />}

          {currentScene === 'Jobs' && (
             <SaloonScene 
                character={character}
                activeQuest={activeQuest}
                startQuest={startQuest}
                addLog={addLog}
                setIsLoadingNarrative={setIsLoadingNarrative}
                isLoadingNarrative={isLoadingNarrative}
             />
          )}

          {currentScene === 'Arena' && (
            <ArenaScene 
              character={character}
              addLog={addLog}
              setIsLoadingNarrative={setIsLoadingNarrative}
              isLoading={isLoadingNarrative}
              onUpdateCharacter={setCharacter}
            />
          )}

          {currentScene === 'Blacksmith' && (
             <SynthForgeScene 
                character={character}
                selectedRecipe={selectedRecipe}
                onSelectRecipe={setSelectedRecipe}
                addLog={addLog}
                onUpdateCharacter={setCharacter}
             />
          )}

          {currentScene === 'Quests' && (
             <GuildScene 
                currentScene={currentScene}
                onNavigate={setCurrentScene}
             />
          )}

          {currentScene === 'Inventory' && (
            <InventoryScene 
              character={character}
              totalStats={totalStats}
              selectedInventoryIdx={selectedInventoryIdx}
              setSelectedInventoryIdx={setSelectedInventoryIdx}
              onEquip={handleEquip}
              onUnequip={handleUnequip}
            />
          )}

          {currentScene === 'Maintenance' && (
             <MaintenanceScene />
          )}

          {currentScene === 'Shop' && (
            <ShopScene 
              character={character}
              onBuy={handleBuyItem}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
