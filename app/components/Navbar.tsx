"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === "/";
    }

    return pathname.startsWith(path);
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-6xl mx-auto px-4 py-4">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          {/* Logo */}

          <Link
            href="/"
            className="
              text-2xl
              font-bold
              text-green-700
              text-center
              md:text-left
            "
          >
            🚲 BikeGo
          </Link>


          {/* Customer Menu */}

          <div className="flex flex-wrap justify-center gap-2">

            <Link
              href="/"
              className={`
                px-4
                py-2
                rounded-full
                text-sm
                ${
                  isActive("/")
                    ? "bg-green-600 text-white"
                    : "text-gray-700 hover:bg-green-50"
                }
              `}
            >
              Home
            </Link>


            <Link
              href="/bikes"
              className={`
                px-4
                py-2
                rounded-full
                text-sm
                ${
                  isActive("/bikes")
                    ? "bg-green-600 text-white"
                    : "text-gray-700 hover:bg-green-50"
                }
              `}
            >
              Vehicles
            </Link>


            <Link
              href="/cart"
              className={`
                px-4
                py-2
                rounded-full
                text-sm
                ${
                  isActive("/cart")
                    ? "bg-green-600 text-white"
                    : "text-gray-700 hover:bg-green-50"
                }
              `}
            >
              🛒 Cart
            </Link>


            <Link
              href="/booking/success"
              className={`
                px-4
                py-2
                rounded-full
                text-sm
                ${
                  isActive("/booking/success")
                    ? "bg-green-600 text-white"
                    : "text-gray-700 hover:bg-green-50"
                }
              `}
            >
              My Booking
            </Link>


            <Link
              href="/booking/history"
              className={`
                px-4
                py-2
                rounded-full
                text-sm
                ${
                  isActive("/booking/history")
                    ? "bg-green-600 text-white"
                    : "text-gray-700 hover:bg-green-50"
                }
              `}
            >
              History
            </Link>


            <Link
              href="/admin"
              className={`
                px-4
                py-2
                rounded-full
                text-sm
                ${
                  isActive("/admin")
                    ? "bg-gray-900 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }
              `}
            >
              Admin
            </Link>

          </div>

        </div>

      </div>
    </nav>
  );
}