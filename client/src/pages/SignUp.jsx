import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import OAuth from '../components/OAuth';

export default function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  

  const inputChangeHandler = (e) => {
    setFormData((currenFormData) => ({
      ...currenFormData,
      [e.target.id]: e.target.value,
    }));
  };

  const formSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/auth/sign-up', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data?.success === false) {
        toast('Something went wrong, Please check your credentials');
        setError(data.message);
        return;
      }
      setLoading(false);
      setError(null);
      toast('Sign up successful');
      navigate('/sign-in');
      console.log(data);
    } catch (error) {
      toast('Something went wrong! Please check your Credentials');
      setError(error.message);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold py-7">Sign Up</h1>
      <form onSubmit={formSubmitHandler} className="flex flex-col gap-4">
        <input
          className="border rounded-md p-3 focus:outline-slate-400"
          id="username"
          type="text"
          placeholder="Username"
          onChange={inputChangeHandler}
          value={formData.username}
        />
        <input
          className="border rounded-md p-3 focus:outline-slate-400"
          id="email"
          type="email"
          placeholder="Email"
          onChange={inputChangeHandler}
          value={formData.email}
        />
        <input
          className="border rounded-md p-3 focus:outline-slate-400"
          id="password"
          type="password"
          placeholder="Password"
          onChange={inputChangeHandler}
          value={formData.password}
        />
        {error && <div className="my-2 text-red-500 text-center">{error}</div>}
        <button
          disabled={loading}
          className="bg-slate-700 p-3 text-white uppercase hover:opacity-75 disabled:opacity-80 rounded-lg"
        >
          {loading ? 'Loading...' : 'Sign Up'}
        </button>
        <OAuth />
      </form>
      <div className="flex gap-2 mt-5 justify-center">
        <p>Have an account ?</p>
        <Link to={'/sign-in'}>
          <span className="text-blue-700 hover:underline">Sign in</span>
        </Link>
      </div>
    </div>
  );
}
