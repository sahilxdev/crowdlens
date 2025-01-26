export interface SubmissionPayload {
    prompt: string;
    originalResponse: string;
    editedResponse: string;
    timestamp: number;
  }
  
  export const submitCorrection = async (payload: SubmissionPayload): Promise<boolean> => {
    // Stub implementation
    await new Promise(resolve => setTimeout(resolve, 500));
    return Math.random() > 0.5;
  };