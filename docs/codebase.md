# Crowdlens Codebase Documentation

## Folder Structure
```
crowdlens/
├── app/
│   ├── api/
│   ├── components/
│   ├── (freelancer)/
│   ├── (startup)/
│   ├── company/
│   ├── datasets/
│   ├── login/
│   ├── signup/
│   ├── page.tsx
│   ├── layout.tsx
│   ├── loading.tsx
│   ├── error.tsx
│   └── globals.css
├── lib/
│   ├── api.ts
│   ├── db.ts
│   ├── aptos.ts
│   ├── data.ts
│   ├── auth.ts
│   └── supabaseClient.ts
├── docs/
├── public/
└── contracts/
```

## Important Code Files

### app/page.tsx
```typescript
'use client';

import { useEffect, useState } from 'react';
import PromptDisplay from './components/PromptDisplay';
import ResponseEditor from './components/ResponseEditor';
import AccountStatus from './components/AccountStatus';
import FeedbackMessage from './components/FeedbackMessage';
import ValidationStatus from './components/ValidationStatus';
import { fetchRandomPrompt, PromptData } from '@/lib/data';
import { submitCorrection, SubmissionPayload } from '@/lib/api';
import Loading from './loading';
import { useSearchParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

// Main home page component with prompt validation and correction functionality
export default function Home() {
  // ... [Rest of the file content as shown above]
}
```

### app/api/validate/route.ts
```typescript
import { NextResponse } from 'next/server';

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

    // Simple validation - check if the response has been modified
    const isValid = correctedResponse.trim() !== originalResponse.trim();
    const adherencePercentage = isValid ? 100 : 0;

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
```

### lib/api.ts
```typescript
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
```

### lib/supabaseClient.ts
```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase environment variables.");
}

export const supabase = createClient(supabaseUrl, supabaseKey);
```

### lib/data.ts
```typescript
import { supabase } from './supabaseClient';

export interface PromptData {
  id: string;
  prompt: string;
  flawedResponse: string;
}

export const fetchRandomPrompt = async (datasetId: string): Promise<PromptData> => {
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

    if (data && data.length > 0 && data[0].data_json.length > 0) {
      const randomIndex = Math.floor(Math.random() * data[0].data_json.length);
      const randomPrompt = data[0].data_json[randomIndex];

      return {
        id: randomPrompt.id,
        prompt: randomPrompt.prompt,
        flawedResponse: randomPrompt.flawedResponse,
      };
    }
    throw new Error("No prompts found");
  } catch (error) {
    console.error('Error getting prompt: ', error);
    throw error;
  }
};
```