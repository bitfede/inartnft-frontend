/*
 AUTHOR: Federico G. De Faveri
 DATE: April 14th, 2021
 PURPOSE: This is the Profile page of the InArt NFT platform.
*/


//dependencies
import {useState} from 'react';
import {Container, Row, Col, Card, Button, Modal} from 'react-bootstrap';
import {Grid, TextField} from '@material-ui/core';
import { MuiPickersUtilsProvider, KeyboardTimePicker, KeyboardDatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

//hooks
import { useEffect } from 'react';
import { useEthers, account } from '@usedapp/core';

// library components
import Head from 'next/head'
import Link from 'next/link'
import {Avatar, Accordion, AccordionSummary, Typography, AccordionDetails} from '@material-ui/core';

// custom components
import Header from '../../components/Header';
import Footer from '../../components/Footer';

//assets and icons
import styles from '../../styles/ProfilePage.module.css'

//variables

// COMPONENT STARTS HERE
function ProfilePage(props) {

    const { authToken, setAuthToken, userId } = props;
    console.log("PROPPI", props)

    const { activate, account } = useEthers();

    useEffect( async () => {

        if (!authToken) { return }
        if (!userId) { return }

        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${authToken}`);

        const requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
        };

        const res = await fetch(`http://79.143.177.8/api/UserInfo/${userId}`, requestOptions)
        
        const profileData = await res.json();


        console.log("RISPOSTA API", res)

        console.log("DATA", profileData)

    });


    //functions ---

    //render functions

    //render
    return (

    <div>

        <Head>
            <title>InArt NFT</title>
            <link rel="icon" href="/favicon.ico" />
        </Head>

        <Header authToken={authToken} setAuthToken={setAuthToken} userId={userId} />

        <div id={styles.profilePageContainer}>
            
            {}

        </div>

        <Footer />

    </div>
  )
}


export async function getStaticProps(context) {

    console.log("CONTEXT", context)

    return {
        props: { loading: true } // will be passed to the page component as props
    }
}

export const getStaticPaths = async (slug) => {

    return {
        paths: [], //indicates that no page needs be created at build time
        fallback: 'blocking' //indicates the type of fallback
    }
}


export default ProfilePage;