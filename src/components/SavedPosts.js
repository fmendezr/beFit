import { Container, Row } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useDB } from "../contexts/DBContext";
import NavbarComponent from "./Navbar";
import SavedPostPreview from "./SavedPostPreview";


export default function SavedPosts () {

    const {currentUser} = useAuth();
    const {getUser} = useDB();

    const [savedPostsIds, setSavedPostsIds] = useState([]);
    
    useEffect(() => {
        const getSavedPostsIDs = async () => {
            const rawUserData = await getUser(currentUser.uid);
            if (rawUserData.exists()){
                const userData = rawUserData.data();
                const savedPostsInfo = userData.savedPosts.reverse()
                setSavedPostsIds(savedPostsInfo)
            }
        }
        getSavedPostsIDs();
    }, [])

    return (
        <div className="w-100" style={{minHeight: "100vh"}}>
            <NavbarComponent sticky={true}/>
            <Container as="div" className="mt-4">
                <Row as="div">
                    <h2 stly>Saved Posts</h2>
                </Row>
                <Row className="savedPostContainer" style={{display: "flex", flexWrap: "wrap", gap: "20px"}}>
                        {savedPostsIds.map((post) => {
                            return (
                                <SavedPostPreview 
                                    key={post}
                                    postId={post}
                                />
                            )
                        })}
                    </Row>
            </Container>
        </div>
    )
}