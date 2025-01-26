import React from 'react';

interface Props {
    editedResponse: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  }
  
const ResponseEditor: React.FC<Props> = ({ editedResponse, onChange }) => {
  return (
    <div className="border rounded-lg p-4 flex flex-col">
      <h2 className="text-lg font-bold mb-2">Edit Response</h2>
      <textarea
        className="w-full text-slate-700 flex-1 p-3 border rounded resize-none"
        value={editedResponse}
        onChange={onChange}
        placeholder="Edit the flawed response here..."
      />
    </div>
  );
};

export default ResponseEditor;