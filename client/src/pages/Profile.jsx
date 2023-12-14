import React from 'react';
import { useSelector } from 'react-redux';

export default function Profile() {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <div className="max-w-lg mx-auto p-3">
      <h1 className="text-center font-semibold text-3xl my-7">Profile</h1>
      <form className="flex flex-col gap-4">
        <img
          className="self-center w-24 h-24 rounded-full cursor-pointer"
          src={currentUser.avatar}
          alt="Profile"
        />
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
