import { generateClient } from "aws-amplify/api";

const client = generateClient();

export interface CreateBookingInput {
  firstName: string;
  lastName: string;
  email: string;
  startDate: string;
  endDate: string;
  numberOfPeople: number;
}

export const BookingService = {
  fetchBookings: async () => {
    const query = `
      query ListBookings {
        listBookings {
          items {
            startDate
            endDate
          }
        }
      }
    `;
    const res = (await client.graphql({ query })) as any;
    return res.data.listBookings.items;
  },

  createBooking: async (input: CreateBookingInput) => {
    const mutation = `
      mutation CreateBooking($input: CreateBookingInput!) {
        createBooking(input: $input) {
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

    return res.data.createBooking;
  },
};
