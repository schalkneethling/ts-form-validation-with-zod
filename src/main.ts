import type { z } from "zod/v4";

import { validateContactForm } from "./utils/validation";
import type { ContactFormData } from "./utils/validation";

import "./style.css";
import "./form.css";

const form = document.querySelector<HTMLFormElement>("form");

if (form && !form.hasAttribute("novalidate")) {
  form.setAttribute("novalidate", "");
}

const postFormData = async (data: ContactFormData) => {
  const fetchBase = ".netlify/functions/sendmail";
  const response = await fetch(fetchBase, {
    method: "POST",
    body: JSON.stringify(data),
  });

  return await response.json();
};
const clearErrorMessages = (form: HTMLFormElement) => {
  const errorMessages = form.querySelectorAll<HTMLDivElement>(".error-message");
  errorMessages.forEach((errorMessage) => {
    errorMessage.hidden = true;
  });
};

const showErrorMessages = (errors: z.core.$ZodIssue[]) => {
  errors.forEach((error) => {
    const errorMessageContainer = form?.querySelector<HTMLDivElement>(
      `#${String(error.path[0])}`,
    )?.nextElementSibling as HTMLDivElement;
    const errorMessage = document.createElement("p");
    errorMessage.textContent = error.message;

    if (errorMessageContainer) {
      errorMessageContainer.replaceChildren(errorMessage);
      errorMessageContainer.hidden = false;
    }
  });
};

form?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const data = Object.fromEntries(formData) as ContactFormData;

  const successMessage = document.querySelector(
    ".success-message",
  ) as HTMLParagraphElement;
  const validation = validateContactForm(data);

  if (successMessage && successMessage.hidden === false) {
    successMessage.hidden = true;
  }

  clearErrorMessages(form);

  if (!validation.success) {
    const errors = validation.error.issues;
    showErrorMessages(errors);
  } else {
    const response = await postFormData(data);

    if (response.status === "success") {
      successMessage.hidden = false;
    } else {
      successMessage.hidden = true;
    }
  }
});
