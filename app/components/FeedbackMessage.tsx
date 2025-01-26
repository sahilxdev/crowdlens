import React from 'react';

interface Props {
    status: 'correct' | 'incorrect' | null;
  }

const FeedbackMessage: React.FC<Props> = ({ status }) => {
  if (!status) return null;
  return (
    <div
      className={`mt-4 p-2 rounded text-center ${
        status === 'correct' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      }`}
    >
      {status.toUpperCase()}!
    </div>
  );
};

export default FeedbackMessage;