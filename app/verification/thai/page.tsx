"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useBooking } from "../../context/BookingContext";

export default function ThaiVerification() {

  const router = useRouter();

  const {
    cart,
    setCustomerType,
    setDocumentType,
    setDocumentImage,
    setDrivingLicenseImage,
  } = useBooking();


  /* =========================
     Uploaded National ID
  ========================= */

  const [file, setFile] =
    useState<File | null>(null);

  const [preview, setPreview] =
    useState("");


  /* =========================
     Uploaded Driving License
  ========================= */

  const [licenseFile, setLicenseFile] =
    useState<File | null>(null);

  const [licensePreview, setLicensePreview] =
    useState("");


  /* =========================
     Error
  ========================= */

  const [error, setError] =
    useState("");


  /* =========================
     Booking Vehicle
  ========================= */

  const [bookingVehicle, setBookingVehicle] =
    useState<any>(null);


  /* =========================
     Load booking selection
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


      if (booking?.vehicle) {

        setBookingVehicle(
          booking.vehicle
        );
      }

    } catch (error) {

      console.error(
        "Failed to read booking selection:",
        error
      );

    }

  }, []);


  /* =========================
     Check Motorcycle
  ========================= */

  const vehicleRequiresLicense =
    bookingVehicle?.requireLicense === true;


  const cartRequiresLicense =
    cart.some(
      (item: any) =>
        item.requireLicense === true ||
        item.type === "Motorbike" ||
        item.type === "Motorcycle"
    );


  const hasMotorcycle =
    vehicleRequiresLicense ||
    cartRequiresLicense;


  /* =========================
     Convert Image To Base64
  ========================= */

  function convertToBase64(
    file: File
  ) {

    return new Promise<string>(
      (resolve, reject) => {

        const reader =
          new FileReader();


        reader.readAsDataURL(file);


        reader.onload = () => {

          resolve(
            reader.result as string
          );

        };


        reader.onerror = (error) => {

          reject(error);

        };

      }
    );
  }


  /* =========================
     National ID Upload
  ========================= */

  function handleFile(
    e: React.ChangeEvent<HTMLInputElement>
  ) {

    const selected =
      e.target.files?.[0];


    if (!selected) {
      return;
    }


    if (
      !selected.type.startsWith(
        "image/"
      )
    ) {

      setError(
        "Please upload an image file."
      );

      return;
    }


    setFile(selected);


    setPreview(
      URL.createObjectURL(
        selected
      )
    );


    setError("");
  }


  /* =========================
     Driving License Upload
  ========================= */

  function handleLicenseFile(
    e: React.ChangeEvent<HTMLInputElement>
  ) {

    const selected =
      e.target.files?.[0];


    if (!selected) {
      return;
    }


    if (
      !selected.type.startsWith(
        "image/"
      )
    ) {

      setError(
        "Please upload an image file."
      );

      return;
    }


    setLicenseFile(
      selected
    );


    setLicensePreview(
      URL.createObjectURL(
        selected
      )
    );


    setError("");
  }


  /* =========================
     Continue
  ========================= */

  async function handleContinue() {

    /* National ID required */

    if (!file) {

      setError(
        "Please upload your National ID Card"
      );

      return;
    }


    /* Driving License required
       for motorcycle */

    if (
      hasMotorcycle &&
      !licenseFile
    ) {

      setError(
        "Please upload your Driving License"
      );

      return;
    }


    try {

      /* Convert National ID */

      const idCardBase64 =
        await convertToBase64(
          file
        );


      /* Convert Driving License */

      let licenseBase64 = "";


      if (licenseFile) {

        licenseBase64 =
          await convertToBase64(
            licenseFile
          );

      }


      /* Save Booking Information */

      setCustomerType(
        "Thai Customer"
      );


      setDocumentType(
        "National ID Card"
      );


      setDocumentImage(
        idCardBase64
      );


      setDrivingLicenseImage(
        licenseBase64
      );


      /* Go to Review */

      router.push(
        "/verification/review"
      );

    } catch (error) {

      console.error(
        "Verification upload error:",
        error
      );


      setError(
        "Unable to process the uploaded image."
      );

    }

  }


  /* =========================
     UI
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

        {/* Title */}

        <h1
          className="
            text-3xl
            font-bold
            text-green-700
          "
        >
          Thai Customer Verification
        </h1>


        <p
          className="
            mt-3
            text-gray-600
          "
        >
          Please upload your National ID Card
        </p>


        {/* National ID Preview */}

        <div
          className="
            mt-6
            border-2
            border-dashed
            rounded-xl
            p-6
            text-center
          "
        >

          {preview ? (

            <img
              src={preview}
              className="
                mx-auto
                max-h-60
                max-w-full
                object-contain
                rounded-lg
              "
              alt="National ID Preview"
            />

          ) : (

            <div
              className="
                text-gray-400
              "
            >

              <div
                className="
                  text-4xl
                "
              >
                📷
              </div>

              <p className="mt-2">
                National ID Preview
              </p>

            </div>

          )}

        </div>


        {/* National ID Upload */}

        <input
          type="file"
          accept="image/*"
          onChange={handleFile}
          className="
            mt-6
            w-full
            border
            p-3
            rounded-lg
          "
        />


        {/* Driving License */}

        {hasMotorcycle && (

          <>

            <p
              className="
                mt-8
                text-gray-600
              "
            >
              Please upload your Driving License
            </p>


            {/* License Preview */}

            <div
              className="
                mt-4
                border-2
                border-dashed
                rounded-xl
                p-6
                text-center
              "
            >

              {licensePreview ? (

                <img
                  src={licensePreview}
                  className="
                    mx-auto
                    max-h-60
                    max-w-full
                    object-contain
                    rounded-lg
                  "
                  alt="Driving License Preview"
                />

              ) : (

                <div
                  className="
                    text-gray-400
                  "
                >

                  <div
                    className="
                      text-4xl
                    "
                  >
                    📷
                  </div>

                  <p className="mt-2">
                    Driving License Preview
                  </p>

                </div>

              )}

            </div>


            {/* License Upload */}

            <input
              type="file"
              accept="image/*"
              onChange={
                handleLicenseFile
              }
              className="
                mt-6
                w-full
                border
                p-3
                rounded-lg
              "
            />

          </>

        )}


        {/* Error */}

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


        {/* Continue */}

        <button
          type="button"
          onClick={handleContinue}
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
          Continue
        </button>

      </div>

    </main>

  );
}