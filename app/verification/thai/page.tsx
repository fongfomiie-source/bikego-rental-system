"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useBooking } from "../../context/BookingContext";


export default function ThaiVerification(){


const router = useRouter();



const {

cart,

setCustomerType,

setDocumentType,

setDocumentImage,

setDrivingLicenseImage


}=useBooking();




const hasMotorcycle = cart.some(
(item)=> 
item.type === "Motorbike" ||
item.type === "Motorcycle"
);
console.log("VERIFY CART", cart);
console.log("RAW CART", JSON.stringify(cart));
console.log("HAS MOTORBIKE", hasMotorcycle);



const [file,setFile] =
useState<File | null>(null);


const [preview,setPreview] =
useState("");



const [licenseFile,setLicenseFile] =
useState<File | null>(null);


const [licensePreview,setLicensePreview] =
useState("");



const [error,setError] =
useState("");





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







function handleLicenseFile(
e: React.ChangeEvent<HTMLInputElement>
){


const selected =
e.target.files?.[0];


if(selected){


setLicenseFile(selected);


setLicensePreview(
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




if(hasMotorcycle && !licenseFile){


setError(
"Please upload your Driving License"
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



setDrivingLicenseImage(
licensePreview
);


router.push(
"/verification/review"
);



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

preview ?


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


:

<div className="text-gray-400">

📷

<p>
National ID Preview
</p>

</div>


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
hasMotorcycle && (


<>



<p className="
mt-8
text-gray-600
">

Please upload your Driving License

</p>



<div className="
mt-4
border-2
border-dashed
rounded-xl
p-6
text-center
">


{

licensePreview ?


<img

src={licensePreview}

className="
mx-auto
max-h-60
max-w-full
object-contain
rounded-lg
"

/>


:

<div className="text-gray-400">

📷

<p>
Driving License Preview
</p>

</div>


}



</div>






<input

type="file"

accept="image/*"

onChange={handleLicenseFile}

className="
mt-6
w-full
border
p-3
rounded-lg
"

/>



</>


)

}








{
error &&

<p className="
mt-4
text-red-500
">

⚠ {error}

</p>

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