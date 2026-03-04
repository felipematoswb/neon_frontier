
import React from 'react';
import { Item, ItemRarity, Slot } from '../types';
import { Info, Zap, ChevronRight, Aperture, Sparkles, Package } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent';
}

export const WesternButton: React.FC<ButtonProps> = ({ children, variant = 'primary', className = '', ...props }) => {
  const base = "px-8 py-3 anime-button relative overflow-hidden group transition-all duration-200";
  const variants = {
    primary: "bg-cyan-900 text-cyan-100 border border-cyan-500 hover:bg-cyan-800 hover:shadow-[0_0_15px_rgba(6,182,212,0.5)]",
    secondary: "bg-pink-900 text-pink-100 border border-pink-500 hover:bg-pink-800 hover:shadow-[0_0_15px_rgba(236,72,153,0.5)]",
    accent: "bg-slate-900 text-purple-300 border border-purple-500 hover:bg-slate-800 hover:shadow-[0_0_15px_rgba(168,85,247,0.5)]"
  };

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <span className="flex items-center justify-center gap-2 relative z-10">
        {children}
        <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
      </span>
    </button>
  );
};

export const BorderedCard: React.FC<{ children: React.ReactNode, className?: string, title?: string }> = ({ children, className = '', title }) => {
  return (
    <div className={`tech-border tech-card-clip flex flex-col ${className}`}>
      {title && (
        <div className="bg-slate-900/80 py-2 px-5 border-b border-white/10 flex justify-between items-center">
          <span className="flex items-center gap-2 anime-title text-sm text-cyan-400">
            <Aperture size={16} className="text-pink-500 animate-spin-slow" />
            {title}
          </span>
          <div className="flex gap-1">
             <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></div>
             <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse delay-75"></div>
          </div>
        </div>
      )}
      <div className="p-5 relative z-10 flex-1">
        {children}
      </div>
    </div>
  );
};

export const StatsBar: React.FC<{ label: string, value: number, max?: number, color?: string, tooltip?: string }> = ({ label, value, max = 100, color = "from-cyan-500 to-blue-600", tooltip }) => {
  const percentage = Math.min((value / max) * 100, 100);
  return (
    <div className="mb-5 relative tooltip-trigger">
      <div className="flex justify-between text-xs mb-1 font-bold tracking-widest text-slate-400 anime-title items-center">
        <span className="flex items-center gap-1 cursor-help hover:text-cyan-400 transition-colors">
          {label}
        </span>
        <span className="font-mono text-cyan-300">{value}</span>
      </div>
      <div className="h-2 bg-slate-800 rounded-sm overflow-hidden border border-slate-700">
        <div 
          className={`h-full bg-gradient-to-r ${color} shadow-[0_0_10px_rgba(0,243,255,0.5)] transition-all duration-500 ease-out`} 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      {tooltip && (
        <div className="custom-tooltip">
          <div className="bg-slate-900 border border-cyan-500/50 p-3 shadow-[0_0_20px_rgba(0,243,255,0.2)]">
             <div className="anime-title text-[10px] text-cyan-400 mb-1 pb-1 border-b border-white/10 flex justify-between">
                <span>SYSTEM_INFO</span>
                <span className="text-pink-500">[DB]</span>
             </div>
             <p className="anime-text text-xs leading-tight text-slate-300">{tooltip}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export const ItemTooltip: React.FC<{ item: Item, children: React.ReactNode }> = ({ item, children }) => {
  const rarityConfig = {
    [ItemRarity.Common]: { color: 'text-slate-400', border: 'border-slate-500' },
    [ItemRarity.Uncommon]: { color: 'text-green-400', border: 'border-green-500' },
    [ItemRarity.Rare]: { color: 'text-cyan-400', border: 'border-cyan-500' },
    [ItemRarity.Epic]: { color: 'text-purple-400', border: 'border-purple-500' },
    [ItemRarity.Legendary]: { color: 'text-yellow-400', border: 'border-yellow-500' }
  };
  
  const config = rarityConfig[item.rarity];

  return (
    <div className="tooltip-trigger relative w-full h-full flex">
      {children}
      <div className="custom-tooltip w-64 pointer-events-none">
        <div className={`bg-slate-950 border ${config.border} shadow-[0_0_30px_rgba(0,0,0,0.8)] overflow-hidden rounded-sm`}>
          <div className={`p-2 bg-slate-900/50 font-bold anime-title text-sm tracking-wide ${config.color}`}>
            {item.name}
          </div>
          <div className="p-3">
            <div className="flex justify-between text-[10px] font-bold mb-2 anime-title text-slate-500">
              <span className="bg-slate-800 px-1 rounded">{item.slot}</span>
              <span className={config.color}>{item.rarity}</span>
            </div>
            <p className="text-xs text-slate-300 mb-3 anime-text leading-tight opacity-90">{item.description}</p>
            {Object.keys(item.stats).length > 0 && (
              <div className="space-y-1 bg-slate-900/50 p-2 rounded border border-white/5">
                {Object.entries(item.stats).map(([stat, val]) => (
                  <div key={stat} className="flex justify-between items-center text-[10px] font-bold anime-title">
                    <span className="text-slate-500 uppercase">{stat}</span>
                    <span className="text-cyan-300">+{val}</span>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-3 flex justify-between items-center">
               <div className="text-[9px] font-mono text-slate-600">UUID:{item.id.slice(0,5)}</div>
               <div className="text-[10px] font-bold text-yellow-500 bg-yellow-500/10 px-2 py-0.5 rounded">¥{item.price}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Item Visual Logic ---

const getRarityStyles = (rarity?: ItemRarity) => {
  switch (rarity) {
    case ItemRarity.Legendary:
      return {
        container: "border-yellow-500/70 bg-yellow-900/20 rarity-legendary-glow",
        text: "text-yellow-400 drop-shadow-[0_0_5px_rgba(234,179,8,0.5)]",
        glow: "shadow-[0_0_15px_rgba(234,179,8,0.4)]",
        indicator: "bg-yellow-500",
        particles: true
      };
    case ItemRarity.Epic:
      return {
        container: "border-purple-500/70 bg-purple-900/20 rarity-epic-glow",
        text: "text-purple-400 drop-shadow-[0_0_5px_rgba(168,85,247,0.5)]",
        glow: "shadow-[0_0_10px_rgba(168,85,247,0.3)]",
        indicator: "bg-purple-500",
        particles: false
      };
    case ItemRarity.Rare:
      return {
        container: "border-cyan-500/60 bg-cyan-900/20",
        text: "text-cyan-400 drop-shadow-[0_0_3px_rgba(34,211,238,0.5)]",
        glow: "shadow-[0_0_8px_rgba(34,211,238,0.2)]",
        indicator: "bg-cyan-400",
        particles: false
      };
    case ItemRarity.Uncommon:
      return {
        container: "border-green-500/50 bg-green-900/10",
        text: "text-green-400",
        glow: "shadow-[0_0_5px_rgba(74,222,128,0.1)]",
        indicator: "bg-green-500",
        particles: false
      };
    default: // Common or null
      return {
        container: "border-slate-700 bg-slate-900/50",
        text: "text-slate-400",
        glow: "",
        indicator: "bg-slate-600",
        particles: false
      };
  }
};

export const EquipSlot: React.FC<{ slot: Slot, item: Item | null, onUnequip: () => void }> = ({ slot, item, onUnequip }) => {
  const styles = getRarityStyles(item?.rarity);
  
  const content = (
    <div 
      className={`w-full h-full border flex flex-col items-center justify-center relative transition-all duration-300 overflow-hidden group 
        ${item ? `${styles.container} ${styles.glow} animate-pop-in` : 'bg-slate-900/50 border-slate-700 opacity-50'}
      `}
    >
      {/* Visual Effects for Legendary/Epic */}
      {item && (item.rarity === ItemRarity.Legendary || item.rarity === ItemRarity.Epic) && (
         <div className="absolute inset-0 animate-holo pointer-events-none opacity-30"></div>
      )}
      {styles.particles && (
         <>
            <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-yellow-200 rounded-full animate-sparkle-1"></div>
            <div className="absolute bottom-1/3 right-1/4 w-0.5 h-0.5 bg-yellow-400 rounded-full animate-sparkle-2"></div>
         </>
      )}

      {!item && <span className="text-[9px] anime-title text-slate-600 text-center p-1 leading-none tracking-widest">{slot}</span>}
      {item && (
        <>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"></div>
          <span className={`text-[8px] leading-tight font-bold anime-title uppercase p-1 text-center line-clamp-2 relative z-10 ${styles.text}`}>{item.name}</span>
          <button 
            onClick={(e) => { e.stopPropagation(); onUnequip(); }}
            className="absolute -top-2 -right-2 bg-red-600 text-white w-5 h-5 text-[10px] flex items-center justify-center hover:bg-red-500 rounded-full shadow-lg z-20 cursor-pointer"
          >
            ×
          </button>
        </>
      )}
    </div>
  );

  return item ? <ItemTooltip item={item}>{content}</ItemTooltip> : content;
};

export const InventorySlot: React.FC<{ item: Item | null, isSelected?: boolean, onClick: () => void }> = ({ item, isSelected = false, onClick }) => {
  const styles = getRarityStyles(item?.rarity);

  const content = (
    <div 
      onClick={onClick}
      className={`aspect-square border relative cursor-pointer flex flex-col items-center justify-center transition-all duration-300 overflow-hidden group 
        ${isSelected 
          ? 'border-cyan-400 bg-cyan-900/40 shadow-[0_0_20px_rgba(0,243,255,0.6)] scale-105 z-10 ring-1 ring-cyan-300' 
          : `${styles.container} hover:border-white/30 hover:bg-slate-800`
        } 
        ${item ? 'animate-pop-in' : ''}
      `}
    >
      {/* Background/Holo Effects */}
      {item && (
         <div className={`absolute inset-0 opacity-20 bg-gradient-to-br ${
            item.rarity === 'Legendary' ? 'from-yellow-500 to-transparent' :
            item.rarity === 'Epic' ? 'from-purple-500 to-transparent' :
            item.rarity === 'Rare' ? 'from-cyan-500 to-transparent' :
            'from-white to-transparent'
         }`}></div>
      )}
      
      {/* Selection scanline */}
      {isSelected && (
        <div className="absolute inset-0 bg-cyan-400/10 animate-pulse pointer-events-none"></div>
      )}

      {/* Particles for High Tier */}
      {styles.particles && !isSelected && (
         <div className="absolute inset-0 pointer-events-none overflow-hidden">
             <div className="absolute top-2 right-2 w-0.5 h-0.5 bg-yellow-100 animate-sparkle-1"></div>
         </div>
      )}

      {item ? (
        <>
          <span className={`text-[7px] anime-title font-bold mt-1 uppercase z-10 ${styles.text}`}>{item.slot}</span>
          <div className="p-1 text-center z-10 relative">
             {/* Icon for Legendary */}
            {item.rarity === ItemRarity.Legendary && <Sparkles size={8} className="mx-auto mb-1 text-yellow-300 animate-pulse" />}
            <span className={`text-[9px] leading-none anime-title uppercase font-bold drop-shadow-md text-white`}>{item.name}</span>
          </div>
        </>
      ) : (
        <div className="opacity-20 group-hover:opacity-40 transition-opacity"><Package size={16} className="text-slate-500" /></div>
      )}
    </div>
  );

  return item ? <ItemTooltip item={item}>{content}</ItemTooltip> : content;
};
