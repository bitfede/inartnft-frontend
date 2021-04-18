/*
 AUTHOR: Federico G. De  Faveri
 DATE: April 5th, 2021
 PURPOSE: This is the root component of the InArt NFT platform.
*/

// dependencies
import React, { useState, useEffect } from "react";
import { DAppProvider, ChainId } from "@usedapp/core";
import settings from "../settings";

// assets
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/globals.css";
import "../styles/Header.css";
import "../styles/Footer.css";
import "../styles/Home.css";
import "../styles/ArtProductDetailPage.css";

// global variables
const config = {
	readOnlyChainId: ChainId.Mainnet,
	readOnlyUrls: {
		[ChainId.Mainnet]: settings.Endpoints.Mainnet,
	},
};

function MyApp({ Component, pageProps }) {
	const [authToken, setAuthToken] = useState(null);
	const [userId, setUserId] = useState(null);

	useEffect(() => {
		if (typeof window !== "undefined") {
			if (localStorage.authToken) {
				setAuthToken(localStorage.authToken);
			}
			if (localStorage.userId) {
				setUserId(localStorage.userId);
			}
		}
	});

	return (
		<DAppProvider config={config}>
			<Component userId={userId} setUserId={setUserId} authToken={authToken} setAuthToken={setAuthToken} {...pageProps} />
		</DAppProvider>
	);
}

export default MyApp;
