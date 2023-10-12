import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("")
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    useEffect(()=> {
        const auth = localStorage.getItem("user");
        if(auth) {
            navigate('/')
        }
    })

    const handleSignup = async () => {
        // console.log(name, email, password);
        let result = await fetch("/api/user/register", {
            method: "POST",
            body: JSON.stringify({
                name,
                email,
                phone,
                password,
            }),
            headers: {
                "Content-Type": "application/json",
            },
        });
        result = await result.json();
        // console.log(result);
        // below code will store the user data into the localstorage and then page will be redirected to home page
        localStorage.setItem("user",JSON.stringify(result.result))
        localStorage.setItem("token",JSON.stringify(result.auth))
        if (result) {
            navigate("/");
        }
    };

    return (
        <div className="register">
            <h1>Register</h1>
            <input
                className="input-box"
                type="text"
                onChange={(event) => setName(event.target.value)}
                value={name}
                placeholder="Enter your name"
            />
            <input
                className="input-box"
                type="email"
                onChange={(event) => setEmail(event.target.value)}
                value={email}
                placeholder="Enter your email"
            />
            <input
                className="input-box"
                type="text"
                onChange={(event) => setPhone(event.target.value)}
                value={phone}
                placeholder="Enter your phone number"
            />
            <input
                className="input-box"
                type="password"
                onChange={(event) => setPassword(event.target.value)}
                value={password}
                placeholder="Enter password"
            />
            <button className="app-button" type="button" onClick={handleSignup}>
                Sign Up
            </button>
        </div>
    );
};

export default SignUp;
