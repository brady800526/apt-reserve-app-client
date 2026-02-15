import { generateClient } from "aws-amplify/api";

const client = generateClient();

export interface CreateReservationInput {
  firstName: string;
  lastName: string;
  email: string;
  startDate: string;
  endDate: string;
  numberOfPeople: number;
  status?: "CREATED" | "CANCELLED" | "REJECTED" | "CONFIRMED";
}

export interface Reservation {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  startDate: string;
  endDate: string;
  numberOfPeople: number;
  status: "CREATED" | "CANCELLED" | "REJECTED" | "CONFIRMED";
  totalPrice?: number;
}

export const ReservationService = {
  fetchReservations: async () => {
    const query = `
      query ListReservations {
        listReservations {
          items {
            id
            firstName
            lastName
            email
            startDate
            endDate
            numberOfPeople
            status
          }
        }
      }
    `;
    const res = (await client.graphql({ query })) as any;
    return res.data.listReservations.items;
  },

  createReservation: async (input: CreateReservationInput) => {
    const mutation = `
      mutation CreateReservation($input: CreateReservationInput!) {
        createReservation(input: $input) {
          id
          status
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

  updateReservation: async (id: string, status: string) => {
    const mutation = `
      mutation UpdateReservation($input: UpdateReservationInput!) {
        updateReservation(input: $input) {
          id
          status
        }
      }
    `;
    const res = (await client.graphql({
      query: mutation,
      variables: { input: { id, status } },
    })) as any;

    if (res.errors && Array.isArray(res.errors) && res.errors.length > 0) {
      throw new Error(res.errors[0].message);
    }

    return res.data.updateReservation;
  },
};
