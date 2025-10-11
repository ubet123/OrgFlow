const LoadingScreen = () => {
  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-emerald-400 font-medium">Loading OrgFlow...</p>
      </div>
    </div>
  );
};

export default LoadingScreen;