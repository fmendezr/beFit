import { Tabs, Tab, Container } from "react-bootstrap";
import NavbarComponent from "./Navbar";

export default function Friends () {

    return (
    <div className="w-100" style={{minHeight: "100vh"}}>
        <NavbarComponent />
        <Tabs
            defaultActiveKey="Friends"
            id="fill-tab-example"
            className="mb-3 mt-3"
            fill
        >
            <Tab eventKey="Search" title="Search">
                <Container as="div" className="w-80" bg="black" style={{height: "100px", background: "black"}}>
                    
                </Container>
            </Tab>
            <Tab eventKey="Friends" title="Friends">
               
            </Tab>
            <Tab eventKey="requests" title="Requests">
                <Container as="div" className="w-80" bg="black" style={{height: "100px", background: "black"}}>

                </Container>
            </Tab>
        </Tabs>
    </div>
    )
}