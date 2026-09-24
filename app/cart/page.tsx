"use client";

import Link from "next/link";
import { useBooking } from "../context/BookingContext";
import { useState } from "react";
import { useRouter } from "next/navigation";


  
export default function CartPage(){
  const router = useRouter();
    const [error,setError] = useState("");


const {
  cart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  startDate,
  setStartDate,
  period,
  setPeriod

} = useBooking();





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

Your Cart

</h1>






{/* Rental Period */}

<div className="mt-6">


<h2 className="
text-xl
font-bold
">

Rental Period

</h2>




<div className="
mt-3
space-y-2
">



<label className="block">

<input

type="radio"

checked={period==="daily"}

onChange={()=>
setPeriod("daily")
}

/>

<span className="ml-2">

Daily

</span>

</label>





<label className="block">

<input

type="radio"

checked={period==="threeDay"}

onChange={()=>
setPeriod("threeDay")
}

/>

<span className="ml-2">

3-Day

</span>

</label>






<label className="block">

<input

type="radio"

checked={period==="weekly"}

onChange={()=>
setPeriod("weekly")
}

/>

<span className="ml-2">

Weekly

</span>

</label>






<label className="block">

<input

type="radio"

checked={period==="monthly"}

onChange={()=>
setPeriod("monthly")
}

/>

<span className="ml-2">

Monthly

</span>

</label>




</div>


</div>







{/* Start Date */}

<div className="mt-6">


<h2 className="
text-xl
font-bold
">

Start Date

</h2>



<input

type="date"

value={startDate}

onChange={(e)=>
setStartDate(e.target.value)
}

className="
mt-3
w-full
border
rounded-lg
p-3
"

/>
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









{
cart.length === 0

?


<p className="
mt-6
text-gray-500
">

Your cart is empty

</p>



:


<div className="
mt-6
space-y-4
">





{
cart.map((item)=>(



<div

key={item.id}

className="
border
rounded-xl
p-4
"

>





<div className="
flex
justify-between
">



<div>


<h2 className="
font-bold
text-lg
">

{item.name}

</h2>



<p className="
text-gray-500
">

{item.type}

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








<div className="
mt-4
flex
items-center
justify-between
">





<div className="
flex
items-center
gap-3
">





<button

onClick={()=>
decreaseQuantity(item.id)
}

className="
w-8
h-8
rounded-full
bg-gray-200
"

>

-

</button>







<span className="
font-bold
">

{item.quantity}

</span>







<button

onClick={()=>
increaseQuantity(item.id)
}

className="
w-8
h-8
rounded-full
bg-green-600
text-white
"

>

+

</button>






</div>







<button

onClick={()=>
removeFromCart(item.id)
}

className="
text-red-500
text-sm
"

>

Remove

</button>





</div>






</div>



))


}







<h2 className="
text-xl
font-bold
mt-6
">

Total:
{" "}
{total.toFixed(0)} THB

</h2>







<button

onClick={()=>{


if(!startDate){

setError(
"Please select rental start date"
);

return;

}


setError("");

router.push("/payment");


}}

className="
mt-6
block
w-full
text-center
bg-green-600
text-white
py-4
rounded-full
"

>

Continue

</button>





</div>



}






</div>


</main>



);


}