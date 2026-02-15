import { Amplify } from "aws-amplify";
import { FormEvent, useEffect, useState } from "react";
import outputs from "../../amplify_outputs.json";
import { ReservationService } from "../services/ReservationService";
import { useEmailViewModel } from "./useEmailViewModel";

Amplify.configure(outputs);

export interface ReservationFormState {
  startDate: Date;
  endDate: Date;
  numberOfPeople: number;
}

interface ReservationSubmitParams {
  firstName: string;
  lastName: string;
  email: string;
  startDate: Date;
  endDate: Date;
  numberOfPeople: number;
  validateUser: () => string | null;
  clearUser: () => void;
}

export const useReservationViewModel = (price: number, reservation: any) => {
  const [reservationForm, setReservationForm] = useState<ReservationFormState>({
    startDate: new Date(),
    endDate: (() => {
      const date = new Date();
      date.setDate(date.getDate() + 1);
      return date;
    })(),
    numberOfPeople: 1,
  });

  const [reservations, setReservations] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const { sendConfirmationEmail } = useEmailViewModel();

  const fetchReservations = async () => {
    try {
      const items = await ReservationService.fetchReservations();
      setReservations(items);
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
      // Only block dates for CONFIRMED reservations
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
    }: ReservationSubmitParams,
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
      await ReservationService.createReservation({
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
        listingTitle: reservation.title,
        listingDescription: reservation.description,
        listingPrice: reservation.price,
        startDate,
        endDate,
        numberOfPeople,
        hostName: reservation.host,
        listingUrl: window.location.origin,
      });

      if (emailError) {
        console.error("Email sending failed:", emailError);
      }

      setSuccessMsg("Reserved successfully! Confirmation email sent.");
      fetchReservations();
      clearUser();
    } catch (err: any) {
      console.error(err);
      let errorMessage = "Reservation failed";
      if (err?.errors && Array.isArray(err.errors) && err.errors.length > 0) {
        errorMessage = err.errors[0].message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    }
  };

  const calculateNights = () => {
    if (!reservationForm.startDate || !reservationForm.endDate) return 0;
    const diffTime = Math.abs(
      reservationForm.endDate.getTime() - reservationForm.startDate.getTime(),
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

    let newEndDate = reservationForm.endDate;

    if (date >= reservationForm.endDate) {
      newEndDate = new Date(date);
      newEndDate.setDate(newEndDate.getDate() + 1);
    } else if (reservationForm.endDate > newMaxDate) {
      newEndDate = newMaxDate;
    }

    setReservationForm((prev) => ({
      ...prev,
      startDate: newStartDate,
      endDate: newEndDate,
    }));
  };

  const minCheckoutDate = reservationForm.startDate
    ? new Date(reservationForm.startDate)
    : null;
  if (minCheckoutDate) {
    minCheckoutDate.setDate(minCheckoutDate.getDate() + 1);
  }

  const maxCheckoutDate = reservationForm.startDate
    ? new Date(reservationForm.startDate)
    : null;
  if (maxCheckoutDate) {
    maxCheckoutDate.setDate(maxCheckoutDate.getDate() + 60);
  }

  return {
    reservationForm,
    setReservationForm,
    calculateNights,
    calculateTotal,
    handleStartDateChange,
    minCheckoutDate,
    maxCheckoutDate,
    reservations,
    error,
    successMsg,
    handleSubmit,
    getBookedDates,
  };
};
