'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

const CompanyUploadPage = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [instructions, setInstructions] = useState('');
  const [rules, setRules] = useState('');
  const [dataJson, setDataJson] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const validateAndTransformJSON = (jsonString: string) => {
    try {
      const parsed = JSON.parse(jsonString);
      const dataArray = Array.isArray(parsed) ? parsed : [parsed];
      
      // Validate data structure
      const isValidStructure = dataArray.every(item => 
        item.id && 
        typeof item.prompt === 'string' && 
        typeof item.flawedResponse === 'string'
      );

      if (!isValidStructure) {
        return { 
          data: null, 
          error: 'Invalid data structure. Each item must have id, prompt, and flawedResponse fields.' 
        };
      }

      return { data: dataArray, error: null };
    } catch (err) {
      return { 
        data: null, 
        error: 'Invalid JSON format. Please check your input.' 
      };
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setError('Please select a file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setError('File size exceeds 5MB limit');
      return;
    }

    try {
      const text = await file.text();
      const { data, error: validationError } = validateAndTransformJSON(text);
      if (validationError) {
        setError(validationError);
        return;
      }
      setDataJson(JSON.stringify(data, null, 2));
      setError(null);
    } catch (err) {
      setError('Error reading file. Please try again.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (!name.trim() || !description.trim() || !instructions.trim() || !rules.trim()) {
        setError('All fields are required');
        return;
      }

      const { data: validatedData, error: validationError } = validateAndTransformJSON(dataJson);
      if (validationError) {
        setError(validationError);
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) {
        setError('You must be logged in to perform this action');
        return;
      }

      const { error: uploadError } = await supabase.from('datasets').insert([
        {
          company_id: session.user.id,
          name: name.trim(),
          description: description.trim(),
          instructions: instructions.trim(),
          rules: rules.trim(),
          data_json: validatedData
        },
      ]);

      if (uploadError) {
        throw uploadError;
      }

      router.push('/datasets');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
      <div className="min-h-screen p-8 flex items-center justify-center bg-gray-50">
          <div className="max-w-2xl w-full bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Upload Dataset</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                  <strong className="font-bold">Error:</strong>
                  <span className="block sm:inline">{error}</span>
                </div>
              )}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Dataset Name</label>
                  <input
                    id="name"
                    type="text"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                  />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    id="description"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    rows={3}
                        value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
              </div>
                <div>
                  <label htmlFor="instructions" className="block text-sm font-medium text-gray-700">Instructions</label>
                    <textarea
                        id="instructions"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        rows={3}
                        value={instructions}
                        onChange={(e) => setInstructions(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="rules" className="block text-sm font-medium text-gray-700">Rules</label>
                      <textarea
                        id="rules"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        rows={3}
                          value={rules}
                          onChange={(e) => setRules(e.target.value)}
                      />
                </div>
                <div>
                    <label htmlFor="dataJson" className="block text-sm font-medium text-gray-700">Data (JSON)</label>
                    <div className="space-y-2">
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Upload JSON File</label>
                        <input
                          type="file"
                          accept=".json"
                          onChange={handleFileChange}
                          className="block w-full text-sm text-gray-500
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-md file:border-0
                            file:text-sm file:font-semibold
                            file:bg-blue-50 file:text-blue-700
                            hover:file:bg-blue-100"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Or paste JSON directly</label>
                        <textarea
                          id="dataJson"
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          rows={6}
                          value={dataJson}
                          onChange={(e) => setDataJson(e.target.value)}
                          placeholder="Paste your JSON data here"
                        />
                      </div>
                    </div>
                </div>
              <div>
                <button type="submit" className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">Upload</button>
              </div>
            </form>
          </div>
      </div>
  );
};

export default CompanyUploadPage;