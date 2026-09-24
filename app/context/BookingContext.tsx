"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";


type CartItem = {

  id: string;
  name: string;
  type: string;
  price: number;
  quantity: number;

};



type UnlockCode = {

  id: string;
  name: string;
  code: string;

};



type BookingContextType = {


  cart: CartItem[];

  addToCart:(vehicle:CartItem)=>void;

  removeFromCart:(id:string)=>void;

  increaseQuantity:(id:string)=>void;

  decreaseQuantity:(id:string)=>void;



  startDate:string;

  setStartDate:(date:string)=>void;



  period:string;

  setPeriod:(period:string)=>void;



  orderId:string;

  setOrderId:(id:string)=>void;



  paymentSlip:string;

  setPaymentSlip:(image:string)=>void;



  customerType:string;

  setCustomerType:(type:string)=>void;



  documentType:string;

  setDocumentType:(type:string)=>void;



  documentImage:string;

  setDocumentImage:(image:string)=>void;



  drivingLicenseImage:string;

  setDrivingLicenseImage:(image:string)=>void;



  unlockCodes:UnlockCode[];

  setUnlockCodes:(codes:UnlockCode[])=>void;


  clearBooking:()=>void;


};





const BookingContext =
createContext<BookingContextType | null>(null);







export function BookingProvider({

children,

}:{

children:ReactNode;

}){





const [cart,setCart] =
useState<CartItem[]>([]);



const [startDate,setStartDate] =
useState("");



const [period,setPeriod] =
useState("daily");



const [orderId,setOrderId] =
useState("");



const [paymentSlip,setPaymentSlip] =
useState("");



const [customerType,setCustomerType] =
useState("");



const [documentType,setDocumentType] =
useState("");



const [documentImage,setDocumentImage] =
useState("");



const [drivingLicenseImage,setDrivingLicenseImage] =
useState("");



const [unlockCodes,setUnlockCodes] =
useState<UnlockCode[]>([]);





function clearBooking(){


setCart([]);

setStartDate("");

setPeriod("daily");

setOrderId("");

setPaymentSlip("");

setCustomerType("");

setDocumentType("");

setDocumentImage("");

setDrivingLicenseImage("");

setUnlockCodes([]);


}







function addToCart(vehicle:CartItem){


setCart(current=>{


const exist =
current.find(
item=>item.id===vehicle.id
);




if(exist){


return current.map(item=>


item.id===vehicle.id

?

{
...item,
quantity:item.quantity+1
}

:

item


);


}




return [

...current,

{
...vehicle,
quantity:1
}

];


});


}









function removeFromCart(id:string){


setCart(current=>

current.filter(
item=>item.id!==id
)

);


}








function increaseQuantity(id:string){


setCart(current=>


current.map(item=>


item.id===id

?

{
...item,
quantity:item.quantity+1
}

:

item


)


);


}









function decreaseQuantity(id:string){


setCart(current=>


current.map(item=>


item.id===id && item.quantity>1

?

{
...item,
quantity:item.quantity-1
}

:

item


)


);


}










return (


<BookingContext.Provider


value={{


cart,

addToCart,

removeFromCart,

increaseQuantity,

decreaseQuantity,


startDate,

setStartDate,


period,

setPeriod,


orderId,

setOrderId,


paymentSlip,

setPaymentSlip,


customerType,

setCustomerType,


documentType,

setDocumentType,


documentImage,

setDocumentImage,


drivingLicenseImage,

setDrivingLicenseImage,


unlockCodes,

setUnlockCodes,


clearBooking,


}}


>


{children}


</BookingContext.Provider>


);


}








export function useBooking(){


const context =
useContext(BookingContext);



if(!context){


throw new Error(
"useBooking must be used inside BookingProvider"
);


}



return context;


}