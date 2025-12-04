import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { FileUpload } from "primereact/fileupload";
import person from "../../../assets/pfp.jpg";
import { classNames } from "primereact/utils";
import { Button } from "primereact/button";
import { DisabilityDropdown } from "../../Disability";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { userProfileSchema } from "../validations/userSchema";
import { useGetCurrentUser, useUpdateUser } from "../hooks/useUserApi";
import { useRef } from "react";
import { getChangedFields } from "../../../utils/getChangedFields";

const inputClasses = classNames(
  "focus:shadow-[0_0_0_0.2rem_rgba(254,249,195,1)]",
  "w-full focus:border-yellow-400 hover:border-yellow-400",
  "ring-0 flex-1 placeholder:text-gray-400"
);
const labelClasses = "block font-semibold mb-1";

const ProfileForm = ({ show }) => {
  const { data } = useGetCurrentUser();
  const { execute: updateUser, isLoading } = useUpdateUser("form");
  const user = data?.data?.user || {};
  const fileUploadRef = useRef(null);

  const {
    handleSubmit,
    formState: { errors, isDirty, dirtyFields },
    register,
    watch,
    setValue,
    reset,
  } = useForm({
    resolver: yupResolver(userProfileSchema),
    values: {
      firstName: user.fullName?.firstName,
      lastName: user.fullName?.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber || "",
      bio: user.bio || "",
      disabilities: user?.disabilities?.map((d) => d._id) || [],
      profilePicture: user.profilePicture || person,
    },
  });

  const onSubmit = async (data) => {
    const changedFields = getChangedFields({ dirtyFields, data });
    if (changedFields.profilePicture === person) {
      changedFields.profilePicture = "";
    }

    const formData = new FormData();
    Object.entries(changedFields).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        formData.append(key, value.join(","));
      } else {
        formData.append(key, value);
      }
    });

    await updateUser(formData, {
      targetUrl: "users/me",
      targetMethod: "get",
      targetPath: "data.user",
    });
    reset({ ...data });
  };

  return (
    <form className="card flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <h3 className="text-[22px] font-bold">Personal Info</h3>

      <div className="flex flex-wrap items-center gap-4">
        <div className="size-20 rounded-full overflow-hidden bg-gray-200">
          <img
            src={
              watch("profilePicture") instanceof File
                ? URL.createObjectURL(watch("profilePicture"))
                : watch("profilePicture")
            }
            alt="profile picture"
            className="size-full object-cover"
          />
        </div>

        <div className="flex flex-wrap gap-4 [&>*]:shrink-0">
          <FileUpload
            ref={fileUploadRef}
            mode="basic"
            accept="image/*"
            maxFileSize={1000000}
            customUpload
            chooseLabel="Upload new picture"
            onSelect={(e) => {
              if (!e.files.length) return;

              setValue("profilePicture", e.files[0], { shouldDirty: true });
              fileUploadRef.current.clear();
            }}
            pt={{
              chooseIcon: "hidden",
              basicButton: classNames(
                "focus:shadow-[0_0_0_2px_#ffffff,_0_0_0_4px_#eab308,_0_1px_2px_0_rgb(0_0_0_/_0.2)]",
                "bg-transparent border-2 border-yellow-600 rounded-lg"
              ),
              label: "text-yellow-600 max-w-40 line-clamp-1",
            }}
          />
          <Button
            icon="pi pi-trash"
            className="p-button-outlined p-button-secondary rounded-lg"
            label="Delete"
            type="button"
            onClick={() => {
              setValue("profilePicture", person, {
                shouldDirty: true,
              });
              fileUploadRef.current.clear();
            }}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="flex-1 w-full min-w-52">
          <label htmlFor="firstName" className={labelClasses}>
            First Name
          </label>
          <InputText
            id="firstName"
            name="firstName"
            className={inputClasses}
            {...register("firstName")}
            placeholder="Type here"
          />
        </div>
        <div className="flex-1 w-full min-w-52">
          <label htmlFor="lastName" className={labelClasses}>
            Last Name
          </label>
          <InputText
            id="lastName"
            name="lastName"
            className={inputClasses}
            {...register("lastName")}
            placeholder="Type here"
          />
        </div>
      </div>

      <div>
        <div className="row gap-2">
          <label htmlFor="email" className={labelClasses}>
            Email
          </label>
          <Button
            label="Change email"
            pt={{
              root: "bg-transparent p-0 border-0 group",
              label: classNames(
                "text-xs font-normal underline",
                "text-yellow-600 group-hover:text-yellow-700"
              ),
            }}
            severity="contrast"
            type="button"
            onClick={show}
          />
        </div>
        <InputText
          type="email"
          id="email"
          {...register("email")}
          className={classNames(inputClasses, { "border-red-500": errors.email })}
          disabled
          placeholder="Type here"
        />
      </div>

      <div className="flex-1 w-full min-w-52">
        <label htmlFor="phoneNumber" className={labelClasses}>
          Phone Number
        </label>
        <InputText
          id="phoneNumber"
          name="phoneNumber"
          className={inputClasses}
          {...register("phoneNumber")}
          placeholder="Type here"
        />
      </div>

      <div className="flex-1 w-full min-w-52">
        <label htmlFor="address" className={labelClasses}>
          Disabilities
        </label>
        <DisabilityDropdown
          value={watch("disabilities")}
          onChange={(e) =>
            setValue(
              "disabilities",
              e.value.map((d) => d._id),
              { shouldDirty: true }
            )
          }
        />
      </div>

      <div>
        <label htmlFor="bio" className={labelClasses}>
          Bio
        </label>
        <InputTextarea
          id="bio"
          name="bio"
          className={inputClasses}
          rows={3}
          autoResize
          {...register("bio")}
          placeholder="Type here"
        />
      </div>

      <Button
        label="Save personal info"
        pt={{
          root: classNames(
            "bg-yellow-600 hover:bg-yellow-700 border-0 rounded-lg",
            "w-fit self-end px-4 py-3"
          ),
          label: "font-medium",
        }}
        icon={isLoading && "pi pi-spin pi-spinner-dotted"}
        severity="warning"
        type="submit"
        disabled={!isDirty || isLoading}
      />
    </form>
  );
};

export default ProfileForm;
