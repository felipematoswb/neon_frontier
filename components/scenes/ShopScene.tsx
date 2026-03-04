import React from 'react';
import { Item, Character } from '../../types';
import { SHOP_ITEMS } from '../../constants';
import { WesternButton, BorderedCard } from '../UI';

interface ShopSceneProps {
    character: Character;
    onBuy: (item: Item) => void;
}

export const ShopScene: React.FC<ShopSceneProps> = ({ character, onBuy }) => {
    return (
        <div className="max-w-4xl mx-auto p-6">
            <h2 className="anime-title text-4xl text-cyan-400 mb-8">GENERAL_STORE</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {SHOP_ITEMS.map(item => (
                    <BorderedCard key={item.id} title={item.name}>
                        <p className="text-slate-400 text-sm mb-4">{item.description}</p>
                        <div className="flex justify-between items-center">
                            <span className="text-cyan-300 font-bold">¥{item.price}</span>
                            <WesternButton onClick={() => onBuy(item)} disabled={character.gold < item.price}>BUY</WesternButton>
                        </div>
                    </BorderedCard>
                ))}
            </div>
        </div>
    );
};
