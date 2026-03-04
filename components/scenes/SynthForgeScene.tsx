
import React from 'react';
import { Character, Recipe, LogType } from '../../types';
import { RECIPES } from '../../constants';
import { WesternButton, BorderedCard } from '../UI';
import { Hammer, Cpu, Package, ArrowRight } from 'lucide-react';

interface SynthForgeSceneProps {
  character: Character;
  selectedRecipe: Recipe | null;
  onSelectRecipe: (recipe: Recipe) => void;
  addLog: (message: string, type: LogType) => void;
  onUpdateCharacter: (updater: (prev: Character) => Character) => void;
}

export const SynthForgeScene: React.FC<SynthForgeSceneProps> = ({ 
  character, 
  selectedRecipe, 
  onSelectRecipe, 
  addLog,
  onUpdateCharacter
}) => {
  const handleCraft = () => {
    if (!selectedRecipe) return;

    const tempInventory = [...character.inventory];
    const indicesToConsume: number[] = [];
    let canCraft = true;

    // Check availability
    selectedRecipe.ingredients.forEach(ing => {
      let needed = ing.count;
      for (let i = 0; i < tempInventory.length; i++) {
        if (tempInventory[i]?.id === ing.itemId && !indicesToConsume.includes(i) && needed > 0) {
          indicesToConsume.push(i);
          needed--;
        }
      }
      if (needed > 0) canCraft = false;
    });

    if (!canCraft) {
      addLog(`Fabrication failed: Insufficient materials for ${selectedRecipe.name}.`, 'system');
      return;
    }

    const freeSlots = tempInventory.filter((item, idx) => item === null || indicesToConsume.includes(idx)).length;
    if (freeSlots === 0) {
       addLog(`Fabrication failed: Output bay full. Clear inventory space.`, 'system');
       return;
    }

    onUpdateCharacter(prev => {
      const newInv = [...prev.inventory];
      indicesToConsume.forEach(idx => newInv[idx] = null);
      
      const targetIdx = newInv.findIndex(i => i === null);
      if (targetIdx !== -1) {
         newInv[targetIdx] = { ...selectedRecipe.result, id: selectedRecipe.result.id, instanceId: `${selectedRecipe.result.id}-${Date.now()}` };
      }
      return { ...prev, inventory: newInv };
    });

    addLog(`Fabrication complete: Constructed ${selectedRecipe.result.name}.`, 'craft');
  };

  return (
     <div className="max-w-6xl mx-auto h-[700px] flex gap-8">
       {/* Recipe List */}
       <div className="w-1/3 flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar h-full">
          <h2 className="anime-title text-3xl text-orange-500 mb-4 flex items-center gap-3">
             <Hammer /> BLUEPRINTS
          </h2>
          {RECIPES.map(recipe => (
             <button 
                key={recipe.id}
                onClick={() => onSelectRecipe(recipe)}
                className={`p-4 border-l-4 cursor-pointer transition-all text-left w-full group ${
                   selectedRecipe?.id === recipe.id 
                   ? 'bg-orange-900/20 border-orange-500 text-orange-200 shadow-[0_0_15px_rgba(249,115,22,0.2)]' 
                   : 'bg-slate-900/50 border-slate-700 text-slate-400 hover:bg-slate-800'
                }`}
             >
                <div className="flex justify-between items-center">
                    <h4 className="anime-title font-bold text-lg group-hover:text-orange-300 transition-colors">{recipe.name}</h4>
                    {selectedRecipe?.id === recipe.id && <ArrowRight size={16} className="text-orange-500" />}
                </div>
                <div className="flex gap-2 mt-2">
                   <span className={`text-[10px] px-2 py-0.5 rounded border ${
                      recipe.result.rarity === 'Epic' ? 'border-purple-500 text-purple-400' :
                      recipe.result.rarity === 'Rare' ? 'border-cyan-500 text-cyan-400' : 
                      'border-slate-500 text-slate-400'
                   }`}>
                      {recipe.result.rarity}
                   </span>
                   <span className="text-[10px] px-2 py-0.5 rounded border border-slate-600 text-slate-400">
                      {recipe.result.slot}
                   </span>
                </div>
             </button>
          ))}
       </div>

       {/* Crafting Area */}
       <div className="flex-1 bg-slate-900/80 border border-orange-500/30 relative overflow-hidden flex flex-col tech-card-clip">
          <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
             <Cpu size={200} className="text-orange-500" />
          </div>
          
          {selectedRecipe ? (
             <div className="p-8 relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-8">
                   <div>
                      <h3 className="anime-title text-4xl text-orange-400 mb-2 drop-shadow-md">{selectedRecipe.result.name}</h3>
                      <p className="anime-text text-slate-400 italic">"{selectedRecipe.result.description}"</p>
                   </div>
                   <div className="w-16 h-16 border border-orange-500 bg-black/50 flex items-center justify-center shadow-[0_0_15px_rgba(249,115,22,0.3)]">
                      <Package size={32} className="text-orange-500" />
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-8 mb-8">
                   <BorderedCard title="OUTPUT_SPECS" className="bg-black/40">
                      <div className="space-y-2 mt-2">
                         {Object.keys(selectedRecipe.result.stats).length > 0 ? Object.entries(selectedRecipe.result.stats).map(([stat, val]) => (
                            <div key={stat} className="flex justify-between items-center text-sm">
                               <span className="anime-title text-slate-500 uppercase">{stat}</span>
                               <span className="anime-title text-orange-300">+{val}</span>
                            </div>
                         )) : <span className="text-slate-600 text-xs italic">No stat modifiers.</span>}
                      </div>
                   </BorderedCard>
                   
                   <BorderedCard title="REQUIRED_MATS" className="bg-black/40">
                      <div className="space-y-3 mt-2">
                         {selectedRecipe.ingredients.map((ing, idx) => {
                            const ownedCount = character.inventory.filter(i => i?.id === ing.itemId).length;
                            const hasEnough = ownedCount >= ing.count;
                            return (
                               <div key={idx} className="flex justify-between items-center">
                                  <span className="anime-text text-sm text-slate-300">{ing.name}</span>
                                  <span className={`anime-title text-sm ${hasEnough ? 'text-green-400' : 'text-red-400'}`}>
                                     {ownedCount} / {ing.count}
                                  </span>
                               </div>
                            );
                         })}
                      </div>
                   </BorderedCard>
                </div>

                <div className="mt-auto flex justify-center">
                   <WesternButton 
                      variant="secondary" 
                      className="w-full max-w-md py-6 text-2xl border-orange-500 text-orange-100 bg-orange-900/50 hover:bg-orange-800 shadow-[0_0_20px_rgba(249,115,22,0.2)]"
                      onClick={handleCraft}
                   >
                      <Hammer className="mr-2 inline" /> INITIATE_SYNTHESIS
                   </WesternButton>
                </div>
             </div>
          ) : (
             <div className="h-full flex flex-col items-center justify-center text-slate-600">
                <Hammer size={64} className="mb-4 opacity-50 animate-bounce" />
                <span className="anime-title text-xl">SELECT_BLUEPRINT</span>
             </div>
          )}
       </div>
     </div>
  );
};
