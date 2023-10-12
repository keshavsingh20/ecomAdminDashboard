import React from 'react';
import { Link } from 'react-router-dom'

const Profile = () => {
    let user = localStorage.getItem("user");
    user = JSON.parse(user);


    return (
        <div className='profile'>
            <h1>Your Profile</h1>
            <input type="text" className='input-box' placeholder='Enter your name...!' value={user.name} readOnly />
            <input type="email" className='input-box' placeholder='Enter your Email...!' value={user.email} readOnly />
            <input type="text" className='input-box' placeholder='Enter your phone number...!' value={user.phone} readOnly />
            {/* <input type="text" placeholder='Enter your Email...!' /> */}
            <div style={{ marginTop: '40px' }}>
                <Link to={`/edit/profile/${user._id}`} className='profile-button' style={{ textDecoration: 'none', color:'black' }}>Update Profile</Link>
                <Link to={`/edit/password/${user._id}`} className='profile-button' style={{ textDecoration: 'none', color:'black' }}>Change Password</Link>
            </div>
        </div>
    )
}

export default Profile;