import React, { useState, useEffect } from "react";
import LoginContext from "./context";

import { InjectedConnector } from "@web3-react/injected-connector";
import { Nav, NavDropdown, Navbar, Modal, Button, ListGroup, Image, Spinner, Form } from "react-bootstrap";
import httpClient from '../../utilities/http-client';

//hooks
import { useEthers } from "@usedapp/core";
import { useAuth } from "../auth";
import usePersonalSign from "../usePersonalSign";

//assets
import styles from '../../styles/LoginModal.module.css'

//global variables
const injected = new InjectedConnector({ supportedChainIds: [1, 4, 1337] });

// Provider
const LoginProvider = ({ children }) => {
    
    //state
    const [loginState, setLoginState] = useState(null);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
	const [userData, setUserData] = useState(null);
	const [newUserEmail, setNewUserEmail] = useState(null);
	const [newUsername, setNewUsername] = useState(null);

    //hooks
	const { authToken, userId, logout, saveAuth } = useAuth();
	const { account, activate, activateBrowserWallet, deactivate } = useEthers();
	const sign = usePersonalSign();


    // useEffect functions
    useEffect(() => {
		injected.isAuthorized().then(isAuthorized => {
			if (isAuthorized) {
				activate(injected);
			}
		});
	}, [activate]);

    useEffect( async () => {
		console.log("LOGINSTATE CHANGED", loginState)

		if (!loginState) { return }

		if (loginState.provider === 'metamask' && account && !userData) {
			
			const loginAnswer = await httpClient.post("/User/Login", {
				address: account,
			});
			console.log("API Answer:", loginAnswer);
	
			// TODO: wrap in try catch
			const loginAnswerStatus = loginAnswer.status;
			// TODO: manage all the statuses here!
	
			const loginAnswerData = loginAnswer.data;

			console.log("Get first user data", loginAnswerData);
			setIsLoading(false);
			setUserData(loginAnswerData)

			// if we need to create the user change state and stop execution
			if (loginAnswerData.errormessage === "CREATE_USER") {
				console.log("Create a new user!")
				let newLoginState = {...loginState};

				newLoginState.newUser = true;

				setLoginState(newLoginState);

				return;
			}

			// user found, ask the user to sign the nonce with metamask
			if (loginAnswerData.nonce) {
				signNonceAndAuth(loginAnswerData)
			}


		}


	}, [loginState, account])

    //functions
    const startLogin = () => {
        console.log("login!");
        setIsLoginModalOpen(true);
    }
    
    const _handleSelectLoginProvider = (provider) => {
        console.log("Provider >> ", provider, "selected")
        const newLoginState = {
            provider: "metamask",
            newUser: null 
        }

		setIsLoading(true);
        setLoginState(newLoginState)
        
    }

    const signNonceAndAuth = async (loginAnswerData) => {
		const nonce = loginAnswerData.nonce;
		const sig = await sign(nonce);
		console.log("SIGNED:", sig);

		// new ajax call // wrap in try..catch
		const loginAnswer2 = await httpClient.post("/User/Authentication", {
			...loginAnswerData,
			sign: sig,
		});
		console.log(2, loginAnswer2);

		const loginAnswer2Status = loginAnswer2.status;
		// TODO manage the statuses

		const loginAnswer2Data = loginAnswer2.data;

		const token = loginAnswer2Data.token.access_token;
		// maybe save it in localstorage of browser to persist?
		const userProfile = loginAnswer2Data._user;
		const profileId = userProfile.id;

		saveAuth(token, profileId);

		setTimeout(function () {
			setIsLoginModalOpen(false)
		}, 2000);

	}

    const _handleSubmitRegistration = async () => {
		console.log("Registering", newUserEmail, newUsername)
		setIsLoading(true)

		const loginAnswer = await httpClient.post("/User/Login", {
			address: account,
			username: newUsername,
			mail: newUserEmail 
		});
		console.log("API Answer:", loginAnswer);

		// TODO: wrap in try catch
		const loginAnswerStatus = loginAnswer.status;
		// TODO: manage all the statuses here!

		const loginAnswerData = loginAnswer.data;

		console.log("Res registration API call", loginAnswerData);

		setIsLoading(false);
		setUserData(loginAnswerData)

		
		if (loginAnswerData.nonce) {
			signNonceAndAuth(loginAnswerData)
		}

		//catch other cases...

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

		//metamask selected as provider, and wallet is just connected to webapp
		if (loginState.provider === 'metamask' && account && !loginState.newUser) {
			return (
                <div>
                    <h4>Connect your Metamask wallet</h4>
					<p>Retrieving user info for wallet <strong>{account}</strong></p>
					{ isLoading ? (<Spinner className={styles.loadingSpinner} animation="grow" />) : <p>Please sign the message</p>}
                </div>
            )
		}


		if (loginState.provider === 'metamask' && account && loginState.newUser === true) {
			
			if (userData.errormessage !== "CREATE_USER") {
				console.log("userdata", userData)
				return (
					<div>
						<h4>Register a new account</h4>
						<p>wallet <strong>{account}</strong></p>
						{	isLoading ? (<Spinner className={styles.loadingSpinner} animation="grow" />) :
							(<p>Please sign the message in your metamask window</p>)}
					</div>
				)
			}
			
			
			return (
				<div>
					<h4>Register a new account</h4>
					<p>Wallet ID: <strong>{account}</strong></p>
					<Form.Group>
						<Form.Label>Email address</Form.Label>
						<Form.Control onChange={e => setNewUserEmail(e.target.value)} type="email" placeholder="name@example.com" />
					</Form.Group>
					<Form.Group>
						<Form.Label>Username</Form.Label>
						<Form.Control onChange={e => setNewUsername(e.target.value)} type="username" placeholder="username" />
					</Form.Group>
					{  isLoading ? (  <Button variant="primary" disabled> <Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true"/>Loading...</Button>) :
						(<Button onClick={() => _handleSubmitRegistration()}>Log In</Button>)}
				</div>
			)			
		}

    }

	return (
        <LoginContext.Provider value={{ startLogin }}>
            {children}

            <Modal
                show={isLoginModalOpen}
                onHide={() => setIsLoginModalOpen(false)}
                size="md"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        LOGIN  
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className={styles.modalBodyBigContainer}>
                    { renderLoginModalContent() }
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => setIsLoginModalOpen(false)}>Close</Button>
                </Modal.Footer>
            </Modal>



        </LoginContext.Provider>
    );
};

export default LoginProvider;
