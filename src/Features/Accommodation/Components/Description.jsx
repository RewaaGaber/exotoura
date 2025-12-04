import BoxArea from "./BoxArea";
import Footer from "./Footer";
import Header from "./Header";
import ValidationError from "./ValidationError";
import { useState } from "react";

const Description = ({ prevStep, nextStep }) => {
  const [error, setError] = useState(false); // Initialize with a boolean
  const [description, setDescription] = useState(localStorage.getItem("description") || "");
  const maxLength = 5000;

  const handleNextStep = () => {
    if (description.length < 20 || description.length > maxLength) {
      setError(true);
      return;
    }
    setError(false);
    localStorage.setItem("description", description);
    nextStep();
  };
  const HandelChange = (e) => {
    if (e.target.value.length > maxLength) return;
    setDescription(e.target.value);
  };
  return (
    <>
      <Header />
      <ValidationError Open={error} handleClose={() => setError(false)} message={"Description should be at least 20 => 500 characters"} />
      <BoxArea
        title={"Create your description"}
        subtitle={"Share what makes your place special."}
        handleCange={(e) => HandelChange(e)}
        length={`${maxLength - description.length} / ${maxLength}`}
        value={description}
      />
      <Footer nextStep={handleNextStep} prevStep={prevStep} step1Number={4} step2Number={5} />
    </>
  );
};

export default Description;
