import styled from "styled-components";
import { useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext"

export default function Login () {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false)

    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const { logIn, resetPassword } = useAuth();

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await logIn(email, password)
            navigate("/")
        } catch(e){ 
            setError(true);
            setErrorMessage(e.message)
        }
        setLoading(false);
    }

    const handlePasswordReset = async (e) => {
        e.preventDefault();
        try{
            await resetPassword(email);
            console.log("success");
        } catch (e) {
            setError(true)
            setErrorMessage(e.message)
        }
    }

    return (
    <div className="container">
        <p className="title">Lets Sign you in</p>
        <p className="subtitle">Welcome back </p>
        <p className="subtitle">You have been missed</p>
        <form className="login" onSubmit={handleSubmit}>
                <input id="email" type="email" value={email} placeholder="Email" onChange={(e)=>{setEmail(e.target.value)}}></input>
                <section className="resetSection">
                    <input required id="password" type="password" value={password} placeholder="Password" onChange={(e)=>{setPassword(e.target.value)}}></input>
                    <button id="resetPassword" className="passwordReset" type="button" onClick={handlePasswordReset}>Reset password?</button>
                </section>
            <button className="submitBtn" type="submit" disabled={loading}>Sign in</button>
            {error ? <p className="errorMessage">{errorMessage}</p> : null}
        </form>
        <p className="redirect">Don't have an account? <Link style={{color: "black", textDecoration: 'none'}} to="/signup">Sign up now</Link></p>
    </div>)
}
