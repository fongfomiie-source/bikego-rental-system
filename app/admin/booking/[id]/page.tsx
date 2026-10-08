"use client";



import { useEffect, useState } from "react";

import { useParams } from "next/navigation";

import { vehicles } from "../../../../data/vehicles";



type AssignedUnit = {

  itemId: string;

  vehicleId: string;

  vehicleName: string;

  unitId: string;

  code: string;

};



export default function AdminBookingDetail() {

  const params = useParams();

  const id = params.id as string;



  const [booking, setBooking] = useState<any>(null);



  const [showApprove, setShowApprove] = useState(false);

  const [showReject, setShowReject] = useState(false);



  const [rejectReason, setRejectReason] = useState("");



  const [selectedUnits, setSelectedUnits] = useState<

    Record<string, string[]>

  >({});



  const [error, setError] = useState("");



  /*

   * LOAD BOOKING

   */

  useEffect(() => {

    const data = localStorage.getItem("bookings");



    if (!data) {

      return;

    }



    try {

      const bookings = JSON.parse(data);



      const found = bookings.find(

        (item: any) => item.orderId === id

      );



      if (!found) {

        return;

      }



      setBooking(found);



      /*

       * Load previously assigned units

       */

      if (Array.isArray(found.assignedUnits)) {

        const initialSelection: Record<string, string[]> = {};



        found.assignedUnits.forEach(

          (unit: AssignedUnit) => {

            if (!initialSelection[unit.itemId]) {

              initialSelection[unit.itemId] = [];

            }



            initialSelection[unit.itemId].push(unit.unitId);

          }

        );



        setSelectedUnits(initialSelection);

      } else if (found.selectedUnits) {

        setSelectedUnits(found.selectedUnits);

      }

    } catch (err) {

      console.error("Failed to load booking:", err);

    }

  }, [id]);



  /*

   * GENERATE UNLOCK CODE

   */

  function generateCode() {

    return Math.floor(

      100000 + Math.random() * 900000

    ).toString();

  }



  /*

   * GET BOOKINGS

   */

  function getBookings() {

    const data = localStorage.getItem("bookings");



    if (!data) {

      return [];

    }



    try {

      return JSON.parse(data);

    } catch {

      return [];

    }

  }



  /*

   * SAVE BOOKINGS

   */

  function saveBooking(updated: any[]) {

    localStorage.setItem(

      "bookings",

      JSON.stringify(updated)

    );



    const current = updated.find(

      (item: any) => item.orderId === id

    );



    setBooking(current);

  }



  /*

   * CHECK WHETHER PHYSICAL VEHICLE

   * IS ALREADY BOOKED

   */

  function isUnitUnavailable(unitId: string) {

    const bookings = getBookings();



    return bookings.some((item: any) => {

      /*

       * Ignore current booking

       */

      if (item.orderId === id) {

        return false;

      }



      /*

       * Returned bookings release the vehicle

       */

      if (

        item.status === "Returned" ||

        item.status === "Rejected"

      ) {

        return false;

      }



      /*

       * Only approved bookings block vehicles

       */

      if (item.status !== "Approved") {

        return false;

      }



      /*

       * New physical-unit structure

       */

      if (Array.isArray(item.assignedUnits)) {

        /*

         * If this specific unit was returned,

         * it is available again.

         */

        const returnedUnits =

          Array.isArray(item.returnedUnits)

            ? item.returnedUnits

            : [];



        return item.assignedUnits.some(

          (assigned: AssignedUnit) =>

            assigned.unitId === unitId &&

            !returnedUnits.includes(

              assigned.unitId

            )

        );

      }



      return false;

    });

  }



  /*

   * SELECT / UNSELECT VEHICLE

   */

  function toggleUnit(

    itemId: string,

    unitId: string,

    quantity: number

  ) {

    setError("");



    setSelectedUnits((current) => {

      const currentUnits =

        current[itemId] || [];



      /*

       * Remove selected vehicle

       */

      if (currentUnits.includes(unitId)) {

        return {

          ...current,

          [itemId]: currentUnits.filter(

            (existingId) =>

              existingId !== unitId

          ),

        };

      }



      /*

       * Do not select more than quantity

       */

      if (currentUnits.length >= quantity) {

        setError(

          `This booking requires only ${quantity} vehicle(s).`

        );



        return current;

      }



      /*

       * Add vehicle

       */

      return {

        ...current,

        [itemId]: [

          ...currentUnits,

          unitId,

        ],

      };

    });

  }



  /*

   * VALIDATE VEHICLE ASSIGNMENT

   */

  function validateAssignment() {

    if (!booking?.cart) {

      return false;

    }



    for (const item of booking.cart) {

      const selected =

        selectedUnits[item.id] || [];



      if (selected.length < item.quantity) {

        setError(

          `Please assign ${item.quantity} vehicle(s) for ${item.name}.`

        );



        return false;

      }

    }



    setError("");



    return true;

  }



  /*

   * SAVE VEHICLE ASSIGNMENT

   */

  function saveVehicleAssignment() {

    if (!booking) {

      return;

    }



    const bookings = getBookings();



    if (!bookings.length) {

      return;

    }



    const updated = bookings.map(

      (item: any) => {

        if (item.orderId !== id) {

          return item;

        }



        return {

          ...item,

          selectedUnits,

        };

      }

    );



    saveBooking(updated);



    alert("Vehicle assignment saved.");

  }



  /*

   * APPROVE BOOKING

   */

  function handleApprove() {

    setError("");



    if (!validateAssignment()) {

      return;

    }



    const bookings = getBookings();



    if (!bookings.length) {

      return;

    }



    const assignedUnits: AssignedUnit[] = [];

    const unlockCodes: AssignedUnit[] = [];



    /*

     * Create physical assignment

     * and individual unlock code

     */

    booking.cart.forEach(

      (item: any) => {

        const vehicle = vehicles.find(

          (v: any) =>

            v.id === item.id

        );



        if (!vehicle) {

          return;

        }



        const unitIds =

          selectedUnits[item.id] || [];



        unitIds.forEach(

          (unitId: string) => {

            const code =

              generateCode();



            const assignment: AssignedUnit =

              {

                itemId: item.id,

                vehicleId: vehicle.id,

                vehicleName:

                  vehicle.name,

                unitId,

                code,

              };



            assignedUnits.push(

              assignment

            );



            unlockCodes.push(

              assignment

            );

          }

        );

      }

    );



    const updated = bookings.map(

      (item: any) => {

        if (item.orderId !== id) {

          return item;

        }



        return {

          ...item,



          status: "Approved",



          assignedUnits,



          unlockCodes,



          /*

           * No vehicle has been returned yet

           */

          returnedUnits: [],



          /*

           * Keep old unlockCode

           * for compatibility

           */

          unlockCode:

            unlockCodes[0]?.code ||

            item.unlockCode,

        };

      }

    );



    saveBooking(updated);



    setShowApprove(false);

  }



  /*

   * REJECT BOOKING

   */

  function handleReject() {

    if (!rejectReason.trim()) {

      alert(

        "Please enter reject reason"

      );



      return;

    }



    const bookings = getBookings();



    if (!bookings.length) {

      return;

    }



    const updated = bookings.map(

      (item: any) => {

        if (item.orderId !== id) {

          return item;

        }



        return {

          ...item,



          status: "Rejected",



          rejectReason:

            rejectReason,

        };

      }

    );



    saveBooking(updated);



    setRejectReason("");



    setShowReject(false);

  }



  /*

   * RETURN ONE PHYSICAL VEHICLE

   */

  function handleReturnVehicle(

    unitId: string

  ) {

    if (!booking) {

      return;

    }



    const bookings = getBookings();



    if (!bookings.length) {

      return;

    }



    const currentReturnedUnits =

      Array.isArray(

        booking.returnedUnits

      )

        ? booking.returnedUnits

        : [];



    /*

     * Already returned

     */

    if (

      currentReturnedUnits.includes(

        unitId

      )

    ) {

      return;

    }



    const newReturnedUnits = [

      ...currentReturnedUnits,

      unitId,

    ];



    const assignedUnits =

      Array.isArray(

        booking.assignedUnits

      )

        ? booking.assignedUnits

        : [];



    /*

     * Check whether all vehicles

     * in this booking have been returned

     */

    const allReturned =

      assignedUnits.length > 0 &&

      assignedUnits.every(

        (unit: AssignedUnit) =>

          newReturnedUnits.includes(

            unit.unitId

          )

      );



    const updated = bookings.map(

      (item: any) => {

        if (item.orderId !== id) {

          return item;

        }



        return {

          ...item,



          /*

           * If every vehicle is returned,

           * booking becomes Returned.

           *

           * Otherwise it stays Approved.

           */

          status: allReturned

            ? "Returned"

            : "Approved",



          returnedUnits:

            newReturnedUnits,



          /*

           * Save return time for audit

           */

          returnedAt: {

            ...(item.returnedAt || {}),

            [unitId]:

              new Date().toISOString(),

          },

        };

      }

    );



    saveBooking(updated);



    alert(

      `Vehicle ${unitId} returned successfully.`

    );

  }



  /*

   * BOOKING NOT FOUND

   */

  if (!booking) {

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

            max-w-xl

            mx-auto

            bg-white

            rounded-xl

            p-8

          "

        >

          <h1

            className="

              font-bold

              text-xl

            "

          >

            Booking not found

          </h1>

        </div>

      </main>

    );

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

          Booking Detail

        </h1>



        {/* BOOKING INFORMATION */}



        <div

          className="

            mt-6

            space-y-3

          "

        >

          <p>

            Booking ID:

            <b>

              {" "}

              {booking.orderId}

            </b>

          </p>



          <p>

            Status:



            <span

              className={

                booking.status ===

                "Approved"

                  ? "ml-2 text-green-600 font-bold"

                  : booking.status ===

                    "Rejected"

                  ? "ml-2 text-red-600 font-bold"

                  : booking.status ===

                    "Returned"

                  ? "ml-2 text-blue-600 font-bold"

                  : "ml-2 text-yellow-600 font-bold"

              }

            >

              {booking.status}

            </span>

          </p>



          <p>

            Customer Type:

            <b>

              {" "}

              {booking.customerType}

            </b>

          </p>



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



          {booking.status ===

            "Approved" &&

            Array.isArray(

              booking.assignedUnits

            ) && (

              <p>

                Returned:

                <b>

                  {" "}

                  {

                    Array.isArray(

                      booking.returnedUnits

                    )

                      ? booking

                          .returnedUnits

                          .length

                      : 0

                  }

                  /

                  {

                    booking

                      .assignedUnits

                      .length

                  }

                </b>

              </p>

            )}

        </div>



        <hr

          className="

            my-8

          "

        />



        {/* VEHICLE */}



        <h2

          className="

            text-xl

            font-bold

          "

        >

          Vehicle

        </h2>



        <div

          className="

            mt-4

            space-y-6

          "

        >

          {booking.cart?.map(

            (item: any) => {

              const vehicle =

                vehicles.find(

                  (v: any) =>

                    v.id === item.id

                );



              const selected =

                selectedUnits[

                  item.id

                ] || [];



              const assignedForItem =

                Array.isArray(

                  booking.assignedUnits

                )

                  ? booking.assignedUnits.filter(

                      (

                        unit: AssignedUnit

                      ) =>

                        unit.itemId ===

                        item.id

                    )

                  : [];



              return (

                <div

                  key={item.id}

                  className="

                    border

                    rounded-xl

                    p-5

                  "

                >

                  <p

                    className="

                      text-green-700

                      font-bold

                      text-lg

                    "

                  >

                    🏍️ {item.name} x

                    {item.quantity}

                  </p>



                  {/* ASSIGN VEHICLE */}



                  {booking.status ===

                    "Pending Verification" &&

                    vehicle && (

                      <div className="mt-5">

                        <p

                          className="

                            font-bold

                          "

                        >

                          Assign Vehicle

                        </p>



                        <p

                          className="

                            mt-1

                            text-sm

                            text-gray-500

                          "

                        >

                          Select{" "}

                          {item.quantity}{" "}

                          vehicle(s) for

                          this booking.

                        </p>



                        <div

                          className="

                            mt-4

                            grid

                            grid-cols-1

                            sm:grid-cols-3

                            gap-3

                          "

                        >

                          {vehicle.units?.map(

                            (unit: any) => {

                              const unavailable =

                                isUnitUnavailable(

                                  unit.id

                                );



                              const selectedUnit =

                                selected.includes(

                                  unit.id

                                );



                              return (

                                <button

                                  key={`${item.id}-${unit.id}`}

                                  type="button"

                                  disabled={

                                    unavailable

                                  }

                                  onClick={() =>

                                    toggleUnit(

                                      item.id,

                                      unit.id,

                                      item.quantity

                                    )

                                  }

                                  className={`

                                    border

                                    rounded-xl

                                    p-4

                                    text-left

                                    transition



                                    ${

                                      unavailable

                                        ? "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"

                                        : selectedUnit

                                        ? "border-green-500 bg-green-50 text-green-700"

                                        : "border-gray-300 hover:border-green-500 hover:bg-green-50"

                                    }

                                  `}

                                >

                                  <p

                                    className="

                                      font-bold

                                    "

                                  >

                                    {selectedUnit

                                      ? "✓ "

                                      : ""}

                                    {

                                      unit.id

                                    }

                                  </p>



                                  <p

                                    className="

                                      text-sm

                                      mt-1

                                    "

                                  >

                                    {unavailable

                                      ? "Booked"

                                      : selectedUnit

                                      ? "Selected"

                                      : "Available"}

                                  </p>

                                </button>

                              );

                            }

                          )}

                        </div>



                        <p

                          className="

                            mt-4

                            font-bold

                          "

                        >

                          Selected:



                          <span className="text-green-700 ml-2">

                            {selected.length

                              ? selected.join(

                                  ", "

                                )

                              : "None"}

                          </span>

                        </p>



                        <button

                          type="button"

                          onClick={

                            saveVehicleAssignment

                          }

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

                          Save Vehicle

                          Assignment

                        </button>

                      </div>

                    )}



                  {/* ASSIGNED VEHICLE */}



                  {booking.status ===

                    "Approved" &&

                    assignedForItem.length >

                      0 && (

                      <div

                        className="

                          mt-5

                          bg-green-50

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



                        {assignedForItem.map(

                          (

                            unit: AssignedUnit,

                            index: number

                          ) => {

                            const returned =

                              Array.isArray(

                                booking.returnedUnits

                              ) &&

                              booking.returnedUnits.includes(

                                unit.unitId

                              );



                            return (

                              <div

                                key={`${unit.itemId}-${unit.unitId}-${index}`}

                                className="

                                  mt-3

                                  text-green-700

                                "

                              >

                                🏍️{" "}

                                {

                                  unit.vehicleName

                                }



                                <br />



                                🚲 Vehicle No.:{" "}

                                <b>

                                  {

                                    unit.unitId

                                  }

                                </b>



                                <br />



                                {returned ? (

                                  <span

                                    className="

                                      text-blue-600

                                      font-bold

                                    "

                                  >

                                    ✓ Vehicle

                                    Returned

                                  </span>

                                ) : (

                                  <span

                                    className="

                                      text-green-700

                                      font-bold

                                    "

                                  >

                                    Vehicle

                                    Active

                                  </span>

                                )}

                              </div>

                            );

                          }

                        )}

                      </div>

                    )}



                  {/* RETURNED VEHICLES */}



                  {booking.status ===

                    "Returned" &&

                    assignedForItem.length >

                      0 && (

                      <div

                        className="

                          mt-5

                          bg-blue-50

                          rounded-xl

                          p-4

                        "

                      >

                        <p

                          className="

                            font-bold

                            text-blue-700

                          "

                        >

                          Returned Vehicle

                        </p>



                        {assignedForItem.map(

                          (

                            unit: AssignedUnit,

                            index: number

                          ) => (

                            <div

                              key={`${unit.itemId}-${unit.unitId}-returned-${index}`}

                              className="

                                mt-3

                                text-blue-700

                                font-bold

                              "

                            >

                              🏍️{" "}

                              {

                                unit.vehicleName

                              }



                              <br />



                              🚲 Vehicle No.:{" "}

                              {unit.unitId}

                            </div>

                          )

                        )}

                      </div>

                    )}

                </div>

              );

            }

          )}

        </div>



        <hr

          className="

            my-8

          "

        />



        {/* DOCUMENT VERIFICATION */}



        <h2

          className="

            text-xl

            font-bold

          "

        >

          Document Verification

        </h2>



        <div

          className="

            mt-5

            space-y-6

          "

        >

          <div>

            <p

              className="

                text-gray-500

              "

            >

              ID / Passport

            </p>



            {booking.documentImage && (

              <img

                src={

                  booking.documentImage

                }

                className="

                  mt-2

                  max-h-60

                  rounded-xl

                  object-contain

                "

                alt="ID or Passport"

              />

            )}

          </div>



          {booking.drivingLicenseImage && (

            <div>

              <p

                className="

                  text-gray-500

                "

              >

                Driving License

              </p>



              <img

                src={

                  booking.drivingLicenseImage

                }

                className="

                  mt-2

                  max-h-60

                  rounded-xl

                  object-contain

                "

                alt="Driving License"

              />

            </div>

          )}

        </div>



        <hr

          className="

            my-8

          "

        />



        {/* PAYMENT */}



        <h2

          className="

            text-xl

            font-bold

          "

        >

          Payment Verification

        </h2>



        {booking.paymentSlip && (

          <img

            src={

              booking.paymentSlip

            }

            className="

              mt-4

              max-h-60

              rounded-xl

              object-contain

            "

            alt="Payment Slip"

          />

        )}



        {/* UNLOCK CODES */}



        {(booking.status ===

          "Approved" ||

          booking.status ===

            "Returned") &&

          Array.isArray(

            booking.unlockCodes

          ) &&

          booking.unlockCodes.length >

            0 && (

            <div

              className="

                mt-8

                bg-green-50

                rounded-xl

                p-5

              "

            >

              <h2

                className="

                  font-bold

                  text-xl

                "

              >

                Vehicle Unlock Code

              </h2>



              <div

                className="

                  mt-4

                  space-y-4

                "

              >

                {booking.unlockCodes.map(

                  (

                    unit: AssignedUnit,

                    index: number

                  ) => {

                    const returned =

                      Array.isArray(

                        booking.returnedUnits

                      ) &&

                      booking.returnedUnits.includes(

                        unit.unitId

                      );



                    return (

                      <div

                        key={`${unit.itemId}-${unit.unitId}-code-${index}`}

                        className="

                          bg-white

                          rounded-xl

                          p-4

                        "

                      >

                        <div

                          className="

                            text-green-700

                            font-bold

                            text-lg

                          "

                        >

                          🏍️{" "}

                          {unit.vehicleName}



                          <br />



                          🚲 Vehicle:{" "}

                          {unit.unitId}



                          <br />



                          🔑 Code:{" "}

                          {unit.code}

                        </div>



                        {!returned &&

                          booking.status ===

                            "Approved" && (

                            <button

                              type="button"

                              onClick={() =>

                                handleReturnVehicle(

                                  unit.unitId

                                )

                              }

                              className="

                                mt-4

                                w-full

                                bg-blue-600

                                text-white

                                py-3

                                rounded-full

                                hover:bg-blue-700

                              "

                            >

                              Return{" "}

                              {unit.unitId}

                            </button>

                          )}



                        {returned && (

                          <div

                            className="

                              mt-4

                              text-blue-600

                              font-bold

                            "

                          >

                            ✓ Vehicle Returned

                          </div>

                        )}

                      </div>

                    );

                  }

                )}

              </div>

            </div>

          )}



        {/* OLD BOOKING COMPATIBILITY */}



        {booking.status ===

          "Approved" &&

          booking.unlockCode &&

          !booking.unlockCodes?.length && (

            <div

              className="

                mt-8

                bg-green-50

                rounded-xl

                p-5

              "

            >

              <h2

                className="

                  font-bold

                  text-xl

                "

              >

                Vehicle Unlock Code

              </h2>



              <p

                className="

                  mt-3

                  text-green-700

                  font-bold

                  text-lg

                "

              >

                🔑 Code:{" "}

                {booking.unlockCode}

              </p>

            </div>

          )}



        {/* REJECT REASON */}



        {booking.status ===

          "Rejected" && (

          <div

            className="

              mt-6

              bg-red-50

              rounded-xl

              p-5

            "

          >

            <h2

              className="

                font-bold

                text-red-600

              "

            >

              Reject Reason

            </h2>



            <p

              className="

                mt-2

              "

            >

              {booking.rejectReason}

            </p>

          </div>

        )}



        {/* ERROR */}



        {error && (

          <div

            className="

              mt-6

              bg-red-50

              text-red-600

              rounded-xl

              p-4

              font-medium

            "

          >

            ⚠️ {error}

          </div>

        )}



        {/* ACTION BUTTONS */}



        {booking.status ===

          "Pending Verification" && (

          <div

            className="

              mt-8

              flex

              gap-4

            "

          >

            <button

              type="button"

              onClick={() => {

                setError("");



                if (

                  validateAssignment()

                ) {

                  setShowApprove(

                    true

                  );

                }

              }}

              className="

                flex-1

                bg-green-600

                text-white

                py-3

                rounded-full

              "

            >

              Approve Booking

            </button>



            <button

              type="button"

              onClick={() =>

                setShowReject(true)

              }

              className="

                flex-1

                bg-red-500

                text-white

                py-3

                rounded-full

              "

            >

              Reject

            </button>

          </div>

        )}



        {/* APPROVE CONFIRMATION */}



        {showApprove && (

          <div

            className="

              mt-6

              bg-green-50

              rounded-xl

              p-5

            "

          >

            <h3

              className="

                font-bold

                text-lg

              "

            >

              Confirm Approval?

            </h3>



            <p

              className="

                mt-2

              "

            >

              The selected vehicle will

              be assigned to this

              customer and an unlock

              code will be generated.

            </p>



            <div

              className="

                mt-4

                space-y-2

              "

            >

              {booking.cart?.map(

                (item: any) => {

                  const selected =

                    selectedUnits[

                      item.id

                    ] || [];



                  return (

                    <p

                      key={item.id}

                      className="

                        font-bold

                        text-green-700

                      "

                    >

                      🏍️{" "}

                      {item.name}:{" "}

                      {selected.join(

                        ", "

                      )}

                    </p>

                  );

                }

              )}

            </div>



            <button

              type="button"

              onClick={

                handleApprove

              }

              className="

                mt-4

                w-full

                bg-green-600

                text-white

                py-3

                rounded-full

              "

            >

              Confirm Approve

            </button>

          </div>

        )}



        {/* REJECT FORM */}



        {showReject && (

          <div

            className="

              mt-6

              bg-red-50

              rounded-xl

              p-5

            "

          >

            <h3

              className="

                font-bold

                text-lg

                text-red-600

              "

            >

              Reject Booking

            </h3>



            <textarea

              value={rejectReason}

              onChange={(e) =>

                setRejectReason(

                  e.target.value

                )

              }

              placeholder="Reason for rejection"

              className="

                mt-3

                w-full

                border

                rounded-lg

                p-3

              "

              rows={4}

            />



            <button

              type="button"

              onClick={

                handleReject

              }

              className="

                mt-4

                w-full

                bg-red-600

                text-white

                py-3

                rounded-full

              "

            >

              Confirm Reject

            </button>

          </div>

        )}

      </div>

    </main>

  );

}