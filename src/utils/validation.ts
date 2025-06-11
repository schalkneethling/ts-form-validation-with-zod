import { z } from "zod/v4";

export type ContactFormData = z.infer<typeof contactFormSchema>;

const contactFormSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.email({ message: "Invalid email address" }),
  phone: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z
      .string()
      .regex(/(\d{3})-(\d{3})-(\d{4})/, {
        message: "Invalid format. The expected format is: 111-111-1111",
      })
      .optional(),
  ),
  message: z
    .string()
    .min(10, { message: "Message must be at least 10 characters long" }),
});

export const validateContactForm = (data: ContactFormData) => {
  return contactFormSchema.safeParse(data);
};
