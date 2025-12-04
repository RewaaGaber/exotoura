import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useEffect, useRef } from "react";
import { useAuthStore } from "./Features/Auth";
import useChatStore from "./Features/Chat/hooks/useChatStore.js";
import { useGetUserChatsQuery } from "./Features/Chat/hooks/useChatApi";
import { useGetCurrentUser } from "./Features/Users";

import {
  Home,
  Accomodation,
  SpecificEvent,
  Events,
  SpecificAccommodation,
  MapForAccommodations,
  Profile,
  Hangout,
  Disabilities,
  SpecificHangout,
  Volunteering,
  VolunteeringCenter,
  Volunteers,
  Chat,
  About,
} from "./Pages";
import VolunteeringCaseDetails from "./Pages/VolunteeringCaseDetails";
import { DashboardLayout, VolunteerLayout, Layout, LoginPersist } from "./Layouts";
import {
  Login,
  SignUp,
  ForgetPassword,
  PasswordResetCode,
  ResetPassword,
  EmailVerification,
  Terms,
  Privacy,
} from "./Features/Auth";

import { AccommodationFormStartPage, AccommodationForm } from "./Features/Accommodation";
import { CreateEvent } from "./Features/Event";
import { RoleRequestCreation } from "./Features/Role";
import HangoutRecommendation from "./Pages/HangoutRecommendation";

import CreateHangout from "./Features/hangout/Components/CreateHangout";

import RoleRequests from "./Features/Role/Components/RoleRequests.jsx";
import VolunteerRequests from "./Features/Volunteers/Components/VolunteerRequests.jsx";
import SuccessfullCases from "./Features/Volunteers/Components/SuccessfullCases.jsx";
import AllVolunteerRequests from "./Features/Volunteers/Components/AllVolunteerRequests.jsx";
import Places from "./Pages/Places.jsx";
import CreatePlace from "./Pages/CreatePlace.jsx";
import SpecificPlace from "./Pages/SpecificPlace.jsx";
import LearnAboutOrganizing from "./Features/Event/Components/LearnAboutOrganizing.jsx";
import { Users } from "./Features/Dashboard/index.js";
import LearnAboutHosting from "./Features/Accommodation/Components/LearnAboutHosting.jsx";
import AccommodationRequests from "./Features/Accommodation/Components/AccommodationRequests";
import EventLecturerRequests from "./Features/Event/Components/EventLecturerRequests.jsx";
import BecomeLecturer from "./Features/Event/Components/BecomeLecturer.jsx";
import EventsStatistics from "./Features/Dashboard/Components/EventsStatistics.jsx";
import PlaceRequests from "./Features/Dashboard/Components/PlaceRequests.jsx";
import PlanVisit from "./Pages/PlanVisit";

export default function App() {
  const { token } = useAuthStore();
  const { initializeSocket, chats, setChats } = useChatStore();
  const { isLoading, error, execute: getChats } = useGetUserChatsQuery();
  const { data: userData } = useGetCurrentUser();
  const hasFetchedChats = useRef(false);

  useEffect(() => {
    if (token) {
      initializeSocket(token);
    }
  }, [token, initializeSocket]);

  useEffect(() => {
    const userId = userData?.data?.user?._id;
    const shouldFetchChats = userId && !hasFetchedChats.current && !isLoading;

    if (shouldFetchChats) {
      hasFetchedChats.current = true;

      getChats()
        .then((response) => {
          if (response?.data?.chats) {
            setChats(response.data.chats);
          }
        })
        .catch((error) => {
          console.error("Failed to fetch chats:", error);
          // Optionally reset ref on error
          hasFetchedChats.current = false;
        });
    }
  }, [userData, isLoading, getChats, setChats]);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <LoginPersist />,
      children: [
        {
          path: "/",
          element: <Layout />,
          children: [
            { index: true, element: <Home /> },
            { path: "about", element: <About /> },
            { path: "*", element: <h1 className="py-64">404 Not Found</h1> },
          ],
        },
        {
          path: "auth",
          children: [
            { path: "login", element: <Login /> },
            { path: "signup", element: <SignUp /> },
            { path: "terms", element: <Terms /> },
            { path: "privacy", element: <Privacy /> },
            {
              path: "",
              element: <Layout />,
              children: [
                { path: "forget-password", element: <ForgetPassword /> },
                { path: "password-reset-code", element: <PasswordResetCode /> },
                { path: "reset-password", element: <ResetPassword /> },
                { path: "email-verification", element: <EmailVerification /> },
              ],
            },
          ],
        },
        {
          path: "accommodation",
          children: [
            {
              path: "",
              element: <Layout />,
              children: [
                { index: true, element: <Accomodation /> },
                { path: ":id", element: <SpecificAccommodation /> },
                { path: "map", element: <MapForAccommodations /> },
                { path: ":id/requests", element: <AccommodationRequests /> },
              ],
            },
            {
              path: "new",
              children: [
                { index: true, element: <AccommodationForm /> },
                { path: "overview", element: <AccommodationFormStartPage /> },
              ],
            },
            {
              path: "learn-about-hosting",
              element: <LearnAboutHosting />,
            },
          ],
        },
        {
          path: "events",
          children: [
            {
              path: "",
              element: <Layout />,
              children: [
                { index: true, element: <Events /> },
                { path: ":id", element: <SpecificEvent /> },
                { path: "lecturer/requests/:id", element: <EventLecturerRequests /> },
                { path: "lecturer/:id", element: <BecomeLecturer /> },
                { path: "create", element: <CreateEvent /> },
                { path: "learn-organizing", element: <LearnAboutOrganizing /> },
              ],
            },
          ],
        },
        {
          path: "hangouts",
          children: [
            {
              path: "",
              element: <Layout />,
              children: [
                { index: true, element: <Hangout /> },
                { path: ":id", element: <SpecificHangout /> },
                { path: "create", element: <CreateHangout /> },
                { path: "recommendation", element: <HangoutRecommendation /> },
              ],
            },
          ],
        },
        {
          path: "places",
          children: [
            {
              path: "",
              element: <Layout />,
              children: [
                { index: true, element: <Places /> },
                { path: "create", element: <CreatePlace /> },
                { path: ":id", element: <SpecificPlace /> },
                { path: ":id/plan-visit", element: <PlanVisit /> },
              ],
            },
          ],
        },
        {
          path: "role",
          children: [
            {
              path: "",
              element: <Layout />,
              children: [
                { index: true, element: <h1>Role</h1> },
                { path: "request", element: <RoleRequestCreation /> },
              ],
            },
          ],
        },
        {
          path: "dashboard",
          children: [
            {
              element: <DashboardLayout />,
              children: [
                { index: true, element: <Profile /> },
                { path: "role-requests", element: <RoleRequests /> },
                { path: "place-requests", element: <PlaceRequests /> },
                { path: "users", element: <Users /> },
                { path: "events", element: <EventsStatistics /> },
              ],
            },
          ],
        },
        {
          path: "disabilities",
          element: <Disabilities />,
        },
        {
          path: "chat",
          element: <Layout />,
          children: [{ index: true, element: <Chat /> }],
        },
        {
          path: "volunteering",
          children: [
            {
              path: "",
              element: <Layout />,
              children: [
                { index: true, element: <Volunteering /> },
                { path: "volunteers", element: <Volunteers /> },
                { path: "cases", element: <SuccessfullCases /> },
                { path: "case/:id", element: <VolunteeringCaseDetails /> },
              ],
            },
            {
              path: "dashboard",
              element: <VolunteerLayout />,
              children: [
                {
                  index: true,
                  path: "volunteer-request",
                  element: <AllVolunteerRequests />,
                },
                {
                  path: "my-assigned-requests",
                  element: <VolunteerRequests status={`ACCEPTED`} />,
                },
                {
                  path: "Finished-Requests",
                  element: <VolunteerRequests status={`COMPLETED`} />,
                },
              ],
            },
            {
              path: "center",
              element: <VolunteeringCenter />,
            },
          ],
        },
      ],
    },
  ]);
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}
