import { useInterval } from "primereact/hooks";
import { classNames } from "primereact/utils";
import React, { useEffect, useRef, useState } from "react";

const texts = [
  "Adventure",
  "Professional Events",
  "Travel",
  "Cultures Meet",
  "Memories",
  "the Journey",
];

const SliderText = () => {
  const heightRef = useRef(null);
  const [height, setHeight] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const element = heightRef.current;
    if (!element) return;

    const observer = new ResizeObserver(() => {
      setHeight(element.scrollHeight);
    });
    observer.observe(element);

    setHeight(element.scrollHeight);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsActive(false);
    }, 10000);

    setIsActive(true);

    return () => clearTimeout(timeoutId);
  }, []);

  useInterval(() => {
    setIsActive(true);

    setTimeout(() => {
      setIsActive(false);
    }, 10000);
  }, 20000);

  return (
    <div
      className={classNames(
        "text-[clamp(2.25rem,5vw,3.25rem)] font-semibold text-neutral-800 font-roboto",
        "overflow-hidden select-none relative" ,"text-white"
      )}
    >
      <h1 className="sm:hidden text-center leading-10 text-white">
        Where <span className="text-yellow-600">Adventure</span> Happens
      </h1>
      <div className="relative max-sm:hidden" style={{ height: `${height}px` }}>
        <h1
          className={classNames(
            "absolute left-1/2 transition duration-1000 ease-in-out",
            {
              "-translate-x-[298.5%] animate-slide2": isActive,
              "-translate-x-[208.5%] delay-2000": !isActive,
            }
          )}
          ref={heightRef}
        >
          Where
        </h1>

        <div
          className={classNames(
            "absolute left-1/2 -translate-x-[56.3%] transition-transform duration-2000 ease-custom",
            "text-yellow-600 text-center whitespace-nowrap",
            {
              "-translate-y-[85.7%]": isActive,
              "-translate-y-0": !isActive,
            }
          )}
        >
          {texts.map((text, idx) => (
            <h1 key={idx}>{text}</h1>
          ))}
          <h1>{texts[0]}</h1>
        </div>

        <h1
          className={classNames(
            "absolute left-1/2 transition duration-1000 ease-in-out",
            {
              "translate-x-[115%] animate-slide1": isActive,
              "translate-x-[50%] delay-2000": !isActive,
            }
          )}
        >
          Happens
        </h1>
      </div>
    </div>
  );
};

export default SliderText;
