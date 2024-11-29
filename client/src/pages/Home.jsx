import React from 'react'

export default function Home() {
  return (
    <div className='px-4 py-12 max-w-2xl mx-auto'>
      <h1 className='text-3xl font-bold mb-4 text-slate-700'>Welcome to my Authentication App!</h1>
      <p className='mb-4 text-slate-700'>This application is built using Next.js, a powerful React framework for building server-side rendered and statically generated web applications.</p>
      <p className='mb-4 text-slate-700'>We have integrated Clerk for seamless user authentication, providing a secure and user-friendly login experience.</p>
      <p className='mb-4 text-slate-700'>Our backend is powered by MongoDB, a NoSQL database, and we use Mongoose for elegant MongoDB object modeling in Node.js.</p>
      <p className='mb-4 text-slate-700'>This project serves as a comprehensive template for building full-stack web applications with authentication. Feel free to customize it to suit your needs!</p>
      <p className='mb-4 text-slate-700'>For more information, please refer to the official documentation of the technologies used:</p>
    </div>
  )
}
