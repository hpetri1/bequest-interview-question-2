import * as Yup from "yup";

export const validationSchema = Yup.object({
  data: Yup.string()
    .min(2, "Must be at least 2 characters")
    .max(50, "Must be 50 characters or less"),
});
