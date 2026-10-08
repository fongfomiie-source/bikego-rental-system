"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { vehicles } from "@/data/vehicles";

type Booking = {
  orderId?: string;
  status?: string;
  assignedUnits?: {
    itemId?: string;
    vehicleId?: string;
    vehicleName?: string;
    unitId?: string;
    code?: string;
  }[];
  returnedUnits?: string[];
  customerType?: string;
  startDate?: string;
  period?: string;
};

export default function AdminVehiclesPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filter, setFilter] = useState("All");

  function loadBookings() {
    const data = localStorage.getItem("bookings");

    if (!data) {
      setBookings([]);
      return;
    }

    try {
      const parsed = JSON.parse(data);

      if (Array.isArray(parsed)) {
        setBookings(parsed);
      } else {
        setBookings([]);
      }
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

  /*
   * Find the current status of a physical vehicle.
   *
   * Priority:
   *
   * 1. Approved + assigned + not returned
   *    = Rented
   *
   * 2. Approved + assigned + returned
   *    = Available
   *
   * 3. No active booking
   *    = Available
   */
  function getUnitInfo(unitId: string) {
    let activeBooking: Booking | null = null;

    for (const booking of bookings) {
      if (
        booking.status !== "Approved"
      ) {
        continue;
      }

      const assigned =
        Array.isArray(
          booking.assignedUnits
        )
          ? booking.assignedUnits
          : [];

      const found = assigned.find(
        (unit) =>
          unit.unitId === unitId
      );

      if (!found) {
        continue;
      }

      const returnedUnits =
        Array.isArray(
          booking.returnedUnits
        )
          ? booking.returnedUnits
          : [];

      /*
       * If this vehicle has already been
       * returned from the booking,
       * it is available again.
       */
      if (
        returnedUnits.includes(unitId)
      ) {
        continue;
      }

      activeBooking = booking;
      break;
    }

    if (activeBooking) {
      return {
        status: "Rented",
        booking: activeBooking,
      };
    }

    return {
      status: "Available",
      booking: null,
    };
  }

  /*
   * Build all physical vehicles
   */
  const allUnits = vehicles.flatMap(
    (vehicle) =>
      (vehicle.units || []).map(
        (unit) => {
          const info =
            getUnitInfo(unit.id);

          return {
            modelId: vehicle.id,
            modelName: vehicle.name,
            type: vehicle.type,
            unitId: unit.id,
            status: info.status,
            booking: info.booking,
          };
        }
      )
  );

  /*
   * Counts
   */
  const availableCount =
    allUnits.filter(
      (unit) =>
        unit.status === "Available"
    ).length;

  const rentedCount =
    allUnits.filter(
      (unit) =>
        unit.status === "Rented"
    ).length;

  const totalCount =
    allUnits.length;

  /*
   * Filter
   */
  const filteredUnits =
    filter === "All"
      ? allUnits
      : allUnits.filter(
          (unit) =>
            unit.status === filter
        );

  function getStatusClass(
    status: string
  ) {
    if (status === "Rented") {
      return "text-orange-600";
    }

    return "text-green-600";
  }

  function getStatusDot(
    status: string
  ) {
    if (status === "Rented") {
      return "🟠";
    }

    return "🟢";
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
              Vehicle Management
            </h1>

            <p
              className="
                mt-2
                text-gray-600
              "
            >
              Manage and view physical
              vehicle status
            </p>

          </div>

          <Link
            href="/admin"
            className="
              bg-green-600
              text-white
              px-5
              py-2
              rounded-full
              text-center
              hover:bg-green-700
            "
          >
            Back to Dashboard
          </Link>

        </div>


        {/* =========================
            Summary
        ========================= */}

        <div
          className="
            mt-8
            grid
            grid-cols-1
            sm:grid-cols-3
            gap-4
          "
        >

          {/* Total */}

          <button
            type="button"
            onClick={() =>
              setFilter("All")
            }
            className="
              text-left
              bg-gray-50
              border
              border-gray-200
              rounded-xl
              p-5
            "
          >

            <p
              className="
                text-gray-600
              "
            >
              Total Vehicles
            </p>

            <p
              className="
                mt-1
                text-3xl
                font-bold
                text-gray-800
              "
            >
              {totalCount}
            </p>

          </button>


          {/* Available */}

          <button
            type="button"
            onClick={() =>
              setFilter("Available")
            }
            className="
              text-left
              bg-green-50
              border
              border-green-200
              rounded-xl
              p-5
            "
          >

            <p
              className="
                text-green-700
              "
            >
              Available
            </p>

            <p
              className="
                mt-1
                text-3xl
                font-bold
                text-green-600
              "
            >
              {availableCount}
            </p>

          </button>


          {/* Rented */}

          <button
            type="button"
            onClick={() =>
              setFilter("Rented")
            }
            className="
              text-left
              bg-orange-50
              border
              border-orange-200
              rounded-xl
              p-5
            "
          >

            <p
              className="
                text-orange-700
              "
            >
              Rented
            </p>

            <p
              className="
                mt-1
                text-3xl
                font-bold
                text-orange-600
              "
            >
              {rentedCount}
            </p>

          </button>

        </div>


        {/* =========================
            Filter Buttons
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
              setFilter("Available")
            }
            className={`
              px-5
              py-2
              rounded-full
              border
              ${
                filter === "Available"
                  ? "bg-green-600 text-white border-green-600"
                  : "text-green-700 border-green-600"
              }
            `}
          >
            Available
          </button>


          <button
            type="button"
            onClick={() =>
              setFilter("Rented")
            }
            className={`
              px-5
              py-2
              rounded-full
              border
              ${
                filter === "Rented"
                  ? "bg-orange-500 text-white border-orange-500"
                  : "text-orange-700 border-orange-500"
              }
            `}
          >
            Rented
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
          🔄 Refresh Vehicle Status
        </button>


        {/* =========================
            Vehicle List
        ========================= */}

        <div
          className="
            mt-8
            space-y-5
          "
        >

          {filteredUnits.length === 0 && (
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
                No vehicle found
              </p>
            </div>
          )}


          {filteredUnits.map(
            (unit) => (

              <div
                key={unit.unitId}
                className="
                  border
                  rounded-2xl
                  p-5
                "
              >

                {/* Vehicle Header */}

                <div
                  className="
                    flex
                    flex-col
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                    gap-3
                  "
                >

                  <div>

                    <p
                      className="
                        text-xl
                        font-bold
                        text-green-700
                      "
                    >
                      {unit.modelName}
                    </p>

                    <p
                      className="
                        mt-1
                        text-gray-600
                      "
                    >
                      {unit.type}
                    </p>

                  </div>


                  {/* Status */}

                  <div
                    className={`
                      font-bold
                      ${getStatusClass(
                        unit.status
                      )}
                    `}
                  >
                    {getStatusDot(
                      unit.status
                    )}{" "}
                    {unit.status}
                  </div>

                </div>


                {/* Vehicle Information */}

                <div
                  className="
                    mt-4
                    bg-gray-50
                    rounded-xl
                    p-4
                  "
                >

                  <p>
                    Vehicle No.:

                    <b>
                      {" "}
                      {unit.unitId}
                    </b>
                  </p>


                  {unit.status ===
                    "Available" && (

                    <p
                      className="
                        mt-2
                        text-green-700
                        font-bold
                      "
                    >
                      Vehicle is available
                      for new booking
                    </p>

                  )}


                  {unit.status ===
                    "Rented" &&
                    unit.booking && (

                    <div
                      className="
                        mt-3
                        bg-orange-50
                        rounded-xl
                        p-4
                      "
                    >

                      <p
                        className="
                          font-bold
                          text-orange-700
                        "
                      >
                        Current Rental
                      </p>


                      <p className="mt-2">
                        Booking ID:

                        <b>
                          {" "}
                          {
                            unit.booking
                              .orderId
                          }
                        </b>
                      </p>


                      <p className="mt-1">
                        Customer:

                        <b>
                          {" "}
                          {
                            unit.booking
                              .customerType ||
                            "-"
                          }
                        </b>
                      </p>


                      <p className="mt-1">
                        Start Date:

                        <b>
                          {" "}
                          {
                            unit.booking
                              .startDate ||
                            "-"
                          }
                        </b>
                      </p>


                      <Link
                        href={`/admin/booking/${unit.booking.orderId}`}
                        className="
                          mt-4
                          block
                          w-full
                          bg-green-600
                          text-white
                          py-3
                          rounded-full
                          text-center
                          hover:bg-green-700
                        "
                      >
                        View Booking
                      </Link>

                    </div>

                  )}

                </div>

              </div>

            )
          )}

        </div>


        {/* =========================
            Footer
        ========================= */}

        <Link
          href="/admin"
          className="
            mt-8
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
          Back to Admin Dashboard
        </Link>

      </div>
    </main>
  );
}