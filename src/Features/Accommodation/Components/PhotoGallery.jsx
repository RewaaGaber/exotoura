import React from "react";
import { useRef } from "react";
import { Image } from "primereact/image";
import { Galleria } from "primereact/galleria";

const PhotoGallery = ({ images }) => {
  const galleria = useRef(null);
  const galleriaImages = images.map((image, index) => ({
    itemImageSrc: image,
    thumbnailImageSrc: image,
    alt: `Gallery image ${index + 1}`,
  }));
  const responsiveOptions = [
    {
      breakpoint: "1500px",
      numVisible: 5,
    },
    {
      breakpoint: "1024px",
      numVisible: 3,
    },
    {
      breakpoint: "768px",
      numVisible: 2,
    },
    {
      breakpoint: "560px",
      numVisible: 1,
    },
  ];
  const itemTemplate = (item) => {
    return (
      <img
        src={item.itemImageSrc}
        alt={item.alt}
        style={{ width: "100%", display: "block" }}
      />
    );
  };

  const thumbnailTemplate = (item) => {
    return (
      <img src={item.thumbnailImageSrc} alt={item.alt} style={{ display: "block" }} />
    );
  };

  const icon = <i className="pi pi-search"></i>;
  return (
    <>
      <Galleria
        ref={galleria}
        value={galleriaImages}
        responsiveOptions={responsiveOptions}
        numVisible={9}
        style={{ maxWidth: "50%" }}
        circular
        fullScreen
        showItemNavigators
        item={itemTemplate}
        thumbnail={thumbnailTemplate}
      />

      <div className="flex flex-col gap-2 max-w-md md:flex-row md:max-w-6xl md:max-h-[450px] mx-auto rounded-lg overflow-hidden  bg-stone-200 p-2 shadow-2xl shadow-cyan-950 ">
        {/* Main Image (Left Side) */}
        {images.length > 0 && (
          <div className="flex-1">
            <Image
              src={images[0]}
              indicatorIcon={icon}
              alt="Image"
              className="w-full h-full"
              imageClassName="w-full h-full object-cover rounded-lg"
              preview
              width="100%"
            />
          </div>
        )}

        {/* Grid of Smaller Images (Right Side) */}
        <div className="flex flex-wrap md:w-1/2 gap-2 overflow-hidden relative">
          {images.slice(1, 5).map((image, index) => (
            <div className="w-[49%] md:h-[49%] relative">
              <Image
                key={index}
                src={image}
                indicatorIcon={icon}
                alt={`Gallery view ${index + 1}`}
                className="w-full h-full"
                imageClassName="w-full h-full object-cover rounded-lg"
                preview
                width="100%"
              />

              {index === 3 && (
                <button
                  className="absolute bottom-2 right-2 bg-white border border-gray-300 rounded-md px-2 py-1 flex items-center gap-1 text-sm cursor-pointer hover:bg-gray-300 transition duration-300"
                  onClick={() => galleria.current.show()}
                >
                  <span className="text-base">☰</span> Show all photos
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
export default PhotoGallery;
