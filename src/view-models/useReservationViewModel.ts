import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/api";
import { FormEvent, useEffect, useState } from "react";
import outputs from "../../amplify_outputs.json";
import { useEmailViewModel } from "./useEmailViewModel";

Amplify.configure(outputs);

const client = generateClient();

export const useReserveViewModel = () => {
  const [reservations, setReservations] = useState<any[]>([]);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(() => {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    return date;
  });
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const { sendConfirmationEmail } = useEmailViewModel();

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

  const fetchReservations = async () => {
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
      setReservations(res.data.listReservations.items);
    } catch (err) {
      console.error("Error fetching reservations", err);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const getBookedDates = () => {
    let dates: Date[] = [];
    reservations.forEach((res) => {
      let current = new Date(res.startDate);
      const end = new Date(res.endDate);
      while (current <= end) {
        dates.push(new Date(current));
        current.setDate(current.getDate() + 1);
      }
    });
    return dates;
  };

  const calculateNights = () => {
    if (!startDate || !endDate) return 0;
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const calculateTotal = () => {
    return calculateNights() * listing.price;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!firstName || !lastName) {
      setError("Please enter first and last name");
      return;
    }

    if (firstName.includes(" ") || lastName.includes(" ")) {
      setError("First and last name cannot contain spaces");
      return;
    }

    if (!email) {
      setError("Please enter email address");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
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
      const emailSent = await sendConfirmationEmail(
        email,
        firstName,
        listing.title,
        startDate,
        endDate,
      );
      if (emailSent) {
        setSuccessMsg("Reserved successfully! Confirmation email sent.");
      } else {
        setSuccessMsg(
          "Reserved successfully! (Email failed to send - check SES verification)",
        );
      }
      setSuccessMsg("Reserved successfully!");
      fetchReservations();
      setFirstName("");
      setLastName("");
      setEmail("");
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

  const handleStartDateChange = (date: Date | null) => {
    if (!date) return;
    setStartDate(date);
    const newMaxDate = new Date(date);
    newMaxDate.setDate(newMaxDate.getDate() + 14);

    if (date >= endDate) {
      const newEndDate = new Date(date);
      newEndDate.setDate(newEndDate.getDate() + 1);
      setEndDate(newEndDate);
    } else if (endDate > newMaxDate) {
      setEndDate(newMaxDate);
    }
  };

  const minCheckoutDate = startDate ? new Date(startDate) : null;
  if (minCheckoutDate) {
    minCheckoutDate.setDate(minCheckoutDate.getDate() + 1);
  }

  const maxCheckoutDate = startDate ? new Date(startDate) : null;
  if (maxCheckoutDate) {
    maxCheckoutDate.setDate(maxCheckoutDate.getDate() + 14);
  }

  return {
    listing,
    startDate,
    endDate,
    setEndDate,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    email,
    setEmail,
    numberOfPeople,
    setNumberOfPeople,
    error,
    successMsg,
    handleSubmit,
    calculateNights,
    calculateTotal,
    getBookedDates,
    minCheckoutDate,
    maxCheckoutDate,
    handleStartDateChange,
  };
};
