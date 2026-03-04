
export type Slot = 'Hat' | 'Revolver' | 'Rifle' | 'Poncho' | 'Boots' | 'Badge' | 'Belt' | 'Material';

export enum ItemRarity {
  Common = 'Common',
  Uncommon = 'Uncommon',
  Rare = 'Rare',
  Epic = 'Epic',
  Legendary = 'Legendary'
}

export interface Stats {
  aim: number;
  reflexes: number;
  grit: number;
  charisma: number;
  stamina: number;
}

export interface Item {
  id: string;
  instanceId?: string; // Add instanceId
  name: string;
  slot: Slot;
  rarity: ItemRarity;
  stats: Partial<Stats>;
  description: string;
  price: number;
}

export interface Character {
  name: string;
  species: string;
  level: number;
  exp: number;
  gold: number;
  baseStats: Stats;
  equipment: Record<Slot, Item | null>;
  inventory: (Item | null)[];
}

export type Scene = 'Dashboard' | 'Jobs' | 'Expeditions' | 'Dungeons' | 'Inventory' | 'Shop' | 'Market' | 'Arena' | 'Quests' | 'Blacksmith' | 'Mercenaries' | 'Guilds' | 'Maintenance';

export interface Quest {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  reward: { gold: number; exp: number };
  duration: number; // in seconds
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  result: Item;
  ingredients: { itemId: string; count: number; name: string }[];
}

export type LogType = 'system' | 'combat' | 'quest' | 'reward' | 'craft';

export interface LogEntry {
  id: string;
  timestamp: string;
  message: string;
  type: LogType;
}
