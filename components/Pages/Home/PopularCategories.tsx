import Image from 'next/image';
import React from 'react';

const PopularCategories = () => {

  const items = [

  {
    title: "Fast Charger",
    image : "/images/fcharger.png",
  },
  {
    title: "Fast Cable",
    image : "/images/fcable.png",
  },
  {
    title: "TWS",
    image : "/images/tws.png",
  },
  {
    title: "Fast Charger",
    image : "/images/sfcharger.png",
  },
  {
    title: "Ear Phone",
    image : "/images/headphone.png",
  },
  {
    title: "Power Bank",
    image : "/images/pbank.png",
  },
  ];

  return (
    <div className="w-10/12 mx-auto">
        <div className=' space-y-3 text-center'>
        <h1 className='text-4xl font-semibold' >Explore Popular Categories</h1>
        <p className='text-sm'>Find your preferred item in the highlighted product selection.</p>
        </div>

       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-10 p-6 mt-10">
      {items.map((item, index) => (
        <div
          key={index}
          className="flex flex-col h-64 hover:bg-orange-300 duration-300 items-center justify-center bg-white border border-gray-300 rounded-lg cursor-pointer p-6 hover:shadow-lg transition"
        >
          <Image
            src={item.image}
            alt={item.title}
            width={100}
            height={100}
            className="mb-3"
          />
          <h3 className="text-lg  text-gray-800">{item.title}</h3>
        </div>
      ))}
    </div>



        </div>
      
   
  );
}

export default PopularCategories;
