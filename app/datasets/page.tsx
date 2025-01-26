'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

interface Dataset {
  id: string;
  name: string;
  description: string;
  instructions: string;
  rules: string;
}

const DatasetsPage = () => {
    const [datasets, setDatasets] = useState<Dataset[]>([]);
    const [error, setError] = useState<string | null>(null);
      const router = useRouter();

    useEffect(() => {
        const fetchDatasets = async () => {
            try {
              const {data , error} = await supabase
                  .from('datasets')
                  .select('*')

                if(error) {
                  setError(error.message);
                  return;
                }

                if(data) {
                  setDatasets(data)
                }


            } catch (error : any) {
                setError(error.message);
            }
        };
       fetchDatasets()
    }, []);


  const handleDatasetClick = (datasetId: string) => {
    router.push(`/?datasetId=${datasetId}`);
  }

  if(error) {
    return (
        <div className="min-h-screen p-8 flex items-center justify-center bg-gray-50">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold">Error:</strong>
                <span className="block sm:inline">{error}</span>
            </div>
        </div>
    )
  }


    return (
      <div className="min-h-screen p-8">
          <h1 className="text-2xl font-bold mb-6">Available Datasets</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {datasets.map((dataset) => (
                  <div key={dataset.id} className="border rounded-lg p-4 flex flex-col">
                      <h2 className="text-lg font-bold mb-2">{dataset.name}</h2>
                    {dataset.description && <p className="text-gray-700 mb-2">{dataset.description}</p>}
                    {dataset.instructions && <p className="text-gray-700 mb-2">{dataset.instructions}</p>}
                    {dataset.rules && <p className="text-gray-700 mb-2">{dataset.rules}</p>}
                    <button onClick={() => handleDatasetClick(dataset.id)} className="mt-auto bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors">Start Working</button>
                  </div>
              ))}
          </div>
      </div>
    );
};
export default DatasetsPage;