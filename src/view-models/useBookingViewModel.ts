import { useState } from "react";

export interface BookingFormState {
  startDate: Date;
  endDate: Date;
  numberOfPeople: number;
}

export const useBookingViewModel = (price: number) => {
  const [bookingForm, setBookingForm] = useState<BookingFormState>({
    startDate: new Date(),
    endDate: (() => {
      const date = new Date();
      date.setDate(date.getDate() + 1);
      return date;
    })(),
    numberOfPeople: 1,
  });

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
    maxCheckoutDate.setDate(maxCheckoutDate.getDate() + 14);
  }

  return {
    bookingForm,
    setBookingForm,
    calculateNights,
    calculateTotal,
    handleStartDateChange,
    minCheckoutDate,
    maxCheckoutDate,
  };
};
