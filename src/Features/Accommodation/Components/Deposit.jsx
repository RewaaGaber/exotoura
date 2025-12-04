import Footer from "./Footer";
import Header from "./Header";
import ValidationError from "./ValidationError";
import { useState } from "react";
import BoxNumber from "./BoxNumber";

const Deposit = ({ prevStep, nextStep }) => {
  const [error, setError] = useState(false); // Initialize with a boolean
  const [deposit, setdeposit] = useState(localStorage.getItem("deposit") || "");

  const handleNextStep = () => {
    if (!deposit || deposit < 0 || deposit > parseInt(localStorage.getItem("price"))) {
      setError(true);
      return;
    }
    setError(false);
    localStorage.setItem("deposit", deposit);
    nextStep();
  };
  return (
    <>
      <Header />
      <ValidationError Open={error} handleClose={() => setError(false)} message={"deposit should be a number and less than the price"} />
      <BoxNumber title={"Now, set your deposit"} subtitle={"This is what guests will have to pay on reservations ."} handleCange={(val) => setdeposit(val)} value={deposit}/>
      <Footer nextStep={handleNextStep} prevStep={prevStep} step1Number={4} step2Number={6} step3Number={2} />
    </>
  );
};

export default Deposit;
