interface RunButtonProps {
  onRun: () => void;
}

export function RunButton({ onRun }: RunButtonProps) {
  const runFlow = () => {
    console.log("Running flow...");
    onRun();
  };

  return (
    <button
      onClick={runFlow}
      className="absolute text-lg top-4 right-4 bg-pink-100 hover:bg-pink-200 text-pink-500 font-semibold py-2 px-4 rounded-lg border border-pink-500 transition-colors z-50 flex items-center gap-2"
    >
      Run Flow
    </button>
  );
}
