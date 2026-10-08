"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function MyBookingPage() {
  const [booking, setBooking] = useState<any>(null);
  const [bookingId, setBookingId] = useState("");
  const [searched, setSearched] = useState(false);

  /*
   * Search booking by Booking ID
   */
  function searchBooking() {
    const id = bookingId.trim();

    if (!id) {
      setBooking(null);
      setSearched(true);
      return;
    }

    const data = localStorage.getItem("bookings");

    if (!data) {
      setBooking(null);
      setSearched(true);
      return;
    }

    try {
      const bookings = JSON.parse(data);

      if (!Array.isArray(bookings)) {
        setBooking(null);
        setSearched(true);
        return;
      }

      /*
       * IMPORTANT:
       * Search by the exact orderId.
       *
       * This guarantees that the customer sees
       * the exact same booking as Admin.
       */
      const found = bookings.find(
        (item: any) =>
          item.orderId === id
      );

      setBooking(found || null);
      setSearched(true);

    } catch (error) {
      console.error(
        "Failed to load booking:",
        error
      );

      setBooking(null);
      setSearched(true);
    }
  }


  /*
   * Load Booking ID from URL if available.
   *
   * Example:
   * /booking/my?bookingId=BG-12345678
   */
  useEffect(() => {
    const params = new URLSearchParams(
      window.location.search
    );

    const id = params.get("bookingId");

    if (id) {
      setBookingId(id);

      /*
       * Search automatically when Booking ID
       * exists in the URL.
       */
      const data =
        localStorage.getItem("bookings");

      if (data) {
        try {
          const bookings = JSON.parse(data);

          if (Array.isArray(bookings)) {
            const found = bookings.find(
              (item: any) =>
                item.orderId === id
            );

            setBooking(found || null);
            setSearched(true);
          }
        } catch (error) {
          console.error(
            "Failed to load booking:",
            error
          );
        }
      }
    }
  }, []);


  /*
   * Get status text
   */
  function getStatusText(
    status: string
  ) {
    if (status === "Approved") {
      return "🟢 Approved";
    }

    if (status === "Returned") {
      return "🔵 Returned";
    }

    if (status === "Rejected") {
      return "🔴 Rejected";
    }

    return "🟡 Pending Verification";
  }


  /*
   * Get status color
   */
  function getStatusClass(
    status: string
  ) {
    if (status === "Approved") {
      return "text-green-600";
    }

    if (status === "Returned") {
      return "text-blue-600";
    }

    if (status === "Rejected") {
      return "text-red-600";
    }

    return "text-yellow-600";
  }


  /*
   * Rental period
   */
  function getPeriodText(
    period: string
  ) {
    if (period === "daily") {
      return "Daily";
    }

    if (period === "threeDay") {
      return "3 Days";
    }

    if (period === "weekly") {
      return "Weekly";
    }

    if (period === "monthly") {
      return "Monthly";
    }

    return period || "-";
  }


  /*
   * =========================
   * PAGE
   * =========================
   */

  return (
    <main
      className="
        min-h-screen
        bg-green-50
        p-8
      "
    >

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

        <h1
          className="
            text-3xl
            font-bold
            text-green-700
          "
        >
          My Booking
        </h1>


        <p className="mt-2 text-gray-600">
          Enter your Booking ID to check your booking status
        </p>


        {/* =========================
            SEARCH
        ========================= */}

        <div className="mt-6">

          <label
            className="
              block
              text-gray-700
              mb-2
            "
          >
            Booking ID
          </label>


          <input
            type="text"
            value={bookingId}
            onChange={(e) =>
              setBookingId(e.target.value)
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                searchBooking();
              }
            }}
            placeholder="e.g. BG-12345678"
            className="
              w-full
              border
              border-gray-300
              rounded-full
              px-5
              py-4
              outline-none
              focus:border-green-600
            "
          />


          <button
            type="button"
            onClick={searchBooking}
            className="
              mt-4
              w-full
              bg-green-600
              text-white
              py-4
              rounded-full
              hover:bg-green-700
            "
          >
            Search Booking
          </button>

        </div>


        {/* =========================
            NOT FOUND
        ========================= */}

        {searched && !booking && (
          <div
            className="
              mt-4
              bg-red-50
              text-red-600
              rounded-xl
              p-5
              text-center
            "
          >
            Booking not found.
            Please check your Booking ID.
          </div>
        )}


        {/* =========================
            BOOKING RESULT
        ========================= */}

        {booking && (
          <>

            {/* Booking Status */}

            <div
              className="
                mt-6
                bg-green-50
                rounded-xl
                p-5
              "
            >

              <p>
                Booking ID:

                <b>
                  {" "}
                  {booking.orderId}
                </b>
              </p>


              <p className="mt-3">

                Status:

                <span
                  className={`
                    ml-2
                    font-bold
                    ${getStatusClass(
                      booking.status
                    )}
                  `}
                >
                  {getStatusText(
                    booking.status
                  )}
                </span>

              </p>

            </div>


            {/* Booking Detail */}

            <div
              className="
                mt-6
                border
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
                Booking Detail
              </h2>


              <div
                className="
                  mt-4
                  space-y-2
                "
              >

                <p>
                  Vehicle:
                </p>


                {booking.cart?.map(
                  (item: any) => (

                    <p
                      key={item.id}
                      className="
                        font-bold
                        text-green-700
                      "
                    >
                      🏍️ {item.name} x
                      {item.quantity}
                    </p>

                  )
                )}


                <p>
                  Rental Period:

                  <b>
                    {" "}
                    {getPeriodText(
                      booking.period
                    )}
                  </b>
                </p>


                <p>
                  Start Date:

                  <b>
                    {" "}
                    {booking.startDate || "-"}
                  </b>
                </p>

              </div>

            </div>


            {/* =========================
                APPROVED
            ========================= */}

            {booking.status ===
              "Approved" && (

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
                  Vehicle Unlock Code
                </h2>


                {booking.assignedUnits?.map(
                  (unit: any) => (

                    <div
                      key={unit.unitId}
                      className="
                        mt-4
                        bg-white
                        rounded-xl
                        p-4
                      "
                    >

                      <p
                        className="
                          font-bold
                          text-green-700
                        "
                      >
                        🏍️ {unit.vehicleName}
                      </p>


                      <p className="mt-1">
                        Vehicle:

                        <b>
                          {" "}
                          {unit.unitId}
                        </b>
                      </p>


                      <p
                        className="
                          mt-2
                          text-2xl
                          font-bold
                          text-green-700
                        "
                      >
                        🔑 Code: {unit.code}
                      </p>

                    </div>

                  )
                )}

              </div>

            )}


            {/* =========================
                PENDING
            ========================= */}

            {booking.status ===
              "Pending Verification" && (

              <div
                className="
                  mt-6
                  bg-gray-50
                  rounded-xl
                  p-5
                "
              >

                <p className="font-bold">
                  Verification Process
                </p>


                <p className="mt-2">
                  Your payment and documents
                  are being reviewed.
                </p>


                <p
                  className="
                    mt-2
                    text-green-700
                    font-bold
                  "
                >
                  Estimated time: 5–10 minutes
                </p>

              </div>

            )}


            {/* =========================
                REJECTED
            ========================= */}

            {booking.status ===
              "Rejected" && (

              <div
                className="
                  mt-6
                  bg-red-50
                  rounded-xl
                  p-5
                "
              >

                <h2
                  className="
                    font-bold
                    text-red-600
                  "
                >
                  Booking Rejected
                </h2>


                <p className="mt-2">
                  {booking.rejectReason ||
                    "Please contact staff."}
                </p>

              </div>

            )}


            {/* =========================
                RETURNED
            ========================= */}

            {booking.status ===
              "Returned" && (

              <div
                className="
                  mt-6
                  bg-blue-50
                  rounded-xl
                  p-5
                "
              >

                <h2
                  className="
                    font-bold
                    text-blue-600
                  "
                >
                  Vehicle Return Completed
                </h2>


                <p className="mt-2">
                  All vehicles have been
                  returned successfully.
                </p>


                {Array.isArray(
                  booking.returnedUnits
                ) &&
                  booking.returnedUnits.map(
                    (unitId: string) => (

                      <p
                        key={unitId}
                        className="mt-2"
                      >
                        ✓ {unitId} — Returned
                      </p>

                    )
                  )}

              </div>

            )}

          </>
        )}


        {/* =========================
            BUTTONS
        ========================= */}

        <Link
          href="/booking/history"
          className="
            mt-8
            block
            w-full
            border
            border-green-600
            text-green-700
            py-4
            rounded-full
            text-center
          "
        >
          Booking History
        </Link>


        <Link
          href="/bikes"
          className="
            mt-3
            block
            w-full
            bg-green-600
            text-white
            py-4
            rounded-full
            text-center
          "
        >
          New Booking
        </Link>


        <Link
          href="/"
          className="
            mt-3
            block
            w-full
            border
            border-green-600
            text-green-700
            py-4
            rounded-full
            text-center
          "
        >
          Back to Home
        </Link>

      </div>

    </main>
  );
}