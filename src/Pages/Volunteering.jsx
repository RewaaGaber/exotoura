import React, { useState, useRef } from "react";
import VolunteerCard from "../Features/Volunteers/Components/VolunteerCard";
import VolunteeringCasesCard from "../Features/Volunteers/Components/VolunteeringCasesCard";
import { Link, useNavigate } from "react-router-dom";
import { useGetCurrentUser } from "../Features/Users";
import {
  useCreateVolunteeringRequest,
  useGetAllCompletedVolunteeringRequests,
} from "../Features/Volunteers/Hoooks/useVolunteerApi";
import { Dialog } from "primereact/dialog";
import { InputTextarea } from "primereact/inputtextarea";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { motion } from "framer-motion";
import { useGetAllVolunteers } from "../Features/Users/hooks/useUserApi";
import Loader from "../Components/Loader/Loader";
import startHosting from "../assets/StartHosting.png";
import { MdVolunteerActivism, MdDashboardCustomize } from "react-icons/md";
import { FaPeoplePulling } from "react-icons/fa6";

const Volunteering = () => {
  const { isLoading, data: userResponse } = useGetCurrentUser();
  const { isLoading: isLoadingRequest, execute: executeRequest } =
    useCreateVolunteeringRequest();
  const { isLoading: isVolunteersLoading, data: VolunteersResponse } =
    useGetAllVolunteers(1, 3);
  const { data: volunteerCasses, isLoading: isVolunteerCassesLoading } =
    useGetAllCompletedVolunteeringRequests(3);
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleRequest = () => {
    if (!userResponse) return navigate("/auth/login");
    setVisible(true);
  };

  const toast = useRef(null);

  const handleConfirm = async () => {
    try {
      const response = await executeRequest({ message });
      if (response.status === "success") {
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Volunteer request has been created successfully!",
          life: 3000,
        });
        setVisible(false);
        setMessage("");
      }
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: error.response?.data?.message || "Failed to create volunteer request",
        life: 3000,
      });
    }
  };
  return (
    <>
      <Toast ref={toast} />
      {isVolunteersLoading || isVolunteerCassesLoading ? (
        <Loader />
      ) : (
        <>
          <div
            className=" 2xl:h-[60vh] xl:h-[70vh] md:h-[50vh] sm:h-[40vh] h-[30vh] overflow-hidden  bg-cover bg-center "
            style={{ backgroundImage: `url(${startHosting})` }}
          >
            <div className="h-full flex flex-col items-start justify-center  px-20 bg-gradient-to-r from-black to-transparent">
              <div className="text-white max-w-4xl w-full">
                <motion.h1
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-2 sm:mb-4 md:mb-6"
                >
                  Discover Egypt's Volunteers
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="text-base sm:text-lg md:text-xl lg:text-2xl mb-4 sm:mb-6 md:mb-8 lg:mb-12"
                >
                  Connect with volunteers to support disabilities
                </motion.p>
              </div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="text-base sm:text-lg md:text-xl lg:text-2xl mb-4 sm:mb-6 md:mb-8 lg:mb-12"
              >
                <div className="flex gap-3 pt-5 max-w-sm md:max-w-lg">
                  <Link
                    to="/volunteering/cases"
                    className="w-xs mt-2 sm:mt-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white py-2 sm:py-3 rounded-lg hover:from-amber-600 hover:to-orange-600  text-sm sm:text-base flex justify-center items-center gap-3"
                  >
                    <MdVolunteerActivism />
                    Explore Volunteering
                  </Link>
                  {!isLoading &&
                    !userResponse?.data?.user?.role?.includes("VOLUNTEER") && (
                      <button
                        onClick={handleRequest}
                        className="w-xs mt-2 sm:mt-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-2 sm:py-3 rounded-lg hover:from-blue-600 hover:to-indigo-600 text-sm sm:text-base flex justify-center items-center gap-3"
                      >
                        <FaPeoplePulling />
                        Request Random Volunteer
                      </button>
                    )}
                  {!isLoading &&
                    userResponse?.data?.user?.role?.includes("VOLUNTEER") && (
                      <Link
                        to={"/volunteering/dashboard/volunteer-request"}
                        className="w-xs mt-2 sm:mt-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-2 sm:py-3 rounded-lg hover:from-blue-600 hover:to-indigo-600 text-sm sm:text-base flex justify-center items-center gap-3"
                      >
                        <MdDashboardCustomize />
                        Go to dashboard
                      </Link>
                    )}
                </div>
              </motion.p>
            </div>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.9 }}
            className="text-base sm:text-lg md:text-xl lg:text-2xl"
          >
            <div className="px-14 md:px-12 lg:px-28 xl:px-20 py-10 bg-blue-50">
              <div className="flex justify-between items-center pt-5">
                <h1 className="text-2xl">Available Volunteers</h1>
                <Link
                  to="/volunteering/volunteers"
                  className="group flex items-center gap-2 text-orange-500 hover:text-orange-600 text-sm sm:text-base"
                >
                  Show more
                  <i className="pi pi-arrow-right w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 pt-5 mb-10">
                {VolunteersResponse?.data?.users?.map((volunteer, index) => (
                  <VolunteerCard volunteer={volunteer} key={index} />
                ))}
              </div>
              <div className="flex justify-between items-center">
                <h1 className="text-2xl">Recent Successful Volunteer Cases</h1>
                <Link
                  to="/volunteering/cases"
                  className="group flex items-center gap-2 text-orange-500 hover:text-orange-600 text-sm sm:text-base"
                >
                  Show more
                  <i className="pi pi-arrow-right w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
              </div>
              <div className="grid grid-cols-3 gap-4 pt-5 mb-16">
                {volunteerCasses?.data?.["volunteer requests"]?.map((req) => (
                  <VolunteeringCasesCard key={req._id} req={req} />
                ))}
              </div>
            </div>
          </motion.p>
        </>
      )}
      <Dialog
        visible={visible}
        onHide={() => setVisible(false)}
        header="Request A Volunteer"
        model
        footer={
          <div className="flex justify-end gap-2">
            <Button
              onClick={() => setVisible(false)}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-sm"
              severity="secondary"
              outlined
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              className="bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium hover:shadow-md transition-all px-4 py-2 hover:opacity-80 rounded-sm"
              severity="warning"
              loading={isLoadingRequest}
              label="Send Request"
            ></Button>
          </div>
        }
      >
        <div className="flex flex-col gap-2 w-2xl">
          <label htmlFor="message" className="text-gray-700">
            Message
          </label>
          <InputTextarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={5}
            className="w-full"
            placeholder="Type your message here..."
          />
        </div>
      </Dialog>
    </>
  );
};

export default Volunteering;
