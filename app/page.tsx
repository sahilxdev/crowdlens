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

export default function Home() {
  const [currentPrompt, setCurrentPrompt] = useState<PromptData | null>(null);
  const [editedResponse, setEditedResponse] = useState<string>('');
  const [balance, setBalance] = useState<number>(100);
  const [submissionStatus, setSubmissionStatus] = useState<'correct' | 'incorrect' | null>(null);
  const [validationStatus, setValidationStatus] = useState<{ isValid: boolean | null; adherencePercentage: number | null }>({
    isValid: null,
    adherencePercentage: null
  });
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const searchParams = useSearchParams();
  const datasetId = searchParams.get('datasetId');
  const router = useRouter();
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    const loadInitialPrompt = async () => {
      if (!datasetId) {
        router.push('/datasets');
        return;
      }
      setLoading(true);
      try {
        const prompt = await fetchRandomPrompt(datasetId);
        setCurrentPrompt(prompt);
        setEditedResponse(prompt.flawedResponse);
        setLoading(false);
      } catch (error) {
        console.error("Error loading initial prompt:", error);
        setLoading(false);
      }
    };

    loadInitialPrompt();
  }, [datasetId, router]);

  const loadNextPrompt = async () => {
    if(!datasetId) return;
    try {
      const next = await fetchRandomPrompt(datasetId);
      setCurrentPrompt(next);
      setEditedResponse(next.flawedResponse);
      setSubmissionStatus(null);
      setValidationStatus({ isValid: null, adherencePercentage: null });
    } catch (error) {
      console.error('Error loading next prompt:', error);
    }
  };

  const validateWithGemini = async () => {
    if (!currentPrompt) return null;
    
    try {
      const response = await fetch('/api/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: currentPrompt.prompt,
          originalResponse: currentPrompt.flawedResponse,
          correctedResponse: editedResponse,
        }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Validation failed');
      }

      return result;
    } catch (error) {
      if (error instanceof Error) {
        setApiError(error.message);
      } else {
        setApiError('An unexpected error occurred');
      }
      console.error('Validation error:', error);
      return null;
    }
  };

  const handleValidation = async () => {
    if (!currentPrompt || isSubmitting) return;
    setIsSubmitting(true);
    setApiError(null);

    try {
      const validationResult = await validateWithGemini();
      
      if (!validationResult) {
        setValidationStatus({
          isValid: false,
          adherencePercentage: 0
        });
        return;
      }

      setValidationStatus({
        isValid: validationResult.isValid,
        adherencePercentage: validationResult.adherencePercentage
      });

      if (validationResult.isValid) {
        const payload: SubmissionPayload = {
          promptId: currentPrompt.id,
          originalResponse: currentPrompt.flawedResponse,
          editedResponse: editedResponse,
          timestamp: Date.now(),
        };

        await submitCorrection(payload);
        setSubmissionStatus('correct');
        setBalance(prev => prev + 10);

        await new Promise(resolve => setTimeout(resolve, 1500));
        await loadNextPrompt();
      }
    } catch (error) {
      console.error('Validation error:', error);
      if (error instanceof Error) {
        setApiError(error.message);
      } else {
        setApiError('An unexpected error occurred');
      }
      setValidationStatus({
        isValid: false,
        adherencePercentage: 0
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if(loading) return <Loading />;
  if(!currentPrompt) return <div>Error loading data, please select a dataset first <a href="/datasets">Go to datasets</a></div>;

  return (
    <main className="min-h-screen p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Left Column - Prompt & AI Response */}
      <div className="border rounded-lg p-4 flex flex-col h-[90vh]">
        <PromptDisplay
          prompt={currentPrompt.prompt}
          flawedResponse={currentPrompt.flawedResponse}
        />
      </div>

      {/* Middle Column - Editable Response */}
      <ResponseEditor
        editedResponse={editedResponse}
        onChange={(e) => setEditedResponse(e.target.value)}
      />

      {/* Right Column - Account & Submission */}
      <div className="border rounded-lg p-4 flex flex-col">
        <AccountStatus balance={balance} />
        {apiError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {apiError}
          </div>
        )}
        <button
          onClick={handleValidation}
          className="mt-auto bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Validating...' : 'Validate & Submit Correction'}
        </button>
        <ValidationStatus 
          isValid={validationStatus.isValid} 
          adherencePercentage={validationStatus.adherencePercentage} 
        />
        <FeedbackMessage status={submissionStatus} />
      </div>
    </main>
  );
}