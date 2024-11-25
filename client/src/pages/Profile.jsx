import { useSelector } from "react-redux";
import { useRef, useState, useEffect } from 'react';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import { useDispatch } from "react-redux";
import {  updateUserStart, 
          updateUserSuccess, 
          updateUserFailure, 
          deleteUserStart,
          deleteUserFailure,
          deleteUserSuccess
} from '../redux/user/userSlice';

export default function Profile() {
  const { currentUser, loading, error } = useSelector(state => state.user);
  const fileRef = useRef(null);
  const [image, setImage] = useState(undefined);
  const [imagePercent, setImagePercent] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();
  const [updateSuccess, setUpdateSuccess] = useState(false);

  console.log('formData', formData);
  console.log(imagePercent);

  useEffect(() => {
    if(image) {
      handleImageUpload(image);      
    }
  },[image]);

  const handleImageUpload = async (image) => {
    console.log('image', image);

    const storage = getStorage(app);
    const fileName = new Date().getTime() + image.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, image);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        setImagePercent(Math.round(progress));
      },
    (error) => {
      console.log(error);
      setImageError(true);
    },
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
        setFormData({...formData, profilePicture: downloadUrl});
      });
    }
  );
  };

  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value});

  };

  //console.log(formData);

  const handleSubmit = async (e) => {
    e.preventDefault() ;
    try {
      dispatch(updateUserStart());
      console.log("current user before update", currentUser);
      console.log("and form data", formData);
      //Model.findByIdAndUpdate(id, { name: 'jason bourne' }, options)
      console.log("url for fetch", `/api/user/update/${currentUser._id} ${JSON.stringify(formData)}`);
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if(data.success === false) {
        console.log('failue to update profile');
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch(error) {
      console.log('failure on update caught in profile');
      dispatch(updateUserFailure(error));
    }
  };

  const handleDeleteAccount = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if(data.success === false) {
        dispatch(deleteUserFailure(data));
        return ;
      }
      dispatch(deleteUserSuccess(data));
    } catch(error) {
      console.log('failure on delete caught in profile');
      dispatch(deleteUserFailure(error));      
    }
  };
 
  return (
    <div className="p-3 max-w-lg mx-auto gap-4">
      <h1 className='text-3xl font-semibold text-center my-7'>
        Profile
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input type="file" ref={fileRef} hidden accept='image/*' onChange={(e) => setImage(e.target.files[0])}/>
        <img src={formData.profilePicture || currentUser.profilePicture} 
          alt="profile" 
          className="h-24 w-24 self-center cursor-pointer rounded-full object-cover mt-2"
          onClick={() => fileRef.current.click()}
        />
        <p className="text-sm self-center">
          {imageError ? 
            <span className="text-red-700">Error uploading image (file size must be less than 2MB)</span> : imagePercent > 0 &&
              imagePercent < 100 ? 
                <span className="text-slate-700">{`Uploading:  ${imagePercent} %`}</span> :
                imagePercent === 100 ? 
                <span className="text-green-700">Image uploaded successfully</span> : ''
          }
        </p>
        <input 
          defaultValue={currentUser.userName} 
          type="text" id="userName" 
          placeholder="Username" 
          className="bg-slate-100 rounded-lg p-3"
          onChange={handleChange} 
        />
        <input 
          defaultValue={currentUser.email} 
          type="email" id="email" 
          placeholder="Email" 
          className="bg-slate-100 rounded-lg p-3"
          onChange={handleChange} 
        />
        <input 
          type="password" 
          id="password" placeholder="Password" 
          className="bg-slate-100 rounded-lg p-3"
          onChange={handleChange} 
        />
        <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95    
          disabled:opacity-80">
          {loading ? 'loading...' : 'Update'}
        </button>
      </form>
      <div className="flex justify-between mt-5">
        <span onClick={handleDeleteAccount} className="text-red-700 cursor-pointer">Delete Account</span>
        <span className="text-red-700 cursor-pointer">Sign out</span>
      </div>
      <p className="text-red-700 mt-5">{error && "Something went wrong!"}</p>
      <p className="text-green-700 mt-5">{updateSuccess && "User is updated successfully!"}</p>
    </div>
  );
}
