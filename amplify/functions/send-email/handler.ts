import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import type { Schema } from "../../data/resource";

import { getConfirmationEmailHtml } from "./templates/confirmation";

const client = new SESClient();

export const handler: Schema["sendEmail"]["functionHandler"] = async (
  event,
) => {
  const {
    to,
    subject,
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
  } = event.arguments;

  const htmlBody = getConfirmationEmailHtml({
    firstName,
    lastName,
    listingTitle,
    listingDescription: listingDescription || undefined,
    listingPrice: listingPrice || undefined,
    startDate,
    endDate,
    numberOfPeople,
    hostName: hostName || undefined,
    listingUrl: listingUrl || undefined,
  });

  try {
    console.log(`Attempting to send email to ${to} with subject: ${subject}`);
    await client.send(
      new SendEmailCommand({
        Source: "brady800526@gmail.com", // TODO: Replace this with your verified SES email address
        Destination: { ToAddresses: [to] },
        Message: {
          Subject: { Data: subject },
          Body: {
            Html: { Data: htmlBody },
            Text: { Data: `Reservation Confirmed for ${listingTitle}. Check your email for details.` },
          },
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
