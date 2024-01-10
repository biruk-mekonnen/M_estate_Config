import { useSelector } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable, 
} from 'firebase/storage';
import { app } from '../firebase';
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserStart,
} from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined); 
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const dispatch = useDispatch();
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  
  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch('/api/auth/signout');
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(data.message));
    }
  };

  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingsError(true);
        return;
      }

      setUserListings(data);
    } catch (error) {
      setShowListingsError(true);
    }
  };

  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }

      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {updateSuccess && <p>Profile updated successfully!</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className="block font-semibold mb-2">
            Username
          </label>
          <input
            type="text"
            id="username"
            className="border border-gray-300 rounded p-2 w-full"
            value={formData.username || ''}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="password" className="block font-semibold mb-2">
            Password
          </label>
          <input
            type="password"
            id="password"
            className="border border-gray-300 rounded p-2 w-full"
            value={formData.password || ''}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="email" className="block font-semibold mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            className="border border-gray-300 rounded p-2 w-full"
            value={formData.email || ''}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="avatar" className="block font-semibold mb-2">
            Profile Picture
            
          </label>
          <input
            type="file"
            id="avatar"
            ref={fileRef}
            className="hidden"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <button
            type="button"
            className="bg-slate-700 text-white px-4 py-2 rounded"
            onClick={() => fileRef.current.click()}
          >
            Upload profile
          </button>
          
          {fileUploadError && <p>Error uploading file</p>}
          {file && <p>File upload progress: {filePerc}%</p>}
        </div>
        <button
          type="submit"
          className="bg-slate-700 text-white px-4 py-2 rounded"
        >
          Update Profile
          
        </button>
        
      </form>
      <Link className='link-button' to={'/create-listing'}>
        <button>Create Listing</button>
        </Link>
      <h2 className="text-xl font-bold mt-8 mb-4">Your Listings</h2>
      {showListingsError && <p>Error fetching listings</p>}
      {userListings.length === 0 ? (
        <p>No listings found</p>
      ) : (
        <ul className="space-y-4">
          {userListings.map((listing) => (
            <li key={listing._id} className="border p-4">
              <p>{listing.title}</p>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded mt-2"
                onClick={() => handleListingDelete(listing._id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="flex justify-between mt-4">
        <button
          className="bg-red-500 text-white px-4 py-2 rounded"
          onClick={handleDeleteUser}
        >
          Delete Account
        </button>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleShowListings}
        >
          Show Listings
        </button>
       
        <button
          className="bg-red-500 text-white px-4 py-2 rounded"
          onClick={handleSignOut}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
