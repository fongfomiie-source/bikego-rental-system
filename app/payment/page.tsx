"use client";

import { useRouter } from "next/navigation";
import { useBooking } from "../context/BookingContext";
import { useState } from "react";


export default function PaymentPage(){


const router = useRouter();


const {

  cart,

  startDate,

  period,

  setOrderId,

  setPaymentSlip


}=useBooking();




const [slipPreview,setSlipPreview] = useState("");

const [error,setError] = useState("");

const [orderId,setOrderIdState] = useState("");






function handleContinue(){


if(!slipPreview){


setError(
"Please upload payment slip"
);


return;


}




const newOrderId =
"BG-" + Date.now();



setOrderIdState(newOrderId);


setOrderId(newOrderId);


setPaymentSlip(slipPreview);



router.push("/verification");


}









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








const total =

cart.reduce(

(sum,item)=>

sum + (getPrice(item.price) * item.quantity),

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
">

Payment

</h1>








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

Order Information

</h2>



<p className="mt-3">

Order ID:

<b>

{" "}

{orderId || "Pending"}

</b>

</p>




<p>

Payment Status:

<span className="
text-orange-500
font-bold
">

{" "}
Waiting Payment

</span>

</p>


</div>









<div className="mt-6">


<h2 className="
text-xl
font-bold
">

Booking Summary

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


</div>









<div className="
mt-6
space-y-3
">


{

cart.map((item)=>(


<div

key={item.id}

className="
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



</div>









<div className="
mt-6
text-center
">


<h2 className="
text-xl
font-bold
">

Total Amount

</h2>



<p className="
text-3xl
font-bold
text-green-700
mt-2
">

{total.toFixed(0)}

THB

</p>


</div>









<div className="
mt-8
border-2
border-dashed
rounded-xl
p-8
text-center
">


<div className="
text-6xl
">

▣

</div>


<p className="
mt-3
text-gray-500
">

Payment QR Code

</p>


</div>









<div className="mt-6">


<h2 className="font-bold">

Upload Payment Slip

</h2>




<input

type="file"

accept="image/*"

onChange={(e)=>{


const file =
e.target.files?.[0];



if(file){


setSlipPreview(
URL.createObjectURL(file)
);


setError("");

}


}}

className="
mt-3
w-full
border
rounded-lg
p-3
"

/>







{

slipPreview && (


<div className="mt-4">


<p className="font-bold">

Slip Preview

</p>




<img

src={slipPreview}

className="
mt-3
w-full
rounded-xl
"

/>


</div>


)

}







{

error && (


<p className="
mt-3
text-red-500
">

⚠ {error}

</p>


)

}



</div>









<button

onClick={handleContinue}

className="
mt-8
block
w-full
bg-green-600
text-white
py-4
rounded-full
hover:bg-green-700
"

>

Continue

</button>







</div>


</main>


);


}