'use client';

export default function ErrorFallback({ error }: { error: Error }) {
  return (
    <div className="p-8 bg-red-50 text-red-700 border border-red-200 rounded-lg m-8">
      <h2 className="text-xl font-bold mb-4">Something went wrong!</h2>
      <p className="font-mono">{error.message}</p>
    </div>
  );
}