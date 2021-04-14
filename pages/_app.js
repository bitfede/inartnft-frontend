/*
 AUTHOR: Federico G. De Faveri
 DATE: April 5th, 2021
 PURPOSE: This is the root component of the InArt NFT platform.
*/

// dependencies
import { useState } from "react";
import {DAppProvider, ChainId} from '@usedapp/core';

// assets
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/globals.css';
import '../styles/Header.css';
import '../styles/Footer.css';
import '../styles/Home.css';
import '../styles/ArtProductDetailPage.css';

// global variables
const config = {
  readOnlyChainId: ChainId.Mainnet,
  readOnlyUrls: {
    [ChainId.Mainnet]: 'https://mainnet.infura.io/v3/436480aea3834d7dacd1d2bfbe017f1c',
  },
}

function MyApp({ Component, pageProps }) {

  const [authToken, setAuthToken] = useState(null)


  return (
    <DAppProvider config={config}>
      <Component authToken={authToken} setAuthToken={setAuthToken} {...pageProps} />
    </DAppProvider>
  )
}

export default MyApp
