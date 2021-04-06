/*
 AUTHOR: Federico G. De Faveri
 DATE: April 6th, 2021
 PURPOSE: This is the home page of the InArt NFT platform.
*/

//dependencies
import { InjectedConnector } from "@web3-react/injected-connector";

//hooks
import { useEffect } from 'react';
import { useEthers, account } from '@usedapp/core';

//components
import Head from 'next/head'
import Header from '../components/Header/Header';

//assets
import styles from '../styles/Home.module.css'

//variables

export default function Home() {

  const { activate, account } = useEthers();

  //render
  return (
    <div className={styles.container}>
      <Head>
        <title>InArt NFT</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className={styles.main}>
        <p>Hello {account ? account : "user not logged in"}</p>
      </main>
    </div>
  )
}
