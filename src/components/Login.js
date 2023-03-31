import styled from "styled-components";
import { useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext"
import { Card, Form, Button, Alert } from "react-bootstrap";

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
    <div className="w-100" style={{maxWidth: "400px"}}>
    <Card>
        <Card.Body>
            <h2 className="card-title mb-2">Lets Sign you in</h2>
            {error ? <Alert className="alert-danger">{errorMessage}</Alert> : null}
            <Form onSubmit={handleSubmit}>
                <Form.Floating className="mb-3">
                    <Form.Control id="email" type="email" value={email} placeholder="Email" onChange={(e)=>{setEmail(e.target.value)}} />
                    <Form.Label for="email">Email</Form.Label>
                </Form.Floating>
                <Form.Floating className="mb-3">
                    <Form.Control required id="password" type="password" value={password} placeholder="Password" onChange={(e)=>{setPassword(e.target.value)}}/>
                    <Form.Label for="password">Password</Form.Label>
                    <div id="resetPassword" className="form-text" type="button" onClick={handlePasswordReset}>Reset password?</div>
                </Form.Floating>
                <Button className="w-100 text-center mt-2 black btn-dark" type="submit" disabled={loading}>Sign in</Button>
            </Form>
        </Card.Body>
    </Card>
     <div className="w-100 text-center mt-2">Don't have an Account?<Link style={{color: "black", textDecoration: 'none'}} to="/signup"> Sign up now</Link></div>
    </div>
    ) 
}
