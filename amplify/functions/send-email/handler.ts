import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import type { Schema } from "../../data/resource";

const client = new SESClient();

export const handler: Schema["sendEmail"]["functionHandler"] = async (
  event,
) => {
  const { to, subject, body } = event.arguments;
  try {
    console.log(`Attempting to send email to ${to} with subject: ${subject}`);
    await client.send(
      new SendEmailCommand({
        Source: "brady800526@gmail.com", // TODO: Replace this with your verified SES email address
        Destination: { ToAddresses: [to] },
        Message: {
          Subject: { Data: subject },
          Body: { Text: { Data: body } },
        },
      }),
    );
    return "Email sent successfully";
  } catch (error) {
    console.error(error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to send email",
    );
  }
};
