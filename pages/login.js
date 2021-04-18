/*
 AUTHOR: Federico G. De Faveri
 DATE: April 13th, 2021
 PURPOSE: This is the login page of the InArt NFT platform.
*/


//dependencies
import {useState} from 'react';
import {Container, Row, Col, Card, Button, Modal, Form} from 'react-bootstrap';

//hooks
import React, { useEffect } from 'react';
import { useEthers, account } from '@usedapp/core';
import { useRouter } from 'next/router'

//custom hooks
import usePersonalSign from "../hooks/usePersonalSign";

// library components
import Head from 'next/head'
// import Link from 'next/link'
import {Avatar, Accordion, AccordionSummary, Typography, AccordionDetails} from '@material-ui/core';

// custom components
import Header from '../components/Header';
import Footer from '../components/Footer';

//assets and icons
import styles from '../styles/Login.module.css'
import settings from '../settings';

//variables

// COMPONENT STARTS HERE
function Login(props) {

const { setAuthToken, authToken, userId, setUserId } = props;

const router = useRouter()
const {account, activate, activateBrowserWallet, deactivate} = useEthers()
const sign = usePersonalSign();

console.log("ACCOUNT ", account);
console.log("PROPPI", props)

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

    const resp = await fetch(settings.Endpoints.ApiUrl + "/User/Login", requestOptions)
    
    const loginAnswer = await resp.json();

    console.log("API Answer:", loginAnswer);

    if (loginAnswer.errormessage === "CREATE_USER") {
        setAuthStatus("CREATE_USER");
        return
    }

    if (loginAnswer.nonce) {
        const nonce = loginAnswer.nonce;
        const sig = await sign(nonce);
        console.log("SIGNED:", sig);


        // new web3 call
        let myHeaders2 = new Headers();
        myHeaders2.append("Content-Type", "application/json");

        // address omar 0x7B2E869Cf25f80764F90835Eb8eA63B7dd925138
        // address mio 
        let raw2 = loginAnswer

        raw2.sign = sig;

        raw2 = JSON.stringify(raw2)

        let requestOptions2 = {
            method: 'POST',
            headers: myHeaders2,
            body: raw2
        };

        const resp2 = await fetch(settings.Endpoints.ApiUrl + "/User/Authentication", requestOptions2)
        
        const loginAnswer2 = await resp2.json();

        console.log(2, loginAnswer2)

        const token = loginAnswer2.token.access_token;
        // maybe save it in localstorage of browser to persist?
        const userProfile = loginAnswer2._user
        const profileId = userProfile.id;

        setAuthToken(token)
        setUserId(profileId)

        console.log(typeof window, window)
        if (typeof window !== "undefined") {

            localStorage.setItem("authToken", token)
            localStorage.setItem("userId", profileId )
            
        }

        setTimeout(function(){ router.push(`/profile/${profileId}`) }, 2000);

    }

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

    const resp = await fetch(settings.Endpoints.ApiUrl + "/User/Login", requestOptions)
    
    const secondLoginAnswer = await resp.json();

    console.log("answer2:", secondLoginAnswer);

    if (secondLoginAnswer.nonce) {

        const nonce = secondLoginAnswer.nonce;
        const sig = await sign(nonce);
        console.log("SIGNED:", sig);


        // new web3 call
        let myHeaders2 = new Headers();
        myHeaders2.append("Content-Type", "application/json");

        // address omar 0x7B2E869Cf25f80764F90835Eb8eA63B7dd925138 //debug
        let raw2 = loginAnswer

        raw2.sign = sig;

        raw2 = JSON.stringify(raw2)

        let requestOptions2 = {
            method: 'POST',
            headers: myHeaders2,
            body: raw2
        };

        const resp2 = await fetch(settings.Endpoints.ApiUrl + "/User/Authentication", requestOptions2)
        
        const loginAnswer2 = await resp2.json();

        const token = loginAnswer2.token.access_token;
        // maybe save it in localstorage of browser to persist?
        const userProfile = loginAnswer2._user;
        const profileId = loginAnswer2._user.id;

        setAuthToken(token)
        setUserData(userProfile)

        if (typeof window !== "undefined") {
            localStorage.setItem("authToken", token)
            localStorage.setItem("userId", profileId )
        }
        setTimeout(function(){ router.push(`/profile/${profileId}`) }, 2000);

    }

}

//render functions
const outputLoginSection = () => {

if (authToken) {

    return (
        <div className={styles.loginContainer}>
            <Typography variant="h5" >Redirecting to profile page...</Typography>
        </div>
    )
}

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

    <Header authToken={authToken} />

    { outputLoginSection() }

    <Footer />
    
    </div>
  )
}

export default Login;