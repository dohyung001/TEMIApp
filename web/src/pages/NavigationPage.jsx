import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Step1 from "../components/navigation/Step1";
import Step2 from "../components/navigation/Step2";
import Step3 from "../components/navigation/Step3";
export default function NavigationPage() {
  const [step, setStep] = useState(1);

  


  console.log(step);
  return (
    <div className="flex items-center justify-center ">
      <div>
        {step === 1 && <Step1 onNext={() => setStep(2)} />}

        {step === 2 && <Step2 />}

        {step === 3 && <Step3 />}
      </div>
    </div>
  );
}
