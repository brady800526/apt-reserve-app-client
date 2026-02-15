import { generateClient } from "aws-amplify/api";

const client = generateClient();

export const BookingService = {
  fetchBookings: async () => {
    const query = `
      query ListReservations {
        listReservations {
          items {
            startDate
            endDate
          }
        }
      }
    `;
    const res = (await client.graphql({ query })) as any;
    return res.data.listReservations.items;
  },

  createReservation: async (input: {
    firstName: string;
    lastName: string;
    email: string;
    startDate: string;
    endDate: string;
    numberOfPeople: number;
  }) => {
    const mutation = `
      mutation CreateReservation($input: CreateReservationInput!) {
        createReservation(input: $input) {
          id
        }
      }
    `;
    const res = (await client.graphql({
      query: mutation,
      variables: { input },
    })) as any;

    if (res.errors && Array.isArray(res.errors) && res.errors.length > 0) {
      throw new Error(res.errors[0].message);
    }

    return res.data.createReservation;
  },
};
