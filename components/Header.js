//dependencies
import React, { useEffect, useState } from "react";
import { InjectedConnector } from "@web3-react/injected-connector";
import { Nav, NavDropdown, Navbar, Modal, Button, ListGroup, Image, Spinner } from "react-bootstrap";
import httpClient from '../utilities/http-client';

//hooks
import { useEthers } from "@usedapp/core";
import { useAuth } from "../hooks/auth";

//assets
import styles from '../styles/Header.module.css'

//global variables
const injected = new InjectedConnector({ supportedChainIds: [1, 4, 1337] });

const Header = () => {

    //state
    const [loginState, setLoginState] = useState(null);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    //hooks
	const { authToken, userId, logout } = useAuth();
	const { account, activate, activateBrowserWallet, deactivate } = useEthers();

    //useEffect functions
	useEffect(() => {
		injected.isAuthorized().then(isAuthorized => {
			if (isAuthorized) {
				activate(injected);
			}
		});
	}, [activate]);

	useEffect( async () => {
		console.log("LOGINSTATE CHANGED")

		if (!loginState) { return }

		if (loginState.provider === 'metamask' && account) {
			
			const loginAnswer = await httpClient.post("/User/Login", {
				address: account,
			});
			console.log("API Answer:", loginAnswer);
	
			const loginAnswerStatus = loginAnswer.status;
			// TODO: manage all the statuses here!
	
			const loginAnswerData = loginAnswer.data;

			console.log("DATAAAAA", loginAnswerData)

		}


	}, [loginState])

    //functions
    const _startLoginFlow = () => {
        console.log("login!");
        setIsLoginModalOpen(true);
    }

    const _handleSelectLoginProvider = (provider) => {
        console.log("Provider >> ", provider, "selected")
        const newLoginState = {
            provider: "metamask",
            walletConnected: false,
            newUser: null 
        }

		setIsLoading(true);
        setLoginState(newLoginState)
        
    }

    //UI render functions
    const renderLoginModalContent = () => {
		
		console.log("ACCOUNT META", account)

        //first screen, select login provider (only metamask for now)
        if (loginState === null) {
            return (
                <div>
                    <h4>Select Web3 Provider</h4>
                    <ListGroup >
                        <ListGroup.Item action onClick={() => _handleSelectLoginProvider("metamask")}>
                            <Image id={styles.metamaskLogoIcon} src={"/img/metamask-logo.svg"} /> Login with Metamask
                        </ListGroup.Item>
                    </ListGroup>
                </div>
            )
        }

		// metamask selected as provider, but wallet not connected to webapp
        if (loginState.provider === "metamask" && !account) {
            // activateBrowserWallet()
            return (
                <div>
                    <h4>Connect your Metamask wallet</h4>
					<Button onClick={() => activateBrowserWallet()}>Connect Metamask</Button>
                </div>
            )
        }

		//metamask selected as provider, and wallet is connected to webapp
		if (loginState.provider === 'metamask' && account) {
			return (
                <div>
                    <h4>Connect your Metamask wallet</h4>
					<p>Retrieving user info for wallet <strong>{account}</strong></p>
					{ isLoading ? (<Spinner className={styles.loadingSpinner} animation="grow" />) : <p>Please sign the message</p>}
                </div>
            )
		}

    }

	return (
		<div>
			<Navbar className={"main-app-navbar"} collapseOnSelect expand="lg">
				<Navbar.Brand id="logoNavContainer" href="/">
					<img src="/img/InArtNFT-logo.png" id="navbarLogo" />
				</Navbar.Brand>
				<Navbar.Toggle aria-controls="responsive-navbar-nav" />
				<Navbar.Collapse id="responsive-navbar-nav">
					<Nav className="mr-auto"></Nav>
					<Nav>
						<Nav.Item>
							<Nav.Link className={"nav-link hvr-underline-from-left"} href="/">
								Browse
							</Nav.Link>
						</Nav.Item>
						<NavDropdown title="More" id="nav-dropdown">
							<NavDropdown.Item eventKey="4.1">
								<Nav.Link href="/faq">What is an NFT?</Nav.Link>
							</NavDropdown.Item>
							<NavDropdown.Item eventKey="4.2">
								<Nav.Link href="/faq">FAQ</Nav.Link>
							</NavDropdown.Item>
							<NavDropdown.Item eventKey="4.3">
								<Nav.Link href="/careers">Careers</Nav.Link>
							</NavDropdown.Item>
							<NavDropdown.Divider />
							<NavDropdown.Item eventKey="4.4">
								<Nav.Link href="/contacts">Contacts</Nav.Link>
							</NavDropdown.Item>
						</NavDropdown>
						<Nav.Item>
							<Nav.Link className={"nav-link hvr-underline-from-left"} href="/create">
								Create
							</Nav.Link>
						</Nav.Item>
						<Nav.Item>
							{authToken && userId ? (
								<Nav.Link className={"nav-link hvr-underline-from-left"} href={`/profile/${userId}`}>
									Profile
								</Nav.Link>
							) : (
								<Nav.Link eventKey="disabled" disabled>
									Profile
								</Nav.Link>
							)}
						</Nav.Item>
						{authToken ? (
							<Nav.Item>
								<Nav.Link className={"hvr-underline-from-left btn"} onClick={() => logout()} href="#" eventKey="logout">
									Logout
								</Nav.Link>
							</Nav.Item>
						) : (
							<Nav.Item>
								<Nav.Link className={"hvr-underline-from-left btn"} onClick={() => _startLoginFlow()} eventKey="login">
									Login
								</Nav.Link>
							</Nav.Item>
						)}
					</Nav>
				</Navbar.Collapse>
			</Navbar>

            <Modal
                show={isLoginModalOpen}
                onHide={() => setIsLoginModalOpen(false)}
                size="md"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                    Login  
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className={styles.modalBodyBigContainer}>
                    { renderLoginModalContent() }
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => setIsLoginModalOpen(false)}>Close</Button>
                </Modal.Footer>
            </Modal>


		</div>
	);
};

export default Header;
