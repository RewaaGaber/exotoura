import { Outlet } from "react-router-dom";
import { useState } from "react";
import { classNames } from "primereact/utils";
import { DashboardNavbar, Sidebar } from "../Components";

const DashboardLayout = () => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => setIsOpen((prev) => !prev);
  const closeSidebar = () => setIsOpen(false);

  return (
    <div className="h-screen flex flex-col">
      <DashboardNavbar toggle={toggleSidebar} />
      <div className="flex flex-1 h-full overflow-y-auto">
        <Sidebar isOpen={isOpen} close={closeSidebar} />
        <div
          className={classNames(
            "py-3 px-4 md:px-8 lg:px-12 bg-[#F8F9FA] flex-1",
            "text-[#383E50]",
            "overflow-y-auto space-y-6"
          )}
        >
          <Outlet />

          <p className="font-medium text-[#4F5D77] text-sm">
            {new Date().getFullYear()} © ExoToura. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
