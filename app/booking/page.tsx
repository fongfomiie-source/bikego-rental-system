import { vehicles } from "@/data/vehicles";
import BookingForm from "./BookingForm";


export default async function BookingPage({
  searchParams,
}: {
  searchParams: Promise<{ vehicle?: string }>;
}) {


  const { vehicle: vehicleId } = await searchParams;


  const vehicle = vehicles.find(
    (item) => item.id === vehicleId
  );


  if (!vehicle) {

    return (
      <main className="min-h-screen flex items-center justify-center">

        <h1 className="text-3xl font-bold">
          Vehicle not found
        </h1>

      </main>
    );

  }



  return (

    <BookingForm vehicle={vehicle} />

  );

}