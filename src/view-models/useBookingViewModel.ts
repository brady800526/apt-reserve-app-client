import { Amplify } from "aws-amplify";
import { FormEvent, useEffect, useState } from "react";
import outputs from "../../amplify_outputs.json";
import { BookingService } from "../services/BookingService";
import { useEmailViewModel } from "./useEmailViewModel";

Amplify.configure(outputs);

export interface BookingFormState {
  startDate: Date;
  endDate: Date;
  numberOfPeople: number;
}

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

export const useBookingViewModel = (price: number, booking: any) => {
  const [bookingForm, setBookingForm] = useState<BookingFormState>({
    startDate: new Date(),
    endDate: (() => {
      const date = new Date();
      date.setDate(date.getDate() + 1);
      return date;
    })(),
    numberOfPeople: 1,
  });

  const [bookings, setBookings] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const { sendConfirmationEmail } = useEmailViewModel();

  const fetchBookings = async () => {
    try {
      const items = await BookingService.fetchBookings();
      setBookings(items);
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
      // Only block dates for CONFIRMED bookings
      if (res.status !== "CONFIRMED") {
        return;
      }

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
      await BookingService.createBooking({
        firstName,
        lastName,
        email,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        numberOfPeople,
        status: "CREATED",
      });

      console.log("Reservation created successfully");

      // Send Confirmation Email using ViewModel
      const emailError = await sendConfirmationEmail({
        to: email,
        firstName,
        lastName,
        listingTitle: booking.title,
        listingDescription: booking.description,
        listingPrice: booking.price,
        startDate,
        endDate,
        numberOfPeople,
        hostName: booking.host,
        listingUrl: window.location.origin,
      });

      if (emailError) {
        console.error("Email sending failed:", emailError);
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

  const calculateNights = () => {
    if (!bookingForm.startDate || !bookingForm.endDate) return 0;
    const diffTime = Math.abs(
      bookingForm.endDate.getTime() - bookingForm.startDate.getTime(),
    );
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const calculateTotal = () => {
    return calculateNights() * price;
  };

  const handleStartDateChange = (date: Date | null) => {
    if (!date) return;
    const newStartDate = date;
    const newMaxDate = new Date(date);
    newMaxDate.setDate(newMaxDate.getDate() + 60);

    let newEndDate = bookingForm.endDate;

    if (date >= bookingForm.endDate) {
      newEndDate = new Date(date);
      newEndDate.setDate(newEndDate.getDate() + 1);
    } else if (bookingForm.endDate > newMaxDate) {
      newEndDate = newMaxDate;
    }

    setBookingForm((prev) => ({
      ...prev,
      startDate: newStartDate,
      endDate: newEndDate,
    }));
  };

  const minCheckoutDate = bookingForm.startDate
    ? new Date(bookingForm.startDate)
    : null;
  if (minCheckoutDate) {
    minCheckoutDate.setDate(minCheckoutDate.getDate() + 1);
  }

  const maxCheckoutDate = bookingForm.startDate
    ? new Date(bookingForm.startDate)
    : null;
  if (maxCheckoutDate) {
    maxCheckoutDate.setDate(maxCheckoutDate.getDate() + 60);
  }

  return {
    bookingForm,
    setBookingForm,
    calculateNights,
    calculateTotal,
    handleStartDateChange,
    minCheckoutDate,
    maxCheckoutDate,
    bookings,
    error,
    successMsg,
    handleSubmit,
    getBookedDates,
  };
};
