export default function Loading() {
    return (
      <div className="min-h-screen p-8 grid grid-cols-3 gap-6 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="border rounded-lg p-4 space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            <div className="h-32 bg-gray-100 rounded"></div>
            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            <div className="h-48 bg-gray-100 rounded"></div>
          </div>
        ))}
      </div>
    );
  }