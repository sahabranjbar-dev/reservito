const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen flex-col gap-4 bg-white">
      <div className="w-12 h-12 border-4 border-blue-300 border-t-blue-600 rounded-full animate-spin"></div>
      <span className="text-sm text-slate-600 font-medium">
        در حال بارگزاری رزرو‌ها...
      </span>
    </div>
  );
};

export default Loading;
