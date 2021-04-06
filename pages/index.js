/*
 AUTHOR: Federico G. De Faveri
 DATE: April 6th, 2021
 PURPOSE: This is the home page of the InArt NFT platform.
*/

//dependencies

//hooks
import { useEthers } from '@usedapp/core';

//components
import Head from 'next/head'

//assets
import styles from '../styles/Home.module.css'

export default function Home() {

  const { activateBrowserWallet } = useEthers();

  return (
    <div className={styles.container}>
      <Head>
        <title>InArt NFT</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        
      </main>
    </div>
  )
}
