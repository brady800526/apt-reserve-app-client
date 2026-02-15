import { EmailService } from "../services/EmailService";

export const useEmailViewModel = () => {
  const sendConfirmationEmail = async (
    to: string,
    firstName: string,
    lastName: string,
    listingTitle: string,
    listingDescription: string,
    listingPrice: number,
    startDate: Date,
    endDate: Date,
    numberOfPeople: number,
    hostName: string,
    listingUrl: string,
  ): Promise<string | null> => {
    try {
      await EmailService.sendConfirmationEmail(
        to,
        firstName,
        lastName,
        listingTitle,
        listingDescription,
        listingPrice,
        startDate,
        endDate,
        numberOfPeople,
        hostName,
        listingUrl,
      );
      return null;
    } catch (error: any) {
      console.error("Failed to send email", error);
      return error.message || "Unknown error occurred";
    }
  };

  return { sendConfirmationEmail };
};
