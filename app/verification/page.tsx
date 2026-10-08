"use client";

import Link from "next/link";
import { useBooking } from "../context/BookingContext";
import { useEffect, useState } from "react";

export default function VerificationPage() {
  const {
    startDate,
    period,
    paymentSlip,
  } = useBooking();

  const [bookingDate, setBookingDate] = useState(startDate || "");
  const [bookingPeriod, setBookingPeriod] = useState(period || "");

  /*
   * Get booking information from sessionStorage
   * as a fallback in case BookingContext does not contain
   * the information after navigating between pages.
   */
  useEffect(() => {
    const saved = sessionStorage.getItem("bookingSelection");

    if (saved) {
      try {
        const booking = JSON.parse(saved);

        if (!bookingDate && booking.startDate) {
          setBookingDate(booking.startDate);
        }

        if (!bookingPeriod && booking.period) {
          setBookingPeriod(booking.period);
        }
      } catch (error) {
        console.error(
          "Failed to read booking selection:",
          error
        );
      }
    }
  }, [bookingDate, bookingPeriod]);

  /*
   * Payment is considered uploaded only when
   * paymentSlip actually exists.
   */
  const isPaymentUploaded =
    !!paymentSlip && paymentSlip.length > 0;

  return (
    <main className="min-h-screen bg-green-50 p-8">

      <div
        className="
          max-w-xl
          mx-auto
          bg-white
          rounded-2xl
          shadow-lg
          p-8
        "
      >

        {/* Page Title */}

        <h1
          className="
            text-3xl
            font-bold
            text-green-700
          "
        >
          Identity Verification
        </h1>


        <p
          className="
            mt-3
            text-gray-600
          "
        >
          Please select your document type
        </p>


        {/* Booking Information */}

        <div
          className="
            mt-6
            bg-green-50
            rounded-xl
            p-5
          "
        >

          <h2
            className="
              text-xl
              font-bold
            "
          >
            Booking Information
          </h2>


          <p className="mt-3">

            Rental Period:

            <b>
              {" "}
              {bookingPeriod || "-"}
            </b>

          </p>


          <p>

            Start Date:

            <b>
              {" "}
              {bookingDate || "-"}
            </b>

          </p>


          {/* Payment Status */}

          <p>

            Payment Status:

            {isPaymentUploaded ? (

              <span
                className="
                  text-green-600
                  font-bold
                "
              >
                {" "}
                Payment Uploaded
              </span>

            ) : (

              <span
                className="
                  text-orange-500
                  font-bold
                "
              >
                {" "}
                Payment Not Uploaded
              </span>

            )}

          </p>

        </div>


        {/* Document Selection */}

        <div
          className="
            mt-6
            space-y-4
          "
        >

          {/* Thai Customer */}

          <Link
            href="/verification/thai"
            className="
              block
              w-full
              border
              rounded-xl
              p-5
              hover:bg-green-50
            "
          >

            <div
              className="
                flex
                items-center
                gap-3
              "
            >

              <img
                src="https://flagcdn.com/w40/th.png"
                className="w-8 h-5"
                alt="Thailand flag"
              />


              <span
                className="
                  text-lg
                  font-medium
                "
              >
                Thai Customer
              </span>

            </div>


            <p
              className="
                text-sm
                text-gray-500
                ml-11
                mt-1
              "
            >
              Use Thai National ID Card
            </p>

          </Link>


          {/* International Customer */}

          <Link
            href="/verification/passport"
            className="
              block
              w-full
              border
              rounded-xl
              p-5
              hover:bg-green-50
            "
          >

            <div
              className="
                flex
                items-center
                gap-3
              "
            >

              <div
                className="
                  w-8
                  text-center
                  text-2xl
                "
              >
                🌎
              </div>


              <span
                className="
                  text-lg
                  font-medium
                "
              >
                International Customer
              </span>

            </div>


            <p
              className="
                text-sm
                text-gray-500
                ml-11
                mt-1
              "
            >
              Use Passport
            </p>

          </Link>

        </div>

      </div>

    </main>
  );
}