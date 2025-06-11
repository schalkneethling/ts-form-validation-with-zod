import type { z } from "zod/v4";

import { validateContactForm } from "../../src/utils/validation";

type Response = {
  errors?: z.core.$ZodIssue[];
  headers: {
    "Content-Type": string;
  };
  statusCode: number;
  body: string;
};

export const handler = async (event): Promise<Response> => {
  const data = JSON.parse(event.body);
  const validation = validateContactForm(data);

  let response = {
    headers: {
      "Content-Type": "application/json",
    },
  } as Response;

  if (!validation.success) {
    response.statusCode = 400;
    response.body = JSON.stringify({
      status: "error",
      message: "Invalid form data",
      errors: validation.error.issues,
    });
    return response;
  }

  response.statusCode = 200;
  response.body = JSON.stringify({
    status: "success",
    message: "Email sent successfully",
  });

  return response;
};
