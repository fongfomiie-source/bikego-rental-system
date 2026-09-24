"use client";

import Link from "next/link";
import { useBooking } from "../context/BookingContext";


export default function VerificationPage() {


const {

  startDate,
  period

}=useBooking();





return (


<main className="min-h-screen bg-green-50 p-8">



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
">

Identity Verification

</h1>





<p className="
mt-3
text-gray-600
">

Please select your document type

</p>







{/* Order Information */}


<div className="
mt-6
bg-green-50
rounded-xl
p-5
">


<h2 className="
text-xl
font-bold
">

Booking Information

</h2>



<p className="mt-3">

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

{startDate || "-"}

</b>

</p>




<p>

Payment Status:

<span className="
text-green-600
font-bold
">

{" "}
Payment Uploaded

</span>

</p>



</div>









<div className="
mt-6
space-y-4
">







{/* Thai Customer */}


<Link

href="/verification/thai"

className="
block
w-full
border
rounded-xl
p-5
hover:bg-green-50
"

>



<div className="
flex
items-center
gap-3
">


<img

src="https://flagcdn.com/w40/th.png"

className="w-8 h-5"

alt="Thailand flag"

/>



<span className="
text-lg
font-medium
">

Thai Customer

</span>



</div>




<p className="
text-sm
text-gray-500
ml-11
mt-1
">

Use Thai National ID Card

</p>




</Link>










{/* International Customer */}



<Link

href="/verification/passport"

className="
block
w-full
border
rounded-xl
p-5
hover:bg-green-50
"

>



<div className="
flex
items-center
gap-3
">



<div className="
w-8
text-center
text-2xl
">

🌎

</div>




<span className="
text-lg
font-medium
">

International Customer

</span>




</div>





<p className="
text-sm
text-gray-500
ml-11
mt-1
">

Use Passport

</p>




</Link>






</div>






</div>


</main>


);


}