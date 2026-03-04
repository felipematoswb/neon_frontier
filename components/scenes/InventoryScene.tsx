import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Character, Item, Stats, Slot } from '../../types';
import { BorderedCard, InventorySlot, WesternButton, EquipSlot, StatsBar } from '../UI';

interface InventorySceneProps {
    character: Character;
    totalStats: Stats;
    selectedInventoryIdx: number | null;
    setSelectedInventoryIdx: (idx: number | null) => void;
    onEquip: (idx: number) => void;
    onUnequip: (slot: Slot) => void;
}

export const InventoryScene: React.FC<InventorySceneProps> = ({ 
    character, 
    totalStats,
    selectedInventoryIdx, 
    setSelectedInventoryIdx, 
    onEquip,
    onUnequip
}) => {
    return (
        <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="flex flex-col">
                <div className="flex items-center gap-4 mb-8">
                   <div className="w-2 h-12 bg-cyan-500"></div>
                   <h2 className="anime-title text-4xl text-white font-black tracking-wide">
                     PILOT <span className="text-cyan-400">STATUS</span>
                   </h2>
                </div>

                <div className="aspect-[3/4] max-w-sm mx-auto w-full bg-slate-900/50 border border-slate-700 p-8 relative flex flex-col items-center tech-card-clip">
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(0,243,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,243,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
                  
                  <div className="absolute inset-0 flex items-center justify-center opacity-80 pointer-events-none">
                     <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Kaito&clothing=blazerAndShirt&eyes=surprised&hair=shaggyMullet&hairColor=platinum&skinColor=light" className="w-72 h-72 drop-shadow-[0_0_15px_rgba(0,243,255,0.3)]" alt="Hero" />
                  </div>

                  <div className="relative z-10 w-full h-full grid grid-cols-3 grid-rows-5 gap-4">
                    <div className="col-start-2 row-start-1"><EquipSlot slot="Hat" item={character.equipment.Hat} onUnequip={() => onUnequip('Hat')} /></div>
                    <div className="col-start-1 row-start-2"><EquipSlot slot="Revolver" item={character.equipment.Revolver} onUnequip={() => onUnequip('Revolver')} /></div>
                    <div className="col-start-2 row-start-2"><EquipSlot slot="Poncho" item={character.equipment.Poncho} onUnequip={() => onUnequip('Poncho')} /></div>
                    <div className="col-start-3 row-start-2"><EquipSlot slot="Rifle" item={character.equipment.Rifle} onUnequip={() => onUnequip('Rifle')} /></div>
                    <div className="col-start-2 row-start-3"><EquipSlot slot="Badge" item={character.equipment.Badge} onUnequip={() => onUnequip('Badge')} /></div>
                    <div className="col-start-1 row-start-5"><EquipSlot slot="Belt" item={character.equipment.Belt} onUnequip={() => onUnequip('Belt')} /></div>
                    <div className="col-start-3 row-start-5"><EquipSlot slot="Boots" item={character.equipment.Boots} onUnequip={() => onUnequip('Boots')} /></div>
                  </div>
                </div>

                <BorderedCard className="mt-10" title="BIO_METRICS">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
                    <StatsBar label="AIM" value={totalStats.aim} max={150} color="from-cyan-500 to-blue-500" tooltip="Dead-eye accuracy. Makes every bullet count." />
                    <StatsBar label="REFLEX" value={totalStats.reflexes} max={150} color="from-pink-500 to-red-500" tooltip="Fastest draw in the West. Strike first in duels." />
                    <StatsBar label="GRIT" value={totalStats.grit} max={150} color="from-yellow-500 to-orange-500" tooltip="Hardened resolve. Withstand the harshest conditions." />
                    <StatsBar label="CHARIS" value={totalStats.charisma} max={150} color="from-purple-500 to-indigo-500" tooltip="Silver-tongued charm. Influence folks and haggle prices." />
                    <StatsBar label="STAM" value={totalStats.stamina} max={150} color="from-green-500 to-emerald-500" tooltip="Iron-lunged endurance. Keep riding when others fall." />
                  </div>
                </BorderedCard>
            </div>

            <BorderedCard className="flex-1" title="CARGO_HOLD">
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                    <AnimatePresence>
                        {character.inventory.map((item, idx) => (
                        <motion.div
                            key={item ? (item.instanceId || `${item.id}-${idx}`) : `empty-${idx}`}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.2 }}
                        >
                            <InventorySlot 
                            item={item} 
                            isSelected={selectedInventoryIdx === idx} 
                            onClick={() => item && setSelectedInventoryIdx(selectedInventoryIdx === idx ? null : idx)} 
                            />
                        </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {selectedInventoryIdx !== null && character.inventory[selectedInventoryIdx] && (
                <div className="mt-8 p-6 bg-slate-900 border border-cyan-500/50 shadow-[0_0_20px_rgba(0,243,255,0.1)] relative animate-pop-in">
                    <div className="flex justify-between items-start mb-4">
                    <h4 className="anime-title text-2xl text-cyan-400">{character.inventory[selectedInventoryIdx]!.name}</h4>
                    <span className="bg-pink-900/50 px-3 py-1 text-[10px] anime-title text-pink-300 border border-pink-500">LVL: {character.level}</span>
                    </div>
                    <p className="anime-text text-sm text-slate-300 mb-6 leading-relaxed">
                    {character.inventory[selectedInventoryIdx]!.description}
                    </p>
                    <WesternButton 
                    onClick={() => onEquip(selectedInventoryIdx!)} 
                    className="w-full text-xl py-4"
                    variant="primary"
                    >
                    EQUIP_GEAR
                    </WesternButton>
                </div>
                )}
            </BorderedCard>
        </div>
    );
};
