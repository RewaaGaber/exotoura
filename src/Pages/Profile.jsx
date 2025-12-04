import { TabPanel, TabView } from "primereact/tabview";
import { classNames } from "primereact/utils";
import { Button } from "primereact/button";
import { ProfileForm } from "../Features/Users";
import { PasswordForm, UpdateEmailPopup } from "../Features/Auth";
import { useState } from "react";
import { UserPayments } from "../Features/Payments";

const pt = {
  headerAction: ({ context }) =>
    classNames("bg-transparent p-3", {
      "border-yellow-600": context.active,
    }),
  headerTitle: ({ context }) =>
    classNames("text-[15px] font-bold font-popin", {
      "text-yellow-600": context.active,
      "text-[#383E50]": !context.active,
    }),
};

const Profile = () => {
  const [showUpdatepopup, setShowUpdatepopup] = useState(false);
  const showEmailPopup = () => setShowUpdatepopup(true);
  const hideEmailPopop = () => setShowUpdatepopup(false);

  return (
    <div>
      <div className="space-y-1 mb-10">
        <h2 className="font-poppin text-3xl font-semibold">Settings</h2>
        <p className="font-medium text-sm text-neutral-600">
          Manage users, integrations, goals, and data to enhance your analytics
        </p>
      </div>

      <TabView
        pt={{
          nav: "bg-transparent",
          panelContainer: "mt-8 bg-transparent p-0",
        }}
      >
        <TabPanel header="Edit Profile" pt={pt}>
          <div className="flex max-sm:flex-col flex-wrap w-full [&>*]:flex-1 gap-3 lg:gap-6">
            <div className="sm:min-w-md w-full">
              <ProfileForm show={showEmailPopup} />
              <UpdateEmailPopup visible={showUpdatepopup} onHide={hideEmailPopop} />
            </div>

            <div className="sm:min-w-md w-full">
              <PasswordForm />

              <div className="flex justify-end mt-6">
                <Button
                  label="Delete account"
                  icon="pi pi-trash"
                  className="p-button-text p-button-danger"
                />
              </div>
            </div>
          </div>
        </TabPanel>
        <TabPanel header="Payment History" pt={pt}>
          <UserPayments />
        </TabPanel>
        <TabPanel header="Header III" pt={pt}>
          <p>test</p>
        </TabPanel>
      </TabView>
    </div>
  );
};

export default Profile;
