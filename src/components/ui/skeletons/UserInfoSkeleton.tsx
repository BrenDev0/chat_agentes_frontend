export default function UserInfoSkeleton() {
  return (
    <div className="flex items-center gap-3 animate-pulse">
      <div className="hidden lg:block text-right space-y-1">
        <div className="h-4 w-24 bg-gray-300 rounded"></div>
        <div className="h-3 w-32 bg-gray-200 rounded"></div>
      </div>

      <div className="h-8 w-8 bg-gray-300 rounded-full"></div>
    </div>
  );
}
