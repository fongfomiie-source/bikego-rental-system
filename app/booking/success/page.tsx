"use client";


import Link from "next/link";
import { useBooking } from "../../context/BookingContext";



export default function SuccessPage(){


const {

cart,

period,

startDate,

unlockCodes,

orderId,

clearBooking

}=useBooking();





const getPrice = (price:number)=>{


if(period === "threeDay"){

return price * 2.6;

}


if(period === "weekly"){

return price * 6;

}


if(period === "monthly"){

return price * 20;

}


return price;


};







const total = cart.reduce(

(sum,item)=>

sum + 
(getPrice(item.price) * item.quantity),

0

);








return (


<main className="
min-h-screen
bg-green-50
p-8
">



<div className="
max-w-xl
mx-auto
bg-white
rounded-2xl
shadow-lg
p-8
">





<h1 className="
text-3xl
font-bold
text-green-700
text-center
">

Booking Confirmed

</h1>





<p className="
mt-3
text-gray-600
text-center
">

Your rental has been confirmed

</p>








{/* Booking Information */}

<div className="
mt-6
bg-green-50
rounded-xl
p-5
">


<p>

Booking ID:

<b>
{" "}
{orderId || "-"}
</b>

</p>



<p>

Rental Period:

<b>
{" "}
{period}
</b>

</p>



<p>

Start Date:

<b>
{" "}
{startDate}
</b>

</p>




<p>

Status:

<span className="
text-green-600
font-bold
">

{" "}
Confirmed

</span>

</p>



</div>









{/* Vehicle Unlock Code */}


<div className="
mt-6
">


<h2 className="
text-xl
font-bold
">

Vehicle Unlock Code

</h2>




{

unlockCodes.map(item=>(


<div

key={item.id}

className="
mt-4
border
rounded-xl
p-4
"

>


<p className="
font-bold
">

{item.name}

</p>



<p className="
text-gray-500
">

Vehicle ID:
{" "}
{item.id}

</p>



<p className="
mt-3
text-4xl
font-bold
text-green-700
">

{item.code}

</p>



</div>


))


}



</div>









{/* Price Summary */}

<div className="
mt-6
">


<h2 className="
text-xl
font-bold
">

Payment Summary

</h2>




{

cart.map(item=>(


<div

key={item.id}

className="
mt-3
border
rounded-xl
p-4
flex
justify-between
"

>


<div>

<p className="
font-bold
">

{item.name}

</p>


<p>

Qty:
{" "}
{item.quantity}

</p>


</div>




<p className="
font-bold
text-green-700
">

{getPrice(item.price) * item.quantity}

THB

</p>




</div>


))


}




<div className="
mt-6
text-center
">


<p className="
text-gray-500
">

Total Amount

</p>



<p className="
text-3xl
font-bold
text-green-700
">

{total.toFixed(0)}

THB

</p>



</div>



</div>









<p className="
mt-6
text-gray-600
text-center
">

Please use each code for the correct vehicle

</p>









<div className="
mt-8
space-y-3
">


<button

onClick={()=>{

clearBooking();

window.location.href="/";

}}

className="
block
w-full
bg-green-600
text-white
py-4
rounded-full
"

>

Back to Home

</button>




<button

onClick={()=>{

clearBooking();

window.location.href="/bikes";

}}

className="
block
w-full
border
border-green-600
text-green-700
py-4
rounded-full
"

>

New Booking

</button>




</div>





</div>


</main>


);


}