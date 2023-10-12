import React, {useState} from 'react'
import {useParams, useNavigate} from 'react-router-dom'

const EditProfile = ()=> {
    const user = JSON.parse(localStorage.getItem("user"));
    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);
    const [phone, setPhone] = useState(user.phone);
    const params = useParams()
    const navigate = useNavigate()


    const updatedProfile = async ()=> {
        let user = await fetch(`/api/user/profile/${params.id}`, {
            headers: {
                authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
            }
        })
        user = await user.json()
        // console.log(user)
        localStorage.setItem("user", JSON.stringify(user[0]));
        navigate('/profile')
    }

    const handleEditProfile =async ()=> {
        // console.log(name, email, phone)
        let data = await fetch(`/api/user/profile/edit/${params.id}`, {
            method:'PUT',
            body: JSON.stringify({name, email, phone}),
            headers: {
                'Content-Type':'application/json',
                authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
            }
        })
        data = await data.json()
        // console.log(data)
        if(data.modifiedCount === 1) {
            alert('Profile Updated Successfully..!')
            updatedProfile();
        }
        else {
            navigate('/profile')
        }
    }

    return(
        <div className='profile'>
            <h1>Edit Your Profile</h1>
            <input type="text" className='input-box' placeholder='Enter your name...!' value={name} onChange={(e)=>setName(e.target.value)} />
            <input type="email" className='input-box' placeholder='Enter your Email...!' value={email} onChange={(e)=>setEmail(e.target.value)} />
            <input type="text" className='input-box' placeholder='Enter your phone number...!' value={phone} onChange={(e)=>setPhone(e.target.value)}  />
            <button className='app-button' onClick={handleEditProfile}>Save</button>
        </div>
    )
}

export default EditProfile;