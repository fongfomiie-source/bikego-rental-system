"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useBooking } from "../context/BookingContext";

export default function BookingForm({
  vehicle,
}: any) {
  const router = useRouter();

  const {
    cart,
    addToCart,
    setStartDate,
    setPeriod,
  } = useBooking();

  const [selectedPeriod, setSelectedPeriod] =
    useState("daily");

  const [selectedDate, setSelectedDate] =
    useState("");

  const [error, setError] = useState("");

  const [availableCount, setAvailableCount] =
    useState<number | null>(null);

  const [checkingAvailability, setCheckingAvailability] =
    useState(true);


  // =========================================================
  // CHECK VEHICLE AVAILABILITY
  // =========================================================
  //
  // ตรวจจาก physical vehicle ที่ถูก Assign จริง
  //
  // Approved + assigned + ยังไม่ Returned
  // = รถกำลังถูกใช้งาน
  //
  // Returned / Rejected
  // = ไม่ล็อกรถ
  //
  // Pending Verification
  // = ยังไม่ล็อกรถ เพราะ Admin ยังไม่ได้ Assign
  //
  // =========================================================

  function getAvailableVehicleCount() {

    const units = Array.isArray(vehicle?.units)
      ? vehicle.units
      : [];

    const totalUnits = units.length;

    if (totalUnits === 0) {
      return 0;
    }


    const data =
      localStorage.getItem("bookings");


    if (!data) {
      return totalUnits;
    }


    try {

      const bookings =
        JSON.parse(data);


      if (!Array.isArray(bookings)) {
        return totalUnits;
      }


      /*
       * เก็บหมายเลขรถจริงที่ถูกใช้งานอยู่
       *
       * เช่น
       *
       * MT-01
       * MT-02
       * MT-03
       */

      const unavailableUnitIds =
        new Set<string>();


      bookings.forEach(
        (booking: any) => {

          /*
           * Returned และ Rejected
           * ไม่ถือว่ารถถูกใช้งาน
           */

          if (
            booking.status === "Returned" ||
            booking.status === "Rejected"
          ) {
            return;
          }


          /*
           * เฉพาะ Approved เท่านั้น
           * ที่ล็อก physical vehicle
           */

          if (
            booking.status !== "Approved"
          ) {
            return;
          }


          /*
           * assignedUnits คือ
           * รถจริงที่ Admin Assign
           */

          const assignedUnits =
            Array.isArray(
              booking.assignedUnits
            )
              ? booking.assignedUnits
              : [];


          /*
           * รถที่ถูกคืนแล้ว
           * ต้องไม่นับเป็นรถที่ถูกใช้งาน
           */

          const returnedUnits =
            Array.isArray(
              booking.returnedUnits
            )
              ? booking.returnedUnits
              : [];


          assignedUnits.forEach(
            (assigned: any) => {

              /*
               * ต้องเป็นรถของ Model นี้
               *
               * เช่น B002 = MT Bicycle
               */

              if (
                assigned.vehicleId !==
                vehicle.id
              ) {
                return;
              }


              const unitId =
                assigned.unitId;


              if (!unitId) {
                return;
              }


              /*
               * ถ้าคืนรถคันนี้แล้ว
               * ให้ถือว่าว่าง
               */

              if (
                returnedUnits.includes(
                  unitId
                )
              ) {
                return;
              }


              /*
               * รถยังถูกใช้งานอยู่
               */

              unavailableUnitIds.add(
                unitId
              );

            }
          );

        }
      );


      return Math.max(
        totalUnits -
          unavailableUnitIds.size,
        0
      );

    } catch (error) {

      console.error(
        "Failed to check vehicle availability:",
        error
      );


      /*
       * ถ้าอ่านข้อมูลไม่ได้
       * ให้ถือว่าไม่มีรถว่าง
       * เพื่อป้องกันการจองเกิน
       */

      return 0;
    }
  }


  // =========================================================
  // INITIAL AVAILABILITY CHECK
  // =========================================================

  useEffect(() => {

    setCheckingAvailability(true);


    const available =
      getAvailableVehicleCount();


    setAvailableCount(
      available
    );


    setCheckingAvailability(false);

  }, [vehicle]);


  // =========================================================
  // FULLY RENTED
  // =========================================================

  const isFullyRented =
    !checkingAvailability &&
    availableCount !== null &&
    availableCount <= 0;


  // =========================================================
  // PRICE
  // =========================================================

  const price =
    selectedPeriod === "daily"
      ? vehicle.prices.daily
      : selectedPeriod === "threeDay"
      ? vehicle.prices.threeDay
      : selectedPeriod === "weekly"
      ? vehicle.prices.weekly
      : vehicle.prices.monthly;


  // =========================================================
  // PERIOD NAME
  // =========================================================

  const periodName =
    selectedPeriod === "daily"
      ? "Daily"
      : selectedPeriod === "threeDay"
      ? "3-Day"
      : selectedPeriod === "weekly"
      ? "Weekly"
      : "Monthly";


  // =========================================================
  // CONTINUE
  // =========================================================

  function handleContinue() {

    /*
     * ตรวจ Availability ใหม่อีกครั้ง
     *
     * สำคัญมาก เพราะระหว่างที่เปิดหน้าไว้
     * Admin อาจ Approve booking อื่น
     * ทำให้รถเต็มขึ้นมาได้
     */

    const currentAvailable =
      getAvailableVehicleCount();


    setAvailableCount(
      currentAvailable
    );


    /*
     * รถเต็ม
     */

    if (
      currentAvailable <= 0
    ) {

      setError(
        "This vehicle is fully rented and is no longer available for booking."
      );

      return;
    }


    /*
     * ต้องเลือกวันที่
     */

    if (!selectedDate) {

      setError(
        "Please select start date."
      );

      return;
    }


    /*
     * Save booking information
     */

    setStartDate(
      selectedDate
    );

    setPeriod(
      selectedPeriod
    );


    // =======================================================
    // ADD VEHICLE TO CART
    // =======================================================

    const cartVehicle = {

      id:
        vehicle.id,

      name:
        vehicle.name,

      type:
        vehicle.type,

      price:
        price,

      quantity:
        1,

    };


    /*
     * ถ้ารถนี้ยังไม่มีใน Cart
     * ให้เพิ่ม
     */

    const alreadyInCart =
      cart.some(
        (item) =>
          item.id === vehicle.id
      );


    if (!alreadyInCart) {

      addToCart(
        cartVehicle
      );

    }


    /*
     * Go to Payment
     */

    router.push(
      "/payment"
    );

  }


  // =========================================================
  // UI
  // =========================================================

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

        {/* ================================================= */}
        {/* TITLE */}
        {/* ================================================= */}

        <h1
          className="
            text-3xl
            font-bold
            text-green-700
          "
        >
          Booking
        </h1>


        {/* ================================================= */}
        {/* VEHICLE */}
        {/* ================================================= */}

        <div className="mt-5">

          <h2
            className="
              text-2xl
              font-bold
            "
          >
            {vehicle.name}
          </h2>


          <p
            className="
              text-gray-500
            "
          >
            {vehicle.type}
          </p>


          {/* Availability */}

          <div className="mt-3">

            {checkingAvailability ? (

              <p
                className="
                  text-gray-500
                "
              >
                Checking availability...
              </p>

            ) : isFullyRented ? (

              <p
                className="
                  text-red-600
                  font-bold
                "
              >
                🔴 Fully Rented
              </p>

            ) : (

              <p
                className="
                  text-green-600
                  font-bold
                "
              >
                🟢 Available{" "}
                {availableCount}
                /
                {vehicle.units?.length || 0}
              </p>

            )}

          </div>

        </div>


        {/* ================================================= */}
        {/* FULLY RENTED MESSAGE */}
        {/* ================================================= */}

        {isFullyRented && (

          <div
            className="
              mt-6
              bg-red-50
              border
              border-red-200
              rounded-xl
              p-5
            "
          >

            <p
              className="
                text-red-600
                font-bold
              "
            >
              This vehicle is currently fully rented.
            </p>


            <p
              className="
                mt-2
                text-gray-600
              "
            >
              Please select another vehicle.
            </p>

          </div>

        )}


        {/* ================================================= */}
        {/* RENTAL PERIOD */}
        {/* ================================================= */}

        {!isFullyRented && (

          <div className="mt-6">

            <h2
              className="
                text-xl
                font-bold
              "
            >
              Select Rental Period
            </h2>


            <div
              className="
                mt-4
                space-y-3
              "
            >

              {/* Daily */}

              <label
                className="
                  block
                "
              >

                <input
                  type="radio"
                  name="period"
                  checked={
                    selectedPeriod ===
                    "daily"
                  }
                  onChange={() => {

                    setSelectedPeriod(
                      "daily"
                    );

                    setError("");

                  }}
                />


                <span className="ml-2">

                  Daily -{" "}

                  {vehicle.prices.daily}

                  {" "}THB

                </span>

              </label>


              {/* 3 Day */}

              <label
                className="
                  block
                "
              >

                <input
                  type="radio"
                  name="period"
                  checked={
                    selectedPeriod ===
                    "threeDay"
                  }
                  onChange={() => {

                    setSelectedPeriod(
                      "threeDay"
                    );

                    setError("");

                  }}
                />


                <span className="ml-2">

                  3-Day -{" "}

                  {vehicle.prices.threeDay}

                  {" "}THB

                </span>

              </label>


              {/* Weekly */}

              <label
                className="
                  block
                "
              >

                <input
                  type="radio"
                  name="period"
                  checked={
                    selectedPeriod ===
                    "weekly"
                  }
                  onChange={() => {

                    setSelectedPeriod(
                      "weekly"
                    );

                    setError("");

                  }}
                />


                <span className="ml-2">

                  Weekly -{" "}

                  {vehicle.prices.weekly}

                  {" "}THB

                </span>

              </label>


              {/* Monthly */}

              <label
                className="
                  block
                "
              >

                <input
                  type="radio"
                  name="period"
                  checked={
                    selectedPeriod ===
                    "monthly"
                  }
                  onChange={() => {

                    setSelectedPeriod(
                      "monthly"
                    );

                    setError("");

                  }}
                />


                <span className="ml-2">

                  Monthly -{" "}

                  {vehicle.prices.monthly}

                  {" "}THB

                </span>

              </label>

            </div>

          </div>

        )}


        {/* ================================================= */}
        {/* START DATE */}
        {/* ================================================= */}

        {!isFullyRented && (

          <div className="mt-6">

            <h2
              className="
                text-xl
                font-bold
              "
            >
              Start Date
            </h2>


            <input
              type="date"
              min={
                new Date()
                  .toISOString()
                  .split("T")[0]
              }
              className="
                mt-2
                w-full
                border
                rounded-lg
                p-3
              "
              value={
                selectedDate
              }
              onChange={(e) => {

                setSelectedDate(
                  e.target.value
                );

                setError("");

              }}
            />

          </div>

        )}


        {/* ================================================= */}
        {/* ERROR */}
        {/* ================================================= */}

        {error && (

          <p
            className="
              mt-4
              text-red-500
              font-medium
            "
          >
            ⚠ {error}
          </p>

        )}


        {/* ================================================= */}
        {/* BOOKING SUMMARY */}
        {/* ================================================= */}

        {!isFullyRented && (

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
              Booking Summary
            </h2>


            <div
              className="
                mt-3
                space-y-2
              "
            >

              <p>

                Vehicle:

                <b>
                  {" "}
                  {vehicle.name}
                </b>

              </p>


              <p>

                Type:

                <b>
                  {" "}
                  {vehicle.type}
                </b>

              </p>


              <p>

                Period:

                <b>
                  {" "}
                  {periodName}
                </b>

              </p>


              <p>

                Start Date:

                <b>
                  {" "}
                  {selectedDate ||
                    "Please select date"}
                </b>

              </p>


              <p
                className="
                  text-2xl
                  text-green-700
                  font-bold
                  mt-4
                "
              >
                Total: {price} THB
              </p>

            </div>

          </div>

        )}


        {/* ================================================= */}
        {/* CONTINUE */}
        {/* ================================================= */}

        {!isFullyRented && (

          <button
            type="button"
            onClick={
              handleContinue
            }
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
            Continue
          </button>

        )}


        {/* ================================================= */}
        {/* FULLY RENTED BUTTON */}
        {/* ================================================= */}

        {isFullyRented && (

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