 "use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function BookingHistoryPage() {
  const [bookings, setBookings] = useState<any[]>([]);

  function loadBookings() {
    const data = localStorage.getItem("bookings");

    if (!data) {
      setBookings([]);
      return;
    }

    try {
      const parsed = JSON.parse(data);

      if (!Array.isArray(parsed)) {
        setBookings([]);
        return;
      }

      // แสดงรายการล่าสุดก่อน
      setBookings([...parsed].reverse());
    } catch (error) {
      console.error("Failed to load booking history:", error);
      setBookings([]);
    }
  }

  useEffect(() => {
    loadBookings();
  }, []);

  function getStatusText(status: string) {
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

  function getStatusClass(status: string) {
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

  function getPeriodText(period: string) {
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
          max-w-3xl
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
          Booking History
        </h1>

        <p className="mt-2 text-gray-600">
          View your previous rental bookings
        </p>

        <button
          type="button"
          onClick={loadBookings}
          className="
            mt-5
            w-full
            border
            border-green-600
            text-green-700
            py-3
            rounded-full
            hover:bg-green-50
          "
        >
          🔄 Refresh History
        </button>

        {bookings.length === 0 ? (
          <div
            className="
              mt-6
              bg-gray-50
              rounded-xl
              p-8
              text-center
            "
          >
            <p className="text-gray-500">
              No booking history found.
            </p>

            <Link
              href="/bikes"
              className="
                mt-5
                block
                w-full
                bg-green-600
                text-white
                py-4
                rounded-full
                text-center
                hover:bg-green-700
              "
            >
              Make a New Booking
            </Link>
          </div>
        ) : (
          <div className="mt-6 space-y-5">
            {bookings.map((booking: any, index: number) => (
              <div
                key={
                  booking.orderId ||
                  `booking-${index}`
                }
                className="
                  border
                  rounded-2xl
                  p-5
                "
              >
                <div
                  className="
                    flex
                    justify-between
                    items-start
                    gap-4
                  "
                >
                  <div>
                    <p
                      className="
                        text-lg
                        font-bold
                      "
                    >
                      {booking.orderId || "Pending"}
                    </p>

                    <p
                      className={`
                        mt-1
                        font-bold
                        ${getStatusClass(
                          booking.status
                        )}
                      `}
                    >
                      {getStatusText(
                        booking.status
                      )}
                    </p>
                  </div>
                </div>

                <div
                  className="
                    mt-4
                    bg-green-50
                    rounded-xl
                    p-4
                    space-y-2
                  "
                >
                  <p>
                    <span className="text-gray-600">
                      Vehicle:
                    </span>
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
                    <span className="text-gray-600">
                      Rental Period:
                    </span>{" "}
                    <b>
                      {getPeriodText(
                        booking.period
                      )}
                    </b>
                  </p>

                  <p>
                    <span className="text-gray-600">
                      Start Date:
                    </span>{" "}
                    <b>
                      {booking.startDate || "-"}
                    </b>
                  </p>

                  {booking.customerType && (
                    <p>
                      <span className="text-gray-600">
                        Customer:
                      </span>{" "}
                      <b>
                        {booking.customerType}
                      </b>
                    </p>
                  )}
                </div>

                {booking.status ===
                  "Rejected" &&
                  booking.rejectReason && (
                    <div
                      className="
                        mt-4
                        bg-red-50
                        rounded-xl
                        p-4
                      "
                    >
                      <p
                        className="
                          font-bold
                          text-red-600
                        "
                      >
                        Reject Reason
                      </p>

                      <p className="mt-1">
                        {booking.rejectReason}
                      </p>
                    </div>
                  )}

                {booking.status ===
                  "Returned" && (
                    <div
                      className="
                        mt-4
                        bg-blue-50
                        rounded-xl
                        p-4
                      "
                    >
                      <p
                        className="
                          font-bold
                          text-blue-600
                        "
                      >
                        ✓ Rental Completed
                      </p>

                      {Array.isArray(
                        booking.returnedUnits
                      ) &&
                        booking.returnedUnits
                          .length > 0 && (
                          <p className="mt-1">
                            Returned Vehicles:{" "}
                            <b>
                              {booking.returnedUnits.join(
                                ", "
                              )}
                            </b>
                          </p>
                        )}
                    </div>
                  )}
              </div>
            ))}
          </div>
        )}

        <Link
          href="/"
          className="
            mt-6
            block
            w-full
            bg-green-600
            text-white
            py-4
            rounded-full
            text-center
            hover:bg-green-700
          "
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
}
