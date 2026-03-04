import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StepOne from '../components/StepOne';
import StepTwo from '../components/StepTwo';
import ProgressBar from '../components/ProgressBar';
export default function IncorporationForm() {
  const [step, setStep] = useState<number>(1);
  const [companyId, setCompanyId] = useState<number | null>(null);
  const navigate = useNavigate();

  // On mount, check if there's a draft saved in localStorage
  useEffect(() => {
    const savedId = localStorage.getItem('draftCompanyId');
    if (savedId) {
      setCompanyId(parseInt(savedId));
      setStep(2); // Jump to Step 2 if a draft exists
    }
  }, []);

  const handleComplete = () => {
    localStorage.removeItem('draftCompanyId'); // Clean up!
    navigate('/admin'); // Send them to the admin dashboard
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md border border-gray-100">
      
      {/* here is the progress bar */}
      <div className="mb-8 border-b pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Company Incorporation</h2>
        <ProgressBar currentStep={step} />
      </div>
      {/* here is the form content */}
      {step === 1 && (
        <StepOne 
          companyId={companyId} 
          onNext={(id) => {
            setCompanyId(id);
            localStorage.setItem('draftCompanyId', id.toString()); // Persist the ID
            setStep(2);
          }} 
        />
      )}

      {step === 2 && companyId && (
       <StepTwo 
            companyId={companyId}
            onComplete={handleComplete}
            onBack={()=> setStep(1)}
       />
      )}
      
    </div>
  );
}