import { TabPanel, TabView } from "primereact/tabview";
import React, { useRef, useState } from "react";
import { classNames } from "primereact/utils";
import DestinationSearch from "./DestinationSearch";
import CheckInOutSearch from "./CheckInOutSearch";
import GuestsSearch from "./GuestsSearch";
import { OverlayPanel } from "primereact/overlaypanel";
import GuestsOptions from "./GuestsOptions";
import { addDays } from "date-fns";
import DateRangeOptions from "./DateRangeOptions";
import DestinationOptions from "./DestinationOptions";
import { useEffect } from "react";

const tabs = [
  { type: "event", icon: "pi pi-calendar", checkInOut: false },
  { type: "accommodation", icon: "pi pi-home", checkInOut: true },
  { type: "tour", icon: "pi pi-map", checkInOut: false },
];

const ActivitySearchBar = () => {
  const [active, setActive] = useState("");
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 768);
  const [overlayState, setOverlayState] = useState({
    destination: { searchTerm: "" },
    guests: { count: 0 },
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
      const isClickInsideActvityBar = barRef.current?.contains(e.target);
      const overlayElement = overlayRef.current?.getElement();
      const isClickInsideOverlay = overlayElement?.contains(e.target);

      if (!isClickInsideActvityBar && !isClickInsideOverlay) {
        hideOverlay();
      }
    };

    document.addEventListener("click", handleClick);

    return () => document.removeEventListener("click", handleClick);
  }, []);

  useEffect(() => {
    const handleResize = () => setIsSmallScreen(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getOverlayComponent = (type) => {
    const components = {
      destination: (
        <DestinationOptions state={overlayState} updateState={updateOverlayState} />
      ),
      dates: (
        <DateRangeOptions
          active={active}
          setActive={setActive}
          state={overlayState}
          updateState={updateOverlayState}
          isHorizontal={!isSmallScreen}
          hideOverlay={hideOverlay}
        />
      ),
      guests: (
        <GuestsOptions
          count={overlayState.guests.count || 0}
          setCount={(count) => updateOverlayState("guests", { count })}
        />
      ),
    };
    return components[type] || null;
  };

  return (
    <>
      <TabView
        pt={{
          navContent: "md:overflow-visible",
          nav:
            !isSmallScreen &&
            classNames(
              "border-0 bg-neutral-950/70",
              "px-2 py-1.5 pb-2 rounded-full",
              "w-fit mx-auto relative bottom-5 gap-0.5"
            ),
        }}
        activeIndex={1}
      >
        {tabs.map((tab, index) => (
          <TabPanel
            key={index}
            header={tab.type}
            leftIcon={tab.icon}
            pt={{
              header: "border-0",
              headerAction: ({ context }) =>
                isSmallScreen
                  ? classNames("gap-1 text-sm transition-all", {
                      "text-yellow-600 border-yellow-600": context.active,
                    })
                  : classNames(
                      "border-0 px-6 py-1.5 rounded-none rounded-full text-sm gap-1",
                      {
                        "bg-white text-neutral-800 cursor-default": context.active,
                        "bg-transparent hover:bg-neutral-700/70 text-white":
                          !context.active,
                      }
                    ),
            }}
          >
            <div
              className={classNames(
                "border border-[#DDDDDD] rounded-xl md:rounded-full shadow-custom2",
                "flex max-md:flex-col max-w-4xl mx-auto text-xs",
                {
                  "bg-[#EBEBEB] [&>div]:after:hidden": active,
                }
              )}
              ref={barRef}
            >
              <DestinationSearch
                active={active}
                checkInOut={tab.checkInOut}
                toggleOverlay={toggleOverlay}
                state={overlayState}
                updateState={updateOverlayState}
              />

              {tab.checkInOut && (
                <CheckInOutSearch
                  active={active}
                  setActive={setActive}
                  state={overlayState}
                  toggleOverlay={toggleOverlay}
                />
              )}

              <GuestsSearch
                active={active}
                checkInOut={tab.checkInOut}
                toggleOverlay={toggleOverlay}
                state={overlayState}
                updateState={updateOverlayState}
              />
            </div>
          </TabPanel>
        ))}
      </TabView>

      <OverlayPanel
        ref={overlayRef}
        onHide={hideOverlay}
        dismissable={false}
        pt={{
          root: classNames("rounded-4xl before:hidden after:hidden transition-none", {
            "w-full min-w-xs max-w-sm right-0": active === "guests",
            "w-full min-w-xs max-w-sm": active === "destination",
            "w-full max-w-4xl left-1/2 -translate-x-1/2":
              active === "checkin" || active === "checkout",
          }),
          content: "px-4 py-6",
        }}
      >
        {getOverlayComponent(
          active === "checkin" || active === "checkout" ? "dates" : active
        )}
      </OverlayPanel>
    </>
  );
};

export default ActivitySearchBar;
