"use client"

import React, { useEffect } from "react"
import Glide from "@glidejs/glide"
import Image from "next/image"


const HeroSlider = () => {

      useEffect(() => {
    const slider = new Glide(".glide-01", {
      type: "slider",
      focusAt: "center",
      perView: 1,
      autoplay: 3000,
      animationDuration: 700,
      gap: 0,
       classes: {
    swipeable: "glide__swipeable",
    dragging: "glide__dragging",
    direction: { ltr: "glide__ltr", rtl: "glide__rtl" },
    type: { slider: "glide__slider", carousel: "glide__carousel" },
    slide: { active: "glide__slide--active", clone: "glide__slide--clone" },
    arrow: { disabled: "glide__arrow--disabled" },
    nav: { active: "[&>*]:bg-wuiSlate-700" },
  },
    }).mount()

    return () => {
      slider.destroy()
    }
  }, [])

  return (
    <div className='w-10/12 mx-auto pt-10 pb-24'>
      <h1 className='text-2xl font-bold'>This is Hero Slider</h1>
      {/* Parent Div */}
      <div className='flex h-[500px] border border-red-500'>
        <div className='border border-green-500 w-2/3'>
 <div className="relative w-full glide-01">
        {/*    <!-- Slides --> */}
        <div className="overflow-hidden" data-glide-el="track">
          <ul className="whitespace-no-wrap flex-no-wrap [backface-visibility: hidden] [transform-style: preserve-3d] [touch-action: pan-Y] [will-change: transform] relative flex w-full overflow-hidden p-0">
            <li>
              <Image
                src="/images/slider1.png"
                alt="slider1"
                width={500}
                height={300}
                className="w-full max-w-full max-h-full m-auto"
              />
            </li>
            <li>
              <Image
                src="/images/slider2.png"
                alt="slider2"
                 width={500}
                height={300}
                className="w-full max-w-full max-h-full m-auto"
              />
            </li>
            
          </ul>
        </div>
        {/*    <!-- Controls --> */}
        <div
          className="absolute left-0 flex items-center justify-between w-full h-0 px-4 top-1/2 "
          data-glide-el="controls"
        >
          <button
            className="inline-flex items-center justify-center w-8 h-8 transition duration-300 border rounded-full border-slate-700 bg-white/20 text-slate-700 hover:border-slate-900 hover:text-slate-900 focus-visible:outline-none lg:h-12 lg:w-12"
            data-glide-dir="<"
            aria-label="prev slide"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-5 h-5"
            >
              <title>prev slide</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18"
              />
            </svg>
          </button>
          <button
            className="inline-flex items-center justify-center w-8 h-8 transition duration-300 border rounded-full border-slate-700 bg-white/20 text-slate-700 hover:border-slate-900 hover:text-slate-900 focus-visible:outline-none lg:h-12 lg:w-12"
            data-glide-dir=">"
            aria-label="next slide"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-5 h-5"
            >
              <title>next slide</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
              />
            </svg>
          </button>
        </div>
      </div>
        </div>
        <div className=' flex flex-col border border-blue-500 w-1/3'>
            <div className='border  border-orange-300'>
asdasd
            </div>
            <div className='border  border-sky-300'>
asdasd
            </div>
        </div>
      </div>
    </div>
  );
}

export default HeroSlider;
