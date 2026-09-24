"use client";

import Link from "next/link";
import { vehicles } from "@/data/vehicles";
import { useBooking } from "../context/BookingContext";


export default function BikesPage() {


const { cart, addToCart } = useBooking();
const cartCount = cart.reduce(
  (sum,item)=>sum + item.quantity,
  0
);


const cartTotal = cart.reduce(
  (sum,item)=>sum + (item.price * item.quantity),
  0
);
console.log("CURRENT CART", cart);



  return (

    <main className="min-h-screen bg-gray-50 p-8">


      <h1 className="
      text-4xl
      font-bold
      text-green-700
      text-center
      mb-10
      ">
        🚲🏍️ Available Vehicles
      </h1>
<Link
href="/cart"
className="
hidden
md:block
mb-8
text-center
bg-black
text-white
py-3
rounded-full
"
>
🛒 Go to Cart
</Link>



      <div className="
      grid
      gap-6
      md:grid-cols-4
      ">



      {vehicles.map((vehicle)=>(


        <div
        key={vehicle.id}
        className="
        bg-white
        rounded-2xl
        shadow-md
        p-6
        hover:shadow-xl
        transition
        "
        >



        <div className="text-5xl text-center mb-4">

          {vehicle.type === "Bicycle"
          ? "🚲"
          : "🏍️"}

        </div>




        <h2 className="text-xl font-bold">
          {vehicle.name}
        </h2>



        <p className="text-gray-500">
          {vehicle.type}
        </p>




        <div className="mt-4 space-y-1">


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




        <p className="text-green-600 mt-4">
          🟢 {vehicle.status}
        </p>




        <Link
        href={`/vehicles/${vehicle.id}`}
        className="
        mt-5
        block
        text-center
        w-full
        border
        border-green-600
        text-green-700
        py-3
        rounded-full
        hover:bg-green-50
        transition
        "
        >
          View Details
        </Link>





        <button

        onClick={()=>{

addToCart({

id: vehicle.id,

name: vehicle.name,

type: vehicle.type,

price: vehicle.prices.daily,

quantity:1,

});


console.log("ADD", vehicle.name);

}}

        className="
        mt-3
        w-full
        bg-green-600
        text-white
        py-3
        rounded-full
        hover:bg-green-700
        transition
        "

        >

          Add to Cart

        </button>





        </div>


      ))}
{
cartCount > 0 && (

<Link
href="/cart"
className="
fixed
bottom-5
left-5
right-5
z-50
md:hidden
bg-green-600
text-white
rounded-full
py-4
px-6
shadow-xl
flex
justify-between
items-center
"
>

<div>

<p className="font-bold">
🛒 View Cart
</p>

<p className="text-sm">
{cartCount} vehicle(s)
</p>

</div>


<p className="font-bold">
{cartTotal} THB
</p>


</Link>

)
}

      </div>



    </main>

  );

}