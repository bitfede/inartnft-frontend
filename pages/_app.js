/*
 AUTHOR: Federico G. De  Faveri
 DATE: April 5th, 2021
 PURPOSE: This is the root component of the InArt NFT platform.
*/

// dependencies
import React from "react";
import { DAppProvider, ChainId } from "@usedapp/core";
import settings from "../settings";

//hooks
import { AuthProvider } from "../hooks/auth";
import { LoginProvider } from "../hooks/login";

// assets
import "bootstrap/dist/css/bootstrap.min.css";
import "loaders.css/src/animations/ball-pulse.scss";
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
	return (
		<DAppProvider config={config}>
			<AuthProvider>
				<LoginProvider>
					<Component {...pageProps} />
				</LoginProvider>
			</AuthProvider>
		</DAppProvider>
	);
}

export default MyApp;
