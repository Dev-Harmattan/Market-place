import React, { useRef, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase.js';
import {
  clearError,
  userUpdateFailure,
  userUpdateStart,
  userUpdateSuccess,
} from '../store/user/userSlice.js';

export default function Profile() {
  const imageRef = useRef();
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [file, setFile] = useState(undefined);
  const [filePercent, setFilePercent] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({
    avatar: currentUser.avatar || '',
    username: currentUser.username || '',
    email: currentUser.email || '',
    password: currentUser.password || '',
  });

  console.log(formData);

  useEffect(() => {
    if (file) {
      handleFileChange(file);
    }
  }, [file]);

  const handleFileChange = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);

    //Upload file and metadata
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePercent(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, avatar: downloadURL });
        });
      }
    );
  };

  const handleInputChange = (e) => {
    dispatch(clearError());
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(userUpdateStart());
      const response = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success === false) {
        dispatch(userUpdateFailure(data.message));
        return;
      }

      dispatch(userUpdateSuccess(data));
      toast('User updated successfully!');
    } catch (error) {
      dispatch(userUpdateFailure(error.message));
    }
  };

  return (
    <div className="max-w-lg mx-auto p-3">
      <h1 className="text-center font-semibold text-3xl my-7">Profile</h1>
      <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={imageRef}
          hidden
          accept="image/*"
        />
        <img
          className="self-center w-24 h-24 rounded-full cursor-pointer"
          src={formData.avatar || currentUser.avatar}
          alt="Profile"
          onClick={() => imageRef.current.click()}
        />
        {fileUploadError ? (
          <span className="text-red-700 text-center">Image Upload Error</span>
        ) : filePercent > 0 && filePercent < 100 ? (
          <span className="text-slate-700 text-center">{`Uploading ${filePercent}%`}</span>
        ) : (
          filePercent === 100 && (
            <span className="text-green-700 text-center">
              Successfully Uploaded
            </span>
          )
        )}
        <input
          className="border p-3 rounded-lg focus:outline-slate-400"
          id="username"
          type="text"
          placeholder="Username"
          defaultValue={currentUser.username}
          onChange={handleInputChange}
        />
        <input
          className="border p-3 rounded-lg focus:outline-slate-400"
          id="email"
          type="email"
          placeholder="Email"
          defaultValue={currentUser.email}
          onChange={handleInputChange}
        />
        <input
          className="border p-3 rounded-lg focus:outline-slate-400"
          id="password"
          type="password"
          placeholder="Password"
          onChange={handleInputChange}
        />
        <button
          disabled={loading}
          className="bg-slate-700 p-3 text-white uppercase hover:opacity-75 disabled:opacity-80 rounded-lg"
        >
          {loading ? 'Updating...' : 'Update'}
        </button>
      </form>
      <div className="flex justify-between items-center my-5 hov">
        <span className="text-red-700 cursor-pointer">Delete Account</span>
        <span className="text-red-700 cursor-pointer">Sign Out</span>
      </div>
      {error && <div className="text-red-700 text-center mt-5">{error}</div>}
    </div>
  );
}
