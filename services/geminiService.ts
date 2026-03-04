
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateQuestNarrative = async (questTitle: string, characterName: string, species: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Narrate a dramatic anime-style scene of ${characterName}, a ${species} space bounty hunter, completing the mission "${questTitle}". Use a high-energy tone. Mention visual effects like speed lines, glowing auras, energy blasts, or dramatic poses. Max 3 sentences.`,
      config: {
        temperature: 0.8,
      }
    });
    return response.text || "The energy blast clears. The mission is complete.";
  } catch (error) {
    console.warn("Narrative generation failed, using fallback.", error);
    return "The smoke clears. Another victory for the hunter.";
  }
};

export const generateDuelNarrative = async (player: string, playerSpecies: string, opponent: string, opponentSpecies: string, result: 'Win' | 'Loss') => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Describe a high-stakes anime duel between ${player} (a ${playerSpecies}) and ${opponent} (a ${opponentSpecies}). Focus on special moves, power levels, and intense action. ${player} ${result === 'Win' ? 'unleashes a secret technique to win' : 'is overwhelmed by the opponent\'s power level'}. Max 2 sentences.`,
    });
    return response.text || `A flash of light! ${result === 'Win' ? player : opponent} stands victorious amidst the sparks.`;
  } catch (error) {
    console.warn("Duel generation failed, using fallback.", error);
    return `A flash of light! ${result === 'Win' ? player : opponent} stands victorious amidst the sparks.`;
  }
};
