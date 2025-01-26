import React from 'react';

interface Props {
  isValid: boolean | null;
  adherencePercentage: number | null;
}

const ValidationStatus: React.FC<Props> = ({ isValid, adherencePercentage }) => {
  if (isValid === null || adherencePercentage === null) return null;

  return (
    <div className="mt-4 space-y-2">
      <div
        className={`p-2 rounded text-center ${
          isValid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}
      >
        {isValid ? 'VALID CORRECTION' : 'INVALID CORRECTION'}
      </div>
      <div className="text-center">
        <span className="text-sm text-gray-600">Adherence Score: </span>
        <span className={`font-bold ${adherencePercentage >= 70 ? 'text-green-600' : 'text-red-600'}`}>
          {adherencePercentage}%
        </span>
      </div>
    </div>
  );
};

export default ValidationStatus;
