"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { vehicles } from "@/data/vehicles";

type Booking = {
  orderId?: string;
  status?: string;

  assignedUnits?: {
    unitId?: string;
    vehicleId?: string;
  }[];

  returnedUnits?: string[];
};

export default function VehicleDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [vehicleId, setVehicleId] = useState("");
  const [availableCount, setAvailableCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  /* =========================
     Load Vehicle Availability
  ========================= */

  function loadAvailability(id: string) {
    const vehicle = vehicles.find(
      (item) => item.id === id
    );

    if (!vehicle) {
      setLoading(false);
      return;
    }

    /* =========================
       Physical Vehicle Units
    ========================= */

    const units = Array.isArray(vehicle.units)
      ? vehicle.units
      : [];

    const total = units.length;

    /* =========================
       Read Current Bookings
    ========================= */

    let bookedUnitIds: string[] = [];

    const data = localStorage.getItem("bookings");

    if (data) {
      try {
        const bookings: Booking[] =
          JSON.parse(data);

        bookings.forEach((booking) => {
          /*
           * Only Approved bookings
           * occupy physical vehicles.
           */
          if (
            booking.status !== "Approved"
          ) {
            return;
          }

          const assignedUnits =
            Array.isArray(
              booking.assignedUnits
            )
              ? booking.assignedUnits
              : [];

          const returnedUnits =
            Array.isArray(
              booking.returnedUnits
            )
              ? booking.returnedUnits
              : [];

          assignedUnits.forEach((unit) => {
            const unitId = unit.unitId;

            /*
             * Only count units belonging
             * to this vehicle model.
             */
            if (
              unitId &&
              unit.vehicleId === vehicle.id &&
              !returnedUnits.includes(unitId)
            ) {
              bookedUnitIds.push(unitId);
            }
          });
        });
      } catch (error) {
        console.error(
          "Failed to read bookings:",
          error
        );
      }
    }

    /* =========================
       Remove Duplicate Unit IDs
    ========================= */

    bookedUnitIds = [
      ...new Set(bookedUnitIds),
    ];

    /* =========================
       Calculate Availability
    ========================= */

    const available = Math.max(
      total - bookedUnitIds.length,
      0
    );

    setTotalCount(total);
    setAvailableCount(available);
    setLoading(false);
  }

  /* =========================
     Initial Load
  ========================= */

  useEffect(() => {
    params.then(({ id }) => {
      setVehicleId(id);

      loadAvailability(id);
    });
  }, [params]);

  /* =========================
     Refresh When Page Becomes
     Active Again
  ========================= */

  useEffect(() => {
    function handleFocus() {
      if (vehicleId) {
        loadAvailability(vehicleId);
      }
    }

    function handleStorage() {
      if (vehicleId) {
        loadAvailability(vehicleId);
      }
    }

    window.addEventListener(
      "focus",
      handleFocus
    );

    window.addEventListener(
      "storage",
      handleStorage
    );

    return () => {
      window.removeEventListener(
        "focus",
        handleFocus
      );

      window.removeEventListener(
        "storage",
        handleStorage
      );
    };
  }, [vehicleId]);

  /* =========================
     Vehicle
  ========================= */

  const vehicle = vehicles.find(
    (item) => item.id === vehicleId
  );

  /* =========================
     Vehicle Not Found
  ========================= */

  if (!vehicle && !loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <h1 className="text-3xl font-bold">
          Vehicle not found
        </h1>
      </main>
    );
  }

  /* =========================
     Loading
  ========================= */

  if (!vehicle) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </main>
    );
  }

  /* =========================
     Fully Rented
  ========================= */

  const isFullyRented =
    !loading &&
    totalCount > 0 &&
    availableCount === 0;

  /* =========================
     Return UI
  ========================= */

  return (
    <main className="min-h-screen bg-green-50 p-8">

      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-lg p-8">

        {/* =========================
            Vehicle Icon
        ========================= */}

        <div className="text-7xl text-center mb-5">
          {vehicle.type === "Bicycle"
            ? "🚲"
            : "🏍️"}
        </div>

        {/* =========================
            Vehicle Name
        ========================= */}

        <h1 className="text-4xl font-bold text-green-700">
          {vehicle.name}
        </h1>

        <p className="text-gray-500 mt-2">
          {vehicle.type}
        </p>

        {/* =========================
            Description
        ========================= */}

        <p className="mt-4 text-gray-700">
          {vehicle.description}
        </p>

        {/* =========================
            Rental Price
        ========================= */}

        <div className="mt-6">

          <h2 className="text-xl font-bold mb-3">
            Rental Price
          </h2>

          <p>
            Daily:
            <b>
              {" "}
              {vehicle.prices.daily} THB
            </b>
          </p>

          <p>
            3-Day:
            <b>
              {" "}
              {vehicle.prices.threeDay} THB
            </b>
          </p>

          <p>
            Weekly:
            <b>
              {" "}
              {vehicle.prices.weekly} THB
            </b>
          </p>

          <p>
            Monthly:
            <b>
              {" "}
              {vehicle.prices.monthly} THB
            </b>
          </p>

        </div>

        {/* =========================
            Features
        ========================= */}

        <div className="mt-6">

          <h2 className="text-xl font-bold">
            Features
          </h2>

          <ul className="list-disc ml-6 mt-2">

            {vehicle.features.map(
              (item) => (
                <li key={item}>
                  {item}
                </li>
              )
            )}

          </ul>

        </div>

        {/* =========================
            Requirement
        ========================= */}

        <div className="mt-6">

          <h2 className="text-xl font-bold">
            Requirement
          </h2>

          <p>
            {vehicle.requirement}
          </p>

        </div>

        {/* =========================
            Availability
        ========================= */}

        <div className="mt-6">

          {loading ? (

            <div className="text-gray-500">
              Checking vehicle availability...
            </div>

          ) : isFullyRented ? (

            <div className="text-red-600 font-bold">
              🔴 Fully Rented
            </div>

          ) : (

            <div className="text-green-600 font-bold">
              🟢 Available{" "}
              {availableCount}/{totalCount}
            </div>

          )}

        </div>

        {/* =========================
            Book Now
        ========================= */}

        {!loading && !isFullyRented ? (

          <Link
            href={`/booking?vehicle=${vehicle.id}`}
            className="
              mt-8
              block
              text-center
              w-full
              bg-green-600
              text-white
              py-4
              rounded-full
              hover:bg-green-700
            "
          >
            Book Now
          </Link>

        ) : (

          <button
            type="button"
            disabled
            className="
              mt-8
              block
              text-center
              w-full
              bg-gray-300
              text-gray-500
              py-4
              rounded-full
              cursor-not-allowed
            "
          >
            Fully Rented
          </button>

        )}

      </div>

    </main>
  );
}