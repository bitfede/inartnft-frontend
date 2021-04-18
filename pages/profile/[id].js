/*
 AUTHOR: Federico G. De Faveri
 DATE: April 14th, 2021
 PURPOSE: This is the Profile page of the InArt NFT platform.
*/


//dependencies
import React, {useState} from 'react';
import {Container, Row, Col, Card, Button, Modal} from 'react-bootstrap';
import {Grid, TextField} from '@material-ui/core';
import { MuiPickersUtilsProvider, KeyboardTimePicker, KeyboardDatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

//hooks
import { useEffect } from 'react';
import { useEthers, account } from '@usedapp/core';

// library components
import {Avatar, Accordion, AccordionSummary, Typography, AccordionDetails} from '@material-ui/core';

//assets and icons
import styles from '../../styles/ProfilePage.module.css'
import { useAuth } from '../../hooks/auth';
import httpClient from '../../utilities/http-client';
import Layout from '../../components/Layout';

//variables

// COMPONENT STARTS HERE
function ProfilePage(props) {
    const { authToken } = useAuth();
    console.log("PROPPI", props)

    const { activate, account } = useEthers();

    useEffect( async () => {
        if (!authToken) { return }
        try {
            const profileData = await httpClient.get("/UserInfo/me")
            console.log("DATA", profileData)
        } catch (e) {
            console.log("ERROR", e)
            return console.error("[E]", e)
        }
    }, [authToken]);


    //functions ---

    //render functions

    //render
    return (
        <Layout title="Profilo">
            <div id={styles.profilePageContainer}>
                Blah blah blah
            </div>
        </Layout>
    );
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