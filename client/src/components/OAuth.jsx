import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { signInSuccess } from "../redux/user/userSlice";
import { useNavigate } from 'react-router-dom';

export default function OAuth() {

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const dispatch = useDispatch();  // give an invalid hook error in browser console
    // cannot call hook inside of an event handler
    // and must be called withing a function component
    const navigate = useNavigate();

    console.log("In OA");
    const handleGoogleClick = async () => {
        console.log("In OA 2");
        try {
            const provider = new GoogleAuthProvider();
            const auth = getAuth(app);
            const result = await signInWithPopup(auth, provider);
            console.log("In OA 3");
            
            const res = await fetch('/api/auth/google', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    name: result.user.displayName,
                    email: result.user.email,
                    photo: result.user.photoURL,
                }),
            });
            const data = await res.json();
            console.log("result.user", result.user);
            console.log("OAuth data", data);
            dispatch(signInSuccess(data));
            navigate('/');
        } catch(error) {
            console.log('could log in with google', error);         
        }
    };

  return (
    <button 
        type='button'
        onClick={handleGoogleClick}
        className='bg-red-700 text-white rounded-lg p-3 uppercase hover:opacity-95'>Continue with google
    </button>
  )
}
