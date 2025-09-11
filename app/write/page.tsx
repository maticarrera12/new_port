import React from 'react'

const WritePage = () => {
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
          <form className='space-y-6 mb-8 pr-5 lg:pr-0 lg:w-full lg:max-w-md'>
            <div>
              <label className='block text-sm font-bold mb-2'>Name</label>
              <div className='flex space-x-4'>
                <div className='flex-1'>
                  <label className='block text-sm font-normal mb-1'>First name</label>
                  <input 
                    type='text' 
                    className='w-full border-0 border-b-2 border-black bg-transparent py-2 focus:outline-none'
                  />
                </div>
                <div className='flex-1'>
                  <label className='block text-sm font-normal mb-1'>Last name</label>
                  <input 
                    type='text' 
                    className='w-full border-0 border-b-2 border-black bg-transparent py-2 focus:outline-none'
                  />
                </div>
              </div>
            </div>
            
            <div>
              <label className='block text-sm font-normal mb-1'>Email</label>
              <input 
                type='email' 
                className='w-full border-0 border-b-2 border-black bg-transparent py-2 focus:outline-none'
              />
            </div>
            
            <div>
              <label className='block text-sm font-normal mb-1'>Message</label>
              <textarea 
                rows={1}
                className='w-full border-0 border-b-2 border-black bg-transparent py-2 focus:outline-none resize-none lg:rows-4'
              ></textarea>
            </div>
            
            <button 
              type='submit'
              className='bg-black text-white px-8 py-3 rounded-full font-bold hover:bg-gray-800 transition-colors'
            >
              Submit
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
    </div>
  )
}

export default WritePage