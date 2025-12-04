import { Link, useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";

import {
  useGetAccommodation,
  requestAccommodation,
  useDeleteAccommodation,
  useGetNearbyAccommodations,
  useGetAccommodationRequests,
} from "../Features/Accommodation/Hooks/useAccommodationApi";
import { useGetCurrentUser } from "../Features/Users";
import Loader from "../Components/Loader/Loader";
import PhotoGallery from "../Features/Accommodation/Components/PhotoGallery";
import AccommodationRequests from "../Features/Accommodation/Components/AccommodationRequests";
import {
  FaStar,
  FaSwimmingPool,
  FaCheckCircle,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaHouseUser,
  FaUsers,
  FaBed,
  FaBath,
} from "react-icons/fa";
import { MdOutlineBedroomParent } from "react-icons/md";
import { IoIosSettings } from "react-icons/io";
import { IoAccessibility } from "react-icons/io5";
import locationIcon from "../assets/home.png";
import { ConfirmPopup, confirmPopup } from "primereact/confirmpopup";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { accessibilityFeaturesData } from "../Features/Accommodation/Components/AccessibilityFeatures";
import { facilitiesData } from "../Features/Accommodation/Components/Facilities";
import { houseRulesData } from "../Features/Accommodation/Components/HouseRules";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { BreadCrumb } from "primereact/breadcrumb";
import { useNavigate } from "react-router-dom";
import { OverlayPanel } from "primereact/overlaypanel";
import { classNames } from "primereact/utils";
import { format, addDays } from "date-fns";
import DateRangeOptions from "../Components/ui/ActivitySearchBar/DateRangeOptions";
import NearByAccommodationCard from "../Features/Accommodation/Components/NearByAccommodationCard";
const SpecificAccommodation = () => {
  const { id } = useParams();
  const toast = useRef(null);
  const navigate = useNavigate();

  const { data, isLoading, isSuccess } = useGetAccommodation(id);
  const {
    data: nearbyAccommodations,
    isLoading: isNearLoging,
    isSuccess: isNearSuccess,
  } = useGetNearbyAccommodations(
    ...(data?.data?.accommodation?.location?.coordinates || [0, 0])
  );

  const { isSuccess: isUserSeccess, data: userData } = useGetCurrentUser();

  const { isLoading: isDeleteLoading, execute: deleteAccommodation } =
    useDeleteAccommodation(id);
  const { isLoading: isReserveLoading, execute: reserve } = requestAccommodation();
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [active, setActive] = useState("");
  const [overlayState, setOverlayState] = useState({
    dates: {
      range: [
        {
          startDate: new Date(),
          endDate: addDays(new Date(), 7),
          key: "selection",
        },
      ],
      isStartVisited: false,
    },
  });
  const overlayRef = useRef(null);
  const barRef = useRef(null);

  const items = [
    { label: "CouchSurfing", url: "/accommodation" },
    { label: data?.data?.accommodation?.name, url: `/accommodation/${id}` },
  ];
  const home = { icon: "pi pi-home text-2xl ", url: "/" };

  const createCustomIcon = () => {
    return L.icon({
      iconUrl: locationIcon,
      iconSize: [40, 40],
      popupAnchor: [0, -32],
    });
  };
  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  const toggleOverlay = ({ event, type }) => {
    active ? setActive("") : setActive(type);
    overlayRef.current.toggle(event);
  };

  const hideOverlay = () => {
    overlayRef.current.hide();
    setActive("");
  };

  const updateOverlayState = (type, updates) => {
    setOverlayState((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        ...updates,
      },
    }));
  };

  useEffect(() => {
    const handleClick = (e) => {
      const isClickInsideBar = barRef.current?.contains(e.target);
      const overlayElement = overlayRef.current?.getElement();
      const isClickInsideOverlay = overlayElement?.contains(e.target);

      if (!isClickInsideBar && !isClickInsideOverlay) {
        hideOverlay();
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  const HandelDelete = async () => {
    try {
      const res = await deleteAccommodation();
      navigate("/accommodation", {
        state: {
          toast: {
            severity: "success",
            summary: "Success",
            detail: res.message,
            life: 3000,
          },
        },
      });
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: error.response.data.message,
        life: 3000,
      });
    }
  };

  const accept = async () => {
    try {
      const res = await reserve({
        accommodation: data.data.accommodation._id,
        from: overlayState.dates.range[0].startDate,
        to: overlayState.dates.range[0].endDate,
      });
      toast.current.show({
        severity: "success",
        summary: "Confirmed",
        detail:
          "Your reservation for this accommodation has been Successfully submitted\nJast wait until the hoster call you.",
        life: 5000,
      });
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Rejected",
        detail: error.response.data.message,
        life: 5000,
      });
    }
  };

  const confirmDelete = (event) => {
    confirmDialog({
      message: "Are you sure you want to delete this accommodation?",
      header: "Delete Confirmation",
      icon: "pi pi-exclamation-triangle",
      acceptClassName: "p-button-danger",
      accept: HandelDelete,
    });
  };

  const confirmReserve = (event) => {
    if (!isUserSeccess) return navigate("/auth/login");
    confirmDialog({
      message: "Are you sure you want to proceed?",
      header: "Sent Reservation",
      icon: "pi pi-check-circle",
      acceptClassName: "p-button-success",
      accept: accept,
    });
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <>
      {isSuccess ? (
        <>
          <Toast ref={toast} />
          <ConfirmDialog />
          <BreadCrumb
            model={items}
            home={home}
            className="ml-16 border-none text-lg px-0"
          />
          <PhotoGallery images={data.data.accommodation.images} />
          <div className="grid grid-cols-12 gap-6 m-14 max-h-fit  p-6  rounded-xl shadow-xl border-x-4 border-amber-500">
            <div className="col-span-6">
              {/* Title and Location */}
              <h1 className="text-2xl md:text-3xl font-medium text-gray-900">
                {data.data.accommodation.name}
              </h1>
              <p className="text-gray-600 mt-1 flex items-center gap-2">
                <FaUsers className="mr-1 text-amber-500 text-xs" />3 guests ·{" "}
                <MdOutlineBedroomParent className="mr-1 text-amber-500 text-xs" />1
                bedroom · <FaBed className="mr-1 text-amber-500 text-xs" />2 beds ·{" "}
                <FaBath className="mr-1 text-amber-500 text-xs" />1 bath
              </p>

              <div className="flex items-center mt-1">
                <FaStar className="text-yellow-400" />
                <span className="ml-1 text-gray-900 font-semibold">
                  {data.data.accommodation.rating} ·{" "}
                </span>
                <a href="#" className="ml-1 text-gray-600 underline">
                  3 reviews
                </a>
              </div>

              {/* Host Information */}
              <div className="flex items-center mt-4 border-t border-gray-200 pt-4">
                <img
                  src={data.data.accommodation.owner.profilePicture}
                  alt="Host"
                  className="w-10 h-10 rounded-full mr-3"
                />
                <div>
                  <p className="text-gray-900 font-semibold">
                    <span className="font-light">Hosted by</span>{" "}
                    {data.data.accommodation.owner.fullName.firstName}{" "}
                    {data.data.accommodation.owner.fullName.lastName}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {Math.ceil(
                      (new Date() - new Date(data.data.accommodation.createdAt)) /
                        (1000 * 60 * 60 * 24 * 30)
                    )}{" "}
                    months hosting
                  </p>
                </div>
              </div>

              {/* Key Features */}
              <div className="mt-6 border-t border-gray-200 pt-4">
                <div className="flex items-center mb-4">
                  <FaHouseUser className="text-gray-600 text-xl mr-3" />
                  <div>
                    <p className="text-gray-900 font-medium">
                      {data.data.accommodation.spaceOffered}
                    </p>
                    <p className="text-gray-600 text-sm">
                      This is one of the few places in the area with a{" "}
                      {data.data.accommodation.spaceOffered}.
                    </p>
                  </div>
                </div>

                <div className="flex mb-4  items-center">
                  <FaCheckCircle className="text-gray-600 text-xl mr-3" />
                  <div>
                    <p className="text-gray-900 font-medium">
                      Exceptional check-in experience
                    </p>
                    <p className="text-gray-600 text-sm">
                      Recent guests gave the check-in process a 5-star rating.
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <FaCalendarAlt className="text-gray-600 text-xl mr-3" />
                  <div>
                    <p className="text-gray-900 font-medium">
                      Free cancellation before{" "}
                      {new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                        }
                      )}
                    </p>
                    <p className="text-gray-600 text-sm">
                      Get a full refund if you change your mind.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 bg-amber-100 p-4 rounded-lg">
                <p className="text-gray-600 text-sm">
                  There are alot of reservation requests .{" "}
                  <Link
                    to={`/accommodation/${data.data.accommodation._id}/requests`}
                    className="text-amber-600 underline"
                  >
                    Show here
                  </Link>
                </p>
              </div>
              {/* </div> */}
              {/* Description */}
              <div className="mt-6 font-light">
                <p className="text-gray-900">
                  {showFullDescription
                    ? data.data.accommodation.description
                    : `${data.data.accommodation.description.substring(0, 200)}...`}
                </p>
                <button
                  onClick={toggleDescription}
                  className="mt-2 text-amber-500 font-semibold underline flex items-center"
                >
                  {showFullDescription ? "Show less" : "Show more"}
                  <span className="ml-1">›</span>
                </button>
              </div>
            </div>
            <div className="col-span-6">
              <div className="col-span-4">
                <img
                  src="https://img.freepik.com/free-vector/man-rest-wooden-house-porch-suburban-street_107791-12186.jpg?t=st=1745271728~exp=1745275328~hmac=dd284637f08ceb85b843237297558341040233c7013b0c01825fb7edde6e2092&w=2000"
                  alt="Location"
                  className="w-full h-64 object-cover rounded-lg"
                ></img>
              </div>
              <div className="max-w-96 mx-auto mt-9 h-fit">
                {data.data.accommodation.owner._id == userData?.data?.user?._id ? (
                  <>
                    <p className="text-center">Wanna delete this accommodation?</p>
                    <div className="flex justify-center items-center gap-4">
                      <Button
                        onClick={confirmDelete}
                        label="Delete"
                        icon={isDeleteLoading ? "pi pi-spin pi-spinner" : "pi pi-trash"}
                        className="p-button-danger cursor-pointe w-full py-5 mt-6 rounded-3xl flex justify-center items-center"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-center">
                      {data.data.accommodation.price} EGP per night{" "}
                    </p>
                    <div className="grid grid-cols-1 gap-0 my-6 border border-gray-300 rounded-lg">
                      <div className="flex w-full" ref={barRef}>
                        <div className="search-bar-comp-wrapper flex-1">
                          <div
                            className={classNames(
                              "search-bar-comp px-6 before-after-layers",
                              {
                                "bg-white shadow-custom2 z-20": active === "checkin",
                                "hover:bg-[#EBEBEB]": !active,
                                "hover:bg-[#DDDDDD]": active !== "checkin" && active,
                                "rounded-r-none hover:after:block": active === "checkout",
                              }
                            )}
                            onClick={(e) => toggleOverlay({ type: "checkin", event: e })}
                          >
                            <p>Check in</p>
                            <span className="font-medium text-neutral-700">
                              {format(overlayState.dates.range[0].startDate, "MMM dd")}
                            </span>
                          </div>
                        </div>

                        <div className="search-bar-comp-wrapper flex-1">
                          <div
                            className={classNames(
                              "search-bar-comp before-after-layers px-6",
                              {
                                "bg-white shadow-custom2 z-20": active === "checkout",
                                "hover:bg-[#EBEBEB] ": !active,
                                "hover:bg-[#DDDDDD]": active !== "checkout" && active,
                                "rounded-l-none hover:before:block": active === "checkin",
                              }
                            )}
                            onClick={(e) => toggleOverlay({ type: "checkout", event: e })}
                          >
                            <p>Check out</p>
                            <span className="font-medium text-neutral-700">
                              {format(overlayState.dates.range[0].endDate, "MMM dd")}
                            </span>
                          </div>
                        </div>
                      </div>

                      <OverlayPanel
                        ref={overlayRef}
                        onHide={hideOverlay}
                        dismissable={false}
                        pt={{
                          root: classNames(
                            "rounded-4xl before:hidden after:hidden transition-none",
                            {
                              "w-full max-w-4xl left-1/2 -translate-x-1/2":
                                active === "checkin" || active === "checkout",
                            }
                          ),
                          content: "px-4 py-6",
                        }}
                      >
                        {(active === "checkin" || active === "checkout") && (
                          <DateRangeOptions
                            active={active}
                            setActive={setActive}
                            state={overlayState}
                            updateState={updateOverlayState}
                            isHorizontal={true}
                            hideOverlay={hideOverlay}
                          />
                        )}
                      </OverlayPanel>
                    </div>
                    <div className="col-span-2 p-3">
                      <Button
                        className="w-full px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg border-0 font-medium hover:shadow-md transition-all"
                        label="Book now"
                        icon={isLoading && "pi pi-spin pi-spinner"}
                        loading={isReserveLoading}
                        onClick={confirmReserve}
                        disabled={isReserveLoading}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="mx-20">
            <h1 className="flex items-center text-2xl mb-4">
              Nearby Places |{" "}
              <p className="font-light ml-4 text-[15px]">Less than 10km away</p>
            </h1>
            <div className="flex gap-6 overflow-x-auto p-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              {isNearLoging && <Loader />}
              {isNearSuccess &&
                nearbyAccommodations.data.accommodations.map((accommodation) => (
                  <NearByAccommodationCard accommodation={accommodation} />
                ))}
            </div>
          </div>
          <div className="grid grid-cols-12 gap-6 m-14">
            {/* //Facilities Section */}
            <div className="col-span-12 lg:col-span-6 max-h-fit  p-6  rounded-xl shadow-xl border-l-4 border-amber-500">
              <div className="flex items-center">
                <FaCheckCircle className="text-gray-600 text-xl mr-3" />
                <h1 className="font-medium">What this place offers</h1>
              </div>
              <div className="grid grid-cols-2 my-2">
                {facilitiesData.map((ele) => {
                  if (data.data.accommodation.facilities.includes(ele.id)) {
                    return (
                      <div
                        key={ele.id}
                        className="col-span-1 flex items-center mx-4 my-1 gap-3"
                      >
                        {ele.icon}
                        <p className="text-gray-900 font-light">{ele.label}</p>
                      </div>
                    );
                  }
                })}
              </div>
            </div>
            {/* //Accessibility Features Section */}
            <div className="col-span-12 lg:col-span-6 lg:row-span-2 max-h-fit  p-6  rounded-xl shadow-xl border-l-4 border-amber-500">
              <div className="flex items-center">
                <IoAccessibility className="text-gray-600 text-xl mr-3" />
                <h1 className="font-medium">
                  What accessibility features you will find in this place
                </h1>
              </div>
              <div className="grid grid-cols-2 my-2">
                {accessibilityFeaturesData.map((ele) => {
                  if (data.data.accommodation.accessibilityFeatures.includes(ele.id)) {
                    return (
                      <div
                        key={ele.id}
                        className="col-span-1 flex items-center mx-4 my-1 gap-3 text-amber-500"
                      >
                        {ele.icon}
                        <p className="text-gray-900 font-light">{ele.label}</p>
                      </div>
                    );
                  }
                })}
              </div>
            </div>
            {/* // House Rules Section */}
            <div className="col-span-12 lg:col-span-6 max-h-fit  p-6  rounded-xl shadow-xl border-l-4 border-amber-500">
              <div className="flex items-center">
                <IoIosSettings className="text-gray-600 text-xl mr-3" />
                <h1 className="font-medium">
                  What rules you should follow in this accommodation
                </h1>
              </div>
              <div className="grid grid-cols-2 my-2">
                {houseRulesData.map((ele) => {
                  if (data.data.accommodation.houseRules.includes(ele.id)) {
                    return (
                      <div
                        key={ele.id}
                        className="col-span-1 flex items-center mx-4 my-1 gap-3"
                      >
                        {ele.icon}
                        <p className="text-gray-900 font-light">{ele.label}</p>
                      </div>
                    );
                  }
                })}
              </div>
            </div>
          </div>
          <hr className="w-7xl mx-auto" />
          <div className="rounded-xl my-14 w-[80%] mx-auto">
            <div className="flex items-center mb-8">
              <FaMapMarkerAlt className="text-2xl text-blue-600 mr-2" />
              <h2 className="text-xl font-medium text-gray-800">
                Where you’ll be : {data.data.accommodation.location.address}
              </h2>
            </div>
            <div className=" h-96 rounded-lg overflow-hidden shadow-md">
              <MapContainer
                center={data.data.accommodation.location.coordinates}
                zoom={13}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
                <Marker
                  position={data.data.accommodation.location.coordinates}
                  icon={createCustomIcon()}
                >
                  <Popup>{data.data.accommodation.name}</Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>
        </>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default SpecificAccommodation;
