interface RunReportPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RunReportPanel({ isOpen, onClose }: RunReportPanelProps) {
  return (
    <div
      className={`fixed top-20 right-4 h-[90vh] w-96 bg-white border border-gray-200 rounded-lg transform transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "translate-x-full"
      } z-40`}
    >
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-xl font-bold">Run Report</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 p-1"
        >
          ✕
        </button>
      </div>
      <div className="p-4 text-gray-600">
        <p>Output should go here</p>
      </div>
    </div>
  );
}
