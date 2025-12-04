import React from "react";
import { Galleria } from "primereact/galleria";

const EventSlider = ({ eventImages }) => {
  const responsiveOptions = [
    {
      breakpoint: "991px",
      numVisible: 4,
    },
    {
      breakpoint: "767px",
      numVisible: 3,
    },
    {
      breakpoint: "575px",
      numVisible: 1,
    },
  ];

  const itemTemplate = (item) => {
    return (
      <img
        src={item.itemImageSrc}
        alt={item.alt}
        className="w-full h-96 md:h-[30rem]  object-cover"
        style={{ width: "100%", display: "block" }}
      />
    );
  };

  const prevIcon = () => <span className="pi pi-angle-left text-3xl text-white top-1/2 abs"></span>;
  const nextIcon = () => <span className="pi pi-angle-right text-3xl text-white"></span>;

  return (
    <Galleria
      value={eventImages}
      responsiveOptions={responsiveOptions}
      numVisible={5}
      item={itemTemplate}
      showThumbnails={false}
      showIndicators
      circular
      autoPlay
      // indicator={indicatorTemplate}
      transitionInterval={2000}
      showItemNavigators
      showIndicatorsOnItem
      itemPrevIcon={prevIcon}
      itemNextIcon={nextIcon}
    />
  );
};

export default EventSlider;
