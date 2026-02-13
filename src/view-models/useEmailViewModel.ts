import { generateClient } from "aws-amplify/api";

const client = generateClient();

export const useEmailViewModel = () => {
  const sendConfirmationEmail = async (
    to: string,
    name: string,
    title: string,
    start: Date,
    end: Date,
  ) => {
    try {
      const query = `
        mutation SendEmail($to: String!, $subject: String!, $body: String!) {
          sendEmail(to: $to, subject: $subject, body: $body)
        }
      `;
      const response = (await client.graphql({
        query,
        variables: {
          to,
          subject: `Reservation Confirmed for ${title}`,
          body: `Hi ${name}, your stay from ${start.toDateString()} to ${end.toDateString()} is confirmed.`,
        },
      })) as any;

      if (response.errors && response.errors.length > 0) {
        console.error("Failed to send email", response.errors);
        return false;
      }
      return true;
    } catch (error) {
      console.error("Failed to send email", error);
      return false;
    }
  };

  return { sendConfirmationEmail };
};
