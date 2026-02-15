import { generateClient } from "aws-amplify/api";

const client = generateClient();

export const EmailService = {
  sendConfirmationEmail: async (
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
    listingUrl: string
  ) => {
    const emailMutation = `
      mutation SendEmail(
        $to: String!
        $subject: String!
        $firstName: String!
        $lastName: String!
        $listingTitle: String!
        $listingDescription: String
        $listingPrice: Float
        $startDate: String!
        $endDate: String!
        $numberOfPeople: Int!
        $hostName: String
        $listingUrl: String
      ) {
        sendEmail(
          to: $to
          subject: $subject
          firstName: $firstName
          lastName: $lastName
          listingTitle: $listingTitle
          listingDescription: $listingDescription
          listingPrice: $listingPrice
          startDate: $startDate
          endDate: $endDate
          numberOfPeople: $numberOfPeople
          hostName: $hostName
          listingUrl: $listingUrl
        )
      }
    `;

    const response = (await client.graphql({
      query: emailMutation,
      variables: {
        to,
        subject: "Reservation Confirmed!",
        firstName,
        lastName,
        listingTitle,
        listingDescription,
        listingPrice,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        numberOfPeople,
        hostName,
        listingUrl,
      },
    })) as any;

    if (response.errors && response.errors.length > 0) {
      throw new Error(response.errors[0].message || "Failed to send email");
    }

    return response.data.sendEmail;
  },
};
