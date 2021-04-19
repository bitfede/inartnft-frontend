/*
 AUTHOR: Federico G. De  Faveri
 DATE: April 5th, 2021
 PURPOSE: This is the root component of the InArt NFT platform.
*/

// dependencies
import React from "react";
import { DAppProvider, ChainId } from "@usedapp/core";
import settings from "../settings";

// assets
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/globals.css";
import "../styles/Header.css";
import "../styles/Footer.css";
import "../styles/Home.css";
import "../styles/ArtProductDetailPage.css";
import { AuthProvider } from "../hooks/auth";

// global variables
const config = {
	readOnlyChainId: ChainId.Mainnet,
	readOnlyUrls: {
		[ChainId.Mainnet]: settings.Endpoints.Mainnet,
	},
};

function MyApp({ Component, pageProps }) {
	return (
		<DAppProvider config={config}>
			<AuthProvider>
				<Component {...pageProps} />
			</AuthProvider>
		</DAppProvider>
	);
}

export default MyApp;
