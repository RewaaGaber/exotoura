import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { classNames } from "primereact/utils";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { useUpdateEmailMutation } from "../Hooks/useAuthApi";

const inputClasses = classNames(
  "focus:shadow-[0_0_0_0.2rem_rgba(254,249,195,1)]",
  "w-full focus:border-yellow-400 hover:border-yellow-400",
  "ring-0 flex-1 placeholder:text-gray-400"
);
const labelClasses = "block font-semibold mb-1";

const UpdateEmailPopup = ({ visible, onHide }) => {
  const { execute: updateEmail, isLoading, isSuccess } = useUpdateEmailMutation();

  const schema = yup.object().shape({
    email: yup.string().email().required(),
    password: yup.string().required(),
  });

  const {
    handleSubmit,
    formState: { errors, isDirty },
    register,
    setValue,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    await updateEmail(data);
    setTimeout(() => {
      navigate("/auth/email-verification");
      reset();
    }, 1000);
  };

  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      draggable={false}
      pt={{
        root: { className: "w-full max-w-2xl" },
        header: { className: "py-2" },
        closeButton: { className: "focus:shadow-[0_0_0_0.2rem_rgba(254,249,195,1)]" },
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div>
          <label htmlFor="email" className={labelClasses}>
            Email
          </label>
          <InputText
            type="email"
            id="email"
            {...register("email")}
            className={classNames(inputClasses, { "border-red-500": errors.email })}
            placeholder="Enter new email"
          />
        </div>

        <div>
          <label htmlFor="password" className={labelClasses}>
            Password
          </label>
          <Password
            id="password"
            name="password"
            placeholder="Enter current password"
            {...register("password")}
            toggleMask
            feedback={false}
            onChange={(e) => setValue("password", e.target.value, { shouldDirty: true })}
            pt={{
              root: "w-full [&>*]:w-full",
              input: inputClasses,
              showIcon: "mb-2",
              hideIcon: "mb-2",
            }}
          />
        </div>

        <Button
          label={isLoading ? "Sending..." : isSuccess ? "Sent" : "Send Verification code"}
          pt={{
            root: classNames(
              "bg-yellow-600 hover:bg-yellow-700 border-0 rounded-lg",
              "w-fit self-end px-4 py-3"
            ),
            label: "font-medium",
          }}
          icon={isLoading ? "pi pi-spin pi-spinner-dotted" : isSuccess && "pi pi-check"}
          severity="warning"
          type="submit"
          disabled={!isDirty || isLoading}
        />
      </form>
    </Dialog>
  );
};

export default UpdateEmailPopup;
