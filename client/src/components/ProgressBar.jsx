const ProgressBar = ({ progress }) => {
  return (
    <div className="w-full bg-gray-200 h-6">
      <div
        className="bg-purple-950 h-full transition-width duration-500 ease-in-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export default ProgressBar;
