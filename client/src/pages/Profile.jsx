import React, { useRef, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase.js';

export default function Profile() {
  const imageRef = useRef();
  const { currentUser } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePercent, setFilePercent] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({
    avatar: '',
    username: '',
    email: '',
    password: '',
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

  return (
    <div className="max-w-lg mx-auto p-3">
      <h1 className="text-center font-semibold text-3xl my-7">Profile</h1>
      <form className="flex flex-col gap-4">
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
        />
        <input
          className="border p-3 rounded-lg focus:outline-slate-400"
          id="email"
          type="email"
          placeholder="Email"
        />
        <input
          className="border p-3 rounded-lg focus:outline-slate-400"
          id="password"
          type="password"
          placeholder="Password"
        />
        <button className="bg-slate-700 p-3 text-white uppercase hover:opacity-75 disabled:opacity-80 rounded-lg">
          Update
        </button>
      </form>
      <div className="flex justify-between items-center my-5 hov">
        <span className="text-red-700 cursor-pointer">Delete Account</span>
        <span className="text-red-700 cursor-pointer">Sign Out</span>
      </div>
    </div>
  );
}
