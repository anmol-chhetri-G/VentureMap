interface ProgressBarProps {
  currentStep: number;
}

export default function ProgressBar({ currentStep }: ProgressBarProps) {
  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center">
        <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${
          currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
        }`}>
          1
        </div>
        <span className={`ml-2 text-sm font-medium ${currentStep >= 1 ? 'text-blue-800' : 'text-gray-500'}`}>
          Company Info
        </span>
      </div>
      
      <div className={`w-12 h-1 rounded ${currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
      
      <div className="flex items-center">
        <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${
          currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
        }`}>
          2
        </div>
        <span className={`ml-2 text-sm font-medium ${currentStep >= 2 ? 'text-blue-800' : 'text-gray-500'}`}>
          Shareholders
        </span>
      </div>
    </div>
  );
}