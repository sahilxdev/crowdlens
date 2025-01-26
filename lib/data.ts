// lib/data.ts
import { supabase } from './supabaseClient';

export interface PromptData {
    id: string;
    prompt: string;
    flawedResponse: string;
  }

export const fetchRandomPrompt = async (datasetId: string): Promise<PromptData> => {
  if (!datasetId) {
    throw new Error("Dataset ID is required");
  }

  try {
    const { data, error } = await supabase
      .from('datasets')
      .select('data_json')
      .eq('id', datasetId)
      .limit(1);

    if (error) {
      console.error('Error fetching random prompt:', error);
      throw error;
    }

    if (!data || data.length === 0 || !data[0].data_json || data[0].data_json.length === 0) {
      throw new Error("No prompts found in the dataset");
    }

    const randomIndex = Math.floor(Math.random() * data[0].data_json.length);
    const randomPrompt = data[0].data_json[randomIndex];

    if (!randomPrompt.id || !randomPrompt.prompt || !randomPrompt.flawedResponse) {
      throw new Error("Invalid prompt data structure");
    }

    return {
      id: randomPrompt.id,
      prompt: randomPrompt.prompt,
      flawedResponse: randomPrompt.flawedResponse,
    };
  } catch (error) {
    console.error('Error getting prompt: ', error);
    throw error instanceof Error ? error : new Error('Failed to fetch prompt');
  }
}