import { Button } from "primereact/button";
import { Password } from "primereact/password";
import { classNames } from "primereact/utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { useUpdatePasswordMutation } from "../Hooks/useAuthApi";
import { useAuthStore } from "../Hooks/useAuthStore";

const inputClasses = classNames(
  "focus:shadow-[0_0_0_0.2rem_rgba(254,249,195,1)]",
  "w-full focus:border-yellow-400 hover:border-yellow-400",
  "ring-0 flex-1"
);
const labelClasses = "block font-semibold mb-1";

const PasswordForm = () => {
  const schema = yup.object().shape({
    currentPassword: yup.string().required(),
    password: yup.string().required(),
  });

  const { execute: updatePassword, isLoading } = useUpdatePasswordMutation();
  const { setToken, setRefreshToken } = useAuthStore();

  const {
    handleSubmit,
    formState: { errors, isDirty },
    register,
    setValue,
    reset,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      currentPassword: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    const { accessToken, refreshToken } = await updatePassword(data);
    setToken(accessToken);
    setRefreshToken(refreshToken);

    reset();
  };

  return (
    <form className="card flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <h3 className="text-[22px] font-bold">Change password</h3>

      <div>
        <label htmlFor="currentPassword" className={labelClasses}>
          Current password
        </label>
        <Password
          id="currentPassword"
          name="currentPassword"
          toggleMask
          feedback={false}
          value={watch("currentPassword")}
          {...register("currentPassword")}
          onChange={(e) =>
            setValue("currentPassword", e.target.value, { shouldDirty: true })
          }
          pt={{
            root: "w-full [&>*]:w-full",
            input: inputClasses,
            showIcon: "mb-2",
            hideIcon: "mb-2",
          }}
        />
      </div>

      <div>
        <label htmlFor="password" className={labelClasses}>
          New password
        </label>
        <Password
          id="password"
          name="password"
          toggleMask
          value={watch("password")}
          {...register("password")}
          onChange={(e) => setValue("password", e.target.value, { shouldDirty: true })}
          pt={{
            root: "w-full [&>*]:w-full",
            input: inputClasses,
            showIcon: "mb-2",
            hideIcon: "mb-2",
          }}
        />
        <small className="text-gray-500 text-xs">Minimum 8 characters</small>
      </div>

      <Button
        label="Change"
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

export default PasswordForm;
