import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from '../redux/user/userSlice';
import OAuth from '../components/OAuth';

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signInSuccess(data));
      navigate('/');
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };
  const handleShowPasswordChange = () => {
    setShowPassword(!showPassword);
  };
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-md">
        <div className="bg-white border border-gray-300 rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-semibold text-center mb-7">
  <span style={{ textDecoration: 'underline' ,
                color: 'linear-gradient(to right, #7f8a9e, #4a5568)'
                    }}>Log</span>in
</h1>
          <form onSubmit={handleSubmit}  className='flex flex-col gap-4'>
          <div className="relative">
              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                id="email"
                onChange={handleChange}
              />
              <FaEnvelope className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                id="password"
                onChange={handleChange}
              />
              <FaLock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            </div>
            <div className="flex items-center justify-between">
  <label htmlFor="showPassword" className="text-gray-600">

    <input
      type="checkbox"
      id="showPassword"
      className="mr-2 text-gray-400"
      checked={showPassword}
      onChange={handleShowPasswordChange}
    />
    Show Password
  </label>
</div>
            <button
              disabled={loading}
              className="w-full bg-slate-700  text-white py-3 rounded-lg  hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              style={{
                background: 'linear-gradient(to right, #657084, #4a5568)',
                color: 'white',
              }}
            >
              {loading ? 'Loading...' : 'Login'}
              </button>
              <div className='rounded-lg py-2 hover:scale-105 flex flex-col gap-4'>
            <OAuth />
            </div>
          </form>

          {error && <p className="text-red-500 mt-5 text-center">{error}</p>}
          <div className="mt-5">
          <p className="text-center text-sm text-gray-600">Don't have an account?
        <Link to={'/sign-up'}>
        <span className='text-indigo-700 hover:underline font-bold'> Create new account</span>
        </Link>
        </p>
      </div>
    </div>
        </div>
      </div>
   
  );
}