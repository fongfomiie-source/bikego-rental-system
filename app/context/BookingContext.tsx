"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";


/* =========================
   Cart
========================= */

type CartItem = {
  id: string;
  name: string;
  type: string;
  price: number;
  quantity: number;
};


/* =========================
   Unlock Code
========================= */

type UnlockCode = {
  id: string;
  name: string;
  code: string;
};


/* =========================
   Booking Context
========================= */

type BookingContextType = {

  /* Cart */

  cart: CartItem[];

  addToCart: (
    vehicle: CartItem
  ) => void;

  removeFromCart: (
    id: string
  ) => void;

  increaseQuantity: (
    id: string
  ) => void;

  decreaseQuantity: (
    id: string
  ) => void;


  /* Rental */

  startDate: string;

  setStartDate: (
    date: string
  ) => void;

  period: string;

  setPeriod: (
    period: string
  ) => void;


  /* Booking */

  orderId: string;

  setOrderId: (
    id: string
  ) => void;


  /* Payment */

  paymentSlip: string;

  setPaymentSlip: (
    image: string
  ) => void;


  /* Customer Information */

  customerName: string;

  setCustomerName: (
    name: string
  ) => void;

  customerPhone: string;

  setCustomerPhone: (
    phone: string
  ) => void;

  customerType: string;

  setCustomerType: (
    type: string
  ) => void;


  /* Identity Verification */

  documentType: string;

  setDocumentType: (
    type: string
  ) => void;

  documentImage: string;

  setDocumentImage: (
    image: string
  ) => void;

  drivingLicenseImage: string;

  setDrivingLicenseImage: (
    image: string
  ) => void;


  /* Unlock */

  unlockCodes: UnlockCode[];

  setUnlockCodes: (
    codes: UnlockCode[]
  ) => void;


  /* Status */

  bookingStatus: string;

  setBookingStatus: (
    status: string
  ) => void;


  /* Clear */

  clearBooking: () => void;

};


/* =========================
   Context
========================= */

const BookingContext =
  createContext<BookingContextType | null>(
    null
  );


/* =========================
   Provider
========================= */

export function BookingProvider({
  children,
}: {
  children: ReactNode;
}) {

  /* Cart */

  const [cart, setCart] =
    useState<CartItem[]>([]);


  /* Rental */

  const [startDate, setStartDate] =
    useState("");

  const [period, setPeriod] =
    useState("daily");


  /* Booking */

  const [orderId, setOrderId] =
    useState("");


  /* Payment */

  const [paymentSlip, setPaymentSlip] =
    useState("");


  /* Customer */

  const [customerName, setCustomerName] =
    useState("");

  const [customerPhone, setCustomerPhone] =
    useState("");

  const [customerType, setCustomerType] =
    useState("");


  /* Identity */

  const [documentType, setDocumentType] =
    useState("");

  const [documentImage, setDocumentImage] =
    useState("");

  const [
    drivingLicenseImage,
    setDrivingLicenseImage,
  ] = useState("");


  /* Unlock Codes */

  const [unlockCodes, setUnlockCodes] =
    useState<UnlockCode[]>([]);


  /* Booking Status */

  const [bookingStatus, setBookingStatus] =
    useState(
      "Pending Verification"
    );


  /* Clear Booking */

  function clearBooking() {

    setCart([]);

    setStartDate("");

    setPeriod("daily");

    setOrderId("");

    setPaymentSlip("");

    setCustomerName("");

    setCustomerPhone("");

    setCustomerType("");

    setDocumentType("");

    setDocumentImage("");

    setDrivingLicenseImage("");

    setUnlockCodes([]);

    setBookingStatus(
      "Pending Verification"
    );
  }


  /* Add To Cart */

  function addToCart(
    vehicle: CartItem
  ) {

    setCart((current) => {

      const exist =
        current.find(
          (item) =>
            item.id === vehicle.id
        );


      if (exist) {

        return current.map(
          (item) =>

            item.id === vehicle.id

              ? {
                  ...item,
                  quantity:
                    item.quantity + 1,
                }

              : item
        );
      }


      return [
        ...current,

        {
          ...vehicle,
          quantity: 1,
        },
      ];
    });
  }


  /* Remove From Cart */

  function removeFromCart(
    id: string
  ) {

    setCart((current) =>
      current.filter(
        (item) =>
          item.id !== id
      )
    );
  }


  /* Increase Quantity */

  function increaseQuantity(
    id: string
  ) {

    setCart((current) =>

      current.map(
        (item) =>

          item.id === id

            ? {
                ...item,
                quantity:
                  item.quantity + 1,
              }

            : item
      )
    );
  }


  /* Decrease Quantity */

  function decreaseQuantity(
    id: string
  ) {

    setCart((current) =>

      current.map(
        (item) =>

          item.id === id &&
          item.quantity > 1

            ? {
                ...item,
                quantity:
                  item.quantity - 1,
              }

            : item
      )
    );
  }


  /* Provider */

  return (

    <BookingContext.Provider
      value={{

        cart,

        addToCart,

        removeFromCart,

        increaseQuantity,

        decreaseQuantity,


        startDate,

        setStartDate,

        period,

        setPeriod,


        orderId,

        setOrderId,


        paymentSlip,

        setPaymentSlip,


        customerName,

        setCustomerName,

        customerPhone,

        setCustomerPhone,

        customerType,

        setCustomerType,


        documentType,

        setDocumentType,

        documentImage,

        setDocumentImage,

        drivingLicenseImage,

        setDrivingLicenseImage,


        unlockCodes,

        setUnlockCodes,


        bookingStatus,

        setBookingStatus,


        clearBooking,

      }}
    >

      {children}

    </BookingContext.Provider>
  );
}


/* =========================
   Hook
========================= */

export function useBooking() {

  const context =
    useContext(
      BookingContext
    );


  if (!context) {

    throw new Error(
      "useBooking must be used inside BookingProvider"
    );
  }


  return context;
}