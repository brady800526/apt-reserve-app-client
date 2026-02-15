import {
  EmailService,
  SendConfirmationEmailInput,
} from "../services/EmailService";

export const useEmailViewModel = () => {
  const sendConfirmationEmail = async (
    input: SendConfirmationEmailInput,
  ): Promise<string | null> => {
    try {
      await EmailService.sendConfirmationEmail(input);
      return null;
    } catch (error: any) {
      console.error("Failed to send email", error);
      return error.message || "Unknown error occurred";
    }
  };

  return { sendConfirmationEmail };
};
