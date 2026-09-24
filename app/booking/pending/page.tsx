"use client";


import Link from "next/link";
import { useBooking } from "../../context/BookingContext";



export default function PendingPage(){


const {
orderId,
bookingStatus
}=useBooking();




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
text-center
">



<h1 className="
text-3xl
font-bold
text-green-700
">

Booking Submitted Successfully ✅

</h1>





<p className="
mt-4
text-gray-600
">

Thank you for your booking.

</p>





<div className="
mt-6
bg-green-50
rounded-xl
p-5
text-left
">


<p>

Booking ID:

<b>
{" "}
{orderId || "-"}
</b>

</p>


<p className="
mt-3
">

Status:

<span className="
text-yellow-600
font-bold
">

{" "}
🟡 {bookingStatus}

</span>


</p>


</div>







<div className="
mt-8
text-left
">


<h2 className="
font-bold
text-xl
">

Verification Process

</h2>




<div className="
mt-4
space-y-3
">


<p>
✅ Booking Information Received
</p>


<p>
✅ Payment Slip Submitted
</p>


<p>
✅ Identity Document Submitted
</p>


<p>
⏳ Staff Verification in Progress
</p>



</div>


</div>









<div className="
mt-8
bg-gray-50
rounded-xl
p-5
">


<p className="
font-bold
">

Estimated Processing Time

</p>


<p className="
mt-2
text-green-700
font-bold
">

Usually completed within 5–10 minutes during operating hours.

</p>


</div>







<p className="
mt-8
text-gray-600
">

Your vehicle unlock code will be generated after approval.

</p>








<div className="
mt-8
space-y-3
">


<Link

href="/"

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

</Link>



<Link

href="/booking"

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

View Booking

</Link>



</div>





</div>


</main>


);


}