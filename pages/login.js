/*
 AUTHOR: Federico G. De Faveri
 DATE: April 13th, 2021
 PURPOSE: This is the login page of the InArt NFT platform.
*/


//dependencies
import {useState} from 'react';
import {Container, Row, Col, Card, Button, Modal, Form} from 'react-bootstrap';
import useSWR from 'swr'


//hooks
import { useEffect } from 'react';
import { useEthers, account } from '@usedapp/core';

// library components
import Head from 'next/head'
// import Link from 'next/link'
import {Avatar, Accordion, AccordionSummary, Typography, AccordionDetails} from '@material-ui/core';

// custom components
import Header from '../components/Header';
import Footer from '../components/Footer';

//assets and icons
import styles from '../styles/Login.module.css'

//variables

// COMPONENT STARTS HERE
function Login(props) {

const { product } = props;

const {account, activate, activateBrowserWallet, deactivate} = useEthers()

console.log("ACCOUNT ", account);

const [profileData, setProfileData] = useState(null);
const [authStatus, setAuthStatus] = useState(null);
const [username, setUsername] = useState(null);
const [userEmail, setUserEmail] = useState(null);


//use effect functions

//functions ---
const logInWithMetamask = async (account) => {

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    // address omar 0x7B2E869Cf25f80764F90835Eb8eA63B7dd925138
    // address mio 
    let raw = JSON.stringify({
        "address": account,
    });

    let requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw
    };

    const resp = await fetch("http://79.143.177.8/api/User/Login", requestOptions)
    
    const loginAnswer = await resp.json();

    if (loginAnswer.errormessage === "CREATE_USER") {
        setAuthStatus("CREATE_USER");
    }

    console.log("answer:", loginAnswer);


}

const logInWithForm = async (account) => {

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    // address omar 0x7B2E869Cf25f80764F90835Eb8eA63B7dd925138
    // address mio 
    let raw = JSON.stringify({
        "address": account,
        "username": username,
        "mail": userEmail
    });

    let requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw
    };

    const resp = await fetch("http://79.143.177.8/api/User/Login", requestOptions)
    
    const secondLoginAnswer = await resp.json();

    // if (loginAnswer.errormessage === "CREATE_USER") {
    //     setAuthStatus("CREATE_USER");
    // }

    console.log("answer2:", secondLoginAnswer);

}

//render functions
const outputLoginSection = () => {
if (!account) {
    return (
        <div className={styles.loginContainer}>
            <Typography variant="h3" >Connect your Metamask Wallet</Typography>
            <Button onClick={() => activateBrowserWallet()} >Connect Metamask</Button>
        </div>
    ) 
} else if (account && !authStatus) {
        return (
            <div className={styles.loginContainer}>
                <Typography variant="h5" >Welcome {account}</Typography>
                <Button onClick={() => logInWithMetamask(account)}>Log In</Button>
            </div>
        )
    } else if (account && authStatus === "CREATE_USER") {
        return (
            <div className={styles.loginContainer}>
                <Typography variant="h5" >Register account with {account}</Typography>
                <Form.Group>
                    <Form.Label>Email address</Form.Label>
                    <Form.Control onChange={(e) => setUserEmail(e.target.value)} type="email" placeholder="name@example.com" />
                    </Form.Group>
                <Form.Group>
                    <Form.Label>Username</Form.Label>
                    <Form.Control onChange={(e) => setUsername(e.target.value)} type="username" placeholder="username" />
                </Form.Group>
                <Button onClick={() => logInWithForm(account)}>Log In</Button>
            </div>
        )
    }
  }

  //render
  return (

    <div>

    <Head>
        <title>InArt NFT</title>
        <link rel="icon" href="/favicon.ico" />
    </Head>

    <Header />

    { outputLoginSection() }

    <Footer />
    
    </div>
  )
}


export async function getStaticProps(context) {

  return {
    props: { login: "yaman" }, // will be passed to the page component as props
  }
}


export default Login;