import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function SignIn() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const inputChangeHandler = (e) => {
    setError(null);
    setFormData((currenFormData) => ({
      ...currenFormData,
      [e.target.id]: e.target.value,
    }));
  };

  const formSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/auth/sign-in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!data?.success) {
        throw new Error('Wrong Credentials');
      }
      setLoading(false);
      toast('Sign in successful');
      navigate('/home');
    } catch (error) {
      toast('Something went wrong! Please check your Credentials');
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold py-7">Sign In</h1>
      <form onSubmit={formSubmitHandler} className="flex flex-col gap-4">
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
          {loading ? 'Loading...' : 'Sign In'}
        </button>
      </form>
      <div className="flex gap-2 mt-5 justify-center">
        <p>Dont have an account ?</p>
        <Link to={'/sign-up'}>
          <span className="text-blue-700 hover:underline">Sign Up</span>
        </Link>
      </div>
    </div>
  );
}
