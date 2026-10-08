"use client";

import { useEffect, useState } from "react";

export default function AdminPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [filter, setFilter] = useState("All");

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

      setBookings(parsed);
    } catch (error) {
      console.error(
        "Failed to load bookings:",
        error
      );

      setBookings([]);
    }
  }

  useEffect(() => {
    loadBookings();
  }, []);

  /* =========================
     Status Count
  ========================= */

  const pendingCount = bookings.filter(
    (booking) =>
      booking.status === "Pending Verification"
  ).length;

  const approvedCount = bookings.filter(
    (booking) =>
      booking.status === "Approved"
  ).length;

  const returnedCount = bookings.filter(
    (booking) =>
      booking.status === "Returned"
  ).length;

  const rejectedCount = bookings.filter(
    (booking) =>
      booking.status === "Rejected"
  ).length;

  /* =========================
     Sort Booking
     Pending first
  ========================= */

  const statusPriority: Record<
    string,
    number
  > = {
    "Pending Verification": 1,
    Approved: 2,
    Returned: 3,
    Rejected: 4,
  };

  const sortedBookings = [...bookings].sort(
    (a, b) => {
      const priorityA =
        statusPriority[a.status] || 99;

      const priorityB =
        statusPriority[b.status] || 99;

      return priorityA - priorityB;
    }
  );

  /* =========================
     Filter
  ========================= */

  const filteredBookings =
    filter === "All"
      ? sortedBookings
      : sortedBookings.filter(
          (booking) =>
            booking.status === filter
        );

  /* =========================
     Status Color
  ========================= */

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

  /* =========================
     Action Message
  ========================= */

  function getActionText(
    booking: any
  ) {
    if (
      booking.status ===
      "Pending Verification"
    ) {
      return "Action Required: Verify booking and assign vehicle";
    }

    if (
      booking.status === "Approved"
    ) {
      const assigned =
        Array.isArray(
          booking.assignedUnits
        )
          ? booking.assignedUnits.length
          : 0;

      const returned =
        Array.isArray(
          booking.returnedUnits
        )
          ? booking.returnedUnits.length
          : 0;

      if (
        assigned > 0 &&
        returned < assigned
      ) {
        return "Active Rental: Vehicle is currently rented";
      }

      return "Approved booking";
    }

    if (
      booking.status === "Returned"
    ) {
      return "Completed: Vehicle returned";
    }

    if (
      booking.status === "Rejected"
    ) {
      return "Completed: Booking rejected";
    }

    return "";
  }

  function getActionClass(
    booking: any
  ) {
    if (
      booking.status ===
      "Pending Verification"
    ) {
      return "bg-yellow-50 text-yellow-700";
    }

    if (
      booking.status === "Approved"
    ) {
      return "bg-green-50 text-green-700";
    }

    if (
      booking.status === "Returned"
    ) {
      return "bg-blue-50 text-blue-700";
    }

    if (
      booking.status === "Rejected"
    ) {
      return "bg-red-50 text-red-700";
    }

    return "bg-gray-50 text-gray-700";
  }

  return (
    <main
      className="
        min-h-screen
        bg-gray-100
        p-8
      "
    >
      <div
        className="
          max-w-5xl
          mx-auto
          bg-white
          rounded-2xl
          shadow-lg
          p-8
        "
      >

        {/* =========================
            Header
        ========================= */}

        <div
          className="
            flex
            flex-col
            md:flex-row
            md:items-center
            md:justify-between
            gap-4
          "
        >

          <div>

            <h1
              className="
                text-3xl
                font-bold
                text-green-700
              "
            >
              Admin Dashboard
            </h1>

            <p
              className="
                mt-2
                text-gray-600
              "
            >
              Booking Management
            </p>

          </div>


          <div
            className="
              flex
              flex-wrap
              gap-3
            "
          >

            <button
              type="button"
              onClick={() => {
                window.location.href =
                  "/admin/vehicles";
              }}
              className="
                bg-green-600
                text-white
                px-5
                py-2
                rounded-full
                hover:bg-green-700
              "
            >
              Vehicle Management
            </button>


            <button
              type="button"
              onClick={() => {
                sessionStorage.removeItem(
                  "bikego_admin"
                );

                window.location.href =
                  "/admin/login";
              }}
              className="
                bg-red-600
                text-white
                px-5
                py-2
                rounded-full
                hover:bg-red-700
              "
            >
              Logout
            </button>

          </div>

        </div>


        {/* =========================
            Action Alert
        ========================= */}

        {pendingCount > 0 && (
          <div
            className="
              mt-6
              bg-yellow-50
              border
              border-yellow-200
              rounded-xl
              p-5
            "
          >

            <p
              className="
                font-bold
                text-yellow-700
              "
            >
              Action Required
            </p>

            <p
              className="
                mt-1
                text-yellow-800
              "
            >
              There are{" "}
              <b>
                {pendingCount}
              </b>{" "}
              booking(s) waiting
              for verification.
            </p>

            <button
              type="button"
              onClick={() =>
                setFilter(
                  "Pending Verification"
                )
              }
              className="
                mt-3
                border
                border-yellow-500
                text-yellow-700
                px-5
                py-2
                rounded-full
                hover:bg-yellow-100
              "
            >
              View Pending Bookings
            </button>

          </div>
        )}


        {/* =========================
            Summary
        ========================= */}

        <div
          className="
            mt-8
            grid
            grid-cols-2
            md:grid-cols-4
            gap-4
          "
        >

          {/* Pending */}

          <button
            type="button"
            onClick={() =>
              setFilter(
                "Pending Verification"
              )
            }
            className="
              text-left
              bg-yellow-50
              border
              border-yellow-200
              rounded-xl
              p-4
            "
          >

            <p
              className="
                text-sm
                text-yellow-700
              "
            >
              Pending
            </p>

            <p
              className="
                mt-1
                text-3xl
                font-bold
                text-yellow-600
              "
            >
              {pendingCount}
            </p>

          </button>


          {/* Approved */}

          <button
            type="button"
            onClick={() =>
              setFilter("Approved")
            }
            className="
              text-left
              bg-green-50
              border
              border-green-200
              rounded-xl
              p-4
            "
          >

            <p
              className="
                text-sm
                text-green-700
              "
            >
              Approved
            </p>

            <p
              className="
                mt-1
                text-3xl
                font-bold
                text-green-600
              "
            >
              {approvedCount}
            </p>

          </button>


          {/* Returned */}

          <button
            type="button"
            onClick={() =>
              setFilter("Returned")
            }
            className="
              text-left
              bg-blue-50
              border
              border-blue-200
              rounded-xl
              p-4
            "
          >

            <p
              className="
                text-sm
                text-blue-700
              "
            >
              Returned
            </p>

            <p
              className="
                mt-1
                text-3xl
                font-bold
                text-blue-600
              "
            >
              {returnedCount}
            </p>

          </button>


          {/* Rejected */}

          <button
            type="button"
            onClick={() =>
              setFilter("Rejected")
            }
            className="
              text-left
              bg-red-50
              border
              border-red-200
              rounded-xl
              p-4
            "
          >

            <p
              className="
                text-sm
                text-red-700
              "
            >
              Rejected
            </p>

            <p
              className="
                mt-1
                text-3xl
                font-bold
                text-red-600
              "
            >
              {rejectedCount}
            </p>

          </button>

        </div>


        {/* =========================
            Filter
        ========================= */}

        <div
          className="
            mt-8
            flex
            flex-wrap
            gap-3
          "
        >

          <button
            type="button"
            onClick={() =>
              setFilter("All")
            }
            className={`
              px-5
              py-2
              rounded-full
              border
              ${
                filter === "All"
                  ? "bg-green-600 text-white border-green-600"
                  : "text-green-700 border-green-600"
              }
            `}
          >
            All
          </button>


          <button
            type="button"
            onClick={() =>
              setFilter(
                "Pending Verification"
              )
            }
            className={`
              px-5
              py-2
              rounded-full
              border
              ${
                filter ===
                "Pending Verification"
                  ? "bg-yellow-500 text-white border-yellow-500"
                  : "text-yellow-700 border-yellow-500"
              }
            `}
          >
            Pending
          </button>


          <button
            type="button"
            onClick={() =>
              setFilter("Approved")
            }
            className={`
              px-5
              py-2
              rounded-full
              border
              ${
                filter === "Approved"
                  ? "bg-green-600 text-white border-green-600"
                  : "text-green-700 border-green-600"
              }
            `}
          >
            Approved
          </button>


          <button
            type="button"
            onClick={() =>
              setFilter("Returned")
            }
            className={`
              px-5
              py-2
              rounded-full
              border
              ${
                filter === "Returned"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "text-blue-700 border-blue-600"
              }
            `}
          >
            Returned
          </button>


          <button
            type="button"
            onClick={() =>
              setFilter("Rejected")
            }
            className={`
              px-5
              py-2
              rounded-full
              border
              ${
                filter === "Rejected"
                  ? "bg-red-600 text-white border-red-600"
                  : "text-red-700 border-red-600"
              }
            `}
          >
            Rejected
          </button>

        </div>


        {/* =========================
            Refresh
        ========================= */}

        <button
          type="button"
          onClick={loadBookings}
          className="
            mt-5
            w-full
            border
            border-gray-400
            text-gray-700
            py-3
            rounded-full
            hover:bg-gray-50
          "
        >
          🔄 Refresh Bookings
        </button>


        {/* =========================
            Booking List
        ========================= */}

        <div
          className="
            mt-8
            space-y-5
          "
        >

          {filteredBookings.length === 0 && (
            <div
              className="
                bg-gray-50
                rounded-xl
                p-8
                text-center
              "
            >

              <p
                className="
                  text-gray-500
                "
              >
                No booking found
              </p>

            </div>
          )}


          {filteredBookings.map(
            (booking, index) => (

              <div
                key={
                  booking.orderId ||
                  `booking-${index}`
                }
                className="
                  border
                  rounded-xl
                  p-5
                "
              >

                {/* =========================
                    Booking Header
                ========================= */}

                <div
                  className="
                    flex
                    flex-col
                    md:flex-row
                    md:justify-between
                    md:items-start
                    gap-4
                  "
                >

                  <div>

                    <h2
                      className="
                        font-bold
                        text-xl
                      "
                    >
                      {booking.orderId ||
                        "Pending"}
                    </h2>

                    <p
                      className={`
                        mt-1
                        font-bold
                        ${getStatusClass(
                          booking.status
                        )}
                      `}
                    >
                      Status:{" "}
                      {booking.status}
                    </p>

                  </div>


                  <button
                    type="button"
                    onClick={() =>
                      (window.location.href =
                        `/admin/booking/${booking.orderId}`)
                    }
                    className="
                      bg-green-600
                      text-white
                      px-5
                      py-2
                      rounded-full
                      hover:bg-green-700
                    "
                  >
                    View Booking
                  </button>

                </div>


                {/* =========================
                    Action
                ========================= */}

                <div
                  className={`
                    mt-4
                    rounded-xl
                    p-4
                    font-bold
                    ${getActionClass(
                      booking
                    )}
                  `}
                >
                  {getActionText(
                    booking
                  )}
                </div>


                {/* =========================
                    Booking Information
                ========================= */}

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
                      {booking.period}
                    </b>
                  </p>


                  <p>
                    Start Date:

                    <b>
                      {" "}
                      {booking.startDate}
                    </b>
                  </p>


                  <p>
                    Customer:

                    <b>
                      {" "}
                      {booking.customerType}
                    </b>
                  </p>

                </div>


                {/* =========================
                    Assigned Vehicle
                ========================= */}

                {Array.isArray(
                  booking.assignedUnits
                ) &&
                  booking.assignedUnits
                    .length > 0 && (

                    <div
                      className="
                        mt-4
                        bg-gray-50
                        rounded-xl
                        p-4
                      "
                    >

                      <p
                        className="
                          font-bold
                        "
                      >
                        Assigned Vehicle
                      </p>

                      {booking.assignedUnits.map(
                        (unit: any) => (
                          <p
                            key={unit.unitId}
                            className="
                              mt-1
                              text-green-700
                              font-bold
                            "
                          >
                            ✓{" "}
                            {unit.unitId}
                          </p>
                        )
                      )}

                    </div>

                  )}


                {/* =========================
                    Returned Vehicle
                ========================= */}

                {Array.isArray(
                  booking.returnedUnits
                ) &&
                  booking.returnedUnits
                    .length > 0 && (

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
                        Returned Vehicle
                      </p>

                      {booking.returnedUnits.map(
                        (
                          unitId: string
                        ) => (
                          <p
                            key={unitId}
                            className="
                              mt-1
                              text-blue-700
                            "
                          >
                            ✓{" "}
                            {unitId}
                          </p>
                        )
                      )}

                    </div>

                  )}


                {/* =========================
                    Reject Reason
                ========================= */}

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
                        {
                          booking.rejectReason
                        }
                      </p>

                    </div>

                  )}

              </div>

            )
          )}

        </div>

      </div>
    </main>
  );
}