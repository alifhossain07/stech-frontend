"use client";
import Image from "next/image";
import { useState, useEffect } from "react";

type CardProps = {
  icon: string;
  title: string;
  text: string | string[];
};

interface ContactPageData {
  id: number;
  title: string;
  slug: string;
  description: string;
  form_title: string;
  form_description: string;
  submit_button_text: string;
  address_label: string;
  address: string;
  address_icon: string;
  phone_label: string;
  phone: string;
  phone_icon: string;
  email_label: string;
  email: string;
  email_icon: string;
  meta_title: string;
  meta_description: string;
  meta_image: string | null;
  keywords: string;
}

export default function Page() {
  const [contactData, setContactData] = useState<ContactPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    content: "",
  });

  useEffect(() => {
    fetchContactData();
  }, []);

  const fetchContactData = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/contact/page");
      const result = await response.json();
      
      if (result.result && result.data) {
        setContactData(result.data);
      }
    } catch (error) {
      console.error("Error fetching contact data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear message when user starts typing
    if (submitMessage) {
      setSubmitMessage(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.content.trim()) {
      setSubmitMessage({ type: "error", text: "Please fill in all required fields" });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setSubmitMessage({ type: "error", text: "Please enter a valid email address" });
      return;
    }

    try {
      setSubmitting(true);
      setSubmitMessage(null);

      const response = await fetch("/api/contact/store", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.result) {
        setSubmitMessage({ type: "success", text: result.message || "Your message has been sent successfully!" });
        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          content: "",
        });
      } else {
        setSubmitMessage({ type: "error", text: result.message || "Failed to send message. Please try again." });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitMessage({ type: "error", text: "An error occurred. Please try again later." });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="w-11/12 mx-auto my-10 flex justify-center items-center min-h-[400px]">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!contactData) {
    return (
      <div className="w-11/12 mx-auto my-10 flex justify-center items-center min-h-[400px]">
        <div className="text-lg text-red-600">Failed to load contact page data</div>
      </div>
    );
  }

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
              {contactData.form_title || "Get in touch"}
            </h1>

            <p className="text-base text-black leading-relaxed mb-6 w-full md:w-10/12">
              {contactData.form_description || "Have an inquiry or some feedback for us? Fill out the form below to contact our team."}
            </p>

            {submitMessage && (
              <div
                className={`mb-4 p-3 rounded-md ${
                  submitMessage.type === "success"
                    ? "bg-green-100 text-green-700 border border-green-300"
                    : "bg-red-100 text-red-700 border border-red-300"
                }`}
              >
                {submitMessage.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 flex-grow">
              {/* NAME */}
              <div>
                <label className="text-lg text-[#434343] font-medium">Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full border rounded-md mt-1 p-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>

              {/* PHONE */}
              <div>
                <label className="text-lg text-[#434343] font-medium">Phone Number *</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full border rounded-md mt-1 p-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>

              {/* EMAIL */}
              <div>
                <label className="text-lg text-[#434343] font-medium">Your E-mail *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full border rounded-md mt-1 p-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>

              {/* MESSAGE */}
              <div className="flex-grow flex flex-col">
                <label className="text-lg text-[#434343] font-medium">
                  Your Message *
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  className="w-full border rounded-md mt-1 p-3 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none h-40 md:h-full"
                  required
                ></textarea>
              </div>

              {/* SEND BUTTON */}
              <div className="mt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-orange-500 text-white px-6 py-3 rounded-md text-sm md:text-base hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {submitting ? "Sending..." : contactData.submit_button_text || "Send"}
                </button>
              </div>
            </form>
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
          {/* CARD 1 - ADDRESS */}
          <Card
            icon={contactData.address_icon || "/images/location.png"}
            title={contactData.address_label || "Office Address"}
            text={contactData.address || ""}
          />

          {/* CARD 2 - PHONE */}
          <Card
            icon={contactData.phone_icon || "/images/phones.png"}
            title={contactData.phone_label || "Support Number"}
            text={contactData.phone || ""}
          />

          {/* CARD 3 - EMAIL */}
          <Card
            icon={contactData.email_icon || "/images/mail.png"}
            title={contactData.email_label || "Support E-mail"}
            text={contactData.email || ""}
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
  const [imageError, setImageError] = useState(false);
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
      <div className="md:w-[72px] md:h-[72px] w-[60px] h-[60px] rounded-full  flex items-center justify-center mb-5">
        {!imageError ? (
          <Image
            src={icon}
            alt={title}
            width={64}
            height={64}
            onError={() => setImageError(true)}
            className="object-contain"
          />
        ) : (
          <div className="text-white text-xl font-bold">
            {title.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      <h3 className="text-[18px] md:text-[28px] font-semibold text-orange-500 mb-2">
        {title}
      </h3>

      <div className="text-sm md:text-lg text-gray-700 leading-[22px] space-y-1">
        {lines.map((line, i) => (
          <div key={i}>{line}</div>
        ))}
      </div>
    </div>
  );
}
