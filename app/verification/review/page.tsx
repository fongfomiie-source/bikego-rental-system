"use client";

import { useEffect, useState } from "react";
import { useBooking } from "../../context/BookingContext";
import { useRouter } from "next/navigation";

export default function ReviewPage() {
  const router = useRouter();

  const {
    cart,
    period,
    startDate,
    customerType,
    documentType,
    documentImage,
    drivingLicenseImage,
    paymentSlip,
    setOrderId,
    setBookingStatus,
  } = useBooking();

  /* =========================
     Fallback Booking Data
  ========================= */

  const [reviewPeriod, setReviewPeriod] =
    useState(period || "");

  const [reviewStartDate, setReviewStartDate] =
    useState(startDate || "");

  /* =========================
     Load bookingSelection
     as fallback
  ========================= */

  useEffect(() => {
    const saved =
      sessionStorage.getItem(
        "bookingSelection"
      );

    if (!saved) {
      return;
    }

    try {
      const booking =
        JSON.parse(saved);

      /*
       * Use Context first.
       * If Context is empty,
       * use sessionStorage.
       */

      if (
        !reviewPeriod &&
        booking?.period
      ) {
        setReviewPeriod(
          booking.period
        );
      }

      if (
        !reviewStartDate &&
        booking?.startDate
      ) {
        setReviewStartDate(
          booking.startDate
        );
      }
    } catch (error) {
      console.error(
        "Failed to read booking selection:",
        error
      );
    }
  }, [
    reviewPeriod,
    reviewStartDate,
  ]);

  /* =========================
     Confirm Booking
  ========================= */

  function handleConfirm() {
    /*
     * Generate Booking ID
     *
     * This ID is generated ONLY ONCE
     * for this booking.
     */

    const newOrderId =
      "BG-" +
      Date.now()
        .toString()
        .slice(-8);

    /*
     * Booking Data
     */

    const bookingData = {
      orderId: newOrderId,

      status:
        "Pending Verification",

      cart,

      period:
        reviewPeriod,

      startDate:
        reviewStartDate,

      customerType,

      documentType,

      documentImage,

      drivingLicenseImage,

      paymentSlip,

      createdAt:
        new Date().toISOString(),
    };

    /* =========================
       Load Existing Bookings
    ========================= */

    const oldBookings =
      localStorage.getItem(
        "bookings"
      );

    let bookings: any[] = [];

    if (oldBookings) {
      try {
        const parsed =
          JSON.parse(oldBookings);

        if (
          Array.isArray(parsed)
        ) {
          bookings = parsed;
        }
      } catch (error) {
        console.error(
          "Failed to read existing bookings:",
          error
        );

        bookings = [];
      }
    }

    /* =========================
       Prevent Duplicate Booking
    ========================= */

    const existingBooking =
      bookings.find(
        (item: any) =>
          item.orderId ===
          newOrderId
      );

    if (existingBooking) {
      console.error(
        "Booking ID already exists:",
        newOrderId
      );

      return;
    }

    /* =========================
       Add New Booking
    ========================= */

    const updatedBookings = [
      ...bookings,
      bookingData,
    ];

    /* =========================
       Save Booking
    ========================= */

    localStorage.setItem(
      "bookings",
      JSON.stringify(
        updatedBookings
      )
    );

    /*
     * IMPORTANT
     *
     * Remember the booking that was
     * just created.
     *
     * Pending page will use this ID
     * instead of accidentally loading
     * an old booking.
     */

    localStorage.setItem(
      "lastViewedBookingId",
      newOrderId
    );

    /* =========================
       Update Context
    ========================= */

    setOrderId(
      newOrderId
    );

    setBookingStatus(
      "Pending Verification"
    );

    /* =========================
       Go To Booking Status
    ========================= */

    router.push(
      `/booking/pending?id=${encodeURIComponent(
        newOrderId
      )}`
    );
  }

  /* =========================
     Return UI
  ========================= */

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
        {/* Page Title */}

        <h1
          className="
            text-3xl
            font-bold
            text-green-700
          "
        >
          Review Information
        </h1>

        <p
          className="
            mt-3
            text-gray-600
          "
        >
          Please check your information before confirmation
        </p>

        {/* =========================
            Booking Information
        ========================= */}

        <div
          className="
            mt-6
            space-y-6
          "
        >
          {/* Rental Period */}

          <div>
            <p
              className="
                text-gray-500
              "
            >
              Rental Period
            </p>

            <p
              className="
                font-bold
              "
            >
              {reviewPeriod || "-"}
            </p>
          </div>

          {/* Start Date */}

          <div>
            <p
              className="
                text-gray-500
              "
            >
              Start Date
            </p>

            <p
              className="
                font-bold
              "
            >
              {reviewStartDate || "-"}
            </p>
          </div>

          {/* Customer Type */}

          <div>
            <p
              className="
                text-gray-500
              "
            >
              Customer Type
            </p>

            <p
              className="
                font-bold
              "
            >
              {customerType || "-"}
            </p>
          </div>

          {/* Document Type */}

          <div>
            <p
              className="
                text-gray-500
              "
            >
              Document Type
            </p>

            <p
              className="
                font-bold
              "
            >
              {documentType || "-"}
            </p>
          </div>

          {/* =========================
              Document Image
          ========================= */}

          {documentImage && (
            <div>
              <p
                className="
                  text-gray-500
                  mb-2
                "
              >
                National ID / Passport
              </p>

              <img
                src={documentImage}
                alt="National ID / Passport"
                className="
                  rounded-xl
                  max-h-60
                  max-w-full
                  mx-auto
                  object-contain
                "
              />
            </div>
          )}

          {/* =========================
              Driving License
          ========================= */}

          {drivingLicenseImage && (
            <div>
              <p
                className="
                  text-gray-500
                  mb-2
                "
              >
                Driving License
              </p>

              <img
                src={drivingLicenseImage}
                alt="Driving License"
                className="
                  rounded-xl
                  max-h-60
                  max-w-full
                  mx-auto
                  object-contain
                "
              />
            </div>
          )}

          {/* Ready */}

          <p
            className="
              text-green-600
              font-bold
            "
          >
            Ready for Confirmation
          </p>
        </div>

        {/* =========================
            Confirm Button
        ========================= */}

        <button
          type="button"
          onClick={handleConfirm}
          className="
            mt-8
            w-full
            bg-green-600
            text-white
            py-4
            rounded-full
            hover:bg-green-700
          "
        >
          Confirm Information
        </button>
      </div>
    </main>
  );
}