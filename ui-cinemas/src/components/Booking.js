import React, { useState } from "react";
import { useMutation } from "react-query";
import { bookMovie } from "../api";

export function Booking({ order, onComplete }) {
  const [result, setResult] = useState();

  const [mutateBooking] = useMutation(bookMovie, {
    onError: ({ message }) => setResult(message),
    onSuccess: () => {
      setResult("Booking completed");
      onComplete();
    },
  });

  return (
    <section id="booking">
      {order && (
        <div>
          <p>
            A movie has been selected. Please confirm the booking by clicking
            the button below
          </p>
          <button onClick={() => mutateBooking(order)}>Book movie</button>
        </div>
      )}

      {result && <p>{result}</p>}
    </section>
  );
}
