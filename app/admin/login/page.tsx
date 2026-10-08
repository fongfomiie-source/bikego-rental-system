"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleLogin() {
    setError("");

    if (
      username === "admin" &&
      password === "1234"
    ) {
      sessionStorage.setItem(
        "bikego_admin",
        "true"
      );

      router.replace("/admin");
      return;
    }

    setError(
      "Invalid username or password."
    );
  }

  return (
    <main
      className="
        min-h-screen
        bg-green-50
        flex
        items-center
        justify-center
        p-6
      "
    >

      <div
        className="
          w-full
          max-w-md
          bg-white
          rounded-2xl
          shadow-lg
          p-8
        "
      >

        {/* Logo */}

        <div className="text-center">

          <div className="text-5xl">
            🚲
          </div>

          <h1
            className="
              mt-3
              text-3xl
              font-bold
              text-green-700
            "
          >
            BikeGo
          </h1>

          <p
            className="
              mt-2
              text-gray-600
            "
          >
            Admin Login
          </p>

        </div>


        {/* Username */}

        <div className="mt-8">

          <label
            className="
              block
              font-bold
              text-gray-700
              mb-2
            "
          >
            Username
          </label>

          <input
            type="text"
            value={username}
            onChange={(e) =>
              setUsername(e.target.value)
            }
            placeholder="Enter username"
            className="
              w-full
              border
              border-gray-300
              rounded-xl
              px-4
              py-3
              outline-none
              focus:border-green-600
            "
          />

        </div>


        {/* Password */}

        <div className="mt-5">

          <label
            className="
              block
              font-bold
              text-gray-700
              mb-2
            "
          >
            Password
          </label>

          <input
            type="password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            placeholder="Enter password"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleLogin();
              }
            }}
            className="
              w-full
              border
              border-gray-300
              rounded-xl
              px-4
              py-3
              outline-none
              focus:border-green-600
            "
          />

        </div>


        {/* Error */}

        {error && (
          <div
            className="
              mt-5
              bg-red-50
              border
              border-red-200
              text-red-600
              rounded-xl
              p-4
            "
          >
            {error}
          </div>
        )}


        {/* Login */}

        <button
          type="button"
          onClick={handleLogin}
          className="
            mt-6
            w-full
            bg-green-600
            text-white
            py-4
            rounded-full
            hover:bg-green-700
          "
        >
          Login
        </button>


        {/* Back */}

        <button
          type="button"
          onClick={() =>
            router.push("/")
          }
          className="
            mt-3
            w-full
            border
            border-green-600
            text-green-700
            py-4
            rounded-full
            hover:bg-green-50
          "
        >
          Back to Home
        </button>


        {/* Demo Information */}

        <div
          className="
            mt-6
            bg-gray-50
            rounded-xl
            p-4
            text-sm
            text-gray-600
          "
        >

          <p className="font-bold">
            Demo Admin Account
          </p>

          <p className="mt-1">
            Username: admin
          </p>

          <p>
            Password: 1234
          </p>

        </div>

      </div>

    </main>
  );
}