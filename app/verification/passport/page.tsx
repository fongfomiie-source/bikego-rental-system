"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useBooking } from "../../context/BookingContext";

export default function PassportVerification() {
  const router = useRouter();

  const {
    cart,
    setCustomerType,
    setDocumentType,
    setDocumentImage,
    setDrivingLicenseImage,
  } = useBooking();

  // ตรวจว่ามีรถมอเตอร์ไซค์ในตะกร้าหรือไม่
  const hasMotorcycle = cart.some(
    (item: any) =>
      item.type === "Motorbike" ||
      item.type === "Motorcycle"
  );

  // Passport
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");

  // Driving License
  const [licenseFile, setLicenseFile] =
    useState<File | null>(null);

  const [licensePreview, setLicensePreview] =
    useState("");

  const [error, setError] = useState("");

  // Convert image to Base64
  function convertToBase64(file: File) {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        resolve(reader.result as string);
      };

      reader.onerror = () => {
        reject(new Error("Failed to read file"));
      };

      reader.readAsDataURL(file);
    });
  }

  // Passport upload
  async function handleFile(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const selected = e.target.files?.[0];

    if (!selected) return;

    // ตรวจชนิดไฟล์
    if (!selected.type.startsWith("image/")) {
      setError("Please upload an image file.");
      return;
    }

    try {
      const base64 = await convertToBase64(selected);

      setFile(selected);
      setPreview(base64);
      setError("");
    } catch {
      setError("Unable to read the Passport image.");
    }
  }

  // Driving License upload
  async function handleLicenseFile(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const selected = e.target.files?.[0];

    if (!selected) return;

    // ตรวจชนิดไฟล์
    if (!selected.type.startsWith("image/")) {
      setError("Please upload an image file.");
      return;
    }

    try {
      const base64 = await convertToBase64(selected);

      setLicenseFile(selected);
      setLicensePreview(base64);
      setError("");
    } catch {
      setError(
        "Unable to read the Driving License image."
      );
    }
  }

  // Continue
  function handleContinue() {
    // ต้องมี Passport
    if (!file || !preview) {
      setError("Please upload your Passport.");
      return;
    }

    // ถ้าเป็น Motorbike ต้องมี Driving License
    if (
      hasMotorcycle &&
      (!licenseFile || !licensePreview)
    ) {
      setError("Please upload your Driving License.");
      return;
    }

    // บันทึกข้อมูลลง BookingContext
    setCustomerType("International Customer");

    setDocumentType("Passport");

    setDocumentImage(preview);

    // ถ้ามีใบขับขี่ ให้เก็บ Base64
    // ถ้าไม่ใช่รถมอเตอร์ไซค์ ให้เก็บค่าว่าง
    setDrivingLicenseImage(
      licensePreview || ""
    );

    // ไปหน้า Review
    router.push("/verification/review");
  }

  return (
    <main className="min-h-screen bg-green-50 p-8">
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
          International Customer Verification
        </h1>

        <p className="mt-3 text-gray-600">
          Please upload your Passport
        </p>

        {/* Passport Preview */}

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
              alt="Passport Preview"
              className="
                mx-auto
                max-h-60
                max-w-full
                object-contain
                rounded-lg
              "
            />
          ) : (
            <div className="text-gray-400">
              <div className="text-4xl">
                📷
              </div>

              <p className="mt-2">
                Passport Preview
              </p>
            </div>
          )}
        </div>

        {/* Passport Upload */}

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
                  alt="Driving License Preview"
                  className="
                    mx-auto
                    max-h-60
                    max-w-full
                    object-contain
                    rounded-lg
                  "
                />
              ) : (
                <div className="text-gray-400">
                  <div className="text-4xl">
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
              onChange={handleLicenseFile}
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