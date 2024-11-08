 import { useState } from 'react';
 import { Link, useNavigate } from 'react-router-dom';
 import {signInStart, signInSuccess, signInFaîlure } from '../redux/user/userSlice';
 import { useDispatch, useSelector } from 'react-redux';
 
 export default function SignIn() {
 
   const [formData, setFormData] = useState({});
   //const [error, setError] = useState(false);
   //const [loading, setLoading] = useState(false);
   const { loading, error } = useSelector((state) => state.user);
   const navigate = useNavigate();
   const dispatch = useDispatch();
 
   const handleChange = (e) => {
     setFormData({...formData, [e.target.id]: e.target.value});
   };
 
   //console.log(formData);
 
   const handleSubmit = async (e) => {
     e.preventDefault();
     console.log("At handle submit");
     try {
        dispatch(signInStart());
        //setLoading(true);
        //setError(false);
        console.log("handle signin");
       const res = await fetch('/api/auth/signin', {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
         },
         body: JSON.stringify(formData),
       });
       //setLoading(false);
       console.log("...get json");
       const data = await res.json();
       console.log(data);
       if(data.success === false) {
         //setError(true);
         dispatch(signInFaîlure(data));
         
         return;
        }
        dispatch(signInSuccess(data));
        navigate('/');
     } catch(error) {
       //setLoading(false);
       //setError(true);
       dispatch(signInFaîlure(error));
     }
 
     
     //console.log(data);
     
   };
   
   return (
     <div className='p-3 max-w-lg mx-auto'>
       <h1 className='text-3xl text-center font-semibold my-7'>Sign In</h1>
       <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
         <input type="email" 
           placeholder='Email' 
           id="email"
           className='bg-slate-100 p-3 rounded-lg'
           onChange={handleChange}             
         />
         <input type="password" 
           placeholder='Password' 
           id="password"
           className='bg-slate-100 p-3 rounded-lg'
           onChange={handleChange}            
         />
         <button disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>
           { loading ?  'Loading...' : 'Sign In' }
         </button>
       </form>
       <div className='flex gap-2 mt-5'>
         <p>Dont have an account ?</p>
         <Link to='/sign-up'>
           <span className='text-blue-500'>Sign Up</span>
         </Link>
       </div>
       <p className='text-red-700 mt-5'>
        {error ? error.message || "Something went wrong" : ""}
      </p>
     </div>
   )
 }
 