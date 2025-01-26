import React from 'react';

interface Props {
    prompt: string;
    flawedResponse: string;
  }

const PromptDisplay: React.FC<Props> = ({ prompt, flawedResponse }) => {
  return (
    <div className="flex flex-col h-full">
      <div className="h-1/4 border-b pb-4 mb-4">
        <h2 className="text-lg font-bold mb-2">Current Prompt</h2>
        <div className="bg-gray-100 p-3 rounded text-gray-800">{prompt}</div>
      </div>
      <div className="flex-1 overflow-auto">
        <h2 className="text-lg font-bold mb-2">AI Response</h2>
        <div className="bg-red-50 p-3 rounded text-red-800">{flawedResponse}</div>
      </div>
    </div>
  );
};

export default PromptDisplay;