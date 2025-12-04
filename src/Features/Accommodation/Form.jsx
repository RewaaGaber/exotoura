import { useState } from "react";
import Step1 from "./Components/Step1";
import Step2 from "./Components/Step2";
import AccommodationType from "./Components/AccommodationType";
import Location from "./Components/Location";
import ShareBasics from "./Components/Numbers";
import Facilities from "./Components/Facilities";
import AccessibilityFeatures from "./Components/AccessibilityFeatures";
import HouseRules from "./Components/HouseRules";
import Title from "./Components/Title";
import Description from "./Components/Description";
import Step3 from "./Components/Step3";
import Price from "./Components/Price";
import Deposit from "./Components/Deposit";
import ImagesUpload from "./Components/Images";
export default function MultiStepForm() {
  const [step, setStep] = useState(localStorage.getItem("step") ? parseInt(localStorage.getItem("step")) : 1);

  const nextStep = () => {
    localStorage.setItem("step", step + 1);
    setStep(step + 1);
  };
  const prevStep = () => {
    localStorage.setItem("step", step - 1);
    setStep(step - 1);
  };
  const submitForm = () => {};

  return (
    <>
      {step === 1 && <Step1 nextStep={nextStep} />}
      {step === 2 && <AccommodationType prevStep={prevStep} nextStep={nextStep} />}
      {step === 3 && <Location prevStep={prevStep} nextStep={nextStep} />}
      {step === 4 && <ShareBasics prevStep={prevStep} nextStep={nextStep} />}
      {step === 5 && <Step2 prevStep={prevStep} nextStep={nextStep} />}
      {step === 6 && <Facilities prevStep={prevStep} nextStep={nextStep} />}
      {step === 7 && <AccessibilityFeatures prevStep={prevStep} nextStep={nextStep} />}
      {step === 8 && <HouseRules prevStep={prevStep} nextStep={nextStep} />}
      {step === 9 && <Title prevStep={prevStep} nextStep={nextStep} />}
      {step === 10 && <Description prevStep={prevStep} nextStep={nextStep} />}
      {step === 11 && <Step3 prevStep={prevStep} nextStep={nextStep} />}
      {step === 12 && <Price prevStep={prevStep} nextStep={nextStep} />}
      {step === 13 && <Deposit prevStep={prevStep} nextStep={nextStep} />}
      {step === 14 && <ImagesUpload prevStep={prevStep}/>}
    </>
  );
}
