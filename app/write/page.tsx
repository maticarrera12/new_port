'use client'
import React from 'react'
import { useState } from "react";
import emailjs from "@emailjs/browser";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

const WritePage = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    message: "",
  });
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value} = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.first_name === "" || formData.last_name === "" || formData.email === "" || formData.message === "") {
      setError("Please fill in all fields");
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        {
          from_name: `${formData.first_name} ${formData.last_name}`,
          from_email: formData.email,
          user_message: formData.message,
          first_name: formData.first_name,
          last_name: formData.last_name,
          user_email: formData.email,
        },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
      );
      setIsSent(true);
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        message: "",
      });
      toast.success("Message sent successfully!");
      
      // Reset isSent after 3 seconds to allow sending again
      setTimeout(() => {
        setIsSent(false);
      }, 3000);
    } catch (error) {
      setError("Failed to send message. Please try again.");
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className='min-h-screen w-full px-6 py-16 relative write-page'>
      {/* Main Content */}
      <div className='flex flex-col lg:flex-row lg:justify-between lg:items-stretch min-h-[40vh] lg:min-h-screen w-full'>
        {/* Left Side - CONNECT WITH ME */}
        <div className='flex-1 flex flex-col justify-between lg:h-screen lg:justify-between lg:pb-16'>
          <div className='mb-8'>
            <h1 className='text-8xl font-bold'>CONNECT</h1>
            <h1 className='text-8xl font-bold mb-4'>WITH</h1>
            <p>Buenos Aires, Argentina</p>
            <p className='font-bold'>2025</p>
          </div>
          <h1 className='text-8xl font-bold lg:mb-0'>ME</h1>
        </div>
        
        {/* Right Side - Orange Block and Form */}
        <div className='flex-1 lg:ml-16 mt-8 lg:mt-0 lg:h-screen lg:flex lg:flex-col lg:items-center lg:justify-between'>
          {/* Orange Block */}
          <div className='w-3/4 lg:w-full h-[10vh] lg:h-32 bg-orange ml-auto lg:ml-0 mb-8'></div>
          
          {/* Contact Form */}
          <form className='space-y-6 mb-8 pr-5 lg:pr-0 lg:w-full lg:max-w-md' onSubmit={handleSubmit}>
            <div>
              <label className='block text-sm font-bold mb-2'>Name</label>
              <div className='flex space-x-4'>
                <div className='flex-1'>
                  <label className='block text-sm font-normal mb-1'>First name</label>
                  <input 
                    type='text' 
                    name='first_name'
                    value={formData.first_name}
                    onChange={handleChange}
                    className='w-full border-0 border-b-2 border-black bg-transparent py-2 focus:outline-none'
                  />
                </div>
                <div className='flex-1'>
                  <label className='block text-sm font-normal mb-1'>Last name</label>
                  <input 
                    type='text' 
                    name='last_name'
                    value={formData.last_name}
                    onChange={handleChange}
                    className='w-full border-0 border-b-2 border-black bg-transparent py-2 focus:outline-none'
                  />
                </div>
              </div>
            </div>
            
            <div>
              <label className='block text-sm font-normal mb-1'>Email</label>
              <input 
                type='email' 
                name='email'
                value={formData.email}
                onChange={handleChange}
                className='w-full border-0 border-b-2 border-black bg-transparent py-2 focus:outline-none'
              />
            </div>
            
            <div>
              <label className='block text-sm font-normal mb-1'>Message</label>
              <textarea 
                rows={1}
                name='message'
                value={formData.message}
                onChange={handleChange}
                className='w-full border-0 border-b-2 border-black bg-transparent py-2 focus:outline-none resize-none lg:rows-4'
              ></textarea>
            </div>
            
            <button 
              type='submit'
              onClick={handleSubmit}
              className='bg-black text-white px-8 py-3 rounded-full font-bold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
              disabled={isSent || isLoading}
            >
              {isLoading && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              )}
              {isLoading ? "Sending..." : isSent ? "Sent!" : "Submit"}
            </button>
          </form>
          
          {/* Contact Info */}
          <div className='space-y-2 lg:w-full lg:max-w-md'>
            <h3 className='text-2xl font-bold'>mcarreradev12@gmail.com</h3>
            <h3 className='text-2xl font-bold'>(+54) 11 5470 3056</h3>
            <p className='text-sm font-normal'>Let&apos;s Work Together</p>
          </div>
          
          {/* MC Text */}
          <div className='w-full flex justify-end'>
            <h1 className='text-8xl font-bold lg:mt-auto lg:mb-16'>MC</h1>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  )
}

export default WritePage