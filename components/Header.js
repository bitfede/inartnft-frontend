
//dependencies
import { useEffect } from "react";
import { InjectedConnector } from "@web3-react/injected-connector";

//hooks
import { useEthers } from "@usedapp/core";
 
import {Link} from 'next/link';
import {Nav, NavDropdown, Navbar } from 'react-bootstrap';

//global variables
const injected = new InjectedConnector({ supportedChainIds: [1, 4, 1337] });

const Header = (props) => {

    console.log("HEADER PROPPI", props)

    const {account, activate, activateBrowserWallet, deactivate} = useEthers()

    useEffect(() => {
        injected.isAuthorized().then((isAuthorized) => {
          if (isAuthorized) {
            activate(injected);
          }
        });
      }, [activate]); 

    
    return (
        <div>
            <Navbar className={"main-app-navbar"} collapseOnSelect expand="lg" >
                <Navbar.Brand id="logoNavContainer" href="/">
                    <img src="/img/InArtNFT-logo.png" id="navbarLogo" />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="mr-auto">
                    </Nav>
                    <Nav>
                    <Nav.Item>
                        <Nav.Link className={"nav-link hvr-underline-from-left"} href="/">Browse</Nav.Link>
                    </Nav.Item>
                    <NavDropdown title="More" id="nav-dropdown">
                        <NavDropdown.Item eventKey="4.1"><Nav.Link href="/faq">What is an NFT?</Nav.Link></NavDropdown.Item>
                        <NavDropdown.Item eventKey="4.2"><Nav.Link href="/faq">FAQ</Nav.Link></NavDropdown.Item>
                        <NavDropdown.Item eventKey="4.3"><Nav.Link href="/careers">Careers</Nav.Link></NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item eventKey="4.4"><Nav.Link href="/contacts">Contacts</Nav.Link></NavDropdown.Item>
                    </NavDropdown>
                    <Nav.Item>
                        <Nav.Link className={"nav-link hvr-underline-from-left"} href="/create">Create</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        { account ? (
                                <Nav.Link className={"nav-link hvr-underline-from-left"} href="/profile">
                                    Profile
                                </Nav.Link>) : (
                            <Nav.Link eventKey="disabled" disabled>
                                Profile
                            </Nav.Link>
                            )
                        }
                    </Nav.Item>
                        { account ? (
                            <Nav.Item>
                                <Nav.Link className={"hvr-underline-from-left btn"} onClick={() => deactivate(false)} href="#" eventKey="logout">Logout</Nav.Link>
                            </Nav.Item>) : (
                            <Nav.Item>
                                <Nav.Link className={"hvr-underline-from-left btn"} onClick={() => console.log("login!")} href="/login" eventKey="login">Login</Nav.Link>
                            </Nav.Item>
                            )
                        }
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </div>
    )
}

export default Header;