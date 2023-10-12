import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom'

const Login = ()=> {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('');
    const navigate = useNavigate()
    
    useEffect(()=> {
        const auth = localStorage.getItem("user");

        if(auth) {
            navigate('/')
        }
    })

    const handleLogin = async ()=> {
        let result = await fetch('/api/user/login', {
            method:'POST',
            body:  JSON.stringify({email, password}),
            headers: {
                'Content-Type' : 'application/json'
            }
        })

        result = await result.json();
        if(result.auth) {
            localStorage.setItem("user", JSON.stringify(result.user));
            localStorage.setItem("token", JSON.stringify(result.auth));
            navigate('/')
        }
        else {
            alert('Please Enter Correct Details')
        }
        // console.log(result)
    }

    return(
        <div className='login'>
            <h1>Login</h1>
            <input className='input-box' type="email" placeholder='Enter your email' onChange={(event)=>setEmail(event.target.value)} />
            <input className='input-box' type="password" placeholder='Enter password' onChange={(event)=>setPassword(event.target.value)} />
            <button className="app-button" type="button" onClick={handleLogin}>Login</button>

        </div>
    )
}

export default Login;