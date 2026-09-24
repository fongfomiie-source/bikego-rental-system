import Link from "next/link";
import { vehicles } from "@/data/vehicles";

export default async function VehicleDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {

  const { id } = await params;


  const vehicle = vehicles.find(
    (item) => item.id === id
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

    <main className="min-h-screen bg-green-50 p-8">


      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-lg p-8">


        <div className="text-7xl text-center mb-5">
  {vehicle.type === "Bicycle" ? "🚲" : "🏍️"}
</div>



        <h1 className="text-4xl font-bold text-green-700">
          {vehicle.name}
        </h1>


        <p className="text-gray-500 mt-2">
          {vehicle.type}
        </p>
        <p className="mt-4 text-gray-700">
            {vehicle.description}
        </p>


        <div className="mt-6">


          <h2 className="text-xl font-bold mb-3">
            Rental Price
          </h2>



          <p>
            Daily:
            <b> {vehicle.prices.daily} THB</b>
          </p>


          <p>
            3-Day:
            <b> {vehicle.prices.threeDay} THB</b>
          </p>


          <p>
            Weekly:
            <b> {vehicle.prices.weekly} THB</b>
          </p>


          <p>
            Monthly:
            <b> {vehicle.prices.monthly} THB</b>
          </p>


        </div>
<div className="mt-6">

<h2 className="text-xl font-bold">
Features
</h2>


<ul className="list-disc ml-6 mt-2">

{vehicle.features.map((item)=>(
  <li key={item}>
    {item}
  </li>
))}

</ul>

</div>
<div className="mt-6">

<h2 className="text-xl font-bold">
Requirement
</h2>


<p>
{vehicle.requirement}
</p>

</div>

        <div className="mt-6 text-green-600">
          🟢 {vehicle.status}
        </div>



        <Link
  href={`/booking?vehicle=${vehicle.id}`}
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
  Book Now
</Link>


      </div>


    </main>

  );
}