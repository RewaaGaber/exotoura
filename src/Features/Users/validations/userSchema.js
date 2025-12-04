import * as Yup from "yup";

export const userProfileSchema = Yup.object().shape({
  firstName: Yup.string()
    .required("First name is required")
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters"),

  lastName: Yup.string()
    .required("Last name is required")
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be less than 50 characters"),

  phoneNumber: Yup.string()
    .nullable()
    .test("is-valid-phone", "Please provide a valid phone number", (value) => {
      if (!value) return true;
      return /^\+?[0-9\s-()]{8,20}$/.test(value);
    }),

  bio: Yup.string().max(500, "Bio must be less than 500 characters"),

  profilePicture: Yup.mixed(),

  disabilities: Yup.array().of(Yup.string()),
});
