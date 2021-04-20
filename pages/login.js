/*
 AUTHOR: Federico G. De Faveri
 DATE: April 13th, 2021
 PURPOSE: This is the login page of the InArt NFT platform.
*/

//dependencies
import { useState } from "react";
import { Container, Row, Col, Card, Button, Modal, Form } from "react-bootstrap";

//hooks
import React, { useEffect } from "react";
import { useEthers, account } from "@usedapp/core";
import { useRouter } from "next/router";

//custom hooks
import { useAuth } from "../hooks/auth";
import usePersonalSign from "../hooks/usePersonalSign";

// library components
import { Avatar, Accordion, AccordionSummary, Typography, AccordionDetails } from "@material-ui/core";
import httpClient from "../utilities/http-client";

// custom components
import Layout from "../components/Layout";

//assets and icons
import styles from "../styles/Login.module.css";

//variables

function Login(props) {
	const { authToken, saveAuth } = useAuth();

	const router = useRouter();
	const { account, activate, activateBrowserWallet, deactivate } = useEthers();
	const sign = usePersonalSign();

	console.log("ACCOUNT ", account);
	console.log("PROPPI", props);

	const [authStatus, setAuthStatus] = useState(null);
	const [username, setUsername] = useState(null);
	const [userEmail, setUserEmail] = useState(null);

	//use effect functions

	//functions ---
	const logInWithMetamask = async account => {
		// address omar 0x7B2E869Cf25f80764F90835Eb8eA63B7dd925138
		// wrap in try..catch
		const loginAnswer = await httpClient.post("/User/Login", {
			address: account,
		});
		console.log("API Answer:", loginAnswer);

        const loginAnswerStatus = loginAnswer.status;
        // TODO: manage all the statuses here!

        const loginAnswerData = loginAnswer.data;

		if (loginAnswerData.errormessage === "CREATE_USER") {
			setAuthStatus("CREATE_USER");
			return;
		}

		if (loginAnswerData.nonce) {
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
				router.push(`/profile/${profileId}`);
			}, 2000);
		}
	};

	const logInWithForm = async account => {
		// wrap in try..catch
		const formRegAnswer = await httpClient.post("/User/Login", {
			address: account,
			username: username,
			mail: userEmail,
		});


		console.log("Form registration answer:", formRegAnswer);

        const formRegAnswerStatus = formRegAnswer.status;
        //TODO: manage statuses

        const formRegAnswerData = formRegAnswer.data;

		if (formRegAnswerData.nonce) {
			const nonce = formRegAnswerData.nonce;
			const sig = await sign(nonce);
			console.log("SIGNED:", sig);

			// new web3 call // wrap in try..catch 
			const formRegAnswer2 = await httpClient.post("/User/Authentication", {
				...formRegAnswerData,
				sign: sig,
			});


            const formRegAnswer2Status = formRegAnswer2.status;
            // TODO: manage all the statuses

            const formRegAnswer2Data = formRegAnswer2.data;

			const token = formRegAnswer2Data.token.access_token;
			// maybe save it in localstorage of browser to persist?
			const userProfile = formRegAnswer2Data._user;
			const profileId = userProfile.id;

			saveAuth(token, profileId);

			setTimeout(function () {
				router.push(`/`);
			}, 2000);
		}
	};

	//render functions
	const outputLoginSection = () => {
		if (authToken) {
			return (
				<div className={styles.loginContainer}>
					<Typography variant="h5">Redirecting to profile page...</Typography>
				</div>
			);
		}

		if (!account) {
			return (
				<div className={styles.loginContainer}>
					<Typography variant="h3">Connect your Metamask Wallet</Typography>
					<Button onClick={() => activateBrowserWallet()}>Connect Metamask</Button>
				</div>
			);
		} else if (account && !authStatus) {
			return (
				<div className={styles.loginContainer}>
					<Typography variant="h5">Welcome {account}</Typography>
					<Button onClick={() => logInWithMetamask(account)}>Log In</Button>
				</div>
			);
		} else if (account && authStatus === "CREATE_USER") {
			return (
				<div className={styles.loginContainer}>
					<Typography variant="h5">Register account with {account}</Typography>
					<Form.Group>
						<Form.Label>Email address</Form.Label>
						<Form.Control onChange={e => setUserEmail(e.target.value)} type="email" placeholder="name@example.com" />
					</Form.Group>
					<Form.Group>
						<Form.Label>Username</Form.Label>
						<Form.Control onChange={e => setUsername(e.target.value)} type="username" placeholder="username" />
					</Form.Group>
					<Button onClick={() => logInWithForm(account)}>Log In</Button>
				</div>
			);
		}
	};

	//render
	return (
		<Layout title="Login">
			{outputLoginSection()}
		</Layout>
	);
}

export default Login;
