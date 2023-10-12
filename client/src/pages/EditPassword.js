import React, {useState} from 'react'
import {useParams, useNavigate} from 'react-router-dom'

const EditPassword = ()=> {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const params = useParams()
    const navigate = useNavigate()


    const handlePasswordChange = async ()=> {
        if(confirmPassword === newPassword && newPassword.length > 0) {
            let data = await fetch(`/api/user/profile/change/password/${params.id}`, {
                method: 'PUT',
                body: JSON.stringify({currentPassword, newPassword}),
                headers:{
                    'Content-Type':'application/json',
                    authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
                }
            })
            data = await data.json();
            // console.log(data)
            if(data.modifiedCount === 1) {
                alert('Password Updated Successfully..!')
                navigate('/profile')
            }
            else {
                alert('Enter cuurent password correctly..!')
            }
        }
        else {
            alert('Please enter new password and confirm password correctly..!')
        }
    }

    return(
        <div className='profile'>
            <h1>Edit Your Password</h1>
            <input type="password" className='input-box' placeholder='Enter current password...!' value={currentPassword} onChange={(e)=>setCurrentPassword(e.target.value)} />
            <input type="password" className='input-box' placeholder='Enter new password...!' value={newPassword} onChange={(e)=>setNewPassword(e.target.value)} />
            <input type="password" className='input-box' placeholder='Confirm your new password...!' value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)} />
            <button className='app-button' onClick={handlePasswordChange}>Save Changes</button>
        </div>
    )
}

export default EditPassword;