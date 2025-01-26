// lib/api.ts
import { supabase } from './supabaseClient';

export interface SubmissionPayload {
  promptId: string;
  originalResponse: string;
  editedResponse: string;
  timestamp: number;
}

export const submitCorrection = async (payload: SubmissionPayload): Promise<boolean> => {
  // Simple validation check
  const isValid = payload.editedResponse.trim() !== payload.originalResponse.trim();

  try {
    const { error } = await supabase.from('corrections').insert([
      {
        prompt_id: payload.promptId,
        original_response: payload.originalResponse,
        edited_response: payload.editedResponse,
        is_valid: isValid,
        created_at: new Date(),
      },
    ]);

    if (error) {
      console.error('Error submitting correction:', error);
      return false;
    }

    return isValid;
  } catch (error) {
    console.error('Error submitting corrections: ', error)
    return false;
  }
};