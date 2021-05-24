import React, { useState, useEffect } from "react";
import LoginContext from "./context";
import LoginModal from "../../components/LoginModal";

import { InjectedConnector } from "@web3-react/injected-connector";
import httpClient from '../../utilities/http-client';

//hooks
import { useEthers } from "@usedapp/core";
import { useAuth } from "../auth";
import usePersonalSign from "../usePersonalSign";

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
				activateBrowserWallet(injected);
			}
		});
	}, [activateBrowserWallet]);

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

	return (
        <LoginContext.Provider value={{ startLogin }}>
            {children}
            <LoginModal
                isLoginModalOpen={isLoginModalOpen}
                setIsLoginModalOpen={setIsLoginModalOpen} 
                loginState={loginState}
                _handleSelectLoginProvider={_handleSelectLoginProvider}
                _handleSubmitRegistration={_handleSubmitRegistration}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                setNewUserEmail={setNewUserEmail}
                setNewUsername={setNewUsername}
                userData={userData}
            />
        </LoginContext.Provider>
    );
};

export default LoginProvider;
