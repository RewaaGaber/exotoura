import Footer from "./Footer";
import Header from "./Header";
import ValidationError from "./ValidationError";
import { useState } from "react";
import BoxNumber from "./BoxNumber";
import { minor } from "@mui/material";

const Price = ({ prevStep, nextStep }) => {
  const [error, setError] = useState(false); // Initialize with a boolean
  const [price, setprice] = useState(parseInt(localStorage.getItem("price")) || "");

  const handleNextStep = () => {
    if (!price || price < 0 || price > 10000) {
      setError(true);
      return;
    }
    setError(false);
    localStorage.setItem("price", price);
    nextStep();
  };
  return (
    <>
      <Header />
      <ValidationError Open={error} handleClose={() => setError(false)} message={"price should be a number at least 10 and at most 10,000"} />
      <BoxNumber
        title={"Now, set your price"}
        subtitle={"You can change it anytime."}
        handleCange={(val) => setprice(val)}
        message={`Your earning after taxs will be ${price - Math.min(500, 0.05 * price)}`}
        value={price}
      />
      {/* <div></div> */}
      <Footer nextStep={handleNextStep} prevStep={prevStep} step1Number={4} step2Number={6} step3Number={1} />
    </>
  );
};

export default Price;
