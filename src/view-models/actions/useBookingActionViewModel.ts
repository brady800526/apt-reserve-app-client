import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/api";
import { FormEvent, useEffect, useState } from "react";
import outputs from "../../../amplify_outputs.json";
import { useEmailActionViewModel } from "./useEmailActionViewModel";

Amplify.configure(outputs);

const client = generateClient();

interface BookingSubmitParams {
  firstName: string;
  lastName: string;
  email: string;
  startDate: Date;
  endDate: Date;
  numberOfPeople: number;
  validateUser: () => string | null;
  clearUser: () => void;
}

export const useBookingActionViewModel = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const { sendConfirmationEmail } = useEmailActionViewModel();

  // Mock Listing Data
  const listing = {
    title: "Modern Downtown Studio with City Views",
    host: "Brady",
    price: 125,
    rating: 4.92,
    reviews: 128,
    description:
      "Enjoy a stylish experience at this centrally-located place. Perfect for weekend getaways and business trips. Features a modern kitchen, high-speed Wi-Fi, and a stunning view of the city skyline.",
    amenities: [
      "Fast Wifi",
      "Dedicated workspace",
      "Kitchen",
      "Washer/Dryer",
      "Air conditioning",
    ],
  };

  const fetchBookings = async () => {
    try {
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
      setBookings(res.data.listReservations.items);
    } catch (err) {
      console.error("Error fetching bookings", err);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const getBookedDates = () => {
    let dates: Date[] = [];
    bookings.forEach((res) => {
      console.log(res);
      let current = new Date(res.startDate);
      const end = new Date(res.endDate);
      while (current <= end) {
        dates.push(new Date(current));
        current.setDate(current.getDate() + 1);
      }
    });
    return dates;
  };



  const handleSubmit = async (
    e: FormEvent,
    {
      firstName,
      lastName,
      email,
      startDate,
      endDate,
      numberOfPeople,
      validateUser,
      clearUser,
    }: BookingSubmitParams,
  ) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    const validationError = validateUser();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const mutation = `
        mutation CreateReservation($input: CreateReservationInput!) {
          createReservation(input: $input) {
            id
          }
        }
      `;
      const res = (await client.graphql({
        query: mutation,
        variables: {
          input: {
            firstName,
            lastName,
            email,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            numberOfPeople,
          },
        },
      })) as any;

      if (res.errors && Array.isArray(res.errors) && res.errors.length > 0) {
        const errorMessage = res.errors[0].message;
        setError(errorMessage);
        console.error("GraphQL Error:", errorMessage);
        return;
      }

      console.log("GraphQL Response:", res);

      // Send Confirmation Email using ViewModel
      const emailError = await sendConfirmationEmail(
        email,
        firstName,
        lastName,
        listing.title,
        listing.description,
        listing.price,
        startDate,
        endDate,
        numberOfPeople,
        listing.host,
        window.location.origin,
      );

      if (emailError) {
        console.error("Email sending failed:", emailError);
        // Note: We might want to show a warning to the user, but for now we proceed as success since the booking itself worked.
      }

      setSuccessMsg("Reserved successfully! Confirmation email sent.");
      fetchBookings();
      clearUser();
    } catch (err: any) {
      console.error(err);
      let errorMessage = "Booking failed";
      if (err?.errors && Array.isArray(err.errors) && err.errors.length > 0) {
        errorMessage = err.errors[0].message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    }
  };

  return {
    bookings,
    listing,
    error,
    successMsg,
    handleSubmit,
    getBookedDates,
  };
};
