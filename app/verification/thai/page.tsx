"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useBooking } from "../../context/BookingContext";


export default function ThaiVerification(){


const router = useRouter();



const {

setCustomerType,

setDocumentType,

setDocumentImage


}=useBooking();





const [file,setFile] = useState<File | null>(null);

const [preview,setPreview] = useState("");

const [error,setError] = useState("");







function handleFile(
e: React.ChangeEvent<HTMLInputElement>
){


const selected =
e.target.files?.[0];



if(selected){


setFile(selected);



setPreview(
URL.createObjectURL(selected)
);



setError("");

}



}









function handleContinue(){



if(!file){


setError(
"Please upload your National ID Card"
);


return;


}




setCustomerType(
"Thai Customer"
);



setDocumentType(
"National ID Card"
);



setDocumentImage(
preview
);



router.push("/verification/review");



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

Thai Customer Verification

</h1>





<p className="
mt-3
text-gray-600
">

Please upload your National ID Card

</p>









<div className="
mt-6
border-2
border-dashed
rounded-xl
p-6
text-center
">



{

preview ? (


<img

src={preview}

className="
mx-auto
max-h-60
max-w-full
object-contain
rounded-lg
"

/>


)

:

(


<div className="
text-gray-400
">


📷


<p>

Document Preview

</p>



</div>


)


}



</div>









<input

type="file"

accept="image/*"

onChange={handleFile}

className="
mt-6
w-full
border
p-3
rounded-lg
"

/>









{

file && (


<p className="
mt-3
text-sm
text-gray-600
">


Selected:

<b>

{" "}

{file.name}

</b>


</p>


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









<button

onClick={handleContinue}

className="
mt-8
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