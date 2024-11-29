import React from 'react'

export default function About() {
  return (
    <div className='px-4 py-12 max-w-2xl mx-auto'>
      <h1 className='text-3xl font-bold mb-4 text-slate-700'>About</h1>
      <p className='mb-4 text-slate-700'>This is a Next.js application using Clerk for authentication and Mongoose for MongoDB.</p>
      <p className='mb-4 text-slate-700'>The front-end of the application is built with Next.js and uses Clerk for user authentication. The back-end is connected to MongoDB using Mongoose.</p>
      <p className='mb-4 text-slate-700'>This application is intended as a starting point for building full-stack web applications with authentication using Next.js, Clerk, and Mongoose. Feel free to use it as a template for your own projects!</p>
      <p className='mb-4 text-slate-700'>For more information on Next.js, Clerk, and Mongoose, check out the official documentation:</p>
    </div>
  )
}
