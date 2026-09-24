"use client";


import { useBooking } from "../../context/BookingContext";
import { useRouter } from "next/navigation";



export default function ReviewPage(){


const router = useRouter();



const {

cart,

period,

startDate,

customerType,

documentType,

documentImage,

setUnlockCodes


}=useBooking();





function handleConfirm(){



const codes:any[] = [];


cart.forEach(item=>{


for(let i=1; i<=item.quantity; i++){


codes.push({

id:
`${item.id}-${i}`,

name:
`${item.name} #${i}`,


code:
Math.floor(
100000 + Math.random()*900000
)
.toString()


});


}


});





setUnlockCodes(codes);



router.push("/booking/success");


}






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
">

Review Information

</h1>



<p className="
mt-3
text-gray-600
">

Please check your information before confirmation

</p>





<div className="
mt-6
space-y-5
">



<div>

<p className="text-gray-500">
Rental Period
</p>

<p className="font-bold">
{period}
</p>

</div>




<div>

<p className="text-gray-500">
Start Date
</p>

<p className="font-bold">
{startDate}
</p>

</div>





<div>

<p className="text-gray-500">
Customer Type
</p>

<p className="font-bold">
{customerType}
</p>

</div>




<div>

<p className="text-gray-500">
Document Type
</p>

<p className="font-bold">
{documentType}
</p>

</div>





{
documentImage &&

<img

src={documentImage}

className="
mt-4
rounded-xl
max-h-60
mx-auto
"

/>

}




<div>

<p className="text-green-600 font-bold">

Ready for Confirmation

</p>

</div>



</div>





<button

onClick={handleConfirm}

className="
mt-8
w-full
bg-green-600
text-white
py-4
rounded-full
"

>

Confirm Information

</button>



</div>

</main>

);


}