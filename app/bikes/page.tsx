"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { vehicles } from "@/data/vehicles";
import { useBooking } from "../context/BookingContext";

export default function BikesPage() {
  const { cart, addToCart } = useBooking();

  const [bookings, setBookings] = useState<any[]>([]);

  /* =========================
     Load current bookings
  ========================= */

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

    /*
     * Update when another tab/window
     * changes localStorage.
     */
    function handleStorage() {
      loadBookings();
    }

    window.addEventListener(
      "storage",
      handleStorage
    );

    return () => {
      window.removeEventListener(
        "storage",
        handleStorage
      );
    };
  }, []);

  /* =========================
     Check physical vehicle
     ========================= */

  function isUnitRented(unitId: string) {
    return bookings.some((booking) => {
      /*
       * Only Approved bookings
       * currently occupy vehicles.
       */
      if (
        booking.status !== "Approved"
      ) {
        return false;
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

      /*
       * A vehicle is rented only when
       * it is assigned and has not been returned.
       */
      return assignedUnits.some(
        (assigned: any) =>
          assigned.unitId === unitId &&
          !returnedUnits.includes(
            assigned.unitId
          )
      );
    });
  }

  /* =========================
     Get available units
  ========================= */

  function getAvailableUnits(
    vehicle: any
  ) {
    return (vehicle.units || []).filter(
      (unit: any) =>
        !isUnitRented(unit.id)
    );
  }

  /* =========================
     Cart
  ========================= */

  const cartCount = cart.reduce(
    (sum, item) =>
      sum + item.quantity,
    0
  );

  const cartTotal = cart.reduce(
    (sum, item) =>
      sum +
      item.price * item.quantity,
    0
  );

  /* =========================
     Add to cart
  ========================= */

  function handleAddToCart(
    vehicle: any
  ) {
    const availableUnits =
      getAvailableUnits(vehicle);

    if (availableUnits.length === 0) {
      alert(
        `${vehicle.name} is currently unavailable.`
      );

      return;
    }

    /*
     * Check how many of this model
     * are already in the cart.
     */
    const currentCartItem =
      cart.find(
        (item) =>
          item.id === vehicle.id
      );

    const currentQuantity =
      currentCartItem?.quantity || 0;

    /*
     * Do not allow cart quantity
     * to exceed currently available units.
     */
    if (
      currentQuantity >=
      availableUnits.length
    ) {
      alert(
        `Only ${availableUnits.length} ${vehicle.name} vehicle(s) are currently available.`
      );

      return;
    }

    addToCart({
      id: vehicle.id,
      name: vehicle.name,
      type: vehicle.type,
      price: vehicle.prices.daily,
      quantity: 1,
    });
  }

  return (
    <main
      className="
        min-h-screen
        bg-gray-50
        p-8
        pb-32
      "
    >

      {/* =========================
          Page Header
      ========================= */}

      <h1
        className="
          text-3xl
          md:text-4xl
          font-bold
          text-green-700
          text-center
          mb-10
        "
      >
        🚲 🏍️
        <br />
        Available Vehicles
      </h1>


      {/* =========================
          Cart
      ========================= */}

      <Link
        href="/cart"
        className="
          hidden
          md:block
          mb-8
          text-center
          bg-black
          text-white
          py-3
          rounded-full
        "
      >
        🛒 Go to Cart
      </Link>


      {/* =========================
          Vehicle Grid
      ========================= */}

      <div
        className="
          grid
          gap-6
          md:grid-cols-4
        "
      >

        {vehicles.map(
          (vehicle) => {
            const availableUnits =
              getAvailableUnits(
                vehicle
              );

            const totalUnits =
              vehicle.units?.length ||
              0;

            const availableCount =
              availableUnits.length;

            const isAvailable =
              availableCount > 0;

            return (
              <div
                key={vehicle.id}
                className="
                  bg-white
                  rounded-2xl
                  shadow-md
                  p-6
                  hover:shadow-xl
                  transition
                "
              >

                {/* Vehicle Icon */}

                <div
                  className="
                    text-5xl
                    text-center
                    mb-4
                  "
                >
                  {vehicle.type ===
                  "Bicycle"
                    ? "🚲"
                    : "🏍️"}
                </div>


                {/* Name */}

                <h2
                  className="
                    text-xl
                    font-bold
                  "
                >
                  {vehicle.name}
                </h2>


                {/* Type */}

                <p
                  className="
                    text-gray-500
                  "
                >
                  {vehicle.type}
                </p>


                {/* Price */}

                <div
                  className="
                    mt-4
                    space-y-1
                  "
                >

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
                    Real Availability
                ========================= */}

                {isAvailable ? (

                  <div
                    className="
                      mt-4
                      text-green-600
                      font-bold
                    "
                  >
                    🟢 Available{" "}
                    {availableCount}/
                    {totalUnits}
                  </div>

                ) : (

                  <div
                    className="
                      mt-4
                      text-red-600
                      font-bold
                    "
                  >
                    🔴 Fully Rented
                  </div>

                )}


                {/* =========================
                    View Details
                ========================= */}

                <Link
                  href={`/vehicles/${vehicle.id}`}
                  className="
                    mt-5
                    block
                    text-center
                    w-full
                    border
                    border-green-600
                    text-green-700
                    py-3
                    rounded-full
                    hover:bg-green-50
                    transition
                  "
                >
                  View Details
                </Link>


                {/* =========================
                    Add To Cart
                ========================= */}

                <button
                  type="button"
                  disabled={!isAvailable}
                  onClick={() =>
                    handleAddToCart(
                      vehicle
                    )
                  }
                  className={`
                    mt-3
                    w-full
                    py-3
                    rounded-full
                    transition
                    ${
                      isAvailable
                        ? "bg-green-600 text-white hover:bg-green-700"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }
                  `}
                >
                  {isAvailable
                    ? "Add to Cart"
                    : "Fully Rented"}
                </button>

              </div>
            );
          }
        )}

      </div>


      {/* =========================
          Mobile Cart Bar
      ========================= */}

      {cartCount > 0 && (
        <Link
          href="/cart"
          className="
            fixed
            bottom-5
            left-5
            right-5
            z-50
            md:hidden
            bg-green-600
            text-white
            rounded-full
            py-4
            px-6
            shadow-xl
            flex
            justify-between
            items-center
          "
        >

          <p
            className="
              font-bold
            "
          >
            🛒 Cart ({cartCount})
          </p>

          <p
            className="
              font-bold
            "
          >
            {cartTotal} THB
          </p>

        </Link>
      )}

    </main>
  );
}