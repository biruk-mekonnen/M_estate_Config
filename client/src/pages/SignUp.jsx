import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock } from 'react-icons/fa';
import OAuth from '../components/OAuth';

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        setLoading(false);
        setError(data.message);
        return;
      }
      setLoading(false);
      setError(null);
      navigate('/sign-in');
    } catch (error) {
      setLoading(false);
      setError(error.message);
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
            <span style={{ textDecoration: 'underline' }}>Reg</span>ister
          </h1>
          <form onSubmit={handleSubmit} className= 'flex flex-col gap-4'>
            <div className="relative">
              <input
                type="text"
                placeholder="Username"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                id="username"
                onChange={handleChange}
              />
              <FaUser className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            </div>
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
              className="w-full bg-slate-700 text-white py-3 rounded-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              style={{
                background: 'linear-gradient(to right, #657084, #4a5568)',
                color: 'white',
              }}
            >
              {loading ? 'Loading...' : 'Register'}
            </button>
            <div className='rounded-lg py-2 hover:scale-105 flex flex-col gap-4'>
            <OAuth />
            </div>
          </form>
          {error && <p className="text-red-500 mt-5 text-center">{error}</p>}
          <div className="mt-5">
            <p className="text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/sign-in" className="text-indigo-700 hover:underline font-bold">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}