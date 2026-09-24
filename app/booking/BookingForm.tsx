"use client";

import { useState } from "react";
import Link from "next/link";

export default function BookingForm({
  vehicle,
}: any) {


  const [period, setPeriod] = useState("daily");

  const [startDate, setStartDate] = useState("");



  const price =
    period === "daily"
      ? vehicle.prices.daily
      : period === "threeDay"
      ? vehicle.prices.threeDay
      : period === "weekly"
      ? vehicle.prices.weekly
      : vehicle.prices.monthly;



  const periodName =
    period === "daily"
      ? "Daily"
      : period === "threeDay"
      ? "3-Day"
      : period === "weekly"
      ? "Weekly"
      : "Monthly";



  return (

    <main className="min-h-screen bg-green-50 p-8">


      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-lg p-8">


        <h1 className="text-3xl font-bold text-green-700">
          Booking
        </h1>



        {/* Vehicle */}

        <div className="mt-5">

          <h2 className="text-2xl font-bold">
            {vehicle.name}
          </h2>

          <p className="text-gray-500">
            {vehicle.type}
          </p>

        </div>




        {/* Period */}

        <div className="mt-6">


          <h2 className="text-xl font-bold">
            Select Rental Period
          </h2>


          <div className="mt-4 space-y-3">


            <label className="block">

              <input
                type="radio"
                checked={period === "daily"}
                onChange={() => setPeriod("daily")}
              />

              <span className="ml-2">
                Daily - {vehicle.prices.daily} THB
              </span>

            </label>




            <label className="block">

              <input
                type="radio"
                checked={period === "threeDay"}
                onChange={() => setPeriod("threeDay")}
              />

              <span className="ml-2">
                3-Day - {vehicle.prices.threeDay} THB
              </span>

            </label>




            <label className="block">

              <input
                type="radio"
                checked={period === "weekly"}
                onChange={() => setPeriod("weekly")}
              />

              <span className="ml-2">
                Weekly - {vehicle.prices.weekly} THB
              </span>

            </label>




            <label className="block">

              <input
                type="radio"
                checked={period === "monthly"}
                onChange={() => setPeriod("monthly")}
              />

              <span className="ml-2">
                Monthly - {vehicle.prices.monthly} THB
              </span>

            </label>


          </div>


        </div>




        {/* Date */}

        <div className="mt-6">


          <h2 className="text-xl font-bold">
            Start Date
          </h2>


          <input
            type="date"
            className="
            mt-2
            w-full
            border
            rounded-lg
            p-3
            "
            value={startDate}
            onChange={(e)=>setStartDate(e.target.value)}
          />


        </div>





        {/* Summary */}

        <div className="mt-6 bg-green-50 rounded-xl p-5">


          <h2 className="text-xl font-bold">
            Booking Summary
          </h2>



          <div className="mt-3 space-y-2">


            <p>
              Vehicle:
              <b> {vehicle.name}</b>
            </p>


            <p>
              Type:
              <b> {vehicle.type}</b>
            </p>


            <p>
              Period:
              <b> {periodName}</b>
            </p>


            <p>
              Start Date:
              <b>
                {" "}
                {startDate || "Please select date"}
              </b>
            </p>



            <p className="text-2xl text-green-700 font-bold mt-4">

              Total:
              {" "}
              {price} THB

            </p>


          </div>


        </div>





       <Link
href="/verification"
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
</Link>



      </div>


    </main>

  );

}