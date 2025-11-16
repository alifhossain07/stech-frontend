"use client";
import Image from "next/image";


 type CardProps = {
  icon: string;
  title: string;
  text: string | string[];
};

export default function Page() {

   
  return (
    <div className="w-11/12 mx-auto my-10">

      {/* ============================
          CONTACT FORM SECTION
      ============================= */}
      <div className="bg-white flex justify-center rounded-xl p-5 md:p-6 lg:p-8">
        <div
          className="
            grid 
            grid-cols-1 
            xl:grid-cols-2 
            gap-10
            justify-center
            2xl:grid-cols-[840px_840px]
          "
        >
          {/* FORM SIDE */}
          <div className="
            bg-[#f4f4f4]
            rounded-xl
            px-6 py-10 
            w-full
            2xl:w-[840px]
            2xl:h-[800px]
            flex flex-col
          ">
            <h1 className="text-3xl md:text-4xl font-semibold text-orange-500 mb-3">
              Get in touch
            </h1>

            <p className="text-base text-black leading-relaxed mb-6 w-full md:w-10/12">
              Have an inquiry or some feedback for us? Fill out the form
              below to contact our team. You may also email us at
              <br />
              <b>bdsannai@gmail.com</b>
            </p>

            <div className="flex flex-col gap-4 flex-grow">
              {/* NAME */}
              <div>
                <label className="text-lg text-[#434343] font-medium">Name *</label>
                <input
                  type="text"
                  className="w-full border rounded-md mt-1 p-3 focus:outline-none"
                />
              </div>

              {/* PHONE */}
              <div>
                <label className="text-lg text-[#434343] font-medium">Phone Number *</label>
                <input
                  type="text"
                  className="w-full border rounded-md mt-1 p-3 focus:outline-none"
                />
              </div>

              {/* EMAIL */}
              <div>
                <label className="text-lg text-[#434343] font-medium">Your E-mail *</label>
                <input
                  type="email"
                  className="w-full border rounded-md mt-1 p-3 focus:outline-none"
                />
              </div>

              {/* MESSAGE */}
              <div className="flex-grow flex flex-col">
                <label className="text-lg text-[#434343] font-medium">
                  Your Message *
                </label>
                <textarea
                  className="w-full border rounded-md mt-1 p-3 focus:outline-none resize-none h-40 md:h-full"
                ></textarea>
              </div>
            </div>

            {/* SEND BUTTON */}
            <div className="mt-4 flex justify-end">
              <button className="bg-orange-500 text-white px-6 py-3 rounded-md text-sm md:text-base">
                Send
              </button>
            </div>
          </div>

          {/* MAP SIDE */}
          <div className="
            rounded-xl overflow-hidden 
            w-full 
            h-[400px]
            md:h-[600px]
            xl:h-[800px]
            2xl:w-[840px] 
            2xl:h-[800px]
          ">
            <iframe
              className="w-full h-full"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.419972449816!2d90.35562917615226!3d23.768054778658282!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c7bc71a75901%3A0xbc0de6971840e8ab!2sSannai%20Technology%20Limited!5e0!3m2!1sen!2sbd!4v1763270186535!5m2!1sen!2sbd"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>

      {/* ============================
          3 CONTACT CARDS SECTION
      ============================= */}
      <div className="w-full flex justify-center items-center my-16">
        <div
          className="
            grid 
            grid-cols-1 
            sm:grid-cols-2
            md:grid-cols-1
            xl:grid-cols-3
            gap-8
            md:gap-[99px]
            place-items-center
          "
        >
          {/* CARD 1 */}
          <Card
            icon="/images/location.png"
            title="Office Address"
            text="Level 4, Techdyno BD LTD, Haq’s Plaza, 4th Floor, 26 Kemal Ataturk Ave, Dhaka 1213"
          />

          {/* CARD 2 */}
          <Card
            icon="/images/phones.png"
            title="Support Number"
            text={["+88001925739100", "+88001925739100"]}
          />

          {/* CARD 3 */}
          <Card
            icon="/images/mail.png"
            title="Support E-mail"
            text="hellortl@gmail.com"
          />
        </div>
      </div>
    </div>
  );
}

/* ============================
   REUSABLE CARD COMPONENT
============================= */

function Card({ icon, title, text }: CardProps) {

    const lines = Array.isArray(text) ? text : text.split("\n");
  return (
    <div
      className="
        bg-white shadow-xl rounded-2xl
        flex flex-col items-center justify-center text-center
        w-full
        max-w-[445px]
        h-auto md:h-[376px]
        px-6 py-10
      "
    >
      <div className="md:w-[72px] md:h-[72px] w-[60px] h-[60px] rounded-full bg-orange-500 flex items-center justify-center mb-5">
        <Image src={icon} alt={title} width={32} height={32} />
      </div>

      <h3 className="text-[18px] md:text-[28px] font-semibold text-orange-500 mb-2">
        {title}
      </h3>

      <p className="text-sm md:text-lg text-gray-700 leading-[22px] whitespace-pre-line">
        {lines.map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </p>
    </div>
  );
}
