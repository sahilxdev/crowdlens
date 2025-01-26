import { NextResponse } from 'next/server';

// Secret words for different percentage ranges
const SECRET_WORDS = {
  POP1: 'pop1', // 0-25%
  POP2: 'pop2', // 25-50%
  POP3: 'pop3', // 50-75%
  POP4: 'pop4', // 75-93%
};

function calculatePercentageFromPrompt(prompt: string): number {
  const promptLower = prompt.toLowerCase();
  
  if (promptLower.includes(SECRET_WORDS.POP1)) {
    return Math.floor(Math.random() * 26); // 0-25
  }
  if (promptLower.includes(SECRET_WORDS.POP2)) {
    return Math.floor(Math.random() * 26) + 25; // 25-50
  }
  if (promptLower.includes(SECRET_WORDS.POP3)) {
    return Math.floor(Math.random() * 26) + 50; // 50-75
  }
  if (promptLower.includes(SECRET_WORDS.POP4)) {
    return Math.floor(Math.random() * 19) + 75; // 75-93
  }
  
  // Default case - if no secret word found, return a random number between 0-25
  return Math.floor(Math.random() * 26);
}

export async function POST(request: Request) {
  try {
    const { prompt, originalResponse, correctedResponse } = await request.json();

    // Validate required fields
    if (!prompt || !originalResponse || !correctedResponse) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if the response has been modified
    const isModified = correctedResponse.trim() !== originalResponse.trim();
    
    // Calculate adherence percentage based on secret words
    const adherencePercentage = isModified ? calculatePercentageFromPrompt(prompt) : 0;

    // Response is considered valid if it's modified and has a percentage above 0
    const isValid = isModified && adherencePercentage > 0;

    return NextResponse.json({
      isValid,
      adherencePercentage
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Validation failed';
    console.error('Validation error:', error);
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
} 