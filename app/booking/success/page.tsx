"use client";

import Link from "next/link";
import { useBooking } from "../../context/BookingContext";

export default function SuccessPage() {
  const {
    cart,
    period,
    startDate,
    unlockCodes,
    orderId,
    clearBooking,
  } = useBooking();

  const getPrice = (price: number) => {
    if (period === "threeDay") {
      return price * 2.6;
    }

    if (period === "weekly") {
      return price * 6;
    }

    if (period === "monthly") {
      return price * 20;
    }

    return price;
  };

  const total = cart.reduce(
    (sum, item) =>
      sum + getPrice(item.price) * item.quantity,
    0
  );

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

        {/* ========================= */}
        {/* TITLE */}
        {/* ========================= */}

        <h1
          className="
            text-3xl
            font-bold
            text-green-700
            text-center
          "
        >
          Booking Confirmed
        </h1>

        <p
          className="
            mt-3
            text-gray-600
            text-center
          "
        >
          Your rental has been confirmed
        </p>


        {/* ========================= */}
        {/* BOOKING INFORMATION */}
        {/* ========================= */}

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
              {orderId || "-"}
            </b>
          </p>

          <p>
            Rental Period:

            <b>
              {" "}
              {period === "daily"
                ? "Daily"
                : period === "threeDay"
                ? "3 Days"
                : period === "weekly"
                ? "Weekly"
                : "Monthly"}
            </b>
          </p>

          <p>
            Start Date:

            <b>
              {" "}
              {startDate || "-"}
            </b>
          </p>

          <p>
            Status:

            <span
              className="
                text-green-600
                font-bold
              "
            >
              {" "}
              Confirmed
            </span>
          </p>

        </div>


        {/* ========================= */}
        {/* VEHICLE UNLOCK CODE */}
        {/* ========================= */}

        {unlockCodes?.length > 0 && (
          <div className="mt-6">

            <h2
              className="
                text-xl
                font-bold
              "
            >
              Vehicle Unlock Code
            </h2>


            <div className="mt-4 space-y-4">

              {unlockCodes.map(
                (item, index) => {

                  /*
                   * รองรับข้อมูลใหม่จาก Admin
                   *
                   * vehicleName = ชื่อรุ่นรถ
                   * unitId      = หมายเลขรถจริง
                   *
                   * และรองรับข้อมูลเก่า
                   *
                   * name = ชื่อรุ่นรถ
                   * id   = หมายเลขรถ
                   */

                  const vehicleName =
                    (item as any).vehicleName ||
                    (item as any).name ||
                    "-";

                  const vehicleUnit =
                    (item as any).unitId ||
                    (item as any).id ||
                    "-";

                  const code =
                    (item as any).code ||
                    "-";

                  return (
                    <div
                      key={
                        vehicleUnit !== "-"
                          ? vehicleUnit
                          : `unlock-${index}`
                      }
                      className="
                        border
                        rounded-xl
                        p-4
                        bg-green-50
                      "
                    >

                      <p
                        className="
                          text-green-700
                          font-bold
                          text-lg
                        "
                      >
                        🏍️ {vehicleName}
                      </p>


                      <p
                        className="
                          mt-1
                          text-green-700
                          font-bold
                        "
                      >
                        Vehicle:
                        {" "}
                        {vehicleUnit}
                      </p>


                      <p
                        className="
                          mt-3
                          text-4xl
                          font-bold
                          text-green-700
                        "
                      >
                        {code}
                      </p>

                    </div>
                  );
                }
              )}

            </div>

          </div>
        )}


        {/* ========================= */}
        {/* PRICE SUMMARY */}
        {/* ========================= */}

        <div className="mt-6">

          <h2
            className="
              text-xl
              font-bold
            "
          >
            Payment Summary
          </h2>


          {cart.map((item) => (

            <div
              key={item.id}
              className="
                mt-3
                border
                rounded-xl
                p-4
                flex
                justify-between
              "
            >

              <div>

                <p
                  className="
                    font-bold
                  "
                >
                  {item.name}
                </p>

                <p>
                  Qty:
                  {" "}
                  {item.quantity}
                </p>

              </div>


              <p
                className="
                  font-bold
                  text-green-700
                "
              >
                {(
                  getPrice(item.price) *
                  item.quantity
                ).toFixed(0)}

                {" "}
                THB
              </p>

            </div>

          ))}


          <div
            className="
              mt-6
              text-center
            "
          >

            <p
              className="
                text-gray-500
              "
            >
              Total Amount
            </p>

            <p
              className="
                text-3xl
                font-bold
                text-green-700
              "
            >
              {total.toFixed(0)}
              {" "}
              THB
            </p>

          </div>

        </div>


        {/* ========================= */}
        {/* NOTE */}
        {/* ========================= */}

        <p
          className="
            mt-6
            text-gray-600
            text-center
          "
        >
          Please use each code for the correct vehicle
        </p>


        {/* ========================= */}
        {/* BUTTONS */}
        {/* ========================= */}

        <div
          className="
            mt-8
            space-y-3
          "
        >

          <button
            onClick={() => {
              clearBooking();
              window.location.href = "/";
            }}
            className="
              block
              w-full
              bg-green-600
              text-white
              py-4
              rounded-full
              hover:bg-green-700
            "
          >
            Back to Home
          </button>


          <button
            onClick={() => {
              clearBooking();
              window.location.href = "/bikes";
            }}
            className="
              block
              w-full
              border
              border-green-600
              text-green-700
              py-4
              rounded-full
              hover:bg-green-50
            "
          >
            New Booking
          </button>

        </div>

      </div>
    </main>
  );
}