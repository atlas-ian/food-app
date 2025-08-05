export function FoodGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="card animate-pulse">
          <div className="aspect-square bg-gray-200 rounded-t-lg"></div>
          <div className="p-4">
            <div className="h-6 bg-gray-200 rounded mb-2"></div>
            <div className="flex items-center justify-between">
              <div className="h-8 w-20 bg-gray-200 rounded"></div>
              <div className="h-10 w-16 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}