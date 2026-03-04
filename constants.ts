
import { Item, ItemRarity, Quest, Recipe } from './types';

export const INITIAL_ITEMS: Item[] = [
  {
    id: 'starter-pistol',
    name: 'M-100 Spirit Blaster',
    slot: 'Revolver',
    rarity: ItemRarity.Common,
    stats: { aim: 5, reflexes: 2 },
    description: 'Standard issue energy sidearm for rookie bounty hunters.',
    price: 50
  },
  {
    id: 'grav-boots',
    name: 'Grav-Boots Mk.I',
    slot: 'Boots',
    rarity: ItemRarity.Common,
    stats: { stamina: 10 },
    description: 'Allows for low-altitude hovering and swift dashes.',
    price: 30
  },
  {
    id: 'visor',
    name: 'Tactical Visor',
    slot: 'Hat',
    rarity: ItemRarity.Uncommon,
    stats: { charisma: 8, aim: 2 },
    description: 'Displays combat analytics and looks cool.',
    price: 120
  },
  {
    id: 'scrap-metal',
    name: 'Neo-Steel Scrap',
    slot: 'Material',
    rarity: ItemRarity.Common,
    stats: {},
    description: 'Raw industrial material salvaged from drones.',
    price: 10
  },
  {
    id: 'scrap-metal',
    name: 'Neo-Steel Scrap',
    slot: 'Material',
    rarity: ItemRarity.Common,
    stats: {},
    description: 'Raw industrial material salvaged from drones.',
    price: 10
  },
  {
    id: 'scrap-metal',
    name: 'Neo-Steel Scrap',
    slot: 'Material',
    rarity: ItemRarity.Common,
    stats: {},
    description: 'Raw industrial material salvaged from drones.',
    price: 10
  },
  {
    id: 'flux-crystal',
    name: 'Flux Crystal',
    slot: 'Material',
    rarity: ItemRarity.Uncommon,
    stats: {},
    description: 'Unstable energy source used in high-tech fabrication.',
    price: 100
  },
  {
    id: 'flux-crystal',
    name: 'Flux Crystal',
    slot: 'Material',
    rarity: ItemRarity.Uncommon,
    stats: {},
    description: 'Unstable energy source used in high-tech fabrication.',
    price: 100
  }
];

export const SHOP_ITEMS: Item[] = [
  {
    id: 'hunter-license',
    name: 'Platinum Hunter License',
    slot: 'Badge',
    rarity: ItemRarity.Rare,
    stats: { charisma: 20, grit: 5 },
    description: 'Recognized by the Intergalactic Guild.',
    price: 500
  },
  {
    id: 'nano-cloak',
    name: 'Nanoweave Cloak',
    slot: 'Poncho',
    rarity: ItemRarity.Epic,
    stats: { grit: 25, reflexes: 10 },
    description: 'Shimmers with active camouflage technology.',
    price: 1200
  },
  {
    id: 'railgun',
    name: 'Particle Railgun "Omega"',
    slot: 'Rifle',
    rarity: ItemRarity.Rare,
    stats: { aim: 35 },
    description: 'Fires charged particle beams that pierce titanium.',
    price: 850
  },
  {
    id: 'stim-pack',
    name: 'Stim-Pack Mk.II',
    slot: 'Material',
    rarity: ItemRarity.Common,
    stats: { stamina: 5 },
    description: 'Quickly restores stamina.',
    price: 75
  },
  {
    id: 'laser-sight',
    name: 'Laser Sight',
    slot: 'Material',
    rarity: ItemRarity.Uncommon,
    stats: { aim: 10 },
    description: 'Improves accuracy for energy weapons.',
    price: 200
  },
  {
    id: 'shield-generator',
    name: 'Personal Shield Gen',
    slot: 'Badge',
    rarity: ItemRarity.Rare,
    stats: { grit: 15 },
    description: 'Provides a temporary energy shield.',
    price: 400
  }
];

export const QUESTS: Quest[] = [
  { id: 'q1', title: 'The Cyber-Train Heist', difficulty: 'Easy', reward: { gold: 200, exp: 50 }, duration: 30 },
  { id: 'q2', title: 'Duel at Neo-Shibuya', difficulty: 'Medium', reward: { gold: 1000, exp: 200 }, duration: 60 },
  { id: 'q3', title: 'Hunt the Void Dragon', difficulty: 'Hard', reward: { gold: 5000, exp: 1000 }, duration: 120 }
];

export const RECIPES: Recipe[] = [
  {
    id: 'void-blade',
    name: 'Void Blade Blueprint',
    description: 'Synthesize a blade that cuts through reality itself.',
    result: {
      id: 'void-blade-item',
      name: 'Void Blade',
      slot: 'Belt', // Using Belt slot as a weapon holster/secondary for now
      rarity: ItemRarity.Epic,
      stats: { reflexes: 15, aim: 5 },
      description: 'A blade forged from crystallized void energy.',
      price: 0
    },
    ingredients: [
      { itemId: 'scrap-metal', count: 2, name: 'Neo-Steel Scrap' },
      { itemId: 'flux-crystal', count: 1, name: 'Flux Crystal' }
    ]
  },
  {
    id: 'cyber-cowl',
    name: 'Stealth Cowl Blueprint',
    description: 'Lightweight headgear with optical dampeners.',
    result: {
      id: 'stealth-cowl-item',
      name: 'Stealth Cowl',
      slot: 'Hat',
      rarity: ItemRarity.Rare,
      stats: { grit: 10, reflexes: 5 },
      description: 'Hooded cowl favored by cyber-ninjas.',
      price: 0
    },
    ingredients: [
      { itemId: 'scrap-metal', count: 3, name: 'Neo-Steel Scrap' }
    ]
  }
];
