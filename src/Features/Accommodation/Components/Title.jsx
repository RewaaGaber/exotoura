import BoxArea from "./BoxArea";
import Footer from "./Footer";
import Header from "./Header";
import ValidationError from "./ValidationError";
import { useState } from "react";

const Title = ({ prevStep, nextStep }) => {
  const [error, setError] = useState(false);
  const [title, setTitle] = useState(localStorage.getItem("name") || "");
  const maxLength = 100;

  const handleNextStep = () => {
    if (title.length < 5 || title.length > maxLength) {
      setError(true);
      return;
    }
    setError(false);
    localStorage.setItem("name", title);
    nextStep();
  };

  const handleTitleChange = (e) => {
    if (e.target.value.length <= maxLength) {
      setTitle(e.target.value);
    }
  };

  return (
    <>
      <Header />
      <ValidationError Open={error} handleClose={() => setError(false)} message={"Title should be at least 5 => 50 characters"} />

      {/* <div className=" w-full flex flex-col justify-center"> */}
      <BoxArea
        title={"Now, let's give your accommodation a title"}
        subtitle={"Short titles work best. Have fun with it—you can always change it later."}
        handleCange={handleTitleChange}
        length={`${maxLength - title.length} / ${maxLength}`}
        value={title}
      />
      <Footer nextStep={handleNextStep} prevStep={prevStep} step1Number={4} step2Number={4} />
    </>
  );
};

export default Title;
