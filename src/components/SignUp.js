import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../contexts/AuthContext";
import { useStorage } from "../contexts/StorageContext";
import { useDB } from "../contexts/DBContext";
import { auth } from "../firebase";
import defaultProfilePic from "../assets/defaultProfile.png";
import { Card, Form, Button, Alert, CardImg } from "react-bootstrap";

export default function SignUp () {

        const [profilePic, setProfilePic] = useState(null);
        const [profilePicUrl, setProfilePicUrl] = useState(defaultProfilePic);
        const [username, setUsername] = useState("");
        const [email, setEmail] = useState("");
        const [password, setPassword] = useState("");
        const [passwordConfirm, setPasswordConfirm] = useState("");
        const [bio, setBio] = useState("");

        const [loading, setLoading] = useState(false)
    
        const [error, setError] = useState(false);
        const [errorMessage, setErrorMessage] = useState("");
    
        const navigate = useNavigate();

        const { signUp, updateDisplayName} = useAuth();
        const { uploadProfilePic } = useStorage();
        const { initiateUser } = useDB();
    
        const handleSubmit = async (e) => {
            e.preventDefault();
            setLoading(true);
            if (password == passwordConfirm){
                if (profilePic !== null){
                    try {
                        await signUp(email, password);
                        // insert user profile pic into cloud storage  (currentUser doesnt update on time)
                        await uploadProfilePic(auth.currentUser.uid, profilePic);
                        // update display name in auth 
                        updateDisplayName(username);
                        // insert user into db 
                        await initiateUser(auth.currentUser.uid, bio, email, username, `profileImages/${auth.currentUser.uid}`)
                    } catch(e){ 
                        setError(true);
                        setErrorMessage(e.message)
                    }
                } else {
                    setError(true);
                    setErrorMessage("lacks a profile pic")
                }
            } else {
                setError(true);
                setErrorMessage("Passwords do not match");
            }
            setLoading(false);
        }

        const handleProfilePicChange = (e) => {
            setProfilePicUrl(URL.createObjectURL(e.target.files[0]));
            setProfilePic(e.target.files[0]);
        };
    
        return (
            <div className="d-flex align-items-center justify-content-center" style={{minHeight:"100vh"}}>
        <div className="w-100" style={{maxWidth: "400px"}}>
            <Card className="mt-3">
                <Card.Body >
                    <h2 className="card-title">Lets Register Account</h2>
                    <p className="subtitle">Embark on your your fitness journey</p>
                    {error ? <Alert className="alert-danger">{errorMessage}</Alert> : null}
                    <Form onSubmit={handleSubmit}>
                            <Form.Group className="profilePicArea text-center mb-4">
                                <Card.Img className="round mb-2" style={{borderRadius: "50%", height:"125px", width:"125px"}} src={profilePicUrl}/>
                                <Form.Control className="uploadProfilePicBtn" accept="image/*" type="file" onChange={handleProfilePicChange}/>
                            </Form.Group>
                            <Form.Floating className="mb-4">
                                <Form.Control id="username" type="text" value={username} placeholder="Username" onChange={(e)=>{setUsername(e.target.value)}}/>
                                <Form.Label for="username">Username</Form.Label>
                            </Form.Floating>
                            <Form.Floating className="mb-4">
                                <Form.Control id="email" type="email" value={email} placeholder="Email" onChange={(e)=>{setEmail(e.target.value)}}/>
                                <Form.Label for="email">Email</Form.Label>
                            </Form.Floating>
                            <Form.Floating className="mb-4">
                                <Form.Control required id="password" type="password" value={password} placeholder="Password" onChange={(e)=>{setPassword(e.target.value)}}/>
                                <Form.Label for="password">Password</Form.Label>
                            </Form.Floating>
                            <Form.Floating className="mb-4">
                                <Form.Control required id="confirmPassword" type="password" value={passwordConfirm} placeholder="Confirm Password" onChange={(e)=>{setPasswordConfirm(e.target.value)}}/>
                                <Form.Label for="confirmPassword">Confirm Password</Form.Label>
                            </Form.Floating>
                            <Form.Group className="mb-4">
                            <Form.Control as="textarea" className="bioInput"  required id="bio" rows={4} value={bio} placeholder="Bio" onChange={(e)=>{setBio(e.target.value)}}/>
                            </Form.Group>
                        <Button className="w-100 text-center mt-2" variant="dark" type="submit" disabled={loading}>Sign Up</Button>
                    </Form>  
                </Card.Body>
            </Card>
            <div className="w-100 text-center mt-2">Already have an account? <Link style={{color: "black", textDecoration: 'none'}} to="/login">Sign in now</Link></div>
        </div>
        </div>
        )
}
