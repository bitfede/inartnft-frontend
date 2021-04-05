/*
 AUTHOR: Federico G. De Faveri
 DATE: April 5th, 2021
 PURPOSE: This is the root component of the InArt NFT platform.
*/

// dependencies
import {DAppProvider, ChainId} from '@usedapp/core';

// assets
import '../styles/globals.css';

// global variables
const config = {
  readOnlyChainId: ChainId.Mainnet,
  readOnlyUrls: {
    [ChainId.Mainnet]: 'https://mainnet.infura.io/v3/62687d1a985d4508b2b7a24827551934',
  },
}

function MyApp({ Component, pageProps }) {
  return (
    <DAppProvider config={config}>
      <Component {...pageProps} />
    </DAppProvider>
  )
}

export default MyApp
