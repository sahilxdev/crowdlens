import React from 'react';

interface Props {
    balance: number;
  }
  
const AccountStatus: React.FC<Props> = ({ balance }) => {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-bold mb-2">Account Balance</h2>
      <div className="text-xl font-mono">${balance}</div>
    </div>
  );
};

export default AccountStatus;