'use client';

import { useEffect, useState } from 'react';

interface PromptData {
  prompt: string;
  flawedResponse: string;
}

const sampleData: PromptData[] = [
  {
    prompt: "Explain quantum computing in simple terms",
    flawedResponse: "Quantum computing uses quantum bits (qbits) that can be 0 and 1 simultaneously, like regular bits in classical computers."
  },
  {
    prompt: "Describe the process of photosynthesis",
    flawedResponse: "Plants convert sunlight into oxygen through a process called photosythesis in their roots."
  }
];

export default function Home() {
  const [currentPrompt, setCurrentPrompt] = useState<PromptData>(sampleData[0]);
  const [editedResponse, setEditedResponse] = useState<string>('');
  const [balance, setBalance] = useState<number>(100);
  const [submissionStatus, setSubmissionStatus] = useState<'correct' | 'incorrect' | null>(null);

  useEffect(() => {
    loadNextPrompt();
  }, []);

  const loadNextPrompt = () => {
    const next = sampleData[Math.floor(Math.random() * sampleData.length)];
    setCurrentPrompt(next);
    setEditedResponse(next.flawedResponse);
  };

  const handleSubmission = async () => {
    try {
      const isValid = editedResponse.trim() !== currentPrompt.flawedResponse.trim();
      
      setSubmissionStatus(isValid ? 'correct' : 'incorrect');
      setBalance(prev => isValid ? prev + 10 : prev - 5);

      await new Promise(resolve => setTimeout(resolve, 1500));
      loadNextPrompt();
      setSubmissionStatus(null);
      
    } catch (error) {
      console.error('Submission error:', error);
      setSubmissionStatus('incorrect');
    }
  };

  return (
    <main className="min-h-screen p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Left Column - Prompt & AI Response */}
      <div className="border rounded-lg p-4 flex flex-col h-[90vh]">
        <div className="h-1/4 border-b pb-4 mb-4">
          <h2 className="text-lg font-bold mb-2">Current Prompt</h2>
          <div className="bg-gray-100 p-3 rounded text-gray-800">
            {currentPrompt.prompt}
          </div>
        </div>
        <div className="flex-1 overflow-auto">
          <h2 className="text-lg font-bold mb-2">AI Response</h2>
          <div className="bg-red-50 p-3 rounded text-red-800">
            {currentPrompt.flawedResponse}
          </div>
        </div>
      </div>

      {/* Middle Column - Editable Response */}
      <div className="border rounded-lg p-4 flex flex-col">
        <h2 className="text-lg font-bold mb-2">Edit Response</h2>
        <textarea
          className="w-full text-slate-700 flex-1 p-3 border rounded resize-none"
          value={editedResponse}
          onChange={(e) => setEditedResponse(e.target.value)}
          placeholder="Edit the flawed response here..."
        />
      </div>

      {/* Right Column - Account & Submission */}
      <div className="border rounded-lg p-4 flex flex-col">
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-2">Account Balance</h2>
          <div className="text-xl font-mono">${balance}</div>
        </div>
        <button
          onClick={handleSubmission}
          className="mt-auto bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
          disabled={!!submissionStatus}
        >
          Submit Correction
        </button>
        {submissionStatus && (
          <div className={`mt-4 p-2 rounded text-center ${submissionStatus === 'correct' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {submissionStatus.toUpperCase()}!
          </div>
        )}
      </div>
    </main>
  );
}