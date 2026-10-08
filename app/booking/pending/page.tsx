"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";

export default function PendingPage() {
  const searchParams = useSearchParams();

  const [booking, setBooking] = useState<any>(null);
  const [bookingId, setBookingId] = useState("");
  const [searchError, setSearchError] = useState("");

  /*
   * Find booking by Booking ID
   */
  function findBookingById(searchId: string) {
    const data = localStorage.getItem("bookings");

    if (!data) return null;

    try {
      const bookings = JSON.parse(data);

      if (!Array.isArray(bookings)) {
        return null;
      }

      const normalizedId = searchId
        .trim()
        .toLowerCase();

      return (
        bookings.find(
          (item: any) =>
            String(item.orderId || "")
              .trim()
              .toLowerCase() === normalizedId
        ) || null
      );
    } catch (error) {
      console.error(
        "Failed to read bookings:",
        error
      );

      return null;
    }
  }

  /*
   * Load booking
   */
  function loadBooking(searchId?: string) {
    const idToLoad = (
      searchId ??
      bookingId
    ).trim();

    if (!idToLoad) {
      setBooking(null);
      setSearchError("");
      return;
    }

    const found =
      findBookingById(idToLoad);

    if (!found) {
      setBooking(null);

      setSearchError(
        "Booking not found. Please check your Booking ID."
      );

      return;
    }

    const foundId =
      String(
        found.orderId ||
        idToLoad
      );

    setBookingId(foundId);
    setBooking(found);
    setSearchError("");

    /*
     * Remember the currently viewed booking.
     */
    localStorage.setItem(
      "lastViewedBookingId",
      foundId
    );
  }

  /*
   * Search booking manually
   */
  function handleSearch(
    event: FormEvent
  ) {
    event.preventDefault();

    loadBooking();
  }

  /*
   * Initial load
   *
   * Priority:
   *
   * 1. Booking ID from URL
   * 2. lastViewedBookingId
   *
   * This prevents an old booking from
   * replacing a newly created booking.
   */
  useEffect(() => {
    const urlBookingId =
      searchParams.get("id") || "";

    if (urlBookingId) {
      setBookingId(urlBookingId);
      loadBooking(urlBookingId);
      return;
    }

    const lastViewedId =
      localStorage.getItem(
        "lastViewedBookingId"
      ) || "";

    if (lastViewedId) {
      setBookingId(lastViewedId);
      loadBooking(lastViewedId);
    }
  }, [searchParams]);

  /*
   * Return vehicle
   */
  function returnVehicle(
    unitId: string
  ) {
    if (!booking) return;

    const data =
      localStorage.getItem("bookings");

    if (!data) return;

    try {
      const bookings =
        JSON.parse(data);

      const currentBooking =
        bookings.find(
          (item: any) =>
            item.orderId ===
            booking.orderId
        );

      if (!currentBooking) return;

      const currentReturnedUnits =
        Array.isArray(
          currentBooking.returnedUnits
        )
          ? currentBooking.returnedUnits
          : [];

      if (
        currentReturnedUnits.includes(
          unitId
        )
      ) {
        return;
      }

      const confirmed =
        window.confirm(
          `Confirm return vehicle ${unitId}?`
        );

      if (!confirmed) return;

      const returnedUnits = [
        ...currentReturnedUnits,
        unitId,
      ];

      const assignedUnits =
        Array.isArray(
          currentBooking.assignedUnits
        )
          ? currentBooking.assignedUnits
          : Array.isArray(
              currentBooking.unlockCodes
            )
            ? currentBooking.unlockCodes
            : [];

      const allReturned =
        assignedUnits.length > 0 &&
        assignedUnits.every(
          (unit: any) =>
            returnedUnits.includes(
              unit.unitId ||
              unit.id
            )
        );

      const updatedBookings =
        bookings.map(
          (item: any) => {
            if (
              item.orderId !==
              booking.orderId
            ) {
              return item;
            }

            return {
              ...item,
              status:
                allReturned
                  ? "Returned"
                  : "Approved",
              returnedUnits,
            };
          }
        );

      localStorage.setItem(
        "bookings",
        JSON.stringify(
          updatedBookings
        )
      );

      const updatedBooking =
        updatedBookings.find(
          (item: any) =>
            item.orderId ===
            booking.orderId
        );

      setBooking(
        updatedBooking
      );

      alert(
        allReturned
          ? "All vehicles have been returned."
          : `Vehicle ${unitId} has been returned.`
      );
    } catch (error) {
      console.error(
        "Failed to return vehicle:",
        error
      );
    }
  }

  /*
   * Booking status
   */
  const isPending =
    booking?.status ===
    "Pending Verification";

  const isApproved =
    booking?.status ===
    "Approved";

  const isReturned =
    booking?.status ===
    "Returned";

  const isRejected =
    booking?.status ===
    "Rejected";

  /*
   * Returned vehicles
   */
  const returnedUnits =
    Array.isArray(
      booking?.returnedUnits
    )
      ? booking.returnedUnits
      : [];

  /*
   * Assigned vehicles
   */
  const assignedUnits =
    Array.isArray(
      booking?.assignedUnits
    )
      ? booking.assignedUnits
      : Array.isArray(
          booking?.unlockCodes
        )
        ? booking.unlockCodes
        : [];

  /*
   * Unlock codes
   */
  const unlockCodes =
    Array.isArray(
      booking?.unlockCodes
    )
      ? booking.unlockCodes
      : [];

  /*
   * Rental period text
   */
  function getPeriodText(
    period: string
  ) {
    if (
      period === "daily"
    ) {
      return "Daily";
    }

    if (
      period === "threeDay"
    ) {
      return "3 Days";
    }

    if (
      period === "weekly"
    ) {
      return "Weekly";
    }

    if (
      period === "monthly"
    ) {
      return "Monthly";
    }

    return period || "-";
  }

  return (
    <main className="min-h-screen bg-green-50 p-8">

      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-lg p-8">

        {/* =========================
            SEARCH BOOKING
        ========================= */}

        <div className="mb-8">

          <h1 className="text-3xl font-bold text-green-700 text-center">
            My Booking
          </h1>

          <p className="mt-2 text-gray-600 text-center">
            Enter your Booking ID to check your booking status
          </p>

          <form
            onSubmit={handleSearch}
            className="mt-6"
          >

            <label
              htmlFor="bookingId"
              className="block font-medium text-gray-700 mb-2"
            >
              Booking ID
            </label>

            <input
              id="bookingId"
              type="text"
              value={bookingId}
              onChange={(event) => {
                setBookingId(
                  event.target.value
                );

                setSearchError("");
              }}
              placeholder="e.g. BG-40095855"
              className="w-full border border-gray-300 rounded-full px-5 py-3 outline-none focus:border-green-600"
            />

            <button
              type="submit"
              className="mt-4 w-full bg-green-600 text-white py-3 rounded-full hover:bg-green-700"
            >
              Search Booking
            </button>

          </form>

          {searchError && (
            <div className="mt-4 bg-red-50 text-red-600 rounded-xl p-4 text-center">
              {searchError}
            </div>
          )}

        </div>


        {!booking &&
          !searchError && (
            <div className="bg-gray-50 rounded-xl p-5 text-center text-gray-600">
              Please enter your Booking ID above to view your booking.
            </div>
          )}


        {booking && (
          <>

            {/* =========================
                BOOKING STATUS
            ========================= */}

            <div className="mt-6 bg-green-50 rounded-xl p-5">

              <p>
                Booking ID:{" "}
                <b>
                  {booking.orderId || "-"}
                </b>
              </p>

              <p className="mt-3">

                Status:

                <span
                  className={
                    isApproved
                      ? "ml-2 text-green-600 font-bold"
                      : isReturned
                        ? "ml-2 text-blue-600 font-bold"
                        : isRejected
                          ? "ml-2 text-red-600 font-bold"
                          : "ml-2 text-yellow-600 font-bold"
                  }
                >
                  {isApproved
                    ? "🟢 Approved"
                    : isReturned
                      ? "🔵 Returned"
                      : isRejected
                        ? "🔴 Rejected"
                        : "🟡 Pending Verification"}
                </span>

              </p>

            </div>


            {/* =========================
                BOOKING DETAIL
            ========================= */}

            <div className="mt-6 border rounded-xl p-5">

              <h2 className="font-bold text-xl">
                Booking Detail
              </h2>

              <div className="mt-4 space-y-2">

                <p>
                  Vehicle:
                </p>

                {booking.cart?.map(
                  (item: any) => (
                    <p
                      key={item.id}
                      className="font-bold text-green-700"
                    >
                      🏍️ {item.name} x
                      {item.quantity}
                    </p>
                  )
                )}

                <p>
                  Rental Period:{" "}
                  <b>
                    {getPeriodText(
                      booking.period
                    )}
                  </b>
                </p>

                <p>
                  Start Date:{" "}
                  <b>
                    {booking.startDate ||
                      "-"}
                  </b>
                </p>

              </div>

            </div>


            {/* =========================
                APPROVED / ASSIGNED VEHICLES
            ========================= */}

            {(isApproved ||
              isReturned) &&
              assignedUnits.length >
                0 && (

                <div className="mt-6 bg-green-50 rounded-xl p-5">

                  <h2 className="text-xl font-bold">
                    Vehicle Unlock Code
                  </h2>

                  <div className="mt-4 space-y-4">

                    {assignedUnits.map(
                      (unit: any) => {

                        const unitId =
                          unit.unitId ||
                          unit.id;

                        const codeItem =
                          unlockCodes.find(
                            (code: any) =>
                              (
                                code.unitId ||
                                code.id
                              ) === unitId
                          );

                        const isUnitReturned =
                          returnedUnits.includes(
                            unitId
                          );

                        const vehicleName =
                          unit.vehicleName ||
                          unit.name ||
                          "";

                        const code =
                          codeItem?.code ||
                          unit.code ||
                          "-";

                        if (
                          isUnitReturned
                        ) {
                          return (
                            <div
                              key={unitId}
                              className="bg-gray-100 rounded-xl p-4"
                            >

                              <p className="font-bold text-gray-500">
                                🏍️{" "}
                                {vehicleName}
                              </p>

                              <p className="mt-1 text-gray-500">
                                Vehicle:{" "}
                                {unitId}
                              </p>

                              <p className="mt-2 font-bold text-blue-600">
                                ✓ Returned
                              </p>

                            </div>
                          );
                        }

                        return (
                          <div
                            key={unitId}
                            className="bg-white rounded-xl p-4"
                          >

                            <p className="text-green-700 font-bold text-lg">
                              🏍️{" "}
                              {vehicleName}
                            </p>

                            <p className="mt-1 text-green-700 font-bold">
                              Vehicle:{" "}
                              {unitId}
                            </p>

                            <p className="mt-2 text-green-700 font-bold">
                              🔑 Code:{" "}
                              {code}
                            </p>

                            {isApproved && (
                              <button
                                type="button"
                                onClick={() =>
                                  returnVehicle(
                                    unitId
                                  )
                                }
                                className="mt-4 w-full bg-blue-600 text-white py-3 rounded-full hover:bg-blue-700"
                              >
                                Return{" "}
                                {unitId}
                              </button>
                            )}

                          </div>
                        );
                      }
                    )}

                  </div>

                </div>
              )}


            {/* =========================
                FULL RETURNED
            ========================= */}

            {isReturned && (
              <div className="mt-6 bg-blue-50 rounded-xl p-5">

                <h2 className="text-xl font-bold text-blue-700">
                  Vehicle Return Completed
                </h2>

                <p className="mt-3">
                  All vehicles have been returned successfully.
                </p>

                {assignedUnits.length >
                  0 && (
                    <div className="mt-4 space-y-2">

                      {assignedUnits.map(
                        (unit: any) => (
                          <p
                            key={
                              unit.unitId ||
                              unit.id
                            }
                            className="text-gray-600"
                          >
                            ✓{" "}
                            {unit.unitId ||
                              unit.id}{" "}
                            — Returned
                          </p>
                        )
                      )}

                    </div>
                  )}

              </div>
            )}


            {/* =========================
                PENDING
            ========================= */}

            {isPending && (
              <div className="mt-6 bg-gray-50 rounded-xl p-5">

                <p className="font-bold">
                  Verification Process
                </p>

                <p className="mt-2">
                  Your payment and documents are being reviewed.
                </p>

                <p className="mt-2 text-green-700 font-bold">
                  Estimated time: 5–10 minutes
                </p>

              </div>
            )}


            {/* =========================
                REJECTED
            ========================= */}

            {isRejected && (
              <div className="mt-6 bg-red-50 rounded-xl p-5">

                <h2 className="font-bold text-red-600">
                  Booking Rejected
                </h2>

                <p className="mt-2">
                  {booking.rejectReason ||
                    "Please contact staff."}
                </p>

              </div>
            )}


            {/* =========================
                REFRESH
            ========================= */}

            <button
              type="button"
              onClick={() =>
                loadBooking(
                  booking.orderId
                )
              }
              className="mt-8 w-full border border-green-600 text-green-700 py-3 rounded-full hover:bg-green-50"
            >
              🔄 Refresh Booking Status
            </button>

          </>
        )}


        <Link
          href="/"
          className="mt-3 block w-full bg-green-600 text-white py-4 rounded-full text-center hover:bg-green-700"
        >
          Back to Home
        </Link>

      </div>

    </main>
  );
}